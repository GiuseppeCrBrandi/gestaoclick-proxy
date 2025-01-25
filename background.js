// Log when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extensão instalada e funcionando!");
  });
  
  // Listen for the extension icon being clicked
  chrome.action.onClicked.addListener((tab) => {
    if (tab.id) { // Ensure tab.id is defined
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"], // Ensure this file exists in the root directory
      }, () => {
        console.log("Content script injected successfully");
      });
    } else {
      console.error("Tab ID is undefined.");
    }
  });
  