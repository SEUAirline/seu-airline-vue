<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="container mx-auto px-4 py-6">
      <!-- 页面标题和搜索 -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-8 mb-6 text-white">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-3xl font-bold mb-2">
            <i class="fas fa-question-circle mr-3"></i>帮助中心
          </h1>
          <p class="text-blue-100 mb-6">我们随时为您提供帮助</p>
          
          <!-- 搜索框 -->
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              class="w-full px-6 py-4 pr-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              placeholder="搜索问题、政策或服务..."
              @keyup.enter="handleSearch"
            />
            <button
              @click="handleSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 快捷分类 -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div
          v-for="category in categories"
          :key="category.id"
          @click="handleCategoryClick(category.id)"
          :class="[
            'bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1',
            currentCategory === category.id ? 'ring-2 ring-blue-600' : ''
          ]"
        >
          <div :class="['w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto', category.bgColor]">
            <i :class="['text-2xl', category.icon, category.iconColor]"></i>
          </div>
          <h3 class="text-center font-medium text-gray-900 text-sm">{{ category.label }}</h3>
          <p class="text-center text-xs text-gray-500 mt-1">{{ category.count }}个问题</p>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 侧边栏导航 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-4 sticky top-20">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-list mr-2 text-blue-600"></i>服务导航
            </h2>
            <nav class="space-y-1">
              <a
                v-for="nav in navigation"
                :key="nav.id"
                @click.prevent="scrollToSection(nav.id)"
                :class="[
                  'flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer',
                  activeSection === nav.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                ]"
              >
                <i :class="['w-5 mr-3', nav.icon]"></i>
                <span>{{ nav.label }}</span>
              </a>
            </nav>
          </div>
        </div>

        <!-- 主内容区 -->
        <div class="lg:col-span-3 space-y-6">
          <!-- 常见问题 -->
          <section id="faq" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
              <i class="fas fa-question-circle mr-2 text-blue-600"></i>常见问题解答
            </h2>
            <div class="space-y-3">
              <div
                v-for="(faq, index) in filteredFAQs"
                :key="index"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  @click="toggleFAQ(index)"
                  class="w-full flex items-center justify-between p-4 text-left hover:bg-blue-50 transition-colors"
                >
                  <span class="font-medium text-gray-900">{{ faq.question }}</span>
                  <i
                    :class="[
                      'fas transition-transform',
                      expandedFAQs.includes(index) ? 'fa-chevron-up' : 'fa-chevron-down'
                    ]"
                  ></i>
                </button>
                <Transition name="accordion">
                  <div v-if="expandedFAQs.includes(index)" class="px-4 pb-4 text-gray-700 bg-blue-50">
                    {{ faq.answer }}
                  </div>
                </Transition>
              </div>
            </div>
            
            <!-- 空状态 -->
            <div v-if="filteredFAQs.length === 0" class="text-center py-12">
              <i class="fas fa-search text-gray-300 text-5xl mb-4"></i>
              <p class="text-gray-500">没有找到相关问题</p>
            </div>
          </section>

          <!-- 政策条款 -->
          <section id="policies" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
              <i class="fas fa-file-alt mr-2 text-blue-600"></i>政策条款
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 class="font-bold text-xl text-blue-600 mb-3">
                  <i class="fas fa-undo mr-2"></i>退票政策
                </h3>
                <p class="text-gray-700 mb-3">根据不同舱位和票价类型,退票手续费和规定有所不同:</p>
                <ul class="list-disc pl-5 text-gray-600 space-y-2">
                  <li>全价票:起飞前24小时以上退票,收取票面价格5%的手续费;24小时内收取10%手续费。</li>
                  <li>特价票:起飞前7天以上退票,收取票面价格20%的手续费;7天内收取30%手续费。</li>
                  <li>超低价票:不可退票。</li>
                </ul>
              </div>
              <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 class="font-bold text-xl text-blue-600 mb-3">
                  <i class="fas fa-exchange-alt mr-2"></i>改签政策
                </h3>
                <p class="text-gray-700 mb-3">改签规定如下:</p>
                <ul class="list-disc pl-5 text-gray-600 space-y-2">
                  <li>全价票:起飞前可免费改签同等舱位航班一次,之后每次收取100元改签费。</li>
                  <li>特价票:每次改签收取200元改签费,且只能改签同等或更高舱位。</li>
                  <li>超低价票:不可改签。</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- 行李规定 -->
          <section id="baggage" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
              <i class="fas fa-suitcase-rolling mr-2 text-blue-600"></i>行李规定
            </h2>
            <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 class="font-bold text-xl text-blue-600 mb-3">免费行李额</h3>
                <ul class="list-disc pl-5 text-gray-600 space-y-2">
                  <li>头等舱:40kg</li>
                  <li>商务舱:30kg</li>
                  <li>经济舱:20kg</li>
                  <li>超值经济舱:15kg</li>
                </ul>
              </div>
              <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 class="font-bold text-xl text-blue-600 mb-3">随身行李</h3>
                <ul class="list-disc pl-5 text-gray-600 space-y-2">
                  <li>头等舱/商务舱:2件,每件不超过10kg,总尺寸不超过115cm</li>
                  <li>经济舱:1件,不超过5kg,总尺寸不超过105cm</li>
                </ul>
              </div>
              <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 class="font-bold text-xl text-blue-600 mb-3">超重行李</h3>
                <p class="text-gray-700 mb-3">超出免费行李额的部分,按以下标准收费:</p>
                <ul class="list-disc pl-5 text-gray-600 space-y-2">
                  <li>国内航线:每公斤30元</li>
                  <li>国际航线:每公斤50元或等值外币</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- 联系我们 -->
          <section id="contact" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
              <i class="fas fa-headset mr-2 text-blue-600"></i>联系我们
            </h2>
            <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
              <div class="bg-gray-100 p-5 rounded-lg border-l-4 border-blue-500">
                <h3 class="font-bold text-lg mb-3 text-blue-700">客服热线</h3>
                <div class="flex items-center mb-2 text-gray-700">
                  <i class="fas fa-phone-alt mr-3 text-blue-500"></i>
                  <span class="text-sm">国内:400-123-4567</span>
                </div>
                <div class="flex items-center text-gray-700">
                  <i class="fas fa-globe-asia mr-3 text-blue-500"></i>
                  <span class="text-sm">国际:+86-25-12345678</span>
                </div>
              </div>

              <div class="bg-gray-100 p-5 rounded-lg border-l-4 border-blue-500">
                <h3 class="font-bold text-lg mb-3 text-blue-700">电子邮件</h3>
                <div class="flex items-center text-gray-700">
                  <i class="fas fa-envelope mr-3 text-blue-500"></i>
                  <span class="text-sm break-all">service@seuairline.com</span>
                </div>
              </div>

              <div class="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-700">
                <h3 class="font-bold text-lg mb-3 text-blue-700">24/7 AI智能助手</h3>
                <p class="mb-4 text-sm text-gray-600">即时解答,无需等待</p>
                <button
                  @click="showAIChat = true"
                  class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-full transition-all transform hover:scale-105"
                >
                  <i class="fas fa-robot mr-2"></i>立即咨询
                </button>
              </div>

              <div class="bg-gray-100 p-5 rounded-lg border-l-4 border-gray-500">
                <h3 class="font-bold text-lg mb-3 text-blue-700">提交工单</h3>
                <p class="mb-4 text-sm text-gray-600">复杂问题,24小时内回复</p>
                <button
                  @click="handleSubmitTicket"
                  class="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-full transition-all"
                >
                  <i class="fas fa-ticket-alt mr-2"></i>提交工单
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- AI客服弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAIChat"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          @click.self="showAIChat = false"
        >
          <div
            class="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col mx-4"
            @click.stop
          >
            <!-- 聊天头部 -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div class="flex items-center">
                <i class="fas fa-robot text-2xl mr-3"></i>
                <div>
                  <h3 class="font-bold">AI智能助手</h3>
                  <p class="text-xs text-blue-100">在线为您服务</p>
                </div>
              </div>
              <button
                @click="showAIChat = false"
                class="text-white hover:text-blue-200 transition-colors"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <!-- 聊天消息区 -->
            <div ref="chatMessagesRef" class="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              <div
                v-for="(message, index) in chatMessages"
                :key="index"
                :class="[
                  'flex',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                ]"
              >
                <div
                  :class="[
                    'max-w-[75%] px-4 py-2 rounded-lg',
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 rounded-bl-none shadow'
                  ]"
                >
                  {{ message.text }}
                </div>
              </div>
              
              <!-- AI思考中 -->
              <div v-if="aiThinking" class="flex justify-start">
                <div class="bg-white px-4 py-2 rounded-lg rounded-bl-none shadow flex items-center space-x-1">
                  <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>

            <!-- 输入区 -->
            <div class="p-4 border-t border-gray-200 bg-white rounded-b-lg">
              <div class="flex space-x-2">
                <input
                  v-model="chatInput"
                  type="text"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入您的问题..."
                  @keyup.enter="sendChatMessage"
                />
                <button
                  @click="sendChatMessage"
                  :disabled="!chatInput.trim() || aiThinking"
                  class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')
const currentCategory = ref('all')
const activeSection = ref('faq')

// AI聊天
const showAIChat = ref(false)
const chatMessages = ref<Array<{ sender: string; text: string }>>([
  { sender: 'ai', text: '您好!我是SEU航空的AI智能助手。请问有什么可以帮助您的?您可以咨询航班状态、退改签政策、行李规定等问题。' }
])
const chatInput = ref('')
const aiThinking = ref(false)
const chatMessagesRef = ref<HTMLElement | null>(null)

// 分类
const categories = [
  { id: 'all', label: '全部', icon: 'fas fa-th-large', iconColor: 'text-blue-600', bgColor: 'bg-blue-100', count: 12 },
  { id: 'booking', label: '预订相关', icon: 'fas fa-ticket-alt', iconColor: 'text-green-600', bgColor: 'bg-green-100', count: 4 },
  { id: 'refund', label: '退改签', icon: 'fas fa-undo', iconColor: 'text-orange-600', bgColor: 'bg-orange-100', count: 3 },
  { id: 'baggage', label: '行李规定', icon: 'fas fa-suitcase', iconColor: 'text-purple-600', bgColor: 'bg-purple-100', count: 3 },
  { id: 'account', label: '账号相关', icon: 'fas fa-user-circle', iconColor: 'text-pink-600', bgColor: 'bg-pink-100', count: 2 }
]

// 导航
const navigation = [
  { id: 'faq', label: '常见问题', icon: 'fas fa-question-circle' },
  { id: 'policies', label: '政策条款', icon: 'fas fa-file-alt' },
  { id: 'baggage', label: '行李规定', icon: 'fas fa-suitcase-rolling' },
  { id: 'contact', label: '联系我们', icon: 'fas fa-headset' }
]

// FAQ数据
const faqs = [
  { category: 'booking', question: '如何查询航班状态?', answer: '您可以在首页的"航班动态"栏目输入航班号或出发/到达城市进行查询,或登录后在"我的订单"中查看已预订航班的状态。' },
  { category: 'booking', question: '如何添加随行乘客?', answer: '在预订航班过程中,您可以点击"添加乘客"按钮添加同行人信息。您也可以提前在"个人中心"的"常用乘客"中添加经常随行的乘客信息。' },
  { category: 'booking', question: '如何使用电子登机牌?', answer: '办理值机后,您可以在"我的订单"中查看并保存电子登机牌。您可以将其保存到手机钱包或截图保存,在安检和登机时出示。' },
  { category: 'booking', question: '预订后可以修改乘客信息吗?', answer: '订单提交后,乘客姓名和身份证号不可修改。如需修改,请取消订单后重新预订。联系方式可以在订单详情中修改。' },
  { category: 'refund', question: '如何办理退票或改签?', answer: '登录账户后,进入"我的订单"页面,选择需要操作的航班,点击"退票"或"改签"按钮,按照提示完成操作。不同舱位和票价有不同的退改签政策。' },
  { category: 'refund', question: '退票多久能收到退款?', answer: '退票申请审核通过后,退款将在3-7个工作日内原路退回到您的支付账户。具体到账时间取决于您的支付方式和银行处理速度。' },
  { category: 'refund', question: '改签需要补差价吗?', answer: '如果改签后的航班价格高于原航班,需要补齐差价。如果价格低于原航班,差价不予退还。改签费用根据舱位和票价类型而定。' },
  { category: 'baggage', question: '托运行李有什么限制?', answer: '托运行李的重量和尺寸限制根据舱位不同而有所差异。单件行李重量不得超过32kg,三边之和不得超过158cm。禁止托运易燃易爆等危险品。' },
  { category: 'baggage', question: '可以携带液体上飞机吗?', answer: '随身携带的液体容器容积不得超过100ml,所有液体容器需放入容积不超过1升的透明塑料袋中,每人限带一个塑料袋。' },
  { category: 'baggage', question: '超重行李如何收费?', answer: '超出免费行李额的部分,国内航线按每公斤30元收费,国际航线按每公斤50元或等值外币收费。建议提前在线购买超重行李额,价格更优惠。' },
  { category: 'account', question: '如何修改账号密码?', answer: '登录后进入"账号设置"页面,点击"修改密码",输入原密码和新密码即可完成修改。建议定期更换密码以保障账户安全。' },
  { category: 'account', question: '忘记密码怎么办?', answer: '在登录页面点击"忘记密码",输入注册时的手机号或邮箱,通过验证码验证后即可重置密码。' }
]

// 展开的FAQ索引
const expandedFAQs = ref<number[]>([])

// 过滤后的FAQ
const filteredFAQs = computed(() => {
  let result = faqs

  // 按分类筛选
  if (currentCategory.value !== 'all') {
    result = result.filter(faq => faq.category === currentCategory.value)
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(faq => {
      return (
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword)
      )
    })
  }

  return result
})

// 切换FAQ展开状态
function toggleFAQ(index: number) {
  const idx = expandedFAQs.value.indexOf(index)
  if (idx > -1) {
    expandedFAQs.value.splice(idx, 1)
  } else {
    expandedFAQs.value.push(index)
  }
}

// 处理搜索
function handleSearch() {
  if (searchKeyword.value.trim()) {
    currentCategory.value = 'all'
    scrollToSection('faq')
  }
}

// 处理分类点击
function handleCategoryClick(categoryId: string) {
  currentCategory.value = categoryId
  searchKeyword.value = ''
  scrollToSection('faq')
}

// 滚动到指定区域
function scrollToSection(sectionId: string) {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 发送聊天消息
async function sendChatMessage() {
  if (!chatInput.value.trim() || aiThinking.value) return

  const userMessage = chatInput.value.trim()
  chatMessages.value.push({ sender: 'user', text: userMessage })
  chatInput.value = ''

  // 滚动到底部
  await nextTick()
  scrollChatToBottom()

  // AI思考
  aiThinking.value = true
  
  // 模拟AI回复
  setTimeout(async () => {
    const aiResponse = getAIResponse(userMessage)
    chatMessages.value.push({ sender: 'ai', text: aiResponse })
    aiThinking.value = false
    
    await nextTick()
    scrollChatToBottom()
  }, 1000)
}

// 获取AI回复
function getAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()
  
  // 关键词匹配
  if (lowerMessage.includes('航班') || lowerMessage.includes('查询') || lowerMessage.includes('状态')) {
    return '查询航班状态,请前往首页"航班动态"输入航班号或城市。如果您已登录,可在"我的订单"中查看最新状态。'
  }
  if (lowerMessage.includes('退票') || lowerMessage.includes('退款')) {
    return '退票政策取决于您的舱位和票价类型:全价票收取5%或10%手续费;特价票收取20%或30%;超低价票不可退。退款将在3-7个工作日内原路退回。'
  }
  if (lowerMessage.includes('改签') || lowerMessage.includes('更改')) {
    return '改签政策:全价票首次免费改签;特价票每次收取200元改签费;超低价票不可改签。如需改签,请在"我的订单"中操作。'
  }
  if (lowerMessage.includes('行李') || lowerMessage.includes('托运') || lowerMessage.includes('超重')) {
    return '免费托运行李额:头等舱40kg,商务舱30kg,经济舱20kg。随身行李尺寸和重量也有不同限制。超重部分国内航线按每公斤30元收费。'
  }
  if (lowerMessage.includes('联系') || lowerMessage.includes('电话') || lowerMessage.includes('客服')) {
    return '我们的客服热线是400-123-4567(7×24小时),国际电话是+86-25-12345678,电子邮件是service@seuairline.com。'
  }
  if (lowerMessage.includes('密码') || lowerMessage.includes('账号') || lowerMessage.includes('登录')) {
    return '您可以在"账号设置"中修改密码。如果忘记密码,请在登录页面点击"忘记密码",通过手机号或邮箱验证后重置。'
  }
  
  return '抱歉,我无法理解您的问题。您可以尝试询问关于航班状态、退改签政策、行李规定等问题,或者联系我们的人工客服获取更多帮助。'
}

// 滚动聊天到底部
function scrollChatToBottom() {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// 提交工单
function handleSubmitTicket() {
  router.push('/user/messages')
}
</script>

<style scoped>
/* 手风琴动画 */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
