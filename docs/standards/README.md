# docs/standards/

各项规范文档，约定项目的代码风格、Git 工作流、测试策略等。

## 文件列表

| 文件 | 内容 |
|------|------|
| [`code-style.md`](./code-style.md) | 目录结构、命名规范、组件分层、Mock 数据规范、禁止事项 |
| [`git-commit.md`](./git-commit.md) | 分支策略、提交格式、脚本工具（promote / sync / combo）完整用法 |
| [`requirements.md`](./requirements.md) | 场景需求文档模板、分类标签说明 |
| [`testing.md`](./testing.md) | 测试策略、场景验收 Checklist、单元测试规范 |
| [`documentation.md`](./documentation.md) | 文档写作规范、文件头部模板 |
| [`skill-command.md`](./skill-command.md) | Skill + Command 分层模式规范，说明如何新增自定义命令 |

## 核心原则

- **代码**：组件分层在开发阶段就确定，不要写完再提取；禁止 `any`、魔法数字、硬编码 Mock
- **Git**：`src/ui/` 的改动只能提交到 main；scene 分支永不合并回 main
- **测试**：原型项目以人工验收为主，对照 Checklist 逐项核查
