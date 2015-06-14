@echo off

taskkill /f /im tmpapp.exe
mklink /h output\tmpapp.exe build\nw.exe
start output\tmpapp.exe app