// 验证工具函数

// 验证邮箱
export function validateEmail(email: string): boolean {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email)
}

// 验证手机号
export function validatePhone(phone: string): boolean {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

// 验证身份证号
export function validateIdCard(idCard: string): boolean {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

// 验证密码强度（至少6位，包含字母和数字）
export function validatePassword(password: string): boolean {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  return reg.test(password)
}

// 验证用户名（4-16位字母数字下划线）
export function validateUsername(username: string): boolean {
  const reg = /^[a-zA-Z0-9_]{4,16}$/
  return reg.test(username)
}

// 验证真实姓名（2-20位中文或字母）
export function validateRealName(name: string): boolean {
  const reg = /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/
  return reg.test(name)
}

// 验证航班号
export function validateFlightNo(flightNo: string): boolean {
  const reg = /^[A-Z]{2}\d{4}$/
  return reg.test(flightNo)
}

// 获取密码强度
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 6) {
    return 'weak'
  }
  
  let strength = 0
  
  // 包含小写字母
  if (/[a-z]/.test(password)) strength++
  // 包含大写字母
  if (/[A-Z]/.test(password)) strength++
  // 包含数字
  if (/\d/.test(password)) strength++
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  // 长度大于8
  if (password.length >= 8) strength++
  
  if (strength <= 2) return 'weak'
  if (strength <= 3) return 'medium'
  return 'strong'
}
