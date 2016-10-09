let program = require('commander')
let Nightmare = require('nightmare')
let harPlugin = require('nightmare-har-plugin')
let version = require('../package.json').version
let pick = require('../lib/pick')
let getHar = require('../index')
let config = require('../config.json')

let headers = {}
let help = 'Use --help to see the list of supported options.'

let toList = (acc, list, castFn) => acc.push(...list.map(castFn))
let toObj = (acc, list, castFn) => {
  acc[list[0]] = castFn(list[1])
  return acc
}

// Converts a cli option from string to a specified type.
// It splits the string using the given delimitator,
// casts it to a type using the given cast function
// and can add the value to an accumulator, making it possible
// to use the same option multiple times.
let parseOption = (option, accumulator, castFn, delim, convertTo, str) => {
  try {
    return convertTo(accumulator, str.split(delim), castFn)
  } catch (err) {
    console.error(`Error: invalid usage of ${option} option.`)
    console.error(help)
  }
}

program
  .version(version)
  .option('--header [string:string]', 'Add key value header to the initial request (default: not set)', parseOption.bind(null, 'header', headers, String, ':', toObj), {})
  .option('--retries [number]', 'Number of maximum retries in case of network errors (default: 2)', Number, 2)
  .option('--url <string>', 'Website url (required)')
  .option('--useragent [string]', 'Use specified user agent (default: not set)')
  .option('--viewport [number,number]', 'Resize viewport width and height (default: 375,667)', parseOption.bind(null, 'viewport', [], Number, ',', toList), [375, 667])
  .option('--wait [number]', 'Wait time in ms for page to load (default: 5000)', Number, 5000)
  .option('--wait [string]', 'Wait for element selector to be present (default: not set)')
  .parse(process.argv)

// Url is always required
if (!program.url) {
  console.error('Error: url option is required.')
  console.error(help)
  process.exit(1)
} else {
  program.goto = [program.url, headers]
}

// The network-har plugin needs to be installed before Nightmare is initialized
harPlugin.install(Nightmare)

let run = (retries = 0) => {
  let nightmare = Nightmare(Object.assign(harPlugin.getDevtoolsOptions(), config))
  getHar(nightmare, pick(program, ['useragent', 'goto', 'viewport', 'wait']))
    .then((result) => console.log(JSON.stringify(result)))
    .catch((error) => {
      if (retries > 0) {
        console.error('Error: ', error)
        console.error(`${retries} more ${retries > 1 ? 'retries' : 'retry'} available. Retrying ...`)
        run(retries - 1)
      } else {
        console.error('Error: ', error)
        process.exit(1)
      }
    })
}

run(program.retries - 1)
