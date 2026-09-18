# DSH Message Locator

为 DeepSeek Harness Web 提供**整场会话**的用户消息搜索与定位。

## 功能

- Host 端通过 `dshMessageLocator` 会话投影折叠完整持久化日志；
- 页面首次打开时即可一次展示整场会话中的全部人类用户消息，包括尚未分页载入的历史；
- 不再通过扫描当前 DOM 收集消息文本；DOM 仅用于判断目标是否已经渲染和执行最终落点；
- 点击未加载的历史消息时调用 DSH `session.loadThrough(seq)`，自动连续向前分页并定位；
- 搜索整场会话的用户消息；
- 同一轮中的普通提问和 steering 用户消息分别建立索引；
- 图片-only 用户消息也会进入索引并显示为“图片消息”；
- 鼠标悬停或聚焦刻度时显示消息预览及加载状态；
- 插件挂载时自动隐藏 DSH 内置的可视 Turn Rail，卸载时自动恢复；只隐藏 UI，不禁用 `session-turn-outline` 投影；
- 键盘操作：
  - `Ctrl/Cmd+Shift+F`：打开消息定位器；
  - `Enter`：定位到选中的消息；
  - `ArrowUp` / `ArrowDown`：切换搜索结果；
  - `Alt+ArrowUp` / `Alt+ArrowDown`：上一条/下一条用户消息；
  - `Esc`：关闭面板。

插件不会修改消息内容。

## 实现结构

```text
lib/
  index.js   # Host：注册 dshMessageLocator 整会话投影
  client.js  # Web Client：读取投影、搜索、自动分页和定位
test/
  projection.test.js       # Host 投影折叠语义
  client-session.test.js   # 当前会话解析 + 已移除字段的回归防护
package.json
README.md
```

### 当前会话如何解析

`SessionListState` **没有** `current` 字段（DSH 提交 `6830e1460d` 的 “own Client
Session generations” 重构删除了它）。会话选择现在通过普通引用所有权表达：屏幕上
的会话就是 `retainedBy.mainView > 0` 的那一行，这与 `ui-session`、`ui-layout`、
`ui-workspace`、`ui-settings-general` 等内置消费方读取当前会话的方式一致。

读取已删除的 `list.current` 会永远得到 `undefined`，从而让定位器静默失去会话绑定：
列表与状态栏会一直停留在“正在读取整场会话索引…”。`client-session.test.js` 对此
设有回归防护。

`core.autocrlf`：仓库中的文本文件以 LF 存储。

投影中的每条消息包含：

```js
{
  id,        // 稳定消息 id
  seq,       // user/message 的持久化事件序号；用于 loadThrough
  turn,      // 当时所在轮次，无法归属时为 null
  text,      // 归一化后的完整可搜索文本，单条最多 4000 字符
  hasImages  // 是否包含图片块
}
```

只索引 `source.kind === "user"` 的 `user/message`，不会把插件注入上下文或工具结果暴露到定位器。

## 安装到 DSH Web Profile

### 1. 加入 Profile 依赖

编辑 `~/.dsh/profiles/web/package.json`：

```json
{
  "dependencies": {
    "dsh-message-locator": "file:D:/DeepSeek/tpd/dsh-message-locator"
  }
}
```

也可以改为 GitHub 或 npm 地址。`@deepseek-ai/dsh-session-projection` 是 DSH Web App 已装配的 Host 能力；常规 DSH Profile 无需额外安装。如果某个自定义 Profile 的依赖隔离无法解析该 peer，可在该 Profile 中显式加入与当前 DSH 版本一致的 `@deepseek-ai/dsh-session-projection`。

### 2. 安装依赖

```bash
pnpm install
```

### 3. 加入 composition patch

编辑 `~/.dsh/profiles/web/cordis.patch.yml`：

```yaml
- insert:
    - id: ui-message-locator
      name: dsh-message-locator
```

同一个插件条目同时装配 Host 投影和 Web Client half。

### 4. 重启 DSH Web

Host 投影代码或静态 Client 模块更新后必须重启当前 DSH Web 进程，再刷新页面。只刷新页面不能装载新的 Host 插件实现。

## 长会话行为

- 投影值随会话消息数线性增长，并随 projection baseline/change feed 传到客户端；
- 每条文本上限为 4000 字符，避免超大单消息无限放大投影；
- 点击尚未加载的消息时，`loadThrough(seq)` 使用 DSH 内置的连续分页器（当前实现每批最多 200 条 message）；
- 如果另一个普通“加载更早”请求正在占用分页器，插件会先等待 busy 状态结束再发起定向加载；
- 最终定位仍需要目标消息进入 Chat DOM，因此被当前视图隐藏或不再渲染的消息会显示“已载入，但目标消息当前不可见”。

## 测试

```bash
npm test
```

测试覆盖整会话消息收集、同轮多条用户消息、非人类上下文过滤、图片-only 消息、文本长度上限、wire 顺序校验及稳定消息 id 更新。
