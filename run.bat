@echo off

call prepare

taskkill /f /im carsmgr.exe 2>nul 

rem del app\native\AcTools.dll
rem mklink /h app\native\AcTools.dll "D:\Development\GitHub\actools\AcTools\Bin\Release\AcTools.dll" >nul 

del output\carsmgr.exe
mklink /h output\carsmgr.exe build\nw.exe >nul 

output\carsmgr.exe --enable-logging app
del output\debug.log