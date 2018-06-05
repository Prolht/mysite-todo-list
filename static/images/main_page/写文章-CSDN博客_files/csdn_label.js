var AutoTag = function(asks) {
	if (!jQuery) {
		console.error('需要引用jquery');
		return false;
	}
	var _this = this;
	var settings = {
		tagBox: $("div.tag-box"), //标签层
		iptTags: $("#hidTags"), //标签集合隐藏域
		addBtn: $("#addTag"), //触发增加标签button
		splitStr: ',', //标签连接符，hidTags用
		maxTagLen: 5, //最多可设置几个标签 0 为无需设置个数
		funAfterEditor: null, //回调方法编辑tag后，参数:当前编辑标签，value
		funAfterDel: null, //回调方法删除tag后,参数:删除标签value
		isEditorble: true, //标签是否可编辑
		quickNext: [13, 188, 229] //是否支持快捷字符新建,支持多键位
	}
	if (asks) {
		$.extend(settings, asks);
	}
	if (settings.isEditorble) {
		// 点击标签可编辑 
		settings.tagBox.on('click', 'span.name', function() {
			$(this).prop("contenteditable", true);
			var _this = $(this);
			leaveFun(_this);
		});
	}
	//清除回车键效果
	settings.tagBox.on('keyup', 'span.name', function(e) {
		e.stopPropagation();
		var testFun = function(ele) {
			return ele == e.which
		};
		if (settings.quickNext.find(testFun) !== undefined) {
			var e = e;
			if (e.which !== 13) {
				this.innerText = this.innerText.substring(0, this.innerText.length - 1);
			}
			//输入完成效果
			$(this).trigger('focusout');
			if (settings.quickNext.length > 0) {
				if (judgmentTag()) {
					var curTag = settings.addTag("");
					leaveFun(curTag.find("span.name"));
					judgmentTag();
				}
			}
		}
	});
	settings.tagBox.on('keydown', 'span.name', function(e) {
		e.stopPropagation();
		if (e.which === 13) {
			return false;
		}
	});
	//删除tag
	var deletTag = function(tagObj) {
		var tagVal = tagObj.find('span.name').text();
		tagObj.remove();
		resetTagValue();
		judgmentTag();
		if (settings.funAfterDel !== null) {
			settings.funAfterDel(tagVal);
		}
	}
	//判断tag个数
	var judgmentTag = function() {
		var result = true;
		if (settings.maxTagLen > 0) {
			if (settings.tagBox.find("div.tag").length === settings.maxTagLen) {
				settings.addBtn.prop("disabled", true);
				result = false;
			} else {
				settings.addBtn.prop("disabled", false);
				result = true;
			}
		}
		return result;
	}
	// 获取当前tag值
	var resetTagValue = function() {
		var tagNames = settings.tagBox.find("span.name"),
			result = '',
			splitStr = settings.splitStr;
		tagNames.text(function(idx, st) {
			if (st.length > 30) {
				st = st.substring(0, 30);
			}
			$(tagNames[idx]).text(st);
			result += (idx > 0 ? splitStr : '') + st;
		});
		_this.allTagsVal = result;
		settings.iptTags.val(result);
	}
	var leaveFun = function(obj) {
		var funAfterEditor = settings.funAfterEditor;
		var allTagsVal = settings.iptTags.val();
		var _this = obj;
		setTimeout(function() {
			_this.focus();
			_this.one('focusout', function() {
				var curTxt = $(this).text().trim();
				var len = curTxt.length;
				var isAlreadyHad = new RegExp(',[' + curTxt + ']{' + len + '}$|,[' + curTxt + ']{' + len + '},|^[' + curTxt + ']{' + len + '},|^[' + curTxt + ']{' + len +'}$', 'ig');
				if (!curTxt || isAlreadyHad.test(allTagsVal)) {
					if (!curTxt) {
						$(this).parent().remove();
					} else {
						var tagArr = allTagsVal.split(',');
						var idx = tagArr.findIndex(function(element) {
							return element === curTxt;
						})
						if ($(this).parent().index('div.tag') !== idx) {
							$(this).parent().remove();
						}
					}
				} else {
					resetTagValue();
					$(this).prop("contenteditable", false);
					if (funAfterEditor !== null) {
						funAfterEditor($(this).parent("div.tag"), curTxt);
					}
				}
				judgmentTag();
			});
		}, 100);
	}
	//增加标签方法
	settings.addTag = function(tagTxt) {
		var curTag = $('<div class="tag"><span class="name" ' + (!tagTxt ? 'contenteditable="true"' : '') + '></span><i class="xheIcon icon-guanbi"></i></div>');
		curTag.find("span.name").text(tagTxt);
		settings.addBtn.before(curTag);
		return curTag;
	}
	//新增
	settings.addBtn.click(function() {
		//增加tag
		var curTag = settings.addTag("");
		leaveFun(curTag.find("span.name"));
	});
	//删除
	settings.tagBox.on('click', 'i.icon-guanbi', function(e) {
		deletTag($(this).parent());
	});
	/* 回调方法设定 */
	_this.allTagsVal = ''; //当前tag string
	//现有值加载tag
	_this.loadTags = function(tags) {
		if (tags) {
			var list = tags.split(settings.splitStr);
			for (var i = 0; i < list.length; i++) {
				var curTag = settings.addTag(list[i]);
				judgmentTag();
				_this.allTagsVal = tags;
				settings.funAfterEditor(curTag, list[i]);
			}
		}
	};
	//外部增加一个标签
	_this.addTag = function(txt) {
		if (judgmentTag()) {
			var curTag = settings.addTag(txt);
			resetTagValue();
			settings.funAfterEditor(curTag, txt);
			judgmentTag();
			return curTag;
		}
		return false;
	}
	return _this;
}
