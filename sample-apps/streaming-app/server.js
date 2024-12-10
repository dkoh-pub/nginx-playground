const express = require('express'); //npm i express
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3010;
const {exec} = require('child_process');

app.use(express.static('public'));

app.get('/video', (req, res) => {
    const filePath = path.join(__dirname, 'sample', 'sample.mp4');
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': (end - start) + 1,
            'Content-Type': 'video/mp4',
        });

        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
    } else {
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        });
        fs.createReadStream(filePath).pipe(res);
    }
});

const ffmpegScript = path.join(__dirname, 'sample', 'stream.sh');

var triggerFfmpeg = exec("sh " + ffmpegScript, (error, stdout, stderr) => {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on <http://localhost>:${PORT}`);
});