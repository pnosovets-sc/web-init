const server = require('../index.js');
const assert = require('assert');
const fs = require('fs');
const http = require('http');

var routeScript = "module.exports.init = (app) => { app.get('/hello', (req, res) => res.send('world!')); return require('bluebird').resolve() }";

describe('Main', () =>
{
    describe('#init()', () =>
    {
        var removeRoutes = () => fs.existsSync('routes') && (fs.unlinkSync('routes/index.js') | fs.rmdirSync('routes'));
        var testHttp = (onResult) => http.get('http://localhost:3000/hello', (res) => res.on('data', (buffer) => onResult(buffer.toString())));
        var testStatic = (onResult) => http.get('http://localhost:3000/static/test.css', (res) => res.on('data', (buffer) => onResult(buffer.toString())));

        removeRoutes();

        fs.mkdirSync('routes');
        fs.writeFile('routes/index.js', routeScript);

        it('Basic routing test', (done) =>
        {
            var httpResult1;
            var httpResult2;

            var app = server.init({
                serviceClient : {
                    injectIntoRequest : true
                },
                routes : {
                    modulePaths : './routes'
                },
                server : {
                    mode : server.Server.Mode.Dev,
                    security : server.Server.Security.AllowCrossOrigin,
                    events : {
                        onStart : () => testHttp((res) => { httpResult1 = res; testStatic((res) => { httpResult2 = res; server.end();}) }),
                        onEnd: () => assert.equal(httpResult1, 'world!') | assert.equal(httpResult2.trim(), 'Empty') | removeRoutes() | done()
                    },
                    webpack : {
                        useWebpack : true,
                        configFilePath : process.cwd() + '/webpack.config.js'
                    }
                }
            });

            assert.equal('object', typeof app);
            assert.equal('function', typeof app.then);
            app.then((app) => assert.equal('function', typeof app));
        });
    });
});
