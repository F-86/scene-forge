import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Table2 } from 'lucide-react'
import { Tag, EmptyState } from '@/ui'
import { useMockVariant } from '@/hooks/useMockVariant'
import { mockScenes } from './mock'
import { STATUS_CONFIG } from './types'
import type { SortKey, SortDirection, SortState, TableRow } from './types'
import styles from './index.module.css'

// ── 常量 ─────────────────────────────────────────────────────────────────────

/** 列定义 */
interface ColumnDef {
  key: string
  label: string
  sortKey?: SortKey
  align: 'left' | 'center' | 'right'
}

const COLUMNS: ColumnDef[] = [
  { key: 'index',     label: '#',       align: 'center' },
  { key: 'name',      label: '姓名',    sortKey: 'name',      align: 'left' },
  { key: 'email',     label: '邮箱',    align: 'left' },
  { key: 'role',      label: '角色',    align: 'left' },
  { key: 'status',    label: '状态',    sortKey: 'status',    align: 'center' },
  { key: 'amount',    label: '金额',    sortKey: 'amount',    align: 'right' },
  { key: 'createdAt', label: '注册日期', sortKey: 'createdAt', align: 'right' },
]

// ── 工具函数 ──────────────────────────────────────────────────────────────────

/** 将金额（分）格式化为带千分符的元，例如 1234500 → ¥12,345.00 */
const formatAmount = (cents: number): string => {
  const yuan = cents / 100
  return `¥${yuan.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** 根据 SortState 对数据排序，返回新数组 */
const sortRows = (rows: TableRow[], sort: SortState): TableRow[] => {
  if (!sort.key || !sort.direction) return rows
  const { key, direction } = sort
  return [...rows].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av === bv) return 0
    const cmp = av < bv ? -1 : 1
    return direction === 'asc' ? cmp : -cmp
  })
}

/** 点击列头时切换排序：无 → asc → desc → 无 */
const nextSort = (current: SortState, clickedKey: SortKey): SortState => {
  if (current.key !== clickedKey) return { key: clickedKey, direction: 'asc' }
  if (current.direction === 'asc')  return { key: clickedKey, direction: 'desc' }
  return { key: null, direction: null }
}

// ── 子组件 ────────────────────────────────────────────────────────────────────

interface SortIconProps {
  sortKey: SortKey
  currentSort: SortState
}

/** 列头排序图标 */
const SortIcon = ({ sortKey, currentSort }: SortIconProps) => {
  if (currentSort.key !== sortKey) {
    return <ArrowUpDown size={14} className={styles.sortIconNeutral} />
  }
  return currentSort.direction === 'asc'
    ? <ArrowUp   size={14} className={styles.sortIconActive} />
    : <ArrowDown size={14} className={styles.sortIconActive} />
}

// ── 主组件 ────────────────────────────────────────────────────────────────────

const DataTable = () => {
  const { current: variant } = useMockVariant()
  const rows = mockScenes[variant] ?? mockScenes.normal

  const [sort, setSort] = useState<SortState>({ key: null, direction: null })

  const displayRows = useMemo(() => sortRows(rows, sort), [rows, sort])

  const handleSort = (sortKey: SortKey | undefined) => {
    if (!sortKey) return
    setSort(prev => nextSort(prev, sortKey))
  }

  return (
    <div className={styles.page}>
      {/* 页头 */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>数据表格</h1>
        <span className={styles.headerMeta}>共 {rows.length} 条</span>
      </div>

      {/* 表格区域 */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={`${styles.th} ${styles[`align${col.align.charAt(0).toUpperCase() + col.align.slice(1)}`]}`}
                  onClick={() => handleSort(col.sortKey)}
                  data-sortable={col.sortKey ? 'true' : undefined}
                >
                  <span className={styles.thInner}>
                    {col.label}
                    {col.sortKey && (
                      <SortIcon sortKey={col.sortKey} currentSort={sort} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {displayRows.length > 0 && (
            <tbody>
              {displayRows.map((row, idx) => {
                const statusCfg = STATUS_CONFIG[row.status]
                return (
                  <tr key={row.id} className={styles.tr}>
                    {/* 行号 */}
                    <td className={`${styles.td} ${styles.alignCenter} ${styles.tdIndex}`}>
                      {idx + 1}
                    </td>
                    {/* 姓名 */}
                    <td className={`${styles.td} ${styles.tdName}`}>
                      {row.name}
                    </td>
                    {/* 邮箱 */}
                    <td className={`${styles.td} ${styles.tdEmail}`}>
                      {row.email ?? <span className={styles.empty}>—</span>}
                    </td>
                    {/* 角色 */}
                    <td className={styles.td}>{row.role}</td>
                    {/* 状态 */}
                    <td className={`${styles.td} ${styles.alignCenter}`}>
                      <Tag label={statusCfg.label} color={statusCfg.color} />
                    </td>
                    {/* 金额 */}
                    <td className={`${styles.td} ${styles.alignRight} ${styles.tdAmount}`}>
                      {formatAmount(row.amount)}
                    </td>
                    {/* 注册日期 */}
                    <td className={`${styles.td} ${styles.alignRight} ${styles.tdDate}`}>
                      {row.createdAt}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>

        {/* 空状态：放在 tableWrapper 内，表头保持可见 */}
        {displayRows.length === 0 && (
          <EmptyState
            icon={Table2}
            description="当前列表为空，可以切换左侧的 Mock 变体查看其他效果"
          />
        )}
      </div>
    </div>
  )
}

export default DataTable
