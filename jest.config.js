const defaultConfig = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...defaultConfig,
	setupFiles: [
		...( defaultConfig.setupFiles || [] ),
		'<rootDir>/tests/js/setup.js',
	],
	testMatch: [ '<rootDir>/tests/js/**/*.test.js' ],
	moduleNameMapper: {
		...( defaultConfig.moduleNameMapper || {} ),
		// Mock all @wordpress/* packages that aren't installed as real deps.
		// They're provided as globals by WP at runtime, but need mocks in tests.
		'@wordpress/block-editor':
			'<rootDir>/tests/js/mocks/block-editor.js',
		'@wordpress/blocks': '<rootDir>/tests/js/mocks/wp-blocks.js',
		'@wordpress/compose': '<rootDir>/tests/js/mocks/wp-compose.js',
		'@wordpress/data': '<rootDir>/tests/js/mocks/wp-data.js',
		'@wordpress/i18n': '<rootDir>/tests/js/mocks/wp-i18n.js',
		// Ignore SCSS/CSS imports in tests
		'\\.(scss|css)$': '<rootDir>/tests/js/mocks/style.js',
	},
};
