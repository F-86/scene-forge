import styles from './index.module.css'

interface AvatarProps {
  /** 头像背景色 */
  color: string
  /** 显示文字（首字或缩写） */
  label: string
  /** 尺寸，默认 36 */
  size?: number
}

const Avatar = ({ color, label, size = 36 }: AvatarProps) => {
  return (
    <div
      className={styles.avatar}
      style={{
        background: color,
        width: size,
        height: size,
        fontSize: size * 0.33,
      }}
    >
      {label}
    </div>
  )
}

export default Avatar
