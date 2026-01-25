# 🌧️ Validação de Precipitação INMET × ERA5 (Nordeste, 1980–2023)

Este projeto realiza a **validação de dados de precipitação mensal** do Nordeste brasileiro (NEB), comparando **dados observados do INMET** com **dados reanalisados do ERA5-Land**.  
O pipeline inclui: limpeza de dados, filtragem por completude, extração de ERA5 via **Google Earth Engine (GEE)** e avaliação estatística com métricas de desempenho: **R², r, EAM, RMSE e ERM**.

---

## 📚 1️⃣ Origem dos Dados

### Dados INMET
- Fonte: **Banco de Dados Meteorológicos do INMET**  
- Link: [https://bdmep.inmet.gov.br/](https://bdmep.inmet.gov.br/)  
- Período solicitado: **1940–2023**  
- Cobertura: todas as estações meteorológicas do Nordeste  
- Tipo de dado: **precipitação mensal total**  

> Para este estudo, utilizamos **1980–2023**, selecionando apenas estações com dados completos suficientes.

### Dados ERA5
- Produto: **ERA5-Land / DAILY_AGGR** (ECMWF Reanalysis)  
- Variável: **total_precipitation_sum** (mm/dia)  
- Extração: acumulado mensal via **Google Earth Engine (GEE)**  

---

## 🎯 2️⃣ Objetivos

1. Organizar e filtrar os dados brutos do INMET, garantindo consistência e completude.  
2. Extrair os dados ERA5 para os pontos das estações meteorológicas.  
3. Validar estatisticamente os dados combinados INMET × ERA5 com métricas:  
   - **R²** – coeficiente de determinação da regressão linear  
   - **r** – correlação de Pearson  
   - **EAM** – erro absoluto médio  
   - **RMSE** – raiz do erro quadrático médio  
   - **ERM** – erro relativo médio (%)  

---

## 🗂️ 3️⃣ Descrição dos Notebooks

### **01_organizar_dados_inmet.ipynb**
- Extrai e lê os arquivos CSV do INMET  
- Cria planilhas resumidas:
  - `01_RESUMO_ESTACOES.xlsx` – metadados das estações  
  - `02_BASE_MENSAL_LONGA.xlsx` – base longa de precipitação  
- Pivotagem da base e cálculo de **% de dados disponíveis**  
- Filtra estações para o período de estudo (1980–2023)  

### **02_era5_gee_extracao.ipynb**
- Autentica e inicializa o **Google Earth Engine (GEE)**  
- Cria FeatureCollection das estações válidas  
- Extrai precipitação mensal acumulada do ERA5  
- Combina com os dados do INMET (`07_INMET_ERA5_MENSAL_ACUM.xlsx`)  

### **03_validacao_estatistica.ipynb**
- Valida estatisticamente INMET × ERA5  
- Calcula métricas: **R², r, EAM, RMSE, ERM**  
- Gera planilha final: `08_VALIDACAO_ESTATISTICA_FINAL.xlsx`  

---

## ⚙️ 4️⃣ Como Rodar

1. Coloque o arquivo `estacoesNEB.rar` do INMET em `dados_brutos/`.  
2. Abra os notebooks no **Google Colab** e execute na ordem:  
   1. `01_organizar_dados_inmet.ipynb`  
   2. `02_era5_gee_extracao.ipynb` (**autenticação GEE necessária**)  
   3. `03_validacao_estatistica.ipynb`  
3. As planilhas Excel serão salvas automaticamente em `planilhas_geradas/`.  

> A extração do ERA5 pode demorar dependendo do número de estações e do período analisado.

---

## 📦 5️⃣  Requisitos

- **Python 3.9+**  
- Bibliotecas (listadas em `requirements.txt`):  
  - `pandas`, `numpy`, `matplotlib`, `scikit-learn`, `scipy`, `rarfile`, `earthengine-api`, `geemap`, `folium`  
- Conta Google para acesso ao **Google Earth Engine**  

---

## 🔗 6️⃣ Referências

- **INMET – Banco de Dados Meteorológicos:** [https://bdmep.inmet.gov.br/](https://bdmep.inmet.gov.br/)  
- **ERA5-Land / ECMWF Reanalysis**  
- **Google Earth Engine:** [https://earthengine.google.com/](https://earthengine.google.com/)  

---

## ✅ 7️⃣  Resultados Esperados

| Planilha | Conteúdo |
|----------|----------|
| `01_RESUMO_ESTACOES.xlsx` | Resumo das estações com metadados |
| `02_BASE_MENSAL_LONGA.xlsx` | Base longa de precipitação mensal bruta |
| `03_INMET_MENSAL_TABELADO.xlsx` | Base pivotada (jan–dez + total) |
| `04_BASE_MENSAL_LONGA_ESTUDO.xlsx` | Base longa filtrada para 1980–2023 |
| `05_INMET_MENSAL_TABELADO_ESTUDO.xlsx` | Base pivotada filtrada |
| `06_RESUMO_ESTACOES_ESTUDO.xlsx` | Resumo das estações do período de estudo com % concluída |
| `07_INMET_ERA5_MENSAL_ACUM.xlsx` | Dados combinados INMET × ERA5 |
| `08_VALIDACAO_ESTATISTICA_FINAL.xlsx` | Validação estatística com R², r, EAM, RMSE e ERM |

---



##  Autor / Créditos

**Edivan Silva**  
Estudante de graduação em **Meteorologia - UFCG**  

📄 Lattes: [http://lattes.cnpq.br/2690669771522466](http://lattes.cnpq.br/2690669771522466)  

---

> Qualquer dúvida, sugestão ou colaboração é bem-vinda!
