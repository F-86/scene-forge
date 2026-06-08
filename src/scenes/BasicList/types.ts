/** 基础列表场景类型定义 */

/** 单条列表项数据 */
export interface ListItem {
  /** 唯一 ID */
  id: string
  /** 主标题 */
  title: string
  /** 副文本描述，可为空（用于空字段边界测试） */
  description?: string
  /** 标签文字 */
  tag: string
  /** 标签颜色（CSS 颜色值） */
  tagColor: string
  /** 头像背景色 */
  avatarColor: string
  /** 头像显示的文字（通常是首字或缩写） */
  avatarLabel: string
  /** 创建日期，格式 YYYY-MM-DD */
  createdAt: string
}
