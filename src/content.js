chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'getHtml') {
    sendResponse(document.all[0].outerHTML);
  } else if (message === 'getToken') {
    alert(localStorage.getItem('token'));
    sendResponse(localStorage.getItem('token'));
  }
});
