@echo off

rem type app-raw\lib\*.js > app-raw\libs.js 2>nul 
rem call yuicompressor app-raw\libs.js -o app\libs.js
rem del app-raw\libs.js

type app-raw\style\*.less > app-raw\style.less 2>nul 
call lessc --no-ie-compat --strict-math=on app-raw\style.less app\main.css
del app-raw\style.less

call js-ext --keep-order app-raw/main.jsx > app\main.js || exit
perl -0pe "s,>\s+<,><,g;opendir(D,'app/lib');$m='';while($f=readdir(D)){$m=$m.'<script src=\"lib/'.$f.'\"></script>' if ($f=~m/^(?!\.)/);}s,<!-- LIBS -->,$m,g" < app-raw\main.html > app\main.html
