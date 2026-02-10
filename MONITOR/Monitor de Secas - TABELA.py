# Instala as bibliotecas necessárias
!pip install geopandas shapely fiona openpyxl requests zipfile36 --quiet

# =========================================================
# MONITOR DE SECAS DA PARAÍBA – PIPELINE AUTOMATIZADO (Colab)
# Autor: Edivan Silva
# Rep.: https://github.com/EdivanS96/Meteorologia/tree/main/MONITOR
# =========================================================

import geopandas as gpd
from shapely.ops import unary_union
import pandas as pd
import requests, zipfile, os
from io import BytesIO

# --------------------------------------------------------
# 1 CONFIGURAÇÕES
# --------------------------------------------------------
mes = "dezembro" #DEFINIR MÊS
ano = 2025      #DEFINIR ANO

ano_mes_zip = f"{mes}{ano}"
url_monitor = f"https://ana-monitor-secas-files.s3.sa-east-1.amazonaws.com/uploads/mapas/{ano_mes_zip}.zip"

github_municipios = "https://github.com/EdivanS96/Meteorologia/raw/main/MONITOR/DATA/MunicipiosPB_WGS.shp"

campo_mun = 'NM_MUN'
campo_classe = 'uf_codigo'  # Obs: Campo correto do shapefile

classes = ['s4', 's3', 's2', 's1', 's0', 'si']
situacao_dict = {
    'si': 'Sem Seca Relativa',
    's0': 'Seca Fraca',
    's1': 'Seca Moderada',
    's2': 'Seca Grave',
    's3': 'Seca Extrema',
    's4': 'Seca Excepcional'
}

# CRS projetado para cálculo de área correta (metros)
CRS_METRICO = "EPSG:5880"  # SIRGAS 2000 / Brasil Polyconic (aprox. métrico) Obs: Cuidado para o SRC não ser errado

# --------------------------------------------------------
# 2 BAIXAR E DESCOMPACTAR MONITOR DE SECAS
# --------------------------------------------------------
print(" Baixando arquivo do Monitor de Secas...")
response = requests.get(url_monitor)
with zipfile.ZipFile(BytesIO(response.content)) as z:
    z.extractall("monitor_temp")
print("Download concluído.")

# --------------------------------------------------------
# 3 CARREGAR SHAPE PRINCIPAL
# --------------------------------------------------------
monitor_shp_nome = f"{mes}{str(ano)[-2:]}.shp"
monitor_shp_path = os.path.join("monitor_temp", monitor_shp_nome)

if not os.path.exists(monitor_shp_path):
    shp_candidates = [f for f in os.listdir("monitor_temp") if f.endswith(".shp")]
    shp_candidates.sort(key=lambda f: os.path.getsize(os.path.join("monitor_temp", f)), reverse=True)
    monitor_shp_path = os.path.join("monitor_temp", shp_candidates[0])
    print(f"Nome padrão não encontrado, usando maior shapefile: {shp_candidates[0]}")

monitor = gpd.read_file(monitor_shp_path)
print(f"Shapefile correto carregado: {os.path.basename(monitor_shp_path)}")
print("Campos disponíveis:", monitor.columns)

# --------------------------------------------------------
# 4 LER MUNICÍPIOS
# --------------------------------------------------------
municipios = gpd.read_file(github_municipios)
print("Shapefile dos municípios carregado.")

# --------------------------------------------------------
# 5 PROJETAR PARA CRS MÉTRICO
# --------------------------------------------------------
monitor = monitor.to_crs(CRS_METRICO)
municipios = municipios.to_crs(CRS_METRICO)

# --------------------------------------------------------
# 6 CORRIGIR SOBREPOSIÇÕES
# --------------------------------------------------------
print(" Corrigindo sobreposições...")
layers_corrigidas = {}
for i, c in enumerate(classes):
    atual = monitor[monitor[campo_classe]==c].copy()
    if i == 0:
        layers_corrigidas[c] = atual
    else:
        superiores = pd.concat([layers_corrigidas[cls] for cls in classes[:i]])
        union_sup = unary_union(superiores.geometry)
        atual['geometry'] = atual.geometry.apply(lambda g: g.difference(union_sup))
        atual = atual[~atual.is_empty]
        layers_corrigidas[c] = atual
monitor_final = pd.concat(list(layers_corrigidas.values()))
monitor_final = gpd.GeoDataFrame(monitor_final, crs=CRS_METRICO)
print("Sobreposições corrigidas.")

# --------------------------------------------------------
# 7 INTERSEÇÃO COM MUNICÍPIOS
# --------------------------------------------------------
print("Realizando interseção espacial...")
inter = gpd.overlay(municipios, monitor_final, how='intersection')

# --------------------------------------------------------
# 8 CALCULAR ÁREA
# --------------------------------------------------------


inter['area_m2'] = inter.geometry.area

# --------------------------------------------------------
# 9 DEFINIR CLASSE DOMINANTE
# --------------------------------------------------------
area_por_classe = inter.groupby([campo_mun, campo_classe])['area_m2'].sum().reset_index()
dominante = area_por_classe.loc[area_por_classe.groupby(campo_mun)['area_m2'].idxmax()]
resultado = municipios.merge(dominante[[campo_mun, campo_classe, 'area_m2']], on=campo_mun, how='left')
resultado['NOME_CLASS'] = resultado[campo_classe].map(situacao_dict)

# --------------------------------------------------------
# 10 PREPARAR EXCEL FINAL
# --------------------------------------------------------
df_excel = resultado[[campo_mun, 'NOME_CLASS', campo_classe, 'area_m2']].copy()
df_excel.rename(columns={
    campo_mun: 'Municipio',
    'NOME_CLASS': 'Tipo de Seca',
    campo_classe: 'Classe',
    'area_m2': 'Area'
}, inplace=True)

# Ordenar alfabeticamente
df_excel.sort_values('Municipio', inplace=True)

# Salvar Excel
excel_saida = f"Tabela_Seca_Dominante_PB_{mes}{ano}.xlsx"
df_excel.to_excel(excel_saida, index=False)

# --------------------------------------------------------
# 11 TABELINHA RESUMO (Número de municípios por tipo de seca)
# --------------------------------------------------------
resumo = df_excel.groupby('Tipo de Seca')['Municipio'].count().reset_index()
resumo.rename(columns={'Municipio': 'Nº de Municípios'}, inplace=True)

print("Processo finalizado!")
print(f"Excel gerado: {excel_saida}")
print("\nResumo por tipo de seca:")
display(resumo)
