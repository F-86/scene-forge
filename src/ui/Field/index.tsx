import type { ReactNode } from 'react'
import styles from './index.module.css'

interface FieldProps {
  /** 字段标签文案 */
  label: string
  /** 是否必填，显示红色星号 */
  required?: boolean
  /** 校验错误信息，有值时显示红色提示并高亮边框 */
  error?: string
  /** 控件插槽 */
  children: ReactNode
}

/** 表单字段容器：标签 + 控件插槽 + 错误提示 */
const Field = ({ label, required, error, children }: FieldProps) => (
  <div className={`${styles.field} ${error ? styles.fieldError : ''}`}>
    <label className={styles.label}>
      {required && <span className={styles.required}>*</span>}
      {label}
    </label>
    <div className={styles.control}>{children}</div>
    {error && <p className={styles.errorMsg}>{error}</p>}
  </div>
)

export default Field
