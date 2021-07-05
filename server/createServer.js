const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const url = require('url')
const mime = require('../utils/mine');
const Resp = require('../utils/resp')
// const entry = require('./entry')
// const options = {
//     key: fs.readFileSync(path.join(__dirname, '../../keys/key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, '../../keys/key-cert.pem'))
// }

const {
    handleError,
    handleSuccess,
} = Resp()


const directory = (pathname, location, req, res) => {
    fs.readdir(pathname, (error, files) => {
        const base = (location.pathname + '/').replace(/\/+/g, '/')
        if (error) {
            handleError(res, error)
        } else {
            let items = ['../'].concat(files.filter(n => !n.match(/^\./)))
            let html = items
                .map(name => '<a href="' + url.resolve(base, name) + '">' + name + '</a>')
                .join('</li><li>')
            handleSuccess(req, res, 'html', '<meta charset="utf-8"/> <ul><li>' + html + '</li></ul>')
        }
    })
}

const reqListener = (req, res) => {
    // 对路径解码，防止中文乱码
    const location = url.parse(decodeURIComponent(req.url))
    let fileRoot = path.resolve(__dirname, '../')
    let filePath = path.join(fileRoot, location.pathname)
    console.log(filePath)
    fs.stat(filePath, (error, stats) => {
        if (error) {
            res.writeHead(404, { "content-type": "text/html" });
            res.end("<h1>404 Not Found</h1>");
        } else if (!error && stats.isFile()) {
            console.log('========is a file')
            fs.readFile(filePath, 'utf-8', (err, data) => {
                handleSuccess(req, res, filePath, data)
            })
        } else if (!error && stats.isDirectory()) {
            fs.readdir(filePath, (error, files) => {
                if (error) {
                    console.log('===========error')
                } else {
                    console.log('========is a directory')
                    directory(filePath, location, req, res)
                }
            })
        }
        
    })
}

const createServer = port => {
    let server = http.createServer(reqListener).listen(port)
    return server
}

module.exports = createServer
