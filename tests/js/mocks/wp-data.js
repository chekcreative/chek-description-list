/**
 * Mock for @wordpress/data.
 */
module.exports = {
	useSelect: jest.fn( ( mapSelect ) => {
		if ( typeof mapSelect === 'function' ) {
			const mockSelect = () => ( {
				getBlock: jest.fn(),
				getBlockIndex: jest.fn( () => 0 ),
				getBlockRootClientId: jest.fn( () => 'root-id' ),
				getBlockOrder: jest.fn( () => [] ),
				getPreviousBlockClientId: jest.fn( () => null ),
			} );
			return mapSelect( mockSelect );
		}
		return {};
	} ),
	useDispatch: jest.fn( () => ( {
		insertBlock: jest.fn(),
		removeBlock: jest.fn(),
		selectBlock: jest.fn(),
		replaceBlock: jest.fn(),
	} ) ),
	select: jest.fn(),
	dispatch: jest.fn(),
};
