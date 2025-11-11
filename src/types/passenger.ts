// 常用乘客相关类型定义

/**
 * 证件类型
 */
export type IdType = 'ID_CARD' | 'PASSPORT' | 'OTHER'

/**
 * 乘客类型
 */
export type PassengerType = 'ADULT' | 'CHILD' | 'INFANT'

/**
 * 常用乘客信息
 */
export interface FrequentPassenger {
  id: number
  passengerName: string
  idCard: string
  phone: string
  passengerType: PassengerType
  isDefault: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * 创建常用乘客请求
 */
export interface FrequentPassengerCreateRequest {
  passengerName: string
  idCard: string
  phone: string
  passengerType: PassengerType
  isDefault?: boolean
}

/**
 * 更新常用乘客请求
 */
export interface FrequentPassengerUpdateRequest {
  passengerName?: string
  idCard?: string
  phone?: string
  passengerType?: PassengerType
}

/**
 * 前端显示用的乘客信息（兼容旧版）
 * 注意：为了兼容现有的 PassengersPage.vue，保留旧的字段名
 */
export interface PassengerDisplay {
  id: number
  name: string           // 映射自 passengerName
  idType: 'ID_CARD' | 'PASSPORT' | 'OTHER'  // 前端额外字段
  idNumber: string       // 映射自 idCard
  phone: string
  email?: string         // 前端额外字段（可选）
  passengerType: 'adult' | 'child' | 'infant'  // 小写格式
  isDefault: boolean
}

/**
 * 转换后端数据到前端显示格式
 */
export function toPassengerDisplay(passenger: FrequentPassenger): PassengerDisplay {
  return {
    id: passenger.id,
    name: passenger.passengerName,
    idType: 'ID_CARD', // 默认为身份证（后端暂无此字段）
    idNumber: passenger.idCard,
    phone: passenger.phone,
    passengerType: passenger.passengerType.toLowerCase() as 'adult' | 'child' | 'infant',
    isDefault: passenger.isDefault
  }
}

/**
 * 转换前端表单数据到后端请求格式
 */
export function toBackendRequest(displayData: Partial<PassengerDisplay>): FrequentPassengerCreateRequest | FrequentPassengerUpdateRequest {
  return {
    passengerName: displayData.name,
    idCard: displayData.idNumber,
    phone: displayData.phone,
    passengerType: displayData.passengerType?.toUpperCase() as PassengerType,
    isDefault: displayData.isDefault
  }
}
