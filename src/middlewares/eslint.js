let deepmerge = require('deepmerge');

module.exports = function () {
	return function (neutrino) {
		let lintRule = neutrino.config.module.rules.get('lint');
		let vueVersion = neutrino.getDependencyVersion('vue').version;

		if (lintRule) {
			lintRule.use('eslint')
				.tap(options => {
					let vueFeaturesRule = options.baseConfig && options.baseConfig.rules && options.baseConfig.rules['vue/no-unsupported-features'];

					if (vueFeaturesRule instanceof Array) {
						vueFeaturesRule[1].version = vueVersion;
					}
					else if (typeof vueFeaturesRule === 'string') {
						vueFeaturesRule = [vueFeaturesRule, {
							version: vueVersion
						}];
					}

					if (vueFeaturesRule) {
						options.baseConfig.rules['vue/no-unsupported-features'] = vueFeaturesRule;
					}

					return options;
				})
				.tap(options => deepmerge(options, {
					baseConfig: {
						env: {
							browser: true,
							commonjs: true
						}
					}
				}));
		}
	};
};