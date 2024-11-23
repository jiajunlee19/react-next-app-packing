// This script can be used to generate a hashed key by running "npm run hash"

import bcrypt from 'bcryptjs';

export const yourHashedKeys = [
  {
    yourHashedKey: await bcrypt.hash('12345678', 10),
  }
]

console.log(yourHashedKeys)