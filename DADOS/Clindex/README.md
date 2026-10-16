# 🌦️ Cálculo de Índices de Extremos Climáticos (RClimDex em Python)

Este repositório contém o script **`clindex.py`**, desenvolvido para rodar no **Google Colab**, projetado para calcular os principais índices de extremos de precipitação (metodologia **RClimDex**) para uma **localidade única** a partir de uma série temporal de dados diários de chuva.

Essa é uma alternativa prática e automatizada ao software tradicional RClimDex, permitindo processar os dados na nuvem sem precisar instalar programas complexos no computador.

## 📁 Estrutura do Repositório

```text
📦 seu-repositorio/
 ┣ 📜 clindex.py          # Script principal com a rotina de cálculo dos índices
 ┗ 📜 README.md           # Documentação do projeto
```

## 📊 Índices Calculados (ETCCDI / RClimDex)

O script calcula os seguintes índices anuais de precipitação:

* **Rx1day**: Maior precipitação acumulada em 1 dia (mm).
* **Rx5day**: Maior precipitação acumulada em 5 dias consecutivos (mm).
* **SDII**: Índice de intensidade simples diária (mm/dia) — média dos dias úmidos ($\ge 1.0$ mm).
* **R10mm**: Número de dias com chuva $\ge 10$ mm (dias chuvosos).
* **R20mm**: Número de dias com chuva $\ge 20$ mm (dias muito chuvosos).
* **R25mm**: Número de dias com chuva $\ge 25$ mm.
* **CDD**: Máximo número de dias consecutivos secos ($< 1.0$ mm).
* **CWD**: Máximo número de dias consecutivos úmidos ($\ge 1.0$ mm).
* **R95p**: Precipitação total anual devida a dias muito úmidos (acima do percentil 95 dos dias úmidos).
* **R99p**: Precipitação total anual devida a dias extremamente úmidos (acima do percentil 99 dos dias úmidos).
* **PRCPTOT**: Precipitação total anual em dias úmidos ($\ge 1.0$ mm).

## 🛠️ Requisitos e Formato dos Dados

O arquivo de entrada (CSV) deve conter obrigatoriamente duas colunas principais:
1. **Data**: No formato de data reconhecido (ex: `AAAA-MM-DD` ou `DD/MM/AAAA`).
2. **Chuva**: Valores diários de precipitação (em milímetros, mm).

## 🚀 Como Usar no Google Colab

1. Acesse o [Google Colab](https://colab.research.google.com/).
2. Crie um novo notebook.
3. Faça o upload do seu arquivo CSV de dados diários para o ambiente do Colab (ou ajuste o caminho da variável `caminho_csv` no código do `clindex.py`).
4. Copie o conteúdo de **`clindex.py`**, cole em uma célula do Colab e execute.
5. O script filtrará anos com menos de 300 dias válidos, calculará os índices ano a ano e fará o download automático de uma planilha formatada em **Excel (.xlsx)**.

## 💻 Dependências

As bibliotecas utilizadas já vêm nativamente instaladas ou são facilmente suportadas no Google Colab:
* `pandas` (Manipulação e agregação de dados)
* `numpy` (Cálculos matemáticos e estatísticos)
* `openpyxl` (Para exportação em formato Excel)