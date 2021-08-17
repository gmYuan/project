const os = require('os')
const path = require('path')
const fs = require('fs')

const home = process.env.HOME || os.homedir()
const dbPath = path.join(home, './todo')
console.log('home2', dbPath)


const db = {
  read(path = dbPath) {
    return new Promise( (resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (err1, data) => {
        if (err1) {
          return reject(err1)
        }
        let list
        try {
          list = JSON.parse(data.toString())
        } catch(err2) {
         list = []
        }
        resolve(list)
      })
    })
  },

  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      fs.writeFile(path, string + '\n', (err) => {
        if (err)  return reject(err)
        resolve()
      })
    })
   
  }

}

module.exports = db