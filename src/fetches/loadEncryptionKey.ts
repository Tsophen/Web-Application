/**
 * Loads an Encryption Key from the given Storage instance
 * 
 * @returns   Encryption Key
 */
const loadEncryptionKey = (storage: Storage): Promise<string> => {
  return new Promise((resolve, reject) => {
    let encryptionKey = storage.getItem("ek");

    if(!encryptionKey || encryptionKey === null)
      return reject();
    
    return resolve(encryptionKey);
  });
}

export default loadEncryptionKey;