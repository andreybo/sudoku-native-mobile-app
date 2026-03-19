param(
    [string]$Emulator = ""
)

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  SudokuMix - Android + React Native" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Set ANDROID_HOME
$ANDROID_HOME = "C:\Users\Andrew\AppData\Local\Android\Sdk"
$env:ANDROID_HOME = $ANDROID_HOME
$env:PATH = "$ANDROID_HOME\emulator;$ANDROID_HOME\platform-tools;$env:PATH"

# Check Android environment
Write-Host "[1/3] Checking Android environment..." -ForegroundColor Yellow
if (Test-Path "$ANDROID_HOME\emulator\emulator.exe") {
    Write-Host "✓ Android SDK found" -ForegroundColor Green
} else {
    Write-Host "✗ Android SDK not found at $ANDROID_HOME" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/3] Starting Android emulator..." -ForegroundColor Yellow

# Get list of emulators
$emulators = & "$ANDROID_HOME\emulator\emulator.exe" -list-avds
if ($emulators.Count -eq 0) {
    Write-Host "✗ No emulators found!" -ForegroundColor Red
    Write-Host "Please create an emulator through Android Studio first" -ForegroundColor Yellow
    exit 1
}

# Select emulator
if ($Emulator -eq "") {
    Write-Host "Available emulators:" -ForegroundColor Cyan
    for ($i = 0; $i -lt $emulators.Count; $i++) {
        Write-Host "  $($i+1). $($emulators[$i])"
    }
    if ($emulators.Count -eq 1) {
        $Emulator = $emulators[0]
        Write-Host "Using: $Emulator" -ForegroundColor Green
    } else {
        $choice = Read-Host "Select emulator number (1-$($emulators.Count))"
        $Emulator = $emulators[$choice - 1]
    }
}

Write-Host "Starting: $Emulator..." -ForegroundColor Cyan
& "$ANDROID_HOME\emulator\emulator.exe" -avd $Emulator -writable-system &

Write-Host "Waiting 15 seconds for emulator to boot..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "[3/3] Starting React Native development server..." -ForegroundColor Yellow
Write-Host ""

& npm start -- --reset-cache
