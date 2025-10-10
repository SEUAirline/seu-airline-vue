// LocalStorage封装

export const storage = {
  // 设置
  set(key: string, value: any): void {
    try {
      const data = JSON.stringify(value)
      localStorage.setItem(key, data)
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },

  // 获取
  get<T = any>(key: string): T | null {
    try {
      const data = localStorage.getItem(key)
      if (data) {
        return JSON.parse(data) as T
      }
      return null
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  },

  // 删除
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  },

  // 清空
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  },

  // 检查是否存在
  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  }
}

// SessionStorage封装
export const sessionStorage = {
  set(key: string, value: any): void {
    try {
      const data = JSON.stringify(value)
      window.sessionStorage.setItem(key, data)
    } catch (error) {
      console.error('SessionStorage set error:', error)
    }
  },

  get<T = any>(key: string): T | null {
    try {
      const data = window.sessionStorage.getItem(key)
      if (data) {
        return JSON.parse(data) as T
      }
      return null
    } catch (error) {
      console.error('SessionStorage get error:', error)
      return null
    }
  },

  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error('SessionStorage remove error:', error)
    }
  },

  clear(): void {
    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('SessionStorage clear error:', error)
    }
  },

  has(key: string): boolean {
    return window.sessionStorage.getItem(key) !== null
  }
}
