import styles from './index.module.css'

interface TagProps {
  /** 标签文字 */
  label: string
  /** 标签颜色（CSS 颜色值），用于文字和半透明背景 */
  color: string
}

const Tag = ({ label, color }: TagProps) => {
  return (
    <span
      className={styles.tag}
      style={{
        color,
        background: `${color}18`,
      }}
    >
      {label}
    </span>
  )
}

export default Tag
