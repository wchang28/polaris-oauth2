var crypto = require('crypto');

module.exports = function(secret) {
	var cipherType = 'aes256';
	this.encrypt = function(phrase) {
		var cipher = crypto.createCipher(cipherType, secret);
		var encrypted = cipher.update(phrase, 'utf8', 'base64');
		encrypted += cipher.final('base64');
		return encrypted;
	};
	this.decrypt = function(encrypted) {
		var decipher = crypto.createDecipher(cipherType, secret);
		var decrypted = decipher.update(encrypted, 'base64', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	};
};