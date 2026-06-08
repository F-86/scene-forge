---
description: 将当前场景分支中的通用 UI 组件提升到 main 分支的 src/ui/
---

TRIGGER when: 用户想把一个组件提升/移到 `src/ui/`、提交通用组件到 main，例如"promote XX 组件"、"把 XX 放到 ui 目录"、"提升 XX 到 main"等。

从用户描述中提取组件名（PascalCase），无法确定时先询问用户，确认后：

执行前检查（失败则停止，提示用户处理后重试）：
1. `git branch --show-current` 确认当前在 `scene/*` 分支，否则提示用户先切换到对应场景分支
2. 确认 `src/ui/<ComponentName>/` 目录存在，否则提示用户先创建组件文件

检查通过后执行：

```
/promote-to-ui <ComponentName>
```
