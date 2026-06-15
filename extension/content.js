chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SELECTION') {
    const selectedText = window.getSelection()?.toString().trim();
    sendResponse({ text: selectedText || '' });
  }
  return true;
});