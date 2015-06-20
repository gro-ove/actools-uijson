@echo off

call prepare

node -e "f=require('fs');s=JSON.parse(f.readFileSync(p='app/package.json'));console.log(s.version=s.version.replace(/\d+$/,function(_){return+_+1;}));f.writeFile(p,JSON.stringify(s,null,4))"> __version.tmp
set /p VERSION=<__version.tmp
del __version.tmp

perl -0pe "s{Last \(\K\d\.\d+\.\d+(?=\))}{%VERSION%}" < README.md > README.md~
del README.md
ren README.md~ README.md

set FILE_VERSION=%VERSION%
set PRODUCT_VERSION=%VERSION%
set NW_VERSION=0.12.1
set DESCRIPTION=AcTools Cars Manager
set COMMENTS=AcTools Cars Manager

cd %~dp0

mkdir tmp
xcopy /E /Y app\* tmp

cd tmp
..\build\7z a -tzip -mx9 ..\output\carsmgr.nw *
cd ..
rd /S /Q tmp

copy /B /Y build\nw.exe+output\carsmgr.nw output\tmp.exe 

taskkill /f /im carsmgr.exe
rm output\carsmgr.exe
build\reshacker -modify output\tmp.exe, output\carsmgr.exe, app\icon.ico, icon, IDR_MAINFRAME,
del output\tmp.exe

build\verpatch output\carsmgr.exe /fn /high /vft2 -1 /langid 1033 /va %FILE_VERSION% /pv %PRODUCT_VERSION% /s AssemblyVersion %NW_VERSION% /s OriginalFilename nw.exe /s InternalName actools-carsmgr-app /s ProductName AcTools /s FileDescription "%DESCRIPTION%" /s CompanyName "%COMPANY_NAME%" /s Comments "%COMMENTS%"
build\upx.exe -9 output\carsmgr.exe

cd output
..\build\7z a -tzip -mx9 carsmgr.zip icudtl.dat nw.pak carsmgr.exe

call ..\build\yadisk carsmgr.zip > download.txt
call ..\build\wordpress
