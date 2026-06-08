import type { ReactNode } from 'react'
import styles from './index.module.css'

/** 每行列数，对应 CSS 变量 --grid-columns */
type Columns = 1 | 2 | 3 | 4

interface GridProps {
  /** 网格内容（通常是一组 Card） */
  children: ReactNode
  /**
   * 最大列数，默认 3
   * 实际列数会随视口宽度自动缩减（响应式）
   */
  columns?: Columns
  /** 网格间距（px），默认 16 */
  gap?: number
}

const Grid = ({ children, columns = 3, gap = 16 }: GridProps) => {
  return (
    <div
      className={styles.grid}
      style={
        {
          '--grid-columns': columns,
          '--grid-gap': `${gap}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

export default Grid
