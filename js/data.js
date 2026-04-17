const learningTracks = {
  grid: {
    label: "Grid",
    order: [
      "intro",
      "columns-rows",
      "gap",
      "positioning",
      "areas",
      "alignment",
      "repeat-minmax",
    ],
    topics: {
      intro: {
        navLabel: "Fundamentos",
        title: "Fundamentos do Grid",
        description:
          "O CSS Grid transforma um elemento em container com `display: grid`. Arraste os itens para ver o código!",
        explanation: `
            <h3>O que é o Grid?</h3>
            <p>O CSS Grid Layout permite organizar o conteúdo em colunas e linhas. Arraste qualquer quadrado para uma nova célula!</p>
            <ul>
                <li><code>display: grid;</code> define o container.</li>
                <li>Os filhos tornam-se <code>grid items</code>.</li>
            </ul>
        `,
        initialGrid: {
          mode: "grid",
          columns: "1fr 1fr 1fr 1fr",
          rows: "1fr 1fr 1fr 1fr",
          interactive: true,
          items: [
            { id: 1, text: "1" },
            { id: 2, text: "2" },
            { id: 3, text: "3" },
          ],
          controls: [
            {
              id: "display",
              label: "Display",
              type: "select",
              options: ["grid", "block", "flex"],
              default: "grid",
            },
          ],
        },
      },
      "columns-rows": {
        navLabel: "Colunas e Linhas",
        title: "Colunas e Linhas",
        description:
          "Defina o esqueleto com `grid-template-columns` e `grid-template-rows`.",
        explanation: `
            <h3>Estruturando</h3>
            <p>Você decide quantas colunas e linhas quer. A unidade <code>fr</code> ocupa o espaço disponível proporcionalmente.</p>
        `,
        initialGrid: {
          mode: "grid",
          columns: "150px 1fr 150px",
          rows: "100px 1fr",
          interactive: true,
          items: [
            { id: 1, text: "H", area: "1 / 1 / 2 / 4" },
            { id: 2, text: "S", area: "2 / 1 / 3 / 2" },
          ],
          controls: [
            {
              id: "cols",
              label: "Colunas Laterais (px)",
              type: "range",
              min: 50,
              max: 250,
              default: 150,
              unit: "px",
            },
            {
              id: "rowHeight",
              label: "Altura Header (px)",
              type: "range",
              min: 50,
              max: 200,
              default: 100,
              unit: "px",
            },
          ],
        },
      },
      gap: {
        navLabel: "Espaçamento (Gap)",
        title: "Espaçamento (Gap)",
        description: "Controle o espaço entre os itens sem margens.",
        explanation: `
            <h3>Gap</h3>
            <p>Com o <code>gap</code>, você define o espaço entre as células. Use os sliders para ver o efeito!</p>
        `,
        initialGrid: {
          mode: "grid",
          columns: "1fr 1fr 1fr",
          rows: "1fr 1fr",
          gap: "20px",
          interactive: true,
          items: [
            { id: 1, text: "A" },
            { id: 2, text: "B" },
            { id: 3, text: "C" },
            { id: 4, text: "D" },
            { id: 5, text: "E" },
            { id: 6, text: "F" },
          ],
          controls: [
            {
              id: "gap",
              label: "Gap Geral",
              type: "range",
              min: 0,
              max: 50,
              default: 20,
              unit: "px",
            },
            {
              id: "columnGap",
              label: "Column Gap",
              type: "range",
              min: 0,
              max: 50,
              default: 20,
              unit: "px",
            },
            {
              id: "rowGap",
              label: "Row Gap",
              type: "range",
              min: 0,
              max: 50,
              default: 20,
              unit: "px",
            },
          ],
        },
      },
      positioning: {
        navLabel: "Posicionamento",
        title: "Posicionamento Livre",
        description:
          "Cada item pode ocupar células específicas. Arraste e veja os números!",
        explanation: `
            <h3>Coordenadas</h3>
            <p>O Grid é numerado por linhas de 1 a 5. Arraste o quadrado e use os sliders para mudar o tamanho (span).</p>
        `,
        initialGrid: {
          mode: "grid",
          columns: "1fr 1fr 1fr 1fr",
          rows: "1fr 1fr 1fr 1fr",
          interactive: true,
          items: [{ id: 1, text: "Mova-me!", area: "2 / 2 / 3 / 3" }],
          controls: [
            {
              id: "itemWidth",
              label: "Largura (Span)",
              type: "range",
              min: 1,
              max: 4,
              default: 1,
              unit: " col",
            },
            {
              id: "itemHeight",
              label: "Altura (Span)",
              type: "range",
              min: 1,
              max: 4,
              default: 1,
              unit: " row",
            },
          ],
        },
      },
      areas: {
        navLabel: "Nomeando Áreas",
        title: "Nomeando Áreas",
        description: "Crie um layout visual usando `grid-template-areas`.",
        explanation: `
            <h3>Nomes de Áreas</h3>
            <p>Você dá nomes (header, main) e associa os itens. Arraste a largura da sidebar!</p>
        `,
        initialGrid: {
          mode: "grid",
          columns: "150px 1fr",
          rows: "60px 1fr 60px",
          areas: true,
          interactive: true,
          items: [
            { id: 1, text: "Header", area: "header" },
            { id: 2, text: "Sidebar", area: "sidebar" },
            { id: 3, text: "Main", area: "main" },
            { id: 4, text: "Footer", area: "footer" },
          ],
          controls: [
            {
              id: "sidebarWidth",
              label: "Largura Sidebar",
              type: "range",
              min: 50,
              max: 300,
              default: 150,
              unit: "px",
            },
          ],
        },
      },
      alignment: {
        navLabel: "Alinhamento",
        title: "Alinhamento",
        description: "Centralize itens facilmente com justify e align.",
        explanation: `
            <h3>Alinhamento</h3>
            <p>Controle como os itens se posicionam dentro das células.</p>
        `,
        initialGrid: {
          mode: "grid",
          columns: "1fr 1fr",
          rows: "1fr 1fr",
          alignment: "center",
          interactive: true,
          items: [
            { id: 1, text: "1" },
            { id: 2, text: "2" },
            { id: 3, text: "3" },
            { id: 4, text: "4" },
          ],
          controls: [
            {
              id: "justifyItems",
              label: "Justify Items",
              type: "select",
              options: ["stretch", "center", "start", "end"],
              default: "center",
            },
            {
              id: "alignItems",
              label: "Align Items",
              type: "select",
              options: ["stretch", "center", "start", "end"],
              default: "center",
            },
          ],
        },
      },
      "repeat-minmax": {
        navLabel: "Repeat & Min-Max",
        title: "Repeat & Min-Max",
        description: "Automatize seu grid com funções inteligentes.",
        explanation: `
            <h3>Automação</h3>
            <p>Use <code>repeat()</code> para criar várias colunas iguais rapidamente.</p>
        `,
        initialGrid: {
          mode: "grid",
          columns: "repeat(3, 1fr)",
          rows: "100px 100px",
          interactive: true,
          items: [
            { id: 1, text: "1" },
            { id: 2, text: "2" },
            { id: 3, text: "3" },
          ],
          controls: [
            {
              id: "repeatCount",
              label: "Qtd Colunas",
              type: "range",
              min: 1,
              max: 6,
              default: 3,
            },
            {
              id: "minWidth",
              label: "Min Width (px)",
              type: "range",
              min: 50,
              max: 200,
              default: 100,
              unit: "px",
            },
          ],
        },
      },
    },
  },
  flex: {
    label: "Flexbox",
    order: [
      "flex-intro",
      "flex-direction",
      "flex-justify",
      "flex-align",
      "flex-wrap-gap",
      "flex-item-control",
    ],
    topics: {
      "flex-intro": {
        navLabel: "Fundamentos",
        title: "Fundamentos do Flexbox",
        description:
          "Flexbox organiza itens em um eixo principal. Arraste para mudar a ordem e veja o CSS.",
        explanation: `
            <h3>O que é Flexbox?</h3>
            <p>Flexbox é perfeito para distribuir elementos em uma dimensão (linha ou coluna). Nesta trilha, você pode arrastar para reordenar os itens.</p>
            <ul>
                <li><code>display: flex;</code> ativa o contexto flex.</li>
                <li><code>justify-content</code> alinha no eixo principal.</li>
                <li><code>align-items</code> alinha no eixo cruzado.</li>
            </ul>
        `,
        initialFlex: {
          mode: "flex",
          direction: "row",
          wrap: "nowrap",
          justifyContent: "flex-start",
          alignItems: "stretch",
          gap: "12px",
          interactive: true,
          items: [
            { id: 1, text: "1" },
            { id: 2, text: "2" },
            { id: 3, text: "3" },
            { id: 4, text: "4" },
          ],
          controls: [
            {
              id: "flexDirection",
              label: "Flex Direction",
              type: "select",
              options: ["row", "row-reverse", "column", "column-reverse"],
              default: "row",
            },
            {
              id: "flexWrap",
              label: "Flex Wrap",
              type: "select",
              options: ["nowrap", "wrap"],
              default: "nowrap",
            },
          ],
        },
      },
      "flex-direction": {
        navLabel: "Direção",
        title: "Direção do Eixo Principal",
        description: "Troque o eixo principal para entender como o fluxo muda.",
        explanation: `
            <h3>flex-direction</h3>
            <p>Essa propriedade define para onde os itens apontam: horizontalmente ou verticalmente.</p>
        `,
        initialFlex: {
          mode: "flex",
          direction: "row",
          wrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          interactive: true,
          items: [
            { id: 1, text: "A" },
            { id: 2, text: "B" },
            { id: 3, text: "C" },
          ],
          controls: [
            {
              id: "flexDirection",
              label: "Flex Direction",
              type: "select",
              options: ["row", "row-reverse", "column", "column-reverse"],
              default: "row",
            },
            {
              id: "justifyContent",
              label: "Justify Content",
              type: "select",
              options: [
                "flex-start",
                "center",
                "flex-end",
                "space-between",
                "space-around",
                "space-evenly",
              ],
              default: "space-between",
            },
          ],
        },
      },
      "flex-justify": {
        navLabel: "Justify Content",
        title: "Distribuição no Eixo Principal",
        description:
          "Use justify-content para distribuir os espaços entre itens flex.",
        explanation: `
            <h3>justify-content</h3>
            <p>Controla como os itens se distribuem no eixo principal: juntos no começo, no fim, centralizados ou com espaços automáticos.</p>
        `,
        initialFlex: {
          mode: "flex",
          direction: "row",
          wrap: "nowrap",
          justifyContent: "space-around",
          alignItems: "center",
          gap: "8px",
          interactive: true,
          items: [
            { id: 1, text: "1" },
            { id: 2, text: "2" },
            { id: 3, text: "3" },
            { id: 4, text: "4" },
          ],
          controls: [
            {
              id: "justifyContent",
              label: "Justify Content",
              type: "select",
              options: [
                "flex-start",
                "center",
                "flex-end",
                "space-between",
                "space-around",
                "space-evenly",
              ],
              default: "space-around",
            },
          ],
        },
      },
      "flex-align": {
        navLabel: "Align Items",
        title: "Alinhamento no Eixo Cruzado",
        description:
          "Veja como align-items muda o alinhamento vertical/horizontal.",
        explanation: `
            <h3>align-items</h3>
            <p>Alinha todos os itens no eixo cruzado do container flex. Excelente para centralização real.</p>
        `,
        initialFlex: {
          mode: "flex",
          direction: "row",
          wrap: "nowrap",
          justifyContent: "center",
          alignItems: "stretch",
          gap: "10px",
          interactive: true,
          items: [
            { id: 1, text: "1", style: { height: "70px" } },
            { id: 2, text: "2", style: { height: "110px" } },
            { id: 3, text: "3", style: { height: "90px" } },
          ],
          controls: [
            {
              id: "alignItems",
              label: "Align Items",
              type: "select",
              options: [
                "stretch",
                "flex-start",
                "center",
                "flex-end",
                "baseline",
              ],
              default: "stretch",
            },
          ],
        },
      },
      "flex-wrap-gap": {
        navLabel: "Wrap e Gap",
        title: "Quebra de Linha e Espaçamento",
        description:
          "Combine flex-wrap com gap para construir layouts fluidos.",
        explanation: `
            <h3>flex-wrap + gap</h3>
            <p>Quando não cabe na linha, o item quebra para baixo (ou para o lado, em column). O <code>gap</code> espaça sem margin hack.</p>
        `,
        initialFlex: {
          mode: "flex",
          direction: "row",
          wrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: "16px",
          interactive: true,
          items: [
            { id: 1, text: "A" },
            { id: 2, text: "B" },
            { id: 3, text: "C" },
            { id: 4, text: "D" },
            { id: 5, text: "E" },
            { id: 6, text: "F" },
            { id: 7, text: "G" },
          ],
          controls: [
            {
              id: "flexWrap",
              label: "Flex Wrap",
              type: "select",
              options: ["nowrap", "wrap"],
              default: "wrap",
            },
            {
              id: "gap",
              label: "Gap",
              type: "range",
              min: 0,
              max: 40,
              default: 16,
              unit: "px",
            },
          ],
        },
      },
      "flex-item-control": {
        navLabel: "Itens Flex",
        title: "Controle de Item (grow, shrink, basis)",
        description:
          "Ajuste o comportamento de um item específico dentro do container flex.",
        explanation: `
            <h3>flex-grow, flex-shrink e flex-basis</h3>
            <p>Essas propriedades são aplicadas no item, não no container. Aqui, o item marcado como alvo responde aos sliders.</p>
        `,
        initialFlex: {
          mode: "flex",
          direction: "row",
          wrap: "nowrap",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "10px",
          interactive: true,
          items: [
            {
              id: 1,
              text: "Alvo",
              target: true,
              style: { flexGrow: "1", flexShrink: "1", flexBasis: "140px" },
            },
            { id: 2, text: "2", style: { flexGrow: "0", flexBasis: "90px" } },
            { id: 3, text: "3", style: { flexGrow: "0", flexBasis: "90px" } },
          ],
          controls: [
            {
              id: "itemGrow",
              label: "Alvo: flex-grow",
              type: "range",
              min: 0,
              max: 4,
              default: 1,
            },
            {
              id: "itemShrink",
              label: "Alvo: flex-shrink",
              type: "range",
              min: 0,
              max: 4,
              default: 1,
            },
            {
              id: "itemBasis",
              label: "Alvo: flex-basis",
              type: "range",
              min: 60,
              max: 260,
              default: 140,
              unit: "px",
            },
          ],
        },
      },
    },
  },
};

const topics = learningTracks.grid.topics;
