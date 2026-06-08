import { LayoutDashboard, List } from 'lucide-react'
import type { ComponentType } from 'react'

/** 场景配置项类型 */
export interface SceneConfig {
  path: string
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
}

/**
 * 场景注册列表
 * 新增场景时：
 * 1. 在 src/scenes/ 下建目录和组件
 * 2. 在此数组追加一条配置
 * 3. 在 App.tsx 的 Routes 中追加对应 Route
 */
export const SCENE_LIST: SceneConfig[] = [
  {
    path: '/',
    label: '首页',
    icon: LayoutDashboard,
  },
  {
    path: '/scenes/basic-list',
    label: '基础列表',
    icon: List,
  },
]
