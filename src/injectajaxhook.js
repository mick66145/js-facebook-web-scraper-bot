(function () {
    if (window["IPO_Hook_injected"]) {
        return;
    }
    /** @type {boolean} */
    window["IPO_Hook_injected"] = true;
    chrome["runtime"]["sendMessage"](null, {
        "operation": "clearScript"
    }, null, null);
    var subject = window["MutationObserver"] || window["WebKitMutationObserver"];
    var result = new subject(function (dataAndEvents) {
        dataAndEvents["forEach"](function (component) {
            if (component["target"]["tagName"] == "SCRIPT") {
                if (component["addedNodes"]["length"] > 0) {
                    component["addedNodes"]["forEach"](function (dataAndEvents) {
                        if (component["target"]["type"] == "application/json") {
                            chrome["runtime"]["sendMessage"](null, {
                                "operation": "addScript",
                                "script": dataAndEvents["wholeText"]
                            }, null, null);
                        }
                    });
                }
            }
            if (component["removedNodes"]["length"] > 0) {
                component["removedNodes"]["forEach"](function (element) {
                    if (element["tagName"] == "SCRIPT") {
                        if (element["type"] == "application/json") {
                            if (element["textContent"]) {
                                chrome["runtime"]["sendMessage"](null, {
                                    "operation": "addScript",
                                    "script": element["textContent"]
                                }, null, null);
                            }
                        }
                    }
                });
            }
        });
    });
    result["observe"](document, {
        "childList": true,
        "subtree": true
    });
    var el;
    el = document["createElement"]("script");
    el["src"] = chrome["runtime"]["getURL"]("src/ajaxhook.js");
    try {
        document["prepend"](el);
        console["log"]("inject in document");
    } catch (d) {
        document["documentElement"]["prepend"](el);
        console["log"]("inject in documentElement");
    }
    el["parentNode"]["removeChild"](el);
})();
