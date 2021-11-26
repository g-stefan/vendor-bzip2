@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

set ACTION=%1
if "%1" == "" set ACTION=make

echo - %BUILD_PROJECT% ^> %1

goto cmdXDefined
:cmdX
%*
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo "Error: %ACTION%"
exit 1
:cmdXDefined

call :cmdX xyo-cc --mode=%ACTION% --source-has-archive bzip2

if not exist output\ mkdir output
if not exist output\include\ mkdir output\include
if not exist output\include\bzlib.h copy source\bzlib.h output\include\bzlib.h

call :cmdX xyo-cc --mode=%ACTION% @build/source/libbz2.static.compile
call :cmdX xyo-cc --mode=%ACTION% @build/source/libbz2.dynamic.compile
call :cmdX xyo-cc --mode=%ACTION% @build/source/bzip2.compile
call :cmdX xyo-cc --mode=%ACTION% @build/source/bzip2recover.compile
