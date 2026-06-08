import type { TimelineEvent, TimelineEventType } from './types'

// ─── 常量 ────────────────────────────────────────────────
/** 事件类型循环池 */
const EVENT_TYPES: TimelineEventType[] = ['default', 'success', 'warning', 'error', 'info']

/** 标签备选池 */
const TAG_POOL = ['feat', 'fix', 'docs', 'refactor', 'chore', 'perf', 'test', 'ci']

/** 操作人备选池 */
const AUTHORS = ['张三', '李四', '王五', 'Alice', 'Bob']

/** 边界值：超长标题 */
const LONG_TITLE = '这是一个非常非常长的事件标题，用于测试标题行在空间受限时的截断与省略效果'

/** 边界值：超长描述 */
const LONG_DESC =
  '这是一段极长的事件详情描述，包含大量文字内容，用于验证多行文本的排版、行高与容器撑开行为。' +
  '内容涵盖中英混排 mixed content，以及各类标点符号！？……——。' +
  '继续补充更多内容以确保文本足够长，能够触发多行换行效果。'

// ─── 工厂函数 ────────────────────────────────────────────
/**
 * 生成单条时间轴事件
 * @param index 序号，用于差异化字段
 * @param overrides 字段覆盖，用于边界值
 */
const createEvent = (index: number, overrides?: Partial<TimelineEvent>): TimelineEvent => {
  /* 时间戳从"现在"往前推，每条间隔约 2 小时 */
  const ms = Date.parse('2026-06-08T18:00:00+08:00') - index * 2 * 60 * 60 * 1000
  const timestamp = new Date(ms).toISOString()

  return {
    id: `event-${index}`,
    title: `事件 #${index + 1}：完成第 ${index + 1} 阶段里程碑`,
    description: index % 3 !== 0
      ? `详情说明：本次变更涉及模块 ${index + 1}，已通过测试验证。`
      : undefined,
    timestamp,
    type: EVENT_TYPES[index % EVENT_TYPES.length],
    tags: index % 4 !== 0
      ? TAG_POOL.slice(index % TAG_POOL.length, (index % TAG_POOL.length) + 2)
      : undefined,
    author: AUTHORS[index % AUTHORS.length],
    ...overrides,
  }
}

/** 批量生成 n 条事件 */
const createEvents = (n: number): TimelineEvent[] =>
  Array.from({ length: n }, (_, i) => createEvent(i))

// ─── Mock 变体 ────────────────────────────────────────────
export const mockScenes: Record<string, TimelineEvent[]> = {
  /** 空状态 */
  empty: [],

  /** 单条，验证独立布局 */
  single: [createEvent(0)],

  /** 常规 10 条 */
  normal: createEvents(10),

  /** 100 条，验证长列表滚动 */
  large: createEvents(100),

  /** 边界值：超长文本、空字段、特殊字符 */
  withEdge: [
    createEvent(0, { title: LONG_TITLE }),
    createEvent(1, { description: LONG_DESC }),
    createEvent(2, { description: undefined, tags: undefined, author: undefined }),
    createEvent(3, { title: '<script>alert(1)</script>', type: 'error' }),
    createEvent(4, { tags: TAG_POOL }),
    createEvent(5, { type: 'success', author: '🚀 机器人' }),
  ],
}
