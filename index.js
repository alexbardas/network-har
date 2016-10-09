module.exports = (nightmare, params) => {
  nightmare = nightmare.waitForDevtools()

  ;['useragent', 'viewport', 'goto', 'wait'].forEach((value) => {
    if (!params.hasOwnProperty(value)) {
      return
    }
    let method = Array.isArray(params[value]) ? 'apply' : 'call'
    nightmare = nightmare[value][method](nightmare, params[value])
  })

  return nightmare.getHAR().end()
}
