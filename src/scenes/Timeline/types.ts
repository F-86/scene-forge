/** 事件类型，决定节点圆点颜色 */
export type TimelineEventType = 'default' | 'success' | 'warning' | 'error' | 'info'

/** 时间轴单条事件 */
export interface TimelineEvent {
  /** 唯一标识 */
  id: string
  /** 事件标题 */
  title: string
  /** 事件详情描述（可选） */
  description?: string
  /** 事件时间（ISO 字符串） */
  timestamp: string
  /** 事件类型，影响节点颜色 */
  type: TimelineEventType
  /** 标签列表（可选） */
  tags?: string[]
  /** 操作人（可选） */
  author?: string
}
