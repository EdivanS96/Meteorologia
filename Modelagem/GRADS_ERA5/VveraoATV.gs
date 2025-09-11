'reinit'
'set display color white'
'c'

*--------------------------------------------------------------------------------------------------------
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
**** ABRINDO OS DADOS 
'sdfopen C:/Users/Edivan/Desktop/TRABALHOS/GRADS/dados/Interim0111.nc'

*--------------------------------------------------------------------------------------------------------
**** Configurando as latitudes, longitudes e nivel

*** Baixos Niveis
'set Lev 850'

*** Configurando a longitude
'set lon -80 -40'

*** Configurando a latitude
'set lat -45 -5'

*** Definindo as distancias
'define dx=6.37e6*cdiff(lon,x)*(3.1416/180.)*cos(lat*3.1416/180.)'
'define dy=6.37e6*cdiff(lat,y)*(3.1416/180.)'

*--------------------------------------------------------------------------------------------------------
**** DISPLAY NA MAGNITUDE DO VENTO E DA ALTURA GEOPOTENCIAL

'set gxout shaded'

*** TESTE 2
'set rgb 49 255 255 255'
'set rgb 50 204 255 255'
'set rgb 52 153 255 255'
'set rgb 54 102 178 255'
'set rgb 56 192 192 192'
'set rgb 58 224 224 224'


***  DEFININDO LOOP E TEMPO DAS IMG
*limpar tela
'clear'

ti=1; tf=49

*LOOP
s=ti
while (s <= tf)
  'c'
  n=s+1-ti
  'set t 's''
  'q time'
  dia=subwrd(result,3)
  say dia

'draw title Vento Termico: 'dia
*** ============================================ FIG 1 ====================================================
**** Plotando o gepotencial 
'set grads off'
'set xlab off'
'set ylab on'
'set t 1'
'set lev 850' *AQUIIIII
'q time'

dia=subwrd(result,3)
say dia
*'set cint 0.1'
*'set cmin 0.5'
*'set cmax 1.5'
*'set clevs       0.0005               0.0007             0.0009              0.0011                0.0013'
*'set ccols    49           50                    52                54                   56                 58'

** Calculando o parametro de Coriolis **

'f0=2*7.27*0.00001*sin(lat*3.14159/180)'

*'d f0'
*'d sin(lat*3.14159/180)'

*** Plotando o Geopotencial ***
'set gxout shaded'

*** Talvez o maskout nao esteja funcionando pq o segundo z deve ser o campo de superficie ***
*** que corresponde a topografia. ***

'set gxout shaded'
'd z/9.81'

cbarn

*'d maskout(z, z(lev=850)-z(z=1,t=1))'

*** Calculando os diferenciais ***
'dZx=cdiff(z,x)'
'dZy=cdiff(z,y)'

** Calculando o vento geostrofico  **
'ug=-(dZy/dy)*1/f0'
'vg=(dZx/dx)*1/f0'

* display no vento ageostrofico
*'set gxout vector'
*'set arrscl 0.4 20'
*'d u-ug;v-vg'
*
* display vento geostrofico
'set arrscl 0.4 20'
'set ccolor 2'
'd ug;vg'

* display vento real
*'set arrscl 0.4 20'
*'set ccolor 0'
*'d u;v'
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

exit
