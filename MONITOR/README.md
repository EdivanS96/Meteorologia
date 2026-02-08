# 🏜️Monitor de Secas da Paraíba – Seca Dominante por Município

Este repositório contém o script **MonitorPB.py**, desenvolvido para processar dados do **Monitor de Secas da ANA** e identificar o **tipo de seca predominante em cada município do estado da Paraíba**.

O script foi elaborado para ser executado **no terminal Python do QGIS**, utilizando exclusivamente ferramentas nativas de geoprocessamento.


## 🧠 Objetivo do Script

Automatizar o fluxo de análise espacial do Monitor de Secas, realizando:

- Correção das sobreposições entre classes de seca  
- Interseção do Monitor de Secas com os municípios da Paraíba  
- Cálculo da área ocupada por cada classe de seca em cada município  
- Identificação da **classe de seca dominante** (maior área) por município  
- Geração de:
  - Camada temática dos municípios
  - Tabela resumo
  - Arquivo Excel com os resultados finais

---

## 🗺️ Dados de Entrada

O script assume que as seguintes camadas **já estão carregadas no projeto QGIS**:

### 1. Monitor de Secas da ANA
- Nome da camada: `dezembro25`
- Campo da classe de seca: `uf_codigo`
- Classes utilizadas:
  - `si` – Sem Seca Relativa
  - `s0` – Seca Fraca
  - `s1` – Seca Moderada
  - `s2` – Seca Grave
  - `s3` – Seca Extrema
  - `s4` – Seca Excepcional

🔗 **Download dos dados SIG do Monitor de Secas (ANA):**  
https://monitordesecas.ana.gov.br/dados-sig

### 2. Municípios da Paraíba
- Nome da camada: `MunicipiosPB_WGS`
- Campo do nome do município: `NM_MUN`

⚠️ Caso os nomes das camadas ou campos sejam diferentes, eles devem ser ajustados no bloco de **configurações iniciais** do script.

---

## ⚙️ Etapas do Processamento

1. **Correção das sobreposições do Monitor de Secas**  
   Remove áreas sobrepostas respeitando a hierarquia de severidade da seca
   (da mais severa para a menos severa).

2. **Interseção espacial**  
   Intersecta o Monitor de Secas corrigido com os limites municipais.

3. **Cálculo de área**  
   Calcula a área (m²) de cada classe de seca dentro de cada município.

4. **Definição da seca dominante**  
   Para cada município, identifica a classe de seca com maior área ocupada.

5. **Geração dos produtos finais**  
   - Camada vetorial dos municípios com a seca dominante
   - Simbologia categorizada automática
   - Tabela resumo
   - Exportação para Excel

---

## 📊 Produtos Gerados

Após a execução do script, são criados automaticamente no QGIS:

- 🗺️ **Camada vetorial:**  
  `MunicipiosPB_Seca_Dominante`

- 📋 **Tabela:**  
  `Tabela_Seca_Dominante_PB`

- 💾 **Arquivo Excel:**  
  `Tabela_Seca_Dominante_PB.xlsx`  
  (salvo na pasta do projeto QGIS)

---

## ▶️ Como Executar

1. Abra o **QGIS**
2. Carregue as camadas:
   - Monitor de Secas da ANA
   - Municípios da Paraíba
3. Abra o **Terminal Python do QGIS**
4. Execute o script:

```python
exec(open('caminho/para/MonitorPB.py').read())
```
Ou cole todo o conteúdo do arquivo MonitorPB.py diretamente no terminal Python.

## 🧩 Requisitos

QGIS 3.x

Processing Framework habilitado

Camadas vetoriais em CRS compatível

Permissão de escrita na pasta do projeto (para exportação do Excel)

# 👨‍💻 Autor

Edivan Silva

Script desenvolvido para análise espacial do Monitor de Secas da ANA, com foco no estado da Paraíba.