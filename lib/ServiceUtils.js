/**
 * Created by Ewang on 2014/11/2.
 */

var getBodyAsJSON = function (response, body) {
    var data = null;

    if (!response) {
        data = {error: "404 error"};
    } else if (response && response.statusCode !== 200) {
        // error
        data = {error: "500 internal error reported by remote server"};
    } else {
        try {
            data = JSON.parse(body);
        } catch (e) {
            // error with JSON
            logger.error('Invalid response JSON', body);
            data = {error: "Invalid response JSON"};
        }
    }
    return data;
};

/**
 * Default callback parses the result as JSON and returns it in the response.
 * @param res
 * @returns {Function}
 */
var defaultCallback = function (res, error, response) {
    //return function (error, response, body) {
        if (error) {
            logger.error('Error executing request.', error);
            res.json({error: "Unexpected error with request."});
            return;
        }
        res.json(getBodyAsJSON(response, body));
    //};
};

module.exports.defaultCallback = defaultCallback;