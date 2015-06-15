@echo off

taskkill /f /im uijson.exe

rm app\native\AcTools.dll
mklink /h app\native\AcTools.dll "D:\Development\GitHub\actools\AcTools\Bin\Release\AcTools.dll"

rm output\uijson.exe
mklink /h output\uijson.exe build\nw.exe

start output\uijson.exe app