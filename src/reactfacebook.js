// TOLOOK
setTimeout(function () {
  $.noConflict();
  window["iplusone_script_" + config.version] = function () {
    'use strict';

    var a = {
      NO_STORY: "文章抓取失敗，請重新整理",
      POST_ID_MISMATCH: "文章ID抓取失敗，請重新整理",
      RENAMED_GROUP_ID: "社群ID抓取失敗，請重新整理"
    };
    var b = false;
    if (config.version != "DEV") {
      b = false;
    }
    if (window.IPOTimerInstance) {
      console.log("force stop timer 0");
      clearTimeout(window.IPOTimerInstance);
    }
    window.IPOTimerInstance = null;
    var c = false;
    var d = true;
    var e = false;
    jQuery("div.iplusone_loaded_" + config.version).remove();
    jQuery("div.IPO_Comment_Status").remove();
    if (!window["iplusone_post_" + config.version]) {
      window["iplusone_post_" + config.version] = {};
      window["iplusone_post_" + config.version].feed_info = null;
      window["iplusone_post_" + config.version].story_info = null;
      window["iplusone_post_" + config.version].post_info = null;
      window["iplusone_post_" + config.version].post_snapshot_info = null;
      window["iplusone_post_" + config.version].post_snapshot_id = "";
      window["iplusone_post_" + config.version].iplusone_loaded = false;
      window["iplusone_post_" + config.version].ext_url = null;
      window["iplusone_post_" + config.version].post_id = null;
    }
    var f = window["iplusone_post_" + config.version];
    f.feed_info = null;
    f.story_info = null;
    f.post_info = null;
    f.post_snapshot_info = null;
    var g = null;
    var h = 0;
    var i = 0;
    var j = 0;
    var k = null;
    var l = [];
    console.log(window.location);
    if (f.iplusone_loaded) {
      jQuery(document).ready(function () {
        console.log("post inited");
        if (window.IPO_Data) {
          window.IPO_Data.update = Date.now();
          window.IPO_Data.comemntsContainerCount = 0;
        }
        r();
      });
    } else {
      jQuery(document).ready(function () {
        console.log("post un-inited");
        o();
        f.iplusone_loaded = true;
        r();
      });
    }
    function m(Q) {
      if (!Q) {
        return null;
      }
      var R = ["^https://www\\.facebook\\.com/[A-Za-z0-9\\._]+/posts/(?<post_id>\\d+|pfbid[A-Za-z0-9]+)", "^https://www\\.facebook\\.com/[A-Za-z0-9\\._]+/videos/(?<post_id>\\d+)", "^https://www\\.facebook\\.com/photo\\.php\\?fbid=(?<post_id>\\d+)&set=a\\.\\d+\\.\\d+\\.\\d+", "^https://www\\.facebook\\.com/photo\\.php\\?fbid=(?<post_id>\\d+)&set=a\\.\\d+([A-Za-z0-9\\._&=]+)", "^https://www\\.facebook\\.com/[A-Za-z0-9\\._]+/photos/a\\.\\d+\\.\\d+\\.\\d+/(?<post_id>\\d+)", "^https://www\\.facebook\\.com/groups/[A-Za-z0-9\\._]+/permalink/(?<post_id>\\d+)", "^https://www\\.facebook\\.com/permalink\\.php\\?story_fbid=(?<post_id>\\d+|pfbid[A-Za-z0-9]+)&id=(\\d+)", "^https://www\\.facebook\\.com/[A-Za-z0-9\\._]+/photos/a\\.\\d+/(?<post_id>\\d+)/[A-Za-z0-9\\._&?]+", "^https://www\\.facebook\\.com/story\\.php\\?story_fbid=(?<post_id>\\d+)&id=\\d+", "^https://www\\.facebook\\.com/groups/[A-Za-z0-9\\._]+/posts/(?<post_id>\\d+)/?(\\?\\w+=\\w+(&\\w+=\\w+)*)?$", "^https://www\\.facebook\\.com/groups/[A-Za-z0-9\\._]+/?\\?multi_permalinks=(?<post_id>\\d+)", "^https://www\\.facebook\\.com/groups/[A-Za-z0-9\\._]+/posts/[\\w%-]+/(?<post_id>\\d+)/?(\\?\\w+=\\w+(&\\w+=\\w+)*)?$"];
      var S = [];
      R.forEach(function (V) {
        S.push(new RegExp(V));
      });
      for (var T = 0; T < S.length; T++) {
        var U = Q.match(S[T]);
        if (U && U.groups) {
          return U.groups.post_id;
        }
      }
      return null;
    }
    function n(Q) {
      var R = {};
      var S = Q.split("&");
      for (var T = 0; T < S.length; T++) {
        if (S[T]) {
          var U = S[T].split("=");
          R[U[0]] = decodeURIComponent(U[1]);
        }
      }
      return R;
    }
    function o() {
      jQuery(document).on("click", "#iplusone-import_" + config.version, function () {
        g.postMessage({
          operation: "reactFbImport",
          post_info: f.post_info
        });
      });
      jQuery(document).on("click", "#iplusone-link_" + config.version, function () {
        g.postMessage({
          operation: "reactFbLink",
          post_info: f.post_info
        });
      });
      jQuery(document).on("click", "#iplusone-reload_" + config.version, function () {
        window.location.reload();
      });
      jQuery(document).on("click", "#iplusone-login_" + config.version, function () {
        var Q = "https://" + config.domain + "/seller/sellerlogin";
        window.open(Q, "_blank");
      });
      jQuery(document).on("click", "#iplusone-group_" + config.version, function () {
        var Q = "https://" + config.domain + "/seller/sellerorders?post_snapshot_id=" + f.post_snapshot_id;
        window.open(Q, "_blank");
      });
      jQuery(document).on("click", "#iplusone-upload_" + config.version, function () {
        jQuery("#iplusone-upload_" + config.version).hide();
        K();
      });
    }
    function p() {
      var Q = jQuery();
      var R = jQuery("div[data-pagelet=\"page\"]:visible");
      if (R.length == 0) {
        R = jQuery("div.__fb-light-mode.x1n2onr6.x1vjfegm:visible div.x78zum5.xdt5ytf.x1iyjqo2[role=\"dialog\"]");
      }
      if (R.length == 0) {
        R = jQuery("div.__fb-dark-mode.x1n2onr6.x1vjfegm:visible div.x78zum5.xdt5ytf.x1iyjqo2[role=\"dialog\"]");
      }
      if (R.length == 0) {
        R = jQuery("div.x78zum5.xdt5ytf.x10cihs4.x1t2pt76.x1n2onr6.x1ja2u2z:visible");
      }
      if (R.length > 0) {
        var S = R.first();
        if (Q.length == 0) {
          Q = S.find("div.__fb-light-mode.x1qjc9v5.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k.xshlqvt div[role=\"dialog\"]").first();
        }
        if (Q.length == 0) {
          Q = S.find("div.__fb-dark-mode.x1qjc9v5.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k.xshlqvt div[role=\"dialog\"]").first();
        }
        if (Q.length == 0) {
          Q = S.find("div[aria-posinset=\"1\"]").first();
        }
        if (Q.length == 0) {
          Q = S.find("div[aria-labelledby^=\"jsc_c_\"][role=\"article\"]").first();
        }
        if (Q.length == 0) {
          Q = S.find("div[aria-labelledby^=\"jsc_c_\"]").first();
        }
        if (Q.length == 0) {
          Q = S.find("div.xh8yej3.x1t2pt76.x193iq5w.xdt5ytf.x78zum5.x6s0dn4[role=\"main\"]").first();
        }
      }
      return Q;
    }
    function q() {
      var Q = jQuery();
      if (Q.length == 0) {
        Q = p().find("div.x10wlt62.x6ikm8r.x9jhf4c.x30kzoy.x13lgxp2.x168nmei").prev();
      }
      if (Q.length == 0) {
        Q = p().find("div.x10wlt62.x6ikm8r.x9jhf4c.x30kzoy.x13lgxp2.x168nmei");
      }
      if (Q.length == 0) {
        Q = p().find("div.x10wlt62.x6ikm8r.x1a2w583.x1ia1hqs.xeyy32k.xabvvm4");
      }
      return Q;
    }
    function r() {
      if (window.IPOTimerInstance) {
        console.log("force stop timer 1");
        clearTimeout(window.IPOTimerInstance);
      }
      window.IPOTimerInstance = null;
      i = 0;
      f.post_id = m(window.location.href);
      console.log("post id: %s", f.post_id);
      var Q = window.location.search.substring(1);
      var R = n(Q);
      if (R.ipo_no_ext == "1") {
        return;
      }
      g = chrome.runtime.connect(window.IPO_extension_id, {
        name: "ipo_ext"
      });
      g.onMessage.addListener(w);
      chrome.runtime.sendMessage(window.IPO_extension_id, {
        operation: "getSess",
        source: "post"
      }, null, function (S) {
        console.log(S);
        c = S.execute_from_ext;
        k = S.source;
        f.ext_url = S.extUrl;
        var T = jQuery("div.IPO_Inject");
        if (T.length != 0) {
          console.log("already inject");
          var U = m(window.location.href);
          if (U) {
            D("already inject");
          }
          return;
        }
        var V = "<div class=\"IPO_Inject\"></div>";
        jQuery("div[id^=\"mount_0_0\"]").append(V);
        if (window.location.hostname != "www.facebook.com") {
          return;
        } else if (!f.post_id) {
          return;
        } else if (S.cookie && S.cookie.value && S.brand && S.brand.value || b) {
          chrome.runtime.sendMessage(window.IPO_extension_id, {
            operation: "getBotAutoStatus"
          }, null, function (X) {
            console.log(X);
            d = X.bot_status;
            if (!d && c) {
              d = true;
            }
            u();
          });
        } else {
          var W = "<div class=\"IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_" + config.version + "\">";
          W += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
          W += "<button class=\"btn btn-sm btn-danger ml-2\" id=\"iplusone-login_" + config.version + "\">請先登入愛+1系統後台</button>";
          W += "</div>";
          s(function () {
            q().prepend(W);
            jQuery("div.IPO_Inject").remove();
          }, 2500);
        }
      });
    }
    function s(Q, R) {
      if (window.IPOTimerInstance) {
        clearTimeout(window.IPOTimerInstance);
      }
      window.IPOTimerInstance = // TOLOOK
      setTimeout(function () {
        window.IPOTimerInstance = null;
        Q();
      }, R);
    }
    function t(Q) {
      if (Q.sponsored_data) {
        return;
      }
      var R = E(Q.comet_sections);
      if (R) {
        window.IPO_Data.stories[R] = Q.comet_sections;
      }
      var S = F(Q.comet_sections);
      if (S) {
        window.IPO_Data.stories[S] = Q.comet_sections;
      }
    }
    function u() {
      chrome.runtime.sendMessage(window.IPO_extension_id, {
        operation: "getScripts",
        source: "post"
      }, null, function (Q) {
        console.log(Q);
        l = Q.scripts;
        v();
      });
    }
    function v() {
      var Q = m(window.location.href);
      if (!Q) {
        return;
      }
      console.log("checkContent");
      i++;
      var R = jQuery("div.w0hvl6rk.qjjbsfad span").first().text();
      if (R) {
        if (R == "你目前無法使用這項功能") {
          P("BLOCK");
          return;
        } else if (R == "目前無法提供此內容") {
          P("DELETE");
          return;
        }
      }
      if (i > 80) {
        console.log("check_content_count more than 80", i);
        var S = p();
        console.log("check article and ipo data", S, window.IPO_Data);
        if (S.length > 0 && window.IPO_Data) {
          console.log("checked, checkPostInfo");
          s(G, 1000);
        } else {
          console.log("check failed, checkNext");
          P();
        }
      } else {
        var T = jQuery(".iplusone_loaded_" + config.version);
        if (T.length > 0) {
          s(v, 100);
        } else {
          var S = p();
          if (S.length > 0) {
            if (window.IPO_Data) {
              var U = q().find(".IPO_Prepard");
              if (U.length == 0) {
                var V = "<div class=\"IPO_Prepard clearfix mt-1 ml-2\">";
                V += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
                V += "<span class=\"ml-2\">Waiting...<span id=\"IPO_Prepard_Text\"></span></span>";
                V += "</div>";
                q().prepend(V);
              } else {
                var W = U.find("#IPO_Prepard_Text");
                W.text(W.text() + ".");
              }
              if (window.IPO_Data.update > 0 && window.IPO_Data.update + 2000 > Date.now()) {
                s(v, 100);
              } else {
                console.log("ajax completed, checkPostInfo");
                s(G, 1000);
              }
            } else {
              console.log("checkPostInfo");
              s(G, 1000);
            }
          } else {
            s(v, 100);
          }
        }
      }
    }
    function w(Q) {
      console.log(Q);
      if (Q.operation == "checkReactFacebookPostInfo") {
        q().find(".IPO_Query").remove();
        if (Q.status == "success") {
          s(function () {
            jQuery("div.IPO_Inject").remove();
            x(Q.response);
          }, 100);
        } else {
          s(function () {
            jQuery("div.IPO_Inject").remove();
            P();
          }, 100);
        }
      } else if (Q.operation == "uploadReactFacebookComments") {
        q().find(".IPO_Uploading").remove();
        s(function () {
          P();
        }, 100);
      }
    }
    function x(Q) {
      jQuery("div.IPO_Inject").remove();
      var R = "";
      if (Q.code == 200) {
        var S = Q.data;
        f.post_snapshot_info = S;
        if (b) {
          S.status = "IMPORTED";
        }
        if (S.status == "IMPORTED" || S.status == "NOT_RUNNING") {
          f.post_snapshot_id = S.post_snapshot_id;
          if (S.status == "IMPORTED") {
            R = "<div class=\"IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_" + config.version + "\">";
            R += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
            R += "<button class=\"btn btn-sm btn-outline-danger disabled ml-2\">已匯入系統</button>";
            R += "<button class=\"btn btn-sm btn-success ml-2\" id=\"iplusone-reload_" + config.version + "\">更新留言</button>";
            R += "<button class=\"btn btn-sm btn-info ml-2\" id=\"iplusone-group_" + config.version + "\">前往後台</button>";
            if (!d) {
              R += "<button class=\"btn btn-sm btn-warning ml-2\" id=\"iplusone-upload_" + config.version + "\">展開留言並上傳</button>";
            }
            R += "</div>";
            q().prepend(R);
          } else {
            R = "<div class=\"IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_" + config.version + "\">";
            R += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
            R += "<button class=\"btn btn-sm btn-outline-default disabled ml-2\">已結束</button>";
            R += "<button class=\"btn btn-sm btn-info ml-2\" id=\"iplusone-group_" + config.version + "\">前往後台</button>";
            if (!d) {
              R += "<button class=\"btn btn-sm btn-warning ml-2\" id=\"iplusone-upload_" + config.version + "\">展開留言並上傳</button>";
            }
            R += "</div>";
            q().prepend(R);
          }
          if (d) {
            K();
          }
        } else if (S.status == "NOT_IMPORT") {
          R = "<div class=\"IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_" + config.version + "\">";
          R += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
          R += "<button class=\"btn btn-sm btn-primary ml-2\" id=\"iplusone-import_" + config.version + "\">尚未匯入</button>";
          R += "<button class=\"btn btn-sm btn-warning ml-2\" id=\"iplusone-link_" + config.version + "\">連結開團</button>";
          R += "</div>";
          q().prepend(R);
          P();
        } else if (S.status == "NOT_LINK") {
          R = "<div class=\"IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_" + config.version + "\">";
          R += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
          R += "<button class=\"btn btn-sm btn-warning ml-2\" id=\"iplusone-link_" + config.version + "\">連結開團</button>";
          R += "</div>";
          q().prepend(R);
          P();
        } else if (S.status == "NOT_OWNER") {
          console.log(Q);
          R = "<div class=\"IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_" + config.version + "\">";
          R += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
          R += "<button class=\"btn btn-sm btn-outline-danger disabled ml-2\">非貼文擁有者</button>";
          R += "</div>";
          q().prepend(R);
          P();
        } else if (S.status == "UPLOADING") {
          console.log(Q);
          R = "<div class=\"IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_" + config.version + "\">";
          R += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
          R += "<button class=\"btn btn-sm btn-outline-danger disabled ml-2\">留言處理中，請稍待</button>";
          R += "</div>";
          q().prepend(R);
          P();
        } else {
          R = "<div class=\"iplusone_loaded_" + config.version + "\">";
          R += "</div>";
          q().prepend(R);
          P();
        }
      } else if (Q.code == 50308) {
        R = "<div class=\"IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_" + config.version + "\">";
        R += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
        if (config.version == "DEV") {
          R += "<button class=\"btn btn-sm btn-danger ml-2\">更新 Chrome Extension</button>";
        } else {
          R += "<a target=\"_blank\" href=\"" + config.chrome_ext + "\" class=\"btn btn-sm btn-danger ml-2\">更新 Chrome Extension</a>";
        }
        R += "</div>";
        q().prepend(R);
      } else if (Q.code == 50317) {
        R = "<div class=\"IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_" + config.version + "\">";
        R += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
        R += "<button class=\"btn btn-sm btn-outline-danger disabled ml-2\">已被其他商店匯入 [" + Q.log_id + "]</button>";
        R += "</div>";
        q().prepend(R);
        P();
      } else {
        R = "<div class=\"IPO_Container IPO_Post_Info clearfix mt-1 iplusone_loaded_" + config.version + "\">";
        R += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
        R += "<button class=\"btn btn-sm btn-outline-danger disabled ml-2\">發生錯誤 [" + Q.log_id + "]：" + Q.message + "</button>";
        R += "</div>";
        q().prepend(R);
        P();
      }
    }
    function y(Q) {
      if (!Q) {
        return null;
      }
      for (var R in Q) {
        if (R.startsWith("__reactFiber")) {
          return Q[R];
        }
      }
      return null;
    }
    function z(Q) {
      var R = {
        id: Q.id
      };
      if (Q.image && Q.image.uri) {
        R.url = Q.image.uri;
      } else if (Q.photo_image && Q.photo_image.uri) {
        R.url = Q.photo_image.uri;
      } else if (Q.thumbnailImage && Q.thumbnailImage.uri) {
        R.url = Q.thumbnailImage.uri;
      } else if (Q.placeholder_image && Q.placeholder_image.uri) {
        R.url = Q.placeholder_image.uri;
      }
      return R;
    }
    function A(Q) {
      var R = [];
      var S = Q.length;
      var T = "";
      var U = 0;
      var V = false;
      var W = false;
      for (var X = 0; X < S; X++) {
        T = Q.charAt(X);
        if (V) {
          if (T == "\\") {
            if (W) {
              W = false;
            } else {
              W = true;
            }
          } else if (T == "\"") {
            if (W) {
              W = false;
            } else {
              V = false;
            }
          } else {
            W = false;
          }
        } else if (T == "\"") {
          V = true;
          W = false;
        } else if (T == "{") {
          R.push(T);
        } else if (T == "[") {
          R.push(T);
        } else if (T == "}") {
          var Y = R.pop();
          if (Y != "{") {
            break;
          }
          if (R.length == 0) {
            U = X + 1;
            break;
          }
        } else if (T == "]") {
          var Y = R.pop();
          if (Y != "[") {
            break;
          }
          if (R.length == 0) {
            U = X + 1;
            break;
          }
        }
      }
      if (U) {
        return Q.substring(0, U);
      }
      return null;
    }
    function B(Q, R) {
      var S = null;
      S = Q.indexOf("[],[\"adp_CometGroupRootQueryRelayPreloader_");
      if (S >= 0) {
        var T = /\[\],\[\"adp_CometGroupRootQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var U = T.exec(Q);
        if (U) {
          var V = JSON.parse(A(U[1]));
          if (V && V.__bbox && V.__bbox.result && V.__bbox.result.data && V.__bbox.result.data.group) {
            R.feed = V.__bbox.result.data.group;
            var W = null;
            if (R.feed.profile_header_renderer && R.feed.profile_header_renderer.group && R.feed.profile_header_renderer.group.id && R.feed.profile_header_renderer.group.name && R.feed.profile_header_renderer.group.__typename) {
              W = R.feed.profile_header_renderer.group;
            }
            if (R.feed.viewer_layout_renderer && R.feed.viewer_layout_renderer.group && R.feed.viewer_layout_renderer.group.featurable_title) {
              var X = R.feed.viewer_layout_renderer.group.featurable_title;
              if (X.text && X.ranges && X.ranges[0] && X.ranges[0].entity && X.ranges[0].entity.id && X.ranges[0].entity.__typename) {
                W = X.ranges[0].entity;
                if (!W.name) {
                  W.name = X.text;
                }
              }
            }
            if (W) {
              R.feed = W;
            }
          } else if (V && V.__bbox && V.__bbox.result && V.__bbox.result.data && V.__bbox.result.data.group_address && (!R.feed || !R.feed.name)) {
            R.feed = V.__bbox.result.data;
            R.feed.__typename = "Group";
          }
        }
        return;
      }
      S = Q.indexOf("[],[\"adp_CometPagePostsRootHeaderQueryRelayPreloader_");
      if (S >= 0) {
        var T = /\[\],\[\"adp_CometPagePostsRootHeaderQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var U = T.exec(Q);
        if (U) {
          var V = JSON.parse(A(U[1]));
          if (V && V.__bbox && V.__bbox.result && V.__bbox.result.data.page) {
            R.feed = V.__bbox.result.data.page;
          }
        }
        return;
      }
      S = Q.indexOf("[],[\"adp_CometPagePostsRootQueryRelayPreloader_");
      if (S >= 0) {
        var T = /\[\],\[\"adp_CometPagePostsRootQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var U = T.exec(Q);
        if (U) {
          var V = JSON.parse(A(U[1]));
          if (V && V.__bbox && V.__bbox.result && V.__bbox.result.data.page) {
            R.feed = V.__bbox.result.data.page;
          }
        }
        return;
      }
      S = Q.indexOf("[],[\"adp_CometGroupPermalinkRootFeedQueryRelayPreloader_");
      if (S >= 0) {
        var T = /\[\],\[\"adp_CometGroupPermalinkRootFeedQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var U = T.exec(Q);
        if (U) {
          var V = JSON.parse(A(U[1]));
          if (V && V.__bbox && V.__bbox.result && V.__bbox.result.data.node) {
            t(V.__bbox.result.data.node);
          }
        }
      }
      S = Q.indexOf("[],[\"adp_CometGroupPermalinkRootContentFeedQueryRelayPreloader_");
      if (S >= 0) {
        var T = /\[\],\[\"adp_CometGroupPermalinkRootContentFeedQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var U = T.exec(Q);
        if (U) {
          var V = JSON.parse(A(U[1]));
          if (V && V.__bbox && V.__bbox.result && V.__bbox.result.data.node) {
            t(V.__bbox.result.data.node);
          }
        }
      }
      S = Q.indexOf("[],[\"adp_CometSinglePostRootQueryRelayPreloader_");
      if (S >= 0) {
        var T = /\[\],\[\"adp_CometSinglePostRootQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var U = T.exec(Q);
        if (U) {
          var V = JSON.parse(A(U[1]));
          if (V && V.__bbox && V.__bbox.result && V.__bbox.result.data.node) {
            t(V.__bbox.result.data.node);
          }
        }
      }
      S = Q.indexOf("[],[\"adp_CometSinglePostContentQueryRelayPreloader_");
      if (S >= 0) {
        var T = /\[\],\[\"adp_CometSinglePostContentQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var U = T.exec(Q);
        if (U) {
          var V = JSON.parse(A(U[1]));
          if (V && V.__bbox && V.__bbox.result && V.__bbox.result.data.node) {
            t(V.__bbox.result.data.node);
          }
        }
      }
      S = Q.indexOf("[],[\"adp_CometSinglePostDialogContentQueryRelayPreloader_");
      if (S >= 0) {
        var T = /\[\],\[\"adp_CometSinglePostDialogContentQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var U = T.exec(Q);
        if (U) {
          var V = JSON.parse(A(U[1]));
          if (V && V.__bbox && V.__bbox.result && V.__bbox.result.data.node) {
            t(V.__bbox.result.data.node);
          }
        }
      }
      S = Q.indexOf("[],[\"adp_CometPagePostsRootHoistedStoryQueryRelayPreloader_");
      if (S >= 0) {
        var T = /\[\],\[\"adp_CometPagePostsRootHoistedStoryQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var U = T.exec(Q);
        if (U) {
          var V = JSON.parse(A(U[1]));
          if (V && V.__bbox && V.__bbox.result) {
            if (V.__bbox.result.data.node) {
              t(V.__bbox.result.data.node);
            } else if (V.__bbox.result.data.nodes && V.__bbox.result.data.nodes.length > 0) {
              t(V.__bbox.result.data.nodes[0]);
            }
          }
        }
      }
      S = Q.indexOf("[],[\"adp_CometGroupDiscussionRootSuccessQueryRelayPreloader_");
      if (S >= 0) {
        var T = /\[\],\[\"adp_CometGroupDiscussionRootSuccessQueryRelayPreloader_[a-z0-9]+\",(\{.*\})\]\]/g;
        var U = T.exec(Q);
        if (U) {
          var V = JSON.parse(A(U[1]));
          if (V && V.__bbox && V.__bbox.result && V.__bbox.result.data.node) {
            t(V.__bbox.result.data.node);
          }
        }
      }
    }
    function C() {
      var Q = {
        feed: null,
        story: null,
        isPageDelegate: false
      };
      if (!e) {
        if (window.document.scripts) {
          for (var R in Object.keys(window.document.scripts)) {
            var S = window.document.scripts[R];
            if (S && S.tagName == "SCRIPT" && S.type == "application/json" && S.textContent) {
              B(S.textContent, Q);
            }
          }
        }
        if (l.length > 0) {
          l.forEach(function (W) {
            B(W, Q);
          });
        }
        e = true;
      }
      if (Q.feed && Q.feed.__typename == "Group") {
        window.IPO_Data.groups[Q.feed.id] = Q.feed;
      }
      if (window.IPO_Data && f.post_id && window.IPO_Data.stories[f.post_id]) {
        Q.story = window.IPO_Data.stories[f.post_id];
      }
      if (Q.story && !Q.feed) {
        var T = null;
        if (Q.story.context_layout.story.comet_sections.title.story.comet_sections && Q.story.context_layout.story.comet_sections.title.story.comet_sections.action_link && Q.story.context_layout.story.comet_sections.title.story.comet_sections.action_link.group) {
          T = Q.story.context_layout.story.comet_sections.title.story.comet_sections.action_link.group;
          T.__typename = "Group";
        } else if (Q.story.context_layout.story.comet_sections.title.story.to) {
          T = Q.story.context_layout.story.comet_sections.title.story.to;
        } else {
          T = Q.story.context_layout.story.comet_sections.title.story.actors[0];
        }
        if (T) {
          console.log(T);
          if (T.__typename == "User") {
            if (window.IPO_Data && window.IPO_Data.users[T.id]) {
              Q.feed = window.IPO_Data.users[T.id];
            }
          } else if (T.__typename == "Page") {
            if (window.IPO_Data && window.IPO_Data.pages[T.id]) {
              Q.feed = window.IPO_Data.pages[T.id];
            }
          } else if (T.__typename == "Group" && window.IPO_Data && window.IPO_Data.groups[T.id]) {
            Q.feed = window.IPO_Data.groups[T.id];
          }
          if (!Q.feed) {
            Q.feed = {
              __typename: T.__typename,
              id: T.id,
              name: T.name
            };
          }
        }
      }
      if (Q.story) {
        var U = Q.story;
        var V = null;
        if (U.context_layout.story.comet_sections && U.context_layout.story.comet_sections.action_link && U.context_layout.story.comet_sections.action_link.group) {
          V = U.context_layout.story.comet_sections.action_link.group.id;
        } else if (U.context_layout.story.comet_sections.title && U.context_layout.story.comet_sections.title.story && U.context_layout.story.comet_sections.title.story.comet_sections && U.context_layout.story.comet_sections.title.story.comet_sections.action_link && U.context_layout.story.comet_sections.title.story.comet_sections.action_link.group) {
          V = U.context_layout.story.comet_sections.title.story.comet_sections.action_link.group.id;
        }
        if (V && (!Q.feed || Q.feed && Q.feed.id != V) && window.IPO_Data && window.IPO_Data.groups[V]) {
          Q.feed = window.IPO_Data.groups[V];
          console.log("use cache feed %o", Q.feed);
        }
      }
      if (Q.story && Q.story.footer && Q.story.footer.story && Q.story.footer.story.delegate_page_id && Q.feed) {
        Q.feed.id = Q.story.footer.story.delegate_page_id;
        Q.feed.__typename = "Page";
        Q.isPageDelegate = true;
      }
      return Q;
    }
    function D(Q) {
      if (Q) {
        var R = a[Q];
        if (R) {
          var S = "<div class=\"IPO_Container IPO_Query clearfix mt-1 ml-2\">";
          S += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
          S += "<span class=\"ml-2 text-danger\">" + R + "</span>";
          S += "<button class=\"btn btn-sm btn-danger ml-2\" id=\"iplusone-reload_" + config.version + "\">重新整理</button>";
          S += "</div>";
          q().prepend(S);
        }
        jQuery("div.IPO_Inject").remove();
        P();
      }
    }
    function E(Q) {
      var R = null;
      if (Q.feedback && Q.feedback.story && Q.feedback.story.feedback_context && Q.feedback.story.feedback_context.feedback_target_with_context && Q.feedback.story.feedback_context.feedback_target_with_context.subscription_target_id) {
        R = Q.feedback.story.feedback_context.feedback_target_with_context.subscription_target_id;
      }
      var S = null;
      if (Q.context_layout && Q.context_layout.story && Q.context_layout.story.id) {
        S = atob(Q.context_layout.story.id);
      } else if (Q.id) {
        S = atob(Q.id);
      }
      var T = null;
      var U = null;
      var V = null;
      T = /^S:_I\d+:(VK:)?(?<post_id>\d+)(:\d+)?$/g;
      U = T.exec(S);
      if (U) {
        R = U.groups.post_id;
      }
      return R;
    }
    function F(Q) {
      var R = null;
      var S = null;
      if (Q.feedback && Q.feedback.story && Q.feedback.story.url) {
        S = Q.feedback.story.url;
      } else if (Q.feedback && Q.feedback.story && Q.feedback.story.comet_feed_ufi_container && Q.feedback.story.comet_feed_ufi_container.story && Q.feedback.story.comet_feed_ufi_container.story.url) {
        S = Q.feedback.story.comet_feed_ufi_container.story.url;
      } else if (Q.feedback && Q.feedback.story && Q.feedback.story.comet_feed_ufi_container && Q.feedback.story.comet_feed_ufi_container.story && Q.feedback.story.comet_feed_ufi_container.story.story_ufi_container && Q.feedback.story.comet_feed_ufi_container.story.story_ufi_container.story && Q.feedback.story.comet_feed_ufi_container.story.story_ufi_container.story.url) {
        S = Q.feedback.story.comet_feed_ufi_container.story.story_ufi_container.story.url;
      } else if (Q.feedback && Q.feedback.story && Q.feedback.story.story_ufi_container && Q.feedback.story.story_ufi_container.story && Q.feedback.story.story_ufi_container.story.url) {
        S = Q.feedback.story.story_ufi_container.story.url;
      }
      if (S) {
        var T = /story_fbid=(?<post_fbid>pfbid[A-Za-z0-9]+)/g;
        var U = T.exec(S);
        if (U) {
          R = U.groups.post_fbid;
        } else {
          T = /posts\/(?<post_fbid>pfbid[A-Za-z0-9]+)/g;
          U = T.exec(S);
          if (U) {
            R = U.groups.post_fbid;
          }
        }
      }
      return R;
    }
    function G() {
      var Q = C();
      var R = Q.feed;
      var S = Q.story;
      var T = null;
      console.log("isPageDelegate %o", Q.isPageDelegate);
      console.log("feed %o", R);
      console.log("story %o", S);
      q().find(".IPO_Prepard").remove();
      if (f.post_id && !S) {
        D("NO_STORY");
        return;
      }
      if (R && S) {
        T = {};
        if (!R.__typename && R.featurable_title && R.featurable_title.ranges) {
          R.featurable_title.ranges.forEach(function (a5) {
            if (a5.entity && a5.entity.__typename && a5.entity.id == R.id) {
              R.__typename = a5.entity.__typename;
            }
          });
        }
        if (!R.name && R.featurable_title && R.featurable_title.text) {
          R.name = R.featurable_title.text;
        }
        if ((!R.__typename || !R.name) && R.profile_header_renderer && R.profile_header_renderer.group && R.profile_header_renderer.group.id && R.profile_header_renderer.group.featurable_title) {
          if (!R.name && R.profile_header_renderer.group.featurable_title.text) {
            R.name = R.profile_header_renderer.group.featurable_title.text;
          }
          if (!R.__typename) {
            R.profile_header_renderer.group.featurable_title.ranges.forEach(function (a5) {
              if (a5.entity && a5.entity.__typename && a5.entity.id == R.id) {
                R.__typename = a5.entity.__typename;
              }
            });
          }
        }
        f.feed_info = R;
        f.story_info = S;
        var U = E(S);
        var V = F(S);
        var W = null;
        console.log("body feed id: %s", R.id);
        console.log("url post id: %s", f.post_id);
        console.log("body post id: %s", U);
        console.log("body post fbid: %s", V);
        if (V == f.post_id) {
          f.post_id = U;
        }
        if (U != f.post_id) {
          if (S.content.story.attached_story) {
            console.log("attached story");
            console.log(S.content.story.attached_story);
            jQuery("div.IPO_Inject").remove();
          } else {
            D("POST_ID_MISMATCH");
          }
          return;
        }
        console.log(R.__typename);
        if (R.__typename == "Group") {
          if (S.context_layout.story.comet_sections && S.context_layout.story.comet_sections.action_link && S.context_layout.story.comet_sections.action_link.group) {
            W = S.context_layout.story.comet_sections.action_link.group.id;
          } else if (S.context_layout.story.comet_sections.title && S.context_layout.story.comet_sections.title.story && S.context_layout.story.comet_sections.title.story.comet_sections && S.context_layout.story.comet_sections.title.story.comet_sections.action_link && S.context_layout.story.comet_sections.title.story.comet_sections.action_link.group) {
            W = S.context_layout.story.comet_sections.title.story.comet_sections.action_link.group.id;
          }
          if (W) {
            console.log("body group id: %s", W);
            if (W != R.id) {
              var X = "^https:\\/\\/www\\.facebook\\.com\\/groups\\/[A-Za-z0-9\\._]+\\/(permalink|posts)\\/(?<post_id>\\d+)";
              var Y = new RegExp(X);
              if (Y.test(window.location.href)) {
                console.log(window.location);
                var Z = "/groups/" + W + "/permalink/" + U + window.location.search;
                console.log(Z);
                window.history.replaceState({}, null, Z);
                D("RENAMED_GROUP_ID");
                return;
              }
            }
          }
        }
        if (S.context_layout.story.comet_sections.timestamp) {
          T.created_timestamp = S.context_layout.story.comet_sections.timestamp.story.creation_time;
        } else if (S.context_layout.story.comet_sections.metadata) {
          S.context_layout.story.comet_sections.metadata.forEach(function (a5) {
            if ((a5.__typename == "CometFeedStoryTimestampStrategy" || a5.__typename == "CometFeedStoryMinimizedTimestampStrategy") && a5.story && a5.story.creation_time) {
              T.created_timestamp = a5.story.creation_time;
            }
          });
        }
        T.created_time = new Date(T.created_timestamp * 1000).toISOString();
        T.product_imgs = [];
        T.comments = [];
        T.total_comments = 0;
        if (R.__typename == "Group") {
          T.fb_feed_type = "group";
        } else if (R.__typename == "Page") {
          T.fb_feed_type = "page";
        } else if (R.__typename == "User") {
          T.fb_feed_type = "user";
        } else {
          T.fb_feed_type = "unknow";
        }
        T.fb_feed_id = R.id;
        T.fb_feed_title = R.name;
        T.fb_post_id = R.id + "_" + U;
        T.post_type = "normal";
        T.message = "";
        if (S.content.story.comet_sections.message) {
          if (S.content.story.comet_sections.message.story && S.content.story.comet_sections.message.story.message && S.content.story.comet_sections.message.story.message.text) {
            T.message = S.content.story.comet_sections.message.story.message.text;
          } else if (S.content.story.comet_sections.message.rich_message) {
            var a0 = [];
            S.content.story.comet_sections.message.rich_message.forEach(function (a5) {
              a0.push(a5.text);
            });
            T.message = a0.join("\n");
          }
        }
        if (T.fb_feed_type == "group") {
          var a1 = null;
          if (S.feedback.story.comet_feed_ufi_container && S.feedback.story.comet_feed_ufi_container.story && S.feedback.story.comet_feed_ufi_container.story.feedback_context && S.feedback.story.comet_feed_ufi_container.story.feedback_context.feedback_target_with_context && S.feedback.story.comet_feed_ufi_container.story.feedback_context.feedback_target_with_context.ufi_renderer && S.feedback.story.comet_feed_ufi_container.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback && S.feedback.story.comet_feed_ufi_container.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer && S.feedback.story.comet_feed_ufi_container.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer.feedback) {
            a1 = S.feedback.story.comet_feed_ufi_container.story.feedback_context.feedback_target_with_context.ufi_renderer.feedback.comet_ufi_summary_and_actions_renderer.feedback;
          }
          if (!a1 && S.feedback.story.comet_feed_ufi_container && S.feedback.story.comet_feed_ufi_container.story && S.feedback.story.comet_feed_ufi_container.story.story_ufi_container && S.feedback.story.comet_feed_ufi_container.story.story_ufi_container.story && S.feedback.story.comet_feed_ufi_container.story.story_ufi_container.story.feedback_context && S.feedback.story.comet_feed_ufi_container.story.story_ufi_container.story.feedback_context.feedback_target_with_context && S.feedback.story.comet_feed_ufi_container.story.story_ufi_container.story.feedback_context.feedback_target_with_context.comment_list_renderer && S.feedback.story.comet_feed_ufi_container.story.story_ufi_container.story.feedback_context.feedback_target_with_context.comment_list_renderer.feedback) {
            a1 = S.feedback.story.comet_feed_ufi_container.story.story_ufi_container.story.feedback_context.feedback_target_with_context.comment_list_renderer.feedback;
          }
          if (a1 && a1.comment_rendering_instance && a1.comment_rendering_instance.comments) {
            var a2 = a1.comment_rendering_instance.comments;
            if (a2.total_count) {
              T.total_comments = a2.total_count;
            }
          }
          if (a1 && a1.comment_rendering_instance_for_feed_location && a1.comment_rendering_instance_for_feed_location.comments) {
            var a2 = a1.comment_rendering_instance_for_feed_location.comments;
            if (a2.edges) {
              if (!window.IPO_Data.comemntsContainer) {
                window.IPO_Data.comemntsContainer = {};
              }
              if (!window.IPO_Data.comemntsContainer[f.post_id]) {
                window.IPO_Data.comemntsContainer[f.post_id] = [];
              }
              a2.edges.forEach(function (a5) {
                if (a5.node) {
                  var a6 = null;
                  var a7 = "";
                  var a8 = [];
                  if (a5.node.author.__typename == "User") {
                    a6 = "user";
                  } else if (a5.node.author.__typename == "Page") {
                    a6 = "page";
                  }
                  if (a5.node.body && a5.node.body.text) {
                    a7 = a5.node.body.text;
                  } else {
                    a7 = "";
                  }
                  if (a5.node.body && a5.node.body.ranges) {
                    a5.node.body.ranges.forEach(function (aa) {
                      var ab = a5.node.body.text.substring(aa.offset, aa.offset + aa.length);
                      if (aa.entity.__typename == "User") {
                        a6 = "user";
                      } else if (aa.entity.__typename == "Page") {
                        a6 = "page";
                      }
                      var ac = {
                        profile_id: aa.entity.id,
                        type: a6,
                        name: ab
                      };
                      a8.push(ac);
                    });
                  }
                  var a9 = {
                    id: a5.node.legacy_token,
                    message: a7,
                    from: {
                      name: a5.node.author.name,
                      profile_id: a5.node.author.id,
                      type: a6
                    },
                    created_timestamp: a5.node.created_time,
                    message_tags: a8
                  };
                  window.IPO_Data.comemntsContainer[f.post_id].push(a9);
                }
              });
            }
            window.IPO_Data.comemntsContainerCount = window.IPO_Data.comemntsContainer[f.post_id].length;
          }
        }
        if (S.context_layout.story.actors && S.context_layout.story.actors.length > 0) {
          T.user_profile_id = S.context_layout.story.actors[0].id;
          T.user_profile_type = S.context_layout.story.actors[0].__typename;
        } else if (S.context_layout.story.comet_sections.title && S.context_layout.story.comet_sections.title.story && S.context_layout.story.comet_sections.title.story.actors && S.context_layout.story.comet_sections.title.story.actors.length > 0) {
          T.user_profile_id = S.context_layout.story.comet_sections.title.story.actors[0].id;
          T.user_profile_type = S.context_layout.story.comet_sections.title.story.actors[0].__typename;
        } else if (Q.isPageDelegate) {
          T.user_profile_id = R.id;
          T.user_profile_type = R.__typename;
        }
        if (S.content.story.attachments) {
          S.content.story.attachments.forEach(function (a5) {
            if (a5.styles.__typename == "StoryAttachmentGroupSellProductItemStyleRenderer") {
              var a6 = a5.styles.attachment.title_with_entities.text.trim();
              var a7 = "";
              var a8 = "";
              T.post_type = "sale";
              a5.styles.attachment.properties.forEach(function (ac) {
                if (ac.key == "price") {
                  a7 = ac.value.text.trim();
                }
                if (ac.key == "description") {
                  a8 = ac.value.text.trim();
                }
              });
              T.message = a6 + "\n" + a7 + `

` + a8;
            } else if (a5.styles.__typename == "StoryAttachmentAlbumStyleRenderer" || a5.styles.__typename == "StoryAttachmentVideoStyleRenderer" || a5.styles.__typename == "StoryAttachmentPhotoStyleRenderer" || a5.styles.__typename == "StoryAttachmentProfileMediaStyleRenderer" || a5.styles.__typename == "StoryAttachmentAlbumSaleItemStyleRenderer" || a5.styles.__typename == "StoryAttachmentCommerceAttachmentStyleRenderer") {
              if (a5.styles.__typename == "StoryAttachmentCommerceAttachmentStyleRenderer") {
                var a6 = a5.styles.attachment.title_with_entities.text.trim();
                var a7 = "";
                T.post_type = "sale";
                if (a5.styles.attachment.target && a5.styles.attachment.target.formatted_price) {
                  a7 = a5.styles.attachment.target.formatted_price.text.trim();
                }
                T.message = a6 + "\n" + a7 + `

` + T.message;
              }
              if (a5.styles.attachment.media) {
                var a9 = a5.styles.attachment.media;
                if (a9.__typename == "Photo" || a9.__typename == "Video") {
                  T.product_imgs.push(z(a9));
                }
              }
              if (a5.styles.attachment.all_subattachments && a5.styles.attachment.all_subattachments.nodes) {
                a5.styles.attachment.all_subattachments.nodes.forEach(function (ac) {
                  if (ac.media && (ac.media.__typename == "Photo" || ac.media.__typename == "Video")) {
                    T.product_imgs.push(z(ac.media));
                  }
                });
              }
            } else if (a5.styles.__typename == "StoryAttachmentAlbumFrameStyleRenderer") {
              var aa = a5.styles.attachment;
              var ab = null;
              if (aa) {
                if (aa.five_photos_subattachments && aa.five_photos_subattachments.nodes) {
                  ab = aa.five_photos_subattachments.nodes;
                } else if (aa.four_photos_subattachments && aa.four_photos_subattachments.nodes) {
                  ab = aa.four_photos_subattachments.nodes;
                } else if (aa.three_photos_subattachments && aa.three_photos_subattachments.nodes) {
                  ab = aa.three_photos_subattachments.nodes;
                } else if (aa.two_photos_subattachments && aa.two_photos_subattachments.nodes) {
                  ab = aa.two_photos_subattachments.nodes;
                }
              }
              if (ab) {
                ab.forEach(function (ac) {
                  var ad = ac.media;
                  if (ad && (ad.__typename == "Photo" || ad.__typename == "Video")) {
                    T.product_imgs.push(z(ad));
                  }
                });
              }
            }
          });
        }
        console.log(T);
        f.post_info = T;
      }
      if (T) {
        var a3 = q().find(".IPO_Query");
        if (a3.length == 0) {
          var a4 = "<div class=\"IPO_Query clearfix mt-1 ml-2\">";
          a4 += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
          a4 += "<span class=\"ml-2\">Checking...</span>";
          a4 += "</div>";
          q().prepend(a4);
        }
        g.postMessage({
          operation: "checkReactFacebookPostInfo",
          post_info: T
        });
      } else {
        jQuery("div.IPO_Inject").remove();
        P();
      }
    }
    function H() {
      q().find(".IPO_Loading").remove();
    }
    function I() {
      var Q = null;
      var R = null;
      var S = 1;
      var T = p();
      T.find("ul").each(function (U, V) {
        var W = y(V);
        if (W && W.return && W.return.pendingProps.commentsListRenderProps && W.return.pendingProps.commentsListRenderProps.listState) {
          R = W.return.pendingProps.commentsListRenderProps;
          Q = V;
          S = 1;
        } else if (W && W.return && W.return.return && W.return.return.pendingProps.commentsListRenderProps && W.return.return.pendingProps.commentsListRenderProps.listState) {
          R = W.return.return.pendingProps.commentsListRenderProps;
          Q = V;
          S = 1;
        }
      });
      if (S == 1 && (!Q || !R)) {
        T.find("div.html-div.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp").each(function (U, V) {
          Q = V;
          S = 2;
        });
      }
      if (S == 1 && (!Q || !R)) {
        T.find("div.x1pi30zi.x1swvt13.x1n2onr6 > div.x1gslohp").each(function (U, V) {
          Q = V;
          S = 2;
        });
      }
      return {
        story_container: T,
        comments_type: S,
        comments_container: Q,
        comments_info: R
      };
    }
    function J(Q, R) {
      if (R == 1) {
        var S = jQuery();
        if (S.length == 0) {
          S = Q.find("div.x6s0dn4.x78zum5.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xe0p6wg span");
        }
        if (S.length > 0) {
          S.click();
          s(function () {
            var U = -1;
            var V = jQuery();
            if (V.length == 0) {
              V = jQuery("div.x1n2onr6.x1fqp7bg[role=\"menu\"]");
            }
            if (V.length == 0) {
              V = jQuery("div.x1n2onr6.xcxhlts[role=\"menu\"]");
            }
            if (V.length == 0) {
              s(K, 1000);
              return;
            }
            var W = y(V.get(0));
            var X = null;
            if (W && W.child && W.child.pendingProps && W.child.pendingProps.children && W.child.pendingProps.children.props && W.child.pendingProps.children.props.children) {
              console.log(W.child.pendingProps.children.props.children);
              if (jQuery.isArray(W.child.pendingProps.children.props.children)) {
                X = W.child.pendingProps.children.props.children;
              } else if (jQuery.isArray(W.child.pendingProps.children.props.children.props.children)) {
                X = W.child.pendingProps.children.props.children.props.children;
              }
              if (X) {
                X.forEach(function (Z, a0) {
                  console.log(Z);
                  if (Z.key == "RANKED_UNFILTERED") {
                    U = a0;
                  } else if (Z.key == "TOPLEVEL") {
                    U = a0;
                  } else if (Z.key == "RECENT_ACTIVITY") {
                    U = a0;
                  }
                });
              }
            }
            console.log("menuitem idx: " + U);
            var Y = false;
            V.find("div[role=\"menuitem\"]").each(function (Z, a0) {
              if (Y) {
                return;
              }
              if (U != -1) {
                if (Z == U) {
                  a0.click();
                  Y = true;
                  s(K, 1000);
                }
              } else {
                var a1 = jQuery(a0).find("span:first").text();
                console.log(a1);
                if (a1 == "所有回應" || a1 == "所有留言" || a1 == "All comments") {
                  a0.click();
                  Y = true;
                  s(K, 1000);
                }
              }
            });
          }, 100);
          N();
        } else {
          s(K, 1000);
        }
      } else if (R == 2) {
        var S = jQuery();
        if (S.length == 0) {
          S = Q.find("div.x6s0dn4.x78zum5.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xe0p6wg > div > span");
        }
        var T = S.text().trim();
        if (S.length > 0 && !(T == "所有回應" || T == "所有留言" || T == "從舊到新" || T == "All comments")) {
          S.click();
          s(function () {
            var U = -1;
            var V = jQuery();
            if (V.length == 0) {
              V = jQuery("div.x1n2onr6.x1fqp7bg[role=\"menu\"]");
            }
            if (V.length == 0) {
              V = jQuery("div.x1n2onr6.xcxhlts[role=\"menu\"]");
            }
            if (V.length == 0) {
              s(K, 1000);
              return;
            }
            var W = false;
            V.find("div[role=\"menuitem\"]").each(function (X, Y) {
              if (W) {
                return;
              }
              var Z = jQuery(Y).find("span:first").text().trim();
              console.log(Z);
              if (Z == "所有回應" || Z == "所有留言" || Z == "從舊到新" || Z == "All comments") {
                Y.click();
                W = true;
                s(K, 1000);
              }
            });
          }, 100);
          N();
        } else {
          s(K, 1000);
        }
      }
    }
    function K() {
      var Q = q().find(".IPO_Loading");
      if (Q.length == 0) {
        var R = "<div class=\"IPO_Loading clearfix mt-1 ml-2\">";
        R += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
        R += "<span class=\"ml-2\">載入留言中...<span id=\"IPO_Loading_Text\"></span></span>";
        R += "</div>";
        q().find(".IPO_Container").after(R);
      } else {
        var S = Q.find("#IPO_Loading_Text");
        S.text(S.text() + ".");
      }
      var T = I();
      var U = T.story_container;
      var V = T.comments_container;
      var W = T.comments_info;
      var X = T.comments_type;
      if (!U || !V) {
        console.log("no story_container");
        h++;
        if (h < 5) {
          if (U) {
            J(U, X);
          } else {
            s(K, 1000);
            N();
          }
        } else {
          H();
          P();
        }
        return;
      }
      if (X == 1) {
        if (W) {
          console.log(W.viewOption);
          if (W.viewOption != "RANKED_UNFILTERED" && W.viewOption != "TOPLEVEL" && W.viewOption != "RECENT_ACTIVITY") {
            var Y = jQuery();
            if (Y.length == 0) {
              Y = U.find("div.x6s0dn4.x78zum5.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xe0p6wg span");
            }
            if (Y.length > 0) {
              Y.click();
              s(function () {
                var a3 = -1;
                var a4 = jQuery();
                if (a4.length == 0) {
                  a4 = jQuery("div.x1n2onr6.x1fqp7bg[role=\"menu\"]");
                }
                if (a4.length == 0) {
                  a4 = jQuery("div.x1n2onr6.xcxhlts[role=\"menu\"]");
                }
                if (a4.length == 0) {
                  s(K, 1000);
                  return;
                }
                var a5 = y(a4.get(0));
                var a6 = null;
                if (a5 && a5.child && a5.child.pendingProps && a5.child.pendingProps.children && a5.child.pendingProps.children.props && a5.child.pendingProps.children.props.children) {
                  console.log(a5.child.pendingProps.children.props.children);
                  if (jQuery.isArray(a5.child.pendingProps.children.props.children)) {
                    a6 = a5.child.pendingProps.children.props.children;
                  } else if (jQuery.isArray(a5.child.pendingProps.children.props.children.props.children)) {
                    a6 = a5.child.pendingProps.children.props.children.props.children;
                  }
                  if (a6) {
                    a6.forEach(function (a8, a9) {
                      console.log(a8);
                      if (a8.key == "RANKED_UNFILTERED") {
                        a3 = a9;
                      } else if (a8.key == "TOPLEVEL") {
                        a3 = a9;
                      } else if (a8.key == "RECENT_ACTIVITY") {
                        a3 = a9;
                      }
                    });
                  }
                }
                console.log("menuitem idx: " + a3);
                var a7 = false;
                a4.find("div[role=\"menuitem\"]").each(function (a8, a9) {
                  if (a7) {
                    return;
                  }
                  if (a3 != -1) {
                    if (a8 == a3) {
                      a9.click();
                      a7 = true;
                      s(K, 1000);
                    }
                  } else {
                    var aa = jQuery(a9).find("span:first").text();
                    console.log(aa);
                    if (aa == "所有回應" || aa == "所有留言" || aa == "All comments") {
                      a9.click();
                      a7 = true;
                      s(K, 1000);
                    }
                  }
                });
              }, 100);
              N();
              return;
            }
          }
          if (W.listState.pagers.backward || W.listState.pagers.forward) {
            var Z = jQuery();
            if (Z.length == 0) {
              Z = U.find("div.x78zum5.x1iyjqo2.x21xpn4.x1n2onr6 span.x78zum5.x1w0mnb.xeuugli");
            }
            Z.each(function (a3, a4) {
              var a5 = jQuery(a4).text();
              var a6 = ["^檢視另 *d+ *則留言$", "^查看更多留言$", "^顯示先前的留言$", "^查看另 *d+ *則留言$", "^檢視另 *d+ *則回答$", "^查看更多回答$", "^顯示先前的回答$", "^查看先前的回答$", "^查看另 *d+ *則回答$", "^查看 *d+ *則先前的留言$", "^查看 *d+ *個之前的答案$"];
              var a7 = [];
              a6.forEach(function (a8) {
                a7.push(new RegExp(a8));
              });
              a7.forEach(function (a8) {
                var a9 = a5.match(a8);
                if (a9) {
                  N();
                  a4.click();
                }
              });
            });
            s(K, 1000);
          } else {
            console.log("comments count: " + Object.keys(W.listState.commentsByID).length);
            s(M, 100);
          }
        }
      } else if (X == 2) {
        var Y = jQuery();
        if (Y.length == 0) {
          Y = U.find("div.x6s0dn4.x78zum5.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xe0p6wg > div > span");
        }
        var a0 = Y.text().trim();
        if (Y.length > 0 && !(a0 == "所有回應" || a0 == "所有留言" || a0 == "從舊到新" || a0 == "All comments")) {
          Y.click();
          s(function () {
            var a3 = -1;
            var a4 = jQuery();
            if (a4.length == 0) {
              a4 = jQuery("div.x1n2onr6.x1fqp7bg[role=\"menu\"]");
            }
            if (a4.length == 0) {
              a4 = jQuery("div.x1n2onr6.xcxhlts[role=\"menu\"]");
            }
            if (a4.length == 0) {
              s(K, 1000);
              return;
            }
            var a5 = false;
            a4.find("div[role=\"menuitem\"]").each(function (a6, a7) {
              if (a5) {
                return;
              }
              var a8 = jQuery(a7).find("span:first").text().trim();
              console.log(a8);
              if (a8 == "所有回應" || a8 == "所有留言" || a8 == "從舊到新" || a8 == "All comments") {
                a7.click();
                a5 = true;
                s(K, 1000);
              }
            });
          }, 100);
          N();
        } else if (!window.IPO_Data.comemntsContainer && window.IPO_Data.updateCount < 2) {
          window.IPO_Data.updateCount += 1;
          s(K, 1000);
          N();
        } else if (window.IPO_Data.comemntsContainer && !window.IPO_Data.comemntsContainer[f.post_id] && window.IPO_Data.updateCount < 2) {
          window.IPO_Data.updateCount += 1;
          s(K, 1000);
          N();
        } else if (window.IPO_Data.comemntsContainer && window.IPO_Data.comemntsContainer[f.post_id] && (window.IPO_Data.comemntsContainer[f.post_id].length != window.IPO_Data.comemntsContainerCount || window.IPO_Data.updateCount < 2)) {
          if (window.IPO_Data.comemntsContainer[f.post_id].length != window.IPO_Data.comemntsContainerCount) {
            window.IPO_Data.comemntsContainerCount = window.IPO_Data.comemntsContainer[f.post_id].length;
            var a1 = false;
            var a2 = jQuery(V).find("> div.x78zum5.x13a6bvl > div.x1iyjqo2 div[role=\"button\"]");
            if (a2.length > 0) {
              if (a2.find("div[role=\"status\"]").length > 0) {
                s(K, 100);
              } else {
                a2.each(function (a3, a4) {
                  if (a1) {
                    return;
                  }
                  a4.click();
                  window.IPO_Data.updateCount = 0;
                  s(K, 1000);
                });
              }
            } else {
              L(U);
              s(K, 1000);
            }
            N();
          } else {
            window.IPO_Data.updateCount += 1;
            L(U);
            s(K, 1000);
            N();
          }
        } else {
          var a1 = false;
          var a2 = jQuery(V).find("> div.x78zum5.x13a6bvl > div.x1iyjqo2 div[role=\"button\"]");
          if (a2.length > 0) {
            if (a2.find("div[role=\"status\"]").length > 0) {
              s(K, 100);
            } else {
              a2.each(function (a3, a4) {
                if (a1) {
                  return;
                }
                a4.click();
                window.IPO_Data.updateCount = 0;
                s(K, 1000);
              });
            }
          } else {
            L(U);
            s(M, 100);
          }
          N();
        }
      } else {
        H();
        P();
      }
    }
    function L(Q) {
      var R = Q.find("div.x78zum5.xdt5ytf.x1iyjqo2.x1n2onr6.xaci4zi.x129vozr");
      if (R.length > 0) {
        var S = R.get(0).scrollHeight;
        R.parent().get(0).scrollTo(0, S);
      }
    }
    function M() {
      H();
      var emjoiRanges = ["[-]", "�[�-�]", "�[�-�]", "�[�-�]", "�[�-�]"];
      var Q = I();
      var R = Q.comments_container;
      var S = Q.comments_type;
      var T = 0;
      var U = 0;
      var V = 0;
      if (S == 1) {
        jQuery(R).children("li").each(function (a7, a8) {
          V++;
          var a9 = jQuery(a8).find("div.x1ye3gou.xwib8y2.xn6708d.x1y1aw1k").get(0);
          if (!a9) {
            U++;
            return;
          }
          var aa = y(a8).child.pendingProps;
          var ab = jQuery(a9).find("div.x1iorvi4.xjkvuk6.x1lliihq div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs").get(0);
          var ac = null;
          if (ab) {
            var ad = y(ab);
            if (ad) {
              ac = ad.return.pendingProps;
            }
          }
          var ae = {};
          var af = y(jQuery(a9).parent().get(0));
          var ag = null;
          if (af && af.return.pendingProps.comment) {
            ag = af.return.pendingProps.comment;
          }
          if (!ag) {
            U++;
            return;
          }
          var ah = ag.legacy_fbid;
          var ai = atob(ag.id);
          var aj = /:([0-9_]+)$/g;
          var ak = aj.exec(ai);
          if (!ak) {
            U++;
            return;
          }
          ae.id = ak[1];
          if (aa.comment && aa.comment.created_time) {
            ae.created_timestamp = aa.comment.created_time;
          } else if (ag.created_time) {
            ae.created_timestamp = ag.created_time;
          } else {
            U++;
            return;
          }
          ae.created_time = new Date(ae.created_timestamp * 1000).toISOString();
          if (ag.preferred_body && ag.preferred_body.text != undefined) {
            ae.message = ag.preferred_body.text;
          } else if (ac && ac.text != undefined) {
            ae.message = ac.text;
          } else if (ag.attachments && ag.attachments.length > 0) {
            ae.message = "";
          } else {
            U++;
            return;
          }
          ae.from = {};
          ae.from.profile_id = ag.author.id;
          ae.from.name = ag.author.name;
          ae.message_tags = [];
          var al = y(ab);
          if (al && al.return.pendingProps.ranges) {
            var am = al.return.pendingProps.text.replace(new RegExp(emjoiRanges.join("|"), "g"), " ");
            al.return.pendingProps.ranges.forEach(function (an) {
              var ao = am.substring(an.offset, an.offset + an.length);
              if (ao.indexOf("http") !== -1 && ao.indexOf("facebook.com") !== -1) {
                return;
              }
              if (!an.entity) {
                return;
              }
              if (an.entity.__typename == "User") {
                var ap = {
                  profile_id: an.entity.id,
                  type: "user",
                  name: ao
                };
                ae.message_tags.push(ap);
              } else if (an.entity.__typename == "Page") {
                var ap = {
                  profile_id: an.entity.id,
                  type: "page",
                  name: ao
                };
                ae.message_tags.push(ap);
              }
            });
          }
          f.post_info.comments.push(ae);
          if (f.post_snapshot_info.comments[ah]) {
            jQuery(a9).append("<div class=\"IPO_Container IPO_Comment_Status\"><span class=\"badge badge-pill badge-success ml-2\">✔️ 已匯入</span></div>");
          } else {
            jQuery(a9).append("<div class=\"IPO_Container IPO_Comment_Status\"><span class=\"badge badge-pill badge-info ml-2\">➕ 新留言，上傳系統中</span></div>");
            T++;
          }
        });
      } else if (S == 2) {
        var W = jQuery();
        if (W.length == 0) {
          W = jQuery(R).find("> div.x78zum5.xdt5ytf > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x169t7cy.x19f6ikt > div.x1n2onr6");
        }
        if (W.length == 0) {
          W = jQuery(R).find("> div > div.x169t7cy.x19f6ikt > div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6");
        }
        if (W.length == 0) {
          W = jQuery(R).find("> div > div.x169t7cy.x19f6ikt > div.x1n2onr6.x1swvt13.x1iorvi4.x78zum5.x1q0g3np.x1a2a7pz");
        }
        if (W.length == 0) {
          W = jQuery(R).find("> div > div.x169t7cy.x19f6ikt > div.x1n2onr6.x1ye3gou.x1iorvi4.x78zum5.x1q0g3np.x1a2a7pz");
        }
        if (W.length == 0) {
          W = jQuery(R).find("> div > div.x16hk5td.x12rz0ws > div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6");
        }
        if (W.length == 0) {
          W = jQuery(R).find("> div > div.x16hk5td.x12rz0ws > div.x1n2onr6.x1swvt13.x1iorvi4.x78zum5.x1q0g3np.x1a2a7pz");
        }
        if (W.length == 0) {
          W = jQuery(R).find("> div > div.x16hk5td.x12rz0ws > div.x1n2onr6.x1ye3gou.x1iorvi4.x78zum5.x1q0g3np.x1a2a7pz");
        }
        W.each(function (a7, a8) {
          var a9 = {
            id: null,
            message: null,
            from: null,
            message_tags: []
          };
          var aa = jQuery(a8).find("> div[role=\"article\"]");
          if (aa.length == 0) {
            aa = jQuery(a8);
          }
          var ab = aa.find("div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs");
          if (ab.length > 0) {
            var ac = y(ab.get(0));
            if (ac && ac.return && ac.return.pendingProps) {
              if (ac.return.pendingProps.text) {
                a9.message = ac.return.pendingProps.text;
                if (ac.return.pendingProps.ranges) {
                  var ad = ac.return.pendingProps.text.replace(new RegExp(emjoiRanges.join("|"), "g"), " ");
                  ac.return.pendingProps.ranges.forEach(function (ak) {
                    var al = ad.substring(ak.offset, ak.offset + ak.length);
                    if (al.indexOf("http") !== -1 && al.indexOf("facebook.com") !== -1) {
                      return;
                    }
                    if (!ak.entity) {
                      return;
                    }
                    if (ak.entity.__typename == "User") {
                      var am = {
                        profile_id: ak.entity.id,
                        type: "user",
                        name: al
                      };
                      a9.message_tags.push(am);
                    } else if (ak.entity.__typename == "Page") {
                      var am = {
                        profile_id: ak.entity.id,
                        type: "page",
                        name: al
                      };
                      a9.message_tags.push(am);
                    }
                  });
                }
              }
            }
          }
          var ae = aa.find("> div.xqcrz7y.x14yjl9h.xudhj91.x18nykt9.xww2gxu.x1lliihq.x1w0mnb.xr9ek0c.x1n2onr6");
          if (ae.length > 0) {
            var af = y(ae.get(0));
            if (af && af.return && af.return.pendingProps && af.return.pendingProps.actor && af.return.pendingProps.comment) {
              var ag = atob(af.return.pendingProps.comment.__id);
              var ah = /:([0-9_]+)$/g;
              var ai = ah.exec(ag);
              if (ai) {
                a9.id = ai[1];
              }
              a9.created_timestamp = af.return.pendingProps.comment.created_time;
              a9.from = {
                name: af.return.pendingProps.actor.name,
                profile_id: af.return.pendingProps.actor.id
              };
              if (af.return.pendingProps.actor.__typename == "User") {
                a9.from.type = "user";
              } else if (af.return.pendingProps.actor.__typename == "Page") {
                a9.from.type = "page";
              }
            }
          }
          if (a9.id && a9.from && a9.message && a9.created_timestamp) {
            f.post_info.comments.push(a9);
            var ah = /^([0-9]+_)?([0-9]+)$/g;
            var ai = ah.exec(a9.id);
            var aj = ai[2];
            if (f.post_snapshot_info.comments[aj]) {
              ab.append("<div class=\"IPO_Container IPO_Comment_Status\"><span class=\"badge badge-pill badge-success ml-2\">✔️ 已匯入</span></div>");
            } else {
              ab.append("<div class=\"IPO_Container IPO_Comment_Status\"><span class=\"badge badge-pill badge-info ml-2\">➕ 新留言，上傳系統中</span></div>");
              T++;
            }
          }
        });
      }
      if (window.IPO_Data.comemntsContainer[f.post_id]) {
        window.IPO_Data.comemntsContainer[f.post_id].forEach(function (a7) {
          f.post_info.comments.push(a7);
        });
      }
      if (V > 0 && U == V) {
        j++;
        if (j > 2) {
          D("cannot read comments");
        } else {
          s(M, 1000);
          N();
        }
        return;
      }
      var X = {};
      var Y = [];
      f.post_info.comments.forEach(function (a7) {
        if (X[a7.id]) {
          return;
        }
        Y.push(a7);
        X[a7.id] = true;
      });
      f.post_info.comments = Y;
      f.post_info.comments.sort(function (a7, a8) {
        return a7.created_timestamp - a8.created_timestamp;
      });
      console.log(f.post_info);
      if (T > 0) {
        var Z = C();
        var a0 = Z.feed;
        var a1 = Z.story;
        var a2 = E(a1);
        var a3 = F(a1);
        var a4 = m(window.location.href);
        console.log("post id: %s", a2);
        console.log("post fbid: %s", a3);
        console.log("url post id: %s", a4);
        if (a4 == a3) {
          a4 = a2;
        }
        if (a4 != f.post_id) {
          D("POST_ID_MISMATCH");
          return;
        }
        if (a2 != a4) {
          D("POST_ID_MISMATCH");
          return;
        }
        var a5 = q().find(".IPO_Uploading");
        if (a5.length == 0) {
          var a6 = "<div class=\"IPO_Uploading clearfix mt-1 ml-2\">";
          a6 += "<img src=\"" + f.ext_url + "images/iPlusOne_icon_color_48x48_h.png\" class=\"IPO_Logo\" title=\"" + config.title + "\">";
          a6 += "<span class=\"ml-2\">上傳留言中...</span>";
          a6 += "</div>";
          q().find(".IPO_Container.IPO_Post_Info").after(a6);
        }
        O();
        if (b) {
          q().find(".IPO_Uploading").remove();
          P();
        } else {
          g.postMessage({
            operation: "uploadReactFacebookComments",
            post_info: f.post_info
          });
        }
      } else {
        g.postMessage({
          operation: "uploadReactFacebookComments",
          post_info: f.post_info
        });
        P();
      }
    }
    function N() {
      if (c) {
        g.postMessage({
          operation: "refreshRecovery"
        });
      }
    }
    function O() {
      if (c) {
        g.postMessage({
          operation: "stopRecovery"
        });
      }
    }
    function P() {
      jQuery("div.IPO_Inject").remove();
      console.log("checkNext");
      if (c) {
        g.postMessage({
          operation: "checkNext"
        });
      }
    }
  };
  window["iplusone_script_" + config.version]();
}, 500);