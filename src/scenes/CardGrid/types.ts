/** 卡片网格场景的单条数据项 */
export interface CardItem {
  id: string
  /** 卡片标题 */
  title: string
  /** 卡片描述 */
  description: string
  /** 标签文字 */
  tag: string
  /** 标签颜色（CSS 颜色值） */
  tagColor: string
  /** 头像背景色 */
  avatarColor: string
  /** 头像显示文字（首字缩写） */
  avatarLabel: string
  /** 作者名 */
  author: string
  /** 统计数字（如点赞数、查看数等） */
  statCount: number
}
