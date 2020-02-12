chrome.extension.sendMessage({}, function() {
  const readyStateCheckInterval = setInterval(async function() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);

      var siblingEl;
      var packageName = getPackageName();
      var h3Tags = document.querySelectorAll('h3');
      for (let i = h3Tags.length - 1; i >= 0; --i) {
        var tag = h3Tags[i];
        if (tag.textContent && tag.textContent.toLowerCase() === 'last publish') {
          siblingEl = tag;
          break;
        }
      }

      var parent = siblingEl.parentNode;
      parent.classList.remove('w-100');

      var bundleEl = parent.cloneNode(true);
      bundleEl.querySelector('h3').textContent = 'bundlephobia';

      var paragraph = bundleEl.querySelector('p');
      paragraph.innerHTML = 'Loading sizes…';

      fetchBundleSizes(packageName)
        .then(handleFetchResponse)
        .catch(handleFetchError);
      // if (options.fetchOnPageLoad) {
      // }

      function handleFetchResponse(data) {
        paragraph.innerHTML = `<a class="external-link" href="https://bundlephobia.com/result?p=${packageName}" target="_blank" title="Open ${packageName} in new window"><span>${formatBytes(
          data.size,
        )}</span> | <span>${formatBytes(data.gzip)}</span></a>`;

        parent.parentNode.insertBefore(bundleEl, parent.nextSibling);
      }

      function handleFetchError(err) {
        console.error('Error fetching Bundlephobia data');
      }
    }
  }, 10);
});

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
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

function externalLink() {
  return "data:image/svg+xml,%3C%3Fxml version='1.0'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath style='text-indent:0;text-align:start;line-height:normal;text-transform:none;block-progression:tb;-inkscape-font-specification:Sans' d='M 5 2 C 3.3550302 2 2 3.3550302 2 5 L 2 19 C 2 20.64497 3.3550302 22 5 22 L 19 22 C 20.64497 22 22 20.64497 22 19 L 22 5 C 22 3.3550302 20.64497 2 19 2 L 5 2 z M 5 4 L 19 4 C 19.56503 4 20 4.4349698 20 5 L 20 19 C 20 19.56503 19.56503 20 19 20 L 5 20 C 4.4349698 20 4 19.56503 4 19 L 4 5 C 4 4.4349698 4.4349698 4 5 4 z M 6 6 L 6 8 L 14.59375 8 L 6 16.59375 L 7.40625 18 L 16 9.40625 L 16 18 L 18 18 L 18 6 L 6 6 z' overflow='visible' font-family='Sans'/%3E%3C/svg%3E%0A";
}
