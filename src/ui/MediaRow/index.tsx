import type { ReactNode } from 'react'
import styles from './index.module.css'

interface MediaRowProps {
  /** 左侧固定视觉元素，如头像、图标、缩略图 */
  leading: ReactNode
  /** 右侧自适应内容区 */
  children: ReactNode
  /**
   * 左右两侧的间距（px），默认 12
   */
  gap?: number
  /**
   * 垂直对齐方式，默认 'start'
   * - 'start'  左侧元素顶部对齐（适合内容较多时）
   * - 'center' 左侧元素垂直居中（适合单行内容）
   */
  align?: 'start' | 'center'
}

/**
 * Media Object 布局原语
 *
 * 经典的「左固定 + 右自适应」结构，适用于：
 * - 用户卡片行（头像 + 名称/简介）
 * - 评论条目（头像 + 正文）
 * - 通知列表（图标 + 文案）
 * - 搜索结果行（缩略图 + 标题摘要）
 * - 设置项（图标 + 标题描述）
 */
const MediaRow = ({ leading, children, gap = 12, align = 'start' }: MediaRowProps) => {
  return (
    <div
      className={`${styles.row} ${align === 'center' ? styles.alignCenter : ''}`}
      style={{ '--media-row-gap': `${gap}px` } as React.CSSProperties}
    >
      <div className={styles.leading}>{leading}</div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default MediaRow
