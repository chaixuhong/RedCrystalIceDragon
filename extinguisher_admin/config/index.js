const path = require('path');
const config = {
	image_upload_server: 'http://localhost:3000',
	mydb: {
		host: 'localhost',
		user: 'root',
		password: 'mimajiubugaosuni',
		database: 'extinguisher',
		port: '3306'
	},
	webport: 3000
};
module.exports = config;