
bun build --compile --target=bun-windows-x64 --minify --sourcemap .\webview.js --outfile presentismo-client
./hidecmd ./presentismo-client.exe