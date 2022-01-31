import crypto from 'crypto';
import brcypt from 'bcrypt';


export function createRandomBytes(length = 80) {
  return crypto.randomBytes(length).toString('hex').slice(0, 10);
}

export function createHash(text: string) {
  const salt = brcypt.genSaltSync(10);
  return  brcypt.hashSync(text, salt);
}

/**
 * @param text - Password provided from payload
 * @param hashedValue - hashedPassword from the DD
 * @returns true, if the password provided is correct
 */
export function verifyHash(text: string, hashedValue: string) {
  return brcypt.compareSync(text, hashedValue);
}
