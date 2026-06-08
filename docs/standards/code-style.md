---
名称：代码规范
创建日期：2026-06-08
更新日期：2026-06-08
---

# 代码规范

## 一、包管理器

本项目使用 **pnpm**，禁止使用 npm 或 yarn。

```bash
pnpm install          # 安装依赖
pnpm add <package>    # 新增依赖
pnpm dev              # 启动开发服务器
```

## 三、目录结构

```
src/
├── components/           # 通用组件
│   └── ComponentName/
│       ├── index.tsx
│       └── index.module.css
├── scenes/               # 场景页面（核心目录）
│   └── SceneName/
│       ├── index.tsx     # 场景入口
│       ├── mock.ts       # 该场景的 Mock 数据
│       └── types.ts      # 该场景的类型定义
├── mock/
│   ├── index.ts          # Mock 统一出口
│   └── factory.ts        # Mock 数据生成工厂函数
├── types/                # 全局类型定义
└── utils/                # 工具函数
```

## 四、命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `UserCard.tsx` |
| 非组件文件 | camelCase | `formatDate.ts` |
| 场景目录 | PascalCase | `scenes/EmptyList/` |
| CSS 类名 | camelCase（CSS Modules） | `.listWrapper` |
| Mock 变量 | `mock` + 场景描述 | `mockEmptyList` |
| 类型定义 | PascalCase + 语义后缀 | `UserItem`、`ApiResponse` |

## 五、组件分层规范

开发场景时，**从写代码阶段就强制区分通用层和场景层**，不要写完再回头提取。

### 判断标准

| 应放到 `src/ui/`（通用层） | 应留在 `src/scenes/SceneName/`（场景层） |
|--------------------------|----------------------------------------|
| 纯 UI 原语，不含业务逻辑 | 包含业务字段、业务状态的组件 |
| 接口只有样式/交互相关 prop | 与当前场景数据结构紧耦合 |
| 下一个场景大概率用得到 | 其他场景几乎不会用到 |
| 例：Toggle、Field、Badge | 例：StatusBadge（特定状态配置）、UserRow |

### 开发流程

```
1. 开始写场景组件时，先识别哪些子组件是通用的
2. 通用子组件直接写到 src/ui/<ComponentName>/index.tsx
3. 场景专属代码写在 src/scenes/<SceneName>/
4. 开发完成后，用 /promote-to-ui <ComponentName> 将通用组件提交到 main
5. 最后提交场景专属代码
```

### 禁止

- ❌ 禁止把通用 UI 原语内联在场景组件里（写完再提取会造成 git 历史混乱）
- ❌ 禁止在 `src/ui/` 中放含业务逻辑的组件（如特定状态枚举、特定数据字段）

## 六、组件规范

```tsx
// ✅ 标准组件结构
interface Props {
  data: UserItem[];     // 必须定义 Props 类型
  loading?: boolean;
}

// 使用具名函数，便于调试时识别组件名
const UserList = ({ data, loading = false }: Props) => {
  // 1. Hooks
  // 2. 派生状态 / 计算变量
  // 3. 事件处理函数
  // 4. 渲染
  return <div />;
};

export default UserList;
```

## 六、Mock 数据规范

Mock 数据必须集中管理，不允许在组件内直接硬编码。

```ts
// mock/factory.ts —— 工厂函数统一生成基础数据
export const createUser = (overrides?: Partial<User>): User => ({
  id: 'user-001',
  name: '张三',
  age: 28,
  ...overrides,         // 允许覆盖，便于构造特殊场景
});

// scenes/UserList/mock.ts —— 场景级别 Mock
export const mockScenes = {
  empty: [],                                          // 空数据场景
  single: [createUser()],                             // 单条数据
  normal: Array.from({ length: 10 }, (_, i) =>        // 正常数据量
    createUser({ id: `user-${i}` })
  ),
  large: Array.from({ length: 200 }, (_, i) =>        // 大数据量
    createUser({ id: `user-${i}` })
  ),
  withEdge: [                                          // 边界值场景
    createUser({ name: '' }),                          // 空字符串
    createUser({ name: '名'.repeat(50) }),             // 超长文本
  ],
};
```

## 七、禁止事项

- ❌ 禁止在组件内直接写 Mock 数据，必须从 `mock.ts` 引入
- ❌ 禁止使用 `any` 类型（特殊边界情况须注释说明原因）
- ❌ 禁止存在未使用的 import 和变量
- ❌ 禁止魔法数字，应提取为有意义的具名常量
