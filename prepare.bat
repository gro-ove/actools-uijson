@echo off

perl -0pe "s,>\s+<,><,g;opendir(D,'app/script/modules');$m='';while($f=readdir(D)){$m=$m.'<script src=\"script/modules/'.$f.'\"></script>' if ($f=~m/^(?!\.)/);}s,<!-- MODULES -->,$m,g;opendir(D,'app/style');$m='';while($f=readdir(D)){$m=$m.'<link href=\"style/'.$f.'\" rel=\"stylesheet\" type=\"text/css\">' if ($f=~m/^(?!\.)/);}s,<!-- STYLES -->,$m,g;opendir(D,'app/lib');$m='';while($f=readdir(D)){$m=$m.'<script src=\"lib/'.$f.'\"></script>' if ($f=~m/^(?!\.)/);}s,<!-- LIBS -->,$m,g" < app-raw\main.html > app\main.html