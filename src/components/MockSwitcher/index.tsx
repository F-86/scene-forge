import { MOCK_VARIANT_KEYS, useMockVariant } from '@/hooks/useMockVariant'
import styles from './index.module.css'

/** 各变体的中文显示标签 */
const VARIANT_LABELS: Record<(typeof MOCK_VARIANT_KEYS)[number], string> = {
  empty: '空数据',
  single: '单条',
  normal: '正常',
  large: '大数据量',
  withEdge: '边界值',
}

const MockSwitcher = () => {
  const { current, setVariant } = useMockVariant()

  return (
    <select
      className={styles.select}
      value={current}
      onChange={e => setVariant(e.target.value as (typeof MOCK_VARIANT_KEYS)[number])}
      title="切换 Mock 数据量"
    >
      {MOCK_VARIANT_KEYS.map(key => (
        <option key={key} value={key}>
          {VARIANT_LABELS[key]}
        </option>
      ))}
    </select>
  )
}

export default MockSwitcher
