import type { UserItem } from './types'

// ─── 常量 ───────────────────────────────────────────────
/** 头像背景色备选池 */
const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4',
]

/** 边界值测试用的极长简介 */
const LONG_BIO =
  '这是一段非常非常长的个人简介，用于测试文本溢出与截断效果。内容包含中英混排 English mixed content 以及各种标点符号！？……——，。、；：「」【】（）'

/** 边界值测试用的特殊字符名称 */
const EDGE_NAMES = [
  '<Script>',
  '用户 & 朋友',
  '   空格前后   ',
  '🎉 Emoji',
  'A'.repeat(40),
]

/** 标签备选池 */
const TAG_POOL = [
  'React', 'TypeScript', 'Rust', 'Go', '设计师',
  '全栈', '前端', '后端', '开源', 'DevOps',
]

// ─── 工厂函数 ────────────────────────────────────────────
/**
 * 创建单条用户数据
 * @param index 序号，用于生成唯一 id 和差异化字段
 * @param overrides 字段覆盖，用于构造边界值
 */
const createUser = (index: number, overrides?: Partial<UserItem>): UserItem => {
  const name = `用户${String(index + 1).padStart(3, '0')}`
  return {
    id: `user-${index}`,
    name,
    bio: `热爱开源与技术分享，目前专注于第 ${index + 1} 个有趣的项目。`,
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    avatarLabel: name.slice(0, 2),
    tags: TAG_POOL.slice(index % TAG_POOL.length, (index % TAG_POOL.length) + 2),
    followers: (index + 1) * 137,
    ...overrides,
  }
}

/** 批量生成 n 条用户数据 */
const createUsers = (n: number, offset = 0): UserItem[] =>
  Array.from({ length: n }, (_, i) => createUser(offset + i))

// ─── Mock 变体 ────────────────────────────────────────────
/** 五个标准变体，供 useMockVariant 按 key 读取 */
export const mockScenes: Record<string, UserItem[]> = {
  /** 空状态 */
  empty: [],

  /** 单条布局验证 */
  single: [createUser(0)],

  /** 常规 10 条 */
  normal: createUsers(10),

  /** 大数据量，验证虚拟滚动性能 */
  large: createUsers(10_000),

  /** 边界值：超长文本、特殊字符、空字段 */
  withEdge: [
    createUser(0, { bio: LONG_BIO }),
    createUser(1, { name: EDGE_NAMES[0], bio: '' }),
    createUser(2, { name: EDGE_NAMES[1], tags: [] }),
    createUser(3, { name: EDGE_NAMES[2], followers: 0 }),
    createUser(4, { name: EDGE_NAMES[3], avatarLabel: '🎉' }),
    createUser(5, { name: EDGE_NAMES[4] }),
    createUser(6, { tags: TAG_POOL }),
  ],
}
