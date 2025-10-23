import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// 模拟用户数据库
const users = [
  {
    id: 1,
    username: 'user001',
    password: '123456',
    email: 'user001@example.com',
    phone: '13800138000',
    realName: '张三',
    idCard: '110101199001011234',
    avatar: '',
    memberLevel: 2,
    points: 1500,
    status: 1
  }
]

// 模拟 Token
let currentToken = ''

export default [
  // 用户注册
  {
    url: '/mock/api/auth/register',
    method: 'post',
    response: (request: any) => {
      const { username, password, email, phone } = request.body

      // 检查用户是否已存在
      const existUser = users.find(u => u.username === username || u.email === email)
      if (existUser) {
        return {
          code: 400,
          message: '用户名或邮箱已存在',
          data: null,
          success: false
        }
      }

      // 创建新用户
      const newUser = {
        id: users.length + 1,
        username,
        password,
        email,
        phone,
        realName: '',
        idCard: '',
        avatar: '',
        memberLevel: 1,
        points: 0,
        status: 1
      }
      users.push(newUser)

      return {
        code: 200,
        message: '注册成功',
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        },
        success: true
      }
    }
  },

  // 用户登录
  {
    url: '/mock/api/auth/login',
    method: 'post',
    response: (request: any) => {
      const { username, password } = request.body

      const user = users.find(u => u.username === username && u.password === password)

      if (!user) {
        return {
          code: 401,
          message: '用户名或密码错误',
          data: null,
          success: false
        }
      }

      // 生成 Token
      currentToken = Mock.Random.guid()

      return {
        code: 200,
        message: '登录成功',
        data: {
          token: currentToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            realName: user.realName,
            avatar: user.avatar,
            memberLevel: user.memberLevel,
            points: user.points
          }
        },
        success: true
      }
    }
  },

  // 获取用户信息
  {
    url: '/mock/api/user/profile',
    method: 'get',
    response: (request: any) => {
      const token = request.headers.authorization

      if (!token || token !== `Bearer ${currentToken}`) {
        return {
          code: 401,
          message: '未授权',
          data: null,
          success: false
        }
      }

      const user = users[0] // 简化处理，返回第一个用户

      return {
        code: 200,
        message: '查询成功',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          realName: user.realName,
          idCard: user.idCard,
          avatar: user.avatar,
          memberLevel: user.memberLevel,
          points: user.points
        },
        success: true
      }
    }
  },

  // 更新用户信息
  {
    url: '/mock/api/user/profile',
    method: 'put',
    response: (request: any) => {
      const token = request.headers.authorization

      if (!token || token !== `Bearer ${currentToken}`) {
        return {
          code: 401,
          message: '未授权',
          data: null,
          success: false
        }
      }

      const { email, phone, realName } = request.body
      const user = users[0]

      if (email) user.email = email
      if (phone) user.phone = phone
      if (realName) user.realName = realName

      return {
        code: 200,
        message: '更新成功',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          realName: user.realName
        },
        success: true
      }
    }
  },

  // 修改密码
  {
    url: '/mock/api/user/password',
    method: 'put',
    response: (request: any) => {
      const token = request.headers.authorization

      if (!token || token !== `Bearer ${currentToken}`) {
        return {
          code: 401,
          message: '未授权',
          data: null,
          success: false
        }
      }

      const { oldPassword, newPassword } = request.body
      const user = users[0]

      if (user.password !== oldPassword) {
        return {
          code: 400,
          message: '原密码错误',
          data: null,
          success: false
        }
      }

      user.password = newPassword

      return {
        code: 200,
        message: '密码修改成功',
        data: null,
        success: true
      }
    }
  }
] as MockMethod[]
