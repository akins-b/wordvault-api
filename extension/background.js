chrome.runtime.onInstalled.addListener(() => {
  console.log('WordVault installed');
  chrome.contextMenus.create({
    id: "wordvault-lookup",
    title: 'Look up "%s" in WordVault',
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "wordvault-lookup") {
    const selectedText = encodeURIComponent(info.selectionText);
    chrome.windows.create({
      url: chrome.runtime.getURL(`lookup.html?word=${selectedText}`),
      type: "popup",
      width: 400,
      height: 600
    });
  }
});