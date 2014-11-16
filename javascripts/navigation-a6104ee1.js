/**
 * Copyright 2014 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * GATOR.JS
 * Simple Event Delegation
 *
 * @version 1.2.3
 *
 * Compatible with IE 9+, FF 3.6+, Safari 5+, Chrome
 *
 * Include legacy.js for compatibility with older browsers
 *
 *             .-._   _ _ _ _ _ _ _ _
 *  .-''-.__.-'00  '-' ' ' ' ' ' ' ' '-.
 * '.___ '    .   .--_'-' '-' '-' _'-' '._
 *  V: V 'vv-'   '_   '.       .'  _..' '.'.
 *    '=.____.=_.--'   :_.__.__:_   '.   : :
 *            (((____.-'        '-.  /   : :
 *                              (((-'\ .' /
 *                            _____..'  .'
 *                           '-._____.-'
 */
!function(){function t(t,e,i){var n="blur"==e||"focus"==e;t.element.addEventListener(e,i,n)}function e(t){t.preventDefault(),t.stopPropagation()}function i(t){return l?l:l=t.matches?t.matches:t.webkitMatchesSelector?t.webkitMatchesSelector:t.mozMatchesSelector?t.mozMatchesSelector:t.msMatchesSelector?t.msMatchesSelector:t.oMatchesSelector?t.oMatchesSelector:c.matchesSelector}function n(t,e,s){if("_root"==e)return s;if(t!==s)return i(t).call(t,e)?t:t.parentNode?(d++,n(t.parentNode,e,s)):void 0}function s(t,e,i,n){f[t.id]||(f[t.id]={}),f[t.id][e]||(f[t.id][e]={}),f[t.id][e][i]||(f[t.id][e][i]=[]),f[t.id][e][i].push(n)}function o(t,e,i,n){if(f[t.id])if(e){if(!n&&!i)return void(f[t.id][e]={});if(!n)return void delete f[t.id][e][i];if(f[t.id][e][i])for(var s=0;s<f[t.id][e][i].length;s++)if(f[t.id][e][i][s]===n){f[t.id][e][i].splice(s,1);break}}else for(var o in f[t.id])f[t.id].hasOwnProperty(o)&&(f[t.id][o]={})}function r(t,e,i){if(f[t][i]){var s,o,r=e.target||e.srcElement,a={},l=0,h=0;d=0;for(s in f[t][i])f[t][i].hasOwnProperty(s)&&(o=n(r,s,u[t].element),o&&c.matchesEvent(i,u[t].element,o,"_root"==s,e)&&(d++,f[t][i][s].match=o,a[d]=f[t][i][s]));for(e.stopPropagation=function(){e.cancelBubble=!0},l=0;d>=l;l++)if(a[l])for(h=0;h<a[l].length;h++){if(a[l][h].call(a[l].match,e)===!1)return void c.cancel(e);if(e.cancelBubble)return}}}function a(t,e,i,n){function a(t){return function(e){r(d,e,t)}}if(this.element){t instanceof Array||(t=[t]),i||"function"!=typeof e||(i=e,e="_root");var l,d=this.id;for(l=0;l<t.length;l++)n?o(this,t[l],e,i):(f[d]&&f[d][t[l]]||c.addEvent(this,t[l],a(t[l])),s(this,t[l],e,i));return this}}function c(t,e){if(!(this instanceof c)){for(var i in u)if(u[i].element===t)return u[i];return h++,u[h]=new c(t,h),u[h]}this.element=t,this.id=e}var l,d=0,h=0,f={},u={};c.prototype.on=function(t,e,i){return a.call(this,t,e,i)},c.prototype.off=function(t,e,i){return a.call(this,t,e,i,!0)},c.matchesSelector=function(){},c.cancel=e,c.addEvent=t,c.matchesEvent=function(){return!0},window.Gator=c}(),function(){var t,e;t=function(t,e){return t.classList.contains("in")?(t.style.height=getComputedStyle(t).height,t.offsetHeight,t.classList.add("js-collapsing"),t.classList.remove("js-collapse","in"),t.setAttribute("aria-expanded",!1),e.classList.add("collapsed"),e.setAttribute("aria-expanded",!1),Gator(t).on("transitionend",function(t){return"height"===t.propertyName?(Gator(this).off("transitionend"),this.classList.remove("js-collapsing"),this.classList.add("js-collapse")):void 0}),t.style.height="0"):void 0},e=function(t,e){return t.classList.contains("in")?void 0:(t.classList.remove("js-collapse"),t.classList.add("js-collapsing"),t.style.height="0",t.setAttribute("aria-expanded",!0),e.classList.remove("js-collapsed"),e.setAttribute("aria-expanded",!0),Gator(t).on("transitionend",function(t){return"height"===t.propertyName?(Gator(this).off("transitionend"),this.classList.remove("js-collapsing"),this.classList.add("js-collapse","in"),this.style.height=""):void 0}),t.style.height=t.scrollHeight+"px")},Gator(document).on("click","[data-toggle]",function(){var i;return i=this.nextSibling,i.classList.contains("in")?t(i,this):e(i,this)})}.call(this);