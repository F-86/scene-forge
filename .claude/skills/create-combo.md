---
description: 从多个 scene 分支创建 combo 分支，用于同时展示多个场景
---

TRIGGER when: 用户想把多个场景合并展示、创建 combo 分支，例如"把 XX 和 XX 合到一起"、"创建一个包含 XX 场景的 combo"、"新建 combo 分支"等。

从用户描述中收集所需参数：
- **combo 分支名**：必须以 `combo/` 开头，用途命名而非枚举场景名（如 `combo/data-display`）；若用户未提供则根据场景组合推断，告知用户确认
- **scene 分支列表**：格式为 `scene/<name>`；若用户只说了场景名（如"basic-list 和 data-table"）自动补全前缀

参数确认后执行：

```
/create-combo <combo分支名> <scene分支1> <scene分支2> ...
```
