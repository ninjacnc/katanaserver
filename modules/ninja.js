module.exports.answer = 'testing';

exports.setup = function (fs, ipaddress, port, numWorkers, pid) {
    var _output = '';

    _output = _output + "\n"
    _output = _output + "   888b    888 d8b             d8b             \n";
    _output = _output + "   8888b   888 Y8P             Y8P             \n";
    _output = _output + "   88888b  888                                 \n";
    _output = _output + "   888Y88b 888 888 88888b.    8888  8888b.     \n";
    _output = _output + "   888 Y88b888 888 888 '88b   '888     '88b    \n";
    _output = _output + "   888  Y88888 888 888  888    888 .d888888    \n";
    _output = _output + "   888   Y8888 888 888  888    888 888  888    \n";
    _output = _output + "   888    Y888 888 888  888    888 'Y888888    \n";
    _output = _output + "                               888             \n";
    _output = _output + "                             d88P              \n";
    _output = _output + "                            888P'              \n";
    _output = _output + "\n";
    _output = _output + "Katana SVG server started at\n  => " + ipaddress + ":" + port + "\n";
    _output = _output + "  => " + new Date().toLocaleString() + "\n";
    _output = _output + "Compile Date: 15th January 2018\n";
    _output = _output + "Version 1.0.2\n";
    _output = _output + "Process ID: " + pid + '\n';
    _output = _output + "No of workers: " + numWorkers + '\n';
    _output = _output + "  => CTRL + C to shutdown\n  => 'rs' to reboot\n";
    _output = _output + "\n";

    this.write2Log2(fs, "\r\n------------------------------------------------------------------------------------------");
    this.write2Log(fs, "Katana SVG server started at  => " + ipaddress + ":" + port + "\r\nProcess ID: " + process.pid + "\r\nNo of workers: " + numWorkers + "\r\n");

    return _output;
};

exports.write2Log = function (fs, info) {
    fs.open('../log/Ninja.log', 'a', 666, function (e, id) {
        fs.write(id, new Date().toLocaleString() + ': ' + info + '\r\n', null, 'utf8', function () {
            fs.close(id, function () { });
        });
    });
};

exports.write2Log2 = function (fs, info) {
    fs.open('../log/Ninja.log', 'a', 666, function (e, id) {
        fs.write(id, info + '\r\n', null, 'utf8', function () {
            fs.close(id, function () { });
        });
    });
};

exports.processFile = function (fs) {
    var z = '';
    fs.readFile('../data/ninja.dat', function (error, data) {
        var z = data;
    });
    return z;
};

exports.getFile = function (fs, response, filename, post, body) {
    fs.exists(filename, function (exists) {
        if (!exists) {
            display404(fs, response);
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '../data/index.html';

        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                display500(fs, response);
                return;
            }

            getDataFile(fs, response, filename, post, body);
        });
    });
};

function getDataFile(fs, response, filename, post, body) {
    fs.readFile(filename, 'utf-8', function (error, data) {
        response.writeHead(200, { 'content-type': 'text/html' });
        response.end(data.toString().replace('<#JSONDATA#>', body));
    });
};

function display404(fs, response) {
    fs.readFile('../systemfiles/404.html', function (error, data) {
        response.writeHead(404, { 'content-type': 'text/html' });
        response.end(data);
    });
};

function display500(fs, response) {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.write(err + "\n");
    response.end();
};