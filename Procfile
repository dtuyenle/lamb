serverlessLocal: AWS_XRAY_CONTEXT_MISSING=LOG_ERROR NODE_ENV=development node --inspect ./node_modules/.bin/serverless offline start --dontPrintOutput
assetServer: http-server ./demo/dist/public -p 8080 -c-1 -g
webpackWatch: npm run build:watch