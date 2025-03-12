(function () {
    // 初始化部分
    function initializeState() {
        if (window.IPOTimerInstance) {
            console.log("force stop timer 2");
            clearTimeout(window.IPOTimerInstance);
        }
        window.IPOTimerInstance = null;
        if (window.IPO_Data) return;

        console.log("inject hook");
        window.IPO_Data = {
            update: Date.now(),
            groups: {},
            pages: {},
            users: {},
            members: {},
            stories: {},
            lineComments: {},
            comemntsContainer: {},
            updateCount: 0,
            comemntsContainerCount: 0
        };
    }

    // URL 解析工具
    const UrlParser = {
        extractPostId: function (values) {
            const subscriptionId = values?.feedback?.story?.feedback_context?.feedback_target_with_context?.subscription_target_id;
            if (subscriptionId) return subscriptionId;

            const storyId = values?.context_layout?.story?.id || values?.id;
            if (!storyId) return null;

            const cDigit = atob(storyId);
            const HEREGEX_OMIT = /^S:_I\d+:(VK:)?(?<post_id>\d+)(:\d+)?$/g;
            const nDigit = HEREGEX_OMIT.exec(cDigit);
            return nDigit?.groups?.post_id || null;
        },

        parseStoryFbid: function (format) {
            const storyUrl = format?.feedback?.story?.url;
            if (!storyUrl) return null;

            const fbidPatterns = [
                /story_fbid=(?<post_fbid>pfbid[A-Za-z0-9]+)/g,
                /posts\/(?<post_fbid>pfbid[A-Za-z0-9]+)/g
            ];

            for (const pattern of fbidPatterns) {
                const match = pattern.exec(storyUrl);
                if (match?.groups?.post_fbid) {
                    return match.groups.post_fbid;
                }
            }
            return null;
        },

        extractCommentPostId: function (value) {
            let num = null;
            let r20 = /^(?<post_id>\d+)_(\w+)$/g;
            let round = r20["exec"](value["commentId"]);
            if (round) {
                num = round["groups"]["post_id"];
            }
            return num;
        }
    };

    // Facebook 資料處理器
    const FacebookDataHandler = {
        processStory: function (message) {
            if (message.sponsored_data) return;

            const postId = UrlParser.extractPostId(message.comet_sections);
            if (postId) {
                console.log(message);
                window.IPO_Data.stories[postId] = message.comet_sections;
            }

            const storyFbid = UrlParser.parseStoryFbid(message.comet_sections);
            if (storyFbid) {
                window.IPO_Data.stories[storyFbid] = message.comet_sections;
            }
        },

        processGroupMember: function (rowData) {
            const { group_membership, id, __typename: type, name } = rowData;
            const associatedGroup = group_membership?.associated_group;
            if (!associatedGroup) return;

            const groupId = associatedGroup.id;
            window.IPO_Data.members[groupId] = window.IPO_Data.members[groupId] || {
                feed_id: groupId,
                members: {}
            };

            if (!window.IPO_Data.members[groupId].members[id] && (type === "User" || type === "Page")) {
                window.IPO_Data.members[groupId].members[id] = {
                    id,
                    name,
                    type: type.toLowerCase()
                };
            }
        },

        processGraphQLResponse: function (result) {
            window.IPO_Data.update = Date.now();

            // 使用可選鏈接簡化群組資料存取
            const group = result?.group?.profile_header_renderer?.group;
            if (group) {
                window.IPO_Data.groups[group.id] = group;
            }

            // 使用可選鏈接簡化用戶資料存取
            const user = result?.user?.profile_header_renderer?.user;
            if (user) {
                window.IPO_Data.users[user.id] = user;
            }

            // 簡化查看者群組資料存取
            const groupEdges = result?.viewer?.actor?.groups?.edges;
            if (groupEdges) {
                groupEdges.forEach(({ node }) => {
                    if (node?.["__typename"] === "Group") {
                        window.IPO_Data.groups[node.id] = node;
                    }
                });
            }

            // 簡化 hover card 資料存取
            const hovercardRenderer = result?.node?.comet_hovercard_renderer;
            if (hovercardRenderer) {
                if (hovercardRenderer.actor) {
                    const { actor } = hovercardRenderer;
                    const type = actor["__typename"];
                    const targetData = { [type.toLowerCase()]: actor };
                    if (type === "User") {
                        window.IPO_Data.users[actor.id] = actor;
                    } else if (type === "Page") {
                        window.IPO_Data.pages[actor.id] = actor;
                    } else if (type === "Group") {
                        window.IPO_Data.groups[actor.id] = actor;
                    }
                } else {
                    const { user, page, group } = hovercardRenderer;
                    if (user) window.IPO_Data.users[user.id] = user;
                    if (page) window.IPO_Data.pages[page.id] = page;
                    if (group) window.IPO_Data.groups[group.id] = group;
                }
            }

            if (result["node"] && result["node"]["comment_rendering_instance_for_feed_location"]) {
                let escapes = atob(result["node"]["id"]);
                let key = escapes["match"](/feedback:(.*)/)[1];
                if (!window.IPO_Data["comemntsContainer"]) {
                    window.IPO_Data["comemntsContainer"] = {};
                }
                if (!window.IPO_Data["comemntsContainer"][key]) {
                    window.IPO_Data["comemntsContainer"][key] = [];
                }
                if (result["node"]["comment_rendering_instance_for_feed_location"]["comments"] && result["node"]["comment_rendering_instance_for_feed_location"]["comments"]["edges"]) {
                    result["node"]["comment_rendering_instance_for_feed_location"]["comments"]["edges"].forEach(function (pair) {
                        if (pair["node"]) {
                            let type = null;
                            let output = "";
                            let paths = [];
                            if (pair["node"]["author"]["__typename"] == "User") {
                                type = "user";
                            } else if (pair["node"]["author"]["__typename"] == "Page") {
                                type = "page";
                            }
                            if (pair["node"]["body"] && pair["node"]["body"]["text"]) {
                                output = pair["node"]["body"]["text"];
                            } else {
                                output = "";
                            }
                            if (pair["node"]["body"] && pair["node"]["body"]["ranges"]) {
                                pair["node"]["body"]["ranges"].forEach(function (result) {
                                    let errorName = pair["node"]["body"]["text"].substring(result["offset"], result["offset"] + result["length"]);
                                    if (result["entity"]["__typename"] == "User") {
                                        type = "user";
                                    } else if (result["entity"]["__typename"] == "Page") {
                                        type = "page";
                                    }
                                    let args = {
                                        profile_id: result["entity"]["id"],
                                        type: type,
                                        name: errorName
                                    };
                                    paths.push(args);
                                });
                            }
                            let defaults = {
                                id: pair["node"]["legacy_token"],
                                message: output,
                                from: {
                                    name: pair["node"]["author"]["name"],
                                    profile_id: pair["node"]["author"]["id"],
                                    type: type
                                },
                                created_timestamp: pair["node"]["created_time"],
                                message_tags: paths
                            };
                            window.IPO_Data["comemntsContainer"][key].push(defaults);
                        }
                    });
                }
            }
            if (result["page"] && result["page"]["__typename"] == "Page" && result["page"]["id"] && result["page"]["comet_page_cover_renderer"]) {
                window.IPO_Data["pages"][result["page"]["id"]] = result["page"];
            }
            if (result["node"] && result["node"]["__typename"] == "Story" && result["node"]["comet_sections"]) {
                FacebookDataHandler.processStory(result["node"]);
            }
            if (result["node"] && result["node"]["new_members"] && result["node"]["__typename"] == "Group" && result["node"]["new_members"]["edges"]) {
                result["node"]["new_members"]["edges"].forEach(function (pair) {
                    if (pair["node"]) {
                        FacebookDataHandler.processGroupMember(pair["node"]);
                    }
                });
            }
            if (result["node"] && result["node"]["group_feed"] && result["node"]["__typename"] == "Group" && result["node"]["group_feed"]["edges"]) {
                result["node"]["group_feed"]["edges"].forEach(function (pair) {
                    if (pair["node"]["__typename"] == "Story" && pair["node"]["comet_sections"]) {
                        FacebookDataHandler.processStory(pair["node"]);
                    }
                });
            }
            if (result["user"] && result["user"]["timeline_list_feed_units"] && result["user"]["timeline_list_feed_units"]["edges"]) {
                result["user"]["timeline_list_feed_units"]["edges"].forEach(function (pair) {
                    if (pair["node"] && pair["node"]["__typename"] == "Story" && pair["node"]["comet_sections"]) {
                        FacebookDataHandler.processStory(pair["node"]);
                    }
                });
            }
            if (result["nodes"]) {
                result["nodes"].forEach(function (err) {
                    if (err["__typename"] == "Story" && err["comet_sections"]) {
                        FacebookDataHandler.processStory(err);
                    }
                });
            }
        }
    };

    // XMLHttpRequest 攔截器
    class RequestInterceptor {
        static intercept() {
            const originalXHR = XMLHttpRequest;

            XMLHttpRequest = function () {
                const xhr = new originalXHR();
                xhr.addEventListener("load", RequestInterceptor.handleResponse);
                return xhr;
            };
        }

        static handleResponse(response) {
            if (!response.target?.status === 200 || !response.target?.responseURL) return;

            const url = response.target.responseURL;
            if (url.startsWith("https://linevoom.line.me/api/")) {
                RequestInterceptor.handleLineResponse(url, response.target.response);
            } else if (url === "https://www.facebook.com/api/graphql/") {
                RequestInterceptor.handleFacebookResponse(response.target.response);
            }
        }

        static handleLineResponse(url, body) {
            if (url.startsWith("https://linevoom.line.me/api/comment/getList")) {
                let cache = JSON.parse(body);
                if (cache["resultMsg"] == "OK" && cache["data"]["commentList"]) {
                    cache["data"]["commentList"].forEach(function (value) {
                        let key = UrlParser.extractCommentPostId(value);
                        value["postId"] = key;
                        if (!window.IPO_Data["lineComments"][key]) {
                            window.IPO_Data["lineComments"][key] = {};
                        }
                        window.IPO_Data["lineComments"][key][value["commentId"]] = value;
                        window.IPO_Data["update"] = Date.now();
                    });
                }
            }
        }

        static handleFacebookResponse(response) {
            let forEach = response.split("\n");
            forEach.forEach(function (body) {
                let message = JSON.parse(body);
                if (message && message["data"]) {
                    console.log(message);
                    FacebookDataHandler.processGraphQLResponse(message["data"]);
                }
            });
        }
    }

    // 初始化
    initializeState();
    RequestInterceptor.intercept();
})();
