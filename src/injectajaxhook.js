(function () {
    if (window.IPO_Hook_injected) {
        return;
    }

    window.IPO_Hook_injected = true;

    // 清除現有腳本
    chrome.runtime.sendMessage(null, { operation: "clearScript" }, null, null);

    // 處理腳本內容的函數
    const handleScriptContent = (content) => {
        chrome.runtime.sendMessage(null, {
            operation: "addScript",
            script: content
        }, null, null);
    };

    // 處理腳本元素的函數
    const handleScriptElement = (element) => {
        if (element.type === "application/json" && element.textContent) {
            handleScriptContent(element.textContent);
        }
    };

    // 設置 MutationObserver
    const observer = new (window.MutationObserver || window.WebKitMutationObserver)((mutations) => {
        mutations.forEach(mutation => {
            const { target, addedNodes, removedNodes } = mutation;

            if (target.tagName === "SCRIPT") {
                addedNodes.forEach(node => {
                    if (target.type === "application/json") {
                        handleScriptContent(node.wholeText);
                    }
                });
            }

            removedNodes.forEach(node => {
                if (node.tagName === "SCRIPT") {
                    handleScriptElement(node);
                }
            });
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 注入 ajaxhook.js
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/ajaxhook.js");

    try {
        document.prepend(script);
        console.log("inject in document");
    } catch (error) {
        document.documentElement.prepend(script);
        console.log("inject in documentElement");
    }

    script.parentNode.removeChild(script);
})();
