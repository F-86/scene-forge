import type { KanbanBoardData, KanbanCard, KanbanPriority } from './types'

// ─── 常量 ────────────────────────────────────────────────
/** 优先级循环池 */
const PRIORITIES: KanbanPriority[] = ['low', 'medium', 'high']

/** 标签备选池 */
const TAG_POOL = ['前端', '后端', '设计', 'API', 'Bug', '优化', '文档', '测试']

/** 负责人备选池 */
const ASSIGNEES = ['张三', '李四', '王五', 'Alice', 'Bob', undefined]

/** 列配置：id、标题、主题色固定不变 */
const COLUMN_DEFS = [
  { id: 'todo',        title: '待处理', color: '#9ca3af' },
  { id: 'in-progress', title: '进行中', color: '#3b82f6' },
  { id: 'review',      title: '评审中', color: '#f59e0b' },
  { id: 'done',        title: '已完成', color: '#22c55e' },
]

// ─── 工厂函数 ────────────────────────────────────────────
const createCard = (index: number, overrides?: Partial<KanbanCard>): KanbanCard => ({
  id: `card-${index}`,
  title: `任务 #${index + 1}：完成第 ${index + 1} 项功能开发`,
  description: index % 3 !== 0
    ? `详细说明：本任务涉及模块 ${index + 1} 的改造，预计工期 ${(index % 5) + 1} 天。`
    : undefined,
  priority: PRIORITIES[index % PRIORITIES.length],
  tags: TAG_POOL.slice(index % TAG_POOL.length, (index % TAG_POOL.length) + 2),
  assignee: ASSIGNEES[index % ASSIGNEES.length],
  ...overrides,
})

/**
 * 将卡片列表均匀分发到各列
 * 按 index % 列数 分配，确保列间数量接近
 */
const distributeCards = (cards: KanbanCard[]): KanbanBoardData =>
  COLUMN_DEFS.map((col, colIndex) => ({
    ...col,
    cards: cards.filter((_, i) => i % COLUMN_DEFS.length === colIndex),
  }))

// ─── Mock 变体 ────────────────────────────────────────────
export const mockScenes: Record<string, KanbanBoardData> = {
  /** 空看板：各列均无卡片 */
  empty: COLUMN_DEFS.map(col => ({ ...col, cards: [] })),

  /** 单张卡片，仅在第一列 */
  single: COLUMN_DEFS.map((col, i) => ({
    ...col,
    cards: i === 0 ? [createCard(0)] : [],
  })),

  /** 常规：共 12 张卡片，均匀分布在 4 列 */
  normal: distributeCards(
    Array.from({ length: 12 }, (_, i) => createCard(i)),
  ),

  /** 大数据量：共 120 张卡片，验证列滚动 */
  large: distributeCards(
    Array.from({ length: 120 }, (_, i) => createCard(i)),
  ),

  /** 边界值：超长文本、空字段、特殊字符、极多标签 */
  withEdge: COLUMN_DEFS.map((col, colIndex) => ({
    ...col,
    cards: [
      createCard(colIndex * 10, {
        title: '这是一个标题非常非常非常非常非常非常非常非常非常非常非常非常长的任务卡片',
      }),
      createCard(colIndex * 10 + 1, {
        description: '这是一段极长的描述内容，'.repeat(8),
      }),
      createCard(colIndex * 10 + 2, {
        description: undefined,
        assignee: undefined,
        tags: [],
      }),
      createCard(colIndex * 10 + 3, {
        title: '<script>alert(1)</script>',
        tags: TAG_POOL,
      }),
    ],
  })),
}
