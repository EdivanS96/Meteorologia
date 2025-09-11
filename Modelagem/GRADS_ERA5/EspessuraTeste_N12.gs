*** Calcula o Vento Termico (a diferenca entre o vento geostrofico) entre os nives 1 e 3 e plota ****
***juntamente com a temperatura no nivel 2 **

'reinit'
'set display color white'
'c'

******* Definindo novas cores *******

*** TESTE 2
'set rgb 49 255 255 255'

'set rgb 50 204 255 255'
'set rgb 52 153 255 255'
'set rgb 54 102 178 255'

'set rgb 56 192 192 192'
'set rgb 58 224 224 224'

*--------------------------------------------------------------------------------------------------------
**** Configurando as latitudes, longitudes e nivel
**** ABRINDO OS DADOS 
'sdfopen C:/Users/Edivan/Desktop/TRABALHOS/GRADS/dados/Interim0111.nc'
'sdfopen C:/Users/Edivan/Desktop/TRABALHOS/GRADS/dados/Surface0111.nc'


*** Nivel 
'set z 1'

*** Configurando a longitude
'set lon -90 40'
*'set lon -110 0'

*** Configurando a latitude
'set lat -90 -15'

*------------------------------------------------------------------------------------------
**** Configurando as dimensoes da tela
*** Para a pagina virtual

'set ylopts 1 4.2 0.16'
'set xlopts 1 4.2 0.16'
'set grid off'
*'set xlopts 1 5 0.19'
*'set ylopts 1 5 0.19'
'set grads off'
'set mpdset mres'
'set csmooth on'
'set mproj scaled'
'set font 0'
'set mproj latlon'
'set map 1 1 6'

*--------------------------------------------------------------------------------------------------------
*** Escolha dos niveis de pressao ***
* nb=4; nt=5

'clear' 
ti=50; tf=52

s=ti
while (s <= tf)
  'c'
  n=s+1-ti
  'set t 's
  'q time'
  dia=subwrd(result,3)
  say dia

*--------------------------------------------------------------------------------------------------------
**** DISPLAY NA MAGNITUDE DO VENTO E DA ALTURA GEOPOTENCIAL

'set gxout shaded'

'set grads off'
'set xlab off'
'set ylab on'
'q time'
dia=subwrd(result,3)


*** Plotando o Geopotencial ***
'set z 1'
'z1=z(z=1)'
'set z 2'
'z2=z'

'set z 1'
'H=287*t/9.81'
'ESP=H*log(lev(z=1)/lev(z=2))'
'ZT=(z2(z=2)-z1(z=1))/9.81'

'set gxout shaded'
'd ESP'
cbarn
'set gxout contour'
'set ccolor 1'
'set cstyle 1'
'd ZT'

exit
**** Diferenca de geopotencial entre os dois niveis ***
'set gxout contour'
'd (z(z=2)-z(z-1))/9.81'

'draw title Espessura da Camada Vento 'dia

'q pos'

*Loop
mbtn=subwrd(result,5)

if mbtn = 1
s = s + 1
else 
if mbtn = 3
s = s - 1
endif 
endif

endwhile

