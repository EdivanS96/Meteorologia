# MARGE CPTEC - Elaboração de Mapa para o NEB e PB

!pip install pygrib cartopy ipywidgets

import os
import requests
import numpy as np
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import cartopy.feature as cfeature
import matplotlib.colors as mcolors
import pygrib
import ipywidgets as widgets
from IPython.display import display, clear_output, Image
from datetime import datetime, timedelta

# Diretórios
download_dir = "MERGE_GRIBS"
saida_dir = "MAPAS_SAIDA"
os.makedirs(download_dir, exist_ok=True)
os.makedirs(saida_dir, exist_ok=True)

# Função para obter lista de datas no formato YYYYMMDD
def get_date_list(start, end):
    delta = end - start
    return [(start + timedelta(days=i)).strftime("%Y%m%d") for i in range(delta.days + 1)]

# Download dos arquivos GRIB
def download_grib_files(dates):
    base_url_root = "https://ftp.cptec.inpe.br/modelos/tempo/MERGE/GPM/DAILY/"
    for date in dates:
        year = date[:4]
        month = date[4:6]
        base_url = f"{base_url_root}{year}/{month}/"
        file_name = f"MERGE_CPTEC_{date}.grib2"
        file_url = base_url + file_name
        file_path = os.path.join(download_dir, file_name)

        if not os.path.exists(file_path):
            response = requests.get(file_url)
            if response.status_code == 200:
                with open(file_path, "wb") as f:
                    f.write(response.content)
                print(f"Baixado: {file_name}")
            else:
                print(f"Erro ao baixar {file_name} - URL: {file_url}")
        else:
            print(f"Arquivo já existe: {file_name}")

# Função para salvar e exibir mapa
def salvar_e_exibir_mapa(nome_arquivo, lons, lats, data, extent, levels, cmap, norm, regiao, titulo_periodo):
    fig = plt.figure(figsize=(6.5, 5))  # Compacto para Colab
    ax = plt.axes(projection=ccrs.PlateCarree())

    ax.set_extent(extent, crs=ccrs.PlateCarree())
    ax.add_feature(cfeature.BORDERS, linestyle=':')
    ax.add_feature(cfeature.COASTLINE, linewidth=0.8)
    ax.add_feature(cfeature.NaturalEarthFeature(
        category='cultural',
        name='admin_1_states_provinces',
        scale='50m',
        facecolor='none',
        edgecolor='black',
        linewidth=0.6
    ))

    # Gridlines
    gl = ax.gridlines(draw_labels=True, linewidth=0.5, color='gray', alpha=0.5, linestyle='--')
    gl.top_labels = False
    gl.right_labels = False
    gl.left_labels = True
    gl.bottom_labels = True
    gl.xlabel_style = {'size': 5} #tamanho da long
    gl.ylabel_style = {'size': 5} #tamanho da lat

    # Precipitação
    cs = ax.contourf(lons, lats, data, levels=levels, cmap=cmap, norm=norm, transform=ccrs.PlateCarree())

    # Ajuste dinâmico da fonte do título direito baseado no comprimento do título esquerdo
    tamanho_esquerdo = len("MERGE - Precipitação Acumulada") + len(titulo_periodo)
    fonte_direita = 9
    if tamanho_esquerdo > 10:
        fonte_direita = 7.5  # diminui fonte se texto da esquerda for muito longo

    # Posicionamento dos títulos
    y_titulo = 1.05  # pra não colar com a grade

    ax.text(0.01, y_titulo, "MERGE - Precipitação Acumulada", transform=ax.transAxes,
            ha='left', fontsize=8.5, fontweight='bold')

    ax.text(0.01, y_titulo - 0.03, titulo_periodo, transform=ax.transAxes,
            ha='left', fontsize=7.5)

    ax.text(0.99, y_titulo, regiao, transform=ax.transAxes,
            ha='right', fontsize=fonte_direita, fontweight='bold', color='navy')

    # Fonte
    ax.text(0.99, 0.01, "Fonte: CPTEC\nElaboração: Edivan Silva", transform=ax.transAxes,
            ha='right', va='bottom', fontsize=6, alpha=0.6)

    # Legenda horizontal ajustada pra não bugar e sobrepor
    pos = ax.get_position()
    cbar_ax = fig.add_axes([pos.x0, pos.y0 - 0.06, pos.width, 0.02])  # afastada do mapa
    cbar = fig.colorbar(cs, cax=cbar_ax, orientation='horizontal', ticks=levels)
    cbar.set_label("Precipitação (mm)", fontsize=8)
    cbar.ax.tick_params(labelsize=7)

    # Salvar e exibir
    caminho = os.path.join(saida_dir, nome_arquivo)
    plt.savefig(caminho, dpi=150, bbox_inches='tight')
    plt.close()

    display(Image(filename=caminho))



# Função principal para geração dos mapas :) 
def gerar_3_mapas_precipitacao(dates):
    clear_output(wait=True)
    download_grib_files(dates)

    grib_files = [os.path.join(download_dir, f"MERGE_CPTEC_{date}.grib2") for date in dates]

    total_precip = None
    lats, lons = None, None

    for file in grib_files:
        grbs = pygrib.open(file)
        grb = grbs.select(name='Precipitation')[0]
        data = grb.values

        if total_precip is None:
            total_precip = np.zeros_like(data)

        total_precip += data
        lats, lons = grb.latlons()
        grbs.close()

    # Escalas de cores
    periodo_dias = len(dates)
    if periodo_dias > 31:
        levels = [0, 5, 20, 50, 100, 150, 200, 300, 400, 500]
        colors = ["#FFFFFF", "#d0e8e8", "#7cafd1", "#206ecb", "#56d66e",
                  "#15b403", "#179817", "#d7c362", "#d6a12f", "#d65200"]
    else:
        levels = [0, 1, 10, 25, 50, 75, 100, 150, 200, 300]
        colors = ["#FFFFFF", "#bfd6d6", "#7cafd1", "#206ecb", "#56d66e",
                  "#15b403", "#179817", "#d7c362", "#d6a12f", "#d65200"]

    cmap = mcolors.ListedColormap(colors)
    norm = mcolors.BoundaryNorm(levels, cmap.N)

    data_ini = datetime.strptime(dates[0], "%Y%m%d").strftime("%d/%m/%Y")
    data_fim = datetime.strptime(dates[-1], "%Y%m%d").strftime("%d/%m/%Y")
    titulo_periodo = f"Período: {data_ini} a {data_fim}"

    # Gerar e exibir os 3 mapas
    salvar_e_exibir_mapa("mapa_america_do_sul.png", lons, lats, total_precip,
                         [-90, -30, -60, 15], levels, cmap, norm,
                         "América do Sul", titulo_periodo)

    salvar_e_exibir_mapa("mapa_nordeste.png", lons, lats, total_precip,
                         [-48.8, -34, -18.5, 0], levels, cmap, norm,
                         "Nordeste", titulo_periodo)

    salvar_e_exibir_mapa("mapa_paraiba.png", lons, lats, total_precip,
                         [-38.7423, -34.8096, -8.3005, -6.0336], levels, cmap, norm,
                         "Paraíba", titulo_periodo)

    print("Mapas salvos em 'MAPAS_SAIDA/' e exibidos abaixo.")

# === BLOCO INTERATIVO COM WIDGETS ===
data_ontem = datetime.today() - timedelta(days=1)

start_date = widgets.DatePicker(description='Data Início', value=data_ontem)
end_date = widgets.DatePicker(description='Data Fim', value=data_ontem)
btn_gerar = widgets.Button(description="Gerar Mapas")
output = widgets.Output()

def on_gerar_click(b):
    with output:
        clear_output()
        
        start = start_date.value
        end = end_date.value

        # Converte para datetime.date se necessário
        start = start.date() if isinstance(start, datetime) else start
        end = end.date() if isinstance(end, datetime) else end

        if not start or not end:
            print("Por favor, selecione as duas datas.")
            return
        if start > end:
            print("Data início deve ser anterior ou igual à data fim.")
            return

        dates = get_date_list(start, end)
        gerar_3_mapas_precipitacao(dates)


btn_gerar.on_click(on_gerar_click)

display(widgets.HBox([start_date, end_date, btn_gerar]), output)

