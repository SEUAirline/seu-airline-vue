# SEUAirline 互联网全栈项目  
“面向开发”的级联功能需求规格说明书  
（Cascade-FS，向下到 API/组件/消息级别，可直接进 Jira 做 Story）

## 说明  
- 采用“模块 → 功能点 → 开发级需求编号”三级编码，例：  
  SEC-API-01 = 抢购模块(Seckill)-后端接口第 01 条。  
- 每条需求同时给出：接口签名、关键字段、验收自动化用例、依赖中间件。  
- 所有需求默认具备“幂等、日志、监控、单元测试覆盖率≥80%”。

## 抢购子系统（Seckill）  
### SEC-API-01 库存查询  
GET /api/seckill/stock/{flightId}/{depDate}  
Resp: {“total”:128,“available”:45,“version”:347}  
验收：wrk -t10 -c100 压测 99-th < 20 ms；Redis key 命中≥99%。  

### SEC-API-02 获取排队号（令牌）  
POST /api/seckill/token  
Body: {flightId, depDate, userId(脱敏)}  
返回：{token:“ST-xxx”, waitNo:1837, estWaitSec:12}  
逻辑：  
1. 网关层 Lua 脚本先消耗令牌桶（Redisson TRY_SET 1ms）。  
2. 成功则写 Kafka topic=seckill.enter, partition=flightId.hash%32。  
验收：Mock 5 w qps，令牌错误率 < 0.1%。  

### SEC-API-03 下单（排队消费）  
消费组：seckill-order-consumer  
消息格式：Avro schema SeckillOrder.avsc  
字段：token, flightId, depDate, userId, passengerList[], createTime  
消费逻辑：  
a. 本地缓存库存版本号对比，乐观锁 Lua：  
   local v=redis.call(“GET”,KEYS[1]) if v==ARGV[1] then …  
b. 写订单表（MySQL）状态=LOCKED；成功则 Redis DECR；失败写回 Kafka retry topic，最多 3 次。  
验收：  
- Gatling 脚本：1 w 并发，超卖=0；  
- retry 队列最终为空。  

### SEC-API-04 结果轮询  
GET /api/seckill/result/{token}  
缓存：Redis key ttl=60s，value={orderNo, status(SUCCESS/FAIL/WAITING)}  
前端策略：长轮询 5 s 超时，指数退避最多 6 次。  

### SEC-JOB-01 对账任务  
每 30 min 跑批：  
SELECT SUM(seat) FROM orders WHERE status=‘PAID’  
vs  
Redis GET seckill:sold:{flightId}:{depDate}  
差异 >0 触发告警并自动补偿流水。  

## 爬虫与准实时数据中心  
### CRAWL-API-01 手动触发爬取  
POST /internal/crawl/once  
Body: {source:“CA”, flightId:“CA1234”, days:7}  
返回：{taskId:“CR-xxx”}  

### CRAWL-TASK-01 Scrapy 调度  
- 代理池：Scrapy-Redis + 代理中间件，15 s 随机换 IP；  
- 速率：默认 1 req/s，robots.txt 解析若 Crawl-delay=5 则自适应；  
- 解析：XPaths 统一写在 yaml，方便非研发修改；  
- 数据管道：Kafka topic=crawl.raw，key=flightId。  

### CRAWL-STREAM-01 Flink 清洗  
Job name: FlightPriceClean  
算子：  
1. 解析 & 单位统一（CNY）；  
2. 异常价格检测：Z-score>3 判异常，写侧输出流；  
3. 双流 JOIN：crawl.raw × 官方 API，补齐机型、经停。  
输出：Kafka topic=flight.price.clean  

### CRAWL-API-02 价格历史读接口  
GET /api/price/hist?flightId=xx&start=2025-10-01&end=2025-10-07  
返回：Array<{cabin,price,ts}>  
缓存：Redis TS.ADD 使用 RedisTimeSeries，ttl=7 天，降采样 1 h。  

## 智能推送子系统（Push-AI）  
### PUSH-API-01 事件接收  
POST /internal/event  
Body (CloudEvents 1.0):  
{“specversion”:“1.0”,“type”:“search.not.order”,“source”:“web”,“userId”:“u_abc”,“data”:{“flightId”:“CA1234”,“price”:880}}  

### PUSH-TASK-01 特征拼接（Flink）  
- 读 event 流 → 关联 Redis 用户画像（性别、年龄、历史消费）→ 写 feature.vector topic。  

### PUSH-TASK-02 预测服务（TF-Serving）  
Model: saved_model_xgboost_v3  
Signature: sigmoid(score)=P(order|context)  
SLA: 99-th < 60 ms, QPS 2 k  

### PUSH-API-02 推荐列表  
GET /api/recommend?userId=xx&scene=search_not_order  
返回：Array<{itemId,itemType,score,reason}>  
业务规则：  
- 过滤用户已购；  
- 多样性：Top10 至少 3 个不同类目（保险/休息室/行李）。  

### PUSH-API-03 消息发送  
POST /api/push/send  
Body: {userId,title,body,deeplink,campaignId}  
通道策略：  
1. 若 app 安装且 pushToken 有效 → 走厂商通道；  
2. 否则 fallback 短信；  
3. 限流：同一 campaign 24 h 内最多 1 条。  

### PUSH-DB-01 用户隐私开关表  
push_privacy(userId, switch_off, updateTime)  
代码强制 WHERE switch_off=0 才能插入 push_task。  

## 前端引导 & 流程（Web-React）  
### WEB-COMP-01 引导遮罩 <OnBoardingSteps>  
Props: {steps:[{target:#searchBtn,content,placement}]}  
实现：  
- 使用 react-joyride，首次 localStorage.getItem(“onboard_done”)≠’1’ 自动弹出；  
- 每步埋点：window.gtag(‘event’,‘onboard_step_N’)  

### WEB-COMP-02 搜索未完成挽留  
Hooks: useBeforeUnload + Visibility API  
当用户已输航线但未下单，tab 即将关闭时弹出 SweetAlert 二次确认，并同时发 /internal/event (type=search.abandon)。  

### WEB-COMP-03 订单进度条 <OrderProgress>  
状态机：search → select → fill → pay → success  
前端维护 useReducer，后端同步 SSE event-stream；  
断网重连：event-source 自动重连，带 Last-Event-ID。  

### WEB-API-01 航班列表接口（分页+缓存）  
GET /api/flight/list  
请求：{from,to,depDate,cabin,page,size=20}  
缓存：CDN 1 min，etag=hash(body)  

## 移动端 PWA（P3，但关键需求已列）  
### PWA-COMP-01 Web App Manifest  
{“name”:“SEUAir”,“start_url”:“/”,“display”:“standalone”,“background_color”:“#fff”}  

### PWA-COMP-02 Service Worker  
- 预缓存：shell（app.js、vendor.js、css）  
- 运行时缓存：航班图片 logo、价格接口 staleWhileRevalidate=30 s  
- 推送监听：self.addEventListener(‘push’) → 显示 notification → 点击打开 deeplink  

### PWA-COMP-03 调用原生相机扫码  
实现：  
<input type=“file” accept=“image/*” capture=“environment”>  
解析二维码库：jsQR，成功跳转 /checkin/{code}  

## 共用组件与工具级需求  
### LOG-KAFKA-01 统一日志  
格式：{“@timestamp”,“level”,“traceId”,“userId”,“msg”}  
TraceId 由网关生成，传递给 HTTP header X-Trace-Id；  
Flink 实时清洗写 Elasticsearch，保留 7 天。  

### MON-API-01 SLO 暴露  
GET /metrics  
返回 Prometheus 格式：  
seckill_success_rate 0.997  
push_send_rate 0.98  

## 验收自动化清单（可直接转 CI）  
- pytest cases:  
  test_sec_api_01_stock.py  
  test_sec_api_02_token.py::test_5w_qps  
- Gatling simulation: SeckillSimulation.scala (target 5 w rps)  
- Flink unit:  
  FlightPriceCleanTest → assert cleaned.price>0 && outlier.sideOutput.size=1  
- 合规扫描：  
  truffleHog scan –regex –since_commit main  

## 数据库变更清单（Flyway 版本）  
V2025.10.1__seckill.sql  
CREATE TABLE seckill_stock (  
  flight_id VARCHAR(32) NOT NULL,  
  dep_date DATE NOT NULL,  
  total INT,  
  sold INT,  
  version BIGINT,  
  PRIMARY KEY (flight_id, dep_date)  
);  

V2025.10.2__push.sql  
CREATE TABLE push_task (  
  id BIGINT AUTO_INCREMENT,  
  user_id VARCHAR(64) NOT NULL,  
  scene VARCHAR(32),  
  title VARCHAR(64),  
  body VARCHAR(256),  
  status ENUM(‘CREATED’,‘SENT’,‘FAILED’),  
  send_time DATETIME,  
  INDEX idx_user_status (user_id, status)  
);  
