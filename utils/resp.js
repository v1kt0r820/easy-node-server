// @ts-check
const mime = require('mime')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const zlib = require('zlib')
// @ts-ignore
const pkg = require('../package.json')
const isText = pathname => {
    const type = mime.getType(pathname)
    return /\b(html?|txt|javascript|json)\b/.test(type)
}

const version = `${pkg.name} ${pkg.version}`

module.exports = () => {

    /**
     * @param {import('http').ServerResponse} resp
     * @param {Error} error
     */
    const handleError = (resp, error) => {
        resp.writeHead(500, {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Powered-By': version
        })
        resp.end("<h1>500 Server Error</h1>")
        return resp
    }

    const handleSuccess = (req, resp, pathname, data) => {
        const txt = isText(pathname)
        let header = {
            'Content-Type': mime.getType(pathname) + '; charset=utf-8',
            'Content-Encoding': 'utf-8',
            'X-Powered-By': version
        }
        console.log(txt)
        resp.writeHead(200, header)
        resp.end(data)
    }
    return {
        handleError,
        handleSuccess,
    }
}

const pathname_fixer = (str = '') => (str.match(/[^/\\]+/g) || []).join('/')
const pathname_dirname = (str = '') => (str.match(/[^/\\]+/g) || []).slice(0, -1).join('/')