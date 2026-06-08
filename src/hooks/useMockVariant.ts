import { useSearchParams } from 'react-router-dom'

/** Mock 数据量变体的所有合法 key */
export const MOCK_VARIANT_KEYS = ['empty', 'single', 'normal', 'large', 'withEdge'] as const

export type MockVariantKey = (typeof MOCK_VARIANT_KEYS)[number]

/** 默认变体 */
const DEFAULT_VARIANT: MockVariantKey = 'normal'

/**
 * 读取和设置当前 Mock 数据量变体
 * 通过 URL query 参数 ?mock=xxx 持久化，刷新不丢失
 */
export const useMockVariant = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const raw = searchParams.get('mock')
  const current: MockVariantKey =
    MOCK_VARIANT_KEYS.includes(raw as MockVariantKey)
      ? (raw as MockVariantKey)
      : DEFAULT_VARIANT

  const setVariant = (key: MockVariantKey) => {
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev)
        next.set('mock', key)
        return next
      },
      { replace: true }, // 替换历史记录，避免回退键产生无意义的历史
    )
  }

  return { current, setVariant }
}
