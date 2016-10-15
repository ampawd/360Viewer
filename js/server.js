var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var port = 8080;

var appMainFileName = "index.html";
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "application/javascript",
    "css": "text/css"
};

http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname,
        fileName = path.join(process.cwd(), uri);

    fs.exists(fileName, function(exists) {
        if (!exists) {
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(fileName).isDirectory()) {
            fileName += '/' + appMainFileName;
        }

        fs.readFile(fileName, "binary", function(err, data) {
            if (err) {
                response.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                response.write(err + "\n");
                response.end();
                return;
            }

            var mimeType = mimeTypes[fileName.split(".")[1]];

            if (!mimeType) {
                mimeType = 'text/plain';
            }

            response.writeHead(200, {
                "Content-Type": mimeType
            });
            response.write(data, "binary");
            response.end();
        });
    });


}).listen(port);

console.log("listening on port: ", port);