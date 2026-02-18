/**
 * Mock for @wordpress/i18n.
 */
module.exports = {
	__: ( str ) => str,
	_x: ( str ) => str,
	_n: ( single, plural, number ) => ( number === 1 ? single : plural ),
	sprintf: ( format, ...args ) => {
		let i = 0;
		return format.replace( /%s/g, () => args[ i++ ] );
	},
};
