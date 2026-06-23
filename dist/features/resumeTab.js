"use strict";var __morbis_feature=(()=>{var Iy=Object.create;var fi=Object.defineProperty;var wy=Object.getOwnPropertyDescriptor;var Ry=Object.getOwnPropertyNames;var Ay=Object.getPrototypeOf,Ty=Object.prototype.hasOwnProperty;var la=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(a){throw t=0,a}};var nm=(e,t,a,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Ry(t))!Ty.call(e,o)&&o!==a&&fi(e,o,{get:()=>t[o],enumerable:!(l=wy(t,o))||l.enumerable});return e};var A=(e,t,a)=>(a=e!=null?Iy(Ay(e)):{},nm(t||!e||!e.__esModule?fi(a,"default",{value:e,enumerable:!0}):a,e)),My=e=>nm(fi({},"__esModule",{value:!0}),e);var gm=la(be=>{"use strict";function pi(e,t){var a=e.length;e.push(t);e:for(;0<a;){var l=a-1>>>1,o=e[l];if(0<Nn(o,t))e[l]=t,e[a]=o,a=l;else break e}}function oa(e){return e.length===0?null:e[0]}function Un(e){if(e.length===0)return null;var t=e[0],a=e.pop();if(a!==t){e[0]=a;e:for(var l=0,o=e.length,u=o>>>1;l<u;){var n=2*(l+1)-1,r=e[n],s=n+1,i=e[s];if(0>Nn(r,a))s<o&&0>Nn(i,r)?(e[l]=i,e[s]=a,l=s):(e[l]=r,e[n]=a,l=n);else if(s<o&&0>Nn(i,a))e[l]=i,e[s]=a,l=s;else break e}}return t}function Nn(e,t){var a=e.sortIndex-t.sortIndex;return a!==0?a:e.id-t.id}be.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(rm=performance,be.unstable_now=function(){return rm.now()}):(ci=Date,sm=ci.now(),be.unstable_now=function(){return ci.now()-sm});var rm,ci,sm,va=[],ja=[],Dy=1,Mt=null,et=3,hi=!1,yu=!1,Cu=!1,gi=!1,cm=typeof setTimeout=="function"?setTimeout:null,dm=typeof clearTimeout=="function"?clearTimeout:null,im=typeof setImmediate<"u"?setImmediate:null;function zn(e){for(var t=oa(ja);t!==null;){if(t.callback===null)Un(ja);else if(t.startTime<=e)Un(ja),t.sortIndex=t.expirationTime,pi(va,t);else break;t=oa(ja)}}function xi(e){if(Cu=!1,zn(e),!yu)if(oa(va)!==null)yu=!0,ho||(ho=!0,po());else{var t=oa(ja);t!==null&&Li(xi,t.startTime-e)}}var ho=!1,bu=-1,mm=5,pm=-1;function hm(){return gi?!0:!(be.unstable_now()-pm<mm)}function di(){if(gi=!1,ho){var e=be.unstable_now();pm=e;var t=!0;try{e:{yu=!1,Cu&&(Cu=!1,dm(bu),bu=-1),hi=!0;var a=et;try{t:{for(zn(e),Mt=oa(va);Mt!==null&&!(Mt.expirationTime>e&&hm());){var l=Mt.callback;if(typeof l=="function"){Mt.callback=null,et=Mt.priorityLevel;var o=l(Mt.expirationTime<=e);if(e=be.unstable_now(),typeof o=="function"){Mt.callback=o,zn(e),t=!0;break t}Mt===oa(va)&&Un(va),zn(e)}else Un(va);Mt=oa(va)}if(Mt!==null)t=!0;else{var u=oa(ja);u!==null&&Li(xi,u.startTime-e),t=!1}}break e}finally{Mt=null,et=a,hi=!1}t=void 0}}finally{t?po():ho=!1}}}var po;typeof im=="function"?po=function(){im(di)}:typeof MessageChannel<"u"?(mi=new MessageChannel,fm=mi.port2,mi.port1.onmessage=di,po=function(){fm.postMessage(null)}):po=function(){cm(di,0)};var mi,fm;function Li(e,t){bu=cm(function(){e(be.unstable_now())},t)}be.unstable_IdlePriority=5;be.unstable_ImmediatePriority=1;be.unstable_LowPriority=4;be.unstable_NormalPriority=3;be.unstable_Profiling=null;be.unstable_UserBlockingPriority=2;be.unstable_cancelCallback=function(e){e.callback=null};be.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):mm=0<e?Math.floor(1e3/e):5};be.unstable_getCurrentPriorityLevel=function(){return et};be.unstable_next=function(e){switch(et){case 1:case 2:case 3:var t=3;break;default:t=et}var a=et;et=t;try{return e()}finally{et=a}};be.unstable_requestPaint=function(){gi=!0};be.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var a=et;et=e;try{return t()}finally{et=a}};be.unstable_scheduleCallback=function(e,t,a){var l=be.unstable_now();switch(typeof a=="object"&&a!==null?(a=a.delay,a=typeof a=="number"&&0<a?l+a:l):a=l,e){case 1:var o=-1;break;case 2:o=250;break;case 5:o=1073741823;break;case 4:o=1e4;break;default:o=5e3}return o=a+o,e={id:Dy++,callback:t,priorityLevel:e,startTime:a,expirationTime:o,sortIndex:-1},a>l?(e.sortIndex=a,pi(ja,e),oa(va)===null&&e===oa(ja)&&(Cu?(dm(bu),bu=-1):Cu=!0,Li(xi,a-l))):(e.sortIndex=o,pi(va,e),yu||hi||(yu=!0,ho||(ho=!0,po()))),e};be.unstable_shouldYield=hm;be.unstable_wrapCallback=function(e){var t=et;return function(){var a=et;et=t;try{return e.apply(this,arguments)}finally{et=a}}}});var Lm=la(($R,xm)=>{"use strict";xm.exports=gm()});var Mm=la(_=>{"use strict";var yi=Symbol.for("react.transitional.element"),ky=Symbol.for("react.portal"),Ey=Symbol.for("react.fragment"),Oy=Symbol.for("react.strict_mode"),By=Symbol.for("react.profiler"),Py=Symbol.for("react.consumer"),Ny=Symbol.for("react.context"),zy=Symbol.for("react.forward_ref"),Uy=Symbol.for("react.suspense"),Hy=Symbol.for("react.memo"),bm=Symbol.for("react.lazy"),_y=Symbol.for("react.activity"),Sm=Symbol.iterator;function qy(e){return e===null||typeof e!="object"?null:(e=Sm&&e[Sm]||e["@@iterator"],typeof e=="function"?e:null)}var Im={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},wm=Object.assign,Rm={};function xo(e,t,a){this.props=e,this.context=t,this.refs=Rm,this.updater=a||Im}xo.prototype.isReactComponent={};xo.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};xo.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Am(){}Am.prototype=xo.prototype;function Ci(e,t,a){this.props=e,this.context=t,this.refs=Rm,this.updater=a||Im}var bi=Ci.prototype=new Am;bi.constructor=Ci;wm(bi,xo.prototype);bi.isPureReactComponent=!0;var vm=Array.isArray;function vi(){}var Le={H:null,A:null,T:null,S:null},Tm=Object.prototype.hasOwnProperty;function Ii(e,t,a){var l=a.ref;return{$$typeof:yi,type:e,key:t,ref:l!==void 0?l:null,props:a}}function Fy(e,t){return Ii(e.type,t,e.props)}function wi(e){return typeof e=="object"&&e!==null&&e.$$typeof===yi}function Gy(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(a){return t[a]})}var ym=/\/+/g;function Si(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Gy(""+e.key):t.toString(36)}function Vy(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(vi,vi):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function go(e,t,a,l,o){var u=typeof e;(u==="undefined"||u==="boolean")&&(e=null);var n=!1;if(e===null)n=!0;else switch(u){case"bigint":case"string":case"number":n=!0;break;case"object":switch(e.$$typeof){case yi:case ky:n=!0;break;case bm:return n=e._init,go(n(e._payload),t,a,l,o)}}if(n)return o=o(e),n=l===""?"."+Si(e,0):l,vm(o)?(a="",n!=null&&(a=n.replace(ym,"$&/")+"/"),go(o,t,a,"",function(i){return i})):o!=null&&(wi(o)&&(o=Fy(o,a+(o.key==null||e&&e.key===o.key?"":(""+o.key).replace(ym,"$&/")+"/")+n)),t.push(o)),1;n=0;var r=l===""?".":l+":";if(vm(e))for(var s=0;s<e.length;s++)l=e[s],u=r+Si(l,s),n+=go(l,t,a,u,o);else if(s=qy(e),typeof s=="function")for(e=s.call(e),s=0;!(l=e.next()).done;)l=l.value,u=r+Si(l,s++),n+=go(l,t,a,u,o);else if(u==="object"){if(typeof e.then=="function")return go(Vy(e),t,a,l,o);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return n}function Hn(e,t,a){if(e==null)return e;var l=[],o=0;return go(e,l,"","",function(u){return t.call(a,u,o++)}),l}function Xy(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(a){(e._status===0||e._status===-1)&&(e._status=1,e._result=a)},function(a){(e._status===0||e._status===-1)&&(e._status=2,e._result=a)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Cm=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},jy={map:Hn,forEach:function(e,t,a){Hn(e,function(){t.apply(this,arguments)},a)},count:function(e){var t=0;return Hn(e,function(){t++}),t},toArray:function(e){return Hn(e,function(t){return t})||[]},only:function(e){if(!wi(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};_.Activity=_y;_.Children=jy;_.Component=xo;_.Fragment=Ey;_.Profiler=By;_.PureComponent=Ci;_.StrictMode=Oy;_.Suspense=Uy;_.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Le;_.__COMPILER_RUNTIME={__proto__:null,c:function(e){return Le.H.useMemoCache(e)}};_.cache=function(e){return function(){return e.apply(null,arguments)}};_.cacheSignal=function(){return null};_.cloneElement=function(e,t,a){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var l=wm({},e.props),o=e.key;if(t!=null)for(u in t.key!==void 0&&(o=""+t.key),t)!Tm.call(t,u)||u==="key"||u==="__self"||u==="__source"||u==="ref"&&t.ref===void 0||(l[u]=t[u]);var u=arguments.length-2;if(u===1)l.children=a;else if(1<u){for(var n=Array(u),r=0;r<u;r++)n[r]=arguments[r+2];l.children=n}return Ii(e.type,o,l)};_.createContext=function(e){return e={$$typeof:Ny,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:Py,_context:e},e};_.createElement=function(e,t,a){var l,o={},u=null;if(t!=null)for(l in t.key!==void 0&&(u=""+t.key),t)Tm.call(t,l)&&l!=="key"&&l!=="__self"&&l!=="__source"&&(o[l]=t[l]);var n=arguments.length-2;if(n===1)o.children=a;else if(1<n){for(var r=Array(n),s=0;s<n;s++)r[s]=arguments[s+2];o.children=r}if(e&&e.defaultProps)for(l in n=e.defaultProps,n)o[l]===void 0&&(o[l]=n[l]);return Ii(e,u,o)};_.createRef=function(){return{current:null}};_.forwardRef=function(e){return{$$typeof:zy,render:e}};_.isValidElement=wi;_.lazy=function(e){return{$$typeof:bm,_payload:{_status:-1,_result:e},_init:Xy}};_.memo=function(e,t){return{$$typeof:Hy,type:e,compare:t===void 0?null:t}};_.startTransition=function(e){var t=Le.T,a={};Le.T=a;try{var l=e(),o=Le.S;o!==null&&o(a,l),typeof l=="object"&&l!==null&&typeof l.then=="function"&&l.then(vi,Cm)}catch(u){Cm(u)}finally{t!==null&&a.types!==null&&(t.types=a.types),Le.T=t}};_.unstable_useCacheRefresh=function(){return Le.H.useCacheRefresh()};_.use=function(e){return Le.H.use(e)};_.useActionState=function(e,t,a){return Le.H.useActionState(e,t,a)};_.useCallback=function(e,t){return Le.H.useCallback(e,t)};_.useContext=function(e){return Le.H.useContext(e)};_.useDebugValue=function(){};_.useDeferredValue=function(e,t){return Le.H.useDeferredValue(e,t)};_.useEffect=function(e,t){return Le.H.useEffect(e,t)};_.useEffectEvent=function(e){return Le.H.useEffectEvent(e)};_.useId=function(){return Le.H.useId()};_.useImperativeHandle=function(e,t,a){return Le.H.useImperativeHandle(e,t,a)};_.useInsertionEffect=function(e,t){return Le.H.useInsertionEffect(e,t)};_.useLayoutEffect=function(e,t){return Le.H.useLayoutEffect(e,t)};_.useMemo=function(e,t){return Le.H.useMemo(e,t)};_.useOptimistic=function(e,t){return Le.H.useOptimistic(e,t)};_.useReducer=function(e,t,a){return Le.H.useReducer(e,t,a)};_.useRef=function(e){return Le.H.useRef(e)};_.useState=function(e){return Le.H.useState(e)};_.useSyncExternalStore=function(e,t,a){return Le.H.useSyncExternalStore(e,t,a)};_.useTransition=function(){return Le.H.useTransition()};_.version="19.2.7"});var P=la((tA,Dm)=>{"use strict";Dm.exports=Mm()});var Em=la(ot=>{"use strict";var Yy=P();function km(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Ya(){}var lt={d:{f:Ya,r:function(){throw Error(km(522))},D:Ya,C:Ya,L:Ya,m:Ya,X:Ya,S:Ya,M:Ya},p:0,findDOMNode:null},Zy=Symbol.for("react.portal");function Ky(e,t,a){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Zy,key:l==null?null:""+l,children:e,containerInfo:t,implementation:a}}var Iu=Yy.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function _n(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}ot.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=lt;ot.createPortal=function(e,t){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(km(299));return Ky(e,t,null,a)};ot.flushSync=function(e){var t=Iu.T,a=lt.p;try{if(Iu.T=null,lt.p=2,e)return e()}finally{Iu.T=t,lt.p=a,lt.d.f()}};ot.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,lt.d.C(e,t))};ot.prefetchDNS=function(e){typeof e=="string"&&lt.d.D(e)};ot.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var a=t.as,l=_n(a,t.crossOrigin),o=typeof t.integrity=="string"?t.integrity:void 0,u=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;a==="style"?lt.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:l,integrity:o,fetchPriority:u}):a==="script"&&lt.d.X(e,{crossOrigin:l,integrity:o,fetchPriority:u,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};ot.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var a=_n(t.as,t.crossOrigin);lt.d.M(e,{crossOrigin:a,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&lt.d.M(e)};ot.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var a=t.as,l=_n(a,t.crossOrigin);lt.d.L(e,a,{crossOrigin:l,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};ot.preloadModule=function(e,t){if(typeof e=="string")if(t){var a=_n(t.as,t.crossOrigin);lt.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:a,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else lt.d.m(e)};ot.requestFormReset=function(e){lt.d.r(e)};ot.unstable_batchedUpdates=function(e,t){return e(t)};ot.useFormState=function(e,t,a){return Iu.H.useFormState(e,t,a)};ot.useFormStatus=function(){return Iu.H.useHostTransitionStatus()};ot.version="19.2.7"});var Lo=la((lA,Bm)=>{"use strict";function Om(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Om)}catch(e){console.error(e)}}Om(),Bm.exports=Em()});var jx=la(cs=>{"use strict";var _e=Lm(),nh=P(),Qy=Lo();function I(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function rh(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function cn(e){var t=e,a=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(a=t.return),e=t.return;while(e)}return t.tag===3?a:null}function sh(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function ih(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Pm(e){if(cn(e)!==e)throw Error(I(188))}function Wy(e){var t=e.alternate;if(!t){if(t=cn(e),t===null)throw Error(I(188));return t!==e?null:e}for(var a=e,l=t;;){var o=a.return;if(o===null)break;var u=o.alternate;if(u===null){if(l=o.return,l!==null){a=l;continue}break}if(o.child===u.child){for(u=o.child;u;){if(u===a)return Pm(o),e;if(u===l)return Pm(o),t;u=u.sibling}throw Error(I(188))}if(a.return!==l.return)a=o,l=u;else{for(var n=!1,r=o.child;r;){if(r===a){n=!0,a=o,l=u;break}if(r===l){n=!0,l=o,a=u;break}r=r.sibling}if(!n){for(r=u.child;r;){if(r===a){n=!0,a=u,l=o;break}if(r===l){n=!0,l=u,a=o;break}r=r.sibling}if(!n)throw Error(I(189))}}if(a.alternate!==l)throw Error(I(190))}if(a.tag!==3)throw Error(I(188));return a.stateNode.current===a?e:t}function fh(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=fh(e),t!==null)return t;e=e.sibling}return null}var ye=Object.assign,Jy=Symbol.for("react.element"),qn=Symbol.for("react.transitional.element"),Eu=Symbol.for("react.portal"),Io=Symbol.for("react.fragment"),ch=Symbol.for("react.strict_mode"),uf=Symbol.for("react.profiler"),dh=Symbol.for("react.consumer"),Ta=Symbol.for("react.context"),tc=Symbol.for("react.forward_ref"),nf=Symbol.for("react.suspense"),rf=Symbol.for("react.suspense_list"),ac=Symbol.for("react.memo"),Za=Symbol.for("react.lazy"),sf=Symbol.for("react.activity"),$y=Symbol.for("react.memo_cache_sentinel"),Nm=Symbol.iterator;function wu(e){return e===null||typeof e!="object"?null:(e=Nm&&e[Nm]||e["@@iterator"],typeof e=="function"?e:null)}var eC=Symbol.for("react.client.reference");function ff(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===eC?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Io:return"Fragment";case uf:return"Profiler";case ch:return"StrictMode";case nf:return"Suspense";case rf:return"SuspenseList";case sf:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case Eu:return"Portal";case Ta:return e.displayName||"Context";case dh:return(e._context.displayName||"Context")+".Consumer";case tc:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ac:return t=e.displayName||null,t!==null?t:ff(e.type)||"Memo";case Za:t=e._payload,e=e._init;try{return ff(e(t))}catch{}}return null}var Ou=Array.isArray,N=nh.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,le=Qy.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Bl={pending:!1,data:null,method:null,action:null},cf=[],wo=-1;function ia(e){return{current:e}}function Ve(e){0>wo||(e.current=cf[wo],cf[wo]=null,wo--)}function he(e,t){wo++,cf[wo]=e.current,e.current=t}var sa=ia(null),Qu=ia(null),ul=ia(null),vr=ia(null);function yr(e,t){switch(he(ul,t),he(Qu,e),he(sa,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Gp(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Gp(t),e=Ex(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Ve(sa),he(sa,e)}function Go(){Ve(sa),Ve(Qu),Ve(ul)}function df(e){e.memoizedState!==null&&he(vr,e);var t=sa.current,a=Ex(t,e.type);t!==a&&(he(Qu,e),he(sa,a))}function Cr(e){Qu.current===e&&(Ve(sa),Ve(Qu)),vr.current===e&&(Ve(vr),rn._currentValue=Bl)}var Ri,zm;function Dl(e){if(Ri===void 0)try{throw Error()}catch(a){var t=a.stack.trim().match(/\n( *(at )?)/);Ri=t&&t[1]||"",zm=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ri+e+zm}var Ai=!1;function Ti(e,t){if(!e||Ai)return"";Ai=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var d=function(){throw Error()};if(Object.defineProperty(d.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(d,[])}catch(p){var m=p}Reflect.construct(e,[],d)}else{try{d.call()}catch(p){m=p}e.call(d.prototype)}}else{try{throw Error()}catch(p){m=p}(d=e())&&typeof d.catch=="function"&&d.catch(function(){})}}catch(p){if(p&&m&&typeof p.stack=="string")return[p.stack,m.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var o=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");o&&o.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var u=l.DetermineComponentFrameRoot(),n=u[0],r=u[1];if(n&&r){var s=n.split(`
`),i=r.split(`
`);for(o=l=0;l<s.length&&!s[l].includes("DetermineComponentFrameRoot");)l++;for(;o<i.length&&!i[o].includes("DetermineComponentFrameRoot");)o++;if(l===s.length||o===i.length)for(l=s.length-1,o=i.length-1;1<=l&&0<=o&&s[l]!==i[o];)o--;for(;1<=l&&0<=o;l--,o--)if(s[l]!==i[o]){if(l!==1||o!==1)do if(l--,o--,0>o||s[l]!==i[o]){var c=`
`+s[l].replace(" at new "," at ");return e.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",e.displayName)),c}while(1<=l&&0<=o);break}}}finally{Ai=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?Dl(a):""}function tC(e,t){switch(e.tag){case 26:case 27:case 5:return Dl(e.type);case 16:return Dl("Lazy");case 13:return e.child!==t&&t!==null?Dl("Suspense Fallback"):Dl("Suspense");case 19:return Dl("SuspenseList");case 0:case 15:return Ti(e.type,!1);case 11:return Ti(e.type.render,!1);case 1:return Ti(e.type,!0);case 31:return Dl("Activity");default:return""}}function Um(e){try{var t="",a=null;do t+=tC(e,a),a=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var mf=Object.prototype.hasOwnProperty,lc=_e.unstable_scheduleCallback,Mi=_e.unstable_cancelCallback,aC=_e.unstable_shouldYield,lC=_e.unstable_requestPaint,Ct=_e.unstable_now,oC=_e.unstable_getCurrentPriorityLevel,mh=_e.unstable_ImmediatePriority,ph=_e.unstable_UserBlockingPriority,br=_e.unstable_NormalPriority,uC=_e.unstable_LowPriority,hh=_e.unstable_IdlePriority,nC=_e.log,rC=_e.unstable_setDisableYieldValue,dn=null,bt=null;function el(e){if(typeof nC=="function"&&rC(e),bt&&typeof bt.setStrictMode=="function")try{bt.setStrictMode(dn,e)}catch{}}var It=Math.clz32?Math.clz32:fC,sC=Math.log,iC=Math.LN2;function fC(e){return e>>>=0,e===0?32:31-(sC(e)/iC|0)|0}var Fn=256,Gn=262144,Vn=4194304;function kl(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Kr(e,t,a){var l=e.pendingLanes;if(l===0)return 0;var o=0,u=e.suspendedLanes,n=e.pingedLanes;e=e.warmLanes;var r=l&134217727;return r!==0?(l=r&~u,l!==0?o=kl(l):(n&=r,n!==0?o=kl(n):a||(a=r&~e,a!==0&&(o=kl(a))))):(r=l&~u,r!==0?o=kl(r):n!==0?o=kl(n):a||(a=l&~e,a!==0&&(o=kl(a)))),o===0?0:t!==0&&t!==o&&(t&u)===0&&(u=o&-o,a=t&-t,u>=a||u===32&&(a&4194048)!==0)?t:o}function mn(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function cC(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function gh(){var e=Vn;return Vn<<=1,(Vn&62914560)===0&&(Vn=4194304),e}function Di(e){for(var t=[],a=0;31>a;a++)t.push(e);return t}function pn(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function dC(e,t,a,l,o,u){var n=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var r=e.entanglements,s=e.expirationTimes,i=e.hiddenUpdates;for(a=n&~a;0<a;){var c=31-It(a),d=1<<c;r[c]=0,s[c]=-1;var m=i[c];if(m!==null)for(i[c]=null,c=0;c<m.length;c++){var p=m[c];p!==null&&(p.lane&=-536870913)}a&=~d}l!==0&&xh(e,l,0),u!==0&&o===0&&e.tag!==0&&(e.suspendedLanes|=u&~(n&~t))}function xh(e,t,a){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-It(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|a&261930}function Lh(e,t){var a=e.entangledLanes|=t;for(e=e.entanglements;a;){var l=31-It(a),o=1<<l;o&t|e[l]&t&&(e[l]|=t),a&=~o}}function Sh(e,t){var a=t&-t;return a=(a&42)!==0?1:oc(a),(a&(e.suspendedLanes|t))!==0?0:a}function oc(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function uc(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function vh(){var e=le.p;return e!==0?e:(e=window.event,e===void 0?32:Gx(e.type))}function Hm(e,t){var a=le.p;try{return le.p=e,t()}finally{le.p=a}}var Ll=Math.random().toString(36).slice(2),Ye="__reactFiber$"+Ll,dt="__reactProps$"+Ll,eu="__reactContainer$"+Ll,pf="__reactEvents$"+Ll,mC="__reactListeners$"+Ll,pC="__reactHandles$"+Ll,_m="__reactResources$"+Ll,hn="__reactMarker$"+Ll;function nc(e){delete e[Ye],delete e[dt],delete e[pf],delete e[mC],delete e[pC]}function Ro(e){var t=e[Ye];if(t)return t;for(var a=e.parentNode;a;){if(t=a[eu]||a[Ye]){if(a=t.alternate,t.child!==null||a!==null&&a.child!==null)for(e=Zp(e);e!==null;){if(a=e[Ye])return a;e=Zp(e)}return t}e=a,a=e.parentNode}return null}function tu(e){if(e=e[Ye]||e[eu]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Bu(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(I(33))}function No(e){var t=e[_m];return t||(t=e[_m]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function Ge(e){e[hn]=!0}var yh=new Set,Ch={};function Vl(e,t){Vo(e,t),Vo(e+"Capture",t)}function Vo(e,t){for(Ch[e]=t,e=0;e<t.length;e++)yh.add(t[e])}var hC=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),qm={},Fm={};function gC(e){return mf.call(Fm,e)?!0:mf.call(qm,e)?!1:hC.test(e)?Fm[e]=!0:(qm[e]=!0,!1)}function ur(e,t,a){if(gC(t))if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+a)}}function Xn(e,t,a){if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+a)}}function ya(e,t,a,l){if(l===null)e.removeAttribute(a);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(t,a,""+l)}}function kt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function bh(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function xC(e,t,a){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var o=l.get,u=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(n){a=""+n,u.call(this,n)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return a},setValue:function(n){a=""+n},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function hf(e){if(!e._valueTracker){var t=bh(e)?"checked":"value";e._valueTracker=xC(e,t,""+e[t])}}function Ih(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var a=t.getValue(),l="";return e&&(l=bh(e)?e.checked?"true":"false":e.value),e=l,e!==a?(t.setValue(e),!0):!1}function Ir(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var LC=/[\n"\\]/g;function Bt(e){return e.replace(LC,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function gf(e,t,a,l,o,u,n,r){e.name="",n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"?e.type=n:e.removeAttribute("type"),t!=null?n==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+kt(t)):e.value!==""+kt(t)&&(e.value=""+kt(t)):n!=="submit"&&n!=="reset"||e.removeAttribute("value"),t!=null?xf(e,n,kt(t)):a!=null?xf(e,n,kt(a)):l!=null&&e.removeAttribute("value"),o==null&&u!=null&&(e.defaultChecked=!!u),o!=null&&(e.checked=o&&typeof o!="function"&&typeof o!="symbol"),r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.name=""+kt(r):e.removeAttribute("name")}function wh(e,t,a,l,o,u,n,r){if(u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(e.type=u),t!=null||a!=null){if(!(u!=="submit"&&u!=="reset"||t!=null)){hf(e);return}a=a!=null?""+kt(a):"",t=t!=null?""+kt(t):a,r||t===e.value||(e.value=t),e.defaultValue=t}l=l??o,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=r?e.checked:!!l,e.defaultChecked=!!l,n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(e.name=n),hf(e)}function xf(e,t,a){t==="number"&&Ir(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function zo(e,t,a,l){if(e=e.options,t){t={};for(var o=0;o<a.length;o++)t["$"+a[o]]=!0;for(a=0;a<e.length;a++)o=t.hasOwnProperty("$"+e[a].value),e[a].selected!==o&&(e[a].selected=o),o&&l&&(e[a].defaultSelected=!0)}else{for(a=""+kt(a),t=null,o=0;o<e.length;o++){if(e[o].value===a){e[o].selected=!0,l&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function Rh(e,t,a){if(t!=null&&(t=""+kt(t),t!==e.value&&(e.value=t),a==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=a!=null?""+kt(a):""}function Ah(e,t,a,l){if(t==null){if(l!=null){if(a!=null)throw Error(I(92));if(Ou(l)){if(1<l.length)throw Error(I(93));l=l[0]}a=l}a==null&&(a=""),t=a}a=kt(t),e.defaultValue=a,l=e.textContent,l===a&&l!==""&&l!==null&&(e.value=l),hf(e)}function Xo(e,t){if(t){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=t;return}}e.textContent=t}var SC=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Gm(e,t,a){var l=t.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,a):typeof a!="number"||a===0||SC.has(t)?t==="float"?e.cssFloat=a:e[t]=(""+a).trim():e[t]=a+"px"}function Th(e,t,a){if(t!=null&&typeof t!="object")throw Error(I(62));if(e=e.style,a!=null){for(var l in a)!a.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var o in t)l=t[o],t.hasOwnProperty(o)&&a[o]!==l&&Gm(e,o,l)}else for(var u in t)t.hasOwnProperty(u)&&Gm(e,u,t[u])}function rc(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var vC=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),yC=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function nr(e){return yC.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Ma(){}var Lf=null;function sc(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ao=null,Uo=null;function Vm(e){var t=tu(e);if(t&&(e=t.stateNode)){var a=e[dt]||null;e:switch(e=t.stateNode,t.type){case"input":if(gf(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),t=a.name,a.type==="radio"&&t!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+Bt(""+t)+'"][type="radio"]'),t=0;t<a.length;t++){var l=a[t];if(l!==e&&l.form===e.form){var o=l[dt]||null;if(!o)throw Error(I(90));gf(l,o.value,o.defaultValue,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name)}}for(t=0;t<a.length;t++)l=a[t],l.form===e.form&&Ih(l)}break e;case"textarea":Rh(e,a.value,a.defaultValue);break e;case"select":t=a.value,t!=null&&zo(e,!!a.multiple,t,!1)}}}var ki=!1;function Mh(e,t,a){if(ki)return e(t,a);ki=!0;try{var l=e(t);return l}finally{if(ki=!1,(Ao!==null||Uo!==null)&&(rs(),Ao&&(t=Ao,e=Uo,Uo=Ao=null,Vm(t),e)))for(t=0;t<e.length;t++)Vm(e[t])}}function Wu(e,t){var a=e.stateNode;if(a===null)return null;var l=a[dt]||null;if(l===null)return null;a=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(I(231,t,typeof a));return a}var Ba=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Sf=!1;if(Ba)try{So={},Object.defineProperty(So,"passive",{get:function(){Sf=!0}}),window.addEventListener("test",So,So),window.removeEventListener("test",So,So)}catch{Sf=!1}var So,tl=null,ic=null,rr=null;function Dh(){if(rr)return rr;var e,t=ic,a=t.length,l,o="value"in tl?tl.value:tl.textContent,u=o.length;for(e=0;e<a&&t[e]===o[e];e++);var n=a-e;for(l=1;l<=n&&t[a-l]===o[u-l];l++);return rr=o.slice(e,1<l?1-l:void 0)}function sr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function jn(){return!0}function Xm(){return!1}function mt(e){function t(a,l,o,u,n){this._reactName=a,this._targetInst=o,this.type=l,this.nativeEvent=u,this.target=n,this.currentTarget=null;for(var r in e)e.hasOwnProperty(r)&&(a=e[r],this[r]=a?a(u):u[r]);return this.isDefaultPrevented=(u.defaultPrevented!=null?u.defaultPrevented:u.returnValue===!1)?jn:Xm,this.isPropagationStopped=Xm,this}return ye(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=jn)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=jn)},persist:function(){},isPersistent:jn}),t}var Xl={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Qr=mt(Xl),gn=ye({},Xl,{view:0,detail:0}),CC=mt(gn),Ei,Oi,Ru,Wr=ye({},gn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:fc,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ru&&(Ru&&e.type==="mousemove"?(Ei=e.screenX-Ru.screenX,Oi=e.screenY-Ru.screenY):Oi=Ei=0,Ru=e),Ei)},movementY:function(e){return"movementY"in e?e.movementY:Oi}}),jm=mt(Wr),bC=ye({},Wr,{dataTransfer:0}),IC=mt(bC),wC=ye({},gn,{relatedTarget:0}),Bi=mt(wC),RC=ye({},Xl,{animationName:0,elapsedTime:0,pseudoElement:0}),AC=mt(RC),TC=ye({},Xl,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),MC=mt(TC),DC=ye({},Xl,{data:0}),Ym=mt(DC),kC={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},EC={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},OC={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function BC(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=OC[e])?!!t[e]:!1}function fc(){return BC}var PC=ye({},gn,{key:function(e){if(e.key){var t=kC[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=sr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?EC[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:fc,charCode:function(e){return e.type==="keypress"?sr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?sr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),NC=mt(PC),zC=ye({},Wr,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Zm=mt(zC),UC=ye({},gn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:fc}),HC=mt(UC),_C=ye({},Xl,{propertyName:0,elapsedTime:0,pseudoElement:0}),qC=mt(_C),FC=ye({},Wr,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),GC=mt(FC),VC=ye({},Xl,{newState:0,oldState:0}),XC=mt(VC),jC=[9,13,27,32],cc=Ba&&"CompositionEvent"in window,zu=null;Ba&&"documentMode"in document&&(zu=document.documentMode);var YC=Ba&&"TextEvent"in window&&!zu,kh=Ba&&(!cc||zu&&8<zu&&11>=zu),Km=" ",Qm=!1;function Eh(e,t){switch(e){case"keyup":return jC.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Oh(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var To=!1;function ZC(e,t){switch(e){case"compositionend":return Oh(t);case"keypress":return t.which!==32?null:(Qm=!0,Km);case"textInput":return e=t.data,e===Km&&Qm?null:e;default:return null}}function KC(e,t){if(To)return e==="compositionend"||!cc&&Eh(e,t)?(e=Dh(),rr=ic=tl=null,To=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return kh&&t.locale!=="ko"?null:t.data;default:return null}}var QC={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Wm(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!QC[e.type]:t==="textarea"}function Bh(e,t,a,l){Ao?Uo?Uo.push(l):Uo=[l]:Ao=l,t=Fr(t,"onChange"),0<t.length&&(a=new Qr("onChange","change",null,a,l),e.push({event:a,listeners:t}))}var Uu=null,Ju=null;function WC(e){Mx(e,0)}function Jr(e){var t=Bu(e);if(Ih(t))return e}function Jm(e,t){if(e==="change")return t}var Ph=!1;Ba&&(Ba?(Zn="oninput"in document,Zn||(Pi=document.createElement("div"),Pi.setAttribute("oninput","return;"),Zn=typeof Pi.oninput=="function"),Yn=Zn):Yn=!1,Ph=Yn&&(!document.documentMode||9<document.documentMode));var Yn,Zn,Pi;function $m(){Uu&&(Uu.detachEvent("onpropertychange",Nh),Ju=Uu=null)}function Nh(e){if(e.propertyName==="value"&&Jr(Ju)){var t=[];Bh(t,Ju,e,sc(e)),Mh(WC,t)}}function JC(e,t,a){e==="focusin"?($m(),Uu=t,Ju=a,Uu.attachEvent("onpropertychange",Nh)):e==="focusout"&&$m()}function $C(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Jr(Ju)}function eb(e,t){if(e==="click")return Jr(t)}function tb(e,t){if(e==="input"||e==="change")return Jr(t)}function ab(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Rt=typeof Object.is=="function"?Object.is:ab;function $u(e,t){if(Rt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var a=Object.keys(e),l=Object.keys(t);if(a.length!==l.length)return!1;for(l=0;l<a.length;l++){var o=a[l];if(!mf.call(t,o)||!Rt(e[o],t[o]))return!1}return!0}function ep(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function tp(e,t){var a=ep(e);e=0;for(var l;a;){if(a.nodeType===3){if(l=e+a.textContent.length,e<=t&&l>=t)return{node:a,offset:t-e};e=l}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=ep(a)}}function zh(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?zh(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Uh(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Ir(e.document);t instanceof e.HTMLIFrameElement;){try{var a=typeof t.contentWindow.location.href=="string"}catch{a=!1}if(a)e=t.contentWindow;else break;t=Ir(e.document)}return t}function dc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var lb=Ba&&"documentMode"in document&&11>=document.documentMode,Mo=null,vf=null,Hu=null,yf=!1;function ap(e,t,a){var l=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;yf||Mo==null||Mo!==Ir(l)||(l=Mo,"selectionStart"in l&&dc(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Hu&&$u(Hu,l)||(Hu=l,l=Fr(vf,"onSelect"),0<l.length&&(t=new Qr("onSelect","select",null,t,a),e.push({event:t,listeners:l}),t.target=Mo)))}function Ml(e,t){var a={};return a[e.toLowerCase()]=t.toLowerCase(),a["Webkit"+e]="webkit"+t,a["Moz"+e]="moz"+t,a}var Do={animationend:Ml("Animation","AnimationEnd"),animationiteration:Ml("Animation","AnimationIteration"),animationstart:Ml("Animation","AnimationStart"),transitionrun:Ml("Transition","TransitionRun"),transitionstart:Ml("Transition","TransitionStart"),transitioncancel:Ml("Transition","TransitionCancel"),transitionend:Ml("Transition","TransitionEnd")},Ni={},Hh={};Ba&&(Hh=document.createElement("div").style,"AnimationEvent"in window||(delete Do.animationend.animation,delete Do.animationiteration.animation,delete Do.animationstart.animation),"TransitionEvent"in window||delete Do.transitionend.transition);function jl(e){if(Ni[e])return Ni[e];if(!Do[e])return e;var t=Do[e],a;for(a in t)if(t.hasOwnProperty(a)&&a in Hh)return Ni[e]=t[a];return e}var _h=jl("animationend"),qh=jl("animationiteration"),Fh=jl("animationstart"),ob=jl("transitionrun"),ub=jl("transitionstart"),nb=jl("transitioncancel"),Gh=jl("transitionend"),Vh=new Map,Cf="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Cf.push("scrollEnd");function Qt(e,t){Vh.set(e,t),Vl(t,[e])}var wr=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Dt=[],ko=0,mc=0;function $r(){for(var e=ko,t=mc=ko=0;t<e;){var a=Dt[t];Dt[t++]=null;var l=Dt[t];Dt[t++]=null;var o=Dt[t];Dt[t++]=null;var u=Dt[t];if(Dt[t++]=null,l!==null&&o!==null){var n=l.pending;n===null?o.next=o:(o.next=n.next,n.next=o),l.pending=o}u!==0&&Xh(a,o,u)}}function es(e,t,a,l){Dt[ko++]=e,Dt[ko++]=t,Dt[ko++]=a,Dt[ko++]=l,mc|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function pc(e,t,a,l){return es(e,t,a,l),Rr(e)}function Yl(e,t){return es(e,null,null,t),Rr(e)}function Xh(e,t,a){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a);for(var o=!1,u=e.return;u!==null;)u.childLanes|=a,l=u.alternate,l!==null&&(l.childLanes|=a),u.tag===22&&(e=u.stateNode,e===null||e._visibility&1||(o=!0)),e=u,u=u.return;return e.tag===3?(u=e.stateNode,o&&t!==null&&(o=31-It(a),e=u.hiddenUpdates,l=e[o],l===null?e[o]=[t]:l.push(t),t.lane=a|536870912),u):null}function Rr(e){if(50<Zu)throw Zu=0,Gf=null,Error(I(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Eo={};function rb(e,t,a,l){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function vt(e,t,a,l){return new rb(e,t,a,l)}function hc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function ka(e,t){var a=e.alternate;return a===null?(a=vt(e.tag,t,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=t,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,t=e.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function jh(e,t){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,t=a.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function ir(e,t,a,l,o,u){var n=0;if(l=e,typeof e=="function")hc(e)&&(n=1);else if(typeof e=="string")n=fI(e,a,sa.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case sf:return e=vt(31,a,t,o),e.elementType=sf,e.lanes=u,e;case Io:return Pl(a.children,o,u,t);case ch:n=8,o|=24;break;case uf:return e=vt(12,a,t,o|2),e.elementType=uf,e.lanes=u,e;case nf:return e=vt(13,a,t,o),e.elementType=nf,e.lanes=u,e;case rf:return e=vt(19,a,t,o),e.elementType=rf,e.lanes=u,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Ta:n=10;break e;case dh:n=9;break e;case tc:n=11;break e;case ac:n=14;break e;case Za:n=16,l=null;break e}n=29,a=Error(I(130,e===null?"null":typeof e,"")),l=null}return t=vt(n,a,t,o),t.elementType=e,t.type=l,t.lanes=u,t}function Pl(e,t,a,l){return e=vt(7,e,l,t),e.lanes=a,e}function zi(e,t,a){return e=vt(6,e,null,t),e.lanes=a,e}function Yh(e){var t=vt(18,null,null,0);return t.stateNode=e,t}function Ui(e,t,a){return t=vt(4,e.children!==null?e.children:[],e.key,t),t.lanes=a,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var lp=new WeakMap;function Pt(e,t){if(typeof e=="object"&&e!==null){var a=lp.get(e);return a!==void 0?a:(t={value:e,source:t,stack:Um(t)},lp.set(e,t),t)}return{value:e,source:t,stack:Um(t)}}var Oo=[],Bo=0,Ar=null,en=0,Et=[],Ot=0,pl=null,ua=1,na="";function Ra(e,t){Oo[Bo++]=en,Oo[Bo++]=Ar,Ar=e,en=t}function Zh(e,t,a){Et[Ot++]=ua,Et[Ot++]=na,Et[Ot++]=pl,pl=e;var l=ua;e=na;var o=32-It(l)-1;l&=~(1<<o),a+=1;var u=32-It(t)+o;if(30<u){var n=o-o%5;u=(l&(1<<n)-1).toString(32),l>>=n,o-=n,ua=1<<32-It(t)+o|a<<o|l,na=u+e}else ua=1<<u|a<<o|l,na=e}function gc(e){e.return!==null&&(Ra(e,1),Zh(e,1,0))}function xc(e){for(;e===Ar;)Ar=Oo[--Bo],Oo[Bo]=null,en=Oo[--Bo],Oo[Bo]=null;for(;e===pl;)pl=Et[--Ot],Et[Ot]=null,na=Et[--Ot],Et[Ot]=null,ua=Et[--Ot],Et[Ot]=null}function Kh(e,t){Et[Ot++]=ua,Et[Ot++]=na,Et[Ot++]=pl,ua=t.id,na=t.overflow,pl=e}var Ze=null,ve=null,J=!1,nl=null,Nt=!1,bf=Error(I(519));function hl(e){var t=Error(I(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw tn(Pt(t,e)),bf}function op(e){var t=e.stateNode,a=e.type,l=e.memoizedProps;switch(t[Ye]=e,t[dt]=l,a){case"dialog":j("cancel",t),j("close",t);break;case"iframe":case"object":case"embed":j("load",t);break;case"video":case"audio":for(a=0;a<un.length;a++)j(un[a],t);break;case"source":j("error",t);break;case"img":case"image":case"link":j("error",t),j("load",t);break;case"details":j("toggle",t);break;case"input":j("invalid",t),wh(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":j("invalid",t);break;case"textarea":j("invalid",t),Ah(t,l.value,l.defaultValue,l.children)}a=l.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||t.textContent===""+a||l.suppressHydrationWarning===!0||kx(t.textContent,a)?(l.popover!=null&&(j("beforetoggle",t),j("toggle",t)),l.onScroll!=null&&j("scroll",t),l.onScrollEnd!=null&&j("scrollend",t),l.onClick!=null&&(t.onclick=Ma),t=!0):t=!1,t||hl(e,!0)}function up(e){for(Ze=e.return;Ze;)switch(Ze.tag){case 5:case 31:case 13:Nt=!1;return;case 27:case 3:Nt=!0;return;default:Ze=Ze.return}}function vo(e){if(e!==Ze)return!1;if(!J)return up(e),J=!0,!1;var t=e.tag,a;if((a=t!==3&&t!==27)&&((a=t===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||Zf(e.type,e.memoizedProps)),a=!a),a&&ve&&hl(e),up(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(I(317));ve=Yp(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(I(317));ve=Yp(e)}else t===27?(t=ve,Sl(e.type)?(e=Jf,Jf=null,ve=e):ve=t):ve=Ze?Ut(e.stateNode.nextSibling):null;return!0}function Hl(){ve=Ze=null,J=!1}function Hi(){var e=nl;return e!==null&&(ft===null?ft=e:ft.push.apply(ft,e),nl=null),e}function tn(e){nl===null?nl=[e]:nl.push(e)}var If=ia(null),Zl=null,Da=null;function Qa(e,t,a){he(If,t._currentValue),t._currentValue=a}function Ea(e){e._currentValue=If.current,Ve(If)}function wf(e,t,a){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===a)break;e=e.return}}function Rf(e,t,a,l){var o=e.child;for(o!==null&&(o.return=e);o!==null;){var u=o.dependencies;if(u!==null){var n=o.child;u=u.firstContext;e:for(;u!==null;){var r=u;u=o;for(var s=0;s<t.length;s++)if(r.context===t[s]){u.lanes|=a,r=u.alternate,r!==null&&(r.lanes|=a),wf(u.return,a,e),l||(n=null);break e}u=r.next}}else if(o.tag===18){if(n=o.return,n===null)throw Error(I(341));n.lanes|=a,u=n.alternate,u!==null&&(u.lanes|=a),wf(n,a,e),n=null}else n=o.child;if(n!==null)n.return=o;else for(n=o;n!==null;){if(n===e){n=null;break}if(o=n.sibling,o!==null){o.return=n.return,n=o;break}n=n.return}o=n}}function au(e,t,a,l){e=null;for(var o=t,u=!1;o!==null;){if(!u){if((o.flags&524288)!==0)u=!0;else if((o.flags&262144)!==0)break}if(o.tag===10){var n=o.alternate;if(n===null)throw Error(I(387));if(n=n.memoizedProps,n!==null){var r=o.type;Rt(o.pendingProps.value,n.value)||(e!==null?e.push(r):e=[r])}}else if(o===vr.current){if(n=o.alternate,n===null)throw Error(I(387));n.memoizedState.memoizedState!==o.memoizedState.memoizedState&&(e!==null?e.push(rn):e=[rn])}o=o.return}e!==null&&Rf(t,e,a,l),t.flags|=262144}function Tr(e){for(e=e.firstContext;e!==null;){if(!Rt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function _l(e){Zl=e,Da=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ke(e){return Qh(Zl,e)}function Kn(e,t){return Zl===null&&_l(e),Qh(e,t)}function Qh(e,t){var a=t._currentValue;if(t={context:t,memoizedValue:a,next:null},Da===null){if(e===null)throw Error(I(308));Da=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Da=Da.next=t;return a}var sb=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(a,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(a){return a()})}},ib=_e.unstable_scheduleCallback,fb=_e.unstable_NormalPriority,Ne={$$typeof:Ta,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Lc(){return{controller:new sb,data:new Map,refCount:0}}function xn(e){e.refCount--,e.refCount===0&&ib(fb,function(){e.controller.abort()})}var _u=null,Af=0,jo=0,Ho=null;function cb(e,t){if(_u===null){var a=_u=[];Af=0,jo=Gc(),Ho={status:"pending",value:void 0,then:function(l){a.push(l)}}}return Af++,t.then(np,np),t}function np(){if(--Af===0&&_u!==null){Ho!==null&&(Ho.status="fulfilled");var e=_u;_u=null,jo=0,Ho=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function db(e,t){var a=[],l={status:"pending",value:null,reason:null,then:function(o){a.push(o)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var o=0;o<a.length;o++)(0,a[o])(t)},function(o){for(l.status="rejected",l.reason=o,o=0;o<a.length;o++)(0,a[o])(void 0)}),l}var rp=N.S;N.S=function(e,t){fx=Ct(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&cb(e,t),rp!==null&&rp(e,t)};var Nl=ia(null);function Sc(){var e=Nl.current;return e!==null?e:me.pooledCache}function fr(e,t){t===null?he(Nl,Nl.current):he(Nl,t.pool)}function Wh(){var e=Sc();return e===null?null:{parent:Ne._currentValue,pool:e}}var lu=Error(I(460)),vc=Error(I(474)),ts=Error(I(542)),Mr={then:function(){}};function sp(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Jh(e,t,a){switch(a=e[a],a===void 0?e.push(t):a!==t&&(t.then(Ma,Ma),t=a),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,fp(e),e;default:if(typeof t.status=="string")t.then(Ma,Ma);else{if(e=me,e!==null&&100<e.shellSuspendCounter)throw Error(I(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var o=t;o.status="fulfilled",o.value=l}},function(l){if(t.status==="pending"){var o=t;o.status="rejected",o.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,fp(e),e}throw zl=t,lu}}function El(e){try{var t=e._init;return t(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(zl=a,lu):a}}var zl=null;function ip(){if(zl===null)throw Error(I(459));var e=zl;return zl=null,e}function fp(e){if(e===lu||e===ts)throw Error(I(483))}var _o=null,an=0;function Qn(e){var t=an;return an+=1,_o===null&&(_o=[]),Jh(_o,e,t)}function Au(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Wn(e,t){throw t.$$typeof===Jy?Error(I(525)):(e=Object.prototype.toString.call(t),Error(I(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function $h(e){function t(h,f){if(e){var x=h.deletions;x===null?(h.deletions=[f],h.flags|=16):x.push(f)}}function a(h,f){if(!e)return null;for(;f!==null;)t(h,f),f=f.sibling;return null}function l(h){for(var f=new Map;h!==null;)h.key!==null?f.set(h.key,h):f.set(h.index,h),h=h.sibling;return f}function o(h,f){return h=ka(h,f),h.index=0,h.sibling=null,h}function u(h,f,x){return h.index=x,e?(x=h.alternate,x!==null?(x=x.index,x<f?(h.flags|=67108866,f):x):(h.flags|=67108866,f)):(h.flags|=1048576,f)}function n(h){return e&&h.alternate===null&&(h.flags|=67108866),h}function r(h,f,x,v){return f===null||f.tag!==6?(f=zi(x,h.mode,v),f.return=h,f):(f=o(f,x),f.return=h,f)}function s(h,f,x,v){var y=x.type;return y===Io?c(h,f,x.props.children,v,x.key):f!==null&&(f.elementType===y||typeof y=="object"&&y!==null&&y.$$typeof===Za&&El(y)===f.type)?(f=o(f,x.props),Au(f,x),f.return=h,f):(f=ir(x.type,x.key,x.props,null,h.mode,v),Au(f,x),f.return=h,f)}function i(h,f,x,v){return f===null||f.tag!==4||f.stateNode.containerInfo!==x.containerInfo||f.stateNode.implementation!==x.implementation?(f=Ui(x,h.mode,v),f.return=h,f):(f=o(f,x.children||[]),f.return=h,f)}function c(h,f,x,v,y){return f===null||f.tag!==7?(f=Pl(x,h.mode,v,y),f.return=h,f):(f=o(f,x),f.return=h,f)}function d(h,f,x){if(typeof f=="string"&&f!==""||typeof f=="number"||typeof f=="bigint")return f=zi(""+f,h.mode,x),f.return=h,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case qn:return x=ir(f.type,f.key,f.props,null,h.mode,x),Au(x,f),x.return=h,x;case Eu:return f=Ui(f,h.mode,x),f.return=h,f;case Za:return f=El(f),d(h,f,x)}if(Ou(f)||wu(f))return f=Pl(f,h.mode,x,null),f.return=h,f;if(typeof f.then=="function")return d(h,Qn(f),x);if(f.$$typeof===Ta)return d(h,Kn(h,f),x);Wn(h,f)}return null}function m(h,f,x,v){var y=f!==null?f.key:null;if(typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint")return y!==null?null:r(h,f,""+x,v);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case qn:return x.key===y?s(h,f,x,v):null;case Eu:return x.key===y?i(h,f,x,v):null;case Za:return x=El(x),m(h,f,x,v)}if(Ou(x)||wu(x))return y!==null?null:c(h,f,x,v,null);if(typeof x.then=="function")return m(h,f,Qn(x),v);if(x.$$typeof===Ta)return m(h,f,Kn(h,x),v);Wn(h,x)}return null}function p(h,f,x,v,y){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return h=h.get(x)||null,r(f,h,""+v,y);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case qn:return h=h.get(v.key===null?x:v.key)||null,s(f,h,v,y);case Eu:return h=h.get(v.key===null?x:v.key)||null,i(f,h,v,y);case Za:return v=El(v),p(h,f,x,v,y)}if(Ou(v)||wu(v))return h=h.get(x)||null,c(f,h,v,y,null);if(typeof v.then=="function")return p(h,f,x,Qn(v),y);if(v.$$typeof===Ta)return p(h,f,x,Kn(f,v),y);Wn(f,v)}return null}function L(h,f,x,v){for(var y=null,w=null,b=f,C=f=0,R=null;b!==null&&C<x.length;C++){b.index>C?(R=b,b=null):R=b.sibling;var D=m(h,b,x[C],v);if(D===null){b===null&&(b=R);break}e&&b&&D.alternate===null&&t(h,b),f=u(D,f,C),w===null?y=D:w.sibling=D,w=D,b=R}if(C===x.length)return a(h,b),J&&Ra(h,C),y;if(b===null){for(;C<x.length;C++)b=d(h,x[C],v),b!==null&&(f=u(b,f,C),w===null?y=b:w.sibling=b,w=b);return J&&Ra(h,C),y}for(b=l(b);C<x.length;C++)R=p(b,h,C,x[C],v),R!==null&&(e&&R.alternate!==null&&b.delete(R.key===null?C:R.key),f=u(R,f,C),w===null?y=R:w.sibling=R,w=R);return e&&b.forEach(function(U){return t(h,U)}),J&&Ra(h,C),y}function g(h,f,x,v){if(x==null)throw Error(I(151));for(var y=null,w=null,b=f,C=f=0,R=null,D=x.next();b!==null&&!D.done;C++,D=x.next()){b.index>C?(R=b,b=null):R=b.sibling;var U=m(h,b,D.value,v);if(U===null){b===null&&(b=R);break}e&&b&&U.alternate===null&&t(h,b),f=u(U,f,C),w===null?y=U:w.sibling=U,w=U,b=R}if(D.done)return a(h,b),J&&Ra(h,C),y;if(b===null){for(;!D.done;C++,D=x.next())D=d(h,D.value,v),D!==null&&(f=u(D,f,C),w===null?y=D:w.sibling=D,w=D);return J&&Ra(h,C),y}for(b=l(b);!D.done;C++,D=x.next())D=p(b,h,C,D.value,v),D!==null&&(e&&D.alternate!==null&&b.delete(D.key===null?C:D.key),f=u(D,f,C),w===null?y=D:w.sibling=D,w=D);return e&&b.forEach(function(G){return t(h,G)}),J&&Ra(h,C),y}function S(h,f,x,v){if(typeof x=="object"&&x!==null&&x.type===Io&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case qn:e:{for(var y=x.key;f!==null;){if(f.key===y){if(y=x.type,y===Io){if(f.tag===7){a(h,f.sibling),v=o(f,x.props.children),v.return=h,h=v;break e}}else if(f.elementType===y||typeof y=="object"&&y!==null&&y.$$typeof===Za&&El(y)===f.type){a(h,f.sibling),v=o(f,x.props),Au(v,x),v.return=h,h=v;break e}a(h,f);break}else t(h,f);f=f.sibling}x.type===Io?(v=Pl(x.props.children,h.mode,v,x.key),v.return=h,h=v):(v=ir(x.type,x.key,x.props,null,h.mode,v),Au(v,x),v.return=h,h=v)}return n(h);case Eu:e:{for(y=x.key;f!==null;){if(f.key===y)if(f.tag===4&&f.stateNode.containerInfo===x.containerInfo&&f.stateNode.implementation===x.implementation){a(h,f.sibling),v=o(f,x.children||[]),v.return=h,h=v;break e}else{a(h,f);break}else t(h,f);f=f.sibling}v=Ui(x,h.mode,v),v.return=h,h=v}return n(h);case Za:return x=El(x),S(h,f,x,v)}if(Ou(x))return L(h,f,x,v);if(wu(x)){if(y=wu(x),typeof y!="function")throw Error(I(150));return x=y.call(x),g(h,f,x,v)}if(typeof x.then=="function")return S(h,f,Qn(x),v);if(x.$$typeof===Ta)return S(h,f,Kn(h,x),v);Wn(h,x)}return typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint"?(x=""+x,f!==null&&f.tag===6?(a(h,f.sibling),v=o(f,x),v.return=h,h=v):(a(h,f),v=zi(x,h.mode,v),v.return=h,h=v),n(h)):a(h,f)}return function(h,f,x,v){try{an=0;var y=S(h,f,x,v);return _o=null,y}catch(b){if(b===lu||b===ts)throw b;var w=vt(29,b,null,h.mode);return w.lanes=v,w.return=h,w}}}var ql=$h(!0),eg=$h(!1),Ka=!1;function yc(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Tf(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function rl(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function sl(e,t,a){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(ae&2)!==0){var o=l.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),l.pending=t,t=Rr(e),Xh(e,null,a),t}return es(e,l,t,a),Rr(e)}function qu(e,t,a){if(t=t.updateQueue,t!==null&&(t=t.shared,(a&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,Lh(e,a)}}function _i(e,t){var a=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,a===l)){var o=null,u=null;if(a=a.firstBaseUpdate,a!==null){do{var n={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};u===null?o=u=n:u=u.next=n,a=a.next}while(a!==null);u===null?o=u=t:u=u.next=t}else o=u=t;a={baseState:l.baseState,firstBaseUpdate:o,lastBaseUpdate:u,shared:l.shared,callbacks:l.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=t:e.next=t,a.lastBaseUpdate=t}var Mf=!1;function Fu(){if(Mf){var e=Ho;if(e!==null)throw e}}function Gu(e,t,a,l){Mf=!1;var o=e.updateQueue;Ka=!1;var u=o.firstBaseUpdate,n=o.lastBaseUpdate,r=o.shared.pending;if(r!==null){o.shared.pending=null;var s=r,i=s.next;s.next=null,n===null?u=i:n.next=i,n=s;var c=e.alternate;c!==null&&(c=c.updateQueue,r=c.lastBaseUpdate,r!==n&&(r===null?c.firstBaseUpdate=i:r.next=i,c.lastBaseUpdate=s))}if(u!==null){var d=o.baseState;n=0,c=i=s=null,r=u;do{var m=r.lane&-536870913,p=m!==r.lane;if(p?(K&m)===m:(l&m)===m){m!==0&&m===jo&&(Mf=!0),c!==null&&(c=c.next={lane:0,tag:r.tag,payload:r.payload,callback:null,next:null});e:{var L=e,g=r;m=t;var S=a;switch(g.tag){case 1:if(L=g.payload,typeof L=="function"){d=L.call(S,d,m);break e}d=L;break e;case 3:L.flags=L.flags&-65537|128;case 0:if(L=g.payload,m=typeof L=="function"?L.call(S,d,m):L,m==null)break e;d=ye({},d,m);break e;case 2:Ka=!0}}m=r.callback,m!==null&&(e.flags|=64,p&&(e.flags|=8192),p=o.callbacks,p===null?o.callbacks=[m]:p.push(m))}else p={lane:m,tag:r.tag,payload:r.payload,callback:r.callback,next:null},c===null?(i=c=p,s=d):c=c.next=p,n|=m;if(r=r.next,r===null){if(r=o.shared.pending,r===null)break;p=r,r=p.next,p.next=null,o.lastBaseUpdate=p,o.shared.pending=null}}while(!0);c===null&&(s=d),o.baseState=s,o.firstBaseUpdate=i,o.lastBaseUpdate=c,u===null&&(o.shared.lanes=0),xl|=n,e.lanes=n,e.memoizedState=d}}function tg(e,t){if(typeof e!="function")throw Error(I(191,e));e.call(t)}function ag(e,t){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)tg(a[e],t)}var Yo=ia(null),Dr=ia(0);function cp(e,t){e=Ua,he(Dr,e),he(Yo,t),Ua=e|t.baseLanes}function Df(){he(Dr,Ua),he(Yo,Yo.current)}function Cc(){Ua=Dr.current,Ve(Yo),Ve(Dr)}var At=ia(null),zt=null;function Wa(e){var t=e.alternate;he(Ee,Ee.current&1),he(At,e),zt===null&&(t===null||Yo.current!==null||t.memoizedState!==null)&&(zt=e)}function kf(e){he(Ee,Ee.current),he(At,e),zt===null&&(zt=e)}function lg(e){e.tag===22?(he(Ee,Ee.current),he(At,e),zt===null&&(zt=e)):Ja(e)}function Ja(){he(Ee,Ee.current),he(At,At.current)}function St(e){Ve(At),zt===e&&(zt=null),Ve(Ee)}var Ee=ia(0);function kr(e){for(var t=e;t!==null;){if(t.tag===13){var a=t.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Qf(a)||Wf(a)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Pa=0,F=null,ce=null,Be=null,Er=!1,qo=!1,Fl=!1,Or=0,ln=0,Fo=null,mb=0;function Me(){throw Error(I(321))}function bc(e,t){if(t===null)return!1;for(var a=0;a<t.length&&a<e.length;a++)if(!Rt(e[a],t[a]))return!1;return!0}function Ic(e,t,a,l,o,u){return Pa=u,F=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,N.H=e===null||e.memoizedState===null?Bg:Pc,Fl=!1,u=a(l,o),Fl=!1,qo&&(u=ug(t,a,l,o)),og(e),u}function og(e){N.H=on;var t=ce!==null&&ce.next!==null;if(Pa=0,Be=ce=F=null,Er=!1,ln=0,Fo=null,t)throw Error(I(300));e===null||ze||(e=e.dependencies,e!==null&&Tr(e)&&(ze=!0))}function ug(e,t,a,l){F=e;var o=0;do{if(qo&&(Fo=null),ln=0,qo=!1,25<=o)throw Error(I(301));if(o+=1,Be=ce=null,e.updateQueue!=null){var u=e.updateQueue;u.lastEffect=null,u.events=null,u.stores=null,u.memoCache!=null&&(u.memoCache.index=0)}N.H=Pg,u=t(a,l)}while(qo);return u}function pb(){var e=N.H,t=e.useState()[0];return t=typeof t.then=="function"?Ln(t):t,e=e.useState()[0],(ce!==null?ce.memoizedState:null)!==e&&(F.flags|=1024),t}function wc(){var e=Or!==0;return Or=0,e}function Rc(e,t,a){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a}function Ac(e){if(Er){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Er=!1}Pa=0,Be=ce=F=null,qo=!1,ln=Or=0,Fo=null}function ut(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Be===null?F.memoizedState=Be=e:Be=Be.next=e,Be}function Oe(){if(ce===null){var e=F.alternate;e=e!==null?e.memoizedState:null}else e=ce.next;var t=Be===null?F.memoizedState:Be.next;if(t!==null)Be=t,ce=e;else{if(e===null)throw F.alternate===null?Error(I(467)):Error(I(310));ce=e,e={memoizedState:ce.memoizedState,baseState:ce.baseState,baseQueue:ce.baseQueue,queue:ce.queue,next:null},Be===null?F.memoizedState=Be=e:Be=Be.next=e}return Be}function as(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ln(e){var t=ln;return ln+=1,Fo===null&&(Fo=[]),e=Jh(Fo,e,t),t=F,(Be===null?t.memoizedState:Be.next)===null&&(t=t.alternate,N.H=t===null||t.memoizedState===null?Bg:Pc),e}function ls(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Ln(e);if(e.$$typeof===Ta)return Ke(e)}throw Error(I(438,String(e)))}function Tc(e){var t=null,a=F.updateQueue;if(a!==null&&(t=a.memoCache),t==null){var l=F.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(o){return o.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),a===null&&(a=as(),F.updateQueue=a),a.memoCache=t,a=t.data[t.index],a===void 0)for(a=t.data[t.index]=Array(e),l=0;l<e;l++)a[l]=$y;return t.index++,a}function Na(e,t){return typeof t=="function"?t(e):t}function cr(e){var t=Oe();return Mc(t,ce,e)}function Mc(e,t,a){var l=e.queue;if(l===null)throw Error(I(311));l.lastRenderedReducer=a;var o=e.baseQueue,u=l.pending;if(u!==null){if(o!==null){var n=o.next;o.next=u.next,u.next=n}t.baseQueue=o=u,l.pending=null}if(u=e.baseState,o===null)e.memoizedState=u;else{t=o.next;var r=n=null,s=null,i=t,c=!1;do{var d=i.lane&-536870913;if(d!==i.lane?(K&d)===d:(Pa&d)===d){var m=i.revertLane;if(m===0)s!==null&&(s=s.next={lane:0,revertLane:0,gesture:null,action:i.action,hasEagerState:i.hasEagerState,eagerState:i.eagerState,next:null}),d===jo&&(c=!0);else if((Pa&m)===m){i=i.next,m===jo&&(c=!0);continue}else d={lane:0,revertLane:i.revertLane,gesture:null,action:i.action,hasEagerState:i.hasEagerState,eagerState:i.eagerState,next:null},s===null?(r=s=d,n=u):s=s.next=d,F.lanes|=m,xl|=m;d=i.action,Fl&&a(u,d),u=i.hasEagerState?i.eagerState:a(u,d)}else m={lane:d,revertLane:i.revertLane,gesture:i.gesture,action:i.action,hasEagerState:i.hasEagerState,eagerState:i.eagerState,next:null},s===null?(r=s=m,n=u):s=s.next=m,F.lanes|=d,xl|=d;i=i.next}while(i!==null&&i!==t);if(s===null?n=u:s.next=r,!Rt(u,e.memoizedState)&&(ze=!0,c&&(a=Ho,a!==null)))throw a;e.memoizedState=u,e.baseState=n,e.baseQueue=s,l.lastRenderedState=u}return o===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function qi(e){var t=Oe(),a=t.queue;if(a===null)throw Error(I(311));a.lastRenderedReducer=e;var l=a.dispatch,o=a.pending,u=t.memoizedState;if(o!==null){a.pending=null;var n=o=o.next;do u=e(u,n.action),n=n.next;while(n!==o);Rt(u,t.memoizedState)||(ze=!0),t.memoizedState=u,t.baseQueue===null&&(t.baseState=u),a.lastRenderedState=u}return[u,l]}function ng(e,t,a){var l=F,o=Oe(),u=J;if(u){if(a===void 0)throw Error(I(407));a=a()}else a=t();var n=!Rt((ce||o).memoizedState,a);if(n&&(o.memoizedState=a,ze=!0),o=o.queue,Dc(ig.bind(null,l,o,e),[e]),o.getSnapshot!==t||n||Be!==null&&Be.memoizedState.tag&1){if(l.flags|=2048,Zo(9,{destroy:void 0},sg.bind(null,l,o,a,t),null),me===null)throw Error(I(349));u||(Pa&127)!==0||rg(l,t,a)}return a}function rg(e,t,a){e.flags|=16384,e={getSnapshot:t,value:a},t=F.updateQueue,t===null?(t=as(),F.updateQueue=t,t.stores=[e]):(a=t.stores,a===null?t.stores=[e]:a.push(e))}function sg(e,t,a,l){t.value=a,t.getSnapshot=l,fg(t)&&cg(e)}function ig(e,t,a){return a(function(){fg(t)&&cg(e)})}function fg(e){var t=e.getSnapshot;e=e.value;try{var a=t();return!Rt(e,a)}catch{return!0}}function cg(e){var t=Yl(e,2);t!==null&&ct(t,e,2)}function Ef(e){var t=ut();if(typeof e=="function"){var a=e;if(e=a(),Fl){el(!0);try{a()}finally{el(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Na,lastRenderedState:e},t}function dg(e,t,a,l){return e.baseState=a,Mc(e,ce,typeof l=="function"?l:Na)}function hb(e,t,a,l,o){if(us(e))throw Error(I(485));if(e=t.action,e!==null){var u={payload:o,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(n){u.listeners.push(n)}};N.T!==null?a(!0):u.isTransition=!1,l(u),a=t.pending,a===null?(u.next=t.pending=u,mg(t,u)):(u.next=a.next,t.pending=a.next=u)}}function mg(e,t){var a=t.action,l=t.payload,o=e.state;if(t.isTransition){var u=N.T,n={};N.T=n;try{var r=a(o,l),s=N.S;s!==null&&s(n,r),dp(e,t,r)}catch(i){Of(e,t,i)}finally{u!==null&&n.types!==null&&(u.types=n.types),N.T=u}}else try{u=a(o,l),dp(e,t,u)}catch(i){Of(e,t,i)}}function dp(e,t,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(l){mp(e,t,l)},function(l){return Of(e,t,l)}):mp(e,t,a)}function mp(e,t,a){t.status="fulfilled",t.value=a,pg(t),e.state=a,t=e.pending,t!==null&&(a=t.next,a===t?e.pending=null:(a=a.next,t.next=a,mg(e,a)))}function Of(e,t,a){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=a,pg(t),t=t.next;while(t!==l)}e.action=null}function pg(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function hg(e,t){return t}function pp(e,t){if(J){var a=me.formState;if(a!==null){e:{var l=F;if(J){if(ve){t:{for(var o=ve,u=Nt;o.nodeType!==8;){if(!u){o=null;break t}if(o=Ut(o.nextSibling),o===null){o=null;break t}}u=o.data,o=u==="F!"||u==="F"?o:null}if(o){ve=Ut(o.nextSibling),l=o.data==="F!";break e}}hl(l)}l=!1}l&&(t=a[0])}}return a=ut(),a.memoizedState=a.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:hg,lastRenderedState:t},a.queue=l,a=kg.bind(null,F,l),l.dispatch=a,l=Ef(!1),u=Bc.bind(null,F,!1,l.queue),l=ut(),o={state:t,dispatch:null,action:e,pending:null},l.queue=o,a=hb.bind(null,F,o,u,a),o.dispatch=a,l.memoizedState=e,[t,a,!1]}function hp(e){var t=Oe();return gg(t,ce,e)}function gg(e,t,a){if(t=Mc(e,t,hg)[0],e=cr(Na)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=Ln(t)}catch(n){throw n===lu?ts:n}else l=t;t=Oe();var o=t.queue,u=o.dispatch;return a!==t.memoizedState&&(F.flags|=2048,Zo(9,{destroy:void 0},gb.bind(null,o,a),null)),[l,u,e]}function gb(e,t){e.action=t}function gp(e){var t=Oe(),a=ce;if(a!==null)return gg(t,a,e);Oe(),t=t.memoizedState,a=Oe();var l=a.queue.dispatch;return a.memoizedState=e,[t,l,!1]}function Zo(e,t,a,l){return e={tag:e,create:a,deps:l,inst:t,next:null},t=F.updateQueue,t===null&&(t=as(),F.updateQueue=t),a=t.lastEffect,a===null?t.lastEffect=e.next=e:(l=a.next,a.next=e,e.next=l,t.lastEffect=e),e}function xg(){return Oe().memoizedState}function dr(e,t,a,l){var o=ut();F.flags|=e,o.memoizedState=Zo(1|t,{destroy:void 0},a,l===void 0?null:l)}function os(e,t,a,l){var o=Oe();l=l===void 0?null:l;var u=o.memoizedState.inst;ce!==null&&l!==null&&bc(l,ce.memoizedState.deps)?o.memoizedState=Zo(t,u,a,l):(F.flags|=e,o.memoizedState=Zo(1|t,u,a,l))}function xp(e,t){dr(8390656,8,e,t)}function Dc(e,t){os(2048,8,e,t)}function xb(e){F.flags|=4;var t=F.updateQueue;if(t===null)t=as(),F.updateQueue=t,t.events=[e];else{var a=t.events;a===null?t.events=[e]:a.push(e)}}function Lg(e){var t=Oe().memoizedState;return xb({ref:t,nextImpl:e}),function(){if((ae&2)!==0)throw Error(I(440));return t.impl.apply(void 0,arguments)}}function Sg(e,t){return os(4,2,e,t)}function vg(e,t){return os(4,4,e,t)}function yg(e,t){if(typeof t=="function"){e=e();var a=t(e);return function(){typeof a=="function"?a():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Cg(e,t,a){a=a!=null?a.concat([e]):null,os(4,4,yg.bind(null,t,e),a)}function kc(){}function bg(e,t){var a=Oe();t=t===void 0?null:t;var l=a.memoizedState;return t!==null&&bc(t,l[1])?l[0]:(a.memoizedState=[e,t],e)}function Ig(e,t){var a=Oe();t=t===void 0?null:t;var l=a.memoizedState;if(t!==null&&bc(t,l[1]))return l[0];if(l=e(),Fl){el(!0);try{e()}finally{el(!1)}}return a.memoizedState=[l,t],l}function Ec(e,t,a){return a===void 0||(Pa&1073741824)!==0&&(K&261930)===0?e.memoizedState=t:(e.memoizedState=a,e=dx(),F.lanes|=e,xl|=e,a)}function wg(e,t,a,l){return Rt(a,t)?a:Yo.current!==null?(e=Ec(e,a,l),Rt(e,t)||(ze=!0),e):(Pa&42)===0||(Pa&1073741824)!==0&&(K&261930)===0?(ze=!0,e.memoizedState=a):(e=dx(),F.lanes|=e,xl|=e,t)}function Rg(e,t,a,l,o){var u=le.p;le.p=u!==0&&8>u?u:8;var n=N.T,r={};N.T=r,Bc(e,!1,t,a);try{var s=o(),i=N.S;if(i!==null&&i(r,s),s!==null&&typeof s=="object"&&typeof s.then=="function"){var c=db(s,l);Vu(e,t,c,wt(e))}else Vu(e,t,l,wt(e))}catch(d){Vu(e,t,{then:function(){},status:"rejected",reason:d},wt())}finally{le.p=u,n!==null&&r.types!==null&&(n.types=r.types),N.T=n}}function Lb(){}function Bf(e,t,a,l){if(e.tag!==5)throw Error(I(476));var o=Ag(e).queue;Rg(e,o,t,Bl,a===null?Lb:function(){return Tg(e),a(l)})}function Ag(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Bl,baseState:Bl,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Na,lastRenderedState:Bl},next:null};var a={};return t.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Na,lastRenderedState:a},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Tg(e){var t=Ag(e);t.next===null&&(t=e.alternate.memoizedState),Vu(e,t.next.queue,{},wt())}function Oc(){return Ke(rn)}function Mg(){return Oe().memoizedState}function Dg(){return Oe().memoizedState}function Sb(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var a=wt();e=rl(a);var l=sl(t,e,a);l!==null&&(ct(l,t,a),qu(l,t,a)),t={cache:Lc()},e.payload=t;return}t=t.return}}function vb(e,t,a){var l=wt();a={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},us(e)?Eg(t,a):(a=pc(e,t,a,l),a!==null&&(ct(a,e,l),Og(a,t,l)))}function kg(e,t,a){var l=wt();Vu(e,t,a,l)}function Vu(e,t,a,l){var o={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(us(e))Eg(t,o);else{var u=e.alternate;if(e.lanes===0&&(u===null||u.lanes===0)&&(u=t.lastRenderedReducer,u!==null))try{var n=t.lastRenderedState,r=u(n,a);if(o.hasEagerState=!0,o.eagerState=r,Rt(r,n))return es(e,t,o,0),me===null&&$r(),!1}catch{}if(a=pc(e,t,o,l),a!==null)return ct(a,e,l),Og(a,t,l),!0}return!1}function Bc(e,t,a,l){if(l={lane:2,revertLane:Gc(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},us(e)){if(t)throw Error(I(479))}else t=pc(e,a,l,2),t!==null&&ct(t,e,2)}function us(e){var t=e.alternate;return e===F||t!==null&&t===F}function Eg(e,t){qo=Er=!0;var a=e.pending;a===null?t.next=t:(t.next=a.next,a.next=t),e.pending=t}function Og(e,t,a){if((a&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,Lh(e,a)}}var on={readContext:Ke,use:ls,useCallback:Me,useContext:Me,useEffect:Me,useImperativeHandle:Me,useLayoutEffect:Me,useInsertionEffect:Me,useMemo:Me,useReducer:Me,useRef:Me,useState:Me,useDebugValue:Me,useDeferredValue:Me,useTransition:Me,useSyncExternalStore:Me,useId:Me,useHostTransitionStatus:Me,useFormState:Me,useActionState:Me,useOptimistic:Me,useMemoCache:Me,useCacheRefresh:Me};on.useEffectEvent=Me;var Bg={readContext:Ke,use:ls,useCallback:function(e,t){return ut().memoizedState=[e,t===void 0?null:t],e},useContext:Ke,useEffect:xp,useImperativeHandle:function(e,t,a){a=a!=null?a.concat([e]):null,dr(4194308,4,yg.bind(null,t,e),a)},useLayoutEffect:function(e,t){return dr(4194308,4,e,t)},useInsertionEffect:function(e,t){dr(4,2,e,t)},useMemo:function(e,t){var a=ut();t=t===void 0?null:t;var l=e();if(Fl){el(!0);try{e()}finally{el(!1)}}return a.memoizedState=[l,t],l},useReducer:function(e,t,a){var l=ut();if(a!==void 0){var o=a(t);if(Fl){el(!0);try{a(t)}finally{el(!1)}}}else o=t;return l.memoizedState=l.baseState=o,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:o},l.queue=e,e=e.dispatch=vb.bind(null,F,e),[l.memoizedState,e]},useRef:function(e){var t=ut();return e={current:e},t.memoizedState=e},useState:function(e){e=Ef(e);var t=e.queue,a=kg.bind(null,F,t);return t.dispatch=a,[e.memoizedState,a]},useDebugValue:kc,useDeferredValue:function(e,t){var a=ut();return Ec(a,e,t)},useTransition:function(){var e=Ef(!1);return e=Rg.bind(null,F,e.queue,!0,!1),ut().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,a){var l=F,o=ut();if(J){if(a===void 0)throw Error(I(407));a=a()}else{if(a=t(),me===null)throw Error(I(349));(K&127)!==0||rg(l,t,a)}o.memoizedState=a;var u={value:a,getSnapshot:t};return o.queue=u,xp(ig.bind(null,l,u,e),[e]),l.flags|=2048,Zo(9,{destroy:void 0},sg.bind(null,l,u,a,t),null),a},useId:function(){var e=ut(),t=me.identifierPrefix;if(J){var a=na,l=ua;a=(l&~(1<<32-It(l)-1)).toString(32)+a,t="_"+t+"R_"+a,a=Or++,0<a&&(t+="H"+a.toString(32)),t+="_"}else a=mb++,t="_"+t+"r_"+a.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Oc,useFormState:pp,useActionState:pp,useOptimistic:function(e){var t=ut();t.memoizedState=t.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=a,t=Bc.bind(null,F,!0,a),a.dispatch=t,[e,t]},useMemoCache:Tc,useCacheRefresh:function(){return ut().memoizedState=Sb.bind(null,F)},useEffectEvent:function(e){var t=ut(),a={impl:e};return t.memoizedState=a,function(){if((ae&2)!==0)throw Error(I(440));return a.impl.apply(void 0,arguments)}}},Pc={readContext:Ke,use:ls,useCallback:bg,useContext:Ke,useEffect:Dc,useImperativeHandle:Cg,useInsertionEffect:Sg,useLayoutEffect:vg,useMemo:Ig,useReducer:cr,useRef:xg,useState:function(){return cr(Na)},useDebugValue:kc,useDeferredValue:function(e,t){var a=Oe();return wg(a,ce.memoizedState,e,t)},useTransition:function(){var e=cr(Na)[0],t=Oe().memoizedState;return[typeof e=="boolean"?e:Ln(e),t]},useSyncExternalStore:ng,useId:Mg,useHostTransitionStatus:Oc,useFormState:hp,useActionState:hp,useOptimistic:function(e,t){var a=Oe();return dg(a,ce,e,t)},useMemoCache:Tc,useCacheRefresh:Dg};Pc.useEffectEvent=Lg;var Pg={readContext:Ke,use:ls,useCallback:bg,useContext:Ke,useEffect:Dc,useImperativeHandle:Cg,useInsertionEffect:Sg,useLayoutEffect:vg,useMemo:Ig,useReducer:qi,useRef:xg,useState:function(){return qi(Na)},useDebugValue:kc,useDeferredValue:function(e,t){var a=Oe();return ce===null?Ec(a,e,t):wg(a,ce.memoizedState,e,t)},useTransition:function(){var e=qi(Na)[0],t=Oe().memoizedState;return[typeof e=="boolean"?e:Ln(e),t]},useSyncExternalStore:ng,useId:Mg,useHostTransitionStatus:Oc,useFormState:gp,useActionState:gp,useOptimistic:function(e,t){var a=Oe();return ce!==null?dg(a,ce,e,t):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:Tc,useCacheRefresh:Dg};Pg.useEffectEvent=Lg;function Fi(e,t,a,l){t=e.memoizedState,a=a(l,t),a=a==null?t:ye({},t,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var Pf={enqueueSetState:function(e,t,a){e=e._reactInternals;var l=wt(),o=rl(l);o.payload=t,a!=null&&(o.callback=a),t=sl(e,o,l),t!==null&&(ct(t,e,l),qu(t,e,l))},enqueueReplaceState:function(e,t,a){e=e._reactInternals;var l=wt(),o=rl(l);o.tag=1,o.payload=t,a!=null&&(o.callback=a),t=sl(e,o,l),t!==null&&(ct(t,e,l),qu(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var a=wt(),l=rl(a);l.tag=2,t!=null&&(l.callback=t),t=sl(e,l,a),t!==null&&(ct(t,e,a),qu(t,e,a))}};function Lp(e,t,a,l,o,u,n){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,u,n):t.prototype&&t.prototype.isPureReactComponent?!$u(a,l)||!$u(o,u):!0}function Sp(e,t,a,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(a,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(a,l),t.state!==e&&Pf.enqueueReplaceState(t,t.state,null)}function Gl(e,t){var a=t;if("ref"in t){a={};for(var l in t)l!=="ref"&&(a[l]=t[l])}if(e=e.defaultProps){a===t&&(a=ye({},a));for(var o in e)a[o]===void 0&&(a[o]=e[o])}return a}function Ng(e){wr(e)}function zg(e){console.error(e)}function Ug(e){wr(e)}function Br(e,t){try{var a=e.onUncaughtError;a(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function vp(e,t,a){try{var l=e.onCaughtError;l(a.value,{componentStack:a.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(o){setTimeout(function(){throw o})}}function Nf(e,t,a){return a=rl(a),a.tag=3,a.payload={element:null},a.callback=function(){Br(e,t)},a}function Hg(e){return e=rl(e),e.tag=3,e}function _g(e,t,a,l){var o=a.type.getDerivedStateFromError;if(typeof o=="function"){var u=l.value;e.payload=function(){return o(u)},e.callback=function(){vp(t,a,l)}}var n=a.stateNode;n!==null&&typeof n.componentDidCatch=="function"&&(e.callback=function(){vp(t,a,l),typeof o!="function"&&(il===null?il=new Set([this]):il.add(this));var r=l.stack;this.componentDidCatch(l.value,{componentStack:r!==null?r:""})})}function yb(e,t,a,l,o){if(a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=a.alternate,t!==null&&au(t,a,o,!0),a=At.current,a!==null){switch(a.tag){case 31:case 13:return zt===null?Hr():a.alternate===null&&De===0&&(De=3),a.flags&=-257,a.flags|=65536,a.lanes=o,l===Mr?a.flags|=16384:(t=a.updateQueue,t===null?a.updateQueue=new Set([l]):t.add(l),$i(e,l,o)),!1;case 22:return a.flags|=65536,l===Mr?a.flags|=16384:(t=a.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},a.updateQueue=t):(a=t.retryQueue,a===null?t.retryQueue=new Set([l]):a.add(l)),$i(e,l,o)),!1}throw Error(I(435,a.tag))}return $i(e,l,o),Hr(),!1}if(J)return t=At.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=o,l!==bf&&(e=Error(I(422),{cause:l}),tn(Pt(e,a)))):(l!==bf&&(t=Error(I(423),{cause:l}),tn(Pt(t,a))),e=e.current.alternate,e.flags|=65536,o&=-o,e.lanes|=o,l=Pt(l,a),o=Nf(e.stateNode,l,o),_i(e,o),De!==4&&(De=2)),!1;var u=Error(I(520),{cause:l});if(u=Pt(u,a),Yu===null?Yu=[u]:Yu.push(u),De!==4&&(De=2),t===null)return!0;l=Pt(l,a),a=t;do{switch(a.tag){case 3:return a.flags|=65536,e=o&-o,a.lanes|=e,e=Nf(a.stateNode,l,e),_i(a,e),!1;case 1:if(t=a.type,u=a.stateNode,(a.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||u!==null&&typeof u.componentDidCatch=="function"&&(il===null||!il.has(u))))return a.flags|=65536,o&=-o,a.lanes|=o,o=Hg(o),_g(o,e,a,l),_i(a,o),!1}a=a.return}while(a!==null);return!1}var Nc=Error(I(461)),ze=!1;function je(e,t,a,l){t.child=e===null?eg(t,null,a,l):ql(t,e.child,a,l)}function yp(e,t,a,l,o){a=a.render;var u=t.ref;if("ref"in l){var n={};for(var r in l)r!=="ref"&&(n[r]=l[r])}else n=l;return _l(t),l=Ic(e,t,a,n,u,o),r=wc(),e!==null&&!ze?(Rc(e,t,o),za(e,t,o)):(J&&r&&gc(t),t.flags|=1,je(e,t,l,o),t.child)}function Cp(e,t,a,l,o){if(e===null){var u=a.type;return typeof u=="function"&&!hc(u)&&u.defaultProps===void 0&&a.compare===null?(t.tag=15,t.type=u,qg(e,t,u,l,o)):(e=ir(a.type,null,l,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(u=e.child,!zc(e,o)){var n=u.memoizedProps;if(a=a.compare,a=a!==null?a:$u,a(n,l)&&e.ref===t.ref)return za(e,t,o)}return t.flags|=1,e=ka(u,l),e.ref=t.ref,e.return=t,t.child=e}function qg(e,t,a,l,o){if(e!==null){var u=e.memoizedProps;if($u(u,l)&&e.ref===t.ref)if(ze=!1,t.pendingProps=l=u,zc(e,o))(e.flags&131072)!==0&&(ze=!0);else return t.lanes=e.lanes,za(e,t,o)}return zf(e,t,a,l,o)}function Fg(e,t,a,l){var o=l.children,u=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(u=u!==null?u.baseLanes|a:a,e!==null){for(l=t.child=e.child,o=0;l!==null;)o=o|l.lanes|l.childLanes,l=l.sibling;l=o&~u}else l=0,t.child=null;return bp(e,t,u,a,l)}if((a&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&fr(t,u!==null?u.cachePool:null),u!==null?cp(t,u):Df(),lg(t);else return l=t.lanes=536870912,bp(e,t,u!==null?u.baseLanes|a:a,a,l)}else u!==null?(fr(t,u.cachePool),cp(t,u),Ja(t),t.memoizedState=null):(e!==null&&fr(t,null),Df(),Ja(t));return je(e,t,o,a),t.child}function Pu(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function bp(e,t,a,l,o){var u=Sc();return u=u===null?null:{parent:Ne._currentValue,pool:u},t.memoizedState={baseLanes:a,cachePool:u},e!==null&&fr(t,null),Df(),lg(t),e!==null&&au(e,t,l,!0),t.childLanes=o,null}function mr(e,t){return t=Pr({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Ip(e,t,a){return ql(t,e.child,null,a),e=mr(t,t.pendingProps),e.flags|=2,St(t),t.memoizedState=null,e}function Cb(e,t,a){var l=t.pendingProps,o=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(J){if(l.mode==="hidden")return e=mr(t,l),t.lanes=536870912,Pu(null,e);if(kf(t),(e=ve)?(e=Bx(e,Nt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:pl!==null?{id:ua,overflow:na}:null,retryLane:536870912,hydrationErrors:null},a=Yh(e),a.return=t,t.child=a,Ze=t,ve=null)):e=null,e===null)throw hl(t);return t.lanes=536870912,null}return mr(t,l)}var u=e.memoizedState;if(u!==null){var n=u.dehydrated;if(kf(t),o)if(t.flags&256)t.flags&=-257,t=Ip(e,t,a);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(I(558));else if(ze||au(e,t,a,!1),o=(a&e.childLanes)!==0,ze||o){if(l=me,l!==null&&(n=Sh(l,a),n!==0&&n!==u.retryLane))throw u.retryLane=n,Yl(e,n),ct(l,e,n),Nc;Hr(),t=Ip(e,t,a)}else e=u.treeContext,ve=Ut(n.nextSibling),Ze=t,J=!0,nl=null,Nt=!1,e!==null&&Kh(t,e),t=mr(t,l),t.flags|=4096;return t}return e=ka(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function pr(e,t){var a=t.ref;if(a===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(I(284));(e===null||e.ref!==a)&&(t.flags|=4194816)}}function zf(e,t,a,l,o){return _l(t),a=Ic(e,t,a,l,void 0,o),l=wc(),e!==null&&!ze?(Rc(e,t,o),za(e,t,o)):(J&&l&&gc(t),t.flags|=1,je(e,t,a,o),t.child)}function wp(e,t,a,l,o,u){return _l(t),t.updateQueue=null,a=ug(t,l,a,o),og(e),l=wc(),e!==null&&!ze?(Rc(e,t,u),za(e,t,u)):(J&&l&&gc(t),t.flags|=1,je(e,t,a,u),t.child)}function Rp(e,t,a,l,o){if(_l(t),t.stateNode===null){var u=Eo,n=a.contextType;typeof n=="object"&&n!==null&&(u=Ke(n)),u=new a(l,u),t.memoizedState=u.state!==null&&u.state!==void 0?u.state:null,u.updater=Pf,t.stateNode=u,u._reactInternals=t,u=t.stateNode,u.props=l,u.state=t.memoizedState,u.refs={},yc(t),n=a.contextType,u.context=typeof n=="object"&&n!==null?Ke(n):Eo,u.state=t.memoizedState,n=a.getDerivedStateFromProps,typeof n=="function"&&(Fi(t,a,n,l),u.state=t.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof u.getSnapshotBeforeUpdate=="function"||typeof u.UNSAFE_componentWillMount!="function"&&typeof u.componentWillMount!="function"||(n=u.state,typeof u.componentWillMount=="function"&&u.componentWillMount(),typeof u.UNSAFE_componentWillMount=="function"&&u.UNSAFE_componentWillMount(),n!==u.state&&Pf.enqueueReplaceState(u,u.state,null),Gu(t,l,u,o),Fu(),u.state=t.memoizedState),typeof u.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){u=t.stateNode;var r=t.memoizedProps,s=Gl(a,r);u.props=s;var i=u.context,c=a.contextType;n=Eo,typeof c=="object"&&c!==null&&(n=Ke(c));var d=a.getDerivedStateFromProps;c=typeof d=="function"||typeof u.getSnapshotBeforeUpdate=="function",r=t.pendingProps!==r,c||typeof u.UNSAFE_componentWillReceiveProps!="function"&&typeof u.componentWillReceiveProps!="function"||(r||i!==n)&&Sp(t,u,l,n),Ka=!1;var m=t.memoizedState;u.state=m,Gu(t,l,u,o),Fu(),i=t.memoizedState,r||m!==i||Ka?(typeof d=="function"&&(Fi(t,a,d,l),i=t.memoizedState),(s=Ka||Lp(t,a,s,l,m,i,n))?(c||typeof u.UNSAFE_componentWillMount!="function"&&typeof u.componentWillMount!="function"||(typeof u.componentWillMount=="function"&&u.componentWillMount(),typeof u.UNSAFE_componentWillMount=="function"&&u.UNSAFE_componentWillMount()),typeof u.componentDidMount=="function"&&(t.flags|=4194308)):(typeof u.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=i),u.props=l,u.state=i,u.context=n,l=s):(typeof u.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{u=t.stateNode,Tf(e,t),n=t.memoizedProps,c=Gl(a,n),u.props=c,d=t.pendingProps,m=u.context,i=a.contextType,s=Eo,typeof i=="object"&&i!==null&&(s=Ke(i)),r=a.getDerivedStateFromProps,(i=typeof r=="function"||typeof u.getSnapshotBeforeUpdate=="function")||typeof u.UNSAFE_componentWillReceiveProps!="function"&&typeof u.componentWillReceiveProps!="function"||(n!==d||m!==s)&&Sp(t,u,l,s),Ka=!1,m=t.memoizedState,u.state=m,Gu(t,l,u,o),Fu();var p=t.memoizedState;n!==d||m!==p||Ka||e!==null&&e.dependencies!==null&&Tr(e.dependencies)?(typeof r=="function"&&(Fi(t,a,r,l),p=t.memoizedState),(c=Ka||Lp(t,a,c,l,m,p,s)||e!==null&&e.dependencies!==null&&Tr(e.dependencies))?(i||typeof u.UNSAFE_componentWillUpdate!="function"&&typeof u.componentWillUpdate!="function"||(typeof u.componentWillUpdate=="function"&&u.componentWillUpdate(l,p,s),typeof u.UNSAFE_componentWillUpdate=="function"&&u.UNSAFE_componentWillUpdate(l,p,s)),typeof u.componentDidUpdate=="function"&&(t.flags|=4),typeof u.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof u.componentDidUpdate!="function"||n===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof u.getSnapshotBeforeUpdate!="function"||n===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=p),u.props=l,u.state=p,u.context=s,l=c):(typeof u.componentDidUpdate!="function"||n===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof u.getSnapshotBeforeUpdate!="function"||n===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),l=!1)}return u=l,pr(e,t),l=(t.flags&128)!==0,u||l?(u=t.stateNode,a=l&&typeof a.getDerivedStateFromError!="function"?null:u.render(),t.flags|=1,e!==null&&l?(t.child=ql(t,e.child,null,o),t.child=ql(t,null,a,o)):je(e,t,a,o),t.memoizedState=u.state,e=t.child):e=za(e,t,o),e}function Ap(e,t,a,l){return Hl(),t.flags|=256,je(e,t,a,l),t.child}var Gi={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Vi(e){return{baseLanes:e,cachePool:Wh()}}function Xi(e,t,a){return e=e!==null?e.childLanes&~a:0,t&&(e|=yt),e}function Gg(e,t,a){var l=t.pendingProps,o=!1,u=(t.flags&128)!==0,n;if((n=u)||(n=e!==null&&e.memoizedState===null?!1:(Ee.current&2)!==0),n&&(o=!0,t.flags&=-129),n=(t.flags&32)!==0,t.flags&=-33,e===null){if(J){if(o?Wa(t):Ja(t),(e=ve)?(e=Bx(e,Nt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:pl!==null?{id:ua,overflow:na}:null,retryLane:536870912,hydrationErrors:null},a=Yh(e),a.return=t,t.child=a,Ze=t,ve=null)):e=null,e===null)throw hl(t);return Wf(e)?t.lanes=32:t.lanes=536870912,null}var r=l.children;return l=l.fallback,o?(Ja(t),o=t.mode,r=Pr({mode:"hidden",children:r},o),l=Pl(l,o,a,null),r.return=t,l.return=t,r.sibling=l,t.child=r,l=t.child,l.memoizedState=Vi(a),l.childLanes=Xi(e,n,a),t.memoizedState=Gi,Pu(null,l)):(Wa(t),Uf(t,r))}var s=e.memoizedState;if(s!==null&&(r=s.dehydrated,r!==null)){if(u)t.flags&256?(Wa(t),t.flags&=-257,t=ji(e,t,a)):t.memoizedState!==null?(Ja(t),t.child=e.child,t.flags|=128,t=null):(Ja(t),r=l.fallback,o=t.mode,l=Pr({mode:"visible",children:l.children},o),r=Pl(r,o,a,null),r.flags|=2,l.return=t,r.return=t,l.sibling=r,t.child=l,ql(t,e.child,null,a),l=t.child,l.memoizedState=Vi(a),l.childLanes=Xi(e,n,a),t.memoizedState=Gi,t=Pu(null,l));else if(Wa(t),Wf(r)){if(n=r.nextSibling&&r.nextSibling.dataset,n)var i=n.dgst;n=i,l=Error(I(419)),l.stack="",l.digest=n,tn({value:l,source:null,stack:null}),t=ji(e,t,a)}else if(ze||au(e,t,a,!1),n=(a&e.childLanes)!==0,ze||n){if(n=me,n!==null&&(l=Sh(n,a),l!==0&&l!==s.retryLane))throw s.retryLane=l,Yl(e,l),ct(n,e,l),Nc;Qf(r)||Hr(),t=ji(e,t,a)}else Qf(r)?(t.flags|=192,t.child=e.child,t=null):(e=s.treeContext,ve=Ut(r.nextSibling),Ze=t,J=!0,nl=null,Nt=!1,e!==null&&Kh(t,e),t=Uf(t,l.children),t.flags|=4096);return t}return o?(Ja(t),r=l.fallback,o=t.mode,s=e.child,i=s.sibling,l=ka(s,{mode:"hidden",children:l.children}),l.subtreeFlags=s.subtreeFlags&65011712,i!==null?r=ka(i,r):(r=Pl(r,o,a,null),r.flags|=2),r.return=t,l.return=t,l.sibling=r,t.child=l,Pu(null,l),l=t.child,r=e.child.memoizedState,r===null?r=Vi(a):(o=r.cachePool,o!==null?(s=Ne._currentValue,o=o.parent!==s?{parent:s,pool:s}:o):o=Wh(),r={baseLanes:r.baseLanes|a,cachePool:o}),l.memoizedState=r,l.childLanes=Xi(e,n,a),t.memoizedState=Gi,Pu(e.child,l)):(Wa(t),a=e.child,e=a.sibling,a=ka(a,{mode:"visible",children:l.children}),a.return=t,a.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=a,t.memoizedState=null,a)}function Uf(e,t){return t=Pr({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Pr(e,t){return e=vt(22,e,null,t),e.lanes=0,e}function ji(e,t,a){return ql(t,e.child,null,a),e=Uf(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Tp(e,t,a){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),wf(e.return,t,a)}function Yi(e,t,a,l,o,u){var n=e.memoizedState;n===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:a,tailMode:o,treeForkCount:u}:(n.isBackwards=t,n.rendering=null,n.renderingStartTime=0,n.last=l,n.tail=a,n.tailMode=o,n.treeForkCount=u)}function Vg(e,t,a){var l=t.pendingProps,o=l.revealOrder,u=l.tail;l=l.children;var n=Ee.current,r=(n&2)!==0;if(r?(n=n&1|2,t.flags|=128):n&=1,he(Ee,n),je(e,t,l,a),l=J?en:0,!r&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Tp(e,a,t);else if(e.tag===19)Tp(e,a,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(o){case"forwards":for(a=t.child,o=null;a!==null;)e=a.alternate,e!==null&&kr(e)===null&&(o=a),a=a.sibling;a=o,a===null?(o=t.child,t.child=null):(o=a.sibling,a.sibling=null),Yi(t,!1,o,a,u,l);break;case"backwards":case"unstable_legacy-backwards":for(a=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&kr(e)===null){t.child=o;break}e=o.sibling,o.sibling=a,a=o,o=e}Yi(t,!0,a,null,u,l);break;case"together":Yi(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function za(e,t,a){if(e!==null&&(t.dependencies=e.dependencies),xl|=t.lanes,(a&t.childLanes)===0)if(e!==null){if(au(e,t,a,!1),(a&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(I(153));if(t.child!==null){for(e=t.child,a=ka(e,e.pendingProps),t.child=a,a.return=t;e.sibling!==null;)e=e.sibling,a=a.sibling=ka(e,e.pendingProps),a.return=t;a.sibling=null}return t.child}function zc(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Tr(e)))}function bb(e,t,a){switch(t.tag){case 3:yr(t,t.stateNode.containerInfo),Qa(t,Ne,e.memoizedState.cache),Hl();break;case 27:case 5:df(t);break;case 4:yr(t,t.stateNode.containerInfo);break;case 10:Qa(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,kf(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(Wa(t),t.flags|=128,null):(a&t.child.childLanes)!==0?Gg(e,t,a):(Wa(t),e=za(e,t,a),e!==null?e.sibling:null);Wa(t);break;case 19:var o=(e.flags&128)!==0;if(l=(a&t.childLanes)!==0,l||(au(e,t,a,!1),l=(a&t.childLanes)!==0),o){if(l)return Vg(e,t,a);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),he(Ee,Ee.current),l)break;return null;case 22:return t.lanes=0,Fg(e,t,a,t.pendingProps);case 24:Qa(t,Ne,e.memoizedState.cache)}return za(e,t,a)}function Xg(e,t,a){if(e!==null)if(e.memoizedProps!==t.pendingProps)ze=!0;else{if(!zc(e,a)&&(t.flags&128)===0)return ze=!1,bb(e,t,a);ze=(e.flags&131072)!==0}else ze=!1,J&&(t.flags&1048576)!==0&&Zh(t,en,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=El(t.elementType),t.type=e,typeof e=="function")hc(e)?(l=Gl(e,l),t.tag=1,t=Rp(null,t,e,l,a)):(t.tag=0,t=zf(null,t,e,l,a));else{if(e!=null){var o=e.$$typeof;if(o===tc){t.tag=11,t=yp(null,t,e,l,a);break e}else if(o===ac){t.tag=14,t=Cp(null,t,e,l,a);break e}}throw t=ff(e)||e,Error(I(306,t,""))}}return t;case 0:return zf(e,t,t.type,t.pendingProps,a);case 1:return l=t.type,o=Gl(l,t.pendingProps),Rp(e,t,l,o,a);case 3:e:{if(yr(t,t.stateNode.containerInfo),e===null)throw Error(I(387));l=t.pendingProps;var u=t.memoizedState;o=u.element,Tf(e,t),Gu(t,l,null,a);var n=t.memoizedState;if(l=n.cache,Qa(t,Ne,l),l!==u.cache&&Rf(t,[Ne],a,!0),Fu(),l=n.element,u.isDehydrated)if(u={element:l,isDehydrated:!1,cache:n.cache},t.updateQueue.baseState=u,t.memoizedState=u,t.flags&256){t=Ap(e,t,l,a);break e}else if(l!==o){o=Pt(Error(I(424)),t),tn(o),t=Ap(e,t,l,a);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,ve=Ut(e.firstChild),Ze=t,J=!0,nl=null,Nt=!0,a=eg(t,null,l,a),t.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(Hl(),l===o){t=za(e,t,a);break e}je(e,t,l,a)}t=t.child}return t;case 26:return pr(e,t),e===null?(a=Qp(t.type,null,t.pendingProps,null))?t.memoizedState=a:J||(a=t.type,e=t.pendingProps,l=Gr(ul.current).createElement(a),l[Ye]=t,l[dt]=e,Qe(l,a,e),Ge(l),t.stateNode=l):t.memoizedState=Qp(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return df(t),e===null&&J&&(l=t.stateNode=Px(t.type,t.pendingProps,ul.current),Ze=t,Nt=!0,o=ve,Sl(t.type)?(Jf=o,ve=Ut(l.firstChild)):ve=o),je(e,t,t.pendingProps.children,a),pr(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&J&&((o=l=ve)&&(l=Wb(l,t.type,t.pendingProps,Nt),l!==null?(t.stateNode=l,Ze=t,ve=Ut(l.firstChild),Nt=!1,o=!0):o=!1),o||hl(t)),df(t),o=t.type,u=t.pendingProps,n=e!==null?e.memoizedProps:null,l=u.children,Zf(o,u)?l=null:n!==null&&Zf(o,n)&&(t.flags|=32),t.memoizedState!==null&&(o=Ic(e,t,pb,null,null,a),rn._currentValue=o),pr(e,t),je(e,t,l,a),t.child;case 6:return e===null&&J&&((e=a=ve)&&(a=Jb(a,t.pendingProps,Nt),a!==null?(t.stateNode=a,Ze=t,ve=null,e=!0):e=!1),e||hl(t)),null;case 13:return Gg(e,t,a);case 4:return yr(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=ql(t,null,l,a):je(e,t,l,a),t.child;case 11:return yp(e,t,t.type,t.pendingProps,a);case 7:return je(e,t,t.pendingProps,a),t.child;case 8:return je(e,t,t.pendingProps.children,a),t.child;case 12:return je(e,t,t.pendingProps.children,a),t.child;case 10:return l=t.pendingProps,Qa(t,t.type,l.value),je(e,t,l.children,a),t.child;case 9:return o=t.type._context,l=t.pendingProps.children,_l(t),o=Ke(o),l=l(o),t.flags|=1,je(e,t,l,a),t.child;case 14:return Cp(e,t,t.type,t.pendingProps,a);case 15:return qg(e,t,t.type,t.pendingProps,a);case 19:return Vg(e,t,a);case 31:return Cb(e,t,a);case 22:return Fg(e,t,a,t.pendingProps);case 24:return _l(t),l=Ke(Ne),e===null?(o=Sc(),o===null&&(o=me,u=Lc(),o.pooledCache=u,u.refCount++,u!==null&&(o.pooledCacheLanes|=a),o=u),t.memoizedState={parent:l,cache:o},yc(t),Qa(t,Ne,o)):((e.lanes&a)!==0&&(Tf(e,t),Gu(t,null,null,a),Fu()),o=e.memoizedState,u=t.memoizedState,o.parent!==l?(o={parent:l,cache:l},t.memoizedState=o,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=o),Qa(t,Ne,l)):(l=u.cache,Qa(t,Ne,l),l!==o.cache&&Rf(t,[Ne],a,!0))),je(e,t,t.pendingProps.children,a),t.child;case 29:throw t.pendingProps}throw Error(I(156,t.tag))}function Ca(e){e.flags|=4}function Zi(e,t,a,l,o){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(o&335544128)===o)if(e.stateNode.complete)e.flags|=8192;else if(hx())e.flags|=8192;else throw zl=Mr,vc}else e.flags&=-16777217}function Mp(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Ux(t))if(hx())e.flags|=8192;else throw zl=Mr,vc}function Jn(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?gh():536870912,e.lanes|=t,Ko|=t)}function Tu(e,t){if(!J)switch(e.tailMode){case"hidden":t=e.tail;for(var a=null;t!==null;)t.alternate!==null&&(a=t),t=t.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var l=null;a!==null;)a.alternate!==null&&(l=a),a=a.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Se(e){var t=e.alternate!==null&&e.alternate.child===e.child,a=0,l=0;if(t)for(var o=e.child;o!==null;)a|=o.lanes|o.childLanes,l|=o.subtreeFlags&65011712,l|=o.flags&65011712,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)a|=o.lanes|o.childLanes,l|=o.subtreeFlags,l|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=l,e.childLanes=a,t}function Ib(e,t,a){var l=t.pendingProps;switch(xc(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Se(t),null;case 1:return Se(t),null;case 3:return a=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),Ea(Ne),Go(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(vo(t)?Ca(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Hi())),Se(t),null;case 26:var o=t.type,u=t.memoizedState;return e===null?(Ca(t),u!==null?(Se(t),Mp(t,u)):(Se(t),Zi(t,o,null,l,a))):u?u!==e.memoizedState?(Ca(t),Se(t),Mp(t,u)):(Se(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&Ca(t),Se(t),Zi(t,o,e,l,a)),null;case 27:if(Cr(t),a=ul.current,o=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&Ca(t);else{if(!l){if(t.stateNode===null)throw Error(I(166));return Se(t),null}e=sa.current,vo(t)?op(t,e):(e=Px(o,l,a),t.stateNode=e,Ca(t))}return Se(t),null;case 5:if(Cr(t),o=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&Ca(t);else{if(!l){if(t.stateNode===null)throw Error(I(166));return Se(t),null}if(u=sa.current,vo(t))op(t,u);else{var n=Gr(ul.current);switch(u){case 1:u=n.createElementNS("http://www.w3.org/2000/svg",o);break;case 2:u=n.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;default:switch(o){case"svg":u=n.createElementNS("http://www.w3.org/2000/svg",o);break;case"math":u=n.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;case"script":u=n.createElement("div"),u.innerHTML="<script><\/script>",u=u.removeChild(u.firstChild);break;case"select":u=typeof l.is=="string"?n.createElement("select",{is:l.is}):n.createElement("select"),l.multiple?u.multiple=!0:l.size&&(u.size=l.size);break;default:u=typeof l.is=="string"?n.createElement(o,{is:l.is}):n.createElement(o)}}u[Ye]=t,u[dt]=l;e:for(n=t.child;n!==null;){if(n.tag===5||n.tag===6)u.appendChild(n.stateNode);else if(n.tag!==4&&n.tag!==27&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break e;for(;n.sibling===null;){if(n.return===null||n.return===t)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}t.stateNode=u;e:switch(Qe(u,o,l),o){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&Ca(t)}}return Se(t),Zi(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,a),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&Ca(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(I(166));if(e=ul.current,vo(t)){if(e=t.stateNode,a=t.memoizedProps,l=null,o=Ze,o!==null)switch(o.tag){case 27:case 5:l=o.memoizedProps}e[Ye]=t,e=!!(e.nodeValue===a||l!==null&&l.suppressHydrationWarning===!0||kx(e.nodeValue,a)),e||hl(t,!0)}else e=Gr(e).createTextNode(l),e[Ye]=t,t.stateNode=e}return Se(t),null;case 31:if(a=t.memoizedState,e===null||e.memoizedState!==null){if(l=vo(t),a!==null){if(e===null){if(!l)throw Error(I(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(I(557));e[Ye]=t}else Hl(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Se(t),e=!1}else a=Hi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return t.flags&256?(St(t),t):(St(t),null);if((t.flags&128)!==0)throw Error(I(558))}return Se(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(o=vo(t),l!==null&&l.dehydrated!==null){if(e===null){if(!o)throw Error(I(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(I(317));o[Ye]=t}else Hl(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Se(t),o=!1}else o=Hi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=o),o=!0;if(!o)return t.flags&256?(St(t),t):(St(t),null)}return St(t),(t.flags&128)!==0?(t.lanes=a,t):(a=l!==null,e=e!==null&&e.memoizedState!==null,a&&(l=t.child,o=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(o=l.alternate.memoizedState.cachePool.pool),u=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(u=l.memoizedState.cachePool.pool),u!==o&&(l.flags|=2048)),a!==e&&a&&(t.child.flags|=8192),Jn(t,t.updateQueue),Se(t),null);case 4:return Go(),e===null&&Vc(t.stateNode.containerInfo),Se(t),null;case 10:return Ea(t.type),Se(t),null;case 19:if(Ve(Ee),l=t.memoizedState,l===null)return Se(t),null;if(o=(t.flags&128)!==0,u=l.rendering,u===null)if(o)Tu(l,!1);else{if(De!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(u=kr(e),u!==null){for(t.flags|=128,Tu(l,!1),e=u.updateQueue,t.updateQueue=e,Jn(t,e),t.subtreeFlags=0,e=a,a=t.child;a!==null;)jh(a,e),a=a.sibling;return he(Ee,Ee.current&1|2),J&&Ra(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&Ct()>zr&&(t.flags|=128,o=!0,Tu(l,!1),t.lanes=4194304)}else{if(!o)if(e=kr(u),e!==null){if(t.flags|=128,o=!0,e=e.updateQueue,t.updateQueue=e,Jn(t,e),Tu(l,!0),l.tail===null&&l.tailMode==="hidden"&&!u.alternate&&!J)return Se(t),null}else 2*Ct()-l.renderingStartTime>zr&&a!==536870912&&(t.flags|=128,o=!0,Tu(l,!1),t.lanes=4194304);l.isBackwards?(u.sibling=t.child,t.child=u):(e=l.last,e!==null?e.sibling=u:t.child=u,l.last=u)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Ct(),e.sibling=null,a=Ee.current,he(Ee,o?a&1|2:a&1),J&&Ra(t,l.treeForkCount),e):(Se(t),null);case 22:case 23:return St(t),Cc(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(a&536870912)!==0&&(t.flags&128)===0&&(Se(t),t.subtreeFlags&6&&(t.flags|=8192)):Se(t),a=t.updateQueue,a!==null&&Jn(t,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==a&&(t.flags|=2048),e!==null&&Ve(Nl),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),t.memoizedState.cache!==a&&(t.flags|=2048),Ea(Ne),Se(t),null;case 25:return null;case 30:return null}throw Error(I(156,t.tag))}function wb(e,t){switch(xc(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Ea(Ne),Go(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Cr(t),null;case 31:if(t.memoizedState!==null){if(St(t),t.alternate===null)throw Error(I(340));Hl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(St(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(I(340));Hl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Ve(Ee),null;case 4:return Go(),null;case 10:return Ea(t.type),null;case 22:case 23:return St(t),Cc(),e!==null&&Ve(Nl),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Ea(Ne),null;case 25:return null;default:return null}}function jg(e,t){switch(xc(t),t.tag){case 3:Ea(Ne),Go();break;case 26:case 27:case 5:Cr(t);break;case 4:Go();break;case 31:t.memoizedState!==null&&St(t);break;case 13:St(t);break;case 19:Ve(Ee);break;case 10:Ea(t.type);break;case 22:case 23:St(t),Cc(),e!==null&&Ve(Nl);break;case 24:Ea(Ne)}}function Sn(e,t){try{var a=t.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var o=l.next;a=o;do{if((a.tag&e)===e){l=void 0;var u=a.create,n=a.inst;l=u(),n.destroy=l}a=a.next}while(a!==o)}}catch(r){re(t,t.return,r)}}function gl(e,t,a){try{var l=t.updateQueue,o=l!==null?l.lastEffect:null;if(o!==null){var u=o.next;l=u;do{if((l.tag&e)===e){var n=l.inst,r=n.destroy;if(r!==void 0){n.destroy=void 0,o=t;var s=a,i=r;try{i()}catch(c){re(o,s,c)}}}l=l.next}while(l!==u)}}catch(c){re(t,t.return,c)}}function Yg(e){var t=e.updateQueue;if(t!==null){var a=e.stateNode;try{ag(t,a)}catch(l){re(e,e.return,l)}}}function Zg(e,t,a){a.props=Gl(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(l){re(e,t,l)}}function Xu(e,t){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof a=="function"?e.refCleanup=a(l):a.current=l}}catch(o){re(e,t,o)}}function ra(e,t){var a=e.ref,l=e.refCleanup;if(a!==null)if(typeof l=="function")try{l()}catch(o){re(e,t,o)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(o){re(e,t,o)}else a.current=null}function Kg(e){var t=e.type,a=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":a.autoFocus&&l.focus();break e;case"img":a.src?l.src=a.src:a.srcSet&&(l.srcset=a.srcSet)}}catch(o){re(e,e.return,o)}}function Ki(e,t,a){try{var l=e.stateNode;Xb(l,e.type,a,t),l[dt]=t}catch(o){re(e,e.return,o)}}function Qg(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Sl(e.type)||e.tag===4}function Qi(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Qg(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Sl(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Hf(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,t):(t=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,t.appendChild(e),a=a._reactRootContainer,a!=null||t.onclick!==null||(t.onclick=Ma));else if(l!==4&&(l===27&&Sl(e.type)&&(a=e.stateNode,t=null),e=e.child,e!==null))for(Hf(e,t,a),e=e.sibling;e!==null;)Hf(e,t,a),e=e.sibling}function Nr(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?a.insertBefore(e,t):a.appendChild(e);else if(l!==4&&(l===27&&Sl(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(Nr(e,t,a),e=e.sibling;e!==null;)Nr(e,t,a),e=e.sibling}function Wg(e){var t=e.stateNode,a=e.memoizedProps;try{for(var l=e.type,o=t.attributes;o.length;)t.removeAttributeNode(o[0]);Qe(t,l,a),t[Ye]=e,t[dt]=a}catch(u){re(e,e.return,u)}}var Aa=!1,Pe=!1,Wi=!1,Dp=typeof WeakSet=="function"?WeakSet:Set,Fe=null;function Rb(e,t){if(e=e.containerInfo,jf=Yr,e=Uh(e),dc(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else e:{a=(a=e.ownerDocument)&&a.defaultView||window;var l=a.getSelection&&a.getSelection();if(l&&l.rangeCount!==0){a=l.anchorNode;var o=l.anchorOffset,u=l.focusNode;l=l.focusOffset;try{a.nodeType,u.nodeType}catch{a=null;break e}var n=0,r=-1,s=-1,i=0,c=0,d=e,m=null;t:for(;;){for(var p;d!==a||o!==0&&d.nodeType!==3||(r=n+o),d!==u||l!==0&&d.nodeType!==3||(s=n+l),d.nodeType===3&&(n+=d.nodeValue.length),(p=d.firstChild)!==null;)m=d,d=p;for(;;){if(d===e)break t;if(m===a&&++i===o&&(r=n),m===u&&++c===l&&(s=n),(p=d.nextSibling)!==null)break;d=m,m=d.parentNode}d=p}a=r===-1||s===-1?null:{start:r,end:s}}else a=null}a=a||{start:0,end:0}}else a=null;for(Yf={focusedElem:e,selectionRange:a},Yr=!1,Fe=t;Fe!==null;)if(t=Fe,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Fe=e;else for(;Fe!==null;){switch(t=Fe,u=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)o=e[a],o.ref.impl=o.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&u!==null){e=void 0,a=t,o=u.memoizedProps,u=u.memoizedState,l=a.stateNode;try{var L=Gl(a.type,o);e=l.getSnapshotBeforeUpdate(L,u),l.__reactInternalSnapshotBeforeUpdate=e}catch(g){re(a,a.return,g)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,a=e.nodeType,a===9)Kf(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Kf(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(I(163))}if(e=t.sibling,e!==null){e.return=t.return,Fe=e;break}Fe=t.return}}function Jg(e,t,a){var l=a.flags;switch(a.tag){case 0:case 11:case 15:Ia(e,a),l&4&&Sn(5,a);break;case 1:if(Ia(e,a),l&4)if(e=a.stateNode,t===null)try{e.componentDidMount()}catch(n){re(a,a.return,n)}else{var o=Gl(a.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(o,t,e.__reactInternalSnapshotBeforeUpdate)}catch(n){re(a,a.return,n)}}l&64&&Yg(a),l&512&&Xu(a,a.return);break;case 3:if(Ia(e,a),l&64&&(e=a.updateQueue,e!==null)){if(t=null,a.child!==null)switch(a.child.tag){case 27:case 5:t=a.child.stateNode;break;case 1:t=a.child.stateNode}try{ag(e,t)}catch(n){re(a,a.return,n)}}break;case 27:t===null&&l&4&&Wg(a);case 26:case 5:Ia(e,a),t===null&&l&4&&Kg(a),l&512&&Xu(a,a.return);break;case 12:Ia(e,a);break;case 31:Ia(e,a),l&4&&tx(e,a);break;case 13:Ia(e,a),l&4&&ax(e,a),l&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=Pb.bind(null,a),$b(e,a))));break;case 22:if(l=a.memoizedState!==null||Aa,!l){t=t!==null&&t.memoizedState!==null||Pe,o=Aa;var u=Pe;Aa=l,(Pe=t)&&!u?wa(e,a,(a.subtreeFlags&8772)!==0):Ia(e,a),Aa=o,Pe=u}break;case 30:break;default:Ia(e,a)}}function $g(e){var t=e.alternate;t!==null&&(e.alternate=null,$g(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&nc(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ie=null,it=!1;function ba(e,t,a){for(a=a.child;a!==null;)ex(e,t,a),a=a.sibling}function ex(e,t,a){if(bt&&typeof bt.onCommitFiberUnmount=="function")try{bt.onCommitFiberUnmount(dn,a)}catch{}switch(a.tag){case 26:Pe||ra(a,t),ba(e,t,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Pe||ra(a,t);var l=Ie,o=it;Sl(a.type)&&(Ie=a.stateNode,it=!1),ba(e,t,a),Ku(a.stateNode),Ie=l,it=o;break;case 5:Pe||ra(a,t);case 6:if(l=Ie,o=it,Ie=null,ba(e,t,a),Ie=l,it=o,Ie!==null)if(it)try{(Ie.nodeType===9?Ie.body:Ie.nodeName==="HTML"?Ie.ownerDocument.body:Ie).removeChild(a.stateNode)}catch(u){re(a,t,u)}else try{Ie.removeChild(a.stateNode)}catch(u){re(a,t,u)}break;case 18:Ie!==null&&(it?(e=Ie,Xp(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),$o(e)):Xp(Ie,a.stateNode));break;case 4:l=Ie,o=it,Ie=a.stateNode.containerInfo,it=!0,ba(e,t,a),Ie=l,it=o;break;case 0:case 11:case 14:case 15:gl(2,a,t),Pe||gl(4,a,t),ba(e,t,a);break;case 1:Pe||(ra(a,t),l=a.stateNode,typeof l.componentWillUnmount=="function"&&Zg(a,t,l)),ba(e,t,a);break;case 21:ba(e,t,a);break;case 22:Pe=(l=Pe)||a.memoizedState!==null,ba(e,t,a),Pe=l;break;default:ba(e,t,a)}}function tx(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{$o(e)}catch(a){re(t,t.return,a)}}}function ax(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{$o(e)}catch(a){re(t,t.return,a)}}function Ab(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Dp),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Dp),t;default:throw Error(I(435,e.tag))}}function $n(e,t){var a=Ab(e);t.forEach(function(l){if(!a.has(l)){a.add(l);var o=Nb.bind(null,e,l);l.then(o,o)}})}function rt(e,t){var a=t.deletions;if(a!==null)for(var l=0;l<a.length;l++){var o=a[l],u=e,n=t,r=n;e:for(;r!==null;){switch(r.tag){case 27:if(Sl(r.type)){Ie=r.stateNode,it=!1;break e}break;case 5:Ie=r.stateNode,it=!1;break e;case 3:case 4:Ie=r.stateNode.containerInfo,it=!0;break e}r=r.return}if(Ie===null)throw Error(I(160));ex(u,n,o),Ie=null,it=!1,u=o.alternate,u!==null&&(u.return=null),o.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)lx(t,e),t=t.sibling}var Kt=null;function lx(e,t){var a=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:rt(t,e),st(e),l&4&&(gl(3,e,e.return),Sn(3,e),gl(5,e,e.return));break;case 1:rt(t,e),st(e),l&512&&(Pe||a===null||ra(a,a.return)),l&64&&Aa&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?l:a.concat(l))));break;case 26:var o=Kt;if(rt(t,e),st(e),l&512&&(Pe||a===null||ra(a,a.return)),l&4){var u=a!==null?a.memoizedState:null;if(l=e.memoizedState,a===null)if(l===null)if(e.stateNode===null){e:{l=e.type,a=e.memoizedProps,o=o.ownerDocument||o;t:switch(l){case"title":u=o.getElementsByTagName("title")[0],(!u||u[hn]||u[Ye]||u.namespaceURI==="http://www.w3.org/2000/svg"||u.hasAttribute("itemprop"))&&(u=o.createElement(l),o.head.insertBefore(u,o.querySelector("head > title"))),Qe(u,l,a),u[Ye]=e,Ge(u),l=u;break e;case"link":var n=Jp("link","href",o).get(l+(a.href||""));if(n){for(var r=0;r<n.length;r++)if(u=n[r],u.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&u.getAttribute("rel")===(a.rel==null?null:a.rel)&&u.getAttribute("title")===(a.title==null?null:a.title)&&u.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){n.splice(r,1);break t}}u=o.createElement(l),Qe(u,l,a),o.head.appendChild(u);break;case"meta":if(n=Jp("meta","content",o).get(l+(a.content||""))){for(r=0;r<n.length;r++)if(u=n[r],u.getAttribute("content")===(a.content==null?null:""+a.content)&&u.getAttribute("name")===(a.name==null?null:a.name)&&u.getAttribute("property")===(a.property==null?null:a.property)&&u.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&u.getAttribute("charset")===(a.charSet==null?null:a.charSet)){n.splice(r,1);break t}}u=o.createElement(l),Qe(u,l,a),o.head.appendChild(u);break;default:throw Error(I(468,l))}u[Ye]=e,Ge(u),l=u}e.stateNode=l}else $p(o,e.type,e.stateNode);else e.stateNode=Wp(o,l,e.memoizedProps);else u!==l?(u===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):u.count--,l===null?$p(o,e.type,e.stateNode):Wp(o,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Ki(e,e.memoizedProps,a.memoizedProps)}break;case 27:rt(t,e),st(e),l&512&&(Pe||a===null||ra(a,a.return)),a!==null&&l&4&&Ki(e,e.memoizedProps,a.memoizedProps);break;case 5:if(rt(t,e),st(e),l&512&&(Pe||a===null||ra(a,a.return)),e.flags&32){o=e.stateNode;try{Xo(o,"")}catch(L){re(e,e.return,L)}}l&4&&e.stateNode!=null&&(o=e.memoizedProps,Ki(e,o,a!==null?a.memoizedProps:o)),l&1024&&(Wi=!0);break;case 6:if(rt(t,e),st(e),l&4){if(e.stateNode===null)throw Error(I(162));l=e.memoizedProps,a=e.stateNode;try{a.nodeValue=l}catch(L){re(e,e.return,L)}}break;case 3:if(xr=null,o=Kt,Kt=Vr(t.containerInfo),rt(t,e),Kt=o,st(e),l&4&&a!==null&&a.memoizedState.isDehydrated)try{$o(t.containerInfo)}catch(L){re(e,e.return,L)}Wi&&(Wi=!1,ox(e));break;case 4:l=Kt,Kt=Vr(e.stateNode.containerInfo),rt(t,e),st(e),Kt=l;break;case 12:rt(t,e),st(e);break;case 31:rt(t,e),st(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,$n(e,l)));break;case 13:rt(t,e),st(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(ns=Ct()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,$n(e,l)));break;case 22:o=e.memoizedState!==null;var s=a!==null&&a.memoizedState!==null,i=Aa,c=Pe;if(Aa=i||o,Pe=c||s,rt(t,e),Pe=c,Aa=i,st(e),l&8192)e:for(t=e.stateNode,t._visibility=o?t._visibility&-2:t._visibility|1,o&&(a===null||s||Aa||Pe||Ol(e)),a=null,t=e;;){if(t.tag===5||t.tag===26){if(a===null){s=a=t;try{if(u=s.stateNode,o)n=u.style,typeof n.setProperty=="function"?n.setProperty("display","none","important"):n.display="none";else{r=s.stateNode;var d=s.memoizedProps.style,m=d!=null&&d.hasOwnProperty("display")?d.display:null;r.style.display=m==null||typeof m=="boolean"?"":(""+m).trim()}}catch(L){re(s,s.return,L)}}}else if(t.tag===6){if(a===null){s=t;try{s.stateNode.nodeValue=o?"":s.memoizedProps}catch(L){re(s,s.return,L)}}}else if(t.tag===18){if(a===null){s=t;try{var p=s.stateNode;o?jp(p,!0):jp(s.stateNode,!1)}catch(L){re(s,s.return,L)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;a===t&&(a=null),t=t.return}a===t&&(a=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(a=l.retryQueue,a!==null&&(l.retryQueue=null,$n(e,a))));break;case 19:rt(t,e),st(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,$n(e,l)));break;case 30:break;case 21:break;default:rt(t,e),st(e)}}function st(e){var t=e.flags;if(t&2){try{for(var a,l=e.return;l!==null;){if(Qg(l)){a=l;break}l=l.return}if(a==null)throw Error(I(160));switch(a.tag){case 27:var o=a.stateNode,u=Qi(e);Nr(e,u,o);break;case 5:var n=a.stateNode;a.flags&32&&(Xo(n,""),a.flags&=-33);var r=Qi(e);Nr(e,r,n);break;case 3:case 4:var s=a.stateNode.containerInfo,i=Qi(e);Hf(e,i,s);break;default:throw Error(I(161))}}catch(c){re(e,e.return,c)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function ox(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;ox(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Ia(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Jg(e,t.alternate,t),t=t.sibling}function Ol(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:gl(4,t,t.return),Ol(t);break;case 1:ra(t,t.return);var a=t.stateNode;typeof a.componentWillUnmount=="function"&&Zg(t,t.return,a),Ol(t);break;case 27:Ku(t.stateNode);case 26:case 5:ra(t,t.return),Ol(t);break;case 22:t.memoizedState===null&&Ol(t);break;case 30:Ol(t);break;default:Ol(t)}e=e.sibling}}function wa(e,t,a){for(a=a&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,o=e,u=t,n=u.flags;switch(u.tag){case 0:case 11:case 15:wa(o,u,a),Sn(4,u);break;case 1:if(wa(o,u,a),l=u,o=l.stateNode,typeof o.componentDidMount=="function")try{o.componentDidMount()}catch(i){re(l,l.return,i)}if(l=u,o=l.updateQueue,o!==null){var r=l.stateNode;try{var s=o.shared.hiddenCallbacks;if(s!==null)for(o.shared.hiddenCallbacks=null,o=0;o<s.length;o++)tg(s[o],r)}catch(i){re(l,l.return,i)}}a&&n&64&&Yg(u),Xu(u,u.return);break;case 27:Wg(u);case 26:case 5:wa(o,u,a),a&&l===null&&n&4&&Kg(u),Xu(u,u.return);break;case 12:wa(o,u,a);break;case 31:wa(o,u,a),a&&n&4&&tx(o,u);break;case 13:wa(o,u,a),a&&n&4&&ax(o,u);break;case 22:u.memoizedState===null&&wa(o,u,a),Xu(u,u.return);break;case 30:break;default:wa(o,u,a)}t=t.sibling}}function Uc(e,t){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&xn(a))}function Hc(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&xn(e))}function Zt(e,t,a,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)ux(e,t,a,l),t=t.sibling}function ux(e,t,a,l){var o=t.flags;switch(t.tag){case 0:case 11:case 15:Zt(e,t,a,l),o&2048&&Sn(9,t);break;case 1:Zt(e,t,a,l);break;case 3:Zt(e,t,a,l),o&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&xn(e)));break;case 12:if(o&2048){Zt(e,t,a,l),e=t.stateNode;try{var u=t.memoizedProps,n=u.id,r=u.onPostCommit;typeof r=="function"&&r(n,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(s){re(t,t.return,s)}}else Zt(e,t,a,l);break;case 31:Zt(e,t,a,l);break;case 13:Zt(e,t,a,l);break;case 23:break;case 22:u=t.stateNode,n=t.alternate,t.memoizedState!==null?u._visibility&2?Zt(e,t,a,l):ju(e,t):u._visibility&2?Zt(e,t,a,l):(u._visibility|=2,Co(e,t,a,l,(t.subtreeFlags&10256)!==0||!1)),o&2048&&Uc(n,t);break;case 24:Zt(e,t,a,l),o&2048&&Hc(t.alternate,t);break;default:Zt(e,t,a,l)}}function Co(e,t,a,l,o){for(o=o&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var u=e,n=t,r=a,s=l,i=n.flags;switch(n.tag){case 0:case 11:case 15:Co(u,n,r,s,o),Sn(8,n);break;case 23:break;case 22:var c=n.stateNode;n.memoizedState!==null?c._visibility&2?Co(u,n,r,s,o):ju(u,n):(c._visibility|=2,Co(u,n,r,s,o)),o&&i&2048&&Uc(n.alternate,n);break;case 24:Co(u,n,r,s,o),o&&i&2048&&Hc(n.alternate,n);break;default:Co(u,n,r,s,o)}t=t.sibling}}function ju(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var a=e,l=t,o=l.flags;switch(l.tag){case 22:ju(a,l),o&2048&&Uc(l.alternate,l);break;case 24:ju(a,l),o&2048&&Hc(l.alternate,l);break;default:ju(a,l)}t=t.sibling}}var Nu=8192;function yo(e,t,a){if(e.subtreeFlags&Nu)for(e=e.child;e!==null;)nx(e,t,a),e=e.sibling}function nx(e,t,a){switch(e.tag){case 26:yo(e,t,a),e.flags&Nu&&e.memoizedState!==null&&cI(a,Kt,e.memoizedState,e.memoizedProps);break;case 5:yo(e,t,a);break;case 3:case 4:var l=Kt;Kt=Vr(e.stateNode.containerInfo),yo(e,t,a),Kt=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=Nu,Nu=16777216,yo(e,t,a),Nu=l):yo(e,t,a));break;default:yo(e,t,a)}}function rx(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Mu(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];Fe=l,ix(l,e)}rx(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)sx(e),e=e.sibling}function sx(e){switch(e.tag){case 0:case 11:case 15:Mu(e),e.flags&2048&&gl(9,e,e.return);break;case 3:Mu(e);break;case 12:Mu(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,hr(e)):Mu(e);break;default:Mu(e)}}function hr(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];Fe=l,ix(l,e)}rx(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:gl(8,t,t.return),hr(t);break;case 22:a=t.stateNode,a._visibility&2&&(a._visibility&=-3,hr(t));break;default:hr(t)}e=e.sibling}}function ix(e,t){for(;Fe!==null;){var a=Fe;switch(a.tag){case 0:case 11:case 15:gl(8,a,t);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var l=a.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:xn(a.memoizedState.cache)}if(l=a.child,l!==null)l.return=a,Fe=l;else e:for(a=e;Fe!==null;){l=Fe;var o=l.sibling,u=l.return;if($g(l),l===a){Fe=null;break e}if(o!==null){o.return=u,Fe=o;break e}Fe=u}}}var Tb={getCacheForType:function(e){var t=Ke(Ne),a=t.data.get(e);return a===void 0&&(a=e(),t.data.set(e,a)),a},cacheSignal:function(){return Ke(Ne).controller.signal}},Mb=typeof WeakMap=="function"?WeakMap:Map,ae=0,me=null,Y=null,K=0,ne=0,Lt=null,al=!1,ou=!1,_c=!1,Ua=0,De=0,xl=0,Ul=0,qc=0,yt=0,Ko=0,Yu=null,ft=null,_f=!1,ns=0,fx=0,zr=1/0,Ur=null,il=null,He=0,fl=null,Qo=null,Oa=0,qf=0,Ff=null,cx=null,Zu=0,Gf=null;function wt(){return(ae&2)!==0&&K!==0?K&-K:N.T!==null?Gc():vh()}function dx(){if(yt===0)if((K&536870912)===0||J){var e=Gn;Gn<<=1,(Gn&3932160)===0&&(Gn=262144),yt=e}else yt=536870912;return e=At.current,e!==null&&(e.flags|=32),yt}function ct(e,t,a){(e===me&&(ne===2||ne===9)||e.cancelPendingCommit!==null)&&(Wo(e,0),ll(e,K,yt,!1)),pn(e,a),((ae&2)===0||e!==me)&&(e===me&&((ae&2)===0&&(Ul|=a),De===4&&ll(e,K,yt,!1)),fa(e))}function mx(e,t,a){if((ae&6)!==0)throw Error(I(327));var l=!a&&(t&127)===0&&(t&e.expiredLanes)===0||mn(e,t),o=l?Eb(e,t):Ji(e,t,!0),u=l;do{if(o===0){ou&&!l&&ll(e,t,0,!1);break}else{if(a=e.current.alternate,u&&!Db(a)){o=Ji(e,t,!1),u=!1;continue}if(o===2){if(u=t,e.errorRecoveryDisabledLanes&u)var n=0;else n=e.pendingLanes&-536870913,n=n!==0?n:n&536870912?536870912:0;if(n!==0){t=n;e:{var r=e;o=Yu;var s=r.current.memoizedState.isDehydrated;if(s&&(Wo(r,n).flags|=256),n=Ji(r,n,!1),n!==2){if(_c&&!s){r.errorRecoveryDisabledLanes|=u,Ul|=u,o=4;break e}u=ft,ft=o,u!==null&&(ft===null?ft=u:ft.push.apply(ft,u))}o=n}if(u=!1,o!==2)continue}}if(o===1){Wo(e,0),ll(e,t,0,!0);break}e:{switch(l=e,u=o,u){case 0:case 1:throw Error(I(345));case 4:if((t&4194048)!==t)break;case 6:ll(l,t,yt,!al);break e;case 2:ft=null;break;case 3:case 5:break;default:throw Error(I(329))}if((t&62914560)===t&&(o=ns+300-Ct(),10<o)){if(ll(l,t,yt,!al),Kr(l,0,!0)!==0)break e;Oa=t,l.timeoutHandle=Ox(kp.bind(null,l,a,ft,Ur,_f,t,yt,Ul,Ko,al,u,"Throttled",-0,0),o);break e}kp(l,a,ft,Ur,_f,t,yt,Ul,Ko,al,u,null,-0,0)}}break}while(!0);fa(e)}function kp(e,t,a,l,o,u,n,r,s,i,c,d,m,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)===16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ma},nx(t,u,d);var L=(u&62914560)===u?ns-Ct():(u&4194048)===u?fx-Ct():0;if(L=dI(d,L),L!==null){Oa=u,e.cancelPendingCommit=L(Op.bind(null,e,t,u,a,l,o,n,r,s,c,d,null,m,p)),ll(e,u,n,!i);return}}Op(e,t,u,a,l,o,n,r,s)}function Db(e){for(var t=e;;){var a=t.tag;if((a===0||a===11||a===15)&&t.flags&16384&&(a=t.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var l=0;l<a.length;l++){var o=a[l],u=o.getSnapshot;o=o.value;try{if(!Rt(u(),o))return!1}catch{return!1}}if(a=t.child,t.subtreeFlags&16384&&a!==null)a.return=t,t=a;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function ll(e,t,a,l){t&=~qc,t&=~Ul,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var o=t;0<o;){var u=31-It(o),n=1<<u;l[u]=-1,o&=~n}a!==0&&xh(e,a,t)}function rs(){return(ae&6)===0?(vn(0,!1),!1):!0}function Fc(){if(Y!==null){if(ne===0)var e=Y.return;else e=Y,Da=Zl=null,Ac(e),_o=null,an=0,e=Y;for(;e!==null;)jg(e.alternate,e),e=e.return;Y=null}}function Wo(e,t){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,Zb(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),Oa=0,Fc(),me=e,Y=a=ka(e.current,null),K=t,ne=0,Lt=null,al=!1,ou=mn(e,t),_c=!1,Ko=yt=qc=Ul=xl=De=0,ft=Yu=null,_f=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var o=31-It(l),u=1<<o;t|=e[o],l&=~u}return Ua=t,$r(),a}function px(e,t){F=null,N.H=on,t===lu||t===ts?(t=ip(),ne=3):t===vc?(t=ip(),ne=4):ne=t===Nc?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Lt=t,Y===null&&(De=1,Br(e,Pt(t,e.current)))}function hx(){var e=At.current;return e===null?!0:(K&4194048)===K?zt===null:(K&62914560)===K||(K&536870912)!==0?e===zt:!1}function gx(){var e=N.H;return N.H=on,e===null?on:e}function xx(){var e=N.A;return N.A=Tb,e}function Hr(){De=4,al||(K&4194048)!==K&&At.current!==null||(ou=!0),(xl&134217727)===0&&(Ul&134217727)===0||me===null||ll(me,K,yt,!1)}function Ji(e,t,a){var l=ae;ae|=2;var o=gx(),u=xx();(me!==e||K!==t)&&(Ur=null,Wo(e,t)),t=!1;var n=De;e:do try{if(ne!==0&&Y!==null){var r=Y,s=Lt;switch(ne){case 8:Fc(),n=6;break e;case 3:case 2:case 9:case 6:At.current===null&&(t=!0);var i=ne;if(ne=0,Lt=null,Po(e,r,s,i),a&&ou){n=0;break e}break;default:i=ne,ne=0,Lt=null,Po(e,r,s,i)}}kb(),n=De;break}catch(c){px(e,c)}while(!0);return t&&e.shellSuspendCounter++,Da=Zl=null,ae=l,N.H=o,N.A=u,Y===null&&(me=null,K=0,$r()),n}function kb(){for(;Y!==null;)Lx(Y)}function Eb(e,t){var a=ae;ae|=2;var l=gx(),o=xx();me!==e||K!==t?(Ur=null,zr=Ct()+500,Wo(e,t)):ou=mn(e,t);e:do try{if(ne!==0&&Y!==null){t=Y;var u=Lt;t:switch(ne){case 1:ne=0,Lt=null,Po(e,t,u,1);break;case 2:case 9:if(sp(u)){ne=0,Lt=null,Ep(t);break}t=function(){ne!==2&&ne!==9||me!==e||(ne=7),fa(e)},u.then(t,t);break e;case 3:ne=7;break e;case 4:ne=5;break e;case 7:sp(u)?(ne=0,Lt=null,Ep(t)):(ne=0,Lt=null,Po(e,t,u,7));break;case 5:var n=null;switch(Y.tag){case 26:n=Y.memoizedState;case 5:case 27:var r=Y;if(n?Ux(n):r.stateNode.complete){ne=0,Lt=null;var s=r.sibling;if(s!==null)Y=s;else{var i=r.return;i!==null?(Y=i,ss(i)):Y=null}break t}}ne=0,Lt=null,Po(e,t,u,5);break;case 6:ne=0,Lt=null,Po(e,t,u,6);break;case 8:Fc(),De=6;break e;default:throw Error(I(462))}}Ob();break}catch(c){px(e,c)}while(!0);return Da=Zl=null,N.H=l,N.A=o,ae=a,Y!==null?0:(me=null,K=0,$r(),De)}function Ob(){for(;Y!==null&&!aC();)Lx(Y)}function Lx(e){var t=Xg(e.alternate,e,Ua);e.memoizedProps=e.pendingProps,t===null?ss(e):Y=t}function Ep(e){var t=e,a=t.alternate;switch(t.tag){case 15:case 0:t=wp(a,t,t.pendingProps,t.type,void 0,K);break;case 11:t=wp(a,t,t.pendingProps,t.type.render,t.ref,K);break;case 5:Ac(t);default:jg(a,t),t=Y=jh(t,Ua),t=Xg(a,t,Ua)}e.memoizedProps=e.pendingProps,t===null?ss(e):Y=t}function Po(e,t,a,l){Da=Zl=null,Ac(t),_o=null,an=0;var o=t.return;try{if(yb(e,o,t,a,K)){De=1,Br(e,Pt(a,e.current)),Y=null;return}}catch(u){if(o!==null)throw Y=o,u;De=1,Br(e,Pt(a,e.current)),Y=null;return}t.flags&32768?(J||l===1?e=!0:ou||(K&536870912)!==0?e=!1:(al=e=!0,(l===2||l===9||l===3||l===6)&&(l=At.current,l!==null&&l.tag===13&&(l.flags|=16384))),Sx(t,e)):ss(t)}function ss(e){var t=e;do{if((t.flags&32768)!==0){Sx(t,al);return}e=t.return;var a=Ib(t.alternate,t,Ua);if(a!==null){Y=a;return}if(t=t.sibling,t!==null){Y=t;return}Y=t=e}while(t!==null);De===0&&(De=5)}function Sx(e,t){do{var a=wb(e.alternate,e);if(a!==null){a.flags&=32767,Y=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!t&&(e=e.sibling,e!==null)){Y=e;return}Y=e=a}while(e!==null);De=6,Y=null}function Op(e,t,a,l,o,u,n,r,s){e.cancelPendingCommit=null;do is();while(He!==0);if((ae&6)!==0)throw Error(I(327));if(t!==null){if(t===e.current)throw Error(I(177));if(u=t.lanes|t.childLanes,u|=mc,dC(e,a,u,n,r,s),e===me&&(Y=me=null,K=0),Qo=t,fl=e,Oa=a,qf=u,Ff=o,cx=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,zb(br,function(){return Ix(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=N.T,N.T=null,o=le.p,le.p=2,n=ae,ae|=4;try{Rb(e,t,a)}finally{ae=n,le.p=o,N.T=l}}He=1,vx(),yx(),Cx()}}function vx(){if(He===1){He=0;var e=fl,t=Qo,a=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||a){a=N.T,N.T=null;var l=le.p;le.p=2;var o=ae;ae|=4;try{lx(t,e);var u=Yf,n=Uh(e.containerInfo),r=u.focusedElem,s=u.selectionRange;if(n!==r&&r&&r.ownerDocument&&zh(r.ownerDocument.documentElement,r)){if(s!==null&&dc(r)){var i=s.start,c=s.end;if(c===void 0&&(c=i),"selectionStart"in r)r.selectionStart=i,r.selectionEnd=Math.min(c,r.value.length);else{var d=r.ownerDocument||document,m=d&&d.defaultView||window;if(m.getSelection){var p=m.getSelection(),L=r.textContent.length,g=Math.min(s.start,L),S=s.end===void 0?g:Math.min(s.end,L);!p.extend&&g>S&&(n=S,S=g,g=n);var h=tp(r,g),f=tp(r,S);if(h&&f&&(p.rangeCount!==1||p.anchorNode!==h.node||p.anchorOffset!==h.offset||p.focusNode!==f.node||p.focusOffset!==f.offset)){var x=d.createRange();x.setStart(h.node,h.offset),p.removeAllRanges(),g>S?(p.addRange(x),p.extend(f.node,f.offset)):(x.setEnd(f.node,f.offset),p.addRange(x))}}}}for(d=[],p=r;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<d.length;r++){var v=d[r];v.element.scrollLeft=v.left,v.element.scrollTop=v.top}}Yr=!!jf,Yf=jf=null}finally{ae=o,le.p=l,N.T=a}}e.current=t,He=2}}function yx(){if(He===2){He=0;var e=fl,t=Qo,a=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||a){a=N.T,N.T=null;var l=le.p;le.p=2;var o=ae;ae|=4;try{Jg(e,t.alternate,t)}finally{ae=o,le.p=l,N.T=a}}He=3}}function Cx(){if(He===4||He===3){He=0,lC();var e=fl,t=Qo,a=Oa,l=cx;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?He=5:(He=0,Qo=fl=null,bx(e,e.pendingLanes));var o=e.pendingLanes;if(o===0&&(il=null),uc(a),t=t.stateNode,bt&&typeof bt.onCommitFiberRoot=="function")try{bt.onCommitFiberRoot(dn,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=N.T,o=le.p,le.p=2,N.T=null;try{for(var u=e.onRecoverableError,n=0;n<l.length;n++){var r=l[n];u(r.value,{componentStack:r.stack})}}finally{N.T=t,le.p=o}}(Oa&3)!==0&&is(),fa(e),o=e.pendingLanes,(a&261930)!==0&&(o&42)!==0?e===Gf?Zu++:(Zu=0,Gf=e):Zu=0,vn(0,!1)}}function bx(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,xn(t)))}function is(){return vx(),yx(),Cx(),Ix()}function Ix(){if(He!==5)return!1;var e=fl,t=qf;qf=0;var a=uc(Oa),l=N.T,o=le.p;try{le.p=32>a?32:a,N.T=null,a=Ff,Ff=null;var u=fl,n=Oa;if(He=0,Qo=fl=null,Oa=0,(ae&6)!==0)throw Error(I(331));var r=ae;if(ae|=4,sx(u.current),ux(u,u.current,n,a),ae=r,vn(0,!1),bt&&typeof bt.onPostCommitFiberRoot=="function")try{bt.onPostCommitFiberRoot(dn,u)}catch{}return!0}finally{le.p=o,N.T=l,bx(e,t)}}function Bp(e,t,a){t=Pt(a,t),t=Nf(e.stateNode,t,2),e=sl(e,t,2),e!==null&&(pn(e,2),fa(e))}function re(e,t,a){if(e.tag===3)Bp(e,e,a);else for(;t!==null;){if(t.tag===3){Bp(t,e,a);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(il===null||!il.has(l))){e=Pt(a,e),a=Hg(2),l=sl(t,a,2),l!==null&&(_g(a,l,t,e),pn(l,2),fa(l));break}}t=t.return}}function $i(e,t,a){var l=e.pingCache;if(l===null){l=e.pingCache=new Mb;var o=new Set;l.set(t,o)}else o=l.get(t),o===void 0&&(o=new Set,l.set(t,o));o.has(a)||(_c=!0,o.add(a),e=Bb.bind(null,e,t,a),t.then(e,e))}function Bb(e,t,a){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,me===e&&(K&a)===a&&(De===4||De===3&&(K&62914560)===K&&300>Ct()-ns?(ae&2)===0&&Wo(e,0):qc|=a,Ko===K&&(Ko=0)),fa(e)}function wx(e,t){t===0&&(t=gh()),e=Yl(e,t),e!==null&&(pn(e,t),fa(e))}function Pb(e){var t=e.memoizedState,a=0;t!==null&&(a=t.retryLane),wx(e,a)}function Nb(e,t){var a=0;switch(e.tag){case 31:case 13:var l=e.stateNode,o=e.memoizedState;o!==null&&(a=o.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(I(314))}l!==null&&l.delete(t),wx(e,a)}function zb(e,t){return lc(e,t)}var _r=null,bo=null,Vf=!1,qr=!1,ef=!1,ol=0;function fa(e){e!==bo&&e.next===null&&(bo===null?_r=bo=e:bo=bo.next=e),qr=!0,Vf||(Vf=!0,Hb())}function vn(e,t){if(!ef&&qr){ef=!0;do for(var a=!1,l=_r;l!==null;){if(!t)if(e!==0){var o=l.pendingLanes;if(o===0)var u=0;else{var n=l.suspendedLanes,r=l.pingedLanes;u=(1<<31-It(42|e)+1)-1,u&=o&~(n&~r),u=u&201326741?u&201326741|1:u?u|2:0}u!==0&&(a=!0,Pp(l,u))}else u=K,u=Kr(l,l===me?u:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(u&3)===0||mn(l,u)||(a=!0,Pp(l,u));l=l.next}while(a);ef=!1}}function Ub(){Rx()}function Rx(){qr=Vf=!1;var e=0;ol!==0&&Yb()&&(e=ol);for(var t=Ct(),a=null,l=_r;l!==null;){var o=l.next,u=Ax(l,t);u===0?(l.next=null,a===null?_r=o:a.next=o,o===null&&(bo=a)):(a=l,(e!==0||(u&3)!==0)&&(qr=!0)),l=o}He!==0&&He!==5||vn(e,!1),ol!==0&&(ol=0)}function Ax(e,t){for(var a=e.suspendedLanes,l=e.pingedLanes,o=e.expirationTimes,u=e.pendingLanes&-62914561;0<u;){var n=31-It(u),r=1<<n,s=o[n];s===-1?((r&a)===0||(r&l)!==0)&&(o[n]=cC(r,t)):s<=t&&(e.expiredLanes|=r),u&=~r}if(t=me,a=K,a=Kr(e,e===t?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,a===0||e===t&&(ne===2||ne===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&Mi(l),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||mn(e,a)){if(t=a&-a,t===e.callbackPriority)return t;switch(l!==null&&Mi(l),uc(a)){case 2:case 8:a=ph;break;case 32:a=br;break;case 268435456:a=hh;break;default:a=br}return l=Tx.bind(null,e),a=lc(a,l),e.callbackPriority=t,e.callbackNode=a,t}return l!==null&&l!==null&&Mi(l),e.callbackPriority=2,e.callbackNode=null,2}function Tx(e,t){if(He!==0&&He!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(is()&&e.callbackNode!==a)return null;var l=K;return l=Kr(e,e===me?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(mx(e,l,t),Ax(e,Ct()),e.callbackNode!=null&&e.callbackNode===a?Tx.bind(null,e):null)}function Pp(e,t){if(is())return null;mx(e,t,!0)}function Hb(){Kb(function(){(ae&6)!==0?lc(mh,Ub):Rx()})}function Gc(){if(ol===0){var e=jo;e===0&&(e=Fn,Fn<<=1,(Fn&261888)===0&&(Fn=256)),ol=e}return ol}function Np(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:nr(""+e)}function zp(e,t){var a=t.ownerDocument.createElement("input");return a.name=t.name,a.value=t.value,e.id&&a.setAttribute("form",e.id),t.parentNode.insertBefore(a,t),e=new FormData(e),a.parentNode.removeChild(a),e}function _b(e,t,a,l,o){if(t==="submit"&&a&&a.stateNode===o){var u=Np((o[dt]||null).action),n=l.submitter;n&&(t=(t=n[dt]||null)?Np(t.formAction):n.getAttribute("formAction"),t!==null&&(u=t,n=null));var r=new Qr("action","action",null,l,o);e.push({event:r,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(ol!==0){var s=n?zp(o,n):new FormData(o);Bf(a,{pending:!0,data:s,method:o.method,action:u},null,s)}}else typeof u=="function"&&(r.preventDefault(),s=n?zp(o,n):new FormData(o),Bf(a,{pending:!0,data:s,method:o.method,action:u},u,s))},currentTarget:o}]})}}for(er=0;er<Cf.length;er++)tr=Cf[er],Up=tr.toLowerCase(),Hp=tr[0].toUpperCase()+tr.slice(1),Qt(Up,"on"+Hp);var tr,Up,Hp,er;Qt(_h,"onAnimationEnd");Qt(qh,"onAnimationIteration");Qt(Fh,"onAnimationStart");Qt("dblclick","onDoubleClick");Qt("focusin","onFocus");Qt("focusout","onBlur");Qt(ob,"onTransitionRun");Qt(ub,"onTransitionStart");Qt(nb,"onTransitionCancel");Qt(Gh,"onTransitionEnd");Vo("onMouseEnter",["mouseout","mouseover"]);Vo("onMouseLeave",["mouseout","mouseover"]);Vo("onPointerEnter",["pointerout","pointerover"]);Vo("onPointerLeave",["pointerout","pointerover"]);Vl("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Vl("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Vl("onBeforeInput",["compositionend","keypress","textInput","paste"]);Vl("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Vl("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Vl("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var un="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),qb=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(un));function Mx(e,t){t=(t&4)!==0;for(var a=0;a<e.length;a++){var l=e[a],o=l.event;l=l.listeners;e:{var u=void 0;if(t)for(var n=l.length-1;0<=n;n--){var r=l[n],s=r.instance,i=r.currentTarget;if(r=r.listener,s!==u&&o.isPropagationStopped())break e;u=r,o.currentTarget=i;try{u(o)}catch(c){wr(c)}o.currentTarget=null,u=s}else for(n=0;n<l.length;n++){if(r=l[n],s=r.instance,i=r.currentTarget,r=r.listener,s!==u&&o.isPropagationStopped())break e;u=r,o.currentTarget=i;try{u(o)}catch(c){wr(c)}o.currentTarget=null,u=s}}}}function j(e,t){var a=t[pf];a===void 0&&(a=t[pf]=new Set);var l=e+"__bubble";a.has(l)||(Dx(t,e,2,!1),a.add(l))}function tf(e,t,a){var l=0;t&&(l|=4),Dx(a,e,l,t)}var ar="_reactListening"+Math.random().toString(36).slice(2);function Vc(e){if(!e[ar]){e[ar]=!0,yh.forEach(function(a){a!=="selectionchange"&&(qb.has(a)||tf(a,!1,e),tf(a,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ar]||(t[ar]=!0,tf("selectionchange",!1,t))}}function Dx(e,t,a,l){switch(Gx(t)){case 2:var o=hI;break;case 8:o=gI;break;default:o=Zc}a=o.bind(null,t,a,e),o=void 0,!Sf||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),l?o!==void 0?e.addEventListener(t,a,{capture:!0,passive:o}):e.addEventListener(t,a,!0):o!==void 0?e.addEventListener(t,a,{passive:o}):e.addEventListener(t,a,!1)}function af(e,t,a,l,o){var u=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var n=l.tag;if(n===3||n===4){var r=l.stateNode.containerInfo;if(r===o)break;if(n===4)for(n=l.return;n!==null;){var s=n.tag;if((s===3||s===4)&&n.stateNode.containerInfo===o)return;n=n.return}for(;r!==null;){if(n=Ro(r),n===null)return;if(s=n.tag,s===5||s===6||s===26||s===27){l=u=n;continue e}r=r.parentNode}}l=l.return}Mh(function(){var i=u,c=sc(a),d=[];e:{var m=Vh.get(e);if(m!==void 0){var p=Qr,L=e;switch(e){case"keypress":if(sr(a)===0)break e;case"keydown":case"keyup":p=NC;break;case"focusin":L="focus",p=Bi;break;case"focusout":L="blur",p=Bi;break;case"beforeblur":case"afterblur":p=Bi;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=jm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=IC;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=HC;break;case _h:case qh:case Fh:p=AC;break;case Gh:p=qC;break;case"scroll":case"scrollend":p=CC;break;case"wheel":p=GC;break;case"copy":case"cut":case"paste":p=MC;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Zm;break;case"toggle":case"beforetoggle":p=XC}var g=(t&4)!==0,S=!g&&(e==="scroll"||e==="scrollend"),h=g?m!==null?m+"Capture":null:m;g=[];for(var f=i,x;f!==null;){var v=f;if(x=v.stateNode,v=v.tag,v!==5&&v!==26&&v!==27||x===null||h===null||(v=Wu(f,h),v!=null&&g.push(nn(f,v,x))),S)break;f=f.return}0<g.length&&(m=new p(m,L,null,a,c),d.push({event:m,listeners:g}))}}if((t&7)===0){e:{if(m=e==="mouseover"||e==="pointerover",p=e==="mouseout"||e==="pointerout",m&&a!==Lf&&(L=a.relatedTarget||a.fromElement)&&(Ro(L)||L[eu]))break e;if((p||m)&&(m=c.window===c?c:(m=c.ownerDocument)?m.defaultView||m.parentWindow:window,p?(L=a.relatedTarget||a.toElement,p=i,L=L?Ro(L):null,L!==null&&(S=cn(L),g=L.tag,L!==S||g!==5&&g!==27&&g!==6)&&(L=null)):(p=null,L=i),p!==L)){if(g=jm,v="onMouseLeave",h="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(g=Zm,v="onPointerLeave",h="onPointerEnter",f="pointer"),S=p==null?m:Bu(p),x=L==null?m:Bu(L),m=new g(v,f+"leave",p,a,c),m.target=S,m.relatedTarget=x,v=null,Ro(c)===i&&(g=new g(h,f+"enter",L,a,c),g.target=x,g.relatedTarget=S,v=g),S=v,p&&L)t:{for(g=Fb,h=p,f=L,x=0,v=h;v;v=g(v))x++;v=0;for(var y=f;y;y=g(y))v++;for(;0<x-v;)h=g(h),x--;for(;0<v-x;)f=g(f),v--;for(;x--;){if(h===f||f!==null&&h===f.alternate){g=h;break t}h=g(h),f=g(f)}g=null}else g=null;p!==null&&_p(d,m,p,g,!1),L!==null&&S!==null&&_p(d,S,L,g,!0)}}e:{if(m=i?Bu(i):window,p=m.nodeName&&m.nodeName.toLowerCase(),p==="select"||p==="input"&&m.type==="file")var w=Jm;else if(Wm(m))if(Ph)w=tb;else{w=$C;var b=JC}else p=m.nodeName,!p||p.toLowerCase()!=="input"||m.type!=="checkbox"&&m.type!=="radio"?i&&rc(i.elementType)&&(w=Jm):w=eb;if(w&&(w=w(e,i))){Bh(d,w,a,c);break e}b&&b(e,m,i),e==="focusout"&&i&&m.type==="number"&&i.memoizedProps.value!=null&&xf(m,"number",m.value)}switch(b=i?Bu(i):window,e){case"focusin":(Wm(b)||b.contentEditable==="true")&&(Mo=b,vf=i,Hu=null);break;case"focusout":Hu=vf=Mo=null;break;case"mousedown":yf=!0;break;case"contextmenu":case"mouseup":case"dragend":yf=!1,ap(d,a,c);break;case"selectionchange":if(lb)break;case"keydown":case"keyup":ap(d,a,c)}var C;if(cc)e:{switch(e){case"compositionstart":var R="onCompositionStart";break e;case"compositionend":R="onCompositionEnd";break e;case"compositionupdate":R="onCompositionUpdate";break e}R=void 0}else To?Eh(e,a)&&(R="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(R="onCompositionStart");R&&(kh&&a.locale!=="ko"&&(To||R!=="onCompositionStart"?R==="onCompositionEnd"&&To&&(C=Dh()):(tl=c,ic="value"in tl?tl.value:tl.textContent,To=!0)),b=Fr(i,R),0<b.length&&(R=new Ym(R,e,null,a,c),d.push({event:R,listeners:b}),C?R.data=C:(C=Oh(a),C!==null&&(R.data=C)))),(C=YC?ZC(e,a):KC(e,a))&&(R=Fr(i,"onBeforeInput"),0<R.length&&(b=new Ym("onBeforeInput","beforeinput",null,a,c),d.push({event:b,listeners:R}),b.data=C)),_b(d,e,i,a,c)}Mx(d,t)})}function nn(e,t,a){return{instance:e,listener:t,currentTarget:a}}function Fr(e,t){for(var a=t+"Capture",l=[];e!==null;){var o=e,u=o.stateNode;if(o=o.tag,o!==5&&o!==26&&o!==27||u===null||(o=Wu(e,a),o!=null&&l.unshift(nn(e,o,u)),o=Wu(e,t),o!=null&&l.push(nn(e,o,u))),e.tag===3)return l;e=e.return}return[]}function Fb(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function _p(e,t,a,l,o){for(var u=t._reactName,n=[];a!==null&&a!==l;){var r=a,s=r.alternate,i=r.stateNode;if(r=r.tag,s!==null&&s===l)break;r!==5&&r!==26&&r!==27||i===null||(s=i,o?(i=Wu(a,u),i!=null&&n.unshift(nn(a,i,s))):o||(i=Wu(a,u),i!=null&&n.push(nn(a,i,s)))),a=a.return}n.length!==0&&e.push({event:t,listeners:n})}var Gb=/\r\n?/g,Vb=/\u0000|\uFFFD/g;function qp(e){return(typeof e=="string"?e:""+e).replace(Gb,`
`).replace(Vb,"")}function kx(e,t){return t=qp(t),qp(e)===t}function fe(e,t,a,l,o,u){switch(a){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||Xo(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&Xo(e,""+l);break;case"className":Xn(e,"class",l);break;case"tabIndex":Xn(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Xn(e,a,l);break;case"style":Th(e,l,u);break;case"data":if(t!=="object"){Xn(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||a!=="href")){e.removeAttribute(a);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=nr(""+l),e.setAttribute(a,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof u=="function"&&(a==="formAction"?(t!=="input"&&fe(e,t,"name",o.name,o,null),fe(e,t,"formEncType",o.formEncType,o,null),fe(e,t,"formMethod",o.formMethod,o,null),fe(e,t,"formTarget",o.formTarget,o,null)):(fe(e,t,"encType",o.encType,o,null),fe(e,t,"method",o.method,o,null),fe(e,t,"target",o.target,o,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=nr(""+l),e.setAttribute(a,l);break;case"onClick":l!=null&&(e.onclick=Ma);break;case"onScroll":l!=null&&j("scroll",e);break;case"onScrollEnd":l!=null&&j("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(I(61));if(a=l.__html,a!=null){if(o.children!=null)throw Error(I(60));e.innerHTML=a}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}a=nr(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""+l):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":l===!0?e.setAttribute(a,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,l):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(a,l):e.removeAttribute(a);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(a):e.setAttribute(a,l);break;case"popover":j("beforetoggle",e),j("toggle",e),ur(e,"popover",l);break;case"xlinkActuate":ya(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":ya(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":ya(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":ya(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":ya(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":ya(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":ya(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":ya(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":ya(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":ur(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=vC.get(a)||a,ur(e,a,l))}}function Xf(e,t,a,l,o,u){switch(a){case"style":Th(e,l,u);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(I(61));if(a=l.__html,a!=null){if(o.children!=null)throw Error(I(60));e.innerHTML=a}}break;case"children":typeof l=="string"?Xo(e,l):(typeof l=="number"||typeof l=="bigint")&&Xo(e,""+l);break;case"onScroll":l!=null&&j("scroll",e);break;case"onScrollEnd":l!=null&&j("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Ma);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Ch.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(o=a.endsWith("Capture"),t=a.slice(2,o?a.length-7:void 0),u=e[dt]||null,u=u!=null?u[a]:null,typeof u=="function"&&e.removeEventListener(t,u,o),typeof l=="function")){typeof u!="function"&&u!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(t,l,o);break e}a in e?e[a]=l:l===!0?e.setAttribute(a,""):ur(e,a,l)}}}function Qe(e,t,a){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":j("error",e),j("load",e);var l=!1,o=!1,u;for(u in a)if(a.hasOwnProperty(u)){var n=a[u];if(n!=null)switch(u){case"src":l=!0;break;case"srcSet":o=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(I(137,t));default:fe(e,t,u,n,a,null)}}o&&fe(e,t,"srcSet",a.srcSet,a,null),l&&fe(e,t,"src",a.src,a,null);return;case"input":j("invalid",e);var r=u=n=o=null,s=null,i=null;for(l in a)if(a.hasOwnProperty(l)){var c=a[l];if(c!=null)switch(l){case"name":o=c;break;case"type":n=c;break;case"checked":s=c;break;case"defaultChecked":i=c;break;case"value":u=c;break;case"defaultValue":r=c;break;case"children":case"dangerouslySetInnerHTML":if(c!=null)throw Error(I(137,t));break;default:fe(e,t,l,c,a,null)}}wh(e,u,r,s,i,n,o,!1);return;case"select":j("invalid",e),l=n=u=null;for(o in a)if(a.hasOwnProperty(o)&&(r=a[o],r!=null))switch(o){case"value":u=r;break;case"defaultValue":n=r;break;case"multiple":l=r;default:fe(e,t,o,r,a,null)}t=u,a=n,e.multiple=!!l,t!=null?zo(e,!!l,t,!1):a!=null&&zo(e,!!l,a,!0);return;case"textarea":j("invalid",e),u=o=l=null;for(n in a)if(a.hasOwnProperty(n)&&(r=a[n],r!=null))switch(n){case"value":l=r;break;case"defaultValue":o=r;break;case"children":u=r;break;case"dangerouslySetInnerHTML":if(r!=null)throw Error(I(91));break;default:fe(e,t,n,r,a,null)}Ah(e,l,o,u);return;case"option":for(s in a)a.hasOwnProperty(s)&&(l=a[s],l!=null)&&(s==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":fe(e,t,s,l,a,null));return;case"dialog":j("beforetoggle",e),j("toggle",e),j("cancel",e),j("close",e);break;case"iframe":case"object":j("load",e);break;case"video":case"audio":for(l=0;l<un.length;l++)j(un[l],e);break;case"image":j("error",e),j("load",e);break;case"details":j("toggle",e);break;case"embed":case"source":case"link":j("error",e),j("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(i in a)if(a.hasOwnProperty(i)&&(l=a[i],l!=null))switch(i){case"children":case"dangerouslySetInnerHTML":throw Error(I(137,t));default:fe(e,t,i,l,a,null)}return;default:if(rc(t)){for(c in a)a.hasOwnProperty(c)&&(l=a[c],l!==void 0&&Xf(e,t,c,l,a,void 0));return}}for(r in a)a.hasOwnProperty(r)&&(l=a[r],l!=null&&fe(e,t,r,l,a,null))}function Xb(e,t,a,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var o=null,u=null,n=null,r=null,s=null,i=null,c=null;for(p in a){var d=a[p];if(a.hasOwnProperty(p)&&d!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":s=d;default:l.hasOwnProperty(p)||fe(e,t,p,null,l,d)}}for(var m in l){var p=l[m];if(d=a[m],l.hasOwnProperty(m)&&(p!=null||d!=null))switch(m){case"type":u=p;break;case"name":o=p;break;case"checked":i=p;break;case"defaultChecked":c=p;break;case"value":n=p;break;case"defaultValue":r=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(I(137,t));break;default:p!==d&&fe(e,t,m,p,l,d)}}gf(e,n,r,s,i,c,u,o);return;case"select":p=n=r=m=null;for(u in a)if(s=a[u],a.hasOwnProperty(u)&&s!=null)switch(u){case"value":break;case"multiple":p=s;default:l.hasOwnProperty(u)||fe(e,t,u,null,l,s)}for(o in l)if(u=l[o],s=a[o],l.hasOwnProperty(o)&&(u!=null||s!=null))switch(o){case"value":m=u;break;case"defaultValue":r=u;break;case"multiple":n=u;default:u!==s&&fe(e,t,o,u,l,s)}t=r,a=n,l=p,m!=null?zo(e,!!a,m,!1):!!l!=!!a&&(t!=null?zo(e,!!a,t,!0):zo(e,!!a,a?[]:"",!1));return;case"textarea":p=m=null;for(r in a)if(o=a[r],a.hasOwnProperty(r)&&o!=null&&!l.hasOwnProperty(r))switch(r){case"value":break;case"children":break;default:fe(e,t,r,null,l,o)}for(n in l)if(o=l[n],u=a[n],l.hasOwnProperty(n)&&(o!=null||u!=null))switch(n){case"value":m=o;break;case"defaultValue":p=o;break;case"children":break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(I(91));break;default:o!==u&&fe(e,t,n,o,l,u)}Rh(e,m,p);return;case"option":for(var L in a)m=a[L],a.hasOwnProperty(L)&&m!=null&&!l.hasOwnProperty(L)&&(L==="selected"?e.selected=!1:fe(e,t,L,null,l,m));for(s in l)m=l[s],p=a[s],l.hasOwnProperty(s)&&m!==p&&(m!=null||p!=null)&&(s==="selected"?e.selected=m&&typeof m!="function"&&typeof m!="symbol":fe(e,t,s,m,l,p));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var g in a)m=a[g],a.hasOwnProperty(g)&&m!=null&&!l.hasOwnProperty(g)&&fe(e,t,g,null,l,m);for(i in l)if(m=l[i],p=a[i],l.hasOwnProperty(i)&&m!==p&&(m!=null||p!=null))switch(i){case"children":case"dangerouslySetInnerHTML":if(m!=null)throw Error(I(137,t));break;default:fe(e,t,i,m,l,p)}return;default:if(rc(t)){for(var S in a)m=a[S],a.hasOwnProperty(S)&&m!==void 0&&!l.hasOwnProperty(S)&&Xf(e,t,S,void 0,l,m);for(c in l)m=l[c],p=a[c],!l.hasOwnProperty(c)||m===p||m===void 0&&p===void 0||Xf(e,t,c,m,l,p);return}}for(var h in a)m=a[h],a.hasOwnProperty(h)&&m!=null&&!l.hasOwnProperty(h)&&fe(e,t,h,null,l,m);for(d in l)m=l[d],p=a[d],!l.hasOwnProperty(d)||m===p||m==null&&p==null||fe(e,t,d,m,l,p)}function Fp(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function jb(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,a=performance.getEntriesByType("resource"),l=0;l<a.length;l++){var o=a[l],u=o.transferSize,n=o.initiatorType,r=o.duration;if(u&&r&&Fp(n)){for(n=0,r=o.responseEnd,l+=1;l<a.length;l++){var s=a[l],i=s.startTime;if(i>r)break;var c=s.transferSize,d=s.initiatorType;c&&Fp(d)&&(s=s.responseEnd,n+=c*(s<r?1:(r-i)/(s-i)))}if(--l,t+=8*(u+n)/(o.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var jf=null,Yf=null;function Gr(e){return e.nodeType===9?e:e.ownerDocument}function Gp(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Ex(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Zf(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var lf=null;function Yb(){var e=window.event;return e&&e.type==="popstate"?e===lf?!1:(lf=e,!0):(lf=null,!1)}var Ox=typeof setTimeout=="function"?setTimeout:void 0,Zb=typeof clearTimeout=="function"?clearTimeout:void 0,Vp=typeof Promise=="function"?Promise:void 0,Kb=typeof queueMicrotask=="function"?queueMicrotask:typeof Vp<"u"?function(e){return Vp.resolve(null).then(e).catch(Qb)}:Ox;function Qb(e){setTimeout(function(){throw e})}function Sl(e){return e==="head"}function Xp(e,t){var a=t,l=0;do{var o=a.nextSibling;if(e.removeChild(a),o&&o.nodeType===8)if(a=o.data,a==="/$"||a==="/&"){if(l===0){e.removeChild(o),$o(t);return}l--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")l++;else if(a==="html")Ku(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Ku(a);for(var u=a.firstChild;u;){var n=u.nextSibling,r=u.nodeName;u[hn]||r==="SCRIPT"||r==="STYLE"||r==="LINK"&&u.rel.toLowerCase()==="stylesheet"||a.removeChild(u),u=n}}else a==="body"&&Ku(e.ownerDocument.body);a=o}while(a);$o(t)}function jp(e,t){var a=e;e=0;do{var l=a.nextSibling;if(a.nodeType===1?t?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(t?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),l&&l.nodeType===8)if(a=l.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=l}while(a)}function Kf(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var a=t;switch(t=t.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Kf(a),nc(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function Wb(e,t,a,l){for(;e.nodeType===1;){var o=a;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[hn])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(u=e.getAttribute("rel"),u==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(u!==o.rel||e.getAttribute("href")!==(o.href==null||o.href===""?null:o.href)||e.getAttribute("crossorigin")!==(o.crossOrigin==null?null:o.crossOrigin)||e.getAttribute("title")!==(o.title==null?null:o.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(u=e.getAttribute("src"),(u!==(o.src==null?null:o.src)||e.getAttribute("type")!==(o.type==null?null:o.type)||e.getAttribute("crossorigin")!==(o.crossOrigin==null?null:o.crossOrigin))&&u&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var u=o.name==null?null:""+o.name;if(o.type==="hidden"&&e.getAttribute("name")===u)return e}else return e;if(e=Ut(e.nextSibling),e===null)break}return null}function Jb(e,t,a){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=Ut(e.nextSibling),e===null))return null;return e}function Bx(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Ut(e.nextSibling),e===null))return null;return e}function Qf(e){return e.data==="$?"||e.data==="$~"}function Wf(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function $b(e,t){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||a.readyState!=="loading")t();else{var l=function(){t(),a.removeEventListener("DOMContentLoaded",l)};a.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Ut(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Jf=null;function Yp(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(t===0)return Ut(e.nextSibling);t--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||t++}e=e.nextSibling}return null}function Zp(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(t===0)return e;t--}else a!=="/$"&&a!=="/&"||t++}e=e.previousSibling}return null}function Px(e,t,a){switch(t=Gr(a),e){case"html":if(e=t.documentElement,!e)throw Error(I(452));return e;case"head":if(e=t.head,!e)throw Error(I(453));return e;case"body":if(e=t.body,!e)throw Error(I(454));return e;default:throw Error(I(451))}}function Ku(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);nc(e)}var Ht=new Map,Kp=new Set;function Vr(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Ha=le.d;le.d={f:eI,r:tI,D:aI,C:lI,L:oI,m:uI,X:rI,S:nI,M:sI};function eI(){var e=Ha.f(),t=rs();return e||t}function tI(e){var t=tu(e);t!==null&&t.tag===5&&t.type==="form"?Tg(t):Ha.r(e)}var uu=typeof document>"u"?null:document;function Nx(e,t,a){var l=uu;if(l&&typeof t=="string"&&t){var o=Bt(t);o='link[rel="'+e+'"][href="'+o+'"]',typeof a=="string"&&(o+='[crossorigin="'+a+'"]'),Kp.has(o)||(Kp.add(o),e={rel:e,crossOrigin:a,href:t},l.querySelector(o)===null&&(t=l.createElement("link"),Qe(t,"link",e),Ge(t),l.head.appendChild(t)))}}function aI(e){Ha.D(e),Nx("dns-prefetch",e,null)}function lI(e,t){Ha.C(e,t),Nx("preconnect",e,t)}function oI(e,t,a){Ha.L(e,t,a);var l=uu;if(l&&e&&t){var o='link[rel="preload"][as="'+Bt(t)+'"]';t==="image"&&a&&a.imageSrcSet?(o+='[imagesrcset="'+Bt(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(o+='[imagesizes="'+Bt(a.imageSizes)+'"]')):o+='[href="'+Bt(e)+'"]';var u=o;switch(t){case"style":u=Jo(e);break;case"script":u=nu(e)}Ht.has(u)||(e=ye({rel:"preload",href:t==="image"&&a&&a.imageSrcSet?void 0:e,as:t},a),Ht.set(u,e),l.querySelector(o)!==null||t==="style"&&l.querySelector(yn(u))||t==="script"&&l.querySelector(Cn(u))||(t=l.createElement("link"),Qe(t,"link",e),Ge(t),l.head.appendChild(t)))}}function uI(e,t){Ha.m(e,t);var a=uu;if(a&&e){var l=t&&typeof t.as=="string"?t.as:"script",o='link[rel="modulepreload"][as="'+Bt(l)+'"][href="'+Bt(e)+'"]',u=o;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":u=nu(e)}if(!Ht.has(u)&&(e=ye({rel:"modulepreload",href:e},t),Ht.set(u,e),a.querySelector(o)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Cn(u)))return}l=a.createElement("link"),Qe(l,"link",e),Ge(l),a.head.appendChild(l)}}}function nI(e,t,a){Ha.S(e,t,a);var l=uu;if(l&&e){var o=No(l).hoistableStyles,u=Jo(e);t=t||"default";var n=o.get(u);if(!n){var r={loading:0,preload:null};if(n=l.querySelector(yn(u)))r.loading=5;else{e=ye({rel:"stylesheet",href:e,"data-precedence":t},a),(a=Ht.get(u))&&Xc(e,a);var s=n=l.createElement("link");Ge(s),Qe(s,"link",e),s._p=new Promise(function(i,c){s.onload=i,s.onerror=c}),s.addEventListener("load",function(){r.loading|=1}),s.addEventListener("error",function(){r.loading|=2}),r.loading|=4,gr(n,t,l)}n={type:"stylesheet",instance:n,count:1,state:r},o.set(u,n)}}}function rI(e,t){Ha.X(e,t);var a=uu;if(a&&e){var l=No(a).hoistableScripts,o=nu(e),u=l.get(o);u||(u=a.querySelector(Cn(o)),u||(e=ye({src:e,async:!0},t),(t=Ht.get(o))&&jc(e,t),u=a.createElement("script"),Ge(u),Qe(u,"link",e),a.head.appendChild(u)),u={type:"script",instance:u,count:1,state:null},l.set(o,u))}}function sI(e,t){Ha.M(e,t);var a=uu;if(a&&e){var l=No(a).hoistableScripts,o=nu(e),u=l.get(o);u||(u=a.querySelector(Cn(o)),u||(e=ye({src:e,async:!0,type:"module"},t),(t=Ht.get(o))&&jc(e,t),u=a.createElement("script"),Ge(u),Qe(u,"link",e),a.head.appendChild(u)),u={type:"script",instance:u,count:1,state:null},l.set(o,u))}}function Qp(e,t,a,l){var o=(o=ul.current)?Vr(o):null;if(!o)throw Error(I(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(t=Jo(a.href),a=No(o).hoistableStyles,l=a.get(t),l||(l={type:"style",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=Jo(a.href);var u=No(o).hoistableStyles,n=u.get(e);if(n||(o=o.ownerDocument||o,n={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},u.set(e,n),(u=o.querySelector(yn(e)))&&!u._p&&(n.instance=u,n.state.loading=5),Ht.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ht.set(e,a),u||iI(o,e,a,n.state))),t&&l===null)throw Error(I(528,""));return n}if(t&&l!==null)throw Error(I(529,""));return null;case"script":return t=a.async,a=a.src,typeof a=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=nu(a),a=No(o).hoistableScripts,l=a.get(t),l||(l={type:"script",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(I(444,e))}}function Jo(e){return'href="'+Bt(e)+'"'}function yn(e){return'link[rel="stylesheet"]['+e+"]"}function zx(e){return ye({},e,{"data-precedence":e.precedence,precedence:null})}function iI(e,t,a,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),Qe(t,"link",a),Ge(t),e.head.appendChild(t))}function nu(e){return'[src="'+Bt(e)+'"]'}function Cn(e){return"script[async]"+e}function Wp(e,t,a){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+Bt(a.href)+'"]');if(l)return t.instance=l,Ge(l),l;var o=ye({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),Ge(l),Qe(l,"style",o),gr(l,a.precedence,e),t.instance=l;case"stylesheet":o=Jo(a.href);var u=e.querySelector(yn(o));if(u)return t.state.loading|=4,t.instance=u,Ge(u),u;l=zx(a),(o=Ht.get(o))&&Xc(l,o),u=(e.ownerDocument||e).createElement("link"),Ge(u);var n=u;return n._p=new Promise(function(r,s){n.onload=r,n.onerror=s}),Qe(u,"link",l),t.state.loading|=4,gr(u,a.precedence,e),t.instance=u;case"script":return u=nu(a.src),(o=e.querySelector(Cn(u)))?(t.instance=o,Ge(o),o):(l=a,(o=Ht.get(u))&&(l=ye({},a),jc(l,o)),e=e.ownerDocument||e,o=e.createElement("script"),Ge(o),Qe(o,"link",l),e.head.appendChild(o),t.instance=o);case"void":return null;default:throw Error(I(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,gr(l,a.precedence,e));return t.instance}function gr(e,t,a){for(var l=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),o=l.length?l[l.length-1]:null,u=o,n=0;n<l.length;n++){var r=l[n];if(r.dataset.precedence===t)u=r;else if(u!==o)break}u?u.parentNode.insertBefore(e,u.nextSibling):(t=a.nodeType===9?a.head:a,t.insertBefore(e,t.firstChild))}function Xc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function jc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var xr=null;function Jp(e,t,a){if(xr===null){var l=new Map,o=xr=new Map;o.set(a,l)}else o=xr,l=o.get(a),l||(l=new Map,o.set(a,l));if(l.has(e))return l;for(l.set(e,null),a=a.getElementsByTagName(e),o=0;o<a.length;o++){var u=a[o];if(!(u[hn]||u[Ye]||e==="link"&&u.getAttribute("rel")==="stylesheet")&&u.namespaceURI!=="http://www.w3.org/2000/svg"){var n=u.getAttribute(t)||"";n=e+n;var r=l.get(n);r?r.push(u):l.set(n,[u])}}return l}function $p(e,t,a){e=e.ownerDocument||e,e.head.insertBefore(a,t==="title"?e.querySelector("head > title"):null)}function fI(e,t,a){if(a===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Ux(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function cI(e,t,a,l){if(a.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var o=Jo(l.href),u=t.querySelector(yn(o));if(u){t=u._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Xr.bind(e),t.then(e,e)),a.state.loading|=4,a.instance=u,Ge(u);return}u=t.ownerDocument||t,l=zx(l),(o=Ht.get(o))&&Xc(l,o),u=u.createElement("link"),Ge(u);var n=u;n._p=new Promise(function(r,s){n.onload=r,n.onerror=s}),Qe(u,"link",l),a.instance=u}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,t),(t=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=Xr.bind(e),t.addEventListener("load",a),t.addEventListener("error",a))}}var of=0;function dI(e,t){return e.stylesheets&&e.count===0&&Lr(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var l=setTimeout(function(){if(e.stylesheets&&Lr(e,e.stylesheets),e.unsuspend){var u=e.unsuspend;e.unsuspend=null,u()}},6e4+t);0<e.imgBytes&&of===0&&(of=62500*jb());var o=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Lr(e,e.stylesheets),e.unsuspend)){var u=e.unsuspend;e.unsuspend=null,u()}},(e.imgBytes>of?50:800)+t);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(o)}}:null}function Xr(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Lr(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var jr=null;function Lr(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,jr=new Map,t.forEach(mI,e),jr=null,Xr.call(e))}function mI(e,t){if(!(t.state.loading&4)){var a=jr.get(e);if(a)var l=a.get(null);else{a=new Map,jr.set(e,a);for(var o=e.querySelectorAll("link[data-precedence],style[data-precedence]"),u=0;u<o.length;u++){var n=o[u];(n.nodeName==="LINK"||n.getAttribute("media")!=="not all")&&(a.set(n.dataset.precedence,n),l=n)}l&&a.set(null,l)}o=t.instance,n=o.getAttribute("data-precedence"),u=a.get(n)||l,u===l&&a.set(null,o),a.set(n,o),this.count++,l=Xr.bind(this),o.addEventListener("load",l),o.addEventListener("error",l),u?u.parentNode.insertBefore(o,u.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(o,e.firstChild)),t.state.loading|=4}}var rn={$$typeof:Ta,Provider:null,Consumer:null,_currentValue:Bl,_currentValue2:Bl,_threadCount:0};function pI(e,t,a,l,o,u,n,r,s){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Di(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Di(0),this.hiddenUpdates=Di(null),this.identifierPrefix=l,this.onUncaughtError=o,this.onCaughtError=u,this.onRecoverableError=n,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=s,this.incompleteTransitions=new Map}function Hx(e,t,a,l,o,u,n,r,s,i,c,d){return e=new pI(e,t,a,n,s,i,c,d,r),t=1,u===!0&&(t|=24),u=vt(3,null,null,t),e.current=u,u.stateNode=e,t=Lc(),t.refCount++,e.pooledCache=t,t.refCount++,u.memoizedState={element:l,isDehydrated:a,cache:t},yc(u),e}function _x(e){return e?(e=Eo,e):Eo}function qx(e,t,a,l,o,u){o=_x(o),l.context===null?l.context=o:l.pendingContext=o,l=rl(t),l.payload={element:a},u=u===void 0?null:u,u!==null&&(l.callback=u),a=sl(e,l,t),a!==null&&(ct(a,e,t),qu(a,e,t))}function eh(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<t?a:t}}function Yc(e,t){eh(e,t),(e=e.alternate)&&eh(e,t)}function Fx(e){if(e.tag===13||e.tag===31){var t=Yl(e,67108864);t!==null&&ct(t,e,67108864),Yc(e,67108864)}}function th(e){if(e.tag===13||e.tag===31){var t=wt();t=oc(t);var a=Yl(e,t);a!==null&&ct(a,e,t),Yc(e,t)}}var Yr=!0;function hI(e,t,a,l){var o=N.T;N.T=null;var u=le.p;try{le.p=2,Zc(e,t,a,l)}finally{le.p=u,N.T=o}}function gI(e,t,a,l){var o=N.T;N.T=null;var u=le.p;try{le.p=8,Zc(e,t,a,l)}finally{le.p=u,N.T=o}}function Zc(e,t,a,l){if(Yr){var o=$f(l);if(o===null)af(e,t,l,Zr,a),ah(e,l);else if(LI(o,e,t,a,l))l.stopPropagation();else if(ah(e,l),t&4&&-1<xI.indexOf(e)){for(;o!==null;){var u=tu(o);if(u!==null)switch(u.tag){case 3:if(u=u.stateNode,u.current.memoizedState.isDehydrated){var n=kl(u.pendingLanes);if(n!==0){var r=u;for(r.pendingLanes|=2,r.entangledLanes|=2;n;){var s=1<<31-It(n);r.entanglements[1]|=s,n&=~s}fa(u),(ae&6)===0&&(zr=Ct()+500,vn(0,!1))}}break;case 31:case 13:r=Yl(u,2),r!==null&&ct(r,u,2),rs(),Yc(u,2)}if(u=$f(l),u===null&&af(e,t,l,Zr,a),u===o)break;o=u}o!==null&&l.stopPropagation()}else af(e,t,l,null,a)}}function $f(e){return e=sc(e),Kc(e)}var Zr=null;function Kc(e){if(Zr=null,e=Ro(e),e!==null){var t=cn(e);if(t===null)e=null;else{var a=t.tag;if(a===13){if(e=sh(t),e!==null)return e;e=null}else if(a===31){if(e=ih(t),e!==null)return e;e=null}else if(a===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Zr=e,null}function Gx(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(oC()){case mh:return 2;case ph:return 8;case br:case uC:return 32;case hh:return 268435456;default:return 32}default:return 32}}var ec=!1,cl=null,dl=null,ml=null,sn=new Map,fn=new Map,$a=[],xI="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function ah(e,t){switch(e){case"focusin":case"focusout":cl=null;break;case"dragenter":case"dragleave":dl=null;break;case"mouseover":case"mouseout":ml=null;break;case"pointerover":case"pointerout":sn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":fn.delete(t.pointerId)}}function Du(e,t,a,l,o,u){return e===null||e.nativeEvent!==u?(e={blockedOn:t,domEventName:a,eventSystemFlags:l,nativeEvent:u,targetContainers:[o]},t!==null&&(t=tu(t),t!==null&&Fx(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function LI(e,t,a,l,o){switch(t){case"focusin":return cl=Du(cl,e,t,a,l,o),!0;case"dragenter":return dl=Du(dl,e,t,a,l,o),!0;case"mouseover":return ml=Du(ml,e,t,a,l,o),!0;case"pointerover":var u=o.pointerId;return sn.set(u,Du(sn.get(u)||null,e,t,a,l,o)),!0;case"gotpointercapture":return u=o.pointerId,fn.set(u,Du(fn.get(u)||null,e,t,a,l,o)),!0}return!1}function Vx(e){var t=Ro(e.target);if(t!==null){var a=cn(t);if(a!==null){if(t=a.tag,t===13){if(t=sh(a),t!==null){e.blockedOn=t,Hm(e.priority,function(){th(a)});return}}else if(t===31){if(t=ih(a),t!==null){e.blockedOn=t,Hm(e.priority,function(){th(a)});return}}else if(t===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Sr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var a=$f(e.nativeEvent);if(a===null){a=e.nativeEvent;var l=new a.constructor(a.type,a);Lf=l,a.target.dispatchEvent(l),Lf=null}else return t=tu(a),t!==null&&Fx(t),e.blockedOn=a,!1;t.shift()}return!0}function lh(e,t,a){Sr(e)&&a.delete(t)}function SI(){ec=!1,cl!==null&&Sr(cl)&&(cl=null),dl!==null&&Sr(dl)&&(dl=null),ml!==null&&Sr(ml)&&(ml=null),sn.forEach(lh),fn.forEach(lh)}function lr(e,t){e.blockedOn===t&&(e.blockedOn=null,ec||(ec=!0,_e.unstable_scheduleCallback(_e.unstable_NormalPriority,SI)))}var or=null;function oh(e){or!==e&&(or=e,_e.unstable_scheduleCallback(_e.unstable_NormalPriority,function(){or===e&&(or=null);for(var t=0;t<e.length;t+=3){var a=e[t],l=e[t+1],o=e[t+2];if(typeof l!="function"){if(Kc(l||a)===null)continue;break}var u=tu(a);u!==null&&(e.splice(t,3),t-=3,Bf(u,{pending:!0,data:o,method:a.method,action:l},l,o))}}))}function $o(e){function t(s){return lr(s,e)}cl!==null&&lr(cl,e),dl!==null&&lr(dl,e),ml!==null&&lr(ml,e),sn.forEach(t),fn.forEach(t);for(var a=0;a<$a.length;a++){var l=$a[a];l.blockedOn===e&&(l.blockedOn=null)}for(;0<$a.length&&(a=$a[0],a.blockedOn===null);)Vx(a),a.blockedOn===null&&$a.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(l=0;l<a.length;l+=3){var o=a[l],u=a[l+1],n=o[dt]||null;if(typeof u=="function")n||oh(a);else if(n){var r=null;if(u&&u.hasAttribute("formAction")){if(o=u,n=u[dt]||null)r=n.formAction;else if(Kc(o)!==null)continue}else r=n.action;typeof r=="function"?a[l+1]=r:(a.splice(l,3),l-=3),oh(a)}}}function Xx(){function e(u){u.canIntercept&&u.info==="react-transition"&&u.intercept({handler:function(){return new Promise(function(n){return o=n})},focusReset:"manual",scroll:"manual"})}function t(){o!==null&&(o(),o=null),l||setTimeout(a,20)}function a(){if(!l&&!navigation.transition){var u=navigation.currentEntry;u&&u.url!=null&&navigation.navigate(u.url,{state:u.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,o=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(a,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),o!==null&&(o(),o=null)}}}function Qc(e){this._internalRoot=e}fs.prototype.render=Qc.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(I(409));var a=t.current,l=wt();qx(a,l,e,t,null,null)};fs.prototype.unmount=Qc.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;qx(e.current,2,null,e,null,null),rs(),t[eu]=null}};function fs(e){this._internalRoot=e}fs.prototype.unstable_scheduleHydration=function(e){if(e){var t=vh();e={blockedOn:null,target:e,priority:t};for(var a=0;a<$a.length&&t!==0&&t<$a[a].priority;a++);$a.splice(a,0,e),a===0&&Vx(e)}};var uh=nh.version;if(uh!=="19.2.7")throw Error(I(527,uh,"19.2.7"));le.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(I(188)):(e=Object.keys(e).join(","),Error(I(268,e)));return e=Wy(t),e=e!==null?fh(e):null,e=e===null?null:e.stateNode,e};var vI={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:N,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(ku=__REACT_DEVTOOLS_GLOBAL_HOOK__,!ku.isDisabled&&ku.supportsFiber))try{dn=ku.inject(vI),bt=ku}catch{}var ku;cs.createRoot=function(e,t){if(!rh(e))throw Error(I(299));var a=!1,l="",o=Ng,u=zg,n=Ug;return t!=null&&(t.unstable_strictMode===!0&&(a=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(u=t.onCaughtError),t.onRecoverableError!==void 0&&(n=t.onRecoverableError)),t=Hx(e,1,!1,null,null,a,l,null,o,u,n,Xx),e[eu]=t.current,Vc(e),new Qc(t)};cs.hydrateRoot=function(e,t,a){if(!rh(e))throw Error(I(299));var l=!1,o="",u=Ng,n=zg,r=Ug,s=null;return a!=null&&(a.unstable_strictMode===!0&&(l=!0),a.identifierPrefix!==void 0&&(o=a.identifierPrefix),a.onUncaughtError!==void 0&&(u=a.onUncaughtError),a.onCaughtError!==void 0&&(n=a.onCaughtError),a.onRecoverableError!==void 0&&(r=a.onRecoverableError),a.formState!==void 0&&(s=a.formState)),t=Hx(e,1,!0,t,a??null,l,o,s,u,n,r,Xx),t.context=_x(null),a=t.current,l=wt(),l=oc(l),o=rl(l),o.callback=null,sl(a,o,l),a=l,t.current.lanes=a,pn(t,a),fa(t),e[eu]=t.current,Vc(e),new fs(t)};cs.version="19.2.7"});var Kx=la((uA,Zx)=>{"use strict";function Yx(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Yx)}catch(e){console.error(e)}}Yx(),Zx.exports=jx()});var RL=la(Ls=>{"use strict";var x0=Symbol.for("react.transitional.element"),L0=Symbol.for("react.fragment");function wL(e,t,a){var l=null;if(a!==void 0&&(l=""+a),t.key!==void 0&&(l=""+t.key),"key"in t){a={};for(var o in t)o!=="key"&&(a[o]=t[o])}else a=t;return t=a.ref,{$$typeof:x0,type:e,key:l,ref:t!==void 0?t:null,props:a}}Ls.Fragment=L0;Ls.jsx=wL;Ls.jsxs=wL});var X=la((ZA,AL)=>{"use strict";AL.exports=RL()});var QR={},by=A(Kx(),1);var vu=A(P(),1);var ps=A(P(),1);var ds=(...e)=>e.filter((t,a,l)=>!!t&&t.trim()!==""&&l.indexOf(t)===a).join(" ").trim();var Qx=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();var Wx=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,a,l)=>l?l.toUpperCase():a.toLowerCase());var Wc=e=>{let t=Wx(e);return t.charAt(0).toUpperCase()+t.slice(1)};var bn=A(P(),1);var ms={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};var Jx=e=>{for(let t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};var ru=A(P(),1);var yI=(0,ru.createContext)({});var $x=()=>(0,ru.useContext)(yI);var eL=(0,bn.forwardRef)(({color:e,size:t,strokeWidth:a,absoluteStrokeWidth:l,className:o="",children:u,iconNode:n,...r},s)=>{let{size:i=24,strokeWidth:c=2,absoluteStrokeWidth:d=!1,color:m="currentColor",className:p=""}=$x()??{},L=l??d?Number(a??c)*24/Number(t??i):a??c;return(0,bn.createElement)("svg",{ref:s,...ms,width:t??i??ms.width,height:t??i??ms.height,stroke:e??m,strokeWidth:L,className:ds("lucide",p,o),...!u&&!Jx(r)&&{"aria-hidden":"true"},...r},[...n.map(([g,S])=>(0,bn.createElement)(g,S)),...Array.isArray(u)?u:[u]])});var ca=(e,t)=>{let a=(0,ps.forwardRef)(({className:l,...o},u)=>(0,ps.createElement)(eL,{ref:u,iconNode:t,className:ds(`lucide-${Qx(Wc(e))}`,`lucide-${e}`,l),...o}));return a.displayName=Wc(e),a};var CI=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],In=ca("chevron-down",CI);var bI=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],Kl=ca("plus",bI);var II=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],Ql=ca("trash-2",II);var wI=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],vl=ca("triangle-alert",wI);var RI=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],wn=ca("x",RI);var TL=A(P(),1);function tL(e){var t,a,l="";if(typeof e=="string"||typeof e=="number")l+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(a=tL(e[t]))&&(l&&(l+=" "),l+=a)}else for(a in e)e[a]&&(l&&(l+=" "),l+=a);return l}function hs(){for(var e,t,a=0,l="",o=arguments.length;a<o;a++)(e=arguments[a])&&(t=tL(e))&&(l&&(l+=" "),l+=t);return l}var aL=e=>typeof e=="boolean"?`${e}`:e===0?"0":e,lL=hs,oL=(e,t)=>a=>{var l;if(t?.variants==null)return lL(e,a?.class,a?.className);let{variants:o,defaultVariants:u}=t,n=Object.keys(o).map(i=>{let c=a?.[i],d=u?.[i];if(c===null)return null;let m=aL(c)||aL(d);return o[i][m]}),r=a&&Object.entries(a).reduce((i,c)=>{let[d,m]=c;return m===void 0||(i[d]=m),i},{}),s=t==null||(l=t.compoundVariants)===null||l===void 0?void 0:l.reduce((i,c)=>{let{class:d,className:m,...p}=c;return Object.entries(p).every(L=>{let[g,S]=L;return Array.isArray(S)?S.includes({...u,...r}[g]):{...u,...r}[g]===S})?[...i,d,m]:i},[]);return lL(e,n,s,a?.class,a?.className)};var AI=(e,t)=>{let a=new Array(e.length+t.length);for(let l=0;l<e.length;l++)a[l]=e[l];for(let l=0;l<t.length;l++)a[e.length+l]=t[l];return a},TI=(e,t)=>({classGroupId:e,validator:t}),fL=(e=new Map,t=null,a)=>({nextPart:e,validators:t,classGroupId:a});var uL=[],MI="arbitrary..",DI=e=>{let t=EI(e),{conflictingClassGroups:a,conflictingClassGroupModifiers:l}=e;return{getClassGroupId:n=>{if(n.startsWith("[")&&n.endsWith("]"))return kI(n);let r=n.split("-"),s=r[0]===""&&r.length>1?1:0;return cL(r,s,t)},getConflictingClassGroupIds:(n,r)=>{if(r){let s=l[n],i=a[n];return s?i?AI(i,s):s:i||uL}return a[n]||uL}}},cL=(e,t,a)=>{if(e.length-t===0)return a.classGroupId;let o=e[t],u=a.nextPart.get(o);if(u){let i=cL(e,t+1,u);if(i)return i}let n=a.validators;if(n===null)return;let r=t===0?e.join("-"):e.slice(t).join("-"),s=n.length;for(let i=0;i<s;i++){let c=n[i];if(c.validator(r))return c.classGroupId}},kI=e=>e.slice(1,-1).indexOf(":")===-1?void 0:(()=>{let t=e.slice(1,-1),a=t.indexOf(":"),l=t.slice(0,a);return l?MI+l:void 0})(),EI=e=>{let{theme:t,classGroups:a}=e;return OI(a,t)},OI=(e,t)=>{let a=fL();for(let l in e){let o=e[l];$c(o,a,l,t)}return a},$c=(e,t,a,l)=>{let o=e.length;for(let u=0;u<o;u++){let n=e[u];BI(n,t,a,l)}},BI=(e,t,a,l)=>{if(typeof e=="string"){PI(e,t,a);return}if(typeof e=="function"){NI(e,t,a,l);return}zI(e,t,a,l)},PI=(e,t,a)=>{let l=e===""?t:dL(t,e);l.classGroupId=a},NI=(e,t,a,l)=>{if(UI(e)){$c(e(l),t,a,l);return}t.validators===null&&(t.validators=[]),t.validators.push(TI(a,e))},zI=(e,t,a,l)=>{let o=Object.entries(e),u=o.length;for(let n=0;n<u;n++){let[r,s]=o[n];$c(s,dL(t,r),a,l)}},dL=(e,t)=>{let a=e,l=t.split("-"),o=l.length;for(let u=0;u<o;u++){let n=l[u],r=a.nextPart.get(n);r||(r=fL(),a.nextPart.set(n,r)),a=r}return a},UI=e=>"isThemeGetter"in e&&e.isThemeGetter===!0,HI=e=>{if(e<1)return{get:()=>{},set:()=>{}};let t=0,a=Object.create(null),l=Object.create(null),o=(u,n)=>{a[u]=n,t++,t>e&&(t=0,l=a,a=Object.create(null))};return{get(u){let n=a[u];if(n!==void 0)return n;if((n=l[u])!==void 0)return o(u,n),n},set(u,n){u in a?a[u]=n:o(u,n)}}};var _I=[],nL=(e,t,a,l,o)=>({modifiers:e,hasImportantModifier:t,baseClassName:a,maybePostfixModifierPosition:l,isExternal:o}),qI=e=>{let{prefix:t,experimentalParseClassName:a}=e,l=o=>{let u=[],n=0,r=0,s=0,i,c=o.length;for(let g=0;g<c;g++){let S=o[g];if(n===0&&r===0){if(S===":"){u.push(o.slice(s,g)),s=g+1;continue}if(S==="/"){i=g;continue}}S==="["?n++:S==="]"?n--:S==="("?r++:S===")"&&r--}let d=u.length===0?o:o.slice(s),m=d,p=!1;d.endsWith("!")?(m=d.slice(0,-1),p=!0):d.startsWith("!")&&(m=d.slice(1),p=!0);let L=i&&i>s?i-s:void 0;return nL(u,p,m,L)};if(t){let o=t+":",u=l;l=n=>n.startsWith(o)?u(n.slice(o.length)):nL(_I,!1,n,void 0,!0)}if(a){let o=l;l=u=>a({className:u,parseClassName:o})}return l},FI=e=>{let t=new Map;return e.orderSensitiveModifiers.forEach((a,l)=>{t.set(a,1e6+l)}),a=>{let l=[],o=[];for(let u=0;u<a.length;u++){let n=a[u],r=n[0]==="[",s=t.has(n);r||s?(o.length>0&&(o.sort(),l.push(...o),o=[]),l.push(n)):o.push(n)}return o.length>0&&(o.sort(),l.push(...o)),l}},GI=e=>({cache:HI(e.cacheSize),parseClassName:qI(e),sortModifiers:FI(e),postfixLookupClassGroupIds:VI(e),...DI(e)}),VI=e=>{let t=Object.create(null),a=e.postfixLookupClassGroups;if(a)for(let l=0;l<a.length;l++)t[a[l]]=!0;return t},XI=/\s+/,jI=(e,t)=>{let{parseClassName:a,getClassGroupId:l,getConflictingClassGroupIds:o,sortModifiers:u,postfixLookupClassGroupIds:n}=t,r=[],s=e.trim().split(XI),i="";for(let c=s.length-1;c>=0;c-=1){let d=s[c],{isExternal:m,modifiers:p,hasImportantModifier:L,baseClassName:g,maybePostfixModifierPosition:S}=a(d);if(m){i=d+(i.length>0?" "+i:i);continue}let h=!!S,f;if(h){let b=g.substring(0,S);f=l(b);let C=f&&n[f]?l(g):void 0;C&&C!==f&&(f=C,h=!1)}else f=l(g);if(!f){if(!h){i=d+(i.length>0?" "+i:i);continue}if(f=l(g),!f){i=d+(i.length>0?" "+i:i);continue}h=!1}let x=p.length===0?"":p.length===1?p[0]:u(p).join(":"),v=L?x+"!":x,y=v+f;if(r.indexOf(y)>-1)continue;r.push(y);let w=o(f,h);for(let b=0;b<w.length;++b){let C=w[b];r.push(v+C)}i=d+(i.length>0?" "+i:i)}return i},YI=(...e)=>{let t=0,a,l,o="";for(;t<e.length;)(a=e[t++])&&(l=mL(a))&&(o&&(o+=" "),o+=l);return o},mL=e=>{if(typeof e=="string")return e;let t,a="";for(let l=0;l<e.length;l++)e[l]&&(t=mL(e[l]))&&(a&&(a+=" "),a+=t);return a},ZI=(e,...t)=>{let a,l,o,u,n=s=>{let i=t.reduce((c,d)=>d(c),e());return a=GI(i),l=a.cache.get,o=a.cache.set,u=r,r(s)},r=s=>{let i=l(s);if(i)return i;let c=jI(s,a);return o(s,c),c};return u=n,(...s)=>u(YI(...s))},KI=[],qe=e=>{let t=a=>a[e]||KI;return t.isThemeGetter=!0,t},pL=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,hL=/^\((?:(\w[\w-]*):)?(.+)\)$/i,QI=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,WI=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,JI=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,$I=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,e0=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,t0=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,yl=e=>QI.test(e),V=e=>!!e&&!Number.isNaN(Number(e)),da=e=>!!e&&Number.isInteger(Number(e)),Jc=e=>e.endsWith("%")&&V(e.slice(0,-1)),_a=e=>WI.test(e),gL=()=>!0,a0=e=>JI.test(e)&&!$I.test(e),ed=()=>!1,l0=e=>e0.test(e),o0=e=>t0.test(e),u0=e=>!k(e)&&!E(e),n0=e=>e.startsWith("@container")&&(e[10]==="/"&&e[11]!==void 0||e[11]==="s"&&e[16]!==void 0&&e.startsWith("-size/",10)||e[11]==="n"&&e[18]!==void 0&&e.startsWith("-normal/",10)),r0=e=>Cl(e,SL,ed),k=e=>pL.test(e),Wl=e=>Cl(e,vL,a0),rL=e=>Cl(e,h0,V),s0=e=>Cl(e,CL,gL),i0=e=>Cl(e,yL,ed),sL=e=>Cl(e,xL,ed),f0=e=>Cl(e,LL,o0),gs=e=>Cl(e,bL,l0),E=e=>hL.test(e),Rn=e=>Jl(e,vL),c0=e=>Jl(e,yL),iL=e=>Jl(e,xL),d0=e=>Jl(e,SL),m0=e=>Jl(e,LL),xs=e=>Jl(e,bL,!0),p0=e=>Jl(e,CL,!0),Cl=(e,t,a)=>{let l=pL.exec(e);return l?l[1]?t(l[1]):a(l[2]):!1},Jl=(e,t,a=!1)=>{let l=hL.exec(e);return l?l[1]?t(l[1]):a:!1},xL=e=>e==="position"||e==="percentage",LL=e=>e==="image"||e==="url",SL=e=>e==="length"||e==="size"||e==="bg-size",vL=e=>e==="length",h0=e=>e==="number",yL=e=>e==="family-name",CL=e=>e==="number"||e==="weight",bL=e=>e==="shadow";var g0=()=>{let e=qe("color"),t=qe("font"),a=qe("text"),l=qe("font-weight"),o=qe("tracking"),u=qe("leading"),n=qe("breakpoint"),r=qe("container"),s=qe("spacing"),i=qe("radius"),c=qe("shadow"),d=qe("inset-shadow"),m=qe("text-shadow"),p=qe("drop-shadow"),L=qe("blur"),g=qe("perspective"),S=qe("aspect"),h=qe("ease"),f=qe("animate"),x=()=>["auto","avoid","all","avoid-page","page","left","right","column"],v=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],y=()=>[...v(),E,k],w=()=>["auto","hidden","clip","visible","scroll"],b=()=>["auto","contain","none"],C=()=>[E,k,s],R=()=>[yl,"full","auto",...C()],D=()=>[da,"none","subgrid",E,k],U=()=>["auto",{span:["full",da,E,k]},da,E,k],G=()=>[da,"auto",E,k],ee=()=>["auto","min","max","fr",E,k],Q=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],te=()=>["start","end","center","stretch","center-safe","end-safe"],q=()=>["auto",...C()],Z=()=>[yl,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...C()],z=()=>[yl,"screen","full","dvw","lvw","svw","min","max","fit",...C()],$=()=>[yl,"screen","full","lh","dvh","lvh","svh","min","max","fit",...C()],M=()=>[e,E,k],$e=()=>[...v(),iL,sL,{position:[E,k]}],gt=()=>["no-repeat",{repeat:["","x","y","space","round"]}],Yt=()=>["auto","cover","contain",d0,r0,{size:[E,k]}],Tt=()=>[Jc,Rn,Wl],Te=()=>["","none","full",i,E,k],Ae=()=>["",V,Rn,Wl],B=()=>["solid","dashed","dotted","double"],se=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],W=()=>[V,Jc,iL,sL],ie=()=>["","none",L,E,k],ue=()=>["none",V,E,k],xe=()=>["none",V,E,k],xt=()=>[V,E,k],Xe=()=>[yl,"full",...C()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[_a],breakpoint:[_a],color:[gL],container:[_a],"drop-shadow":[_a],ease:["in","out","in-out"],font:[u0],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[_a],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[_a],shadow:[_a],spacing:["px",V],text:[_a],"text-shadow":[_a],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",yl,k,E,S]}],container:["container"],"container-type":[{"@container":["","normal","size",E,k]}],"container-named":[n0],columns:[{columns:[V,k,E,r]}],"break-after":[{"break-after":x()}],"break-before":[{"break-before":x()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:y()}],overflow:[{overflow:w()}],"overflow-x":[{"overflow-x":w()}],"overflow-y":[{"overflow-y":w()}],overscroll:[{overscroll:b()}],"overscroll-x":[{"overscroll-x":b()}],"overscroll-y":[{"overscroll-y":b()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:R()}],"inset-x":[{"inset-x":R()}],"inset-y":[{"inset-y":R()}],start:[{"inset-s":R(),start:R()}],end:[{"inset-e":R(),end:R()}],"inset-bs":[{"inset-bs":R()}],"inset-be":[{"inset-be":R()}],top:[{top:R()}],right:[{right:R()}],bottom:[{bottom:R()}],left:[{left:R()}],visibility:["visible","invisible","collapse"],z:[{z:[da,"auto",E,k]}],basis:[{basis:[yl,"full","auto",r,...C()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[V,yl,"auto","initial","none",k]}],grow:[{grow:["",V,E,k]}],shrink:[{shrink:["",V,E,k]}],order:[{order:[da,"first","last","none",E,k]}],"grid-cols":[{"grid-cols":D()}],"col-start-end":[{col:U()}],"col-start":[{"col-start":G()}],"col-end":[{"col-end":G()}],"grid-rows":[{"grid-rows":D()}],"row-start-end":[{row:U()}],"row-start":[{"row-start":G()}],"row-end":[{"row-end":G()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":ee()}],"auto-rows":[{"auto-rows":ee()}],gap:[{gap:C()}],"gap-x":[{"gap-x":C()}],"gap-y":[{"gap-y":C()}],"justify-content":[{justify:[...Q(),"normal"]}],"justify-items":[{"justify-items":[...te(),"normal"]}],"justify-self":[{"justify-self":["auto",...te()]}],"align-content":[{content:["normal",...Q()]}],"align-items":[{items:[...te(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...te(),{baseline:["","last"]}]}],"place-content":[{"place-content":Q()}],"place-items":[{"place-items":[...te(),"baseline"]}],"place-self":[{"place-self":["auto",...te()]}],p:[{p:C()}],px:[{px:C()}],py:[{py:C()}],ps:[{ps:C()}],pe:[{pe:C()}],pbs:[{pbs:C()}],pbe:[{pbe:C()}],pt:[{pt:C()}],pr:[{pr:C()}],pb:[{pb:C()}],pl:[{pl:C()}],m:[{m:q()}],mx:[{mx:q()}],my:[{my:q()}],ms:[{ms:q()}],me:[{me:q()}],mbs:[{mbs:q()}],mbe:[{mbe:q()}],mt:[{mt:q()}],mr:[{mr:q()}],mb:[{mb:q()}],ml:[{ml:q()}],"space-x":[{"space-x":C()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":C()}],"space-y-reverse":["space-y-reverse"],size:[{size:Z()}],"inline-size":[{inline:["auto",...z()]}],"min-inline-size":[{"min-inline":["auto",...z()]}],"max-inline-size":[{"max-inline":["none",...z()]}],"block-size":[{block:["auto",...$()]}],"min-block-size":[{"min-block":["auto",...$()]}],"max-block-size":[{"max-block":["none",...$()]}],w:[{w:[r,"screen",...Z()]}],"min-w":[{"min-w":[r,"screen","none",...Z()]}],"max-w":[{"max-w":[r,"screen","none","prose",{screen:[n]},...Z()]}],h:[{h:["screen","lh",...Z()]}],"min-h":[{"min-h":["screen","lh","none",...Z()]}],"max-h":[{"max-h":["screen","lh",...Z()]}],"font-size":[{text:["base",a,Rn,Wl]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[l,p0,s0]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",Jc,k]}],"font-family":[{font:[c0,i0,t]}],"font-features":[{"font-features":[k]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[o,E,k]}],"line-clamp":[{"line-clamp":[V,"none",E,rL]}],leading:[{leading:[u,...C()]}],"list-image":[{"list-image":["none",E,k]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",E,k]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:M()}],"text-color":[{text:M()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...B(),"wavy"]}],"text-decoration-thickness":[{decoration:[V,"from-font","auto",E,Wl]}],"text-decoration-color":[{decoration:M()}],"underline-offset":[{"underline-offset":[V,"auto",E,k]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:C()}],"tab-size":[{tab:[da,E,k]}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",E,k]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",E,k]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:$e()}],"bg-repeat":[{bg:gt()}],"bg-size":[{bg:Yt()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},da,E,k],radial:["",E,k],conic:[da,E,k]},m0,f0]}],"bg-color":[{bg:M()}],"gradient-from-pos":[{from:Tt()}],"gradient-via-pos":[{via:Tt()}],"gradient-to-pos":[{to:Tt()}],"gradient-from":[{from:M()}],"gradient-via":[{via:M()}],"gradient-to":[{to:M()}],rounded:[{rounded:Te()}],"rounded-s":[{"rounded-s":Te()}],"rounded-e":[{"rounded-e":Te()}],"rounded-t":[{"rounded-t":Te()}],"rounded-r":[{"rounded-r":Te()}],"rounded-b":[{"rounded-b":Te()}],"rounded-l":[{"rounded-l":Te()}],"rounded-ss":[{"rounded-ss":Te()}],"rounded-se":[{"rounded-se":Te()}],"rounded-ee":[{"rounded-ee":Te()}],"rounded-es":[{"rounded-es":Te()}],"rounded-tl":[{"rounded-tl":Te()}],"rounded-tr":[{"rounded-tr":Te()}],"rounded-br":[{"rounded-br":Te()}],"rounded-bl":[{"rounded-bl":Te()}],"border-w":[{border:Ae()}],"border-w-x":[{"border-x":Ae()}],"border-w-y":[{"border-y":Ae()}],"border-w-s":[{"border-s":Ae()}],"border-w-e":[{"border-e":Ae()}],"border-w-bs":[{"border-bs":Ae()}],"border-w-be":[{"border-be":Ae()}],"border-w-t":[{"border-t":Ae()}],"border-w-r":[{"border-r":Ae()}],"border-w-b":[{"border-b":Ae()}],"border-w-l":[{"border-l":Ae()}],"divide-x":[{"divide-x":Ae()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":Ae()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...B(),"hidden","none"]}],"divide-style":[{divide:[...B(),"hidden","none"]}],"border-color":[{border:M()}],"border-color-x":[{"border-x":M()}],"border-color-y":[{"border-y":M()}],"border-color-s":[{"border-s":M()}],"border-color-e":[{"border-e":M()}],"border-color-bs":[{"border-bs":M()}],"border-color-be":[{"border-be":M()}],"border-color-t":[{"border-t":M()}],"border-color-r":[{"border-r":M()}],"border-color-b":[{"border-b":M()}],"border-color-l":[{"border-l":M()}],"divide-color":[{divide:M()}],"outline-style":[{outline:[...B(),"none","hidden"]}],"outline-offset":[{"outline-offset":[V,E,k]}],"outline-w":[{outline:["",V,Rn,Wl]}],"outline-color":[{outline:M()}],shadow:[{shadow:["","none",c,xs,gs]}],"shadow-color":[{shadow:M()}],"inset-shadow":[{"inset-shadow":["none",d,xs,gs]}],"inset-shadow-color":[{"inset-shadow":M()}],"ring-w":[{ring:Ae()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:M()}],"ring-offset-w":[{"ring-offset":[V,Wl]}],"ring-offset-color":[{"ring-offset":M()}],"inset-ring-w":[{"inset-ring":Ae()}],"inset-ring-color":[{"inset-ring":M()}],"text-shadow":[{"text-shadow":["none",m,xs,gs]}],"text-shadow-color":[{"text-shadow":M()}],opacity:[{opacity:[V,E,k]}],"mix-blend":[{"mix-blend":[...se(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":se()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[V]}],"mask-image-linear-from-pos":[{"mask-linear-from":W()}],"mask-image-linear-to-pos":[{"mask-linear-to":W()}],"mask-image-linear-from-color":[{"mask-linear-from":M()}],"mask-image-linear-to-color":[{"mask-linear-to":M()}],"mask-image-t-from-pos":[{"mask-t-from":W()}],"mask-image-t-to-pos":[{"mask-t-to":W()}],"mask-image-t-from-color":[{"mask-t-from":M()}],"mask-image-t-to-color":[{"mask-t-to":M()}],"mask-image-r-from-pos":[{"mask-r-from":W()}],"mask-image-r-to-pos":[{"mask-r-to":W()}],"mask-image-r-from-color":[{"mask-r-from":M()}],"mask-image-r-to-color":[{"mask-r-to":M()}],"mask-image-b-from-pos":[{"mask-b-from":W()}],"mask-image-b-to-pos":[{"mask-b-to":W()}],"mask-image-b-from-color":[{"mask-b-from":M()}],"mask-image-b-to-color":[{"mask-b-to":M()}],"mask-image-l-from-pos":[{"mask-l-from":W()}],"mask-image-l-to-pos":[{"mask-l-to":W()}],"mask-image-l-from-color":[{"mask-l-from":M()}],"mask-image-l-to-color":[{"mask-l-to":M()}],"mask-image-x-from-pos":[{"mask-x-from":W()}],"mask-image-x-to-pos":[{"mask-x-to":W()}],"mask-image-x-from-color":[{"mask-x-from":M()}],"mask-image-x-to-color":[{"mask-x-to":M()}],"mask-image-y-from-pos":[{"mask-y-from":W()}],"mask-image-y-to-pos":[{"mask-y-to":W()}],"mask-image-y-from-color":[{"mask-y-from":M()}],"mask-image-y-to-color":[{"mask-y-to":M()}],"mask-image-radial":[{"mask-radial":[E,k]}],"mask-image-radial-from-pos":[{"mask-radial-from":W()}],"mask-image-radial-to-pos":[{"mask-radial-to":W()}],"mask-image-radial-from-color":[{"mask-radial-from":M()}],"mask-image-radial-to-color":[{"mask-radial-to":M()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":v()}],"mask-image-conic-pos":[{"mask-conic":[V]}],"mask-image-conic-from-pos":[{"mask-conic-from":W()}],"mask-image-conic-to-pos":[{"mask-conic-to":W()}],"mask-image-conic-from-color":[{"mask-conic-from":M()}],"mask-image-conic-to-color":[{"mask-conic-to":M()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:$e()}],"mask-repeat":[{mask:gt()}],"mask-size":[{mask:Yt()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",E,k]}],filter:[{filter:["","none",E,k]}],blur:[{blur:ie()}],brightness:[{brightness:[V,E,k]}],contrast:[{contrast:[V,E,k]}],"drop-shadow":[{"drop-shadow":["","none",p,xs,gs]}],"drop-shadow-color":[{"drop-shadow":M()}],grayscale:[{grayscale:["",V,E,k]}],"hue-rotate":[{"hue-rotate":[V,E,k]}],invert:[{invert:["",V,E,k]}],saturate:[{saturate:[V,E,k]}],sepia:[{sepia:["",V,E,k]}],"backdrop-filter":[{"backdrop-filter":["","none",E,k]}],"backdrop-blur":[{"backdrop-blur":ie()}],"backdrop-brightness":[{"backdrop-brightness":[V,E,k]}],"backdrop-contrast":[{"backdrop-contrast":[V,E,k]}],"backdrop-grayscale":[{"backdrop-grayscale":["",V,E,k]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[V,E,k]}],"backdrop-invert":[{"backdrop-invert":["",V,E,k]}],"backdrop-opacity":[{"backdrop-opacity":[V,E,k]}],"backdrop-saturate":[{"backdrop-saturate":[V,E,k]}],"backdrop-sepia":[{"backdrop-sepia":["",V,E,k]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":C()}],"border-spacing-x":[{"border-spacing-x":C()}],"border-spacing-y":[{"border-spacing-y":C()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",E,k]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[V,"initial",E,k]}],ease:[{ease:["linear","initial",h,E,k]}],delay:[{delay:[V,E,k]}],animate:[{animate:["none",f,E,k]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[g,E,k]}],"perspective-origin":[{"perspective-origin":y()}],rotate:[{rotate:ue()}],"rotate-x":[{"rotate-x":ue()}],"rotate-y":[{"rotate-y":ue()}],"rotate-z":[{"rotate-z":ue()}],scale:[{scale:xe()}],"scale-x":[{"scale-x":xe()}],"scale-y":[{"scale-y":xe()}],"scale-z":[{"scale-z":xe()}],"scale-3d":["scale-3d"],skew:[{skew:xt()}],"skew-x":[{"skew-x":xt()}],"skew-y":[{"skew-y":xt()}],transform:[{transform:[E,k,"","none","gpu","cpu"]}],"transform-origin":[{origin:y()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:Xe()}],"translate-x":[{"translate-x":Xe()}],"translate-y":[{"translate-y":Xe()}],"translate-z":[{"translate-z":Xe()}],"translate-none":["translate-none"],zoom:[{zoom:[da,E,k]}],accent:[{accent:M()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:M()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",E,k]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scrollbar-thumb-color":[{"scrollbar-thumb":M()}],"scrollbar-track-color":[{"scrollbar-track":M()}],"scrollbar-gutter":[{"scrollbar-gutter":["auto","stable","both"]}],"scrollbar-w":[{scrollbar:["auto","thin","none"]}],"scroll-m":[{"scroll-m":C()}],"scroll-mx":[{"scroll-mx":C()}],"scroll-my":[{"scroll-my":C()}],"scroll-ms":[{"scroll-ms":C()}],"scroll-me":[{"scroll-me":C()}],"scroll-mbs":[{"scroll-mbs":C()}],"scroll-mbe":[{"scroll-mbe":C()}],"scroll-mt":[{"scroll-mt":C()}],"scroll-mr":[{"scroll-mr":C()}],"scroll-mb":[{"scroll-mb":C()}],"scroll-ml":[{"scroll-ml":C()}],"scroll-p":[{"scroll-p":C()}],"scroll-px":[{"scroll-px":C()}],"scroll-py":[{"scroll-py":C()}],"scroll-ps":[{"scroll-ps":C()}],"scroll-pe":[{"scroll-pe":C()}],"scroll-pbs":[{"scroll-pbs":C()}],"scroll-pbe":[{"scroll-pbe":C()}],"scroll-pt":[{"scroll-pt":C()}],"scroll-pr":[{"scroll-pr":C()}],"scroll-pb":[{"scroll-pb":C()}],"scroll-pl":[{"scroll-pl":C()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",E,k]}],fill:[{fill:["none",...M()]}],"stroke-w":[{stroke:[V,Rn,Wl,rL]}],stroke:[{stroke:["none",...M()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{"container-named":["container-type"],overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},postfixLookupClassGroups:["container-type"],orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}};var IL=ZI(g0);function qa(...e){return IL(hs(e))}var ML=A(X(),1),S0=oL("inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-md-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-8 px-3.5",sm:"h-7 px-2.5",lg:"h-9 px-4",icon:"h-8 w-8"}},defaultVariants:{variant:"default",size:"default"}}),_t=(0,TL.forwardRef)(({className:e,variant:t,size:a,...l},o)=>(0,ML.jsx)("button",{className:qa(S0({variant:t,size:a,className:e})),ref:o,...l}));_t.displayName="Button";var su=A(X(),1);function DL({title:e,onClose:t}){return(0,su.jsxs)("div",{className:"flex items-center justify-between px-5 py-3 border-b border-border shrink-0 bg-background",children:[(0,su.jsx)("h2",{className:"text-md-lg font-semibold text-foreground",children:e}),(0,su.jsx)(_t,{variant:"ghost",size:"icon",onClick:t,className:"h-8 w-8 text-muted-foreground hover:text-foreground",children:(0,su.jsx)(wn,{className:"h-4 w-4"})})]})}var qt=A(X(),1);function kL({data:e}){return(0,qt.jsxs)("div",{className:"flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 bg-muted/50 border-b border-border text-md-xs shrink-0",children:[(0,qt.jsxs)("div",{className:"flex flex-col",children:[(0,qt.jsx)("span",{className:"text-muted-foreground uppercase tracking-wider font-semibold text-[9px]",children:"No. RM"}),(0,qt.jsx)("span",{className:"text-md-sm font-mono font-medium text-foreground",children:e.norm})]}),(0,qt.jsxs)("div",{className:"flex flex-col border-l border-border pl-6",children:[(0,qt.jsx)("span",{className:"text-muted-foreground uppercase tracking-wider font-semibold text-[9px]",children:"Nama Pasien"}),(0,qt.jsx)("span",{className:"text-md-sm font-medium text-foreground",children:e.pasien})]}),(0,qt.jsxs)("div",{className:"flex flex-col border-l border-border pl-6",children:[(0,qt.jsx)("span",{className:"text-muted-foreground uppercase tracking-wider font-semibold text-[9px]",children:"Dokter"}),(0,qt.jsx)("span",{className:"text-md-sm font-medium text-foreground",children:e.nama_dokter})]})]})}var Wt=A(X(),1);function EL({anamnesa:e,pemeriksaan:t,onChange:a}){return(0,Wt.jsxs)("div",{className:"px-5 py-4 border-b border-border bg-background",children:[(0,Wt.jsx)("h3",{className:"text-md-sm font-semibold text-foreground mb-3",children:"Data Klinis"}),(0,Wt.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,Wt.jsxs)("div",{children:[(0,Wt.jsx)("label",{className:"block text-[10px] font-semibold text-muted-foreground uppercase mb-1.5 ml-1",children:"Anamnesa"}),(0,Wt.jsx)("textarea",{value:e,onChange:l=>a("anamnesa",l.target.value),className:"w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-md-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none",placeholder:"Keluhan pasien..."})]}),(0,Wt.jsxs)("div",{children:[(0,Wt.jsx)("label",{className:"block text-[10px] font-semibold text-muted-foreground uppercase mb-1.5 ml-1",children:"Pemeriksaan Fisik"}),(0,Wt.jsx)("textarea",{value:t,onChange:l=>a("pemeriksaan",l.target.value),className:"w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-md-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none",placeholder:"Hasil pemeriksaan..."})]})]})]})}var OL=A(P(),1);var BL=A(X(),1),Fa=(0,OL.forwardRef)(({className:e,type:t,...a},l)=>(0,BL.jsx)("input",{type:t,className:qa("flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-md-sm text-foreground","placeholder:text-muted-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1","disabled:cursor-not-allowed disabled:opacity-50",e),ref:l,...a}));Fa.displayName="Input";var ma=A(X(),1);function PL({vitals:e,onChange:t}){return(0,ma.jsxs)("div",{className:"px-5 py-4 border-b border-border bg-background",children:[(0,ma.jsx)("h3",{className:"text-md-sm font-semibold text-foreground mb-3",children:"Tanda Vital"}),(0,ma.jsx)("div",{className:"grid grid-cols-6 gap-3",children:[{key:"tensi",label:"Tensi",unit:"mmHg",placeholder:"120/80"},{key:"nadi",label:"Nadi",unit:"x/mnt",placeholder:"80"},{key:"suhu",label:"Suhu",unit:"\xB0C",placeholder:"36.5"},{key:"nafas",label:"Nafas",unit:"x/mnt",placeholder:"20"},{key:"berat",label:"Berat",unit:"kg",placeholder:"60"},{key:"tinggi",label:"Tinggi",unit:"cm",placeholder:"165"}].map(l=>(0,ma.jsxs)("div",{className:"space-y-1.5",children:[(0,ma.jsx)("label",{className:"text-[10px] font-semibold text-muted-foreground uppercase ml-1",children:l.label}),(0,ma.jsxs)("div",{className:"relative",children:[(0,ma.jsx)(Fa,{value:e[l.key],onChange:o=>t(l.key,o.target.value),placeholder:l.placeholder,className:"pr-10 text-md-xs h-9"}),(0,ma.jsx)("span",{className:"absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-medium text-muted-foreground/60 pointer-events-none",children:l.unit})]})]},l.key))})]})}var mo=A(P(),1);var li=A(P(),1);var T=A(P(),1),Xd=A(Lo(),1);function td(e,[t,a]){return Math.min(a,Math.max(t,e))}var s1=!!(typeof window<"u"&&window.document&&window.document.createElement);function ke(e,t,{checkForDefaultPrevented:a=!0}={}){return function(o){if(e?.(o),a===!1||!o.defaultPrevented)return t?.(o)}}var Jt=A(P(),1);var Ga=A(P(),1),NL=A(X(),1);function iu(e,t=[]){let a=[];function l(u,n){let r=Ga.createContext(n);r.displayName=u+"Context";let s=a.length;a=[...a,n];let i=d=>{let{scope:m,children:p,...L}=d,g=m?.[e]?.[s]||r,S=Ga.useMemo(()=>L,Object.values(L));return(0,NL.jsx)(g.Provider,{value:S,children:p})};i.displayName=u+"Provider";function c(d,m){let p=m?.[e]?.[s]||r,L=Ga.useContext(p);if(L)return L;if(n!==void 0)return n;throw new Error(`\`${d}\` must be used within \`${u}\``)}return[i,c]}let o=()=>{let u=a.map(n=>Ga.createContext(n));return function(r){let s=r?.[e]||u;return Ga.useMemo(()=>({[`__scope${e}`]:{...r,[e]:s}}),[r,s])}};return o.scopeName=e,[l,v0(o,...t)]}function v0(...e){let t=e[0];if(e.length===1)return t;let a=()=>{let l=e.map(o=>({useScope:o(),scopeName:o.scopeName}));return function(u){let n=l.reduce((r,{useScope:s,scopeName:i})=>{let d=s(u)[`__scope${i}`];return{...r,...d}},{});return Ga.useMemo(()=>({[`__scope${t.scopeName}`]:n}),[n])}};return a.scopeName=t.scopeName,a}var UL=A(P(),1);function zL(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function y0(...e){return t=>{let a=!1,l=e.map(o=>{let u=zL(o,t);return!a&&typeof u=="function"&&(a=!0),u});if(a)return()=>{for(let o=0;o<l.length;o++){let u=l[o];typeof u=="function"?u():zL(e[o],null)}}}}function we(...e){return UL.useCallback(y0(...e),e)}var We=A(P(),1);function $l(e){let t=We.forwardRef((a,l)=>{let{children:o,...u}=a,n=null,r=!1,s=[];HL(o)&&typeof Ss=="function"&&(o=Ss(o._payload)),We.Children.forEach(o,m=>{if(R0(m)){r=!0;let p=m,L="child"in p.props?p.props.child:p.props.children;HL(L)&&typeof Ss=="function"&&(L=Ss(L._payload)),n=b0(p,L),s.push(n?.props?.children)}else s.push(m)}),n?n=We.cloneElement(n,void 0,s):!r&&We.Children.count(o)===1&&We.isValidElement(o)&&(n=o);let i=n?w0(n):void 0,c=we(l,i);if(!n){if(o||o===0)throw new Error(r?D0(e):M0(e));return o}let d=I0(u,n.props??{});return n.type!==We.Fragment&&(d.ref=l?c:i),We.cloneElement(n,d)});return t.displayName=`${e}.Slot`,t}var C0=Symbol.for("radix.slottable");var b0=(e,t)=>{if("child"in e.props){let a=e.props.child;return We.isValidElement(a)?We.cloneElement(a,void 0,e.props.children(a.props.children)):null}return We.isValidElement(t)?t:null};function I0(e,t){let a={...t};for(let l in t){let o=e[l],u=t[l];/^on[A-Z]/.test(l)?o&&u?a[l]=(...r)=>{let s=u(...r);return o(...r),s}:o&&(a[l]=o):l==="style"?a[l]={...o,...u}:l==="className"&&(a[l]=[o,u].filter(Boolean).join(" "))}return{...e,...a}}function w0(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning;return a?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning,a?e.props.ref:e.props.ref||e.ref)}function R0(e){return We.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===C0}var A0=Symbol.for("react.lazy");function HL(e){return e!=null&&typeof e=="object"&&"$$typeof"in e&&e.$$typeof===A0&&"_payload"in e&&T0(e._payload)}function T0(e){return typeof e=="object"&&e!==null&&"then"in e}var M0=e=>`${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`,D0=e=>`${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`,Ss=We[" use ".trim().toString()];var vs=A(X(),1),ys=A(P(),1);var k0=A(X(),1);function _L(e){let t=e+"CollectionProvider",[a,l]=iu(t),[o,u]=a(t,{collectionRef:{current:null},itemMap:new Map}),n=g=>{let{scope:S,children:h}=g,f=Jt.useRef(null),x=Jt.useRef(new Map).current;return(0,vs.jsx)(o,{scope:S,itemMap:x,collectionRef:f,children:h})};n.displayName=t;let r=e+"CollectionSlot",s=$l(r),i=Jt.forwardRef((g,S)=>{let{scope:h,children:f}=g,x=u(r,h),v=we(S,x.collectionRef);return(0,vs.jsx)(s,{ref:v,children:f})});i.displayName=r;let c=e+"CollectionItemSlot",d="data-radix-collection-item",m=$l(c),p=Jt.forwardRef((g,S)=>{let{scope:h,children:f,...x}=g,v=Jt.useRef(null),y=we(S,v),w=u(c,h);return Jt.useEffect(()=>(w.itemMap.set(v,{ref:v,...x}),()=>{w.itemMap.delete(v)})),(0,vs.jsx)(m,{[d]:"",ref:y,children:f})});p.displayName=c;function L(g){let S=u(e+"CollectionConsumer",g);return Jt.useCallback(()=>{let f=S.collectionRef.current;if(!f)return[];let x=Array.from(f.querySelectorAll(`[${d}]`));return Array.from(S.itemMap.values()).sort((w,b)=>x.indexOf(w.ref.current)-x.indexOf(b.ref.current))},[S.collectionRef,S.itemMap])}return[{Provider:n,Slot:i,ItemSlot:p},L,l]}var Cs=A(P(),1),E0=A(X(),1),O0=Cs.createContext(void 0);function qL(e){let t=Cs.useContext(O0);return e||t||"ltr"}var ge=A(P(),1);var FL=A(P(),1),GL=A(Lo(),1);var VL=A(X(),1),B0=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],de=B0.reduce((e,t)=>{let a=$l(`Primitive.${t}`),l=FL.forwardRef((o,u)=>{let{asChild:n,...r}=o,s=n?a:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),(0,VL.jsx)(s,{...r,ref:u})});return l.displayName=`Primitive.${t}`,{...e,[t]:l}},{});function XL(e,t){e&&GL.flushSync(()=>e.dispatchEvent(t))}var fu=A(P(),1);function Ft(e){let t=fu.useRef(e);return fu.useEffect(()=>{t.current=e}),fu.useMemo(()=>((...a)=>t.current?.(...a)),[])}var jL=A(P(),1);function YL(e,t=globalThis?.document){let a=Ft(e);jL.useEffect(()=>{let l=o=>{o.key==="Escape"&&a(o)};return t.addEventListener("keydown",l,{capture:!0}),()=>t.removeEventListener("keydown",l,{capture:!0})},[a,t])}var ld=A(X(),1),P0="DismissableLayer",ad="dismissableLayer.update",N0="dismissableLayer.pointerDownOutside",z0="dismissableLayer.focusOutside",ZL,QL=ge.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set,dismissableSurfaces:new Set}),od=ge.forwardRef((e,t)=>{let{disableOutsidePointerEvents:a=!1,deferPointerDownOutside:l=!1,onEscapeKeyDown:o,onPointerDownOutside:u,onFocusOutside:n,onInteractOutside:r,onDismiss:s,...i}=e,c=ge.useContext(QL),[d,m]=ge.useState(null),p=d?.ownerDocument??globalThis?.document,[,L]=ge.useState({}),g=we(t,R=>m(R)),S=Array.from(c.layers),[h]=[...c.layersWithOutsidePointerEventsDisabled].slice(-1),f=S.indexOf(h),x=d?S.indexOf(d):-1,v=c.layersWithOutsidePointerEventsDisabled.size>0,y=x>=f,w=ge.useRef(!1),b=_0(R=>{let D=R.target;if(!(D instanceof Node))return;let U=[...c.branches].some(G=>G.contains(D));!y||U||(u?.(R),r?.(R),R.defaultPrevented||s?.())},{ownerDocument:p,deferPointerDownOutside:l,isDeferredPointerDownOutsideRef:w,dismissableSurfaces:c.dismissableSurfaces}),C=q0(R=>{if(l&&w.current)return;let D=R.target;[...c.branches].some(G=>G.contains(D))||(n?.(R),r?.(R),R.defaultPrevented||s?.())},p);return YL(R=>{x===c.layers.size-1&&(o?.(R),!R.defaultPrevented&&s&&(R.preventDefault(),s()))},p),ge.useEffect(()=>{if(d)return a&&(c.layersWithOutsidePointerEventsDisabled.size===0&&(ZL=p.body.style.pointerEvents,p.body.style.pointerEvents="none"),c.layersWithOutsidePointerEventsDisabled.add(d)),c.layers.add(d),KL(),()=>{a&&(c.layersWithOutsidePointerEventsDisabled.delete(d),c.layersWithOutsidePointerEventsDisabled.size===0&&(p.body.style.pointerEvents=ZL))}},[d,p,a,c]),ge.useEffect(()=>()=>{d&&(c.layers.delete(d),c.layersWithOutsidePointerEventsDisabled.delete(d),KL())},[d,c]),ge.useEffect(()=>{let R=()=>L({});return document.addEventListener(ad,R),()=>document.removeEventListener(ad,R)},[]),(0,ld.jsx)(de.div,{...i,ref:g,style:{pointerEvents:v?y?"auto":"none":void 0,...e.style},onFocusCapture:ke(e.onFocusCapture,C.onFocusCapture),onBlurCapture:ke(e.onBlurCapture,C.onBlurCapture),onPointerDownCapture:ke(e.onPointerDownCapture,b.onPointerDownCapture)})});od.displayName=P0;var U0="DismissableLayerBranch",H0=ge.forwardRef((e,t)=>{let a=ge.useContext(QL),l=ge.useRef(null),o=we(t,l);return ge.useEffect(()=>{let u=l.current;if(u)return a.branches.add(u),()=>{a.branches.delete(u)}},[a.branches]),(0,ld.jsx)(de.div,{...e,ref:o})});H0.displayName=U0;function _0(e,t){let{ownerDocument:a=globalThis?.document,deferPointerDownOutside:l=!1,isDeferredPointerDownOutsideRef:o,dismissableSurfaces:u}=t,n=Ft(e),r=ge.useRef(!1),s=ge.useRef(!1),i=ge.useRef(new Map),c=ge.useRef(()=>{});return ge.useEffect(()=>{function d(){s.current=!1,o.current=!1,i.current.clear()}function m(){return Array.from(i.current.values()).some(Boolean)}function p(f){if(!s.current)return;let x=f.target;x instanceof Node&&[...u].some(y=>y.contains(x))||i.current.set(f.type,!0),f.type==="click"&&window.setTimeout(()=>{s.current&&c.current()},0)}function L(f){s.current&&i.current.set(f.type,!1)}let g=f=>{if(f.target&&!r.current){let v=function(){a.removeEventListener("click",c.current);let w=m();d(),w||WL(N0,n,y,{discrete:!0})};var x=v;let y={originalEvent:f};s.current=!0,o.current=l&&f.button===0,i.current.clear(),!l||f.button!==0?v():(a.removeEventListener("click",c.current),c.current=v,a.addEventListener("click",c.current,{once:!0}))}else a.removeEventListener("click",c.current),d();r.current=!1},S=["pointerup","mousedown","mouseup","touchstart","touchend","click"];for(let f of S)a.addEventListener(f,p,!0),a.addEventListener(f,L);let h=window.setTimeout(()=>{a.addEventListener("pointerdown",g)},0);return()=>{window.clearTimeout(h),a.removeEventListener("pointerdown",g),a.removeEventListener("click",c.current);for(let f of S)a.removeEventListener(f,p,!0),a.removeEventListener(f,L)}},[a,n,l,o,u]),{onPointerDownCapture:()=>r.current=!0}}function q0(e,t=globalThis?.document){let a=Ft(e),l=ge.useRef(!1);return ge.useEffect(()=>{let o=u=>{u.target&&!l.current&&WL(z0,a,{originalEvent:u},{discrete:!1})};return t.addEventListener("focusin",o),()=>t.removeEventListener("focusin",o)},[t,a]),{onFocusCapture:()=>l.current=!0,onBlurCapture:()=>l.current=!1}}function KL(){let e=new CustomEvent(ad);document.dispatchEvent(e)}function WL(e,t,a,{discrete:l}){let o=a.originalEvent.target,u=new CustomEvent(e,{bubbles:!1,cancelable:!0,detail:a});t&&o.addEventListener(e,t,{once:!0}),l?XL(o,u):o.dispatchEvent(u)}var $L=A(P(),1),bs=0,cu=null;function eS(){$L.useEffect(()=>{cu||(cu={start:JL(),end:JL()});let{start:e,end:t}=cu;return document.body.firstElementChild!==e&&document.body.insertAdjacentElement("afterbegin",e),document.body.lastElementChild!==t&&document.body.insertAdjacentElement("beforeend",t),bs++,()=>{bs===1&&(cu?.start.remove(),cu?.end.remove(),cu=null),bs=Math.max(0,bs-1)}},[])}function JL(){let e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.outline="none",e.style.opacity="0",e.style.position="fixed",e.style.pointerEvents="none",e}var Gt=A(P(),1);var uS=A(X(),1),ud="focusScope.autoFocusOnMount",nd="focusScope.autoFocusOnUnmount",tS={bubbles:!1,cancelable:!0},F0="FocusScope",rd=Gt.forwardRef((e,t)=>{let{loop:a=!1,trapped:l=!1,onMountAutoFocus:o,onUnmountAutoFocus:u,...n}=e,[r,s]=Gt.useState(null),i=Ft(o),c=Ft(u),d=Gt.useRef(null),m=we(t,g=>s(g)),p=Gt.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;Gt.useEffect(()=>{if(l){let f=function(w){if(p.paused||!r)return;let b=w.target;r.contains(b)?d.current=b:bl(d.current,{select:!0})},x=function(w){if(p.paused||!r)return;let b=w.relatedTarget;b!==null&&(r.contains(b)||bl(d.current,{select:!0}))},v=function(w){if(document.activeElement===document.body)for(let C of w)C.removedNodes.length>0&&bl(r)};var g=f,S=x,h=v;document.addEventListener("focusin",f),document.addEventListener("focusout",x);let y=new MutationObserver(v);return r&&y.observe(r,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",f),document.removeEventListener("focusout",x),y.disconnect()}}},[l,r,p.paused]),Gt.useEffect(()=>{if(r){lS.add(p);let g=document.activeElement;if(!r.contains(g)){let h=new CustomEvent(ud,tS);r.addEventListener(ud,i),r.dispatchEvent(h),h.defaultPrevented||(G0(Z0(nS(r)),{select:!0}),document.activeElement===g&&bl(r))}return()=>{r.removeEventListener(ud,i),setTimeout(()=>{let h=new CustomEvent(nd,tS);r.addEventListener(nd,c),r.dispatchEvent(h),h.defaultPrevented||bl(g??document.body,{select:!0}),r.removeEventListener(nd,c),lS.remove(p)},0)}}},[r,i,c,p]);let L=Gt.useCallback(g=>{if(!a&&!l||p.paused)return;let S=g.key==="Tab"&&!g.altKey&&!g.ctrlKey&&!g.metaKey,h=document.activeElement;if(S&&h){let f=g.currentTarget,[x,v]=V0(f);x&&v?!g.shiftKey&&h===v?(g.preventDefault(),a&&bl(x,{select:!0})):g.shiftKey&&h===x&&(g.preventDefault(),a&&bl(v,{select:!0})):h===f&&g.preventDefault()}},[a,l,p.paused]);return(0,uS.jsx)(de.div,{tabIndex:-1,...n,ref:m,onKeyDown:L})});rd.displayName=F0;function G0(e,{select:t=!1}={}){let a=document.activeElement;for(let l of e)if(bl(l,{select:t}),document.activeElement!==a)return}function V0(e){let t=nS(e),a=aS(t,e),l=aS(t.reverse(),e);return[a,l]}function nS(e){let t=[],a=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:l=>{let o=l.tagName==="INPUT"&&l.type==="hidden";return l.disabled||l.hidden||o?NodeFilter.FILTER_SKIP:l.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;a.nextNode();)t.push(a.currentNode);return t}function aS(e,t){for(let a of e)if(!X0(a,{upTo:t}))return a}function X0(e,{upTo:t}){if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(t!==void 0&&e===t)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1}function j0(e){return e instanceof HTMLInputElement&&"select"in e}function bl(e,{select:t=!1}={}){if(e&&e.focus){let a=document.activeElement;e.focus({preventScroll:!0}),e!==a&&j0(e)&&t&&e.select()}}var lS=Y0();function Y0(){let e=[];return{add(t){let a=e[0];t!==a&&a?.pause(),e=oS(e,t),e.unshift(t)},remove(t){e=oS(e,t),e[0]?.resume()}}}function oS(e,t){let a=[...e],l=a.indexOf(t);return l!==-1&&a.splice(l,1),a}function Z0(e){return e.filter(t=>t.tagName!=="A")}var sd=A(P(),1);var rS=A(P(),1),Re=globalThis?.document?rS.useLayoutEffect:()=>{};var K0=sd[" useId ".trim().toString()]||(()=>{}),Q0=0;function Is(e){let[t,a]=sd.useState(K0());return Re(()=>{e||a(l=>l??String(Q0++))},[e]),e||(t?`radix-${t}`:"")}var Je=A(P(),1);var fS=["top","right","bottom","left"];var pa=Math.min,nt=Math.max,Tn=Math.round,Mn=Math.floor,$t=e=>({x:e,y:e}),W0={left:"right",right:"left",bottom:"top",top:"bottom"};function Rs(e,t,a){return nt(e,pa(t,a))}function ha(e,t){return typeof e=="function"?e(t):e}function ga(e){return e.split("-")[0]}function eo(e){return e.split("-")[1]}function As(e){return e==="x"?"y":"x"}function Ts(e){return e==="y"?"height":"width"}function ea(e){let t=e[0];return t==="t"||t==="b"?"y":"x"}function Ms(e){return As(ea(e))}function cS(e,t,a){a===void 0&&(a=!1);let l=eo(e),o=Ms(e),u=Ts(o),n=o==="x"?l===(a?"end":"start")?"right":"left":l==="start"?"bottom":"top";return t.reference[u]>t.floating[u]&&(n=An(n)),[n,An(n)]}function dS(e){let t=An(e);return[ws(e),t,ws(t)]}function ws(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}var sS=["left","right"],iS=["right","left"],J0=["top","bottom"],$0=["bottom","top"];function ew(e,t,a){switch(e){case"top":case"bottom":return a?t?iS:sS:t?sS:iS;case"left":case"right":return t?J0:$0;default:return[]}}function mS(e,t,a,l){let o=eo(e),u=ew(ga(e),a==="start",l);return o&&(u=u.map(n=>n+"-"+o),t&&(u=u.concat(u.map(ws)))),u}function An(e){let t=ga(e);return W0[t]+e.slice(t.length)}function tw(e){return{top:0,right:0,bottom:0,left:0,...e}}function id(e){return typeof e!="number"?tw(e):{top:e,right:e,bottom:e,left:e}}function to(e){let{x:t,y:a,width:l,height:o}=e;return{width:l,height:o,top:a,left:t,right:t+l,bottom:a+o,x:t,y:a}}function pS(e,t,a){let{reference:l,floating:o}=e,u=ea(t),n=Ms(t),r=Ts(n),s=ga(t),i=u==="y",c=l.x+l.width/2-o.width/2,d=l.y+l.height/2-o.height/2,m=l[r]/2-o[r]/2,p;switch(s){case"top":p={x:c,y:l.y-o.height};break;case"bottom":p={x:c,y:l.y+l.height};break;case"right":p={x:l.x+l.width,y:d};break;case"left":p={x:l.x-o.width,y:d};break;default:p={x:l.x,y:l.y}}switch(eo(t)){case"start":p[n]-=m*(a&&i?-1:1);break;case"end":p[n]+=m*(a&&i?-1:1);break}return p}async function xS(e,t){var a;t===void 0&&(t={});let{x:l,y:o,platform:u,rects:n,elements:r,strategy:s}=e,{boundary:i="clippingAncestors",rootBoundary:c="viewport",elementContext:d="floating",altBoundary:m=!1,padding:p=0}=ha(t,e),L=id(p),S=r[m?d==="floating"?"reference":"floating":d],h=to(await u.getClippingRect({element:(a=await(u.isElement==null?void 0:u.isElement(S)))==null||a?S:S.contextElement||await(u.getDocumentElement==null?void 0:u.getDocumentElement(r.floating)),boundary:i,rootBoundary:c,strategy:s})),f=d==="floating"?{x:l,y:o,width:n.floating.width,height:n.floating.height}:n.reference,x=await(u.getOffsetParent==null?void 0:u.getOffsetParent(r.floating)),v=await(u.isElement==null?void 0:u.isElement(x))?await(u.getScale==null?void 0:u.getScale(x))||{x:1,y:1}:{x:1,y:1},y=to(u.convertOffsetParentRelativeRectToViewportRelativeRect?await u.convertOffsetParentRelativeRectToViewportRelativeRect({elements:r,rect:f,offsetParent:x,strategy:s}):f);return{top:(h.top-y.top+L.top)/v.y,bottom:(y.bottom-h.bottom+L.bottom)/v.y,left:(h.left-y.left+L.left)/v.x,right:(y.right-h.right+L.right)/v.x}}var aw=50,LS=async(e,t,a)=>{let{placement:l="bottom",strategy:o="absolute",middleware:u=[],platform:n}=a,r=n.detectOverflow?n:{...n,detectOverflow:xS},s=await(n.isRTL==null?void 0:n.isRTL(t)),i=await n.getElementRects({reference:e,floating:t,strategy:o}),{x:c,y:d}=pS(i,l,s),m=l,p=0,L={};for(let g=0;g<u.length;g++){let S=u[g];if(!S)continue;let{name:h,fn:f}=S,{x,y:v,data:y,reset:w}=await f({x:c,y:d,initialPlacement:l,placement:m,strategy:o,middlewareData:L,rects:i,platform:r,elements:{reference:e,floating:t}});c=x??c,d=v??d,L[h]={...L[h],...y},w&&p<aw&&(p++,typeof w=="object"&&(w.placement&&(m=w.placement),w.rects&&(i=w.rects===!0?await n.getElementRects({reference:e,floating:t,strategy:o}):w.rects),{x:c,y:d}=pS(i,m,s)),g=-1)}return{x:c,y:d,placement:m,strategy:o,middlewareData:L}},SS=e=>({name:"arrow",options:e,async fn(t){let{x:a,y:l,placement:o,rects:u,platform:n,elements:r,middlewareData:s}=t,{element:i,padding:c=0}=ha(e,t)||{};if(i==null)return{};let d=id(c),m={x:a,y:l},p=Ms(o),L=Ts(p),g=await n.getDimensions(i),S=p==="y",h=S?"top":"left",f=S?"bottom":"right",x=S?"clientHeight":"clientWidth",v=u.reference[L]+u.reference[p]-m[p]-u.floating[L],y=m[p]-u.reference[p],w=await(n.getOffsetParent==null?void 0:n.getOffsetParent(i)),b=w?w[x]:0;(!b||!await(n.isElement==null?void 0:n.isElement(w)))&&(b=r.floating[x]||u.floating[L]);let C=v/2-y/2,R=b/2-g[L]/2-1,D=pa(d[h],R),U=pa(d[f],R),G=D,ee=b-g[L]-U,Q=b/2-g[L]/2+C,te=Rs(G,Q,ee),q=!s.arrow&&eo(o)!=null&&Q!==te&&u.reference[L]/2-(Q<G?D:U)-g[L]/2<0,Z=q?Q<G?Q-G:Q-ee:0;return{[p]:m[p]+Z,data:{[p]:te,centerOffset:Q-te-Z,...q&&{alignmentOffset:Z}},reset:q}}});var vS=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var a,l;let{placement:o,middlewareData:u,rects:n,initialPlacement:r,platform:s,elements:i}=t,{mainAxis:c=!0,crossAxis:d=!0,fallbackPlacements:m,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:L="none",flipAlignment:g=!0,...S}=ha(e,t);if((a=u.arrow)!=null&&a.alignmentOffset)return{};let h=ga(o),f=ea(r),x=ga(r)===r,v=await(s.isRTL==null?void 0:s.isRTL(i.floating)),y=m||(x||!g?[An(r)]:dS(r)),w=L!=="none";!m&&w&&y.push(...mS(r,g,L,v));let b=[r,...y],C=await s.detectOverflow(t,S),R=[],D=((l=u.flip)==null?void 0:l.overflows)||[];if(c&&R.push(C[h]),d){let Q=cS(o,n,v);R.push(C[Q[0]],C[Q[1]])}if(D=[...D,{placement:o,overflows:R}],!R.every(Q=>Q<=0)){var U,G;let Q=(((U=u.flip)==null?void 0:U.index)||0)+1,te=b[Q];if(te&&(!(d==="alignment"?f!==ea(te):!1)||D.every(z=>ea(z.placement)===f?z.overflows[0]>0:!0)))return{data:{index:Q,overflows:D},reset:{placement:te}};let q=(G=D.filter(Z=>Z.overflows[0]<=0).sort((Z,z)=>Z.overflows[1]-z.overflows[1])[0])==null?void 0:G.placement;if(!q)switch(p){case"bestFit":{var ee;let Z=(ee=D.filter(z=>{if(w){let $=ea(z.placement);return $===f||$==="y"}return!0}).map(z=>[z.placement,z.overflows.filter($=>$>0).reduce(($,M)=>$+M,0)]).sort((z,$)=>z[1]-$[1])[0])==null?void 0:ee[0];Z&&(q=Z);break}case"initialPlacement":q=r;break}if(o!==q)return{reset:{placement:q}}}return{}}}};function hS(e,t){return{top:e.top-t.height,right:e.right-t.width,bottom:e.bottom-t.height,left:e.left-t.width}}function gS(e){return fS.some(t=>e[t]>=0)}var yS=function(e){return e===void 0&&(e={}),{name:"hide",options:e,async fn(t){let{rects:a,platform:l}=t,{strategy:o="referenceHidden",...u}=ha(e,t);switch(o){case"referenceHidden":{let n=await l.detectOverflow(t,{...u,elementContext:"reference"}),r=hS(n,a.reference);return{data:{referenceHiddenOffsets:r,referenceHidden:gS(r)}}}case"escaped":{let n=await l.detectOverflow(t,{...u,altBoundary:!0}),r=hS(n,a.floating);return{data:{escapedOffsets:r,escaped:gS(r)}}}default:return{}}}}};var CS=new Set(["left","top"]);async function lw(e,t){let{placement:a,platform:l,elements:o}=e,u=await(l.isRTL==null?void 0:l.isRTL(o.floating)),n=ga(a),r=eo(a),s=ea(a)==="y",i=CS.has(n)?-1:1,c=u&&s?-1:1,d=ha(t,e),{mainAxis:m,crossAxis:p,alignmentAxis:L}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return r&&typeof L=="number"&&(p=r==="end"?L*-1:L),s?{x:p*c,y:m*i}:{x:m*i,y:p*c}}var bS=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var a,l;let{x:o,y:u,placement:n,middlewareData:r}=t,s=await lw(t,e);return n===((a=r.offset)==null?void 0:a.placement)&&(l=r.arrow)!=null&&l.alignmentOffset?{}:{x:o+s.x,y:u+s.y,data:{...s,placement:n}}}}},IS=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){let{x:a,y:l,placement:o,platform:u}=t,{mainAxis:n=!0,crossAxis:r=!1,limiter:s={fn:h=>{let{x:f,y:x}=h;return{x:f,y:x}}},...i}=ha(e,t),c={x:a,y:l},d=await u.detectOverflow(t,i),m=ea(ga(o)),p=As(m),L=c[p],g=c[m];if(n){let h=p==="y"?"top":"left",f=p==="y"?"bottom":"right",x=L+d[h],v=L-d[f];L=Rs(x,L,v)}if(r){let h=m==="y"?"top":"left",f=m==="y"?"bottom":"right",x=g+d[h],v=g-d[f];g=Rs(x,g,v)}let S=s.fn({...t,[p]:L,[m]:g});return{...S,data:{x:S.x-a,y:S.y-l,enabled:{[p]:n,[m]:r}}}}}},wS=function(e){return e===void 0&&(e={}),{options:e,fn(t){let{x:a,y:l,placement:o,rects:u,middlewareData:n}=t,{offset:r=0,mainAxis:s=!0,crossAxis:i=!0}=ha(e,t),c={x:a,y:l},d=ea(o),m=As(d),p=c[m],L=c[d],g=ha(r,t),S=typeof g=="number"?{mainAxis:g,crossAxis:0}:{mainAxis:0,crossAxis:0,...g};if(s){let x=m==="y"?"height":"width",v=u.reference[m]-u.floating[x]+S.mainAxis,y=u.reference[m]+u.reference[x]-S.mainAxis;p<v?p=v:p>y&&(p=y)}if(i){var h,f;let x=m==="y"?"width":"height",v=CS.has(ga(o)),y=u.reference[d]-u.floating[x]+(v&&((h=n.offset)==null?void 0:h[d])||0)+(v?0:S.crossAxis),w=u.reference[d]+u.reference[x]+(v?0:((f=n.offset)==null?void 0:f[d])||0)-(v?S.crossAxis:0);L<y?L=y:L>w&&(L=w)}return{[m]:p,[d]:L}}}},RS=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var a,l;let{placement:o,rects:u,platform:n,elements:r}=t,{apply:s=()=>{},...i}=ha(e,t),c=await n.detectOverflow(t,i),d=ga(o),m=eo(o),p=ea(o)==="y",{width:L,height:g}=u.floating,S,h;d==="top"||d==="bottom"?(S=d,h=m===(await(n.isRTL==null?void 0:n.isRTL(r.floating))?"start":"end")?"left":"right"):(h=d,S=m==="end"?"top":"bottom");let f=g-c.top-c.bottom,x=L-c.left-c.right,v=pa(g-c[S],f),y=pa(L-c[h],x),w=!t.middlewareData.shift,b=v,C=y;if((a=t.middlewareData.shift)!=null&&a.enabled.x&&(C=x),(l=t.middlewareData.shift)!=null&&l.enabled.y&&(b=f),w&&!m){let D=nt(c.left,0),U=nt(c.right,0),G=nt(c.top,0),ee=nt(c.bottom,0);p?C=L-2*(D!==0||U!==0?D+U:nt(c.left,c.right)):b=g-2*(G!==0||ee!==0?G+ee:nt(c.top,c.bottom))}await s({...t,availableWidth:C,availableHeight:b});let R=await n.getDimensions(r.floating);return L!==R.width||g!==R.height?{reset:{rects:!0}}:{}}}};function Ds(){return typeof window<"u"}function oo(e){return TS(e)?(e.nodeName||"").toLowerCase():"#document"}function pt(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function ta(e){var t;return(t=(TS(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function TS(e){return Ds()?e instanceof Node||e instanceof pt(e).Node:!1}function Vt(e){return Ds()?e instanceof Element||e instanceof pt(e).Element:!1}function xa(e){return Ds()?e instanceof HTMLElement||e instanceof pt(e).HTMLElement:!1}function AS(e){return!Ds()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof pt(e).ShadowRoot}function du(e){let{overflow:t,overflowX:a,overflowY:l,display:o}=Xt(e);return/auto|scroll|overlay|hidden|clip/.test(t+l+a)&&o!=="inline"&&o!=="contents"}function MS(e){return/^(table|td|th)$/.test(oo(e))}function Dn(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}var ow=/transform|translate|scale|rotate|perspective|filter/,uw=/paint|layout|strict|content/,ao=e=>!!e&&e!=="none",fd;function ks(e){let t=Vt(e)?Xt(e):e;return ao(t.transform)||ao(t.translate)||ao(t.scale)||ao(t.rotate)||ao(t.perspective)||!Es()&&(ao(t.backdropFilter)||ao(t.filter))||ow.test(t.willChange||"")||uw.test(t.contain||"")}function DS(e){let t=Va(e);for(;xa(t)&&!uo(t);){if(ks(t))return t;if(Dn(t))return null;t=Va(t)}return null}function Es(){return fd==null&&(fd=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),fd}function uo(e){return/^(html|body|#document)$/.test(oo(e))}function Xt(e){return pt(e).getComputedStyle(e)}function kn(e){return Vt(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Va(e){if(oo(e)==="html")return e;let t=e.assignedSlot||e.parentNode||AS(e)&&e.host||ta(e);return AS(t)?t.host:t}function kS(e){let t=Va(e);return uo(t)?e.ownerDocument?e.ownerDocument.body:e.body:xa(t)&&du(t)?t:kS(t)}function lo(e,t,a){var l;t===void 0&&(t=[]),a===void 0&&(a=!0);let o=kS(e),u=o===((l=e.ownerDocument)==null?void 0:l.body),n=pt(o);if(u){let r=Os(n);return t.concat(n,n.visualViewport||[],du(o)?o:[],r&&a?lo(r):[])}else return t.concat(o,lo(o,[],a))}function Os(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function PS(e){let t=Xt(e),a=parseFloat(t.width)||0,l=parseFloat(t.height)||0,o=xa(e),u=o?e.offsetWidth:a,n=o?e.offsetHeight:l,r=Tn(a)!==u||Tn(l)!==n;return r&&(a=u,l=n),{width:a,height:l,$:r}}function dd(e){return Vt(e)?e:e.contextElement}function mu(e){let t=dd(e);if(!xa(t))return $t(1);let a=t.getBoundingClientRect(),{width:l,height:o,$:u}=PS(t),n=(u?Tn(a.width):a.width)/l,r=(u?Tn(a.height):a.height)/o;return(!n||!Number.isFinite(n))&&(n=1),(!r||!Number.isFinite(r))&&(r=1),{x:n,y:r}}var nw=$t(0);function NS(e){let t=pt(e);return!Es()||!t.visualViewport?nw:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function rw(e,t,a){return t===void 0&&(t=!1),!a||t&&a!==pt(e)?!1:t}function no(e,t,a,l){t===void 0&&(t=!1),a===void 0&&(a=!1);let o=e.getBoundingClientRect(),u=dd(e),n=$t(1);t&&(l?Vt(l)&&(n=mu(l)):n=mu(e));let r=rw(u,a,l)?NS(u):$t(0),s=(o.left+r.x)/n.x,i=(o.top+r.y)/n.y,c=o.width/n.x,d=o.height/n.y;if(u){let m=pt(u),p=l&&Vt(l)?pt(l):l,L=m,g=Os(L);for(;g&&l&&p!==L;){let S=mu(g),h=g.getBoundingClientRect(),f=Xt(g),x=h.left+(g.clientLeft+parseFloat(f.paddingLeft))*S.x,v=h.top+(g.clientTop+parseFloat(f.paddingTop))*S.y;s*=S.x,i*=S.y,c*=S.x,d*=S.y,s+=x,i+=v,L=pt(g),g=Os(L)}}return to({width:c,height:d,x:s,y:i})}function Bs(e,t){let a=kn(e).scrollLeft;return t?t.left+a:no(ta(e)).left+a}function zS(e,t){let a=e.getBoundingClientRect(),l=a.left+t.scrollLeft-Bs(e,a),o=a.top+t.scrollTop;return{x:l,y:o}}function sw(e){let{elements:t,rect:a,offsetParent:l,strategy:o}=e,u=o==="fixed",n=ta(l),r=t?Dn(t.floating):!1;if(l===n||r&&u)return a;let s={scrollLeft:0,scrollTop:0},i=$t(1),c=$t(0),d=xa(l);if((d||!d&&!u)&&((oo(l)!=="body"||du(n))&&(s=kn(l)),d)){let p=no(l);i=mu(l),c.x=p.x+l.clientLeft,c.y=p.y+l.clientTop}let m=n&&!d&&!u?zS(n,s):$t(0);return{width:a.width*i.x,height:a.height*i.y,x:a.x*i.x-s.scrollLeft*i.x+c.x+m.x,y:a.y*i.y-s.scrollTop*i.y+c.y+m.y}}function iw(e){return Array.from(e.getClientRects())}function fw(e){let t=ta(e),a=kn(e),l=e.ownerDocument.body,o=nt(t.scrollWidth,t.clientWidth,l.scrollWidth,l.clientWidth),u=nt(t.scrollHeight,t.clientHeight,l.scrollHeight,l.clientHeight),n=-a.scrollLeft+Bs(e),r=-a.scrollTop;return Xt(l).direction==="rtl"&&(n+=nt(t.clientWidth,l.clientWidth)-o),{width:o,height:u,x:n,y:r}}var ES=25;function cw(e,t){let a=pt(e),l=ta(e),o=a.visualViewport,u=l.clientWidth,n=l.clientHeight,r=0,s=0;if(o){u=o.width,n=o.height;let c=Es();(!c||c&&t==="fixed")&&(r=o.offsetLeft,s=o.offsetTop)}let i=Bs(l);if(i<=0){let c=l.ownerDocument,d=c.body,m=getComputedStyle(d),p=c.compatMode==="CSS1Compat"&&parseFloat(m.marginLeft)+parseFloat(m.marginRight)||0,L=Math.abs(l.clientWidth-d.clientWidth-p);L<=ES&&(u-=L)}else i<=ES&&(u+=i);return{width:u,height:n,x:r,y:s}}function dw(e,t){let a=no(e,!0,t==="fixed"),l=a.top+e.clientTop,o=a.left+e.clientLeft,u=xa(e)?mu(e):$t(1),n=e.clientWidth*u.x,r=e.clientHeight*u.y,s=o*u.x,i=l*u.y;return{width:n,height:r,x:s,y:i}}function OS(e,t,a){let l;if(t==="viewport")l=cw(e,a);else if(t==="document")l=fw(ta(e));else if(Vt(t))l=dw(t,a);else{let o=NS(e);l={x:t.x-o.x,y:t.y-o.y,width:t.width,height:t.height}}return to(l)}function US(e,t){let a=Va(e);return a===t||!Vt(a)||uo(a)?!1:Xt(a).position==="fixed"||US(a,t)}function mw(e,t){let a=t.get(e);if(a)return a;let l=lo(e,[],!1).filter(r=>Vt(r)&&oo(r)!=="body"),o=null,u=Xt(e).position==="fixed",n=u?Va(e):e;for(;Vt(n)&&!uo(n);){let r=Xt(n),s=ks(n);!s&&r.position==="fixed"&&(o=null),(u?!s&&!o:!s&&r.position==="static"&&!!o&&(o.position==="absolute"||o.position==="fixed")||du(n)&&!s&&US(e,n))?l=l.filter(c=>c!==n):o=r,n=Va(n)}return t.set(e,l),l}function pw(e){let{element:t,boundary:a,rootBoundary:l,strategy:o}=e,n=[...a==="clippingAncestors"?Dn(t)?[]:mw(t,this._c):[].concat(a),l],r=OS(t,n[0],o),s=r.top,i=r.right,c=r.bottom,d=r.left;for(let m=1;m<n.length;m++){let p=OS(t,n[m],o);s=nt(p.top,s),i=pa(p.right,i),c=pa(p.bottom,c),d=nt(p.left,d)}return{width:i-d,height:c-s,x:d,y:s}}function hw(e){let{width:t,height:a}=PS(e);return{width:t,height:a}}function gw(e,t,a){let l=xa(t),o=ta(t),u=a==="fixed",n=no(e,!0,u,t),r={scrollLeft:0,scrollTop:0},s=$t(0);function i(){s.x=Bs(o)}if(l||!l&&!u)if((oo(t)!=="body"||du(o))&&(r=kn(t)),l){let p=no(t,!0,u,t);s.x=p.x+t.clientLeft,s.y=p.y+t.clientTop}else o&&i();u&&!l&&o&&i();let c=o&&!l&&!u?zS(o,r):$t(0),d=n.left+r.scrollLeft-s.x-c.x,m=n.top+r.scrollTop-s.y-c.y;return{x:d,y:m,width:n.width,height:n.height}}function cd(e){return Xt(e).position==="static"}function BS(e,t){if(!xa(e)||Xt(e).position==="fixed")return null;if(t)return t(e);let a=e.offsetParent;return ta(e)===a&&(a=a.ownerDocument.body),a}function HS(e,t){let a=pt(e);if(Dn(e))return a;if(!xa(e)){let o=Va(e);for(;o&&!uo(o);){if(Vt(o)&&!cd(o))return o;o=Va(o)}return a}let l=BS(e,t);for(;l&&MS(l)&&cd(l);)l=BS(l,t);return l&&uo(l)&&cd(l)&&!ks(l)?a:l||DS(e)||a}var xw=async function(e){let t=this.getOffsetParent||HS,a=this.getDimensions,l=await a(e.floating);return{reference:gw(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:l.width,height:l.height}}};function Lw(e){return Xt(e).direction==="rtl"}var _S={convertOffsetParentRelativeRectToViewportRelativeRect:sw,getDocumentElement:ta,getClippingRect:pw,getOffsetParent:HS,getElementRects:xw,getClientRects:iw,getDimensions:hw,getScale:mu,isElement:Vt,isRTL:Lw};function qS(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Sw(e,t){let a=null,l,o=ta(e);function u(){var r;clearTimeout(l),(r=a)==null||r.disconnect(),a=null}function n(r,s){r===void 0&&(r=!1),s===void 0&&(s=1),u();let i=e.getBoundingClientRect(),{left:c,top:d,width:m,height:p}=i;if(r||t(),!m||!p)return;let L=Mn(d),g=Mn(o.clientWidth-(c+m)),S=Mn(o.clientHeight-(d+p)),h=Mn(c),x={rootMargin:-L+"px "+-g+"px "+-S+"px "+-h+"px",threshold:nt(0,pa(1,s))||1},v=!0;function y(w){let b=w[0].intersectionRatio;if(b!==s){if(!v)return n();b?n(!1,b):l=setTimeout(()=>{n(!1,1e-7)},1e3)}b===1&&!qS(i,e.getBoundingClientRect())&&n(),v=!1}try{a=new IntersectionObserver(y,{...x,root:o.ownerDocument})}catch{a=new IntersectionObserver(y,x)}a.observe(e)}return n(!0),u}function md(e,t,a,l){l===void 0&&(l={});let{ancestorScroll:o=!0,ancestorResize:u=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:r=typeof IntersectionObserver=="function",animationFrame:s=!1}=l,i=dd(e),c=o||u?[...i?lo(i):[],...t?lo(t):[]]:[];c.forEach(h=>{o&&h.addEventListener("scroll",a,{passive:!0}),u&&h.addEventListener("resize",a)});let d=i&&r?Sw(i,a):null,m=-1,p=null;n&&(p=new ResizeObserver(h=>{let[f]=h;f&&f.target===i&&p&&t&&(p.unobserve(t),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var x;(x=p)==null||x.observe(t)})),a()}),i&&!s&&p.observe(i),t&&p.observe(t));let L,g=s?no(e):null;s&&S();function S(){let h=no(e);g&&!qS(g,h)&&a(),g=h,L=requestAnimationFrame(S)}return a(),()=>{var h;c.forEach(f=>{o&&f.removeEventListener("scroll",a),u&&f.removeEventListener("resize",a)}),d?.(),(h=p)==null||h.disconnect(),p=null,s&&cancelAnimationFrame(L)}}var FS=bS;var GS=IS,VS=vS,XS=RS,jS=yS,pd=SS;var YS=wS,hd=(e,t,a)=>{let l=new Map,o={platform:_S,...a},u={...o.platform,_c:l};return LS(e,t,{...o,platform:u})};var Ue=A(P(),1),KS=A(P(),1),QS=A(Lo(),1),vw=typeof document<"u",yw=function(){},Ps=vw?KS.useLayoutEffect:yw;function Ns(e,t){if(e===t)return!0;if(typeof e!=typeof t)return!1;if(typeof e=="function"&&e.toString()===t.toString())return!0;let a,l,o;if(e&&t&&typeof e=="object"){if(Array.isArray(e)){if(a=e.length,a!==t.length)return!1;for(l=a;l--!==0;)if(!Ns(e[l],t[l]))return!1;return!0}if(o=Object.keys(e),a=o.length,a!==Object.keys(t).length)return!1;for(l=a;l--!==0;)if(!{}.hasOwnProperty.call(t,o[l]))return!1;for(l=a;l--!==0;){let u=o[l];if(!(u==="_owner"&&e.$$typeof)&&!Ns(e[u],t[u]))return!1}return!0}return e!==e&&t!==t}function WS(e){return typeof window>"u"?1:(e.ownerDocument.defaultView||window).devicePixelRatio||1}function ZS(e,t){let a=WS(e);return Math.round(t*a)/a}function gd(e){let t=Ue.useRef(e);return Ps(()=>{t.current=e}),t}function JS(e){e===void 0&&(e={});let{placement:t="bottom",strategy:a="absolute",middleware:l=[],platform:o,elements:{reference:u,floating:n}={},transform:r=!0,whileElementsMounted:s,open:i}=e,[c,d]=Ue.useState({x:0,y:0,strategy:a,placement:t,middlewareData:{},isPositioned:!1}),[m,p]=Ue.useState(l);Ns(m,l)||p(l);let[L,g]=Ue.useState(null),[S,h]=Ue.useState(null),f=Ue.useCallback(z=>{z!==w.current&&(w.current=z,g(z))},[]),x=Ue.useCallback(z=>{z!==b.current&&(b.current=z,h(z))},[]),v=u||L,y=n||S,w=Ue.useRef(null),b=Ue.useRef(null),C=Ue.useRef(c),R=s!=null,D=gd(s),U=gd(o),G=gd(i),ee=Ue.useCallback(()=>{if(!w.current||!b.current)return;let z={placement:t,strategy:a,middleware:m};U.current&&(z.platform=U.current),hd(w.current,b.current,z).then($=>{let M={...$,isPositioned:G.current!==!1};Q.current&&!Ns(C.current,M)&&(C.current=M,QS.flushSync(()=>{d(M)}))})},[m,t,a,U,G]);Ps(()=>{i===!1&&C.current.isPositioned&&(C.current.isPositioned=!1,d(z=>({...z,isPositioned:!1})))},[i]);let Q=Ue.useRef(!1);Ps(()=>(Q.current=!0,()=>{Q.current=!1}),[]),Ps(()=>{if(v&&(w.current=v),y&&(b.current=y),v&&y){if(D.current)return D.current(v,y,ee);ee()}},[v,y,ee,D,R]);let te=Ue.useMemo(()=>({reference:w,floating:b,setReference:f,setFloating:x}),[f,x]),q=Ue.useMemo(()=>({reference:v,floating:y}),[v,y]),Z=Ue.useMemo(()=>{let z={position:a,left:0,top:0};if(!q.floating)return z;let $=ZS(q.floating,c.x),M=ZS(q.floating,c.y);return r?{...z,transform:"translate("+$+"px, "+M+"px)",...WS(q.floating)>=1.5&&{willChange:"transform"}}:{position:a,left:$,top:M}},[a,r,q.floating,c.x,c.y]);return Ue.useMemo(()=>({...c,update:ee,refs:te,elements:q,floatingStyles:Z}),[c,ee,te,q,Z])}var Cw=e=>{function t(a){return{}.hasOwnProperty.call(a,"current")}return{name:"arrow",options:e,fn(a){let{element:l,padding:o}=typeof e=="function"?e(a):e;return l&&t(l)?l.current!=null?pd({element:l.current,padding:o}).fn(a):{}:l?pd({element:l,padding:o}).fn(a):{}}}},$S=(e,t)=>{let a=FS(e);return{name:a.name,fn:a.fn,options:[e,t]}},ev=(e,t)=>{let a=GS(e);return{name:a.name,fn:a.fn,options:[e,t]}},tv=(e,t)=>({fn:YS(e).fn,options:[e,t]}),av=(e,t)=>{let a=VS(e);return{name:a.name,fn:a.fn,options:[e,t]}},lv=(e,t)=>{let a=XS(e);return{name:a.name,fn:a.fn,options:[e,t]}};var ov=(e,t)=>{let a=jS(e);return{name:a.name,fn:a.fn,options:[e,t]}};var uv=(e,t)=>{let a=Cw(e);return{name:a.name,fn:a.fn,options:[e,t]}};var nv=A(P(),1);var xd=A(X(),1),bw="Arrow",rv=nv.forwardRef((e,t)=>{let{children:a,width:l=10,height:o=5,...u}=e;return(0,xd.jsx)(de.svg,{...u,ref:t,width:l,height:o,viewBox:"0 0 30 10",preserveAspectRatio:"none",children:e.asChild?a:(0,xd.jsx)("polygon",{points:"0,0 30,0 15,10"})})});rv.displayName=bw;var sv=rv;var iv=A(P(),1);function fv(e){let[t,a]=iv.useState(void 0);return Re(()=>{if(e){a({width:e.offsetWidth,height:e.offsetHeight});let l=new ResizeObserver(o=>{if(!Array.isArray(o)||!o.length)return;let u=o[0],n,r;if("borderBoxSize"in u){let s=u.borderBoxSize,i=Array.isArray(s)?s[0]:s;n=i.inlineSize,r=i.blockSize}else n=e.offsetWidth,r=e.offsetHeight;a({width:n,height:r})});return l.observe(e,{box:"border-box"}),()=>l.unobserve(e)}else a(void 0)},[e]),t}var Il=A(X(),1);var Ld="Popper",[cv,Sd]=iu(Ld),[ww,dv]=cv(Ld),mv=e=>{let{__scopePopper:t,children:a}=e,[l,o]=Je.useState(null),[u,n]=Je.useState(void 0);return(0,Il.jsx)(ww,{scope:t,anchor:l,onAnchorChange:o,placementState:u,setPlacementState:n,children:a})};mv.displayName=Ld;var pv="PopperAnchor",hv=Je.forwardRef((e,t)=>{let{__scopePopper:a,virtualRef:l,...o}=e,u=dv(pv,a),n=Je.useRef(null),r=u.onAnchorChange,s=Je.useCallback(L=>{n.current=L,L&&r(L)},[r]),i=we(t,s),c=Je.useRef(null);Je.useEffect(()=>{if(!l)return;let L=c.current;c.current=l.current,L!==c.current&&r(c.current)});let d=u.placementState&&yd(u.placementState),m=d?.[0],p=d?.[1];return l?null:(0,Il.jsx)(de.div,{"data-radix-popper-side":m,"data-radix-popper-align":p,...o,ref:i})});hv.displayName=pv;var vd="PopperContent",[Rw,Aw]=cv(vd),gv=Je.forwardRef((e,t)=>{let{__scopePopper:a,side:l="bottom",sideOffset:o=0,align:u="center",alignOffset:n=0,arrowPadding:r=0,avoidCollisions:s=!0,collisionBoundary:i=[],collisionPadding:c=0,sticky:d="partial",hideWhenDetached:m=!1,updatePositionStrategy:p="optimized",onPlaced:L,...g}=e,S=dv(vd,a),[h,f]=Je.useState(null),x=we(t,se=>f(se)),[v,y]=Je.useState(null),w=fv(v),b=w?.width??0,C=w?.height??0,R=l+(u!=="center"?"-"+u:""),D=typeof c=="number"?c:{top:0,right:0,bottom:0,left:0,...c},U=Array.isArray(i)?i:[i],G=U.length>0,ee={padding:D,boundary:U.filter(Mw),altBoundary:G},{refs:Q,floatingStyles:te,placement:q,isPositioned:Z,middlewareData:z}=JS({strategy:"fixed",placement:R,whileElementsMounted:(...se)=>md(...se,{animationFrame:p==="always"}),elements:{reference:S.anchor},middleware:[$S({mainAxis:o+C,alignmentAxis:n}),s&&ev({mainAxis:!0,crossAxis:!1,limiter:d==="partial"?tv():void 0,...ee}),s&&av({...ee}),lv({...ee,apply:({elements:se,rects:W,availableWidth:ie,availableHeight:ue})=>{let{width:xe,height:xt}=W.reference,Xe=se.floating.style;Xe.setProperty("--radix-popper-available-width",`${ie}px`),Xe.setProperty("--radix-popper-available-height",`${ue}px`),Xe.setProperty("--radix-popper-anchor-width",`${xe}px`),Xe.setProperty("--radix-popper-anchor-height",`${xt}px`)}}),v&&uv({element:v,padding:r}),Dw({arrowWidth:b,arrowHeight:C}),m&&ov({strategy:"referenceHidden",...ee,boundary:G?ee.boundary:void 0})]}),$=S.setPlacementState;Re(()=>($(q),()=>{$(void 0)}),[q,$]);let[M,$e]=yd(q),gt=Ft(L);Re(()=>{Z&&gt?.()},[Z,gt]);let Yt=z.arrow?.x,Tt=z.arrow?.y,Te=z.arrow?.centerOffset!==0,[Ae,B]=Je.useState();return Re(()=>{h&&B(window.getComputedStyle(h).zIndex)},[h]),(0,Il.jsx)("div",{ref:Q.setFloating,"data-radix-popper-content-wrapper":"",style:{...te,transform:Z?te.transform:"translate(0, -200%)",minWidth:"max-content",zIndex:Ae,"--radix-popper-transform-origin":[z.transformOrigin?.x,z.transformOrigin?.y].join(" "),...z.hide?.referenceHidden&&{visibility:"hidden",pointerEvents:"none"}},dir:e.dir,children:(0,Il.jsx)(Rw,{scope:a,placedSide:M,placedAlign:$e,onArrowChange:y,arrowX:Yt,arrowY:Tt,shouldHideArrow:Te,children:(0,Il.jsx)(de.div,{"data-side":M,"data-align":$e,...g,ref:x,style:{...g.style,animation:Z?void 0:"none"}})})})});gv.displayName=vd;var xv="PopperArrow",Tw={top:"bottom",right:"left",bottom:"top",left:"right"},Lv=Je.forwardRef(function(t,a){let{__scopePopper:l,...o}=t,u=Aw(xv,l),n=Tw[u.placedSide];return(0,Il.jsx)("span",{ref:u.onArrowChange,style:{position:"absolute",left:u.arrowX,top:u.arrowY,[n]:0,transformOrigin:{top:"",right:"0 0",bottom:"center 0",left:"100% 0"}[u.placedSide],transform:{top:"translateY(100%)",right:"translateY(50%) rotate(90deg) translateX(-50%)",bottom:"rotate(180deg)",left:"translateY(50%) rotate(-90deg) translateX(50%)"}[u.placedSide],visibility:u.shouldHideArrow?"hidden":void 0},children:(0,Il.jsx)(sv,{...o,ref:a,style:{...o.style,display:"block"}})})});Lv.displayName=xv;function Mw(e){return e!==null}var Dw=e=>({name:"transformOrigin",options:e,fn(t){let{placement:a,rects:l,middlewareData:o}=t,n=o.arrow?.centerOffset!==0,r=n?0:e.arrowWidth,s=n?0:e.arrowHeight,[i,c]=yd(a),d={start:"0%",center:"50%",end:"100%"}[c],m=(o.arrow?.x??0)+r/2,p=(o.arrow?.y??0)+s/2,L="",g="";return i==="bottom"?(L=n?d:`${m}px`,g=`${-s}px`):i==="top"?(L=n?d:`${m}px`,g=`${l.floating.height+s}px`):i==="right"?(L=`${-s}px`,g=n?d:`${p}px`):i==="left"&&(L=`${l.floating.width+s}px`,g=n?d:`${p}px`),{data:{x:L,y:g}}}});function yd(e){let[t,a="center"]=e.split("-");return[t,a]}var Sv=mv,vv=hv,yv=gv,Cv=Lv;var zs=A(P(),1),bv=A(Lo(),1);var Iv=A(X(),1),Ew="Portal",Cd=zs.forwardRef((e,t)=>{let{container:a,...l}=e,[o,u]=zs.useState(!1);Re(()=>u(!0),[]);let n=a||o&&globalThis?.document?.body;return n?bv.createPortal((0,Iv.jsx)(de.div,{...l,ref:t}),n):null});Cd.displayName=Ew;var tt=A(P(),1);var Rv=A(P(),1);function Ow(e,t){return Rv.useReducer((a,l)=>t[a][l]??a,e)}var bd=e=>{let{present:t,children:a}=e,l=Bw(t),o=typeof a=="function"?a({present:l.isPresent}):tt.Children.only(a),u=Pw(l.ref,Nw(o));return typeof a=="function"||l.isPresent?tt.cloneElement(o,{ref:u}):null};bd.displayName="Presence";function Bw(e){let[t,a]=tt.useState(),l=tt.useRef(null),o=tt.useRef(e),u=tt.useRef("none"),n=e?"mounted":"unmounted",[r,s]=Ow(n,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return tt.useEffect(()=>{let i=Us(l.current);u.current=r==="mounted"?i:"none"},[r]),Re(()=>{let i=l.current,c=o.current;if(c!==e){let m=u.current,p=Us(i);e?s("MOUNT"):p==="none"||i?.display==="none"?s("UNMOUNT"):s(c&&m!==p?"ANIMATION_OUT":"UNMOUNT"),o.current=e}},[e,s]),Re(()=>{if(t){let i,c=t.ownerDocument.defaultView??window,d=p=>{let g=Us(l.current).includes(CSS.escape(p.animationName));if(p.target===t&&g&&(s("ANIMATION_END"),!o.current)){let S=t.style.animationFillMode;t.style.animationFillMode="forwards",i=c.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=S)})}},m=p=>{p.target===t&&(u.current=Us(l.current))};return t.addEventListener("animationstart",m),t.addEventListener("animationcancel",d),t.addEventListener("animationend",d),()=>{c.clearTimeout(i),t.removeEventListener("animationstart",m),t.removeEventListener("animationcancel",d),t.removeEventListener("animationend",d)}}else s("ANIMATION_END")},[t,s]),{isPresent:["mounted","unmountSuspended"].includes(r),ref:tt.useCallback(i=>{l.current=i?getComputedStyle(i):null,a(i)},[])}}function wv(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function Pw(...e){let t=tt.useRef(e);return t.current=e,tt.useCallback(a=>{let l=t.current,o=!1,u=l.map(n=>{let r=wv(n,a);return!o&&typeof r=="function"&&(o=!0),r});if(o)return()=>{for(let n=0;n<u.length;n++){let r=u[n];typeof r=="function"?r():wv(l[n],null)}}},[])}function Us(e){return e?.animationName||"none"}function Nw(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning;return a?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning,a?e.props.ref:e.props.ref||e.ref)}var jt=A(P(),1);var Hs=A(P(),1);var zw=jt[" useInsertionEffect ".trim().toString()]||Re;function Id({prop:e,defaultProp:t,onChange:a=()=>{},caller:l}){let[o,u,n]=Uw({defaultProp:t,onChange:a}),r=e!==void 0,s=r?e:o;{let c=jt.useRef(e!==void 0);jt.useEffect(()=>{let d=c.current;d!==r&&console.warn(`${l} is changing from ${d?"controlled":"uncontrolled"} to ${r?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),c.current=r},[r,l])}let i=jt.useCallback(c=>{if(r){let d=Hw(c)?c(e):c;d!==e&&n.current?.(d)}else u(c)},[r,e,u,n]);return[s,i]}function Uw({defaultProp:e,onChange:t}){let[a,l]=jt.useState(e),o=jt.useRef(a),u=jt.useRef(t);return zw(()=>{u.current=t},[t]),jt.useEffect(()=>{o.current!==a&&(u.current?.(a),o.current=a)},[a,o]),[a,l,u]}function Hw(e){return typeof e=="function"}var _s=A(P(),1);function Av(e){let t=_s.useRef({value:e,previous:e});return _s.useMemo(()=>(t.current.value!==e&&(t.current.previous=t.current.value,t.current.value=e),t.current.previous),[e])}var Tv=A(P(),1);var Mv=A(X(),1),wd=Object.freeze({position:"absolute",border:0,width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",wordWrap:"normal"}),_w="VisuallyHidden",qw=Tv.forwardRef((e,t)=>(0,Mv.jsx)(de.span,{...e,ref:t,style:{...wd,...e.style}}));qw.displayName=_w;var Fw=function(e){if(typeof document>"u")return null;var t=Array.isArray(e)?e[0]:e;return t.ownerDocument.body},pu=new WeakMap,qs=new WeakMap,Fs={},Rd=0,Dv=function(e){return e&&(e.host||Dv(e.parentNode))},Gw=function(e,t){return t.map(function(a){if(e.contains(a))return a;var l=Dv(a);return l&&e.contains(l)?l:(console.error("aria-hidden",a,"in not contained inside",e,". Doing nothing"),null)}).filter(function(a){return!!a})},Vw=function(e,t,a,l){var o=Gw(t,Array.isArray(e)?e:[e]);Fs[a]||(Fs[a]=new WeakMap);var u=Fs[a],n=[],r=new Set,s=new Set(o),i=function(d){!d||r.has(d)||(r.add(d),i(d.parentNode))};o.forEach(i);var c=function(d){!d||s.has(d)||Array.prototype.forEach.call(d.children,function(m){if(r.has(m))c(m);else try{var p=m.getAttribute(l),L=p!==null&&p!=="false",g=(pu.get(m)||0)+1,S=(u.get(m)||0)+1;pu.set(m,g),u.set(m,S),n.push(m),g===1&&L&&qs.set(m,!0),S===1&&m.setAttribute(a,"true"),L||m.setAttribute(l,"true")}catch(h){console.error("aria-hidden: cannot operate on ",m,h)}})};return c(t),r.clear(),Rd++,function(){n.forEach(function(d){var m=pu.get(d)-1,p=u.get(d)-1;pu.set(d,m),u.set(d,p),m||(qs.has(d)||d.removeAttribute(l),qs.delete(d)),p||d.removeAttribute(a)}),Rd--,Rd||(pu=new WeakMap,pu=new WeakMap,qs=new WeakMap,Fs={})}},kv=function(e,t,a){a===void 0&&(a="data-aria-hidden");var l=Array.from(Array.isArray(e)?e:[e]),o=t||Fw(e);return o?(l.push.apply(l,Array.from(o.querySelectorAll("[aria-live], script"))),Vw(l,o,a,"aria-hidden")):function(){return null}};var ht=function(){return ht=Object.assign||function(t){for(var a,l=1,o=arguments.length;l<o;l++){a=arguments[l];for(var u in a)Object.prototype.hasOwnProperty.call(a,u)&&(t[u]=a[u])}return t},ht.apply(this,arguments)};function Gs(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,l=Object.getOwnPropertySymbols(e);o<l.length;o++)t.indexOf(l[o])<0&&Object.prototype.propertyIsEnumerable.call(e,l[o])&&(a[l[o]]=e[l[o]]);return a}function Ev(e,t,a){if(a||arguments.length===2)for(var l=0,o=t.length,u;l<o;l++)(u||!(l in t))&&(u||(u=Array.prototype.slice.call(t,0,l)),u[l]=t[l]);return e.concat(u||Array.prototype.slice.call(t))}var Zs=A(P());var at=A(P());var ro="right-scroll-bar-position",so="width-before-scroll-bar",Ad="with-scroll-bars-hidden",Td="--removed-body-scroll-bar-size";function Vs(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}var Ov=A(P());function Bv(e,t){var a=(0,Ov.useState)(function(){return{value:e,callback:t,facade:{get current(){return a.value},set current(l){var o=a.value;o!==l&&(a.value=l,a.callback(l,o))}}}})[0];return a.callback=t,a.facade}var Xs=A(P());var Xw=typeof window<"u"?Xs.useLayoutEffect:Xs.useEffect,Pv=new WeakMap;function Md(e,t){var a=Bv(t||null,function(l){return e.forEach(function(o){return Vs(o,l)})});return Xw(function(){var l=Pv.get(a);if(l){var o=new Set(l),u=new Set(e),n=a.current;o.forEach(function(r){u.has(r)||Vs(r,null)}),u.forEach(function(r){o.has(r)||Vs(r,n)})}Pv.set(a,e)},[e]),a}function jw(e){return e}function Yw(e,t){t===void 0&&(t=jw);var a=[],l=!1,o={read:function(){if(l)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return a.length?a[a.length-1]:e},useMedium:function(u){var n=t(u,l);return a.push(n),function(){a=a.filter(function(r){return r!==n})}},assignSyncMedium:function(u){for(l=!0;a.length;){var n=a;a=[],n.forEach(u)}a={push:function(r){return u(r)},filter:function(){return a}}},assignMedium:function(u){l=!0;var n=[];if(a.length){var r=a;a=[],r.forEach(u),n=a}var s=function(){var c=n;n=[],c.forEach(u)},i=function(){return Promise.resolve().then(s)};i(),a={push:function(c){n.push(c),i()},filter:function(c){return n=n.filter(c),a}}}};return o}function Dd(e){e===void 0&&(e={});var t=Yw(null);return t.options=ht({async:!0,ssr:!1},e),t}var Nv=A(P()),zv=function(e){var t=e.sideCar,a=Gs(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var l=t.read();if(!l)throw new Error("Sidecar medium not found");return Nv.createElement(l,ht({},a))};zv.isSideCarExport=!0;function kd(e,t){return e.useMedium(t),zv}var js=Dd();var Ed=function(){},En=at.forwardRef(function(e,t){var a=at.useRef(null),l=at.useState({onScrollCapture:Ed,onWheelCapture:Ed,onTouchMoveCapture:Ed}),o=l[0],u=l[1],n=e.forwardProps,r=e.children,s=e.className,i=e.removeScrollBar,c=e.enabled,d=e.shards,m=e.sideCar,p=e.noRelative,L=e.noIsolation,g=e.inert,S=e.allowPinchZoom,h=e.as,f=h===void 0?"div":h,x=e.gapMode,v=Gs(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),y=m,w=Md([a,t]),b=ht(ht({},v),o);return at.createElement(at.Fragment,null,c&&at.createElement(y,{sideCar:js,removeScrollBar:i,shards:d,noRelative:p,noIsolation:L,inert:g,setCallbacks:u,allowPinchZoom:!!S,lockRef:a,gapMode:x}),n?at.cloneElement(at.Children.only(r),ht(ht({},b),{ref:w})):at.createElement(f,ht({},b,{className:s,ref:w}),r))});En.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};En.classNames={fullWidth:so,zeroRight:ro};var Ce=A(P());var gu=A(P());var _v=A(P());var Uv;var Hv=function(){if(Uv)return Uv;if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function Zw(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=Hv();return t&&e.setAttribute("nonce",t),e}function Kw(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function Qw(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var Od=function(){var e=0,t=null;return{add:function(a){e==0&&(t=Zw())&&(Kw(t,a),Qw(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}};var Bd=function(){var e=Od();return function(t,a){_v.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&a])}};var On=function(){var e=Bd(),t=function(a){var l=a.styles,o=a.dynamic;return e(l,o),null};return t};var Ww={left:0,top:0,right:0,gap:0},Pd=function(e){return parseInt(e||"",10)||0},Jw=function(e){var t=window.getComputedStyle(document.body),a=t[e==="padding"?"paddingLeft":"marginLeft"],l=t[e==="padding"?"paddingTop":"marginTop"],o=t[e==="padding"?"paddingRight":"marginRight"];return[Pd(a),Pd(l),Pd(o)]},Nd=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return Ww;var t=Jw(e),a=document.documentElement.clientWidth,l=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,l-a+t[2]-t[0])}};var $w=On(),hu="data-scroll-locked",eR=function(e,t,a,l){var o=e.left,u=e.top,n=e.right,r=e.gap;return a===void 0&&(a="margin"),`
  .`.concat(Ad,` {
   overflow: hidden `).concat(l,`;
   padding-right: `).concat(r,"px ").concat(l,`;
  }
  body[`).concat(hu,`] {
    overflow: hidden `).concat(l,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(l,";"),a==="margin"&&`
    padding-left: `.concat(o,`px;
    padding-top: `).concat(u,`px;
    padding-right: `).concat(n,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(r,"px ").concat(l,`;
    `),a==="padding"&&"padding-right: ".concat(r,"px ").concat(l,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(ro,` {
    right: `).concat(r,"px ").concat(l,`;
  }
  
  .`).concat(so,` {
    margin-right: `).concat(r,"px ").concat(l,`;
  }
  
  .`).concat(ro," .").concat(ro,` {
    right: 0 `).concat(l,`;
  }
  
  .`).concat(so," .").concat(so,` {
    margin-right: 0 `).concat(l,`;
  }
  
  body[`).concat(hu,`] {
    `).concat(Td,": ").concat(r,`px;
  }
`)},qv=function(){var e=parseInt(document.body.getAttribute(hu)||"0",10);return isFinite(e)?e:0},tR=function(){gu.useEffect(function(){return document.body.setAttribute(hu,(qv()+1).toString()),function(){var e=qv()-1;e<=0?document.body.removeAttribute(hu):document.body.setAttribute(hu,e.toString())}},[])},zd=function(e){var t=e.noRelative,a=e.noImportant,l=e.gapMode,o=l===void 0?"margin":l;tR();var u=gu.useMemo(function(){return Nd(o)},[o]);return gu.createElement($w,{styles:eR(u,!t,o,a?"":"!important")})};var Ud=!1;if(typeof window<"u")try{Bn=Object.defineProperty({},"passive",{get:function(){return Ud=!0,!0}}),window.addEventListener("test",Bn,Bn),window.removeEventListener("test",Bn,Bn)}catch{Ud=!1}var Bn,io=Ud?{passive:!1}:!1;var aR=function(e){return e.tagName==="TEXTAREA"},Fv=function(e,t){if(!(e instanceof Element))return!1;var a=window.getComputedStyle(e);return a[t]!=="hidden"&&!(a.overflowY===a.overflowX&&!aR(e)&&a[t]==="visible")},lR=function(e){return Fv(e,"overflowY")},oR=function(e){return Fv(e,"overflowX")},Hd=function(e,t){var a=t.ownerDocument,l=t;do{typeof ShadowRoot<"u"&&l instanceof ShadowRoot&&(l=l.host);var o=Gv(e,l);if(o){var u=Vv(e,l),n=u[1],r=u[2];if(n>r)return!0}l=l.parentNode}while(l&&l!==a.body);return!1},uR=function(e){var t=e.scrollTop,a=e.scrollHeight,l=e.clientHeight;return[t,a,l]},nR=function(e){var t=e.scrollLeft,a=e.scrollWidth,l=e.clientWidth;return[t,a,l]},Gv=function(e,t){return e==="v"?lR(t):oR(t)},Vv=function(e,t){return e==="v"?uR(t):nR(t)},rR=function(e,t){return e==="h"&&t==="rtl"?-1:1},Xv=function(e,t,a,l,o){var u=rR(e,window.getComputedStyle(t).direction),n=u*l,r=a.target,s=t.contains(r),i=!1,c=n>0,d=0,m=0;do{if(!r)break;var p=Vv(e,r),L=p[0],g=p[1],S=p[2],h=g-S-u*L;(L||h)&&Gv(e,r)&&(d+=h,m+=L);var f=r.parentNode;r=f&&f.nodeType===Node.DOCUMENT_FRAGMENT_NODE?f.host:f}while(!s&&r!==document.body||s&&(t.contains(r)||t===r));return(c&&(o&&Math.abs(d)<1||!o&&n>d)||!c&&(o&&Math.abs(m)<1||!o&&-n>m))&&(i=!0),i};var Ys=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},jv=function(e){return[e.deltaX,e.deltaY]},Yv=function(e){return e&&"current"in e?e.current:e},sR=function(e,t){return e[0]===t[0]&&e[1]===t[1]},iR=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},fR=0,xu=[];function Zv(e){var t=Ce.useRef([]),a=Ce.useRef([0,0]),l=Ce.useRef(),o=Ce.useState(fR++)[0],u=Ce.useState(On)[0],n=Ce.useRef(e);Ce.useEffect(function(){n.current=e},[e]),Ce.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(o));var g=Ev([e.lockRef.current],(e.shards||[]).map(Yv),!0).filter(Boolean);return g.forEach(function(S){return S.classList.add("allow-interactivity-".concat(o))}),function(){document.body.classList.remove("block-interactivity-".concat(o)),g.forEach(function(S){return S.classList.remove("allow-interactivity-".concat(o))})}}},[e.inert,e.lockRef.current,e.shards]);var r=Ce.useCallback(function(g,S){if("touches"in g&&g.touches.length===2||g.type==="wheel"&&g.ctrlKey)return!n.current.allowPinchZoom;var h=Ys(g),f=a.current,x="deltaX"in g?g.deltaX:f[0]-h[0],v="deltaY"in g?g.deltaY:f[1]-h[1],y,w=g.target,b=Math.abs(x)>Math.abs(v)?"h":"v";if("touches"in g&&b==="h"&&w.type==="range")return!1;var C=window.getSelection(),R=C&&C.anchorNode,D=R?R===w||R.contains(w):!1;if(D)return!1;var U=Hd(b,w);if(!U)return!0;if(U?y=b:(y=b==="v"?"h":"v",U=Hd(b,w)),!U)return!1;if(!l.current&&"changedTouches"in g&&(x||v)&&(l.current=y),!y)return!0;var G=l.current||y;return Xv(G,S,g,G==="h"?x:v,!0)},[]),s=Ce.useCallback(function(g){var S=g;if(!(!xu.length||xu[xu.length-1]!==u)){var h="deltaY"in S?jv(S):Ys(S),f=t.current.filter(function(y){return y.name===S.type&&(y.target===S.target||S.target===y.shadowParent)&&sR(y.delta,h)})[0];if(f&&f.should){S.cancelable&&S.preventDefault();return}if(!f){var x=(n.current.shards||[]).map(Yv).filter(Boolean).filter(function(y){return y.contains(S.target)}),v=x.length>0?r(S,x[0]):!n.current.noIsolation;v&&S.cancelable&&S.preventDefault()}}},[]),i=Ce.useCallback(function(g,S,h,f){var x={name:g,delta:S,target:h,should:f,shadowParent:cR(h)};t.current.push(x),setTimeout(function(){t.current=t.current.filter(function(v){return v!==x})},1)},[]),c=Ce.useCallback(function(g){a.current=Ys(g),l.current=void 0},[]),d=Ce.useCallback(function(g){i(g.type,jv(g),g.target,r(g,e.lockRef.current))},[]),m=Ce.useCallback(function(g){i(g.type,Ys(g),g.target,r(g,e.lockRef.current))},[]);Ce.useEffect(function(){return xu.push(u),e.setCallbacks({onScrollCapture:d,onWheelCapture:d,onTouchMoveCapture:m}),document.addEventListener("wheel",s,io),document.addEventListener("touchmove",s,io),document.addEventListener("touchstart",c,io),function(){xu=xu.filter(function(g){return g!==u}),document.removeEventListener("wheel",s,io),document.removeEventListener("touchmove",s,io),document.removeEventListener("touchstart",c,io)}},[]);var p=e.removeScrollBar,L=e.inert;return Ce.createElement(Ce.Fragment,null,L?Ce.createElement(u,{styles:iR(o)}):null,p?Ce.createElement(zd,{noRelative:e.noRelative,gapMode:e.gapMode}):null)}function cR(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}var Kv=kd(js,Zv);var Qv=Zs.forwardRef(function(e,t){return Zs.createElement(En,ht({},e,{ref:t,sideCar:Kv}))});Qv.classNames=En.classNames;var _d=Qv;var O=A(X(),1),dR=[" ","Enter","ArrowUp","ArrowDown"],mR=[" ","Enter"],fo="Select",[Qs,Ws,pR]=_L(fo),[co,lD]=iu(fo,[pR,Sd]),Js=Sd(),[hR,Rl]=co(fo),[gR,xR]=co(fo),LR="SelectProvider";function Wv(e){let{__scopeSelect:t,children:a,open:l,defaultOpen:o,onOpenChange:u,value:n,defaultValue:r,onValueChange:s,dir:i,name:c,autoComplete:d,disabled:m,required:p,form:L,internal_do_not_use_render:g}=e,S=Js(t),[h,f]=T.useState(null),[x,v]=T.useState(null),[y,w]=T.useState(!1),b=qL(i),[C,R]=Id({prop:l,defaultProp:o??!1,onChange:u,caller:fo}),[D,U]=Id({prop:n,defaultProp:r,onChange:s,caller:fo}),G=T.useRef(null),ee=h?!!L||!!h.closest("form"):!0,[Q,te]=T.useState(new Set),q=Is(),Z=Array.from(Q).map($e=>$e.props.value).join(";"),z=T.useCallback($e=>{te(gt=>new Set(gt).add($e))},[]),$=T.useCallback($e=>{te(gt=>{let Yt=new Set(gt);return Yt.delete($e),Yt})},[]),M={required:p,trigger:h,onTriggerChange:f,valueNode:x,onValueNodeChange:v,valueNodeHasChildren:y,onValueNodeHasChildrenChange:w,contentId:q,value:D,onValueChange:U,open:C,onOpenChange:R,dir:b,triggerPointerDownPosRef:G,disabled:m,name:c,autoComplete:d,form:L,nativeOptions:Q,nativeSelectKey:Z,isFormControl:ee};return(0,O.jsx)(Sv,{...S,children:(0,O.jsx)(hR,{scope:t,...M,children:(0,O.jsx)(Qs.Provider,{scope:t,children:(0,O.jsx)(gR,{scope:t,onNativeOptionAdd:z,onNativeOptionRemove:$,children:zR(g)?g(M):a})})})})}Wv.displayName=LR;var jd=e=>{let{__scopeSelect:t,children:a,...l}=e;return(0,O.jsx)(Wv,{__scopeSelect:t,...l,internal_do_not_use_render:({isFormControl:o})=>(0,O.jsxs)(O.Fragment,{children:[a,o?(0,O.jsx)(my,{__scopeSelect:t}):null]})})};jd.displayName=fo;var Jv="SelectTrigger",$s=T.forwardRef((e,t)=>{let{__scopeSelect:a,disabled:l=!1,...o}=e,u=Js(a),n=Rl(Jv,a),r=n.disabled||l,s=we(t,n.onTriggerChange),i=Ws(a),c=T.useRef("touch"),[d,m,p]=py(g=>{let S=i().filter(x=>!x.disabled),h=S.find(x=>x.value===n.value),f=hy(S,g,h);f!==void 0&&n.onValueChange(f.value)}),L=g=>{r||(n.onOpenChange(!0),p()),g&&(n.triggerPointerDownPosRef.current={x:Math.round(g.pageX),y:Math.round(g.pageY)})};return(0,O.jsx)(vv,{asChild:!0,...u,children:(0,O.jsx)(de.button,{type:"button",role:"combobox","aria-controls":n.open?n.contentId:void 0,"aria-expanded":n.open,"aria-required":n.required,"aria-autocomplete":"none",dir:n.dir,"data-state":n.open?"open":"closed",disabled:r,"data-disabled":r?"":void 0,"data-placeholder":ai(n.value)?"":void 0,...o,ref:s,onClick:ke(o.onClick,g=>{g.currentTarget.focus(),c.current!=="mouse"&&L(g)}),onPointerDown:ke(o.onPointerDown,g=>{c.current=g.pointerType;let S=g.target;S.hasPointerCapture(g.pointerId)&&S.releasePointerCapture(g.pointerId),g.button===0&&g.ctrlKey===!1&&g.pointerType==="mouse"&&(L(g),g.preventDefault())}),onKeyDown:ke(o.onKeyDown,g=>{let S=d.current!=="";!(g.ctrlKey||g.altKey||g.metaKey)&&g.key.length===1&&m(g.key),!(S&&g.key===" ")&&dR.includes(g.key)&&(L(),g.preventDefault())})})})});$s.displayName=Jv;var $v="SelectValue",Yd=T.forwardRef((e,t)=>{let{__scopeSelect:a,className:l,style:o,children:u,placeholder:n="",...r}=e,s=Rl($v,a),{onValueNodeHasChildrenChange:i}=s,c=u!==void 0,d=we(t,s.onValueNodeChange);Re(()=>{i(c)},[i,c]);let m=ai(s.value);return(0,O.jsx)(de.span,{...r,asChild:m?!1:r.asChild,ref:d,style:{pointerEvents:"none"},children:(0,O.jsx)(T.Fragment,{children:m?n:u},m?"placeholder":"value")})});Yd.displayName=$v;var SR="SelectIcon",Zd=T.forwardRef((e,t)=>{let{__scopeSelect:a,children:l,...o}=e;return(0,O.jsx)(de.span,{"aria-hidden":!0,...o,ref:t,children:l||"\u25BC"})});Zd.displayName=SR;var ey="SelectPortal",[vR,yR]=co(ey,{forceMount:void 0}),Kd=e=>{let{__scopeSelect:t,forceMount:a,...l}=e;return(0,O.jsx)(vR,{scope:e.__scopeSelect,forceMount:a,children:(0,O.jsx)(Cd,{asChild:!0,...l})})};Kd.displayName=ey;var wl="SelectContent",ei=T.forwardRef((e,t)=>{let a=yR(wl,e.__scopeSelect),{forceMount:l=a.forceMount,...o}=e,u=Rl(wl,e.__scopeSelect),[n,r]=T.useState();return Re(()=>{r(new DocumentFragment)},[]),(0,O.jsx)(bd,{present:l||u.open,children:({present:s})=>s?(0,O.jsx)(ly,{...o,ref:t}):(0,O.jsx)(ty,{...o,fragment:n})})});ei.displayName=wl;var ty=T.forwardRef((e,t)=>{let{__scopeSelect:a,children:l,fragment:o}=e;return o?Xd.createPortal((0,O.jsx)(ay,{scope:a,children:(0,O.jsx)(Qs.Slot,{scope:a,children:(0,O.jsx)("div",{ref:t,children:l})})}),o):null});ty.displayName="SelectContentFragment";var aa=10,[ay,Al]=co(wl),CR="SelectContentImpl",bR=$l("SelectContent.RemoveScroll"),ly=T.forwardRef((e,t)=>{let{__scopeSelect:a}=e,{position:l="item-aligned",onCloseAutoFocus:o,onEscapeKeyDown:u,onPointerDownOutside:n,side:r,sideOffset:s,align:i,alignOffset:c,arrowPadding:d,collisionBoundary:m,collisionPadding:p,sticky:L,hideWhenDetached:g,avoidCollisions:S,...h}=e,f=Rl(wl,a),[x,v]=T.useState(null),[y,w]=T.useState(null),b=we(t,B=>v(B)),[C,R]=T.useState(null),[D,U]=T.useState(null),G=Ws(a),[ee,Q]=T.useState(!1),te=T.useRef(!1);T.useEffect(()=>{if(x)return kv(x)},[x]),eS();let q=T.useCallback(B=>{let[se,...W]=G().map(xe=>xe.ref.current),[ie]=W.slice(-1),ue=document.activeElement;for(let xe of B)if(xe===ue||(xe?.scrollIntoView({block:"nearest"}),xe===se&&y&&(y.scrollTop=0),xe===ie&&y&&(y.scrollTop=y.scrollHeight),xe?.focus(),document.activeElement!==ue))return},[G,y]),Z=T.useCallback(()=>q([C,x]),[q,C,x]);T.useEffect(()=>{ee&&Z()},[ee,Z]);let{onOpenChange:z,triggerPointerDownPosRef:$}=f;T.useEffect(()=>{if(x){let B={x:0,y:0},se=ie=>{B={x:Math.abs(Math.round(ie.pageX)-($.current?.x??0)),y:Math.abs(Math.round(ie.pageY)-($.current?.y??0))}},W=ie=>{B.x<=10&&B.y<=10?ie.preventDefault():ie.composedPath().includes(x)||z(!1),document.removeEventListener("pointermove",se),$.current=null};return $.current!==null&&(document.addEventListener("pointermove",se),document.addEventListener("pointerup",W,{capture:!0,once:!0})),()=>{document.removeEventListener("pointermove",se),document.removeEventListener("pointerup",W,{capture:!0})}}},[x,z,$]),T.useEffect(()=>{let B=()=>z(!1);return window.addEventListener("blur",B),window.addEventListener("resize",B),()=>{window.removeEventListener("blur",B),window.removeEventListener("resize",B)}},[z]);let[M,$e]=py(B=>{let se=G().filter(ue=>!ue.disabled),W=se.find(ue=>ue.ref.current===document.activeElement),ie=hy(se,B,W);ie&&setTimeout(()=>ie.ref.current?.focus())}),gt=T.useCallback((B,se,W)=>{let ie=!te.current&&!W;(f.value!==void 0&&f.value===se||ie)&&(R(B),ie&&(te.current=!0))},[f.value]),Yt=T.useCallback(()=>x?.focus(),[x]),Tt=T.useCallback((B,se,W)=>{let ie=!te.current&&!W;(f.value!==void 0&&f.value===se||ie)&&U(B)},[f.value]),Te=l==="popper"?qd:oy,Ae=Te===qd?{side:r,sideOffset:s,align:i,alignOffset:c,arrowPadding:d,collisionBoundary:m,collisionPadding:p,sticky:L,hideWhenDetached:g,avoidCollisions:S}:{};return(0,O.jsx)(ay,{scope:a,content:x,viewport:y,onViewportChange:w,itemRefCallback:gt,selectedItem:C,onItemLeave:Yt,itemTextRefCallback:Tt,focusSelectedItem:Z,selectedItemText:D,position:l,isPositioned:ee,searchRef:M,children:(0,O.jsx)(_d,{as:bR,allowPinchZoom:!0,children:(0,O.jsx)(rd,{asChild:!0,trapped:f.open,onMountAutoFocus:B=>{B.preventDefault()},onUnmountAutoFocus:ke(o,B=>{f.trigger?.focus({preventScroll:!0}),B.preventDefault()}),children:(0,O.jsx)(od,{asChild:!0,disableOutsidePointerEvents:!0,onEscapeKeyDown:u,onPointerDownOutside:n,onFocusOutside:B=>B.preventDefault(),onDismiss:()=>f.onOpenChange(!1),children:(0,O.jsx)(Te,{role:"listbox",id:f.contentId,"data-state":f.open?"open":"closed",dir:f.dir,onContextMenu:B=>B.preventDefault(),...h,...Ae,onPlaced:()=>Q(!0),ref:b,style:{display:"flex",flexDirection:"column",outline:"none",...h.style},onKeyDown:ke(h.onKeyDown,B=>{let se=B.ctrlKey||B.altKey||B.metaKey;if(B.key==="Tab"&&B.preventDefault(),!se&&B.key.length===1&&$e(B.key),["ArrowUp","ArrowDown","Home","End"].includes(B.key)){let ie=G().filter(ue=>!ue.disabled).map(ue=>ue.ref.current);if(["ArrowUp","End"].includes(B.key)&&(ie=ie.slice().reverse()),["ArrowUp","ArrowDown"].includes(B.key)){let ue=B.target,xe=ie.indexOf(ue);ie=ie.slice(xe+1)}setTimeout(()=>q(ie)),B.preventDefault()}})})})})})})});ly.displayName=CR;var IR="SelectItemAlignedPosition",oy=T.forwardRef((e,t)=>{let{__scopeSelect:a,onPlaced:l,...o}=e,u=Rl(wl,a),n=Al(wl,a),[r,s]=T.useState(null),[i,c]=T.useState(null),d=we(t,b=>c(b)),m=Ws(a),p=T.useRef(!1),L=T.useRef(!0),{viewport:g,selectedItem:S,selectedItemText:h,focusSelectedItem:f}=n,x=T.useCallback(()=>{if(u.trigger&&u.valueNode&&r&&i&&g&&S&&h){let b=u.trigger.getBoundingClientRect(),C=i.getBoundingClientRect(),R=u.valueNode.getBoundingClientRect(),D=h.getBoundingClientRect();if(u.dir!=="rtl"){let ue=D.left-C.left,xe=R.left-ue,xt=b.left-xe,Xe=b.width+xt,ri=Math.max(Xe,C.width),si=window.innerWidth-aa,ii=td(xe,[aa,Math.max(aa,si-ri)]);r.style.minWidth=Xe+"px",r.style.left=ii+"px"}else{let ue=C.right-D.right,xe=window.innerWidth-R.right-ue,xt=window.innerWidth-b.right-xe,Xe=b.width+xt,ri=Math.max(Xe,C.width),si=window.innerWidth-aa,ii=td(xe,[aa,Math.max(aa,si-ri)]);r.style.minWidth=Xe+"px",r.style.right=ii+"px"}let U=m(),G=window.innerHeight-aa*2,ee=g.scrollHeight,Q=window.getComputedStyle(i),te=parseInt(Q.borderTopWidth,10),q=parseInt(Q.paddingTop,10),Z=parseInt(Q.borderBottomWidth,10),z=parseInt(Q.paddingBottom,10),$=te+q+ee+z+Z,M=Math.min(S.offsetHeight*5,$),$e=window.getComputedStyle(g),gt=parseInt($e.paddingTop,10),Yt=parseInt($e.paddingBottom,10),Tt=b.top+b.height/2-aa,Te=G-Tt,Ae=S.offsetHeight/2,B=S.offsetTop+Ae,se=te+q+B,W=$-se;if(se<=Tt){let ue=U.length>0&&S===U[U.length-1].ref.current;r.style.bottom="0px";let xe=i.clientHeight-g.offsetTop-g.offsetHeight,xt=Math.max(Te,Ae+(ue?Yt:0)+xe+Z),Xe=se+xt;r.style.height=Xe+"px"}else{let ue=U.length>0&&S===U[0].ref.current;r.style.top="0px";let xt=Math.max(Tt,te+g.offsetTop+(ue?gt:0)+Ae)+W;r.style.height=xt+"px",g.scrollTop=se-Tt+g.offsetTop}r.style.margin=`${aa}px 0`,r.style.minHeight=M+"px",r.style.maxHeight=G+"px",l?.(),requestAnimationFrame(()=>p.current=!0)}},[m,u.trigger,u.valueNode,r,i,g,S,h,u.dir,l]);Re(()=>x(),[x]);let[v,y]=T.useState();Re(()=>{i&&y(window.getComputedStyle(i).zIndex)},[i]);let w=T.useCallback(b=>{b&&L.current===!0&&(x(),f?.(),L.current=!1)},[x,f]);return(0,O.jsx)(RR,{scope:a,contentWrapper:r,shouldExpandOnScrollRef:p,onScrollButtonChange:w,children:(0,O.jsx)("div",{ref:s,style:{display:"flex",flexDirection:"column",position:"fixed",zIndex:v},children:(0,O.jsx)(de.div,{...o,ref:d,style:{boxSizing:"border-box",maxHeight:"100%",...o.style}})})})});oy.displayName=IR;var wR="SelectPopperPosition",qd=T.forwardRef((e,t)=>{let{__scopeSelect:a,align:l="start",collisionPadding:o=aa,...u}=e,n=Js(a);return(0,O.jsx)(yv,{...n,...u,ref:t,align:l,collisionPadding:o,style:{boxSizing:"border-box",...u.style,"--radix-select-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-select-content-available-width":"var(--radix-popper-available-width)","--radix-select-content-available-height":"var(--radix-popper-available-height)","--radix-select-trigger-width":"var(--radix-popper-anchor-width)","--radix-select-trigger-height":"var(--radix-popper-anchor-height)"}})});qd.displayName=wR;var[RR,Qd]=co(wl,{}),Fd="SelectViewport",Wd=T.forwardRef((e,t)=>{let{__scopeSelect:a,nonce:l,...o}=e,u=Al(Fd,a),n=Qd(Fd,a),r=we(t,u.onViewportChange),s=T.useRef(0);return(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)("style",{dangerouslySetInnerHTML:{__html:"[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"},nonce:l}),(0,O.jsx)(Qs.Slot,{scope:a,children:(0,O.jsx)(de.div,{"data-radix-select-viewport":"",role:"presentation",...o,ref:r,style:{position:"relative",flex:1,overflow:"hidden auto",...o.style},onScroll:ke(o.onScroll,i=>{let c=i.currentTarget,{contentWrapper:d,shouldExpandOnScrollRef:m}=n;if(m?.current&&d){let p=Math.abs(s.current-c.scrollTop);if(p>0){let L=window.innerHeight-aa*2,g=parseFloat(d.style.minHeight),S=parseFloat(d.style.height),h=Math.max(g,S);if(h<L){let f=h+p,x=Math.min(L,f),v=f-x;d.style.height=x+"px",d.style.bottom==="0px"&&(c.scrollTop=v>0?v:0,d.style.justifyContent="flex-end")}}}s.current=c.scrollTop})})})]})});Wd.displayName=Fd;var uy="SelectGroup",[AR,TR]=co(uy),ny=T.forwardRef((e,t)=>{let{__scopeSelect:a,...l}=e,o=Is();return(0,O.jsx)(AR,{scope:a,id:o,children:(0,O.jsx)(de.div,{role:"group","aria-labelledby":o,...l,ref:t})})});ny.displayName=uy;var ry="SelectLabel",MR=T.forwardRef((e,t)=>{let{__scopeSelect:a,...l}=e,o=TR(ry,a);return(0,O.jsx)(de.div,{id:o.id,...l,ref:t})});MR.displayName=ry;var Ks="SelectItem",[DR,sy]=co(Ks),ti=T.forwardRef((e,t)=>{let{__scopeSelect:a,value:l,disabled:o=!1,textValue:u,...n}=e,r=Rl(Ks,a),s=Al(Ks,a),i=r.value===l,[c,d]=T.useState(u??""),[m,p]=T.useState(!1),L=we(t,f=>s.itemRefCallback?.(f,l,o)),g=Is(),S=T.useRef("touch"),h=()=>{o||(r.onValueChange(l),r.onOpenChange(!1))};return(0,O.jsx)(DR,{scope:a,value:l,disabled:o,textId:g,isSelected:i,onItemTextChange:T.useCallback(f=>{d(x=>x||(f?.textContent??"").trim())},[]),children:(0,O.jsx)(Qs.ItemSlot,{scope:a,value:l,disabled:o,textValue:c,children:(0,O.jsx)(de.div,{role:"option","aria-labelledby":g,"data-highlighted":m?"":void 0,"aria-selected":i&&m,"data-state":i?"checked":"unchecked","aria-disabled":o||void 0,"data-disabled":o?"":void 0,tabIndex:o?void 0:-1,...n,ref:L,onFocus:ke(n.onFocus,()=>p(!0)),onBlur:ke(n.onBlur,()=>p(!1)),onClick:ke(n.onClick,()=>{S.current!=="mouse"&&h()}),onPointerUp:ke(n.onPointerUp,()=>{S.current==="mouse"&&h()}),onPointerDown:ke(n.onPointerDown,f=>{S.current=f.pointerType}),onPointerMove:ke(n.onPointerMove,f=>{S.current=f.pointerType,o?s.onItemLeave?.():S.current==="mouse"&&f.currentTarget.focus({preventScroll:!0})}),onPointerLeave:ke(n.onPointerLeave,f=>{f.currentTarget===document.activeElement&&s.onItemLeave?.()}),onKeyDown:ke(n.onKeyDown,f=>{s.searchRef?.current!==""&&f.key===" "||(mR.includes(f.key)&&h(),f.key===" "&&f.preventDefault())})})})})});ti.displayName=Ks;var Pn="SelectItemText",Jd=T.forwardRef((e,t)=>{let{__scopeSelect:a,className:l,style:o,...u}=e,n=Rl(Pn,a),r=Al(Pn,a),s=sy(Pn,a),i=xR(Pn,a),[c,d]=T.useState(null),m=we(t,h=>d(h),s.onItemTextChange,h=>r.itemTextRefCallback?.(h,s.value,s.disabled)),p=c?.textContent,L=T.useMemo(()=>(0,O.jsx)("option",{value:s.value,disabled:s.disabled,children:p},s.value),[s.disabled,s.value,p]),{onNativeOptionAdd:g,onNativeOptionRemove:S}=i;return Re(()=>(g(L),()=>S(L)),[g,S,L]),(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(de.span,{id:s.textId,...u,ref:m}),s.isSelected&&n.valueNode&&!n.valueNodeHasChildren&&!ai(n.value)?Xd.createPortal(u.children,n.valueNode):null]})});Jd.displayName=Pn;var iy="SelectItemIndicator",kR=T.forwardRef((e,t)=>{let{__scopeSelect:a,...l}=e;return sy(iy,a).isSelected?(0,O.jsx)(de.span,{"aria-hidden":!0,...l,ref:t}):null});kR.displayName=iy;var Gd="SelectScrollUpButton",ER=T.forwardRef((e,t)=>{let a=Al(Gd,e.__scopeSelect),l=Qd(Gd,e.__scopeSelect),[o,u]=T.useState(!1),n=we(t,l.onScrollButtonChange);return Re(()=>{if(a.viewport&&a.isPositioned){let s=function(){let c=i.scrollTop>0;u(c)};var r=s;let i=a.viewport;return s(),i.addEventListener("scroll",s),()=>i.removeEventListener("scroll",s)}},[a.viewport,a.isPositioned]),o?(0,O.jsx)(fy,{...e,ref:n,onAutoScroll:()=>{let{viewport:r,selectedItem:s}=a;r&&s&&(r.scrollTop=r.scrollTop-s.offsetHeight)}}):null});ER.displayName=Gd;var Vd="SelectScrollDownButton",OR=T.forwardRef((e,t)=>{let a=Al(Vd,e.__scopeSelect),l=Qd(Vd,e.__scopeSelect),[o,u]=T.useState(!1),n=we(t,l.onScrollButtonChange);return Re(()=>{if(a.viewport&&a.isPositioned){let s=function(){let c=i.scrollHeight-i.clientHeight,d=Math.ceil(i.scrollTop)<c;u(d)};var r=s;let i=a.viewport;return s(),i.addEventListener("scroll",s),()=>i.removeEventListener("scroll",s)}},[a.viewport,a.isPositioned]),o?(0,O.jsx)(fy,{...e,ref:n,onAutoScroll:()=>{let{viewport:r,selectedItem:s}=a;r&&s&&(r.scrollTop=r.scrollTop+s.offsetHeight)}}):null});OR.displayName=Vd;var fy=T.forwardRef((e,t)=>{let{__scopeSelect:a,onAutoScroll:l,...o}=e,u=Al("SelectScrollButton",a),n=T.useRef(null),r=Ws(a),s=T.useCallback(()=>{n.current!==null&&(window.clearInterval(n.current),n.current=null)},[]);return T.useEffect(()=>()=>s(),[s]),Re(()=>{r().find(c=>c.ref.current===document.activeElement)?.ref.current?.scrollIntoView({block:"nearest"})},[r]),(0,O.jsx)(de.div,{"aria-hidden":!0,...o,ref:t,style:{flexShrink:0,...o.style},onPointerDown:ke(o.onPointerDown,()=>{n.current===null&&(n.current=window.setInterval(l,50))}),onPointerMove:ke(o.onPointerMove,()=>{u.onItemLeave?.(),n.current===null&&(n.current=window.setInterval(l,50))}),onPointerLeave:ke(o.onPointerLeave,()=>{s()})})}),BR="SelectSeparator",PR=T.forwardRef((e,t)=>{let{__scopeSelect:a,...l}=e;return(0,O.jsx)(de.div,{"aria-hidden":!0,...l,ref:t})});PR.displayName=BR;var cy="SelectArrow",NR=T.forwardRef((e,t)=>{let{__scopeSelect:a,...l}=e,o=Js(a);return Al(cy,a).position==="popper"?(0,O.jsx)(Cv,{...o,...l,ref:t}):null});NR.displayName=cy;var dy="SelectBubbleInput",my=T.forwardRef(({__scopeSelect:e,...t},a)=>{let l=Rl(dy,e),{value:o,onValueChange:u,required:n,disabled:r,name:s,autoComplete:i,form:c}=l,{nativeOptions:d,nativeSelectKey:m}=l,p=T.useRef(null),L=we(a,p),g=o??"",S=Av(g),h=Array.from(d).some(f=>(f.props.value??"")==="");return T.useEffect(()=>{let f=p.current;if(!f)return;let x=window.HTMLSelectElement.prototype,y=Object.getOwnPropertyDescriptor(x,"value").set;if(S!==g&&y){let w=new Event("change",{bubbles:!0});y.call(f,g),f.dispatchEvent(w)}},[S,g]),(0,O.jsxs)(de.select,{"aria-hidden":!0,required:n,tabIndex:-1,name:s,autoComplete:i,disabled:r,form:c,onChange:f=>u(f.target.value),...t,style:{...wd,...t.style},ref:L,defaultValue:g,children:[ai(o)&&!h?(0,O.jsx)("option",{value:""}):null,Array.from(d)]},m)});my.displayName=dy;function zR(e){return typeof e=="function"}function ai(e){return e===""||e===void 0}function py(e){let t=Ft(e),a=T.useRef(""),l=T.useRef(0),o=T.useCallback(n=>{let r=a.current+n;t(r),(function s(i){a.current=i,window.clearTimeout(l.current),i!==""&&(l.current=window.setTimeout(()=>s(""),1e3))})(r)},[t]),u=T.useCallback(()=>{a.current="",window.clearTimeout(l.current)},[]);return T.useEffect(()=>()=>window.clearTimeout(l.current),[]),[a,o,u]}function hy(e,t,a){let o=t.length>1&&Array.from(t).every(i=>i===t[0])?t[0]:t,u=a?e.indexOf(a):-1,n=UR(e,Math.max(u,0));o.length===1&&(n=n.filter(i=>i!==a));let s=n.find(i=>i.textValue.toLowerCase().startsWith(o.toLowerCase()));return s!==a?s:void 0}function UR(e,t){return e.map((a,l)=>e[(t+l)%e.length])}var La=A(X(),1),$d=jd;var em=Yd,oi=(0,li.forwardRef)(({className:e,children:t,...a},l)=>(0,La.jsxs)($s,{ref:l,className:qa("flex h-8 w-full items-center justify-between gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-md-sm text-foreground","focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1","disabled:cursor-not-allowed disabled:opacity-50","[&>span]:line-clamp-1",e),...a,children:[t,(0,La.jsx)(Zd,{asChild:!0,children:(0,La.jsx)(In,{className:"h-4 w-4 opacity-50"})})]}));oi.displayName=$s.displayName;var ui=(0,li.forwardRef)(({className:e,children:t,position:a="popper",...l},o)=>(0,La.jsx)(Kd,{children:(0,La.jsx)(ei,{ref:o,className:qa("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md","data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95","data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95","data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2","data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",a==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",e),position:a,...l,children:(0,La.jsx)(Wd,{className:qa("p-1",a==="popper"&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:t})})}));ui.displayName=ei.displayName;var Lu=(0,li.forwardRef)(({className:e,children:t,...a},l)=>(0,La.jsx)(ti,{ref:l,className:qa("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-md-sm outline-none","focus:bg-accent focus:text-accent-foreground","data-[disabled]:pointer-events-none data-[disabled]:opacity-50",e),...a,children:(0,La.jsx)(Jd,{children:t})}));Lu.displayName=ti.displayName;var H=A(X(),1),_R="/rekam-medik/search?opsi=namaicd&q=";function gy({rows:e,onChange:t}){let[a,l]=(0,mo.useState)([]),[o,u]=(0,mo.useState)(-1),[n,r]=(0,mo.useState)({top:0,left:0,width:0}),s=(0,mo.useRef)(),i=(0,mo.useRef)([]),c=(L,g,S)=>{if(console.log("[RJ-DIAG] search:",L,"row:",g),clearTimeout(s.current),L.length<2){l([]),u(-1);return}if(S){let h=S.getBoundingClientRect();r({top:h.bottom+2,left:h.left,width:h.width})}s.current=setTimeout(async()=>{try{let h=await fetch(`${_R}${encodeURIComponent(L)}`);if(console.log("[RJ-DIAG] fetch status:",h.status),!h.ok)return;let f=await h.json();console.log("[RJ-DIAG] results:",f?.length||0),Array.isArray(f)&&(l(f.slice(0,10)),u(g))}catch(h){console.error("[RJ-DIAG] fetch error:",h)}},300)},d=(L,g)=>{console.log("[RJ-DIAG] picked:",g.NAMA,g.KODE);let S=e.map((h,f)=>f===L?{...h,kode10:g.KODE,namaDiagnosa:g.NAMA}:h);t(S),l([]),u(-1)};return(0,H.jsxs)("div",{className:"px-5 py-4 border-b border-border bg-background",children:[(0,H.jsxs)("div",{className:"flex items-center justify-between mb-3",children:[(0,H.jsxs)("h3",{className:"text-md-sm font-semibold text-foreground",children:["Diagnosa (ICD-10) ",e.length>0&&(0,H.jsxs)("span",{className:"text-muted-foreground font-normal",children:["(",e.length,")"]})]}),(0,H.jsxs)(_t,{variant:"default",size:"sm",onClick:()=>t([...e,{idicd:"",kode10:"",namaDiagnosa:"",kasus:"",komplikasi:""}]),children:[(0,H.jsx)(Kl,{className:"size-3.5"})," Tambah Diagnosa"]})]}),(0,H.jsx)("div",{className:"border border-border rounded-md overflow-hidden",children:(0,H.jsxs)("table",{className:"w-full text-md-xs",children:[(0,H.jsx)("thead",{children:(0,H.jsxs)("tr",{className:"border-b border-border bg-muted/50",children:[(0,H.jsx)("th",{className:"text-left font-semibold text-muted-foreground px-3 py-2",style:{width:"35%"},children:"Nama Diagnosa"}),(0,H.jsx)("th",{className:"text-left font-semibold text-muted-foreground px-3 py-2",style:{width:"14%"},children:"Kode ICD-10"}),(0,H.jsx)("th",{className:"text-left font-semibold text-muted-foreground px-3 py-2",style:{width:"15%"},children:"Kasus"}),(0,H.jsx)("th",{className:"text-left font-semibold text-muted-foreground px-3 py-2",style:{width:"15%"},children:"Komplikasi"}),(0,H.jsx)("th",{className:"pr-3 py-2",style:{width:"8%"}})]})}),(0,H.jsx)("tbody",{children:e.map((L,g)=>(0,H.jsxs)("tr",{className:"border-b border-border last:border-0 hover:bg-accent/50",children:[(0,H.jsxs)("td",{className:"px-3 py-1.5",children:[(0,H.jsx)(Fa,{type:"text",value:L.namaDiagnosa,ref:S=>i.current[g]=S,onChange:S=>{m(g,{namaDiagnosa:S.target.value}),c(S.target.value,g,S.target)},placeholder:"Cari diagnosa...",className:"border-0 bg-transparent px-0 h-7 text-md-sm shadow-none focus-visible:ring-0"}),a.length>0&&o===g&&(0,H.jsx)("div",{style:{position:"fixed",top:n.top,left:n.left,width:n.width,zIndex:2147483647,background:"#fff",border:"1px solid #d1d5db",borderRadius:"6px",boxShadow:"0 4px 12px rgba(0,0,0,.15)",maxHeight:"200px",overflowY:"auto"},children:a.map((S,h)=>(0,H.jsxs)("div",{onClick:()=>d(g,S),style:{padding:"6px 10px",cursor:"pointer",fontSize:"12px",borderBottom:"1px solid #f3f4f6"},onMouseEnter:f=>f.currentTarget.style.background="#f3f4f6",onMouseLeave:f=>f.currentTarget.style.background="",children:[(0,H.jsx)("div",{style:{fontWeight:500,color:"#1f2937"},children:S.NAMA}),(0,H.jsx)("div",{style:{color:"#6b7280",fontSize:"11px"},children:S.KODE})]},S.ID||h))})]}),(0,H.jsx)("td",{className:"px-3 py-1.5",children:(0,H.jsx)(Fa,{type:"text",value:L.kode10,onChange:S=>m(g,{kode10:S.target.value}),placeholder:"Kode",className:"border-0 bg-transparent px-0 h-7 text-md-xs font-mono shadow-none focus-visible:ring-0"})}),(0,H.jsx)("td",{className:"px-3 py-1.5",children:(0,H.jsxs)($d,{value:L.kasus,onValueChange:S=>m(g,{kasus:S}),children:[(0,H.jsx)(oi,{className:"h-7 w-full border-border text-md-xs",children:(0,H.jsx)(em,{placeholder:"Pilih Kasus"})}),(0,H.jsxs)(ui,{children:[(0,H.jsx)(Lu,{value:"BARU",children:"Baru"}),(0,H.jsx)(Lu,{value:"LAMA",children:"Lama"})]})]})}),(0,H.jsx)("td",{className:"px-3 py-1.5",children:(0,H.jsxs)($d,{value:L.komplikasi,onValueChange:S=>m(g,{komplikasi:S}),children:[(0,H.jsx)(oi,{className:"h-7 w-full border-border text-md-xs",children:(0,H.jsx)(em,{placeholder:"Pilih"})}),(0,H.jsxs)(ui,{children:[(0,H.jsx)(Lu,{value:"YA",children:"Ya"}),(0,H.jsx)(Lu,{value:"TIDAK",children:"Tidak"})]})]})}),(0,H.jsx)("td",{className:"pr-3 py-1.5",children:(0,H.jsx)(_t,{variant:"ghost",size:"icon",onClick:()=>p(g),className:"h-7 w-7 text-muted-foreground hover:text-destructive",children:(0,H.jsx)(Ql,{className:"size-3.5"})})})]},g))})]})})]});function m(L,g){t(e.map((S,h)=>h===L?{...S,...g}:S))}function p(L){t(e.filter((g,S)=>S!==L))}}var Su=A(P(),1);var oe=A(X(),1),qR="/rekam-medik/search?opsi=namaicd9&q=";function xy({rows:e,onChange:t}){let[a,l]=(0,Su.useState)([]),[o,u]=(0,Su.useState)(-1),[n,r]=(0,Su.useState)({top:0,left:0,width:0}),s=(0,Su.useRef)(),i=(p,L,g)=>{if(console.log("[RJ-TIN] search:",p,"row:",L),clearTimeout(s.current),p.length<2){l([]),u(-1);return}if(g){let S=g.getBoundingClientRect();r({top:S.bottom+2,left:S.left,width:S.width})}s.current=setTimeout(async()=>{try{let S=await fetch(`${qR}${encodeURIComponent(p)}`);if(console.log("[RJ-TIN] fetch status:",S.status),!S.ok)return;let h=await S.json();console.log("[RJ-TIN] results:",h?.length||0),Array.isArray(h)&&(l(h.slice(0,10)),u(L))}catch(S){console.error("[RJ-TIN] fetch error:",S)}},300)},c=(p,L)=>{console.log("[RJ-TIN] picked:",L.NAMA,L.KODE);let g=e.map((S,h)=>h===p?{...S,kode9:L.KODE,namaTindakan:L.NAMA}:S);t(g),l([]),u(-1)};return(0,oe.jsxs)("div",{className:"px-5 py-4 border-b border-border bg-background",children:[(0,oe.jsxs)("div",{className:"flex items-center justify-between mb-3",children:[(0,oe.jsxs)("h3",{className:"text-md-sm font-semibold text-foreground",children:["Tindakan (ICD-9) ",e.length>0&&(0,oe.jsxs)("span",{className:"text-muted-foreground font-normal",children:["(",e.length,")"]})]}),(0,oe.jsxs)(_t,{variant:"default",size:"sm",onClick:()=>t([...e,{idicd:"",kode9:"",namaTindakan:""}]),children:[(0,oe.jsx)(Kl,{className:"size-3.5"})," Tambah Tindakan"]})]}),e.length===0?(0,oe.jsxs)("div",{className:"border border-dashed border-border rounded-md py-6 text-center",children:[(0,oe.jsx)("p",{className:"text-md-sm text-muted-foreground",children:"Belum ada tindakan"}),(0,oe.jsx)("p",{className:"text-md-xs text-muted-foreground mt-1",children:'Klik "Tambah Tindakan" untuk menambahkan'})]}):(0,oe.jsx)("div",{className:"border border-border rounded-md overflow-hidden",children:(0,oe.jsxs)("table",{className:"w-full text-md-xs",children:[(0,oe.jsx)("thead",{children:(0,oe.jsxs)("tr",{className:"border-b border-border bg-muted/50",children:[(0,oe.jsx)("th",{className:"text-left font-semibold text-muted-foreground px-3 py-2",style:{width:"55%"},children:"Nama Tindakan"}),(0,oe.jsx)("th",{className:"text-left font-semibold text-muted-foreground px-3 py-2",style:{width:"20%"},children:"Kode ICD-9"}),(0,oe.jsx)("th",{className:"pr-3 py-2",style:{width:"8%"}})]})}),(0,oe.jsx)("tbody",{children:e.map((p,L)=>(0,oe.jsxs)("tr",{className:"border-b border-border last:border-0 hover:bg-accent/50",children:[(0,oe.jsxs)("td",{className:"px-3 py-1.5",children:[(0,oe.jsx)(Fa,{type:"text",value:p.namaTindakan,onChange:g=>{d(L,{namaTindakan:g.target.value}),i(g.target.value,L,g.target)},placeholder:"Cari tindakan...",className:"border-0 bg-transparent px-0 h-7 text-md-sm shadow-none focus-visible:ring-0"}),a.length>0&&o===L&&(0,oe.jsx)("div",{style:{position:"fixed",top:n.top,left:n.left,width:n.width,zIndex:2147483647,background:"#fff",border:"1px solid #d1d5db",borderRadius:"6px",boxShadow:"0 4px 12px rgba(0,0,0,.15)",maxHeight:"200px",overflowY:"auto"},children:a.map((g,S)=>(0,oe.jsxs)("div",{onClick:()=>c(L,g),style:{padding:"6px 10px",cursor:"pointer",fontSize:"12px",borderBottom:"1px solid #f3f4f6"},onMouseEnter:h=>h.currentTarget.style.background="#f3f4f6",onMouseLeave:h=>h.currentTarget.style.background="",children:[(0,oe.jsx)("div",{style:{fontWeight:500,color:"#1f2937"},children:g.NAMA}),(0,oe.jsx)("div",{style:{color:"#6b7280",fontSize:"11px"},children:g.KODE})]},g.ID||S))})]}),(0,oe.jsx)("td",{className:"px-3 py-1.5",children:(0,oe.jsx)(Fa,{type:"text",value:p.kode9,onChange:g=>d(L,{kode9:g.target.value}),placeholder:"Kode",className:"border-0 bg-transparent px-0 h-7 text-md-xs font-mono shadow-none focus-visible:ring-0"})}),(0,oe.jsx)("td",{className:"pr-3 py-1.5",children:(0,oe.jsx)(_t,{variant:"ghost",size:"icon",onClick:()=>m(L),className:"h-7 w-7 text-muted-foreground hover:text-destructive",children:(0,oe.jsx)(Ql,{className:"size-3.5"})})})]},L))})]})})]});function d(p,L){t(e.map((g,S)=>S===p?{...g,...L}:g))}function m(p){t(e.filter((L,g)=>g!==p))}}var Xa=A(X(),1);function Ly({errors:e}){return e.length===0?null:(0,Xa.jsx)("div",{className:"px-5 py-3 bg-destructive/10 border-t border-destructive/20",role:"alert",children:(0,Xa.jsxs)("div",{className:"flex items-start gap-2",children:[(0,Xa.jsx)(vl,{className:"size-4 text-destructive shrink-0 mt-0.5"}),(0,Xa.jsxs)("div",{children:[(0,Xa.jsxs)("p",{className:"text-md-xs font-semibold text-destructive mb-1",children:["Terdapat ",e.length," kesalahan"]}),(0,Xa.jsx)("ul",{className:"space-y-0.5",children:e.map((t,a)=>(0,Xa.jsxs)("li",{className:"text-md-xs text-destructive/80",children:[t.section,": ",t.message]},a))})]})]})})}var Sa=A(X(),1);function Sy({onCancel:e,onSave:t,saving:a,hasErrors:l,lastSaved:o}){return(0,Sa.jsxs)("div",{className:"flex items-center justify-between px-5 py-3 border-t border-border shrink-0 bg-background text-md-xs",children:[(0,Sa.jsxs)("div",{className:"flex items-center gap-3",children:[l&&(0,Sa.jsxs)("span",{className:"text-destructive flex items-center gap-1",children:[(0,Sa.jsx)("span",{className:"inline-block w-1.5 h-1.5 rounded-full bg-destructive"}),"Validasi gagal"]}),o&&(0,Sa.jsxs)("span",{className:"text-muted-foreground",children:["Tersimpan pukul ",o]})]}),(0,Sa.jsxs)("div",{className:"flex items-center gap-2",children:[(0,Sa.jsx)(_t,{variant:"outline",size:"sm",onClick:e,children:"Batal"}),(0,Sa.jsx)(_t,{variant:"default",size:"sm",onClick:t,disabled:a||l,children:a?"Menyimpan...":"Simpan"})]})]})}var pe=A(X(),1);function FR(e){let t=[];return e.diagnosa.length===0&&t.push({section:"Diagnosa",message:"Minimal 1 ICD-10 harus dipilih"}),e.diagnosa.forEach((a,l)=>{a.kode10&&!a.namaDiagnosa&&t.push({section:`Diagnosa #${l+1}`,message:"Nama diagnosa kosong"}),a.namaDiagnosa&&!a.kode10&&t.push({section:`Diagnosa #${l+1}`,message:"Kode ICD-10 kosong"})}),e.tindakan.forEach((a,l)=>{a.kode9&&(a.namaTindakan||t.push({section:`Tindakan #${l+1}`,message:"Nama tindakan kosong"}))}),t}function vy({data:e,onSave:t,onClose:a}){let[l,o]=(0,vu.useState)(e),[u,n]=(0,vu.useState)(!1),[r,s]=(0,vu.useState)(null),i=FR(l),c=(0,vu.useCallback)(async()=>{if(console.log("[RJ-APP] save clicked, errors:",i.length),!(i.length>0)){n(!0);try{await t(l),console.log("[RJ-APP] save completed"),s(new Date().toLocaleTimeString())}finally{n(!1)}}},[l,i,t]),d=(m,p)=>o({...l,clinicalNotes:{...l.clinicalNotes,[m]:p}});return(0,pe.jsxs)("div",{className:"resume-modal",children:[(0,pe.jsx)(DL,{title:"Resume Rajal",onClose:a}),(0,pe.jsxs)("div",{className:"flex-1 overflow-y-auto px-5 py-4 space-y-5",children:[(0,pe.jsx)(kL,{data:l.patientInfo}),(0,pe.jsx)(EL,{anamnesa:l.clinicalNotes.anamnesa,pemeriksaan:l.clinicalNotes.pemeriksaan_fisik,onChange:(m,p)=>d(m,p)}),(0,pe.jsx)("div",{className:"border-t border-border"}),(0,pe.jsxs)("div",{className:"px-5 py-4 border-b border-border bg-background",children:[(0,pe.jsx)("h3",{className:"text-md-sm font-semibold text-foreground mb-3",children:"Catatan Diagnosa"}),(0,pe.jsx)("textarea",{value:l.clinicalNotes.catatan,onChange:m=>d("catatan",m.target.value),className:"w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-md-xs resize-none",placeholder:"Catatan diagnosa..."})]}),(0,pe.jsx)("div",{className:"border-t border-border"}),(0,pe.jsxs)("div",{className:"px-5 py-4 border-b border-border bg-background",children:[(0,pe.jsx)("h3",{className:"text-md-sm font-semibold text-foreground mb-3",children:"Tindakan"}),(0,pe.jsx)("textarea",{value:l.clinicalNotes.tindakan,onChange:m=>d("tindakan",m.target.value),className:"w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-md-xs resize-none",placeholder:"Tindakan..."})]}),(0,pe.jsx)("div",{className:"border-t border-border"}),(0,pe.jsxs)("div",{className:"px-5 py-4 border-b border-border bg-background",children:[(0,pe.jsx)("h3",{className:"text-md-sm font-semibold text-foreground mb-3",children:"Terapi Pengobatan"}),(0,pe.jsx)("textarea",{value:l.clinicalNotes.terapi_pengobatan,onChange:m=>d("terapi_pengobatan",m.target.value),className:"w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-md-xs resize-none",placeholder:"Terapi pengobatan..."})]}),(0,pe.jsx)("div",{className:"border-t border-border"}),(0,pe.jsx)(PL,{vitals:l.vitalSigns,onChange:(m,p)=>o({...l,vitalSigns:{...l.vitalSigns,[m]:p}})}),(0,pe.jsx)("div",{className:"border-t border-border"}),(0,pe.jsx)(gy,{rows:l.diagnosa,onChange:m=>o({...l,diagnosa:m})}),(0,pe.jsx)("div",{className:"border-t border-border"}),(0,pe.jsx)(xy,{rows:l.tindakan,onChange:m=>o({...l,tindakan:m})})]}),(0,pe.jsx)(Ly,{errors:i}),(0,pe.jsx)(Sy,{saving:u,hasErrors:i.length>0,lastSaved:r,onSave:c,onCancel:a})]})}var yy=A(P(),1),ni=class extends yy.Component{constructor(){super(...arguments);this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(){this.props.onError()}render(){return this.state.hasError?null:this.props.children}};var om=A(X(),1),um=location.pathname.includes("rm-rawat-jalan-new"),GR={icd10:"/rekam-medik/search?opsi=namaicd&q=",icd9:"/rekam-medik/search?opsi=namaicd9&q="},tm=um?"/rekam-medik/control/rm-rawat-jalan":"/v2/m-klaim/detail-v2-refaktor/simpan_resume";console.log("[RJ] setup \u2014 isRj:",um,"ENDPOINT:",tm);console.log("[RJ] AUTOCOMPLETE_URLS:",GR);var Tl=null,am=null;function VR(){let e=document.getElementById("resume-view");if(!e)return null;let t=n=>{let r=e.querySelectorAll("table table tr, fieldset table tr");for(let s of r){let i=s.querySelectorAll("td");for(let c=0;c<i.length;c++)if(i[c].textContent?.trim()===n&&i[c+1]){let d=i[c+1];return(d.textContent?.trim()===":"?i[c+2]:d)?.textContent?.trim()||""}}return""},a=()=>{let n=Array.from(e.querySelectorAll("tr")).find(m=>m.textContent?.includes("Hasil Pemeriksaan Fisik"));if(!n)return"";let r=n.querySelector("td:last-child table, td[colspan] table");if(!r)return"";let s=[],i=["Tensi","Nadi","Suhu","Nafas","Tinggi","Berat"],c=r.querySelectorAll("tr"),d="";for(let m of c){let p=m.querySelectorAll("td"),L=!0;for(let g=0;g<p.length;g++){let S=p[g].textContent?.trim()||"";if(i.includes(S)&&g+2<p.length){let h=p[g+1]?.textContent?.trim()===":"?p[g+2]:null;if(h){L?(s.push(`${S}: ${h.textContent?.trim()||""}`),L=!1):s.push(`${S}: ${h.textContent?.trim()||""}`),g+=2;continue}}S==="Lainnya"&&g+2<p.length&&(d=p[g+2]?.textContent?.trim()||"")}}return d&&d.toLowerCase()!=="cm"&&s.push("",d),s.join(`
`)},l=n=>{let r=Array.from(e.querySelectorAll("tr")).find(c=>c.textContent?.includes("Hasil Pemeriksaan Fisik"));if(!r)return"";let s=r.querySelector("td:last-child table, td[colspan] table");if(!s)return"";let i=s.querySelectorAll("tr");for(let c of i){let d=c.querySelectorAll("td");for(let m=0;m<d.length;m++)if(d[m].textContent?.trim()===n&&d[m+1]){let p=d[m+1];return(p.textContent?.trim()===":"?d[m+2]:p)?.textContent?.trim()||""}}return""},o=[],u=Array.from(e.querySelectorAll("tr")).find(n=>n.textContent?.includes("ICD X"));if(u){let n=u.querySelector("td:last-child table, td[colspan] table");if(n){let r=n.querySelectorAll("tr");for(let s of r){let c=(s.textContent?.trim()||"").match(/-\s*(.+?)\s*\(([^)]+)\)\s*-/);c&&o.push({idicd:"",kode10:c[2],namaDiagnosa:c[1],kasus:"",komplikasi:""})}}}return{patientInfo:{norm:t("No. Rekam Medis"),pasien:t("Nama Pasien"),nama_dokter:""},clinicalNotes:{anamnesa:t("Anamnesa"),pemeriksaan_fisik:a(),catatan:t("Diagnosa"),tindakan:t("Tindakan"),terapi_pengobatan:t("Terapi Pengobatan")},vitalSigns:{tensi:l("Tensi"),nadi:l("Nadi"),suhu:l("Suhu"),nafas:l("Nafas"),tinggi:l("Tinggi"),berat:l("Berat")},diagnosa:o,tindakan:[]}}function XR(){console.log("[RJ] extractFormData \u2014 path:",location.pathname);let e=VR(),t=document,a=d=>t.getElementById(d)?.value||"",l=d=>t.querySelector(`textarea[name="${d}"], input[name="${d}"], #${d}`)?.value||"",o={norm:a("norm")||a("no_rm"),pasien:a("pasien")||a("nama_pasien"),nama_dokter:a("nama_dokter")||a("dokter")};console.log("[RJ] patientInfo:",o);let u={anamnesa:l("anamnesa"),pemeriksaan_fisik:l("pemeriksaan_fisik")||l("pemeriksaan")||l("fisik")||"",catatan:l("catatan"),tindakan:l("tindakan"),terapi_pengobatan:l("terapi_pengobatan")};console.log("[RJ] clinicalNotes:",u);let n={tensi:a("tensi"),nadi:a("nadi"),suhu:a("suhu"),nafas:a("nafas"),tinggi:a("tinggi"),berat:a("berat")};console.log("[RJ] vitalSigns:",n),console.log("[RJ] diagnosa extraction start");let r=[],s=t.querySelectorAll('input[name="kode10[]"], input[name="kode[]"]');if(s.length===0){console.log("[RJ] using numbered ID fallback for diagnosa");let d=1;for(;t.getElementById(`kode${d}`)||t.querySelector(`input[name="kode10[]"]:nth-child(${d})`);){let m=a(`idicd${d}`)||"",p=a(`kode${d}`)||"",L=a(`nama${d}`)||"";(p||L)&&r.push({idicd:m,kode10:p,namaDiagnosa:L,kasus:"",komplikasi:""}),d++}}else console.log("[RJ] using array-based diagnosa inputs, count:",s.length),s.forEach(d=>{let m=d.closest("tr");if(!m)return;let p=m.querySelector('input[name="idicd[]"], input[name="idicd"]')?.value||"",L=d.value||"",g=m.querySelector('input[name="namaDiagnosa[]"], input[name="nama[]"]')?.value||"",S=m.querySelector('select[name="kasus[]"]')?.value||"",h=m.querySelector('select[name="komplikasi[]"]')?.value||"";(L||g)&&r.push({idicd:p,kode10:L,namaDiagnosa:g,kasus:S,komplikasi:h})});console.log("[RJ] diagnosa found:",r.length,r);let i=[];return t.querySelectorAll('input[name="kode9[]"]').forEach(d=>{let m=d.closest("tr");if(!m)return;let p=d.value||"";if(!p)return;let L=m.querySelector('input[name="idicdTindakan[]"]')?.value||"",g=m.querySelector('input[name="namaTindakan[]"]')?.value||"",S=m.querySelector('select[name="komorbid[]"]')?.value||"",h=m.querySelector('select[name="kategoriProsedur[]"]')?.value||"",f=m.querySelector('input[name="snomedProsedur[]"]')?.value||"",x=m.querySelector('input[name="codeProsedur[]"]')?.value||p;i.push({idicdTindakan:L,kode9:p,namaTindakan:g,komorbid:S,kategoriProsedur:h,snomedProsedur:f,codeProsedur:x})}),e&&(console.log("[RJ] merging from view data"),o.norm||(o.norm=e.patientInfo.norm),o.pasien||(o.pasien=e.patientInfo.pasien),o.nama_dokter||(o.nama_dokter=e.patientInfo.nama_dokter),u.anamnesa||(u.anamnesa=e.clinicalNotes.anamnesa),u.pemeriksaan_fisik||(u.pemeriksaan_fisik=e.clinicalNotes.pemeriksaan_fisik),u.catatan||(u.catatan=e.clinicalNotes.catatan),u.tindakan||(u.tindakan=e.clinicalNotes.tindakan),u.terapi_pengobatan||(u.terapi_pengobatan=e.clinicalNotes.terapi_pengobatan),n.tensi||(n.tensi=e.vitalSigns.tensi),n.nadi||(n.nadi=e.vitalSigns.nadi),n.suhu||(n.suhu=e.vitalSigns.suhu),n.nafas||(n.nafas=e.vitalSigns.nafas),n.tinggi||(n.tinggi=e.vitalSigns.tinggi),n.berat||(n.berat=e.vitalSigns.berat),r.length===0&&r.push(...e.diagnosa)),console.log("[RJ] final data:",{patientInfo:o,clinicalNotes:u,vitalSigns:n,diagnosa:r,tindakan:i}),{patientInfo:o,clinicalNotes:u,vitalSigns:n,diagnosa:r,tindakan:i}}function jR(e){let t=[],a=(u,n)=>t.push([u,String(n)]);a("id_visit",document.getElementById("id_visit")?.value||""),a("id_rawat_jalan",document.getElementById("id_rawat_jalan")?.value||""),a("id_user",document.getElementById("id_user")?.value||""),a("id_dokter",document.getElementById("id_dokter")?.value||""),a("id_bed",document.getElementById("id_bed")?.value||""),["noregis","norm","pasien","nama_dokter","waktu","alergiMakananJSON","alergiLingkunganJSON"].forEach(u=>{let n=document.getElementById(u)?.value;n&&a(u,n)});let l={anamnesa:e.clinicalNotes.anamnesa,pemeriksaan_fisik:e.clinicalNotes.pemeriksaan_fisik,catatan:e.clinicalNotes.catatan,tindakan:e.clinicalNotes.tindakan,terapi_pengobatan:e.clinicalNotes.terapi_pengobatan};Object.entries(l).forEach(([u,n])=>{n&&a(u,n)});let o={tensi:e.vitalSigns.tensi,nadi:e.vitalSigns.nadi,suhu:e.vitalSigns.suhu,nafas:e.vitalSigns.nafas,tinggi:e.vitalSigns.tinggi,berat:e.vitalSigns.berat};return Object.entries(o).forEach(([u,n])=>{n&&a(u,n)}),e.diagnosa.forEach(u=>{a("idicd[]",u.idicd),a("kode10[]",u.kode10),a("namaDiagnosa[]",u.namaDiagnosa),a("kasus[]",u.kasus),a("komplikasi[]",u.komplikasi)}),e.tindakan.forEach(u=>{a("idicdTindakan[]",u.idicdTindakan),a("kode9[]",u.kode9),a("namaTindakan[]",u.namaTindakan),a("komorbid[]",u.komorbid),a("kategoriProsedur[]",u.kategoriProsedur),a("snomedProsedur[]",u.snomedProsedur),a("codeProsedur[]",u.codeProsedur||u.kode9)}),a("save","Simpan"),t.map(([u,n])=>encodeURIComponent(u)+"="+encodeURIComponent(n)).join("&")}function YR(e){let t=[],a=(u,n)=>t.push([u,String(n)]);["id_visit","id_rawat_jalan","id_user","id_dokter","id_bed","norm","noregis","pasien","nama_dokter"].forEach(u=>{let n=document.getElementById(u)?.value;n&&a(u,n)});let l=new Date,o=u=>u.toString().padStart(2,"0");return a("waktu",`${o(l.getDate())}/${o(l.getMonth()+1)}/${l.getFullYear()} ${o(l.getHours())}:${o(l.getMinutes())}:${o(l.getSeconds())}`),a("anamnesa",e.clinicalNotes.anamnesa),e.clinicalNotes.pemeriksaan_fisik&&a("pemeriksaan_fisik",e.clinicalNotes.pemeriksaan_fisik),e.clinicalNotes.catatan&&a("catatan",e.clinicalNotes.catatan),e.clinicalNotes.tindakan&&a("tindakan",e.clinicalNotes.tindakan),e.clinicalNotes.terapi_pengobatan&&a("terapi_pengobatan",e.clinicalNotes.terapi_pengobatan),a("tensi",e.vitalSigns.tensi),e.vitalSigns.nadi&&a("nadi",e.vitalSigns.nadi),e.vitalSigns.suhu&&a("suhu",e.vitalSigns.suhu),e.vitalSigns.nafas&&a("nafas",e.vitalSigns.nafas),e.vitalSigns.tinggi&&a("tinggi",e.vitalSigns.tinggi),e.vitalSigns.berat&&a("berat",e.vitalSigns.berat),e.diagnosa.forEach(u=>{a("nama[]",u.namaDiagnosa),a("idicd[]",u.idicd),a("kode10[]",u.kode10),a("kasus_diagnosa[]",u.kasus||"BARU"),a("komplikasi[]",u.komplikasi||"")}),e.tindakan.forEach(u=>{u.namaTindakan&&a("namaTindakan[]",u.namaTindakan),a("kode9[]",u.kode9)}),a("save","Simpan"),t.map(([u,n])=>encodeURIComponent(u)+"="+encodeURIComponent(n)).join("&")}function ZR(e){return um?YR(e):jR(e)}function lm(e){Tl&&(Tl.unmount(),Tl=null),e.innerHTML="",e.style.display="none",document.body.classList.remove("ext-resume-open"),am&&(am.disabled=!1)}function KR(e,t){if(Tl&&(Tl.unmount(),Tl=null),e.innerHTML="",!document.getElementById("morbis-resume-css")){let l=document.createElement("style");l.id="morbis-resume-css",l.textContent=`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, ::before, ::after{
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

::backdrop{
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

/*
! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: #e5e7eb; /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  -o-tab-size: 4;
     tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */
  font-feature-settings: normal; /* 5 */
  font-variation-settings: normal; /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font-family by default.
2. Use the user's configured \`mono\` font-feature-settings by default.
3. Use the user's configured \`mono\` font-variation-settings by default.
4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: JetBrains Mono, Fira Code, Consolas, monospace; /* 1 */
  font-feature-settings: normal; /* 2 */
  font-variation-settings: normal; /* 3 */
  font-size: 1em; /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  letter-spacing: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/

dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */

[hidden]:where(:not([hidden="until-found"])) {
  display: none;
}

*,
  *::before,
  *::after {
    box-sizing: border-box;
  }

html {
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

:root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.375rem;
  }

.dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
    --md-scrollbar: #484d54;
  }

::-moz-selection {
    background: #2469f0;
    color: white;
  }

::selection {
    background: #2469f0;
    color: white;
  }

* {
    scrollbar-width: thin;
    scrollbar-color: #c9cdd4 transparent;
  }

.dark * {
    scrollbar-color: var(--md-scrollbar) transparent;
  }

*::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

*::-webkit-scrollbar-track {
    background: transparent;
  }

*::-webkit-scrollbar-thumb {
    background: #c9cdd4;
    border-radius: 3px;
  }

.dark *::-webkit-scrollbar-thumb {
    background: var(--md-scrollbar);
  }

*::-webkit-scrollbar-thumb:hover {
    background: #a4a9b3;
  }

.dark *::-webkit-scrollbar-thumb:hover {
    background: #636971;
  }
.\\!container{
  width: 100% !important;
}
.container{
  width: 100%;
}
@media (min-width: 640px){

  .\\!container{
    max-width: 640px !important;
  }

  .container{
    max-width: 640px;
  }
}
@media (min-width: 768px){

  .\\!container{
    max-width: 768px !important;
  }

  .container{
    max-width: 768px;
  }
}
@media (min-width: 1024px){

  .\\!container{
    max-width: 1024px !important;
  }

  .container{
    max-width: 1024px;
  }
}
@media (min-width: 1280px){

  .\\!container{
    max-width: 1280px !important;
  }

  .container{
    max-width: 1280px;
  }
}
@media (min-width: 1536px){

  .\\!container{
    max-width: 1536px !important;
  }

  .container{
    max-width: 1536px;
  }
}
.pointer-events-none{
  pointer-events: none;
}
.visible{
  visibility: visible;
}
.static{
  position: static;
}
.fixed{
  position: fixed;
}
.absolute{
  position: absolute;
}
.relative{
  position: relative;
}
.bottom-4{
  bottom: 1rem;
}
.left-1\\/2{
  left: 50%;
}
.right-2\\.5{
  right: 0.625rem;
}
.top-1\\/2{
  top: 50%;
}
.z-50{
  z-index: 50;
}
.mx-auto{
  margin-left: auto;
  margin-right: auto;
}
.-mb-\\[1px\\]{
  margin-bottom: -1px;
}
.mb-1{
  margin-bottom: 0.25rem;
}
.mb-1\\.5{
  margin-bottom: 0.375rem;
}
.mb-3{
  margin-bottom: 0.75rem;
}
.ml-0\\.5{
  margin-left: 0.125rem;
}
.ml-1{
  margin-left: 0.25rem;
}
.mr-1{
  margin-right: 0.25rem;
}
.mr-2{
  margin-right: 0.5rem;
}
.mr-3{
  margin-right: 0.75rem;
}
.mt-0\\.5{
  margin-top: 0.125rem;
}
.mt-1{
  margin-top: 0.25rem;
}
.block{
  display: block;
}
.inline-block{
  display: inline-block;
}
.flex{
  display: flex;
}
.inline-flex{
  display: inline-flex;
}
.\\!table{
  display: table !important;
}
.table{
  display: table;
}
.grid{
  display: grid;
}
.\\!contents{
  display: contents !important;
}
.contents{
  display: contents;
}
.hidden{
  display: none;
}
.size-1\\.5{
  width: 0.375rem;
  height: 0.375rem;
}
.size-10{
  width: 2.5rem;
  height: 2.5rem;
}
.size-2\\.5{
  width: 0.625rem;
  height: 0.625rem;
}
.size-3{
  width: 0.75rem;
  height: 0.75rem;
}
.size-3\\.5{
  width: 0.875rem;
  height: 0.875rem;
}
.size-4{
  width: 1rem;
  height: 1rem;
}
.size-5{
  width: 1.25rem;
  height: 1.25rem;
}
.h-1{
  height: 0.25rem;
}
.h-1\\.5{
  height: 0.375rem;
}
.h-2{
  height: 0.5rem;
}
.h-20{
  height: 5rem;
}
.h-24{
  height: 6rem;
}
.h-4{
  height: 1rem;
}
.h-5{
  height: 1.25rem;
}
.h-6{
  height: 1.5rem;
}
.h-7{
  height: 1.75rem;
}
.h-8{
  height: 2rem;
}
.h-9{
  height: 2.25rem;
}
.h-\\[300px\\]{
  height: 300px;
}
.h-\\[var\\(--radix-select-trigger-height\\)\\]{
  height: var(--radix-select-trigger-height);
}
.h-full{
  height: 100%;
}
.max-h-60{
  max-height: 15rem;
}
.max-h-96{
  max-height: 24rem;
}
.max-h-\\[600px\\]{
  max-height: 600px;
}
.min-h-\\[200px\\]{
  min-height: 200px;
}
.w-1\\.5{
  width: 0.375rem;
}
.w-2{
  width: 0.5rem;
}
.w-4{
  width: 1rem;
}
.w-5{
  width: 1.25rem;
}
.w-6{
  width: 1.5rem;
}
.w-7{
  width: 1.75rem;
}
.w-8{
  width: 2rem;
}
.w-9{
  width: 2.25rem;
}
.w-\\[100px\\]{
  width: 100px;
}
.w-\\[120px\\]{
  width: 120px;
}
.w-\\[340px\\]{
  width: 340px;
}
.w-\\[90px\\]{
  width: 90px;
}
.w-full{
  width: 100%;
}
.min-w-0{
  min-width: 0px;
}
.min-w-\\[8rem\\]{
  min-width: 8rem;
}
.min-w-\\[var\\(--radix-select-trigger-width\\)\\]{
  min-width: var(--radix-select-trigger-width);
}
.max-w-\\[120px\\]{
  max-width: 120px;
}
.max-w-\\[200px\\]{
  max-width: 200px;
}
.flex-1{
  flex: 1 1 0%;
}
.flex-shrink{
  flex-shrink: 1;
}
.shrink-0{
  flex-shrink: 0;
}
.-translate-x-1\\/2{
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.-translate-y-1\\/2{
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.scale-90{
  --tw-scale-x: .9;
  --tw-scale-y: .9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.transform{
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
@keyframes pulse{

  50%{
    opacity: .5;
  }
}
.animate-pulse{
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes slide-up{

  0%{
    opacity: 0;
    transform: translateY(8px);
  }

  100%{
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up{
  animation: slide-up 0.15s ease-out;
}
.cursor-default{
  cursor: default;
}
.cursor-not-allowed{
  cursor: not-allowed;
}
.cursor-pointer{
  cursor: pointer;
}
.select-none{
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.resize-none{
  resize: none;
}
.resize{
  resize: both;
}
.grid-cols-2{
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-6{
  grid-template-columns: repeat(6, minmax(0, 1fr));
}
.flex-col{
  flex-direction: column;
}
.flex-wrap{
  flex-wrap: wrap;
}
.items-start{
  align-items: flex-start;
}
.items-center{
  align-items: center;
}
.justify-center{
  justify-content: center;
}
.justify-between{
  justify-content: space-between;
}
.gap-0{
  gap: 0px;
}
.gap-1{
  gap: 0.25rem;
}
.gap-1\\.5{
  gap: 0.375rem;
}
.gap-2{
  gap: 0.5rem;
}
.gap-2\\.5{
  gap: 0.625rem;
}
.gap-3{
  gap: 0.75rem;
}
.gap-4{
  gap: 1rem;
}
.gap-x-6{
  -moz-column-gap: 1.5rem;
       column-gap: 1.5rem;
}
.gap-y-2{
  row-gap: 0.5rem;
}
.space-y-0\\.5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));
}
.space-y-1 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}
.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.375rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.375rem * var(--tw-space-y-reverse));
}
.space-y-2 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}
.space-y-2\\.5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.625rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.625rem * var(--tw-space-y-reverse));
}
.space-y-3 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
}
.space-y-4 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
.space-y-5 > :not([hidden]) ~ :not([hidden]){
  --tw-space-y-reverse: 0;
  margin-top: calc(1.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.25rem * var(--tw-space-y-reverse));
}
.divide-y > :not([hidden]) ~ :not([hidden]){
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}
.divide-border > :not([hidden]) ~ :not([hidden]){
  border-color: hsl(var(--border));
}
.overflow-hidden{
  overflow: hidden;
}
.overflow-y-auto{
  overflow-y: auto;
}
.truncate{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.whitespace-nowrap{
  white-space: nowrap;
}
.whitespace-pre-wrap{
  white-space: pre-wrap;
}
.break-words{
  overflow-wrap: break-word;
}
.rounded{
  border-radius: 0.25rem;
}
.rounded-full{
  border-radius: 9999px;
}
.rounded-lg{
  border-radius: 0.5rem;
}
.rounded-md{
  border-radius: 6px;
}
.rounded-sm{
  border-radius: 0.125rem;
}
.border{
  border-width: 1px;
}
.border-0{
  border-width: 0px;
}
.border-2{
  border-width: 2px;
}
.border-b{
  border-bottom-width: 1px;
}
.border-b-2{
  border-bottom-width: 2px;
}
.border-l{
  border-left-width: 1px;
}
.border-l-2{
  border-left-width: 2px;
}
.border-t{
  border-top-width: 1px;
}
.border-dashed{
  border-style: dashed;
}
.border-\\[\\#2469f0\\]{
  --tw-border-opacity: 1;
  border-color: rgb(36 105 240 / var(--tw-border-opacity, 1));
}
.border-amber-200{
  --tw-border-opacity: 1;
  border-color: rgb(253 230 138 / var(--tw-border-opacity, 1));
}
.border-border{
  border-color: hsl(var(--border));
}
.border-destructive\\/20{
  border-color: hsl(var(--destructive) / 0.2);
}
.border-foreground{
  border-color: hsl(var(--foreground));
}
.border-green-200{
  --tw-border-opacity: 1;
  border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
}
.border-input{
  border-color: hsl(var(--input));
}
.border-primary{
  border-color: hsl(var(--primary));
}
.border-primary\\/20{
  border-color: hsl(var(--primary) / 0.2);
}
.border-red-200{
  --tw-border-opacity: 1;
  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
}
.border-red-500{
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
}
.border-transparent{
  border-color: transparent;
}
.bg-\\[\\#2469f0\\]{
  --tw-bg-opacity: 1;
  background-color: rgb(36 105 240 / var(--tw-bg-opacity, 1));
}
.bg-accent{
  background-color: hsl(var(--accent));
}
.bg-accent\\/20{
  background-color: hsl(var(--accent) / 0.2);
}
.bg-accent\\/40{
  background-color: hsl(var(--accent) / 0.4);
}
.bg-accent\\/50{
  background-color: hsl(var(--accent) / 0.5);
}
.bg-amber-50{
  --tw-bg-opacity: 1;
  background-color: rgb(255 251 235 / var(--tw-bg-opacity, 1));
}
.bg-amber-50\\/50{
  background-color: rgb(255 251 235 / 0.5);
}
.bg-background{
  background-color: hsl(var(--background));
}
.bg-blue-100{
  --tw-bg-opacity: 1;
  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
}
.bg-blue-50{
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}
.bg-card{
  background-color: hsl(var(--card));
}
.bg-destructive{
  background-color: hsl(var(--destructive));
}
.bg-destructive\\/10{
  background-color: hsl(var(--destructive) / 0.1);
}
.bg-foreground{
  background-color: hsl(var(--foreground));
}
.bg-green-50{
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
}
.bg-green-500{
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}
.bg-green-600{
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
}
.bg-muted{
  background-color: hsl(var(--muted));
}
.bg-muted-foreground{
  background-color: hsl(var(--muted-foreground));
}
.bg-muted\\/50{
  background-color: hsl(var(--muted) / 0.5);
}
.bg-popover{
  background-color: hsl(var(--popover));
}
.bg-primary{
  background-color: hsl(var(--primary));
}
.bg-primary\\/10{
  background-color: hsl(var(--primary) / 0.1);
}
.bg-red-50{
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
}
.bg-red-500\\/5{
  background-color: rgb(239 68 68 / 0.05);
}
.bg-red-600{
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity, 1));
}
.bg-secondary{
  background-color: hsl(var(--secondary));
}
.bg-transparent{
  background-color: transparent;
}
.p-0\\.5{
  padding: 0.125rem;
}
.p-1{
  padding: 0.25rem;
}
.p-1\\.5{
  padding: 0.375rem;
}
.p-2{
  padding: 0.5rem;
}
.p-2\\.5{
  padding: 0.625rem;
}
.p-3{
  padding: 0.75rem;
}
.p-4{
  padding: 1rem;
}
.p-8{
  padding: 2rem;
}
.px-0{
  padding-left: 0px;
  padding-right: 0px;
}
.px-1{
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
.px-1\\.5{
  padding-left: 0.375rem;
  padding-right: 0.375rem;
}
.px-2{
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-2\\.5{
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}
.px-3{
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-3\\.5{
  padding-left: 0.875rem;
  padding-right: 0.875rem;
}
.px-4{
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-5{
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.py-0{
  padding-top: 0px;
  padding-bottom: 0px;
}
.py-0\\.5{
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.py-1{
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-1\\.5{
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.py-12{
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.py-2{
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-2\\.5{
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}
.py-3{
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-4{
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-6{
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.py-8{
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.pb-1\\.5{
  padding-bottom: 0.375rem;
}
.pb-2{
  padding-bottom: 0.5rem;
}
.pl-2{
  padding-left: 0.5rem;
}
.pl-6{
  padding-left: 1.5rem;
}
.pr-10{
  padding-right: 2.5rem;
}
.pr-3{
  padding-right: 0.75rem;
}
.pr-8{
  padding-right: 2rem;
}
.pt-3{
  padding-top: 0.75rem;
}
.text-left{
  text-align: left;
}
.text-center{
  text-align: center;
}
.font-mono{
  font-family: JetBrains Mono, Fira Code, Consolas, monospace;
}
.text-\\[10px\\]{
  font-size: 10px;
}
.text-\\[11px\\]{
  font-size: 11px;
}
.text-\\[8px\\]{
  font-size: 8px;
}
.text-\\[9px\\]{
  font-size: 9px;
}
.text-md-lg{
  font-size: 15px;
  line-height: 24px;
}
.text-md-sm{
  font-size: 12px;
  line-height: 18px;
}
.text-md-xs{
  font-size: 11px;
  line-height: 16px;
}
.font-bold{
  font-weight: 700;
}
.font-medium{
  font-weight: 500;
}
.font-normal{
  font-weight: 400;
}
.font-semibold{
  font-weight: 600;
}
.uppercase{
  text-transform: uppercase;
}
.leading-relaxed{
  line-height: 1.625;
}
.tracking-wide{
  letter-spacing: 0.025em;
}
.tracking-wider{
  letter-spacing: 0.05em;
}
.text-\\[\\#2469f0\\]{
  --tw-text-opacity: 1;
  color: rgb(36 105 240 / var(--tw-text-opacity, 1));
}
.text-amber-700{
  --tw-text-opacity: 1;
  color: rgb(180 83 9 / var(--tw-text-opacity, 1));
}
.text-background{
  color: hsl(var(--background));
}
.text-blue-700{
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}
.text-card-foreground{
  color: hsl(var(--card-foreground));
}
.text-destructive{
  color: hsl(var(--destructive));
}
.text-destructive-foreground{
  color: hsl(var(--destructive-foreground));
}
.text-destructive\\/80{
  color: hsl(var(--destructive) / 0.8);
}
.text-foreground{
  color: hsl(var(--foreground));
}
.text-green-700{
  --tw-text-opacity: 1;
  color: rgb(21 128 61 / var(--tw-text-opacity, 1));
}
.text-muted-foreground{
  color: hsl(var(--muted-foreground));
}
.text-muted-foreground\\/60{
  color: hsl(var(--muted-foreground) / 0.6);
}
.text-popover-foreground{
  color: hsl(var(--popover-foreground));
}
.text-primary{
  color: hsl(var(--primary));
}
.text-primary-foreground{
  color: hsl(var(--primary-foreground));
}
.text-red-600{
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.text-red-800{
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
}
.text-red-900{
  --tw-text-opacity: 1;
  color: rgb(127 29 29 / var(--tw-text-opacity, 1));
}
.text-secondary-foreground{
  color: hsl(var(--secondary-foreground));
}
.text-white{
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.underline-offset-4{
  text-underline-offset: 4px;
}
.antialiased{
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.opacity-0{
  opacity: 0;
}
.opacity-30{
  opacity: 0.3;
}
.opacity-50{
  opacity: 0.5;
}
.opacity-60{
  opacity: 0.6;
}
.opacity-85{
  opacity: 0.85;
}
.opacity-90{
  opacity: 0.9;
}
.shadow{
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-lg{
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-md{
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-none{
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-sm{
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.outline-none{
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.outline{
  outline-style: solid;
}
.ring{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.ring-0{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.ring-offset-background{
  --tw-ring-offset-color: hsl(var(--background));
}
.blur{
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.grayscale{
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.filter{
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.backdrop-filter{
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.transition{
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-all{
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-colors{
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-transform{
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.duration-150{
  transition-duration: 150ms;
}
.duration-200{
  transition-duration: 200ms;
}
.duration-300{
  transition-duration: 300ms;
}
.ease-in-out{
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.ease-out{
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
@keyframes enter{

  from{
    opacity: var(--tw-enter-opacity, 1);
    transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0));
  }
}
@keyframes exit{

  to{
    opacity: var(--tw-exit-opacity, 1);
    transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0));
  }
}
.animate-in{
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}
.fade-in{
  --tw-enter-opacity: 0;
}
.duration-150{
  animation-duration: 150ms;
}
.duration-200{
  animation-duration: 200ms;
}
.duration-300{
  animation-duration: 300ms;
}
.ease-in-out{
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.ease-out{
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
.running{
  animation-play-state: running;
}
.placeholder\\:text-muted-foreground::-moz-placeholder{
  color: hsl(var(--muted-foreground));
}
.placeholder\\:text-muted-foreground::placeholder{
  color: hsl(var(--muted-foreground));
}
.last\\:border-0:last-child{
  border-width: 0px;
}
.hover\\:bg-accent:hover{
  background-color: hsl(var(--accent));
}
.hover\\:bg-accent\\/50:hover{
  background-color: hsl(var(--accent) / 0.5);
}
.hover\\:bg-amber-100\\/50:hover{
  background-color: rgb(254 243 199 / 0.5);
}
.hover\\:bg-destructive\\/10:hover{
  background-color: hsl(var(--destructive) / 0.1);
}
.hover\\:bg-destructive\\/90:hover{
  background-color: hsl(var(--destructive) / 0.9);
}
.hover\\:bg-green-700:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-primary\\/5:hover{
  background-color: hsl(var(--primary) / 0.05);
}
.hover\\:bg-primary\\/90:hover{
  background-color: hsl(var(--primary) / 0.9);
}
.hover\\:bg-red-500\\/10:hover{
  background-color: rgb(239 68 68 / 0.1);
}
.hover\\:bg-red-700:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(185 28 28 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-secondary\\/80:hover{
  background-color: hsl(var(--secondary) / 0.8);
}
.hover\\:text-accent-foreground:hover{
  color: hsl(var(--accent-foreground));
}
.hover\\:text-destructive:hover{
  color: hsl(var(--destructive));
}
.hover\\:text-foreground:hover{
  color: hsl(var(--foreground));
}
.hover\\:text-red-600:hover{
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.hover\\:underline:hover{
  text-decoration-line: underline;
}
.hover\\:opacity-70:hover{
  opacity: 0.7;
}
.focus\\:bg-accent:focus{
  background-color: hsl(var(--accent));
}
.focus\\:text-accent-foreground:focus{
  color: hsl(var(--accent-foreground));
}
.focus\\:outline-none:focus{
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus\\:ring-1:focus{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-2:focus{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-primary:focus{
  --tw-ring-color: hsl(var(--primary));
}
.focus\\:ring-red-500:focus{
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(239 68 68 / var(--tw-ring-opacity, 1));
}
.focus\\:ring-ring:focus{
  --tw-ring-color: hsl(var(--ring));
}
.focus\\:ring-offset-1:focus{
  --tw-ring-offset-width: 1px;
}
.focus-visible\\:outline-none:focus-visible{
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus-visible\\:ring-0:focus-visible{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus-visible\\:ring-2:focus-visible{
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus-visible\\:ring-ring:focus-visible{
  --tw-ring-color: hsl(var(--ring));
}
.focus-visible\\:ring-offset-1:focus-visible{
  --tw-ring-offset-width: 1px;
}
.disabled\\:pointer-events-none:disabled{
  pointer-events: none;
}
.disabled\\:cursor-not-allowed:disabled{
  cursor: not-allowed;
}
.disabled\\:opacity-50:disabled{
  opacity: 0.5;
}
.group:hover .group-hover\\:opacity-100{
  opacity: 1;
}
.data-\\[disabled\\]\\:pointer-events-none[data-disabled]{
  pointer-events: none;
}
.data-\\[side\\=bottom\\]\\:translate-y-1[data-side="bottom"]{
  --tw-translate-y: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[side\\=top\\]\\:-translate-y-1[data-side="top"]{
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=checked\\]\\:translate-x-4[data-state="checked"]{
  --tw-translate-x: 1rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=unchecked\\]\\:translate-x-0[data-state="unchecked"]{
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=checked\\]\\:bg-primary[data-state="checked"]{
  background-color: hsl(var(--primary));
}
.data-\\[state\\=unchecked\\]\\:bg-input[data-state="unchecked"]{
  background-color: hsl(var(--input));
}
.data-\\[disabled\\]\\:opacity-50[data-disabled]{
  opacity: 0.5;
}
.data-\\[state\\=open\\]\\:animate-in[data-state="open"]{
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}
.data-\\[state\\=closed\\]\\:animate-out[data-state="closed"]{
  animation-name: exit;
  animation-duration: 150ms;
  --tw-exit-opacity: initial;
  --tw-exit-scale: initial;
  --tw-exit-rotate: initial;
  --tw-exit-translate-x: initial;
  --tw-exit-translate-y: initial;
}
.data-\\[state\\=closed\\]\\:fade-out-0[data-state="closed"]{
  --tw-exit-opacity: 0;
}
.data-\\[state\\=open\\]\\:fade-in-0[data-state="open"]{
  --tw-enter-opacity: 0;
}
.data-\\[state\\=closed\\]\\:zoom-out-95[data-state="closed"]{
  --tw-exit-scale: .95;
}
.data-\\[state\\=open\\]\\:zoom-in-95[data-state="open"]{
  --tw-enter-scale: .95;
}
.data-\\[side\\=bottom\\]\\:slide-in-from-top-2[data-side="bottom"]{
  --tw-enter-translate-y: -0.5rem;
}
.data-\\[side\\=left\\]\\:slide-in-from-right-2[data-side="left"]{
  --tw-enter-translate-x: 0.5rem;
}
.data-\\[side\\=right\\]\\:slide-in-from-left-2[data-side="right"]{
  --tw-enter-translate-x: -0.5rem;
}
.data-\\[side\\=top\\]\\:slide-in-from-bottom-2[data-side="top"]{
  --tw-enter-translate-y: 0.5rem;
}
.dark\\:border-amber-800:is(.dark *){
  --tw-border-opacity: 1;
  border-color: rgb(146 64 14 / var(--tw-border-opacity, 1));
}
.dark\\:border-green-800:is(.dark *){
  --tw-border-opacity: 1;
  border-color: rgb(22 101 52 / var(--tw-border-opacity, 1));
}
.dark\\:border-red-900:is(.dark *){
  --tw-border-opacity: 1;
  border-color: rgb(127 29 29 / var(--tw-border-opacity, 1));
}
.dark\\:bg-amber-900\\/30:is(.dark *){
  background-color: rgb(120 53 15 / 0.3);
}
.dark\\:bg-amber-950\\/20:is(.dark *){
  background-color: rgb(69 26 3 / 0.2);
}
.dark\\:bg-blue-900\\/30:is(.dark *){
  background-color: rgb(30 58 138 / 0.3);
}
.dark\\:bg-blue-950\\/20:is(.dark *){
  background-color: rgb(23 37 84 / 0.2);
}
.dark\\:bg-green-950\\/20:is(.dark *){
  background-color: rgb(5 46 22 / 0.2);
}
.dark\\:bg-red-950\\/20:is(.dark *){
  background-color: rgb(69 10 10 / 0.2);
}
.dark\\:text-amber-300:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(252 211 77 / var(--tw-text-opacity, 1));
}
.dark\\:text-blue-300:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(147 197 253 / var(--tw-text-opacity, 1));
}
.dark\\:text-green-300:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(134 239 172 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-200:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(254 202 202 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-300:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity, 1));
}
.\\[\\&\\>span\\]\\:line-clamp-1>span{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.\\[\\&\\>span\\]\\:h-3>span{
  height: 0.75rem;
}
.\\[\\&\\>span\\]\\:w-3>span{
  width: 0.75rem;
}
.data-\\[state\\=checked\\]\\:\\[\\&\\>span\\]\\:translate-x-3>span[data-state="checked"]{
  --tw-translate-x: 0.75rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.\\[\\&_svg\\]\\:pointer-events-none svg{
  pointer-events: none;
}
.\\[\\&_svg\\]\\:size-4 svg{
  width: 1rem;
  height: 1rem;
}
.\\[\\&_svg\\]\\:shrink-0 svg{
  flex-shrink: 0;
}

      .resume-modal{background:#fff;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,.25);width:90%;max-width:800px;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;animation:resume-slideup .25s ease;}
      .resume-modal textarea{resize:vertical!important;min-height:60px;}
      .resume-modal button:not([disabled]){cursor:pointer;}
      @keyframes resume-slideup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    `,document.head.appendChild(l)}Tl=(0,by.createRoot)(e);let a=async l=>{let o=ZR(l);console.log("[RJ] save \u2014 endpoint:",tm),console.log("[RJ] save \u2014 body:",o);let u=await fetch(tm,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o,credentials:"same-origin"});if(!u.ok)throw console.error("[RJ] save failed:",u.status),new Error("HTTP "+u.status);console.log("[RJ] save success")};Tl.render((0,om.jsx)(ni,{onError:()=>setTimeout(()=>lm(e),0),children:(0,om.jsx)(vy,{data:t,onSave:a,onClose:()=>lm(e)})})),document.body.classList.add("ext-resume-open"),setTimeout(()=>{e.querySelectorAll("textarea").forEach(l=>{l.addEventListener("input",()=>{l.style.height="auto",l.style.height=l.scrollHeight+"px"}),l.dispatchEvent(new Event("input"))})},50)}function Cy(){if(document.getElementById("ext-resume-float-btn"))return;let e=document.createElement("div");e.id="ext-resume-container",e.style.cssText="position: fixed; inset: 0; z-index: 2147483646; display: none; background: rgba(0,0,0,.4); align-items: center; justify-content: center;",document.body.appendChild(e);let t=document.createElement("button");am=t,t.id="ext-resume-float-btn",t.textContent="RJ",t.title="Resume Rajal",t.style.cssText="position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:2147483645;width:44px;height:44px;border-radius:10px;border:none;background:#2469f0;color:white;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);transition:transform .15s,box-shadow .15s;font-family:Inter,-apple-system,sans-serif;",t.onmouseenter=()=>{t.style.transform="translateY(-50%) scale(1.05)",t.style.boxShadow="0 4px 16px rgba(36,105,240,.35)"},t.onmouseleave=()=>{t.style.transform="translateY(-50%)",t.style.boxShadow="0 2px 8px rgba(0,0,0,.2)"},t.addEventListener("click",()=>{if(!t.disabled){console.log("[RJ] button clicked"),t.disabled=!0;try{let a=XR();console.log("[RJ] extracted data:",a),e.style.display="flex",KR(e,a)}catch(a){console.error("[RJ] click error:",a),e.style.display="none",t.disabled=!1}}}),document.body.appendChild(t),document.addEventListener("keydown",a=>{a.key==="Escape"&&e.style.display==="block"&&lm(e)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Cy):Cy();return My(QR);})();
/*! Bundled license information:

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs:
lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs:
lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs:
lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs:
lucide-react/dist/esm/defaultAttributes.mjs:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs:
lucide-react/dist/esm/context.mjs:
lucide-react/dist/esm/Icon.mjs:
lucide-react/dist/esm/createLucideIcon.mjs:
lucide-react/dist/esm/icons/chevron-down.mjs:
lucide-react/dist/esm/icons/plus.mjs:
lucide-react/dist/esm/icons/trash-2.mjs:
lucide-react/dist/esm/icons/triangle-alert.mjs:
lucide-react/dist/esm/icons/x.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.18.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
