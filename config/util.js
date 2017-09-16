'use strict';

var request = require('request');

/**
* Send GET request to given URL, validate response
*
* @param {String} url
* @param {Object} options
* @param {Function} callback
*/

exports.getRequest = function(url, options, callback){
    var result = {};

    if(!url || typeof url !== 'string')
        return callback(result);

    options = options || {};

    options.url = url;
    options.strictSSL = false;

    request.get(options, function (error, response, body) {
        if(error)
            console.error(error);
        
        try {
            result = JSON.parse(body);
        } catch (e) {
            console.error(e);
        }

        callback(result);
    })
};