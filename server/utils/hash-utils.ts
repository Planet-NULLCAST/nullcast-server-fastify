import crypto from 'crypto';


export function createRandomBytes(length?: number) {
  return crypto.randomBytes(length || 80).toString('hex').slice(0, length ||10);
}

export function createHash(text: string, salt: string) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(text);

  return {
    salt,
    password: hash.digest('hex')
  };

}
