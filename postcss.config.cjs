const postcssNesting = require('postcss-nesting')
// const postcssLightDarkFunction = require('@csstools/postcss-light-dark-function')
const autoprefixer = require('autoprefixer')

module.exports = {
	plugins: [
		postcssNesting({
			edition: '2024-02',
		}),
		// postcssLightDarkFunction(),
		autoprefixer,
	]
}
