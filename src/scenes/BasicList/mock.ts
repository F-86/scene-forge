/**
 * BasicList 场景 Mock 数据
 * 固定导出 mockScenes 对象，包含五个标准变体
 */

import type { ListItem } from './types'

// ─── 工厂函数（仅供本场景使用）───────────────────────────────────────────────

/** 头像颜色池 */
const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
]

/**
 * 生成一条列表项数据
 * @param index 序号（从 0 开始）
 * @param overrides 需要覆盖的字段
 */
const createListItem = (index: number, overrides: Partial<ListItem> = {}): ListItem => {
  const id = index + 1
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length]

  return {
    id: String(id),
    title: `列表项标题 ${id}`,
    description: `这是第 ${id} 条数据的描述信息，用于展示副文本区域的样式效果。`,
    tag: index % 3 === 0 ? '重要' : index % 3 === 1 ? '普通' : '待处理',
    tagColor: index % 3 === 0 ? '#ef4444' : index % 3 === 1 ? '#6366f1' : '#f59e0b',
    avatarColor: color,
    avatarLabel: `项${id}`,
    createdAt: `2024-0${(index % 9) + 1}-${String((index % 28) + 1).padStart(2, '0')}`,
    ...overrides,
  }
}

/**
 * 批量生成列表项数据
 * @param count 生成数量
 */
const createListItems = (count: number): ListItem[] =>
  Array.from({ length: count }, (_, i) => createListItem(i))

// ─── Mock 变体 ────────────────────────────────────────────────────────────────

/** 边界值数据：超长文本、空字段、混合语言等异常数据 */
const edgeItems: ListItem[] = [
  {
    id: 'edge-1',
    title: '这是一个非常非常非常非常非常非常非常非常长的标题文字，用于测试超长标题的截断和折行表现',
    description: '正常长度的描述文字',
    tag: '超长标题',
    tagColor: '#6366f1',
    avatarColor: '#6366f1',
    avatarLabel: '长',
    createdAt: '2024-01-01',
  },
  {
    id: 'edge-2',
    title: '无描述字段的列表项',
    description: undefined,
    tag: '空描述',
    tagColor: '#f59e0b',
    avatarColor: '#f59e0b',
    avatarLabel: '空',
    createdAt: '2024-01-02',
  },
  {
    id: 'edge-3',
    title: '描述超长',
    description:
      '这是一段非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的描述文字，用于测试描述区域的行数限制和溢出截断效果，看看多行省略是否正确生效。',
    tag: '超长描述',
    tagColor: '#ef4444',
    avatarColor: '#ef4444',
    avatarLabel: '述',
    createdAt: '2024-01-03',
  },
  {
    id: 'edge-4',
    title: 'English Title with Mixed Content 混合语言标题 123',
    description: 'Mixed language description. 中英文混合描述，验证字体 fallback 是否正常。',
    tag: '混合语言',
    tagColor: '#10b981',
    avatarColor: '#10b981',
    avatarLabel: 'En',
    createdAt: '2024-01-04',
  },
  {
    id: 'edge-5',
    title: '极短',
    description: '短',
    tag: '短',
    tagColor: '#8b5cf6',
    avatarColor: '#8b5cf6',
    avatarLabel: '短',
    createdAt: '2024-01-05',
  },
]

export const mockScenes = {
  /** 空状态：0 条，验证空状态占位图和文案 */
  empty: [] as ListItem[],

  /** 单条：1 条，验证单条时的布局是否异常 */
  single: createListItems(1),

  /** 常规：10 条，日常验收主要场景 */
  normal: createListItems(10),

  /** 大数据量：200 条，验证滚动和性能 */
  large: createListItems(200),

  /** 边界值：超长文本、空字段等异常数据 */
  withEdge: edgeItems,
}
