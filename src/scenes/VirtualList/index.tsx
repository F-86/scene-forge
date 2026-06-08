import { Virtuoso } from 'react-virtuoso'
import { useMockVariant } from '@/hooks/useMockVariant'
import { Avatar, Card, EmptyState, MediaRow, Tag } from '@/ui'
import { mockScenes } from './mock'
import type { UserItem } from './types'
import styles from './index.module.css'

// ─── 常量 ────────────────────────────────────────────────
/** 头像尺寸（px） */
const AVATAR_SIZE = 44

/** 每行卡片的默认高度（px），用于虚拟滚动跳过初始探测渲染 */
const DEFAULT_ITEM_HEIGHT = 88

/** 标签颜色池，按索引循环取色 */
const TAG_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
  '#22c55e', '#14b8a6', '#3b82f6', '#f43f5e',
]

// ─── 子组件 ──────────────────────────────────────────────
interface UserRowProps {
  user: UserItem
}

/** 单条用户卡片行 */
const UserRow = ({ user }: UserRowProps) => (
  <div className={styles.itemWrapper}>
    <Card>
      <MediaRow
        leading={
          <Avatar color={user.avatarColor} label={user.avatarLabel} size={AVATAR_SIZE} />
        }
      >
        <div className={styles.body}>
          <div className={styles.header}>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.followers}>
              {user.followers.toLocaleString()} 粉丝
            </span>
          </div>

          {user.bio && (
            <p className={styles.bio}>{user.bio}</p>
          )}

          {user.tags.length > 0 && (
            <div className={styles.tags}>
              {user.tags.map((tag, i) => (
                <Tag key={tag} label={tag} color={TAG_COLORS[i % TAG_COLORS.length]} />
              ))}
            </div>
          )}
        </div>
      </MediaRow>
    </Card>
  </div>
)

// ─── 场景主组件 ──────────────────────────────────────────
const VirtualList = () => {
  const { current } = useMockVariant()
  const items = mockScenes[current] ?? []

  if (items.length === 0) {
    return <EmptyState title="暂无用户" description="当前列表为空，可切换左侧 Mock 变体查看其他效果" />
  }

  return (
    <div className={styles.container}>
      {/* 列表头部信息 */}
      <div className={styles.toolbar}>
        <span className={styles.count}>共 {items.length.toLocaleString()} 条记录</span>
      </div>

      {/* 虚拟滚动列表 */}
      <Virtuoso
        className={styles.list}
        data={items}
        defaultItemHeight={DEFAULT_ITEM_HEIGHT}
        itemContent={(_index, user: UserItem) => <UserRow user={user} />}
      />
    </div>
  )
}

export default VirtualList
