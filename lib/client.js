window.__ModuleLoader__.load({
  id: "dsh-message-locator",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    const STYLE_ID = "dsh-message-locator/styles";
    const ROOT_ID = "dsh-message-locator-root";
    const USER_SELECTOR = '[data-chat-flow-kind="user"]';

    const CSS = `
      #dsh-message-locator-root { position: fixed; z-index: 80; inset: 0 var(--dml-right, 0px) 0 auto; width: 54px; pointer-events: none; font-family: inherit; }
      #dsh-message-locator-root .dml-rail { position: absolute; right: 6px; top: var(--dml-rail-top, 92px); width: 46px; height: var(--dml-rail-height, calc(100vh - 184px)); pointer-events: none; }
      #dsh-message-locator-root .dml-open { position: absolute; right: 0; top: 0; width: 28px; height: 28px; padding: 0; border: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,.15)); border-radius: 8px; color: var(--dsw-alias-label-secondary, #bbb); background: var(--dsw-specific-menu, #2b2b2b); cursor: pointer; pointer-events: auto; font-size: 15px; box-shadow: 0 3px 14px rgba(0,0,0,.2); }
      #dsh-message-locator-root .dml-open:hover, #dsh-message-locator-root .dml-open:focus-visible, #dsh-message-locator-root .dml-open[aria-expanded="true"] { color: var(--dsw-alias-label-primary, #fff); border-color: var(--dsw-static-deepseek-500, #4ba3ff); }
      #dsh-message-locator-root .dml-marks { position: absolute; right: -2px; top: 50%; display: flex; width: 44px; flex-direction: column; align-items: flex-end; transform: translateY(-50%); pointer-events: auto; }
      #dsh-message-locator-root .dml-marks:empty { display: none; }
      #dsh-message-locator-root .dml-mark { position: relative; display: block; flex: 0 0 var(--dml-mark-pitch, 8px); width: 44px; height: var(--dml-mark-pitch, 8px); min-height: 0; padding: 0; border: 0; background: transparent; cursor: pointer; }
      #dsh-message-locator-root .dml-mark::before { position: absolute; right: 2px; top: 50%; width: 16px; height: var(--dml-mark-thickness, 2px); border-radius: 2px; background: var(--dsw-alias-label-tertiary, #858585); content: ""; opacity: .72; transform: translateY(-50%); transition: width 120ms ease, height 120ms ease, opacity 120ms ease, background-color 120ms ease; }
      #dsh-message-locator-root .dml-mark:hover::before, #dsh-message-locator-root .dml-mark:focus-visible::before { width: 28px; height: 3px; background: var(--dsw-static-deepseek-500, #4ba3ff); opacity: 1; }
      #dsh-message-locator-root .dml-mark[aria-current="true"]::before { width: 40px; height: 3px; background: var(--dsw-static-deepseek-500, #4ba3ff); opacity: 1; }
      #dsh-message-locator-root .dml-preview { position: fixed; z-index: 2; right: calc(var(--dml-right, 0px) + 62px); top: 50%; width: min(330px, calc(100vw - 96px)); padding: 11px 12px; border: 1px solid var(--dsw-alias-border-inverted, rgba(255,255,255,.14)); border-radius: 12px; color: var(--dsw-alias-label-primary, #eee); background: var(--dsw-specific-menu, #292929); box-shadow: 0 12px 34px rgba(0,0,0,.34); pointer-events: none; transform: translateY(-50%); }
      #dsh-message-locator-root .dml-preview[hidden] { display: none; }
      #dsh-message-locator-root .dml-preview-index { margin-bottom: 4px; color: var(--dsw-static-deepseek-500, #4ba3ff); font-size: 11px; font-variant-numeric: tabular-nums; }
      #dsh-message-locator-root .dml-preview-text { display: -webkit-box; overflow: hidden; color: var(--dsw-alias-label-primary, #eee); font-size: 13px; line-height: 19px; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
      #dsh-message-locator-root .dml-panel { position: fixed; right: calc(var(--dml-right, 0px) + 62px); top: 50%; display: flex; width: min(360px, calc(100vw - 78px)); max-height: min(520px, calc(100vh - 32px)); flex-direction: column; overflow: hidden; border: 1px solid var(--dsw-alias-border-inverted, rgba(255,255,255,.14)); border-radius: 14px; color: var(--dsw-alias-label-primary, #eee); background: var(--dsw-specific-menu, #292929); box-shadow: 0 12px 40px rgba(0,0,0,.36); pointer-events: auto; transform: translateY(-50%); }
      #dsh-message-locator-root .dml-panel[hidden] { display: none; }
      #dsh-message-locator-root .dml-panel-head { display: flex; align-items: center; gap: 8px; padding: 12px 12px 8px; }
      #dsh-message-locator-root .dml-title { flex: 1; font-size: 14px; font-weight: 600; }
      #dsh-message-locator-root .dml-close { border: 0; color: var(--dsw-alias-label-tertiary, #999); background: transparent; cursor: pointer; font-size: 18px; line-height: 20px; }
      #dsh-message-locator-root .dml-search { box-sizing: border-box; width: calc(100% - 24px); margin: 0 12px 8px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-inverted, rgba(255,255,255,.14)); border-radius: 8px; outline: none; color: var(--dsw-alias-label-primary, #eee); background: transparent; font: inherit; }
      #dsh-message-locator-root .dml-search:focus { border-color: var(--dsw-static-deepseek-500, #4ba3ff); }
      #dsh-message-locator-root .dml-list { min-height: 0; overflow: auto; padding: 2px 6px 8px; }
      #dsh-message-locator-root .dml-item { display: grid; width: 100%; grid-template-columns: 25px minmax(0, 1fr); gap: 5px; padding: 9px 8px; border: 0; border-radius: 8px; color: inherit; background: transparent; text-align: left; cursor: pointer; }
      #dsh-message-locator-root .dml-item:hover, #dsh-message-locator-root .dml-item.dml-selected { background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.08)); }
      #dsh-message-locator-root .dml-item:focus-visible { outline: 2px solid var(--dsw-static-deepseek-500, #4ba3ff); outline-offset: -2px; }
      #dsh-message-locator-root .dml-item-index { color: var(--dsw-static-deepseek-500, #4ba3ff); font-size: 11px; font-variant-numeric: tabular-nums; }
      #dsh-message-locator-root .dml-item-text { display: -webkit-box; overflow: hidden; color: var(--dsw-alias-label-primary, #eee); font-size: 13px; line-height: 18px; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
      #dsh-message-locator-root .dml-empty { padding: 18px 10px; color: var(--dsw-alias-label-tertiary, #999); font-size: 13px; text-align: center; }
      #dsh-message-locator-root .dml-panel-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 12px; border-top: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,.1)); color: var(--dsw-alias-label-tertiary, #999); font-size: 11px; }
      #dsh-message-locator-root .dml-load { flex: 0 0 auto; padding: 0; border: 0; color: var(--dsw-static-deepseek-500, #4ba3ff); background: transparent; cursor: pointer; font: inherit; }
      #dsh-message-locator-root .dml-load:disabled { cursor: default; opacity: .55; }
      #dsh-message-locator-root .dml-help { padding: 8px 12px 10px; border-top: 1px solid var(--dsw-alias-border-l2, rgba(255,255,255,.1)); color: var(--dsw-alias-label-tertiary, #999); font-size: 11px; }
      #dsh-message-locator-root .dml-flash { animation: dml-flash 1.3s ease-out; }
      @keyframes dml-flash { 0%, 100% { box-shadow: none; } 20% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--dsw-static-deepseek-500, #4ba3ff) 35%, transparent); } }
      @media (max-width: 720px) { #dsh-message-locator-root { width: 50px; } #dsh-message-locator-root .dml-rail { right: 4px; } #dsh-message-locator-root .dml-panel, #dsh-message-locator-root .dml-preview { right: calc(var(--dml-right, 0px) + 54px); } }
      @media (prefers-reduced-motion: reduce) { #dsh-message-locator-root .dml-mark::before { transition: none; } #dsh-message-locator-root .dml-flash { animation: none; } }
    `;

    function installStyle() {
      if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`)) return;
      const style = document.createElement("style");
      style.dataset.plugin = "dsh-message-locator";
      style.dataset.pluginCss = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    function textOf(row) {
      const bubble = row.querySelector('[class*="bubble"]');
      const text = (bubble ?? row).textContent ?? "";
      return text.replace(/\s+/gu, " ").trim();
    }

    function shortText(text, limit = 56) {
      return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`;
    }

    function mount() {
      installStyle();
      const existing = document.getElementById(ROOT_ID);
      if (existing) existing.remove();

      const root = document.createElement("div");
      root.id = ROOT_ID;
      root.innerHTML = `
        <div class="dml-rail" role="navigation" aria-label="当前对话消息定位器">
          <button class="dml-open" type="button" aria-label="打开我的消息定位器" aria-expanded="false" title="我的消息（⌘/Ctrl+Shift+F）">⌕</button>
          <div class="dml-marks" aria-label="我的消息刻度"></div>
        </div>
        <div class="dml-preview" role="tooltip" hidden>
          <div class="dml-preview-index"></div>
          <div class="dml-preview-text"></div>
        </div>
        <section class="dml-panel" hidden aria-label="我的消息">
          <div class="dml-panel-head"><strong class="dml-title">我的消息</strong><button class="dml-close" type="button" aria-label="关闭">×</button></div>
          <input class="dml-search" type="search" placeholder="筛选当前对话…" aria-label="筛选当前对话中的我的消息" />
          <div class="dml-list" role="listbox"></div>
          <div class="dml-panel-foot"><span class="dml-status" aria-live="polite"></span><button class="dml-load" type="button">加载更早</button></div>
          <div class="dml-help">Enter 定位 · ↑/↓ 选择 · Esc 关闭 · Alt+↑/↓ 上一条/下一条</div>
        </section>`;
      document.body.appendChild(root);

      const toggle = root.querySelector(".dml-open");
      const marks = root.querySelector(".dml-marks");
      const preview = root.querySelector(".dml-preview");
      const previewIndex = root.querySelector(".dml-preview-index");
      const previewText = root.querySelector(".dml-preview-text");
      const panel = root.querySelector(".dml-panel");
      const list = root.querySelector(".dml-list");
      const search = root.querySelector(".dml-search");
      const loadButton = root.querySelector(".dml-load");
      const status = root.querySelector(".dml-status");
      let messages = [];
      let selected = 0;
      let previewed = -1;
      let refreshQueued = false;
      let historyLoading = false;
      let historyStatusText = "";
      let observedScroller = null;
      let resizeObserver = null;
      let flashTimer = 0;
      let cancelHistoryWait = () => {};

      const rows = () => [...document.querySelectorAll(USER_SELECTOR)].filter((row) => row.isConnected && textOf(row) !== "");

      const conversationScroller = () => {
        const firstRow = document.querySelector(USER_SELECTOR);
        const closest = firstRow?.closest("[data-conversation-scroll]");
        if (closest && closest.getBoundingClientRect().width > 0) return closest;
        return [...document.querySelectorAll("[data-conversation-scroll]")].find((item) => {
          const rect = item.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
      };

      const earlierButton = () => [...document.querySelectorAll("button")].find((button) => {
        if (root.contains(button)) return false;
        const label = (button.textContent ?? "").replace(/\s+/gu, " ").trim();
        return /加载更早|load earlier|older messages/i.test(label);
      });

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
        const top = Math.max(12 + half, Math.min(window.innerHeight - 12 - half, center));
        preview.style.top = `${top}px`;
      };

      const showPreview = (index, marker) => {
        const item = messages[index];
        if (!item) return;
        previewed = index;
        previewIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${messages.length} · 我的消息`;
        previewText.textContent = item.text;
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

      const flash = (row) => {
        document.querySelectorAll(".dml-flash").forEach((item) => item.classList.remove("dml-flash"));
        window.clearTimeout(flashTimer);
        row.classList.remove("dml-flash");
        void row.offsetWidth;
        row.classList.add("dml-flash");
        flashTimer = window.setTimeout(() => row.classList.remove("dml-flash"), 1400);
      };

      const jump = (index) => {
        const item = messages[index];
        if (!item) return;
        selected = index;
        updateSelection();
        hidePreview();
        const scroller = item.row.closest("[data-conversation-scroll]");
        if (scroller) {
          const rowRect = item.row.getBoundingClientRect();
          const scrollRect = scroller.getBoundingClientRect();
          const delta = rowRect.top - scrollRect.top;
          scroller.scrollBy({ top: delta - scroller.clientHeight / 2 + Math.min(rowRect.height / 2, 24), behavior: "smooth" });
        } else {
          item.row.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
        window.setTimeout(() => {
          if (item.row.isConnected) flash(item.row);
        }, 320);
      };

      const filtered = () => {
        const query = search.value.trim().toLocaleLowerCase();
        return messages.map((item, index) => ({ item, index })).filter(({ item }) => query === "" || item.text.toLocaleLowerCase().includes(query));
      };

      const renderList = () => {
        if (panel.hidden) return;
        const result = filtered();
        list.replaceChildren();
        if (result.length === 0) {
          const empty = document.createElement("div");
          empty.className = "dml-empty";
          empty.textContent = messages.length === 0 ? "当前对话还没有我发送的消息" : "没有匹配的消息";
          list.appendChild(empty);
          return;
        }
        const fragment = document.createDocumentFragment();
        for (const { item, index } of result) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = `dml-item${index === selected ? " dml-selected" : ""}`;
          button.dataset.index = String(index);
          button.setAttribute("role", "option");
          button.setAttribute("aria-selected", String(index === selected));
          const number = document.createElement("span");
          number.className = "dml-item-index";
          number.textContent = String(index + 1).padStart(2, "0");
          const label = document.createElement("span");
          label.className = "dml-item-text";
          label.textContent = item.text;
          button.append(number, label);
          button.addEventListener("click", () => jump(index));
          fragment.appendChild(button);
        }
        list.appendChild(fragment);
      };

      const renderMarks = () => {
        const fragment = document.createDocumentFragment();
        messages.forEach((item, index) => {
          const marker = document.createElement("button");
          marker.type = "button";
          marker.className = "dml-mark";
          marker.dataset.index = String(index);
          marker.setAttribute("aria-current", String(index === selected));
          marker.setAttribute("aria-label", `第 ${index + 1} 条：${shortText(item.text)}`);
          marker.addEventListener("mouseenter", () => showPreview(index, marker));
          marker.addEventListener("mouseleave", () => {
            if (document.activeElement !== marker) hidePreview();
          });
          marker.addEventListener("focus", () => showPreview(index, marker));
          marker.addEventListener("blur", hidePreview);
          marker.addEventListener("click", () => jump(index));
          fragment.appendChild(marker);
        });
        marks.replaceChildren(fragment);
      };

      const updateHistoryControls = () => {
        const sourceButton = earlierButton();
        status.textContent = historyStatusText || `已载入 ${messages.length} 条${sourceButton ? " · 尚有更早消息" : " · 已是最早"}`;
        loadButton.hidden = !historyLoading && !sourceButton;
        loadButton.disabled = historyLoading || Boolean(sourceButton?.disabled);
        loadButton.textContent = historyLoading ? "加载中…" : "加载更早";
      };

      const updateMessages = () => {
        const current = rows().map((row) => ({ row, text: textOf(row) }));
        const changed = current.length !== messages.length || current.some((item, index) => messages[index]?.row !== item.row || messages[index]?.text !== item.text);
        if (!changed) return false;
        messages = current;
        selected = Math.min(selected, Math.max(0, messages.length - 1));
        renderMarks();
        renderList();
        return true;
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
        if (messages.length === 0) return;
        const scroller = conversationScroller();
        const viewport = scroller?.getBoundingClientRect() ?? { top: 0, bottom: window.innerHeight, height: window.innerHeight };
        const target = viewport.top + viewport.height / 2;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;
        messages.forEach((item, index) => {
          const rect = item.row.getBoundingClientRect();
          const center = rect.top + Math.min(rect.height / 2, 24);
          const distance = Math.abs(center - target);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        if (closestIndex !== selected) {
          selected = closestIndex;
          updateSelection();
        }
      };

      const refresh = () => {
        updateMessages();
        updateLayout();
        syncActiveFromScroll();
        updateHistoryControls();
      };

      const schedule = () => {
        if (refreshQueued) return;
        refreshQueued = true;
        requestAnimationFrame(() => {
          refreshQueued = false;
          refresh();
        });
      };

      const waitForHistoryPage = (button) => new Promise((resolve) => {
        let settled = false;
        let sawBusy = button.disabled;
        const beforeKeys = rows().map((row) => row.getAttribute("data-chat-anchor-key") ?? row.getAttribute("data-chat-flow-key") ?? "").join("\n");
        const finish = (changed) => {
          if (settled) return;
          settled = true;
          observer.disconnect();
          window.clearTimeout(timer);
          cancelHistoryWait = () => {};
          resolve(changed);
        };
        const observer = new MutationObserver(() => {
          const afterKeys = rows().map((row) => row.getAttribute("data-chat-anchor-key") ?? row.getAttribute("data-chat-flow-key") ?? "").join("\n");
          const currentButton = earlierButton();
          if (button.disabled) sawBusy = true;
          if (afterKeys !== beforeKeys || !button.isConnected || !currentButton || sawBusy && !button.disabled) finish(true);
        });
        const timer = window.setTimeout(() => finish(false), 7000);
        cancelHistoryWait = () => finish(false);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled"] });
        button.click();
      });

      const loadEarlierPage = async () => {
        const button = earlierButton();
        if (historyLoading || !button || button.disabled) return;
        historyLoading = true;
        historyStatusText = "正在加载一页更早消息…";
        updateHistoryControls();
        const loaded = await waitForHistoryPage(button);
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (!root.isConnected) return;
        historyLoading = false;
        historyStatusText = loaded ? "" : "未检测到更多消息，可重试";
        refresh();
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
      loadButton.addEventListener("click", loadEarlierPage);
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
          jump(target.index);
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
          jump(next);
        }
      };

      const observer = new MutationObserver(schedule);
      resizeObserver = new ResizeObserver(schedule);
      observer.observe(document.body, { childList: true, subtree: true });
      window.addEventListener("resize", schedule);
      document.addEventListener("scroll", schedule, true);
      document.addEventListener("keydown", globalKeydown);
      refresh();

      return () => {
        cancelHistoryWait();
        observer.disconnect();
        resizeObserver.disconnect();
        window.clearTimeout(flashTimer);
        window.removeEventListener("resize", schedule);
        document.removeEventListener("scroll", schedule, true);
        document.removeEventListener("keydown", globalKeydown);
        root.remove();
      };
    }

    const inject = [];
    function apply(ctx) {
      ctx.effect(() => mount(), "message-locator: mount");
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
