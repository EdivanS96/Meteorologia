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


*** Nivel 
'set z 1'

*** Configurando a longitude
'set lon 0 360'
*'set lon -110 0'

*** Configurando a latitude
'set lat -90 -25'

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
ti=50; tf=52

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

*--------------------------------------------------------------------------------------------------------
**** DISPLAY NA MAGNITUDE DO VENTO E DA ALTURA GEOPOTENCIAL

'set gxout shaded'

*** ============================================ FIG 1 ====================================================
**** Plotando o gepotencial 
'set grads off'
'set xlab off'
'set ylab on'
'q time'
dia=subwrd(result,3)

** Calculando o parametro de Coriolis **



*** Plotando o Geopotencial ***
'set gxout shaded'

*** Talvez o maskout nao esteja funcionando pq o segundo z deve ser o campo de superficie ***
*** que corresponde a topografia. ***


*'set clevs 900 950 1000 1050 1100 1150 1200 1250 1300 1350 1400 1450 1500 1550 1600 1650'

*** Calculando o vento geostrofico no nivel de baixo ***

'set z 1'
'z1=z'
'set gxout shaded'
**'d z1/9.81'
 'cbarn'
*** Calculando os diferenciais ***
'dZ1x=cdiff(z1,x)'
'dZ1y=cdiff(z1,y)'

** Calculando o vento geostrofico  **
'ug1=-(dZ1y/dy)*1/f0'
'vg1=(dZ1x/dx)*1/f0'

** Display no Vento Geostrofico. ***
**'set gxout vector'
**'d ug1;vg1'

'c'
*** Calculando o vento geostrofico no nivel de cima ***

'set z 1'
'z3=z(z=3)'
'set gxout shaded'
**'d z3/9.81'

*** Calculando os diferenciais ****
'dZ3x=cdiff(z3,x)'
'dZ3y=cdiff(z3,y)'

** Calculando o vento geostrofico  ***
'ug3=-(dZ3y/dy)*1/f0'
'vg3=(dZ3x/dx)*1/f0'


*** Definindo campo de temperatura no nivel intermediario ***
*'set z 1'
*'t2=t(z=2)'
*'d t2'
*'cbarn'


*** Calculando o Vento Térmico ****

*'set gxout vector'
*'set arrscl 0.4 10'
*'d (ug3-ug1);skip((vg3-vg1),4)'
*say 'display vento termico' 

'set gxout shaded'
'd mag((ug3-ug1),(vg3-vg1))'
'cbarn'

'draw title Magnitude Vento Termico Niveis 3-1 'dia

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

