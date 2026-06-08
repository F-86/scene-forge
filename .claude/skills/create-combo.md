---
description: 从多个 scene 分支创建 combo 分支，用于同时展示多个场景
---

TRIGGER when: 用户想把多个场景合并展示、创建 combo 分支，例如"把 XX 和 XX 合到一起"、"创建一个包含 XX 场景的 combo"、"新建 combo 分支"等。

从用户描述中收集所需参数：
- **combo 分支名**：必须以 `combo/` 开头，用途命名而非枚举场景名（如 `combo/data-display`）；若用户未提供则根据场景组合推断，告知用户确认
- **scene 分支列表**：格式为 `scene/<name>`；若用户只说了场景名（如"basic-list 和 data-table"）自动补全前缀

参数收集完毕后，执行前检查（失败则停止，提示用户处理后重试）：
1. 确认参数格式正确：至少 2 个参数（combo 分支名 + 至少 1 个 scene 分支），combo 分支名必须以 `combo/` 开头
2. `git branch` 确认每个 scene 分支在本地存在，不存在则列出缺失的分支名，提示用户先创建

检查通过后执行：

```
/create-combo <combo分支名> <scene分支1> <scene分支2> ...
```
