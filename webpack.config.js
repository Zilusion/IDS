const config = {
	mode: 'production',
	devtool: 'source-map',
	entry: {
		index: './src/js/index.js',
		avito: './src/js/avito.js',
	},
	output: {
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

module.exports = config;
