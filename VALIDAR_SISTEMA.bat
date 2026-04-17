@echo off
echo ==========================================
echo    DIAGNOSTICO DE SISTEMA - CRIFFER
echo ==========================================
echo.

echo 1. Verificando Node.js...
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] O motor (Node.js) NAO foi encontrado.
    echo Por favor, instale em: https://nodejs.org/
) else (
    echo [OK] Node.js detectado!
    for /f "tokens=*" %%i in ('node -v') do set node_v=%%i
    echo Versao: %node_v%
)

echo.
echo 2. Verificando NPM...
npm -v > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] O gerenciador (NPM) NAO foi encontrado.
) else (
    echo [OK] NPM detectado!
)

echo.
echo ==========================================
echo Se houver um [ERRO] acima, voce PRECISA
echo instalar o Node.js no site oficial.
echo ==========================================
pause
