const postcssNesting = require('postcss-nesting')
const postcssLightDark = require('postcss-light-dark')
const autoprefixer = require('autoprefixer')

module.exports = {
	plugins: [
		postcssNesting({
			edition: '2024-02',
		}),
		postcssLightDark(),
		autoprefixer,
	]
}
