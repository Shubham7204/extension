chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "executeScript") {
        chrome.scripting.executeScript(
            {
                target: { tabId: message.tabId },
                func: () => {
                    // Extract the text and trim white spaces
                    let text = document.body.innerText.substring(1000, 5000);
                    return text.replace(/\s+/g, ' ').trim();
                }
            },
            (results) => {
                if (results && results[0] && results[0].result) {
                    console.log("Extracted Text:", results[0].result); // Log to console
                    sendResponse({ result: results[0].result });
                } else {
                    sendResponse({ result: null });
                }
            }
        );
        return true; // Will respond asynchronously.
    }
});