//recommend using plugin because native formatting rules got deprecated: https://eslint.style/guide/migration
import js from '@eslint/js';
import globals from 'globals';
import StylisticPlugin from '@stylistic/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	js.configs.recommended,
	eslintConfigPrettier,
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: { ...globals.browser },
		},
		plugins: {
			stylistic: StylisticPlugin,
		},
		rules: {
			'stylistic/indent': ['error', 'tab'],
			'stylistic/quotes': ['error', 'single'],
			'stylistic/semi': ['error', 'always'],
			'stylistic/linebreak-style': ['error', 'unix'],
			'stylistic/eol-last': ['error', 'always'],
		},
	},
];
