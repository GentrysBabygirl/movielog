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
!function(){function t(t,e,n){var i="blur"==e||"focus"==e;t.element.addEventListener(e,n,i)}function e(t){t.preventDefault(),t.stopPropagation()}function n(t){return l?l:l=t.matches?t.matches:t.webkitMatchesSelector?t.webkitMatchesSelector:t.mozMatchesSelector?t.mozMatchesSelector:t.msMatchesSelector?t.msMatchesSelector:t.oMatchesSelector?t.oMatchesSelector:c.matchesSelector}function i(t,e,o){if("_root"==e)return o;if(t!==o)return n(t).call(t,e)?t:t.parentNode?(d++,i(t.parentNode,e,o)):void 0}function o(t,e,n,i){u[t.id]||(u[t.id]={}),u[t.id][e]||(u[t.id][e]={}),u[t.id][e][n]||(u[t.id][e][n]=[]),u[t.id][e][n].push(i)}function r(t,e,n,i){if(u[t.id])if(e){if(!i&&!n)return void(u[t.id][e]={});if(!i)return void delete u[t.id][e][n];if(u[t.id][e][n])for(var o=0;o<u[t.id][e][n].length;o++)if(u[t.id][e][n][o]===i){u[t.id][e][n].splice(o,1);break}}else for(var r in u[t.id])u[t.id].hasOwnProperty(r)&&(u[t.id][r]={})}function s(t,e,n){if(u[t][n]){var o,r,s=e.target||e.srcElement,a={},l=0,f=0;d=0;for(o in u[t][n])u[t][n].hasOwnProperty(o)&&(r=i(s,o,h[t].element),r&&c.matchesEvent(n,h[t].element,r,"_root"==o,e)&&(d++,u[t][n][o].match=r,a[d]=u[t][n][o]));for(e.stopPropagation=function(){e.cancelBubble=!0},l=0;d>=l;l++)if(a[l])for(f=0;f<a[l].length;f++){if(a[l][f].call(a[l].match,e)===!1)return void c.cancel(e);if(e.cancelBubble)return}}}function a(t,e,n,i){function a(t){return function(e){s(d,e,t)}}if(this.element){t instanceof Array||(t=[t]),n||"function"!=typeof e||(n=e,e="_root");var l,d=this.id;for(l=0;l<t.length;l++)i?r(this,t[l],e,n):(u[d]&&u[d][t[l]]||c.addEvent(this,t[l],a(t[l])),o(this,t[l],e,n));return this}}function c(t,e){if(!(this instanceof c)){for(var n in h)if(h[n].element===t)return h[n];return f++,h[f]=new c(t,f),h[f]}this.element=t,this.id=e}var l,d=0,f=0,u={},h={};c.prototype.on=function(t,e,n){return a.call(this,t,e,n)},c.prototype.off=function(t,e,n){return a.call(this,t,e,n,!0)},c.matchesSelector=function(){},c.cancel=e,c.addEvent=t,c.matchesEvent=function(){return!0},window.Gator=c}(),function(){var t,e;t=function(t,e){return t.classList.contains("js-collapsed")?void 0:(t.classList.add("js-collapsing","js-collapsed"),t.setAttribute("aria-expanded",!1),e.setAttribute("aria-expanded",!1),Gator(t).on("transitionend",function(t){return"height"===t.propertyName?(Gator(this).off("transitionend"),this.classList.remove("js-collapsing")):void 0}))},e=function(t,e){return t.classList.contains("js-collapsed")?(t.classList.add("js-collapsing"),t.classList.remove("js-collapsed"),t.setAttribute("aria-expanded",!0),e.setAttribute("aria-expanded",!0),Gator(t).on("transitionend",function(t){return"height"===t.propertyName?(Gator(this).off("transitionend"),this.classList.remove("js-collapsing")):void 0})):void 0},Gator(document).on("click","[data-toggle]",function(){var n;return n=this.nextSibling,n.classList.contains("js-collapsing")?void 0:n.classList.contains("js-collapsed")?e(n,this):t(n,this)})}.call(this);