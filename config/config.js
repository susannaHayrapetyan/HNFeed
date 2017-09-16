var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = {};

config.production = {
    db:  {
        url: '',
        databaseName: '',
        options: {}
    },
    api: {
        url: 'https://hn.algolia.com/api/v1/'
    }
};

config.development = {
    db:  {
        url: 'mongodb://127.0.0.1:27017/',
        databaseName: 'HNFeedDB',
        options: { 
            useMongoClient: true,
            keepAlive: true
        }
    },
    api: {
        url: 'https://hn.algolia.com/api/v1/'
    }
};

module.exports = config[env];