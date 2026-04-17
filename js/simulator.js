class GridSimulator {
    constructor(containerId, codeId, controlsId) {
        this.container = document.getElementById(containerId);
        this.codeDisplay = document.getElementById(codeId);
        this.controlsContainer = document.getElementById(controlsId);
        this.colLabels = document.getElementById('col-labels');
        this.rowLabels = document.getElementById('row-labels');
        this.currentTopic = null;
        this.isDragging = false;
        this.draggedItem = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.controlValues = {};
    }

    loadTopic(topicKey) {
        this.currentTopic = topics[topicKey];
        const data = this.currentTopic.initialGrid;
        this.controlValues = {};
        
        // Reset container
        this.container.innerHTML = '';
        this.container.className = 'grid-container';
        if (data.areas) this.container.classList.add('areas-mode');
        
        // Apply initial styles
        this.container.style.gridTemplateColumns = data.columns || 'none';
        this.container.style.gridTemplateRows = data.rows || 'none';
        this.container.style.gap = data.gap || '10px';
        this.container.style.justifyItems = data.alignment || 'stretch';
        this.container.style.alignItems = data.alignment || 'stretch';
        this.container.style.display = 'grid';

        // Render controls and labels
        this.renderControls(data.controls);
        this.renderLabels();

        // Add overlay for interactive mode
        if (data.interactive) {
            const computed = getComputedStyle(this.container);
            this.createOverlay(computed.gridTemplateColumns, computed.gridTemplateRows);
        }

        // Add items
        data.items.forEach(itemData => {
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.textContent = itemData.text;
            
            if (itemData.area) {
                if (data.areas) {
                    item.style.gridArea = itemData.area;
                    item.classList.add(`area-${itemData.area}`);
                } else {
                    item.style.gridArea = itemData.area;
                }
            }

            if (data.interactive) {
                item.addEventListener('mousedown', (e) => this.startDrag(e, item));
            }

            this.container.appendChild(item);
        });

        this.updateCode();
    }

    renderLabels() {
        if (!this.colLabels || !this.rowLabels) return;
        
        this.colLabels.innerHTML = '';
        this.rowLabels.innerHTML = '';

        const computed = getComputedStyle(this.container);
        const colStrings = computed.gridTemplateColumns.split(' ');
        const rowStrings = computed.gridTemplateRows.split(' ');

        this.colLabels.style.gridTemplateColumns = computed.gridTemplateColumns;
        this.rowLabels.style.gridTemplateRows = computed.gridTemplateRows;
        this.colLabels.style.gap = computed.gap;
        this.rowLabels.style.gap = computed.gap;

        for (let i = 1; i <= colStrings.length + 1; i++) {
            const span = document.createElement('span');
            span.className = 'label-num';
            span.textContent = i;
            this.colLabels.appendChild(span);
        }

        for (let i = 1; i <= rowStrings.length + 1; i++) {
            const span = document.createElement('span');
            span.className = 'label-num';
            span.textContent = i;
            this.rowLabels.appendChild(span);
        }
    }

    renderControls(controls = []) {
        this.controlsContainer.innerHTML = '';
        if (controls.length === 0) {
            this.controlsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Interaja com os elementos do grid para ver o código.</p>';
            return;
        }

        controls.forEach(control => {
            const group = document.createElement('div');
            group.className = 'control-group';

            const label = document.createElement('label');
            label.innerHTML = `${control.label} <span id="val-${control.id}" class="control-val">${control.default}${control.unit || ''}</span>`;
            
            let input;
            if (control.type === 'range') {
                input = document.createElement('input');
                input.type = 'range';
                input.min = control.min;
                input.max = control.max;
                input.value = control.default;
            } else if (control.type === 'select') {
                input = document.createElement('select');
                control.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    if (opt === control.default) option.selected = true;
                    input.appendChild(option);
                });
            }

            this.controlValues[control.id] = control.default;
            input.addEventListener('input', (e) => this.handleControlChange(control, e.target.value));

            group.appendChild(label);
            group.appendChild(input);
            this.controlsContainer.appendChild(group);
        });
    }

    handleControlChange(control, value) {
        this.controlValues[control.id] = value;
        const valDisplay = document.getElementById(`val-${control.id}`);
        if (valDisplay) valDisplay.textContent = `${value}${control.unit || ''}`;

        switch (control.id) {
            case 'gap': this.container.style.gap = `${value}px`; break;
            case 'columnGap': this.container.style.columnGap = `${value}px`; break;
            case 'rowGap': this.container.style.rowGap = `${value}px`; break;
            case 'cols': this.container.style.gridTemplateColumns = `${value}px 1fr ${value}px`; break;
            case 'rowHeight': this.container.style.gridTemplateRows = `${value}px 1fr`; break;
            case 'sidebarWidth': this.container.style.gridTemplateColumns = `${value}px 1fr`; break;
            case 'justifyItems': this.container.style.justifyItems = value; break;
            case 'alignItems': this.container.style.alignItems = value; break;
            case 'display': this.container.style.display = value; break;
            case 'repeatCount':
                this.container.style.gridTemplateColumns = `repeat(${value}, minmax(${this.controlValues['minWidth'] || 100}px, 1fr))`;
                break;
            case 'minWidth':
                this.container.style.gridTemplateColumns = `repeat(${this.controlValues['repeatCount'] || 3}, minmax(${value}px, 1fr))`;
                break;
            case 'itemWidth':
            case 'itemHeight':
                const item = this.container.querySelector('.grid-item');
                if (item) {
                    const w = parseInt(this.controlValues['itemWidth']) || 1;
                    const h = parseInt(this.controlValues['itemHeight']) || 1;
                    const colStart = parseInt(item.style.gridColumnStart) || 1;
                    const rowStart = parseInt(item.style.gridRowStart) || 1;
                    item.style.gridColumn = `${colStart} / ${colStart + w}`;
                    item.style.gridRow = `${rowStart} / ${rowStart + h}`;
                }
                break;
        }
        
        this.renderLabels();

        // Re-create overlay if dimensions changed
        if (this.currentTopic && this.currentTopic.initialGrid.interactive) {
            const computed = getComputedStyle(this.container);
            this.createOverlay(computed.gridTemplateColumns, computed.gridTemplateRows);
        }
        
        this.updateCode();
    }

    createOverlay(cols, rows) {
        const existing = this.container.querySelector('.grid-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'grid-overlay';
        overlay.style.gridTemplateColumns = cols;
        overlay.style.gridTemplateRows = rows;
        overlay.style.gap = getComputedStyle(this.container).gap;

        const colCount = cols.split(' ').length;
        const rowCount = rows.split(' ').length;

        for (let i = 0; i < colCount * rowCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell-hint';
            overlay.appendChild(cell);
        }
        this.container.appendChild(overlay);
    }

    startDrag(e, item) {
        e.preventDefault();
        this.isDragging = true;
        this.draggedItem = item;
        const rect = item.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
        this.draggedWidth = rect.width;
        this.draggedHeight = rect.height;

        item.style.gridArea = 'auto';
        item.style.gridColumn = 'auto';
        item.style.gridRow = 'auto';
        item.style.transition = 'none';
        item.classList.add('dragging');
        item.style.position = 'absolute';
        item.style.width = `${this.draggedWidth}px`;
        item.style.height = `${this.draggedHeight}px`;
        item.style.zIndex = '1000';

        this.drag(e);
        document.addEventListener('mousemove', this.drag);
        document.addEventListener('mouseup', this.stopDrag);
    }

    drag = (e) => {
        if (!this.isDragging || !this.draggedItem) return;
        const containerRect = this.container.getBoundingClientRect();
        let x = e.clientX - containerRect.left - this.offsetX;
        let y = e.clientY - containerRect.top - this.offsetY;
        this.draggedItem.style.left = `${x}px`;
        this.draggedItem.style.top = `${y}px`;
        this.highlightCell(e.clientX, e.clientY);
    }

    stopDrag = (e) => {
        if (!this.isDragging) return;
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.stopDrag);

        const pos = this.calculateGridPosition(e.clientX, e.clientY);
        const w = parseInt(this.controlValues['itemWidth']) || 1;
        const h = parseInt(this.controlValues['itemHeight']) || 1;

        this.draggedItem.classList.remove('dragging');
        Object.assign(this.draggedItem.style, {
            position: '', left: '', top: '', width: '', height: '', transition: '',
            gridColumn: `${pos.col} / ${pos.col + w}`,
            gridRow: `${pos.row} / ${pos.row + h}`
        });

        this.isDragging = false;
        this.draggedItem = null;
        this.clearHighlights();
        this.updateCode();
    }

    calculateGridPosition(clientX, clientY) {
        const hints = Array.from(this.container.querySelectorAll('.grid-cell-hint'));
        const computed = getComputedStyle(this.container);
        const colCount = computed.gridTemplateColumns.split(' ').length;
        const rowCount = computed.gridTemplateRows.split(' ').length;

        if (hints.length > 0) {
            // Find the hint cell that contains the point
            for (let i = 0; i < hints.length; i++) {
                const rect = hints[i].getBoundingClientRect();
                if (clientX >= rect.left && clientX <= rect.right &&
                    clientY >= rect.top && clientY <= rect.bottom) {
                    const row = Math.floor(i / colCount) + 1;
                    const col = (i % colCount) + 1;
                    return { col, row };
                }
            }
        }

        // Fallback to simple calculation if hints aren't ready
        const containerRect = this.container.getBoundingClientRect();
        const relX = clientX - containerRect.left;
        const relY = clientY - containerRect.top;
        const colSize = containerRect.width / colCount;
        const rowSize = containerRect.height / rowCount;

        return {
            col: Math.max(1, Math.min(Math.floor(relX / colSize) + 1, colCount)),
            row: Math.max(1, Math.min(Math.floor(relY / rowSize) + 1, rowCount))
        };
    }

    highlightCell(clientX, clientY) {
        this.clearHighlights();
        const pos = this.calculateGridPosition(clientX, clientY);
        const hints = this.container.querySelectorAll('.grid-cell-hint');
        const computed = getComputedStyle(this.container);
        const colCount = computed.gridTemplateColumns.split(' ').length;
        
        const index = (pos.row - 1) * colCount + (pos.col - 1);
        if (hints[index]) hints[index].classList.add('highlight');
    }

    clearHighlights() {
        this.container.querySelectorAll('.grid-cell-hint').forEach(h => h.classList.remove('highlight'));
    }

    updateCode() {
        let css = `.container {\n  display: ${this.container.style.display || 'grid'};\n`;
        const s = this.container.style;
        if (s.gridTemplateColumns) css += `  grid-template-columns: ${s.gridTemplateColumns};\n`;
        if (s.gridTemplateRows) css += `  grid-template-rows: ${s.gridTemplateRows};\n`;
        if (s.gap && s.gap !== '10px') css += `  gap: ${s.gap};\n`;
        if (s.justifyItems && s.justifyItems !== 'stretch') css += `  justify-items: ${s.justifyItems};\n`;
        if (this.container.classList.contains('areas-mode')) {
            css += `  grid-template-areas: \n    "header header header"\n    "sidebar main main"\n    "footer footer footer";\n`;
        }
        css += `}\n\n`;

        this.container.querySelectorAll('.grid-item').forEach((item, i) => {
            const gridCol = item.style.gridColumn;
            const gridRow = item.style.gridRow;
            const gridArea = item.style.gridArea;
            if ((gridCol && gridCol !== 'auto') || (gridRow && gridRow !== 'auto') || (gridArea && gridArea !== 'auto')) {
                css += `.item-${i + 1} {\n`;
                if (gridCol && gridCol !== 'auto') css += `  grid-column: ${gridCol};\n`;
                if (gridRow && gridRow !== 'auto') css += `  grid-row: ${gridRow};\n`;
                if (gridArea && gridArea !== 'auto' && this.container.classList.contains('areas-mode')) css += `  grid-area: ${gridArea};\n`;
                css += `}\n\n`;
            }
        });
        this.codeDisplay.textContent = css;
    }
}