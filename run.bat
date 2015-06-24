@echo off

call prepare

rem del app\native\AcTools.dll
rem mklink /h app\native\AcTools.dll "D:\Development\GitHub\actools\AcTools\Bin\Release\AcTools.dll" >nul 

mklink /h build\carsmgr.exe build\nw.exe >nul 

build\carsmgr.exe --enable-logging app
del build\debug.log