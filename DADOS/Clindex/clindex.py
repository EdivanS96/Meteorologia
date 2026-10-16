# ==============================================================================
# SCRIPT DE CÁLCULO DE ÍNDICES DE EXTREMOS (RCLIMDEX) - LOCALIDADE ÚNICA
# ==============================================================================
import pandas as pd
import numpy as np
from google.colab import files

# 1) FAZER UPLOAD OU INDICAR O CAMINHO DO SEU ARQUIVO CSV
# (Se preferir enviar direto pelo Colab, descomente a linha abaixo)
# uploaded = files.upload()

caminho_csv = "/content/seu_arquivo.csv"  # Substitua pelo nome exato do seu arquivo

print("⏳ Lendo a base de dados diária...")
df_diario = pd.read_csv(caminho_csv)

# ⚠️ AJUSTE AQUI: Garanta que os nomes entre parênteses correspondam 
# exatamente aos nomes das colunas na sua planilha (ex: 'data' e 'chuva')
df_diario['data'] = pd.to_datetime(df_diario['data'])
df_diario['chuva'] = pd.to_numeric(df_diario['chuva'], errors='coerce')

# ==============================================================================
# 2) FUNÇÃO DE CÁLCULO DOS ÍNDICES RCLIMDEX (POR ANO)
# ==============================================================================
def calcular_indices_rclimdex_anual(df_serie):
    df = df_serie.copy()
    df['ano'] = df['data'].dt.year

    # Filtrar anos com pelo menos 300 dias válidos para evitar distorções
    anos_validos = df.groupby('ano').size()
    anos_validos = anos_validos[anos_validos >= 300].index
    df = df[df['ano'].isin(anos_validos)]

    if df.empty:
        print("⚠️ Aviso: Nenhum ano atingiu o critério mínimo de 300 dias válidos.")
        return pd.DataFrame()

    # Percentis calculados sobre os dias úmidos (>= 1.0 mm) de todo o período válido
    dias_umidos_total = df[df['chuva'] >= 1.0]['chuva']
    p95 = dias_umidos_total.quantile(0.95) if len(dias_umidos_total) > 0 else 0
    p99 = dias_umidos_total.quantile(0.99) if len(dias_umidos_total) > 0 else 0

    indices_anuais = []

    for ano, df_ano in df.groupby('ano'):
        precip = df_ano['chuva'].values

        rx1 = np.max(precip) if len(precip) > 0 else 0
        rx5 = pd.Series(precip).rolling(window=5).sum().max() if len(precip) >= 5 else 0
        dias_umidos = precip[precip >= 1.0]
        sdii = np.mean(dias_umidos) if len(dias_umidos) > 0 else 0
        r10 = np.sum(precip >= 10.0)
        r20 = np.sum(precip >= 20.0)
        r25 = np.sum(precip >= 25.0)

        cdd, cwd = 0, 0
        c_seco, c_umido = 0, 0
        for p in precip:
            if p < 1.0:
                c_seco += 1
                c_umido = 0
            else:
                c_umido += 1
                c_seco = 0
            if c_seco > cdd: cdd = c_seco
            if c_umido > cwd: cwd = c_umido

        r95p = np.sum(precip[precip > p95]) if len(precip[precip > p95]) > 0 else 0
        r99p = np.sum(precip[precip > p99]) if len(precip[precip > p99]) > 0 else 0
        prcptot = np.sum(dias_umidos) if len(dias_umidos) > 0 else 0

        indices_anuais.append({
            'Ano': int(ano),
            'Rx1day': rx1, 'Rx5day': rx5, 'SDII': sdii,
            'R10mm': r10, 'R20mm': r20, 'R25mm': r25,
            'CDD': cdd, 'CWD': cwd, 'R95p': r95p, 'R99p': r99p,
            'PRCPTOT': prcptot
        })

    df_indices = pd.DataFrame(indices_anuais)
    return df_indices

# ==============================================================================
# 3) EXECUTAR E GERAR A PLANILHA EXCEL FINAL
# ==============================================================================
print("⚡ Calculando os índices climáticos extremos...")
df_resultados = calcular_indices_rclimdex_anual(df_diario)

if not df_resultados.empty:
    caminho_excel_indices = "INDICES_EXTREMOS_LOCALIDADE.xlsx"
    df_resultados.to_excel(caminho_excel_indices, index=False)

    print(f"🎉 Pronto! Planilha gerada com sucesso: '{caminho_excel_indices}'")
    files.download(caminho_excel_indices)
    
    # Exibe uma prévia da tabela na tela do Colab
    display(df_resultados)