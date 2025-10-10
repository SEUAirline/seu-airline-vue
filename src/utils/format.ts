import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

// 格式化日期
export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

// 格式化时间
export function formatTime(time: string | Date, format = 'HH:mm'): string {
  return dayjs(time).format(format)
}

// 格式化日期时间
export function formatDateTime(datetime: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(datetime).format(format)
}

// 格式化金额
export function formatMoney(amount: number): string {
  return `¥${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

// 格式化手机号
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
}

// 格式化身份证号
export function formatIdCard(idCard: string): string {
  if (idCard.length === 18) {
    return idCard.replace(/(\d{6})(\d{8})(\d{4})/, '$1 $2 $3')
  }
  return idCard
}

// 隐藏手机号中间4位
export function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 隐藏身份证号中间部分
export function maskIdCard(idCard: string): string {
  if (idCard.length === 18) {
    return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
  }
  return idCard
}

// 计算相对时间
export function timeAgo(date: string | Date): string {
  const now = dayjs()
  const target = dayjs(date)
  const diff = now.diff(target, 'second')

  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}小时前`
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 86400)}天前`
  } else {
    return formatDate(date)
  }
}

// 获取星期几
export function getWeekday(date: string | Date): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[dayjs(date).day()]
}
