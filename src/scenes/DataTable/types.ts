/** 数据表格场景类型定义 */

/** 账号状态 */
export type RowStatus = 'active' | 'inactive' | 'pending'

/** 单行表格数据 */
export interface TableRow {
  /** 唯一 ID */
  id: string
  /** 姓名 */
  name: string
  /** 邮箱，可为空 */
  email?: string
  /** 角色 */
  role: string
  /** 账号状态 */
  status: RowStatus
  /** 金额（分），展示时除以 100 并格式化 */
  amount: number
  /** 注册日期，格式 YYYY-MM-DD */
  createdAt: string
}

/** 可排序的列 key */
export type SortKey = 'name' | 'status' | 'amount' | 'createdAt'

/** 排序方向：asc 升序 / desc 降序 / null 无排序 */
export type SortDirection = 'asc' | 'desc' | null

/** 当前排序状态 */
export interface SortState {
  key: SortKey | null
  direction: SortDirection
}

/** 状态标签配置 */
export interface StatusConfig {
  /** 展示文案 */
  label: string
  /** 主色（文字 + 背景半透明） */
  color: string
}

/** 各状态对应的展示配置 */
export const STATUS_CONFIG: Record<RowStatus, StatusConfig> = {
  active:   { label: '活跃',   color: '#22c55e' },
  inactive: { label: '停用',   color: '#94a3b8' },
  pending:  { label: '待审核', color: '#f97316' },
}
