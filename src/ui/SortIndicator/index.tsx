import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import styles from './index.module.css'

interface SortIndicatorProps {
  /** 当前排序方向：asc 升序 / desc 降序 / null 无排序 */
  direction: 'asc' | 'desc' | null
  /** 图标尺寸，默认 14 */
  size?: number
}

/**
 * 排序方向指示器
 * - null  → ⇅ 中性图标（淡色）
 * - asc   → ↑ 升序（强调色）
 * - desc  → ↓ 降序（强调色）
 */
const SortIndicator = ({ direction, size = 14 }: SortIndicatorProps) => {
  if (direction === 'asc') {
    return <ArrowUp size={size} className={styles.active} />
  }
  if (direction === 'desc') {
    return <ArrowDown size={size} className={styles.active} />
  }
  return <ArrowUpDown size={size} className={styles.neutral} />
}

export default SortIndicator
