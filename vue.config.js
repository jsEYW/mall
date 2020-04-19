module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'assets':'@/assets',
                'common':'@/common',
                'comoponents':'@/components',
                'network':'@/network',
                'views':'@/views',
            }
        }
    }
}