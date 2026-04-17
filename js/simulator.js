class GridSimulator {
  constructor(containerId, codeId, controlsId) {
    this.container = document.getElementById(containerId);
    this.codeDisplay = document.getElementById(codeId);
    this.controlsContainer = document.getElementById(controlsId);
    this.colLabels = document.getElementById("col-labels");
    this.rowLabels = document.getElementById("row-labels");
    this.currentTopic = null;
    this.isDragging = false;
    this.draggedItem = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.controlValues = {};
    this.currentLayoutMode = "grid";
    this.draggedFlexItem = null;
  }

  toggleLabels(visible) {
    if (this.colLabels)
      this.colLabels.style.display = visible ? "grid" : "none";
    if (this.rowLabels)
      this.rowLabels.style.display = visible ? "grid" : "none";
  }

  getTopicData(topic) {
    return topic.initialGrid || topic.initialFlex || topic.initialLayout || {};
  }

  getTargetItem() {
    return (
      this.container.querySelector(".grid-item.control-target") ||
      this.container.querySelector(".grid-item")
    );
  }

  getDragAxis() {
    const direction = getComputedStyle(this.container).flexDirection;
    return direction.startsWith("column") ? "y" : "x";
  }

  handleFlexDragStart = (e) => {
    const item = e.currentTarget;
    this.draggedFlexItem = item;
    item.classList.add("dragging");
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", item.textContent || "");
    }
  };

  handleFlexDragEnd = (e) => {
    const item = e.currentTarget;
    item.classList.remove("dragging");

    Array.from(this.container.querySelectorAll(".grid-item")).forEach(
      (gridItem, index) => {
        gridItem.style.order = String(index + 1);
      },
    );

    this.draggedFlexItem = null;
    this.updateCode();
  };

  handleFlexDragOver = (e) => {
    if (!this.draggedFlexItem) return;
    e.preventDefault();

    const afterElement = this.getFlexDragAfterElement(e.clientX, e.clientY);
    if (!afterElement) {
      this.container.appendChild(this.draggedFlexItem);
      return;
    }

    if (afterElement !== this.draggedFlexItem) {
      this.container.insertBefore(this.draggedFlexItem, afterElement);
    }
  };

  getFlexDragAfterElement(clientX, clientY) {
    const axis = this.getDragAxis();
    const siblings = Array.from(
      this.container.querySelectorAll(".grid-item:not(.dragging)"),
    );

    let closest = { offset: Number.NEGATIVE_INFINITY, element: null };

    siblings.forEach((element) => {
      const box = element.getBoundingClientRect();
      const offset =
        axis === "x"
          ? clientX - box.left - box.width / 2
          : clientY - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        closest = { offset, element };
      }
    });

    return closest.element;
  }

  animateFlexLayoutChange(applyChange) {
    const items = Array.from(this.container.querySelectorAll(".grid-item"));

    if (items.length === 0) {
      applyChange();
      return;
    }

    const firstRects = new Map();
    items.forEach((item) => firstRects.set(item, item.getBoundingClientRect()));

    applyChange();

    items.forEach((item) => {
      const first = firstRects.get(item);
      const last = item.getBoundingClientRect();
      if (!first || !last) return;

      const dx = first.left - last.left;
      const dy = first.top - last.top;

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

      item.style.transition = "none";
      item.style.transform = `translate(${dx}px, ${dy}px)`;
      item.getBoundingClientRect();
      item.style.transition = "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)";
      item.style.transform = "";
    });

    window.setTimeout(() => {
      items.forEach((item) => {
        if (!item.classList.contains("dragging")) {
          item.style.transition = "";
        }
      });
    }, 360);
  }

  parseTrackList(trackList) {
    if (!trackList || trackList === "none") return [];

    const tokens = [];
    let token = "";
    let depth = 0;

    for (const ch of trackList.trim()) {
      if (ch === "(") {
        depth += 1;
        token += ch;
        continue;
      }

      if (ch === ")") {
        depth = Math.max(0, depth - 1);
        token += ch;
        continue;
      }

      if (/\s/.test(ch) && depth === 0) {
        if (token) {
          tokens.push(token);
          token = "";
        }
        continue;
      }

      token += ch;
    }

    if (token) tokens.push(token);
    return tokens;
  }

  countTracks(trackList) {
    const tokens = this.parseTrackList(trackList);
    let count = 0;

    tokens.forEach((token) => {
      const match = token.match(/^repeat\(\s*(\d+)\s*,/i);
      if (match) {
        count += parseInt(match[1], 10) || 1;
      } else {
        count += 1;
      }
    });

    return Math.max(1, count);
  }

  loadTopic(topicOrKey) {
    this.currentTopic =
      typeof topicOrKey === "string" ? topics[topicOrKey] : topicOrKey;

    if (!this.currentTopic) return;

    const data = this.getTopicData(this.currentTopic);
    this.currentLayoutMode = data.mode || "grid";
    this.controlValues = {};
    this.draggedFlexItem = null;

    this.container.removeEventListener("dragover", this.handleFlexDragOver);

    // Reset container
    this.container.innerHTML = "";
    this.container.className = "grid-container";
    if (data.areas) this.container.classList.add("areas-mode");
    if (this.currentLayoutMode === "flex")
      this.container.classList.add("flex-mode");

    // Apply initial styles
    if (this.currentLayoutMode === "grid") {
      this.container.style.gridTemplateColumns = data.columns || "none";
      this.container.style.gridTemplateRows = data.rows || "none";
      this.container.style.gap = data.gap || "10px";
      this.container.style.justifyItems = data.alignment || "stretch";
      this.container.style.alignItems = data.alignment || "stretch";
      this.container.style.justifyContent = "";
      this.container.style.alignContent = "";
      this.container.style.flexDirection = "";
      this.container.style.flexWrap = "";
      this.container.style.display = "grid";
      this.toggleLabels(true);
    } else {
      this.container.style.display = "flex";
      this.container.style.flexDirection = data.direction || "row";
      this.container.style.flexWrap = data.wrap || "nowrap";
      this.container.style.justifyContent = data.justifyContent || "flex-start";
      this.container.style.alignItems = data.alignItems || "stretch";
      this.container.style.alignContent = data.alignContent || "stretch";
      this.container.style.gap = data.gap || "10px";
      this.container.style.gridTemplateColumns = "";
      this.container.style.gridTemplateRows = "";
      this.container.style.justifyItems = "";
      this.toggleLabels(false);
    }

    // Render controls and labels
    this.renderControls(data.controls);
    if (this.currentLayoutMode === "grid") this.renderLabels();

    // Add overlay for interactive mode
    if (data.interactive && this.currentLayoutMode === "grid") {
      const computed = getComputedStyle(this.container);
      this.createOverlay(
        computed.gridTemplateColumns,
        computed.gridTemplateRows,
      );
    }

    // Add items
    data.items.forEach((itemData) => {
      const item = document.createElement("div");
      item.className = "grid-item";
      item.textContent = itemData.text;

      if (itemData.target) item.classList.add("control-target");

      if (itemData.style) {
        Object.keys(itemData.style).forEach((prop) => {
          item.style[prop] = itemData.style[prop];
        });
      }

      if (itemData.area) {
        if (data.areas) {
          item.style.gridArea = itemData.area;
          item.classList.add(`area-${itemData.area}`);
        } else {
          item.style.gridArea = itemData.area;
        }
      }

      if (data.interactive && this.currentLayoutMode === "grid") {
        item.addEventListener("mousedown", (e) => this.startDrag(e, item));
      }

      if (data.interactive && this.currentLayoutMode === "flex") {
        item.draggable = true;
        item.addEventListener("dragstart", this.handleFlexDragStart);
        item.addEventListener("dragend", this.handleFlexDragEnd);
      }

      this.container.appendChild(item);
    });

    if (data.interactive && this.currentLayoutMode === "flex") {
      this.container.addEventListener("dragover", this.handleFlexDragOver);
    }

    this.updateCode();
  }

  renderLabels() {
    if (
      !this.colLabels ||
      !this.rowLabels ||
      this.currentLayoutMode !== "grid"
    ) {
      this.toggleLabels(false);
      return;
    }

    this.colLabels.innerHTML = "";
    this.rowLabels.innerHTML = "";

    const computed = getComputedStyle(this.container);
    const colCount = this.countTracks(computed.gridTemplateColumns);
    const rowCount = this.countTracks(computed.gridTemplateRows);

    // Add a terminal 0-size track so the final grid line label is rendered
    // at the container edge instead of wrapping to a new implicit row/column.
    this.colLabels.style.gridTemplateColumns = `${computed.gridTemplateColumns} 0px`;
    this.rowLabels.style.gridTemplateRows = `${computed.gridTemplateRows} 0px`;
    this.colLabels.style.gap = computed.gap;
    this.rowLabels.style.gap = computed.gap;

    for (let i = 1; i <= colCount + 1; i++) {
      const span = document.createElement("span");
      span.className = "label-num";
      span.textContent = i;
      this.colLabels.appendChild(span);
    }

    for (let i = 1; i <= rowCount + 1; i++) {
      const span = document.createElement("span");
      span.className = "label-num";
      span.textContent = i;
      this.rowLabels.appendChild(span);
    }
  }

  renderControls(controls = []) {
    this.controlsContainer.innerHTML = "";
    if (controls.length === 0) {
      this.controlsContainer.innerHTML =
        '<p style="color: var(--text-muted); font-size: 0.9rem;">Interaja com os elementos do grid para ver o código.</p>';
      return;
    }

    controls.forEach((control) => {
      const group = document.createElement("div");
      group.className = "control-group";

      const label = document.createElement("label");
      label.innerHTML = `${control.label} <span id="val-${control.id}" class="control-val">${control.default}${control.unit || ""}</span>`;

      let input;
      if (control.type === "range") {
        input = document.createElement("input");
        input.type = "range";
        input.min = control.min;
        input.max = control.max;
        input.value = control.default;
      } else if (control.type === "select") {
        input = document.createElement("select");
        control.options.forEach((opt) => {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          if (opt === control.default) option.selected = true;
          input.appendChild(option);
        });
      }

      this.controlValues[control.id] = control.default;
      input.addEventListener("input", (e) =>
        this.handleControlChange(control, e.target.value),
      );

      group.appendChild(label);
      group.appendChild(input);
      this.controlsContainer.appendChild(group);
    });
  }

  handleControlChange(control, value) {
    this.controlValues[control.id] = value;
    const valDisplay = document.getElementById(`val-${control.id}`);
    if (valDisplay) valDisplay.textContent = `${value}${control.unit || ""}`;

    const applyChange = () => {
      switch (control.id) {
        case "gap":
          this.container.style.gap = `${value}px`;
          break;
        case "columnGap":
          this.container.style.columnGap = `${value}px`;
          break;
        case "rowGap":
          this.container.style.rowGap = `${value}px`;
          break;
        case "cols":
          this.container.style.gridTemplateColumns = `${value}px 1fr ${value}px`;
          break;
        case "rowHeight":
          this.container.style.gridTemplateRows = `${value}px 1fr`;
          break;
        case "sidebarWidth":
          this.container.style.gridTemplateColumns = `${value}px 1fr`;
          break;
        case "justifyItems":
          this.container.style.justifyItems = value;
          break;
        case "alignItems":
          this.container.style.alignItems = value;
          break;
        case "justifyContent":
          this.container.style.justifyContent = value;
          break;
        case "flexDirection":
          this.container.style.flexDirection = value;
          break;
        case "flexWrap":
          this.container.style.flexWrap = value;
          break;
        case "alignContent":
          this.container.style.alignContent = value;
          break;
        case "display":
          this.container.style.display = value;
          break;
        case "repeatCount":
          this.container.style.gridTemplateColumns = `repeat(${value}, minmax(${this.controlValues["minWidth"] || 100}px, 1fr))`;
          break;
        case "minWidth":
          this.container.style.gridTemplateColumns = `repeat(${this.controlValues["repeatCount"] || 3}, minmax(${value}px, 1fr))`;
          break;
        case "itemWidth":
        case "itemHeight": {
          const item = this.container.querySelector(".grid-item");
          if (item) {
            const w = parseInt(this.controlValues["itemWidth"]) || 1;
            const h = parseInt(this.controlValues["itemHeight"]) || 1;
            const colStart = parseInt(item.style.gridColumnStart) || 1;
            const rowStart = parseInt(item.style.gridRowStart) || 1;
            item.style.gridColumn = `${colStart} / ${colStart + w}`;
            item.style.gridRow = `${rowStart} / ${rowStart + h}`;
          }
          break;
        }
        case "itemGrow": {
          const target = this.getTargetItem();
          if (target) target.style.flexGrow = String(value);
          break;
        }
        case "itemShrink": {
          const target = this.getTargetItem();
          if (target) target.style.flexShrink = String(value);
          break;
        }
        case "itemBasis": {
          const target = this.getTargetItem();
          if (target) target.style.flexBasis = `${value}px`;
          break;
        }
      }
    };

    if (this.currentLayoutMode === "flex") {
      this.animateFlexLayoutChange(applyChange);
    } else {
      applyChange();
    }

    if (this.currentLayoutMode === "grid") this.renderLabels();

    // Re-create overlay if dimensions changed
    if (
      this.currentLayoutMode === "grid" &&
      this.currentTopic &&
      this.getTopicData(this.currentTopic).interactive
    ) {
      const computed = getComputedStyle(this.container);
      this.createOverlay(
        computed.gridTemplateColumns,
        computed.gridTemplateRows,
      );
    }

    this.updateCode();
  }

  createOverlay(cols, rows) {
    const existing = this.container.querySelector(".grid-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "grid-overlay";
    overlay.style.gridTemplateColumns = cols;
    overlay.style.gridTemplateRows = rows;
    overlay.style.gap = getComputedStyle(this.container).gap;

    const colCount = this.countTracks(cols);
    const rowCount = this.countTracks(rows);

    overlay.dataset.colCount = String(colCount);
    overlay.dataset.rowCount = String(rowCount);

    for (let i = 0; i < colCount * rowCount; i++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell-hint";
      overlay.appendChild(cell);
    }
    this.container.appendChild(overlay);
  }

  startDrag(e, item) {
    if (this.currentLayoutMode !== "grid") return;
    e.preventDefault();
    this.isDragging = true;
    this.draggedItem = item;
    const rect = item.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;
    this.draggedWidth = rect.width;
    this.draggedHeight = rect.height;

    item.style.gridArea = "auto";
    item.style.gridColumn = "auto";
    item.style.gridRow = "auto";
    item.style.transition = "none";
    item.classList.add("dragging");
    item.style.position = "absolute";
    item.style.width = `${this.draggedWidth}px`;
    item.style.height = `${this.draggedHeight}px`;
    item.style.zIndex = "1000";

    this.drag(e);
    document.addEventListener("mousemove", this.drag);
    document.addEventListener("mouseup", this.stopDrag);
  }

  drag = (e) => {
    if (this.currentLayoutMode !== "grid") return;
    if (!this.isDragging || !this.draggedItem) return;
    const containerRect = this.container.getBoundingClientRect();
    let x = e.clientX - containerRect.left - this.offsetX;
    let y = e.clientY - containerRect.top - this.offsetY;

    const maxX = Math.max(0, containerRect.width - this.draggedWidth);
    const maxY = Math.max(0, containerRect.height - this.draggedHeight);
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    this.draggedItem.style.left = `${x}px`;
    this.draggedItem.style.top = `${y}px`;

    const probeX = containerRect.left + x + 1;
    const probeY = containerRect.top + y + 1;
    this.highlightCell(probeX, probeY);
  };

  stopDrag = (e) => {
    if (this.currentLayoutMode !== "grid") return;
    if (!this.isDragging) return;
    document.removeEventListener("mousemove", this.drag);
    document.removeEventListener("mouseup", this.stopDrag);

    const containerRect = this.container.getBoundingClientRect();
    const left = parseFloat(this.draggedItem.style.left) || 0;
    const top = parseFloat(this.draggedItem.style.top) || 0;
    const pos = this.calculateGridPosition(
      containerRect.left + left + 1,
      containerRect.top + top + 1,
    );

    const w = parseInt(this.controlValues["itemWidth"]) || 1;
    const h = parseInt(this.controlValues["itemHeight"]) || 1;
    const bounds = this.getGridCounts();
    const colStart = Math.min(pos.col, Math.max(1, bounds.colCount - w + 1));
    const rowStart = Math.min(pos.row, Math.max(1, bounds.rowCount - h + 1));

    this.draggedItem.classList.remove("dragging");
    Object.assign(this.draggedItem.style, {
      position: "",
      left: "",
      top: "",
      width: "",
      height: "",
      transition: "",
      gridColumn: `${colStart} / ${colStart + w}`,
      gridRow: `${rowStart} / ${rowStart + h}`,
    });

    this.isDragging = false;
    this.draggedItem = null;
    this.clearHighlights();
    this.updateCode();
  };

  getGridCounts() {
    if (this.currentLayoutMode !== "grid") {
      return { colCount: 1, rowCount: 1 };
    }

    const overlay = this.container.querySelector(".grid-overlay");
    if (overlay) {
      return {
        colCount: parseInt(overlay.dataset.colCount, 10) || 1,
        rowCount: parseInt(overlay.dataset.rowCount, 10) || 1,
      };
    }

    const computed = getComputedStyle(this.container);
    return {
      colCount: this.countTracks(computed.gridTemplateColumns),
      rowCount: this.countTracks(computed.gridTemplateRows),
    };
  }

  calculateGridPosition(clientX, clientY) {
    if (this.currentLayoutMode !== "grid") {
      return { col: 1, row: 1 };
    }

    const hints = Array.from(
      this.container.querySelectorAll(".grid-cell-hint"),
    );
    const { colCount, rowCount } = this.getGridCounts();

    if (hints.length > 0) {
      // Prefer exact hit inside a cell.
      for (let i = 0; i < hints.length; i++) {
        const rect = hints[i].getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          const row = Math.floor(i / colCount) + 1;
          const col = (i % colCount) + 1;
          return { col, row };
        }
      }

      // If the cursor is over a gap, pick the nearest cell center.
      let nearest = 0;
      let nearestDistance = Infinity;
      for (let i = 0; i < hints.length; i++) {
        const rect = hints[i].getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const distance = dx * dx + dy * dy;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = i;
        }
      }

      return {
        col: (nearest % colCount) + 1,
        row: Math.floor(nearest / colCount) + 1,
      };
    }

    // Fallback when overlay hints are not present.
    const containerRect = this.container.getBoundingClientRect();
    const relX = clientX - containerRect.left;
    const relY = clientY - containerRect.top;
    const colSize = containerRect.width / colCount;
    const rowSize = containerRect.height / rowCount;

    return {
      col: Math.max(1, Math.min(Math.floor(relX / colSize) + 1, colCount)),
      row: Math.max(1, Math.min(Math.floor(relY / rowSize) + 1, rowCount)),
    };
  }

  highlightCell(clientX, clientY) {
    if (this.currentLayoutMode !== "grid") return;
    this.clearHighlights();
    const pos = this.calculateGridPosition(clientX, clientY);
    const hints = this.container.querySelectorAll(".grid-cell-hint");
    const { colCount } = this.getGridCounts();

    const index = (pos.row - 1) * colCount + (pos.col - 1);
    if (hints[index]) hints[index].classList.add("highlight");
  }

  clearHighlights() {
    if (this.currentLayoutMode !== "grid") return;
    this.container
      .querySelectorAll(".grid-cell-hint")
      .forEach((h) => h.classList.remove("highlight"));
  }

  updateCode() {
    if (this.currentLayoutMode === "flex") {
      let css = `.container {\n  display: ${this.container.style.display || "flex"};\n`;
      const s = this.container.style;
      if (s.flexDirection) css += `  flex-direction: ${s.flexDirection};\n`;
      if (s.flexWrap) css += `  flex-wrap: ${s.flexWrap};\n`;
      if (s.justifyContent) css += `  justify-content: ${s.justifyContent};\n`;
      if (s.alignItems) css += `  align-items: ${s.alignItems};\n`;
      if (s.alignContent && s.alignContent !== "stretch") {
        css += `  align-content: ${s.alignContent};\n`;
      }
      if (s.gap && s.gap !== "10px") css += `  gap: ${s.gap};\n`;
      css += `}\n\n`;

      this.container.querySelectorAll(".grid-item").forEach((item, i) => {
        const hasFlexItemRules =
          (item.style.flexGrow && item.style.flexGrow !== "0") ||
          (item.style.flexShrink && item.style.flexShrink !== "1") ||
          (item.style.flexBasis && item.style.flexBasis !== "auto") ||
          (item.style.order && item.style.order !== "0");

        if (hasFlexItemRules) {
          css += `.item-${i + 1} {\n`;
          if (item.style.flexGrow && item.style.flexGrow !== "0") {
            css += `  flex-grow: ${item.style.flexGrow};\n`;
          }
          if (item.style.flexShrink && item.style.flexShrink !== "1") {
            css += `  flex-shrink: ${item.style.flexShrink};\n`;
          }
          if (item.style.flexBasis && item.style.flexBasis !== "auto") {
            css += `  flex-basis: ${item.style.flexBasis};\n`;
          }
          if (item.style.order && item.style.order !== "0") {
            css += `  order: ${item.style.order};\n`;
          }
          css += `}\n\n`;
        }
      });

      this.codeDisplay.textContent = css;
      return;
    }

    let css = `.container {\n  display: ${this.container.style.display || "grid"};\n`;
    const s = this.container.style;
    if (s.gridTemplateColumns)
      css += `  grid-template-columns: ${s.gridTemplateColumns};\n`;
    if (s.gridTemplateRows)
      css += `  grid-template-rows: ${s.gridTemplateRows};\n`;
    if (s.gap && s.gap !== "10px") css += `  gap: ${s.gap};\n`;
    if (s.justifyItems && s.justifyItems !== "stretch")
      css += `  justify-items: ${s.justifyItems};\n`;
    if (this.container.classList.contains("areas-mode")) {
      css += `  grid-template-areas: \n    "header header header"\n    "sidebar main main"\n    "footer footer footer";\n`;
    }
    css += `}\n\n`;

    this.container.querySelectorAll(".grid-item").forEach((item, i) => {
      const gridCol = item.style.gridColumn;
      const gridRow = item.style.gridRow;
      const gridArea = item.style.gridArea;
      if (
        (gridCol && gridCol !== "auto") ||
        (gridRow && gridRow !== "auto") ||
        (gridArea && gridArea !== "auto")
      ) {
        css += `.item-${i + 1} {\n`;
        if (gridCol && gridCol !== "auto")
          css += `  grid-column: ${gridCol};\n`;
        if (gridRow && gridRow !== "auto") css += `  grid-row: ${gridRow};\n`;
        if (
          gridArea &&
          gridArea !== "auto" &&
          this.container.classList.contains("areas-mode")
        )
          css += `  grid-area: ${gridArea};\n`;
        css += `}\n\n`;
      }
    });
    this.codeDisplay.textContent = css;
  }
}
