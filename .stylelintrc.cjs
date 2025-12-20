module.exports = {
    extends: ['stylelint-config-standard'],
    rules: {
        'color-hex-length': 'short',
        'color-function-notation': null,
        'alpha-value-notation': null,
        'selector-id-pattern': null,
        'declaration-block-no-redundant-longhand-properties': null,
        'media-feature-range-notation': null,
        'declaration-block-single-line-max-declarations': null,
        'shorthand-property-no-redundant-values': null,
        'rule-empty-line-before': null,
        'font-family-name-quotes': null
    },
    ignoreFiles: ['dist/**', 'node_modules/**']
};
