# 🏦 Análise de Churn — BankChurners

> Como transformar 10.127 registros de clientes em um sistema que aponta, com antecedência, quem está prestes a cancelar o cartão — e quanto isso vale em dinheiro.

## O problema

Todo banco perde clientes. Isso, por si só, não é o problema.

O problema é que a maioria das instituições só descobre a perda **depois** que ela já aconteceu — quando o cliente já cancelou o cartão e a receita gerada por ele já foi embora. Reter um cliente é comprovadamente mais barato do que conquistar um novo, mas retenção só funciona se você sabe **quem** abordar e **antes** de ser tarde demais.

A pergunta que guiou este projeto: dá para usar o histórico de comportamento de um cliente para prever, com antecedência, que ele está caminhando para o cancelamento?

## A investigação

Tudo começou com a base [BankChurners](https://www.kaggle.com/datasets/sakshigoyal7/credit-card-customers): **10.127 clientes**, dos quais **1.627 (16%) já cancelaram** o cartão.

O primeiro passo, dentro do notebook `Analise.ipynb`, foi limpar os dados — remover colunas irrelevantes geradas por um classificador auxiliar do próprio dataset — e transformar `Attrition_Flag` em uma variável binária (`Churn`), a que o projeto todo gira em torno.

Com os dados limpos, veio a pergunta que sustenta a hipótese do projeto: **existe algum sinal de comportamento que separa quem vai cancelar de quem vai ficar?**

A análise exploratória respondeu que sim. Comparando clientes ativos e clientes que cancelaram:

- Clientes em churn têm uma **mediana de transações no ano visivelmente mais baixa** do que clientes ativos.
- Clientes em churn passam **mais meses inativos** ao longo do ano.

Ou seja: o cliente não cancela do nada. Ele vai se afastando — e esse afastamento fica registrado nos dados bem antes do cancelamento formal.

## A construção da solução

Com o sinal identificado, o passo seguinte foi transformar essas variáveis em um modelo preditivo:

- **Pré-processamento**: variáveis categóricas convertidas em dummies, dados divididos em 80% treino / 20% teste (mantendo a proporção de churn nos dois grupos), variáveis numéricas padronizadas com `StandardScaler`.
- **Modelo**: Regressão Logística, treinada com `class_weight='balanced'`.

Essa última escolha não foi por acaso. Em um problema de churn, os dois tipos de erro do modelo **não custam a mesma coisa**:

- Deixar passar um cliente que vai cancelar (**falso negativo**) é receita perdida silenciosamente.
- Sinalizar como risco um cliente que na verdade ficaria (**falso positivo**) custa, no máximo, um contato de retenção desnecessário.

Por isso o modelo foi deliberadamente ajustado para **priorizar recall** — errar mais pro lado de "avisar demais" do que pro lado de "deixar passar".

## Os resultados

| Métrica | Valor |
|---|---|
| Acurácia geral | 86,2% |
| **Recall (churn)** | **82,2%** |
| Precisão (churn) | 54,7% |
| F1-score (churn) | 0,657 |
| Falsos negativos | 58 |
| Falsos positivos | 221 |

Na prática: de cada 10 clientes que realmente cancelariam, o modelo identifica corretamente **mais de 8** — a tempo de alguma ação de retenção ser tomada.

## O impacto — traduzido em dinheiro

Aplicando uma taxa de retenção estimada de 2% sobre o volume transacionado dos clientes classificados corretamente:

- 💰 **~R$ 16.190** em lucro que seria perdido, mas foi detectado a tempo pelo modelo.
- ⚠️ **~R$ 5.325** em lucro que ainda escapa pelos pontos cegos (os 58 falsos negativos).

Mesmo com um modelo simples e totalmente interpretável, o retorno financeiro líquido já é positivo — e o próprio resultado aponta exatamente onde investir esforço para melhorar ainda mais essa margem: reduzir os falsos negativos.

## Conclusão

O projeto resolveu o problema original ao transformar um evento reativo (cliente cancelou) em um sinal preditivo e acionável (cliente em risco, ainda dentro da base). O passo natural seguinte seria alimentar campanhas de retenção **direcionadas** com essas previsões, em vez de um esforço genérico para toda a base de clientes.

---

## Estrutura do repositório

```
.
├── BankChurners.csv    # Dataset original
├── Analise.ipynb        # Notebook com o pipeline completo
├── index.html            # Página do dashboard
├── style.css             # Estilos do dashboard
├── script.js             # Lógica dos gráficos do dashboard (boxplots em SVG)
└── README.md
```

## Notebook (`Analise.ipynb`)

Organizado em etapas, cada uma em sua própria célula com uma célula markdown explicando o objetivo:

1. **Importação de bibliotecas**
2. **Carregamento e limpeza dos dados**
3. **Análise exploratória (EDA)**
4. **Pré-processamento**
5. **Treinamento do modelo**
6. **Avaliação**
7. **Impacto financeiro**

### Como rodar

```bash
pip install numpy pandas matplotlib seaborn scikit-learn jupyter
jupyter notebook Analise.ipynb
```

> O notebook espera o arquivo `BankChurners.csv` na mesma pasta.

## Dashboard (`index.html`)

Página estática (HTML + CSS + JS puro, sem dependências externas) com um resumo visual dos resultados: KPIs principais, matriz de confusão, impacto financeiro estimado e os boxplots que sustentam a hipótese do projeto.

Basta abrir `index.html` no navegador — não precisa de servidor. Também dá para publicar via **GitHub Pages**, apontando para a raiz do repositório.
