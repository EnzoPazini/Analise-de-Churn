# Análise de Churn — BankChurners

Projeto de análise e previsão de churn (cancelamento de clientes) de um banco, usando o dataset [BankChurners](https://www.kaggle.com/datasets/sakshigoyal7/credit-card-customers). Inclui um notebook com todo o pipeline de dados + modelo, e um dashboard estático em HTML para visualização dos resultados.

## Estrutura do repositório

```
.
├── BankChurners.csv              # Dataset original
├── Analise.ipynb       # Notebook com o pipeline completo
├── dashboard-churn/
│   ├── index.html                # Página do dashboard
│   ├── style.css                 # Estilos
│   └── script.js                 # Lógica dos gráficos (boxplots em SVG)
└── README.md
```

## Notebook (`Analise.ipynb`)

Organizado em etapas, cada uma em sua própria célula com uma célula markdown explicando o objetivo:

1. **Importação de bibliotecas**
2. **Carregamento e limpeza dos dados** — remove colunas auxiliares do dataset original e cria a coluna alvo `Churn`
3. **Análise exploratória (EDA)** — boxplots comparando clientes ativos vs. em churn
4. **Pré-processamento** — dummies, split treino/teste (80/20) e padronização
5. **Treinamento do modelo** — Regressão Logística com `class_weight='balanced'`
6. **Avaliação** — matriz de confusão e relatório de classificação
7. **Impacto financeiro** — estimativa de lucro retido vs. perdido com base nas previsões

### Como rodar

```bash
pip install numpy pandas matplotlib seaborn scikit-learn jupyter
jupyter notebook Aula01-organizado.ipynb
```

> O notebook espera o arquivo `BankChurners.csv` na mesma pasta.

## Dashboard (`dashboard-churn/`)

Página estática (HTML + CSS + JS puro, sem dependências externas) com um resumo visual dos resultados do modelo: KPIs principais, matriz de confusão, impacto financeiro estimado e os boxplots das duas variáveis mais relevantes.

### Como visualizar

Basta abrir `dashboard-churn/index.html` no navegador — não precisa de servidor. Se preferir, também pode ativar o **GitHub Pages** apontando para a pasta `dashboard-churn/` para ter uma versão publicada online.

Os números exibidos (KPIs, matriz de confusão, valores de impacto financeiro) foram copiados manualmente da saída do notebook; se o modelo for retreinado com dados diferentes, é preciso atualizar esses valores em `index.html` e as estatísticas dos boxplots em `script.js`.

## Principais resultados do modelo

| Métrica          | Valor |
| ---------------- | ----- |
| Acurácia         | 86,2% |
| Recall (churn)   | 82,2% |
| Precisão (churn) | 54,7% |
| F1-score (churn) | 0,657 |
| Falsos negativos | 58    |
| Falsos positivos | 221   |

O modelo prioriza **recall** sobre precisão (via `class_weight='balanced'`), já que o custo de não detectar um cliente em risco de churn tende a ser maior do que o custo de investigar um falso alarme.
