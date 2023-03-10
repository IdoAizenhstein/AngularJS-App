/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 2.5.0 - 2017-01-28
 * License: MIT
 */
angular.module("ui.bootstrapType", ["ui.bootstrapType.tpls", "ui.bootstrapType.typeahead", "ui.bootstrapType.debounce", "ui.bootstrapType.position"]), angular.module("ui.bootstrapType.tpls", ["uib/template/typeahead/typeahead-match.html", "uib/template/typeahead/typeahead-popup.html"]), angular.module("ui.bootstrapType.typeahead", ["ui.bootstrapType.debounce", "ui.bootstrapType.position"]).factory("uibTypeaheadParser", ["$parse", function (e) {
	var t = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
	return {
		parse: function (a) {
			var o = a.match(t);
			if (!o) throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + a + '".');
			return {itemName: o[3], source: e(o[4]), viewMapper: e(o[2] || o[1]), modelMapper: e(o[1])}
		}
	}
}]).controller("UibTypeaheadController", ["$scope", "$element", "$attrs", "$compile", "$parse", "$q", "$timeout", "$document", "$window", "$rootScope", "$$debounce", "$uibPosition", "uibTypeaheadParser", function (e, t, a, o, i, n, r, l, s, p, d, u, c) {
	function h() {
		L.moveInProgress || (L.moveInProgress = !0, L.$digest()), Q()
	}

	function f() {
		L.position = C ? u.offset(t) : u.position(t), L.position.top += t.prop("offsetHeight")
	}

	function g(e) {
		var t;
		return angular.version.minor < 6 ? (t = e.$options || {}, t.getOption = function (e) {
			return t[e]
		}) : t = e.$options, t
	}

	var m, b, v = [9, 13, 27, 38, 40], y = 200, $ = e.$eval(a.typeaheadMinLength);
	$ || 0 === $ || ($ = 1), e.$watch(a.typeaheadMinLength, function (e) {
		$ = e || 0 === e ? e : 1
	});
	var w = e.$eval(a.typeaheadWaitMs) || 0, x = e.$eval(a.typeaheadEditable) !== !1;
	e.$watch(a.typeaheadEditable, function (e) {
		x = e !== !1
	});
	var S, M, I = i(a.typeaheadLoading).assign || angular.noop,
		T = a.typeaheadShouldSelect ? i(a.typeaheadShouldSelect) : function (e, t) {
			var a = t.$event;
			return 13 === a.which || 9 === a.which
		}, U = i(a.typeaheadOnSelect),
		O = angular.isDefined(a.typeaheadSelectOnBlur) ? e.$eval(a.typeaheadSelectOnBlur) : !1,
		N = i(a.typeaheadNoResults).assign || angular.noop,
		P = a.typeaheadInputFormatter ? i(a.typeaheadInputFormatter) : void 0,
		C = a.typeaheadAppendToBody ? e.$eval(a.typeaheadAppendToBody) : !1,
		k = a.typeaheadAppendTo ? e.$eval(a.typeaheadAppendTo) : null, R = e.$eval(a.typeaheadFocusFirst) !== !1,
		E = a.typeaheadSelectOnExact ? e.$eval(a.typeaheadSelectOnExact) : !1,
		W = i(a.typeaheadIsOpen).assign || angular.noop, q = e.$eval(a.typeaheadShowHint) || !1, A = i(a.ngModel),
		V = i(a.ngModel + "($$$p)"), H = function (t, a) {
			return angular.isFunction(A(e)) && b.getOption("getterSetter") ? V(t, {$$$p: a}) : A.assign(t, a)
		}, B = c.parse(a.uibTypeahead), L = e.$new(), F = e.$on("$destroy", function () {
			L.$destroy()
		});
	L.$on("$destroy", F);
	var _ = "typeahead-" + L.$id + "-" + Math.floor(1e4 * Math.random());
	t.attr({"aria-autocomplete": "list", "aria-expanded": !1, "aria-owns": _});
	var D, j;
	q && (D = angular.element("<div></div>"), D.css("position", "relative"), t.after(D), j = t.clone(), j.attr("placeholder", ""), j.attr("tabindex", "-1"), j.val(""), j.css({
		position: "absolute",
		top: "0px",
		left: "0px",
		"border-color": "transparent",
		"box-shadow": "none",
		opacity: 1,
		background: "none 0% 0% / auto repeat scroll padding-box border-box rgb(255, 255, 255)",
		color: "#999"
	}), t.css({
		position: "relative",
		"vertical-align": "top",
		"background-color": "transparent"
	}), j.attr("id") && j.removeAttr("id"), D.append(j), j.after(t));
	var Y = angular.element("<div uib-typeahead-popup></div>");
	Y.attr({
		id: _,
		matches: "matches",
		active: "activeIdx",
		select: "select(activeIdx, evt)",
		"move-in-progress": "moveInProgress",
		query: "query",
		position: "position",
		"assign-is-open": "assignIsOpen(isOpen)",
		debounce: "debounceUpdate"
	}), angular.isDefined(a.typeaheadTemplateUrl) && Y.attr("template-url", a.typeaheadTemplateUrl), angular.isDefined(a.typeaheadPopupTemplateUrl) && Y.attr("popup-template-url", a.typeaheadPopupTemplateUrl);
	var X = function () {
		q && j.val("")
	}, z = function () {
		L.matches = [], L.activeIdx = -1, t.attr("aria-expanded", !1), X()
	}, K = function (e) {
		return _ + "-option-" + e
	};
	L.$watch("activeIdx", function (e) {
		0 > e ? t.removeAttr("aria-activedescendant") : t.attr("aria-activedescendant", K(e))
	});
	var G = function (e, t) {
		return L.matches.length > t && e ? e.toUpperCase() === L.matches[t].label.toUpperCase() : !1
	}, J = function (a, o) {
		var i = {$viewValue: a};
		I(e, !0), N(e, !1), n.when(B.source(e, i)).then(function (n) {
			var r = a === m.$viewValue;
			if (r && S) if (n && n.length > 0) {
				L.activeIdx = R ? 0 : -1, N(e, !1), L.matches.length = 0;
				for (var l = 0; l < n.length; l++) i[B.itemName] = n[l], L.matches.push({
					id: K(l),
					label: B.viewMapper(L, i),
					model: n[l]
				});
				if (L.query = a, f(), t.attr("aria-expanded", !0), E && 1 === L.matches.length && G(a, 0) && (angular.isNumber(L.debounceUpdate) || angular.isObject(L.debounceUpdate) ? d(function () {
						L.select(0, o)
					}, angular.isNumber(L.debounceUpdate) ? L.debounceUpdate : L.debounceUpdate["default"]) : L.select(0, o)), q) {
					var s = L.matches[0].label;
					j.val(angular.isString(a) && a.length > 0 && s.slice(0, a.length).toUpperCase() === a.toUpperCase() ? a + s.slice(a.length) : "")
				}
			} else z(), N(e, !0);
			r && I(e, !1)
		}, function () {
			z(), I(e, !1), N(e, !0)
		})
	};
	C && (angular.element(s).on("resize", h), l.find("body").on("scroll", h));
	var Q = d(function () {
		L.matches.length && f(), L.moveInProgress = !1
	}, y);
	L.moveInProgress = !1, L.query = void 0;
	var Z, et = function (e) {
		Z = r(function () {
			J(e)
		}, w)
	}, tt = function () {
		Z && r.cancel(Z)
	};
	z(), L.assignIsOpen = function (t) {
		W(e, t)
	}, L.select = function (o, i) {
		var n, l, s = {};
		M = !0, s[B.itemName] = l = L.matches[o].model, n = B.modelMapper(e, s), H(e, n), m.$setValidity("editable", !0), m.$setValidity("parse", !0), U(e, {
			$item: l,
			$model: n,
			$label: B.viewMapper(e, s),
			$event: i
		}), z(), L.$eval(a.typeaheadFocusOnSelect) !== !1 && r(function () {
			t[0].focus()
		}, 0, !1)
	}, t.on("keydown", function (t) {
		if (0 !== L.matches.length && -1 !== v.indexOf(t.which)) {
			var a = T(e, {$event: t});
			if (-1 === L.activeIdx && a || 9 === t.which && t.shiftKey) return z(), void L.$digest();
			t.preventDefault();
			var o;
			switch (t.which) {
				case 27:
					t.stopPropagation(), z(), e.$digest();
					break;
				case 38:
					L.activeIdx = (L.activeIdx > 0 ? L.activeIdx : L.matches.length) - 1, L.$digest(), o = Y[0].querySelectorAll(".uib-typeahead-match")[L.activeIdx], o.parentNode.scrollTop = o.offsetTop;
					break;
				case 40:
					L.activeIdx = (L.activeIdx + 1) % L.matches.length, L.$digest(), o = Y[0].querySelectorAll(".uib-typeahead-match")[L.activeIdx], o.parentNode.scrollTop = o.offsetTop;
					break;
				default:
					a && L.$apply(function () {
						angular.isNumber(L.debounceUpdate) || angular.isObject(L.debounceUpdate) ? d(function () {
							L.select(L.activeIdx, t)
						}, angular.isNumber(L.debounceUpdate) ? L.debounceUpdate : L.debounceUpdate["default"]) : L.select(L.activeIdx, t)
					})
			}
		}
	}), t.on("focus", function (e) {
		S = !0, 0 !== $ || m.$viewValue || r(function () {
			J(m.$viewValue, e)
		}, 0)
	}), t.on("blur", function (e) {
		O && L.matches.length && -1 !== L.activeIdx && !M && (M = !0, L.$apply(function () {
			angular.isObject(L.debounceUpdate) && angular.isNumber(L.debounceUpdate.blur) ? d(function () {
				L.select(L.activeIdx, e)
			}, L.debounceUpdate.blur) : L.select(L.activeIdx, e)
		})), !x && m.$error.editable && (m.$setViewValue(), L.$apply(function () {
			m.$setValidity("editable", !0), m.$setValidity("parse", !0)
		}), t.val("")), S = !1, M = !1
	});
	var at = function (a) {
		t[0] !== a.target && 3 !== a.which && 0 !== L.matches.length && (z(), p.$$phase || e.$digest())
	};
	l.on("click", at), e.$on("$destroy", function () {
		l.off("click", at), (C || k) && ot.remove(), C && (angular.element(s).off("resize", h), l.find("body").off("scroll", h)), Y.remove(), q && D.remove()
	});
	var ot = o(Y)(L);
	C ? l.find("body").append(ot) : k ? angular.element(k).eq(0).append(ot) : t.after(ot), this.init = function (t) {
		m = t, b = g(m), L.debounceUpdate = i(b.getOption("debounce"))(e), m.$parsers.unshift(function (t) {
			return S = !0, 0 === $ || t && t.length >= $ ? w > 0 ? (tt(), et(t)) : J(t) : (I(e, !1), tt(), z()), x ? t : t ? void m.$setValidity("editable", !1) : (m.$setValidity("editable", !0), null)
		}), m.$formatters.push(function (t) {
			var a, o, i = {};
			return x || m.$setValidity("editable", !0), P ? (i.$model = t, P(e, i)) : (i[B.itemName] = t, a = B.viewMapper(e, i), i[B.itemName] = void 0, o = B.viewMapper(e, i), a !== o ? a : t)
		})
	}
}]).directive("uibTypeahead", function () {
	return {
		controller: "UibTypeaheadController", require: ["ngModel", "uibTypeahead"], link: function (e, t, a, o) {
			o[1].init(o[0])
		}
	}
}).directive("uibTypeaheadPopup", ["$$debounce", function (e) {
	return {
		scope: {
			matches: "=",
			query: "=",
			active: "=",
			position: "&",
			moveInProgress: "=",
			select: "&",
			assignIsOpen: "&",
			debounce: "&"
		}, replace: !0, templateUrl: function (e, t) {
			return t.popupTemplateUrl || "uib/template/typeahead/typeahead-popup.html"
		}, link: function (t, a, o) {
			t.templateUrl = o.templateUrl, t.isOpen = function () {
				var e = t.matches.length > 0;
				return t.assignIsOpen({isOpen: e}), e
			}, t.isActive = function (e) {
				return t.active === e
			}, t.selectActive = function (e) {
				t.active = e
			}, t.selectMatch = function (a, o) {
				var i = t.debounce();
				angular.isNumber(i) || angular.isObject(i) ? e(function () {
					t.select({activeIdx: a, evt: o})
				}, angular.isNumber(i) ? i : i["default"]) : t.select({activeIdx: a, evt: o})
			}
		}
	}
}]).directive("uibTypeaheadMatch", ["$templateRequest", "$compile", "$parse", function (e, t, a) {
	return {
		scope: {index: "=", match: "=", query: "="}, link: function (o, i, n) {
			var r = a(n.templateUrl)(o.$parent) || "uib/template/typeahead/typeahead-match.html";
			e(r).then(function (e) {
				var a = angular.element(e.trim());
				i.replaceWith(a), t(a)(o)
			})
		}
	}
}]).filter("uibTypeaheadHighlight", ["$sce", "$injector", "$log", function (e, t, a) {
	function o(e) {
		return e.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
	}

	function i(e) {
		return /<.*>/g.test(e)
	}

	var n;
	return n = t.has("$sanitize"), function (t, r) {
		return !n && i(t) && a.warn("Unsafe use of typeahead please use ngSanitize"), t = r ? ("" + t).replace(new RegExp(o(r), "gi"), "<strong>$&</strong>") : t, n || (t = e.trustAsHtml(t)), t
	}
}]), angular.module("ui.bootstrapType.debounce", []).factory("$$debounce", ["$timeout", function (e) {
	return function (t, a) {
		var o;
		return function () {
			var i = this, n = Array.prototype.slice.call(arguments);
			o && e.cancel(o), o = e(function () {
				t.apply(i, n)
			}, a)
		}
	}
}]), angular.module("ui.bootstrapType.position", []).factory("$uibPosition", ["$document", "$window", function (e, t) {
	var a, o, i = {normal: /(auto|scroll)/, hidden: /(auto|scroll|hidden)/}, n = {
		auto: /\s?auto?\s?/i,
		primary: /^(top|bottom|left|right)$/,
		secondary: /^(top|bottom|left|right|center)$/,
		vertical: /^(top|bottom)$/
	}, r = /(HTML|BODY)/;
	return {
		getRawNode: function (e) {
			return e.nodeName ? e : e[0] || e
		}, parseStyle: function (e) {
			return e = parseFloat(e), isFinite(e) ? e : 0
		}, offsetParent: function (a) {
			function o(e) {
				return "static" === (t.getComputedStyle(e).position || "static")
			}

			a = this.getRawNode(a);
			for (var i = a.offsetParent || e[0].documentElement; i && i !== e[0].documentElement && o(i);) i = i.offsetParent;
			return i || e[0].documentElement
		}, scrollbarWidth: function (i) {
			if (i) {
				if (angular.isUndefined(o)) {
					var n = e.find("body");
					n.addClass("uib-position-body-scrollbar-measure"), o = t.innerWidth - n[0].clientWidth, o = isFinite(o) ? o : 0, n.removeClass("uib-position-body-scrollbar-measure")
				}
				return o
			}
			if (angular.isUndefined(a)) {
				var r = angular.element('<div class="uib-position-scrollbar-measure"></div>');
				e.find("body").append(r), a = r[0].offsetWidth - r[0].clientWidth, a = isFinite(a) ? a : 0, r.remove()
			}
			return a
		}, scrollbarPadding: function (e) {
			e = this.getRawNode(e);
			var a = t.getComputedStyle(e), o = this.parseStyle(a.paddingRight), i = this.parseStyle(a.paddingBottom),
				n = this.scrollParent(e, !1, !0), l = this.scrollbarWidth(r.test(n.tagName));
			return {
				scrollbarWidth: l,
				widthOverflow: n.scrollWidth > n.clientWidth,
				right: o + l,
				originalRight: o,
				heightOverflow: n.scrollHeight > n.clientHeight,
				bottom: i + l,
				originalBottom: i
			}
		}, isScrollable: function (e, a) {
			e = this.getRawNode(e);
			var o = a ? i.hidden : i.normal, n = t.getComputedStyle(e);
			return o.test(n.overflow + n.overflowY + n.overflowX)
		}, scrollParent: function (a, o, n) {
			a = this.getRawNode(a);
			var r = o ? i.hidden : i.normal, l = e[0].documentElement, s = t.getComputedStyle(a);
			if (n && r.test(s.overflow + s.overflowY + s.overflowX)) return a;
			var p = "absolute" === s.position, d = a.parentElement || l;
			if (d === l || "fixed" === s.position) return l;
			for (; d.parentElement && d !== l;) {
				var u = t.getComputedStyle(d);
				if (p && "static" !== u.position && (p = !1), !p && r.test(u.overflow + u.overflowY + u.overflowX)) break;
				d = d.parentElement
			}
			return d
		}, position: function (a, o) {
			a = this.getRawNode(a);
			var i = this.offset(a);
			if (o) {
				var n = t.getComputedStyle(a);
				i.top -= this.parseStyle(n.marginTop), i.left -= this.parseStyle(n.marginLeft)
			}
			var r = this.offsetParent(a), l = {top: 0, left: 0};
			return r !== e[0].documentElement && (l = this.offset(r), l.top += r.clientTop - r.scrollTop, l.left += r.clientLeft - r.scrollLeft), {
				width: Math.round(angular.isNumber(i.width) ? i.width : a.offsetWidth),
				height: Math.round(angular.isNumber(i.height) ? i.height : a.offsetHeight),
				top: Math.round(i.top - l.top),
				left: Math.round(i.left - l.left)
			}
		}, offset: function (a) {
			a = this.getRawNode(a);
			var o = a.getBoundingClientRect();
			return {
				width: Math.round(angular.isNumber(o.width) ? o.width : a.offsetWidth),
				height: Math.round(angular.isNumber(o.height) ? o.height : a.offsetHeight),
				top: Math.round(o.top + (t.pageYOffset || e[0].documentElement.scrollTop)),
				left: Math.round(o.left + (t.pageXOffset || e[0].documentElement.scrollLeft))
			}
		}, viewportOffset: function (a, o, i) {
			a = this.getRawNode(a), i = i !== !1 ? !0 : !1;
			var n = a.getBoundingClientRect(), r = {top: 0, left: 0, bottom: 0, right: 0},
				l = o ? e[0].documentElement : this.scrollParent(a), s = l.getBoundingClientRect();
			if (r.top = s.top + l.clientTop, r.left = s.left + l.clientLeft, l === e[0].documentElement && (r.top += t.pageYOffset, r.left += t.pageXOffset), r.bottom = r.top + l.clientHeight, r.right = r.left + l.clientWidth, i) {
				var p = t.getComputedStyle(l);
				r.top += this.parseStyle(p.paddingTop), r.bottom -= this.parseStyle(p.paddingBottom), r.left += this.parseStyle(p.paddingLeft), r.right -= this.parseStyle(p.paddingRight)
			}
			return {
				top: Math.round(n.top - r.top),
				bottom: Math.round(r.bottom - n.bottom),
				left: Math.round(n.left - r.left),
				right: Math.round(r.right - n.right)
			}
		}, parsePlacement: function (e) {
			var t = n.auto.test(e);
			return t && (e = e.replace(n.auto, "")), e = e.split("-"), e[0] = e[0] || "top", n.primary.test(e[0]) || (e[0] = "top"), e[1] = e[1] || "center", n.secondary.test(e[1]) || (e[1] = "center"), e[2] = t ? !0 : !1, e
		}, positionElements: function (e, a, o, i) {
			e = this.getRawNode(e), a = this.getRawNode(a);
			var r = angular.isDefined(a.offsetWidth) ? a.offsetWidth : a.prop("offsetWidth"),
				l = angular.isDefined(a.offsetHeight) ? a.offsetHeight : a.prop("offsetHeight");
			o = this.parsePlacement(o);
			var s = i ? this.offset(e) : this.position(e), p = {top: 0, left: 0, placement: ""};
			if (o[2]) {
				var d = this.viewportOffset(e, i), u = t.getComputedStyle(a), c = {
					width: r + Math.round(Math.abs(this.parseStyle(u.marginLeft) + this.parseStyle(u.marginRight))),
					height: l + Math.round(Math.abs(this.parseStyle(u.marginTop) + this.parseStyle(u.marginBottom)))
				};
				if (o[0] = "top" === o[0] && c.height > d.top && c.height <= d.bottom ? "bottom" : "bottom" === o[0] && c.height > d.bottom && c.height <= d.top ? "top" : "left" === o[0] && c.width > d.left && c.width <= d.right ? "right" : "right" === o[0] && c.width > d.right && c.width <= d.left ? "left" : o[0], o[1] = "top" === o[1] && c.height - s.height > d.bottom && c.height - s.height <= d.top ? "bottom" : "bottom" === o[1] && c.height - s.height > d.top && c.height - s.height <= d.bottom ? "top" : "left" === o[1] && c.width - s.width > d.right && c.width - s.width <= d.left ? "right" : "right" === o[1] && c.width - s.width > d.left && c.width - s.width <= d.right ? "left" : o[1], "center" === o[1]) if (n.vertical.test(o[0])) {
					var h = s.width / 2 - r / 2;
					d.left + h < 0 && c.width - s.width <= d.right ? o[1] = "left" : d.right + h < 0 && c.width - s.width <= d.left && (o[1] = "right")
				} else {
					var f = s.height / 2 - c.height / 2;
					d.top + f < 0 && c.height - s.height <= d.bottom ? o[1] = "top" : d.bottom + f < 0 && c.height - s.height <= d.top && (o[1] = "bottom")
				}
			}
			switch (o[0]) {
				case"top":
					p.top = s.top - l;
					break;
				case"bottom":
					p.top = s.top + s.height;
					break;
				case"left":
					p.left = s.left - r;
					break;
				case"right":
					p.left = s.left + s.width
			}
			switch (o[1]) {
				case"top":
					p.top = s.top;
					break;
				case"bottom":
					p.top = s.top + s.height - l;
					break;
				case"left":
					p.left = s.left;
					break;
				case"right":
					p.left = s.left + s.width - r;
					break;
				case"center":
					n.vertical.test(o[0]) ? p.left = s.left + s.width / 2 - r / 2 : p.top = s.top + s.height / 2 - l / 2
			}
			return p.top = Math.round(p.top), p.left = Math.round(p.left), p.placement = "center" === o[1] ? o[0] : o[0] + "-" + o[1], p
		}, adjustTop: function (e, t, a, o) {
			return -1 !== e.indexOf("top") && a !== o ? {top: t.top - o + "px"} : void 0
		}, positionArrow: function (e, a) {
			e = this.getRawNode(e);
			var o = e.querySelector(".tooltip-inner, .popover-inner");
			if (o) {
				var i = angular.element(o).hasClass("tooltip-inner"),
					r = e.querySelector(i ? ".tooltip-arrow" : ".arrow");
				if (r) {
					var l = {top: "", bottom: "", left: "", right: ""};
					if (a = this.parsePlacement(a), "center" === a[1]) return void angular.element(r).css(l);
					var s = "border-" + a[0] + "-width", p = t.getComputedStyle(r)[s], d = "border-";
					d += n.vertical.test(a[0]) ? a[0] + "-" + a[1] : a[1] + "-" + a[0], d += "-radius";
					var u = t.getComputedStyle(i ? o : e)[d];
					switch (a[0]) {
						case"top":
							l.bottom = i ? "0" : "-" + p;
							break;
						case"bottom":
							l.top = i ? "0" : "-" + p;
							break;
						case"left":
							l.right = i ? "0" : "-" + p;
							break;
						case"right":
							l.left = i ? "0" : "-" + p
					}
					l[a[1]] = u, angular.element(r).css(l)
				}
			}
		}
	}
}]), angular.module("uib/template/typeahead/typeahead-match.html", []).run(["$templateCache", function (e) {
	e.put("uib/template/typeahead/typeahead-match.html", '<a href\n   tabindex="-1"\n   ng-bind-html="match.label | uibTypeaheadHighlight:query"\n   ng-attr-title="{{match.label}}"></a>\n')
}]), angular.module("uib/template/typeahead/typeahead-popup.html", []).run(["$templateCache", function (e) {
	e.put("uib/template/typeahead/typeahead-popup.html", '<ul class="dropdown-menu scrollDesign" ng-show="isOpen() && !moveInProgress" ng-style="{top: position().top+\'px\', left: position().left+\'px\'}" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li class="uib-typeahead-match" ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index, $event)" role="option" id="{{::match.id}}">\n        <div uib-typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n')
}]), angular.module("ui.bootstrapType.typeahead").run(function () {
	!angular.$$csp().noInlineStyle && !angular.$$uibTypeaheadCss && angular.element(document).find("head").prepend('<style type="text/css">[uib-typeahead-popup].dropdown-menu{display:block;}</style>'), angular.$$uibTypeaheadCss = !0
}), angular.module("ui.bootstrapType.position").run(function () {
	!angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>'), angular.$$uibPositionCss = !0
});


