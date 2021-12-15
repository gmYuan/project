import * as http from 'http'
import {IncomingMessage, ServerResponse} from 'http'

const server = http.createServer()
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  console.log('request Method:', request.method)
  console.log('request URL:', request.url)
  console.log('request Header:', request.headers)

  let res = []
  request.on('data', (chunk) => {
    res.push(chunk)
  })

  request.on('end', () => {
    const body = Buffer.concat(res).toString()
    console.log('body', body)

    response.end('hi')
  })
  
})

server.listen(8888)