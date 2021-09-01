import * as http from 'http'
import {IncomingMessage, ServerResponse} from 'http'

const server = http.createServer()
server.on('request', (request: IncomingMessage, response) => {
  console.log('request Method', request.method)
  response.end('hi')
})

server.listen(8888)