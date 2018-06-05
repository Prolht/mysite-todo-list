$(pageInit);
var jsonData = {
    articleId: 0
};
var xh = null;
var notice = new noticeAlert(true, true);
//听云容错代码
if (!TINGYUN) {
    TINGYUN = {};
    TINGYUN.createEvent = function() {
        var e = {};
        e.end = function() {};
        e.fail = function() {};
        return e
    }
};
//全屏操作弹窗
var alertMask = $("div.alert-mask"),
    switchMdMode = $("#switchMdMode"),
    setSummary = $("#setSummary");
//全屏提交提示
var fullBtns = $("div.suspension-edit-box").find("button.btn"),
    moreDiv = $("#moreDiv");

function pageInit() {

    xh = $('#editor').xheditor({
        plugins: getCodePlugin(),
        layerShadow: 0,
        tools: "Bold,Italic,Underline,Strikethrough,Fontface,Blocktag,FontSize,FontColor,BackColor,|,Align,List,Outdent,Indent,|,Img,Table,Emot,Link,Unlink,Code,Description,|,CsdnFullScreen",
        upImgUrl: "/UploadImage",
        width: 971,
        height: 560,
        upImgExt: 'jpg,jpeg,gif,png,bmp',
        skin: "fashion",
        loadCSS: xhCssUrl
    });

    //tags_init();
    if (jsonData.isDeleted) {
        notice.error("该文章已被删除，无法编辑。");
        xh.setSource('');
    } else {
        edit_init();
    }
    $('#btnPublish').click(publish);
    $(".btn-publish").click(publish);
    $(".btn-baocun").click(draft);
    $(".btn-shanchu").click(cancelSave);

    $("#selType").change(function() {
        if (this.value == "1") {
            $("#panleCopyright").show();
        } else {
            $("#panleCopyright").hide();
        }
    });
    window.onbeforeunload = function() {
        if (showConfirm) {
            if (csdn.val2("editor").replace(/<.+?>/g, "").length > 0) {
                try {
                    return "您的文章尚未保存！";
                } catch (err) {}
            }
        }
    };

    $("#imagecode,#seeagain").click(function() {
        checkcodeRefesh();
    });

    var articlepanleid = 0;

}


function checkcodeRefesh() {
    setTimeout(function() {
        var imagecode = $("#imagecode");
        if (imagecode.length > 0) {
            $("#imagecode").attr("src", "/image/index?r=" + Math.random());
        }
    }, 500);
}

function topNote(text) {
    var div = document.createElement("div");
    div.id = "top_note";
    div.className = "radius";
    div.innerHTML = text;
    document.body.appendChild(div);
    $("#txtTitle").blur();
    $(".btn_area_1 input").attr("disabled", true);
}
//插入代码
function getCodePlugin() {
    var codeArr1 = ["html", "objc", "javascript", "css", "php", "csharp", "cpp", "java", "python", "ruby", "vb", "delphi", "sql", "plain"];
    var codeArr2 = ["HTML/XML", "Objective-C", "JavaScript", "CSS", "PHP", "C#", "C++", "Java", "Python", "Ruby", "Visual Basic", "Delphi", "SQL", "其它"];
    var opts = '';
    for (var i = 0; i < codeArr1.length; i++) {
        opts += csdn.format('<option value="{0}">{1}</option>', codeArr1[i], codeArr2[i]);
    }
    var htmlCode = '<div>编程语言: <select id="xheCodeType">' + opts + '</select></div>' +
        '<div><textarea id="xheCodeCon" rows=6 cols=40></textarea></div>' +
        '<div style="text-align:right;"><input type="button" id="xheSave" value="确定" /></div>';
    var htmlSCode = '<div><div><a href="javascript:;" class="quote_code">引用我的代码片</a><a href="https://code.csdn.net/snippets_manage" class="trim_code" target="_blank">整理我的代码片</a></div><textarea id="xheSCodeCon" rows=6 cols=40></textarea></div>' +
        '<div style="text-align:right;"><a href="https://code.csdn.net/help/CSDN_Code/code_support/FAQ_6_1" style="float:left;" target=_blank>什么是CODE代码片？</a><input type="button" id="xheSSave" value="确定" /></div>';

    var codePlugin = {
        Code: {
            c: 'Code',
            t: '插入代码',
            h: 1,
            e: function() {
                var _this = this;
                var jTest = $(htmlCode);
                var jSave = $('#xheSave', jTest);
                jSave.click(function() {
                    var sel_code = $("#xheCodeType").val();
                    //var str = csdn.format('<pre name="code" class="{0}">{1}</pre><br />', sel_code, _this.domEncode($("#xheCodeCon").val()));
                    var xheCodeConContent = $("#xheCodeCon").val() + "";
                    xheCodeConContent = xheCodeConContent.replace(/&reg/g, "&amp;reg").replace(/&copy/g, "&amp;copy");
                    var pNode = _this.getParent('p');
                    var str = '<pre name="code" class="' + sel_code + '">' + _this.domEncode(xheCodeConContent) + '</pre><br />';
                    _this.loadBookmark();
                    if (pNode.length > 0) {
                        pNode.after(str);
                        if (!pNode.text().length > 0) {
                            pNode.remove();
                        }
                    } else {
                        _this.pasteHTML(str);
                    }
                    _this.hidePanel();
                    document.cookie = "postedit_code=" + sel_code + "; expires=" + function() {
                        var d = new Date();
                        d.setFullYear(d.getFullYear() + 1);
                        return d.toGMTString();
                    }();
                    return false;
                });
                _this.saveBookmark();
                _this.showDialog(jTest);
                var _his_code = document.cookie.match(new RegExp("(^|\s)postedit_code=([^;]*)(;|$)"));
                if (_his_code) $('#xheCodeType').val(_his_code);
                else $("#xheCodeType option")[0].selected = true;
            }
        },
        ToMarkdown: {
            c: 'ToMarkdown',
            t: '切换Markdown编辑器',
            i: function() {

            },
            e: function() {
                var _this = $(this);
                openSwitchMdMode();
            }
        },
        CsdnFullScreen: {
            c: 'CsdnFullScreen',
            t: '切换全屏',
            e: function() {
                var _thisBtn = $("#xhe0_Tool").find("a[cmd='CsdnFullScreen']");
                var contentBody = $("#content-body");
                if (!_thisBtn.hasClass("xheActive")) {
                    _thisBtn.addClass("xheActive");
                    $("body").addClass("ed_fullscreen");
                    $("div.suspension-edit-box").removeClass("d-none");
                } else {
                    _thisBtn.removeClass("xheActive");
                    $("body").removeClass("ed_fullscreen");
                    $("div.suspension-edit-box").addClass("d-none");
                }
            }
        },
        Description: {
            c: 'xheIcon xheBtnDescription',
            t: '摘要',
            e: function() {
                alertMask.removeClass('d-none');
                setSummary.removeClass('d-none');
                alertMask.one('click', function() {
                    $(this).addClass('d-none');
                    setSummary.addClass('d-none');
                });
                setSummary.find(".btn-close,.action-summary").one('click', function() {
                    alertMask.addClass('d-none');
                    setSummary.addClass('d-none');
                })
            }
        }
    };
    //codePlugin.SCode.showPop();
    return codePlugin;
}
var showConfirm = true;

//发布
function publish(isPubToBole) {
    save(1, isPubToBole, false);
}
//保存草稿
function draft() {
    save(0, false, false);
    checkcodeRefesh();
}
var artId = 0;
var saveInter = null;
var saving = false; /*标识文章正在保存*/
function save(isPub, isPubToBole) {
    if (csdn.doing) { /*有其它操作（如保存草稿），等其完成再保存*/
        setTimeout("save(" + isPub + "," + isPubToBole + ")", 500);
        return;
    }

    notice.loading(true, "文章正在保存，请耐心等待。");
    if (!checkForm(isPubToBole)) return;

    if (isPub) { /*发布后停止自动保存*/
        if (saveInter) clearInterval(saveInter);
        saveInter = null;
    } else if (saveInter) { /*如果是立即保存，重置定时器，避免同时保存2遍*/
        clearInterval(saveInter);
        saveInter = setInterval("autoSave()", 30 * 1000);
    }

    var data = getPostData();
    data += "&stat=" + (isPub ? "publish" : "draft");
    saving = true;
    // $("div.alert-mask").removeClass("d-none");
    var link = '/postedit/saveArticle';
    if (isPub) {
        link += "?isPub=1";
    }
    // link += "&joinblogcontest=" + $("#joinblogcontest").attr("checked");
    // link += "&r=" + Math.random();
    var title = data.titl;
    if ($("#txtSammary").val()) {
        $("#alertSuccess").find("p.zhaiyao").hide();
    } else {
        $("#alertSuccess").find("p.zhaiyao").show();
    }
    //路由切换页面之前，开启事件
    var event = TINGYUN.createEvent({
        name: '富文本保存文章save()',
        key: '45d215a3-929e-4f86-ad07-23bd1fa35b81'
    });
    $.ajax({
        type: 'POST',
        url: link,
        data: data,
        success: function(ret) {
            saving = false;
            ret = csdn.toJSON(ret);
            if (ret.result == 0) {
                notice.error(ret.content);
                //业务失败，记录事件失败
                event.fail();
            } else {
                $('.html-editor-box').show();
                showConfirm = false;
                if (!isPub) {
                    artId = ret.data;
                    notice.success(csdn.format("文章已保存{0} {1}", (jsonData.articleId == '0' ? "为草稿" : ""), (new Date()).format("hh:mm:ss")));
                    $("#autosave_note").html('');
                } else {
                    saving = true; //保存后避免再次保存
                    $("#alertSuccess").find("a.toarticle").attr("href", ret.data).end().find("div.title").text(title).end().show();
                    $('#alertSuccess').find('.title').text($('#txtTitle').val().trim());
                    notice.success('文章发布成功');
                    $('#moreDiv').hide();
                    if (jsonData.articleId == 0) { /*如果不是编辑*/
                        $("#txtTitle").val('');
                        $("#editor").val('');
                    }
                }
                //成功操作,事件结束
                event.end();
            }
        },
        error: function() {
            saving = false;
            notice.error('保存失败，请稍后重试');
            //业务失败，记录事件失败
            event.fail();
        }
    });
}
var old_con = null;

function autoSave() {
    if (csdn.doing || saving) return;
    var con = csdn.val2("editor");
    if (con.replace(/<.+?>/g, "").length < 100) return;
    if (con == old_con) return;
    old_con = con;
    csdn.doing = true;
    var data = getPostData() + "&stat=draft&isauto=1";
    //增加听云SPE监控
    var event = TINGYUN.createEvent({
        name: '富文本autoSave()',
        key: '45d215a3-929e-4f86-ad07-23bd1fa35b81'
    });
    $.ajax({
        type: 'POST',
        url: '/postedit/saveArticle',
        data: data,
        success: function(ret) {
            csdn.doing = false;
            ret = csdn.toJSON(ret);
            if (ret.result == 1) {
                artId = ret.data;
                showConfirm = false;
                notice.success("文章已自动保存为草稿 " + (new Date()).format("hh:mm:ss"));
                //成功操作,事件结束
                event.end();
            } else {
                notice.error("文章自动保存失败，请注意保存。");
                //业务失败，记录事件失败
                event.fail();
            }
        },
        error: function() {
            csdn.doing = false;
            notice.error("文章自动保存失败，请注意保存。");
            //业务失败，记录事件失败
            event.fail();
        }
    });
}

function getPostData() {
    var type = $("#selType").val();
    var titl = csdn.val2("txtTitle");
    var cont = "";
    cont = encodeURIComponent(csdn.val("editor").replace(/<a\s/gi, '<a target=_blank '));
    //var desc = csdn.val2("txtDesc");
    var categories = csdn.val2("hidCategories");
    //var flnm = csdn.val2("txtFileName");
    var chnl = $('#radChl').val() || 0;
    //var comm = $("input[name=radComment]:checked").val();
    var leve = 0; // $("#chkHome").attr("checked") ? 1 : 0;
    var Description = $("#txtSammary").val();
    var tag2 = $('#hidTags').val(); // encodeURIComponent(function () { var s = []; $('#d_tag2 span').each(function () { s.push(this.innerHTML); }); return s.join(','); }());
    //GetResult();
    var data = "titl=" + titl + "&typ=" + type + "&cont=" + cont; // + "&desc=" + desc;
    data += "&categories=" + (categories) + "&chnl=" + chnl + "&level=" + leve; //"&tags=" + tags +
    data += "&tag2=" + encodeURIComponent(tag2);
    data += "&artid=" + artId;
    data += "&private=" + $('#chkIsHasNotify').is(':checked');
    data += "&Description=" + encodeURIComponent(Description);
    data['Description'] = encodeURIComponent(Description);
    data['titl'] = titl;
    return data;
}

function cancelSave() {
    location = "/postlist";
}

function checkForm(isPubToBole) {
    if (isPubToBole && $("#selType").val() == '0') {
        notice.error("请选择文章类型");
        return false;
    }
    if (!csdn.hasVal("txtTitle")) {
        notice.error("请输入文章标题。");
        return false;
    }

    var con = xh.getSource();
    if (!$.trim(con)) {
        notice.error("请输入文章内容。");
        return false;
    }
    if (isPubToBole && $('#radChl').val() == 0) {
        notice.error("请选择文章分类。");
        return false;
    }
    return true;
}

function cancel() {
    $('#warn-box').addClass('d-none');
    $('div.alert-mask').addClass('d-none');
}
/*end*/
function decodeURIComponent(txt) {
    var result = '';
    try {
        result = decodeURIComponent(txt);
    } catch (error) {
        result = unescape(txt);
    }
    return result;
}
function edit_init() {
    if (jsonData.articleId == '0' || jsonData.isDraft == 'True') {
        /*自动保存策略：
        1、修改文章不自动保存（修改草稿自动保存）；
        2、点击发布按钮后不自动保存；
        3、文章内容字数小于100不自动保存；
        4、自动保存后离开页面不弹出提示；
        */
        saveInter = setInterval("autoSave()", 30 * 1000);
        $("#txtTitle").focus();
    }
    if (jsonData.articleId != '0') {
        $("#txtTitle").focus().val(decodeURIComponent(jsonData.title));
        $("#selType").val(jsonData.type);
        $("#hidCategories").val(decodeURIComponent(jsonData.tags));
        $("#hidTags").val(decodeURIComponent(jsonData.tag2));
        formatTag2();
        //$("#txtFileName").val(jsonData.fileName);
        $('#radChl').val(jsonData.channel);
        //$("input[name=radChl][value=" + jsonData.channel + "]").attr("checked", true);
        //$("input[name=radComment][value=" + jsonData.comment + "]").attr("checked", true);
        if (jsonData.tag2.length > 0) {
            var tags = decodeURIComponent(jsonData.tag2).split(',');
            var tagHtml = "";
            for (var i = 0; i < tags.length; i++) {
                tagHtml += '<div class="tag"><span class="name uneditable" contenteditable="false">' + tags[i] + '</span><i class="xheIcon icon-guanbi"></i></div>';
            }
            $("#addTag").before(tagHtml);
            if (tags.length >= 5) {
                $("#addTag").prop('disabled', true);
            }
        }
        if (jsonData.tags.length > 0) {
            myTag.loadTags(decodeURIComponent(jsonData.tags));
        }
        if (jsonData.isDraft != 'True') {
            $("#p_comment,#d_comment").show();
        }
    }
}
/*==tag start==*/

/*根据输入的tags重置选择框状态*/
function resetChks() {
    var arr = $("#txtTag").val().toLowerCase().split(/[,，]+/g);
    $("#tagbox input").each(function() {
        var has = false;
        var val = $(this).next().text().toLowerCase();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                has = true;
                break;
            }
        }
        this.checked = has;
    });
}
var valArray = ['', '', ''];

function getCurrVal(obj) {
    valArray[1] = '';
    var leftVal = getLeftText(obj);
    if (!leftVal) return "";
    var lastChar = leftVal.substr(leftVal.length - 1, 1);
    if (isSplit(lastChar)) return "";
    var allVal = obj.value;
    var i;
    for (i = leftVal.length - 1; i >= -1; i--) {
        if (i > -1 && isSplit(leftVal.substr(i, 1))) break;
    }
    if (i < -1) i = -1;
    valArray[1] = leftVal.substr(i + 1).trimStart();
    valArray[0] = leftVal.substr(0, i + 1);
    for (i = leftVal.length; i <= allVal.length; i++) {
        if (i < allVal.length && isSplit(allVal.substr(i, 1))) break;
    }
    valArray[2] = allVal.substr(i, allVal.length - i);

    return (valArray[1]);
}

function isSplit(c) {
    return (c == ',' || c == '，');
}

function getLeftText(obj) {
    if (obj.selectionStart || obj.selectionStart == 0) {
        var idx = obj.selectionStart;
        return obj.value.substr(0, idx);
    }
    var rngSel = document.selection.createRange();
    var flag = rngSel.getBookmark();
    var rngTxt = obj.createTextRange();
    rngTxt.collapse();
    rngTxt.moveToBookmark(flag);
    rngTxt.moveStart('character', -obj.value.length);
    return rngTxt.text;
}

function setCurrVal(val) {
    if (!valArray[1] || !val) return;
    $("#txtTag").val(valArray[0] + val + valArray[2]);
}

function showAllTags(e) {
    if (e.innerHTML == "[全部]") {
        if ($("#tagbox").css("position") != "absolute") {
            var pos = $("#tagbox").position();
            $("#tagbox").css({
                position: "absolute",
                left: pos.left + "px",
                top: pos.top + 2 + "px"
            });
        }
        $("#tagtb tbody").show();
        e.innerHTML = "[收起]";
    } else {
        $("#tagtb tbody").hide();
        e.innerHTML = "[全部]";
    }
    e.blur();
}


function getAsc(str) {
    return str.charCodeAt(0);
}

function getcookie(name) {
    var cookie_start = document.cookie.indexOf(name);
    var cookie_end = document.cookie.indexOf(";", cookie_start);
    return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}

/*==tag end==*/

/*==tag2 begin==*/

$(function() {

    //$('body').delegate('.btn-cancel,i.icon-guanbi', 'click', function () {
    //    $('#warn-box').remove();
    //    warnBox.hideMask();
    //})
    $('#p_desc,#d_desc').show();

    //$('.section').mouseout(getTag2);
    $('#txtTag2').focus(showTag2).blur(formatTag2).keydown(tagKeydown);
    $('#txtTag2,#tag2box').mouseover(function() {
        window.overtag2 = true;
    }).mouseout(function() {
        window.overtag2 = false;
    });
    $(document.body).click(function(ev) {
        if (window.overtag2) return;
        $('#tag2box').hide();
    });
});
var old_con_len = 0;


function showTag2() {
    if ($('#tag2box a').length > 0) {
        $('#tag2box').show();
    }
}

function tagKeydown(ev) {
    var code = (ev ? ev.which : event.keyCode);
    if (code == 8) {
        //如果是退格键
        var ss = $('#d_tag2 span');
        if (ss.length > 0 && $("#txtTag2").val().length == 0) {
            ss.eq(ss.length - 1).remove();
            formatTag2();
        }
    }
}

function formatTag2() {
    if ($('#txtTag2').val()) {
        var tt = '';
        $('#d_tag2 span').each(function() {
            tt += this.innerHTML + ',';
        });
        tt += $('#txtTag2').val().trim(',').replace(/[^\u4e00-\u9fa5\w\s\-+.#,，]+/g, '');
        tt = tt.trim(',').split(/[,，]+/g);
        var s = [];
        for (var i = 0; i < tt.length; i++) {
            if (!s.has(tt[i])) {
                s.push(tt[i].trim().slice(0, 20));
            }
            if (s.length == 5) break;
        }
        var str = '';
        for (var i = 0; i < s.length; i++) {
            str += '<span>' + s[i] + '</span>';
        }
        $('#d_tag2').html(str);
        $('#d_tag2 span').click(function() {
            $(this).remove();
            formatTag2();
        }).attr('title', '单击删除该标签');
    }
    var w = $('#d_tag2').width();
    $('#txtTag2').val('').css({
        'padding-left': w + 2,
        'width': 576 - w
    });
    activeTag2();
}
/*高亮预选标签中被选中的标签*/
function activeTag2() {
    var tags = [];
    $('#d_tag2 span').each(function() {
        tags.push(this.innerHTML);
    });
    $('#td_tag21>a,#td_tag22>a').each(function() {
        if (tags.has(this.innerHTML)) {
            this.className = 'act';
        } else {
            this.className = '';
        }
    });
}

Array.prototype.has = function(a) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].toLowerCase() == a.toLowerCase())
            return true;
    }
    return false;
};
/*对tag进行去重排序*/
function unique_sort(arr) {
    arr.sort();
    var res = [
        [arr[0], 1]
    ];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] != res[res.length - 1][0]) {
            res.push([arr[i], 1]);
        } else {
            res[res.length - 1][1]++;
        }
    }
    res.sort(function(a, b) {
        return a[1] < b[1];
    });
    var aa = new Array();
    for (var i = 0; i < res.length; i++) {
        aa.push(res[i][0]);
    }
    return aa;
}
/*==tag2 end==*/



//操作提示(loadElement:是否动态加载div;isspoof:是否吃豆豆)
function noticeAlert(loadElement, isspoof) {
    var noticeBox = $(".notice-box"),
        icon = noticeBox.find("i.notice-icon"),
        pacman = isspoof ? noticeBox.find("div.pacman") : null,
        _this = this,
        _isspoof = isspoof,
        maskTrans = null;
    if (loadElement && !noticeBox.length) {
        if (isspoof) {
            noticeBox = $('<div class="notice-box"><i class= "mr8 notice-icon type-success"></i><div class="pacman hide"><div></div><div></div><div></div><div></div><div></div></div><span class="notice">文章发布成功</span></div >');
        } else {
            noticeBox = $('<div class="notice-box"><i class="mr8 notice-icon" style="display: none;"></i><span class="notice">文章发布成功</span></div>');
        }
        $("body").append(noticeBox);
        icon = noticeBox.find("i.notice-icon");
        pacman = isspoof ? noticeBox.find("div.pacman") : null;
    }
    var setTxt = function(txt) {
        if (txt) {
            noticeBox.find("span.notice").text(txt);
        }
    }
    this.success = function(txt) {
        pacman.addClass('hide');
        icon.removeClass("type-error type-loading").addClass("type-success").show();
        setTxt(txt);
        _this.show();
    }
    this.error = function(txt) {
        pacman.addClass('hide');
        icon.removeClass("type-success type-loading").addClass("type-error").show();
        setTxt(txt);
        _this.show();
    }
    this.loading = function(ismask, txt) { //ismask:是否增加透明遮罩组织用户继续操作
        if (ismask) {
            maskTrans = $("<div class='mask-trans'></div>");
            $("body").append(maskTrans);
        }
        if (!txt || typeof txt !== "string") {
            txt = "正在加载中请等待"
        }
        if (_isspoof) {
            icon.hide();
            pacman.removeClass('hide');
        } else {
            pacman.addClass('hide');
            icon.removeClass("type-success type-error").addClass("type-loading").show();
        }
        setTxt(txt);
        _this.show(false);
        var hideLoad = function() {
            _this.hide();
        }
        return hideLoad; //返回隐藏方法
    }
    //自动显隐
    this.show = function(autohide) {
        noticeBox.show().animate({
            bottom: '56px'
        }, {
            duration: 200,
            done: function() {
                if (autohide === undefined || autohide) {
                    setTimeout(function() {
                        if (maskTrans !== null) {
                            maskTrans.remove();
                        }
                        noticeBox.fadeOut(500);
                    }, 1500);
                }
            }
        });
    }
    this.hide = function() {
        noticeBox.stop().fadeOut(500, function() {
            noticeBox.css({
                bottom: '-56px'
            })
        });
    }
}

//自定义分类
var chkCategories = $("div.categorie-list").find(":checkbox");
var chkCatStrs = chkCategories.map(function() {
    return $(this).val();
}).get();
var myTag = new AutoTag({
    tagBox: $("#categorieBox"), //标签层
    iptTags: $("#hidCategories"), //标签集合隐藏域
    addBtn: $("#addCategorie"), //触发增加标签button
    maxTagLen: 0,
    isEditorble: false,
    funAfterEditor: function(obj, val) {
        var curChk = null,
            tagIdx = chkCatStrs.findIndex(function(ele) {
                return ele === val;
            });
        if (tagIdx > -1) {
            chkCategories.map(function() {
                if ($(this).val().toLowerCase() === val.toLowerCase()) {
                    curChk = $(this);
                }
            })
            curChk.prop('checked', true);
            chkCatgCancle(curChk, obj);
        }
    },
    funAfterDel: function(val) {
        chkCategories.filter('[value="' + val + '"]').prop('checked', false);
    }
});

var articleTag = new AutoTag({
    tagBox: $("#articleTagBox"), //标签层
    iptTags: $("#hidTags"), //标签集合隐藏域
    addBtn: $("#addTag"), //触发增加标签button
    maxTagLen: 5,
    isEditorble: true
});

//先有标签选中或取消选择
chkCategories.change(function() {
    if ($(this).is(':checked')) {
        var txt = $(this).val();
        var curTag = myTag.addTag(txt);
        if (!curTag) {
            $(this).prop('checked', false);
        } else {
            chkCatgCancle($(this), curTag);
        }
    }
})

function chkCatgCancle(chkObj, curTag) {
    chkObj.bind('click', function() {
        if (!$(this).is(':checked')) {
            curTag.find('i.icon-guanbi').trigger('click');
            //curTag.remove();
            $(this).unbind('click');
        }
    })
}

//修复 鼠标移出编辑器失焦问题 问题main-1.0.5.js绑定了iframe失焦
(function($) {
    setTimeout(function() {
        $("#focus_retriever").remove();
    }, 500);
})(jQuery);

//页面代码迁移
//切换markdown提示
function colseSwitchMdMode() {
    alertMask.addClass("d-none");
    switchMdMode.addClass("d-none");
}
function openSwitchMdMode() {
    alertMask.removeClass("d-none");
    switchMdMode.removeClass("d-none");
}
switchMdMode.find("i.icon-guanbi,button.btn-cancel,a.btn-confirm").click(function() { colseSwitchMdMode(); })

function fullOpenMoreDiv() {
    alertMask.removeClass("d-none");
    moreDiv.show();
}
function fullCloseMoreDiv() {
    alertMask.addClass("d-none");
    moreDiv.removeAttr("style");
}
fullBtns.filter(".btn-fabu").click(function() {
    var title = csdn.val2("txtTitle");
    var content = csdn.val("editor")
    if (!title) {
        notice.error("文章标题不能为空。")
    } else if (!content) {
        notice.error("文章内容不能为空。")
    } else {
        fullOpenMoreDiv();
    }
});
moreDiv.find("#btnDraftFull").click(function() {
    fullCloseMoreDiv();
});
moreDiv.find(".btn-close").click(function() {
    fullCloseMoreDiv();
});

var textareaBox = $("div.textarea-box"),
    countObj = textareaBox.find("span.count"),
    textSummary = $("#txtSammary");

function summaryCount() {
    var txt = textSummary.val(),
        count = txt.length;
    countObj.text(count);
}
textSummary.keyup(summaryCount);
summaryCount();