const express = require('express')
const app = express()
const process = require('node:process');
const redis = require('redis');
const { Client: PGClient } = require('pg');
const assert = require('node:assert');
const amqplib = require('amqplib');

// if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
//     const dotenv = require('dotenv');
//     dotenv.config({ path: __dirname + '/../.env' });
// }

let redisClient;

app.get('/', async (req, res) => {
    // const prevHitsValue = await redisClient.get('hits');
    // const prevHits = prevHitsValue ? parseInt(prevHitsValue) : 0;
    // const currentHits = prevHits + 1;
    // await redisClient.set('hits', currentHits);

    // res.status(200).send({
    //     hits: currentHits,
    // });
    res.status(200).send({
        url: req.url,
        originalUrl: req.originalUrl,
        path: req.path,
        headers: req.headers,
    });
});


app.get('/html', (_req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/crash-it', async (_req, res) => {
    setTimeout(() => {
        log('exiting.. with 0');
        process.exit(0);
    }, 100);

    res.status(200).send({});
})

app.get('/health', (_req, res) => {
    // log('healthcheck hit');
    res.status(200).send();
})

const port = process.env.PORT || 3000;

(async () => {
    // redisClient = redis.createClient({
    //     url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    // });
    // redisClient.on('error', err => console.log('Redis Client Error', err));
    // await redisClient.connect();
    // log('redisClient connected');

    // console.log(process.env);

    // const pgClient = new PGClient({
    //     host: process.env.POSTGRES_HOST,
    //     user: process.env.POSTGRES_USER,
    //     password: process.env.POSTGRES_PASSWORD,
    //     database: process.env.POSTGRES_DB,
    //     port: process.env.POSTGRES_PORT,
    // });
    // await pgClient.connect();
    // log('pgClient connected');

    // while(true) {
    //     try {
    //         await amqplib.connect({
    //             hostname: process.env.RABBITMQ_HOST,
    //             username: process.env.RABBITMQ_DEFAULT_USER,
    //             password: process.env.RABBITMQ_DEFAULT_PASS,
    //             port: process.env.RABBITMQ_PORT,
    //         });
    //         log('rabbitmq connected');
    //         break;
    //     } catch (err) {
    //         log('rabbitmq failed to connect:', err);
    //         await new Promise((resolve) => setTimeout(resolve, 1000));
    //     }
    // }

    const httpServer = app.listen(port, () => {
        log(`Example app listening on port ${port}`)
    });

    app.close = () => httpServer.close();
})();

module.exports = app;

function log(...args) {
    console.log(`[${new Date().toISOString()}] [index]`, ...args);
}
