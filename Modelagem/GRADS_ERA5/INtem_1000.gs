'reinit'
'set display color white'

rc = gsfallow("on")
* limpa a tela


* EDITAR COLOCANDO O CAMINHO PARA O ARQUIVO DE DADOS NO COMPUTADOR QUE ESTIVER USANDO
*'sdfopen C:/Users/Edivan/Desktop/TRABALHOS/GRADS/dados/Interim0710.nc'
'sdfopen C:/Users/Edivan/Desktop/TRABALHOS/GRADS/dados/Interim0710.nc'

*DEFININDO CORES
'set rgb 16 0 0 0'
'set rgb 17 255 60 0'
'set rgb 18 255 140 0'
'set rgb 19 255 255 0'
'set rgb 20 100 255 100'
'set rgb 21 80 200 180'
'set rgb 22 100 100 255'
'set rgb 23 0 0 200'
'set rgb 24 120 0 180'
'set rgb 30 240   0 130'  


'set mpdset brmap_hires'
'set lon 260 380'
'set lat -70 30'

*limpar tela
'clear' 

ti=1; tf=124

*LOOP
s=ti
while (s <= tf)
  'c'
  n=s+1-ti
  'set t 's''
  'q time'
  dia=subwrd(result,3)
  say dia


'set gxout shaded'


*teste do cmd clevs: Definindo valores
'set clevs    -5    0    5    8  11   15   18   21   24   27   30   32'
'set ccols  0    15   24   23  22   21   20   19   18   2   17    30    8'
'd t-273.15'

'cbarn'

'draw title Temperatura: 'dia

*VENTO
'set gxout vector'
'set ccolor 1'
'set arrscl 0.4 10'
'd skip(u,5);v'
* 'd u'
*  'd v'
  'q pos'

mbtn=subwrd(result,5)

if mbtn = 1
s = s + 4
else 
if mbtn = 3
s = s - 4
endif 
endif

endwhile
