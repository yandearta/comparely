module.exports = {
    apps: [
        {
            name: 'nextjs-app',
            exec_mode: 'cluster',
            instances: 'max',
            script: './node_modules/next/dist/bin/next',
            args: `start -p ${process.env.PORT || 3000}`,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
