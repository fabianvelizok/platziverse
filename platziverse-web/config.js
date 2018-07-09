'use strict'

const config = {
  endpoint: process.env.API_ENDPOINT || 'http://localhost:3000',
  token: process.env.API_TOKEN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBsYXR6aSIsImFkbWluIjp0cnVlLCJwZXJtaXNzaW9ucyI6WyJtZXRyaWNzOnJlYWQiXSwiaWF0IjoxNTMxMTA0MjUyfQ.iK5XxHhFPllO0V7bhXiexemZo_-b67esRg9EA17S7k8'
}

module.exports = config
