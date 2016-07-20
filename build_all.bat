@echo off
call ".\node_modules\.bin\babel.cmd" --presets react,es2015 .\ui\babel -d .\ui\js
call ".\node_modules\.bin\browserify.cmd" .\ui\js\main.js -o .\login\js\bundle.js