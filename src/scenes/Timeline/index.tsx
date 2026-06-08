import { useMockVariant } from '@/hooks/useMockVariant'
import { EmptyState, RowHeader, Tag, TextStack } from '@/ui'
import { mockScenes } from './mock'
import type { TimelineEvent, TimelineEventType } from './types'
import styles from './index.module.css'

// ─── 常量 ────────────────────────────────────────────────
/** 节点圆点颜色映射 */
const TYPE_COLOR: Record<TimelineEventType, string> = {
  default: '#9ca3af',
  success: '#22c55e',
  warning: '#f59e0b',
  error:   '#ef4444',
  info:    '#3b82f6',
}

/** 标签颜色池，与 type 颜色保持一致调性 */
const TAG_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#3b82f6']

// ─── 工具函数 ────────────────────────────────────────────
/** 将 ISO 时间字符串格式化为「MM-DD HH:mm」 */
const formatTime = (iso: string): string => {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${mm}-${dd} ${hh}:${min}`
}

// ─── 子组件 ──────────────────────────────────────────────
interface TimelineItemProps {
  event: TimelineEvent
  /** 是否为最后一条（隐藏连接线） */
  isLast: boolean
}

/** 单条时间轴节点 */
const TimelineItem = ({ event, isLast }: TimelineItemProps) => {
  const dotColor = TYPE_COLOR[event.type]

  return (
    <div className={styles.item}>
      {/* 左侧：轴线 + 节点圆点 */}
      <div className={styles.axis}>
        <div className={styles.dot} style={{ background: dotColor }} />
        {!isLast && <div className={styles.line} />}
      </div>

      {/* 右侧：内容区 */}
      <div className={styles.content}>
        {/* 标题行：事件标题 + 时间戳 */}
        <RowHeader
          trailing={
            <span className={styles.timestamp}>{formatTime(event.timestamp)}</span>
          }
        >
          <span className={styles.title}>{event.title}</span>
        </RowHeader>

        {/* 描述与元信息 */}
        {(event.description || event.author) && (
          <TextStack
            primary={event.description ?? ''}
            secondary={event.author ? `— ${event.author}` : undefined}
          />
        )}

        {/* 标签 */}
        {event.tags && event.tags.length > 0 && (
          <div className={styles.tags}>
            {event.tags.map((tag, i) => (
              <Tag key={tag} label={tag} color={TAG_COLORS[i % TAG_COLORS.length]} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 场景主组件 ──────────────────────────────────────────
const Timeline = () => {
  const { current } = useMockVariant()
  const events = mockScenes[current] ?? []

  if (events.length === 0) {
    return <EmptyState title="暂无事件" description="当前时间轴为空，可切换左侧 Mock 变体查看其他效果" />
  }

  return (
    <div className={styles.container}>
      {events.map((event, index) => (
        <TimelineItem
          key={event.id}
          event={event}
          isLast={index === events.length - 1}
        />
      ))}
    </div>
  )
}

export default Timeline
