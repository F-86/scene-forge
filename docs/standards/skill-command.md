# Skill + Command 分层规范

本项目采用 **skill 做意图路由、command 定义执行流程** 的两层模式来组织自定义斜杠命令。

## 为什么分层：渐进式披露

这种分层本质上是**渐进式披露**在 AI 工作流中的应用——只在需要时才暴露细节，而不是把所有信息一次性堆给读者。

`skills/` 中的文件在**会话启动时全部注入系统提示**，Claude 每次对话都会读到它们。内容越多，占用的上下文越多，信噪比越低。`commands/` 中的文件只在命令被调用时才读取，适合存放详细的执行步骤。

分层后，信息在恰当的时机出现：
- **Skill**：始终可见，但极度精简——只有触发条件和调用指令，不超过 20 行
- **Command**：按需加载，内容完整——所有执行细节只在真正需要执行时才出现

这与 README 的渐进式披露逻辑相同：`docs/README.md` 给导航表，`docs/standards/README.md` 给规范目录，具体规范文件才给完整内容。每一层都只做"让你知道下一步去哪里"，而不是把所有内容平铺到同一个地方。

## 目录结构

```
.claude/
├── skills/          # 意图路由层：TRIGGER + 参数收集 + 前置检查 + 调用 command
│   └── <name>.md
└── commands/        # 执行层：完整的操作步骤（不含失败停止型前置检查）
    └── <name>.md
```

同名的 skill 和 command 成对出现，skill 是 command 的入口。

## Skill 文件规范

职责：**识别用户意图 → 收集参数 → 执行前置检查 → 调用对应 command**。

Skill 包含两类内容，不包含其他任何内容：
- **失败停止型前置检查**：失败时直接中止并提示用户，不加载 command（见「检查步骤的放置原则」）
- **调用 command 的指令**：检查全部通过后才触发

```markdown
---
description: <一句话描述这个命令做什么>
---

TRIGGER when: <触发条件，描述用户说什么话时自动激活>

<参数收集逻辑，说明如何从对话中提取或推断参数，无法确定时如何询问用户>

参数确认后执行：

​```
/<command-name> <参数>
​```
```

**要求：**
- `description` 必填，用于系统提示中的 skill 列表展示
- TRIGGER 条件要具体，列出典型的用户表达方式
- 参数收集要说明推断规则和兜底行为（询问用户）
- 无参数的命令，TRIGGER 后直接写"执行 `/xxx`"
- **不写实质性操作步骤**（创建文件、运行脚本、修改代码等），保持文件简短（10-25 行）

## Command 文件规范

职责：**完整定义操作流程**，skill 和用户都可以直接调用。

```markdown
---
description: <与对应 skill 相同的一句话描述>
allowed-tools: <所需工具，如 Bash, Read, Write, Edit>
argument-hint: <参数格式说明，如 <SceneName>>
---

<参数说明：解释 $ARGUMENTS 的格式和含义>

## 第一步：xxx
...

## 注意事项
...
```

**要求：**
- `description` 与对应 skill 保持一致
- `allowed-tools` 按实际需要声明，不多写
- `argument-hint` 帮助用户补全参数格式
- 步骤编号清晰，每步职责单一
- 包含注意事项和错误处理说明

## 完整示例

**`skills/new-scene.md`**（意图路由，~20 行）：
```markdown
---
description: 在项目中从零开发一个新的 UI 场景
---

TRIGGER when: 用户想开发/新建/实现一个新的 UI 场景，例如"开发 XX 场景"、"实现 XX 列表"等。

从用户描述中推导场景名（PascalCase），无法确定时先询问用户，确认后：

执行前检查（失败则停止，提示用户处理后重试）：
1. `git branch --show-current` 确认在 `main` 分支，否则提示用户先执行 `git checkout main`
2. 读取 `docs/branches.md`，确认场景不存在，若已存在则提示用户确认是否继续

检查通过后执行：
​```
/new-scene <SceneName>
​```
```

**`commands/new-scene.md`**（执行流程，完整步骤）：
```markdown
---
description: 在项目中从零开发一个新的 UI 场景
allowed-tools: Bash, Read, Write, Edit
argument-hint: <SceneName>
---

场景名：$ARGUMENTS

## Step 1：需求与技术方案确认
...（完整步骤，不含任何前置检查）
```

## 没有对应 command 的 skill

如果一个能力不需要斜杠命令（纯对话触发、无需详细步骤），可以只写 skill 文件，步骤直接写在 skill 里。但只要步骤超过 20 行，就应该拆出 command。

## 步骤标题格式

Command 文件中每一步的标题必须使用以下模板：

```
## Step N：<步骤描述>
```

- `N` 为阿拉伯数字（1、2、3……），不使用中文序数（~~第一步~~）
- 冒号使用全角 `：`
- 描述简短，动宾结构，如 `Step 1：查重`、`Step 3：创建场景分支`

## 检查步骤的放置原则

### 原则一：检查类步骤尽量靠前

无论是 skill 还是 command，**所有检查类步骤应集中在最前面**，在任何实质性操作（创建文件、切分支、运行脚本）之前完成。好处是：失败越早发现，浪费的工作越少。

### 原则二：按「失败时是否停止执行」决定放在哪里

| 检查失败时的行为 | 应放在 | 原因 |
|---------------|--------|------|
| **停止执行**，等待用户操作（如切分支、确认重复）| **skill 内联** | 失败时 command 根本未加载，零 token 浪费 |
| **不停止**，自动修复后继续（如补写缺失的导出行）| **command 内部** | 一定会执行完，加载成本被摊销 |

**典型例子：**
- 「确认当前在 main 分支」— 失败时停止等用户切分支 → 写在 skill
- 「确认本地分支存在」— 失败时停止等用户建分支 → 写在 skill
- 「确认 index.ts 已导出该组件」— 失败时自动补上继续 → 写在 command

### 原则三：skill 内联检查的写法

```markdown
执行前检查（失败则停止，提示用户处理后重试）：
1. `git branch --show-current` 确认在 `main` 分支，否则提示用户先执行 `git checkout main`
2. 确认 `src/ui/<ComponentName>/` 目录存在，否则提示先创建组件文件
```

检查通过后，再调用 command。

## Skill 编排多个 Command

当一个功能需要**先查再做**（如先查重再创建）时，skill 负责编排顺序，把多个 command 串联起来。写法：

```markdown
确认后按以下顺序执行：

1. 先执行 `/check-xxx <参数>`
   - 若返回「已存在」，等待用户确认，不继续
   - 若返回「不存在」，继续下一步

2. 再执行 `/new-xxx <参数>`
```

这样 command 本身职责单一（check 只负责查，new 只负责建），复用更灵活；skill 作为编排层控制流程，不把判断逻辑写死在任何一个 command 里。

## 命名规则

- skill 和 command 文件名**必须相同**
- 使用 kebab-case，如 `new-scene.md`、`promote-to-ui.md`
