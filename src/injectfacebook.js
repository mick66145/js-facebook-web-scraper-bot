(function () {
    var el;
    el = document["createElement"]("script");
    /** @type {string} */
    el["id"] = "ipo_extension_id";
    el["setAttribute"]("ipo_extension_id", chrome["runtime"]["id"]);
    el["src"] = chrome["runtime"]["getURL"]("src/injectcommon.js");
    document["documentElement"]["appendChild"](el);
    el = document["createElement"]("script");
    el["src"] = chrome["runtime"]["getURL"]("js/jquery-3.3.1.js");
    document["documentElement"]["appendChild"](el);
    el["parentNode"]["removeChild"](el);
    el = document["createElement"]("script");
    el["src"] = chrome["runtime"]["getURL"]("src/config.js");
    document["documentElement"]["appendChild"](el);
    el["parentNode"]["removeChild"](el);
    setTimeout(function () {
        el = document["createElement"]("script");
        el["src"] = chrome["runtime"]["getURL"]("src/reactfacebook.js");
        document["documentElement"]["appendChild"](el);
        el["parentNode"]["removeChild"](el);
    }, 500);
})();
