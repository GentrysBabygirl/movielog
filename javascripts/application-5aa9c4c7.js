window.BackgroundImages=function(){function t(){for(var t=document.querySelectorAll("[data-backdrop]"),n=window.devicePixelRatio||1,i=t.length,o=0;i>o;o++)e(t[o],n)}function e(t,e){t.style.backgroundImage="url("+n(t,e)+")",t.classList.add("loaded")}function n(t,e){var n=t.getAttribute("data-backdrop"),r=i(t,e);return o(n,r)}function i(t,e){return t.offsetWidth*e}function o(t,e){return t.replace(/\/w\d*-rj\//,"/w"+e+"-rj/")}_debounce=function(t,e,n){var i,o,r,a,s,c=function(){var l=new Date-a;e>l&&l>=0?i=setTimeout(c,e-l):(i=null,n||(s=t.apply(r,o),i||(r=o=null)))};return function(){r=this,o=arguments,a=new Date;var l=n&&!i;return i||(i=setTimeout(c,e)),l&&(s=t.apply(r,o),r=o=null),s}};var r=_debounce(function(){requestAnimationFrame(t)},250);return window.addEventListener("resize",r,!1),{update:function(){var e=setInterval(function(){return/^complete|^i|^c/.test(document.readyState)?(requestAnimationFrame(t),void clearInterval(e)):void 0},250)}}}(),function(){"use strict";/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @version 1.0.3
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */
function t(n,i){function o(t,e){return function(){return t.apply(e,arguments)}}var r;if(i=i||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=i.touchBoundary||10,this.layer=n,this.tapDelay=i.tapDelay||200,!t.notNeeded(n)){for(var a=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],s=this,c=0,l=a.length;l>c;c++)s[a[c]]=o(s[a[c]],s);e&&(n.addEventListener("mouseover",this.onMouse,!0),n.addEventListener("mousedown",this.onMouse,!0),n.addEventListener("mouseup",this.onMouse,!0)),n.addEventListener("click",this.onClick,!0),n.addEventListener("touchstart",this.onTouchStart,!1),n.addEventListener("touchmove",this.onTouchMove,!1),n.addEventListener("touchend",this.onTouchEnd,!1),n.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(n.removeEventListener=function(t,e,i){var o=Node.prototype.removeEventListener;"click"===t?o.call(n,t,e.hijacked||e,i):o.call(n,t,e,i)},n.addEventListener=function(t,e,i){var o=Node.prototype.addEventListener;"click"===t?o.call(n,t,e.hijacked||(e.hijacked=function(t){t.propagationStopped||e(t)}),i):o.call(n,t,e,i)}),"function"==typeof n.onclick&&(r=n.onclick,n.addEventListener("click",function(t){r(t)},!1),n.onclick=null)}}var e=navigator.userAgent.indexOf("Android")>0,n=/iP(ad|hone|od)/.test(navigator.userAgent),i=n&&/OS 4_\d(_\d)?/.test(navigator.userAgent),o=n&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent),r=navigator.userAgent.indexOf("BB10")>0;t.prototype.needsClick=function(t){switch(t.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(t.disabled)return!0;break;case"input":if(n&&"file"===t.type||t.disabled)return!0;break;case"label":case"video":return!0}return/\bneedsclick\b/.test(t.className)},t.prototype.needsFocus=function(t){switch(t.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!e;case"input":switch(t.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!t.disabled&&!t.readOnly;default:return/\bneedsfocus\b/.test(t.className)}},t.prototype.sendClick=function(t,e){var n,i;document.activeElement&&document.activeElement!==t&&document.activeElement.blur(),i=e.changedTouches[0],n=document.createEvent("MouseEvents"),n.initMouseEvent(this.determineEventType(t),!0,!0,window,1,i.screenX,i.screenY,i.clientX,i.clientY,!1,!1,!1,!1,0,null),n.forwardedTouchEvent=!0,t.dispatchEvent(n)},t.prototype.determineEventType=function(t){return e&&"select"===t.tagName.toLowerCase()?"mousedown":"click"},t.prototype.focus=function(t){var e;n&&t.setSelectionRange&&0!==t.type.indexOf("date")&&"time"!==t.type?(e=t.value.length,t.setSelectionRange(e,e)):t.focus()},t.prototype.updateScrollParent=function(t){var e,n;if(e=t.fastClickScrollParent,!e||!e.contains(t)){n=t;do{if(n.scrollHeight>n.offsetHeight){e=n,t.fastClickScrollParent=n;break}n=n.parentElement}while(n)}e&&(e.fastClickLastScrollTop=e.scrollTop)},t.prototype.getTargetElementFromEventTarget=function(t){return t.nodeType===Node.TEXT_NODE?t.parentNode:t},t.prototype.onTouchStart=function(t){var e,o,r;if(t.targetTouches.length>1)return!0;if(e=this.getTargetElementFromEventTarget(t.target),o=t.targetTouches[0],n){if(r=window.getSelection(),r.rangeCount&&!r.isCollapsed)return!0;if(!i){if(o.identifier&&o.identifier===this.lastTouchIdentifier)return t.preventDefault(),!1;this.lastTouchIdentifier=o.identifier,this.updateScrollParent(e)}}return this.trackingClick=!0,this.trackingClickStart=t.timeStamp,this.targetElement=e,this.touchStartX=o.pageX,this.touchStartY=o.pageY,t.timeStamp-this.lastClickTime<this.tapDelay&&t.preventDefault(),!0},t.prototype.touchHasMoved=function(t){var e=t.changedTouches[0],n=this.touchBoundary;return Math.abs(e.pageX-this.touchStartX)>n||Math.abs(e.pageY-this.touchStartY)>n?!0:!1},t.prototype.onTouchMove=function(t){return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(t.target)||this.touchHasMoved(t))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},t.prototype.findControl=function(t){return void 0!==t.control?t.control:t.htmlFor?document.getElementById(t.htmlFor):t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},t.prototype.onTouchEnd=function(t){var r,a,s,c,l,u=this.targetElement;if(!this.trackingClick)return!0;if(t.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(this.cancelNextClick=!1,this.lastClickTime=t.timeStamp,a=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,o&&(l=t.changedTouches[0],u=document.elementFromPoint(l.pageX-window.pageXOffset,l.pageY-window.pageYOffset)||u,u.fastClickScrollParent=this.targetElement.fastClickScrollParent),s=u.tagName.toLowerCase(),"label"===s){if(r=this.findControl(u)){if(this.focus(u),e)return!1;u=r}}else if(this.needsFocus(u))return t.timeStamp-a>100||n&&window.top!==window&&"input"===s?(this.targetElement=null,!1):(this.focus(u),this.sendClick(u,t),n&&"select"===s||(this.targetElement=null,t.preventDefault()),!1);return n&&!i&&(c=u.fastClickScrollParent,c&&c.fastClickLastScrollTop!==c.scrollTop)?!0:(this.needsClick(u)||(t.preventDefault(),this.sendClick(u,t)),!1)},t.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},t.prototype.onMouse=function(t){return this.targetElement?t.forwardedTouchEvent?!0:t.cancelable&&(!this.needsClick(this.targetElement)||this.cancelNextClick)?(t.stopImmediatePropagation?t.stopImmediatePropagation():t.propagationStopped=!0,t.stopPropagation(),t.preventDefault(),!1):!0:!0},t.prototype.onClick=function(t){var e;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===t.target.type&&0===t.detail?!0:(e=this.onMouse(t),e||(this.targetElement=null),e)},t.prototype.destroy=function(){var t=this.layer;e&&(t.removeEventListener("mouseover",this.onMouse,!0),t.removeEventListener("mousedown",this.onMouse,!0),t.removeEventListener("mouseup",this.onMouse,!0)),t.removeEventListener("click",this.onClick,!0),t.removeEventListener("touchstart",this.onTouchStart,!1),t.removeEventListener("touchmove",this.onTouchMove,!1),t.removeEventListener("touchend",this.onTouchEnd,!1),t.removeEventListener("touchcancel",this.onTouchCancel,!1)},t.notNeeded=function(t){var n,i,o;if("undefined"==typeof window.ontouchstart)return!0;if(i=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!e)return!0;if(n=document.querySelector("meta[name=viewport]")){if(-1!==n.content.indexOf("user-scalable=no"))return!0;if(i>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(r&&(o=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),o[1]>=10&&o[2]>=3&&(n=document.querySelector("meta[name=viewport]")))){if(-1!==n.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===t.style.msTouchAction?!0:!1},t.attach=function(e,n){return new t(e,n)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return t}):"undefined"!=typeof module&&module.exports?(module.exports=t.attach,module.exports.FastClick=t):window.FastClick=t}(),FastClick.attach(document.body),function(){function t(t,e,n){var i="blur"==e||"focus"==e;t.element.addEventListener(e,n,i)}function e(t){t.preventDefault(),t.stopPropagation()}function n(t){return l?l:l=t.matches?t.matches:t.webkitMatchesSelector?t.webkitMatchesSelector:t.mozMatchesSelector?t.mozMatchesSelector:t.msMatchesSelector?t.msMatchesSelector:t.oMatchesSelector?t.oMatchesSelector:c.matchesSelector}function i(t,e,o){if("_root"==e)return o;if(t!==o)return n(t).call(t,e)?t:t.parentNode?(u++,i(t.parentNode,e,o)):void 0}function o(t,e,n,i){h[t.id]||(h[t.id]={}),h[t.id][e]||(h[t.id][e]={}),h[t.id][e][n]||(h[t.id][e][n]=[]),h[t.id][e][n].push(i)}function r(t,e,n,i){if(h[t.id])if(e){if(!i&&!n)return void(h[t.id][e]={});if(!i)return void delete h[t.id][e][n];if(h[t.id][e][n])for(var o=0;o<h[t.id][e][n].length;o++)if(h[t.id][e][n][o]===i){h[t.id][e][n].splice(o,1);break}}else for(var r in h[t.id])h[t.id].hasOwnProperty(r)&&(h[t.id][r]={})}function a(t,e,n){if(h[t][n]){var o,r,a=e.target||e.srcElement,s={},l=0,d=0;u=0;for(o in h[t][n])h[t][n].hasOwnProperty(o)&&(r=i(a,o,f[t].element),r&&c.matchesEvent(n,f[t].element,r,"_root"==o,e)&&(u++,h[t][n][o].match=r,s[u]=h[t][n][o]));for(e.stopPropagation=function(){e.cancelBubble=!0},l=0;u>=l;l++)if(s[l])for(d=0;d<s[l].length;d++){if(s[l][d].call(s[l].match,e)===!1)return void c.cancel(e);if(e.cancelBubble)return}}}function s(t,e,n,i){function s(t){return function(e){a(u,e,t)}}if(this.element){t instanceof Array||(t=[t]),n||"function"!=typeof e||(n=e,e="_root");var l,u=this.id;for(l=0;l<t.length;l++)i?r(this,t[l],e,n):(h[u]&&h[u][t[l]]||c.addEvent(this,t[l],s(t[l])),o(this,t[l],e,n));return this}}function c(t,e){if(!(this instanceof c)){for(var n in f)if(f[n].element===t)return f[n];return d++,f[d]=new c(t,d),f[d]}this.element=t,this.id=e}var l,u=0,d=0,h={},f={};c.prototype.on=function(t,e,n){return s.call(this,t,e,n)},c.prototype.off=function(t,e,n){return s.call(this,t,e,n,!0)},c.matchesSelector=function(){},c.cancel=e,c.addEvent=t,c.matchesEvent=function(){return!0},window.Gator=c}(),function(){var t,e;t=function(t,e){return t.classList.contains("js-toggle_off")?void 0:(t.classList.add("js-toggling","js-toggle_off"),t.setAttribute("aria-expanded",!1),e.setAttribute("aria-expanded",!1),Gator(t).on("transitionend",function(t){return"width"===t.propertyName||"opacity"===t.propertyName?(Gator(this).off("transitionend"),this.classList.remove("js-toggling"),e.innerHTML=e.getAttribute("data-toggle-label")):void 0}))},e=function(t,e){return t.classList.contains("js-toggle_off")?(t.classList.add("js-toggling"),t.classList.remove("js-toggle_off"),t.setAttribute("aria-expanded",!0),e.setAttribute("aria-expanded",!0),Gator(t).on("transitionend",function(t){return"width"!==t.propertyName&&"opacity"!==t.propertyName||(Gator(this).off("transitionend"),this.classList.remove("js-toggling"),e.innerHTML="Cancel",/iPad|iPhone|iPod/g.test(navigator.userAgent))?void 0:this.querySelectorAll('input[type="text"]')[0].focus()})):void 0},Gator(document).on("click","[data-toggle]",function(){var n;return n=this.nextSibling,this.getAttribute("data-toggle-label")||this.setAttribute("data-toggle-label",this.innerHTML),n.classList.contains("js-toggling")?void 0:n.classList.contains("js-toggle_off")?e(n,this):t(n,this)}),document.documentElement.classList.add("js"),Gator(document).on("mousedown",function(){return document.documentElement.classList.add("js-no_outline")}),Gator(document).on("keydown",function(){return document.documentElement.classList.remove("js-no_outline")})}.call(this);var InstantClick=function(t,e){function n(t){var e=t.indexOf("#");return 0>e?t:t.substr(0,e)}function i(t){for(;"A"!=t.nodeName;)t=t.parentNode;return t}function o(t){do{if(!t.hasAttribute)break;if(t.hasAttribute("data-instant"))return!1;if(t.hasAttribute("data-no-instant"))return!0}while(t=t.parentNode);return!1}function r(t){do{if(!t.hasAttribute)break;if(t.hasAttribute("data-no-instant"))return!1;if(t.hasAttribute("data-instant"))return!0}while(t=t.parentNode);return!1}function a(t,e){for(var n=0;n<F[t].length;n++)F[t][n](e)}function s(e,i,o,r){if(t.title=e,t.documentElement.replaceChild(i,t.body),o){history.pushState(null,null,o);var s=o.indexOf("#"),c=s>-1&&t.getElementById(o.substr(s+1)),l=0;if(c)for(;c.offsetParent;)l+=c.offsetTop,c=c.offsetParent;scrollTo(0,l),b=n(o)}else scrollTo(0,r);v(),X.done(),a("change",!1)}function c(){B=!1,H=!1}function l(t){g(i(t.target).href)}function u(t){var e=i(t.target);e.addEventListener("mouseout",f),M?(w=e.href,T=setTimeout(g,M)):g(e.href)}function d(t){var e=i(t.target);S?e.removeEventListener("mousedown",l):e.removeEventListener("mouseover",u),g(e.href)}function h(t){t.which>1||t.metaKey||t.ctrlKey||(t.preventDefault(),y(i(t.target).href))}function f(){return T?(clearTimeout(T),void(T=!1)):void(B&&!H&&(C.abort(),c()))}function m(e){var n,i,o,r,a,s;return o=(null!=(a=e.match(/<head[^>]*>([\s\S.]*)<\/head>/i))?a[0]:void 0)||"<head></head>",n=(null!=(s=e.match(/<body[^>]*>([\s\S.]*)<\/body>/i))?s[0]:void 0)||"<body></body>",r=t.createElement("html"),r.innerHTML=o+n,i=t.createDocumentFragment(),i.appendChild(r),i}function p(){if(!(C.readyState<4)&&0!=C.status){if(D.ready=+new Date-D.start,a("receive"),C.getResponseHeader("Content-Type").match(/\/(x|ht|xht)ml/)){var t=m(C.responseText),e=t.querySelector("title");P=null!=e?e.textContent:null,Y=t.querySelector("body");var i=n(O);N[i]={body:Y,title:P,scrollY:i in N?N[i].scrollY:0};for(var o,r,s=t.querySelector("head").children,c=0,l=s.length-1;l>=0;l--)if(o=s[l],o.hasAttribute("data-instant-track")){r=o.getAttribute("href")||o.getAttribute("src")||o.innerHTML;for(var u=_.length-1;u>=0;u--)_[u]==r&&c++}c!=_.length&&(I=!0)}else I=!0;H&&(H=!1,y(O))}}function v(i){for(var a,s=t.getElementsByTagName("a"),c=e.protocol+"//"+e.host,f=s.length-1;f>=0;f--)a=s[f],a.target||a.hasAttribute("download")||0!=a.href.indexOf(c+"/")||a.href.indexOf("#")>-1&&n(a.href)==b||(L?!r(a):o(a))||(a.addEventListener("touchstart",d),S?a.addEventListener("mousedown",l):a.addEventListener("mouseover",u),a.addEventListener("click",h));if(!i){var m,p,v,g,y=t.body.getElementsByTagName("script");for(f=0,j=y.length;j>f;f++)m=y[f],m.hasAttribute("data-no-instant")||(p=t.createElement("script"),m.src&&(p.src=m.src),m.innerHTML&&(p.innerHTML=m.innerHTML),v=m.parentNode,g=m.nextSibling,v.removeChild(m),v.insertBefore(p,g))}}function g(t){!S&&"display"in D&&+new Date-(D.start+D.display)<100||(T&&(clearTimeout(T),T=!1),t||(t=w),(!B||t!=O&&!H)&&(B=!0,H=!1,O=t,Y=!1,I=!1,D={start:+new Date},a("fetch"),C.open("GET",t),C.send()))}function y(t){return"display"in D||(D.display=+new Date-D.start),T?O&&O!=t?void(e.href=t):(g(t),X.start(0,!0),a("wait"),void(H=!0)):!B||H?void(e.href=t):I?void(e.href=O):Y?(N[b].scrollY=pageYOffset,c(),void s(P,Y,O)):(X.start(0,!0),a("wait"),void(H=!0))}function E(){if(!b){if(!q)return void a("change",!0);for(var i=arguments.length-1;i>=0;i--){var o=arguments[i];o===!0?L=!0:"mousedown"==o?S=!0:"number"==typeof o&&(M=o)}b=n(e.href),N[b]={body:t.body,title:t.title,scrollY:pageYOffset};for(var r,c,l=t.head.children,i=l.length-1;i>=0;i--)r=l[i],r.hasAttribute("data-instant-track")&&(c=r.getAttribute("href")||r.getAttribute("src")||r.innerHTML,_.push(c));C=new XMLHttpRequest,C.addEventListener("readystatechange",p),v(!0),X.init(),a("change",!0),addEventListener("popstate",function(){var t=n(e.href);if(t!=b){if(!(t in N))return void(e.href=e.href);N[b].scrollY=pageYOffset,b=t,s(N[t].title,N[t].body,!1,N[t].scrollY)}})}}function k(t,e){F[t].push(e)}var b,w,T,C,L,S,M,A=navigator.userAgent,x="createTouch"in t,N={},O=!1,P=!1,I=!1,Y=!1,D={},B=!1,H=!1,_=[],F={fetch:[],receive:[],wait:[],change:[]},X=function(){function e(){c=t.createElement("div"),c.id="instantclick",l=t.createElement("div"),l.id="instantclick-bar",l.className="instantclick-bar",c.appendChild(l);var e=["Webkit","Moz","O"];if(u="transform",!(u in l.style))for(var n=0;3>n;n++)e[n]+"Transform"in l.style&&(u=e[n]+"Transform");var i="transition";if(!(i in l.style))for(var n=0;3>n;n++)e[n]+"Transition"in l.style&&(i="-"+e[n].toLowerCase()+"-"+i);var o=t.createElement("style");o.innerHTML="#instantclick{position:"+(x?"absolute":"fixed")+";top:0;left:0;width:100%;pointer-events:none;z-index:2147483647;"+i+":opacity .25s .1s}.instantclick-bar{background:#29d;width:100%;margin-left:-100%;height:2px;"+i+":all .25s}",t.head.appendChild(o),x&&(s(),addEventListener("resize",s),addEventListener("scroll",s))}function n(e,n){d=e,t.getElementById(c.id)&&t.body.removeChild(c),c.style.opacity="1",t.getElementById(c.id)&&t.body.removeChild(c),r(),n&&setTimeout(i,0),clearTimeout(h),h=setTimeout(o,500)}function i(){d=10,r()}function o(){d+=1+2*Math.random(),d>=98?d=98:h=setTimeout(o,500),r()}function r(){l.style[u]="translate("+d+"%)",t.getElementById(c.id)||t.body.appendChild(c)}function a(){return t.getElementById(c.id)?(clearTimeout(h),d=100,r(),void(c.style.opacity="0")):(n(100==d?0:d),void setTimeout(a,0))}function s(){c.style.left=pageXOffset+"px",c.style.width=innerWidth+"px",c.style.top=pageYOffset+"px";var t="orientation"in window&&90==Math.abs(orientation),e=innerWidth/screen[t?"height":"width"]*2;c.style[u]="scaleY("+e+")"}var c,l,u,d,h;return{init:e,start:n,done:a}}(),q="pushState"in history&&(!A.match("Android")||A.match("Chrome/"))&&"file:"!=e.protocol;return{supported:q,init:E,on:k}}(document,location);(function(){var t;t=null,InstantClick.on("change",function(){return t&&t.destroy(),t=FastClick.attach(document.body),BackgroundImages.update()}),InstantClick.init()}).call(this);