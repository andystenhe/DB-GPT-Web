/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	experimental: {
		esmExternals: 'loose'
	},
	typescript: {
		ignoreBuildErrors: true
	},
	env: {
		API_BASE_URL: process.env.API_BASE_URL
		// API_BASE_URL: 'http://localhost:5000'
	},
	trailingSlash: true
}

module.exports = nextConfig
