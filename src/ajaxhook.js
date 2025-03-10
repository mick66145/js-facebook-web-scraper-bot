(function (dataAndEvents) {
    if (window["IPOTimerInstance"]) {
        console["log"]("force stop timer 2");
        clearTimeout(window["IPOTimerInstance"]);
    }
    /** @type {null} */
    window["IPOTimerInstance"] = null;
    if (window["IPO_Data"]) {
        return;
    }
    console["log"]("inject hook");
    window["IPO_Data"] = {
        "update": Date["now"](),
        "groups": {},
        "pages": {},
        "users": {},
        "members": {},
        "stories": {},
        "lineComments": {},
        "comemntsContainer": {},
        "updateCount": 0,
        "comemntsContainerCount": 0
    };
    /**
     * @param {Object} values
     * @return {?}
     */
    var init = function (values) {
        /** @type {null} */
        var post_id = null;
        if (values["feedback"]) {
            if (values["feedback"]["story"]) {
                if (values["feedback"]["story"]["feedback_context"]) {
                    if (values["feedback"]["story"]["feedback_context"]["feedback_target_with_context"]) {
                        if (values["feedback"]["story"]["feedback_context"]["feedback_target_with_context"]["subscription_target_id"]) {
                            post_id = values["feedback"]["story"]["feedback_context"]["feedback_target_with_context"]["subscription_target_id"];
                        }
                    }
                }
            }
        }
        /** @type {null} */
        var cDigit = null;
        if (values["context_layout"] && (values["context_layout"]["story"] && values["context_layout"]["story"]["id"])) {
            cDigit = atob(values["context_layout"]["story"]["id"]);
        } else {
            if (values["id"]) {
                cDigit = atob(values["id"]);
            }
        }
        /** @type {null} */
        var HEREGEX_OMIT = null;
        /** @type {null} */
        var nDigit = null;
        /** @type {null} */
        var n = null;
        return HEREGEX_OMIT = /^S:_I\d+:(VK:)?(?<post_id>\d+)(:\d+)?$/g, nDigit = HEREGEX_OMIT["exec"](cDigit), nDigit && (post_id = nDigit["groups"]["post_id"]), post_id;
    };
    /**
     * @param {Object} format
     * @return {?}
     */
    var parseFormat = function (format) {
        /** @type {null} */
        var parts = null;
        if (format["feedback"] && (format["feedback"]["story"] && format["feedback"]["story"]["url"])) {
            /** @type {RegExp} */
            var splatParam = /story_fbid=(?<post_fbid>pfbid[A-Za-z0-9]+)/g;
            var packet = splatParam["exec"](format["feedback"]["story"]["url"]);
            if (packet) {
                parts = packet["groups"]["post_fbid"];
            } else {
                /** @type {RegExp} */
                splatParam = /posts\/(?<post_fbid>pfbid[A-Za-z0-9]+)/g;
                packet = splatParam["exec"](format["feedback"]["story"]["url"]);
                if (packet) {
                    parts = packet["groups"]["post_fbid"];
                }
            }
        }
        return parts;
    };
    /**
     * @param {Object} value
     * @return {?}
     */
    var iterator = function (value) {
        /** @type {null} */
        var num = null;
        /** @type {RegExp} */
        var r20 = /^(?<post_id>\d+)_(\w+)$/g;
        var round = r20["exec"](value["commentId"]);
        return round && (num = round["groups"]["post_id"]), num;
    };
    /**
     * @param {Object} message
     * @return {undefined}
     */
    var callback = function (message) {
        if (message["sponsored_data"]) {
            return;
        }
        var md = init(message["comet_sections"]);
        if (md) {
            console["log"](message);
            window["IPO_Data"]["stories"][md] = message["comet_sections"];
        }
        var parts = parseFormat(message["comet_sections"]);
        if (parts) {
            window["IPO_Data"]["stories"][parts] = message["comet_sections"];
        }
    };
    /**
     * @param {Object} rowData
     * @return {undefined}
     */
    var update = function (rowData) {
        if (rowData["group_membership"] && rowData["group_membership"]["associated_group"]) {
            var done = rowData["group_membership"]["associated_group"];
            if (!window["IPO_Data"]["members"][done["id"]]) {
                window["IPO_Data"]["members"][done["id"]] = {
                    "feed_id": done["id"],
                    "members": {}
                };
            }
            if (!window["IPO_Data"]["members"][done["id"]]["members"][rowData["id"]]) {
                /** @type {null} */
                var type = null;
                if (rowData["__typename"] == "User") {
                    /** @type {string} */
                    type = "user";
                } else {
                    if (rowData["__typename"] == "Page") {
                        /** @type {string} */
                        type = "page";
                    }
                }
                if (type) {
                    window["IPO_Data"]["members"][done["id"]]["members"][rowData["id"]] = {
                        "id": rowData["id"],
                        "name": rowData["name"],
                        "type": type
                    };
                }
            }
        }
    };
    /** @type {function (new:XMLHttpRequest): ?} */
    var _XMLHttpRequest = XMLHttpRequest;
    /**
     * @return {?}
     */
    XMLHttpRequest = function () {
        /** @type {XMLHttpRequest} */
        var ElementPrototype = new _XMLHttpRequest;
        return ElementPrototype["addEventListener"]("load", function (response) {
            if (response["target"]) {
                if (response["target"]["status"] == 200 && response["target"]["responseURL"]) {
                    if (response["target"]["responseURL"]["startsWith"]("https://linevoom.line.me/api/")) {
                        var urn = response["target"]["responseURL"];
                        var body = response["target"]["response"];
                        if (urn["startsWith"]("https://linevoom.line.me/api/comment/getList")) {
                            var cache = JSON["parse"](body);
                            if (cache["resultMsg"] == "OK") {
                                if (cache["data"]["commentList"]) {
                                    cache["data"]["commentList"]["forEach"](function (value) {
                                        var key = iterator(value);
                                        value["postId"] = key;
                                        if (!window["IPO_Data"]["lineComments"][key]) {
                                            window["IPO_Data"]["lineComments"][key] = {};
                                        }
                                        /** @type {Object} */
                                        window["IPO_Data"]["lineComments"][key][value["commentId"]] = value;
                                        window["IPO_Data"]["update"] = Date["now"]();
                                    });
                                }
                            }
                        }
                    } else {
                        if (response["target"]["responseURL"] == "https://www.facebook.com/api/graphql/") {
                            if (response["target"]["response"]) {
                                var forEach = response["target"]["response"]["split"]("\n");
                                forEach["forEach"](function (body) {
                                    var message = JSON["parse"](body);
                                    if (message) {
                                        console["log"](message);
                                        if (message["data"]) {
                                            var result = message["data"];
                                            window["IPO_Data"]["update"] = Date["now"]();
                                            if (result["group"] && (result["group"]["profile_header_renderer"] && result["group"]["profile_header_renderer"]["group"])) {
                                                var modules = result["group"]["profile_header_renderer"]["group"];
                                                window["IPO_Data"]["groups"][modules["id"]] = modules;
                                            }
                                            if (result["user"] && (result["user"]["profile_header_renderer"] && result["user"]["profile_header_renderer"]["user"])) {
                                                var done = result["user"]["profile_header_renderer"]["user"];
                                                window["IPO_Data"]["users"][done["id"]] = done;
                                            }
                                            if (result["viewer"]) {
                                                if (result["viewer"]["actor"]) {
                                                    if (result["viewer"]["actor"]["groups"]) {
                                                        if (result["viewer"]["actor"]["groups"]["edges"]) {
                                                            result["viewer"]["actor"]["groups"]["edges"]["forEach"](function (pair) {
                                                                if (pair["node"] && pair["node"]["__typename"] == "Group") {
                                                                    var done = pair["node"];
                                                                    window["IPO_Data"]["groups"][done["id"]] = done;
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                            if (result["node"] && result["node"]["comet_hovercard_renderer"]) {
                                                if (result["node"]["comet_hovercard_renderer"]["actor"]) {
                                                    var credentials = result["node"]["comet_hovercard_renderer"]["actor"];
                                                    if (credentials["__typename"] == "User") {
                                                        window["IPO_Data"]["users"][credentials["id"]] = credentials;
                                                    }
                                                    if (credentials["__typename"] == "Page") {
                                                        window["IPO_Data"]["pages"][credentials["id"]] = credentials;
                                                    }
                                                    if (credentials["__typename"] == "Group") {
                                                        window["IPO_Data"]["groups"][credentials["id"]] = credentials;
                                                    }
                                                } else {
                                                    if (result["node"]["comet_hovercard_renderer"]["user"]) {
                                                        done = result["node"]["comet_hovercard_renderer"]["user"];
                                                        window["IPO_Data"]["users"][done["id"]] = done;
                                                    }
                                                    if (result["node"]["comet_hovercard_renderer"]["page"]) {
                                                        var page = result["node"]["comet_hovercard_renderer"]["page"];
                                                        window["IPO_Data"]["pages"][page["id"]] = page;
                                                    }
                                                    if (result["node"]["comet_hovercard_renderer"]["group"]) {
                                                        modules = result["node"]["comet_hovercard_renderer"]["group"];
                                                        window["IPO_Data"]["groups"][modules["id"]] = modules;
                                                    }
                                                }
                                            }
                                            if (result["node"] && result["node"]["comment_rendering_instance_for_feed_location"]) {
                                                var escapes = atob(result["node"]["id"]);
                                                var key = escapes["match"](/feedback:(.*)/)[1];
                                                if (!window["IPO_Data"]["comemntsContainer"]) {
                                                    window["IPO_Data"]["comemntsContainer"] = {};
                                                }
                                                if (!window["IPO_Data"]["comemntsContainer"][key]) {
                                                    /** @type {Array} */
                                                    window["IPO_Data"]["comemntsContainer"][key] = [];
                                                }
                                                if (result["node"]["comment_rendering_instance_for_feed_location"]["comments"]) {
                                                    if (result["node"]["comment_rendering_instance_for_feed_location"]["comments"]["edges"]) {
                                                        result["node"]["comment_rendering_instance_for_feed_location"]["comments"]["edges"]["forEach"](function (pair) {
                                                            if (pair["node"]) {
                                                                /** @type {null} */
                                                                var type = null;
                                                                /** @type {string} */
                                                                var output = "";
                                                                /** @type {Array} */
                                                                var paths = [];
                                                                if (pair["node"]["author"]["__typename"] == "User") {
                                                                    /** @type {string} */
                                                                    type = "user";
                                                                } else {
                                                                    if (pair["node"]["author"]["__typename"] == "Page") {
                                                                        /** @type {string} */
                                                                        type = "page";
                                                                    }
                                                                }
                                                                if (pair["node"]["body"] && pair["node"]["body"]["text"]) {
                                                                    output = pair["node"]["body"]["text"];
                                                                } else {
                                                                    /** @type {string} */
                                                                    output = "";
                                                                }
                                                                if (pair["node"]["body"]) {
                                                                    if (pair["node"]["body"]["ranges"]) {
                                                                        pair["node"]["body"]["ranges"]["forEach"](function (result) {
                                                                            var errorName = pair["node"]["body"]["text"]["substring"](result["offset"], result["offset"] + result["length"]);
                                                                            if (result["entity"]["__typename"] == "User") {
                                                                                /** @type {string} */
                                                                                type = "user";
                                                                            } else {
                                                                                if (result["entity"]["__typename"] == "Page") {
                                                                                    /** @type {string} */
                                                                                    type = "page";
                                                                                }
                                                                            }
                                                                            var args = {
                                                                                "profile_id": result["entity"]["id"],
                                                                                "type": type,
                                                                                "name": errorName
                                                                            };
                                                                            paths["push"](args);
                                                                        });
                                                                    }
                                                                }
                                                                var defaults = {
                                                                    "id": pair["node"]["legacy_token"],
                                                                    "message": output,
                                                                    "from": {
                                                                        "name": pair["node"]["author"]["name"],
                                                                        "profile_id": pair["node"]["author"]["id"],
                                                                        "type": type
                                                                    },
                                                                    "created_timestamp": pair["node"]["created_time"],
                                                                    "message_tags": paths
                                                                };
                                                                window["IPO_Data"]["comemntsContainer"][key]["push"](defaults);
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                            if (result["page"]) {
                                                if (result["page"]["__typename"] == "Page") {
                                                    if (result["page"]["id"]) {
                                                        if (result["page"]["comet_page_cover_renderer"]) {
                                                            window["IPO_Data"]["pages"][result["page"]["id"]] = result["page"];
                                                        }
                                                    }
                                                }
                                            }
                                            if (result["node"]) {
                                                if (result["node"]["__typename"] == "Story") {
                                                    if (result["node"]["comet_sections"]) {
                                                        callback(result["node"]);
                                                    }
                                                }
                                            }
                                            if (result["node"]) {
                                                if (result["node"]["new_members"]) {
                                                    if (result["node"]["__typename"] == "Group") {
                                                        if (result["node"]["new_members"]["edges"]) {
                                                            result["node"]["new_members"]["edges"]["forEach"](function (pair) {
                                                                if (pair["node"]) {
                                                                    update(pair["node"]);
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                            if (result["node"]) {
                                                if (result["node"]["group_feed"]) {
                                                    if (result["node"]["__typename"] == "Group") {
                                                        if (result["node"]["group_feed"]["edges"]) {
                                                            result["node"]["group_feed"]["edges"]["forEach"](function (pair) {
                                                                if (pair["node"]["__typename"] == "Story") {
                                                                    if (pair["node"]["comet_sections"]) {
                                                                        callback(pair["node"]);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                            if (result["user"]) {
                                                if (result["user"]["timeline_list_feed_units"]) {
                                                    if (result["user"]["timeline_list_feed_units"]["edges"]) {
                                                        result["user"]["timeline_list_feed_units"]["edges"]["forEach"](function (pair) {
                                                            if (pair["node"]) {
                                                                if (pair["node"]["__typename"] == "Story") {
                                                                    if (pair["node"]["comet_sections"]) {
                                                                        callback(pair["node"]);
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                            if (result["nodes"]) {
                                                result["nodes"]["forEach"](function (err) {
                                                    if (err["__typename"] == "Story") {
                                                        if (err["comet_sections"]) {
                                                            callback(err);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }), ElementPrototype;
    };
})();
