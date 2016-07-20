import * as crypto from 'crypto';

export class AES256 {
	private static cipherType:string = 'aes256';
	constructor(private secret:string) {}
	encrypt (phrase:string) {
		var cipher = crypto.createCipher(AES256.cipherType, this.secret);
		var encrypted = cipher.update(phrase, 'utf8', 'base64');
		encrypted += cipher.final('base64');
		return encrypted;
	};
	decrypt (encrypted:string) {
		var decipher = crypto.createDecipher(AES256.cipherType, this.secret);
		var decrypted = decipher.update(encrypted, 'base64', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	};
}