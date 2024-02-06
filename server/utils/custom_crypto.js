
//
const crypto = require('crypto');
//

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const keyVaultUrl = "https://mongokeyvault24.vault.azure.net/";

const credential = new DefaultAzureCredential();
const client = new SecretClient(keyVaultUrl, credential);

async function getSecret(secretName) {

    try {
        const secret = await client.getSecret(secretName);
        console.log(`Your secret value is: ${secret.value}`);
    } catch (error) {
        console.error("Error retrieving secret:", error.message);
    }
}

async function setSecret(secretName, secretValue) {
    
    try {
        // Set a secret in Azure Key Vault
        const result = await client.setSecret(secretName, secretValue);
        //
        console.log("Setting a secret in Azure Key Vault...");
        //
        console.log("Secret set: ", result);
    } catch (error) {
        console.error("Error setting secret: ", error.message);
    }
}

//
function encrypt(text) {
    const algorithm = 'aes-256-cbc';
    const password = 'Encryption-password'; // Replace with your password
    const key = crypto.scryptSync(password, 'salt', 32); // Use a secure salt and synchronous method

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

//
function decrypt(encryptedObject) {
    const algorithm = 'aes-256-cbc';
    const password = 'Encryption-password'; // Must be the same as in the encrypt function
    const key = crypto.scryptSync(password, 'salt', 32); // Use the same salt and key derivation

    const iv = Buffer.from(encryptedObject.iv, 'hex');
    const encryptedText = Buffer.from(encryptedObject.encryptedData, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {encrypt, decrypt, getSecret, setSecret};