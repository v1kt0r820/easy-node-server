// @ts-check
const createServer = require('./createServer')
const os = require('os')
const IP = require('../utils/IP')
const HOSTS = require('../utils/HOSTS')
const conf = require('../conf/conf')()
const { spawn } = require('child_process')
const H = {
  http: require('http'),
  https: require('https')
}
/**
 * 服务器启动，打开浏览器。
 */
const handelExplorer = (port = 3000, host = IP, open = false, init_urls = ['']) => {
  const protocol = port === 443 ? 'https' : 'http'
  const base = protocol + '://' + host + ':' + port
  const toPromise = renderPromise(H[protocol], base)
  console.log('waiting for start ...')
  Promise.all(init_urls.map(toPromise)).then(function () {
    console.log(`server start on ${base}`)
    open && spawn(os.type().match(/Windows/) ? 'explorer' : 'open', [base])
  }).catch(err => console.log(err))
}
/**
 * http请求转换为promise
 */
const renderPromise = (h, base) => (url) => new Promise((resolve, reject) => h.get(base + url, resolve).on('error', reject))
module.exports = ({
  port = conf.port,
  host = conf.host,
  open = false
}) => {
  if (host) {
    port = port || 80
    HOSTS(host)
  }
  if (port) {
    port = port | 0
  }
  createServer(3000)
  handelExplorer(port, host, open)
}