@echo off

call prepare

node -e "f=require('fs');s=JSON.parse(f.readFileSync(p='app/package.json'));console.log(s.version=s.version.replace(/\d+$/,function(_){return+_+1;}));f.writeFile(p,JSON.stringify(s,null,4))"> __version.tmp
set /p VERSION=<__version.tmp
del __version.tmp

set FILE_VERSION=%VERSION%
set PRODUCT_VERSION=%VERSION%
set NW_VERSION=0.12.1
set DESCRIPTION=AcTools Ui Json
set COMMENTS=AcTools Ui Json

cd %~dp0

mkdir tmp
xcopy /E /Y app\* tmp

cd tmp
..\build\7z a -tzip -mx9 ..\output\uijson.nw *
cd ..
rd /S /Q tmp

copy /B /Y build\nw.exe+output\uijson.nw output\tmp.exe 

taskkill /f /im uijson.exe
build\reshacker -modify output\tmp.exe, output\uijson.exe, app\icon.ico, icon, IDR_MAINFRAME,
del output\tmp.exe

build\verpatch output\uijson.exe /fn /high /vft2 -1 /langid 1033 /va %FILE_VERSION% /pv %PRODUCT_VERSION% /s AssemblyVersion %NW_VERSION% /s OriginalFilename nw.exe /s InternalName actools-uijson-app /s ProductName AcTools /s FileDescription "%DESCRIPTION%" /s CompanyName "%COMPANY_NAME%" /s Comments "%COMMENTS%"
build\upx.exe -9 output\uijson.exe

cd output
..\build\7z a -tzip -mx9 uijson.zip icudtl.dat nw.pak uijson.exe
