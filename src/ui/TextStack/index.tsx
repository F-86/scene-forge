import type { ReactNode } from 'react'
import styles from './index.module.css'

interface TextStackProps {
  /** 主文本，字号较大、颜色较深 */
  primary: ReactNode
  /** 副文本，字号较小、颜色较浅 */
  secondary?: ReactNode
  /** 附加 CSS 类名 */
  className?: string
}

/**
 * 主副文本竖排原语
 *
 * 一大一小、一深一浅的两行文字，适用于：
 * - 时间轴节点描述（标题 + 详情）
 * - 列表项文字区（名称 + 副标题）
 * - 表单字段说明（字段名 + 帮助文案）
 * - 用户信息（姓名 + 职位/邮箱）
 */
const TextStack = ({ primary, secondary, className }: TextStackProps) => {
  return (
    <div className={`${styles.stack} ${className ?? ''}`}>
      <div className={styles.primary}>{primary}</div>
      {secondary && <div className={styles.secondary}>{secondary}</div>}
    </div>
  )
}

export default TextStack
