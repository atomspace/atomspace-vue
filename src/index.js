let path = require('path');
let fs = require('fs');

let deepmerge = require('deepmerge');
let less = require('neutrino-middleware-less-loader');
let sass = require('neutrino-middleware-sass-loader');
let web = require('@neutrinojs/web');
let vue = require('@constgen/neutrino-vue-loader');
let image = require('@constgen/neutrino-image-loader');
let svg = require('@constgen/neutrino-svg-loader');
let progress = require('@constgen/neutrino-progress');
let revision = require('@constgen/neutrino-revision');
let staticFiles = require('@constgen/neutrino-static-files');
let analysis = require('@constgen/neutrino-analysis');
let env = require('@constgen/neutrino-env');
let vueLauncher = require('@constgen/neutrino-vue-launcher');
let mode = require('@constgen/neutrino-mode');
let sourcemap = require('@constgen/neutrino-sourcemap');
let optimization = require('@constgen/neutrino-optimization');

let clean = require('./middlewares/clean');
let eslint = require('./middlewares/eslint');
let pug = require('./middlewares/pug-loader');

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		let projectNodeModulesPath = path.resolve(process.cwd(), 'node_modules');
		let faviconPath = path.resolve(neutrino.options.source, 'favicon.ico');
		let faviconExists = fs.existsSync(faviconPath);
		let { name, version } = neutrino.options.packageJson;
		let appName = `${name} ${version}`;
		let defaultSettings = {
			launcher: true,
			compiler: false,
			open: false,
			server: {
				port: 8080,
				public: true,
				https: false,
				proxy: {}
			},
			sourcemaps: true,
			title: appName,
			polyfills: false,
			browsers: customSettings.browsers ? [] : [
				'last 2 Chrome major versions',
				'last 2 Firefox major versions',
				'last 2 Edge major versions',
				'last 2 Opera major versions',
				'last 2 Safari major versions',
				'last 2 iOS major versions',
				'ie 11'
			]
		};
		let settings = deepmerge(defaultSettings, customSettings);
		let webSettings = {
			publicPath: '/',
			hot: true,
			devServer: {
				open: settings.open,
				hot: true,
				port: settings.server.port,
				host: settings.server.public ? '0.0.0.0' : 'localhost',
				https: settings.server.https,
				proxy: settings.server.proxy,
				serveIndex: true,
				useLocalIp: settings.server.public,
				quiet: false,
				noInfo: false
			},
			html: {
				title: settings.title,
				favicon: faviconExists ? faviconPath : '',
				meta: {
					'X-UA-Compatible': { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge' }
				}
			}
		};
		let vueSettings = {
			browsers: settings.browsers,
			polyfills: settings.polyfills
		};

		neutrino.use(mode());
		neutrino.use(web(webSettings));
		neutrino.use(less());
		neutrino.use(sass());
		neutrino.use(vue(vueSettings));
		if (settings.launcher) neutrino.use(vueLauncher());
		neutrino.use(clean());
		neutrino.use(image());
		neutrino.use(svg());
		neutrino.use(pug());
		neutrino.use(progress({ name: settings.title }));
		neutrino.use(sourcemap({ prod: settings.sourcemaps }));
		neutrino.use(revision());
		neutrino.use(staticFiles());
		neutrino.use(env());
		neutrino.use(analysis());
		neutrino.use(optimization());
		neutrino.use(eslint());

		let developmentMode = neutrino.config.get('mode') === 'development';

		neutrino.config
			.name(settings.title)
			.node
				.set('Buffer', false)
				.set('process', 'mock')
				.set('setImmediate', false)
				.end()
			.output
				.filename('compiled/[name].[contenthash:8].js')
				.when(developmentMode, function (output) {
					output.filename('[name].js');
				})
				.end()
			.resolve
				.alias
					.set('@', path.resolve(process.cwd(), 'src'))
					.set('vue$', path.resolve(path.join(projectNodeModulesPath, 'vue/dist/vue.runtime.esm.js')))
					.when(settings.compiler, function (alias) {
						alias.set('vue$', path.resolve(path.join(projectNodeModulesPath, 'vue/dist/vue.esm.js')));
					})
					.end()
				.end()
			.module
				.noParse(/^(vue|vue-router|vuex|vuex-router-sync)$/)
				.rule('font')
					.use('file')
						.tap(options => Object.assign({}, options, {
							outputPath: 'fonts',
							name: '[name].[hash:8].[ext]'
						}))
						.when(developmentMode, function (use) {
							use.tap(options => Object.assign({}, options, {
								outputPath: undefined,
								name: '[path][name].[ext]'
							}));
						})
						.end()
					.end()
				.when(neutrino.config.module.rule('style').oneOf('normal').uses.get('extract'), function (module) {
					module
						.rule('style')
							.oneOf('normal')
								.use('extract')
									.tap((options = {}) => deepmerge(options, { esModule: false }))
									.end()
								.end()
							.end();
				})
				.end()
			.when(neutrino.config.plugins.get('extract'), function (config) {
				config.plugin('extract')
					.set('args', [{
						filename: 'compiled/[name].[contenthash:8].css',
						ignoreOrder: true
					}])
					.when(developmentMode, function (plugin) {
						plugin.set('args', [{
							filename: '[name].css'
						}]);
					})
					.end();
			});
	};
};