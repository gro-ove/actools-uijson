@echo off

build\upx.exe -9 output\carsmgr.exe

cd output
..\build\7z a -tzip -mx9 carsmgr.zip icudtl.dat nw.pak carsmgr.exe

call build\yadisk carsmgr.zip > download.txt
call build\wordpress
node build\comuf-update.js
