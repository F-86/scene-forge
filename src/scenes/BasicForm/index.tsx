import { useState, useEffect } from 'react'
import { Toggle, Field } from '@/ui'
import { useMockVariant } from '@/hooks/useMockVariant'
import { mockScenes } from './mock'
import {
  ROLE_OPTIONS,
  GENDER_OPTIONS,
  BIO_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from './types'
import type { FormValues, FormErrors } from './types'
import styles from './index.module.css'

// ── 校验 ──────────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {}
  if (!values.name.trim()) {
    errors.name = '请输入姓名'
  } else if (values.name.length > NAME_MAX_LENGTH) {
    errors.name = `姓名不能超过 ${NAME_MAX_LENGTH} 个字`
  }
  if (!values.email.trim()) {
    errors.email = '请输入邮箱地址'
  } else if (!EMAIL_RE.test(values.email)) {
    errors.email = '请输入有效的邮箱地址'
  }
  if (!values.role) {
    errors.role = '请选择角色'
  }
  if (values.bio.length > BIO_MAX_LENGTH) {
    errors.bio = `简介不能超过 ${BIO_MAX_LENGTH} 个字`
  }
  return errors
}

// ── 主组件 ────────────────────────────────────────────────────────────────────

const BasicForm = () => {
  const { current: variant } = useMockVariant()
  const initialValues = mockScenes[variant] ?? mockScenes.normal

  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  // 切换 Mock 变体时重置表单
  useEffect(() => {
    setValues(mockScenes[variant] ?? mockScenes.normal)
    setErrors({})
    setSubmitted(false)
  }, [variant])

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues(prev => ({ ...prev, [key]: value }))
    // 已提交过则实时清除该字段的错误
    if (submitted && errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSubmitted(false)
    setErrors({})
    alert('提交成功！')
  }

  const handleReset = () => {
    setValues(initialValues)
    setErrors({})
    setSubmitted(false)
  }

  return (
    <div className={styles.page}>
      {/* 页头 */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>基础表单</h1>
      </div>

      {/* 表单卡片 */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        {/* 姓名 */}
        <Field label="姓名" required error={errors.name}>
          <input
            type="text"
            className={styles.input}
            placeholder="请输入姓名"
            maxLength={NAME_MAX_LENGTH + 10}
            value={values.name}
            onChange={e => set('name', e.target.value)}
          />
        </Field>

        {/* 邮箱 */}
        <Field label="邮箱" required error={errors.email}>
          <input
            type="email"
            className={styles.input}
            placeholder="请输入邮箱地址"
            value={values.email}
            onChange={e => set('email', e.target.value)}
          />
        </Field>

        {/* 角色 */}
        <Field label="角色" required error={errors.role}>
          <select
            className={styles.select}
            value={values.role}
            onChange={e => set('role', e.target.value as FormValues['role'])}
          >
            <option value="">请选择角色</option>
            {ROLE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </Field>

        {/* 性别 */}
        <Field label="性别">
          <div className={styles.radioGroup}>
            {GENDER_OPTIONS.map(opt => (
              <label key={opt.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  className={styles.radio}
                  name="gender"
                  value={opt.value}
                  checked={values.gender === opt.value}
                  onChange={() => set('gender', opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Field>

        {/* 个人简介 */}
        <Field label="个人简介" error={errors.bio}>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              placeholder="请输入个人简介"
              value={values.bio}
              onChange={e => set('bio', e.target.value)}
            />
            <span className={`${styles.charCount} ${values.bio.length > BIO_MAX_LENGTH ? styles.charCountOver : ''}`}>
              {values.bio.length} / {BIO_MAX_LENGTH}
            </span>
          </div>
        </Field>

        {/* 是否启用 */}
        <Field label="是否启用">
          <div className={styles.toggleRow}>
            <Toggle checked={values.active} onChange={v => set('active', v)} />
            <span className={styles.toggleLabel}>{values.active ? '已启用' : '已停用'}</span>
          </div>
        </Field>

        {/* 操作按钮 */}
        <div className={styles.actions}>
          <button type="button" className={styles.btnReset} onClick={handleReset}>
            重置
          </button>
          <button type="submit" className={styles.btnSubmit}>
            提交
          </button>
        </div>
      </form>
    </div>
  )
}

export default BasicForm
