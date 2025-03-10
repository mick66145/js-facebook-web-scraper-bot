setTimeout(function () {
  $["noConflict"]();
  /**
   * @return {undefined}
   */
  window["iplusone_script_" + config["version"]] = function () {
    /**
     * @param {?} message
     * @return {undefined}
     */
    function onSuccess(message) {
      console["log"](message);
      if (message["operation"] == "checkReactFacebookPostInfo") {
        remove()["find"](".IPO_Query")["remove"]();
        if (message["status"] == "success") {
          $(function () {
            jQuery("div.IPO_Inject")["remove"]();
            run(message["response"]);
          }, 100);
        } else {
          $(function () {
            jQuery("div.IPO_Inject")["remove"]();
            replace();
          }, 100);
        }
      } else {
        if (message["operation"] == "uploadReactFacebookComments") {
          remove()["find"](".IPO_Uploading")["remove"]();
          $(function () {
            replace();
          }, 100);
        }
      }
    }
    var $cookies = {
      "NO_STORY": "\u6587\u7ae0\u6293\u53d6\u5931\u6557\uff0c\u8acb\u91cd\u65b0\u6574\u7406",
      "POST_ID_MISMATCH": "\u6587\u7ae0ID\u6293\u53d6\u5931\u6557\uff0c\u8acb\u91cd\u65b0\u6574\u7406",
      "RENAMED_GROUP_ID": "\u793e\u7fa4ID\u6293\u53d6\u5931\u6557\uff0c\u8acb\u91cd\u65b0\u6574\u7406"
    };
    /** @type {boolean} */
    var b = false;
    if (config["version"] != "DEV") {
      /** @type {boolean} */
      b = false;
    }
    if (window["IPOTimerInstance"]) {
      console["log"]("force stop timer 0");
      clearTimeout(window["IPOTimerInstance"]);
    }
    /** @type {null} */
    window["IPOTimerInstance"] = null;
    /** @type {boolean} */
    var val = false;
    /** @type {boolean} */
    var msg = true;
    /** @type {boolean} */
    var e = false;
    jQuery("div.iplusone_loaded_" + config["version"])["remove"]();
    jQuery("div.IPO_Comment_Status")["remove"]();
    if (!window["iplusone_post_" + config["version"]]) {
      window["iplusone_post_" + config["version"]] = {};
      /** @type {null} */
      window["iplusone_post_" + config["version"]]["feed_info"] = null;
      /** @type {null} */
      window["iplusone_post_" + config["version"]]["story_info"] = null;
      /** @type {null} */
      window["iplusone_post_" + config["version"]]["post_info"] = null;
      /** @type {null} */
      window["iplusone_post_" + config["version"]]["post_snapshot_info"] = null;
      /** @type {string} */
      window["iplusone_post_" + config["version"]]["post_snapshot_id"] = "";
      /** @type {boolean} */
      window["iplusone_post_" + config["version"]]["iplusone_loaded"] = false;
      /** @type {null} */
      window["iplusone_post_" + config["version"]]["ext_url"] = null;
      /** @type {null} */
      window["iplusone_post_" + config["version"]]["post_id"] = null;
    }
    var results = window["iplusone_post_" + config["version"]];
    /** @type {null} */
    results["feed_info"] = null;
    /** @type {null} */
    results["story_info"] = null;
    /** @type {null} */
    results["post_info"] = null;
    /** @type {null} */
    results["post_snapshot_info"] = null;
    /** @type {null} */
    var self = null;
    /** @type {number} */
    var h = 0;
    /** @type {number} */
    var ext = 0;
    /** @type {number} */
    var j = 0;
    /** @type {null} */
    var attr = null;
    /** @type {Array} */
    var x = [];
    console["log"](window["location"]);
    if (results["iplusone_loaded"]) {
      jQuery(document)["ready"](function () {
        console["log"]("post inited");
        if (window["IPO_Data"]) {
          window["IPO_Data"]["update"] = Date["now"]();
          /** @type {number} */
          window["IPO_Data"]["comemntsContainerCount"] = 0;
        }
        success();
      });
    } else {
      jQuery(document)["ready"](function () {
        console["log"]("post un-inited");
        initialize();
        /** @type {boolean} */
        results["iplusone_loaded"] = true;
        success();
      });
    }
    /**
     * @param {Object} node
     * @return {?}
     */
    var push = function (node) {
      if (!node) {
        return null;
      }
      /** @type {Array} */
      var forEach = ["^https://www\\.facebook\\.com/[A-Za-z0-9\\._]+/posts/(?<post_id>\\d+|pfbid[A-Za-z0-9]+)", "^https://www\\.facebook\\.com/[A-Za-z0-9\\._]+/videos/(?<post_id>\\d+)", "^https://www\\.facebook\\.com/photo\\.php\\?fbid=(?<post_id>\\d+)&set=a\\.\\d+\\.\\d+\\.\\d+", "^https://www\\.facebook\\.com/photo\\.php\\?fbid=(?<post_id>\\d+)&set=a\\.\\d+([A-Za-z0-9\\._&=]+)", "^https://www\\.facebook\\.com/[A-Za-z0-9\\._]+/photos/a\\.\\d+\\.\\d+\\.\\d+/(?<post_id>\\d+)", "^https://www\\.facebook\\.com/groups/[A-Za-z0-9\\._]+/permalink/(?<post_id>\\d+)",
        "^https://www\\.facebook\\.com/permalink\\.php\\?story_fbid=(?<post_id>\\d+|pfbid[A-Za-z0-9]+)&id=(\\d+)", "^https://www\\.facebook\\.com/[A-Za-z0-9\\._]+/photos/a\\.\\d+/(?<post_id>\\d+)/[A-Za-z0-9\\._&?]+", "^https://www\\.facebook\\.com/story\\.php\\?story_fbid=(?<post_id>\\d+)&id=\\d+", "^https://www\\.facebook\\.com/groups/[A-Za-z0-9\\._]+/posts/(?<post_id>\\d+)/?(\\?\\w+=\\w+(&\\w+=\\w+)*)?$", "^https://www\\.facebook\\.com/groups/[A-Za-z0-9\\._]+/?\\?multi_permalinks=(?<post_id>\\d+)",
        "^https://www\\.facebook\\.com/groups/[A-Za-z0-9\\._]+/posts/[\\w%-]+/(?<post_id>\\d+)/?(\\?\\w+=\\w+(&\\w+=\\w+)*)?$"];
      /** @type {Array} */
      var data = [];
      forEach["forEach"](function (punctuation) {
        data["push"](new RegExp(punctuation));
      });
      /** @type {number} */
      var i = 0;
      for (; i < data["length"]; i++) {
        var groups = node["match"](data[i]);
        if (groups && groups["groups"]) {
          return groups["groups"]["post_id"];
        }
      }
      return null;
    };
    /**
     * @param {Object} object
     * @return {?}
     */
    var getOwnPropertyNames = function (object) {
      var ret = {};
      var stack = object["split"]("&");
      /** @type {number} */
      var i = 0;
      for (; i < stack["length"]; i++) {
        if (stack[i]) {
          var p = stack[i]["split"]("=");
          /** @type {string} */
          ret[p[0]] = decodeURIComponent(p[1]);
        }
      }
      return ret;
    };
    /**
     * @return {undefined}
     */
    var initialize = function () {
      jQuery(document)["on"]("click", "#iplusone-import_" + config["version"], function () {
        self["postMessage"]({
          "operation": "reactFbImport",
          "post_info": results["post_info"]
        });
      });
      jQuery(document)["on"]("click", "#iplusone-link_" + config["version"], function () {
        self["postMessage"]({
          "operation": "reactFbLink",
          "post_info": results["post_info"]
        });
      });
      jQuery(document)["on"]("click", "#iplusone-reload_" + config["version"], function () {
        window["location"]["reload"]();
      });
      jQuery(document)["on"]("click", "#iplusone-login_" + config["version"], function () {
        /** @type {string} */
        var myPanel = "https://" + config["domain"] + "/seller/sellerlogin";
        window["open"](myPanel, "_blank");
      });
      jQuery(document)["on"]("click", "#iplusone-group_" + config["version"], function () {
        var myPanel = "https://" + config["domain"] + "/seller/sellerorders?post_snapshot_id=" + results["post_snapshot_id"];
        window["open"](myPanel, "_blank");
      });
      jQuery(document)["on"]("click", "#iplusone-upload_" + config["version"], function () {
        jQuery("#iplusone-upload_" + config["version"])["hide"]();
        start();
      });
    };
    /**
     * @return {?}
     */
    var check = function () {
      var result = jQuery();
      var row = jQuery('div[data-pagelet="page"]:visible');
      if (row["length"] == 0) {
        row = jQuery('div.__fb-light-mode.x1n2onr6.x1vjfegm:visible div.x78zum5.xdt5ytf.x1iyjqo2[role="dialog"]');
      }
      if (row["length"] == 0) {
        row = jQuery('div.__fb-dark-mode.x1n2onr6.x1vjfegm:visible div.x78zum5.xdt5ytf.x1iyjqo2[role="dialog"]');
      }
      if (row["length"] == 0) {
        row = jQuery("div.x78zum5.xdt5ytf.x10cihs4.x1t2pt76.x1n2onr6.x1ja2u2z:visible");
      }
      if (row["length"] > 0) {
        var find = row["first"]();
        if (result["length"] == 0) {
          result = find["find"]('div.__fb-light-mode.x1qjc9v5.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k.xshlqvt div[role="dialog"]')["first"]();
        }
        if (result["length"] == 0) {
          result = find["find"]('div.__fb-dark-mode.x1qjc9v5.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k.xshlqvt div[role="dialog"]')["first"]();
        }
        if (result["length"] == 0) {
          result = find["find"]('div[aria-posinset="1"]')["first"]();
        }
        if (result["length"] == 0) {
          result = find["find"]('div[aria-labelledby^="jsc_c_"][role="article"]')["first"]();
        }
        if (result["length"] == 0) {
          result = find["find"]('div[aria-labelledby^="jsc_c_"]')["first"]();
        }
        if (result["length"] == 0) {
          result = find["find"]('div.xh8yej3.x1t2pt76.x193iq5w.xdt5ytf.x78zum5.x6s0dn4[role="main"]')["first"]();
        }
      }
      return result;
    };
    /**
     * @return {?}
     */
    var remove = function () {
      var scripts = jQuery();
      return scripts["length"] == 0 && (scripts = check()["find"]("div.x10wlt62.x6ikm8r.x9jhf4c.x30kzoy.x13lgxp2.x168nmei")["prev"]()), scripts["length"] == 0 && (scripts = check()["find"]("div.x10wlt62.x6ikm8r.x9jhf4c.x30kzoy.x13lgxp2.x168nmei")), scripts["length"] == 0 && (scripts = check()["find"]("div.x10wlt62.x6ikm8r.x1a2w583.x1ia1hqs.xeyy32k.xabvvm4")), scripts;
    };
    /**
     * @return {undefined}
     */
    var success = function () {
      if (window["IPOTimerInstance"]) {
        console["log"]("force stop timer 1");
        clearTimeout(window["IPOTimerInstance"]);
      }
      /** @type {null} */
      window["IPOTimerInstance"] = null;
      /** @type {number} */
      ext = 0;
      results["post_id"] = push(window["location"]["href"]);
      console["log"]("post id: %s", results["post_id"]);
      var source = window["location"]["search"]["substring"](1);
      var delayedStream = getOwnPropertyNames(source);
      if (delayedStream["ipo_no_ext"] == "1") {
        return;
      }
      self = chrome["runtime"]["connect"](window["IPO_extension_id"], {
        "name": "ipo_ext"
      });
      self["onMessage"]["addListener"](onSuccess);
      chrome["runtime"]["sendMessage"](window["IPO_extension_id"], {
        "operation": "getSess",
        "source": "post"
      }, null, function (map) {
        console["log"](map);
        val = map["execute_from_ext"];
        attr = map["source"];
        results["ext_url"] = map["extUrl"];
        var scripts = jQuery("div.IPO_Inject");
        if (scripts["length"] != 0) {
          console["log"]("already inject");
          var i = push(window["location"]["href"]);
          if (i) {
            parse("already inject");
          }
          return;
        }
        /** @type {string} */
        var restoreScript = '<div class="IPO_Inject"></div>';
        jQuery('div[id^="mount_0_0"]')["append"](restoreScript);
        if (window["location"]["hostname"] != "www.facebook.com") {
          return;
        } else {
          if (!results["post_id"]) {
            return;
          } else {
            if (map["cookie"] && (map["cookie"]["value"] && (map["brand"] && map["brand"]["value"])) || b) {
              chrome["runtime"]["sendMessage"](window["IPO_extension_id"], {
                "operation": "getBotAutoStatus"
              }, null, function (message) {
                console["log"](message);
                msg = message["bot_status"];
                if (!msg) {
                  if (val) {
                    /** @type {boolean} */
                    msg = true;
                  }
                }
                setup();
              });
            } else {
              /** @type {string} */
              var r20 = '<div class="IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_' + config["version"] + '">';
              r20 += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
              r20 += '<button class="btn btn-sm btn-danger ml-2" id="iplusone-login_' + config["version"] + '">\u8acb\u5148\u767b\u5165\u611b+1\u7cfb\u7d71\u5f8c\u53f0</button>';
              r20 += "</div>";
              $(function () {
                remove()["prepend"](r20);
                jQuery("div.IPO_Inject")["remove"]();
              }, 2500);
            }
          }
        }
      });
    };
    /**
     * @param {Function} fn
     * @param {number} opt_attributes
     * @return {undefined}
     */
    var $ = function (fn, opt_attributes) {
      if (window["IPOTimerInstance"]) {
        clearTimeout(window["IPOTimerInstance"]);
      }
      /** @type {number} */
      window["IPOTimerInstance"] = setTimeout(function () {
        /** @type {null} */
        window["IPOTimerInstance"] = null;
        fn();
      }, opt_attributes);
    };
    /**
     * @param {Object} data
     * @return {undefined}
     */
    var done = function (data) {
      if (data["sponsored_data"]) {
        return;
      }
      var inkey = error(data["comet_sections"]);
      if (inkey) {
        window["IPO_Data"]["stories"][inkey] = data["comet_sections"];
      }
      var i = log(data["comet_sections"]);
      if (i) {
        window["IPO_Data"]["stories"][i] = data["comet_sections"];
      }
    };
    /**
     * @return {undefined}
     */
    var setup = function () {
      chrome["runtime"]["sendMessage"](window["IPO_extension_id"], {
        "operation": "getScripts",
        "source": "post"
      }, null, function (message) {
        console["log"](message);
        x = message["scripts"];
        update();
      });
    };
    /**
     * @return {undefined}
     */
    var update = function () {
      var i = push(window["location"]["href"]);
      if (!i) {
        return;
      }
      console["log"]("checkContent");
      ext++;
      var R = jQuery("div.w0hvl6rk.qjjbsfad span")["first"]()["text"]();
      if (R) {
        if (R == "\u4f60\u76ee\u524d\u7121\u6cd5\u4f7f\u7528\u9019\u9805\u529f\u80fd") {
          replace("BLOCK");
          return;
        } else {
          if (R == "\u76ee\u524d\u7121\u6cd5\u63d0\u4f9b\u6b64\u5167\u5bb9") {
            replace("DELETE");
            return;
          }
        }
      }
      if (ext > 80) {
        console["log"]("check_content_count more than 80", ext);
        var err = check();
        console["log"]("check article and ipo data", err, window["IPO_Data"]);
        if (err["length"] > 0 && window["IPO_Data"]) {
          console["log"]("checked, checkPostInfo");
          $(init, 1E3);
        } else {
          console["log"]("check failed, checkNext");
          replace();
        }
      } else {
        var scripts = jQuery(".iplusone_loaded_" + config["version"]);
        if (scripts["length"] > 0) {
          $(update, 100);
        } else {
          err = check();
          if (err["length"] > 0) {
            if (window["IPO_Data"]) {
              var p = remove()["find"](".IPO_Prepard");
              if (p["length"] == 0) {
                /** @type {string} */
                var r20 = '<div class="IPO_Prepard clearfix mt-1 ml-2">';
                r20 += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
                r20 += '<span class="ml-2">Waiting...<span id="IPO_Prepard_Text"></span></span>';
                r20 += "</div>";
                remove()["prepend"](r20);
              } else {
                var last = p["find"]("#IPO_Prepard_Text");
                last["text"](last["text"]() + ".");
              }
              if (window["IPO_Data"]["update"] > 0 && window["IPO_Data"]["update"] + 2E3 > Date["now"]()) {
                $(update, 100);
              } else {
                console["log"]("ajax completed, checkPostInfo");
                $(init, 1E3);
              }
            } else {
              console["log"]("checkPostInfo");
              $(init, 1E3);
            }
          } else {
            $(update, 100);
          }
        }
      }
    };
    /**
     * @param {Object} message
     * @return {undefined}
     */
    var run = function (message) {
      jQuery("div.IPO_Inject")["remove"]();
      /** @type {string} */
      var later = "";
      if (message["code"] == 200) {
        var result = message["data"];
        results["post_snapshot_info"] = result;
        if (b) {
          /** @type {string} */
          result["status"] = "IMPORTED";
        }
        if (result["status"] == "IMPORTED" || result["status"] == "NOT_RUNNING") {
          results["post_snapshot_id"] = result["post_snapshot_id"];
          if (result["status"] == "IMPORTED") {
            /** @type {string} */
            later = '<div class="IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_' + config["version"] + '">';
            later += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
            later += '<button class="btn btn-sm btn-outline-danger disabled ml-2">\u5df2\u532f\u5165\u7cfb\u7d71</button>';
            later += '<button class="btn btn-sm btn-success ml-2" id="iplusone-reload_' + config["version"] + '">\u66f4\u65b0\u7559\u8a00</button>';
            later += '<button class="btn btn-sm btn-info ml-2" id="iplusone-group_' + config["version"] + '">\u524d\u5f80\u5f8c\u53f0</button>';
            if (!msg) {
              later += '<button class="btn btn-sm btn-warning ml-2" id="iplusone-upload_' + config["version"] + '">\u5c55\u958b\u7559\u8a00\u4e26\u4e0a\u50b3</button>';
            }
            later += "</div>";
            remove()["prepend"](later);
          } else {
            /** @type {string} */
            later = '<div class="IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_' + config["version"] + '">';
            later += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
            later += '<button class="btn btn-sm btn-outline-default disabled ml-2">\u5df2\u7d50\u675f</button>';
            later += '<button class="btn btn-sm btn-info ml-2" id="iplusone-group_' + config["version"] + '">\u524d\u5f80\u5f8c\u53f0</button>';
            if (!msg) {
              later += '<button class="btn btn-sm btn-warning ml-2" id="iplusone-upload_' + config["version"] + '">\u5c55\u958b\u7559\u8a00\u4e26\u4e0a\u50b3</button>';
            }
            later += "</div>";
            remove()["prepend"](later);
          }
          if (msg) {
            start();
          }
        } else {
          if (result["status"] == "NOT_IMPORT") {
            /** @type {string} */
            later = '<div class="IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_' + config["version"] + '">';
            later += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
            later += '<button class="btn btn-sm btn-primary ml-2" id="iplusone-import_' + config["version"] + '">\u5c1a\u672a\u532f\u5165</button>';
            later += '<button class="btn btn-sm btn-warning ml-2" id="iplusone-link_' + config["version"] + '">\u9023\u7d50\u958b\u5718</button>';
            later += "</div>";
            remove()["prepend"](later);
            replace();
          } else {
            if (result["status"] == "NOT_LINK") {
              /** @type {string} */
              later = '<div class="IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_' + config["version"] + '">';
              later += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
              later += '<button class="btn btn-sm btn-warning ml-2" id="iplusone-link_' + config["version"] + '">\u9023\u7d50\u958b\u5718</button>';
              later += "</div>";
              remove()["prepend"](later);
              replace();
            } else {
              if (result["status"] == "NOT_OWNER") {
                console["log"](message);
                /** @type {string} */
                later = '<div class="IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_' + config["version"] + '">';
                later += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
                later += '<button class="btn btn-sm btn-outline-danger disabled ml-2">\u975e\u8cbc\u6587\u64c1\u6709\u8005</button>';
                later += "</div>";
                remove()["prepend"](later);
                replace();
              } else {
                if (result["status"] == "UPLOADING") {
                  console["log"](message);
                  /** @type {string} */
                  later = '<div class="IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_' + config["version"] + '">';
                  later += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
                  later += '<button class="btn btn-sm btn-outline-danger disabled ml-2">\u7559\u8a00\u8655\u7406\u4e2d\uff0c\u8acb\u7a0d\u5f85</button>';
                  later += "</div>";
                  remove()["prepend"](later);
                  replace();
                } else {
                  /** @type {string} */
                  later = '<div class="iplusone_loaded_' + config["version"] + '">';
                  later += "</div>";
                  remove()["prepend"](later);
                  replace();
                }
              }
            }
          }
        }
      } else {
        if (message["code"] == 50308) {
          /** @type {string} */
          later = '<div class="IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_' + config["version"] + '">';
          later += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
          if (config["version"] == "DEV") {
            later += '<button class="btn btn-sm btn-danger ml-2">\u66f4\u65b0 Chrome Extension</button>';
          } else {
            later += '<a target="_blank" href="' + config["chrome_ext"] + '" class="btn btn-sm btn-danger ml-2">\u66f4\u65b0 Chrome Extension</a>';
          }
          later += "</div>";
          remove()["prepend"](later);
        } else {
          if (message["code"] == 50317) {
            /** @type {string} */
            later = '<div class="IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_' + config["version"] + '">';
            later += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
            later += '<button class="btn btn-sm btn-outline-danger disabled ml-2">\u5df2\u88ab\u5176\u4ed6\u5546\u5e97\u532f\u5165 [' + message["log_id"] + "]</button>";
            later += "</div>";
            remove()["prepend"](later);
            replace();
          } else {
            /** @type {string} */
            later = '<div class="IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_' + config["version"] + '">';
            later += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
            later += '<button class="btn btn-sm btn-outline-danger disabled ml-2">\u767c\u751f\u932f\u8aa4 [' + message["log_id"] + "]\uff1a" + message["message"] + "</button>";
            later += "</div>";
            remove()["prepend"](later);
            replace();
          }
        }
      }
    };
    /**
     * @param {Object} a
     * @return {?}
     */
    var cb = function (a) {
      if (!a) {
        return null;
      }
      var prefix;
      for (prefix in a) {
        if (prefix["startsWith"]("__reactFiber")) {
          return a[prefix];
        }
      }
      return null;
    };
    /**
     * @param {Object} object
     * @return {?}
     */
    var translate = function (object) {
      var result = {};
      result["id"] = object["id"];
      if (object["image"] && object["image"]["uri"]) {
        result["url"] = object["image"]["uri"];
      } else {
        if (object["photo_image"] && object["photo_image"]["uri"]) {
          result["url"] = object["photo_image"]["uri"];
        } else {
          if (object["thumbnailImage"] && object["thumbnailImage"]["uri"]) {
            result["url"] = object["thumbnailImage"]["uri"];
          } else {
            if (object["placeholder_image"]) {
              if (object["placeholder_image"]["uri"]) {
                result["url"] = object["placeholder_image"]["uri"];
              }
            }
          }
        }
      }
      return result;
    };
    /**
     * @param {Object} args
     * @return {?}
     */
    var func = function (args) {
      /** @type {Array} */
      var dots = [];
      var count = args["length"];
      /** @type {string} */
      var dot = "";
      /** @type {number} */
      var checkpoint = 0;
      /** @type {boolean} */
      var V = false;
      /** @type {boolean} */
      var W = false;
      /** @type {number} */
      var position = 0;
      for (; position < count; position++) {
        dot = args["charAt"](position);
        if (V) {
          if (dot == "\\") {
            if (W) {
              /** @type {boolean} */
              W = false;
            } else {
              /** @type {boolean} */
              W = true;
            }
          } else {
            if (dot == '"') {
              if (W) {
                /** @type {boolean} */
                W = false;
              } else {
                /** @type {boolean} */
                V = false;
              }
            } else {
              /** @type {boolean} */
              W = false;
            }
          }
        } else {
          if (dot == '"') {
            /** @type {boolean} */
            V = true;
            /** @type {boolean} */
            W = false;
          } else {
            if (dot == "{") {
              dots["push"](dot);
            } else {
              if (dot == "[") {
                dots["push"](dot);
              } else {
                if (dot == "}") {
                  var Y = dots.pop();
                  if (Y != "{") {
                    break;
                  }
                  if (dots["length"] == 0) {
                    /** @type {number} */
                    checkpoint = position + 1;
                    break;
                  }
                } else {
                  if (dot == "]") {
                    Y = dots.pop();
                    if (Y != "[") {
                      break;
                    }
                    if (dots["length"] == 0) {
                      /** @type {number} */
                      checkpoint = position + 1;
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (checkpoint) {
        return args["substring"](0, checkpoint);
      }
      return null;
    };
    /**
     * @param {?} elem
     * @param {Object} data
     * @return {undefined}
     */
    var callback = function (elem, data) {
      /** @type {null} */
      var S = null;
      S = elem["indexOf"]('[],["adp_CometGroupRootQueryRelayPreloader_');
      if (S >= 0) {
        /** @type {RegExp} */
        var pseudos = /\[\],\[\"adp_CometGroupRootQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var queue = pseudos["exec"](elem);
        if (queue) {
          var result = JSON["parse"](func(queue[1]));
          if (result && (result["__bbox"] && (result["__bbox"]["result"] && (result["__bbox"]["result"]["data"] && result["__bbox"]["result"]["data"]["group"])))) {
            data["feed"] = result["__bbox"]["result"]["data"]["group"];
            /** @type {null} */
            var config = null;
            if (data["feed"]["profile_header_renderer"]) {
              if (data["feed"]["profile_header_renderer"]["group"]) {
                if (data["feed"]["profile_header_renderer"]["group"]["id"]) {
                  if (data["feed"]["profile_header_renderer"]["group"]["name"]) {
                    if (data["feed"]["profile_header_renderer"]["group"]["__typename"]) {
                      config = data["feed"]["profile_header_renderer"]["group"];
                    }
                  }
                }
              }
            }
            if (data["feed"]["viewer_layout_renderer"] && (data["feed"]["viewer_layout_renderer"]["group"] && data["feed"]["viewer_layout_renderer"]["group"]["featurable_title"])) {
              var options = data["feed"]["viewer_layout_renderer"]["group"]["featurable_title"];
              if (options["text"]) {
                if (options["ranges"]) {
                  if (options["ranges"][0]) {
                    if (options["ranges"][0]["entity"]) {
                      if (options["ranges"][0]["entity"]["id"]) {
                        if (options["ranges"][0]["entity"]["__typename"]) {
                          config = options["ranges"][0]["entity"];
                          if (!config["name"]) {
                            config["name"] = options["text"];
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (config) {
              data["feed"] = config;
            }
          } else {
            if (result) {
              if (result["__bbox"]) {
                if (result["__bbox"]["result"]) {
                  if (result["__bbox"]["result"]["data"]) {
                    if (result["__bbox"]["result"]["data"]["group_address"]) {
                      if (!data["feed"] || !data["feed"]["name"]) {
                        data["feed"] = result["__bbox"]["result"]["data"];
                        /** @type {string} */
                        data["feed"]["__typename"] = "Group";
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return;
      }
      S = elem["indexOf"]('[],["adp_CometPagePostsRootHeaderQueryRelayPreloader_');
      if (S >= 0) {
        /** @type {RegExp} */
        pseudos = /\[\],\[\"adp_CometPagePostsRootHeaderQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        queue = pseudos["exec"](elem);
        if (queue) {
          result = JSON["parse"](func(queue[1]));
          if (result) {
            if (result["__bbox"]) {
              if (result["__bbox"]["result"]) {
                if (result["__bbox"]["result"]["data"]["page"]) {
                  data["feed"] = result["__bbox"]["result"]["data"]["page"];
                }
              }
            }
          }
        }
        return;
      }
      S = elem["indexOf"]('[],["adp_CometPagePostsRootQueryRelayPreloader_');
      if (S >= 0) {
        /** @type {RegExp} */
        pseudos = /\[\],\[\"adp_CometPagePostsRootQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        queue = pseudos["exec"](elem);
        if (queue) {
          result = JSON["parse"](func(queue[1]));
          if (result) {
            if (result["__bbox"]) {
              if (result["__bbox"]["result"]) {
                if (result["__bbox"]["result"]["data"]["page"]) {
                  data["feed"] = result["__bbox"]["result"]["data"]["page"];
                }
              }
            }
          }
        }
        return;
      }
      S = elem["indexOf"]('[],["adp_CometGroupPermalinkRootFeedQueryRelayPreloader_');
      if (S >= 0) {
        /** @type {RegExp} */
        pseudos = /\[\],\[\"adp_CometGroupPermalinkRootFeedQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        queue = pseudos["exec"](elem);
        if (queue) {
          result = JSON["parse"](func(queue[1]));
          if (result) {
            if (result["__bbox"]) {
              if (result["__bbox"]["result"]) {
                if (result["__bbox"]["result"]["data"]["node"]) {
                  done(result["__bbox"]["result"]["data"]["node"]);
                }
              }
            }
          }
        }
      }
      S = elem["indexOf"]('[],["adp_CometGroupPermalinkRootContentFeedQueryRelayPreloader_');
      if (S >= 0) {
        /** @type {RegExp} */
        pseudos = /\[\],\[\"adp_CometGroupPermalinkRootContentFeedQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        queue = pseudos["exec"](elem);
        if (queue) {
          result = JSON["parse"](func(queue[1]));
          if (result) {
            if (result["__bbox"]) {
              if (result["__bbox"]["result"]) {
                if (result["__bbox"]["result"]["data"]["node"]) {
                  done(result["__bbox"]["result"]["data"]["node"]);
                }
              }
            }
          }
        }
      }
      S = elem["indexOf"]('[],["adp_CometSinglePostRootQueryRelayPreloader_');
      if (S >= 0) {
        /** @type {RegExp} */
        pseudos = /\[\],\[\"adp_CometSinglePostRootQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        queue = pseudos["exec"](elem);
        if (queue) {
          result = JSON["parse"](func(queue[1]));
          if (result) {
            if (result["__bbox"]) {
              if (result["__bbox"]["result"]) {
                if (result["__bbox"]["result"]["data"]["node"]) {
                  done(result["__bbox"]["result"]["data"]["node"]);
                }
              }
            }
          }
        }
      }
      S = elem["indexOf"]('[],["adp_CometSinglePostContentQueryRelayPreloader_');
      if (S >= 0) {
        /** @type {RegExp} */
        pseudos = /\[\],\[\"adp_CometSinglePostContentQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        queue = pseudos["exec"](elem);
        if (queue) {
          result = JSON["parse"](func(queue[1]));
          if (result) {
            if (result["__bbox"]) {
              if (result["__bbox"]["result"]) {
                if (result["__bbox"]["result"]["data"]["node"]) {
                  done(result["__bbox"]["result"]["data"]["node"]);
                }
              }
            }
          }
        }
      }
      S = elem["indexOf"]('[],["adp_CometSinglePostDialogContentQueryRelayPreloader_');
      if (S >= 0) {
        /** @type {RegExp} */
        pseudos = /\[\],\[\"adp_CometSinglePostDialogContentQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        queue = pseudos["exec"](elem);
        if (queue) {
          result = JSON["parse"](func(queue[1]));
          if (result) {
            if (result["__bbox"]) {
              if (result["__bbox"]["result"]) {
                if (result["__bbox"]["result"]["data"]["node"]) {
                  done(result["__bbox"]["result"]["data"]["node"]);
                }
              }
            }
          }
        }
      }
      S = elem["indexOf"]('[],["adp_CometPagePostsRootHoistedStoryQueryRelayPreloader_');
      if (S >= 0) {
        /** @type {RegExp} */
        pseudos = /\[\],\[\"adp_CometPagePostsRootHoistedStoryQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        queue = pseudos["exec"](elem);
        if (queue) {
          result = JSON["parse"](func(queue[1]));
          if (result && (result["__bbox"] && result["__bbox"]["result"])) {
            if (result["__bbox"]["result"]["data"]["node"]) {
              done(result["__bbox"]["result"]["data"]["node"]);
            } else {
              if (result["__bbox"]["result"]["data"]["nodes"]) {
                if (result["__bbox"]["result"]["data"]["nodes"]["length"] > 0) {
                  done(result["__bbox"]["result"]["data"]["nodes"][0]);
                }
              }
            }
          }
        }
      }
      S = elem["indexOf"]('[],["adp_CometGroupDiscussionRootSuccessQueryRelayPreloader_');
      if (S >= 0) {
        /** @type {RegExp} */
        pseudos = /\[\],\[\"adp_CometGroupDiscussionRootSuccessQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        queue = pseudos["exec"](elem);
        if (queue) {
          result = JSON["parse"](func(queue[1]));
          if (result) {
            if (result["__bbox"]) {
              if (result["__bbox"]["result"]) {
                if (result["__bbox"]["result"]["data"]["node"]) {
                  done(result["__bbox"]["result"]["data"]["node"]);
                }
              }
            }
          }
        }
      }
    };
    /**
     * @return {?}
     */
    var next = function () {
      var args = {
        "feed": null,
        "story": null,
        "isPageDelegate": false
      };
      if (!e) {
        if (window["document"]["scripts"]) {
          var unlock;
          for (unlock in Object["keys"](window["document"]["scripts"])) {
            var cache = window["document"]["scripts"][unlock];
            if (cache) {
              if (cache["tagName"] == "SCRIPT") {
                if (cache["type"] == "application/json") {
                  if (cache["textContent"]) {
                    callback(cache["textContent"], args);
                  }
                }
              }
            }
          }
        }
        if (x["length"] > 0) {
          x["forEach"](function (chunk) {
            callback(chunk, args);
          });
        }
        /** @type {boolean} */
        e = true;
      }
      if (args["feed"]) {
        if (args["feed"]["__typename"] == "Group") {
          window["IPO_Data"]["groups"][args["feed"]["id"]] = args["feed"];
        }
      }
      if (window["IPO_Data"]) {
        if (results["post_id"]) {
          if (window["IPO_Data"]["stories"][results["post_id"]]) {
            args["story"] = window["IPO_Data"]["stories"][results["post_id"]];
          }
        }
      }
      if (args["story"] && !args["feed"]) {
        /** @type {null} */
        var rowData = null;
        if (args["story"]["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"] && (args["story"]["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]["action_link"] && args["story"]["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]["action_link"]["group"])) {
          rowData = args["story"]["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]["action_link"]["group"];
          /** @type {string} */
          rowData["__typename"] = "Group";
        } else {
          if (args["story"]["context_layout"]["story"]["comet_sections"]["title"]["story"].to) {
            rowData = args["story"]["context_layout"]["story"]["comet_sections"]["title"]["story"].to;
          } else {
            rowData = args["story"]["context_layout"]["story"]["comet_sections"]["title"]["story"]["actors"][0];
          }
        }
        if (rowData) {
          console["log"](rowData);
          if (rowData["__typename"] == "User") {
            if (window["IPO_Data"]) {
              if (window["IPO_Data"]["users"][rowData["id"]]) {
                args["feed"] = window["IPO_Data"]["users"][rowData["id"]];
              }
            }
          } else {
            if (rowData["__typename"] == "Page") {
              if (window["IPO_Data"]) {
                if (window["IPO_Data"]["pages"][rowData["id"]]) {
                  args["feed"] = window["IPO_Data"]["pages"][rowData["id"]];
                }
              }
            } else {
              if (rowData["__typename"] == "Group") {
                if (window["IPO_Data"]) {
                  if (window["IPO_Data"]["groups"][rowData["id"]]) {
                    args["feed"] = window["IPO_Data"]["groups"][rowData["id"]];
                  }
                }
              }
            }
          }
          if (!args["feed"]) {
            args["feed"] = {
              "__typename": rowData["__typename"],
              "id": rowData["id"],
              "name": rowData["name"]
            };
          }
        }
      }
      if (args["story"]) {
        var pageY = args["story"];
        /** @type {null} */
        var index = null;
        if (pageY["context_layout"]["story"]["comet_sections"] && (pageY["context_layout"]["story"]["comet_sections"]["action_link"] && pageY["context_layout"]["story"]["comet_sections"]["action_link"]["group"])) {
          index = pageY["context_layout"]["story"]["comet_sections"]["action_link"]["group"]["id"];
        } else {
          if (pageY["context_layout"]["story"]["comet_sections"]["title"]) {
            if (pageY["context_layout"]["story"]["comet_sections"]["title"]["story"]) {
              if (pageY["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]) {
                if (pageY["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]["action_link"]) {
                  if (pageY["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]["action_link"]["group"]) {
                    index = pageY["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]["action_link"]["group"]["id"];
                  }
                }
              }
            }
          }
        }
        if (index) {
          if (!args["feed"] || args["feed"] && args["feed"]["id"] != index) {
            if (window["IPO_Data"]) {
              if (window["IPO_Data"]["groups"][index]) {
                args["feed"] = window["IPO_Data"]["groups"][index];
                console["log"]("use cache feed %o", args["feed"]);
              }
            }
          }
        }
      }
      return args["story"] && (args["story"]["footer"] && (args["story"]["footer"]["story"] && (args["story"]["footer"]["story"]["delegate_page_id"] && (args["feed"] && (args["feed"]["id"] = args["story"]["footer"]["story"]["delegate_page_id"], args["feed"]["__typename"] = "Page", args["isPageDelegate"] = true))))), args;
    };
    /**
     * @param {string} key
     * @return {undefined}
     */
    var parse = function (key) {
      if (key) {
        var value = $cookies[key];
        if (value) {
          /** @type {string} */
          var r20 = '<div class="IPO_Container IPO_Query clearfix mt-1 ml-2">';
          r20 += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
          r20 += '<span class="ml-2 text-danger">' + value + "</span>";
          r20 += '<button class="btn btn-sm btn-danger ml-2" id="iplusone-reload_' + config["version"] + '">\u91cd\u65b0\u6574\u7406</button>';
          r20 += "</div>";
          remove()["prepend"](r20);
        }
        jQuery("div.IPO_Inject")["remove"]();
        replace();
      }
    };
    /**
     * @param {Object} collection
     * @return {?}
     */
    var error = function (collection) {
      /** @type {null} */
      var post_id = null;
      if (collection["feedback"]) {
        if (collection["feedback"]["story"]) {
          if (collection["feedback"]["story"]["feedback_context"]) {
            if (collection["feedback"]["story"]["feedback_context"]["feedback_target_with_context"]) {
              if (collection["feedback"]["story"]["feedback_context"]["feedback_target_with_context"]["subscription_target_id"]) {
                post_id = collection["feedback"]["story"]["feedback_context"]["feedback_target_with_context"]["subscription_target_id"];
              }
            }
          }
        }
      }
      /** @type {null} */
      var cDigit = null;
      if (collection["context_layout"] && (collection["context_layout"]["story"] && collection["context_layout"]["story"]["id"])) {
        cDigit = atob(collection["context_layout"]["story"]["id"]);
      } else {
        if (collection["id"]) {
          cDigit = atob(collection["id"]);
        }
      }
      /** @type {null} */
      var HEREGEX_OMIT = null;
      /** @type {null} */
      var nDigit = null;
      /** @type {null} */
      var V = null;
      return HEREGEX_OMIT = /^S:_I\d+:(VK:)?(?<post_id>\d+)(:\d+)?$/g, nDigit = HEREGEX_OMIT["exec"](cDigit), nDigit && (post_id = nDigit["groups"]["post_id"]), post_id;
    };
    /**
     * @param {Object} txt
     * @return {?}
     */
    var log = function (txt) {
      /** @type {null} */
      var n = null;
      /** @type {null} */
      var value = null;
      if (txt["feedback"] && (txt["feedback"]["story"] && txt["feedback"]["story"]["url"])) {
        value = txt["feedback"]["story"]["url"];
      } else {
        if (txt["feedback"] && (txt["feedback"]["story"] && (txt["feedback"]["story"]["comet_feed_ufi_container"] && (txt["feedback"]["story"]["comet_feed_ufi_container"]["story"] && txt["feedback"]["story"]["comet_feed_ufi_container"]["story"]["url"])))) {
          value = txt["feedback"]["story"]["comet_feed_ufi_container"]["story"]["url"];
        } else {
          if (txt["feedback"] && (txt["feedback"]["story"] && (txt["feedback"]["story"]["comet_feed_ufi_container"] && (txt["feedback"]["story"]["comet_feed_ufi_container"]["story"] && (txt["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"] && (txt["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"]["story"] && txt["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"]["story"]["url"])))))) {
            value = txt["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"]["story"]["url"];
          } else {
            if (txt["feedback"]) {
              if (txt["feedback"]["story"]) {
                if (txt["feedback"]["story"]["story_ufi_container"]) {
                  if (txt["feedback"]["story"]["story_ufi_container"]["story"]) {
                    if (txt["feedback"]["story"]["story_ufi_container"]["story"]["url"]) {
                      value = txt["feedback"]["story"]["story_ufi_container"]["story"]["url"];
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (value) {
        /** @type {RegExp} */
        var splatParam = /story_fbid=(?<post_fbid>pfbid[A-Za-z0-9]+)/g;
        var isFunction = splatParam["exec"](value);
        if (isFunction) {
          n = isFunction["groups"]["post_fbid"];
        } else {
          /** @type {RegExp} */
          splatParam = /posts\/(?<post_fbid>pfbid[A-Za-z0-9]+)/g;
          isFunction = splatParam["exec"](value);
          if (isFunction) {
            n = isFunction["groups"]["post_fbid"];
          }
        }
      }
      return n;
    };
    /**
     * @return {undefined}
     */
    var init = function () {
      var m = next();
      var args = m["feed"];
      var e = m["story"];
      /** @type {null} */
      var params = null;
      console["log"]("isPageDelegate %o", m["isPageDelegate"]);
      console["log"]("feed %o", args);
      console["log"]("story %o", e);
      remove()["find"](".IPO_Prepard")["remove"]();
      if (results["post_id"] && !e) {
        parse("NO_STORY");
        return;
      }
      if (args && e) {
        params = {};
        if (!args["__typename"]) {
          if (args["featurable_title"]) {
            if (args["featurable_title"]["ranges"]) {
              args["featurable_title"]["ranges"]["forEach"](function (entities) {
                if (entities["entity"]) {
                  if (entities["entity"]["__typename"]) {
                    if (entities["entity"]["id"] == args["id"]) {
                      args["__typename"] = entities["entity"]["__typename"];
                    }
                  }
                }
              });
            }
          }
        }
        if (!args["name"]) {
          if (args["featurable_title"]) {
            if (args["featurable_title"]["text"]) {
              args["name"] = args["featurable_title"]["text"];
            }
          }
        }
        if (!args["__typename"] || !args["name"]) {
          if (args["profile_header_renderer"]) {
            if (args["profile_header_renderer"]["group"]) {
              if (args["profile_header_renderer"]["group"]["id"]) {
                if (args["profile_header_renderer"]["group"]["featurable_title"]) {
                  if (!args["name"]) {
                    if (args["profile_header_renderer"]["group"]["featurable_title"]["text"]) {
                      args["name"] = args["profile_header_renderer"]["group"]["featurable_title"]["text"];
                    }
                  }
                  if (!args["__typename"]) {
                    args["profile_header_renderer"]["group"]["featurable_title"]["ranges"]["forEach"](function (entities) {
                      if (entities["entity"]) {
                        if (entities["entity"]["__typename"]) {
                          if (entities["entity"]["id"] == args["id"]) {
                            args["__typename"] = entities["entity"]["__typename"];
                          }
                        }
                      }
                    });
                  }
                }
              }
            }
          }
        }
        results["feed_info"] = args;
        results["story_info"] = e;
        var key = error(e);
        var coord = log(e);
        /** @type {null} */
        var linkTarget = null;
        console["log"]("body feed id: %s", args["id"]);
        console["log"]("url post id: %s", results["post_id"]);
        console["log"]("body post id: %s", key);
        console["log"]("body post fbid: %s", coord);
        if (coord == results["post_id"]) {
          results["post_id"] = key;
        }
        if (key != results["post_id"]) {
          if (e["content"]["story"]["attached_story"]) {
            console["log"]("attached story");
            console["log"](e["content"]["story"]["attached_story"]);
            jQuery("div.IPO_Inject")["remove"]();
          } else {
            parse("POST_ID_MISMATCH");
          }
          return;
        }
        console["log"](args["__typename"]);
        if (args["__typename"] == "Group") {
          if (e["context_layout"]["story"]["comet_sections"] && (e["context_layout"]["story"]["comet_sections"]["action_link"] && e["context_layout"]["story"]["comet_sections"]["action_link"]["group"])) {
            linkTarget = e["context_layout"]["story"]["comet_sections"]["action_link"]["group"]["id"];
          } else {
            if (e["context_layout"]["story"]["comet_sections"]["title"]) {
              if (e["context_layout"]["story"]["comet_sections"]["title"]["story"]) {
                if (e["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]) {
                  if (e["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]["action_link"]) {
                    if (e["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]["action_link"]["group"]) {
                      linkTarget = e["context_layout"]["story"]["comet_sections"]["title"]["story"]["comet_sections"]["action_link"]["group"]["id"];
                    }
                  }
                }
              }
            }
          }
          if (linkTarget) {
            console["log"]("body group id: %s", linkTarget);
            if (linkTarget != args["id"]) {
              /** @type {string} */
              var regexS = "^https:\\/\\/www\\.facebook\\.com\\/groups\\/[A-Za-z0-9\\._]+\\/(permalink|posts)\\/(?<post_id>\\d+)";
              /** @type {RegExp} */
              var regex = new RegExp(regexS);
              if (regex["test"](window["location"]["href"])) {
                console["log"](window["location"]);
                var stringVersion = "/groups/" + linkTarget + "/permalink/" + key + window["location"]["search"];
                console["log"](stringVersion);
                window["history"]["replaceState"]({}, null, stringVersion);
                parse("RENAMED_GROUP_ID");
                return;
              }
            }
          }
        }
        if (e["context_layout"]["story"]["comet_sections"]["timestamp"]) {
          params["created_timestamp"] = e["context_layout"]["story"]["comet_sections"]["timestamp"]["story"]["creation_time"];
        } else {
          if (e["context_layout"]["story"]["comet_sections"]["metadata"]) {
            e["context_layout"]["story"]["comet_sections"]["metadata"]["forEach"](function (dataAndEvents) {
              if (dataAndEvents["__typename"] == "CometFeedStoryTimestampStrategy" || dataAndEvents["__typename"] == "CometFeedStoryMinimizedTimestampStrategy") {
                if (dataAndEvents["story"]) {
                  if (dataAndEvents["story"]["creation_time"]) {
                    params["created_timestamp"] = dataAndEvents["story"]["creation_time"];
                  }
                }
              }
            });
          }
        }
        params["created_time"] = (new Date(params["created_timestamp"] * 1E3))["toISOString"]();
        /** @type {Array} */
        params["product_imgs"] = [];
        /** @type {Array} */
        params["comments"] = [];
        /** @type {number} */
        params["total_comments"] = 0;
        if (args["__typename"] == "Group") {
          /** @type {string} */
          params["fb_feed_type"] = "group";
        } else {
          if (args["__typename"] == "Page") {
            /** @type {string} */
            params["fb_feed_type"] = "page";
          } else {
            if (args["__typename"] == "User") {
              /** @type {string} */
              params["fb_feed_type"] = "user";
            } else {
              /** @type {string} */
              params["fb_feed_type"] = "unknow";
            }
          }
        }
        params["fb_feed_id"] = args["id"];
        params["fb_feed_title"] = args["name"];
        params["fb_post_id"] = args["id"] + "_" + key;
        /** @type {string} */
        params["post_type"] = "normal";
        /** @type {string} */
        params["message"] = "";
        if (e["content"]["story"]["comet_sections"]["message"]) {
          if (e["content"]["story"]["comet_sections"]["message"]["story"] && (e["content"]["story"]["comet_sections"]["message"]["story"]["message"] && e["content"]["story"]["comet_sections"]["message"]["story"]["message"]["text"])) {
            params["message"] = e["content"]["story"]["comet_sections"]["message"]["story"]["message"]["text"];
          } else {
            if (e["content"]["story"]["comet_sections"]["message"]["rich_message"]) {
              /** @type {Array} */
              var clrs = [];
              e["content"]["story"]["comet_sections"]["message"]["rich_message"]["forEach"](function (outObj) {
                clrs["push"](outObj["text"]);
              });
              params["message"] = clrs["join"]("\n");
            }
          }
        }
        if (params["fb_feed_type"] == "group") {
          /** @type {null} */
          var comments = null;
          if (e["feedback"]["story"]["comet_feed_ufi_container"]) {
            if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]) {
              if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["feedback_context"]) {
                if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["feedback_context"]["feedback_target_with_context"]) {
                  if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["feedback_context"]["feedback_target_with_context"]["ufi_renderer"]) {
                    if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["feedback_context"]["feedback_target_with_context"]["ufi_renderer"]["feedback"]) {
                      if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["feedback_context"]["feedback_target_with_context"]["ufi_renderer"]["feedback"]["comet_ufi_summary_and_actions_renderer"]) {
                        if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["feedback_context"]["feedback_target_with_context"]["ufi_renderer"]["feedback"]["comet_ufi_summary_and_actions_renderer"]["feedback"]) {
                          comments = e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["feedback_context"]["feedback_target_with_context"]["ufi_renderer"]["feedback"]["comet_ufi_summary_and_actions_renderer"]["feedback"];
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (!comments) {
            if (e["feedback"]["story"]["comet_feed_ufi_container"]) {
              if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]) {
                if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"]) {
                  if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"]["story"]) {
                    if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"]["story"]["feedback_context"]) {
                      if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"]["story"]["feedback_context"]["feedback_target_with_context"]) {
                        if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"]["story"]["feedback_context"]["feedback_target_with_context"]["comment_list_renderer"]) {
                          if (e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"]["story"]["feedback_context"]["feedback_target_with_context"]["comment_list_renderer"]["feedback"]) {
                            comments = e["feedback"]["story"]["comet_feed_ufi_container"]["story"]["story_ufi_container"]["story"]["feedback_context"]["feedback_target_with_context"]["comment_list_renderer"]["feedback"];
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (comments && (comments["comment_rendering_instance"] && comments["comment_rendering_instance"]["comments"])) {
            var mods = comments["comment_rendering_instance"]["comments"];
            if (mods["total_count"]) {
              params["total_comments"] = mods["total_count"];
            }
          }
          if (comments && (comments["comment_rendering_instance_for_feed_location"] && comments["comment_rendering_instance_for_feed_location"]["comments"])) {
            mods = comments["comment_rendering_instance_for_feed_location"]["comments"];
            if (mods["edges"]) {
              if (!window["IPO_Data"]["comemntsContainer"]) {
                window["IPO_Data"]["comemntsContainer"] = {};
              }
              if (!window["IPO_Data"]["comemntsContainer"][results["post_id"]]) {
                /** @type {Array} */
                window["IPO_Data"]["comemntsContainer"][results["post_id"]] = [];
              }
              mods["edges"]["forEach"](function (pair) {
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
                  window["IPO_Data"]["comemntsContainer"][results["post_id"]]["push"](defaults);
                }
              });
            }
            window["IPO_Data"]["comemntsContainerCount"] = window["IPO_Data"]["comemntsContainer"][results["post_id"]]["length"];
          }
        }
        if (e["context_layout"]["story"]["actors"] && e["context_layout"]["story"]["actors"]["length"] > 0) {
          params["user_profile_id"] = e["context_layout"]["story"]["actors"][0]["id"];
          params["user_profile_type"] = e["context_layout"]["story"]["actors"][0]["__typename"];
        } else {
          if (e["context_layout"]["story"]["comet_sections"]["title"] && (e["context_layout"]["story"]["comet_sections"]["title"]["story"] && (e["context_layout"]["story"]["comet_sections"]["title"]["story"]["actors"] && e["context_layout"]["story"]["comet_sections"]["title"]["story"]["actors"]["length"] > 0))) {
            params["user_profile_id"] = e["context_layout"]["story"]["comet_sections"]["title"]["story"]["actors"][0]["id"];
            params["user_profile_type"] = e["context_layout"]["story"]["comet_sections"]["title"]["story"]["actors"][0]["__typename"];
          } else {
            if (m["isPageDelegate"]) {
              params["user_profile_id"] = args["id"];
              params["user_profile_type"] = args["__typename"];
            }
          }
        }
        if (e["content"]["story"]["attachments"]) {
          e["content"]["story"]["attachments"]["forEach"](function (override) {
            if (override["styles"]["__typename"] == "StoryAttachmentGroupSellProductItemStyleRenderer") {
              var storedName = override["styles"]["attachment"]["title_with_entities"]["text"]["trim"]();
              /** @type {string} */
              var expires = "";
              /** @type {string} */
              var optsData = "";
              /** @type {string} */
              params["post_type"] = "sale";
              override["styles"]["attachment"]["properties"]["forEach"](function (obj) {
                if (obj["key"] == "price") {
                  expires = obj["value"]["text"]["trim"]();
                }
                if (obj["key"] == "description") {
                  optsData = obj["value"]["text"]["trim"]();
                }
              });
              params["message"] = storedName + "\n" + expires + "\n\n" + optsData;
            } else {
              if (override["styles"]["__typename"] == "StoryAttachmentAlbumStyleRenderer" || (override["styles"]["__typename"] == "StoryAttachmentVideoStyleRenderer" || (override["styles"]["__typename"] == "StoryAttachmentPhotoStyleRenderer" || (override["styles"]["__typename"] == "StoryAttachmentProfileMediaStyleRenderer" || (override["styles"]["__typename"] == "StoryAttachmentAlbumSaleItemStyleRenderer" || override["styles"]["__typename"] == "StoryAttachmentCommerceAttachmentStyleRenderer"))))) {
                if (override["styles"]["__typename"] == "StoryAttachmentCommerceAttachmentStyleRenderer") {
                  storedName = override["styles"]["attachment"]["title_with_entities"]["text"]["trim"]();
                  /** @type {string} */
                  expires = "";
                  /** @type {string} */
                  params["post_type"] = "sale";
                  if (override["styles"]["attachment"]["target"]) {
                    if (override["styles"]["attachment"]["target"]["formatted_price"]) {
                      expires = override["styles"]["attachment"]["target"]["formatted_price"]["text"]["trim"]();
                    }
                  }
                  params["message"] = storedName + "\n" + expires + "\n\n" + params["message"];
                }
                if (override["styles"]["attachment"]["media"]) {
                  var value = override["styles"]["attachment"]["media"];
                  if (value["__typename"] == "Photo" || value["__typename"] == "Video") {
                    params["product_imgs"]["push"](translate(value));
                  }
                }
                if (override["styles"]["attachment"]["all_subattachments"]) {
                  if (override["styles"]["attachment"]["all_subattachments"]["nodes"]) {
                    override["styles"]["attachment"]["all_subattachments"]["nodes"]["forEach"](function (mediaMap) {
                      if (mediaMap["media"]) {
                        if (mediaMap["media"]["__typename"] == "Photo" || mediaMap["media"]["__typename"] == "Video") {
                          params["product_imgs"]["push"](translate(mediaMap["media"]));
                        }
                      }
                    });
                  }
                }
              } else {
                if (override["styles"]["__typename"] == "StoryAttachmentAlbumFrameStyleRenderer") {
                  var attachments = override["styles"]["attachment"];
                  /** @type {null} */
                  var forEach = null;
                  if (attachments) {
                    if (attachments["five_photos_subattachments"] && attachments["five_photos_subattachments"]["nodes"]) {
                      forEach = attachments["five_photos_subattachments"]["nodes"];
                    } else {
                      if (attachments["four_photos_subattachments"] && attachments["four_photos_subattachments"]["nodes"]) {
                        forEach = attachments["four_photos_subattachments"]["nodes"];
                      } else {
                        if (attachments["three_photos_subattachments"] && attachments["three_photos_subattachments"]["nodes"]) {
                          forEach = attachments["three_photos_subattachments"]["nodes"];
                        } else {
                          if (attachments["two_photos_subattachments"]) {
                            if (attachments["two_photos_subattachments"]["nodes"]) {
                              forEach = attachments["two_photos_subattachments"]["nodes"];
                            }
                          }
                        }
                      }
                    }
                  }
                  if (forEach) {
                    forEach["forEach"](function ($cookies) {
                      var value = $cookies["media"];
                      if (value) {
                        if (value["__typename"] == "Photo" || value["__typename"] == "Video") {
                          params["product_imgs"]["push"](translate(value));
                        }
                      }
                    });
                  }
                }
              }
            }
          });
        }
        console["log"](params);
        results["post_info"] = params;
      }
      if (params) {
        var result = remove()["find"](".IPO_Query");
        if (result["length"] == 0) {
          /** @type {string} */
          var r20 = '<div class="IPO_Query clearfix mt-1 ml-2">';
          r20 += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
          r20 += '<span class="ml-2">Checking...</span>';
          r20 += "</div>";
          remove()["prepend"](r20);
        }
        self["postMessage"]({
          "operation": "checkReactFacebookPostInfo",
          "post_info": params
        });
      } else {
        jQuery("div.IPO_Inject")["remove"]();
        replace();
      }
    };
    /**
     * @return {undefined}
     */
    var removeClass = function () {
      remove()["find"](".IPO_Loading")["remove"]();
    };
    /**
     * @return {?}
     */
    var create = function () {
      /** @type {null} */
      var error = null;
      /** @type {null} */
      var comments_info = null;
      /** @type {number} */
      var comments_type = 1;
      var err = check();
      return err["find"]("ul")["each"](function (dataAndEvents, err) {
        var ret = cb(err);
        if (ret && (ret["return"] && (ret["return"]["pendingProps"]["commentsListRenderProps"] && ret["return"]["pendingProps"]["commentsListRenderProps"]["listState"]))) {
          comments_info = ret["return"]["pendingProps"]["commentsListRenderProps"];
          error = err;
          /** @type {number} */
          comments_type = 1;
        } else {
          if (ret) {
            if (ret["return"]) {
              if (ret["return"]["return"]) {
                if (ret["return"]["return"]["pendingProps"]["commentsListRenderProps"]) {
                  if (ret["return"]["return"]["pendingProps"]["commentsListRenderProps"]["listState"]) {
                    comments_info = ret["return"]["return"]["pendingProps"]["commentsListRenderProps"];
                    error = err;
                    /** @type {number} */
                    comments_type = 1;
                  }
                }
              }
            }
          }
        }
      }), comments_type == 1 && ((!error || !comments_info) && err["find"]("div.html-div.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp")["each"](function (dataAndEvents, err) {
        /** @type {(Date|string)} */
        error = err;
        /** @type {number} */
        comments_type = 2;
      })), comments_type == 1 && ((!error || !comments_info) && err["find"]("div.x1pi30zi.x1swvt13.x1n2onr6 > div.x1gslohp")["each"](function (dataAndEvents, err) {
        /** @type {(Date|string)} */
        error = err;
        /** @type {number} */
        comments_type = 2;
      })), {
        "story_container": err,
        "comments_type": comments_type,
        "comments_container": error,
        "comments_info": comments_info
      };
    };
    /**
     * @param {Object} arg
     * @param {number} format
     * @return {undefined}
     */
    var fn = function (arg, format) {
      if (format == 1) {
        var elements = jQuery();
        if (elements["length"] == 0) {
          elements = arg["find"]("div.x6s0dn4.x78zum5.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xe0p6wg span");
        }
        if (elements["length"] > 0) {
          elements["click"]();
          $(function () {
            /** @type {number} */
            var text = -1;
            var p = jQuery();
            if (p["length"] == 0) {
              p = jQuery('div.x1n2onr6.x1fqp7bg[role="menu"]');
            }
            if (p["length"] == 0) {
              p = jQuery('div.x1n2onr6.xcxhlts[role="menu"]');
            }
            if (p["length"] == 0) {
              $(start, 1E3);
              return;
            }
            var keepChildren = cb(p["get"](0));
            /** @type {null} */
            var forEach = null;
            if (keepChildren && (keepChildren["child"] && (keepChildren["child"]["pendingProps"] && (keepChildren["child"]["pendingProps"]["children"] && (keepChildren["child"]["pendingProps"]["children"]["props"] && keepChildren["child"]["pendingProps"]["children"]["props"]["children"]))))) {
              console["log"](keepChildren["child"]["pendingProps"]["children"]["props"]["children"]);
              if (jQuery["isArray"](keepChildren["child"]["pendingProps"]["children"]["props"]["children"])) {
                forEach = keepChildren["child"]["pendingProps"]["children"]["props"]["children"];
              } else {
                if (jQuery["isArray"](keepChildren["child"]["pendingProps"]["children"]["props"]["children"]["props"]["children"])) {
                  forEach = keepChildren["child"]["pendingProps"]["children"]["props"]["children"]["props"]["children"];
                }
              }
              if (forEach) {
                forEach["forEach"](function (message, textAlt) {
                  console["log"](message);
                  if (message["key"] == "RANKED_UNFILTERED") {
                    /** @type {number} */
                    text = textAlt;
                  } else {
                    if (message["key"] == "TOPLEVEL") {
                      /** @type {number} */
                      text = textAlt;
                    } else {
                      if (message["key"] == "RECENT_ACTIVITY") {
                        /** @type {number} */
                        text = textAlt;
                      }
                    }
                  }
                });
              }
            }
            console["log"]("menuitem idx: " + text);
            /** @type {boolean} */
            var Y = false;
            p["find"]('div[role="menuitem"]')["each"](function (type, option) {
              if (Y) {
                return;
              }
              if (text != -1) {
                if (type == text) {
                  option["click"]();
                  /** @type {boolean} */
                  Y = true;
                  $(start, 1E3);
                }
              } else {
                var message = jQuery(option)["find"]("span:first")["text"]();
                console["log"](message);
                if (message == "\u6240\u6709\u56de\u61c9" || (message == "\u6240\u6709\u7559\u8a00" || message == "All comments")) {
                  option["click"]();
                  /** @type {boolean} */
                  Y = true;
                  $(start, 1E3);
                }
              }
            });
          }, 100);
          reset();
        } else {
          $(start, 1E3);
        }
      } else {
        if (format == 2) {
          elements = jQuery();
          if (elements["length"] == 0) {
            elements = arg["find"]("div.x6s0dn4.x78zum5.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xe0p6wg > div > span");
          }
          var cz = elements["text"]()["trim"]();
          if (elements["length"] > 0 && !(cz == "\u6240\u6709\u56de\u61c9" || (cz == "\u6240\u6709\u7559\u8a00" || (cz == "\u5f9e\u820a\u5230\u65b0" || cz == "All comments")))) {
            elements["click"]();
            $(function () {
              /** @type {number} */
              var U = -1;
              var elements = jQuery();
              if (elements["length"] == 0) {
                elements = jQuery('div.x1n2onr6.x1fqp7bg[role="menu"]');
              }
              if (elements["length"] == 0) {
                elements = jQuery('div.x1n2onr6.xcxhlts[role="menu"]');
              }
              if (elements["length"] == 0) {
                $(start, 1E3);
                return;
              }
              /** @type {boolean} */
              var W = false;
              elements["find"]('div[role="menuitem"]')["each"](function (dataAndEvents, option) {
                if (W) {
                  return;
                }
                var message = jQuery(option)["find"]("span:first")["text"]()["trim"]();
                console["log"](message);
                if (message == "\u6240\u6709\u56de\u61c9" || (message == "\u6240\u6709\u7559\u8a00" || (message == "\u5f9e\u820a\u5230\u65b0" || message == "All comments"))) {
                  option["click"]();
                  /** @type {boolean} */
                  W = true;
                  $(start, 1E3);
                }
              });
            }, 100);
            reset();
          } else {
            $(start, 1E3);
          }
        }
      }
    };
    /**
     * @return {undefined}
     */
    var start = function () {
      var result = remove()["find"](".IPO_Loading");
      if (result["length"] == 0) {
        /** @type {string} */
        var r20 = '<div class="IPO_Loading clearfix mt-1 ml-2">';
        r20 += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
        r20 += '<span class="ml-2">\u8f09\u5165\u7559\u8a00\u4e2d...<span id="IPO_Loading_Text"></span></span>';
        r20 += "</div>";
        remove()["find"](".IPO_Container")["after"](r20);
      } else {
        var last = result["find"]("#IPO_Loading_Text");
        last["text"](last["text"]() + ".");
      }
      var m = create();
      var e = m["story_container"];
      var scripts = m["comments_container"];
      var args = m["comments_info"];
      var format = m["comments_type"];
      if (!e || !scripts) {
        console["log"]("no story_container");
        h++;
        if (h < 5) {
          if (e) {
            fn(e, format);
          } else {
            $(start, 1E3);
            reset();
          }
        } else {
          removeClass();
          replace();
        }
        return;
      }
      if (format == 1) {
        if (args) {
          console["log"](args["viewOption"]);
          if (args["viewOption"] != "RANKED_UNFILTERED" && (args["viewOption"] != "TOPLEVEL" && args["viewOption"] != "RECENT_ACTIVITY")) {
            var elements = jQuery();
            if (elements["length"] == 0) {
              elements = e["find"]("div.x6s0dn4.x78zum5.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xe0p6wg span");
            }
            if (elements["length"] > 0) {
              elements["click"]();
              $(function () {
                /** @type {number} */
                var text = -1;
                var p = jQuery();
                if (p["length"] == 0) {
                  p = jQuery('div.x1n2onr6.x1fqp7bg[role="menu"]');
                }
                if (p["length"] == 0) {
                  p = jQuery('div.x1n2onr6.xcxhlts[role="menu"]');
                }
                if (p["length"] == 0) {
                  $(start, 1E3);
                  return;
                }
                var keepChildren = cb(p["get"](0));
                /** @type {null} */
                var forEach = null;
                if (keepChildren && (keepChildren["child"] && (keepChildren["child"]["pendingProps"] && (keepChildren["child"]["pendingProps"]["children"] && (keepChildren["child"]["pendingProps"]["children"]["props"] && keepChildren["child"]["pendingProps"]["children"]["props"]["children"]))))) {
                  console["log"](keepChildren["child"]["pendingProps"]["children"]["props"]["children"]);
                  if (jQuery["isArray"](keepChildren["child"]["pendingProps"]["children"]["props"]["children"])) {
                    forEach = keepChildren["child"]["pendingProps"]["children"]["props"]["children"];
                  } else {
                    if (jQuery["isArray"](keepChildren["child"]["pendingProps"]["children"]["props"]["children"]["props"]["children"])) {
                      forEach = keepChildren["child"]["pendingProps"]["children"]["props"]["children"]["props"]["children"];
                    }
                  }
                  if (forEach) {
                    forEach["forEach"](function (message, textAlt) {
                      console["log"](message);
                      if (message["key"] == "RANKED_UNFILTERED") {
                        /** @type {number} */
                        text = textAlt;
                      } else {
                        if (message["key"] == "TOPLEVEL") {
                          /** @type {number} */
                          text = textAlt;
                        } else {
                          if (message["key"] == "RECENT_ACTIVITY") {
                            /** @type {number} */
                            text = textAlt;
                          }
                        }
                      }
                    });
                  }
                }
                console["log"]("menuitem idx: " + text);
                /** @type {boolean} */
                var a7 = false;
                p["find"]('div[role="menuitem"]')["each"](function (type, option) {
                  if (a7) {
                    return;
                  }
                  if (text != -1) {
                    if (type == text) {
                      option["click"]();
                      /** @type {boolean} */
                      a7 = true;
                      $(start, 1E3);
                    }
                  } else {
                    var message = jQuery(option)["find"]("span:first")["text"]();
                    console["log"](message);
                    if (message == "\u6240\u6709\u56de\u61c9" || (message == "\u6240\u6709\u7559\u8a00" || message == "All comments")) {
                      option["click"]();
                      /** @type {boolean} */
                      a7 = true;
                      $(start, 1E3);
                    }
                  }
                });
              }, 100);
              reset();
              return;
            }
          }
          if (args["listState"]["pagers"]["backward"] || args["listState"]["pagers"]["forward"]) {
            var src = jQuery();
            if (src["length"] == 0) {
              src = e["find"]("div.x78zum5.x1iyjqo2.x21xpn4.x1n2onr6 span.x78zum5.x1w0mnb.xeuugli");
            }
            src["each"](function (dataAndEvents, option) {
              var escapes = jQuery(option)["text"]();
              /** @type {Array} */
              var forEach = ["^\u6aa2\u8996\u53e6 *d+ *\u5247\u7559\u8a00$", "^\u67e5\u770b\u66f4\u591a\u7559\u8a00$", "^\u986f\u793a\u5148\u524d\u7684\u7559\u8a00$", "^\u67e5\u770b\u53e6 *d+ *\u5247\u7559\u8a00$", "^\u6aa2\u8996\u53e6 *d+ *\u5247\u56de\u7b54$", "^\u67e5\u770b\u66f4\u591a\u56de\u7b54$", "^\u986f\u793a\u5148\u524d\u7684\u56de\u7b54$", "^\u67e5\u770b\u5148\u524d\u7684\u56de\u7b54$", "^\u67e5\u770b\u53e6 *d+ *\u5247\u56de\u7b54$", "^\u67e5\u770b *d+ *\u5247\u5148\u524d\u7684\u7559\u8a00$",
                "^\u67e5\u770b *d+ *\u500b\u4e4b\u524d\u7684\u7b54\u6848$"];
              /** @type {Array} */
              var paths = [];
              forEach["forEach"](function (punctuation) {
                paths["push"](new RegExp(punctuation));
              });
              paths["forEach"](function (owner) {
                var unlock = escapes["match"](owner);
                if (unlock) {
                  reset();
                  option["click"]();
                }
              });
            });
            $(start, 1E3);
          } else {
            console["log"]("comments count: " + Object["keys"](args["listState"]["commentsByID"])["length"]);
            $(render, 100);
          }
        }
      } else {
        if (format == 2) {
          elements = jQuery();
          if (elements["length"] == 0) {
            elements = e["find"]("div.x6s0dn4.x78zum5.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xe0p6wg > div > span");
          }
          var cz = elements["text"]()["trim"]();
          if (elements["length"] > 0 && !(cz == "\u6240\u6709\u56de\u61c9" || (cz == "\u6240\u6709\u7559\u8a00" || (cz == "\u5f9e\u820a\u5230\u65b0" || cz == "All comments")))) {
            elements["click"]();
            $(function () {
              /** @type {number} */
              var a3 = -1;
              var elements = jQuery();
              if (elements["length"] == 0) {
                elements = jQuery('div.x1n2onr6.x1fqp7bg[role="menu"]');
              }
              if (elements["length"] == 0) {
                elements = jQuery('div.x1n2onr6.xcxhlts[role="menu"]');
              }
              if (elements["length"] == 0) {
                $(start, 1E3);
                return;
              }
              /** @type {boolean} */
              var a5 = false;
              elements["find"]('div[role="menuitem"]')["each"](function (dataAndEvents, option) {
                if (a5) {
                  return;
                }
                var message = jQuery(option)["find"]("span:first")["text"]()["trim"]();
                console["log"](message);
                if (message == "\u6240\u6709\u56de\u61c9" || (message == "\u6240\u6709\u7559\u8a00" || (message == "\u5f9e\u820a\u5230\u65b0" || message == "All comments"))) {
                  option["click"]();
                  /** @type {boolean} */
                  a5 = true;
                  $(start, 1E3);
                }
              });
            }, 100);
            reset();
          } else {
            if (!window["IPO_Data"]["comemntsContainer"] && window["IPO_Data"]["updateCount"] < 2) {
              window["IPO_Data"]["updateCount"] += 1;
              $(start, 1E3);
              reset();
            } else {
              if (window["IPO_Data"]["comemntsContainer"] && (!window["IPO_Data"]["comemntsContainer"][results["post_id"]] && window["IPO_Data"]["updateCount"] < 2)) {
                window["IPO_Data"]["updateCount"] += 1;
                $(start, 1E3);
                reset();
              } else {
                if (window["IPO_Data"]["comemntsContainer"] && (window["IPO_Data"]["comemntsContainer"][results["post_id"]] && (window["IPO_Data"]["comemntsContainer"][results["post_id"]]["length"] != window["IPO_Data"]["comemntsContainerCount"] || window["IPO_Data"]["updateCount"] < 2))) {
                  if (window["IPO_Data"]["comemntsContainer"][results["post_id"]]["length"] != window["IPO_Data"]["comemntsContainerCount"]) {
                    window["IPO_Data"]["comemntsContainerCount"] = window["IPO_Data"]["comemntsContainer"][results["post_id"]]["length"];
                    /** @type {boolean} */
                    var a1 = false;
                    var p = jQuery(scripts)["find"]('> div.x78zum5.x13a6bvl > div.x1iyjqo2 div[role="button"]');
                    if (p["length"] > 0) {
                      if (p["find"]('div[role="status"]')["length"] > 0) {
                        $(start, 100);
                      } else {
                        p["each"](function (dataAndEvents, evts) {
                          if (a1) {
                            return;
                          }
                          evts["click"]();
                          /** @type {number} */
                          window["IPO_Data"]["updateCount"] = 0;
                          $(start, 1E3);
                        });
                      }
                    } else {
                      find(e);
                      $(start, 1E3);
                    }
                    reset();
                  } else {
                    window["IPO_Data"]["updateCount"] += 1;
                    find(e);
                    $(start, 1E3);
                    reset();
                  }
                } else {
                  /** @type {boolean} */
                  a1 = false;
                  p = jQuery(scripts)["find"]('> div.x78zum5.x13a6bvl > div.x1iyjqo2 div[role="button"]');
                  if (p["length"] > 0) {
                    if (p["find"]('div[role="status"]')["length"] > 0) {
                      $(start, 100);
                    } else {
                      p["each"](function (dataAndEvents, evts) {
                        if (a1) {
                          return;
                        }
                        evts["click"]();
                        /** @type {number} */
                        window["IPO_Data"]["updateCount"] = 0;
                        $(start, 1E3);
                      });
                    }
                  } else {
                    find(e);
                    $(render, 100);
                  }
                  reset();
                }
              }
            }
          }
        } else {
          removeClass();
          replace();
        }
      }
    };
    /**
     * @param {Object} what
     * @return {undefined}
     */
    var find = function (what) {
      var p = what["find"]("div.x78zum5.xdt5ytf.x1iyjqo2.x1n2onr6.xaci4zi.x129vozr");
      if (p["length"] > 0) {
        var r20 = p["get"](0)["scrollHeight"];
        p["parent"]()["get"](0)["scrollTo"](0, r20);
      }
    };
    /**
     * @return {undefined}
     */
    var render = function () {
      removeClass();
      /** @type {Array} */
      var dashes = ["[\ue000-\uf8ff]", "\ud83c[\udc00-\udfff]", "\ud83d[\udc00-\ude4f]", "\ud83d[\ude80-\udeff]", "\ud83e[\udd10-\uddff]"];
      var m = create();
      var scripts = m["comments_container"];
      var formula = m["comments_type"];
      /** @type {number} */
      var T = 0;
      /** @type {number} */
      var i = 0;
      /** @type {number} */
      var last = 0;
      if (formula == 1) {
        jQuery(scripts)["children"]("li")["each"](function (dataAndEvents, r) {
          last++;
          var scripts = jQuery(r)["find"]("div.x1ye3gou.xwib8y2.xn6708d.x1y1aw1k")["get"](0);
          if (!scripts) {
            i++;
            return;
          }
          var c = cb(r)["child"]["pendingProps"];
          var e = jQuery(scripts)["find"]("div.x1iorvi4.xjkvuk6.x1lliihq div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs")["get"](0);
          /** @type {null} */
          var value = null;
          if (e) {
            var ret = cb(e);
            if (ret) {
              value = ret["return"]["pendingProps"];
            }
          }
          var obj = {};
          var future = cb(jQuery(scripts)["parent"]()["get"](0));
          /** @type {null} */
          var values = null;
          if (future) {
            if (future["return"]["pendingProps"]["comment"]) {
              values = future["return"]["pendingProps"]["comment"];
            }
          }
          if (!values) {
            i++;
            return;
          }
          var uid = values["legacy_fbid"];
          var byteString = atob(values["id"]);
          /** @type {RegExp} */
          var r20 = /:([0-9_]+)$/g;
          var def = r20["exec"](byteString);
          if (!def) {
            i++;
            return;
          }
          obj["id"] = def[1];
          if (c["comment"] && c["comment"]["created_time"]) {
            obj["created_timestamp"] = c["comment"]["created_time"];
          } else {
            if (values["created_time"]) {
              obj["created_timestamp"] = values["created_time"];
            } else {
              i++;
              return;
            }
          }
          obj["created_time"] = (new Date(obj["created_timestamp"] * 1E3))["toISOString"]();
          if (values["preferred_body"] && values["preferred_body"]["text"] != undefined) {
            obj["message"] = values["preferred_body"]["text"];
          } else {
            if (value && value["text"] != undefined) {
              obj["message"] = value["text"];
            } else {
              if (values["attachments"] && values["attachments"]["length"] > 0) {
                /** @type {string} */
                obj["message"] = "";
              } else {
                i++;
                return;
              }
            }
          }
          obj["from"] = {};
          obj["from"]["profile_id"] = values["author"]["id"];
          obj["from"]["name"] = values["author"]["name"];
          /** @type {Array} */
          obj["message_tags"] = [];
          var res = cb(e);
          if (res && res["return"]["pendingProps"]["ranges"]) {
            var location = res["return"]["pendingProps"]["text"]["replace"](new RegExp(dashes["join"]("|"), "g"), " ");
            res["return"]["pendingProps"]["ranges"]["forEach"](function (result) {
              var fn = location["substring"](result["offset"], result["offset"] + result["length"]);
              if (fn["indexOf"]("http") !== -1 && fn["indexOf"]("facebook.com") !== -1) {
                return;
              }
              if (!result["entity"]) {
                return;
              }
              if (result["entity"]["__typename"] == "User") {
                var params = {};
                params["profile_id"] = result["entity"]["id"];
                /** @type {string} */
                params["type"] = "user";
                params["name"] = fn;
                obj["message_tags"]["push"](params);
              } else {
                if (result["entity"]["__typename"] == "Page") {
                  params = {};
                  params["profile_id"] = result["entity"]["id"];
                  /** @type {string} */
                  params["type"] = "page";
                  params["name"] = fn;
                  obj["message_tags"]["push"](params);
                }
              }
            });
          }
          results["post_info"]["comments"]["push"](obj);
          if (results["post_snapshot_info"]["comments"][uid]) {
            jQuery(scripts)["append"]('<div class="IPO_Container IPO_Comment_Status"><span class="badge badge-pill badge-success ml-2">\u2714\ufe0f \u5df2\u532f\u5165</span></div>');
          } else {
            jQuery(scripts)["append"]('<div class="IPO_Container IPO_Comment_Status"><span class="badge badge-pill badge-info ml-2">\u2795 \u65b0\u7559\u8a00\uff0c\u4e0a\u50b3\u7cfb\u7d71\u4e2d</span></div>');
            T++;
          }
        });
      } else {
        if (formula == 2) {
          var p = jQuery();
          if (p["length"] == 0) {
            p = jQuery(scripts)["find"]("> div.x78zum5.xdt5ytf > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x169t7cy.x19f6ikt > div.x1n2onr6");
          }
          if (p["length"] == 0) {
            p = jQuery(scripts)["find"]("> div > div.x169t7cy.x19f6ikt > div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6");
          }
          if (p["length"] == 0) {
            p = jQuery(scripts)["find"]("> div > div.x169t7cy.x19f6ikt > div.x1n2onr6.x1swvt13.x1iorvi4.x78zum5.x1q0g3np.x1a2a7pz");
          }
          if (p["length"] == 0) {
            p = jQuery(scripts)["find"]("> div > div.x169t7cy.x19f6ikt > div.x1n2onr6.x1ye3gou.x1iorvi4.x78zum5.x1q0g3np.x1a2a7pz");
          }
          if (p["length"] == 0) {
            p = jQuery(scripts)["find"]("> div > div.x16hk5td.x12rz0ws > div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6");
          }
          if (p["length"] == 0) {
            p = jQuery(scripts)["find"]("> div > div.x16hk5td.x12rz0ws > div.x1n2onr6.x1swvt13.x1iorvi4.x78zum5.x1q0g3np.x1a2a7pz");
          }
          if (p["length"] == 0) {
            p = jQuery(scripts)["find"]("> div > div.x16hk5td.x12rz0ws > div.x1n2onr6.x1ye3gou.x1iorvi4.x78zum5.x1q0g3np.x1a2a7pz");
          }
          p["each"](function (dataAndEvents, parent) {
            var data = {
              "id": null,
              "message": null,
              "from": null,
              "message_tags": []
            };
            var obj = jQuery(parent)["find"]('> div[role="article"]');
            if (obj["length"] == 0) {
              obj = jQuery(parent);
            }
            var p = obj["find"]("div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs");
            if (p["length"] > 0) {
              var ret = cb(p["get"](0));
              if (ret && (ret["return"] && ret["return"]["pendingProps"])) {
                if (ret["return"]["pendingProps"]["text"]) {
                  data["message"] = ret["return"]["pendingProps"]["text"];
                  if (ret["return"]["pendingProps"]["ranges"]) {
                    var location = ret["return"]["pendingProps"]["text"]["replace"](new RegExp(dashes["join"]("|"), "g"), " ");
                    ret["return"]["pendingProps"]["ranges"]["forEach"](function (result) {
                      var fn = location["substring"](result["offset"], result["offset"] + result["length"]);
                      if (fn["indexOf"]("http") !== -1 && fn["indexOf"]("facebook.com") !== -1) {
                        return;
                      }
                      if (!result["entity"]) {
                        return;
                      }
                      if (result["entity"]["__typename"] == "User") {
                        var params = {};
                        params["profile_id"] = result["entity"]["id"];
                        /** @type {string} */
                        params["type"] = "user";
                        params["name"] = fn;
                        data["message_tags"]["push"](params);
                      } else {
                        if (result["entity"]["__typename"] == "Page") {
                          params = {};
                          params["profile_id"] = result["entity"]["id"];
                          /** @type {string} */
                          params["type"] = "page";
                          params["name"] = fn;
                          data["message_tags"]["push"](params);
                        }
                      }
                    });
                  }
                }
              }
            }
            var result = obj["find"]("> div.xqcrz7y.x14yjl9h.xudhj91.x18nykt9.xww2gxu.x1lliihq.x1w0mnb.xr9ek0c.x1n2onr6");
            if (result["length"] > 0) {
              var future = cb(result["get"](0));
              if (future && (future["return"] && (future["return"]["pendingProps"] && (future["return"]["pendingProps"]["actor"] && future["return"]["pendingProps"]["comment"])))) {
                var format = atob(future["return"]["pendingProps"]["comment"]["__id"]);
                /** @type {RegExp} */
                var pattern = /:([0-9_]+)$/g;
                var bits = pattern["exec"](format);
                if (bits) {
                  data["id"] = bits[1];
                }
                data["created_timestamp"] = future["return"]["pendingProps"]["comment"]["created_time"];
                data["from"] = {
                  "name": future["return"]["pendingProps"]["actor"]["name"],
                  "profile_id": future["return"]["pendingProps"]["actor"]["id"]
                };
                if (future["return"]["pendingProps"]["actor"]["__typename"] == "User") {
                  /** @type {string} */
                  data["from"]["type"] = "user";
                } else {
                  if (future["return"]["pendingProps"]["actor"]["__typename"] == "Page") {
                    /** @type {string} */
                    data["from"]["type"] = "page";
                  }
                }
              }
            }
            if (data["id"] && (data["from"] && (data["message"] && data["created_timestamp"]))) {
              results["post_info"]["comments"]["push"](data);
              /** @type {RegExp} */
              pattern = /^([0-9]+_)?([0-9]+)$/g;
              bits = pattern["exec"](data["id"]);
              var high = bits[2];
              if (results["post_snapshot_info"]["comments"][high]) {
                p["append"]('<div class="IPO_Container IPO_Comment_Status"><span class="badge badge-pill badge-success ml-2">\u2714\ufe0f \u5df2\u532f\u5165</span></div>');
              } else {
                p["append"]('<div class="IPO_Container IPO_Comment_Status"><span class="badge badge-pill badge-info ml-2">\u2795 \u65b0\u7559\u8a00\uff0c\u4e0a\u50b3\u7cfb\u7d71\u4e2d</span></div>');
                T++;
              }
            }
          });
        }
      }
      if (window["IPO_Data"]["comemntsContainer"][results["post_id"]]) {
        window["IPO_Data"]["comemntsContainer"][results["post_id"]]["forEach"](function (dep) {
          results["post_info"]["comments"]["push"](dep);
        });
      }
      if (last > 0 && i == last) {
        j++;
        if (j > 2) {
          parse("cannot read comments");
        } else {
          $(render, 1E3);
          reset();
        }
        return;
      }
      var storage = {};
      /** @type {Array} */
      var missing = [];
      results["post_info"]["comments"]["forEach"](function (dep) {
        if (storage[dep["id"]]) {
          return;
        }
        missing["push"](dep);
        /** @type {boolean} */
        storage[dep["id"]] = true;
      });
      /** @type {Array} */
      results["post_info"]["comments"] = missing;
      results["post_info"]["comments"]["sort"](function (mat0, mat1) {
        return mat0["created_timestamp"] - mat1["created_timestamp"];
      });
      console["log"](results["post_info"]);
      if (T > 0) {
        var data = next();
        var feed = data["feed"];
        var e = data["story"];
        var expr = error(e);
        var key = log(e);
        var old = push(window["location"]["href"]);
        console["log"]("post id: %s", expr);
        console["log"]("post fbid: %s", key);
        console["log"]("url post id: %s", old);
        if (old == key) {
          old = expr;
        }
        if (old != results["post_id"]) {
          parse("POST_ID_MISMATCH");
          return;
        }
        if (expr != old) {
          parse("POST_ID_MISMATCH");
          return;
        }
        var result = remove()["find"](".IPO_Uploading");
        if (result["length"] == 0) {
          /** @type {string} */
          var r20 = '<div class="IPO_Uploading clearfix mt-1 ml-2">';
          r20 += '<img src="' + results["ext_url"] + 'images/iPlusOne_icon_color_48x48_h.png" class="IPO_Logo" title="' + config["title"] + '">';
          r20 += '<span class="ml-2">\u4e0a\u50b3\u7559\u8a00\u4e2d...</span>';
          r20 += "</div>";
          remove()["find"](".IPO_Container.IPO_Post_Info")["after"](r20);
        }
        templateFunc();
        if (b) {
          remove()["find"](".IPO_Uploading")["remove"]();
          replace();
        } else {
          self["postMessage"]({
            "operation": "uploadReactFacebookComments",
            "post_info": results["post_info"]
          });
        }
      } else {
        self["postMessage"]({
          "operation": "uploadReactFacebookComments",
          "post_info": results["post_info"]
        });
        replace();
      }
    };
    /**
     * @return {undefined}
     */
    var reset = function () {
      if (val) {
        self["postMessage"]({
          "operation": "refreshRecovery"
        });
      }
    };
    /**
     * @return {undefined}
     */
    var templateFunc = function () {
      if (val) {
        self["postMessage"]({
          "operation": "stopRecovery"
        });
      }
    };
    /**
     * @return {undefined}
     */
    var replace = function () {
      jQuery("div.IPO_Inject")["remove"]();
      console["log"]("checkNext");
      if (val) {
        self["postMessage"]({
          "operation": "checkNext"
        });
      }
    };
  };
  window["iplusone_script_" + config["version"]]();
}, 500);
