@echo off

set FILE_VERSION=0.2
set PRODUCT_VERSION=0.2
set NW_VERSION=0.12.1
set DESCRIPTION=AcTools Ui Json Fixer
set COMMENTS=AcTools Ui Json Fixer

cd %~dp0

mkdir tmp
xcopy /E /Y app\* tmp

cd tmp
..\build\7z a -tzip -mx0 ..\output\uijson.nw *
cd ..
rd /S /Q tmp

copy /B /Y build\nw.exe+output\uijson.nw output\tmp.exe 

taskkill /f /im uijson.exe
build\reshacker -modify output\tmp.exe, output\uijson.exe, app\icon.ico, icon, IDR_MAINFRAME,
del output\tmp.exe

build\verpatch output\uijson.exe /fn /high /vft2 -1 /langid 1033 /va %FILE_VERSION% /pv %PRODUCT_VERSION% /s AssemblyVersion %NW_VERSION% /s OriginalFilename nw.exe /s InternalName actools-uijson-app /s ProductName AcTools /s FileDescription "%DESCRIPTION%" /s CompanyName "%COMPANY_NAME%" /s Comments "%COMMENTS%"
build\upx.exe -9 output\uijson.exe
