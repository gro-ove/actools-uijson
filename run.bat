@echo off

call prepare

taskkill /f /im carsmgr.exe

rm app\native\AcTools.dll
mklink /h app\native\AcTools.dll "D:\Development\GitHub\actools\AcTools\Bin\Release\AcTools.dll"

rm output\carsmgr.exe
mklink /h output\carsmgr.exe build\nw.exe

start output\carsmgr.exe app