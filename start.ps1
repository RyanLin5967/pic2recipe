docker compose up -d
$port = Read-Host "ADB port"
adb connect "10.0.0.205:$port"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\idide\pic2recipe\backend; venv\Scripts\Activate; fastapi dev main.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\idide\pic2recipe\frontend; npm start"