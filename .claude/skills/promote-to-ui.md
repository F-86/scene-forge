---
description: 将当前场景分支中的通用 UI 组件提升到 main 分支的 src/ui/
---

TRIGGER when: 用户想把一个组件提升/移到 `src/ui/`、提交通用组件到 main，例如"promote XX 组件"、"把 XX 放到 ui 目录"、"提升 XX 到 main"等。

从用户描述中提取组件名（PascalCase），无法确定时先询问用户，确认后执行：

```
/promote-to-ui <ComponentName>
```
