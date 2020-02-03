var path = require('path');


/**
 * @param {Object} config
 * @return {Object}
 */
module.exports = function(config) {
	return {
		project: {
			name: 'tt',
			src: path.resolve(__dirname, 'src'),
			entry: path.resolve(__dirname, 'src/application.js')
		},
    platforms: {},
	};
};
