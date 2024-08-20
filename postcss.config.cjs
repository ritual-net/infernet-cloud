const postcssNesting = require('postcss-nesting')
const autoprefixer = require('autoprefixer')

module.exports = {
	plugins: [
		postcssNesting({
			edition: '2024-02',
		}),
		autoprefixer,
	]
}
