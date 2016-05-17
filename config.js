exports.config = {
    server: {
        port: 9000
    },
    ci: {
        url: '127.0.0.1',
        port: 80,
        path: '/job/{job}/build',
        user: 'user',
        pwd: 'pwd'
    },
    token: 'token',
    android: {
        command: '!build',
        app_dev: 'androidapp_dev_build',
        app_staging: 'androidapp_staging_build',
        app_prod: 'androidapp_prod_build',
        sales_dev: 'androidsales_dev_build'
    },
    ios: {
        command: '!build',
        qa: 'ios_greatbuyer_qa',
        staging: 'ios_greatbuyer_staging',
	wx: 'ios_greatbuyer_release_wx',
        appstore: 'ios_greatbuyer_release_appstore'
    }
};
