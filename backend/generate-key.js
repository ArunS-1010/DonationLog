// generate-key.js
const crypto = require('crypto')

// Generate a 256-bit (32-byte) key and convert it to a hexadecimal string
const key = crypto.randomBytes(32).toString('hex')

console.log(`Your secret key is: ${key}`)
