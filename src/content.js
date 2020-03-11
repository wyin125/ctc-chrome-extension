chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'getHtml') {
    sendResponse(document.all[0].outerHTML);
  }
});
