const webpack = require("webpack");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HappyPack = require("happypack");
let happyThreadPool = HappyPack.ThreadPool({
	size: 4,
	maxQueueSize: 10,
});
module.exports = function override(config, env) {
	config.devtool = false;
	config.resolve.fallback = {
		url: require.resolve("url"),
		assert: require.resolve("assert"),
		crypto: require.resolve("crypto-browserify"),
		http: require.resolve("stream-http"),
		https: require.resolve("https-browserify"),
		os: require.resolve("os-browserify/browser"),
		buffer: require.resolve("buffer"),
		stream: require.resolve("stream-browserify"),
	};
	config.plugins.push(
		new webpack.ProvidePlugin({
			process: "process/browser",
			Buffer: ["buffer", "Buffer"],
		}),
		new HappyPack({
			id: "js",
			threadPool: happyThreadPool,
			loaders: ["babel-loader"],
		}),
		new HappyPack({
			id: "styles",
			threadPool: happyThreadPool,
			loaders: ["style-loader", "sass-loader"],
		})
		// new BundleAnalyzerPlugin()
	);
	config.ignoreWarnings = [/Failed to parse source map/];
	return config;
};
