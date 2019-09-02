# Lambchop
Lambchop makes it easier to develop Lambda backed React pages for Capterra. In order to enable the easiest common case implementation, while allowing deeper customization, Lambchop provides support at several layers of abstraction built on top of lambda-api and other tools.

1. [Lambchop.app](#Lambchop.app) - the easier common case approach
2. [Support Modules](#support-modules) - leave the ease of `Lambchop.app` for more control by using `Lambchop` support modules directly with `lambda-api`

## Version
* [Current - v1.0.0]

## Installation

Include this library into package.json of the project with the right version.
```
"lambchop": "git+ssh://git@github.com/capterra/lambchop.git#v0.1",
```

## Lambchop.app

Lambchop.app is plug and play. You give it some configuration. It takes care of running your application automatically.

TODO FOR JACK: add a succinct but full description/list of what Lambchop.app does for you.

```
import Lambchop from 'lambchop'

let littleLamb = Lambchop.app({
  // config stuff here..
});

// Off to the lamb races!
exports.handler = littleLamb.run();
```

It also gives you some flexibility to choose what caching client you want ( currently only Redis supported ), what error notifier you use ( currently only Rollbar supported ).


### Params


| Params         | Type   |  Description   | Required/Optional   |
| -------------   |-------------|-------------|-------------|
|  appName      | {String} | Name of the application. This is used to create asset file specified in webpack. | Required |
|  [cache](#cache-config) | {Object}       | Cache config.      |  Optional |
|  errorNotifier        | {Object} | Error Notifier instance. Can be extended from AbstractErrorNotifier class.  | Optional |
|  dataFetcher        | {Promise or Async function} | **async function is recommended** Get product data promise. Either from upstream API or from database. The result will be appended as data into req object and available in req object to all other middlewares. (req.data)    |  Required |
|  [render](#render-config) | {Function}      | Render configuration. This have access to req and res object from lambda-api. statusCode is available in res object and can be accessed res.statusCode     | Required |


#### Cache configuration

| Params         | Type   | Description   | Required/Optional   | 
| -------------   |-------------|-------------|-------------|
|  cacheStoreName | {String}   | Cache store name  |  Required |
|  keyFunction       | {Function} | Function to get cache key. This function have access to req and res object as params. | Required |
|  host      |  {String} | Cache Database url.      | Required |
|  password      | {String} | Cache Database password.      | Required |
|  port      | {Number} | Cache Database port.      |  Required |
|  ttl      | {Number} | Time to live for cache data in seconds.  Default 259200 seconds    | Optional |
|  connectionTimeout  | {Number}    | Connection timeout. If the application can't connect to the database. After this timeout, the application will ignore cache and continue rendering. Default 100 ms   | Optional |


#### Render configuration

This is a middleware function that give you access to req and res objects as 2 params (`req`, `res`) => { }

The below signature is what the render function needs to return.


| Props         | Type   | Description   | Required/Optional   | 
| -------------   |-------------|-------------|-------------|
|  envForHydration  | {Object}    | Environment object for client hydration. This is only needed if for some reason the data for rendering is too big. And we don't want to stringify this whole big object window.app_data = JSON.stringify(dataObject). This will impact the performance. So we want to make an ajax call from client side to grab this data again and hydrate it. Cherry pick in any needed environment data for client hydration. |  Optional|
| [gaConfig](#gaConfig-configuration) | {Object}      | Google analytic and tag manager config.  | Optional |
| pageMetaData  | {Object}     | Page Meta Data. Each key value pair is a meta tag. Key will be used as name attribute. Value is content attribute of that meta tag. **Note: The title specified here will be used as page title.**  |  Required |
|  hashIdEndpoint | {String}     | Hash ID endpoint.  | Optional| 
|  clientHydrationEndpoint | {String}     | Endpoint to get data for client hydration. This is only needed if for some reason the data for rendering is too big. And we don't want to stringify this whole big object window.app_data = JSON.stringify(dataObject). This will impact the performance. So we want to make an ajax call from client side to grab this data again and hydrate it. | Optional |
|  appRoot   | {React Component}   | React root component.  |  Required |
|  headerSnippet   |  {Array of String} | Array of string. This will be appended into header tag right before the closing tag.  | Optional |
| bodySnippet  | {Array of String}     | Array of string. This will be appended into body tag right after the opening tag.  | Optional |

##### gaConfig configuration
| Params         | Type   | Description   | Required/Optional   | 
| -------------   |-------------|-------------|-------------|
| gaTrackingId      | {String}   |  Google analytic tracking id  | Optional  | 
|  gaContainerId      | {String}  |  Google analytic container id  | Optional  | 
|  gtmContainerId      | {String}  |  Google tag manager container id  | Optional  | 
|  initialGTMDataLayer      | {Object}  |  Initial data layer for GTM | Optional  | 

### HTTP Error Response
In your middleware if you need to tell lambchop to catch a 404 you can do:
```js
const error = new Error('Record not found');
error.response = notFoundResponse;
return Promise.reject(error);
```
If you want to just return status code and override response header
```js
res.header('Location', location);
return res.status(status).send();
```
If you just want to throw a 505
```js
throw new Error('Something wrong')
```
If you want to do a redirect
```js
res.redirect(301, '/categories')
```

Currently, by default It is using the appRoot to generate html error pages (404, 500...) Meaning your appRoot needs to check what statuscode returning from the Lambchop and handle it yourself. If your appRoot (react component) doesn't handle that It just return the status code without html page.

```js
{
  ...lamchopConfig,
  render: (req, res) => {
    const { statusCode } = res;
    return {
      ...renderConfig,
      appRoot: <App statusCode={statusCode} />
    };
  }
}

```

When we have cloudfront setup for all applications, we can use the predefined middleware httpErrorResponse which just return statuscode.


### Hooks
It support mutiple types of hooks so that you can inject your custom middlewares. Currently we only support *beforeRender*. If you inject 2 middlewares. The first one will be executed first. Meaning FIFO (first in first out).

Your hook function is nothing but a middleware that have access to req and res object.

Make sure at the end of your middleware you always call `return next()`

```js
import Lambchop from 'lambchop';

const app = Lambchop.app({ ...config });

app.injectMiddleware({
  hook: 'beforeRender',
  middleware: (req, res, next) => {
    ...customcode
    
    return next();
  }
});

```

### Example

#### "Server" Side

First specify your configuration. Then if you need custom middlewares you can inject it with **injectMiddleware** method. Finally just paste in **exports.handler = Lambchop.run();**

```js
import Lambchop from 'lambchop';
import { RollbarNotifier } from 'lambchop/error-notification';
const Rollbar = new RollbarNotifier({
  serverAccessToken: process.env.ROLLBAR_SERVER_TOKEN,
  clientAccessToken: process.env.ROLLBAR_CLIENT_TOKEN,
  environment: process.env.ROLLBAR_ENVIRONMENT
});

Lambchop.app({
  appName: 'lambchop',
  cache: {
    cacheStoreName: 'Redis',
    keyFunction,
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
    ttl: 259200,
    connectionTimeout: 100,
  },
  errorNotifier: Rollbar,
  dataFetcher: getProductData,
  render: (req, res) => {
    const { product } = req;
    return {
      envForHydration: {
        WRITE_REVIEW_BASE_URL: process.env.WRITE_REVIEW_BASE_URL,
        MAIN_SITE_URL: process.env.MAIN_SITE_URL,
        IMAGE_BASE_URL: process.env.IMAGE_BASE_URL
      },
      gaConfig: {
        gaTrackingId: process.env.GA_TRACKING_ID,
        gaContainerId: process.env.OPTIMIZE_CONTAINER_ID,
        gtmContainerId: process.env.GTM_CONTAINER_ID,
        initialGTMDataLayer: product ? {
          category_id: product.category.id,
          product_id: product.product_id,
          vendor_id: product.vendor.vendor_id,
          reviewRating: product.rating,
          reviewQuantity: product.reviewsTotal,
        } : {},
      },
      pageMetaData: {
        title: `${product.name} Reviews and Pricing - ${new Date().getFullYear()}`,
        description: `Find out what users are saying about ${product.name}. Read user ${product.name} reviews, pricing information and what features it offers.`,
      },
      hashIdEndpoint: `${process.env.APP_API}/hshid`,
      clientHydrationEndpoint: `${process.env.APP_API}`,
      appRoot: (<StaticRouter location={path} context={data || {}}>
        <App pageData={data || {}} statusCode={statusCode} />
      </StaticRouter>),
      headerSnippet: ['<link href="/style.css" />'],
      bodySnippet: [],
    };
  },
});

Lambchop.injectMiddleware({
  hook: 'beforeRender',
  middleware: (req, res) => {},
});

exports.handler = Lambchop.run();
```


#### Browser Side

Lambchop provides some support for the SSR hydration in the browser, but currently you still need to create a separated js file for client side rendering. This file will need be bundled by *your* webpack. In order `Lambchop.app` to properly consume it, you will need to follow some conventions for naming and locating this file. Lambchop using appName to generate the asset url. The file name needs to be **${appName}Browser.js**

You can pass a custom container id for hydration. If not by default it is root. 

You can reference the webpack config in demo folder. 

In a future version of Lambchop, we intend to remove the need to manually create this file.


```js
import reactHydrator from 'lambchop/ssr/reactHydrator';

// You are safe to use window.SSR_BRIDGE_DATA inside this function. Since at this point the data already available.
const getAppRoot = () => {
  const initialStateData = formatData(window.SSR_BRIDGE_DATA, cookieData, window.ENV_FROM_SERVER);

  return (
    <BrowserRouter>
      <Route path="/*">
        {({ location, history }) => <App pageData={initialStateData} location={location} history={history} />}
      </Route>
    </BrowserRouter>
  );
};

reactHydrator(getAppRoot, 'root');
```
## Support Modules

If your needs fall outside the patterns of use provided by `Lambchop.app`, you can always use `lambda-api` directly, and in that case use our supporting modules directly, as needed. 

1. [Caching](#caching) - Cache client adapters
2. [Error Notification](#error-notification) - Error notification client adapters
3. [Universal Rendering](#universal-rendering) - React Server-Side Rendering and Hydration support methods
4. [Common Middlewares](#common-middlewares) - Common supporting middlewares

### Caching
```js
import { RedisCacheClient } from 'lambchop/caching';
const client = new RedisCacheClient({ host, port, password, ttl, connectionTimeout });
```
Currently we only support Redis as a cache store. **RedisCacheClient** extending from **AbstractCacheClient**.
Any other new cache store client class need to do the same by extending from **AbstractCacheClient**. This will guarantee all required methods are defined and naming convention are standardized.

Required methods:  **initialize**, **connected**, **get**, **set**. If not defined It will throw exception. Make sure `this.initialize()` get called in constructor so that client is created when instantiated.

By default error handler is captured by using **console.error**, but users can override this by using **injectCustomErrorHandler** method.

| Methods         | Description   | 
| -------------   |-------------|
| initialize      | Initialize redis connection. By default when you create a new object It will execute this automatically. | 
| connected        | Check if redis connection is established.      | 
| get  | Get data by key. This returns a promise time out after certain time if can't make connection.      |  
| set  | Save data to redis database. This is non block meaning we don't care if this is finished execution.  |  


### Error Notification
```js
import { RollbarNotifier } from 'lambchop/error-notification';
const Rollbar = new RollbarNotifier({
  serverAccessToken: process.env.ROLLBAR_SERVER_TOKEN,
  clientAccessToken: process.env.ROLLBAR_CLIENT_TOKEN,
  environment: process.env.ROLLBAR_ENVIRONMENT
});
```
Currently we support Rollbar. **RollbarNotifier** extending from **AbstractNotifier**.
Any other new client class need to do the same by extending from **AbstractNotifier**. This will guarantee all required methods are defined and naming convention are standardized.

Required methods:  **sendErrorNotification**. If not defined It will throw exception.

It also provides **checkRequiredSettings** method so that users can guarantee any required config settings are specified.
```js
checkRequiredSettings(['serverAccessToken', 'clientAccessToken', 'environment']);
```

| Methods         | Description   | 
| -------------   |-------------|
| sendErrorNotification      | Send error to rollbar. | 
| checkRequiredSettings        | Check if required config settings are specified.      | 

### Universal Rendering
This module having 2 sub modules:
+ **reactHydrator**
+ **reactServerSideRender**

#### reactHydrator
Only needed if we delay the hydration on client side by making ajax call to grab data for rendering instead of stringify data that coming from server side rendering as a window object. This is only relevant if your data is too big.

#### reactServerSideRender
Using function composition pattern. Each function is a html block. Each function automatically have access to data param passed in from combined function.

### Common Middlewares
All commom reusable middlewares are defined in this module.
Make sure when you define a new middleware. You follow the same pattern
```js
const newMiddleware = (dependencies) => (req, res)) => {}
```
This way we can inject dependencies into this middleware easily.

| Middlewares         | Description   | 
| -------------   |-------------|
| retrieveData(promise)      | This expect a promise. If you have multiple endpoints to grab data from. You should combine them all into one promise. The result will be available as data in req object and accessible from all other middlewares. | 
| cacheRead(getKey, client)      | Read cache data and append the result into req payload as cacheResponse prop if available. @param {Function} getKey - Return key to get data from redis. @param {Object} client - Cache client instance. | 
| cacheWrite(getKey, getUncachedHtml, client)      | Store data into Redis db. @param {Function} getKey - Return key to get data from redis. @param {Function} getUncachedHtml - Return data to store into redis. @param {Object} client - Cache client instance. | 
| httpErrorResponse      | Send error status response. This is the default one. Only send status in the response payload.      | 

## Demo App For Development
Installation `npm install`.
Run `npm run start:dev`.
Go to `http://localhost:4005/lambchop/1`

## Dependencies
```
"react": "^16.4.2",
"react-dom": "^16.4.2",
"react-router-dom": "^4.3.1",
"hiredis": "^0.5.0",
"redis": "^2.8.0",
"rollbar": "^2.4.1",
"lambda-api": "^0.10.1",
"styled-components": "^3.4.2"
```
