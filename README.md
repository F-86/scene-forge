# Scene Forge

一个用于测试各类 UI 场景的 React 单页面原型项目。数据全部使用 Mock，覆盖空数据、少量数据、正常数据量、大数据量及边界值等场景，用于快速验证页面在不同数据状态下的表现。

---

## 项目目标

- 以最小成本验证 UI 场景在不同数据量下的表现
- 无需后端依赖，Mock 数据可随时构造、随时切换
- 每个场景独立维护，互不干扰

---

## 目录结构

```
scene-forge/
├── docs/
│   ├── standards/              # 项目规范文档
│   │   ├── code-style.md       # 代码规范
│   │   ├── documentation.md    # 文档规范
│   │   ├── requirements.md     # 需求描述规范
│   │   ├── testing.md          # 测试规范
│   │   └── git-commit.md       # Git 提交规范
│   └── requirements/           # 各场景需求文档
│       └── scenes/             # 按场景分文件存放
├── src/
│   ├── components/             # 通用组件
│   ├── scenes/                 # 场景页面（核心目录）
│   ├── mock/                   # Mock 数据工厂
│   ├── types/                  # 全局类型定义
│   └── utils/                  # 工具函数
└── README.md
```

---

## 快速上手

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

---

## 场景开发流程

```
1. 在 docs/requirements/scenes/ 下新建场景需求文档
        ↓
2. 在 src/scenes/ 下新建场景目录
        ↓
3. 在场景目录的 mock.ts 中定义各数据量变体
        ↓
4. 开发组件，从 mock.ts 引入数据，禁止在组件内硬编码
        ↓
5. 对照 docs/standards/testing.md 中的验收 Checklist 逐项验证
        ↓
6. 在需求文档中勾选已通过项，更新状态为「已完成」
```

---

## 规范文档索引

| 文档 | 说明 |
|------|------|
| [代码规范](docs/standards/code-style.md) | 目录结构、命名、组件写法、Mock 数据管理 |
| [文档规范](docs/standards/documentation.md) | 文档格式、命名、文件头部模板 |
| [需求描述规范](docs/standards/requirements.md) | 场景需求模板、分类标签定义 |
| [测试规范](docs/standards/testing.md) | 测试策略、验收 Checklist、单元测试写法 |
| [Git 提交规范](docs/standards/git-commit.md) | 提交格式、类型说明、示例 |

---

## Mock 场景覆盖

每个场景的 `mock.ts` 须覆盖以下数据量变体：

| 变体 | 数据量 | 用途 |
|------|--------|------|
| `empty` | 0 条 | 验证空状态 UI |
| `single` | 1 条 | 验证单条布局 |
| `normal` | 10 条 | 验证常规展示 |
| `large` | 100 条以上 | 验证性能与虚拟滚动 |
| `withEdge` | 若干 | 验证超长文本、空字段等边界值 |
