'use strict';
//var http = require('http');
var url = require('url');
var fs = require('fs');
var tas = require('directory-list');
var dir;
var ignore = ["license", "makefile", "node_modules"];
var daten;
var ffmpeg = require('ffmpeg');
var ffmpegF = require('fluent-ffmpeg');
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser"); // parsing parameters
var express = require('express'); // routing
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var processWindows = require("node-process-windows");
var m3u8 = require('m3u8');
//var swaggerUi = require('swagger-ui-express'),
  //  swaggerDocument = require('./swagger.json');
var express1 = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
    var app1 = express();

/*router.listen(3000, "localhost", function () {
    console.log("");
    console.log("-------------------------------------------------------------");
    console.log("  Aufruf: http://localhost:3000/home/index.html");
    console.log("-------------------------------------------------------------");
});*/
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

/*var activeProcesses = processWindows.getProcesses(function (err, processes) {
    processes.forEach(function (p) {
        console.log("PID: " + p.pid.toString());
        console.log("MainWindowTitle: " + p.mainWindowTitle);
        console.log("ProcessName: " + p.processName);
    });
});*/
var getAllUsers = function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            next(err);
        } else {

            var dbo = db.db("my_db");
            dbo.collection("test").find({}).toArray(function (err, result) {
                if (err) throw err;
                res.json(result);
                console.log(result);
                console.log('Datenbank verbunden');
                db.close();
            });
            db.close();
        }
    });
};
var createUser = function (req, res, next) {

    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');

    // Connection URL
    const url = 'mongodb://localhost:27017';

    // Database Name
    const dbName = 'my_db';

    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        if (err) {
            next(err);
        } else {

            const db = client.db(dbName);

            insertDocuments(db, function () {  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<< bearbeiten
                res.json(client);
                client.close();
            });
        }
    });
};
const insertDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('test');
    // Insert some documents
    collection.insertMany([
        { a: 1 }, { a: 2 }, { a: 3 }
    ], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}

router.route('/users')
    .post(createUser)
    .get(getAllUsers);

/*router.route('/users/:userId')
    .get(getOneUser)
    .put(updateUser)
    .delete(deleteUser);

router.param('userId', getByIdUser);*/
app1.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app1.use('/api/v1', router);

app1.listen(3000);
module.exports = app1;

//test Git
/*
 * ***************************************************************
 * Hier werden die vom Server erreichbaren Ordnern defieniert    *
 * src : Frontend                                                *
 * videos: upload von User (mp4)                                 *
 * Encoded: Transcodierte Videos                                 *
 * ***************************************************************
 */
app.use(express.static('src'));
app.use(express.static('videos'));
/*
 * ***************************************************************
 * Server Starten
 * ***************************************************************
 */
server.listen(8080, "localhost");
app.get('/', function (req, res, next) {
    res.sendFile('./src', '/index.html');
    /*fs.readFile('./index.html', 'utf8', function (error, content) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
    });*/
    res.write(daten);
});

 /**************************************************************
 * Socket Einstellung                                          *
 * Kommunikation mit dem Client                                *
 * wichtig für die Benachrichtigung und FFMPEG Starten         *
 **************************************************************/
io.on('connection', function (socket) {
    console.log('client connected');
    socket.emit('message', 'Client Connecté');


    if (socket.on('join', function (message) {
        console.log(message);
    })) {
        console.log("Test Ok");
    };
    socket.on('message', function (message1) {
        console.log(message1);

         /***************************************************************
         * Transcoding Prozess                                          *
         * 1)Video abfragen (quelle einbinden)                          *
         * 2)Video transcodieren                                        *
         * 3)Video speichern                                            *
         * 4) Benachritigung zu dem Client schicken                     *
         ***************************************************************/
       
        

        try {
            /*  var playlist = fs.open('./videos/file.m3u8', 'w', function (err, file) {
                  if (err) throw err;
                  console.log('saved!');
              });
              var parser = m3u8.createStream();
              
              console.log(parser);
              console.log(parser.toString());
              var file = fs.createReadStream('./videos/file.m3u8');
              
              file.pipe(parser);
              var m3u = m3u8.M3U.create();
              m3u.addPlaylistItem({
                  duration: 10,
                  uri: 'file'
              });
              console.log(m3u);
  
              parser.on('item', function (item) {
                  // emits PlaylistItem, MediaItem, StreamItem, and IframeStreamItem
                  var duration = item.get('bandwidth');
                  item.set('uri', './videos/file.m3u8' + item.get('uri'));
                  var m3u = m3u8.M3U.create();
                  m3u.addPlaylistItem({
                      duration: 10,
                      uri: 'file'
                  });
                  m3u.items.PlaylistItem[2].set('discontinuity', true);
              });
              parser.on('m3u', function (m3u) {
                  // fully parsed m3u file
              });*/

            var process = new ffmpeg('./videos/test.mp4');

            /*****************************************************
             *                                                   *
             * 6 Prozesse als Video Quelle                       *
             *                                                   *
             * **************************************************/
            var process_SD = new ffmpegF('./videos/VID.mp4');
            var process_HD = new ffmpegF('./videos/VID.mp4');
            var process_SD_HLS = new ffmpegF('./videos/VID.mp4');
            var process_HD_HLS = new ffmpegF('./videos/VID.mp4');
            var process_SD_WebM = new ffmpegF('./videos/VID.mp4');
            var process_HD_WebM = new ffmpegF('./videos/VID.mp4');

           
            dev_SD(process_SD)
                .then(function (json1) {
                    console.log("Stufe 1 >>>>>>>>>>>>>>>:" + json1);
                    dev_HD(process_HD)
                        .then(function (json2) {
                            console.log("Stufe 2 >>>>>>>>>>>>>>>:" + json2);
                            dev_SD_HLS(process_SD_HLS)
                                .then(function (json3) {
                                    console.log("Stufe 3 >>>>>>>>>>>>>>>:" + json3);
                                    dev_HD_HLS(process_HD_HLS)
                                        .then(function (json4) {
                                            console.log("Stufe 4 >>>>>>>>>>>>>>>:" + json4);
                                            dev_SD_WebM(process_SD_WebM)
                                                .then(function (json5) {
                                                    console.log("Stufe 5 >>>>>>>>>>>>>>>:" + json5);
                                                    dev_HD_WebM(process_HD_WebM)
                                                        .then(function (json6) {
                                                            console("Stufe 6 >>>>>>>>>>>>>>>:" + json6);
                                                        });
                                                });
                                        });
                                });
                        });
                });
         
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
            socket.emit('err_catch', e.msg);
        }
    });

socket.on('err_sd', function (message) {
        console.log(message);
    });
socket.on('err_hd', function (message) {
    console.log(message);
});
socket.on('err_fhd', function (message) {
    console.log(message);
    });

function dev_FHD(process) {
    return new Promise((resolve, reject) => {
        process.then(function (video) {
            daten = video.metadata;
            console.log(video.metadata);
            console.log('Das Video ist bereit transcodiert zu werden (Full HD)');
            video.setVideoFormat('mp4') // Format OK!!
                .setVideoCodec('h264')  // VideoCodec OK !!
                //.setVideoBitRate(520)
                .setAudioCodec('mp3')   //AudioCodec OK !!
                .setVideoFrameRate(25) //Frame OK !!
                .setVideoAspectRatio('16:9')  // Ratio OK  !!
                .setVideoSize('1980x720', true, true)   // Size  OK  !!

                .save('./Encoded/test_FULL_HD.mp4', function (error, file) {
                    if (!error) {
                        console.log('Video file: ' + file);


                        socket.emit('video_fhd', 'Das Video wurde transcodiert (Full HD Qualität)');
                        resolve("fertig ++++++++");
                    } else {
                        if (error == "stderr maxBuffer exceeded") {
                            console.log('ERROR_FHD but FFMPEG still processing: ' + error);

                            var isReadfile = fs.readFile('C:/Users/User/source/repos/Regiotainment/regio_test/Encoded/test_FULL_HD.mp4/', 'utf8', function (err, dat) {
                                if (err) {
                                    console.log(err)
                                    return false
                                } else
                                    console.log(dat)
                                return true

                            })
                            while (isReadfile == false) {
                                isReadfile = fs.readFile('C:/Users/User/source/repos/Regiotainment/regio_test/Encoded/test_FULL_HD.mp4', function (err, dat) {
                                    if (err) {
                                        console.log(err)
                                        return false
                                    } else
                                        console.log(dat)
                                    return true

                                })

                            }


                            /*var activeProcesses = processWindows.getProcesses(function (err, processes) {
                             * processes.forEach(function (p) {
                             * console.log("PID: " + p.pid.toString());
                             * console.log("MainWindowTitle: " + p.mainWindowTitle);
                             * console.log("ProcessName: " + p.processName);
                             * });
                             * });*/} else {
                            console.log('ERROR_FHD: ' + error);
                            socket.emit('err_fhd', JSON.stringify(error));///// error muss zu dem Client geschickt werden !!!!!!
                            resolve("fertig ++++++++")
                        }

                    }
                });
        }, function (erro) {
            console.log('Error_Hd: ' + erro);
            socket.emit('err_hd', JSON.stringify(erro));
        })
        });

    };

            /*****************************************************
             *                                                   *
             * MP4 SD Video Erstellen                            *
             *                                                   *
             * **************************************************/
       
     function dev_SD(proces) {
        return new Promise((resolve, reject) => {
           
            proces.videoCodec('libx264')
                .audioCodec('libmp3lame')
                .size('640x480')
                .aspect('16:9')
                .fps(25)
                .on('start', function (commandLine) {
                    console.log('Spawned Ffmpeg with command: ' + commandLine);
                })
                .on('progress', function (progress) {
                    console.log('Processing MP4_SD: ' + progress.percent + '% done');
                    socket.emit('Proc_mp4_sd', progress.percent + '% done');
                })
                .on('stderr', function (stderrLine) {
                    console.log('Stderr output: ' + stderrLine);
                })
                .on('error', function (err, stdout, stderr) {
                    console.log('Cannot process video: ' + err.message);
                    socket.emit('error_mp4_sd', err.message);
                })
                .on('end', function (stdout, stderr) {
                    console.log('Transcoding succeeded !');
                    socket.emit('video_mp4_sd', '100% Done');
                    socket.emit('fertig_mp4_sd', 'OK');
                    resolve("fertig_dev_sd");
                })
                .save('./Encoded/mp4/outputSD.mp4');
           
        });
    };
             
    
            /*****************************************************
             *                                                   *
             * HD Video Erstellen MP4                            *
             *                                                   *
             * **************************************************/

     function dev_HD(proces) {
     
        return  new Promise((resolve, reject) => {
            
            proces.videoCodec('libx264')
                    .audioCodec('libmp3lame')
                    .size('1280x720')
                    .aspect('16:9')
                    .fps(25)
                    .on('start', function (commandLine) {
                        console.log('Spawned Ffmpeg with command: ' + commandLine);
                    })
                    .on('progress', function (progress) {
                        console.log('Processing MP4_HD: ' + progress.percent + '% done');
                        socket.emit('Proc_mp4_hd', progress.percent + '% done');
                    })
                    .on('stderr', function (stderrLine) {
                        console.log('Stderr output: ' + stderrLine);
                    })
                    .on('error', function (err, stdout, stderr) {
                        console.log('Cannot process video: ' + err.message);
                        socket.emit('error_mp4_hd', err.message);
                    })
                    .on('end', function (stdout, stderr) {
                        console.log('Transcoding succeeded !');
                        socket.emit('video_mp4_hd', '100% Done');
                        socket.emit('fertig_mp4_hd', 'OK');
                        resolve("fertig_dev_hd");
                    })
                .save('./Encoded/mp4/outputHD.mp4');
           

            
        });

    };

            /*****************************************************
             *                                                   *
             * HLS SD Video Erstellen                            *
             *                                                   *
             * **************************************************/
     function dev_SD_HLS(processF) {
        return  new Promise((resolve, reject) => {
           
                processF.videoCodec('libx264')
                    .audioCodec('libmp3lame')
                    .format('mpegts')
                    .size('640x480')
                    .aspect('16:9')
                    .fps(25)
                    .on('start', function (commandLine) {
                        console.log('Spawned Ffmpeg with command: ' + commandLine);
                    })
                    .on('progress', function (progress) {
                        console.log('Processing HLS_SD: ' + progress.percent + '% done');
                        socket.emit('Proc_hls_sd', progress.percent + '% done');
                    })
                    .on('stderr', function (stderrLine) {
                        console.log('Stderr output: ' + stderrLine);
                    })
                    .on('error', function (err, stdout, stderr) {
                        console.log('Cannot process video: ' + err.message);
                        socket.emit('error_hls_sd', err.message);
                    })
                    .on('end', function (stdout, stderr) {
                        console.log('Transcoding succeeded !');
                        socket.emit('video_hls_sd', '100% Done');
                        socket.emit('fertig_hls_sd', 'OK');
                        resolve("fertig_sd_hls");
                    })
                    .save('./Encoded/HLS/output_SD.ts');
                
        });

    };

            /*****************************************************
             *                                                   *
             * HLS HD Video Erstellen                            *
             *                                                   *
             * **************************************************/
    function dev_HD_HLS(processF) {
        return new Promise((resolve, reject) => {
           
           
            processF.videoCodec('libx264')
                .audioCodec('libmp3lame')
                .format('mpegts')
                .size('1280x720')
                .aspect('16:9')
                .fps(25)
               .on('start', function (commandLine) {
                    console.log('Spawned Ffmpeg with command: ' + commandLine);
                })
                .on('progress', function (progress) {
                    console.log('Processing HLS_HD: ' + progress.percent + '% done');
                    socket.emit('Proc_hls_hd', progress.percent + '% done');
                })
                .on('stderr', function (stderrLine) {
                    console.log('Stderr output: ' + stderrLine);
                })
                .on('error', function (err, stdout, stderr) {
                    console.log('Cannot process video: ' + err.message);
                    socket.emit('error_hls_hd', err.message);
                })
                .on('end', function (stdout, stderr) {
                    console.log('Transcoding succeeded !');
                    socket.emit('video_hls_hd', '100% Done');
                    socket.emit('fertig_hls_hd', 'OK');
                    resolve("fertig_hd_hls");
                })
                .save('./Encoded/HLS/output_HD.ts');
            
        });

    }

            /*****************************************************
             *                                                   *
             * WebM SD Video Erstellen                           *
             *                                                   *
             * **************************************************/
     function dev_SD_WebM(processF) {
        return  new Promise((resolve, reject) => {
           
                processF.videoCodec('libvpx-vp9')
                    .audioCodec('opus')
                    .format('webm')
                    .size('640x480')
                    .aspect('16:9')
                    .fps(25)
                    .on('start', function (commandLine) {
                        console.log('Spawned Ffmpeg with command: ' + commandLine);
                    })
                    .on('progress', function (progress) {
                        console.log('Processing WebM_SD: ' + progress.percent + '% done');
                        socket.emit('Proc_webm_sd', progress.percent + '% done');
                    })
                    .on('stderr', function (stderrLine) {
                        console.log('Stderr output: ' + stderrLine);
                    })
                    .on('error', function (err, stdout, stderr) {
                        console.log('Cannot process video: ' + err.message);
                        socket.emit('error_webm_sd', err.message);
                    })
                    .on('end', function (stdout, stderr) {
                        console.log('Transcoding succeeded !');
                        socket.emit('video_webm_sd', '100% Done');
                        socket.emit('fertig_webm_sd', 'OK');
                        resolve("fertig");
                    })
                .save('./Encoded/WebM/output_SD.webm');
         
        });

    };

            /*****************************************************
             *                                                   *
             * WebM HD Video Erstellen                            *
             *                                                   *
             * **************************************************/
    function dev_HD_WebM(processF) {
        return new Promise((resolve, reject) => {
          
             
            processF.videoCodec('libvpx-vp9')
                .audioCodec('opus')
                .format('webm')
                .size('1280x780')
                .aspect('16:9')
                .fps(25)
               .on('start', function (commandLine) {
                    console.log('Spawned Ffmpeg with command: ' + commandLine);
                })
                .on('progress', function (progress) {
                    console.log('Processing WebM_HD: ' + progress.percent + '% done');
                    socket.emit('Proc_webm_hd', progress.percent + '% done');
                })
                .on('stderr', function (stderrLine) {
                    console.log('Stderr output: ' + stderrLine);
                })
                .on('error', function (err, stdout, stderr) {
                    console.log('Cannot process video: ' + err.message);
                    socket.emit('error_webm_hd', err.message );
                })
                .on('end', function (stdout, stderr) {
                    console.log('Transcoding succeeded !');
                    socket.emit('video_webm_hd', '100% Done');
                    socket.emit('fertig_webm_hd', 'OK');
                    resolve("fertig");
                })
                .save('./Encoded/WebM/output_HD.webm');
            
         
        });

    }
});



 

/********************************************

fs.readFile('C:/Users/User/source/repos/regio_test/regio_test/videos/package-lock.json/', 'utf8', function (err, dat) {
    if (err) {
        console.log(err)
    } else
        //console.log(dat)
        daten = dat;
});
var server = http.createServer(function (req, res) {
    fs.readFile('./index.html', 'utf8', function (error, content) {
        res.writeHead(200, {"Content-Type": "text/html" });
        res.end(content);
    });
});*/

   
    
function getFile(pfad, daten) {
    try {
    
        tas.list(pfad, false, function (files) {
            console.log(pfad);
            //if (fs.existsSync(pfad)) {
                files.forEach(function (item) {
                    var split = item.split(".");
                    // var  path = pfad.toString() + "\\" + item.toString();
                    
                    if (split[1] == "json" || split == "xml") {
                        var doc = pfad +"/"+ item;
                       // fs.readFile(pfad+"/" + item, 'utf8', function (err, data) {
                        fs.readFile(doc, 'utf8', function (err, data) {
                            //daten = JSON.parse(data);
                            
                            daten = data;
                            if (err) throw err;
                        });
                   } 

                });
           // }
        });
    } catch(expt){
        console.log(expt);
    }
}