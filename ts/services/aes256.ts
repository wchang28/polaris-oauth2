import * as crypto from 'crypto';

export class AES256 {
	private static cipherType:string = 'aes256';
	constructor(private secret:string) {}
	encrypt (phrase:string) {
		let cipher = crypto.createCipher(AES256.cipherType, this.secret);
		let encrypted = cipher.update(phrase, 'utf8', 'base64');
		encrypted += cipher.final('base64');
		return encrypted;
	};
	decrypt (encrypted:string) {
		let decipher = crypto.createDecipher(AES256.cipherType, this.secret);
		let decrypted = decipher.update(encrypted, 'base64', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	};
}