# ocbesbn-web-init
This module combines more general and common setup routines for creating a basic REST service environment.
Using it may help creating a more common and comparable structure over muliple services by following conventions
made by this service.

---

### Minimum setup

First got to your local code directory and run:
```
npm install ocbesbn-web-init
```
Now you would have to set up at least one basic route file that will automatically be included by the module
when initialized. The default path for routes is "./src/server/routes". This location can be changed by configuration
but may not be overwritten to stay with common service conventions.

A route module can be created using the following code:
```JS
module.exports.init = function(app, db, config)
{
    // app => express instance.
    // db => can be defined by configuration when running the .init() method.
    // config => everything from config.routes passed when running the .init() method.
    app.get('/', (req, res) => res.send('hello world'));
}
```

Go to your code file and put in the minimum setup code.
```JS
const server = require('ocbesbn-web-init');

// You might want to pass a configuration object to the init method. A list of parameters and their default values
// can be found at the .DefaultConfig module property.
server.init({}).then(console.log);
```
This code applies a lot of conventions that of course can, but may not be overwritten by passing a configuration object
to the init() method.

---

### Default configuration

The default configuration object provides hints about what the module's standard behavior is like. It is mostly recommended to leave most settings as they are and treat them more as general conventions to a common structure
in order to maintain a common setup across different services.

```JS
{
    server : {
        mode : process.env.NODE_ENV === 'development' ? this.Server.Mode.Dev : this.Server.Mode.Productive,
        security : this.Server.Security.All,
        crossOrigins : [ '*' ],
        maxBodySize : 1048576, // 1 MiB
        staticFilePath : express.static(__dirname + '/static'),
        hostname : process.env.HOST || '0.0.0.0',
        port : process.env.PORT || 3000,
        events : {
            onStart : function(server) { },
            onEnd : function(server) { },
            onRequest : function(req, res, next) { next(); },
            onError : function(err, server) { process.stderr.write(err); }
        },
        webpack : {
            useWebpack : false,
            configFilePath : './webpack.conf'
        }
    },
    routes : {
        addRoutes : true,
        modulePaths : [ './src/server/routes' ],
        dbInstance : null
    },
    morgan : {
        format : this.Morgan.Format.Dev,
        stream : this.Morgan.OutputStream.Console
    }
}
```
