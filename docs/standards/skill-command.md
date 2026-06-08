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
├── skills/          # 意图路由层：TRIGGER + 参数收集 + 调用 command
│   └── <name>.md
└── commands/        # 执行层：完整的操作步骤
    └── <name>.md
```

同名的 skill 和 command 成对出现，skill 是 command 的入口。

## Skill 文件规范

职责：**识别用户意图 → 收集参数 → 调用对应 command**，不包含任何执行步骤。

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
- **不写任何执行步骤**，保持文件简短（10-20 行）

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

**`skills/new-scene.md`**（意图路由，~15 行）：
```markdown
---
description: 在项目中从零开发一个新的 UI 场景
---

TRIGGER when: 用户想开发/新建/实现一个新的 UI 场景，例如"开发 XX 场景"、"实现 XX 列表"等。

从用户描述中推导场景名（PascalCase），无法确定时先询问用户，确认后执行：

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

## 第一步：确认在 main 分支
...（完整步骤）
```

## 没有对应 command 的 skill

如果一个能力不需要斜杠命令（纯对话触发、无需详细步骤），可以只写 skill 文件，步骤直接写在 skill 里。但只要步骤超过 20 行，就应该拆出 command。

## 命名规则

- skill 和 command 文件名**必须相同**
- 使用 kebab-case，如 `new-scene.md`、`promote-to-ui.md`
