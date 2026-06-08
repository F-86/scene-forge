---
description: 在 scene-forge 项目中从零开发一个新的 UI 场景，包含建分支、通用组件提取、场景文件编写、路由注册全流程
---

TRIGGER when: 用户想开发/新建/实现一个新的 UI 场景或页面，例如"开发 XX 场景"、"新建一个 XX 的场景"、"实现 XX 列表/表单/看板"等。

从用户描述中推导场景名（PascalCase，如 `VirtualList`），无法确定时先询问用户，确认后：

执行前检查（失败则停止，提示用户处理后重试）：
1. `git branch --show-current` 确认在 `main` 分支，否则提示用户先执行 `git checkout main`
2. 读取 `docs/branches.md`，确认场景不存在，若已存在则告知用户匹配的分支和用途，等待用户确认是否继续

检查通过后执行：

```
/new-scene <SceneName>
```
