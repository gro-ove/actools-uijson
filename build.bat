@echo off

call prepare

node -e "f=require('fs');s=JSON.parse(f.readFileSync(p='app/package.json'));console.log(s.version=s.version.replace(/\d+$/,function(_){return+_+1;}));f.writeFile(p,JSON.stringify(s,null,4))"> __version.tmp
set /p VERSION=<__version.tmp
del __version.tmp

perl -0pe "s{Last \(\K\d\.\d+\.\d+(?=\))}{%VERSION%}" < README.md > README.md~
del README.md
ren README.md~ README.md

cd %~dp0

mkdir tmp
xcopy /E /Y app\* tmp

del /Q /S output\*
rmdir /Q /S output\*

cd tmp
..\build\7z a -tzip -mx9 ..\output\carsmgr.nw *
cd ..
rd /S /Q tmp

copy /B /Y build\nw.exe+output\carsmgr.nw output\tmp.exe 
copy /B build\icudtl.dat output\icudtl.dat
copy /B build\nw.pak output\nw.pak

del output\carsmgr.nw

build\reshacker -modify output\tmp.exe, output\carsmgr.exe, app\icon.ico, icon, IDR_MAINFRAME,
del output\tmp.exe

