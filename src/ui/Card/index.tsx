import type { ReactNode } from 'react'
import styles from './index.module.css'

interface CardProps {
  /** 卡片内容 */
  children: ReactNode
  /** 附加 CSS 类名 */
  className?: string
  /** 点击回调，传入时卡片可交互，显示 pointer 光标 */
  onClick?: () => void
}

const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div
      className={[styles.card, onClick ? styles.clickable : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
