$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$logFile = Join-Path $scriptDir "dev-server-startup.log"

function Log-Message {
    param([string]$message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $formattedMessage = "[$timestamp] $message"
    Write-Output $formattedMessage
    Add-Content -Path $logFile -Value $formattedMessage -ErrorAction SilentlyContinue
}

# Clear previous log
Clear-Content -Path $logFile -ErrorAction SilentlyContinue

Log-Message "=== AnchorRead Server Startup ==="

# Step 1: Check if port 5173 is in use
Log-Message "Checking if port 5173 is in use..."
$connection = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($connection) {
    # If there are multiple connections, grab the unique owning process IDs
    $pidsToKill = $connection | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pidToKill in $pidsToKill) {
        Log-Message "Port 5173 is currently in use by Process ID: $pidToKill"
        
        # Get process details
        $proc = Get-Process -Id $pidToKill -ErrorAction SilentlyContinue
        if ($proc) {
            Log-Message "Process name using port 5173: $($proc.Name)"
            # Kill the process to free the port
            Log-Message "Terminating process $pidToKill to free port 5173..."
            Stop-Process -Id $pidToKill -Force -Confirm:$false
            Start-Sleep -Seconds 2
        } else {
            Log-Message "Could not retrieve process details, but attempting to kill PID $pidToKill..."
            Stop-Process -Id $pidToKill -Force -Confirm:$false
            Start-Sleep -Seconds 2
        }
    }
} else {
    Log-Message "Port 5173 is free."
}

# Step 2: Start the Vite dev server
Log-Message "Starting Vite dev server in dyslexia-reader directory..."
Set-Location $scriptDir

# Run npm run dev and redirect output to vite-server.log
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev > vite-server.log 2>&1" -WorkingDirectory $scriptDir -WindowStyle Hidden

Start-Sleep -Seconds 3

# Step 3: Verify if it started
$newConnection = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($newConnection) {
    Log-Message "AnchorRead server successfully started on port 5173!"
    Log-Message "Process ID: $($newConnection.OwningProcess | Select-Object -Unique)"
} else {
    Log-Message "WARNING: Vite server did not start on port 5173. Please check npm logs in vite-server.log"
}
