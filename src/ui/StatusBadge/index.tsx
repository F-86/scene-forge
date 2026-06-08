import styles from './index.module.css'

interface StatusBadgeProps {
  /** 徽标颜色（CSS 颜色值） */
  color: string
  /** 徽标尺寸（px），默认 8 */
  size?: number
}

/**
 * 状态徽标原语
 *
 * 纯色小圆点，用于表示状态、分类或优先级，适用于：
 * - 看板列头的列状态色点
 * - 用户在线/离线状态
 * - 告警级别指示（红/黄/绿）
 * - 任务优先级标记
 */
const StatusBadge = ({ color, size = 8 }: StatusBadgeProps) => {
  return (
    <span
      className={styles.badge}
      style={{ background: color, width: size, height: size }}
    />
  )
}

export default StatusBadge
