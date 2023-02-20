var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.header('Target-URL');
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        console.log(targetURL)
        console.log(req.method)
        console.log(req.body)
        function isEmpty(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
            return JSON.stringify(obj) === JSON.stringify({});
        }
        if (isEmpty(req.body)) {
            request({
                url: targetURL, method: req.method, headers: {
                    'Authorization': req.header('Authorization'),
                }
            },
                function (error, response, body) {
                    if (error) {
                        console.error('error: ' + error)
                    }
                }).pipe(res);
        } else {
            request({
                url: targetURL, method: req.method, json: req.body, headers: {
                    'Authorization': req.header('Authorization'),
                }
            },
                function (error, response, body) {
                    if (error) {
                        console.error('error: ' + error)
                    }
                }).pipe(res);
        }
    }

});

app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});