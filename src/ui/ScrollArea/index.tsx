import type { ReactNode } from 'react'
import styles from './index.module.css'

interface ScrollAreaProps {
  /** 滚动区域内容 */
  children: ReactNode
  /** 附加 CSS 类名，可用于外部设置高度 */
  className?: string
}

/**
 * 滚动容器原语
 *
 * 提供垂直滚动能力，内容超出时自动出现滚动条，
 * 配合父容器的固定高度（flex: 1 / height: Xpx）使用。适用于：
 * - 看板列内容区（卡片列表超出列高时滚动）
 * - 侧边栏导航列表
 * - 模态框内容区
 * - 任何需要局部滚动而非全页滚动的容器
 */
const ScrollArea = ({ children, className }: ScrollAreaProps) => {
  return (
    <div className={`${styles.area} ${className ?? ''}`}>
      {children}
    </div>
  )
}

export default ScrollArea
