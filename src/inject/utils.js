function fetchBundleSizes(packageName) {
	return fetch(`https://bundlephobia.com/api/size?package=${packageName}`)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			return data;
		});
}

function getPackageName() {
	return window.location.href.split('package/')[1];
}
function formatBytes(bytes, decimals = 2) {
	if (bytes == 0) {
		return '0 B';
	}

	var k = 1024;
	var sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
	var i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}
