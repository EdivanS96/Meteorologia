'reinit'
'set display color white'

rc = gsfallow("on")

*************************************************************
* Definir caso e tipo de grafico
*************************************************************
* CASO: instantes inicial e final
* Abre o arquivo contendo os casos
* EDITAR COLOCANDO O CAMINHO PARA O ARQUIVO DE DADOS NO COMPUTADOR QUE ESTIVER USANDO
'sdfopen C:/Users/Edivan/Desktop/TRABALHOS/GRADS/dados/Interim0111.nc'
'set mpdset brmap_hires'
'set lon 260 380'
'set lat -70 30'


* limpa a tela
'clear' 
ti=1; tf=124

'set z 1'
s=ti
while (s <= tf)
  'c'
  n=s+1-ti
  'set t 's''
  'q time'
  dia=subwrd(result,3)
  say dia
  'set gxout contour'

  'set gxout shaded'
  'set clevs 0.002 0.004 0.006 0.008 0.01 0.012 0.014 0.016 0.018 0.02 0.022'
  'display q'
   cbarn

   'set gxout vector'
   'set arrscl 0.4 10'
   'd u;skip(v,4)'

   'draw title Umidade: 'dia


* EDITAR A LINHA ABAIXO COLOCANDO O CAMINHO PARA O SCRIPT CBARM NO COMPUTADOR QUE ESTIVER USANDO
*/Users/jmarraut/grads-2.1.a1/scripts/cbarm.gs

*  'printim Q_V_'niv'_'dia'.png'
   'q pos'
   
mbtn=subwrd(result,5)

if mbtn = 1
s = s + 4
else 
if mbtn = 3
s = s - 4
endif 

endwhile
