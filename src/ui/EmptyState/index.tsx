import { InboxIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import styles from './index.module.css'

interface EmptyStateProps {
  /** 主文案，默认「暂无数据」 */
  title?: string
  /** 副文案 */
  description?: string
  /** 自定义图标组件，默认使用收件箱图标 */
  icon?: ComponentType<{ size?: number; className?: string }>
}

const EmptyState = ({
  title = '暂无数据',
  description = '当前列表为空，可以切换左侧的 Mock 变体查看其他效果',
  icon: Icon = InboxIcon,
}: EmptyStateProps) => {
  return (
    <div className={styles.wrapper}>
      <Icon size={48} className={styles.icon} />
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}

export default EmptyState
