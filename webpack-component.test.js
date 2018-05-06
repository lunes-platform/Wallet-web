// const LivereloadPlugin = require('webpack-livereload-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

//this is the directory of the target component to test
let targetComponent = __dirname+'/tests/components/index.js';
__webpack_public_path__ = '/';
module.exports = {
	mode: 'development',
	entry: targetComponent,
	output: {
		filename: 'test.bundle.js',
		path: __dirname+'/public/test/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules)/,
				query: {
					presets: ['es2015', 'env', 'react', 'stage-0']
				}
			}
		]
	},
	plugins: [
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 8000,
			server: {
				baseDir: ['./public/']
			}
		})
	],
	resolve: {
		alias: {
			Actions: __dirname+'/src/shared/actions/',
			Reducers: __dirname+'/src/shared/reducers',
			Containers: __dirname+'/src/shared/containers/',
			Components: __dirname+'/src/shared/components/',
			Stores: __dirname+'/src/shared/stores',
			Utils: __dirname+'/src/shared/utils',
			Shared: __dirname+'/src/shared/',
			Auth: __dirname+'/src/shared/auth/',
		}
	}
};