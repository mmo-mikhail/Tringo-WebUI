[![Build Status](https://dev.azure.com/Tringo/Tringo/_apis/build/status/Tringo-CI-Staging?branchName=develop)](https://dev.azure.com/Tringo/Tringo/_build/latest?definitionId=5&branchName=develop)

# Tringo-WebUI
Tringo - Front-End Web Application

#### Build and run docker image locally

in terminal (on mac) or GitBash or WSL on Windows execute pipeline.sh from /internals

```
./pipeline.sh
```


#### Clean code with prettier
```
./node_modules/.bin/prettier --single-quote --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"
```
