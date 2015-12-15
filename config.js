exports.config = {
    server: {
        port: 9000
    },
    ci: {
        url: 'ci.example.com',
        path: '/job/{job}/build',
        user: 'user',
        pwd: 'password'
    },
    android: {
        command: '!build',
        dev: 'androidapp_dev_build',
        staging: 'androidapp_staging_build',
        prod: 'androidapp_prod_build'
    }
};
