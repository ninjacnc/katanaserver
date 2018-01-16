var cluster = require('cluster'),
    express = require('express'),
    cors = require('cors'),
    path = require('path'),
    numCPUs = require('os').cpus().length,
    fs = require('fs'),
    multer = require('multer'),
    upload = multer({ dest: 'uploads/' }),
    ipaddress = 'http://127.0.0.1',
    port = process.argv[2] || 27001,
    potrace = require('potrace');

if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    for (var i = 0; i < numWorkers; i++) {
        var worker = cluster.fork({ WorkerName: "worker" + i });
    };

    cluster.on('exit', function (worker, code, signal) {
        console.log('-> Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('-> Starting a new worker');
        cluster.fork();
    });

    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        ipaddress = add;
        //console.log(ninja.setup(fs, ipaddress, port, numWorkers, process.pid));
    });
} else {
    var app = express();
    app.use(cors());

    app.get('/', function (req, res) {
        //ninja.getFile(fs, res, '../data/index.html', req, "");
    });

    app.get('/upload', function (req, res) {
        //ninja.getFile(fs, res, '../data/index.html', req, "");
    });

    app.post('/upload', upload.array('file', 1), function (req, res, next) {
        var image_type = req.files[0].mimetype;
        if (image_type == 'image/jpeg' || image_type == 'image/png' || image_type == 'image/gif') {
            potrace.trace('./uploads/' + req.files[0].filename, function (err, svg) {
                if (err) throw err;
                fs.writeFileSync('./svg/' + req.files[0].filename + '.svg', svg);
                fs.unlinkSync('./uploads/' + req.files[0].filename);
                fs.readFile('./svg/' + req.files[0].filename + '.svg', function (err, data) {
                    if (err) throw err;
                    res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
                    res.end(data);
                    fs.unlinkSync('./svg/' + req.files[0].filename + '.svg');
                });
            });
            var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            //ninja.write2Log(fs, 'Process ' + process.pid + ' responded to request from: ' + ip.replace('::ffff:', ''));
        };
    });

    var server = app.listen(port, function () {
        //ninja.write2Log(fs, 'Process ' + process.pid + ' is listening to all incoming requests');
    });
};

