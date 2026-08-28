# DSH Message Locator

为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 提供当前对话中的用户消息定位器。

## 功能

插件只作用于 DSH Web 当前对话页面：

- 在对话右侧显示用户消息刻度；
- 点击刻度快速定位到对应的用户消息；
- 鼠标悬停或聚焦刻度时显示消息预览；
- 支持搜索当前对话中的用户消息；
- 支持加载更早的历史消息；
- 支持键盘操作：
  - `Ctrl/Cmd+Shift+F`：打开消息定位器；
  - `Enter`：定位到选中的消息；
  - `ArrowUp` / `ArrowDown`：切换选择；
  - `Alt+ArrowUp` / `Alt+ArrowDown`：上一条/下一条用户消息；
  - `Esc`：关闭面板。

插件不会修改消息内容，也不影响其他网页或 DSH 的其他功能。

## 目录结构

```text
lib/
  index.js   # Host 半，无业务逻辑
  client.js  # Web Client 半
package.json
README.md
```

## 安装到 DSH Web Profile

### 1. 将插件放入 Profile 依赖

在 `~/.dsh/profiles/web/package.json` 的 `dependencies` 中加入：

```json
"dsh-message-locator": "github:<你的 GitHub 用户名>/<你的仓库名>#subdirectory=dsh-message-locator"
```

如果插件单独放在一个仓库根目录，则使用：

```json
"dsh-message-locator": "github:<你的 GitHub 用户名>/<你的仓库名>"
```

也可以使用本地目录：

```json
"dsh-message-locator": "file:/绝对路径/dsh-message-locator"
```

### 2. 安装依赖

在 Profile 目录执行：

```bash
pnpm install
```

### 3. 加入 Profile composition patch

编辑 `~/.dsh/profiles/web/cordis.patch.yml`，加入：

```yaml
- insert:
    - id: ui-message-locator
      name: dsh-message-locator
```

如果已有一个 `insert` 项，把插件条目放入同一个 `insert` 列表即可。

### 4. 重启 DSH Web

首次安装或更新静态 Web Client 模块后，需要重启 DSH Web/CLI；之后刷新页面即可验证。

## 从压缩包安装

解压 `dsh-message-locator.zip`，将解压后的插件目录放到你自己的 GitHub 仓库，然后按上面的 Profile 安装步骤配置。

## 使用提示

- 定位器只统计当前 DOM 中已加载的用户消息；使用“加载更早”后会自动更新刻度。
- 当当前页面没有可见对话时，定位器会自动隐藏。
- 样式使用 DSH 主题 CSS 变量，兼容明暗主题。

## 开发说明

插件是 Web Client-only 功能，Host 半仅提供空的 `apply()`。客户端通过 DSH 的消息行标记和对话滚动容器工作，并在插件卸载时清理观察器、事件监听器、计时器和 DOM 节点。
