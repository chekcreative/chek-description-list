/**
 * Jest test setup for WordPress block tests.
 *
 * Only mock packages that either aren't installed or need controlled behavior.
 * Packages like @wordpress/blocks, @wordpress/i18n, @wordpress/element etc.
 * are installed as real devDependencies and work natively.
 *
 * @wordpress/block-editor is mocked via moduleNameMapper in jest.config.js
 * because it can't be npm-installed (transitive dep on unpublished @wordpress/vips).
 */
