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



*** Baixos Niveis
'set Lev 850'

*** Configurando a longitude
'set lon -90 -20'

*** Configurando a latitude
'set lat -65 -5'



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

'clear' 
ti=40; tf=80

s=ti
while (s <= tf)
  'c'
  n=s+1-ti
  'set t 's
  'q time'
  dia=subwrd(result,3)
  say dia

'f0=2*7.27*0.00001*sin(lat*3.14159/180)'

*** Definindo as distancias
'define dx=6.37e6*cdiff(lon,x)*(3.1416/180.)*cos(lat*3.1416/180.)'
'define dy=6.37e6*cdiff(lat,y)*(3.1416/180.)'

*** Calculando os diferenciais ***
'dZx=cdiff(z,x)'
'dZy=cdiff(z,y)'


*--------------------------------------------------------------------------------------------------------
**** DISPLAY NA MAGNITUDE DO VENTO E DA ALTURA GEOPOTENCIAL

'set gxout shaded'

*** ============================================ FIG 1 ====================================================
**** Plotando o gepotencial 
'set grads off'
'set xlab off'
'set ylab on'
'set lev 850'
'q time'
dia=subwrd(result,3)

** Calculando o parametro de Coriolis **



*** Plotando o Geopotencial ***
'set gxout shaded'

*** Talvez o maskout nao esteja funcionando pq o segundo z deve ser o campo de superficie ***
*** que corresponde a topografia. ***


*'set clevs 900 950 1000 1050 1100 1150 1200 1250 1300 1350 1400 1450 1500 1550 1600 1650'

'set gxout shaded'
*'d z/9.81'
'd t'

say z='z'
cbarn


'draw title Vento Geostrofico: 'dia

*'d maskout(z, z(lev=850)-z(z=1,t=1))'


** Calculando o vento geostrofico  **
'ug=-(dZy/dy)*1/f0'
'vg=(dZx/dx)*1/f0'

* display vento geostrofico
'set arrscl 0.4 20'
'set ccolor 1'
'd ug;skip(vg,2)'




* display no vento ageostrofico
*'set gxout vector'
*'set arrscl 0.4 20'
*'d u-ug;v-vg'
*

* display vento real
*'set arrscl 0.4 20'
*'set ccolor 0'
*'d u;v'
'q pos'


*Loop
mbtn=subwrd(result,5)

if mbtn = 1
s = s + 4
else 
if mbtn = 3
s = s - 4
endif 
endif

endwhile

