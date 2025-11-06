import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/test',
    method: 'get',
    response: () => {
      console.log('Mock test API 被调用')
      return {
        code: 200,
        message: 'Mock is working!',
        data: { test: true },
        success: true
      }
    }
  }
] as MockMethod[]
