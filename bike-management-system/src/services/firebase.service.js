const firebaseAdmin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");
const { config } = require("../config");
const { v4 } = require("uuid");
const admin = require("firebase-admin");
const { RegexDownloadURL } = require("../constanst");
const serviceAccount = require("../config/firebase-credential.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: config.BUCKET_NAME,
});

async function storeFile(file) {
  try {
    const token = v4();
    const newFile = admin.storage().bucket(config.BUCKET_NAME).file(token);
    await newFile.save(file.buffer, {
      contentType: file.mimetype,
      gzip: true,
    });

    await newFile.setMetadata({
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    });
    return createPersistentDownloadUrl(
      newFile.bucket.name,
      newFile.name,
      token
    );
  } catch (error) {
    // throw new InternalServerErrorException();
  }
}

const createPersistentDownloadUrl = (bucket, pathToFile, downloadToken) => {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
    pathToFile
  )}?alt=media&token=${downloadToken}`;
};

getFileName = (downloadURL) => {
  if (RegexDownloadURL.test(downloadURL)) {
    const uuidv4Length = uuidv4().length;
    return downloadURL.slice(-uuidv4Length);
  }
  return "";
};

deleteAllFiles = () => {
  try {
    admin.storage().bucket().deleteFiles();
  } catch (e) {
    // throw new InternalServerErrorException();
  }
};
deleteFile = (name) => {
  try {
    admin.storage().bucket().file(name).delete();
  } catch (e) {
    // throw new InternalServerErrorException();
  }
};

module.exports = {
  storeFile,
};
