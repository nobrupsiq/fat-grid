const topics = {
    intro: {
        title: "Fundamentos do Grid",
        description: "O CSS Grid transforma um elemento em container com `display: grid`. Arraste os itens para ver o código!",
        explanation: `
            <h3>O que é o Grid?</h3>
            <p>O CSS Grid Layout permite organizar o conteúdo em colunas e linhas. Arraste qualquer quadrado azul para uma nova célula!</p>
            <ul>
                <li><code>display: grid;</code> define o container.</li>
                <li>Os filhos tornam-se <code>grid items</code>.</li>
            </ul>
        `,
        initialGrid: {
            columns: "1fr 1fr 1fr 1fr",
            rows: "1fr 1fr 1fr 1fr",
            interactive: true,
            items: [
                { id: 1, text: "1" }, { id: 2, text: "2" }, { id: 3, text: "3" }
            ],
            controls: [
                { id: 'display', label: 'Display', type: 'select', options: ['grid', 'block', 'flex'], default: 'grid' }
            ]
        }
    },
    'columns-rows': {
        title: "Colunas e Linhas",
        description: "Defina o esqueleto com `grid-template-columns` e `grid-template-rows`.",
        explanation: `
            <h3>Estruturando</h3>
            <p>Você decide quantas colunas e linhas quer. A unidade <code>fr</code> ocupa o espaço disponível proporcionalmente.</p>
        `,
        initialGrid: {
            columns: "150px 1fr 150px",
            rows: "100px 1fr",
            interactive: true,
            items: [
                { id: 1, text: "H", area: "1 / 1 / 2 / 4" },
                { id: 2, text: "S", area: "2 / 1 / 3 / 2" }
            ],
            controls: [
                { id: 'cols', label: 'Colunas Laterais (px)', type: 'range', min: 50, max: 250, default: 150, unit: 'px' },
                { id: 'rowHeight', label: 'Altura Header (px)', type: 'range', min: 50, max: 200, default: 100, unit: 'px' }
            ]
        }
    },
    gap: {
        title: "Espaçamento (Gap)",
        description: "Controle o espaço entre os itens sem margens.",
        explanation: `
            <h3>Gap</h3>
            <p>Com o <code>gap</code>, você define o espaço entre as células. Use os sliders para ver o efeito!</p>
        `,
        initialGrid: {
            columns: "1fr 1fr 1fr",
            rows: "1fr 1fr",
            gap: "20px",
            interactive: true,
            items: [
                { id: 1, text: "A" }, { id: 2, text: "B" }, { id: 3, text: "C" },
                { id: 4, text: "D" }, { id: 5, text: "E" }, { id: 6, text: "F" }
            ],
            controls: [
                { id: 'gap', label: 'Gap Geral', type: 'range', min: 0, max: 50, default: 20, unit: 'px' },
                { id: 'columnGap', label: 'Column Gap', type: 'range', min: 0, max: 50, default: 20, unit: 'px' },
                { id: 'rowGap', label: 'Row Gap', type: 'range', min: 0, max: 50, default: 20, unit: 'px' }
            ]
        }
    },
    positioning: {
        title: "Posicionamento Livre",
        description: "Cada item pode ocupar células específicas. Arraste e veja os números!",
        explanation: `
            <h3>Coordenadas</h3>
            <p>O Grid é numerado por linhas de 1 a 5. Arraste o quadrado e use os sliders para mudar o tamanho (span).</p>
        `,
        initialGrid: {
            columns: "1fr 1fr 1fr 1fr",
            rows: "1fr 1fr 1fr 1fr",
            interactive: true,
            items: [
                { id: 1, text: "Mova-me!", area: "2 / 2 / 3 / 3" }
            ],
            controls: [
                { id: 'itemWidth', label: 'Largura (Span)', type: 'range', min: 1, max: 4, default: 1, unit: ' col' },
                { id: 'itemHeight', label: 'Altura (Span)', type: 'range', min: 1, max: 4, default: 1, unit: ' row' }
            ]
        }
    },
    areas: {
        title: "Nomeando Áreas",
        description: "Crie um layout visual usando `grid-template-areas`.",
        explanation: `
            <h3>Nomes de Áreas</h3>
            <p>Você dá nomes (header, main) e associa os itens. Arraste a largura da sidebar!</p>
        `,
        initialGrid: {
            columns: "150px 1fr",
            rows: "60px 1fr 60px",
            areas: true,
            interactive: true,
            items: [
                { id: 1, text: "Header", area: "header" },
                { id: 2, text: "Sidebar", area: "sidebar" },
                { id: 3, text: "Main", area: "main" },
                { id: 4, text: "Footer", area: "footer" }
            ],
            controls: [
                { id: 'sidebarWidth', label: 'Largura Sidebar', type: 'range', min: 50, max: 300, default: 150, unit: 'px' }
            ]
        }
    },
    alignment: {
        title: "Alinhamento",
        description: "Centralize itens facilmente com justify e align.",
        explanation: `
            <h3>Alinhamento</h3>
            <p>Controle como os itens se posicionam dentro das células.</p>
        `,
        initialGrid: {
            columns: "1fr 1fr",
            rows: "1fr 1fr",
            alignment: "center",
            interactive: true,
            items: [
                { id: 1, text: "1" }, { id: 2, text: "2" },
                { id: 3, text: "3" }, { id: 4, text: "4" }
            ],
            controls: [
                { id: 'justifyItems', label: 'Justify Items', type: 'select', options: ['stretch', 'center', 'start', 'end'], default: 'center' },
                { id: 'alignItems', label: 'Align Items', type: 'select', options: ['stretch', 'center', 'start', 'end'], default: 'center' }
            ]
        }
    },
    'repeat-minmax': {
        title: "Repeat & Min-Max",
        description: "Automatize seu grid com funções inteligentes.",
        explanation: `
            <h3>Automação</h3>
            <p>Use <code>repeat()</code> para criar várias colunas iguais rapidamente.</p>
        `,
        initialGrid: {
            columns: "repeat(3, 1fr)",
            rows: "100px 100px",
            interactive: true,
            items: [
                { id: 1, text: "1" }, { id: 2, text: "2" }, { id: 3, text: "3" }
            ],
            controls: [
                { id: 'repeatCount', label: 'Qtd Colunas', type: 'range', min: 1, max: 6, default: 3 },
                { id: 'minWidth', label: 'Min Width (px)', type: 'range', min: 50, max: 200, default: 100, unit: 'px' }
            ]
        }
    }
};