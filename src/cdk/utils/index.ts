import * as crypto from 'crypto';

export const createUniqueId = (id: string) => {
  const hash =  crypto.createHash('sha256').update(id).digest('hex');
  const uniqueId = hash.slice(0, 6);
  return `-${uniqueId}`;
}