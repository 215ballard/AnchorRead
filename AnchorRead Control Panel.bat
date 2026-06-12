@echo off
title AnchorRead Control Panel
set "REPO_DIR=%~dp0"
:: Remove trailing backslash if any
if "%REPO_DIR:~-1%"=="\" set "REPO_DIR=%REPO_DIR:~0,-1%"

:menu
cls
echo ===================================================
echo             AnchorRead Focus Reading App
echo ===================================================
echo.
echo  [1] Start Server (Background)
echo  [2] Stop Server
echo  [3] Restart Server
echo  [4] Check Server Status
echo  [5] Open App in Web Browser (http://localhost:5173)
echo  [6] View Logs
echo  [7] Create Desktop Shortcut
echo  [8] Exit
echo.
echo ===================================================
set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto start_server
if "%choice%"=="2" goto stop_server
if "%choice%"=="3" goto restart_server
if "%choice%"=="4" goto check_status
if "%choice%"=="5" goto open_browser
if "%choice%"=="6" goto view_logs
if "%choice%"=="7" goto create_shortcut
if "%choice%"=="8" goto exit

echo Invalid choice, please try again.
pause
goto menu

:start_server
echo.
echo Starting AnchorRead Server...
powershell -ExecutionPolicy Bypass -File "%REPO_DIR%\start-server.ps1"
echo.
pause
goto menu

:stop_server
echo.
echo Stopping AnchorRead Server...
powershell -ExecutionPolicy Bypass -Command "$c = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue; if ($c) { Stop-Process -Id ($c.OwningProcess | Select-Object -Unique) -Force; Write-Host 'Server stopped successfully.' -ForegroundColor Green } else { Write-Host 'Server is not running on port 5173.' -ForegroundColor Yellow }"
echo.
pause
goto menu

:restart_server
echo.
echo Restarting AnchorRead Server...
powershell -ExecutionPolicy Bypass -Command "$c = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue; if ($c) { Stop-Process -Id ($c.OwningProcess | Select-Object -Unique) -Force; Write-Host 'Stopped running server.' }"
powershell -ExecutionPolicy Bypass -File "%REPO_DIR%\start-server.ps1"
echo.
pause
goto menu

:check_status
echo.
echo Checking AnchorRead Server Status...
powershell -ExecutionPolicy Bypass -Command "$c = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue; if ($c) { $pids = $c.OwningProcess | Select-Object -Unique; foreach ($pid in $pids) { $p = Get-Process -Id $pid -ErrorAction SilentlyContinue; if ($p) { Write-Host 'Server is RUNNING' -ForegroundColor Green; Write-Host 'PID:' $p.Id; Write-Host 'Start Time:' $p.StartTime; Write-Host 'Memory (WS):' ([Math]::Round($p.WorkingSet / 1MB, 2)) 'MB'; return } }; Write-Host 'Server port is active but process details could not be read.' -ForegroundColor Yellow } else { Write-Host 'Server is STOPPED' -ForegroundColor Red }"
echo.
pause
goto menu

:open_browser
echo.
echo Opening http://localhost:5173 in default browser...
start http://localhost:5173
goto menu

:view_logs
echo.
echo Opening logs...
if exist "%REPO_DIR%\dev-server-startup.log" (
    start notepad.exe "%REPO_DIR%\dev-server-startup.log"
) else (
    echo Startup log file does not exist yet.
)
if exist "%REPO_DIR%\vite-server.log" (
    start notepad.exe "%REPO_DIR%\vite-server.log"
) else (
    echo Vite server log file does not exist yet.
)
pause
goto menu

:create_shortcut
echo.
echo Creating Desktop Shortcut to AnchorRead Control Panel...
powershell -ExecutionPolicy Bypass -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut([System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), 'AnchorRead Control Panel.lnk')); $Shortcut.TargetPath = '%REPO_DIR%\AnchorRead Control Panel.bat'; $Shortcut.WorkingDirectory = '%REPO_DIR%'; $Shortcut.IconLocation = 'shell32.dll,137'; $Shortcut.Save(); Write-Host 'Shortcut created successfully on Desktop!' -ForegroundColor Green"
echo.
pause
goto menu

:exit
exit
