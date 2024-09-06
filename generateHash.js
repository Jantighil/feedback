const crypto = require('crypto');

function generateHash(script) {
  const hash = crypto.createHash('sha256');
  hash.update(script);
  return `sha256-${hash.digest('base64')}`;
}

const script = `
  // Your inline script here
  console.log('Hello, world!');
`;

console.log(generateHash(script));
