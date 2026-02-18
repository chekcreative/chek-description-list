/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useMergeRefs } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useEnter from './hooks/use-enter';
import useBackspace from '../shared/hooks/use-backspace';
import useTab from '../shared/hooks/use-tab';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { content } = attributes;
	const enterRef = useEnter( clientId );
	const backspaceRef = useBackspace( clientId );
	const tabRef = useTab( clientId, 'chek/description-details' );
	const blockProps = useBlockProps( { ref: useMergeRefs( [ enterRef, backspaceRef, tabRef ] ) } );

	return (
		<dd { ...blockProps }>
			<RichText
				identifier="content"
				value={ content }
				onChange={ ( nextContent ) =>
					setAttributes( { content: nextContent } )
				}
				placeholder={ __(
					'Description...',
					'chek-description-list'
				) }
				allowedFormats={ [
					'core/bold',
					'core/italic',
					'core/link',
					'core/code',
					'core/superscript',
					'core/subscript',
				] }
			/>
		</dd>
	);
}
