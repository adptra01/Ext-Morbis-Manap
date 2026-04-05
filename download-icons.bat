@echo off
echo Downloading placeholder icons for Chrome Extension...
echo.

set DIR=icons
if not exist %DIR% mkdir %DIR%

:: Download placeholder icons from placeholder.com or similar
echo Downloading icon16.png...
curl -o %DIR%\icon16.png "https://placehold.co/16x16/4285f4/ffffff?text=D" 2>nul

echo Downloading icon48.png...
curl -o %DIR%\icon48.png "https://placehold.co/48x48/4285f4/ffffff?text=Detail" 2>nul

echo Downloading icon128.png...
curl -o %DIR%\icon128.png "https://placehold.co/128x128/4285f4/ffffff?text=DT" 2>nul

echo.
echo Done! Icons saved in icons/ folder
pause
