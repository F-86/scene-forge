import type { CardItem } from './types'

/** 调色板：头像背景色 */
const AVATAR_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#3b82f6',
  '#ec4899', '#8b5cf6', '#14b8a6', '#f97316',
]

/** 调色板：标签颜色 */
const TAG_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899',
]

const TAG_NAMES = ['设计', '开发', '产品', '运营', '数据']

const AUTHOR_NAMES = [
  '张伟', '李娜', '王芳', '刘洋', '陈静',
  '赵磊', '孙悦', '周浩', '吴敏', '郑强',
]

/** 工厂函数：生成单条 CardItem，支持 overrides */
const createItem = (index: number, overrides?: Partial<CardItem>): CardItem => ({
  id: `card-${index}`,
  title: `卡片标题 ${index + 1}`,
  description: '这是一段卡片描述文字，简要介绍该卡片的内容和用途。',
  tag: TAG_NAMES[index % TAG_NAMES.length],
  tagColor: TAG_COLORS[index % TAG_COLORS.length],
  avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  avatarLabel: AUTHOR_NAMES[index % AUTHOR_NAMES.length].slice(0, 1),
  author: AUTHOR_NAMES[index % AUTHOR_NAMES.length],
  statCount: (index + 1) * 7,
  ...overrides,
})

/** 各场景的 Mock 数据变体 */
export const mockScenes = {
  /** 空数据 */
  empty: [] as CardItem[],

  /** 单条 */
  single: [createItem(0)],

  /** 正常数量（10 条） */
  normal: Array.from({ length: 10 }, (_, i) => createItem(i)),

  /** 大数据量（120 条） */
  large: Array.from({ length: 120 }, (_, i) => createItem(i)),

  /** 边界值：超长文本、空字段 */
  withEdge: [
    createItem(0, {
      title: '这是一个非常非常非常非常非常非常非常非常长的卡片标题，用于测试溢出和截断行为',
      description:
        '这是一段极其冗长的描述文字，故意写得很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长，用于验证多行截断是否正常工作。',
    }),
    createItem(1, {
      title: '',
      description: '',
      tag: '',
      author: '',
    }),
    createItem(2, {
      title: '特殊字符 <script>alert(1)</script> & "引号" \'单引号\'',
      description: '含有 emoji 🎉🚀✨ 和特殊符号 ©®™ 的内容',
      statCount: 0,
    }),
    createItem(3, {
      title: 'A',
      description: 'B',
      statCount: 9999999,
    }),
  ],
}
