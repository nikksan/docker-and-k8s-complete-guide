const express = require('express')
const app = express()
const process = require('node:process');
const redis = require('redis');

const client = redis.createClient({
    url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

app.get('/', async (_req, res) => {
    const prevHitsValue = await client.get('hits');
    const prevHits = prevHitsValue ? parseInt(prevHitsValue) : 0;
    const currentHits = prevHits + 1;
    await client.set('hits', currentHits);

    res.status(200).send({
        hits: currentHits,
    });
})

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
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    log('redis client connected');

    const httpServer = app.listen(port, () => {
        log(`Example app listening on port ${port}`)
    });

    app.close = () => httpServer.close();
})();

module.exports = app;

// process.on('uncaughtException', (err) => {
//     log('got uncaughtException:', err);
// });

// process.on('unhandledRejection', (err) => {
//     log('got unhandledRejection:', err);
// });

// const signals = [
//     'SIGABRT',
//     'SIGALRM',
//     'SIGBUS',
//     'SIGCHLD',
//     'SIGCONT',
//     'SIGFPE',
//     'SIGHUP',
//     'SIGINT',
//     'SIGIO',
//     'SIGIOT',
//     'SIGILL',
//     'SIGPIPE',
//     'SIGPOLL',
//     'SIGPROF',
//     'SIGPWR',
//     'SIGQUIT',
//     'SIGSEGV',
//     'SIGSTKFLT',
//     'SIGSYS',
//     'SIGTERM',
//     'SIGTRAP',
//     'SIGTSTP',
//     'SIGTTIN',
//     'SIGTTOU',
//     'SIGUNUSED',
//     'SIGURG',
//     'SIGUSR1',
//     'SIGUSR2',
//     'SIGVTALRM',
//     'SIGWINCH',
//     'SIGXCPU',
//     'SIGXFSZ',
//     'SIGBREAK',
//     'SIGLOST',
//     'SIGINFO',
//     // 'SIGKILL',
//     // 'SIGSTOP',
// ];

// process.stdin.resume();
// signals.forEach(signal => {
//     process.on(signal, () => {
//         log(`got ${signal} signal, exiting..`);
//         process.exit(0);
//     });
// })

function log(...args) {
    console.log(`[${new Date().toISOString()}] [index]`, ...args);
}
