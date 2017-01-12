var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');
var keys = rootPath + '/keys.txt';

module.exports = {
	root: rootPath,
	port: process.env.PORT || 59988,
    db: process.env.MONGOHQ_URL || 'rvocvp9adh6h3jd7jtqjdfq2j2@ds159988.mlab.com'
};
