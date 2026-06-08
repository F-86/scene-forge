import styles from './index.module.css'

interface ToggleProps {
  /** 当前开关状态 */
  checked: boolean
  /** 状态变化回调 */
  onChange: (value: boolean) => void
}

/** 开关控件，点击切换开/关状态 */
const Toggle = ({ checked, onChange }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
    onClick={() => onChange(!checked)}
  >
    <span className={styles.thumb} />
  </button>
)

export default Toggle
