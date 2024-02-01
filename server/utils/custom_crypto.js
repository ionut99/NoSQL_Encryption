
//
const crypto = require('crypto');
// modul crypto 

// azure key vault

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const keyVaultUrl = "https://mongokeyvault24.vault.azure.net/";

const credential = new DefaultAzureCredential();
const client = new SecretClient(keyVaultUrl, credential);
/*

// Use like this
const vaultName = "mongokeyvault24"; 
const keyName = "first-test-key"; 
const keyVaultUrl = `https://${vaultName}.vault.azure.net`;
const keyIdentifier = "https://mongokeyvault24.vault.azure.net/keys/first-test-key/3bfc37dc5063430b9b48996aa318fe78";



// Azure credentials - DefaultAzureCredential expects AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET environment variables
const credential = new DefaultAzureCredential();

// KeyClient is used to interact with the keys in the Key Vault
const keyClient = new KeyClient(keyVaultUrl, credential);

// function to get key from Azure Cloud Vault
async function getKey(vaultName, keyName) {
    const credential = new DefaultAzureCredential();
    const url = `https://${vaultName}.vault.azure.net`;
    const client = new KeyClient(url, credential);

    try {
        const keyBundle = await client.getKey(keyName);
        return keyBundle;
    } catch (err) {
        console.error("Error retrieving key from Azure Key Vault:", err);
        throw err;
    }
}
//


async function getKeyProperties() {
    
    try {
    // Retrieving the properties of the existing keys in that specific Key Vault.
    console.log(await client.listPropertiesOfKeys().next());
    } catch (error) {
    console.log("Authentication Failed", error.message);
    }
}
*/

async function getSecret(secretName) {

    try {
        const secret = await client.getSecret(secretName);
        console.log(`Your secret value is: ${secret.value}`);
    } catch (error) {
        console.error("Error retrieving secret:", error.message);
    }
}

async function setSecret(secretName, secretValue) {
    console.log("Setting a secret in Azure Key Vault...");

    try {
        // Set a secret in Azure Key Vault
        const result = await client.setSecret(secretName, secretValue);
        console.log("Secret set: ", result);
    } catch (error) {
        console.error("Error setting secret: ", error.message);
    }
}



/*
async function decryptData(encryptedData) {
    // Get the key we are going to use
    const key = await keyClient.getKey(keyName);

    // Create a new CryptographyClient
    const cryptoClient = new CryptographyClient(key.id, credential);

    // Decrypt the data
    const decryptResult = await cryptoClient.decrypt("RSA1_5", encryptedData);
    return Buffer.from(decryptResult.result).toString();
}
*/

/*
(async () => {
    try {
        const dataToEncrypt = "Hello, world!";
        const encrypted = await encryptData(dataToEncrypt);
        console.log("Encrypted:", encrypted.toString('base64'));

        const decrypted = await decryptData(encrypted);
        console.log("Decrypted:", decrypted);
    } catch (error) {
        console.error("Error:", error);
    }
})();
*/

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