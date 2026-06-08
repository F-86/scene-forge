---
名称：文档规范
创建日期：2026-06-08
更新日期：2026-06-08
---

# 文档规范

## 一、目录结构

```
docs/
├── code-style.md         # 代码规范
├── documentation.md      # 文档规范（本文件）
├── requirements.md       # 需求描述规范
├── testing.md            # 测试规范
├── git-commit.md         # Git 提交规范
└── requirements/         # 各场景需求文档
    └── scenes/           # 按场景分文件存放
```

## 二、写作规范

- **语言**：中文为主，技术术语保留英文原文
- **格式**：统一使用 Markdown
- **文件命名**：使用小写 + 连字符，如 `empty-state.md`
- **版本维护**：每次修改须同步更新文件头部的 `更新日期` 字段

## 三、文件头部模板

所有文档文件须在顶部附加以下元信息：

```markdown
---
场景名称：XXX
创建日期：YYYY-MM-DD
更新日期：YYYY-MM-DD
状态：草稿 / 进行中 / 已完成
---
```

## 四、场景文档命名示例

| 场景 | 文件名 |
|------|--------|
| 用户列表为空 | `user-list-empty.md` |
| 用户列表大数据量 | `user-list-large.md` |
| 表单字段边界值 | `form-field-edge.md` |
