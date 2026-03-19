# Запуск Android и React Native

## Способ 1: Батник (самый простой)

1. **Двойной клик** на файл `start-android.bat` в папке проекта
2. Скрипт автоматически запустит:
   - Эмулятор Android
   - React Native dev server

## Способ 2: PowerShell (рекомендуется)

Откройте **PowerShell** в папке проекта:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\start-android.ps1
```

Или с конкретным эмулятором:

```powershell
.\start-android.ps1 -Emulator "Medium_Phone_API_36.1"
```

## Способ 3: Npm скрипт

Добавьте в `package.json`:

```json
"scripts": {
  "android": "npm start -- --reset-cache",
  "android:only": "npx react-native run-android"
}
```

Затем запустите:

```powershell
npm run android
```

## Имеющиеся эмуляторы

- `Medium_Phone_API_36.1` - Телефон (рекомендуется)
- `Pixel_Tablet` - Планшет

## Если эмулятор уже запущен

Просто запустите React Native без эмулятора:

```powershell
npx react-native run-android
```

## Проблемы?

Если скрипт не работает, проверьте:

```powershell
$env:ANDROID_HOME = "C:\Users\Andrew\AppData\Local\Android\Sdk"
$env:ANDROID_HOME\emulator\emulator.exe -list-avds
```
