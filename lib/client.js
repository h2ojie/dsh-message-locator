window.__ModuleLoader__.load({
  id: "dsh-message-locator",
  factory: () => {
    var module = { exports: {} };
    var exports = module.exports;

    const PROJECTION_KEY = "dshMessageLocator";
    const STYLE_ID = "dsh-message-locator/styles";
    const ROOT_ID = "dsh-message-locator-root";
    const MESSAGE_KEY_PREFIX = "13:input-message";
    const MESSAGE_ROW_SELECTOR = '[data-chat-flow-kind="user"], [data-chat-flow-kind="steering"]';

    const CSS = `
      /* The custom locator replaces only the built-in visual Turn Rail. The
         session-turn-outline projection stays mounted and available. */
      html[data-dsh-message-locator="true"] nav[aria-label="轮次导航"],
      html[data-dsh-message-locator="true"] nav[aria-label="Turn navigation"] { display: none !important; }
      #dsh-message-locator-root { position: fixed; z-index: 80; inset: 0 var(--dml-right, 0px) 0 auto; width: 54px; pointer-events: none; font-family: inherit; }
      #dsh-message-locator-root .dml-rail { position: absolute; right: 6px; top: var(--dml-rail-top, 92px); width: 46px; height: var(--dml-rail-height, calc(100vh - 184px)); pointer-events: none; }
      #dsh-message-locator-root .dml-open { position: absolute; right: 0; top: 0; width: 28px; height: 28px; padding: 0; border: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,.15)); border-radius: 8px; color: var(--dsw-alias-label-secondary, #bbb); background: var(--dsw-alias-bg-layer-3, #2b2b2b); cursor: pointer; pointer-events: auto; font-size: 15px; box-shadow: 0 3px 14px rgba(0,0,0,.2); }
      #dsh-message-locator-root .dml-open:hover, #dsh-message-locator-root .dml-open:focus-visible, #dsh-message-locator-root .dml-open[aria-expanded="true"] { color: var(--dsw-alias-label-primary, #fff); border-color: var(--dsw-static-deepseek-500, #4ba3ff); }
      #dsh-message-locator-root .dml-marks { position: absolute; right: -2px; top: 50%; display: flex; width: 44px; flex-direction: column; align-items: flex-end; transform: translateY(-50%); pointer-events: auto; }
      #dsh-message-locator-root .dml-marks:empty { display: none; }
      #dsh-message-locator-root .dml-mark { position: relative; display: block; flex: 0 0 var(--dml-mark-pitch, 8px); width: 44px; height: var(--dml-mark-pitch, 8px); min-height: 0; padding: 0; border: 0; background: transparent; cursor: pointer; }
      #dsh-message-locator-root .dml-mark::before { position: absolute; right: 2px; top: 50%; width: 16px; height: var(--dml-mark-thickness, 2px); border-radius: 2px; background: var(--dsw-alias-label-tertiary, #858585); content: ""; opacity: .72; transform: translateY(-50%); transition: width 120ms ease, height 120ms ease, opacity 120ms ease, background-color 120ms ease; }
      #dsh-message-locator-root .dml-mark[data-loaded="false"]::before { width: 10px; opacity: .38; }
      #dsh-message-locator-root .dml-mark:hover::before, #dsh-message-locator-root .dml-mark:focus-visible::before { width: 28px; height: 3px; background: var(--dsw-static-deepseek-500, #4ba3ff); opacity: 1; }
      #dsh-message-locator-root .dml-mark[aria-current="true"]::before { width: 40px; height: 3px; background: var(--dsw-static-deepseek-500, #4ba3ff); opacity: 1; }
      #dsh-message-locator-root .dml-mark[data-busy="true"]::before { animation: dml-pulse 900ms ease-in-out infinite; }
      #dsh-message-locator-root .dml-preview { position: fixed; z-index: 2; right: calc(var(--dml-right, 0px) + 62px); top: 50%; width: min(330px, calc(100vw - 96px)); padding: 11px 12px; border: 1px solid var(--dsw-alias-border-inverted, rgba(255,255,255,.14)); border-radius: 12px; color: var(--dsw-alias-label-primary, #eee); background: var(--dsw-alias-bg-layer-3, #292929); box-shadow: 0 12px 34px rgba(0,0,0,.34); pointer-events: none; transform: translateY(-50%); }
      #dsh-message-locator-root .dml-preview[hidden] { display: none; }
      #dsh-message-locator-root .dml-preview-index { margin-bottom: 4px; color: var(--dsw-static-deepseek-500, #4ba3ff); font-size: 11px; font-variant-numeric: tabular-nums; }
      #dsh-message-locator-root .dml-preview-text { display: -webkit-box; overflow: hidden; color: var(--dsw-alias-label-primary, #eee); font-size: 13px; line-height: 19px; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
      #dsh-message-locator-root .dml-preview-state { margin-top: 5px; color: var(--dsw-alias-label-tertiary, #999); font-size: 11px; }
      #dsh-message-locator-root .dml-panel { position: fixed; right: calc(var(--dml-right, 0px) + 62px); top: 50%; display: flex; width: min(390px, calc(100vw - 78px)); max-height: min(600px, calc(100vh - 32px)); flex-direction: column; overflow: hidden; border: 1px solid var(--dsw-alias-border-inverted, rgba(255,255,255,.14)); border-radius: 14px; color: var(--dsw-alias-label-primary, #eee); background: var(--dsw-alias-bg-layer-3, #292929); box-shadow: 0 12px 40px rgba(0,0,0,.36); pointer-events: auto; transform: translateY(-50%); }
      #dsh-message-locator-root .dml-panel[hidden] { display: none; }
      #dsh-message-locator-root .dml-panel-head { display: flex; align-items: center; gap: 8px; padding: 12px 12px 8px; }
      #dsh-message-locator-root .dml-title { flex: 1; font-size: 14px; font-weight: 600; }
      #dsh-message-locator-root .dml-close { border: 0; color: var(--dsw-alias-label-tertiary, #999); background: transparent; cursor: pointer; font-size: 18px; line-height: 20px; }
      #dsh-message-locator-root .dml-search { box-sizing: border-box; width: calc(100% - 24px); margin: 0 12px 8px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-inverted, rgba(255,255,255,.14)); border-radius: 8px; outline: none; color: var(--dsw-alias-label-primary, #eee); background: transparent; font: inherit; }
      #dsh-message-locator-root .dml-search:focus { border-color: var(--dsw-static-deepseek-500, #4ba3ff); }
      #dsh-message-locator-root .dml-list { min-height: 0; overflow: auto; padding: 2px 6px 8px; }
      #dsh-message-locator-root .dml-item { display: grid; width: 100%; grid-template-columns: 30px minmax(0, 1fr) auto; gap: 6px; padding: 9px 8px; border: 0; border-radius: 8px; color: inherit; background: transparent; text-align: left; cursor: pointer; }
      #dsh-message-locator-root .dml-item:hover, #dsh-message-locator-root .dml-item.dml-selected { background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.08)); }
      #dsh-message-locator-root .dml-item:focus-visible { outline: 2px solid var(--dsw-static-deepseek-500, #4ba3ff); outline-offset: -2px; }
      #dsh-message-locator-root .dml-item-index { color: var(--dsw-static-deepseek-500, #4ba3ff); font-size: 11px; font-variant-numeric: tabular-nums; }
      #dsh-message-locator-root .dml-item-text { display: -webkit-box; overflow: hidden; color: var(--dsw-alias-label-primary, #eee); font-size: 13px; line-height: 18px; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
      #dsh-message-locator-root .dml-item-state { align-self: center; color: var(--dsw-alias-label-tertiary, #999); font-size: 10px; white-space: nowrap; }
      #dsh-message-locator-root .dml-item[data-loaded="false"] .dml-item-state { color: var(--dsw-static-deepseek-500, #4ba3ff); }
      #dsh-message-locator-root .dml-empty { padding: 18px 10px; color: var(--dsw-alias-label-tertiary, #999); font-size: 13px; text-align: center; }
      #dsh-message-locator-root .dml-panel-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 12px; border-top: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,.1)); color: var(--dsw-alias-label-tertiary, #999); font-size: 11px; }
      #dsh-message-locator-root .dml-load { flex: 0 0 auto; padding: 0; border: 0; color: var(--dsw-static-deepseek-500, #4ba3ff); background: transparent; cursor: pointer; font: inherit; }
      #dsh-message-locator-root .dml-load:disabled { cursor: default; opacity: .55; }
      #dsh-message-locator-root .dml-help { padding: 8px 12px 10px; border-top: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,.1)); color: var(--dsw-alias-label-tertiary, #999); font-size: 11px; }
      #dsh-message-locator-root .dml-flash { animation: dml-flash 1.3s ease-out; }
      @keyframes dml-flash { 0%, 100% { box-shadow: none; } 20% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--dsw-static-deepseek-500, #4ba3ff) 35%, transparent); } }
      @keyframes dml-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
      @media (max-width: 720px) { #dsh-message-locator-root { width: 50px; } #dsh-message-locator-root .dml-rail { right: 4px; } #dsh-message-locator-root .dml-panel, #dsh-message-locator-root .dml-preview { right: calc(var(--dml-right, 0px) + 54px); } }
      @media (prefers-reduced-motion: reduce) { #dsh-message-locator-root .dml-mark::before { transition: none; animation: none; } #dsh-message-locator-root .dml-flash { animation: none; } }
    `;

    function installStyle() {
      if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`)) return;
      const style = document.createElement("style");
      style.dataset.plugin = "dsh-message-locator";
      style.dataset.pluginCss = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    function shortText(text, hasImages, limit = 90) {
      const visible = text || (hasImages ? "[图片消息]" : "[无文本消息]");
      return visible.length <= limit ? visible : `${visible.slice(0, limit - 1)}…`;
    }

    function projectedMessages(value) {
      if (!Array.isArray(value)) return [];
      const result = [];
      const ids = new Set();
      for (const raw of value) {
        if (typeof raw !== "object" || raw === null) continue;
        if (typeof raw.id !== "string" || raw.id === "" || ids.has(raw.id)) continue;
        if (!Number.isSafeInteger(raw.seq) || raw.seq < 0) continue;
        result.push({
          id: raw.id,
          seq: raw.seq,
          turn: Number.isSafeInteger(raw.turn) && raw.turn >= 0 ? raw.turn : null,
          text: typeof raw.text === "string" ? raw.text : "",
          hasImages: raw.hasImages === true,
        });
        ids.add(raw.id);
      }
      return result.sort((left, right) => left.seq - right.seq);
    }

    // The selected Session is expressed as ordinary reference ownership: the
    // `mainView` source is owned by ui-workspace navigation, and the live row
    // carrying it is the one on screen. SessionListState deliberately has NO
    // `current` field (it was removed in the "own Client Session generations"
    // refactor), so a plain `list.current` read is permanently `undefined` and
    // must never be reintroduced.
    const MAIN_VIEW_SOURCE = "mainView";

    function selectCurrentSessionId(byId) {
      if (byId === null || typeof byId !== "object") return undefined;
      for (const id of Object.keys(byId)) {
        const row = byId[id];
        if (row === null || typeof row !== "object") continue;
        if ((row.retainedBy?.[MAIN_VIEW_SOURCE] ?? 0) > 0) return id;
      }
      return undefined;
    }

    function mount(ctx) {
      installStyle();
      document.documentElement.dataset.dshMessageLocator = "true";
      document.getElementById(ROOT_ID)?.remove();

      const root = document.createElement("div");
      root.id = ROOT_ID;
      root.innerHTML = `
        <div class="dml-rail" role="navigation" aria-label="整场会话用户消息定位器">
          <button class="dml-open" type="button" aria-label="打开我的消息定位器" aria-expanded="false" title="我的消息（⌘/Ctrl+Shift+F）">⌕</button>
          <div class="dml-marks" aria-label="整场会话用户消息刻度"></div>
        </div>
        <div class="dml-preview" role="tooltip" hidden>
          <div class="dml-preview-index"></div>
          <div class="dml-preview-text"></div>
          <div class="dml-preview-state"></div>
        </div>
        <section class="dml-panel" hidden aria-label="我的消息">
          <div class="dml-panel-head"><strong class="dml-title">我的消息 · 整场会话</strong><button class="dml-close" type="button" aria-label="关闭">×</button></div>
          <input class="dml-search" type="search" placeholder="搜索整场会话中的用户消息…" aria-label="搜索整场会话中的我的消息" />
          <div class="dml-list" role="listbox"></div>
          <div class="dml-panel-foot"><span class="dml-status" aria-live="polite"></span><button class="dml-load" type="button">加载全部历史</button></div>
          <div class="dml-help">点击未加载消息会自动加载并定位 · Enter 定位 · ↑/↓ 选择 · Esc 关闭</div>
        </section>`;
      document.body.appendChild(root);

      const toggle = root.querySelector(".dml-open");
      const marks = root.querySelector(".dml-marks");
      const preview = root.querySelector(".dml-preview");
      const previewIndex = root.querySelector(".dml-preview-index");
      const previewText = root.querySelector(".dml-preview-text");
      const previewState = root.querySelector(".dml-preview-state");
      const panel = root.querySelector(".dml-panel");
      const list = root.querySelector(".dml-list");
      const search = root.querySelector(".dml-search");
      const loadButton = root.querySelector(".dml-load");
      const status = root.querySelector(".dml-status");

      let messages = [];
      let selected = 0;
      let previewed = -1;
      let refreshQueued = false;
      let projectionReady = false;
      let currentSession = null;
      let projectionFace = null;
      let disposeProjection = () => {};
      let disposeSession = () => {};
      let historyLoading = false;
      let historyStatusText = "";
      let jumpGeneration = 0;
      let observedScroller = null;
      let resizeObserver = null;
      let flashTimer = 0;

      const rowFor = (item) => {
        const key = `${MESSAGE_KEY_PREFIX}${item.id}`;
        for (const row of document.querySelectorAll(MESSAGE_ROW_SELECTOR)) {
          if (row.dataset.chatAnchorKey === key && row.isConnected && !row.hidden) return row;
        }
        return null;
      };

      const loadedCount = () => messages.reduce((count, item) => count + (rowFor(item) ? 1 : 0), 0);

      const conversationScroller = () => {
        const firstRow = document.querySelector(MESSAGE_ROW_SELECTOR);
        const closest = firstRow?.closest("[data-conversation-scroll]");
        if (closest && closest.getBoundingClientRect().width > 0) return closest;
        return [...document.querySelectorAll("[data-conversation-scroll]")].find((item) => {
          const rect = item.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
      };

      const hidePreview = () => {
        previewed = -1;
        preview.hidden = true;
      };

      const positionPreview = (marker) => {
        if (preview.hidden || !marker?.isConnected) return;
        const markerRect = marker.getBoundingClientRect();
        const previewRect = preview.getBoundingClientRect();
        const half = previewRect.height / 2;
        const center = markerRect.top + markerRect.height / 2;
        preview.style.top = `${Math.max(12 + half, Math.min(window.innerHeight - 12 - half, center))}px`;
      };

      const showPreview = (index, marker) => {
        const item = messages[index];
        if (!item) return;
        const loaded = rowFor(item) !== null;
        previewed = index;
        previewIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${messages.length}${item.turn === null ? "" : ` · 第 ${item.turn} 轮`}`;
        previewText.textContent = shortText(item.text, item.hasImages, 240);
        previewState.textContent = loaded ? "已载入 · 点击定位" : "尚未载入 · 点击后自动加载并定位";
        preview.hidden = false;
        positionPreview(marker);
      };

      const updateSelection = () => {
        [...marks.children].forEach((marker, index) => marker.setAttribute("aria-current", String(index === selected)));
        [...list.querySelectorAll(".dml-item")].forEach((button) => {
          const current = Number(button.dataset.index) === selected;
          button.classList.toggle("dml-selected", current);
          button.setAttribute("aria-selected", String(current));
        });
      };

      const updateLoadedIndicators = () => {
        [...marks.children].forEach((marker, index) => {
          marker.dataset.loaded = String(messages[index] !== undefined && rowFor(messages[index]) !== null);
        });
        [...list.querySelectorAll(".dml-item")].forEach((button) => {
          const item = messages[Number(button.dataset.index)];
          const loaded = item !== undefined && rowFor(item) !== null;
          button.dataset.loaded = String(loaded);
          const state = button.querySelector(".dml-item-state");
          if (state) state.textContent = loaded ? "已载入" : "加载并定位";
        });
      };

      const flash = (row) => {
        document.querySelectorAll(".dml-flash").forEach((item) => item.classList.remove("dml-flash"));
        window.clearTimeout(flashTimer);
        row.classList.remove("dml-flash");
        void row.offsetWidth;
        row.classList.add("dml-flash");
        flashTimer = window.setTimeout(() => row.classList.remove("dml-flash"), 1400);
      };

      const land = (item) => {
        const row = rowFor(item);
        if (!row) return false;
        const scroller = row.closest("[data-conversation-scroll]");
        if (scroller) {
          const rowRect = row.getBoundingClientRect();
          const scrollRect = scroller.getBoundingClientRect();
          const delta = rowRect.top - scrollRect.top;
          scroller.scrollBy({ top: delta - scroller.clientHeight / 2 + Math.min(rowRect.height / 2, 24), behavior: "smooth" });
        } else {
          row.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
        window.setTimeout(() => { if (row.isConnected) flash(row); }, 320);
        return true;
      };

      const nextPaint = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const waitForIdle = (session, generation) => new Promise((resolve) => {
        if (generation !== jumpGeneration || session !== currentSession || !session.getSnapshot().loadingOlder) {
          resolve();
          return;
        }
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          unsubscribe();
          window.clearTimeout(timer);
          resolve();
        };
        const unsubscribe = session.subscribe(() => {
          if (generation !== jumpGeneration || session !== currentSession || !session.getSnapshot().loadingOlder) finish();
        });
        const timer = window.setTimeout(finish, 15000);
      });

      const jump = async (index) => {
        const item = messages[index];
        if (!item) return;
        selected = index;
        updateSelection();
        hidePreview();
        if (land(item)) return;
        const session = currentSession;
        if (!session) {
          historyStatusText = "当前会话尚未就绪";
          schedule();
          return;
        }
        const generation = ++jumpGeneration;
        historyLoading = true;
        historyStatusText = `正在加载第 ${index + 1} 条消息所在的历史…`;
        schedule();
        marks.children[index]?.setAttribute("data-busy", "true");
        try {
          await waitForIdle(session, generation);
          if (generation !== jumpGeneration || session !== currentSession) return;
          await session.loadThrough(item.seq);
          await nextPaint();
          if (generation !== jumpGeneration || session !== currentSession) return;
          if (!land(item)) {
            const snapshot = session.getSnapshot();
            historyStatusText = snapshot.hasMore ? "目标消息暂未呈现，请重试" : "历史已载入，但目标消息当前不可见";
          } else {
            historyStatusText = "";
          }
        } finally {
          marks.children[index]?.removeAttribute("data-busy");
          if (generation === jumpGeneration) {
            historyLoading = false;
            schedule();
          }
        }
      };

      const filtered = () => {
        const query = search.value.trim().toLocaleLowerCase();
        return messages.map((item, index) => ({ item, index })).filter(({ item }) => {
          const searchable = item.text || (item.hasImages ? "图片消息" : "无文本消息");
          return query === "" || searchable.toLocaleLowerCase().includes(query);
        });
      };

      const renderList = () => {
        if (panel.hidden) return;
        const result = filtered();
        list.replaceChildren();
        if (!projectionReady) {
          const empty = document.createElement("div");
          empty.className = "dml-empty";
          empty.textContent = "正在读取整场会话消息索引…";
          list.appendChild(empty);
          return;
        }
        if (result.length === 0) {
          const empty = document.createElement("div");
          empty.className = "dml-empty";
          empty.textContent = messages.length === 0 ? "当前会话还没有用户消息" : "没有匹配的消息";
          list.appendChild(empty);
          return;
        }
        const fragment = document.createDocumentFragment();
        for (const { item, index } of result) {
          const loaded = rowFor(item) !== null;
          const button = document.createElement("button");
          button.type = "button";
          button.className = `dml-item${index === selected ? " dml-selected" : ""}`;
          button.dataset.index = String(index);
          button.dataset.loaded = String(loaded);
          button.setAttribute("role", "option");
          button.setAttribute("aria-selected", String(index === selected));
          const number = document.createElement("span");
          number.className = "dml-item-index";
          number.textContent = String(index + 1).padStart(2, "0");
          const label = document.createElement("span");
          label.className = "dml-item-text";
          label.textContent = shortText(item.text, item.hasImages, 260);
          const state = document.createElement("span");
          state.className = "dml-item-state";
          state.textContent = loaded ? "已载入" : "加载并定位";
          button.append(number, label, state);
          button.addEventListener("click", () => { void jump(index); });
          fragment.appendChild(button);
        }
        list.appendChild(fragment);
      };

      const renderMarks = () => {
        const fragment = document.createDocumentFragment();
        messages.forEach((item, index) => {
          const loaded = rowFor(item) !== null;
          const marker = document.createElement("button");
          marker.type = "button";
          marker.className = "dml-mark";
          marker.dataset.index = String(index);
          marker.dataset.loaded = String(loaded);
          marker.setAttribute("aria-current", String(index === selected));
          marker.setAttribute("aria-label", `${loaded ? "定位到" : "加载并定位到"}第 ${index + 1} 条用户消息：${shortText(item.text, item.hasImages, 56)}`);
          marker.addEventListener("mouseenter", () => showPreview(index, marker));
          marker.addEventListener("mouseleave", () => { if (document.activeElement !== marker) hidePreview(); });
          marker.addEventListener("focus", () => showPreview(index, marker));
          marker.addEventListener("blur", hidePreview);
          marker.addEventListener("click", () => { void jump(index); });
          fragment.appendChild(marker);
        });
        marks.replaceChildren(fragment);
      };

      const updateHistoryControls = () => {
        const loaded = loadedCount();
        if (!projectionReady) status.textContent = historyStatusText || "正在读取整场会话索引…";
        else status.textContent = historyStatusText || `共 ${messages.length} 条 · 页面已载入 ${loaded} 条`;
        const hasUnloaded = projectionReady && loaded < messages.length;
        loadButton.hidden = !historyLoading && !hasUnloaded;
        loadButton.disabled = historyLoading || messages.length === 0 || !currentSession;
        loadButton.textContent = historyLoading ? "加载中…" : "加载全部历史";
      };

      const updateProjection = () => {
        const value = projectionFace?.getSnapshot();
        projectionReady = Array.isArray(value);
        const current = projectedMessages(value);
        const selectedId = messages[selected]?.id;
        const changed = current.length !== messages.length || current.some((item, index) => {
          const before = messages[index];
          return before?.id !== item.id || before.seq !== item.seq || before.turn !== item.turn
            || before.text !== item.text || before.hasImages !== item.hasImages;
        });
        if (!changed) return;
        messages = current;
        const preserved = selectedId === undefined ? -1 : messages.findIndex((item) => item.id === selectedId);
        selected = preserved >= 0 ? preserved : Math.min(selected, Math.max(0, messages.length - 1));
        renderMarks();
        renderList();
      };

      const updateLayout = () => {
        const scroller = conversationScroller();
        if (!scroller) {
          root.hidden = true;
          return;
        }
        root.hidden = false;
        if (resizeObserver && observedScroller !== scroller) {
          resizeObserver.disconnect();
          resizeObserver.observe(scroller);
          observedScroller = scroller;
        }
        const rect = scroller.getBoundingClientRect();
        const railTop = Math.max(8, Math.min(window.innerHeight - 88, rect.top + 8));
        const railBottom = Math.max(railTop + 80, Math.min(window.innerHeight - 8, rect.bottom - 8));
        const railHeight = Math.max(80, railBottom - railTop);
        const rightInset = Math.max(0, window.innerWidth - Math.min(window.innerWidth, rect.right));
        const stackHeight = Math.max(24, Math.min(280, railHeight - 72));
        const pitch = messages.length === 0 ? 8 : Math.min(8, stackHeight / messages.length);
        const thickness = Math.max(0.35, Math.min(2, pitch * 0.72));
        root.style.setProperty("--dml-right", `${rightInset}px`);
        root.style.setProperty("--dml-rail-top", `${railTop}px`);
        root.style.setProperty("--dml-rail-height", `${railHeight}px`);
        root.style.setProperty("--dml-mark-pitch", `${pitch.toFixed(3)}px`);
        root.style.setProperty("--dml-mark-thickness", `${thickness.toFixed(3)}px`);
        if (previewed >= 0) positionPreview(marks.children[previewed]);
      };

      const syncActiveFromScroll = () => {
        if (messages.length === 0 || historyLoading) return;
        const scroller = conversationScroller();
        const viewport = scroller?.getBoundingClientRect() ?? { top: 0, bottom: window.innerHeight, height: window.innerHeight };
        const target = viewport.top + viewport.height / 2;
        let closestIndex = -1;
        let closestDistance = Number.POSITIVE_INFINITY;
        messages.forEach((item, index) => {
          const row = rowFor(item);
          if (!row) return;
          const rect = row.getBoundingClientRect();
          const center = rect.top + Math.min(rect.height / 2, 24);
          const distance = Math.abs(center - target);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        if (closestIndex >= 0 && closestIndex !== selected) {
          selected = closestIndex;
          updateSelection();
        }
      };

      const refresh = () => {
        updateProjection();
        updateLayout();
        updateLoadedIndicators();
        syncActiveFromScroll();
        updateHistoryControls();
      };

      const schedule = () => {
        if (refreshQueued) return;
        refreshQueued = true;
        requestAnimationFrame(() => {
          refreshQueued = false;
          if (root.isConnected) refresh();
        });
      };

      const currentSessionId = () => selectCurrentSessionId(ctx.sessions.list.getSnapshot().byId);

      const bindCurrentSession = () => {
        const id = currentSessionId();
        const next = id === undefined ? null : ctx.sessions.binding(id)?.session ?? null;
        if (next === currentSession) return;
        jumpGeneration += 1;
        disposeProjection();
        disposeSession();
        disposeProjection = () => {};
        disposeSession = () => {};
        currentSession = next;
        projectionFace = next?.projections.faceOf(PROJECTION_KEY) ?? null;
        projectionReady = false;
        messages = [];
        selected = 0;
        historyLoading = false;
        historyStatusText = "";
        if (projectionFace) disposeProjection = projectionFace.subscribe(schedule);
        if (next) disposeSession = next.subscribe(schedule);
        renderMarks();
        renderList();
        schedule();
      };

      const setPanel = (open) => {
        panel.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        hidePreview();
        if (open) {
          renderList();
          updateHistoryControls();
          search.focus();
        }
      };

      const moveSelection = (direction) => {
        const result = filtered();
        if (result.length === 0) return;
        const currentPosition = result.findIndex((entry) => entry.index === selected);
        const nextPosition = currentPosition < 0
          ? direction > 0 ? 0 : result.length - 1
          : (currentPosition + direction + result.length) % result.length;
        selected = result[nextPosition].index;
        updateSelection();
        list.querySelector(`.dml-item[data-index="${selected}"]`)?.scrollIntoView({ block: "nearest" });
      };

      toggle.addEventListener("click", () => setPanel(panel.hidden));
      root.querySelector(".dml-close").addEventListener("click", () => setPanel(false));
      loadButton.addEventListener("click", () => { if (messages.length > 0) void jump(0); });
      search.addEventListener("input", () => {
        renderList();
        const result = filtered();
        if (result.length && !result.some((entry) => entry.index === selected)) {
          selected = result[0].index;
          updateSelection();
        }
      });
      search.addEventListener("keydown", (event) => {
        const result = filtered();
        if (event.key === "Escape") {
          event.preventDefault();
          setPanel(false);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          moveSelection(1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          moveSelection(-1);
        } else if (event.key === "Enter" && result.length) {
          event.preventDefault();
          const target = result.find((entry) => entry.index === selected) ?? result[0];
          void jump(target.index);
        }
      });

      const globalKeydown = (event) => {
        if (event.defaultPrevented) return;
        const modifier = event.metaKey || event.ctrlKey;
        if (modifier && event.shiftKey && event.key.toLowerCase() === "f") {
          event.preventDefault();
          setPanel(true);
          return;
        }
        if (event.key === "Escape" && !panel.hidden) {
          event.preventDefault();
          setPanel(false);
          return;
        }
        if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown") && messages.length) {
          event.preventDefault();
          const next = (selected + (event.key === "ArrowDown" ? 1 : -1) + messages.length) % messages.length;
          void jump(next);
        }
      };

      const observer = new MutationObserver(schedule);
      resizeObserver = new ResizeObserver(schedule);
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
      window.addEventListener("resize", schedule);
      document.addEventListener("scroll", schedule, true);
      document.addEventListener("keydown", globalKeydown);
      const disposeList = ctx.sessions.list.subscribe(bindCurrentSession);
      bindCurrentSession();

      return () => {
        jumpGeneration += 1;
        disposeList();
        disposeProjection();
        disposeSession();
        observer.disconnect();
        resizeObserver.disconnect();
        window.clearTimeout(flashTimer);
        window.removeEventListener("resize", schedule);
        document.removeEventListener("scroll", schedule, true);
        document.removeEventListener("keydown", globalKeydown);
        delete document.documentElement.dataset.dshMessageLocator;
        root.remove();
      };
    }

    const inject = ["sessions"];
    function apply(ctx) {
      ctx.effect(() => mount(ctx), "message-locator: mount");
    }

    exports.apply = apply;
    exports.inject = inject;
    exports.selectCurrentSessionId = selectCurrentSessionId;
    return module.exports;
  }
});
