@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

echo -^> sign vendor-bzip2

pushd output
for /r %%i in (*.dll) do call grigore-stefan.sign "BZip2" "%%i"
for /r %%i in (*.exe) do call grigore-stefan.sign "BZip2" "%%i"
popd
