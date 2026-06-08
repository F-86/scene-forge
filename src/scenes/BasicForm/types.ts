/** 基础表单场景类型定义 */

/** 角色选项 */
export type UserRole = 'admin' | 'user' | 'guest'

/** 性别选项 */
export type Gender = 'male' | 'female' | ''

/** 表单字段数据结构（同时用于 Mock 预填和表单状态） */
export interface FormValues {
  /** 姓名，最多 20 字 */
  name: string
  /** 邮箱地址 */
  email: string
  /** 角色 */
  role: UserRole | ''
  /** 性别，可为空 */
  gender: Gender
  /** 个人简介，最多 200 字 */
  bio: string
  /** 是否启用 */
  active: boolean
}

/** 表单校验错误，key 与 FormValues 字段对应 */
export type FormErrors = Partial<Record<keyof FormValues, string>>

/** 角色选项配置 */
export interface RoleOption {
  value: UserRole
  label: string
}

/** 可用角色列表 */
export const ROLE_OPTIONS: RoleOption[] = [
  { value: 'admin', label: '管理员' },
  { value: 'user',  label: '普通用户' },
  { value: 'guest', label: '访客' },
]

/** 性别选项配置 */
export interface GenderOption {
  value: Gender
  label: string
}

/** 可用性别列表 */
export const GENDER_OPTIONS: GenderOption[] = [
  { value: 'male',   label: '男' },
  { value: 'female', label: '女' },
  { value: '',       label: '不填' },
]

/** bio 最大字数 */
export const BIO_MAX_LENGTH = 200

/** 姓名最大字数 */
export const NAME_MAX_LENGTH = 20
