/** 卡片优先级 */
export type KanbanPriority = 'low' | 'medium' | 'high'

/** 看板卡片 */
export interface KanbanCard {
  /** 唯一标识 */
  id: string
  /** 卡片标题 */
  title: string
  /** 卡片描述（可选） */
  description?: string
  /** 优先级 */
  priority: KanbanPriority
  /** 标签列表 */
  tags: string[]
  /** 负责人（可选） */
  assignee?: string
}

/** 看板列 */
export interface KanbanColumn {
  /** 唯一标识 */
  id: string
  /** 列标题 */
  title: string
  /** 列的主题色（用于 StatusBadge） */
  color: string
  /** 该列下的卡片列表 */
  cards: KanbanCard[]
}

/** 看板数据（多列） */
export type KanbanBoardData = KanbanColumn[]
