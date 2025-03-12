(function () {
    function injectScript(src, options = {}) {
        const script = document.createElement('script');
        if (options.id) {
            script.id = options.id;
            script.setAttribute(options.id, chrome.runtime.id);
        }
        script.src = chrome.runtime.getURL(src);
        document.documentElement.appendChild(script);
        if (!options.keepInDOM) {
            script.parentNode.removeChild(script);
        }
        return script;
    }

    const immediateScripts = [
        { src: 'src/injectcommon.js', id: 'ipo_extension_id', keepInDOM: true },
        { src: 'js/jquery-3.3.1.js' },
        { src: 'src/config.js' }
    ];

    immediateScripts.forEach(script => injectScript(script.src, script));

    setTimeout(() => {
        injectScript('src/reactfacebook.js');
    }, 500);
})();
