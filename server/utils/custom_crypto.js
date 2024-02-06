
//
const crypto = require('crypto');
//

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const { Console } = require('console');

const keyVaultUrl = "https://mongokeyvault24.vault.azure.net/";

const credential = new DefaultAzureCredential();
const client = new SecretClient(keyVaultUrl, credential);


//getSecret("KVT-MESSAGE").catch((error) => console.log("Error:", error));
//setSecret("FirstSecretFromApp", "FirstSecretValue");


// Function to generate a random password for AES encryption
function generateRandomPassword(length) {
    return crypto.randomBytes(length).toString('hex');
  }


// return secret value from Azure Key Vault
async function getSecret(secretName) {

    try {
        const secret = await client.getSecret(secretName);
        //
        //console.log(`Your secret value is: ${secret.value}`);
        return secret.value;
        //
    } catch (error) {
        //
        console.error("Error retrieving secret:", error.message);
    }
}


// Insert a new secret value in Azure Key Vault
async function setSecret(secretName, secretValue) {
    
    try {
        // Set a secret in Azure Key Vault
        const result = await client.setSecret(secretName, secretValue.toString('hex'));
        //
        console.log("Setting a secret in Azure Key Vault...");
        //
        console.log("Secret set: ", result);
    } catch (error) {
        console.error("Error setting secret: ", error.message);
    }
}


//
function encrypt(text, encId) {

    try {
    const algorithm = 'aes-256-cbc';
    const password = generateRandomPassword(32);
    //
    const key = crypto.scryptSync(password, 'salt', 32); // Use a secure salt and synchronous method

    setSecret(encId, key); // save secret to Vault

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { uuid: encId, iv: iv.toString('hex'), encryptedData: encrypted };

    } catch (error) {
        console.error("Error setting secret: ", error.message);
    }
}

//
async function decrypt(encryptedObject) {

    const algorithm = 'aes-256-cbc';
      
    const iv = Buffer.from(encryptedObject.iv, 'hex');
   
    const encryptedText = Buffer.from(encryptedObject.encryptedData, 'hex');

    const key_brut = await getSecret(encryptedObject.uuid).catch((error) => console.log("Error:", error));
    const key = Buffer.from(key_brut, 'hex');
   
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    //
    return decrypted;
}

module.exports = {encrypt, decrypt, getSecret, setSecret};