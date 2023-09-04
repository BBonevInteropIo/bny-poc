@echo off
if not "%1" == "min" start /MIN cmd /c %0 min & exit/b >nul 2>&1
set GLUE-ENV=DEMO
set GLUE-REGION=TICK42

set GLUE42_HOME=%~dp0Glue42
set GLUE_DESKTOP_HOME=%GLUE42_HOME%\GlueDesktop
set GLUE_GW_LOG_DIR=%LOCALAPPDATA%\Tick42\UserData\%GLUE-ENV%-%GLUE-REGION%\logs\
pushd %GLUE_DESKTOP_HOME%
set NODE_OPTIONS="--tls-min-v1.0"
if exist "config\configOverrides\system-%GLUE-ENV%-%GLUE-REGION%.json" start tick42-glue-desktop.exe -- config=config/system.json configOverrides config0=config/configOverrides/system-%GLUE-ENV%-%GLUE-REGION%.json
if not exist "config\configOverrides\system-%GLUE-ENV%-%GLUE-REGION%.json" start tick42-glue-desktop.exe -- config=config/system.json
popd
exit /b