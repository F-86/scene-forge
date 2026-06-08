import { InboxIcon } from 'lucide-react'
import { useMockVariant } from '@/hooks/useMockVariant'
import { mockScenes } from './mock'
import styles from './index.module.css'

/** 每个变体对应的说明文字 */
const VARIANT_DESC: Record<string, string> = {
  empty: '当前为空状态，列表中没有任何数据',
  single: '当前为单条数据，验证单条时的布局',
  normal: '当前为常规数据量（10 条）',
  large: '当前为大数据量（200 条），验证滚动性能',
  withEdge: '当前为边界值数据，包含超长文本、空字段等异常情况',
}

const BasicList = () => {
  const { current } = useMockVariant()
  const items = mockScenes[current]

  return (
    <div className={styles.page}>
      {/* 页头 */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>基础列表</h1>
        <p className={styles.headerMeta}>
          {VARIANT_DESC[current]}，共 {items.length} 条
        </p>
      </div>

      {/* 空状态 */}
      {items.length === 0 && (
        <div className={styles.empty}>
          <InboxIcon size={48} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>暂无数据</p>
          <p className={styles.emptyDesc}>当前列表为空，可以切换左侧的 Mock 变体查看其他效果</p>
        </div>
      )}

      {/* 列表 */}
      {items.length > 0 && (
        <ul className={styles.list}>
          {items.map(item => (
            <li key={item.id} className={styles.item}>
              {/* 头像 */}
              <div
                className={styles.avatar}
                style={{ background: item.avatarColor }}
              >
                {item.avatarLabel}
              </div>

              {/* 内容 */}
              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <span className={styles.title}>{item.title}</span>
                  <span
                    className={styles.tag}
                    style={{
                      background: `${item.tagColor}18`,
                      color: item.tagColor,
                    }}
                  >
                    {item.tag}
                  </span>
                </div>

                {item.description && (
                  <p className={styles.description}>{item.description}</p>
                )}

                <div className={styles.footer}>{item.createdAt}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default BasicList
