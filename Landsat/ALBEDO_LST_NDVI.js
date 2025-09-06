// 1. Área de estudo
var ACU = ee.FeatureCollection('projects/ee-edivanaesa/assets/PA_UPHs');

var vazia = ee.Image().byte();
var contorno = vazia.paint({
  featureCollection: ACU,
  color: 1,
  width: 2
});

// Lista para armazenar as imagens geradas
var imagensExportar = [];

// 2. Função para processar um período
function processarPeriodo(periodoName, start, end, collectionId, bandsConfig) {
  var col = ee.ImageCollection(collectionId)
    .filterDate(start, end)
    .filterBounds(ACU)
    .filter(ee.Filter.lt('CLOUD_COVER', 5));

  var colecaoComIndices = col.map(function(image) {
    // NDVI
    var ndvi = image.normalizedDifference([bandsConfig.NIR, bandsConfig.RED]).rename('NDVI');

    // Albedo — construir dicionário de bandas usadas
    var albedoBandValues = {};
    bandsConfig.albedoBandNames.forEach(function(bandName) {
      albedoBandValues[bandName] = image.select(bandName);
    });

    var albedo = image.expression(
      bandsConfig.albedoExpr,
      albedoBandValues
    ).rename('Albedo');

var ndvi = image.normalizedDifference([bandsConfig.NIR, bandsConfig.RED]).rename('NDVI');

// Emissividade (NDVI → FVC → ε)
var minNDVI = ee.Number(ndvi.reduceRegion({
  reducer: ee.Reducer.min(),
  geometry: ACU,
  scale: 30,
  maxPixels: 1e9
}).values().get(0));

var maxNDVI = ee.Number(ndvi.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: ACU,
  scale: 30,
  maxPixels: 1e9
}).values().get(0));

var pv = ndvi.subtract(ee.Image.constant(minNDVI))
             .divide(ee.Image.constant(maxNDVI).subtract(ee.Image.constant(minNDVI)))
             .pow(2)
             .rename('PV');

var emissivity = pv.multiply(0.004).add(0.986).rename('Emissivity');



    // Temperatura de brilho (TOA)
    var BT = image.select(bandsConfig.therm).multiply(bandsConfig.scale_thermal)
                .add(bandsConfig.offset_thermal).rename('BT');

    // LST
    var lst = BT.expression(
      '(BT / (1 + (lambda * BT / rho) * log(emissivity))) - 273.15',
      {
        'BT': BT,
        'lambda': bandsConfig.lambda,
        'rho': bandsConfig.rho,
        'emissivity': emissivity
      }
    ).rename('LST');

    return image.addBands([ndvi, albedo, lst]);
  });

  // Mediana por período
var mediana = colecaoComIndices.median().clip(ACU);

// Forçar as bandas para Float32
var resultado = mediana.select(['NDVI', 'Albedo', 'LST']).toFloat();

// Visualização
Map.addLayer(mediana.select('NDVI'), {min: 0, max: 1, palette: ['d73027', 'f46d43', 'fdae61', 'ffffbf', 'a6d96a', '66bd63', '1a9850']}, periodoName + ' NDVI');
Map.addLayer(mediana.select('Albedo'), {min: 0, max: 1, palette: ['blue','white','orange']}, periodoName + ' Albedo');
Map.addLayer(mediana.select('LST'), {min: 10, max: 40, palette: ['blue','yellow','red']}, periodoName + ' LST');



// === LOG no console ===
print('Período:', periodoName);
print('Número de imagens selecionadas (nuvem < 5%):', col.size());
print('ID da imagem mediana aproximada:', colecaoComIndices.median().get('system:index'));



// Salvar a imagem com nome para exportar depois
imagensExportar.push({
  nome: periodoName,
  imagem: resultado  // <- Aqui usamos a versão .toFloat()
});

}


// 3. Configurações por sensor/período
var sensores = [
  {
    name: '2001–2005 LS5',
    start: '2001-01-01',
    end: '2005-12-31',
    id: 'LANDSAT/LT05/C02/T1_L2',
    bandsConfig: {
      NIR: 'SR_B4',
      RED: 'SR_B3',
      albedoExpr: '0.356*SR_B1 + 0.130*SR_B3 + 0.373*SR_B4 + 0.085*SR_B5 + 0.072*SR_B7',
      albedoBandNames: ['SR_B1', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'],
      therm: 'ST_B6',
      scale_thermal: 0.00341802,
      offset_thermal: 149.0,
      lambda: 10.895e-6,
      rho: 1.438e-2
    }
  },
  {
    name: '2006–2010 LS5',
    start: '2006-01-01',
    end: '2010-12-31',
    id: 'LANDSAT/LT05/C02/T1_L2',
    bandsConfig: {
      NIR: 'SR_B4',
      RED: 'SR_B3',
      albedoExpr: '0.356*SR_B1 + 0.130*SR_B3 + 0.373*SR_B4 + 0.085*SR_B5 + 0.072*SR_B7',
      albedoBandNames: ['SR_B1', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'],
      therm: 'ST_B6',
      scale_thermal: 0.00341802,
      offset_thermal: 149.0,
      lambda: 10.895e-6,
      rho: 1.438e-2
    }
  },
  {
    name: '2011–2015 LS7',
    start: '2011-01-01',
    end: '2015-12-31',
    id: 'LANDSAT/LE07/C02/T1_L2',
    bandsConfig: {
      NIR: 'SR_B4',
      RED: 'SR_B3',
      albedoExpr: '0.356*SR_B1 + 0.130*SR_B3 + 0.373*SR_B4 + 0.085*SR_B5 + 0.072*SR_B7',
      albedoBandNames: ['SR_B1', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'],
      therm: 'ST_B6',
      scale_thermal: 0.00341802,
      offset_thermal: 149.0,
      lambda: 10.895e-6,
      rho: 1.438e-2
    }
  },
  {
    name: '2016–2020 LS8',
    start: '2016-01-01',
    end: '2020-12-31',
    id: 'LANDSAT/LC08/C02/T1_L2',
    bandsConfig: {
      NIR: 'SR_B5',
      RED: 'SR_B4',
      albedoExpr: '0.356*SR_B2 + 0.130*SR_B4 + 0.373*SR_B5 + 0.085*SR_B6 + 0.072*SR_B7',
      albedoBandNames: ['SR_B2', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'],
      therm: 'ST_B10',
      scale_thermal: 0.00341802,
      offset_thermal: 149.0,
      lambda: 10.895e-6,
      rho: 1.438e-2
    }
  }
];

// 4. Executar para cada período
sensores.forEach(function(s) {
  processarPeriodo(s.name, s.start, s.end, s.id, s.bandsConfig);
});

//print(sensores);

// 5. Exportar todas as imagens processadas para o Google Drive (uma banda por imagem, valores reais)
imagensExportar.forEach(function(obj) {
  var baseName = obj.nome.replace(/[^a-zA-Z0-9]/g, '_');

  // NDVI
  Export.image.toDrive({
    image: obj.imagem.select('NDVI').toFloat(),
    description: baseName + '_NDVI',
    folder: 'Fabiano',
    fileNamePrefix: baseName + '_NDVI',
    region: ACU.geometry().simplify(100),
    scale: 30,  // ou 1000 se quiser mais leve
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF'
  });

  // Albedo
  Export.image.toDrive({
    image: obj.imagem.select('Albedo').toFloat(),
    description: baseName + '_Albedo',
    folder: 'Fabiano',
    fileNamePrefix: baseName + '_Albedo',
    region: ACU.geometry().simplify(100),
    scale: 30,
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF'
  });

  // LST
  Export.image.toDrive({
    image: obj.imagem.select('LST').toFloat(),
    description: baseName + '_LST',
    folder: 'Fabiano',
    fileNamePrefix: baseName + '_LST',
    region: ACU.geometry().simplify(100),
    scale: 30,
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF'
  });
});


Map.addLayer(contorno, {palette: 'black'}, 'Contorno ACU');
Map.centerObject(ACU, 8);

