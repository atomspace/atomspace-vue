module.exports = function () {
	return function (neutrino) {
		neutrino.config.module
			.rule('pug')
			.test(/\.pug$/)
				.oneOf('pug-vue') // this applies to `<template lang="pug">` in Vue components
					.resourceQuery(/^\?vue/)
					.use('pug-loader')
						.loader(require.resolve('pug-plain-loader'))
						.end()
					.end()
				.oneOf('pug-template') // this applies to `*.pug` imports inside JavaScript
					.use('raw')
						.loader(require.resolve('raw-loader'))
						.end()
					.use('pug-loader')
						.loader(require.resolve('pug-plain-loader'))
						.end()
					.end();
	};
};