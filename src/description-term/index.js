/**
 * WordPress dependencies
 */
import { registerBlockType, createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';
import save from './save';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'chek/description-details' ],
				transform: ( { content } ) => {
					return createBlock( 'chek/description-details', {
						content,
					} );
				},
			},
		],
		from: [
			{
				type: 'block',
				blocks: [ 'chek/description-details' ],
				transform: ( { content } ) => {
					return createBlock( 'chek/description-term', {
						content,
					} );
				},
			},
		],
	},
} );
