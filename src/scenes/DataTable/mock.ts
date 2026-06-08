/** 数据表格场景 Mock 数据 */
import type { TableRow, RowStatus } from './types'

// ── 常量 ─────────────────────────────────────────────────────────────────────

/** 可用角色列表 */
const ROLES = ['管理员', '普通用户', '访客', '运营', '财务'] as const

/** 可用状态列表 */
const STATUSES: RowStatus[] = ['active', 'inactive', 'pending']

/** 随机颜色备用池（头像等场景，此处留作参考） */
const SURNAMES = ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '吴', '周',
                  '徐', '孙', '马', '胡', '朱', '郭', '何', '林', '高', '罗']
const GIVEN_NAMES = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋',
                     '勇', '艳', '杰', '涛', '明', '超', '秀英', '霞', '平', '刚']

// ── 工厂函数 ──────────────────────────────────────────────────────────────────

/**
 * 生成单条表格行数据
 * @param index 行序号（0 起），用于生成可预期的伪随机数据
 * @param overrides 覆盖字段
 */
const createTableRow = (index: number, overrides: Partial<TableRow> = {}): TableRow => {
  const surname = SURNAMES[index % SURNAMES.length]
  const givenName = GIVEN_NAMES[(index * 3 + 7) % GIVEN_NAMES.length]
  const name = `${surname}${givenName}`
  const role = ROLES[index % ROLES.length]
  const status = STATUSES[index % STATUSES.length]

  // 金额范围：0 ~ 9,999,900 分（0 ~ 99,999 元）
  const amount = (index * 137 + 500) % 10_000_000

  // 日期：从 2024-01-01 起，每隔若干天
  const baseDate = new Date('2024-01-01')
  baseDate.setDate(baseDate.getDate() + index * 13)
  const createdAt = baseDate.toISOString().slice(0, 10)

  return {
    id: `row-${String(index + 1).padStart(4, '0')}`,
    name,
    email: `${surname.toLowerCase()}${index + 1}@example.com`,
    role,
    status,
    amount,
    createdAt,
    ...overrides,
  }
}

/**
 * 批量生成 n 条数据
 */
const createTableRows = (n: number): TableRow[] =>
  Array.from({ length: n }, (_, i) => createTableRow(i))

// ── 边界值数据 ────────────────────────────────────────────────────────────────

const edgeRows: TableRow[] = [
  // 超长姓名
  createTableRow(0, {
    id: 'edge-001',
    name: '这是一个非常非常非常非常非常非常非常长的用户姓名用于测试截断',
  }),
  // 超长邮箱
  createTableRow(1, {
    id: 'edge-002',
    email: 'very-long-email-address-for-testing-ellipsis-behavior@very-long-domain-name-example.com',
  }),
  // 邮箱为空
  createTableRow(2, {
    id: 'edge-003',
    email: undefined,
  }),
  // 金额为 0
  createTableRow(3, {
    id: 'edge-004',
    amount: 0,
  }),
  // 金额超大（9,999,999,900 分 = ~1 亿元）
  createTableRow(4, {
    id: 'edge-005',
    amount: 9_999_999_900,
  }),
  // 全部状态均为 pending
  createTableRow(5, { id: 'edge-006', status: 'pending' }),
  createTableRow(6, { id: 'edge-007', status: 'pending' }),
  // inactive 状态
  createTableRow(7, { id: 'edge-008', status: 'inactive' }),
]

// ── 导出 ──────────────────────────────────────────────────────────────────────

/** 数据表格场景 Mock 变体 */
export const mockScenes = {
  /** 空状态：0 条 */
  empty: [] as TableRow[],
  /** 单行：1 条 */
  single: createTableRows(1),
  /** 常规：15 条，三种状态均有分布 */
  normal: createTableRows(15),
  /** 大数据量：200 条，验证渲染性能 */
  large: createTableRows(200),
  /** 边界值：超长文本、空邮箱、金额为 0 等 */
  withEdge: edgeRows,
}
