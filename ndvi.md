# 🌿 NDVI - Índice de Vegetação por Diferença Normalizada

## O que é o NDVI?

O **NDVI (Normalized Difference Vegetation Index)** é um índice espectral usado para estimar a presença, vigor e densidade da vegetação a partir de imagens de satélite. Ele é amplamente aplicado em estudos ambientais, agricultura, monitoramento de secas, uso e cobertura da terra, entre outros.

### 🧪 Fórmula do NDVI:

**NDVI = (NIR - RED) / (NIR + RED)**


- **NIR**: Refletância no infravermelho próximo (Near Infrared)
- **RED**: Refletância na faixa do vermelho (Red)

Essa equação aproveita o fato de que a vegetação reflete intensamente no infravermelho próximo e absorve fortemente a luz vermelha para realizar fotossíntese.

---

## 📊 Interpretação dos Valores de NDVI

| NDVI       | Tipo de Cobertura             |
|------------|-------------------------------|
| -1.0 a 0.0 | Água, solo exposto, áreas urbanas |
| 0.1 a 0.2  | Vegetação muito esparsa        |
| 0.2 a 0.5  | Vegetação moderada             |
| 0.5 a 1.0  | Vegetação densa e saudável     |

---

## 🌎 Portal NDVI - Estado da Paraíba

Foi criado um portal interativo para visualização e análise de mapas de NDVI no estado da **Paraíba**, com dados processados via Google Earth Engine. A ferramenta permite acompanhar variações temporais e espaciais da vegetação.

🔗 **Acesse o portal aqui**:  
👉 [https://ee-edivanaesa.projects.earthengine.app/view/ndvi-pb-20](https://ee-edivanaesa.projects.earthengine.app/view/ndvi-pb-20)

---

## 🧰 Tecnologias Utilizadas

- [Google Earth Engine (GEE)](https://earthengine.google.com/)
- Dados de sensoriamento remoto (ex: MYD13Q1, MOD13Q1)
- JavaScript (GEE App Interface)
- Processamento e visualização de imagens NDVI

---

## 📌 Observações

- Os valores de NDVI podem variar conforme as condições atmosféricas, cobertura de nuvens e a resolução espacial dos sensores.
- O portal tem fins educacionais, exploratórios e de apoio à pesquisa.
- Recomendado uso em navegadores atualizados e com conexão estável para melhor visualização.

---