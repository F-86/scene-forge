/** 基础表单场景 Mock 数据 */
import type { FormValues } from './types'

/** 空状态：所有字段为空（新建状态） */
const mockEmpty: FormValues = {
  name:   '',
  email:  '',
  role:   '',
  gender: '',
  bio:    '',
  active: true,
}

/** 仅填写必填字段 */
const mockSingle: FormValues = {
  name:   '王伟',
  email:  'wangwei@example.com',
  role:   'user',
  gender: '',
  bio:    '',
  active: true,
}

/** 所有字段均有值（编辑状态） */
const mockNormal: FormValues = {
  name:   '张明',
  email:  'zhangming@example.com',
  role:   'admin',
  gender: 'male',
  bio:    '负责前端架构设计与核心模块开发，有五年以上 React 项目经验。',
  active: true,
}

/** bio 为超长文本，验证文本域撑高 */
const mockLarge: FormValues = {
  name:   '李芳',
  email:  'lifang@example.com',
  role:   'user',
  gender: 'female',
  bio:    '这是一段很长的个人简介，用于测试文本域在大量文字时的高度表现。'
    + '本人专注于产品设计与用户体验，深耕交互设计领域多年，'
    + '擅长从用户视角出发挖掘核心需求，并将其转化为简洁易用的界面方案。'
    + '曾主导多个 B 端和 C 端产品从 0 到 1 的设计落地，'
    + '与研发团队保持高效协作，能够快速响应业务变化并输出高质量设计稿。',
  active: false,
}

/** 边界值：超长姓名、邮箱格式错误、bio 恰好 200 字 */
const mockWithEdge: FormValues = {
  name:   '这是一个超过二十个字的用户名用于测试输入框超长情况',
  email:  'not-a-valid-email',
  role:   'guest',
  gender: 'female',
  bio:    '恰好两百字的简介：ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    + 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQR'
    + 'STUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789'
    + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789012345',
  active: true,
}

/** 基础表单场景 Mock 变体 */
export const mockScenes: Record<string, FormValues> = {
  /** 空状态（新建） */
  empty: mockEmpty,
  /** 仅填写必填字段 */
  single: mockSingle,
  /** 所有字段有值（编辑） */
  normal: mockNormal,
  /** bio 超长文本 */
  large: mockLarge,
  /** 边界值 */
  withEdge: mockWithEdge,
}
