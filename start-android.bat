@echo off
setlocal enabledelayedexpansion

echo.
echo ====================================
echo   SudokuMix - Android + React Native
echo ====================================
echo.

REM Set ANDROID_HOME
set ANDROID_HOME=C:\Users\Andrew\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%

echo [1/3] Checking Android environment...
if exist "%ANDROID_HOME%\emulator\emulator.exe" (
    echo ✓ Android SDK found
) else (
    echo ✗ Android SDK not found at %ANDROID_HOME%
    pause
    exit /b 1
)

echo.
echo [2/3] Starting Android emulator...
REM List available emulators
for /f "tokens=*" %%i in ('"%ANDROID_HOME%\emulator\emulator.exe" -list-avds') do (
    set EMULATOR=%%i
    goto start_emulator
)

:start_emulator
if defined EMULATOR (
    echo Using emulator: %EMULATOR%
    start "" "%ANDROID_HOME%\emulator\emulator.exe" -avd %EMULATOR%
    echo Waiting for emulator to start...
    timeout /t 10 /nobreak
) else (
    echo ✗ No emulators found!
    echo Please create an emulator through Android Studio first
    pause
    exit /b 1
)

echo.
echo [3/3] Starting React Native development server...
echo.
call npm start -- --reset-cache

pause
