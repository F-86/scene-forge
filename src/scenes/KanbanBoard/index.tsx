import { useEffect, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMockVariant } from '@/hooks/useMockVariant'
import { Card, EmptyState, RowHeader, ScrollArea, StatusBadge, Tag, TextStack } from '@/ui'
import { mockScenes } from './mock'
import type { KanbanBoardData, KanbanCard, KanbanPriority } from './types'
import styles from './index.module.css'

// ─── 常量 ────────────────────────────────────────────────
/** 优先级颜色映射 */
const PRIORITY_COLOR: Record<KanbanPriority, string> = {
  low:    '#22c55e',
  medium: '#f59e0b',
  high:   '#ef4444',
}

/** 优先级中文标签 */
const PRIORITY_LABEL: Record<KanbanPriority, string> = {
  low:    '低',
  medium: '中',
  high:   '高',
}

/** 标签颜色池 */
const TAG_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#3b82f6']

// ─── 可拖拽卡片 ──────────────────────────────────────────
interface SortableCardProps {
  card: KanbanCard
  isDragging?: boolean
}

const KanbanCardItem = ({ card, isDragging }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: card.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={styles.kanbanCard}>
        {/* 优先级徽标 + 标题行 */}
        <RowHeader
          trailing={
            <span
              className={styles.priority}
              style={{ color: PRIORITY_COLOR[card.priority] }}
            >
              {PRIORITY_LABEL[card.priority]}
            </span>
          }
        >
          <TextStack
            primary={card.title}
            secondary={card.description}
          />
        </RowHeader>

        {/* 底部：标签 + 负责人 */}
        {(card.tags.length > 0 || card.assignee) && (
          <div className={styles.cardFooter}>
            <div className={styles.tags}>
              {card.tags.map((tag, i) => (
                <Tag key={tag} label={tag} color={TAG_COLORS[i % TAG_COLORS.length]} />
              ))}
            </div>
            {card.assignee && (
              <span className={styles.assignee}>{card.assignee}</span>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── 看板列 ──────────────────────────────────────────────
interface KanbanColumnProps {
  id: string
  title: string
  color: string
  cards: KanbanCard[]
}

const KanbanColumnItem = ({ id, title, color, cards }: KanbanColumnProps) => {
  return (
    <div className={styles.column}>
      {/* 列头 */}
      <div className={styles.columnHeader}>
        <RowHeader
          trailing={
            <span className={styles.cardCount}>{cards.length}</span>
          }
        >
          <div className={styles.columnTitle}>
            <StatusBadge color={color} size={8} />
            <span>{title}</span>
          </div>
        </RowHeader>
      </div>

      {/* 卡片列表 */}
      <ScrollArea className={styles.columnBody}>
        <SortableContext
          id={id}
          items={cards.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.cardList}>
            {cards.map(card => (
              <KanbanCardItem key={card.id} card={card} />
            ))}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  )
}

// ─── 场景主组件 ──────────────────────────────────────────
const KanbanBoard = () => {
  const { current } = useMockVariant()

  const [board, setBoard] = useState<KanbanBoardData>(() => mockScenes[current] ?? [])
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  // 切换 mock 变体时重置看板数据
  useEffect(() => {
    setBoard(mockScenes[current] ?? [])
  }, [current])

  const totalCards = board.reduce((sum, col) => sum + col.cards.length, 0)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  if (totalCards === 0 && current === 'empty') {
    return <EmptyState title="看板为空" description="当前无任何卡片，可切换左侧 Mock 变体查看其他效果" />
  }

  /** 找到某张卡片所在列的 id */
  const findColumnId = (cardId: string): string | undefined =>
    board.find(col => col.cards.some(c => c.id === cardId))?.id

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveCardId(active.id as string)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCardId(null)
    if (!over) return

    const activeColId = findColumnId(active.id as string)
    // over 可能是列 id 或卡片 id
    const overColId =
      board.find(col => col.id === over.id)?.id ??
      findColumnId(over.id as string)

    if (!activeColId || !overColId) return
    if (activeColId === overColId && active.id === over.id) return

    setBoard(prev => {
      const next = prev.map(col => ({ ...col, cards: [...col.cards] }))
      const srcCol = next.find(c => c.id === activeColId)!
      const dstCol = next.find(c => c.id === overColId)!

      const cardIndex = srcCol.cards.findIndex(c => c.id === active.id)
      const [movedCard] = srcCol.cards.splice(cardIndex, 1)

      if (activeColId === overColId) {
        // 同列排序
        const overIndex = dstCol.cards.findIndex(c => c.id === over.id)
        dstCol.cards.splice(overIndex >= 0 ? overIndex : dstCol.cards.length, 0, movedCard)
      } else {
        // 跨列移动：插到目标列末尾或指定位置
        const overIndex = dstCol.cards.findIndex(c => c.id === over.id)
        dstCol.cards.splice(overIndex >= 0 ? overIndex : dstCol.cards.length, 0, movedCard)
      }

      return next
    })
  }

  const activeCard = activeCardId
    ? board.flatMap(col => col.cards).find(c => c.id === activeCardId)
    : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {board.map(col => (
          <KanbanColumnItem
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            cards={col.cards}
          />
        ))}
      </div>

      {/* 拖拽时的跟随预览 */}
      <DragOverlay>
        {activeCard && (
          <div className={styles.overlay}>
            <KanbanCardItem card={activeCard} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard
