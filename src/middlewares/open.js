let webpackDevServerWaitpage = require('webpack-dev-server-waitpage');

let WebpackDevServerWaitpagePlugin = function(options){
	return webpackDevServerWaitpage.plugin(options)
}
console.log(new WebpackDevServerWaitpagePlugin())

module.exports = function () {
	return function (neutrino) {
		neutrino.config
			.devServer
				.merge({
					open: true,
					before (app, server) {
						app.use(webpackDevServerWaitpage(server, {
							title: neutrino.config.get('name'),
							theme: 'dark',
							disableWhenValid: true
						}));
					}

					// onListening (server) {}
				})
				.end()
			.plugin('wait-page')
				.use(WebpackDevServerWaitpagePlugin)
				.end();
	};
};