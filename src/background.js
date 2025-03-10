importScripts("config.js");
importScripts("../js/pako_deflate.min.js");
(function () {
    'use strict';

    var a = 1;
    var b = [];
    var c = {};
    var d = {};
    var e = {};
    var f = 30000;
    var g = true;
    chrome.storage.sync.get(["autoStatus"], function (q) {
        console.log(q);
        if (!q || q.autoStatus === undefined) {
            g = true;
        } else {
            g = q.autoStatus ? true : false;
        }
        console.log("botAutoStatus %o", g);
    });
    function h(q, r) {
        var s = null;
        var u = this;
        this.info = r;
        this.startTimer = function (v) {
            if (s) {
                u.stopTimer();
            }
            if (typeof q == "function") {
                s = // TOLOOK
                    setTimeout(q, v, this);
            }
        };
        this.stopTimer = function () {
            if (s) {
                clearTimeout(s);
            }
            s = null;
        };
        this.isEnabled = function () {
            if (s) {
                return true;
            }
            return false;
        };
    }
    function i(q) {
        chrome.cookies.getAll({
            url: "https://" + config.domain
        }, function (r) {
            var s = {};
            r.forEach(function (t) {
                if (t.name == "extension_sess") {
                    s.sess = t;
                } else if (t.name == "extension_brand") {
                    s.brand = t;
                }
            });
            console.log(s);
            if (q) {
                q(s);
            }
        });
    }
    function j(q) {
        var r = "";
        var s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var t = q.byteLength;
        var u = t % 3;
        var v = t - u;
        var w;
        var x;
        var y;
        var z;
        var A;
        for (var B = 0; B < v; B = B + 3) {
            A = q[B] << 16 | q[B + 1] << 8 | q[B + 2];
            w = (A & 16515072) >> 18;
            x = (A & 258048) >> 12;
            y = (A & 4032) >> 6;
            z = A & 63;
            r += s[w] + s[x] + s[y] + s[z];
        }
        if (u == 1) {
            A = q[v];
            w = (A & 252) >> 2;
            x = (A & 3) << 4;
            r += s[w] + s[x] + "==";
        } else if (u == 2) {
            A = q[v] << 8 | q[v + 1];
            w = (A & 64512) >> 10;
            x = (A & 1008) >> 4;
            y = (A & 15) << 2;
            r += s[w] + s[x] + s[y] + "=";
        }
        return r;
    }
    function k(q, r, s) {
        i(function (t) {
            q.cookie = t.sess;
            q.brand = t.brand;
            q.extUrl = chrome.runtime.getURL("");
            if (q.source == "post") {
                if (c["t" + r.tab.id] && c["t" + r.tab.id].job) {
                    q.execute_from_ext = true;
                } else {
                    q.execute_from_ext = false;
                }
            } else if (q.source == "feed") {
                if (c["t" + r.tab.id] && c["t" + r.tab.id].job) {
                    q.execute_from_ext = true;
                } else {
                    q.execute_from_ext = false;
                }
            }
            s(q);
        });
    }
    function l(q) {
        var r = null;
        if (q.post_snapshot_media_feed_type === "group") {
            if (q.post_snapshot_media_post_id) {
                var s = q.post_snapshot_media_post_id.split("_");
                r = "https://www.facebook.com/story.php?story_fbid=" + s[1] + "&id=" + s[0];
            }
        } else if (q.post_snapshot_media_feed_type === "user" || q.post_snapshot_media_feed_type === "page") {
            if (q.post_snapshot_media_post_id) {
                var s = q.post_snapshot_media_post_id.split("_");
                r = "https://www.facebook.com/" + s[0] + "/posts/" + s[1] + "/";
            }
        } else if (q.post_snapshot_media_feed_type === "line_note" && q.post_snapshot_media_post_id && q.post_snapshot_media_feed_id) {
            r = "https://linevoom.line.me/post/" + q.post_snapshot_media_feed_id + "/" + q.post_snapshot_media_post_id;
        }
        return r;
    }
    function m(q) {
        return "https://www.facebook.com/groups/" + q;
    }
    function n(q, r) {
        i(function (s) {
            if (s.sess && s.sess.value && s.brand && s.brand.value) {
                var t = {};
                for (var u in c) {
                    if (c[u].job && c[u].job.post_snapshot_id) {
                        t[c[u].job.post_snapshot_id] = true;
                    }
                }
                var v = q;
                v.forEach(function (y) {
                    if (t[y.post_snapshot_id]) { } else {
                        var z = l(y);
                        if (z) {
                            y.link = z;
                            b.push(y);
                        }
                    }
                });
                if (b.length > 0) {
                    console.log("Start Processing ....");
                    for (var w = 0; w < a; w++) {
                        if (b.length > 0) {
                            var x = b.shift();
                            chrome.tabs.create({
                                url: x.link,
                                active: false
                            }, function (y) {
                                y.timestamp = Date.now();
                                y.job = x;
                                y.recovery = new h(o, y);
                                y.recovery.startTimer(f);
                                c["t" + y.id] = y;
                            });
                        }
                    }
                    r({
                        code: "success"
                    });
                } else {
                    console.log("No jobs need Processing ....");
                    r({
                        code: "error",
                        message: "無任何需要處理的開團"
                    });
                }
            } else {
                r({
                    code: "error",
                    message: "尚未登入愛+1系統"
                });
            }
        });
    }
    function o(q) {
        console.log(q);
        console.log("Tab " + q.info.id + " is blocking, delete this tab");
        if (c["t" + q.info.id]) {
            chrome.tabs.remove(q.info.id, function () { });
            delete c["t" + q.info.id];
        }
        if (b.length > 0) {
            for (var r = Object.keys(c).length; r < a; r++) {
                if (b.length > 0) {
                    var s = b.shift();
                    chrome.tabs.create({
                        url: s.link,
                        active: false
                    }, function (t) {
                        t.timestamp = Date.now();
                        t.job = s;
                        t.recovery = new h(o, t);
                        t.recovery.startTimer(f);
                        c["t" + t.id] = t;
                    });
                }
            }
        }
    }
    function p(q) {
        if (c["t" + q.tab.id]) {
            if (c["t" + q.tab.id].recovery) {
                c["t" + q.tab.id].recovery.stopTimer();
            }
            delete c["t" + q.tab.id];
        }
        // TOLOOK
        setTimeout(function () {
            chrome.tabs.remove(q.tab.id, function () { });
        }, 100);
        chrome.tabs.query({}, function (r) {
            var s = Date.now();
            for (var t in c) {
                var u = false;
                for (var v = 0; v < r.length; v++) {
                    if (r[v].id === c[t].id) {
                        u = true;
                        if (c[t].timestamp + f < s) {
                            if (c[t].recovery) {
                                c[t].recovery.stopTimer();
                            }
                            chrome.tabs.remove(c[t].id, function () { });
                            delete c[t];
                        }
                        break;
                    }
                }
                if (!u) {
                    console.log("Tab " + c[t].url + "does not exist!");
                    if (c[t].recovery) {
                        c[t].recovery.stopTimer();
                    }
                    delete c[t];
                }
            }
            if (b.length > 0) {
                console.log("Remaining " + b.length + " jobs");
                for (var v = Object.keys(c).length; v < a; v++) {
                    if (b.length > 0) {
                        var w = b.shift();
                        chrome.tabs.create({
                            url: w.link,
                            active: false
                        }, function (x) {
                            x.timestamp = Date.now();
                            x.job = w;
                            x.recovery = new h(o, x);
                            x.recovery.startTimer(f);
                            c["t" + x.id] = x;
                        });
                    }
                }
            }
        });
    }
    chrome.runtime.onInstalled.addListener(function () {
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
            chrome.declarativeContent.onPageChanged.addRules([{
                conditions: [new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostEquals: "www.facebook.com"
                    }
                })],
                actions: [new chrome.declarativeContent.ShowPageAction(), new chrome.declarativeContent.RequestContentScript({
                    js: ["/src/injectajaxhook.js"]
                })]
            }, {
                conditions: [new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostEquals: "linevoom.line.me"
                    }
                })],
                actions: [new chrome.declarativeContent.ShowPageAction(), new chrome.declarativeContent.RequestContentScript({
                    js: ["/src/injectlineajaxhook.js"]
                })]
            }, {
                conditions: [new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostEquals: config.domain
                    }
                })],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }]);
        });
    });
    chrome.runtime.onMessageExternal.addListener(function (q, r, s) {
        console.log(q);
        if (q.operation == "getSess") {
            k(q, r, s);
        } else if (q.operation === "getScripts") {
            if (e["t" + r.tab.id]) {
                q.scripts = e["t" + r.tab.id].scripts;
            } else {
                q.scripts = [];
            }
            s(q);
        } else if (q.operation == "reload") {
            chrome.tabs.reload(q.tabId);
            s(q);
        } else if (q.operation == "reloadPage") {
            if (!d["t" + r.tab.id]) {
                d["t" + r.tab.id] = {
                    count: 1,
                    url: q.url
                };
                q.status = true;
                chrome.tabs.reload(r.tab.id);
            } else if (d["t" + r.tab.id].url != q.url) {
                d["t" + r.tab.id] = {
                    count: 1,
                    url: q.url
                };
                q.status = true;
                chrome.tabs.reload(r.tab.id);
            } else {
                d["t" + r.tab.id].count++;
                if (d["t" + r.tab.id].count > 2) {
                    q.status = false;
                } else {
                    q.status = true;
                    chrome.tabs.reload(r.tab.id);
                }
            }
            s(q);
        } else if (q.operation == "get_comments") {
            if (q.post_snapshot) {
                var t = false;
                for (var u in c) {
                    if (c[u].job && c[u].job.post_snapshot_id && c[u].job.post_snapshot_id == q.post_snapshot.post_snapshot_id) {
                        t = true;
                        break;
                    }
                }
                if (!t) {
                    var v = l(q.post_snapshot);
                    if (v) {
                        var w = q.post_snapshot;
                        w.link = v;
                        chrome.tabs.create({
                            url: w.link,
                            active: false
                        }, function (x) {
                            x.timestamp = Date.now();
                            x.job = q.post_snapshot;
                            x.recovery = new h(o, x);
                            x.recovery.startTimer(f);
                            c["t" + x.id] = x;
                        });
                        q.status = "NEW";
                    } else {
                        q.status = "NOLINK";
                    }
                } else {
                    q.status = "RUNNING";
                }
            } else {
                q.status = "NODATA";
            }
            s(q);
        } else if (q.operation == "get_feed") {
            if (q.feed_id) {
                var t = false;
                for (var u in c) {
                    if (c[u].job && c[u].job.feed_id && c[u].job.feed_id == q.feed_id) {
                        t = true;
                        break;
                    }
                }
                if (!t) {
                    var v = m(q.feed_id);
                    if (v) {
                        var w = {
                            feed_id: q.feed_id
                        };
                        w.link = v;
                        w.opener_id = r.tab.id;
                        chrome.tabs.create({
                            url: w.link,
                            active: true
                        }, function (x) {
                            x.timestamp = Date.now();
                            x.job = w;
                            x.recovery = new h(o, x);
                            x.recovery.startTimer(f);
                            c["t" + x.id] = x;
                        });
                        q.status = "NEW";
                    } else {
                        q.status = "NOLINK";
                    }
                } else {
                    q.status = "RUNNING";
                }
            } else {
                q.status = "NODATA";
            }
            s(q);
        } else if (q.operation == "batch_get_comments") {
            if (q.post_snapshots) {
                console.log(b.length, c, Object.keys(c).length);
                if (b.length == 0 && Object.keys(c).length == 0) {
                    n(q.post_snapshots, function (x) {
                        console.log("response:", x);
                        q.status = "SUCCESS";
                        s(q);
                    });
                } else {
                    q.status = "RUNNING";
                    s(q);
                }
            } else {
                q.status = "NODATA";
                s(q);
            }
            console.log(q);
        } else if (q.operation === "getBotAutoStatus") {
            q.bot_status = g;
            s(q);
        }
        return true;
    });
    chrome.runtime.onConnectExternal.addListener(function (q) {
        q.onMessage.addListener(function (r) {
            console.log(r);
            if (r.operation === "checkLinePostInfo") {
                var s = r.post_info;
                var u = r.user_info;
                if (s && u) {
                    i(function (B) {
                        var C = {
                            script_version: config.import_version,
                            post_info: s,
                            user_info: u
                        };
                        if (B.sess && B.brand) {
                            fetch(config.restAPI + "/post_snapshots/extension_line_note_status2", {
                                method: "POST",
                                headers: {
                                    "X-SESSION": decodeURIComponent(B.sess.value),
                                    "X-BRAND": decodeURIComponent(B.brand.value),
                                    "Content-Type": "application/json; charset=utf-8"
                                },
                                body: JSON.stringify(C),
                                cache: "no-cache"
                            }).then(function (D) {
                                if (!D.ok) {
                                    throw new Error("Network response was not ok");
                                }
                                return D.json();
                            }).then(function (D) {
                                q.postMessage({
                                    operation: r.operation,
                                    status: "success",
                                    response: D
                                });
                            }).catch(function (D) {
                                console.error("Fetch Error:", D);
                                q.postMessage({
                                    operation: r.operation,
                                    status: "error",
                                    error: D
                                });
                            });
                        }
                    });
                }
            } else if (r.operation === "uploadLineComments") {
                i(function (B) {
                    if (B.sess && B.brand) {
                        fetch(config.restAPI + "/post_snapshots/extension_upload_line_note_comments", {
                            method: "POST",
                            headers: {
                                "X-SESSION": decodeURIComponent(B.sess.value),
                                "X-BRAND": decodeURIComponent(B.brand.value),
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify(r.post_info),
                            cache: "no-cache"
                        }).then(function (C) {
                            if (!C.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return C.json();
                        }).then(function (C) {
                            q.postMessage({
                                operation: r.operation,
                                status: "success",
                                response: C
                            });
                        }).catch(function (C) {
                            console.error("Fetch Error:", C);
                            q.postMessage({
                                operation: r.operation,
                                status: "error",
                                error: C
                            });
                        });
                    }
                });
            } else if (r.operation === "checkReactFacebookPostInfo") {
                var s = r.post_info;
                if (s) {
                    i(function (B) {
                        var C = {
                            script_version: config.import_version,
                            user_profile_id: r.post_info.user_profile_id,
                            post_type: r.post_info.fb_feed_type
                        };
                        var D = Object.keys(C).map(function (E) {
                            return encodeURIComponent(E) + "=" + encodeURIComponent(C[E]);
                        }).join("&");
                        if (B.sess && B.brand) {
                            fetch(config.restAPI + "/post_snapshots/extension_post_status/" + r.post_info.fb_post_id + "?" + D, {
                                method: "GET",
                                headers: {
                                    "X-SESSION": decodeURIComponent(B.sess.value),
                                    "X-BRAND": decodeURIComponent(B.brand.value)
                                },
                                cache: "no-cache"
                            }).then(function (E) {
                                if (!E.ok) {
                                    throw new Error("Network response was not ok");
                                }
                                return E.json();
                            }).then(function (E) {
                                q.postMessage({
                                    operation: r.operation,
                                    status: "success",
                                    response: E
                                });
                            }).catch(function (E) {
                                console.error("Fetch Error:", E);
                                q.postMessage({
                                    operation: r.operation,
                                    status: "error",
                                    error: E
                                });
                            });
                        }
                    });
                }
            } else if (r.operation === "uploadReactFacebookStories") {
                i(function (B) {
                    if (B.sess && B.brand) {
                        var C = {
                            feed_id: r.feed_id,
                            stories: r.stories
                        };
                        fetch(config.restAPI + "/fb_post_cache/extension_upload_posts", {
                            method: "POST",
                            headers: {
                                "X-SESSION": decodeURIComponent(B.sess.value),
                                "X-BRAND": decodeURIComponent(B.brand.value),
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify(C),
                            cache: "no-cache"
                        }).then(function (D) {
                            if (!D.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return D.json();
                        }).then(function (D) {
                            q.postMessage({
                                operation: r.operation,
                                status: "success",
                                response: D
                            });
                        }).catch(function (D) {
                            q.postMessage({
                                operation: r.operation,
                                status: "error",
                                error: D
                            });
                        });
                    }
                });
            } else if (r.operation === "uploadReactFacebookComments") {
                i(function (B) {
                    if (B.sess && B.brand) {
                        fetch(config.restAPI + "/post_snapshots/extension_upload_react_facebook_comments", {
                            method: "POST",
                            headers: {
                                "X-SESSION": decodeURIComponent(B.sess.value),
                                "X-BRAND": decodeURIComponent(B.brand.value),
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify(r.post_info),
                            cache: "no-cache"
                        }).then(function (C) {
                            if (!C.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return C.json();
                        }).then(function (C) {
                            q.postMessage({
                                operation: r.operation,
                                status: "success",
                                response: C
                            });
                        }).catch(function (C) {
                            console.error("Fetch Error:", C);
                            q.postMessage({
                                operation: r.operation,
                                status: "error",
                                error: C
                            });
                        });
                    }
                });
            } else if (r.operation === "uploadReactFacebookLastFetchTime") {
                i(function (B) {
                    if (B.sess && B.brand) {
                        console.log(r.post_info);
                        fetch(config.restAPI + "/post_snapshots/extension_last_new_comments_time/" + r.post_info.fb_post_id, {
                            method: "PUT",
                            headers: {
                                "X-SESSION": decodeURIComponent(B.sess.value),
                                "X-BRAND": decodeURIComponent(B.brand.value),
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            cache: "no-cache"
                        }).then(function (C) {
                            if (!C.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return C.json();
                        }).then(function (C) {
                            q.postMessage({
                                operation: r.operation,
                                status: "success",
                                response: C
                            });
                        }).catch(function (C) {
                            console.error("Fetch Error:", C);
                            q.postMessage({
                                operation: r.operation,
                                status: "error",
                                error: C
                            });
                        });
                    }
                });
            } else if (r.operation === "lineImport" || r.operation === "lineLink") {
                console.log("lineImport");
                var v = Math.floor(Date.now() / 1000);
                var w = JSON.stringify(r.post_info);
                var x = j(pako.gzip(w));
                var y = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head><body><form method=\"post\" action=\"https://" + config.domain + "/seller/sellergroups\" accept-charset=\"utf-8\" id=\"fipo\">";
                if (r.operation === "lineImport") {
                    y += "<input type=\"hidden\" name=\"action\" value=\"import\">";
                } else {
                    y += "<input type=\"hidden\" name=\"action\" value=\"link\">";
                }
                y += "<input type=\"hidden\" name=\"post_type\" value=\"line\">";
                y += "<input type=\"hidden\" name=\"post_data_gzip\" value=\"" + x + "\">";
                y += "<input type=\"hidden\" name=\"post_timestamp\" value=\"" + v + "\">";
                y += "<input type=\"hidden\" name=\"import_version\" value=\"" + config.import_version + "\">";
                y += "<input type=\"hidden\" name=\"tab_id\" value=\"" + q.sender.tab.id.toString() + "\">";
                y += "<input type=\"hidden\" name=\"ext_id\" value=\"" + chrome.runtime.id + "\">";
                y += "</form><script type=\"text/javascript\">document.getElementById(\"fipo\").submit();</script></body></html>";
                chrome.tabs.create({
                    url: "data:text/html," + encodeURIComponent(y),
                    active: true,
                    index: q.sender.tab.index + 1
                });
            } else if (r.operation === "reactFbImport" || r.operation === "reactFbLink") {
                var v = Math.floor(Date.now() / 1000);
                var w = JSON.stringify(r.post_info);
                var x = j(pako.gzip(w));
                var y = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head><body><form method=\"post\" action=\"https://" + config.domain + "/seller/sellergroups\" accept-charset=\"utf-8\" id=\"fipo\">";
                if (r.operation === "reactFbImport") {
                    y += "<input type=\"hidden\" name=\"action\" value=\"import\">";
                } else {
                    y += "<input type=\"hidden\" name=\"action\" value=\"link\">";
                }
                y += "<input type=\"hidden\" name=\"post_type\" value=\"reactfb\">";
                y += "<input type=\"hidden\" name=\"post_data_gzip\" value=\"" + x + "\">";
                y += "<input type=\"hidden\" name=\"post_timestamp\" value=\"" + v + "\">";
                y += "<input type=\"hidden\" name=\"import_version\" value=\"" + config.import_version + "\">";
                y += "<input type=\"hidden\" name=\"tab_id\" value=\"" + q.sender.tab.id.toString() + "\">";
                y += "<input type=\"hidden\" name=\"ext_id\" value=\"" + chrome.runtime.id + "\">";
                y += "</form><script type=\"text/javascript\">document.getElementById(\"fipo\").submit();</script></body></html>";
                console.log(y);
                chrome.tabs.create({
                    url: "data:text/html," + encodeURIComponent(y),
                    active: true,
                    index: q.sender.tab.index + 1
                });
            } else if (r.operation === "close") {
                var A = null;
                if (c["t" + q.sender.tab.id]) {
                    if (c["t" + q.sender.tab.id].recovery) {
                        c["t" + q.sender.tab.id].recovery.stopTimer();
                    }
                    console.log(c["t" + q.sender.tab.id]);
                    if (c["t" + q.sender.tab.id].job && c["t" + q.sender.tab.id].job.opener_id) {
                        A = c["t" + q.sender.tab.id].job.opener_id;
                    }
                    delete c["t" + q.sender.tab.id];
                }
                // TOLOOK
                setTimeout(function () {
                    chrome.tabs.remove(q.sender.tab.id, function () { });
                    if (A) {
                        chrome.tabs.update(A, {
                            active: true
                        });
                    }
                }, 100);
            } else if (r.operation === "checkNext") {
                p(q.sender);
            } else if (r.operation === "stopRecovery") {
                if (c["t" + q.sender.tab.id]) {
                    c["t" + q.sender.tab.id].timestamp = Date.now();
                    if (c["t" + q.sender.tab.id].recovery) {
                        c["t" + q.sender.tab.id].recovery.stopTimer();
                    }
                }
            } else if (r.operation === "refreshRecovery") {
                if (c["t" + q.sender.tab.id]) {
                    c["t" + q.sender.tab.id].timestamp = Date.now();
                    if (c["t" + q.sender.tab.id].recovery && c["t" + q.sender.tab.id].recovery.isEnabled()) {
                        c["t" + q.sender.tab.id].recovery.stopTimer();
                        c["t" + q.sender.tab.id].recovery.startTimer(f);
                    }
                }
            } else if (r.operation === "bindReactFacebookGroup") {
                i(function (B) {
                    if (B.sess && B.brand) {
                        fetch(config.restAPI + "/fb_groups/extension_bind_group", {
                            method: "POST",
                            headers: {
                                "X-SESSION": decodeURIComponent(B.sess.value),
                                "X-BRAND": decodeURIComponent(B.brand.value),
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify(r.data),
                            cache: "no-cache"
                        }).then(function (C) {
                            if (!C.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return C.json();
                        }).then(function (C) {
                            q.postMessage({
                                operation: r.operation,
                                status: "success",
                                response: C
                            });
                        }).catch(function (C) {
                            q.postMessage({
                                operation: r.operation,
                                status: "error",
                                error: C
                            });
                        });
                    }
                });
            } else if (r.operation === "checkReactFacebookGroupBindStatus") {
                i(function (B) {
                    if (B.sess && B.brand) {
                        var C = {
                            fb_feed_id: r.data.fb_feed_id,
                            admins: r.data.admins
                        };
                        fetch(config.restAPI + "/fb_groups/extension_check_bind", {
                            method: "POST",
                            headers: {
                                "X-SESSION": decodeURIComponent(B.sess.value),
                                "X-BRAND": decodeURIComponent(B.brand.value),
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify(C),
                            cache: "no-cache"
                        }).then(function (D) {
                            if (!D.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return D.json();
                        }).then(function (D) {
                            q.postMessage({
                                operation: r.operation,
                                status: "success",
                                response: D
                            });
                        }).catch(function (D) {
                            q.postMessage({
                                operation: r.operation,
                                status: "error",
                                error: D
                            });
                        });
                    }
                });
            } else if (r.operation === "getImportedPosts") {
                i(function (B) {
                    if (B.sess && B.brand) {
                        var C = {
                            script_version: config.import_version,
                            fb_feed_id: r.data.fb_feed_id
                        };
                        var D = Object.keys(C).map(function (E) {
                            return encodeURIComponent(E) + "=" + encodeURIComponent(C[E]);
                        }).join("&");
                        fetch(config.restAPI + "/post_snapshots/extension_imported_posts?" + D, {
                            method: "GET",
                            headers: {
                                "X-SESSION": decodeURIComponent(B.sess.value),
                                "X-BRAND": decodeURIComponent(B.brand.value),
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            cache: "no-cache"
                        }).then(function (E) {
                            if (!E.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return E.json();
                        }).then(function (E) {
                            q.postMessage({
                                operation: r.operation,
                                status: "success",
                                response: E
                            });
                        }).catch(function (E) {
                            q.postMessage({
                                operation: r.operation,
                                status: "error",
                                error: E
                            });
                        });
                    }
                });
            } else if (r.operation === "uploadReactFacebookMembers") {
                i(function (B) {
                    if (B.sess && B.brand) {
                        fetch(config.restAPI + "/members/extension_group_members", {
                            method: "POST",
                            headers: {
                                "X-SESSION": decodeURIComponent(B.sess.value),
                                "X-BRAND": decodeURIComponent(B.brand.value),
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify(r.member_info),
                            cache: "no-cache"
                        }).then(function (C) {
                            if (!C.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return C.json();
                        }).then(function (C) {
                            q.postMessage({
                                operation: r.operation,
                                status: "success",
                                response: C
                            });
                        }).catch(function (C) {
                            console.error("Fetch Error:", C);
                            q.postMessage({
                                operation: r.operation,
                                status: "error",
                                error: C
                            });
                        });
                    }
                });
            }
        });
    });
    chrome.runtime.onMessage.addListener(function (q, r, s) {
        if (q.operation === "getSess") {
            console.log(q);
            k(q, r, s);
            return true;
        } else if (q.operation === "addScript") {
            if (e["t" + r.tab.id]) {
                e["t" + r.tab.id].scripts.push(q.script);
            }
        } else if (q.operation === "clearScript") {
            if (e["t" + r.tab.id]) {
                delete e["t" + r.tab.id];
            }
        } else if (q.operation === "getBotAutoStatus") {
            q.bot_status = g;
        } else if (q.operation === "disableAuto") {
            g = false;
            console.log("extension disable auto");
            chrome.storage.sync.set({
                autoStatus: g
            }, function () { });
        } else if (q.operation === "enableAuto") {
            g = true;
            console.log("extension enable auto");
            chrome.storage.sync.set({
                autoStatus: g
            }, function () { });
        }
        s(q);
    });
    chrome.tabs.onUpdated.addListener(function (q, r, s) {
        if (!s || !s.url) {
            return;
        }
        console.log("onUpdated tabId: " + q + " url: " + s.url);
        console.log(r);
        var t = [new RegExp(/^https:\/\/www\.facebook\.com\/groups\/([A-Za-z0-9\._]+)\/permalink\/(\d+)/), new RegExp(/^https:\/\/www\.facebook\.com\/([A-Za-z0-9\._]+)\/posts\/(\d+|pfbid[A-Za-z0-9]+)/), new RegExp(/^https:\/\/www\.facebook\.com\/photo\.php\?fbid=(\d+)&set=a\.\d+\.\d+\.(\d+)/), new RegExp(/^https:\/\/www\.facebook\.com\/photo\.php\?fbid=(\d+)&set=a\.\d+([A-Za-z0-9\._&=]+)/), new RegExp(/^https:\/\/www\.facebook\.com\/([A-Za-z0-9\._]+)\/photos\/a\.\d+\.\d+\.(\d+)\/(\d+)([A-Za-z0-9\._&?\/]+)/), new RegExp(/^https:\/\/www\.facebook\.com\/([A-Za-z0-9\._]+)\/photos\/a\.(\d+)\/(\d+)\/([A-Za-z0-9\._&?]+)/), new RegExp(/^https:\/\/www\.facebook\.com\/story\.php\?story_fbid=(\d+)&id=\d+/), new RegExp(/^https:\/\/www\.facebook\.com\/permalink\.php\?story_fbid=(\d+|pfbid[A-Za-z0-9]+)&id=(\d+)/), new RegExp(/^https:\/\/www\.facebook\.com\/groups\/([A-Za-z0-9\._]+)\/posts\/(\d+)/), new RegExp(/^https:\/\/www\.facebook\.com\/groups\/([A-Za-z0-9\._]+)\/?\?multi_permalinks=(\d+)/), new RegExp(/^https:\/\/www\.facebook\.com\/groups\/([A-Za-z0-9\._]+)\/posts\/[\w%-]+\/\d+/)];
        var u = false;
        for (var v = 0; v < t.length; v++) {
            if (t[v].test(s.url)) {
                u = true;
                break;
            }
        }
        var w = [new RegExp(/^https:\/\/www\.facebook\.com\/groups\/([A-Za-z0-9\._]+)\/members\?fbm=1$/)];
        var x = false;
        for (var v = 0; v < w.length; v++) {
            if (w[v].test(s.url)) {
                x = true;
                break;
            }
        }
        var y = [new RegExp(/^https:\/\/www\.facebook\.com\/groups\/([A-Za-z0-9\._]+)\/members/), new RegExp(/^https:\/\/www\.facebook\.com\/groups\/([A-Za-z0-9\._]+)\/members\/admins/)];
        var z = false;
        if (!x) {
            for (var v = 0; v < y.length; v++) {
                if (y[v].test(s.url)) {
                    z = true;
                    break;
                }
            }
        }
        var A = [new RegExp(/^https:\/\/www\.facebook\.com\/groups\/([A-Za-z0-9\._]+)\/?$/)];
        var B = false;
        if (!u) {
            var C = new URL(s.url);
            var D = C.protocol + "//" + C.hostname + C.pathname;
            for (var v = 0; v < A.length; v++) {
                if (A[v].test(D)) {
                    B = true;
                    break;
                }
            }
        }
        var E = [new RegExp(/^https:\/\/linevoom\.line\.me\/post\/(_[A-Za-z0-9_-]+)\/(\d+)/), new RegExp(/^https:\/\/linevoom\.line\.me\/post\/(\d+)/)];
        var F = false;
        for (var v = 0; v < E.length; v++) {
            if (E[v].test(s.url)) {
                F = true;
                break;
            }
        }
        var G = [new RegExp(/^https:\/\/linevoom\.line\.me\/group\/(_[A-Za-z0-9_-]+)/), new RegExp(/^https:\/\/linevoom\.line\.me\/user\/(_d[A-Za-z0-9_-]+)/), new RegExp(/^https:\/\/linevoom\.line\.me\/$/)];
        var H = false;
        for (var v = 0; v < G.length; v++) {
            if (G[v].test(s.url)) {
                H = true;
                break;
            }
        }
        if (r.status == "loading") {
            if (e["t" + q] && e["t" + q].url != s.url) {
                delete e["t" + q];
            }
            if (!e["t" + q]) {
                e["t" + q] = {
                    timestamp: Date.now(),
                    url: s.url,
                    scripts: []
                };
            }
            chrome.tabs.query({}, function (J) {
                var K = {};
                J.forEach(function (N) {
                    K["t" + N.id] = true;
                });
                var L = Date.now();
                for (var M in e) {
                    if (!K[M]) {
                        delete e[M];
                    }
                }
            });
        } else if (r.status == "complete") {
            var I = null;
            if (config.version == "PRODUCTION") {
                I = /^https:\/\/www\.iplusonego\.com\/seller\//;
            } else if (config.version == "STAGE") {
                I = /^https:\/\/stage\.iplusonego\.com\/seller\//;
            } else if (config.version == "DEV") {
                I = /^https:\/\/dev\.iplusonego\.com\/seller\//;
            }
            if (I && I.test(s.url)) {
                chrome.scripting.executeScript({
                    target: {
                        tabId: s.id
                    },
                    files: ["/src/ipo.js"]
                });
            }
            if (u) {
                console.log("Facebook tabId: " + q + " match url: " + s.url);
                chrome.scripting.insertCSS({
                    target: {
                        tabId: s.id
                    },
                    files: ["/css/iplusone.css"]
                });
                chrome.scripting.executeScript({
                    target: {
                        tabId: s.id
                    },
                    files: ["/src/injectfacebook.js"]
                });
            }
            if (z) {
                console.log("Facebook tabId: " + q + " match url: " + s.url);
                chrome.scripting.insertCSS({
                    target: {
                        tabId: s.id
                    },
                    files: ["/css/iplusone.css"]
                });
                chrome.scripting.executeScript({
                    target: {
                        tabId: s.id
                    },
                    files: ["/src/injectfacebookadmin.js"]
                });
            }
            if (x) {
                console.log("Facebook tabId: " + q + " match url: " + s.url);
                chrome.scripting.insertCSS({
                    target: {
                        tabId: s.id
                    },
                    files: ["/css/iplusone.css"]
                });
                chrome.scripting.executeScript({
                    target: {
                        tabId: s.id
                    },
                    files: ["/src/injectfacebookmembers.js"]
                });
            }
            if (B) {
                console.log("Facebook Feed tabId: " + q + " match url: " + s.url);
                chrome.scripting.insertCSS({
                    target: {
                        tabId: s.id
                    },
                    files: ["/css/iplusone.css"]
                });
                chrome.scripting.executeScript({
                    target: {
                        tabId: s.id
                    },
                    files: ["/src/injectfacebookfeed.js"]
                });
            }
            if (F) {
                console.log("LINE tabId: " + q + " match url: " + s.url);
                chrome.scripting.insertCSS({
                    target: {
                        tabId: s.id
                    },
                    files: ["/css/iplusone.css"]
                });
                chrome.scripting.executeScript({
                    target: {
                        tabId: s.id
                    },
                    files: ["/src/injectline.js"]
                });
            }
            if (H) {
                console.log("LINE tabId: " + q + " match url: " + s.url);
                chrome.scripting.insertCSS({
                    target: {
                        tabId: s.id
                    },
                    files: ["/css/iplusone.css"]
                });
                chrome.scripting.executeScript({
                    target: {
                        tabId: s.id
                    },
                    files: ["/src/injectlinearticles.js"]
                });
            }
        }
    });
})();