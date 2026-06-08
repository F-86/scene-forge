/** 用户卡片数据项 */
export interface UserItem {
  /** 唯一标识 */
  id: string
  /** 用户名 */
  name: string
  /** 简介 / Bio */
  bio: string
  /** 头像背景色（十六进制） */
  avatarColor: string
  /** 头像显示文字（姓名首字） */
  avatarLabel: string
  /** 标签列表 */
  tags: string[]
  /** 粉丝数 */
  followers: number
}
