import type { ReactNode } from 'react'
import styles from './index.module.css'

interface RowHeaderProps {
  /** 左侧主内容，通常是标题文字或节点 */
  children: ReactNode
  /** 右侧辅助内容，通常是时间、操作按钮等 */
  trailing?: ReactNode
  /** 附加 CSS 类名 */
  className?: string
}

/**
 * 标题行布局原语
 *
 * 左侧主内容自适应，右侧辅助内容固定不收缩，适用于：
 * - 时间轴节点行（标题 + 时间戳）
 * - 列表项头部（名称 + 操作按钮）
 * - 卡片标题行（标题 + 更多菜单）
 * - 设置分组标题（分组名 + 展开/收起）
 */
const RowHeader = ({ children, trailing, className }: RowHeaderProps) => {
  return (
    <div className={`${styles.row} ${className ?? ''}`}>
      <div className={styles.main}>{children}</div>
      {trailing && <div className={styles.trailing}>{trailing}</div>}
    </div>
  )
}

export default RowHeader
