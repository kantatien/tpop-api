const express = require('express');
const http = require('http');
const graphqlConfig = require('../src/config/graphql.config');
const graphqlServerPrivate = require('./graphql-private/index');

const modelSql = require('./model-sql/index');

class Main {
    constructor(onReady) {
        this.onReady = onReady || function () { };
    }

    async start() {
        try {
            console.log();
            console.log(`\t\t== PostgreSQL`);
            await modelSql.validateConnection();
            console.log(`\t\t[✓] PostgreSQL model-sql is ready`);

            let expressApp = null;
            let httpServer = null;

            expressApp = express();
            httpServer = http.createServer(expressApp);

            expressApp.get('/', (req, res, next) => {
                res.send("");
            });

            console.log(`\t\t== GraphQL`);

            if (graphqlConfig.private_enable) {
                await graphqlServerPrivate(expressApp, httpServer);
            }

            await new Promise((resolve) => httpServer.listen({ port: graphqlConfig.port }, resolve));

            console.log(`\t\t[✓] GraphQL server is started`);

            //     }

            //     if (contextOption.redis) {
            //       console.log();
            //       logger.i(`\t\t== Redis`);
            //       await redisClient.validateConnection();
            //       logger.i(`\t\t[✓] Redis client is ready`);
            //     }

            console.log();
            this.onReady();
        } catch (ex) {
            console.log(ex.stack);
        }
    }
}

module.exports = Main;