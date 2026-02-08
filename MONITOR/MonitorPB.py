from qgis.core import *
import processing
from PyQt5.QtGui import QColor
from PyQt5.QtCore import QVariant
import os

# =========================================================
# MONITOR DE SECAS - PIPELINE COMPLETO (PB)
# Autor: Edivan Silva
# =========================================================

project = QgsProject.instance()

# =========================================================
# CONFIGURAÇÕES
# =========================================================

layer_monitor_raw = 'dezembro25'        # Monitor de Secas original (AJUSTAR SE NESCESSARIO)
layer_municipios = 'MunicipiosPB_WGS' # Municípios da Paraíba

campo_classe = 'uf_codigo'
campo_mun = 'NM_MUN'

# Hierarquia da seca (mais severa -> menos severa)
classes = ['s4', 's3', 's2', 's1', 's0', 'si']

situacao_dict = {
    'si': 'Sem Seca Relativa',
    's0': 'Seca Fraca',
    's1': 'Seca Moderada',
    's2': 'Seca Grave',
    's3': 'Seca Extrema',
    's4': 'Seca Excepcional'
}

cores = {
    'si': '#ffffff',
    's0': '#ffff00',
    's1': '#ffd37f',
    's2': '#e67300',
    's3': '#e60000',
    's4': '#730000'
}

# =========================================================
# CARREGAR CAMADAS
# =========================================================

monitor_raw = project.mapLayersByName(layer_monitor_raw)[0]
mun = project.mapLayersByName(layer_municipios)[0]
crs = mun.crs()

# =========================================================
# ETAPA 1 - CORRIGIR SOBREPOSIÇÕES DO MONITOR


layers_classes = {}

for c in classes:
    expr = f"\"{campo_classe}\" = '{c}'"
    layers_classes[c] = processing.run(
        "native:extractbyexpression",
        {
            'INPUT': monitor_raw,
            'EXPRESSION': expr,
            'OUTPUT': 'memory:'
        }
    )['OUTPUT']

layers_corrigidas = {}

for i, c in enumerate(classes):
    atual = layers_classes[c]

    if i == 0:
        layers_corrigidas[c] = atual
    else:
        superiores = [layers_corrigidas[cls] for cls in classes[:i]]

        merged = processing.run(
            "native:mergevectorlayers",
            {
                'LAYERS': superiores,
                'CRS': crs,
                'OUTPUT': 'memory:'
            }
        )['OUTPUT']

        diff = processing.run(
            "native:difference",
            {
                'INPUT': atual,
                'OVERLAY': merged,
                'OUTPUT': 'memory:'
            }
        )['OUTPUT']

        layers_corrigidas[c] = diff

monitor_final = processing.run(
    "native:mergevectorlayers",
    {
        'LAYERS': list(layers_corrigidas.values()),
        'CRS': crs,
        'OUTPUT': 'memory:'
    }
)['OUTPUT']

monitor_final.setName('monitor_secas_final')
project.addMapLayer(monitor_final)

print('✅ Monitor de Secas corrigido')

# =========================================================
# ETAPA 2 - INTERSEÇÃO + ÁREA

inter = processing.run(
    "native:intersection",
    {
        'INPUT': mun,
        'OVERLAY': monitor_final,
        'OUTPUT': 'memory:'
    }
)['OUTPUT']

inter.setCrs(crs)

inter.startEditing()
inter.addAttribute(QgsField('area_m2', QVariant.Double))
inter.updateFields()

idx_area = inter.fields().indexFromName('area_m2')

for f in inter.getFeatures():
    inter.changeAttributeValue(
        f.id(),
        idx_area,
        f.geometry().area()
    )

inter.commitChanges()

# =========================================================
# ETAPA 3 - SOMAR ÁREA E DEFINIR CLASSE DOMINANTE

area_por_classe = {}

for f in inter.getFeatures():
    chave = (f[campo_mun], f[campo_classe])
    area_por_classe[chave] = area_por_classe.get(chave, 0) + f['area_m2']

dominante = {}

for (mun_nome, classe), area in area_por_classe.items():
    if mun_nome not in dominante or area > dominante[mun_nome][1]:
        dominante[mun_nome] = (classe, area)

# =========================================================
# ETAPA 4 - MAPA FINAL DOS MUNICÍPIOS

campos = QgsFields()
campos.append(QgsField('NM_MUN', QVariant.String))
campos.append(QgsField('COD_CLASS', QVariant.String))
campos.append(QgsField('NOME_CLASS', QVariant.String))

saida = QgsVectorLayer(
    f'Polygon?crs={crs.authid()}',
    'MunicipiosPB_Seca_Dominante',
    'memory'
)

prov = saida.dataProvider()
prov.addAttributes(campos)
saida.updateFields()

for f in mun.getFeatures():
    nome = f[campo_mun]
    if nome not in dominante:
        continue

    classe = dominante[nome][0]

    feat = QgsFeature()
    feat.setGeometry(f.geometry())
    feat.setAttributes([
        nome,
        classe,
        situacao_dict.get(classe)
    ])
    prov.addFeature(feat)

categories = []

for classe, cor in cores.items():
    symbol = QgsSymbol.defaultSymbol(saida.geometryType())
    symbol.setColor(QColor(cor))
    categories.append(
        QgsRendererCategory(classe, symbol, situacao_dict.get(classe))
    )

saida.setRenderer(QgsCategorizedSymbolRenderer('COD_CLASS', categories))
project.addMapLayer(saida)

# =========================================================
# ETAPA 5 - TABELA FINAL + EXPORTAÇÃO PARA EXCEL

tabela = QgsVectorLayer('None', 'Tabela_Seca_Dominante_PB', 'memory')
prov_tab = tabela.dataProvider()

prov_tab.addAttributes([
    QgsField('NM_MUN', QVariant.String),
    QgsField('NOME_CLASS', QVariant.String),
    QgsField('COD_CLASS', QVariant.String),
    QgsField('area_m2', QVariant.Double)
])

tabela.updateFields()

for mun_nome, (classe, area) in dominante.items():
    feat = QgsFeature()
    feat.setAttributes([
        mun_nome,
        situacao_dict.get(classe),
        classe,
        area
    ])
    prov_tab.addFeature(feat)

project.addMapLayer(tabela)

# =========================================================
# EXPORTAR EXCEL
# =========================================================

pasta_saida = project.homePath()

arquivo_excel = os.path.join(
    pasta_saida,
    'Tabela_Seca_Dominante_PB.xlsx'
)

QgsVectorFileWriter.writeAsVectorFormat(
    tabela,
    arquivo_excel,
    'UTF-8',
    QgsCoordinateReferenceSystem(),
    'XLSX'
)

# =========================================================
# FINAL
# =========================================================

print('PROCESSO FINALIZADO COM SUCESSO!')
print('Municípios processados:', tabela.featureCount())
print('Excel salvo em:')
print(arquivo_excel)