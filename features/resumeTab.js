"use strict";var __morbis_feature=(()=>{var rC=Object.create;var Pi=Object.defineProperty;var sC=Object.getOwnPropertyDescriptor;var iC=Object.getOwnPropertyNames;var fC=Object.getPrototypeOf,cC=Object.prototype.hasOwnProperty;var Um=e=>{throw TypeError(e)};var Ca=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(a){throw t=0,a}};var Hm=(e,t,a,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of iC(t))!cC.call(e,o)&&o!==a&&Pi(e,o,{get:()=>t[o],enumerable:!(l=sC(t,o))||l.enumerable});return e};var R=(e,t,a)=>(a=e!=null?rC(fC(e)):{},Hm(t||!e||!e.__esModule?Pi(a,"default",{value:e,enumerable:!0}):a,e)),dC=e=>Hm(Pi({},"__esModule",{value:!0}),e);var zm=(e,t,a)=>t.has(e)||Um("Cannot "+a);var rt=(e,t,a)=>(zm(e,t,"read from private field"),a?a.call(e):t.get(e)),Nm=(e,t,a)=>t.has(e)?Um("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,a),_i=(e,t,a,l)=>(zm(e,t,"write to private field"),l?l.call(e,a):t.set(e,a),a);var Qm=Ca(we=>{"use strict";function Ni(e,t){var a=e.length;e.push(t);e:for(;0<a;){var l=a-1>>>1,o=e[l];if(0<dr(o,t))e[l]=t,e[a]=o,a=l;else break e}}function ba(e){return e.length===0?null:e[0]}function pr(e){if(e.length===0)return null;var t=e[0],a=e.pop();if(a!==t){e[0]=a;e:for(var l=0,o=e.length,n=o>>>1;l<n;){var u=2*(l+1)-1,r=e[u],s=u+1,i=e[s];if(0>dr(r,a))s<o&&0>dr(i,r)?(e[l]=i,e[s]=a,l=s):(e[l]=r,e[u]=a,l=u);else if(s<o&&0>dr(i,a))e[l]=i,e[s]=a,l=s;else break e}}return t}function dr(e,t){var a=e.sortIndex-t.sortIndex;return a!==0?a:e.id-t.id}we.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(qm=performance,we.unstable_now=function(){return qm.now()}):(Ui=Date,Fm=Ui.now(),we.unstable_now=function(){return Ui.now()-Fm});var qm,Ui,Fm,Pa=[],cl=[],mC=1,Xt=null,st=3,qi=!1,Kn=!1,Zn=!1,Fi=!1,Xm=typeof setTimeout=="function"?setTimeout:null,jm=typeof clearTimeout=="function"?clearTimeout:null,Vm=typeof setImmediate<"u"?setImmediate:null;function mr(e){for(var t=ba(cl);t!==null;){if(t.callback===null)pr(cl);else if(t.startTime<=e)pr(cl),t.sortIndex=t.expirationTime,Ni(Pa,t);else break;t=ba(cl)}}function Vi(e){if(Zn=!1,mr(e),!Kn)if(ba(Pa)!==null)Kn=!0,Po||(Po=!0,Bo());else{var t=ba(cl);t!==null&&Gi(Vi,t.startTime-e)}}var Po=!1,Qn=-1,Ym=5,Km=-1;function Zm(){return Fi?!0:!(we.unstable_now()-Km<Ym)}function Hi(){if(Fi=!1,Po){var e=we.unstable_now();Km=e;var t=!0;try{e:{Kn=!1,Zn&&(Zn=!1,jm(Qn),Qn=-1),qi=!0;var a=st;try{t:{for(mr(e),Xt=ba(Pa);Xt!==null&&!(Xt.expirationTime>e&&Zm());){var l=Xt.callback;if(typeof l=="function"){Xt.callback=null,st=Xt.priorityLevel;var o=l(Xt.expirationTime<=e);if(e=we.unstable_now(),typeof o=="function"){Xt.callback=o,mr(e),t=!0;break t}Xt===ba(Pa)&&pr(Pa),mr(e)}else pr(Pa);Xt=ba(Pa)}if(Xt!==null)t=!0;else{var n=ba(cl);n!==null&&Gi(Vi,n.startTime-e),t=!1}}break e}finally{Xt=null,st=a,qi=!1}t=void 0}}finally{t?Bo():Po=!1}}}var Bo;typeof Vm=="function"?Bo=function(){Vm(Hi)}:typeof MessageChannel<"u"?(zi=new MessageChannel,Gm=zi.port2,zi.port1.onmessage=Hi,Bo=function(){Gm.postMessage(null)}):Bo=function(){Xm(Hi,0)};var zi,Gm;function Gi(e,t){Qn=Xm(function(){e(we.unstable_now())},t)}we.unstable_IdlePriority=5;we.unstable_ImmediatePriority=1;we.unstable_LowPriority=4;we.unstable_NormalPriority=3;we.unstable_Profiling=null;we.unstable_UserBlockingPriority=2;we.unstable_cancelCallback=function(e){e.callback=null};we.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Ym=0<e?Math.floor(1e3/e):5};we.unstable_getCurrentPriorityLevel=function(){return st};we.unstable_next=function(e){switch(st){case 1:case 2:case 3:var t=3;break;default:t=st}var a=st;st=t;try{return e()}finally{st=a}};we.unstable_requestPaint=function(){Fi=!0};we.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var a=st;st=e;try{return t()}finally{st=a}};we.unstable_scheduleCallback=function(e,t,a){var l=we.unstable_now();switch(typeof a=="object"&&a!==null?(a=a.delay,a=typeof a=="number"&&0<a?l+a:l):a=l,e){case 1:var o=-1;break;case 2:o=250;break;case 5:o=1073741823;break;case 4:o=1e4;break;default:o=5e3}return o=a+o,e={id:mC++,callback:t,priorityLevel:e,startTime:a,expirationTime:o,sortIndex:-1},a>l?(e.sortIndex=a,Ni(cl,e),ba(Pa)===null&&e===ba(cl)&&(Zn?(jm(Qn),Qn=-1):Zn=!0,Gi(Vi,a-l))):(e.sortIndex=o,Ni(Pa,e),Kn||qi||(Kn=!0,Po||(Po=!0,Bo()))),e};we.unstable_shouldYield=Zm;we.unstable_wrapCallback=function(e){var t=st;return function(){var a=st;st=t;try{return e.apply(this,arguments)}finally{st=a}}}});var Jm=Ca((WR,Wm)=>{"use strict";Wm.exports=Qm()});var ip=Ca(F=>{"use strict";var Yi=Symbol.for("react.transitional.element"),pC=Symbol.for("react.portal"),hC=Symbol.for("react.fragment"),gC=Symbol.for("react.strict_mode"),xC=Symbol.for("react.profiler"),LC=Symbol.for("react.consumer"),SC=Symbol.for("react.context"),vC=Symbol.for("react.forward_ref"),yC=Symbol.for("react.suspense"),CC=Symbol.for("react.memo"),lp=Symbol.for("react.lazy"),bC=Symbol.for("react.activity"),$m=Symbol.iterator;function IC(e){return e===null||typeof e!="object"?null:(e=$m&&e[$m]||e["@@iterator"],typeof e=="function"?e:null)}var op={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},np=Object.assign,up={};function Uo(e,t,a){this.props=e,this.context=t,this.refs=up,this.updater=a||op}Uo.prototype.isReactComponent={};Uo.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Uo.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function rp(){}rp.prototype=Uo.prototype;function Ki(e,t,a){this.props=e,this.context=t,this.refs=up,this.updater=a||op}var Zi=Ki.prototype=new rp;Zi.constructor=Ki;np(Zi,Uo.prototype);Zi.isPureReactComponent=!0;var ep=Array.isArray;function ji(){}var Le={H:null,A:null,T:null,S:null},sp=Object.prototype.hasOwnProperty;function Qi(e,t,a){var l=a.ref;return{$$typeof:Yi,type:e,key:t,ref:l!==void 0?l:null,props:a}}function wC(e,t){return Qi(e.type,t,e.props)}function Wi(e){return typeof e=="object"&&e!==null&&e.$$typeof===Yi}function AC(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(a){return t[a]})}var tp=/\/+/g;function Xi(e,t){return typeof e=="object"&&e!==null&&e.key!=null?AC(""+e.key):t.toString(36)}function RC(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(ji,ji):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function _o(e,t,a,l,o){var n=typeof e;(n==="undefined"||n==="boolean")&&(e=null);var u=!1;if(e===null)u=!0;else switch(n){case"bigint":case"string":case"number":u=!0;break;case"object":switch(e.$$typeof){case Yi:case pC:u=!0;break;case lp:return u=e._init,_o(u(e._payload),t,a,l,o)}}if(u)return o=o(e),u=l===""?"."+Xi(e,0):l,ep(o)?(a="",u!=null&&(a=u.replace(tp,"$&/")+"/"),_o(o,t,a,"",function(i){return i})):o!=null&&(Wi(o)&&(o=wC(o,a+(o.key==null||e&&e.key===o.key?"":(""+o.key).replace(tp,"$&/")+"/")+u)),t.push(o)),1;u=0;var r=l===""?".":l+":";if(ep(e))for(var s=0;s<e.length;s++)l=e[s],n=r+Xi(l,s),u+=_o(l,t,a,n,o);else if(s=IC(e),typeof s=="function")for(e=s.call(e),s=0;!(l=e.next()).done;)l=l.value,n=r+Xi(l,s++),u+=_o(l,t,a,n,o);else if(n==="object"){if(typeof e.then=="function")return _o(RC(e),t,a,l,o);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return u}function hr(e,t,a){if(e==null)return e;var l=[],o=0;return _o(e,l,"","",function(n){return t.call(a,n,o++)}),l}function TC(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(a){(e._status===0||e._status===-1)&&(e._status=1,e._result=a)},function(a){(e._status===0||e._status===-1)&&(e._status=2,e._result=a)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var ap=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},kC={map:hr,forEach:function(e,t,a){hr(e,function(){t.apply(this,arguments)},a)},count:function(e){var t=0;return hr(e,function(){t++}),t},toArray:function(e){return hr(e,function(t){return t})||[]},only:function(e){if(!Wi(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};F.Activity=bC;F.Children=kC;F.Component=Uo;F.Fragment=hC;F.Profiler=xC;F.PureComponent=Ki;F.StrictMode=gC;F.Suspense=yC;F.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Le;F.__COMPILER_RUNTIME={__proto__:null,c:function(e){return Le.H.useMemoCache(e)}};F.cache=function(e){return function(){return e.apply(null,arguments)}};F.cacheSignal=function(){return null};F.cloneElement=function(e,t,a){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var l=np({},e.props),o=e.key;if(t!=null)for(n in t.key!==void 0&&(o=""+t.key),t)!sp.call(t,n)||n==="key"||n==="__self"||n==="__source"||n==="ref"&&t.ref===void 0||(l[n]=t[n]);var n=arguments.length-2;if(n===1)l.children=a;else if(1<n){for(var u=Array(n),r=0;r<n;r++)u[r]=arguments[r+2];l.children=u}return Qi(e.type,o,l)};F.createContext=function(e){return e={$$typeof:SC,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:LC,_context:e},e};F.createElement=function(e,t,a){var l,o={},n=null;if(t!=null)for(l in t.key!==void 0&&(n=""+t.key),t)sp.call(t,l)&&l!=="key"&&l!=="__self"&&l!=="__source"&&(o[l]=t[l]);var u=arguments.length-2;if(u===1)o.children=a;else if(1<u){for(var r=Array(u),s=0;s<u;s++)r[s]=arguments[s+2];o.children=r}if(e&&e.defaultProps)for(l in u=e.defaultProps,u)o[l]===void 0&&(o[l]=u[l]);return Qi(e,n,o)};F.createRef=function(){return{current:null}};F.forwardRef=function(e){return{$$typeof:vC,render:e}};F.isValidElement=Wi;F.lazy=function(e){return{$$typeof:lp,_payload:{_status:-1,_result:e},_init:TC}};F.memo=function(e,t){return{$$typeof:CC,type:e,compare:t===void 0?null:t}};F.startTransition=function(e){var t=Le.T,a={};Le.T=a;try{var l=e(),o=Le.S;o!==null&&o(a,l),typeof l=="object"&&l!==null&&typeof l.then=="function"&&l.then(ji,ap)}catch(n){ap(n)}finally{t!==null&&a.types!==null&&(t.types=a.types),Le.T=t}};F.unstable_useCacheRefresh=function(){return Le.H.useCacheRefresh()};F.use=function(e){return Le.H.use(e)};F.useActionState=function(e,t,a){return Le.H.useActionState(e,t,a)};F.useCallback=function(e,t){return Le.H.useCallback(e,t)};F.useContext=function(e){return Le.H.useContext(e)};F.useDebugValue=function(){};F.useDeferredValue=function(e,t){return Le.H.useDeferredValue(e,t)};F.useEffect=function(e,t){return Le.H.useEffect(e,t)};F.useEffectEvent=function(e){return Le.H.useEffectEvent(e)};F.useId=function(){return Le.H.useId()};F.useImperativeHandle=function(e,t,a){return Le.H.useImperativeHandle(e,t,a)};F.useInsertionEffect=function(e,t){return Le.H.useInsertionEffect(e,t)};F.useLayoutEffect=function(e,t){return Le.H.useLayoutEffect(e,t)};F.useMemo=function(e,t){return Le.H.useMemo(e,t)};F.useOptimistic=function(e,t){return Le.H.useOptimistic(e,t)};F.useReducer=function(e,t,a){return Le.H.useReducer(e,t,a)};F.useRef=function(e){return Le.H.useRef(e)};F.useState=function(e){return Le.H.useState(e)};F.useSyncExternalStore=function(e,t,a){return Le.H.useSyncExternalStore(e,t,a)};F.useTransition=function(){return Le.H.useTransition()};F.version="19.2.8"});var U=Ca(($R,fp)=>{"use strict";fp.exports=ip()});var dp=Ca(mt=>{"use strict";var MC=U();function cp(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function dl(){}var dt={d:{f:dl,r:function(){throw Error(cp(522))},D:dl,C:dl,L:dl,m:dl,X:dl,S:dl,M:dl},p:0,findDOMNode:null},DC=Symbol.for("react.portal");function EC(e,t,a){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:DC,key:l==null?null:""+l,children:e,containerInfo:t,implementation:a}}var Wn=MC.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function gr(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}mt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=dt;mt.createPortal=function(e,t){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(cp(299));return EC(e,t,null,a)};mt.flushSync=function(e){var t=Wn.T,a=dt.p;try{if(Wn.T=null,dt.p=2,e)return e()}finally{Wn.T=t,dt.p=a,dt.d.f()}};mt.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,dt.d.C(e,t))};mt.prefetchDNS=function(e){typeof e=="string"&&dt.d.D(e)};mt.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var a=t.as,l=gr(a,t.crossOrigin),o=typeof t.integrity=="string"?t.integrity:void 0,n=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;a==="style"?dt.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:l,integrity:o,fetchPriority:n}):a==="script"&&dt.d.X(e,{crossOrigin:l,integrity:o,fetchPriority:n,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};mt.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var a=gr(t.as,t.crossOrigin);dt.d.M(e,{crossOrigin:a,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&dt.d.M(e)};mt.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var a=t.as,l=gr(a,t.crossOrigin);dt.d.L(e,a,{crossOrigin:l,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};mt.preloadModule=function(e,t){if(typeof e=="string")if(t){var a=gr(t.as,t.crossOrigin);dt.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:a,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else dt.d.m(e)};mt.requestFormReset=function(e){dt.d.r(e)};mt.unstable_batchedUpdates=function(e,t){return e(t)};mt.useFormState=function(e,t,a){return Wn.H.useFormState(e,t,a)};mt.useFormStatus=function(){return Wn.H.useHostTransitionStatus()};mt.version="19.2.8"});var Jn=Ca((t1,pp)=>{"use strict";function mp(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(mp)}catch(e){console.error(e)}}mp(),pp.exports=dp()});var AL=Ca(qs=>{"use strict";var Ve=Jm(),Nh=U(),OC=Jn();function w(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function qh(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Hu(e){var t=e,a=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(a=t.return),e=t.return;while(e)}return t.tag===3?a:null}function Fh(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Vh(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function hp(e){if(Hu(e)!==e)throw Error(w(188))}function BC(e){var t=e.alternate;if(!t){if(t=Hu(e),t===null)throw Error(w(188));return t!==e?null:e}for(var a=e,l=t;;){var o=a.return;if(o===null)break;var n=o.alternate;if(n===null){if(l=o.return,l!==null){a=l;continue}break}if(o.child===n.child){for(n=o.child;n;){if(n===a)return hp(o),e;if(n===l)return hp(o),t;n=n.sibling}throw Error(w(188))}if(a.return!==l.return)a=o,l=n;else{for(var u=!1,r=o.child;r;){if(r===a){u=!0,a=o,l=n;break}if(r===l){u=!0,l=o,a=n;break}r=r.sibling}if(!u){for(r=n.child;r;){if(r===a){u=!0,a=n,l=o;break}if(r===l){u=!0,l=n,a=o;break}r=r.sibling}if(!u)throw Error(w(189))}}if(a.alternate!==l)throw Error(w(190))}if(a.tag!==3)throw Error(w(188));return a.stateNode.current===a?e:t}function Gh(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=Gh(e),t!==null)return t;e=e.sibling}return null}var ye=Object.assign,PC=Symbol.for("react.element"),xr=Symbol.for("react.transitional.element"),uu=Symbol.for("react.portal"),Vo=Symbol.for("react.fragment"),Xh=Symbol.for("react.strict_mode"),Ef=Symbol.for("react.profiler"),jh=Symbol.for("react.consumer"),Va=Symbol.for("react.context"),Rc=Symbol.for("react.forward_ref"),Of=Symbol.for("react.suspense"),Bf=Symbol.for("react.suspense_list"),Tc=Symbol.for("react.memo"),ml=Symbol.for("react.lazy"),Pf=Symbol.for("react.activity"),_C=Symbol.for("react.memo_cache_sentinel"),gp=Symbol.iterator;function $n(e){return e===null||typeof e!="object"?null:(e=gp&&e[gp]||e["@@iterator"],typeof e=="function"?e:null)}var UC=Symbol.for("react.client.reference");function _f(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===UC?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Vo:return"Fragment";case Ef:return"Profiler";case Xh:return"StrictMode";case Of:return"Suspense";case Bf:return"SuspenseList";case Pf:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case uu:return"Portal";case Va:return e.displayName||"Context";case jh:return(e._context.displayName||"Context")+".Consumer";case Rc:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Tc:return t=e.displayName||null,t!==null?t:_f(e.type)||"Memo";case ml:t=e._payload,e=e._init;try{return _f(e(t))}catch{}}return null}var ru=Array.isArray,P=Nh.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ne=OC.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,eo={pending:!1,data:null,method:null,action:null},Uf=[],Go=-1;function Ta(e){return{current:e}}function Ze(e){0>Go||(e.current=Uf[Go],Uf[Go]=null,Go--)}function pe(e,t){Go++,Uf[Go]=e.current,e.current=t}var Ra=Ta(null),Iu=Ta(null),Il=Ta(null),Qr=Ta(null);function Wr(e,t){switch(pe(Il,t),pe(Iu,e),pe(Ra,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?bh(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=bh(t),e=dL(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Ze(Ra),pe(Ra,e)}function sn(){Ze(Ra),Ze(Iu),Ze(Il)}function Hf(e){e.memoizedState!==null&&pe(Qr,e);var t=Ra.current,a=dL(t,e.type);t!==a&&(pe(Iu,e),pe(Ra,a))}function Jr(e){Iu.current===e&&(Ze(Ra),Ze(Iu)),Qr.current===e&&(Ze(Qr),Pu._currentValue=eo)}var Ji,xp;function Ql(e){if(Ji===void 0)try{throw Error()}catch(a){var t=a.stack.trim().match(/\n( *(at )?)/);Ji=t&&t[1]||"",xp=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ji+e+xp}var $i=!1;function ef(e,t){if(!e||$i)return"";$i=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var m=function(){throw Error()};if(Object.defineProperty(m.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(m,[])}catch(p){var f=p}Reflect.construct(e,[],m)}else{try{m.call()}catch(p){f=p}e.call(m.prototype)}}else{try{throw Error()}catch(p){f=p}(m=e())&&typeof m.catch=="function"&&m.catch(function(){})}}catch(p){if(p&&f&&typeof p.stack=="string")return[p.stack,f.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var o=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");o&&o.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var n=l.DetermineComponentFrameRoot(),u=n[0],r=n[1];if(u&&r){var s=u.split(`
`),i=r.split(`
`);for(o=l=0;l<s.length&&!s[l].includes("DetermineComponentFrameRoot");)l++;for(;o<i.length&&!i[o].includes("DetermineComponentFrameRoot");)o++;if(l===s.length||o===i.length)for(l=s.length-1,o=i.length-1;1<=l&&0<=o&&s[l]!==i[o];)o--;for(;1<=l&&0<=o;l--,o--)if(s[l]!==i[o]){if(l!==1||o!==1)do if(l--,o--,0>o||s[l]!==i[o]){var h=`
`+s[l].replace(" at new "," at ");return e.displayName&&h.includes("<anonymous>")&&(h=h.replace("<anonymous>",e.displayName)),h}while(1<=l&&0<=o);break}}}finally{$i=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?Ql(a):""}function HC(e,t){switch(e.tag){case 26:case 27:case 5:return Ql(e.type);case 16:return Ql("Lazy");case 13:return e.child!==t&&t!==null?Ql("Suspense Fallback"):Ql("Suspense");case 19:return Ql("SuspenseList");case 0:case 15:return ef(e.type,!1);case 11:return ef(e.type.render,!1);case 1:return ef(e.type,!0);case 31:return Ql("Activity");default:return""}}function Lp(e){try{var t="",a=null;do t+=HC(e,a),a=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var zf=Object.prototype.hasOwnProperty,kc=Ve.unstable_scheduleCallback,tf=Ve.unstable_cancelCallback,zC=Ve.unstable_shouldYield,NC=Ve.unstable_requestPaint,Bt=Ve.unstable_now,qC=Ve.unstable_getCurrentPriorityLevel,Yh=Ve.unstable_ImmediatePriority,Kh=Ve.unstable_UserBlockingPriority,$r=Ve.unstable_NormalPriority,FC=Ve.unstable_LowPriority,Zh=Ve.unstable_IdlePriority,VC=Ve.log,GC=Ve.unstable_setDisableYieldValue,zu=null,Pt=null;function Sl(e){if(typeof VC=="function"&&GC(e),Pt&&typeof Pt.setStrictMode=="function")try{Pt.setStrictMode(zu,e)}catch{}}var _t=Math.clz32?Math.clz32:YC,XC=Math.log,jC=Math.LN2;function YC(e){return e>>>=0,e===0?32:31-(XC(e)/jC|0)|0}var Lr=256,Sr=262144,vr=4194304;function Wl(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function ws(e,t,a){var l=e.pendingLanes;if(l===0)return 0;var o=0,n=e.suspendedLanes,u=e.pingedLanes;e=e.warmLanes;var r=l&134217727;return r!==0?(l=r&~n,l!==0?o=Wl(l):(u&=r,u!==0?o=Wl(u):a||(a=r&~e,a!==0&&(o=Wl(a))))):(r=l&~n,r!==0?o=Wl(r):u!==0?o=Wl(u):a||(a=l&~e,a!==0&&(o=Wl(a)))),o===0?0:t!==0&&t!==o&&(t&n)===0&&(n=o&-o,a=t&-t,n>=a||n===32&&(a&4194048)!==0)?t:o}function Nu(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function KC(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Qh(){var e=vr;return vr<<=1,(vr&62914560)===0&&(vr=4194304),e}function af(e){for(var t=[],a=0;31>a;a++)t.push(e);return t}function qu(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function ZC(e,t,a,l,o,n){var u=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var r=e.entanglements,s=e.expirationTimes,i=e.hiddenUpdates;for(a=u&~a;0<a;){var h=31-_t(a),m=1<<h;r[h]=0,s[h]=-1;var f=i[h];if(f!==null)for(i[h]=null,h=0;h<f.length;h++){var p=f[h];p!==null&&(p.lane&=-536870913)}a&=~m}l!==0&&Wh(e,l,0),n!==0&&o===0&&e.tag!==0&&(e.suspendedLanes|=n&~(u&~t))}function Wh(e,t,a){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-_t(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|a&261930}function Jh(e,t){var a=e.entangledLanes|=t;for(e=e.entanglements;a;){var l=31-_t(a),o=1<<l;o&t|e[l]&t&&(e[l]|=t),a&=~o}}function $h(e,t){var a=t&-t;return a=(a&42)!==0?1:Mc(a),(a&(e.suspendedLanes|t))!==0?0:a}function Mc(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Dc(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function eg(){var e=ne.p;return e!==0?e:(e=window.event,e===void 0?32:bL(e.type))}function Sp(e,t){var a=ne.p;try{return ne.p=e,t()}finally{ne.p=a}}var Ul=Math.random().toString(36).slice(2),$e="__reactFiber$"+Ul,It="__reactProps$"+Ul,vn="__reactContainer$"+Ul,Nf="__reactEvents$"+Ul,QC="__reactListeners$"+Ul,WC="__reactHandles$"+Ul,vp="__reactResources$"+Ul,Fu="__reactMarker$"+Ul;function Ec(e){delete e[$e],delete e[It],delete e[Nf],delete e[QC],delete e[WC]}function Xo(e){var t=e[$e];if(t)return t;for(var a=e.parentNode;a;){if(t=a[vn]||a[$e]){if(a=t.alternate,t.child!==null||a!==null&&a.child!==null)for(e=Th(e);e!==null;){if(a=e[$e])return a;e=Th(e)}return t}e=a,a=e.parentNode}return null}function yn(e){if(e=e[$e]||e[vn]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function su(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(w(33))}function tn(e){var t=e[vp];return t||(t=e[vp]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function Ke(e){e[Fu]=!0}var tg=new Set,ag={};function fo(e,t){fn(e,t),fn(e+"Capture",t)}function fn(e,t){for(ag[e]=t,e=0;e<t.length;e++)tg.add(t[e])}var JC=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),yp={},Cp={};function $C(e){return zf.call(Cp,e)?!0:zf.call(yp,e)?!1:JC.test(e)?Cp[e]=!0:(yp[e]=!0,!1)}function Pr(e,t,a){if($C(t))if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+a)}}function yr(e,t,a){if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+a)}}function _a(e,t,a,l){if(l===null)e.removeAttribute(a);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(t,a,""+l)}}function Yt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function lg(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function eb(e,t,a){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var o=l.get,n=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(u){a=""+u,n.call(this,u)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return a},setValue:function(u){a=""+u},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function qf(e){if(!e._valueTracker){var t=lg(e)?"checked":"value";e._valueTracker=eb(e,t,""+e[t])}}function og(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var a=t.getValue(),l="";return e&&(l=lg(e)?e.checked?"true":"false":e.value),e=l,e!==a?(t.setValue(e),!0):!1}function es(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var tb=/[\n"\\]/g;function Qt(e){return e.replace(tb,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Ff(e,t,a,l,o,n,u,r){e.name="",u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"?e.type=u:e.removeAttribute("type"),t!=null?u==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Yt(t)):e.value!==""+Yt(t)&&(e.value=""+Yt(t)):u!=="submit"&&u!=="reset"||e.removeAttribute("value"),t!=null?Vf(e,u,Yt(t)):a!=null?Vf(e,u,Yt(a)):l!=null&&e.removeAttribute("value"),o==null&&n!=null&&(e.defaultChecked=!!n),o!=null&&(e.checked=o&&typeof o!="function"&&typeof o!="symbol"),r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.name=""+Yt(r):e.removeAttribute("name")}function ng(e,t,a,l,o,n,u,r){if(n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(e.type=n),t!=null||a!=null){if(!(n!=="submit"&&n!=="reset"||t!=null)){qf(e);return}a=a!=null?""+Yt(a):"",t=t!=null?""+Yt(t):a,r||t===e.value||(e.value=t),e.defaultValue=t}l=l??o,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=r?e.checked:!!l,e.defaultChecked=!!l,u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(e.name=u),qf(e)}function Vf(e,t,a){t==="number"&&es(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function an(e,t,a,l){if(e=e.options,t){t={};for(var o=0;o<a.length;o++)t["$"+a[o]]=!0;for(a=0;a<e.length;a++)o=t.hasOwnProperty("$"+e[a].value),e[a].selected!==o&&(e[a].selected=o),o&&l&&(e[a].defaultSelected=!0)}else{for(a=""+Yt(a),t=null,o=0;o<e.length;o++){if(e[o].value===a){e[o].selected=!0,l&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function ug(e,t,a){if(t!=null&&(t=""+Yt(t),t!==e.value&&(e.value=t),a==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=a!=null?""+Yt(a):""}function rg(e,t,a,l){if(t==null){if(l!=null){if(a!=null)throw Error(w(92));if(ru(l)){if(1<l.length)throw Error(w(93));l=l[0]}a=l}a==null&&(a=""),t=a}a=Yt(t),e.defaultValue=a,l=e.textContent,l===a&&l!==""&&l!==null&&(e.value=l),qf(e)}function cn(e,t){if(t){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=t;return}}e.textContent=t}var ab=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function bp(e,t,a){var l=t.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,a):typeof a!="number"||a===0||ab.has(t)?t==="float"?e.cssFloat=a:e[t]=(""+a).trim():e[t]=a+"px"}function sg(e,t,a){if(t!=null&&typeof t!="object")throw Error(w(62));if(e=e.style,a!=null){for(var l in a)!a.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var o in t)l=t[o],t.hasOwnProperty(o)&&a[o]!==l&&bp(e,o,l)}else for(var n in t)t.hasOwnProperty(n)&&bp(e,n,t[n])}function Oc(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var lb=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),ob=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function _r(e){return ob.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Ga(){}var Gf=null;function Bc(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var jo=null,ln=null;function Ip(e){var t=yn(e);if(t&&(e=t.stateNode)){var a=e[It]||null;e:switch(e=t.stateNode,t.type){case"input":if(Ff(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),t=a.name,a.type==="radio"&&t!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+Qt(""+t)+'"][type="radio"]'),t=0;t<a.length;t++){var l=a[t];if(l!==e&&l.form===e.form){var o=l[It]||null;if(!o)throw Error(w(90));Ff(l,o.value,o.defaultValue,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name)}}for(t=0;t<a.length;t++)l=a[t],l.form===e.form&&og(l)}break e;case"textarea":ug(e,a.value,a.defaultValue);break e;case"select":t=a.value,t!=null&&an(e,!!a.multiple,t,!1)}}}var lf=!1;function ig(e,t,a){if(lf)return e(t,a);lf=!0;try{var l=e(t);return l}finally{if(lf=!1,(jo!==null||ln!==null)&&(Us(),jo&&(t=jo,e=ln,ln=jo=null,Ip(t),e)))for(t=0;t<e.length;t++)Ip(e[t])}}function wu(e,t){var a=e.stateNode;if(a===null)return null;var l=a[It]||null;if(l===null)return null;a=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(w(231,t,typeof a));return a}var Za=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Xf=!1;if(Za)try{Ho={},Object.defineProperty(Ho,"passive",{get:function(){Xf=!0}}),window.addEventListener("test",Ho,Ho),window.removeEventListener("test",Ho,Ho)}catch{Xf=!1}var Ho,vl=null,Pc=null,Ur=null;function fg(){if(Ur)return Ur;var e,t=Pc,a=t.length,l,o="value"in vl?vl.value:vl.textContent,n=o.length;for(e=0;e<a&&t[e]===o[e];e++);var u=a-e;for(l=1;l<=u&&t[a-l]===o[n-l];l++);return Ur=o.slice(e,1<l?1-l:void 0)}function Hr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Cr(){return!0}function wp(){return!1}function wt(e){function t(a,l,o,n,u){this._reactName=a,this._targetInst=o,this.type=l,this.nativeEvent=n,this.target=u,this.currentTarget=null;for(var r in e)e.hasOwnProperty(r)&&(a=e[r],this[r]=a?a(n):n[r]);return this.isDefaultPrevented=(n.defaultPrevented!=null?n.defaultPrevented:n.returnValue===!1)?Cr:wp,this.isPropagationStopped=wp,this}return ye(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Cr)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Cr)},persist:function(){},isPersistent:Cr}),t}var co={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},As=wt(co),Vu=ye({},co,{view:0,detail:0}),nb=wt(Vu),of,nf,eu,Rs=ye({},Vu,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:_c,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==eu&&(eu&&e.type==="mousemove"?(of=e.screenX-eu.screenX,nf=e.screenY-eu.screenY):nf=of=0,eu=e),of)},movementY:function(e){return"movementY"in e?e.movementY:nf}}),Ap=wt(Rs),ub=ye({},Rs,{dataTransfer:0}),rb=wt(ub),sb=ye({},Vu,{relatedTarget:0}),uf=wt(sb),ib=ye({},co,{animationName:0,elapsedTime:0,pseudoElement:0}),fb=wt(ib),cb=ye({},co,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),db=wt(cb),mb=ye({},co,{data:0}),Rp=wt(mb),pb={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},hb={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},gb={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function xb(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=gb[e])?!!t[e]:!1}function _c(){return xb}var Lb=ye({},Vu,{key:function(e){if(e.key){var t=pb[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Hr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?hb[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:_c,charCode:function(e){return e.type==="keypress"?Hr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Hr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Sb=wt(Lb),vb=ye({},Rs,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Tp=wt(vb),yb=ye({},Vu,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:_c}),Cb=wt(yb),bb=ye({},co,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ib=wt(bb),wb=ye({},Rs,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Ab=wt(wb),Rb=ye({},co,{newState:0,oldState:0}),Tb=wt(Rb),kb=[9,13,27,32],Uc=Za&&"CompositionEvent"in window,cu=null;Za&&"documentMode"in document&&(cu=document.documentMode);var Mb=Za&&"TextEvent"in window&&!cu,cg=Za&&(!Uc||cu&&8<cu&&11>=cu),kp=" ",Mp=!1;function dg(e,t){switch(e){case"keyup":return kb.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function mg(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Yo=!1;function Db(e,t){switch(e){case"compositionend":return mg(t);case"keypress":return t.which!==32?null:(Mp=!0,kp);case"textInput":return e=t.data,e===kp&&Mp?null:e;default:return null}}function Eb(e,t){if(Yo)return e==="compositionend"||!Uc&&dg(e,t)?(e=fg(),Ur=Pc=vl=null,Yo=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return cg&&t.locale!=="ko"?null:t.data;default:return null}}var Ob={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Dp(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Ob[e.type]:t==="textarea"}function pg(e,t,a,l){jo?ln?ln.push(l):ln=[l]:jo=l,t=Ls(t,"onChange"),0<t.length&&(a=new As("onChange","change",null,a,l),e.push({event:a,listeners:t}))}var du=null,Au=null;function Bb(e){iL(e,0)}function Ts(e){var t=su(e);if(og(t))return e}function Ep(e,t){if(e==="change")return t}var hg=!1;Za&&(Za?(Ir="oninput"in document,Ir||(rf=document.createElement("div"),rf.setAttribute("oninput","return;"),Ir=typeof rf.oninput=="function"),br=Ir):br=!1,hg=br&&(!document.documentMode||9<document.documentMode));var br,Ir,rf;function Op(){du&&(du.detachEvent("onpropertychange",gg),Au=du=null)}function gg(e){if(e.propertyName==="value"&&Ts(Au)){var t=[];pg(t,Au,e,Bc(e)),ig(Bb,t)}}function Pb(e,t,a){e==="focusin"?(Op(),du=t,Au=a,du.attachEvent("onpropertychange",gg)):e==="focusout"&&Op()}function _b(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ts(Au)}function Ub(e,t){if(e==="click")return Ts(t)}function Hb(e,t){if(e==="input"||e==="change")return Ts(t)}function zb(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ht=typeof Object.is=="function"?Object.is:zb;function Ru(e,t){if(Ht(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var a=Object.keys(e),l=Object.keys(t);if(a.length!==l.length)return!1;for(l=0;l<a.length;l++){var o=a[l];if(!zf.call(t,o)||!Ht(e[o],t[o]))return!1}return!0}function Bp(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Pp(e,t){var a=Bp(e);e=0;for(var l;a;){if(a.nodeType===3){if(l=e+a.textContent.length,e<=t&&l>=t)return{node:a,offset:t-e};e=l}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Bp(a)}}function xg(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?xg(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Lg(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=es(e.document);t instanceof e.HTMLIFrameElement;){try{var a=typeof t.contentWindow.location.href=="string"}catch{a=!1}if(a)e=t.contentWindow;else break;t=es(e.document)}return t}function Hc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Nb=Za&&"documentMode"in document&&11>=document.documentMode,Ko=null,jf=null,mu=null,Yf=!1;function _p(e,t,a){var l=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Yf||Ko==null||Ko!==es(l)||(l=Ko,"selectionStart"in l&&Hc(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),mu&&Ru(mu,l)||(mu=l,l=Ls(jf,"onSelect"),0<l.length&&(t=new As("onSelect","select",null,t,a),e.push({event:t,listeners:l}),t.target=Ko)))}function Zl(e,t){var a={};return a[e.toLowerCase()]=t.toLowerCase(),a["Webkit"+e]="webkit"+t,a["Moz"+e]="moz"+t,a}var Zo={animationend:Zl("Animation","AnimationEnd"),animationiteration:Zl("Animation","AnimationIteration"),animationstart:Zl("Animation","AnimationStart"),transitionrun:Zl("Transition","TransitionRun"),transitionstart:Zl("Transition","TransitionStart"),transitioncancel:Zl("Transition","TransitionCancel"),transitionend:Zl("Transition","TransitionEnd")},sf={},Sg={};Za&&(Sg=document.createElement("div").style,"AnimationEvent"in window||(delete Zo.animationend.animation,delete Zo.animationiteration.animation,delete Zo.animationstart.animation),"TransitionEvent"in window||delete Zo.transitionend.transition);function mo(e){if(sf[e])return sf[e];if(!Zo[e])return e;var t=Zo[e],a;for(a in t)if(t.hasOwnProperty(a)&&a in Sg)return sf[e]=t[a];return e}var vg=mo("animationend"),yg=mo("animationiteration"),Cg=mo("animationstart"),qb=mo("transitionrun"),Fb=mo("transitionstart"),Vb=mo("transitioncancel"),bg=mo("transitionend"),Ig=new Map,Kf="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Kf.push("scrollEnd");function sa(e,t){Ig.set(e,t),fo(t,[e])}var ts=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},jt=[],Qo=0,zc=0;function ks(){for(var e=Qo,t=zc=Qo=0;t<e;){var a=jt[t];jt[t++]=null;var l=jt[t];jt[t++]=null;var o=jt[t];jt[t++]=null;var n=jt[t];if(jt[t++]=null,l!==null&&o!==null){var u=l.pending;u===null?o.next=o:(o.next=u.next,u.next=o),l.pending=o}n!==0&&wg(a,o,n)}}function Ms(e,t,a,l){jt[Qo++]=e,jt[Qo++]=t,jt[Qo++]=a,jt[Qo++]=l,zc|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function Nc(e,t,a,l){return Ms(e,t,a,l),as(e)}function po(e,t){return Ms(e,null,null,t),as(e)}function wg(e,t,a){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a);for(var o=!1,n=e.return;n!==null;)n.childLanes|=a,l=n.alternate,l!==null&&(l.childLanes|=a),n.tag===22&&(e=n.stateNode,e===null||e._visibility&1||(o=!0)),e=n,n=n.return;return e.tag===3?(n=e.stateNode,o&&t!==null&&(o=31-_t(a),e=n.hiddenUpdates,l=e[o],l===null?e[o]=[t]:l.push(t),t.lane=a|536870912),n):null}function as(e){if(50<Cu)throw Cu=0,hc=null,Error(w(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Wo={};function Gb(e,t,a,l){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Et(e,t,a,l){return new Gb(e,t,a,l)}function qc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function ja(e,t){var a=e.alternate;return a===null?(a=Et(e.tag,t,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=t,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,t=e.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Ag(e,t){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,t=a.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function zr(e,t,a,l,o,n){var u=0;if(l=e,typeof e=="function")qc(e)&&(u=1);else if(typeof e=="string")u=YI(e,a,Ra.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case Pf:return e=Et(31,a,t,o),e.elementType=Pf,e.lanes=n,e;case Vo:return to(a.children,o,n,t);case Xh:u=8,o|=24;break;case Ef:return e=Et(12,a,t,o|2),e.elementType=Ef,e.lanes=n,e;case Of:return e=Et(13,a,t,o),e.elementType=Of,e.lanes=n,e;case Bf:return e=Et(19,a,t,o),e.elementType=Bf,e.lanes=n,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Va:u=10;break e;case jh:u=9;break e;case Rc:u=11;break e;case Tc:u=14;break e;case ml:u=16,l=null;break e}u=29,a=Error(w(130,e===null?"null":typeof e,"")),l=null}return t=Et(u,a,t,o),t.elementType=e,t.type=l,t.lanes=n,t}function to(e,t,a,l){return e=Et(7,e,l,t),e.lanes=a,e}function ff(e,t,a){return e=Et(6,e,null,t),e.lanes=a,e}function Rg(e){var t=Et(18,null,null,0);return t.stateNode=e,t}function cf(e,t,a){return t=Et(4,e.children!==null?e.children:[],e.key,t),t.lanes=a,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Up=new WeakMap;function Wt(e,t){if(typeof e=="object"&&e!==null){var a=Up.get(e);return a!==void 0?a:(t={value:e,source:t,stack:Lp(t)},Up.set(e,t),t)}return{value:e,source:t,stack:Lp(t)}}var Jo=[],$o=0,ls=null,Tu=0,Kt=[],Zt=0,Ol=null,Ia=1,wa="";function qa(e,t){Jo[$o++]=Tu,Jo[$o++]=ls,ls=e,Tu=t}function Tg(e,t,a){Kt[Zt++]=Ia,Kt[Zt++]=wa,Kt[Zt++]=Ol,Ol=e;var l=Ia;e=wa;var o=32-_t(l)-1;l&=~(1<<o),a+=1;var n=32-_t(t)+o;if(30<n){var u=o-o%5;n=(l&(1<<u)-1).toString(32),l>>=u,o-=u,Ia=1<<32-_t(t)+o|a<<o|l,wa=n+e}else Ia=1<<n|a<<o|l,wa=e}function Fc(e){e.return!==null&&(qa(e,1),Tg(e,1,0))}function Vc(e){for(;e===ls;)ls=Jo[--$o],Jo[$o]=null,Tu=Jo[--$o],Jo[$o]=null;for(;e===Ol;)Ol=Kt[--Zt],Kt[Zt]=null,wa=Kt[--Zt],Kt[Zt]=null,Ia=Kt[--Zt],Kt[Zt]=null}function kg(e,t){Kt[Zt++]=Ia,Kt[Zt++]=wa,Kt[Zt++]=Ol,Ia=t.id,wa=t.overflow,Ol=e}var et=null,ve=null,te=!1,wl=null,Jt=!1,Zf=Error(w(519));function Bl(e){var t=Error(w(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ku(Wt(t,e)),Zf}function Hp(e){var t=e.stateNode,a=e.type,l=e.memoizedProps;switch(t[$e]=e,t[It]=l,a){case"dialog":J("cancel",t),J("close",t);break;case"iframe":case"object":case"embed":J("load",t);break;case"video":case"audio":for(a=0;a<Ou.length;a++)J(Ou[a],t);break;case"source":J("error",t);break;case"img":case"image":case"link":J("error",t),J("load",t);break;case"details":J("toggle",t);break;case"input":J("invalid",t),ng(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":J("invalid",t);break;case"textarea":J("invalid",t),rg(t,l.value,l.defaultValue,l.children)}a=l.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||t.textContent===""+a||l.suppressHydrationWarning===!0||cL(t.textContent,a)?(l.popover!=null&&(J("beforetoggle",t),J("toggle",t)),l.onScroll!=null&&J("scroll",t),l.onScrollEnd!=null&&J("scrollend",t),l.onClick!=null&&(t.onclick=Ga),t=!0):t=!1,t||Bl(e,!0)}function zp(e){for(et=e.return;et;)switch(et.tag){case 5:case 31:case 13:Jt=!1;return;case 27:case 3:Jt=!0;return;default:et=et.return}}function zo(e){if(e!==et)return!1;if(!te)return zp(e),te=!0,!1;var t=e.tag,a;if((a=t!==3&&t!==27)&&((a=t===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||vc(e.type,e.memoizedProps)),a=!a),a&&ve&&Bl(e),zp(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(w(317));ve=Rh(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(w(317));ve=Rh(e)}else t===27?(t=ve,Hl(e.type)?(e=Ic,Ic=null,ve=e):ve=t):ve=et?ea(e.stateNode.nextSibling):null;return!0}function no(){ve=et=null,te=!1}function df(){var e=wl;return e!==null&&(Ct===null?Ct=e:Ct.push.apply(Ct,e),wl=null),e}function ku(e){wl===null?wl=[e]:wl.push(e)}var Qf=Ta(null),ho=null,Xa=null;function hl(e,t,a){pe(Qf,t._currentValue),t._currentValue=a}function Ya(e){e._currentValue=Qf.current,Ze(Qf)}function Wf(e,t,a){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===a)break;e=e.return}}function Jf(e,t,a,l){var o=e.child;for(o!==null&&(o.return=e);o!==null;){var n=o.dependencies;if(n!==null){var u=o.child;n=n.firstContext;e:for(;n!==null;){var r=n;n=o;for(var s=0;s<t.length;s++)if(r.context===t[s]){n.lanes|=a,r=n.alternate,r!==null&&(r.lanes|=a),Wf(n.return,a,e),l||(u=null);break e}n=r.next}}else if(o.tag===18){if(u=o.return,u===null)throw Error(w(341));u.lanes|=a,n=u.alternate,n!==null&&(n.lanes|=a),Wf(u,a,e),u=null}else u=o.child;if(u!==null)u.return=o;else for(u=o;u!==null;){if(u===e){u=null;break}if(o=u.sibling,o!==null){o.return=u.return,u=o;break}u=u.return}o=u}}function Cn(e,t,a,l){e=null;for(var o=t,n=!1;o!==null;){if(!n){if((o.flags&524288)!==0)n=!0;else if((o.flags&262144)!==0)break}if(o.tag===10){var u=o.alternate;if(u===null)throw Error(w(387));if(u=u.memoizedProps,u!==null){var r=o.type;Ht(o.pendingProps.value,u.value)||(e!==null?e.push(r):e=[r])}}else if(o===Qr.current){if(u=o.alternate,u===null)throw Error(w(387));u.memoizedState.memoizedState!==o.memoizedState.memoizedState&&(e!==null?e.push(Pu):e=[Pu])}o=o.return}e!==null&&Jf(t,e,a,l),t.flags|=262144}function os(e){for(e=e.firstContext;e!==null;){if(!Ht(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function uo(e){ho=e,Xa=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function tt(e){return Mg(ho,e)}function wr(e,t){return ho===null&&uo(e),Mg(e,t)}function Mg(e,t){var a=t._currentValue;if(t={context:t,memoizedValue:a,next:null},Xa===null){if(e===null)throw Error(w(308));Xa=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Xa=Xa.next=t;return a}var Xb=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(a,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(a){return a()})}},jb=Ve.unstable_scheduleCallback,Yb=Ve.unstable_NormalPriority,_e={$$typeof:Va,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Gc(){return{controller:new Xb,data:new Map,refCount:0}}function Gu(e){e.refCount--,e.refCount===0&&jb(Yb,function(){e.controller.abort()})}var pu=null,$f=0,dn=0,on=null;function Kb(e,t){if(pu===null){var a=pu=[];$f=0,dn=hd(),on={status:"pending",value:void 0,then:function(l){a.push(l)}}}return $f++,t.then(Np,Np),t}function Np(){if(--$f===0&&pu!==null){on!==null&&(on.status="fulfilled");var e=pu;pu=null,dn=0,on=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Zb(e,t){var a=[],l={status:"pending",value:null,reason:null,then:function(o){a.push(o)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var o=0;o<a.length;o++)(0,a[o])(t)},function(o){for(l.status="rejected",l.reason=o,o=0;o<a.length;o++)(0,a[o])(void 0)}),l}var qp=P.S;P.S=function(e,t){Gx=Bt(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Kb(e,t),qp!==null&&qp(e,t)};var ao=Ta(null);function Xc(){var e=ao.current;return e!==null?e:me.pooledCache}function Nr(e,t){t===null?pe(ao,ao.current):pe(ao,t.pool)}function Dg(){var e=Xc();return e===null?null:{parent:_e._currentValue,pool:e}}var bn=Error(w(460)),jc=Error(w(474)),Ds=Error(w(542)),ns={then:function(){}};function Fp(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Eg(e,t,a){switch(a=e[a],a===void 0?e.push(t):a!==t&&(t.then(Ga,Ga),t=a),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Gp(e),e;default:if(typeof t.status=="string")t.then(Ga,Ga);else{if(e=me,e!==null&&100<e.shellSuspendCounter)throw Error(w(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var o=t;o.status="fulfilled",o.value=l}},function(l){if(t.status==="pending"){var o=t;o.status="rejected",o.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Gp(e),e}throw lo=t,bn}}function Jl(e){try{var t=e._init;return t(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(lo=a,bn):a}}var lo=null;function Vp(){if(lo===null)throw Error(w(459));var e=lo;return lo=null,e}function Gp(e){if(e===bn||e===Ds)throw Error(w(483))}var nn=null,Mu=0;function Ar(e){var t=Mu;return Mu+=1,nn===null&&(nn=[]),Eg(nn,e,t)}function tu(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Rr(e,t){throw t.$$typeof===PC?Error(w(525)):(e=Object.prototype.toString.call(t),Error(w(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function Og(e){function t(g,d){if(e){var c=g.deletions;c===null?(g.deletions=[d],g.flags|=16):c.push(d)}}function a(g,d){if(!e)return null;for(;d!==null;)t(g,d),d=d.sibling;return null}function l(g){for(var d=new Map;g!==null;)g.key!==null?d.set(g.key,g):d.set(g.index,g),g=g.sibling;return d}function o(g,d){return g=ja(g,d),g.index=0,g.sibling=null,g}function n(g,d,c){return g.index=c,e?(c=g.alternate,c!==null?(c=c.index,c<d?(g.flags|=67108866,d):c):(g.flags|=67108866,d)):(g.flags|=1048576,d)}function u(g){return e&&g.alternate===null&&(g.flags|=67108866),g}function r(g,d,c,x){return d===null||d.tag!==6?(d=ff(c,g.mode,x),d.return=g,d):(d=o(d,c),d.return=g,d)}function s(g,d,c,x){var y=c.type;return y===Vo?h(g,d,c.props.children,x,c.key):d!==null&&(d.elementType===y||typeof y=="object"&&y!==null&&y.$$typeof===ml&&Jl(y)===d.type)?(d=o(d,c.props),tu(d,c),d.return=g,d):(d=zr(c.type,c.key,c.props,null,g.mode,x),tu(d,c),d.return=g,d)}function i(g,d,c,x){return d===null||d.tag!==4||d.stateNode.containerInfo!==c.containerInfo||d.stateNode.implementation!==c.implementation?(d=cf(c,g.mode,x),d.return=g,d):(d=o(d,c.children||[]),d.return=g,d)}function h(g,d,c,x,y){return d===null||d.tag!==7?(d=to(c,g.mode,x,y),d.return=g,d):(d=o(d,c),d.return=g,d)}function m(g,d,c){if(typeof d=="string"&&d!==""||typeof d=="number"||typeof d=="bigint")return d=ff(""+d,g.mode,c),d.return=g,d;if(typeof d=="object"&&d!==null){switch(d.$$typeof){case xr:return c=zr(d.type,d.key,d.props,null,g.mode,c),tu(c,d),c.return=g,c;case uu:return d=cf(d,g.mode,c),d.return=g,d;case ml:return d=Jl(d),m(g,d,c)}if(ru(d)||$n(d))return d=to(d,g.mode,c,null),d.return=g,d;if(typeof d.then=="function")return m(g,Ar(d),c);if(d.$$typeof===Va)return m(g,wr(g,d),c);Rr(g,d)}return null}function f(g,d,c,x){var y=d!==null?d.key:null;if(typeof c=="string"&&c!==""||typeof c=="number"||typeof c=="bigint")return y!==null?null:r(g,d,""+c,x);if(typeof c=="object"&&c!==null){switch(c.$$typeof){case xr:return c.key===y?s(g,d,c,x):null;case uu:return c.key===y?i(g,d,c,x):null;case ml:return c=Jl(c),f(g,d,c,x)}if(ru(c)||$n(c))return y!==null?null:h(g,d,c,x,null);if(typeof c.then=="function")return f(g,d,Ar(c),x);if(c.$$typeof===Va)return f(g,d,wr(g,c),x);Rr(g,c)}return null}function p(g,d,c,x,y){if(typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint")return g=g.get(c)||null,r(d,g,""+x,y);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case xr:return g=g.get(x.key===null?c:x.key)||null,s(d,g,x,y);case uu:return g=g.get(x.key===null?c:x.key)||null,i(d,g,x,y);case ml:return x=Jl(x),p(g,d,c,x,y)}if(ru(x)||$n(x))return g=g.get(c)||null,h(d,g,x,y,null);if(typeof x.then=="function")return p(g,d,c,Ar(x),y);if(x.$$typeof===Va)return p(g,d,c,wr(d,x),y);Rr(d,x)}return null}function L(g,d,c,x){for(var y=null,I=null,b=d,C=d=0,A=null;b!==null&&C<c.length;C++){b.index>C?(A=b,b=null):A=b.sibling;var T=f(g,b,c[C],x);if(T===null){b===null&&(b=A);break}e&&b&&T.alternate===null&&t(g,b),d=n(T,d,C),I===null?y=T:I.sibling=T,I=T,b=A}if(C===c.length)return a(g,b),te&&qa(g,C),y;if(b===null){for(;C<c.length;C++)b=m(g,c[C],x),b!==null&&(d=n(b,d,C),I===null?y=b:I.sibling=b,I=b);return te&&qa(g,C),y}for(b=l(b);C<c.length;C++)A=p(b,g,C,c[C],x),A!==null&&(e&&A.alternate!==null&&b.delete(A.key===null?C:A.key),d=n(A,d,C),I===null?y=A:I.sibling=A,I=A);return e&&b.forEach(function(B){return t(g,B)}),te&&qa(g,C),y}function S(g,d,c,x){if(c==null)throw Error(w(151));for(var y=null,I=null,b=d,C=d=0,A=null,T=c.next();b!==null&&!T.done;C++,T=c.next()){b.index>C?(A=b,b=null):A=b.sibling;var B=f(g,b,T.value,x);if(B===null){b===null&&(b=A);break}e&&b&&B.alternate===null&&t(g,b),d=n(B,d,C),I===null?y=B:I.sibling=B,I=B,b=A}if(T.done)return a(g,b),te&&qa(g,C),y;if(b===null){for(;!T.done;C++,T=c.next())T=m(g,T.value,x),T!==null&&(d=n(T,d,C),I===null?y=T:I.sibling=T,I=T);return te&&qa(g,C),y}for(b=l(b);!T.done;C++,T=c.next())T=p(b,g,C,T.value,x),T!==null&&(e&&T.alternate!==null&&b.delete(T.key===null?C:T.key),d=n(T,d,C),I===null?y=T:I.sibling=T,I=T);return e&&b.forEach(function(O){return t(g,O)}),te&&qa(g,C),y}function v(g,d,c,x){if(typeof c=="object"&&c!==null&&c.type===Vo&&c.key===null&&(c=c.props.children),typeof c=="object"&&c!==null){switch(c.$$typeof){case xr:e:{for(var y=c.key;d!==null;){if(d.key===y){if(y=c.type,y===Vo){if(d.tag===7){a(g,d.sibling),x=o(d,c.props.children),x.return=g,g=x;break e}}else if(d.elementType===y||typeof y=="object"&&y!==null&&y.$$typeof===ml&&Jl(y)===d.type){a(g,d.sibling),x=o(d,c.props),tu(x,c),x.return=g,g=x;break e}a(g,d);break}else t(g,d);d=d.sibling}c.type===Vo?(x=to(c.props.children,g.mode,x,c.key),x.return=g,g=x):(x=zr(c.type,c.key,c.props,null,g.mode,x),tu(x,c),x.return=g,g=x)}return u(g);case uu:e:{for(y=c.key;d!==null;){if(d.key===y)if(d.tag===4&&d.stateNode.containerInfo===c.containerInfo&&d.stateNode.implementation===c.implementation){a(g,d.sibling),x=o(d,c.children||[]),x.return=g,g=x;break e}else{a(g,d);break}else t(g,d);d=d.sibling}x=cf(c,g.mode,x),x.return=g,g=x}return u(g);case ml:return c=Jl(c),v(g,d,c,x)}if(ru(c))return L(g,d,c,x);if($n(c)){if(y=$n(c),typeof y!="function")throw Error(w(150));return c=y.call(c),S(g,d,c,x)}if(typeof c.then=="function")return v(g,d,Ar(c),x);if(c.$$typeof===Va)return v(g,d,wr(g,c),x);Rr(g,c)}return typeof c=="string"&&c!==""||typeof c=="number"||typeof c=="bigint"?(c=""+c,d!==null&&d.tag===6?(a(g,d.sibling),x=o(d,c),x.return=g,g=x):(a(g,d),x=ff(c,g.mode,x),x.return=g,g=x),u(g)):a(g,d)}return function(g,d,c,x){try{Mu=0;var y=v(g,d,c,x);return nn=null,y}catch(b){if(b===bn||b===Ds)throw b;var I=Et(29,b,null,g.mode);return I.lanes=x,I.return=g,I}}}var ro=Og(!0),Bg=Og(!1),pl=!1;function Yc(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function ec(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Al(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Rl(e,t,a){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(oe&2)!==0){var o=l.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),l.pending=t,t=as(e),wg(e,null,a),t}return Ms(e,l,t,a),as(e)}function hu(e,t,a){if(t=t.updateQueue,t!==null&&(t=t.shared,(a&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,Jh(e,a)}}function mf(e,t){var a=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,a===l)){var o=null,n=null;if(a=a.firstBaseUpdate,a!==null){do{var u={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};n===null?o=n=u:n=n.next=u,a=a.next}while(a!==null);n===null?o=n=t:n=n.next=t}else o=n=t;a={baseState:l.baseState,firstBaseUpdate:o,lastBaseUpdate:n,shared:l.shared,callbacks:l.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=t:e.next=t,a.lastBaseUpdate=t}var tc=!1;function gu(){if(tc){var e=on;if(e!==null)throw e}}function xu(e,t,a,l){tc=!1;var o=e.updateQueue;pl=!1;var n=o.firstBaseUpdate,u=o.lastBaseUpdate,r=o.shared.pending;if(r!==null){o.shared.pending=null;var s=r,i=s.next;s.next=null,u===null?n=i:u.next=i,u=s;var h=e.alternate;h!==null&&(h=h.updateQueue,r=h.lastBaseUpdate,r!==u&&(r===null?h.firstBaseUpdate=i:r.next=i,h.lastBaseUpdate=s))}if(n!==null){var m=o.baseState;u=0,h=i=s=null,r=n;do{var f=r.lane&-536870913,p=f!==r.lane;if(p?(ee&f)===f:(l&f)===f){f!==0&&f===dn&&(tc=!0),h!==null&&(h=h.next={lane:0,tag:r.tag,payload:r.payload,callback:null,next:null});e:{var L=e,S=r;f=t;var v=a;switch(S.tag){case 1:if(L=S.payload,typeof L=="function"){m=L.call(v,m,f);break e}m=L;break e;case 3:L.flags=L.flags&-65537|128;case 0:if(L=S.payload,f=typeof L=="function"?L.call(v,m,f):L,f==null)break e;m=ye({},m,f);break e;case 2:pl=!0}}f=r.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=o.callbacks,p===null?o.callbacks=[f]:p.push(f))}else p={lane:f,tag:r.tag,payload:r.payload,callback:r.callback,next:null},h===null?(i=h=p,s=m):h=h.next=p,u|=f;if(r=r.next,r===null){if(r=o.shared.pending,r===null)break;p=r,r=p.next,p.next=null,o.lastBaseUpdate=p,o.shared.pending=null}}while(!0);h===null&&(s=m),o.baseState=s,o.firstBaseUpdate=i,o.lastBaseUpdate=h,n===null&&(o.shared.lanes=0),_l|=u,e.lanes=u,e.memoizedState=m}}function Pg(e,t){if(typeof e!="function")throw Error(w(191,e));e.call(t)}function _g(e,t){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)Pg(a[e],t)}var mn=Ta(null),us=Ta(0);function Xp(e,t){e=$a,pe(us,e),pe(mn,t),$a=e|t.baseLanes}function ac(){pe(us,$a),pe(mn,mn.current)}function Kc(){$a=us.current,Ze(mn),Ze(us)}var zt=Ta(null),$t=null;function gl(e){var t=e.alternate;pe(Me,Me.current&1),pe(zt,e),$t===null&&(t===null||mn.current!==null||t.memoizedState!==null)&&($t=e)}function lc(e){pe(Me,Me.current),pe(zt,e),$t===null&&($t=e)}function Ug(e){e.tag===22?(pe(Me,Me.current),pe(zt,e),$t===null&&($t=e)):xl(e)}function xl(){pe(Me,Me.current),pe(zt,zt.current)}function Dt(e){Ze(zt),$t===e&&($t=null),Ze(Me)}var Me=Ta(0);function rs(e){for(var t=e;t!==null;){if(t.tag===13){var a=t.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Cc(a)||bc(a)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Qa=0,K=null,ce=null,Be=null,ss=!1,un=!1,so=!1,is=0,Du=0,rn=null,Qb=0;function Te(){throw Error(w(321))}function Zc(e,t){if(t===null)return!1;for(var a=0;a<t.length&&a<e.length;a++)if(!Ht(e[a],t[a]))return!1;return!0}function Qc(e,t,a,l,o,n){return Qa=n,K=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,P.H=e===null||e.memoizedState===null?px:rd,so=!1,n=a(l,o),so=!1,un&&(n=zg(t,a,l,o)),Hg(e),n}function Hg(e){P.H=Eu;var t=ce!==null&&ce.next!==null;if(Qa=0,Be=ce=K=null,ss=!1,Du=0,rn=null,t)throw Error(w(300));e===null||Ue||(e=e.dependencies,e!==null&&os(e)&&(Ue=!0))}function zg(e,t,a,l){K=e;var o=0;do{if(un&&(rn=null),Du=0,un=!1,25<=o)throw Error(w(301));if(o+=1,Be=ce=null,e.updateQueue!=null){var n=e.updateQueue;n.lastEffect=null,n.events=null,n.stores=null,n.memoCache!=null&&(n.memoCache.index=0)}P.H=hx,n=t(a,l)}while(un);return n}function Wb(){var e=P.H,t=e.useState()[0];return t=typeof t.then=="function"?Xu(t):t,e=e.useState()[0],(ce!==null?ce.memoizedState:null)!==e&&(K.flags|=1024),t}function Wc(){var e=is!==0;return is=0,e}function Jc(e,t,a){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a}function $c(e){if(ss){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}ss=!1}Qa=0,Be=ce=K=null,un=!1,Du=is=0,rn=null}function pt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Be===null?K.memoizedState=Be=e:Be=Be.next=e,Be}function De(){if(ce===null){var e=K.alternate;e=e!==null?e.memoizedState:null}else e=ce.next;var t=Be===null?K.memoizedState:Be.next;if(t!==null)Be=t,ce=e;else{if(e===null)throw K.alternate===null?Error(w(467)):Error(w(310));ce=e,e={memoizedState:ce.memoizedState,baseState:ce.baseState,baseQueue:ce.baseQueue,queue:ce.queue,next:null},Be===null?K.memoizedState=Be=e:Be=Be.next=e}return Be}function Es(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Xu(e){var t=Du;return Du+=1,rn===null&&(rn=[]),e=Eg(rn,e,t),t=K,(Be===null?t.memoizedState:Be.next)===null&&(t=t.alternate,P.H=t===null||t.memoizedState===null?px:rd),e}function Os(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Xu(e);if(e.$$typeof===Va)return tt(e)}throw Error(w(438,String(e)))}function ed(e){var t=null,a=K.updateQueue;if(a!==null&&(t=a.memoCache),t==null){var l=K.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(o){return o.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),a===null&&(a=Es(),K.updateQueue=a),a.memoCache=t,a=t.data[t.index],a===void 0)for(a=t.data[t.index]=Array(e),l=0;l<e;l++)a[l]=_C;return t.index++,a}function Wa(e,t){return typeof t=="function"?t(e):t}function qr(e){var t=De();return td(t,ce,e)}function td(e,t,a){var l=e.queue;if(l===null)throw Error(w(311));l.lastRenderedReducer=a;var o=e.baseQueue,n=l.pending;if(n!==null){if(o!==null){var u=o.next;o.next=n.next,n.next=u}t.baseQueue=o=n,l.pending=null}if(n=e.baseState,o===null)e.memoizedState=n;else{t=o.next;var r=u=null,s=null,i=t,h=!1;do{var m=i.lane&-536870913;if(m!==i.lane?(ee&m)===m:(Qa&m)===m){var f=i.revertLane;if(f===0)s!==null&&(s=s.next={lane:0,revertLane:0,gesture:null,action:i.action,hasEagerState:i.hasEagerState,eagerState:i.eagerState,next:null}),m===dn&&(h=!0);else if((Qa&f)===f){i=i.next,f===dn&&(h=!0);continue}else m={lane:0,revertLane:i.revertLane,gesture:null,action:i.action,hasEagerState:i.hasEagerState,eagerState:i.eagerState,next:null},s===null?(r=s=m,u=n):s=s.next=m,K.lanes|=f,_l|=f;m=i.action,so&&a(n,m),n=i.hasEagerState?i.eagerState:a(n,m)}else f={lane:m,revertLane:i.revertLane,gesture:i.gesture,action:i.action,hasEagerState:i.hasEagerState,eagerState:i.eagerState,next:null},s===null?(r=s=f,u=n):s=s.next=f,K.lanes|=m,_l|=m;i=i.next}while(i!==null&&i!==t);if(s===null?u=n:s.next=r,!Ht(n,e.memoizedState)&&(Ue=!0,h&&(a=on,a!==null)))throw a;e.memoizedState=n,e.baseState=u,e.baseQueue=s,l.lastRenderedState=n}return o===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function pf(e){var t=De(),a=t.queue;if(a===null)throw Error(w(311));a.lastRenderedReducer=e;var l=a.dispatch,o=a.pending,n=t.memoizedState;if(o!==null){a.pending=null;var u=o=o.next;do n=e(n,u.action),u=u.next;while(u!==o);Ht(n,t.memoizedState)||(Ue=!0),t.memoizedState=n,t.baseQueue===null&&(t.baseState=n),a.lastRenderedState=n}return[n,l]}function Ng(e,t,a){var l=K,o=De(),n=te;if(n){if(a===void 0)throw Error(w(407));a=a()}else a=t();var u=!Ht((ce||o).memoizedState,a);if(u&&(o.memoizedState=a,Ue=!0),o=o.queue,ad(Vg.bind(null,l,o,e),[e]),o.getSnapshot!==t||u||Be!==null&&Be.memoizedState.tag&1){if(l.flags|=2048,pn(9,{destroy:void 0},Fg.bind(null,l,o,a,t),null),me===null)throw Error(w(349));n||(Qa&127)!==0||qg(l,t,a)}return a}function qg(e,t,a){e.flags|=16384,e={getSnapshot:t,value:a},t=K.updateQueue,t===null?(t=Es(),K.updateQueue=t,t.stores=[e]):(a=t.stores,a===null?t.stores=[e]:a.push(e))}function Fg(e,t,a,l){t.value=a,t.getSnapshot=l,Gg(t)&&Xg(e)}function Vg(e,t,a){return a(function(){Gg(t)&&Xg(e)})}function Gg(e){var t=e.getSnapshot;e=e.value;try{var a=t();return!Ht(e,a)}catch{return!0}}function Xg(e){var t=po(e,2);t!==null&&bt(t,e,2)}function oc(e){var t=pt();if(typeof e=="function"){var a=e;if(e=a(),so){Sl(!0);try{a()}finally{Sl(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Wa,lastRenderedState:e},t}function jg(e,t,a,l){return e.baseState=a,td(e,ce,typeof l=="function"?l:Wa)}function Jb(e,t,a,l,o){if(Ps(e))throw Error(w(485));if(e=t.action,e!==null){var n={payload:o,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(u){n.listeners.push(u)}};P.T!==null?a(!0):n.isTransition=!1,l(n),a=t.pending,a===null?(n.next=t.pending=n,Yg(t,n)):(n.next=a.next,t.pending=a.next=n)}}function Yg(e,t){var a=t.action,l=t.payload,o=e.state;if(t.isTransition){var n=P.T,u={};P.T=u;try{var r=a(o,l),s=P.S;s!==null&&s(u,r),jp(e,t,r)}catch(i){nc(e,t,i)}finally{n!==null&&u.types!==null&&(n.types=u.types),P.T=n}}else try{n=a(o,l),jp(e,t,n)}catch(i){nc(e,t,i)}}function jp(e,t,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(l){Yp(e,t,l)},function(l){return nc(e,t,l)}):Yp(e,t,a)}function Yp(e,t,a){t.status="fulfilled",t.value=a,Kg(t),e.state=a,t=e.pending,t!==null&&(a=t.next,a===t?e.pending=null:(a=a.next,t.next=a,Yg(e,a)))}function nc(e,t,a){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=a,Kg(t),t=t.next;while(t!==l)}e.action=null}function Kg(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Zg(e,t){return t}function Kp(e,t){if(te){var a=me.formState;if(a!==null){e:{var l=K;if(te){if(ve){t:{for(var o=ve,n=Jt;o.nodeType!==8;){if(!n){o=null;break t}if(o=ea(o.nextSibling),o===null){o=null;break t}}n=o.data,o=n==="F!"||n==="F"?o:null}if(o){ve=ea(o.nextSibling),l=o.data==="F!";break e}}Bl(l)}l=!1}l&&(t=a[0])}}return a=pt(),a.memoizedState=a.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Zg,lastRenderedState:t},a.queue=l,a=cx.bind(null,K,l),l.dispatch=a,l=oc(!1),n=ud.bind(null,K,!1,l.queue),l=pt(),o={state:t,dispatch:null,action:e,pending:null},l.queue=o,a=Jb.bind(null,K,o,n,a),o.dispatch=a,l.memoizedState=e,[t,a,!1]}function Zp(e){var t=De();return Qg(t,ce,e)}function Qg(e,t,a){if(t=td(e,t,Zg)[0],e=qr(Wa)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=Xu(t)}catch(u){throw u===bn?Ds:u}else l=t;t=De();var o=t.queue,n=o.dispatch;return a!==t.memoizedState&&(K.flags|=2048,pn(9,{destroy:void 0},$b.bind(null,o,a),null)),[l,n,e]}function $b(e,t){e.action=t}function Qp(e){var t=De(),a=ce;if(a!==null)return Qg(t,a,e);De(),t=t.memoizedState,a=De();var l=a.queue.dispatch;return a.memoizedState=e,[t,l,!1]}function pn(e,t,a,l){return e={tag:e,create:a,deps:l,inst:t,next:null},t=K.updateQueue,t===null&&(t=Es(),K.updateQueue=t),a=t.lastEffect,a===null?t.lastEffect=e.next=e:(l=a.next,a.next=e,e.next=l,t.lastEffect=e),e}function Wg(){return De().memoizedState}function Fr(e,t,a,l){var o=pt();K.flags|=e,o.memoizedState=pn(1|t,{destroy:void 0},a,l===void 0?null:l)}function Bs(e,t,a,l){var o=De();l=l===void 0?null:l;var n=o.memoizedState.inst;ce!==null&&l!==null&&Zc(l,ce.memoizedState.deps)?o.memoizedState=pn(t,n,a,l):(K.flags|=e,o.memoizedState=pn(1|t,n,a,l))}function Wp(e,t){Fr(8390656,8,e,t)}function ad(e,t){Bs(2048,8,e,t)}function eI(e){K.flags|=4;var t=K.updateQueue;if(t===null)t=Es(),K.updateQueue=t,t.events=[e];else{var a=t.events;a===null?t.events=[e]:a.push(e)}}function Jg(e){var t=De().memoizedState;return eI({ref:t,nextImpl:e}),function(){if((oe&2)!==0)throw Error(w(440));return t.impl.apply(void 0,arguments)}}function $g(e,t){return Bs(4,2,e,t)}function ex(e,t){return Bs(4,4,e,t)}function tx(e,t){if(typeof t=="function"){e=e();var a=t(e);return function(){typeof a=="function"?a():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function ax(e,t,a){a=a!=null?a.concat([e]):null,Bs(4,4,tx.bind(null,t,e),a)}function ld(){}function lx(e,t){var a=De();t=t===void 0?null:t;var l=a.memoizedState;return t!==null&&Zc(t,l[1])?l[0]:(a.memoizedState=[e,t],e)}function ox(e,t){var a=De();t=t===void 0?null:t;var l=a.memoizedState;if(t!==null&&Zc(t,l[1]))return l[0];if(l=e(),so){Sl(!0);try{e()}finally{Sl(!1)}}return a.memoizedState=[l,t],l}function od(e,t,a){return a===void 0||(Qa&1073741824)!==0&&(ee&261930)===0?e.memoizedState=t:(e.memoizedState=a,e=jx(),K.lanes|=e,_l|=e,a)}function nx(e,t,a,l){return Ht(a,t)?a:mn.current!==null?(e=od(e,a,l),Ht(e,t)||(Ue=!0),e):(Qa&42)===0||(Qa&1073741824)!==0&&(ee&261930)===0?(Ue=!0,e.memoizedState=a):(e=jx(),K.lanes|=e,_l|=e,t)}function ux(e,t,a,l,o){var n=ne.p;ne.p=n!==0&&8>n?n:8;var u=P.T,r={};P.T=r,ud(e,!1,t,a);try{var s=o(),i=P.S;if(i!==null&&i(r,s),s!==null&&typeof s=="object"&&typeof s.then=="function"){var h=Zb(s,l);Lu(e,t,h,Ut(e))}else Lu(e,t,l,Ut(e))}catch(m){Lu(e,t,{then:function(){},status:"rejected",reason:m},Ut())}finally{ne.p=n,u!==null&&r.types!==null&&(u.types=r.types),P.T=u}}function tI(){}function uc(e,t,a,l){if(e.tag!==5)throw Error(w(476));var o=rx(e).queue;ux(e,o,t,eo,a===null?tI:function(){return sx(e),a(l)})}function rx(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:eo,baseState:eo,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Wa,lastRenderedState:eo},next:null};var a={};return t.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Wa,lastRenderedState:a},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function sx(e){var t=rx(e);t.next===null&&(t=e.alternate.memoizedState),Lu(e,t.next.queue,{},Ut())}function nd(){return tt(Pu)}function ix(){return De().memoizedState}function fx(){return De().memoizedState}function aI(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var a=Ut();e=Al(a);var l=Rl(t,e,a);l!==null&&(bt(l,t,a),hu(l,t,a)),t={cache:Gc()},e.payload=t;return}t=t.return}}function lI(e,t,a){var l=Ut();a={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Ps(e)?dx(t,a):(a=Nc(e,t,a,l),a!==null&&(bt(a,e,l),mx(a,t,l)))}function cx(e,t,a){var l=Ut();Lu(e,t,a,l)}function Lu(e,t,a,l){var o={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Ps(e))dx(t,o);else{var n=e.alternate;if(e.lanes===0&&(n===null||n.lanes===0)&&(n=t.lastRenderedReducer,n!==null))try{var u=t.lastRenderedState,r=n(u,a);if(o.hasEagerState=!0,o.eagerState=r,Ht(r,u))return Ms(e,t,o,0),me===null&&ks(),!1}catch{}if(a=Nc(e,t,o,l),a!==null)return bt(a,e,l),mx(a,t,l),!0}return!1}function ud(e,t,a,l){if(l={lane:2,revertLane:hd(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Ps(e)){if(t)throw Error(w(479))}else t=Nc(e,a,l,2),t!==null&&bt(t,e,2)}function Ps(e){var t=e.alternate;return e===K||t!==null&&t===K}function dx(e,t){un=ss=!0;var a=e.pending;a===null?t.next=t:(t.next=a.next,a.next=t),e.pending=t}function mx(e,t,a){if((a&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,Jh(e,a)}}var Eu={readContext:tt,use:Os,useCallback:Te,useContext:Te,useEffect:Te,useImperativeHandle:Te,useLayoutEffect:Te,useInsertionEffect:Te,useMemo:Te,useReducer:Te,useRef:Te,useState:Te,useDebugValue:Te,useDeferredValue:Te,useTransition:Te,useSyncExternalStore:Te,useId:Te,useHostTransitionStatus:Te,useFormState:Te,useActionState:Te,useOptimistic:Te,useMemoCache:Te,useCacheRefresh:Te};Eu.useEffectEvent=Te;var px={readContext:tt,use:Os,useCallback:function(e,t){return pt().memoizedState=[e,t===void 0?null:t],e},useContext:tt,useEffect:Wp,useImperativeHandle:function(e,t,a){a=a!=null?a.concat([e]):null,Fr(4194308,4,tx.bind(null,t,e),a)},useLayoutEffect:function(e,t){return Fr(4194308,4,e,t)},useInsertionEffect:function(e,t){Fr(4,2,e,t)},useMemo:function(e,t){var a=pt();t=t===void 0?null:t;var l=e();if(so){Sl(!0);try{e()}finally{Sl(!1)}}return a.memoizedState=[l,t],l},useReducer:function(e,t,a){var l=pt();if(a!==void 0){var o=a(t);if(so){Sl(!0);try{a(t)}finally{Sl(!1)}}}else o=t;return l.memoizedState=l.baseState=o,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:o},l.queue=e,e=e.dispatch=lI.bind(null,K,e),[l.memoizedState,e]},useRef:function(e){var t=pt();return e={current:e},t.memoizedState=e},useState:function(e){e=oc(e);var t=e.queue,a=cx.bind(null,K,t);return t.dispatch=a,[e.memoizedState,a]},useDebugValue:ld,useDeferredValue:function(e,t){var a=pt();return od(a,e,t)},useTransition:function(){var e=oc(!1);return e=ux.bind(null,K,e.queue,!0,!1),pt().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,a){var l=K,o=pt();if(te){if(a===void 0)throw Error(w(407));a=a()}else{if(a=t(),me===null)throw Error(w(349));(ee&127)!==0||qg(l,t,a)}o.memoizedState=a;var n={value:a,getSnapshot:t};return o.queue=n,Wp(Vg.bind(null,l,n,e),[e]),l.flags|=2048,pn(9,{destroy:void 0},Fg.bind(null,l,n,a,t),null),a},useId:function(){var e=pt(),t=me.identifierPrefix;if(te){var a=wa,l=Ia;a=(l&~(1<<32-_t(l)-1)).toString(32)+a,t="_"+t+"R_"+a,a=is++,0<a&&(t+="H"+a.toString(32)),t+="_"}else a=Qb++,t="_"+t+"r_"+a.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:nd,useFormState:Kp,useActionState:Kp,useOptimistic:function(e){var t=pt();t.memoizedState=t.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=a,t=ud.bind(null,K,!0,a),a.dispatch=t,[e,t]},useMemoCache:ed,useCacheRefresh:function(){return pt().memoizedState=aI.bind(null,K)},useEffectEvent:function(e){var t=pt(),a={impl:e};return t.memoizedState=a,function(){if((oe&2)!==0)throw Error(w(440));return a.impl.apply(void 0,arguments)}}},rd={readContext:tt,use:Os,useCallback:lx,useContext:tt,useEffect:ad,useImperativeHandle:ax,useInsertionEffect:$g,useLayoutEffect:ex,useMemo:ox,useReducer:qr,useRef:Wg,useState:function(){return qr(Wa)},useDebugValue:ld,useDeferredValue:function(e,t){var a=De();return nx(a,ce.memoizedState,e,t)},useTransition:function(){var e=qr(Wa)[0],t=De().memoizedState;return[typeof e=="boolean"?e:Xu(e),t]},useSyncExternalStore:Ng,useId:ix,useHostTransitionStatus:nd,useFormState:Zp,useActionState:Zp,useOptimistic:function(e,t){var a=De();return jg(a,ce,e,t)},useMemoCache:ed,useCacheRefresh:fx};rd.useEffectEvent=Jg;var hx={readContext:tt,use:Os,useCallback:lx,useContext:tt,useEffect:ad,useImperativeHandle:ax,useInsertionEffect:$g,useLayoutEffect:ex,useMemo:ox,useReducer:pf,useRef:Wg,useState:function(){return pf(Wa)},useDebugValue:ld,useDeferredValue:function(e,t){var a=De();return ce===null?od(a,e,t):nx(a,ce.memoizedState,e,t)},useTransition:function(){var e=pf(Wa)[0],t=De().memoizedState;return[typeof e=="boolean"?e:Xu(e),t]},useSyncExternalStore:Ng,useId:ix,useHostTransitionStatus:nd,useFormState:Qp,useActionState:Qp,useOptimistic:function(e,t){var a=De();return ce!==null?jg(a,ce,e,t):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:ed,useCacheRefresh:fx};hx.useEffectEvent=Jg;function hf(e,t,a,l){t=e.memoizedState,a=a(l,t),a=a==null?t:ye({},t,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var rc={enqueueSetState:function(e,t,a){e=e._reactInternals;var l=Ut(),o=Al(l);o.payload=t,a!=null&&(o.callback=a),t=Rl(e,o,l),t!==null&&(bt(t,e,l),hu(t,e,l))},enqueueReplaceState:function(e,t,a){e=e._reactInternals;var l=Ut(),o=Al(l);o.tag=1,o.payload=t,a!=null&&(o.callback=a),t=Rl(e,o,l),t!==null&&(bt(t,e,l),hu(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var a=Ut(),l=Al(a);l.tag=2,t!=null&&(l.callback=t),t=Rl(e,l,a),t!==null&&(bt(t,e,a),hu(t,e,a))}};function Jp(e,t,a,l,o,n,u){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,n,u):t.prototype&&t.prototype.isPureReactComponent?!Ru(a,l)||!Ru(o,n):!0}function $p(e,t,a,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(a,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(a,l),t.state!==e&&rc.enqueueReplaceState(t,t.state,null)}function io(e,t){var a=t;if("ref"in t){a={};for(var l in t)l!=="ref"&&(a[l]=t[l])}if(e=e.defaultProps){a===t&&(a=ye({},a));for(var o in e)a[o]===void 0&&(a[o]=e[o])}return a}function gx(e){ts(e)}function xx(e){console.error(e)}function Lx(e){ts(e)}function fs(e,t){try{var a=e.onUncaughtError;a(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function eh(e,t,a){try{var l=e.onCaughtError;l(a.value,{componentStack:a.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(o){setTimeout(function(){throw o})}}function sc(e,t,a){return a=Al(a),a.tag=3,a.payload={element:null},a.callback=function(){fs(e,t)},a}function Sx(e){return e=Al(e),e.tag=3,e}function vx(e,t,a,l){var o=a.type.getDerivedStateFromError;if(typeof o=="function"){var n=l.value;e.payload=function(){return o(n)},e.callback=function(){eh(t,a,l)}}var u=a.stateNode;u!==null&&typeof u.componentDidCatch=="function"&&(e.callback=function(){eh(t,a,l),typeof o!="function"&&(Tl===null?Tl=new Set([this]):Tl.add(this));var r=l.stack;this.componentDidCatch(l.value,{componentStack:r!==null?r:""})})}function oI(e,t,a,l,o){if(a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=a.alternate,t!==null&&Cn(t,a,o,!0),a=zt.current,a!==null){switch(a.tag){case 31:case 13:return $t===null?hs():a.alternate===null&&ke===0&&(ke=3),a.flags&=-257,a.flags|=65536,a.lanes=o,l===ns?a.flags|=16384:(t=a.updateQueue,t===null?a.updateQueue=new Set([l]):t.add(l),Af(e,l,o)),!1;case 22:return a.flags|=65536,l===ns?a.flags|=16384:(t=a.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},a.updateQueue=t):(a=t.retryQueue,a===null?t.retryQueue=new Set([l]):a.add(l)),Af(e,l,o)),!1}throw Error(w(435,a.tag))}return Af(e,l,o),hs(),!1}if(te)return t=zt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=o,l!==Zf&&(e=Error(w(422),{cause:l}),ku(Wt(e,a)))):(l!==Zf&&(t=Error(w(423),{cause:l}),ku(Wt(t,a))),e=e.current.alternate,e.flags|=65536,o&=-o,e.lanes|=o,l=Wt(l,a),o=sc(e.stateNode,l,o),mf(e,o),ke!==4&&(ke=2)),!1;var n=Error(w(520),{cause:l});if(n=Wt(n,a),yu===null?yu=[n]:yu.push(n),ke!==4&&(ke=2),t===null)return!0;l=Wt(l,a),a=t;do{switch(a.tag){case 3:return a.flags|=65536,e=o&-o,a.lanes|=e,e=sc(a.stateNode,l,e),mf(a,e),!1;case 1:if(t=a.type,n=a.stateNode,(a.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||n!==null&&typeof n.componentDidCatch=="function"&&(Tl===null||!Tl.has(n))))return a.flags|=65536,o&=-o,a.lanes|=o,o=Sx(o),vx(o,e,a,l),mf(a,o),!1}a=a.return}while(a!==null);return!1}var sd=Error(w(461)),Ue=!1;function Je(e,t,a,l){t.child=e===null?Bg(t,null,a,l):ro(t,e.child,a,l)}function th(e,t,a,l,o){a=a.render;var n=t.ref;if("ref"in l){var u={};for(var r in l)r!=="ref"&&(u[r]=l[r])}else u=l;return uo(t),l=Qc(e,t,a,u,n,o),r=Wc(),e!==null&&!Ue?(Jc(e,t,o),Ja(e,t,o)):(te&&r&&Fc(t),t.flags|=1,Je(e,t,l,o),t.child)}function ah(e,t,a,l,o){if(e===null){var n=a.type;return typeof n=="function"&&!qc(n)&&n.defaultProps===void 0&&a.compare===null?(t.tag=15,t.type=n,yx(e,t,n,l,o)):(e=zr(a.type,null,l,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(n=e.child,!id(e,o)){var u=n.memoizedProps;if(a=a.compare,a=a!==null?a:Ru,a(u,l)&&e.ref===t.ref)return Ja(e,t,o)}return t.flags|=1,e=ja(n,l),e.ref=t.ref,e.return=t,t.child=e}function yx(e,t,a,l,o){if(e!==null){var n=e.memoizedProps;if(Ru(n,l)&&e.ref===t.ref)if(Ue=!1,t.pendingProps=l=n,id(e,o))(e.flags&131072)!==0&&(Ue=!0);else return t.lanes=e.lanes,Ja(e,t,o)}return ic(e,t,a,l,o)}function Cx(e,t,a,l){var o=l.children,n=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(n=n!==null?n.baseLanes|a:a,e!==null){for(l=t.child=e.child,o=0;l!==null;)o=o|l.lanes|l.childLanes,l=l.sibling;l=o&~n}else l=0,t.child=null;return lh(e,t,n,a,l)}if((a&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Nr(t,n!==null?n.cachePool:null),n!==null?Xp(t,n):ac(),Ug(t);else return l=t.lanes=536870912,lh(e,t,n!==null?n.baseLanes|a:a,a,l)}else n!==null?(Nr(t,n.cachePool),Xp(t,n),xl(t),t.memoizedState=null):(e!==null&&Nr(t,null),ac(),xl(t));return Je(e,t,o,a),t.child}function iu(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function lh(e,t,a,l,o){var n=Xc();return n=n===null?null:{parent:_e._currentValue,pool:n},t.memoizedState={baseLanes:a,cachePool:n},e!==null&&Nr(t,null),ac(),Ug(t),e!==null&&Cn(e,t,l,!0),t.childLanes=o,null}function Vr(e,t){return t=cs({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function oh(e,t,a){return ro(t,e.child,null,a),e=Vr(t,t.pendingProps),e.flags|=2,Dt(t),t.memoizedState=null,e}function nI(e,t,a){var l=t.pendingProps,o=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(te){if(l.mode==="hidden")return e=Vr(t,l),t.lanes=536870912,iu(null,e);if(lc(t),(e=ve)?(e=pL(e,Jt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ol!==null?{id:Ia,overflow:wa}:null,retryLane:536870912,hydrationErrors:null},a=Rg(e),a.return=t,t.child=a,et=t,ve=null)):e=null,e===null)throw Bl(t);return t.lanes=536870912,null}return Vr(t,l)}var n=e.memoizedState;if(n!==null){var u=n.dehydrated;if(lc(t),o)if(t.flags&256)t.flags&=-257,t=oh(e,t,a);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(w(558));else if(Ue||Cn(e,t,a,!1),o=(a&e.childLanes)!==0,Ue||o){if(l=me,l!==null&&(u=$h(l,a),u!==0&&u!==n.retryLane))throw n.retryLane=u,po(e,u),bt(l,e,u),sd;hs(),t=oh(e,t,a)}else e=n.treeContext,ve=ea(u.nextSibling),et=t,te=!0,wl=null,Jt=!1,e!==null&&kg(t,e),t=Vr(t,l),t.flags|=4096;return t}return e=ja(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Gr(e,t){var a=t.ref;if(a===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(w(284));(e===null||e.ref!==a)&&(t.flags|=4194816)}}function ic(e,t,a,l,o){return uo(t),a=Qc(e,t,a,l,void 0,o),l=Wc(),e!==null&&!Ue?(Jc(e,t,o),Ja(e,t,o)):(te&&l&&Fc(t),t.flags|=1,Je(e,t,a,o),t.child)}function nh(e,t,a,l,o,n){return uo(t),t.updateQueue=null,a=zg(t,l,a,o),Hg(e),l=Wc(),e!==null&&!Ue?(Jc(e,t,n),Ja(e,t,n)):(te&&l&&Fc(t),t.flags|=1,Je(e,t,a,n),t.child)}function uh(e,t,a,l,o){if(uo(t),t.stateNode===null){var n=Wo,u=a.contextType;typeof u=="object"&&u!==null&&(n=tt(u)),n=new a(l,n),t.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=rc,t.stateNode=n,n._reactInternals=t,n=t.stateNode,n.props=l,n.state=t.memoizedState,n.refs={},Yc(t),u=a.contextType,n.context=typeof u=="object"&&u!==null?tt(u):Wo,n.state=t.memoizedState,u=a.getDerivedStateFromProps,typeof u=="function"&&(hf(t,a,u,l),n.state=t.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof n.getSnapshotBeforeUpdate=="function"||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(u=n.state,typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount(),u!==n.state&&rc.enqueueReplaceState(n,n.state,null),xu(t,l,n,o),gu(),n.state=t.memoizedState),typeof n.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){n=t.stateNode;var r=t.memoizedProps,s=io(a,r);n.props=s;var i=n.context,h=a.contextType;u=Wo,typeof h=="object"&&h!==null&&(u=tt(h));var m=a.getDerivedStateFromProps;h=typeof m=="function"||typeof n.getSnapshotBeforeUpdate=="function",r=t.pendingProps!==r,h||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(r||i!==u)&&$p(t,n,l,u),pl=!1;var f=t.memoizedState;n.state=f,xu(t,l,n,o),gu(),i=t.memoizedState,r||f!==i||pl?(typeof m=="function"&&(hf(t,a,m,l),i=t.memoizedState),(s=pl||Jp(t,a,s,l,f,i,u))?(h||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount()),typeof n.componentDidMount=="function"&&(t.flags|=4194308)):(typeof n.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=i),n.props=l,n.state=i,n.context=u,l=s):(typeof n.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{n=t.stateNode,ec(e,t),u=t.memoizedProps,h=io(a,u),n.props=h,m=t.pendingProps,f=n.context,i=a.contextType,s=Wo,typeof i=="object"&&i!==null&&(s=tt(i)),r=a.getDerivedStateFromProps,(i=typeof r=="function"||typeof n.getSnapshotBeforeUpdate=="function")||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(u!==m||f!==s)&&$p(t,n,l,s),pl=!1,f=t.memoizedState,n.state=f,xu(t,l,n,o),gu();var p=t.memoizedState;u!==m||f!==p||pl||e!==null&&e.dependencies!==null&&os(e.dependencies)?(typeof r=="function"&&(hf(t,a,r,l),p=t.memoizedState),(h=pl||Jp(t,a,h,l,f,p,s)||e!==null&&e.dependencies!==null&&os(e.dependencies))?(i||typeof n.UNSAFE_componentWillUpdate!="function"&&typeof n.componentWillUpdate!="function"||(typeof n.componentWillUpdate=="function"&&n.componentWillUpdate(l,p,s),typeof n.UNSAFE_componentWillUpdate=="function"&&n.UNSAFE_componentWillUpdate(l,p,s)),typeof n.componentDidUpdate=="function"&&(t.flags|=4),typeof n.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof n.componentDidUpdate!="function"||u===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=p),n.props=l,n.state=p,n.context=s,l=h):(typeof n.componentDidUpdate!="function"||u===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),l=!1)}return n=l,Gr(e,t),l=(t.flags&128)!==0,n||l?(n=t.stateNode,a=l&&typeof a.getDerivedStateFromError!="function"?null:n.render(),t.flags|=1,e!==null&&l?(t.child=ro(t,e.child,null,o),t.child=ro(t,null,a,o)):Je(e,t,a,o),t.memoizedState=n.state,e=t.child):e=Ja(e,t,o),e}function rh(e,t,a,l){return no(),t.flags|=256,Je(e,t,a,l),t.child}var gf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function xf(e){return{baseLanes:e,cachePool:Dg()}}function Lf(e,t,a){return e=e!==null?e.childLanes&~a:0,t&&(e|=Ot),e}function bx(e,t,a){var l=t.pendingProps,o=!1,n=(t.flags&128)!==0,u;if((u=n)||(u=e!==null&&e.memoizedState===null?!1:(Me.current&2)!==0),u&&(o=!0,t.flags&=-129),u=(t.flags&32)!==0,t.flags&=-33,e===null){if(te){if(o?gl(t):xl(t),(e=ve)?(e=pL(e,Jt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ol!==null?{id:Ia,overflow:wa}:null,retryLane:536870912,hydrationErrors:null},a=Rg(e),a.return=t,t.child=a,et=t,ve=null)):e=null,e===null)throw Bl(t);return bc(e)?t.lanes=32:t.lanes=536870912,null}var r=l.children;return l=l.fallback,o?(xl(t),o=t.mode,r=cs({mode:"hidden",children:r},o),l=to(l,o,a,null),r.return=t,l.return=t,r.sibling=l,t.child=r,l=t.child,l.memoizedState=xf(a),l.childLanes=Lf(e,u,a),t.memoizedState=gf,iu(null,l)):(gl(t),fc(t,r))}var s=e.memoizedState;if(s!==null&&(r=s.dehydrated,r!==null)){if(n)t.flags&256?(gl(t),t.flags&=-257,t=Sf(e,t,a)):t.memoizedState!==null?(xl(t),t.child=e.child,t.flags|=128,t=null):(xl(t),r=l.fallback,o=t.mode,l=cs({mode:"visible",children:l.children},o),r=to(r,o,a,null),r.flags|=2,l.return=t,r.return=t,l.sibling=r,t.child=l,ro(t,e.child,null,a),l=t.child,l.memoizedState=xf(a),l.childLanes=Lf(e,u,a),t.memoizedState=gf,t=iu(null,l));else if(gl(t),bc(r)){if(u=r.nextSibling&&r.nextSibling.dataset,u)var i=u.dgst;u=i,l=Error(w(419)),l.stack="",l.digest=u,ku({value:l,source:null,stack:null}),t=Sf(e,t,a)}else if(Ue||Cn(e,t,a,!1),u=(a&e.childLanes)!==0,Ue||u){if(u=me,u!==null&&(l=$h(u,a),l!==0&&l!==s.retryLane))throw s.retryLane=l,po(e,l),bt(u,e,l),sd;Cc(r)||hs(),t=Sf(e,t,a)}else Cc(r)?(t.flags|=192,t.child=e.child,t=null):(e=s.treeContext,ve=ea(r.nextSibling),et=t,te=!0,wl=null,Jt=!1,e!==null&&kg(t,e),t=fc(t,l.children),t.flags|=4096);return t}return o?(xl(t),r=l.fallback,o=t.mode,s=e.child,i=s.sibling,l=ja(s,{mode:"hidden",children:l.children}),l.subtreeFlags=s.subtreeFlags&65011712,i!==null?r=ja(i,r):(r=to(r,o,a,null),r.flags|=2),r.return=t,l.return=t,l.sibling=r,t.child=l,iu(null,l),l=t.child,r=e.child.memoizedState,r===null?r=xf(a):(o=r.cachePool,o!==null?(s=_e._currentValue,o=o.parent!==s?{parent:s,pool:s}:o):o=Dg(),r={baseLanes:r.baseLanes|a,cachePool:o}),l.memoizedState=r,l.childLanes=Lf(e,u,a),t.memoizedState=gf,iu(e.child,l)):(gl(t),a=e.child,e=a.sibling,a=ja(a,{mode:"visible",children:l.children}),a.return=t,a.sibling=null,e!==null&&(u=t.deletions,u===null?(t.deletions=[e],t.flags|=16):u.push(e)),t.child=a,t.memoizedState=null,a)}function fc(e,t){return t=cs({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function cs(e,t){return e=Et(22,e,null,t),e.lanes=0,e}function Sf(e,t,a){return ro(t,e.child,null,a),e=fc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function sh(e,t,a){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),Wf(e.return,t,a)}function vf(e,t,a,l,o,n){var u=e.memoizedState;u===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:a,tailMode:o,treeForkCount:n}:(u.isBackwards=t,u.rendering=null,u.renderingStartTime=0,u.last=l,u.tail=a,u.tailMode=o,u.treeForkCount=n)}function Ix(e,t,a){var l=t.pendingProps,o=l.revealOrder,n=l.tail;l=l.children;var u=Me.current,r=(u&2)!==0;if(r?(u=u&1|2,t.flags|=128):u&=1,pe(Me,u),Je(e,t,l,a),l=te?Tu:0,!r&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&sh(e,a,t);else if(e.tag===19)sh(e,a,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(o){case"forwards":for(a=t.child,o=null;a!==null;)e=a.alternate,e!==null&&rs(e)===null&&(o=a),a=a.sibling;a=o,a===null?(o=t.child,t.child=null):(o=a.sibling,a.sibling=null),vf(t,!1,o,a,n,l);break;case"backwards":case"unstable_legacy-backwards":for(a=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&rs(e)===null){t.child=o;break}e=o.sibling,o.sibling=a,a=o,o=e}vf(t,!0,a,null,n,l);break;case"together":vf(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function Ja(e,t,a){if(e!==null&&(t.dependencies=e.dependencies),_l|=t.lanes,(a&t.childLanes)===0)if(e!==null){if(Cn(e,t,a,!1),(a&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(w(153));if(t.child!==null){for(e=t.child,a=ja(e,e.pendingProps),t.child=a,a.return=t;e.sibling!==null;)e=e.sibling,a=a.sibling=ja(e,e.pendingProps),a.return=t;a.sibling=null}return t.child}function id(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&os(e)))}function uI(e,t,a){switch(t.tag){case 3:Wr(t,t.stateNode.containerInfo),hl(t,_e,e.memoizedState.cache),no();break;case 27:case 5:Hf(t);break;case 4:Wr(t,t.stateNode.containerInfo);break;case 10:hl(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,lc(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(gl(t),t.flags|=128,null):(a&t.child.childLanes)!==0?bx(e,t,a):(gl(t),e=Ja(e,t,a),e!==null?e.sibling:null);gl(t);break;case 19:var o=(e.flags&128)!==0;if(l=(a&t.childLanes)!==0,l||(Cn(e,t,a,!1),l=(a&t.childLanes)!==0),o){if(l)return Ix(e,t,a);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),pe(Me,Me.current),l)break;return null;case 22:return t.lanes=0,Cx(e,t,a,t.pendingProps);case 24:hl(t,_e,e.memoizedState.cache)}return Ja(e,t,a)}function wx(e,t,a){if(e!==null)if(e.memoizedProps!==t.pendingProps)Ue=!0;else{if(!id(e,a)&&(t.flags&128)===0)return Ue=!1,uI(e,t,a);Ue=(e.flags&131072)!==0}else Ue=!1,te&&(t.flags&1048576)!==0&&Tg(t,Tu,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=Jl(t.elementType),t.type=e,typeof e=="function")qc(e)?(l=io(e,l),t.tag=1,t=uh(null,t,e,l,a)):(t.tag=0,t=ic(null,t,e,l,a));else{if(e!=null){var o=e.$$typeof;if(o===Rc){t.tag=11,t=th(null,t,e,l,a);break e}else if(o===Tc){t.tag=14,t=ah(null,t,e,l,a);break e}}throw t=_f(e)||e,Error(w(306,t,""))}}return t;case 0:return ic(e,t,t.type,t.pendingProps,a);case 1:return l=t.type,o=io(l,t.pendingProps),uh(e,t,l,o,a);case 3:e:{if(Wr(t,t.stateNode.containerInfo),e===null)throw Error(w(387));l=t.pendingProps;var n=t.memoizedState;o=n.element,ec(e,t),xu(t,l,null,a);var u=t.memoizedState;if(l=u.cache,hl(t,_e,l),l!==n.cache&&Jf(t,[_e],a,!0),gu(),l=u.element,n.isDehydrated)if(n={element:l,isDehydrated:!1,cache:u.cache},t.updateQueue.baseState=n,t.memoizedState=n,t.flags&256){t=rh(e,t,l,a);break e}else if(l!==o){o=Wt(Error(w(424)),t),ku(o),t=rh(e,t,l,a);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,ve=ea(e.firstChild),et=t,te=!0,wl=null,Jt=!0,a=Bg(t,null,l,a),t.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(no(),l===o){t=Ja(e,t,a);break e}Je(e,t,l,a)}t=t.child}return t;case 26:return Gr(e,t),e===null?(a=Mh(t.type,null,t.pendingProps,null))?t.memoizedState=a:te||(a=t.type,e=t.pendingProps,l=Ss(Il.current).createElement(a),l[$e]=t,l[It]=e,at(l,a,e),Ke(l),t.stateNode=l):t.memoizedState=Mh(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Hf(t),e===null&&te&&(l=t.stateNode=hL(t.type,t.pendingProps,Il.current),et=t,Jt=!0,o=ve,Hl(t.type)?(Ic=o,ve=ea(l.firstChild)):ve=o),Je(e,t,t.pendingProps.children,a),Gr(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&te&&((o=l=ve)&&(l=BI(l,t.type,t.pendingProps,Jt),l!==null?(t.stateNode=l,et=t,ve=ea(l.firstChild),Jt=!1,o=!0):o=!1),o||Bl(t)),Hf(t),o=t.type,n=t.pendingProps,u=e!==null?e.memoizedProps:null,l=n.children,vc(o,n)?l=null:u!==null&&vc(o,u)&&(t.flags|=32),t.memoizedState!==null&&(o=Qc(e,t,Wb,null,null,a),Pu._currentValue=o),Gr(e,t),Je(e,t,l,a),t.child;case 6:return e===null&&te&&((e=a=ve)&&(a=PI(a,t.pendingProps,Jt),a!==null?(t.stateNode=a,et=t,ve=null,e=!0):e=!1),e||Bl(t)),null;case 13:return bx(e,t,a);case 4:return Wr(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=ro(t,null,l,a):Je(e,t,l,a),t.child;case 11:return th(e,t,t.type,t.pendingProps,a);case 7:return Je(e,t,t.pendingProps,a),t.child;case 8:return Je(e,t,t.pendingProps.children,a),t.child;case 12:return Je(e,t,t.pendingProps.children,a),t.child;case 10:return l=t.pendingProps,hl(t,t.type,l.value),Je(e,t,l.children,a),t.child;case 9:return o=t.type._context,l=t.pendingProps.children,uo(t),o=tt(o),l=l(o),t.flags|=1,Je(e,t,l,a),t.child;case 14:return ah(e,t,t.type,t.pendingProps,a);case 15:return yx(e,t,t.type,t.pendingProps,a);case 19:return Ix(e,t,a);case 31:return nI(e,t,a);case 22:return Cx(e,t,a,t.pendingProps);case 24:return uo(t),l=tt(_e),e===null?(o=Xc(),o===null&&(o=me,n=Gc(),o.pooledCache=n,n.refCount++,n!==null&&(o.pooledCacheLanes|=a),o=n),t.memoizedState={parent:l,cache:o},Yc(t),hl(t,_e,o)):((e.lanes&a)!==0&&(ec(e,t),xu(t,null,null,a),gu()),o=e.memoizedState,n=t.memoizedState,o.parent!==l?(o={parent:l,cache:l},t.memoizedState=o,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=o),hl(t,_e,l)):(l=n.cache,hl(t,_e,l),l!==o.cache&&Jf(t,[_e],a,!0))),Je(e,t,t.pendingProps.children,a),t.child;case 29:throw t.pendingProps}throw Error(w(156,t.tag))}function Ua(e){e.flags|=4}function yf(e,t,a,l,o){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(o&335544128)===o)if(e.stateNode.complete)e.flags|=8192;else if(Zx())e.flags|=8192;else throw lo=ns,jc}else e.flags&=-16777217}function ih(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!LL(t))if(Zx())e.flags|=8192;else throw lo=ns,jc}function Tr(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Qh():536870912,e.lanes|=t,hn|=t)}function au(e,t){if(!te)switch(e.tailMode){case"hidden":t=e.tail;for(var a=null;t!==null;)t.alternate!==null&&(a=t),t=t.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var l=null;a!==null;)a.alternate!==null&&(l=a),a=a.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Se(e){var t=e.alternate!==null&&e.alternate.child===e.child,a=0,l=0;if(t)for(var o=e.child;o!==null;)a|=o.lanes|o.childLanes,l|=o.subtreeFlags&65011712,l|=o.flags&65011712,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)a|=o.lanes|o.childLanes,l|=o.subtreeFlags,l|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=l,e.childLanes=a,t}function rI(e,t,a){var l=t.pendingProps;switch(Vc(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Se(t),null;case 1:return Se(t),null;case 3:return a=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),Ya(_e),sn(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(zo(t)?Ua(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,df())),Se(t),null;case 26:var o=t.type,n=t.memoizedState;return e===null?(Ua(t),n!==null?(Se(t),ih(t,n)):(Se(t),yf(t,o,null,l,a))):n?n!==e.memoizedState?(Ua(t),Se(t),ih(t,n)):(Se(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&Ua(t),Se(t),yf(t,o,e,l,a)),null;case 27:if(Jr(t),a=Il.current,o=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&Ua(t);else{if(!l){if(t.stateNode===null)throw Error(w(166));return Se(t),null}e=Ra.current,zo(t)?Hp(t,e):(e=hL(o,l,a),t.stateNode=e,Ua(t))}return Se(t),null;case 5:if(Jr(t),o=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&Ua(t);else{if(!l){if(t.stateNode===null)throw Error(w(166));return Se(t),null}if(n=Ra.current,zo(t))Hp(t,n);else{var u=Ss(Il.current);switch(n){case 1:n=u.createElementNS("http://www.w3.org/2000/svg",o);break;case 2:n=u.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;default:switch(o){case"svg":n=u.createElementNS("http://www.w3.org/2000/svg",o);break;case"math":n=u.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;case"script":n=u.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild);break;case"select":n=typeof l.is=="string"?u.createElement("select",{is:l.is}):u.createElement("select"),l.multiple?n.multiple=!0:l.size&&(n.size=l.size);break;default:n=typeof l.is=="string"?u.createElement(o,{is:l.is}):u.createElement(o)}}n[$e]=t,n[It]=l;e:for(u=t.child;u!==null;){if(u.tag===5||u.tag===6)n.appendChild(u.stateNode);else if(u.tag!==4&&u.tag!==27&&u.child!==null){u.child.return=u,u=u.child;continue}if(u===t)break e;for(;u.sibling===null;){if(u.return===null||u.return===t)break e;u=u.return}u.sibling.return=u.return,u=u.sibling}t.stateNode=n;e:switch(at(n,o,l),o){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&Ua(t)}}return Se(t),yf(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,a),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&Ua(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(w(166));if(e=Il.current,zo(t)){if(e=t.stateNode,a=t.memoizedProps,l=null,o=et,o!==null)switch(o.tag){case 27:case 5:l=o.memoizedProps}e[$e]=t,e=!!(e.nodeValue===a||l!==null&&l.suppressHydrationWarning===!0||cL(e.nodeValue,a)),e||Bl(t,!0)}else e=Ss(e).createTextNode(l),e[$e]=t,t.stateNode=e}return Se(t),null;case 31:if(a=t.memoizedState,e===null||e.memoizedState!==null){if(l=zo(t),a!==null){if(e===null){if(!l)throw Error(w(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(w(557));e[$e]=t}else no(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Se(t),e=!1}else a=df(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return t.flags&256?(Dt(t),t):(Dt(t),null);if((t.flags&128)!==0)throw Error(w(558))}return Se(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(o=zo(t),l!==null&&l.dehydrated!==null){if(e===null){if(!o)throw Error(w(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(w(317));o[$e]=t}else no(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Se(t),o=!1}else o=df(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=o),o=!0;if(!o)return t.flags&256?(Dt(t),t):(Dt(t),null)}return Dt(t),(t.flags&128)!==0?(t.lanes=a,t):(a=l!==null,e=e!==null&&e.memoizedState!==null,a&&(l=t.child,o=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(o=l.alternate.memoizedState.cachePool.pool),n=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(n=l.memoizedState.cachePool.pool),n!==o&&(l.flags|=2048)),a!==e&&a&&(t.child.flags|=8192),Tr(t,t.updateQueue),Se(t),null);case 4:return sn(),e===null&&gd(t.stateNode.containerInfo),Se(t),null;case 10:return Ya(t.type),Se(t),null;case 19:if(Ze(Me),l=t.memoizedState,l===null)return Se(t),null;if(o=(t.flags&128)!==0,n=l.rendering,n===null)if(o)au(l,!1);else{if(ke!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(n=rs(e),n!==null){for(t.flags|=128,au(l,!1),e=n.updateQueue,t.updateQueue=e,Tr(t,e),t.subtreeFlags=0,e=a,a=t.child;a!==null;)Ag(a,e),a=a.sibling;return pe(Me,Me.current&1|2),te&&qa(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&Bt()>ms&&(t.flags|=128,o=!0,au(l,!1),t.lanes=4194304)}else{if(!o)if(e=rs(n),e!==null){if(t.flags|=128,o=!0,e=e.updateQueue,t.updateQueue=e,Tr(t,e),au(l,!0),l.tail===null&&l.tailMode==="hidden"&&!n.alternate&&!te)return Se(t),null}else 2*Bt()-l.renderingStartTime>ms&&a!==536870912&&(t.flags|=128,o=!0,au(l,!1),t.lanes=4194304);l.isBackwards?(n.sibling=t.child,t.child=n):(e=l.last,e!==null?e.sibling=n:t.child=n,l.last=n)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Bt(),e.sibling=null,a=Me.current,pe(Me,o?a&1|2:a&1),te&&qa(t,l.treeForkCount),e):(Se(t),null);case 22:case 23:return Dt(t),Kc(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(a&536870912)!==0&&(t.flags&128)===0&&(Se(t),t.subtreeFlags&6&&(t.flags|=8192)):Se(t),a=t.updateQueue,a!==null&&Tr(t,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==a&&(t.flags|=2048),e!==null&&Ze(ao),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),t.memoizedState.cache!==a&&(t.flags|=2048),Ya(_e),Se(t),null;case 25:return null;case 30:return null}throw Error(w(156,t.tag))}function sI(e,t){switch(Vc(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Ya(_e),sn(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Jr(t),null;case 31:if(t.memoizedState!==null){if(Dt(t),t.alternate===null)throw Error(w(340));no()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Dt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(w(340));no()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Ze(Me),null;case 4:return sn(),null;case 10:return Ya(t.type),null;case 22:case 23:return Dt(t),Kc(),e!==null&&Ze(ao),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Ya(_e),null;case 25:return null;default:return null}}function Ax(e,t){switch(Vc(t),t.tag){case 3:Ya(_e),sn();break;case 26:case 27:case 5:Jr(t);break;case 4:sn();break;case 31:t.memoizedState!==null&&Dt(t);break;case 13:Dt(t);break;case 19:Ze(Me);break;case 10:Ya(t.type);break;case 22:case 23:Dt(t),Kc(),e!==null&&Ze(ao);break;case 24:Ya(_e)}}function ju(e,t){try{var a=t.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var o=l.next;a=o;do{if((a.tag&e)===e){l=void 0;var n=a.create,u=a.inst;l=n(),u.destroy=l}a=a.next}while(a!==o)}}catch(r){ie(t,t.return,r)}}function Pl(e,t,a){try{var l=t.updateQueue,o=l!==null?l.lastEffect:null;if(o!==null){var n=o.next;l=n;do{if((l.tag&e)===e){var u=l.inst,r=u.destroy;if(r!==void 0){u.destroy=void 0,o=t;var s=a,i=r;try{i()}catch(h){ie(o,s,h)}}}l=l.next}while(l!==n)}}catch(h){ie(t,t.return,h)}}function Rx(e){var t=e.updateQueue;if(t!==null){var a=e.stateNode;try{_g(t,a)}catch(l){ie(e,e.return,l)}}}function Tx(e,t,a){a.props=io(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(l){ie(e,t,l)}}function Su(e,t){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof a=="function"?e.refCleanup=a(l):a.current=l}}catch(o){ie(e,t,o)}}function Aa(e,t){var a=e.ref,l=e.refCleanup;if(a!==null)if(typeof l=="function")try{l()}catch(o){ie(e,t,o)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(o){ie(e,t,o)}else a.current=null}function kx(e){var t=e.type,a=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":a.autoFocus&&l.focus();break e;case"img":a.src?l.src=a.src:a.srcSet&&(l.srcset=a.srcSet)}}catch(o){ie(e,e.return,o)}}function Cf(e,t,a){try{var l=e.stateNode;TI(l,e.type,a,t),l[It]=t}catch(o){ie(e,e.return,o)}}function Mx(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Hl(e.type)||e.tag===4}function bf(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Mx(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Hl(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function cc(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,t):(t=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,t.appendChild(e),a=a._reactRootContainer,a!=null||t.onclick!==null||(t.onclick=Ga));else if(l!==4&&(l===27&&Hl(e.type)&&(a=e.stateNode,t=null),e=e.child,e!==null))for(cc(e,t,a),e=e.sibling;e!==null;)cc(e,t,a),e=e.sibling}function ds(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?a.insertBefore(e,t):a.appendChild(e);else if(l!==4&&(l===27&&Hl(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(ds(e,t,a),e=e.sibling;e!==null;)ds(e,t,a),e=e.sibling}function Dx(e){var t=e.stateNode,a=e.memoizedProps;try{for(var l=e.type,o=t.attributes;o.length;)t.removeAttributeNode(o[0]);at(t,l,a),t[$e]=e,t[It]=a}catch(n){ie(e,e.return,n)}}var Fa=!1,Pe=!1,If=!1,fh=typeof WeakSet=="function"?WeakSet:Set,Ye=null;function iI(e,t){if(e=e.containerInfo,Lc=bs,e=Lg(e),Hc(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else e:{a=(a=e.ownerDocument)&&a.defaultView||window;var l=a.getSelection&&a.getSelection();if(l&&l.rangeCount!==0){a=l.anchorNode;var o=l.anchorOffset,n=l.focusNode;l=l.focusOffset;try{a.nodeType,n.nodeType}catch{a=null;break e}var u=0,r=-1,s=-1,i=0,h=0,m=e,f=null;t:for(;;){for(var p;m!==a||o!==0&&m.nodeType!==3||(r=u+o),m!==n||l!==0&&m.nodeType!==3||(s=u+l),m.nodeType===3&&(u+=m.nodeValue.length),(p=m.firstChild)!==null;)f=m,m=p;for(;;){if(m===e)break t;if(f===a&&++i===o&&(r=u),f===n&&++h===l&&(s=u),(p=m.nextSibling)!==null)break;m=f,f=m.parentNode}m=p}a=r===-1||s===-1?null:{start:r,end:s}}else a=null}a=a||{start:0,end:0}}else a=null;for(Sc={focusedElem:e,selectionRange:a},bs=!1,Ye=t;Ye!==null;)if(t=Ye,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Ye=e;else for(;Ye!==null;){switch(t=Ye,n=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)o=e[a],o.ref.impl=o.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&n!==null){e=void 0,a=t,o=n.memoizedProps,n=n.memoizedState,l=a.stateNode;try{var L=io(a.type,o);e=l.getSnapshotBeforeUpdate(L,n),l.__reactInternalSnapshotBeforeUpdate=e}catch(S){ie(a,a.return,S)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,a=e.nodeType,a===9)yc(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":yc(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(w(163))}if(e=t.sibling,e!==null){e.return=t.return,Ye=e;break}Ye=t.return}}function Ex(e,t,a){var l=a.flags;switch(a.tag){case 0:case 11:case 15:za(e,a),l&4&&ju(5,a);break;case 1:if(za(e,a),l&4)if(e=a.stateNode,t===null)try{e.componentDidMount()}catch(u){ie(a,a.return,u)}else{var o=io(a.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(o,t,e.__reactInternalSnapshotBeforeUpdate)}catch(u){ie(a,a.return,u)}}l&64&&Rx(a),l&512&&Su(a,a.return);break;case 3:if(za(e,a),l&64&&(e=a.updateQueue,e!==null)){if(t=null,a.child!==null)switch(a.child.tag){case 27:case 5:t=a.child.stateNode;break;case 1:t=a.child.stateNode}try{_g(e,t)}catch(u){ie(a,a.return,u)}}break;case 27:t===null&&l&4&&Dx(a);case 26:case 5:za(e,a),t===null&&l&4&&kx(a),l&512&&Su(a,a.return);break;case 12:za(e,a);break;case 31:za(e,a),l&4&&Px(e,a);break;case 13:za(e,a),l&4&&_x(e,a),l&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=LI.bind(null,a),_I(e,a))));break;case 22:if(l=a.memoizedState!==null||Fa,!l){t=t!==null&&t.memoizedState!==null||Pe,o=Fa;var n=Pe;Fa=l,(Pe=t)&&!n?Na(e,a,(a.subtreeFlags&8772)!==0):za(e,a),Fa=o,Pe=n}break;case 30:break;default:za(e,a)}}function Ox(e){var t=e.alternate;t!==null&&(e.alternate=null,Ox(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Ec(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ae=null,yt=!1;function Ha(e,t,a){for(a=a.child;a!==null;)Bx(e,t,a),a=a.sibling}function Bx(e,t,a){if(Pt&&typeof Pt.onCommitFiberUnmount=="function")try{Pt.onCommitFiberUnmount(zu,a)}catch{}switch(a.tag){case 26:Pe||Aa(a,t),Ha(e,t,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Pe||Aa(a,t);var l=Ae,o=yt;Hl(a.type)&&(Ae=a.stateNode,yt=!1),Ha(e,t,a),bu(a.stateNode),Ae=l,yt=o;break;case 5:Pe||Aa(a,t);case 6:if(l=Ae,o=yt,Ae=null,Ha(e,t,a),Ae=l,yt=o,Ae!==null)if(yt)try{(Ae.nodeType===9?Ae.body:Ae.nodeName==="HTML"?Ae.ownerDocument.body:Ae).removeChild(a.stateNode)}catch(n){ie(a,t,n)}else try{Ae.removeChild(a.stateNode)}catch(n){ie(a,t,n)}break;case 18:Ae!==null&&(yt?(e=Ae,wh(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),Sn(e)):wh(Ae,a.stateNode));break;case 4:l=Ae,o=yt,Ae=a.stateNode.containerInfo,yt=!0,Ha(e,t,a),Ae=l,yt=o;break;case 0:case 11:case 14:case 15:Pl(2,a,t),Pe||Pl(4,a,t),Ha(e,t,a);break;case 1:Pe||(Aa(a,t),l=a.stateNode,typeof l.componentWillUnmount=="function"&&Tx(a,t,l)),Ha(e,t,a);break;case 21:Ha(e,t,a);break;case 22:Pe=(l=Pe)||a.memoizedState!==null,Ha(e,t,a),Pe=l;break;default:Ha(e,t,a)}}function Px(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Sn(e)}catch(a){ie(t,t.return,a)}}}function _x(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Sn(e)}catch(a){ie(t,t.return,a)}}function fI(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new fh),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new fh),t;default:throw Error(w(435,e.tag))}}function kr(e,t){var a=fI(e);t.forEach(function(l){if(!a.has(l)){a.add(l);var o=SI.bind(null,e,l);l.then(o,o)}})}function St(e,t){var a=t.deletions;if(a!==null)for(var l=0;l<a.length;l++){var o=a[l],n=e,u=t,r=u;e:for(;r!==null;){switch(r.tag){case 27:if(Hl(r.type)){Ae=r.stateNode,yt=!1;break e}break;case 5:Ae=r.stateNode,yt=!1;break e;case 3:case 4:Ae=r.stateNode.containerInfo,yt=!0;break e}r=r.return}if(Ae===null)throw Error(w(160));Bx(n,u,o),Ae=null,yt=!1,n=o.alternate,n!==null&&(n.return=null),o.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Ux(t,e),t=t.sibling}var ra=null;function Ux(e,t){var a=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:St(t,e),vt(e),l&4&&(Pl(3,e,e.return),ju(3,e),Pl(5,e,e.return));break;case 1:St(t,e),vt(e),l&512&&(Pe||a===null||Aa(a,a.return)),l&64&&Fa&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?l:a.concat(l))));break;case 26:var o=ra;if(St(t,e),vt(e),l&512&&(Pe||a===null||Aa(a,a.return)),l&4){var n=a!==null?a.memoizedState:null;if(l=e.memoizedState,a===null)if(l===null)if(e.stateNode===null){e:{l=e.type,a=e.memoizedProps,o=o.ownerDocument||o;t:switch(l){case"title":n=o.getElementsByTagName("title")[0],(!n||n[Fu]||n[$e]||n.namespaceURI==="http://www.w3.org/2000/svg"||n.hasAttribute("itemprop"))&&(n=o.createElement(l),o.head.insertBefore(n,o.querySelector("head > title"))),at(n,l,a),n[$e]=e,Ke(n),l=n;break e;case"link":var u=Eh("link","href",o).get(l+(a.href||""));if(u){for(var r=0;r<u.length;r++)if(n=u[r],n.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&n.getAttribute("rel")===(a.rel==null?null:a.rel)&&n.getAttribute("title")===(a.title==null?null:a.title)&&n.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){u.splice(r,1);break t}}n=o.createElement(l),at(n,l,a),o.head.appendChild(n);break;case"meta":if(u=Eh("meta","content",o).get(l+(a.content||""))){for(r=0;r<u.length;r++)if(n=u[r],n.getAttribute("content")===(a.content==null?null:""+a.content)&&n.getAttribute("name")===(a.name==null?null:a.name)&&n.getAttribute("property")===(a.property==null?null:a.property)&&n.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&n.getAttribute("charset")===(a.charSet==null?null:a.charSet)){u.splice(r,1);break t}}n=o.createElement(l),at(n,l,a),o.head.appendChild(n);break;default:throw Error(w(468,l))}n[$e]=e,Ke(n),l=n}e.stateNode=l}else Oh(o,e.type,e.stateNode);else e.stateNode=Dh(o,l,e.memoizedProps);else n!==l?(n===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):n.count--,l===null?Oh(o,e.type,e.stateNode):Dh(o,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Cf(e,e.memoizedProps,a.memoizedProps)}break;case 27:St(t,e),vt(e),l&512&&(Pe||a===null||Aa(a,a.return)),a!==null&&l&4&&Cf(e,e.memoizedProps,a.memoizedProps);break;case 5:if(St(t,e),vt(e),l&512&&(Pe||a===null||Aa(a,a.return)),e.flags&32){o=e.stateNode;try{cn(o,"")}catch(L){ie(e,e.return,L)}}l&4&&e.stateNode!=null&&(o=e.memoizedProps,Cf(e,o,a!==null?a.memoizedProps:o)),l&1024&&(If=!0);break;case 6:if(St(t,e),vt(e),l&4){if(e.stateNode===null)throw Error(w(162));l=e.memoizedProps,a=e.stateNode;try{a.nodeValue=l}catch(L){ie(e,e.return,L)}}break;case 3:if(Yr=null,o=ra,ra=vs(t.containerInfo),St(t,e),ra=o,vt(e),l&4&&a!==null&&a.memoizedState.isDehydrated)try{Sn(t.containerInfo)}catch(L){ie(e,e.return,L)}If&&(If=!1,Hx(e));break;case 4:l=ra,ra=vs(e.stateNode.containerInfo),St(t,e),vt(e),ra=l;break;case 12:St(t,e),vt(e);break;case 31:St(t,e),vt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,kr(e,l)));break;case 13:St(t,e),vt(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(_s=Bt()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,kr(e,l)));break;case 22:o=e.memoizedState!==null;var s=a!==null&&a.memoizedState!==null,i=Fa,h=Pe;if(Fa=i||o,Pe=h||s,St(t,e),Pe=h,Fa=i,vt(e),l&8192)e:for(t=e.stateNode,t._visibility=o?t._visibility&-2:t._visibility|1,o&&(a===null||s||Fa||Pe||$l(e)),a=null,t=e;;){if(t.tag===5||t.tag===26){if(a===null){s=a=t;try{if(n=s.stateNode,o)u=n.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none";else{r=s.stateNode;var m=s.memoizedProps.style,f=m!=null&&m.hasOwnProperty("display")?m.display:null;r.style.display=f==null||typeof f=="boolean"?"":(""+f).trim()}}catch(L){ie(s,s.return,L)}}}else if(t.tag===6){if(a===null){s=t;try{s.stateNode.nodeValue=o?"":s.memoizedProps}catch(L){ie(s,s.return,L)}}}else if(t.tag===18){if(a===null){s=t;try{var p=s.stateNode;o?Ah(p,!0):Ah(s.stateNode,!1)}catch(L){ie(s,s.return,L)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;a===t&&(a=null),t=t.return}a===t&&(a=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(a=l.retryQueue,a!==null&&(l.retryQueue=null,kr(e,a))));break;case 19:St(t,e),vt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,kr(e,l)));break;case 30:break;case 21:break;default:St(t,e),vt(e)}}function vt(e){var t=e.flags;if(t&2){try{for(var a,l=e.return;l!==null;){if(Mx(l)){a=l;break}l=l.return}if(a==null)throw Error(w(160));switch(a.tag){case 27:var o=a.stateNode,n=bf(e);ds(e,n,o);break;case 5:var u=a.stateNode;a.flags&32&&(cn(u,""),a.flags&=-33);var r=bf(e);ds(e,r,u);break;case 3:case 4:var s=a.stateNode.containerInfo,i=bf(e);cc(e,i,s);break;default:throw Error(w(161))}}catch(h){ie(e,e.return,h)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Hx(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Hx(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function za(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Ex(e,t.alternate,t),t=t.sibling}function $l(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Pl(4,t,t.return),$l(t);break;case 1:Aa(t,t.return);var a=t.stateNode;typeof a.componentWillUnmount=="function"&&Tx(t,t.return,a),$l(t);break;case 27:bu(t.stateNode);case 26:case 5:Aa(t,t.return),$l(t);break;case 22:t.memoizedState===null&&$l(t);break;case 30:$l(t);break;default:$l(t)}e=e.sibling}}function Na(e,t,a){for(a=a&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,o=e,n=t,u=n.flags;switch(n.tag){case 0:case 11:case 15:Na(o,n,a),ju(4,n);break;case 1:if(Na(o,n,a),l=n,o=l.stateNode,typeof o.componentDidMount=="function")try{o.componentDidMount()}catch(i){ie(l,l.return,i)}if(l=n,o=l.updateQueue,o!==null){var r=l.stateNode;try{var s=o.shared.hiddenCallbacks;if(s!==null)for(o.shared.hiddenCallbacks=null,o=0;o<s.length;o++)Pg(s[o],r)}catch(i){ie(l,l.return,i)}}a&&u&64&&Rx(n),Su(n,n.return);break;case 27:Dx(n);case 26:case 5:Na(o,n,a),a&&l===null&&u&4&&kx(n),Su(n,n.return);break;case 12:Na(o,n,a);break;case 31:Na(o,n,a),a&&u&4&&Px(o,n);break;case 13:Na(o,n,a),a&&u&4&&_x(o,n);break;case 22:n.memoizedState===null&&Na(o,n,a),Su(n,n.return);break;case 30:break;default:Na(o,n,a)}t=t.sibling}}function fd(e,t){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&Gu(a))}function cd(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Gu(e))}function ua(e,t,a,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)zx(e,t,a,l),t=t.sibling}function zx(e,t,a,l){var o=t.flags;switch(t.tag){case 0:case 11:case 15:ua(e,t,a,l),o&2048&&ju(9,t);break;case 1:ua(e,t,a,l);break;case 3:ua(e,t,a,l),o&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Gu(e)));break;case 12:if(o&2048){ua(e,t,a,l),e=t.stateNode;try{var n=t.memoizedProps,u=n.id,r=n.onPostCommit;typeof r=="function"&&r(u,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(s){ie(t,t.return,s)}}else ua(e,t,a,l);break;case 31:ua(e,t,a,l);break;case 13:ua(e,t,a,l);break;case 23:break;case 22:n=t.stateNode,u=t.alternate,t.memoizedState!==null?n._visibility&2?ua(e,t,a,l):vu(e,t):n._visibility&2?ua(e,t,a,l):(n._visibility|=2,qo(e,t,a,l,(t.subtreeFlags&10256)!==0||!1)),o&2048&&fd(u,t);break;case 24:ua(e,t,a,l),o&2048&&cd(t.alternate,t);break;default:ua(e,t,a,l)}}function qo(e,t,a,l,o){for(o=o&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var n=e,u=t,r=a,s=l,i=u.flags;switch(u.tag){case 0:case 11:case 15:qo(n,u,r,s,o),ju(8,u);break;case 23:break;case 22:var h=u.stateNode;u.memoizedState!==null?h._visibility&2?qo(n,u,r,s,o):vu(n,u):(h._visibility|=2,qo(n,u,r,s,o)),o&&i&2048&&fd(u.alternate,u);break;case 24:qo(n,u,r,s,o),o&&i&2048&&cd(u.alternate,u);break;default:qo(n,u,r,s,o)}t=t.sibling}}function vu(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var a=e,l=t,o=l.flags;switch(l.tag){case 22:vu(a,l),o&2048&&fd(l.alternate,l);break;case 24:vu(a,l),o&2048&&cd(l.alternate,l);break;default:vu(a,l)}t=t.sibling}}var fu=8192;function No(e,t,a){if(e.subtreeFlags&fu)for(e=e.child;e!==null;)Nx(e,t,a),e=e.sibling}function Nx(e,t,a){switch(e.tag){case 26:No(e,t,a),e.flags&fu&&e.memoizedState!==null&&KI(a,ra,e.memoizedState,e.memoizedProps);break;case 5:No(e,t,a);break;case 3:case 4:var l=ra;ra=vs(e.stateNode.containerInfo),No(e,t,a),ra=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=fu,fu=16777216,No(e,t,a),fu=l):No(e,t,a));break;default:No(e,t,a)}}function qx(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function lu(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];Ye=l,Vx(l,e)}qx(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Fx(e),e=e.sibling}function Fx(e){switch(e.tag){case 0:case 11:case 15:lu(e),e.flags&2048&&Pl(9,e,e.return);break;case 3:lu(e);break;case 12:lu(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Xr(e)):lu(e);break;default:lu(e)}}function Xr(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];Ye=l,Vx(l,e)}qx(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Pl(8,t,t.return),Xr(t);break;case 22:a=t.stateNode,a._visibility&2&&(a._visibility&=-3,Xr(t));break;default:Xr(t)}e=e.sibling}}function Vx(e,t){for(;Ye!==null;){var a=Ye;switch(a.tag){case 0:case 11:case 15:Pl(8,a,t);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var l=a.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Gu(a.memoizedState.cache)}if(l=a.child,l!==null)l.return=a,Ye=l;else e:for(a=e;Ye!==null;){l=Ye;var o=l.sibling,n=l.return;if(Ox(l),l===a){Ye=null;break e}if(o!==null){o.return=n,Ye=o;break e}Ye=n}}}var cI={getCacheForType:function(e){var t=tt(_e),a=t.data.get(e);return a===void 0&&(a=e(),t.data.set(e,a)),a},cacheSignal:function(){return tt(_e).controller.signal}},dI=typeof WeakMap=="function"?WeakMap:Map,oe=0,me=null,$=null,ee=0,se=0,Mt=null,yl=!1,In=!1,dd=!1,$a=0,ke=0,_l=0,oo=0,md=0,Ot=0,hn=0,yu=null,Ct=null,dc=!1,_s=0,Gx=0,ms=1/0,ps=null,Tl=null,Fe=0,kl=null,gn=null,Ka=0,mc=0,pc=null,Xx=null,Cu=0,hc=null;function Ut(){return(oe&2)!==0&&ee!==0?ee&-ee:P.T!==null?hd():eg()}function jx(){if(Ot===0)if((ee&536870912)===0||te){var e=Sr;Sr<<=1,(Sr&3932160)===0&&(Sr=262144),Ot=e}else Ot=536870912;return e=zt.current,e!==null&&(e.flags|=32),Ot}function bt(e,t,a){(e===me&&(se===2||se===9)||e.cancelPendingCommit!==null)&&(xn(e,0),Cl(e,ee,Ot,!1)),qu(e,a),((oe&2)===0||e!==me)&&(e===me&&((oe&2)===0&&(oo|=a),ke===4&&Cl(e,ee,Ot,!1)),ka(e))}function Yx(e,t,a){if((oe&6)!==0)throw Error(w(327));var l=!a&&(t&127)===0&&(t&e.expiredLanes)===0||Nu(e,t),o=l?hI(e,t):wf(e,t,!0),n=l;do{if(o===0){In&&!l&&Cl(e,t,0,!1);break}else{if(a=e.current.alternate,n&&!mI(a)){o=wf(e,t,!1),n=!1;continue}if(o===2){if(n=t,e.errorRecoveryDisabledLanes&n)var u=0;else u=e.pendingLanes&-536870913,u=u!==0?u:u&536870912?536870912:0;if(u!==0){t=u;e:{var r=e;o=yu;var s=r.current.memoizedState.isDehydrated;if(s&&(xn(r,u).flags|=256),u=wf(r,u,!1),u!==2){if(dd&&!s){r.errorRecoveryDisabledLanes|=n,oo|=n,o=4;break e}n=Ct,Ct=o,n!==null&&(Ct===null?Ct=n:Ct.push.apply(Ct,n))}o=u}if(n=!1,o!==2)continue}}if(o===1){xn(e,0),Cl(e,t,0,!0);break}e:{switch(l=e,n=o,n){case 0:case 1:throw Error(w(345));case 4:if((t&4194048)!==t)break;case 6:Cl(l,t,Ot,!yl);break e;case 2:Ct=null;break;case 3:case 5:break;default:throw Error(w(329))}if((t&62914560)===t&&(o=_s+300-Bt(),10<o)){if(Cl(l,t,Ot,!yl),ws(l,0,!0)!==0)break e;Ka=t,l.timeoutHandle=mL(ch.bind(null,l,a,Ct,ps,dc,t,Ot,oo,hn,yl,n,"Throttled",-0,0),o);break e}ch(l,a,Ct,ps,dc,t,Ot,oo,hn,yl,n,null,-0,0)}}break}while(!0);ka(e)}function ch(e,t,a,l,o,n,u,r,s,i,h,m,f,p){if(e.timeoutHandle=-1,m=t.subtreeFlags,m&8192||(m&16785408)===16785408){m={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ga},Nx(t,n,m);var L=(n&62914560)===n?_s-Bt():(n&4194048)===n?Gx-Bt():0;if(L=ZI(m,L),L!==null){Ka=n,e.cancelPendingCommit=L(mh.bind(null,e,t,n,a,l,o,u,r,s,h,m,null,f,p)),Cl(e,n,u,!i);return}}mh(e,t,n,a,l,o,u,r,s)}function mI(e){for(var t=e;;){var a=t.tag;if((a===0||a===11||a===15)&&t.flags&16384&&(a=t.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var l=0;l<a.length;l++){var o=a[l],n=o.getSnapshot;o=o.value;try{if(!Ht(n(),o))return!1}catch{return!1}}if(a=t.child,t.subtreeFlags&16384&&a!==null)a.return=t,t=a;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Cl(e,t,a,l){t&=~md,t&=~oo,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var o=t;0<o;){var n=31-_t(o),u=1<<n;l[n]=-1,o&=~u}a!==0&&Wh(e,a,t)}function Us(){return(oe&6)===0?(Yu(0,!1),!1):!0}function pd(){if($!==null){if(se===0)var e=$.return;else e=$,Xa=ho=null,$c(e),nn=null,Mu=0,e=$;for(;e!==null;)Ax(e.alternate,e),e=e.return;$=null}}function xn(e,t){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,DI(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),Ka=0,pd(),me=e,$=a=ja(e.current,null),ee=t,se=0,Mt=null,yl=!1,In=Nu(e,t),dd=!1,hn=Ot=md=oo=_l=ke=0,Ct=yu=null,dc=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var o=31-_t(l),n=1<<o;t|=e[o],l&=~n}return $a=t,ks(),a}function Kx(e,t){K=null,P.H=Eu,t===bn||t===Ds?(t=Vp(),se=3):t===jc?(t=Vp(),se=4):se=t===sd?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Mt=t,$===null&&(ke=1,fs(e,Wt(t,e.current)))}function Zx(){var e=zt.current;return e===null?!0:(ee&4194048)===ee?$t===null:(ee&62914560)===ee||(ee&536870912)!==0?e===$t:!1}function Qx(){var e=P.H;return P.H=Eu,e===null?Eu:e}function Wx(){var e=P.A;return P.A=cI,e}function hs(){ke=4,yl||(ee&4194048)!==ee&&zt.current!==null||(In=!0),(_l&134217727)===0&&(oo&134217727)===0||me===null||Cl(me,ee,Ot,!1)}function wf(e,t,a){var l=oe;oe|=2;var o=Qx(),n=Wx();(me!==e||ee!==t)&&(ps=null,xn(e,t)),t=!1;var u=ke;e:do try{if(se!==0&&$!==null){var r=$,s=Mt;switch(se){case 8:pd(),u=6;break e;case 3:case 2:case 9:case 6:zt.current===null&&(t=!0);var i=se;if(se=0,Mt=null,en(e,r,s,i),a&&In){u=0;break e}break;default:i=se,se=0,Mt=null,en(e,r,s,i)}}pI(),u=ke;break}catch(h){Kx(e,h)}while(!0);return t&&e.shellSuspendCounter++,Xa=ho=null,oe=l,P.H=o,P.A=n,$===null&&(me=null,ee=0,ks()),u}function pI(){for(;$!==null;)Jx($)}function hI(e,t){var a=oe;oe|=2;var l=Qx(),o=Wx();me!==e||ee!==t?(ps=null,ms=Bt()+500,xn(e,t)):In=Nu(e,t);e:do try{if(se!==0&&$!==null){t=$;var n=Mt;t:switch(se){case 1:se=0,Mt=null,en(e,t,n,1);break;case 2:case 9:if(Fp(n)){se=0,Mt=null,dh(t);break}t=function(){se!==2&&se!==9||me!==e||(se=7),ka(e)},n.then(t,t);break e;case 3:se=7;break e;case 4:se=5;break e;case 7:Fp(n)?(se=0,Mt=null,dh(t)):(se=0,Mt=null,en(e,t,n,7));break;case 5:var u=null;switch($.tag){case 26:u=$.memoizedState;case 5:case 27:var r=$;if(u?LL(u):r.stateNode.complete){se=0,Mt=null;var s=r.sibling;if(s!==null)$=s;else{var i=r.return;i!==null?($=i,Hs(i)):$=null}break t}}se=0,Mt=null,en(e,t,n,5);break;case 6:se=0,Mt=null,en(e,t,n,6);break;case 8:pd(),ke=6;break e;default:throw Error(w(462))}}gI();break}catch(h){Kx(e,h)}while(!0);return Xa=ho=null,P.H=l,P.A=o,oe=a,$!==null?0:(me=null,ee=0,ks(),ke)}function gI(){for(;$!==null&&!zC();)Jx($)}function Jx(e){var t=wx(e.alternate,e,$a);e.memoizedProps=e.pendingProps,t===null?Hs(e):$=t}function dh(e){var t=e,a=t.alternate;switch(t.tag){case 15:case 0:t=nh(a,t,t.pendingProps,t.type,void 0,ee);break;case 11:t=nh(a,t,t.pendingProps,t.type.render,t.ref,ee);break;case 5:$c(t);default:Ax(a,t),t=$=Ag(t,$a),t=wx(a,t,$a)}e.memoizedProps=e.pendingProps,t===null?Hs(e):$=t}function en(e,t,a,l){Xa=ho=null,$c(t),nn=null,Mu=0;var o=t.return;try{if(oI(e,o,t,a,ee)){ke=1,fs(e,Wt(a,e.current)),$=null;return}}catch(n){if(o!==null)throw $=o,n;ke=1,fs(e,Wt(a,e.current)),$=null;return}t.flags&32768?(te||l===1?e=!0:In||(ee&536870912)!==0?e=!1:(yl=e=!0,(l===2||l===9||l===3||l===6)&&(l=zt.current,l!==null&&l.tag===13&&(l.flags|=16384))),$x(t,e)):Hs(t)}function Hs(e){var t=e;do{if((t.flags&32768)!==0){$x(t,yl);return}e=t.return;var a=rI(t.alternate,t,$a);if(a!==null){$=a;return}if(t=t.sibling,t!==null){$=t;return}$=t=e}while(t!==null);ke===0&&(ke=5)}function $x(e,t){do{var a=sI(e.alternate,e);if(a!==null){a.flags&=32767,$=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!t&&(e=e.sibling,e!==null)){$=e;return}$=e=a}while(e!==null);ke=6,$=null}function mh(e,t,a,l,o,n,u,r,s){e.cancelPendingCommit=null;do zs();while(Fe!==0);if((oe&6)!==0)throw Error(w(327));if(t!==null){if(t===e.current)throw Error(w(177));if(n=t.lanes|t.childLanes,n|=zc,ZC(e,a,n,u,r,s),e===me&&($=me=null,ee=0),gn=t,kl=e,Ka=a,mc=n,pc=o,Xx=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,vI($r,function(){return oL(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=P.T,P.T=null,o=ne.p,ne.p=2,u=oe,oe|=4;try{iI(e,t,a)}finally{oe=u,ne.p=o,P.T=l}}Fe=1,eL(),tL(),aL()}}function eL(){if(Fe===1){Fe=0;var e=kl,t=gn,a=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||a){a=P.T,P.T=null;var l=ne.p;ne.p=2;var o=oe;oe|=4;try{Ux(t,e);var n=Sc,u=Lg(e.containerInfo),r=n.focusedElem,s=n.selectionRange;if(u!==r&&r&&r.ownerDocument&&xg(r.ownerDocument.documentElement,r)){if(s!==null&&Hc(r)){var i=s.start,h=s.end;if(h===void 0&&(h=i),"selectionStart"in r)r.selectionStart=i,r.selectionEnd=Math.min(h,r.value.length);else{var m=r.ownerDocument||document,f=m&&m.defaultView||window;if(f.getSelection){var p=f.getSelection(),L=r.textContent.length,S=Math.min(s.start,L),v=s.end===void 0?S:Math.min(s.end,L);!p.extend&&S>v&&(u=v,v=S,S=u);var g=Pp(r,S),d=Pp(r,v);if(g&&d&&(p.rangeCount!==1||p.anchorNode!==g.node||p.anchorOffset!==g.offset||p.focusNode!==d.node||p.focusOffset!==d.offset)){var c=m.createRange();c.setStart(g.node,g.offset),p.removeAllRanges(),S>v?(p.addRange(c),p.extend(d.node,d.offset)):(c.setEnd(d.node,d.offset),p.addRange(c))}}}}for(m=[],p=r;p=p.parentNode;)p.nodeType===1&&m.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<m.length;r++){var x=m[r];x.element.scrollLeft=x.left,x.element.scrollTop=x.top}}bs=!!Lc,Sc=Lc=null}finally{oe=o,ne.p=l,P.T=a}}e.current=t,Fe=2}}function tL(){if(Fe===2){Fe=0;var e=kl,t=gn,a=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||a){a=P.T,P.T=null;var l=ne.p;ne.p=2;var o=oe;oe|=4;try{Ex(e,t.alternate,t)}finally{oe=o,ne.p=l,P.T=a}}Fe=3}}function aL(){if(Fe===4||Fe===3){Fe=0,NC();var e=kl,t=gn,a=Ka,l=Xx;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?Fe=5:(Fe=0,gn=kl=null,lL(e,e.pendingLanes));var o=e.pendingLanes;if(o===0&&(Tl=null),Dc(a),t=t.stateNode,Pt&&typeof Pt.onCommitFiberRoot=="function")try{Pt.onCommitFiberRoot(zu,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=P.T,o=ne.p,ne.p=2,P.T=null;try{for(var n=e.onRecoverableError,u=0;u<l.length;u++){var r=l[u];n(r.value,{componentStack:r.stack})}}finally{P.T=t,ne.p=o}}(Ka&3)!==0&&zs(),ka(e),o=e.pendingLanes,(a&261930)!==0&&(o&42)!==0?e===hc?Cu++:(Cu=0,hc=e):Cu=0,Yu(0,!1)}}function lL(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Gu(t)))}function zs(){return eL(),tL(),aL(),oL()}function oL(){if(Fe!==5)return!1;var e=kl,t=mc;mc=0;var a=Dc(Ka),l=P.T,o=ne.p;try{ne.p=32>a?32:a,P.T=null,a=pc,pc=null;var n=kl,u=Ka;if(Fe=0,gn=kl=null,Ka=0,(oe&6)!==0)throw Error(w(331));var r=oe;if(oe|=4,Fx(n.current),zx(n,n.current,u,a),oe=r,Yu(0,!1),Pt&&typeof Pt.onPostCommitFiberRoot=="function")try{Pt.onPostCommitFiberRoot(zu,n)}catch{}return!0}finally{ne.p=o,P.T=l,lL(e,t)}}function ph(e,t,a){t=Wt(a,t),t=sc(e.stateNode,t,2),e=Rl(e,t,2),e!==null&&(qu(e,2),ka(e))}function ie(e,t,a){if(e.tag===3)ph(e,e,a);else for(;t!==null;){if(t.tag===3){ph(t,e,a);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Tl===null||!Tl.has(l))){e=Wt(a,e),a=Sx(2),l=Rl(t,a,2),l!==null&&(vx(a,l,t,e),qu(l,2),ka(l));break}}t=t.return}}function Af(e,t,a){var l=e.pingCache;if(l===null){l=e.pingCache=new dI;var o=new Set;l.set(t,o)}else o=l.get(t),o===void 0&&(o=new Set,l.set(t,o));o.has(a)||(dd=!0,o.add(a),e=xI.bind(null,e,t,a),t.then(e,e))}function xI(e,t,a){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,me===e&&(ee&a)===a&&(ke===4||ke===3&&(ee&62914560)===ee&&300>Bt()-_s?(oe&2)===0&&xn(e,0):md|=a,hn===ee&&(hn=0)),ka(e)}function nL(e,t){t===0&&(t=Qh()),e=po(e,t),e!==null&&(qu(e,t),ka(e))}function LI(e){var t=e.memoizedState,a=0;t!==null&&(a=t.retryLane),nL(e,a)}function SI(e,t){var a=0;switch(e.tag){case 31:case 13:var l=e.stateNode,o=e.memoizedState;o!==null&&(a=o.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(w(314))}l!==null&&l.delete(t),nL(e,a)}function vI(e,t){return kc(e,t)}var gs=null,Fo=null,gc=!1,xs=!1,Rf=!1,bl=0;function ka(e){e!==Fo&&e.next===null&&(Fo===null?gs=Fo=e:Fo=Fo.next=e),xs=!0,gc||(gc=!0,CI())}function Yu(e,t){if(!Rf&&xs){Rf=!0;do for(var a=!1,l=gs;l!==null;){if(!t)if(e!==0){var o=l.pendingLanes;if(o===0)var n=0;else{var u=l.suspendedLanes,r=l.pingedLanes;n=(1<<31-_t(42|e)+1)-1,n&=o&~(u&~r),n=n&201326741?n&201326741|1:n?n|2:0}n!==0&&(a=!0,hh(l,n))}else n=ee,n=ws(l,l===me?n:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(n&3)===0||Nu(l,n)||(a=!0,hh(l,n));l=l.next}while(a);Rf=!1}}function yI(){uL()}function uL(){xs=gc=!1;var e=0;bl!==0&&MI()&&(e=bl);for(var t=Bt(),a=null,l=gs;l!==null;){var o=l.next,n=rL(l,t);n===0?(l.next=null,a===null?gs=o:a.next=o,o===null&&(Fo=a)):(a=l,(e!==0||(n&3)!==0)&&(xs=!0)),l=o}Fe!==0&&Fe!==5||Yu(e,!1),bl!==0&&(bl=0)}function rL(e,t){for(var a=e.suspendedLanes,l=e.pingedLanes,o=e.expirationTimes,n=e.pendingLanes&-62914561;0<n;){var u=31-_t(n),r=1<<u,s=o[u];s===-1?((r&a)===0||(r&l)!==0)&&(o[u]=KC(r,t)):s<=t&&(e.expiredLanes|=r),n&=~r}if(t=me,a=ee,a=ws(e,e===t?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,a===0||e===t&&(se===2||se===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&tf(l),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Nu(e,a)){if(t=a&-a,t===e.callbackPriority)return t;switch(l!==null&&tf(l),Dc(a)){case 2:case 8:a=Kh;break;case 32:a=$r;break;case 268435456:a=Zh;break;default:a=$r}return l=sL.bind(null,e),a=kc(a,l),e.callbackPriority=t,e.callbackNode=a,t}return l!==null&&l!==null&&tf(l),e.callbackPriority=2,e.callbackNode=null,2}function sL(e,t){if(Fe!==0&&Fe!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(zs()&&e.callbackNode!==a)return null;var l=ee;return l=ws(e,e===me?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(Yx(e,l,t),rL(e,Bt()),e.callbackNode!=null&&e.callbackNode===a?sL.bind(null,e):null)}function hh(e,t){if(zs())return null;Yx(e,t,!0)}function CI(){EI(function(){(oe&6)!==0?kc(Yh,yI):uL()})}function hd(){if(bl===0){var e=dn;e===0&&(e=Lr,Lr<<=1,(Lr&261888)===0&&(Lr=256)),bl=e}return bl}function gh(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:_r(""+e)}function xh(e,t){var a=t.ownerDocument.createElement("input");return a.name=t.name,a.value=t.value,e.id&&a.setAttribute("form",e.id),t.parentNode.insertBefore(a,t),e=new FormData(e),a.parentNode.removeChild(a),e}function bI(e,t,a,l,o){if(t==="submit"&&a&&a.stateNode===o){var n=gh((o[It]||null).action),u=l.submitter;u&&(t=(t=u[It]||null)?gh(t.formAction):u.getAttribute("formAction"),t!==null&&(n=t,u=null));var r=new As("action","action",null,l,o);e.push({event:r,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(bl!==0){var s=u?xh(o,u):new FormData(o);uc(a,{pending:!0,data:s,method:o.method,action:n},null,s)}}else typeof n=="function"&&(r.preventDefault(),s=u?xh(o,u):new FormData(o),uc(a,{pending:!0,data:s,method:o.method,action:n},n,s))},currentTarget:o}]})}}for(Mr=0;Mr<Kf.length;Mr++)Dr=Kf[Mr],Lh=Dr.toLowerCase(),Sh=Dr[0].toUpperCase()+Dr.slice(1),sa(Lh,"on"+Sh);var Dr,Lh,Sh,Mr;sa(vg,"onAnimationEnd");sa(yg,"onAnimationIteration");sa(Cg,"onAnimationStart");sa("dblclick","onDoubleClick");sa("focusin","onFocus");sa("focusout","onBlur");sa(qb,"onTransitionRun");sa(Fb,"onTransitionStart");sa(Vb,"onTransitionCancel");sa(bg,"onTransitionEnd");fn("onMouseEnter",["mouseout","mouseover"]);fn("onMouseLeave",["mouseout","mouseover"]);fn("onPointerEnter",["pointerout","pointerover"]);fn("onPointerLeave",["pointerout","pointerover"]);fo("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));fo("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));fo("onBeforeInput",["compositionend","keypress","textInput","paste"]);fo("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));fo("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));fo("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ou="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),II=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ou));function iL(e,t){t=(t&4)!==0;for(var a=0;a<e.length;a++){var l=e[a],o=l.event;l=l.listeners;e:{var n=void 0;if(t)for(var u=l.length-1;0<=u;u--){var r=l[u],s=r.instance,i=r.currentTarget;if(r=r.listener,s!==n&&o.isPropagationStopped())break e;n=r,o.currentTarget=i;try{n(o)}catch(h){ts(h)}o.currentTarget=null,n=s}else for(u=0;u<l.length;u++){if(r=l[u],s=r.instance,i=r.currentTarget,r=r.listener,s!==n&&o.isPropagationStopped())break e;n=r,o.currentTarget=i;try{n(o)}catch(h){ts(h)}o.currentTarget=null,n=s}}}}function J(e,t){var a=t[Nf];a===void 0&&(a=t[Nf]=new Set);var l=e+"__bubble";a.has(l)||(fL(t,e,2,!1),a.add(l))}function Tf(e,t,a){var l=0;t&&(l|=4),fL(a,e,l,t)}var Er="_reactListening"+Math.random().toString(36).slice(2);function gd(e){if(!e[Er]){e[Er]=!0,tg.forEach(function(a){a!=="selectionchange"&&(II.has(a)||Tf(a,!1,e),Tf(a,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Er]||(t[Er]=!0,Tf("selectionchange",!1,t))}}function fL(e,t,a,l){switch(bL(t)){case 2:var o=JI;break;case 8:o=$I;break;default:o=vd}a=o.bind(null,t,a,e),o=void 0,!Xf||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),l?o!==void 0?e.addEventListener(t,a,{capture:!0,passive:o}):e.addEventListener(t,a,!0):o!==void 0?e.addEventListener(t,a,{passive:o}):e.addEventListener(t,a,!1)}function kf(e,t,a,l,o){var n=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var u=l.tag;if(u===3||u===4){var r=l.stateNode.containerInfo;if(r===o)break;if(u===4)for(u=l.return;u!==null;){var s=u.tag;if((s===3||s===4)&&u.stateNode.containerInfo===o)return;u=u.return}for(;r!==null;){if(u=Xo(r),u===null)return;if(s=u.tag,s===5||s===6||s===26||s===27){l=n=u;continue e}r=r.parentNode}}l=l.return}ig(function(){var i=n,h=Bc(a),m=[];e:{var f=Ig.get(e);if(f!==void 0){var p=As,L=e;switch(e){case"keypress":if(Hr(a)===0)break e;case"keydown":case"keyup":p=Sb;break;case"focusin":L="focus",p=uf;break;case"focusout":L="blur",p=uf;break;case"beforeblur":case"afterblur":p=uf;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Ap;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=rb;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Cb;break;case vg:case yg:case Cg:p=fb;break;case bg:p=Ib;break;case"scroll":case"scrollend":p=nb;break;case"wheel":p=Ab;break;case"copy":case"cut":case"paste":p=db;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Tp;break;case"toggle":case"beforetoggle":p=Tb}var S=(t&4)!==0,v=!S&&(e==="scroll"||e==="scrollend"),g=S?f!==null?f+"Capture":null:f;S=[];for(var d=i,c;d!==null;){var x=d;if(c=x.stateNode,x=x.tag,x!==5&&x!==26&&x!==27||c===null||g===null||(x=wu(d,g),x!=null&&S.push(Bu(d,x,c))),v)break;d=d.return}0<S.length&&(f=new p(f,L,null,a,h),m.push({event:f,listeners:S}))}}if((t&7)===0){e:{if(f=e==="mouseover"||e==="pointerover",p=e==="mouseout"||e==="pointerout",f&&a!==Gf&&(L=a.relatedTarget||a.fromElement)&&(Xo(L)||L[vn]))break e;if((p||f)&&(f=h.window===h?h:(f=h.ownerDocument)?f.defaultView||f.parentWindow:window,p?(L=a.relatedTarget||a.toElement,p=i,L=L?Xo(L):null,L!==null&&(v=Hu(L),S=L.tag,L!==v||S!==5&&S!==27&&S!==6)&&(L=null)):(p=null,L=i),p!==L)){if(S=Ap,x="onMouseLeave",g="onMouseEnter",d="mouse",(e==="pointerout"||e==="pointerover")&&(S=Tp,x="onPointerLeave",g="onPointerEnter",d="pointer"),v=p==null?f:su(p),c=L==null?f:su(L),f=new S(x,d+"leave",p,a,h),f.target=v,f.relatedTarget=c,x=null,Xo(h)===i&&(S=new S(g,d+"enter",L,a,h),S.target=c,S.relatedTarget=v,x=S),v=x,p&&L)t:{for(S=wI,g=p,d=L,c=0,x=g;x;x=S(x))c++;x=0;for(var y=d;y;y=S(y))x++;for(;0<c-x;)g=S(g),c--;for(;0<x-c;)d=S(d),x--;for(;c--;){if(g===d||d!==null&&g===d.alternate){S=g;break t}g=S(g),d=S(d)}S=null}else S=null;p!==null&&vh(m,f,p,S,!1),L!==null&&v!==null&&vh(m,v,L,S,!0)}}e:{if(f=i?su(i):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var I=Ep;else if(Dp(f))if(hg)I=Hb;else{I=_b;var b=Pb}else p=f.nodeName,!p||p.toLowerCase()!=="input"||f.type!=="checkbox"&&f.type!=="radio"?i&&Oc(i.elementType)&&(I=Ep):I=Ub;if(I&&(I=I(e,i))){pg(m,I,a,h);break e}b&&b(e,f,i),e==="focusout"&&i&&f.type==="number"&&i.memoizedProps.value!=null&&Vf(f,"number",f.value)}switch(b=i?su(i):window,e){case"focusin":(Dp(b)||b.contentEditable==="true")&&(Ko=b,jf=i,mu=null);break;case"focusout":mu=jf=Ko=null;break;case"mousedown":Yf=!0;break;case"contextmenu":case"mouseup":case"dragend":Yf=!1,_p(m,a,h);break;case"selectionchange":if(Nb)break;case"keydown":case"keyup":_p(m,a,h)}var C;if(Uc)e:{switch(e){case"compositionstart":var A="onCompositionStart";break e;case"compositionend":A="onCompositionEnd";break e;case"compositionupdate":A="onCompositionUpdate";break e}A=void 0}else Yo?dg(e,a)&&(A="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(A="onCompositionStart");A&&(cg&&a.locale!=="ko"&&(Yo||A!=="onCompositionStart"?A==="onCompositionEnd"&&Yo&&(C=fg()):(vl=h,Pc="value"in vl?vl.value:vl.textContent,Yo=!0)),b=Ls(i,A),0<b.length&&(A=new Rp(A,e,null,a,h),m.push({event:A,listeners:b}),C?A.data=C:(C=mg(a),C!==null&&(A.data=C)))),(C=Mb?Db(e,a):Eb(e,a))&&(A=Ls(i,"onBeforeInput"),0<A.length&&(b=new Rp("onBeforeInput","beforeinput",null,a,h),m.push({event:b,listeners:A}),b.data=C)),bI(m,e,i,a,h)}iL(m,t)})}function Bu(e,t,a){return{instance:e,listener:t,currentTarget:a}}function Ls(e,t){for(var a=t+"Capture",l=[];e!==null;){var o=e,n=o.stateNode;if(o=o.tag,o!==5&&o!==26&&o!==27||n===null||(o=wu(e,a),o!=null&&l.unshift(Bu(e,o,n)),o=wu(e,t),o!=null&&l.push(Bu(e,o,n))),e.tag===3)return l;e=e.return}return[]}function wI(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function vh(e,t,a,l,o){for(var n=t._reactName,u=[];a!==null&&a!==l;){var r=a,s=r.alternate,i=r.stateNode;if(r=r.tag,s!==null&&s===l)break;r!==5&&r!==26&&r!==27||i===null||(s=i,o?(i=wu(a,n),i!=null&&u.unshift(Bu(a,i,s))):o||(i=wu(a,n),i!=null&&u.push(Bu(a,i,s)))),a=a.return}u.length!==0&&e.push({event:t,listeners:u})}var AI=/\r\n?/g,RI=/\u0000|\uFFFD/g;function yh(e){return(typeof e=="string"?e:""+e).replace(AI,`
`).replace(RI,"")}function cL(e,t){return t=yh(t),yh(e)===t}function fe(e,t,a,l,o,n){switch(a){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||cn(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&cn(e,""+l);break;case"className":yr(e,"class",l);break;case"tabIndex":yr(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":yr(e,a,l);break;case"style":sg(e,l,n);break;case"data":if(t!=="object"){yr(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||a!=="href")){e.removeAttribute(a);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=_r(""+l),e.setAttribute(a,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof n=="function"&&(a==="formAction"?(t!=="input"&&fe(e,t,"name",o.name,o,null),fe(e,t,"formEncType",o.formEncType,o,null),fe(e,t,"formMethod",o.formMethod,o,null),fe(e,t,"formTarget",o.formTarget,o,null)):(fe(e,t,"encType",o.encType,o,null),fe(e,t,"method",o.method,o,null),fe(e,t,"target",o.target,o,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=_r(""+l),e.setAttribute(a,l);break;case"onClick":l!=null&&(e.onclick=Ga);break;case"onScroll":l!=null&&J("scroll",e);break;case"onScrollEnd":l!=null&&J("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(w(61));if(a=l.__html,a!=null){if(o.children!=null)throw Error(w(60));e.innerHTML=a}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}a=_r(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""+l):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":l===!0?e.setAttribute(a,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,l):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(a,l):e.removeAttribute(a);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(a):e.setAttribute(a,l);break;case"popover":J("beforetoggle",e),J("toggle",e),Pr(e,"popover",l);break;case"xlinkActuate":_a(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":_a(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":_a(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":_a(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":_a(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":_a(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":_a(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":_a(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":_a(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Pr(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=lb.get(a)||a,Pr(e,a,l))}}function xc(e,t,a,l,o,n){switch(a){case"style":sg(e,l,n);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(w(61));if(a=l.__html,a!=null){if(o.children!=null)throw Error(w(60));e.innerHTML=a}}break;case"children":typeof l=="string"?cn(e,l):(typeof l=="number"||typeof l=="bigint")&&cn(e,""+l);break;case"onScroll":l!=null&&J("scroll",e);break;case"onScrollEnd":l!=null&&J("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Ga);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!ag.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(o=a.endsWith("Capture"),t=a.slice(2,o?a.length-7:void 0),n=e[It]||null,n=n!=null?n[a]:null,typeof n=="function"&&e.removeEventListener(t,n,o),typeof l=="function")){typeof n!="function"&&n!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(t,l,o);break e}a in e?e[a]=l:l===!0?e.setAttribute(a,""):Pr(e,a,l)}}}function at(e,t,a){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":J("error",e),J("load",e);var l=!1,o=!1,n;for(n in a)if(a.hasOwnProperty(n)){var u=a[n];if(u!=null)switch(n){case"src":l=!0;break;case"srcSet":o=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(w(137,t));default:fe(e,t,n,u,a,null)}}o&&fe(e,t,"srcSet",a.srcSet,a,null),l&&fe(e,t,"src",a.src,a,null);return;case"input":J("invalid",e);var r=n=u=o=null,s=null,i=null;for(l in a)if(a.hasOwnProperty(l)){var h=a[l];if(h!=null)switch(l){case"name":o=h;break;case"type":u=h;break;case"checked":s=h;break;case"defaultChecked":i=h;break;case"value":n=h;break;case"defaultValue":r=h;break;case"children":case"dangerouslySetInnerHTML":if(h!=null)throw Error(w(137,t));break;default:fe(e,t,l,h,a,null)}}ng(e,n,r,s,i,u,o,!1);return;case"select":J("invalid",e),l=u=n=null;for(o in a)if(a.hasOwnProperty(o)&&(r=a[o],r!=null))switch(o){case"value":n=r;break;case"defaultValue":u=r;break;case"multiple":l=r;default:fe(e,t,o,r,a,null)}t=n,a=u,e.multiple=!!l,t!=null?an(e,!!l,t,!1):a!=null&&an(e,!!l,a,!0);return;case"textarea":J("invalid",e),n=o=l=null;for(u in a)if(a.hasOwnProperty(u)&&(r=a[u],r!=null))switch(u){case"value":l=r;break;case"defaultValue":o=r;break;case"children":n=r;break;case"dangerouslySetInnerHTML":if(r!=null)throw Error(w(91));break;default:fe(e,t,u,r,a,null)}rg(e,l,o,n);return;case"option":for(s in a)a.hasOwnProperty(s)&&(l=a[s],l!=null)&&(s==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":fe(e,t,s,l,a,null));return;case"dialog":J("beforetoggle",e),J("toggle",e),J("cancel",e),J("close",e);break;case"iframe":case"object":J("load",e);break;case"video":case"audio":for(l=0;l<Ou.length;l++)J(Ou[l],e);break;case"image":J("error",e),J("load",e);break;case"details":J("toggle",e);break;case"embed":case"source":case"link":J("error",e),J("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(i in a)if(a.hasOwnProperty(i)&&(l=a[i],l!=null))switch(i){case"children":case"dangerouslySetInnerHTML":throw Error(w(137,t));default:fe(e,t,i,l,a,null)}return;default:if(Oc(t)){for(h in a)a.hasOwnProperty(h)&&(l=a[h],l!==void 0&&xc(e,t,h,l,a,void 0));return}}for(r in a)a.hasOwnProperty(r)&&(l=a[r],l!=null&&fe(e,t,r,l,a,null))}function TI(e,t,a,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var o=null,n=null,u=null,r=null,s=null,i=null,h=null;for(p in a){var m=a[p];if(a.hasOwnProperty(p)&&m!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":s=m;default:l.hasOwnProperty(p)||fe(e,t,p,null,l,m)}}for(var f in l){var p=l[f];if(m=a[f],l.hasOwnProperty(f)&&(p!=null||m!=null))switch(f){case"type":n=p;break;case"name":o=p;break;case"checked":i=p;break;case"defaultChecked":h=p;break;case"value":u=p;break;case"defaultValue":r=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(w(137,t));break;default:p!==m&&fe(e,t,f,p,l,m)}}Ff(e,u,r,s,i,h,n,o);return;case"select":p=u=r=f=null;for(n in a)if(s=a[n],a.hasOwnProperty(n)&&s!=null)switch(n){case"value":break;case"multiple":p=s;default:l.hasOwnProperty(n)||fe(e,t,n,null,l,s)}for(o in l)if(n=l[o],s=a[o],l.hasOwnProperty(o)&&(n!=null||s!=null))switch(o){case"value":f=n;break;case"defaultValue":r=n;break;case"multiple":u=n;default:n!==s&&fe(e,t,o,n,l,s)}t=r,a=u,l=p,f!=null?an(e,!!a,f,!1):!!l!=!!a&&(t!=null?an(e,!!a,t,!0):an(e,!!a,a?[]:"",!1));return;case"textarea":p=f=null;for(r in a)if(o=a[r],a.hasOwnProperty(r)&&o!=null&&!l.hasOwnProperty(r))switch(r){case"value":break;case"children":break;default:fe(e,t,r,null,l,o)}for(u in l)if(o=l[u],n=a[u],l.hasOwnProperty(u)&&(o!=null||n!=null))switch(u){case"value":f=o;break;case"defaultValue":p=o;break;case"children":break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(w(91));break;default:o!==n&&fe(e,t,u,o,l,n)}ug(e,f,p);return;case"option":for(var L in a)f=a[L],a.hasOwnProperty(L)&&f!=null&&!l.hasOwnProperty(L)&&(L==="selected"?e.selected=!1:fe(e,t,L,null,l,f));for(s in l)f=l[s],p=a[s],l.hasOwnProperty(s)&&f!==p&&(f!=null||p!=null)&&(s==="selected"?e.selected=f&&typeof f!="function"&&typeof f!="symbol":fe(e,t,s,f,l,p));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var S in a)f=a[S],a.hasOwnProperty(S)&&f!=null&&!l.hasOwnProperty(S)&&fe(e,t,S,null,l,f);for(i in l)if(f=l[i],p=a[i],l.hasOwnProperty(i)&&f!==p&&(f!=null||p!=null))switch(i){case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(w(137,t));break;default:fe(e,t,i,f,l,p)}return;default:if(Oc(t)){for(var v in a)f=a[v],a.hasOwnProperty(v)&&f!==void 0&&!l.hasOwnProperty(v)&&xc(e,t,v,void 0,l,f);for(h in l)f=l[h],p=a[h],!l.hasOwnProperty(h)||f===p||f===void 0&&p===void 0||xc(e,t,h,f,l,p);return}}for(var g in a)f=a[g],a.hasOwnProperty(g)&&f!=null&&!l.hasOwnProperty(g)&&fe(e,t,g,null,l,f);for(m in l)f=l[m],p=a[m],!l.hasOwnProperty(m)||f===p||f==null&&p==null||fe(e,t,m,f,l,p)}function Ch(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function kI(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,a=performance.getEntriesByType("resource"),l=0;l<a.length;l++){var o=a[l],n=o.transferSize,u=o.initiatorType,r=o.duration;if(n&&r&&Ch(u)){for(u=0,r=o.responseEnd,l+=1;l<a.length;l++){var s=a[l],i=s.startTime;if(i>r)break;var h=s.transferSize,m=s.initiatorType;h&&Ch(m)&&(s=s.responseEnd,u+=h*(s<r?1:(r-i)/(s-i)))}if(--l,t+=8*(n+u)/(o.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Lc=null,Sc=null;function Ss(e){return e.nodeType===9?e:e.ownerDocument}function bh(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function dL(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function vc(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Mf=null;function MI(){var e=window.event;return e&&e.type==="popstate"?e===Mf?!1:(Mf=e,!0):(Mf=null,!1)}var mL=typeof setTimeout=="function"?setTimeout:void 0,DI=typeof clearTimeout=="function"?clearTimeout:void 0,Ih=typeof Promise=="function"?Promise:void 0,EI=typeof queueMicrotask=="function"?queueMicrotask:typeof Ih<"u"?function(e){return Ih.resolve(null).then(e).catch(OI)}:mL;function OI(e){setTimeout(function(){throw e})}function Hl(e){return e==="head"}function wh(e,t){var a=t,l=0;do{var o=a.nextSibling;if(e.removeChild(a),o&&o.nodeType===8)if(a=o.data,a==="/$"||a==="/&"){if(l===0){e.removeChild(o),Sn(t);return}l--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")l++;else if(a==="html")bu(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,bu(a);for(var n=a.firstChild;n;){var u=n.nextSibling,r=n.nodeName;n[Fu]||r==="SCRIPT"||r==="STYLE"||r==="LINK"&&n.rel.toLowerCase()==="stylesheet"||a.removeChild(n),n=u}}else a==="body"&&bu(e.ownerDocument.body);a=o}while(a);Sn(t)}function Ah(e,t){var a=e;e=0;do{var l=a.nextSibling;if(a.nodeType===1?t?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(t?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),l&&l.nodeType===8)if(a=l.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=l}while(a)}function yc(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var a=t;switch(t=t.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":yc(a),Ec(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function BI(e,t,a,l){for(;e.nodeType===1;){var o=a;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Fu])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(n=e.getAttribute("rel"),n==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(n!==o.rel||e.getAttribute("href")!==(o.href==null||o.href===""?null:o.href)||e.getAttribute("crossorigin")!==(o.crossOrigin==null?null:o.crossOrigin)||e.getAttribute("title")!==(o.title==null?null:o.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(n=e.getAttribute("src"),(n!==(o.src==null?null:o.src)||e.getAttribute("type")!==(o.type==null?null:o.type)||e.getAttribute("crossorigin")!==(o.crossOrigin==null?null:o.crossOrigin))&&n&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var n=o.name==null?null:""+o.name;if(o.type==="hidden"&&e.getAttribute("name")===n)return e}else return e;if(e=ea(e.nextSibling),e===null)break}return null}function PI(e,t,a){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=ea(e.nextSibling),e===null))return null;return e}function pL(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=ea(e.nextSibling),e===null))return null;return e}function Cc(e){return e.data==="$?"||e.data==="$~"}function bc(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function _I(e,t){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||a.readyState!=="loading")t();else{var l=function(){t(),a.removeEventListener("DOMContentLoaded",l)};a.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function ea(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Ic=null;function Rh(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(t===0)return ea(e.nextSibling);t--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||t++}e=e.nextSibling}return null}function Th(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(t===0)return e;t--}else a!=="/$"&&a!=="/&"||t++}e=e.previousSibling}return null}function hL(e,t,a){switch(t=Ss(a),e){case"html":if(e=t.documentElement,!e)throw Error(w(452));return e;case"head":if(e=t.head,!e)throw Error(w(453));return e;case"body":if(e=t.body,!e)throw Error(w(454));return e;default:throw Error(w(451))}}function bu(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Ec(e)}var ta=new Map,kh=new Set;function vs(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var el=ne.d;ne.d={f:UI,r:HI,D:zI,C:NI,L:qI,m:FI,X:GI,S:VI,M:XI};function UI(){var e=el.f(),t=Us();return e||t}function HI(e){var t=yn(e);t!==null&&t.tag===5&&t.type==="form"?sx(t):el.r(e)}var wn=typeof document>"u"?null:document;function gL(e,t,a){var l=wn;if(l&&typeof t=="string"&&t){var o=Qt(t);o='link[rel="'+e+'"][href="'+o+'"]',typeof a=="string"&&(o+='[crossorigin="'+a+'"]'),kh.has(o)||(kh.add(o),e={rel:e,crossOrigin:a,href:t},l.querySelector(o)===null&&(t=l.createElement("link"),at(t,"link",e),Ke(t),l.head.appendChild(t)))}}function zI(e){el.D(e),gL("dns-prefetch",e,null)}function NI(e,t){el.C(e,t),gL("preconnect",e,t)}function qI(e,t,a){el.L(e,t,a);var l=wn;if(l&&e&&t){var o='link[rel="preload"][as="'+Qt(t)+'"]';t==="image"&&a&&a.imageSrcSet?(o+='[imagesrcset="'+Qt(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(o+='[imagesizes="'+Qt(a.imageSizes)+'"]')):o+='[href="'+Qt(e)+'"]';var n=o;switch(t){case"style":n=Ln(e);break;case"script":n=An(e)}ta.has(n)||(e=ye({rel:"preload",href:t==="image"&&a&&a.imageSrcSet?void 0:e,as:t},a),ta.set(n,e),l.querySelector(o)!==null||t==="style"&&l.querySelector(Ku(n))||t==="script"&&l.querySelector(Zu(n))||(t=l.createElement("link"),at(t,"link",e),Ke(t),l.head.appendChild(t)))}}function FI(e,t){el.m(e,t);var a=wn;if(a&&e){var l=t&&typeof t.as=="string"?t.as:"script",o='link[rel="modulepreload"][as="'+Qt(l)+'"][href="'+Qt(e)+'"]',n=o;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":n=An(e)}if(!ta.has(n)&&(e=ye({rel:"modulepreload",href:e},t),ta.set(n,e),a.querySelector(o)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Zu(n)))return}l=a.createElement("link"),at(l,"link",e),Ke(l),a.head.appendChild(l)}}}function VI(e,t,a){el.S(e,t,a);var l=wn;if(l&&e){var o=tn(l).hoistableStyles,n=Ln(e);t=t||"default";var u=o.get(n);if(!u){var r={loading:0,preload:null};if(u=l.querySelector(Ku(n)))r.loading=5;else{e=ye({rel:"stylesheet",href:e,"data-precedence":t},a),(a=ta.get(n))&&xd(e,a);var s=u=l.createElement("link");Ke(s),at(s,"link",e),s._p=new Promise(function(i,h){s.onload=i,s.onerror=h}),s.addEventListener("load",function(){r.loading|=1}),s.addEventListener("error",function(){r.loading|=2}),r.loading|=4,jr(u,t,l)}u={type:"stylesheet",instance:u,count:1,state:r},o.set(n,u)}}}function GI(e,t){el.X(e,t);var a=wn;if(a&&e){var l=tn(a).hoistableScripts,o=An(e),n=l.get(o);n||(n=a.querySelector(Zu(o)),n||(e=ye({src:e,async:!0},t),(t=ta.get(o))&&Ld(e,t),n=a.createElement("script"),Ke(n),at(n,"link",e),a.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},l.set(o,n))}}function XI(e,t){el.M(e,t);var a=wn;if(a&&e){var l=tn(a).hoistableScripts,o=An(e),n=l.get(o);n||(n=a.querySelector(Zu(o)),n||(e=ye({src:e,async:!0,type:"module"},t),(t=ta.get(o))&&Ld(e,t),n=a.createElement("script"),Ke(n),at(n,"link",e),a.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},l.set(o,n))}}function Mh(e,t,a,l){var o=(o=Il.current)?vs(o):null;if(!o)throw Error(w(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(t=Ln(a.href),a=tn(o).hoistableStyles,l=a.get(t),l||(l={type:"style",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=Ln(a.href);var n=tn(o).hoistableStyles,u=n.get(e);if(u||(o=o.ownerDocument||o,u={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},n.set(e,u),(n=o.querySelector(Ku(e)))&&!n._p&&(u.instance=n,u.state.loading=5),ta.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},ta.set(e,a),n||jI(o,e,a,u.state))),t&&l===null)throw Error(w(528,""));return u}if(t&&l!==null)throw Error(w(529,""));return null;case"script":return t=a.async,a=a.src,typeof a=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=An(a),a=tn(o).hoistableScripts,l=a.get(t),l||(l={type:"script",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(w(444,e))}}function Ln(e){return'href="'+Qt(e)+'"'}function Ku(e){return'link[rel="stylesheet"]['+e+"]"}function xL(e){return ye({},e,{"data-precedence":e.precedence,precedence:null})}function jI(e,t,a,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),at(t,"link",a),Ke(t),e.head.appendChild(t))}function An(e){return'[src="'+Qt(e)+'"]'}function Zu(e){return"script[async]"+e}function Dh(e,t,a){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+Qt(a.href)+'"]');if(l)return t.instance=l,Ke(l),l;var o=ye({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),Ke(l),at(l,"style",o),jr(l,a.precedence,e),t.instance=l;case"stylesheet":o=Ln(a.href);var n=e.querySelector(Ku(o));if(n)return t.state.loading|=4,t.instance=n,Ke(n),n;l=xL(a),(o=ta.get(o))&&xd(l,o),n=(e.ownerDocument||e).createElement("link"),Ke(n);var u=n;return u._p=new Promise(function(r,s){u.onload=r,u.onerror=s}),at(n,"link",l),t.state.loading|=4,jr(n,a.precedence,e),t.instance=n;case"script":return n=An(a.src),(o=e.querySelector(Zu(n)))?(t.instance=o,Ke(o),o):(l=a,(o=ta.get(n))&&(l=ye({},a),Ld(l,o)),e=e.ownerDocument||e,o=e.createElement("script"),Ke(o),at(o,"link",l),e.head.appendChild(o),t.instance=o);case"void":return null;default:throw Error(w(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,jr(l,a.precedence,e));return t.instance}function jr(e,t,a){for(var l=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),o=l.length?l[l.length-1]:null,n=o,u=0;u<l.length;u++){var r=l[u];if(r.dataset.precedence===t)n=r;else if(n!==o)break}n?n.parentNode.insertBefore(e,n.nextSibling):(t=a.nodeType===9?a.head:a,t.insertBefore(e,t.firstChild))}function xd(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Ld(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Yr=null;function Eh(e,t,a){if(Yr===null){var l=new Map,o=Yr=new Map;o.set(a,l)}else o=Yr,l=o.get(a),l||(l=new Map,o.set(a,l));if(l.has(e))return l;for(l.set(e,null),a=a.getElementsByTagName(e),o=0;o<a.length;o++){var n=a[o];if(!(n[Fu]||n[$e]||e==="link"&&n.getAttribute("rel")==="stylesheet")&&n.namespaceURI!=="http://www.w3.org/2000/svg"){var u=n.getAttribute(t)||"";u=e+u;var r=l.get(u);r?r.push(n):l.set(u,[n])}}return l}function Oh(e,t,a){e=e.ownerDocument||e,e.head.insertBefore(a,t==="title"?e.querySelector("head > title"):null)}function YI(e,t,a){if(a===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function LL(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function KI(e,t,a,l){if(a.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var o=Ln(l.href),n=t.querySelector(Ku(o));if(n){t=n._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=ys.bind(e),t.then(e,e)),a.state.loading|=4,a.instance=n,Ke(n);return}n=t.ownerDocument||t,l=xL(l),(o=ta.get(o))&&xd(l,o),n=n.createElement("link"),Ke(n);var u=n;u._p=new Promise(function(r,s){u.onload=r,u.onerror=s}),at(n,"link",l),a.instance=n}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,t),(t=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=ys.bind(e),t.addEventListener("load",a),t.addEventListener("error",a))}}var Df=0;function ZI(e,t){return e.stylesheets&&e.count===0&&Kr(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var l=setTimeout(function(){if(e.stylesheets&&Kr(e,e.stylesheets),e.unsuspend){var n=e.unsuspend;e.unsuspend=null,n()}},6e4+t);0<e.imgBytes&&Df===0&&(Df=62500*kI());var o=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Kr(e,e.stylesheets),e.unsuspend)){var n=e.unsuspend;e.unsuspend=null,n()}},(e.imgBytes>Df?50:800)+t);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(o)}}:null}function ys(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Kr(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Cs=null;function Kr(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Cs=new Map,t.forEach(QI,e),Cs=null,ys.call(e))}function QI(e,t){if(!(t.state.loading&4)){var a=Cs.get(e);if(a)var l=a.get(null);else{a=new Map,Cs.set(e,a);for(var o=e.querySelectorAll("link[data-precedence],style[data-precedence]"),n=0;n<o.length;n++){var u=o[n];(u.nodeName==="LINK"||u.getAttribute("media")!=="not all")&&(a.set(u.dataset.precedence,u),l=u)}l&&a.set(null,l)}o=t.instance,u=o.getAttribute("data-precedence"),n=a.get(u)||l,n===l&&a.set(null,o),a.set(u,o),this.count++,l=ys.bind(this),o.addEventListener("load",l),o.addEventListener("error",l),n?n.parentNode.insertBefore(o,n.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(o,e.firstChild)),t.state.loading|=4}}var Pu={$$typeof:Va,Provider:null,Consumer:null,_currentValue:eo,_currentValue2:eo,_threadCount:0};function WI(e,t,a,l,o,n,u,r,s){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=af(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=af(0),this.hiddenUpdates=af(null),this.identifierPrefix=l,this.onUncaughtError=o,this.onCaughtError=n,this.onRecoverableError=u,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=s,this.incompleteTransitions=new Map}function SL(e,t,a,l,o,n,u,r,s,i,h,m){return e=new WI(e,t,a,u,s,i,h,m,r),t=1,n===!0&&(t|=24),n=Et(3,null,null,t),e.current=n,n.stateNode=e,t=Gc(),t.refCount++,e.pooledCache=t,t.refCount++,n.memoizedState={element:l,isDehydrated:a,cache:t},Yc(n),e}function vL(e){return e?(e=Wo,e):Wo}function yL(e,t,a,l,o,n){o=vL(o),l.context===null?l.context=o:l.pendingContext=o,l=Al(t),l.payload={element:a},n=n===void 0?null:n,n!==null&&(l.callback=n),a=Rl(e,l,t),a!==null&&(bt(a,e,t),hu(a,e,t))}function Bh(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<t?a:t}}function Sd(e,t){Bh(e,t),(e=e.alternate)&&Bh(e,t)}function CL(e){if(e.tag===13||e.tag===31){var t=po(e,67108864);t!==null&&bt(t,e,67108864),Sd(e,67108864)}}function Ph(e){if(e.tag===13||e.tag===31){var t=Ut();t=Mc(t);var a=po(e,t);a!==null&&bt(a,e,t),Sd(e,t)}}var bs=!0;function JI(e,t,a,l){var o=P.T;P.T=null;var n=ne.p;try{ne.p=2,vd(e,t,a,l)}finally{ne.p=n,P.T=o}}function $I(e,t,a,l){var o=P.T;P.T=null;var n=ne.p;try{ne.p=8,vd(e,t,a,l)}finally{ne.p=n,P.T=o}}function vd(e,t,a,l){if(bs){var o=wc(l);if(o===null)kf(e,t,l,Is,a),_h(e,l);else if(t0(o,e,t,a,l))l.stopPropagation();else if(_h(e,l),t&4&&-1<e0.indexOf(e)){for(;o!==null;){var n=yn(o);if(n!==null)switch(n.tag){case 3:if(n=n.stateNode,n.current.memoizedState.isDehydrated){var u=Wl(n.pendingLanes);if(u!==0){var r=n;for(r.pendingLanes|=2,r.entangledLanes|=2;u;){var s=1<<31-_t(u);r.entanglements[1]|=s,u&=~s}ka(n),(oe&6)===0&&(ms=Bt()+500,Yu(0,!1))}}break;case 31:case 13:r=po(n,2),r!==null&&bt(r,n,2),Us(),Sd(n,2)}if(n=wc(l),n===null&&kf(e,t,l,Is,a),n===o)break;o=n}o!==null&&l.stopPropagation()}else kf(e,t,l,null,a)}}function wc(e){return e=Bc(e),yd(e)}var Is=null;function yd(e){if(Is=null,e=Xo(e),e!==null){var t=Hu(e);if(t===null)e=null;else{var a=t.tag;if(a===13){if(e=Fh(t),e!==null)return e;e=null}else if(a===31){if(e=Vh(t),e!==null)return e;e=null}else if(a===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Is=e,null}function bL(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(qC()){case Yh:return 2;case Kh:return 8;case $r:case FC:return 32;case Zh:return 268435456;default:return 32}default:return 32}}var Ac=!1,Ml=null,Dl=null,El=null,_u=new Map,Uu=new Map,Ll=[],e0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function _h(e,t){switch(e){case"focusin":case"focusout":Ml=null;break;case"dragenter":case"dragleave":Dl=null;break;case"mouseover":case"mouseout":El=null;break;case"pointerover":case"pointerout":_u.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Uu.delete(t.pointerId)}}function ou(e,t,a,l,o,n){return e===null||e.nativeEvent!==n?(e={blockedOn:t,domEventName:a,eventSystemFlags:l,nativeEvent:n,targetContainers:[o]},t!==null&&(t=yn(t),t!==null&&CL(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function t0(e,t,a,l,o){switch(t){case"focusin":return Ml=ou(Ml,e,t,a,l,o),!0;case"dragenter":return Dl=ou(Dl,e,t,a,l,o),!0;case"mouseover":return El=ou(El,e,t,a,l,o),!0;case"pointerover":var n=o.pointerId;return _u.set(n,ou(_u.get(n)||null,e,t,a,l,o)),!0;case"gotpointercapture":return n=o.pointerId,Uu.set(n,ou(Uu.get(n)||null,e,t,a,l,o)),!0}return!1}function IL(e){var t=Xo(e.target);if(t!==null){var a=Hu(t);if(a!==null){if(t=a.tag,t===13){if(t=Fh(a),t!==null){e.blockedOn=t,Sp(e.priority,function(){Ph(a)});return}}else if(t===31){if(t=Vh(a),t!==null){e.blockedOn=t,Sp(e.priority,function(){Ph(a)});return}}else if(t===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Zr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var a=wc(e.nativeEvent);if(a===null){a=e.nativeEvent;var l=new a.constructor(a.type,a);Gf=l,a.target.dispatchEvent(l),Gf=null}else return t=yn(a),t!==null&&CL(t),e.blockedOn=a,!1;t.shift()}return!0}function Uh(e,t,a){Zr(e)&&a.delete(t)}function a0(){Ac=!1,Ml!==null&&Zr(Ml)&&(Ml=null),Dl!==null&&Zr(Dl)&&(Dl=null),El!==null&&Zr(El)&&(El=null),_u.forEach(Uh),Uu.forEach(Uh)}function Or(e,t){e.blockedOn===t&&(e.blockedOn=null,Ac||(Ac=!0,Ve.unstable_scheduleCallback(Ve.unstable_NormalPriority,a0)))}var Br=null;function Hh(e){Br!==e&&(Br=e,Ve.unstable_scheduleCallback(Ve.unstable_NormalPriority,function(){Br===e&&(Br=null);for(var t=0;t<e.length;t+=3){var a=e[t],l=e[t+1],o=e[t+2];if(typeof l!="function"){if(yd(l||a)===null)continue;break}var n=yn(a);n!==null&&(e.splice(t,3),t-=3,uc(n,{pending:!0,data:o,method:a.method,action:l},l,o))}}))}function Sn(e){function t(s){return Or(s,e)}Ml!==null&&Or(Ml,e),Dl!==null&&Or(Dl,e),El!==null&&Or(El,e),_u.forEach(t),Uu.forEach(t);for(var a=0;a<Ll.length;a++){var l=Ll[a];l.blockedOn===e&&(l.blockedOn=null)}for(;0<Ll.length&&(a=Ll[0],a.blockedOn===null);)IL(a),a.blockedOn===null&&Ll.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(l=0;l<a.length;l+=3){var o=a[l],n=a[l+1],u=o[It]||null;if(typeof n=="function")u||Hh(a);else if(u){var r=null;if(n&&n.hasAttribute("formAction")){if(o=n,u=n[It]||null)r=u.formAction;else if(yd(o)!==null)continue}else r=u.action;typeof r=="function"?a[l+1]=r:(a.splice(l,3),l-=3),Hh(a)}}}function wL(){function e(n){n.canIntercept&&n.info==="react-transition"&&n.intercept({handler:function(){return new Promise(function(u){return o=u})},focusReset:"manual",scroll:"manual"})}function t(){o!==null&&(o(),o=null),l||setTimeout(a,20)}function a(){if(!l&&!navigation.transition){var n=navigation.currentEntry;n&&n.url!=null&&navigation.navigate(n.url,{state:n.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,o=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(a,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),o!==null&&(o(),o=null)}}}function Cd(e){this._internalRoot=e}Ns.prototype.render=Cd.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(w(409));var a=t.current,l=Ut();yL(a,l,e,t,null,null)};Ns.prototype.unmount=Cd.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;yL(e.current,2,null,e,null,null),Us(),t[vn]=null}};function Ns(e){this._internalRoot=e}Ns.prototype.unstable_scheduleHydration=function(e){if(e){var t=eg();e={blockedOn:null,target:e,priority:t};for(var a=0;a<Ll.length&&t!==0&&t<Ll[a].priority;a++);Ll.splice(a,0,e),a===0&&IL(e)}};var zh=Nh.version;if(zh!=="19.2.8")throw Error(w(527,zh,"19.2.8"));ne.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(w(188)):(e=Object.keys(e).join(","),Error(w(268,e)));return e=BC(t),e=e!==null?Gh(e):null,e=e===null?null:e.stateNode,e};var l0={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:P,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(nu=__REACT_DEVTOOLS_GLOBAL_HOOK__,!nu.isDisabled&&nu.supportsFiber))try{zu=nu.inject(l0),Pt=nu}catch{}var nu;qs.createRoot=function(e,t){if(!qh(e))throw Error(w(299));var a=!1,l="",o=gx,n=xx,u=Lx;return t!=null&&(t.unstable_strictMode===!0&&(a=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(n=t.onCaughtError),t.onRecoverableError!==void 0&&(u=t.onRecoverableError)),t=SL(e,1,!1,null,null,a,l,null,o,n,u,wL),e[vn]=t.current,gd(e),new Cd(t)};qs.hydrateRoot=function(e,t,a){if(!qh(e))throw Error(w(299));var l=!1,o="",n=gx,u=xx,r=Lx,s=null;return a!=null&&(a.unstable_strictMode===!0&&(l=!0),a.identifierPrefix!==void 0&&(o=a.identifierPrefix),a.onUncaughtError!==void 0&&(n=a.onUncaughtError),a.onCaughtError!==void 0&&(u=a.onCaughtError),a.onRecoverableError!==void 0&&(r=a.onRecoverableError),a.formState!==void 0&&(s=a.formState)),t=SL(e,1,!0,t,a??null,l,o,s,n,u,r,wL),t.context=vL(null),a=t.current,l=Ut(),l=Mc(l),o=Al(l),o.callback=null,Rl(a,o,l),a=l,t.current.lanes=a,qu(t,a),ka(t),e[vn]=t.current,gd(e),new Ns(t)};qs.version="19.2.8"});var kL=Ca((l1,TL)=>{"use strict";function RL(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(RL)}catch(e){console.error(e)}}RL(),TL.exports=AL()});var JL=Ca(Xs=>{"use strict";var K0=Symbol.for("react.transitional.element"),Z0=Symbol.for("react.fragment");function WL(e,t,a){var l=null;if(a!==void 0&&(l=""+a),t.key!==void 0&&(l=""+t.key),"key"in t){a={};for(var o in t)o!=="key"&&(a[o]=t[o])}else a=t;return t=a.ref,{$$typeof:K0,type:e,key:l,ref:t!==void 0?t:null,props:a}}Xs.Fragment=Z0;Xs.jsx=WL;Xs.jsxs=WL});var V=Ca((f1,$L)=>{"use strict";$L.exports=JL()});var KR={},uC=R(kL(),1);var ya=R(U(),1);var Rn=R(U(),1);function ML(e){var t,a,l="";if(typeof e=="string"||typeof e=="number")l+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(a=ML(e[t]))&&(l&&(l+=" "),l+=a)}else for(a in e)e[a]&&(l&&(l+=" "),l+=a);return l}function Fs(){for(var e,t,a=0,l="",o=arguments.length;a<o;a++)(e=arguments[a])&&(t=ML(e))&&(l&&(l+=" "),l+=t);return l}var o0=(e,t)=>{let a=new Array(e.length+t.length);for(let l=0;l<e.length;l++)a[l]=e[l];for(let l=0;l<t.length;l++)a[e.length+l]=t[l];return a},n0=(e,t)=>({classGroupId:e,validator:t}),_L=(e=new Map,t=null,a)=>({nextPart:e,validators:t,classGroupId:a});var DL=[],u0="arbitrary..",r0=e=>{let t=i0(e),{conflictingClassGroups:a,conflictingClassGroupModifiers:l}=e;return{getClassGroupId:u=>{if(u.startsWith("[")&&u.endsWith("]"))return s0(u);let r=u.split("-"),s=r[0]===""&&r.length>1?1:0;return UL(r,s,t)},getConflictingClassGroupIds:(u,r)=>{if(r){let s=l[u],i=a[u];return s?i?o0(i,s):s:i||DL}return a[u]||DL}}},UL=(e,t,a)=>{if(e.length-t===0)return a.classGroupId;let o=e[t],n=a.nextPart.get(o);if(n){let i=UL(e,t+1,n);if(i)return i}let u=a.validators;if(u===null)return;let r=t===0?e.join("-"):e.slice(t).join("-"),s=u.length;for(let i=0;i<s;i++){let h=u[i];if(h.validator(r))return h.classGroupId}},s0=e=>e.slice(1,-1).indexOf(":")===-1?void 0:(()=>{let t=e.slice(1,-1),a=t.indexOf(":"),l=t.slice(0,a);return l?u0+l:void 0})(),i0=e=>{let{theme:t,classGroups:a}=e;return f0(a,t)},f0=(e,t)=>{let a=_L();for(let l in e){let o=e[l];Id(o,a,l,t)}return a},Id=(e,t,a,l)=>{let o=e.length;for(let n=0;n<o;n++){let u=e[n];c0(u,t,a,l)}},c0=(e,t,a,l)=>{if(typeof e=="string"){d0(e,t,a);return}if(typeof e=="function"){m0(e,t,a,l);return}p0(e,t,a,l)},d0=(e,t,a)=>{let l=e===""?t:HL(t,e);l.classGroupId=a},m0=(e,t,a,l)=>{if(h0(e)){Id(e(l),t,a,l);return}t.validators===null&&(t.validators=[]),t.validators.push(n0(a,e))},p0=(e,t,a,l)=>{let o=Object.entries(e),n=o.length;for(let u=0;u<n;u++){let[r,s]=o[u];Id(s,HL(t,r),a,l)}},HL=(e,t)=>{let a=e,l=t.split("-"),o=l.length;for(let n=0;n<o;n++){let u=l[n],r=a.nextPart.get(u);r||(r=_L(),a.nextPart.set(u,r)),a=r}return a},h0=e=>"isThemeGetter"in e&&e.isThemeGetter===!0,g0=e=>{if(e<1)return{get:()=>{},set:()=>{}};let t=0,a=Object.create(null),l=Object.create(null),o=(n,u)=>{a[n]=u,t++,t>e&&(t=0,l=a,a=Object.create(null))};return{get(n){let u=a[n];if(u!==void 0)return u;if((u=l[n])!==void 0)return o(n,u),u},set(n,u){n in a?a[n]=u:o(n,u)}}};var x0=[],EL=(e,t,a,l,o)=>({modifiers:e,hasImportantModifier:t,baseClassName:a,maybePostfixModifierPosition:l,isExternal:o}),L0=e=>{let{prefix:t,experimentalParseClassName:a}=e,l=o=>{let n=[],u=0,r=0,s=0,i,h=o.length;for(let S=0;S<h;S++){let v=o[S];if(u===0&&r===0){if(v===":"){n.push(o.slice(s,S)),s=S+1;continue}if(v==="/"){i=S;continue}}v==="["?u++:v==="]"?u--:v==="("?r++:v===")"&&r--}let m=n.length===0?o:o.slice(s),f=m,p=!1;m.endsWith("!")?(f=m.slice(0,-1),p=!0):m.startsWith("!")&&(f=m.slice(1),p=!0);let L=i&&i>s?i-s:void 0;return EL(n,p,f,L)};if(t){let o=t+":",n=l;l=u=>u.startsWith(o)?n(u.slice(o.length)):EL(x0,!1,u,void 0,!0)}if(a){let o=l;l=n=>a({className:n,parseClassName:o})}return l},S0=e=>{let t=new Map;return e.orderSensitiveModifiers.forEach((a,l)=>{t.set(a,1e6+l)}),a=>{let l=[],o=[];for(let n=0;n<a.length;n++){let u=a[n],r=u[0]==="[",s=t.has(u);r||s?(o.length>0&&(o.sort(),l.push(...o),o=[]),l.push(u)):o.push(u)}return o.length>0&&(o.sort(),l.push(...o)),l}},v0=e=>({cache:g0(e.cacheSize),parseClassName:L0(e),sortModifiers:S0(e),postfixLookupClassGroupIds:y0(e),...r0(e)}),y0=e=>{let t=Object.create(null),a=e.postfixLookupClassGroups;if(a)for(let l=0;l<a.length;l++)t[a[l]]=!0;return t},C0=/\s+/,b0=(e,t)=>{let{parseClassName:a,getClassGroupId:l,getConflictingClassGroupIds:o,sortModifiers:n,postfixLookupClassGroupIds:u}=t,r=[],s=e.trim().split(C0),i="";for(let h=s.length-1;h>=0;h-=1){let m=s[h],{isExternal:f,modifiers:p,hasImportantModifier:L,baseClassName:S,maybePostfixModifierPosition:v}=a(m);if(f){i=m+(i.length>0?" "+i:i);continue}let g=!!v,d;if(g){let b=S.substring(0,v);d=l(b);let C=d&&u[d]?l(S):void 0;C&&C!==d&&(d=C,g=!1)}else d=l(S);if(!d){if(!g){i=m+(i.length>0?" "+i:i);continue}if(d=l(S),!d){i=m+(i.length>0?" "+i:i);continue}g=!1}let c=p.length===0?"":p.length===1?p[0]:n(p).join(":"),x=L?c+"!":c,y=x+d;if(r.indexOf(y)>-1)continue;r.push(y);let I=o(d,g);for(let b=0;b<I.length;++b){let C=I[b];r.push(x+C)}i=m+(i.length>0?" "+i:i)}return i},I0=(...e)=>{let t=0,a,l,o="";for(;t<e.length;)(a=e[t++])&&(l=zL(a))&&(o&&(o+=" "),o+=l);return o},zL=e=>{if(typeof e=="string")return e;let t,a="";for(let l=0;l<e.length;l++)e[l]&&(t=zL(e[l]))&&(a&&(a+=" "),a+=t);return a},w0=(e,...t)=>{let a,l,o,n,u=s=>{let i=t.reduce((h,m)=>m(h),e());return a=v0(i),l=a.cache.get,o=a.cache.set,n=r,r(s)},r=s=>{let i=l(s);if(i)return i;let h=b0(s,a);return o(s,h),h};return n=u,(...s)=>n(I0(...s))},A0=[],Ge=e=>{let t=a=>a[e]||A0;return t.isThemeGetter=!0,t},NL=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,qL=/^\((?:(\w[\w-]*):)?(.+)\)$/i,R0=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,T0=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,k0=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,M0=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,D0=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,E0=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,zl=e=>R0.test(e),W=e=>!!e&&!Number.isNaN(Number(e)),Ma=e=>!!e&&Number.isInteger(Number(e)),bd=e=>e.endsWith("%")&&W(e.slice(0,-1)),tl=e=>T0.test(e),FL=()=>!0,O0=e=>k0.test(e)&&!M0.test(e),wd=()=>!1,B0=e=>D0.test(e),P0=e=>E0.test(e),_0=e=>!M(e)&&!E(e),U0=e=>e.startsWith("@container")&&(e[10]==="/"&&e[11]!==void 0||e[11]==="s"&&e[16]!==void 0&&e.startsWith("-size/",10)||e[11]==="n"&&e[18]!==void 0&&e.startsWith("-normal/",10)),H0=e=>Nl(e,XL,wd),M=e=>NL.test(e),go=e=>Nl(e,jL,O0),OL=e=>Nl(e,j0,W),z0=e=>Nl(e,KL,FL),N0=e=>Nl(e,YL,wd),BL=e=>Nl(e,VL,wd),q0=e=>Nl(e,GL,P0),Vs=e=>Nl(e,ZL,B0),E=e=>qL.test(e),Qu=e=>xo(e,jL),F0=e=>xo(e,YL),PL=e=>xo(e,VL),V0=e=>xo(e,XL),G0=e=>xo(e,GL),Gs=e=>xo(e,ZL,!0),X0=e=>xo(e,KL,!0),Nl=(e,t,a)=>{let l=NL.exec(e);return l?l[1]?t(l[1]):a(l[2]):!1},xo=(e,t,a=!1)=>{let l=qL.exec(e);return l?l[1]?t(l[1]):a:!1},VL=e=>e==="position"||e==="percentage",GL=e=>e==="image"||e==="url",XL=e=>e==="length"||e==="size"||e==="bg-size",jL=e=>e==="length",j0=e=>e==="number",YL=e=>e==="family-name",KL=e=>e==="number"||e==="weight",ZL=e=>e==="shadow";var Y0=()=>{let e=Ge("color"),t=Ge("font"),a=Ge("text"),l=Ge("font-weight"),o=Ge("tracking"),n=Ge("leading"),u=Ge("breakpoint"),r=Ge("container"),s=Ge("spacing"),i=Ge("radius"),h=Ge("shadow"),m=Ge("inset-shadow"),f=Ge("text-shadow"),p=Ge("drop-shadow"),L=Ge("blur"),S=Ge("perspective"),v=Ge("aspect"),g=Ge("ease"),d=Ge("animate"),c=()=>["auto","avoid","all","avoid-page","page","left","right","column"],x=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],y=()=>[...x(),E,M],I=()=>["auto","hidden","clip","visible","scroll"],b=()=>["auto","contain","none"],C=()=>[E,M,s],A=()=>[zl,"full","auto",...C()],T=()=>[Ma,"none","subgrid",E,M],B=()=>["auto",{span:["full",Ma,E,M]},Ma,E,M],O=()=>[Ma,"auto",E,M],_=()=>["auto","min","max","fr",E,M],Q=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],ae=()=>["start","end","center","stretch","center-safe","end-safe"],H=()=>["auto",...C()],j=()=>[zl,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...C()],z=()=>[zl,"screen","full","dvw","lvw","svw","min","max","fit",...C()],le=()=>[zl,"screen","full","lh","dvh","lvh","svh","min","max","fit",...C()],k=()=>[e,E,M],qt=()=>[...x(),PL,BL,{position:[E,M]}],Oe=()=>["no-repeat",{repeat:["","x","y","space","round"]}],ut=()=>["auto","cover","contain",V0,H0,{size:[E,M]}],Ft=()=>[bd,Qu,go],be=()=>["","none","full",i,E,M],Re=()=>["",W,Qu,go],Vt=()=>["solid","dashed","dotted","double"],q=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],Y=()=>[W,bd,PL,BL],qe=()=>["","none",L,E,M],ue=()=>["none",W,E,M],re=()=>["none",W,E,M],Ie=()=>[W,E,M],Lt=()=>[zl,"full",...C()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[tl],breakpoint:[tl],color:[FL],container:[tl],"drop-shadow":[tl],ease:["in","out","in-out"],font:[_0],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[tl],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[tl],shadow:[tl],spacing:["px",W],text:[tl],"text-shadow":[tl],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",zl,M,E,v]}],container:["container"],"container-type":[{"@container":["","normal","size",E,M]}],"container-named":[U0],columns:[{columns:[W,M,E,r]}],"break-after":[{"break-after":c()}],"break-before":[{"break-before":c()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:y()}],overflow:[{overflow:I()}],"overflow-x":[{"overflow-x":I()}],"overflow-y":[{"overflow-y":I()}],overscroll:[{overscroll:b()}],"overscroll-x":[{"overscroll-x":b()}],"overscroll-y":[{"overscroll-y":b()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:A()}],"inset-x":[{"inset-x":A()}],"inset-y":[{"inset-y":A()}],start:[{"inset-s":A(),start:A()}],end:[{"inset-e":A(),end:A()}],"inset-bs":[{"inset-bs":A()}],"inset-be":[{"inset-be":A()}],top:[{top:A()}],right:[{right:A()}],bottom:[{bottom:A()}],left:[{left:A()}],visibility:["visible","invisible","collapse"],z:[{z:[Ma,"auto",E,M]}],basis:[{basis:[zl,"full","auto",r,...C()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[W,zl,"auto","initial","none",M]}],grow:[{grow:["",W,E,M]}],shrink:[{shrink:["",W,E,M]}],order:[{order:[Ma,"first","last","none",E,M]}],"grid-cols":[{"grid-cols":T()}],"col-start-end":[{col:B()}],"col-start":[{"col-start":O()}],"col-end":[{"col-end":O()}],"grid-rows":[{"grid-rows":T()}],"row-start-end":[{row:B()}],"row-start":[{"row-start":O()}],"row-end":[{"row-end":O()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":_()}],"auto-rows":[{"auto-rows":_()}],gap:[{gap:C()}],"gap-x":[{"gap-x":C()}],"gap-y":[{"gap-y":C()}],"justify-content":[{justify:[...Q(),"normal"]}],"justify-items":[{"justify-items":[...ae(),"normal"]}],"justify-self":[{"justify-self":["auto",...ae()]}],"align-content":[{content:["normal",...Q()]}],"align-items":[{items:[...ae(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...ae(),{baseline:["","last"]}]}],"place-content":[{"place-content":Q()}],"place-items":[{"place-items":[...ae(),"baseline"]}],"place-self":[{"place-self":["auto",...ae()]}],p:[{p:C()}],px:[{px:C()}],py:[{py:C()}],ps:[{ps:C()}],pe:[{pe:C()}],pbs:[{pbs:C()}],pbe:[{pbe:C()}],pt:[{pt:C()}],pr:[{pr:C()}],pb:[{pb:C()}],pl:[{pl:C()}],m:[{m:H()}],mx:[{mx:H()}],my:[{my:H()}],ms:[{ms:H()}],me:[{me:H()}],mbs:[{mbs:H()}],mbe:[{mbe:H()}],mt:[{mt:H()}],mr:[{mr:H()}],mb:[{mb:H()}],ml:[{ml:H()}],"space-x":[{"space-x":C()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":C()}],"space-y-reverse":["space-y-reverse"],size:[{size:j()}],"inline-size":[{inline:["auto",...z()]}],"min-inline-size":[{"min-inline":["auto",...z()]}],"max-inline-size":[{"max-inline":["none",...z()]}],"block-size":[{block:["auto",...le()]}],"min-block-size":[{"min-block":["auto",...le()]}],"max-block-size":[{"max-block":["none",...le()]}],w:[{w:[r,"screen",...j()]}],"min-w":[{"min-w":[r,"screen","none",...j()]}],"max-w":[{"max-w":[r,"screen","none","prose",{screen:[u]},...j()]}],h:[{h:["screen","lh",...j()]}],"min-h":[{"min-h":["screen","lh","none",...j()]}],"max-h":[{"max-h":["screen","lh",...j()]}],"font-size":[{text:["base",a,Qu,go]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[l,X0,z0]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",bd,M]}],"font-family":[{font:[F0,N0,t]}],"font-features":[{"font-features":[M]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[o,E,M]}],"line-clamp":[{"line-clamp":[W,"none",E,OL]}],leading:[{leading:[n,...C()]}],"list-image":[{"list-image":["none",E,M]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",E,M]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:k()}],"text-color":[{text:k()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...Vt(),"wavy"]}],"text-decoration-thickness":[{decoration:[W,"from-font","auto",E,go]}],"text-decoration-color":[{decoration:k()}],"underline-offset":[{"underline-offset":[W,"auto",E,M]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:C()}],"tab-size":[{tab:[Ma,E,M]}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",E,M]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",E,M]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:qt()}],"bg-repeat":[{bg:Oe()}],"bg-size":[{bg:ut()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},Ma,E,M],radial:["",E,M],conic:[Ma,E,M]},G0,q0]}],"bg-color":[{bg:k()}],"gradient-from-pos":[{from:Ft()}],"gradient-via-pos":[{via:Ft()}],"gradient-to-pos":[{to:Ft()}],"gradient-from":[{from:k()}],"gradient-via":[{via:k()}],"gradient-to":[{to:k()}],rounded:[{rounded:be()}],"rounded-s":[{"rounded-s":be()}],"rounded-e":[{"rounded-e":be()}],"rounded-t":[{"rounded-t":be()}],"rounded-r":[{"rounded-r":be()}],"rounded-b":[{"rounded-b":be()}],"rounded-l":[{"rounded-l":be()}],"rounded-ss":[{"rounded-ss":be()}],"rounded-se":[{"rounded-se":be()}],"rounded-ee":[{"rounded-ee":be()}],"rounded-es":[{"rounded-es":be()}],"rounded-tl":[{"rounded-tl":be()}],"rounded-tr":[{"rounded-tr":be()}],"rounded-br":[{"rounded-br":be()}],"rounded-bl":[{"rounded-bl":be()}],"border-w":[{border:Re()}],"border-w-x":[{"border-x":Re()}],"border-w-y":[{"border-y":Re()}],"border-w-s":[{"border-s":Re()}],"border-w-e":[{"border-e":Re()}],"border-w-bs":[{"border-bs":Re()}],"border-w-be":[{"border-be":Re()}],"border-w-t":[{"border-t":Re()}],"border-w-r":[{"border-r":Re()}],"border-w-b":[{"border-b":Re()}],"border-w-l":[{"border-l":Re()}],"divide-x":[{"divide-x":Re()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":Re()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...Vt(),"hidden","none"]}],"divide-style":[{divide:[...Vt(),"hidden","none"]}],"border-color":[{border:k()}],"border-color-x":[{"border-x":k()}],"border-color-y":[{"border-y":k()}],"border-color-s":[{"border-s":k()}],"border-color-e":[{"border-e":k()}],"border-color-bs":[{"border-bs":k()}],"border-color-be":[{"border-be":k()}],"border-color-t":[{"border-t":k()}],"border-color-r":[{"border-r":k()}],"border-color-b":[{"border-b":k()}],"border-color-l":[{"border-l":k()}],"divide-color":[{divide:k()}],"outline-style":[{outline:[...Vt(),"none","hidden"]}],"outline-offset":[{"outline-offset":[W,E,M]}],"outline-w":[{outline:["",W,Qu,go]}],"outline-color":[{outline:k()}],shadow:[{shadow:["","none",h,Gs,Vs]}],"shadow-color":[{shadow:k()}],"inset-shadow":[{"inset-shadow":["none",m,Gs,Vs]}],"inset-shadow-color":[{"inset-shadow":k()}],"ring-w":[{ring:Re()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:k()}],"ring-offset-w":[{"ring-offset":[W,go]}],"ring-offset-color":[{"ring-offset":k()}],"inset-ring-w":[{"inset-ring":Re()}],"inset-ring-color":[{"inset-ring":k()}],"text-shadow":[{"text-shadow":["none",f,Gs,Vs]}],"text-shadow-color":[{"text-shadow":k()}],opacity:[{opacity:[W,E,M]}],"mix-blend":[{"mix-blend":[...q(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":q()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[W]}],"mask-image-linear-from-pos":[{"mask-linear-from":Y()}],"mask-image-linear-to-pos":[{"mask-linear-to":Y()}],"mask-image-linear-from-color":[{"mask-linear-from":k()}],"mask-image-linear-to-color":[{"mask-linear-to":k()}],"mask-image-t-from-pos":[{"mask-t-from":Y()}],"mask-image-t-to-pos":[{"mask-t-to":Y()}],"mask-image-t-from-color":[{"mask-t-from":k()}],"mask-image-t-to-color":[{"mask-t-to":k()}],"mask-image-r-from-pos":[{"mask-r-from":Y()}],"mask-image-r-to-pos":[{"mask-r-to":Y()}],"mask-image-r-from-color":[{"mask-r-from":k()}],"mask-image-r-to-color":[{"mask-r-to":k()}],"mask-image-b-from-pos":[{"mask-b-from":Y()}],"mask-image-b-to-pos":[{"mask-b-to":Y()}],"mask-image-b-from-color":[{"mask-b-from":k()}],"mask-image-b-to-color":[{"mask-b-to":k()}],"mask-image-l-from-pos":[{"mask-l-from":Y()}],"mask-image-l-to-pos":[{"mask-l-to":Y()}],"mask-image-l-from-color":[{"mask-l-from":k()}],"mask-image-l-to-color":[{"mask-l-to":k()}],"mask-image-x-from-pos":[{"mask-x-from":Y()}],"mask-image-x-to-pos":[{"mask-x-to":Y()}],"mask-image-x-from-color":[{"mask-x-from":k()}],"mask-image-x-to-color":[{"mask-x-to":k()}],"mask-image-y-from-pos":[{"mask-y-from":Y()}],"mask-image-y-to-pos":[{"mask-y-to":Y()}],"mask-image-y-from-color":[{"mask-y-from":k()}],"mask-image-y-to-color":[{"mask-y-to":k()}],"mask-image-radial":[{"mask-radial":[E,M]}],"mask-image-radial-from-pos":[{"mask-radial-from":Y()}],"mask-image-radial-to-pos":[{"mask-radial-to":Y()}],"mask-image-radial-from-color":[{"mask-radial-from":k()}],"mask-image-radial-to-color":[{"mask-radial-to":k()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":x()}],"mask-image-conic-pos":[{"mask-conic":[W]}],"mask-image-conic-from-pos":[{"mask-conic-from":Y()}],"mask-image-conic-to-pos":[{"mask-conic-to":Y()}],"mask-image-conic-from-color":[{"mask-conic-from":k()}],"mask-image-conic-to-color":[{"mask-conic-to":k()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:qt()}],"mask-repeat":[{mask:Oe()}],"mask-size":[{mask:ut()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",E,M]}],filter:[{filter:["","none",E,M]}],blur:[{blur:qe()}],brightness:[{brightness:[W,E,M]}],contrast:[{contrast:[W,E,M]}],"drop-shadow":[{"drop-shadow":["","none",p,Gs,Vs]}],"drop-shadow-color":[{"drop-shadow":k()}],grayscale:[{grayscale:["",W,E,M]}],"hue-rotate":[{"hue-rotate":[W,E,M]}],invert:[{invert:["",W,E,M]}],saturate:[{saturate:[W,E,M]}],sepia:[{sepia:["",W,E,M]}],"backdrop-filter":[{"backdrop-filter":["","none",E,M]}],"backdrop-blur":[{"backdrop-blur":qe()}],"backdrop-brightness":[{"backdrop-brightness":[W,E,M]}],"backdrop-contrast":[{"backdrop-contrast":[W,E,M]}],"backdrop-grayscale":[{"backdrop-grayscale":["",W,E,M]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[W,E,M]}],"backdrop-invert":[{"backdrop-invert":["",W,E,M]}],"backdrop-opacity":[{"backdrop-opacity":[W,E,M]}],"backdrop-saturate":[{"backdrop-saturate":[W,E,M]}],"backdrop-sepia":[{"backdrop-sepia":["",W,E,M]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":C()}],"border-spacing-x":[{"border-spacing-x":C()}],"border-spacing-y":[{"border-spacing-y":C()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",E,M]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[W,"initial",E,M]}],ease:[{ease:["linear","initial",g,E,M]}],delay:[{delay:[W,E,M]}],animate:[{animate:["none",d,E,M]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[S,E,M]}],"perspective-origin":[{"perspective-origin":y()}],rotate:[{rotate:ue()}],"rotate-x":[{"rotate-x":ue()}],"rotate-y":[{"rotate-y":ue()}],"rotate-z":[{"rotate-z":ue()}],scale:[{scale:re()}],"scale-x":[{"scale-x":re()}],"scale-y":[{"scale-y":re()}],"scale-z":[{"scale-z":re()}],"scale-3d":["scale-3d"],skew:[{skew:Ie()}],"skew-x":[{"skew-x":Ie()}],"skew-y":[{"skew-y":Ie()}],transform:[{transform:[E,M,"","none","gpu","cpu"]}],"transform-origin":[{origin:y()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:Lt()}],"translate-x":[{"translate-x":Lt()}],"translate-y":[{"translate-y":Lt()}],"translate-z":[{"translate-z":Lt()}],"translate-none":["translate-none"],zoom:[{zoom:[Ma,E,M]}],accent:[{accent:k()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:k()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",E,M]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scrollbar-thumb-color":[{"scrollbar-thumb":k()}],"scrollbar-track-color":[{"scrollbar-track":k()}],"scrollbar-gutter":[{"scrollbar-gutter":["auto","stable","both"]}],"scrollbar-w":[{scrollbar:["auto","thin","none"]}],"scroll-m":[{"scroll-m":C()}],"scroll-mx":[{"scroll-mx":C()}],"scroll-my":[{"scroll-my":C()}],"scroll-ms":[{"scroll-ms":C()}],"scroll-me":[{"scroll-me":C()}],"scroll-mbs":[{"scroll-mbs":C()}],"scroll-mbe":[{"scroll-mbe":C()}],"scroll-mt":[{"scroll-mt":C()}],"scroll-mr":[{"scroll-mr":C()}],"scroll-mb":[{"scroll-mb":C()}],"scroll-ml":[{"scroll-ml":C()}],"scroll-p":[{"scroll-p":C()}],"scroll-px":[{"scroll-px":C()}],"scroll-py":[{"scroll-py":C()}],"scroll-ps":[{"scroll-ps":C()}],"scroll-pe":[{"scroll-pe":C()}],"scroll-pbs":[{"scroll-pbs":C()}],"scroll-pbe":[{"scroll-pbe":C()}],"scroll-pt":[{"scroll-pt":C()}],"scroll-pr":[{"scroll-pr":C()}],"scroll-pb":[{"scroll-pb":C()}],"scroll-pl":[{"scroll-pl":C()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",E,M]}],fill:[{fill:["none",...k()]}],"stroke-w":[{stroke:[W,Qu,go,OL]}],stroke:[{stroke:["none",...k()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{"container-named":["container-type"],overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},postfixLookupClassGroups:["container-type"],orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}};var QL=w0(Y0);function lt(...e){return QL(Fs(e))}var eS=R(V(),1),ql=(0,Rn.forwardRef)(({className:e,autoResize:t=!0,onChange:a,...l},o)=>{let n=(0,Rn.useRef)(null),u=o||n;(0,Rn.useEffect)(()=>{t&&u.current&&(u.current.style.height="auto",u.current.style.height=u.current.scrollHeight+"px")},[l.value,t,u]);let r=s=>{t&&(s.target.style.height="auto",s.target.style.height=s.target.scrollHeight+"px"),a?.(s)};return(0,eS.jsx)("textarea",{ref:u,className:lt("flex w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-md-sm text-foreground","placeholder:text-muted-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1","disabled:cursor-not-allowed disabled:opacity-50","resize-y min-h-[50px] leading-relaxed",e),onChange:r,...l})});ql.displayName="Textarea";var js=R(V(),1);function Xe({className:e,required:t,children:a,...l}){return(0,js.jsxs)("label",{className:lt("block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1",e),...l,children:[a,t&&(0,js.jsx)("span",{className:"text-destructive ml-0.5",children:"*"})]})}var Tn=R(V(),1);function kn({title:e,children:t,className:a}){return(0,Tn.jsxs)("div",{className:lt("bg-card border border-border rounded-lg mb-3 overflow-hidden",a),children:[(0,Tn.jsxs)("div",{className:"px-3.5 py-2 bg-primary/5 border-b border-primary/15 text-[13px] font-bold text-primary flex items-center gap-1.5",children:[(0,Tn.jsx)("span",{className:"text-sm",children:"\u25CF"}),e]}),(0,Tn.jsx)("div",{className:"p-3.5",children:t})]})}var ht=R(V(),1);function tS({title:e,onClose:t,patientInfo:a}){return(0,ht.jsxs)("div",{className:"flex items-center justify-between px-5 py-3 bg-gradient-to-br from-primary to-primary/80 text-white shrink-0",children:[(0,ht.jsxs)("div",{className:"flex items-center gap-3",children:[(0,ht.jsx)("div",{className:"flex items-center justify-center w-9 h-9 rounded-lg bg-white/15",children:(0,ht.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"white",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,ht.jsx)("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),(0,ht.jsx)("polyline",{points:"14 2 14 8 20 8"}),(0,ht.jsx)("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),(0,ht.jsx)("line",{x1:"16",y1:"17",x2:"8",y2:"17"}),(0,ht.jsx)("polyline",{points:"10 9 9 9 8 9"})]})}),(0,ht.jsxs)("div",{children:[(0,ht.jsx)("h2",{className:"text-[15px] font-bold tracking-tight",children:e}),a&&(0,ht.jsxs)("div",{className:"text-[11px] text-white/70 mt-0.5",children:["RM ",a.norm||"\u2014"," \xB7 ",a.pasien||"\u2014"," \xB7"," ",a.nama_dokter||"\u2014"]})]})]}),(0,ht.jsx)("button",{type:"button",onClick:t,className:"bg-white/15 hover:bg-white/25 border-none text-white w-[28px] h-[28px] rounded-md text-sm flex items-center justify-center cursor-pointer transition-colors","aria-label":"Tutup",children:"\u2715"})]})}var al=R(V(),1);function aS({anamnesa:e,pemeriksaan:t,onChange:a}){return(0,al.jsxs)("div",{className:"space-y-3",children:[(0,al.jsxs)("div",{children:[(0,al.jsx)(Xe,{children:"Anamnesa"}),(0,al.jsx)(ql,{value:e,onChange:l=>a("anamnesa",l.target.value),placeholder:"Keluhan pasien...",rows:4})]}),(0,al.jsxs)("div",{children:[(0,al.jsx)(Xe,{children:"Pemeriksaan Fisik"}),(0,al.jsx)(ql,{value:t,onChange:l=>a("pemeriksaan",l.target.value),placeholder:"Hasil pemeriksaan...",rows:4})]})]})}var lS=R(U(),1);var oS=R(V(),1),ll=(0,lS.forwardRef)(({className:e,type:t,...a},l)=>(0,oS.jsx)("input",{type:t,className:lt("flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-md-sm text-foreground","placeholder:text-muted-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1","disabled:cursor-not-allowed disabled:opacity-50",e),ref:l,...a}));ll.displayName="Input";var Fl=R(V(),1);function nS({vitals:e,onChange:t}){return(0,Fl.jsx)("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-3",children:[{key:"tensi",label:"Tensi",unit:"mmHg",placeholder:"120/80"},{key:"nadi",label:"Nadi",unit:"x/mnt",placeholder:"80"},{key:"suhu",label:"Suhu",unit:"\xB0C",placeholder:"36.5"},{key:"nafas",label:"Nafas",unit:"x/mnt",placeholder:"20"},{key:"berat",label:"Berat",unit:"kg",placeholder:"60"},{key:"tinggi",label:"Tinggi",unit:"cm",placeholder:"165"}].map(l=>(0,Fl.jsxs)("div",{children:[(0,Fl.jsx)(Xe,{children:l.label}),(0,Fl.jsxs)("div",{className:"relative",children:[(0,Fl.jsx)(ll,{value:e[l.key],onChange:o=>t(l.key,o.target.value),placeholder:l.placeholder,className:"pr-14"}),(0,Fl.jsx)("span",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-muted-foreground pointer-events-none",children:l.unit})]})]},l.key))})}var jl=R(U(),1);var Zs=R(U(),1);var Ys=(...e)=>e.filter((t,a,l)=>!!t&&t.trim()!==""&&l.indexOf(t)===a).join(" ").trim();var uS=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();var rS=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,a,l)=>l?l.toUpperCase():a.toLowerCase());var Ad=e=>{let t=rS(e);return t.charAt(0).toUpperCase()+t.slice(1)};var Wu=R(U(),1);var Ks={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};var sS=e=>{for(let t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};var Mn=R(U(),1);var Q0=(0,Mn.createContext)({});var iS=()=>(0,Mn.useContext)(Q0);var fS=(0,Wu.forwardRef)(({color:e,size:t,strokeWidth:a,absoluteStrokeWidth:l,className:o="",children:n,iconNode:u,...r},s)=>{let{size:i=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:f="currentColor",className:p=""}=iS()??{},L=l??m?Number(a??h)*24/Number(t??i):a??h;return(0,Wu.createElement)("svg",{ref:s,...Ks,width:t??i??Ks.width,height:t??i??Ks.height,stroke:e??f,strokeWidth:L,className:Ys("lucide",p,o),...!n&&!sS(r)&&{"aria-hidden":"true"},...r},[...u.map(([S,v])=>(0,Wu.createElement)(S,v)),...Array.isArray(n)?n:[n]])});var At=(e,t)=>{let a=(0,Zs.forwardRef)(({className:l,...o},n)=>(0,Zs.createElement)(fS,{ref:n,iconNode:t,className:Ys(`lucide-${uS(Ad(e))}`,`lucide-${e}`,l),...o}));return a.displayName=Ad(e),a};var W0=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],Ju=At("check",W0);var J0=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],$u=At("chevron-down",J0);var $0=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],er=At("info",$0);var ew=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],Lo=At("plus",ew);var tw=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],So=At("trash-2",tw);var aw=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],ia=At("triangle-alert",aw);var lw=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Dn=At("x",lw);var pS=R(U(),1);var cS=e=>typeof e=="boolean"?`${e}`:e===0?"0":e,dS=Fs,mS=(e,t)=>a=>{var l;if(t?.variants==null)return dS(e,a?.class,a?.className);let{variants:o,defaultVariants:n}=t,u=Object.keys(o).map(i=>{let h=a?.[i],m=n?.[i];if(h===null)return null;let f=cS(h)||cS(m);return o[i][f]}),r=a&&Object.entries(a).reduce((i,h)=>{let[m,f]=h;return f===void 0||(i[m]=f),i},{}),s=t==null||(l=t.compoundVariants)===null||l===void 0?void 0:l.reduce((i,h)=>{let{class:m,className:f,...p}=h;return Object.entries(p).every(L=>{let[S,v]=L;return Array.isArray(v)?v.includes({...n,...r}[S]):{...n,...r}[S]===v})?[...i,m,f]:i},[]);return dS(e,u,s,a?.class,a?.className)};var hS=R(V(),1),ow=mS("inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-md-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-8 px-3.5",sm:"h-7 px-2.5",lg:"h-9 px-4",xl:"h-11 px-6 text-base",icon:"h-8 w-8"}},defaultVariants:{variant:"default",size:"default"}}),fa=(0,pS.forwardRef)(({className:e,variant:t,size:a,...l},o)=>(0,hS.jsx)("button",{className:lt(ow({variant:t,size:a,className:e})),ref:o,...l}));fa.displayName="Button";var Mi=R(U(),1);var D=R(U(),1),wm=R(Jn(),1);var nw=Object.defineProperty,uw=(e,t)=>nw(e,"name",{value:t,configurable:!0});function Qs(e,[t,a]){return Math.min(a,Math.max(t,e))}uw(Qs,"clamp");var rw=Object.defineProperty,En=(e,t)=>rw(e,"name",{value:t,configurable:!0}),gS=!!(typeof window<"u"&&window.document&&window.document.createElement);function He(e,t,{checkForDefaultPrevented:a=!0}={}){return En(function(o){if(e?.(o),a===!1||!o||!o.defaultPrevented)return t?.(o)},"handleEvent")}En(He,"composeEventHandlers");function sw(e){if(!gS)throw new Error("Cannot access window outside of the DOM");return e?.ownerDocument?.defaultView??window}En(sw,"getOwnerWindow");function Rd(e){if(!gS)throw new Error("Cannot access document outside of the DOM");return e?.ownerDocument??document}En(Rd,"getOwnerDocument");function xS(e,t=!1){let{activeElement:a}=Rd(e);if(!a?.nodeName)return null;if(LS(a)&&a.contentDocument)return xS(a.contentDocument.body,t);if(t){let l=a.getAttribute("aria-activedescendant");if(l){let o=Rd(a).getElementById(l);if(o)return o}}return a}En(xS,"getActiveElement");function LS(e){return e.tagName==="IFRAME"}En(LS,"isFrame");var ma=R(U(),1);var la=R(U(),1),Td=R(V(),1),iw=Object.defineProperty,aa=(e,t)=>iw(e,"name",{value:t,configurable:!0});function fw(e,t){let a=la.createContext(t);a.displayName=e+"Context";let l=aa(n=>{let{children:u,...r}=n,s=la.useMemo(()=>r,Object.values(r));return(0,Td.jsx)(a.Provider,{value:s,children:u})},"Provider");l.displayName=e+"Provider";function o(n,u={}){let{optional:r=!1}=u,s=la.useContext(a);if(s)return s;if(t!==void 0)return t;if(!r)throw new Error(`\`${n}\` must be used within \`${e}\``)}return aa(o,"useContext"),[l,o]}aa(fw,"createContext");function ol(e,t=[]){let a=[];function l(n,u){let r=la.createContext(u);r.displayName=n+"Context";let s=a.length;a=[...a,u];let i=aa(m=>{let{scope:f,children:p,...L}=m,S=f?.[e]?.[s]||r,v=la.useMemo(()=>L,Object.values(L));return(0,Td.jsx)(S.Provider,{value:v,children:p})},"Provider");i.displayName=n+"Provider";function h(m,f,p={}){let{optional:L=!1}=p,S=f?.[e]?.[s]||r,v=la.useContext(S);if(v)return v;if(u!==void 0)return u;if(!L)throw new Error(`\`${m}\` must be used within \`${n}\``)}return aa(h,"useContext"),[i,h]}aa(l,"createContext");let o=aa(()=>{let n=a.map(u=>la.createContext(u));return aa(function(r){let s=r?.[e]||n;return la.useMemo(()=>({[`__scope${e}`]:{...r,[e]:s}}),[r,s])},"useScope")},"createScope");return o.scopeName=e,[l,SS(o,...t)]}aa(ol,"createContextScope");function SS(...e){let t=e[0];if(e.length===1)return t;let a=aa(()=>{let l=e.map(o=>({useScope:o(),scopeName:o.scopeName}));return aa(function(n){let u=l.reduce((r,{useScope:s,scopeName:i})=>{let m=s(n)[`__scope${i}`];return{...r,...m}},{});return la.useMemo(()=>({[`__scope${t.scopeName}`]:u}),[u])},"useComposedScopes")},"createScope");return a.scopeName=t.scopeName,a}aa(SS,"composeContextScopes");var vS=R(U(),1),cw=Object.defineProperty,Md=(e,t)=>cw(e,"name",{value:t,configurable:!0});function kd(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}Md(kd,"setRef");function yS(...e){return t=>{let a=!1,l=e.map(o=>{let n=kd(o,t);return!a&&typeof n=="function"&&(a=!0),n});if(a)return()=>{for(let o=0;o<l.length;o++){let n=l[o];typeof n=="function"?n():kd(e[o],null)}}}}Md(yS,"composeRefs");function he(...e){return vS.useCallback(yS(...e),e)}Md(he,"useComposedRefs");var ot=R(U(),1);var dw=Object.defineProperty,ca=(e,t)=>dw(e,"name",{value:t,configurable:!0});function da(e){let t=ot.forwardRef((a,l)=>{let{children:o,...n}=a,u=null,r=!1,s=[];Dd(o)&&typeof Ws=="function"&&(o=Ws(o._payload)),ot.Children.forEach(o,f=>{if(wS(f)){r=!0;let p=f,L="child"in p.props?p.props.child:p.props.children;Dd(L)&&typeof Ws=="function"&&(L=Ws(L._payload)),u=pw(p,L),s.push(u?.props?.children)}else s.push(f)}),u?u=ot.cloneElement(u,void 0,s):!r&&ot.Children.count(o)===1&&ot.isValidElement(o)&&(u=o);let i=u?IS(u):void 0,h=he(l,i);if(!u){if(o||o===0)throw new Error(r?xw(e):gw(e));return o}let m=bS(n,u.props??{});return u.type!==ot.Fragment&&(m.ref=l?h:i),ot.cloneElement(u,m)});return t.displayName=`${e}.Slot`,t}ca(da,"createSlot");var CS=Symbol.for("radix.slottable");function mw(e){let t=ca(a=>"child"in a?a.children(a.child):a.children,"Slottable");return t.displayName=`${e}.Slottable`,t.__radixId=CS,t}ca(mw,"createSlottable");var pw=ca((e,t)=>{if("child"in e.props){let a=e.props.child;return ot.isValidElement(a)?ot.cloneElement(a,void 0,e.props.children(a.props.children)):null}return ot.isValidElement(t)?t:null},"getSlottableElementFromSlottable");function bS(e,t){let a={...t};for(let l in t){let o=e[l],n=t[l];/^on[A-Z]/.test(l)?o&&n?a[l]=(...r)=>{let s=n(...r);return o(...r),s}:o&&(a[l]=o):l==="style"?a[l]={...o,...n}:l==="className"&&(a[l]=[o,n].filter(Boolean).join(" "))}return{...e,...a}}ca(bS,"mergeProps");function IS(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning;return a?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning,a?e.props.ref:e.props.ref||e.ref)}ca(IS,"getElementRef");function wS(e){return ot.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===CS}ca(wS,"isSlottable");var hw=Symbol.for("react.lazy");function Dd(e){return e!=null&&typeof e=="object"&&"$$typeof"in e&&e.$$typeof===hw&&"_payload"in e&&AS(e._payload)}ca(Dd,"isLazyComponent");function AS(e){return typeof e=="object"&&e!==null&&"then"in e}ca(AS,"isPromiseLike");var gw=ca(e=>`${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`,"createSlotError"),xw=ca(e=>`${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`,"createSlottableError"),Ws=ot[" use ".trim().toString()];var Js=R(V(),1),Rt=R(U(),1);var vo=R(V(),1);var Lw=Object.defineProperty,Qe=(e,t)=>Lw(e,"name",{value:t,configurable:!0});function Bd(e){let t=e+"CollectionProvider",[a,l]=ol(t),[o,n]=a(t,{collectionRef:{current:null},itemMap:new Map}),u=Qe(S=>{let{scope:v,children:g}=S,d=ma.useRef(null),c=ma.useRef(new Map).current;return(0,Js.jsx)(o,{scope:v,itemMap:c,collectionRef:d,children:g})},"CollectionProvider");u.displayName=t;let r=e+"CollectionSlot",s=da(r),i=ma.forwardRef((S,v)=>{let{scope:g,children:d}=S,c=n(r,g),x=he(v,c.collectionRef);return(0,Js.jsx)(s,{ref:x,children:d})});i.displayName=r;let h=e+"CollectionItemSlot",m="data-radix-collection-item",f=da(h),p=ma.forwardRef((S,v)=>{let{scope:g,children:d,...c}=S,x=ma.useRef(null),y=he(v,x),I=n(h,g);return ma.useEffect(()=>(I.itemMap.set(x,{ref:x,...c}),()=>{I.itemMap.delete(x)})),(0,Js.jsx)(f,{[m]:"",ref:y,children:d})});p.displayName=h;function L(S){let v=n(e+"CollectionConsumer",S);return ma.useCallback(()=>{let d=v.collectionRef.current;if(!d)return[];let c=Array.from(d.querySelectorAll(`[${m}]`));return Array.from(v.itemMap.values()).sort((I,b)=>c.indexOf(I.ref.current)-c.indexOf(b.ref.current))},[v.collectionRef,v.itemMap])}return Qe(L,"useCollection"),[{Provider:u,Slot:i,ItemSlot:p},L,l]}Qe(Bd,"createCollection");var RS=new WeakMap,ze,Nt,Ed=(Nt=class extends Map{constructor(a){super(a);Nm(this,ze);_i(this,ze,[...super.keys()]),RS.set(this,!0)}set(a,l){return RS.get(this)&&(this.has(a)?rt(this,ze)[rt(this,ze).indexOf(a)]=a:rt(this,ze).push(a)),super.set(a,l),this}insert(a,l,o){let n=this.has(l),u=rt(this,ze).length,r=Pd(a),s=r>=0?r:u+r,i=s<0||s>=u?-1:s;if(i===this.size||n&&i===this.size-1||i===-1)return this.set(l,o),this;let h=this.size+(n?0:1);r<0&&s++;let m=[...rt(this,ze)],f,p=!1;for(let L=s;L<h;L++)if(s===L){let S=m[L];m[L]===l&&(S=m[L+1]),n&&this.delete(l),f=this.get(S),this.set(l,o)}else{!p&&m[L-1]===l&&(p=!0);let S=m[p?L:L-1],v=f;f=this.get(S),this.delete(S),this.set(S,v)}return this}with(a,l,o){let n=new Nt(this);return n.insert(a,l,o),n}before(a){let l=rt(this,ze).indexOf(a)-1;if(!(l<0))return this.entryAt(l)}setBefore(a,l,o){let n=rt(this,ze).indexOf(a);return n===-1?this:this.insert(n,l,o)}after(a){let l=rt(this,ze).indexOf(a);if(l=l===-1||l===this.size-1?-1:l+1,l!==-1)return this.entryAt(l)}setAfter(a,l,o){let n=rt(this,ze).indexOf(a);return n===-1?this:this.insert(n+1,l,o)}first(){return this.entryAt(0)}last(){return this.entryAt(-1)}clear(){return _i(this,ze,[]),super.clear()}delete(a){let l=super.delete(a);return l&&rt(this,ze).splice(rt(this,ze).indexOf(a),1),l}deleteAt(a){let l=this.keyAt(a);return l!==void 0?this.delete(l):!1}at(a){let l=$s(rt(this,ze),a);if(l!==void 0)return this.get(l)}entryAt(a){let l=$s(rt(this,ze),a);if(l!==void 0)return[l,this.get(l)]}indexOf(a){return rt(this,ze).indexOf(a)}keyAt(a){return $s(rt(this,ze),a)}from(a,l){let o=this.indexOf(a);if(o===-1)return;let n=o+l;return n<0&&(n=0),n>=this.size&&(n=this.size-1),this.at(n)}keyFrom(a,l){let o=this.indexOf(a);if(o===-1)return;let n=o+l;return n<0&&(n=0),n>=this.size&&(n=this.size-1),this.keyAt(n)}find(a,l){let o=0;for(let n of this){if(Reflect.apply(a,l,[n,o,this]))return n;o++}}findIndex(a,l){let o=0;for(let n of this){if(Reflect.apply(a,l,[n,o,this]))return o;o++}return-1}filter(a,l){let o=[],n=0;for(let u of this)Reflect.apply(a,l,[u,n,this])&&o.push(u),n++;return new Nt(o)}map(a,l){let o=[],n=0;for(let u of this)o.push([u[0],Reflect.apply(a,l,[u,n,this])]),n++;return new Nt(o)}reduce(...a){let[l,o]=a,n=0,u=o??this.at(0);for(let r of this)n===0&&a.length===1?u=r:u=Reflect.apply(l,this,[u,r,n,this]),n++;return u}reduceRight(...a){let[l,o]=a,n=o??this.at(-1);for(let u=this.size-1;u>=0;u--){let r=this.at(u);u===this.size-1&&a.length===1?n=r:n=Reflect.apply(l,this,[n,r,u,this])}return n}toSorted(a){let l=[...this.entries()].sort(a);return new Nt(l)}toReversed(){let a=new Nt;for(let l=this.size-1;l>=0;l--){let o=this.keyAt(l),n=this.get(o);a.set(o,n)}return a}toSpliced(...a){let l=[...this.entries()];return l.splice(...a),new Nt(l)}slice(a,l){let o=new Nt,n=this.size-1;if(a===void 0)return o;a<0&&(a=a+this.size),l!==void 0&&l>0&&(n=l-1);for(let u=a;u<=n;u++){let r=this.keyAt(u),s=this.get(r);o.set(r,s)}return o}every(a,l){let o=0;for(let n of this){if(!Reflect.apply(a,l,[n,o,this]))return!1;o++}return!0}some(a,l){let o=0;for(let n of this){if(Reflect.apply(a,l,[n,o,this]))return!0;o++}return!1}},ze=new WeakMap,Qe(Nt,"OrderedDict"),Nt);function $s(e,t){if("at"in Array.prototype)return Array.prototype.at.call(e,t);let a=TS(e,t);return a===-1?void 0:e[a]}Qe($s,"at");function TS(e,t){let a=e.length,l=Pd(t),o=l>=0?l:a+l;return o<0||o>=a?-1:o}Qe(TS,"toSafeIndex");function Pd(e){return e!==e||e===0?0:Math.trunc(e)}Qe(Pd,"toSafeInteger");function Sw(e){let t=e+"CollectionProvider",[a,l]=ol(t),[o,n]=a(t,{collectionElement:null,collectionRef:{current:null},collectionRefObject:{current:null},itemMap:new Ed,setItemMap:Qe(()=>{},"setItemMap")}),u=Qe(({state:c,...x})=>c?(0,vo.jsx)(s,{...x,state:c}):(0,vo.jsx)(r,{...x}),"CollectionProvider");u.displayName=t;let r=Qe(c=>{let x=v();return(0,vo.jsx)(s,{...c,state:x})},"CollectionInit");r.displayName=t+"Init";let s=Qe(c=>{let{scope:x,children:y,state:I}=c,b=Rt.useRef(null),[C,A]=Rt.useState(null),T=he(b,A),[B,O]=I;return Rt.useEffect(()=>{if(!C)return;let _=DS(()=>{});return _.observe(C,{childList:!0,subtree:!0}),()=>{_.disconnect()}},[C]),(0,vo.jsx)(o,{scope:x,itemMap:B,setItemMap:O,collectionRef:T,collectionRefObject:b,collectionElement:C,children:y})},"CollectionProviderImpl");s.displayName=t+"Impl";let i=e+"CollectionSlot",h=da(i),m=Rt.forwardRef((c,x)=>{let{scope:y,children:I}=c,b=n(i,y),C=he(x,b.collectionRef);return(0,vo.jsx)(h,{ref:C,children:I})});m.displayName=i;let f=e+"CollectionItemSlot",p="data-radix-collection-item",L=da(f),S=Rt.forwardRef((c,x)=>{let{scope:y,children:I,...b}=c,C=Rt.useRef(null),[A,T]=Rt.useState(null),B=he(x,C,T),O=n(f,y),{setItemMap:_}=O,Q=Rt.useRef(b);kS(Q.current,b)||(Q.current=b);let ae=Q.current;return Rt.useEffect(()=>{let H=ae;return _(j=>A?j.has(A)?j.set(A,{...H,element:A}).toSorted(Od):(j.set(A,{...H,element:A}),j.toSorted(Od)):j),()=>{_(j=>!A||!j.has(A)?j:(j.delete(A),new Ed(j)))}},[A,ae,_]),(0,vo.jsx)(L,{[p]:"",ref:B,children:I})});S.displayName=f;function v(){return Rt.useState(new Ed)}Qe(v,"useInitCollection");function g(c){let{itemMap:x}=n(e+"CollectionConsumer",c);return x}return Qe(g,"useCollection"),[{Provider:u,Slot:m,ItemSlot:S},{createCollectionScope:l,useCollection:g,useInitCollection:v}]}Qe(Sw,"createCollection");function kS(e,t){if(e===t)return!0;if(typeof e!="object"||typeof t!="object"||e==null||t==null)return!1;let a=Object.keys(e),l=Object.keys(t);if(a.length!==l.length)return!1;for(let o of a)if(!Object.prototype.hasOwnProperty.call(t,o)||e[o]!==t[o])return!1;return!0}Qe(kS,"shallowEqual");function MS(e,t){return!!(t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_PRECEDING)}Qe(MS,"isElementPreceding");function Od(e,t){return!e[1].element||!t[1].element?0:MS(e[1].element,t[1].element)?-1:1}Qe(Od,"sortByDocumentPosition");function DS(e){return new MutationObserver(a=>{for(let l of a)if(l.type==="childList"){e();return}})}Qe(DS,"getChildListObserver");var ei=R(U(),1),Cw=R(V(),1),vw=Object.defineProperty,yw=(e,t)=>vw(e,"name",{value:t,configurable:!0}),bw=ei.createContext(void 0);function _d(e){let t=ei.useContext(bw);return e||t||"ltr"}yw(_d,"useDirection");var de=R(U(),1);var ES=R(U(),1),OS=R(Jn(),1);var BS=R(V(),1),Iw=Object.defineProperty,ww=(e,t)=>Iw(e,"name",{value:t,configurable:!0}),Aw=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],it=Aw.reduce((e,t)=>{let a=da(`Primitive.${t}`),l=ES.forwardRef((o,n)=>{let{asChild:u,...r}=o,s=u?a:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),(0,BS.jsx)(s,{...r,ref:n})});return l.displayName=`Primitive.${t}`,{...e,[t]:l}},{});function Ud(e,t){e&&OS.flushSync(()=>e.dispatchEvent(t))}ww(Ud,"dispatchDiscreteCustomEvent");var On=R(U(),1),Rw=Object.defineProperty,Tw=(e,t)=>Rw(e,"name",{value:t,configurable:!0});function Tt(e){let t=On.useRef(e);return On.useEffect(()=>{t.current=e}),On.useMemo(()=>((...a)=>t.current?.(...a)),[])}Tw(Tt,"useCallbackRef");var _S=R(V(),1),kw=Object.defineProperty,We=(e,t)=>kw(e,"name",{value:t,configurable:!0}),Hd="dismissableLayer.update",Mw="dismissableLayer.pointerDownOutside",Dw="dismissableLayer.focusOutside",PS,US=de.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set,dismissableSurfaces:new Set}),HS=de.forwardRef(We(function(t,a){let{disableOutsidePointerEvents:l=!1,deferPointerDownOutside:o=!1,onEscapeKeyDown:n,onPointerDownOutside:u,onFocusOutside:r,onInteractOutside:s,onDismiss:i,...h}=t,m=de.useContext(US),[f,p]=de.useState(null),L=f?.ownerDocument??globalThis?.document,[,S]=de.useState({}),v=he(a,p),g=Array.from(m.layers),[d]=[...m.layersWithOutsidePointerEventsDisabled].slice(-1),c=d?g.indexOf(d):-1,x=f?g.indexOf(f):-1,y=m.layersWithOutsidePointerEventsDisabled.size>0,I=x>=c,b=de.useRef(!1),C=zS(O=>{u?.(O),s?.(O),O.defaultPrevented||i?.()},{ownerDocument:L,deferPointerDownOutside:o,isDeferredPointerDownOutsideRef:b,dismissableSurfaces:m.dismissableSurfaces,shouldHandlePointerDownOutside:de.useCallback(O=>{if(!(O instanceof Node))return!1;let _=[...m.branches].some(Q=>Q.contains(O));return I&&!_},[m.branches,I])}),A=NS(O=>{if(o&&b.current)return;let _=O.target;[...m.branches].some(ae=>ae.contains(_))||(r?.(O),s?.(O),O.defaultPrevented||i?.())},L),T=f?x===g.length-1:!1,B=Tt(O=>{O.key==="Escape"&&(n?.(O),!O.defaultPrevented&&i&&(O.preventDefault(),i()))});return de.useEffect(()=>{if(T)return L.addEventListener("keydown",B,{capture:!0}),()=>L.removeEventListener("keydown",B,{capture:!0})},[L,T,B]),de.useEffect(()=>{if(f)return l&&(m.layersWithOutsidePointerEventsDisabled.size===0&&(PS=L.body.style.pointerEvents,L.body.style.pointerEvents="none"),m.layersWithOutsidePointerEventsDisabled.add(f)),m.layers.add(f),zd(),()=>{l&&(m.layersWithOutsidePointerEventsDisabled.delete(f),m.layersWithOutsidePointerEventsDisabled.size===0&&(L.body.style.pointerEvents=PS))}},[f,L,l,m]),de.useEffect(()=>()=>{f&&(m.layers.delete(f),m.layersWithOutsidePointerEventsDisabled.delete(f),zd())},[f,m]),de.useEffect(()=>{let O=We(()=>S({}),"handleUpdate");return document.addEventListener(Hd,O),()=>document.removeEventListener(Hd,O)},[]),(0,_S.jsx)(it.div,{...h,ref:v,style:{pointerEvents:y?I?"auto":"none":void 0,...t.style},onFocusCapture:He(t.onFocusCapture,A.onFocusCapture),onBlurCapture:He(t.onBlurCapture,A.onBlurCapture),onPointerDownCapture:He(t.onPointerDownCapture,C.onPointerDownCapture)})},"DismissableLayer"));function Ew(){let e=de.useContext(US),[t,a]=de.useState(null);return de.useEffect(()=>{if(t)return e.dismissableSurfaces.add(t),()=>{e.dismissableSurfaces.delete(t)}},[t,e.dismissableSurfaces]),a}We(Ew,"useDismissableLayerSurface");var Ow=We(()=>!0,"IS_TRUE");function zS(e,t){let{ownerDocument:a=globalThis?.document,deferPointerDownOutside:l=!1,isDeferredPointerDownOutsideRef:o,dismissableSurfaces:n,shouldHandlePointerDownOutside:u=Ow}=t,r=Tt(e),s=de.useRef(!1),i=de.useRef(!1),h=de.useRef(new Map),m=de.useRef(()=>{});return de.useEffect(()=>{function f(){i.current=!1,o.current=!1,h.current.clear()}We(f,"resetOutsideInteraction");function p(){return Array.from(h.current.values()).some(Boolean)}We(p,"isOutsideInteractionIntercepted");function L(c){if(!i.current)return;let x=c.target;x instanceof Node&&[...n].some(I=>I.contains(x))||h.current.set(c.type,!0),c.type==="click"&&window.setTimeout(()=>{i.current&&m.current()},0)}We(L,"handleInteractionCapture");function S(c){i.current&&h.current.set(c.type,!1)}We(S,"handleInteractionBubble");let v=We(c=>{if(c.target&&!s.current){let y=function(){a.removeEventListener("click",m.current);let b=p();f(),b||Nd(Mw,r,I,{discrete:!0})};var x=y;if(We(y,"handleAndDispatchPointerDownOutsideEvent"),!u(c.target)){a.removeEventListener("click",m.current),f(),s.current=!1;return}let I={originalEvent:c};i.current=!0,o.current=l&&c.button===0,h.current.clear(),!l||c.button!==0?y():(a.removeEventListener("click",m.current),m.current=y,a.addEventListener("click",m.current,{once:!0}))}else a.removeEventListener("click",m.current),f();s.current=!1},"handlePointerDown"),g=["pointerup","mousedown","mouseup","touchstart","touchend","click"];for(let c of g)a.addEventListener(c,L,!0),a.addEventListener(c,S);let d=window.setTimeout(()=>{a.addEventListener("pointerdown",v)},0);return()=>{window.clearTimeout(d),a.removeEventListener("pointerdown",v),a.removeEventListener("click",m.current);for(let c of g)a.removeEventListener(c,L,!0),a.removeEventListener(c,S)}},[a,r,l,o,n,u]),{onPointerDownCapture:We(()=>s.current=!0,"onPointerDownCapture")}}We(zS,"usePointerDownOutside");function NS(e,t=globalThis?.document){let a=Tt(e),l=de.useRef(!1);return de.useEffect(()=>{let o=We(n=>{n.target&&!l.current&&Nd(Dw,a,{originalEvent:n},{discrete:!1})},"handleFocus");return t.addEventListener("focusin",o),()=>t.removeEventListener("focusin",o)},[t,a]),{onFocusCapture:We(()=>l.current=!0,"onFocusCapture"),onBlurCapture:We(()=>l.current=!1,"onBlurCapture")}}We(NS,"useFocusOutside");function zd(){let e=new CustomEvent(Hd);document.dispatchEvent(e)}We(zd,"dispatchUpdate");function Nd(e,t,a,{discrete:l}){let o=a.originalEvent.target,n=new CustomEvent(e,{bubbles:!1,cancelable:!0,detail:a});t&&o.addEventListener(e,t,{once:!0}),l?Ud(o,n):o.dispatchEvent(n)}We(Nd,"handleAndDispatchCustomEvent");var qS=R(U(),1),Bw=Object.defineProperty,Fd=(e,t)=>Bw(e,"name",{value:t,configurable:!0}),ti=0,Bn=null;function Pw(e){return ai(),e.children}Fd(Pw,"FocusGuards");function ai(){qS.useEffect(()=>{Bn||(Bn={start:qd(),end:qd()});let{start:e,end:t}=Bn;return document.body.firstElementChild!==e&&document.body.insertAdjacentElement("afterbegin",e),document.body.lastElementChild!==t&&document.body.insertAdjacentElement("beforeend",t),ti++,()=>{ti===1&&(Bn?.start.remove(),Bn?.end.remove(),Bn=null),ti=Math.max(0,ti-1)}},[])}Fd(ai,"useFocusGuards");function qd(){let e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.outline="none",e.style.opacity="0",e.style.position="fixed",e.style.pointerEvents="none",e}Fd(qd,"createFocusGuard");var oa=R(U(),1);var GS=R(V(),1),_w=Object.defineProperty,gt=(e,t)=>_w(e,"name",{value:t,configurable:!0}),Vd="focusScope.autoFocusOnMount",Gd="focusScope.autoFocusOnUnmount",FS={bubbles:!1,cancelable:!0},XS=oa.forwardRef(gt(function(t,a){let{loop:l=!1,trapped:o=!1,onMountAutoFocus:n,onUnmountAutoFocus:u,...r}=t,[s,i]=oa.useState(null),h=Tt(n),m=Tt(u),f=oa.useRef(null),p=he(a,i),L=oa.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;oa.useEffect(()=>{if(o){let c=function(b){if(L.paused||!s)return;let C=b.target;s.contains(C)?f.current=C:nl(f.current,{select:!0})},x=function(b){if(L.paused||!s)return;let C=b.relatedTarget;C!==null&&(s.contains(C)||nl(f.current,{select:!0}))},y=function(b){if(document.activeElement===document.body)for(let A of b)A.removedNodes.length>0&&nl(s)};var v=c,g=x,d=y;gt(c,"handleFocusIn"),gt(x,"handleFocusOut"),gt(y,"handleMutations"),document.addEventListener("focusin",c),document.addEventListener("focusout",x);let I=new MutationObserver(y);return s&&I.observe(s,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",c),document.removeEventListener("focusout",x),I.disconnect()}}},[o,s,L.paused]),oa.useEffect(()=>{if(s){VS.add(L);let v=document.activeElement;if(!s.contains(v)){let d=new CustomEvent(Vd,FS);s.addEventListener(Vd,h),s.dispatchEvent(d),d.defaultPrevented||(jS(WS(Yd(s)),{select:!0}),document.activeElement===v&&nl(s))}return()=>{s.removeEventListener(Vd,h),setTimeout(()=>{let d=new CustomEvent(Gd,FS);s.addEventListener(Gd,m),s.dispatchEvent(d),d.defaultPrevented||nl(v??document.body,{select:!0}),s.removeEventListener(Gd,m),VS.remove(L)},0)}}},[s,h,m,L]);let S=oa.useCallback(v=>{if(!l&&!o||L.paused)return;let g=v.key==="Tab"&&!v.altKey&&!v.ctrlKey&&!v.metaKey,d=document.activeElement;if(g&&d){let c=v.currentTarget,[x,y]=YS(c);x&&y?!v.shiftKey&&d===y?(v.preventDefault(),l&&nl(x,{select:!0})):v.shiftKey&&d===x&&(v.preventDefault(),l&&nl(y,{select:!0})):d===c&&v.preventDefault()}},[l,o,L.paused]);return(0,GS.jsx)(it.div,{tabIndex:-1,...r,ref:p,onKeyDown:S})},"FocusScope"));function jS(e,{select:t=!1}={}){let a=document.activeElement;for(let l of e)if(nl(l,{select:t}),document.activeElement!==a)return}gt(jS,"focusFirst");function YS(e){let t=Yd(e),a=Xd(t,e),l=Xd(t.reverse(),e);return[a,l]}gt(YS,"getTabbableEdges");function Yd(e){let t=[],a=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:gt(l=>{let o=l.tagName==="INPUT"&&l.type==="hidden";return l.disabled||l.hidden||o?NodeFilter.FILTER_SKIP:l.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP},"acceptNode")});for(;a.nextNode();)t.push(a.currentNode);return t}gt(Yd,"getTabbableCandidates");function Xd(e,t){let a=typeof t.checkVisibility=="function"&&t.checkVisibility({checkVisibilityCSS:!0});for(let l of e)if(!(a?!l.checkVisibility({checkVisibilityCSS:!0}):KS(l,{upTo:t})))return l}gt(Xd,"findVisible");function KS(e,{upTo:t}){if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(t!==void 0&&e===t)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1}gt(KS,"isHidden");function ZS(e){return e instanceof HTMLInputElement&&"select"in e}gt(ZS,"isSelectableInput");function nl(e,{select:t=!1}={}){if(e&&e.focus){let a=document.activeElement;e.focus({preventScroll:!0}),e!==a&&ZS(e)&&t&&e.select()}}gt(nl,"focus");var VS=QS();function QS(){let e=[];return{add(t){let a=e[0];t!==a&&a?.pause(),e=jd(e,t),e.unshift(t)},remove(t){e=jd(e,t),e[0]?.resume()}}}gt(QS,"createFocusScopesStack");function jd(e,t){let a=[...e],l=a.indexOf(t);return l!==-1&&a.splice(l,1),a}gt(jd,"arrayRemove");function WS(e){return e.filter(t=>t.tagName!=="A")}gt(WS,"removeLinks");var Kd=R(U(),1);var JS=R(U(),1),Ee=globalThis?.document?JS.useLayoutEffect:()=>{};var Uw=Object.defineProperty,Hw=(e,t)=>Uw(e,"name",{value:t,configurable:!0}),zw=Kd[" useId ".trim().toString()]||(()=>{}),Nw=0;function li(e){let[t,a]=Kd.useState(zw());return Ee(()=>{e||a(l=>l??String(Nw++))},[e]),e||(t?`radix-${t}`:"")}Hw(li,"useId");var ft=R(U(),1);var tv=["top","right","bottom","left"];var Da=Math.min,pa=Math.max,ar=Math.round,lr=Math.floor,Ea=e=>({x:e,y:e}),qw={left:"right",right:"left",bottom:"top",top:"bottom"};function Zd(e,t,a){return pa(e,Da(t,a))}function Oa(e,t){return typeof e=="function"?e(t):e}function ul(e){return e.split("-")[0]}function yo(e){return e.split("-")[1]}function ni(e){return e==="x"?"y":"x"}function ui(e){return e==="y"?"height":"width"}function ha(e){let t=e[0];return t==="t"||t==="b"?"y":"x"}function ri(e){return ni(ha(e))}function av(e,t,a){a===void 0&&(a=!1);let l=yo(e),o=ri(e),n=ui(o),u=o==="x"?l===(a?"end":"start")?"right":"left":l==="start"?"bottom":"top";return t.reference[n]>t.floating[n]&&(u=tr(u)),[u,tr(u)]}function lv(e){let t=tr(e);return[oi(e),t,oi(t)]}function oi(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}var $S=["left","right"],ev=["right","left"],Fw=["top","bottom"],Vw=["bottom","top"];function Gw(e,t,a){switch(e){case"top":case"bottom":return a?t?ev:$S:t?$S:ev;case"left":case"right":return t?Fw:Vw;default:return[]}}function ov(e,t,a,l){let o=yo(e),n=Gw(ul(e),a==="start",l);return o&&(n=n.map(u=>u+"-"+o),t&&(n=n.concat(n.map(oi)))),n}function tr(e){let t=ul(e);return qw[t]+e.slice(t.length)}function Xw(e){var t,a,l,o;return{top:(t=e.top)!=null?t:0,right:(a=e.right)!=null?a:0,bottom:(l=e.bottom)!=null?l:0,left:(o=e.left)!=null?o:0}}function Qd(e){return typeof e!="number"?Xw(e):{top:e,right:e,bottom:e,left:e}}function Co(e){let{x:t,y:a,width:l,height:o}=e;return{width:l,height:o,top:a,left:t,right:t+l,bottom:a+o,x:t,y:a}}function nv(e,t,a){let{reference:l,floating:o}=e,n=ha(t),u=ri(t),r=ui(u),s=ul(t),i=n==="y",h=l.x+l.width/2-o.width/2,m=l.y+l.height/2-o.height/2,f=l[r]/2-o[r]/2,p;switch(s){case"top":p={x:h,y:l.y-o.height};break;case"bottom":p={x:h,y:l.y+l.height};break;case"right":p={x:l.x+l.width,y:m};break;case"left":p={x:l.x-o.width,y:m};break;default:p={x:l.x,y:l.y}}let L=yo(t);return L&&(p[u]+=f*(L==="end"?1:-1)*(a&&i?-1:1)),p}async function sv(e,t){var a;t===void 0&&(t={});let{x:l,y:o,platform:n,rects:u,elements:r,strategy:s}=e,{boundary:i="clippingAncestors",rootBoundary:h="viewport",elementContext:m="floating",altBoundary:f=!1,padding:p=0}=Oa(t,e),L=Qd(p),v=r[f?m==="floating"?"reference":"floating":m],g=Co(await n.getClippingRect({element:(a=await(n.isElement==null?void 0:n.isElement(v)))==null||a?v:v.contextElement||await(n.getDocumentElement==null?void 0:n.getDocumentElement(r.floating)),boundary:i,rootBoundary:h,strategy:s})),d=m==="floating"?{x:l,y:o,width:u.floating.width,height:u.floating.height}:u.reference,c=await(n.getOffsetParent==null?void 0:n.getOffsetParent(r.floating)),x=await(n.isElement==null?void 0:n.isElement(c))&&await(n.getScale==null?void 0:n.getScale(c))||{x:1,y:1},y=Co(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:r,rect:d,offsetParent:c,strategy:s}):d);return{top:(g.top-y.top+L.top)/x.y,bottom:(y.bottom-g.bottom+L.bottom)/x.y,left:(g.left-y.left+L.left)/x.x,right:(y.right-g.right+L.right)/x.x}}var jw=50,iv=async(e,t,a)=>{let{placement:l="bottom",strategy:o="absolute",middleware:n=[],platform:u}=a,r=u.detectOverflow?u:{...u,detectOverflow:sv},s=await(u.isRTL==null?void 0:u.isRTL(t)),i=await u.getElementRects({reference:e,floating:t,strategy:o}),{x:h,y:m}=nv(i,l,s),f=l,p=0,L={};for(let S=0;S<n.length;S++){let v=n[S];if(!v)continue;let{name:g,fn:d}=v,{x:c,y:x,data:y,reset:I}=await d({x:h,y:m,initialPlacement:l,placement:f,strategy:o,middlewareData:L,rects:i,platform:r,elements:{reference:e,floating:t}});h=c??h,m=x??m,L[g]={...L[g],...y},I&&p<jw&&(p++,typeof I=="object"&&(I.placement&&(f=I.placement),I.rects&&(i=I.rects===!0?await u.getElementRects({reference:e,floating:t,strategy:o}):I.rects),{x:h,y:m}=nv(i,f,s)),S=-1)}return{x:h,y:m,placement:f,strategy:o,middlewareData:L}},fv=e=>({name:"arrow",options:e,async fn(t){let{x:a,y:l,placement:o,rects:n,platform:u,elements:r,middlewareData:s}=t,{element:i,padding:h=0}=Oa(e,t)||{};if(i==null)return{};let m=Qd(h),f={x:a,y:l},p=ri(o),L=ui(p),S=await u.getDimensions(i),v=p==="y",g=v?"top":"left",d=v?"bottom":"right",c=v?"clientHeight":"clientWidth",x=n.reference[L]+n.reference[p]-f[p]-n.floating[L],y=f[p]-n.reference[p],I=await(u.getOffsetParent==null?void 0:u.getOffsetParent(i)),b=I?I[c]:0;(!b||!await(u.isElement==null?void 0:u.isElement(I)))&&(b=r.floating[c]||n.floating[L]);let C=x/2-y/2,A=b/2-S[L]/2-1,T=Da(m[g],A),B=Da(m[d],A),O=b-S[L]-B,_=b/2-S[L]/2+C,Q=Zd(T,_,O),ae=!s.arrow&&yo(o)!=null&&_!==Q&&n.reference[L]/2-(_<T?T:B)-S[L]/2<0,H=ae?_<T?_-T:_-O:0;return{[p]:f[p]+H,data:{[p]:Q,centerOffset:_-Q-H,...ae&&{alignmentOffset:H}},reset:ae}}});var cv=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var a,l;let{placement:o,middlewareData:n,rects:u,initialPlacement:r,platform:s,elements:i}=t,{mainAxis:h=!0,crossAxis:m=!0,fallbackPlacements:f,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:L="none",flipAlignment:S=!0,...v}=Oa(e,t);if((a=n.arrow)!=null&&a.alignmentOffset)return{};let g=ul(o),d=ha(r),c=ul(r)===r,x=await(s.isRTL==null?void 0:s.isRTL(i.floating)),y=f||(c||!S?[tr(r)]:lv(r)),I=L!=="none";!f&&I&&y.push(...ov(r,S,L,x));let b=[r,...y],C=await s.detectOverflow(t,v),A=[],T=((l=n.flip)==null?void 0:l.overflows)||[];if(h&&A.push(C[g]),m){let Q=av(o,u,x);A.push(C[Q[0]],C[Q[1]])}if(T=[...T,{placement:o,overflows:A}],!A.every(Q=>Q<=0)){var B,O;let Q=(((B=n.flip)==null?void 0:B.index)||0)+1,ae=b[Q];if(ae&&(!(m==="alignment"?d!==ha(ae):!1)||T.every(z=>ha(z.placement)===d?z.overflows[0]>0:!0)))return{data:{index:Q,overflows:T},reset:{placement:ae}};let H=(O=T.filter(j=>j.overflows[0]<=0).sort((j,z)=>j.overflows[1]-z.overflows[1])[0])==null?void 0:O.placement;if(!H)switch(p){case"bestFit":{var _;let j=(_=T.filter(z=>{if(I){let le=ha(z.placement);return le===d||le==="y"}return!0}).map(z=>[z.placement,z.overflows.filter(le=>le>0).reduce((le,k)=>le+k,0)]).sort((z,le)=>z[1]-le[1])[0])==null?void 0:_[0];j&&(H=j);break}case"initialPlacement":H=r;break}if(o!==H)return{reset:{placement:H}}}return{}}}};function uv(e,t){return{top:e.top-t.height,right:e.right-t.width,bottom:e.bottom-t.height,left:e.left-t.width}}function rv(e){return tv.some(t=>e[t]>=0)}var dv=function(e){return e===void 0&&(e={}),{name:"hide",options:e,async fn(t){let{rects:a,platform:l}=t,{strategy:o="referenceHidden",...n}=Oa(e,t);switch(o){case"referenceHidden":{let u=await l.detectOverflow(t,{...n,elementContext:"reference"}),r=uv(u,a.reference);return{data:{referenceHiddenOffsets:r,referenceHidden:rv(r)}}}case"escaped":{let u=await l.detectOverflow(t,{...n,altBoundary:!0}),r=uv(u,a.floating);return{data:{escapedOffsets:r,escaped:rv(r)}}}default:return{}}}}};var mv=new Set(["left","top"]);async function Yw(e,t){let{placement:a,platform:l,elements:o}=e,n=await(l.isRTL==null?void 0:l.isRTL(o.floating)),u=ul(a),r=yo(a),s=ha(a)==="y",i=mv.has(u)?-1:1,h=n&&s?-1:1,m=Oa(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:L}=typeof m=="number"?{mainAxis:m,crossAxis:0,alignmentAxis:null}:{mainAxis:m.mainAxis||0,crossAxis:m.crossAxis||0,alignmentAxis:m.alignmentAxis};return r&&typeof L=="number"&&(p=r==="end"?L*-1:L),s?{x:p*h,y:f*i}:{x:f*i,y:p*h}}var pv=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var a,l;let{x:o,y:n,placement:u,middlewareData:r}=t,s=await Yw(t,e);return u===((a=r.offset)==null?void 0:a.placement)&&(l=r.arrow)!=null&&l.alignmentOffset?{}:{x:o+s.x,y:n+s.y,data:{...s,placement:u}}}}},hv=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){let{x:a,y:l,placement:o,platform:n}=t,{mainAxis:u=!0,crossAxis:r=!1,limiter:s={fn:d=>{let{x:c,y:x}=d;return{x:c,y:x}}},...i}=Oa(e,t),h={x:a,y:l},m=await n.detectOverflow(t,i),f=ha(o),p=ni(f),L=h[p],S=h[f],v=(d,c)=>Zd(c+m[d==="y"?"top":"left"],c,c-m[d==="y"?"bottom":"right"]);u&&(L=v(p,L)),r&&(S=v(f,S));let g=s.fn({...t,[p]:L,[f]:S});return{...g,data:{x:g.x-a,y:g.y-l,enabled:{[p]:u,[f]:r}}}}}},gv=function(e){return e===void 0&&(e={}),{options:e,fn(t){var a,l;let{x:o,y:n,placement:u,rects:r,middlewareData:s}=t,{offset:i=0,mainAxis:h=!0,crossAxis:m=!0}=Oa(e,t),f={x:o,y:n},p=ha(u),L=ni(p),S=f[L],v=f[p],g=Oa(i,t),d=typeof g=="number"?{mainAxis:g,crossAxis:0}:{mainAxis:(a=g.mainAxis)!=null?a:0,crossAxis:(l=g.crossAxis)!=null?l:0};if(h){let y=L==="y"?"height":"width",I=r.reference[L]-r.floating[y]+d.mainAxis,b=r.reference[L]+r.reference[y]-d.mainAxis;S<I?S=I:S>b&&(S=b)}if(m){var c,x;let y=L==="y"?"width":"height",I=mv.has(ul(u)),b=r.reference[p]-r.floating[y]+(I&&((c=s.offset)==null?void 0:c[p])||0)+(I?0:d.crossAxis),C=r.reference[p]+r.reference[y]+(I?0:((x=s.offset)==null?void 0:x[p])||0)-(I?d.crossAxis:0);v<b?v=b:v>C&&(v=C)}return{[L]:S,[p]:v}}}},xv=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){let{placement:a,rects:l,platform:o,elements:n}=t,{apply:u=()=>{},...r}=Oa(e,t),s=await o.detectOverflow(t,r),i=ul(a),h=yo(a),m=ha(a)==="y",{width:f,height:p}=l.floating,L,S;i==="top"||i==="bottom"?(L=i,S=h===(await(o.isRTL==null?void 0:o.isRTL(n.floating))?"start":"end")?"left":"right"):(S=i,L=h==="end"?"top":"bottom");let v=p-s.top-s.bottom,g=f-s.left-s.right,d=Da(p-s[L],v),c=Da(f-s[S],g),x=t.middlewareData.shift,y=!x,I=d,b=c;x!=null&&x.enabled.x&&(b=g),x!=null&&x.enabled.y&&(I=v),y&&!h&&(m?b=f-2*pa(s.left,s.right):I=p-2*pa(s.top,s.bottom)),await u({...t,availableWidth:b,availableHeight:I});let C=await o.getDimensions(n.floating);return f!==C.width||p!==C.height?{reset:{rects:!0}}:{}}}};function si(){return typeof window<"u"}function wo(e){return Sv(e)?(e.nodeName||"").toLowerCase():"#document"}function xt(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Ba(e){var t;return(t=(Sv(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function Sv(e){return si()?e instanceof Node||e instanceof xt(e).Node:!1}function ga(e){return si()?e instanceof Element||e instanceof xt(e).Element:!1}function rl(e){return si()?e instanceof HTMLElement||e instanceof xt(e).HTMLElement:!1}function Lv(e){return!si()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof xt(e).ShadowRoot}function or(e){let{overflow:t,overflowX:a,overflowY:l,display:o}=xa(e);return/auto|scroll|overlay|hidden|clip/.test(t+l+a)&&o!=="inline"&&o!=="contents"}function vv(e){return/^(table|td|th)$/.test(wo(e))}function nr(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}var Kw=/transform|translate|scale|rotate|perspective|filter/,Zw=/paint|layout|strict|content/,bo=e=>!!e&&e!=="none",Wd;function ii(e){let t=ga(e)?xa(e):e;return bo(t.transform)||bo(t.translate)||bo(t.scale)||bo(t.rotate)||bo(t.perspective)||!fi()&&(bo(t.backdropFilter)||bo(t.filter))||Kw.test(t.willChange||"")||Zw.test(t.contain||"")}function yv(e){let t=Vl(e);for(;rl(t)&&!Pn(t);){if(ii(t))return t;if(nr(t))return null;t=Vl(t)}return null}function fi(){return Wd==null&&(Wd=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Wd}function Pn(e){return/^(html|body|#document)$/.test(wo(e))}function xa(e){return xt(e).getComputedStyle(e)}function ur(e){return ga(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Vl(e){if(wo(e)==="html")return e;let t=e.assignedSlot||e.parentNode||Lv(e)&&e.host||Ba(e);return Lv(t)?t.host:t}function Cv(e){let t=Vl(e);return Pn(t)?(e.ownerDocument||e).body:rl(t)&&or(t)?t:Cv(t)}function Io(e,t,a){var l;t===void 0&&(t=[]),a===void 0&&(a=!0);let o=Cv(e),n=o===((l=e.ownerDocument)==null?void 0:l.body),u=xt(o);if(n){let r=ci(u);return t.concat(u,u.visualViewport||[],or(o)?o:[],r&&a?Io(r):[])}else return t.concat(o,Io(o,[],a))}function ci(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function wv(e){let t=xa(e),a=parseFloat(t.width)||0,l=parseFloat(t.height)||0,o=rl(e),n=o?e.offsetWidth:a,u=o?e.offsetHeight:l,r=ar(a)!==n||ar(l)!==u;return r&&(a=n,l=u),{width:a,height:l,$:r}}function $d(e){return ga(e)?e:e.contextElement}function _n(e){let t=$d(e);if(!rl(t))return Ea(1);let a=t.getBoundingClientRect(),{width:l,height:o,$:n}=wv(t),u=(n?ar(a.width):a.width)/l,r=(n?ar(a.height):a.height)/o;return(!u||!Number.isFinite(u))&&(u=1),(!r||!Number.isFinite(r))&&(r=1),{x:u,y:r}}var Qw=Ea(0);function Av(e){let t=xt(e);return!fi()||!t.visualViewport?Qw:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Ww(e,t,a){return t===void 0&&(t=!1),!!a&&t&&a===xt(e)}function Ao(e,t,a,l){t===void 0&&(t=!1),a===void 0&&(a=!1);let o=e.getBoundingClientRect(),n=$d(e),u=Ea(1);t&&(l?ga(l)&&(u=_n(l)):u=_n(e));let r=Ww(n,a,l)?Av(n):Ea(0),s=(o.left+r.x)/u.x,i=(o.top+r.y)/u.y,h=o.width/u.x,m=o.height/u.y;if(n&&l){let f=xt(n),p=ga(l)?xt(l):l,L=f,S=ci(L);for(;S&&p!==L;){let v=_n(S),g=S.getBoundingClientRect(),d=xa(S),c=g.left+(S.clientLeft+parseFloat(d.paddingLeft))*v.x,x=g.top+(S.clientTop+parseFloat(d.paddingTop))*v.y;s*=v.x,i*=v.y,h*=v.x,m*=v.y,s+=c,i+=x,L=xt(S),S=ci(L)}}return Co({width:h,height:m,x:s,y:i})}function di(e,t){let a=ur(e).scrollLeft;return t?t.left+a:Ao(Ba(e)).left+a}function Rv(e,t){let a=e.getBoundingClientRect(),l=a.left+t.scrollLeft-di(e,a),o=a.top+t.scrollTop;return{x:l,y:o}}function Jw(e){let{elements:t,rect:a,offsetParent:l,strategy:o}=e,n=o==="fixed",u=Ba(l),r=t?nr(t.floating):!1;if(l===u||r&&n)return a;let s={scrollLeft:0,scrollTop:0},i=Ea(1),h=Ea(0),m=rl(l);if((m||!n)&&((wo(l)!=="body"||or(u))&&(s=ur(l)),m)){let p=Ao(l);i=_n(l),h.x=p.x+l.clientLeft,h.y=p.y+l.clientTop}let f=u&&!m&&!n?Rv(u,s):Ea(0);return{width:a.width*i.x,height:a.height*i.y,x:a.x*i.x-s.scrollLeft*i.x+h.x+f.x,y:a.y*i.y-s.scrollTop*i.y+h.y+f.y}}function $w(e){return e.getClientRects?Array.from(e.getClientRects()):[]}function eA(e){let t=ur(e),a=e.ownerDocument.body,l=pa(e.scrollWidth,e.clientWidth,a.scrollWidth,a.clientWidth),o=pa(e.scrollHeight,e.clientHeight,a.scrollHeight,a.clientHeight),n=-t.scrollLeft+di(e),u=-t.scrollTop;return xa(a).direction==="rtl"&&(n+=pa(e.clientWidth,a.clientWidth)-l),{width:l,height:o,x:n,y:u}}var tA=25;function aA(e,t,a){a===void 0&&(a="viewport");let l=a==="layoutViewport",o=xt(e),n=Ba(e),u=o.visualViewport,r=n.clientWidth,s=n.clientHeight,i=0,h=0;if(u){let f=!fi()||t==="fixed";l?f||(i=-u.offsetLeft,h=-u.offsetTop):(r=u.width,s=u.height,f&&(i=u.offsetLeft,h=u.offsetTop))}if(di(n)<=0){let f=n.ownerDocument,p=f.body,L=getComputedStyle(p),S=f.compatMode==="CSS1Compat"&&parseFloat(L.marginLeft)+parseFloat(L.marginRight)||0,v=Math.abs(n.clientWidth-p.clientWidth-S),g=getComputedStyle(n).scrollbarGutter==="stable both-edges"?v/2:v;g<=tA&&(r-=g)}return{width:r,height:s,x:i,y:h}}function lA(e,t){let a=Ao(e,!0,t==="fixed"),l=a.top+e.clientTop,o=a.left+e.clientLeft,n=_n(e),u=e.clientWidth*n.x,r=e.clientHeight*n.y,s=o*n.x,i=l*n.y;return{width:u,height:r,x:s,y:i}}function bv(e,t,a){let l;if(t==="viewport"||t==="layoutViewport")l=aA(e,a,t);else if(t==="document")l=eA(Ba(e));else if(ga(t))l=lA(t,a);else{let o=Av(e);l={x:t.x-o.x,y:t.y-o.y,width:t.width,height:t.height}}return Co(l)}function oA(e,t){let a=t.get(e);if(a)return a;let l=Io(e,[],!1).filter(r=>ga(r)&&wo(r)!=="body"),o=null,n=xa(e).position==="fixed",u=n?Vl(e):e;for(;ga(u)&&!Pn(u);){let r=xa(u),s=ii(u),i=o?o.position:n?"fixed":"";!s&&(i==="fixed"||i==="absolute"&&r.position==="static")?l=l.filter(m=>m!==u):o=r,u=Vl(u)}return t.set(e,l),l}function nA(e){let{element:t,boundary:a,rootBoundary:l,strategy:o}=e,u=[...a==="clippingAncestors"?nr(t)?[]:oA(t,this._c):[].concat(a),l],r=bv(t,u[0],o),s=r.top,i=r.right,h=r.bottom,m=r.left;for(let f=1;f<u.length;f++){let p=bv(t,u[f],o);s=pa(p.top,s),i=Da(p.right,i),h=Da(p.bottom,h),m=pa(p.left,m)}return{width:i-m,height:h-s,x:m,y:s}}function uA(e){let{width:t,height:a}=wv(e);return{width:t,height:a}}function rA(e,t,a){let l=rl(t),o=Ba(t),n=a==="fixed",u=Ao(e,!0,n,t),r={scrollLeft:0,scrollTop:0},s=Ea(0);if((l||!n)&&((wo(t)!=="body"||or(o))&&(r=ur(t)),l)){let f=Ao(t,!0,n,t);s.x=f.x+t.clientLeft,s.y=f.y+t.clientTop}!l&&o&&(s.x=di(o));let i=o&&!l&&!n?Rv(o,r):Ea(0),h=u.left+r.scrollLeft-s.x-i.x,m=u.top+r.scrollTop-s.y-i.y;return{x:h,y:m,width:u.width,height:u.height}}function Jd(e){return xa(e).position==="static"}function Iv(e,t){if(!rl(e)||xa(e).position==="fixed")return null;if(t)return t(e);let a=e.offsetParent;return Ba(e)===a&&(a=a.ownerDocument.body),a}function Tv(e,t){let a=xt(e);if(nr(e))return a;if(!rl(e)){let o=Vl(e);for(;o&&!Pn(o);){if(ga(o)&&!Jd(o))return o;o=Vl(o)}return a}let l=Iv(e,t);for(;l&&vv(l)&&Jd(l);)l=Iv(l,t);return l&&Pn(l)&&Jd(l)&&!ii(l)?a:l||yv(e)||a}var sA=async function(e){let t=this.getOffsetParent||Tv,a=this.getDimensions,l=await a(e.floating);return{reference:rA(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:l.width,height:l.height}}};function iA(e){return xa(e).direction==="rtl"}var kv={convertOffsetParentRelativeRectToViewportRelativeRect:Jw,getDocumentElement:Ba,getClippingRect:nA,getOffsetParent:Tv,getElementRects:sA,getClientRects:$w,getDimensions:uA,getScale:_n,isElement:ga,isRTL:iA};function Mv(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function fA(e,t,a){let l=null,o,n=Ba(e);function u(){var h;clearTimeout(o),(h=l)==null||h.disconnect(),l=null}function r(h,m){h===void 0&&(h=!1),m===void 0&&(m=1),u();let f=e.getBoundingClientRect(),{left:p,top:L,width:S,height:v}=f;if(h||t(),!S||!v)return;let g=lr(L),d=lr(n.clientWidth-(p+S)),c=lr(n.clientHeight-(L+v)),x=lr(p),I={rootMargin:-g+"px "+-d+"px "+-c+"px "+-x+"px",threshold:pa(0,Da(1,m))||1},b=!0;function C(A){let T=A[0].intersectionRatio;if(!Mv(f,e.getBoundingClientRect()))return r();if(T!==m){if(!b)return r();T?r(!1,T):o=setTimeout(()=>{r(!1,1e-7)},1e3)}b=!1}try{l=new IntersectionObserver(C,{...I,root:n.ownerDocument})}catch{l=new IntersectionObserver(C,I)}l.observe(e)}let s=xt(e),i=()=>r(a);return s.addEventListener("resize",i),r(!0),()=>{s.removeEventListener("resize",i),u()}}function em(e,t,a,l){l===void 0&&(l={});let{ancestorScroll:o=!0,ancestorResize:n=!0,elementResize:u=typeof ResizeObserver=="function",layoutShift:r=typeof IntersectionObserver=="function",animationFrame:s=!1}=l,i=$d(e),h=o||n?[...i?Io(i):[],...t?Io(t):[]]:[];h.forEach(g=>{o&&g.addEventListener("scroll",a),n&&g.addEventListener("resize",a)});let m=i&&r?fA(i,a,n):null,f=-1,p=null;u&&(p=new ResizeObserver(g=>{let[d]=g;d&&d.target===i&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var c;(c=p)==null||c.observe(t)})),a()}),i&&!s&&p.observe(i),t&&p.observe(t));let L,S=s?Ao(e):null;s&&v();function v(){let g=Ao(e);S&&!Mv(S,g)&&a(),S=g,L=requestAnimationFrame(v)}return a(),()=>{var g;h.forEach(d=>{o&&d.removeEventListener("scroll",a),n&&d.removeEventListener("resize",a)}),m?.(),(g=p)==null||g.disconnect(),p=null,s&&cancelAnimationFrame(L)}}var Dv=pv;var Ev=hv,Ov=cv,Bv=xv,Pv=dv,tm=fv;var _v=gv,am=(e,t,a)=>{let l=new Map,o=a??{},n={...kv,...o.platform,_c:l};return iv(e,t,{...o,platform:n})};var Ne=R(U(),1),Hv=R(U(),1),zv=R(Jn(),1),cA=typeof document<"u",dA=function(){},mi=cA?Hv.useLayoutEffect:dA;function pi(e,t){if(e===t)return!0;if(typeof e!=typeof t)return!1;if(typeof e=="function"&&e.toString()===t.toString())return!0;let a,l,o;if(e&&t&&typeof e=="object"){if(Array.isArray(e)){if(a=e.length,a!==t.length)return!1;for(l=a;l--!==0;)if(!pi(e[l],t[l]))return!1;return!0}if(o=Object.keys(e),a=o.length,a!==Object.keys(t).length)return!1;for(l=a;l--!==0;)if(!{}.hasOwnProperty.call(t,o[l]))return!1;for(l=a;l--!==0;){let n=o[l];if(!(n==="_owner"&&e.$$typeof)&&!pi(e[n],t[n]))return!1}return!0}return e!==e&&t!==t}function Nv(e){return typeof window>"u"?1:(e.ownerDocument.defaultView||window).devicePixelRatio||1}function Uv(e,t){let a=Nv(e);return Math.round(t*a)/a}function lm(e){let t=Ne.useRef(e);return mi(()=>{t.current=e}),t}function qv(e){e===void 0&&(e={});let{placement:t="bottom",strategy:a="absolute",middleware:l=[],platform:o,elements:{reference:n,floating:u}={},transform:r=!0,whileElementsMounted:s,open:i}=e,[h,m]=Ne.useState({x:0,y:0,strategy:a,placement:t,middlewareData:{},isPositioned:!1}),[f,p]=Ne.useState(l);pi(f,l)||p(l);let[L,S]=Ne.useState(null),[v,g]=Ne.useState(null),d=Ne.useCallback(z=>{z!==I.current&&(I.current=z,S(z))},[]),c=Ne.useCallback(z=>{z!==b.current&&(b.current=z,g(z))},[]),x=n||L,y=u||v,I=Ne.useRef(null),b=Ne.useRef(null),C=Ne.useRef(h),A=s!=null,T=lm(s),B=lm(o),O=lm(i),_=Ne.useCallback(()=>{if(!I.current||!b.current)return;let z={placement:t,strategy:a,middleware:f};B.current&&(z.platform=B.current),am(I.current,b.current,z).then(le=>{let k={...le,isPositioned:O.current!==!1};Q.current&&!pi(C.current,k)&&(C.current=k,zv.flushSync(()=>{m(k)}))})},[f,t,a,B,O]);mi(()=>{i===!1&&C.current.isPositioned&&(C.current.isPositioned=!1,m(z=>({...z,isPositioned:!1})))},[i]);let Q=Ne.useRef(!1);mi(()=>(Q.current=!0,()=>{Q.current=!1}),[]),mi(()=>{if(x&&(I.current=x),y&&(b.current=y),x&&y){if(T.current)return T.current(x,y,_);_()}},[x,y,_,T,A]);let ae=Ne.useMemo(()=>({reference:I,floating:b,setReference:d,setFloating:c}),[d,c]),H=Ne.useMemo(()=>({reference:x,floating:y}),[x,y]),j=Ne.useMemo(()=>{let z={position:a,left:0,top:0};if(!H.floating)return z;let le=Uv(H.floating,h.x),k=Uv(H.floating,h.y);return r?{...z,transform:"translate("+le+"px, "+k+"px)",...Nv(H.floating)>=1.5&&{willChange:"transform"}}:{position:a,left:le,top:k}},[a,r,H.floating,h.x,h.y]);return Ne.useMemo(()=>({...h,update:_,refs:ae,elements:H,floatingStyles:j}),[h,_,ae,H,j])}var mA=e=>{function t(a){return{}.hasOwnProperty.call(a,"current")}return{name:"arrow",options:e,fn(a){let{element:l,padding:o}=typeof e=="function"?e(a):e;return l&&t(l)?l.current!=null?tm({element:l.current,padding:o}).fn(a):{}:l?tm({element:l,padding:o}).fn(a):{}}}},Fv=(e,t)=>{let a=Dv(e);return{name:a.name,fn:a.fn,options:[e,t]}},Vv=(e,t)=>{let a=Ev(e);return{name:a.name,fn:a.fn,options:[e,t]}},Gv=(e,t)=>({fn:_v(e).fn,options:[e,t]}),Xv=(e,t)=>{let a=Ov(e);return{name:a.name,fn:a.fn,options:[e,t]}},jv=(e,t)=>{let a=Bv(e);return{name:a.name,fn:a.fn,options:[e,t]}};var Yv=(e,t)=>{let a=Pv(e);return{name:a.name,fn:a.fn,options:[e,t]}};var Kv=(e,t)=>{let a=mA(e);return{name:a.name,fn:a.fn,options:[e,t]}};var Zv=R(U(),1);var pA=Object.defineProperty,hA=(e,t)=>pA(e,"name",{value:t,configurable:!0});function om(e){let[t,a]=Zv.useState(void 0);return Ee(()=>{if(e){a({width:e.offsetWidth,height:e.offsetHeight});let l=new ResizeObserver(o=>{if(!Array.isArray(o)||!o.length)return;let n=o[0],u,r;if("borderBoxSize"in n){let s=n.borderBoxSize,i=Array.isArray(s)?s[0]:s;u=i.inlineSize,r=i.blockSize}else u=e.offsetWidth,r=e.offsetHeight;a({width:u,height:r})});return l.observe(e,{box:"border-box"}),()=>l.unobserve(e)}else a(void 0)},[e]),t}hA(om,"useSize");var Un=R(V(),1),gA=Object.defineProperty,Gl=(e,t)=>gA(e,"name",{value:t,configurable:!0});var Qv="Popper",[Wv,nm]=ol(Qv),[xA,Jv]=Wv(Qv),LA=Gl(e=>{let{__scopePopper:t,children:a}=e,[l,o]=ft.useState(null),[n,u]=ft.useState(void 0);return(0,Un.jsx)(xA,{scope:t,anchor:l,onAnchorChange:o,placementState:n,setPlacementState:u,children:a})},"Popper"),SA="PopperAnchor",vA=ft.forwardRef(Gl(function(t,a){let{__scopePopper:l,virtualRef:o,...n}=t,u=Jv(SA,l),r=ft.useRef(null),s=u.onAnchorChange,i=ft.useCallback(S=>{r.current=S,S&&s(S)},[s]),h=he(a,i),m=ft.useRef(null);ft.useEffect(()=>{if(!o)return;let S=m.current;m.current=o.current,S!==m.current&&s(m.current)});let f=u.placementState&&hi(u.placementState),p=f?.[0],L=f?.[1];return o?null:(0,Un.jsx)(it.div,{"data-radix-popper-side":p,"data-radix-popper-align":L,...n,ref:h})},"PopperAnchor")),$v="PopperContent",[yA,yk]=Wv($v),CA=ft.forwardRef(Gl(function(t,a){let{__scopePopper:l,side:o="bottom",sideOffset:n=0,align:u="center",alignOffset:r=0,arrowPadding:s=0,avoidCollisions:i=!0,collisionBoundary:h=[],collisionPadding:m=0,sticky:f="partial",hideWhenDetached:p=!1,updatePositionStrategy:L="optimized",onPlaced:S,...v}=t,g=Jv($v,l),[d,c]=ft.useState(null),x=he(a,c),[y,I]=ft.useState(null),b=om(y),C=b?.width??0,A=b?.height??0,T=o+(u!=="center"?"-"+u:""),B=typeof m=="number"?m:{top:0,right:0,bottom:0,left:0,...m},O=Array.isArray(h)?h:[h],_=O.length>0,Q={padding:B,boundary:O.filter(ey),altBoundary:_},{refs:ae,floatingStyles:H,placement:j,isPositioned:z,middlewareData:le}=qv({strategy:"fixed",placement:T,whileElementsMounted:Gl((...Y)=>em(...Y,{animationFrame:L==="always"}),"whileElementsMounted"),elements:{reference:g.anchor},middleware:[Fv({mainAxis:n+A,alignmentAxis:r}),i&&Vv({mainAxis:!0,crossAxis:!1,limiter:f==="partial"?Gv():void 0,...Q}),i&&Xv({...Q}),jv({...Q,apply:Gl(({elements:Y,rects:qe,availableWidth:ue,availableHeight:re})=>{let{width:Ie,height:Lt}=qe.reference,Gt=Y.floating.style;Gt.setProperty("--radix-popper-available-width",`${ue}px`),Gt.setProperty("--radix-popper-available-height",`${re}px`),Gt.setProperty("--radix-popper-anchor-width",`${Ie}px`),Gt.setProperty("--radix-popper-anchor-height",`${Lt}px`)},"apply")}),y&&Kv({element:y,padding:s}),bA({arrowWidth:C,arrowHeight:A}),p&&Yv({strategy:"referenceHidden",...Q,boundary:_?Q.boundary:void 0})]}),k=g.setPlacementState;Ee(()=>(k(j),()=>{k(void 0)}),[j,k]);let[qt,Oe]=hi(j),ut=Tt(S);Ee(()=>{z&&ut?.()},[z,ut]);let Ft=le.arrow?.x,be=le.arrow?.y,Re=le.arrow?.centerOffset!==0,[Vt,q]=ft.useState();return Ee(()=>{d&&q(window.getComputedStyle(d).zIndex)},[d]),(0,Un.jsx)("div",{ref:ae.setFloating,"data-radix-popper-content-wrapper":"",style:{...H,transform:z?H.transform:"translate(0, -200%)",minWidth:"max-content",zIndex:Vt,"--radix-popper-transform-origin":[le.transformOrigin?.x,le.transformOrigin?.y].join(" "),...le.hide?.referenceHidden&&{visibility:"hidden",pointerEvents:"none"}},dir:t.dir,children:(0,Un.jsx)(yA,{scope:l,placedSide:qt,placedAlign:Oe,onArrowChange:I,arrowX:Ft,arrowY:be,shouldHideArrow:Re,children:(0,Un.jsx)(it.div,{"data-side":qt,"data-align":Oe,...v,ref:x,style:{...v.style,animation:z?v.style?.animation:"none"}})})})},"PopperContent"));function ey(e){return e!==null}Gl(ey,"isNotNull");var bA=Gl(e=>({name:"transformOrigin",options:e,fn(t){let{placement:a,rects:l,middlewareData:o}=t,u=o.arrow?.centerOffset!==0,r=u?0:e.arrowWidth,s=u?0:e.arrowHeight,[i,h]=hi(a),m={start:"0%",center:"50%",end:"100%"}[h],f=(o.arrow?.x??0)+r/2,p=(o.arrow?.y??0)+s/2,L="",S="";return i==="bottom"?(L=u?m:`${f}px`,S=`${-s}px`):i==="top"?(L=u?m:`${f}px`,S=`${l.floating.height+s}px`):i==="right"?(L=`${-s}px`,S=u?m:`${p}px`):i==="left"&&(L=`${l.floating.width+s}px`,S=u?m:`${p}px`),{data:{x:L,y:S}}}}),"transformOrigin");function hi(e){let[t,a="center"]=e.split("-");return[t,a]}Gl(hi,"getSideAndAlignFromPlacement");var ty=LA,ay=vA,ly=CA;var nt=R(U(),1);var oy=R(U(),1),wA=Object.defineProperty,sl=(e,t)=>wA(e,"name",{value:t,configurable:!0});function ny(e,t){return oy.useReducer((a,l)=>t[a][l]??a,e)}sl(ny,"useStateMachine");var uy=sl(e=>{let{present:t,children:a}=e,l=ry(t),o=typeof a=="function"?a({present:l.isPresent}):nt.Children.only(a),n=sy(l.ref,iy(o));return typeof a=="function"||l.isPresent?nt.cloneElement(o,{ref:n}):null},"Presence");function ry(e){let[t,a]=nt.useState(),l=nt.useRef(null),o=nt.useRef(e),n=nt.useRef("none"),u=nt.useRef(void 0),r=e?"mounted":"unmounted",[s,i]=ny(r,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return nt.useEffect(()=>{s==="mounted"?(n.current=u.current??Hn(l.current),u.current=void 0):n.current="none"},[s]),Ee(()=>{let h=l.current,m=o.current;if(m!==e){let p=n.current,L=Hn(h);e?(u.current=L,i("MOUNT")):L==="none"||h?.display==="none"?i("UNMOUNT"):i(m&&p!==L?"ANIMATION_OUT":"UNMOUNT"),o.current=e}},[e,i]),Ee(()=>{if(t){let h,m=t.ownerDocument.defaultView??window,f=sl(L=>{let v=Hn(l.current).includes(CSS.escape(L.animationName));if(L.target===t&&v&&(i("ANIMATION_END"),!o.current)){let g=t.style.animationFillMode;t.style.animationFillMode="forwards",h=m.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=g)})}},"handleAnimationEnd"),p=sl(L=>{L.target===t&&(n.current=Hn(l.current))},"handleAnimationStart");return t.addEventListener("animationstart",p),t.addEventListener("animationcancel",f),t.addEventListener("animationend",f),()=>{m.clearTimeout(h),t.removeEventListener("animationstart",p),t.removeEventListener("animationcancel",f),t.removeEventListener("animationend",f)}}else i("ANIMATION_END")},[t,i]),{isPresent:["mounted","unmountSuspended"].includes(s),ref:nt.useCallback(h=>{if(h){let m=getComputedStyle(h);l.current=m,u.current=Hn(m)}else l.current=null;a(h)},[])}}sl(ry,"usePresence");function um(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}sl(um,"setRef");function sy(...e){let t=nt.useRef(e);return t.current=e,nt.useCallback(a=>{let l=t.current,o=!1,n=l.map(u=>{let r=um(u,a);return!o&&typeof r=="function"&&(o=!0),r});if(o)return()=>{for(let u=0;u<n.length;u++){let r=n[u];typeof r=="function"?r():um(l[u],null)}}},[])}sl(sy,"useStableComposedRefs");function Hn(e){return e?.animationName||"none"}sl(Hn,"getAnimationName");function iy(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning;return a?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,a=t&&"isReactWarning"in t&&t.isReactWarning,a?e.props.ref:e.props.ref||e.ref)}sl(iy,"getElementRef");var na=R(U(),1);var gi=!1;var La=R(U(),1);var zn=R(U(),1),AA=Object.defineProperty,RA=(e,t)=>AA(e,"name",{value:t,configurable:!0}),fy=zn[" useEffectEvent ".trim().toString()],cy=zn[" useInsertionEffect ".trim().toString()];function rm(e){if(typeof fy=="function")return fy(e);let t=zn.useRef(()=>{throw new Error("Cannot call an event handler while rendering.")});return typeof cy=="function"?cy(()=>{t.current=e}):Ee(()=>{t.current=e}),zn.useMemo(()=>((...a)=>t.current?.(...a)),[])}RA(rm,"useEffectEvent");var TA=Object.defineProperty,rr=(e,t)=>TA(e,"name",{value:t,configurable:!0}),kA=na[" useInsertionEffect ".trim().toString()]||Ee;function xi({prop:e,defaultProp:t,onChange:a=rr(()=>{},"onChange"),caller:l}){let[o,n,u]=my({defaultProp:t,onChange:a}),r=e!==void 0,s=r?e:o;if(gi){let h=na.useRef(e!==void 0);na.useEffect(()=>{let m=h.current;m!==r&&console.warn(`${l} is changing from ${m?"controlled":"uncontrolled"} to ${r?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),h.current=r},[r,l])}let i=na.useCallback(h=>{if(r){let m=py(h)?h(e):h;m!==e&&u.current?.(m)}else n(h)},[r,e,n,u]);return[s,i]}rr(xi,"useControllableState");function my({defaultProp:e,onChange:t}){let[a,l]=na.useState(e),o=na.useRef(a),n=na.useRef(t);return kA(()=>{n.current=t},[t]),na.useEffect(()=>{o.current!==a&&(n.current?.(a),o.current=a)},[a,o]),[a,l,n]}rr(my,"useUncontrolledState");function py(e){return typeof e=="function"}rr(py,"isFunction");var dy=Symbol("RADIX:SYNC_STATE");function MA(e,t,a,l){let{prop:o,defaultProp:n,onChange:u,caller:r}=t,s=o!==void 0,i=rm(u);if(gi){let v=La.useRef(o!==void 0);La.useEffect(()=>{let g=v.current;g!==s&&console.warn(`${r} is changing from ${g?"controlled":"uncontrolled"} to ${s?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),v.current=s},[s,r])}let h=[{...a,state:n}];l&&h.push(l);let[m,f]=La.useReducer((v,g)=>{if(g.type===dy)return{...v,state:g.state};let d=e(v,g);return s&&!Object.is(d.state,v.state)&&i(d.state),d},...h),p=m.state,L=La.useRef(p);La.useEffect(()=>{L.current!==p&&(L.current=p,s||i(p))},[p,L,s]);let S=La.useMemo(()=>o!==void 0?{...m,state:o}:m,[m,o]);return La.useEffect(()=>{s&&!Object.is(o,m.state)&&f({type:dy,state:o})},[o,m.state,s]),[S,f]}rr(MA,"useControllableStateReducer");var Li=R(U(),1),DA=Object.defineProperty,EA=(e,t)=>DA(e,"name",{value:t,configurable:!0});function sm(e){let t=Li.useRef({value:e,previous:e});return Li.useMemo(()=>(t.current.value!==e&&(t.current.previous=t.current.value,t.current.value=e),t.current.previous),[e])}EA(sm,"usePrevious");var OA=R(U(),1);var BA=R(V(),1);var hy=Object.freeze({position:"absolute",border:0,width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",wordWrap:"normal"});var PA=function(e){if(typeof document>"u")return null;var t=Array.isArray(e)?e[0]:e;return t.ownerDocument.body},Nn=new WeakMap,Si=new WeakMap,vi={},im=0,gy=function(e){return e&&(e.host||gy(e.parentNode))},_A=function(e,t){return t.map(function(a){if(e.contains(a))return a;var l=gy(a);return l&&e.contains(l)?l:(console.error("aria-hidden",a,"in not contained inside",e,". Doing nothing"),null)}).filter(function(a){return!!a})},UA=function(e,t,a,l){var o=_A(t,Array.isArray(e)?e:[e]);vi[a]||(vi[a]=new WeakMap);var n=vi[a],u=[],r=new Set,s=new Set(o),i=function(m){!m||r.has(m)||(r.add(m),i(m.parentNode))};o.forEach(i);var h=function(m){!m||s.has(m)||Array.prototype.forEach.call(m.children,function(f){if(r.has(f))h(f);else try{var p=f.getAttribute(l),L=p!==null&&p!=="false",S=(Nn.get(f)||0)+1,v=(n.get(f)||0)+1;Nn.set(f,S),n.set(f,v),u.push(f),S===1&&L&&Si.set(f,!0),v===1&&f.setAttribute(a,"true"),L||f.setAttribute(l,"true")}catch(g){console.error("aria-hidden: cannot operate on ",f,g)}})};return h(t),r.clear(),im++,function(){u.forEach(function(m){var f=Nn.get(m)-1,p=n.get(m)-1;Nn.set(m,f),n.set(m,p),f||(Si.has(m)||m.removeAttribute(l),Si.delete(m)),p||m.removeAttribute(a)}),im--,im||(Nn=new WeakMap,Nn=new WeakMap,Si=new WeakMap,vi={})}},xy=function(e,t,a){a===void 0&&(a="data-aria-hidden");var l=Array.from(Array.isArray(e)?e:[e]),o=t||PA(e);return o?(l.push.apply(l,Array.from(o.querySelectorAll("[aria-live], script"))),UA(l,o,a,"aria-hidden")):function(){return null}};var kt=function(){return kt=Object.assign||function(t){for(var a,l=1,o=arguments.length;l<o;l++){a=arguments[l];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n])}return t},kt.apply(this,arguments)};function yi(e,t){var a={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&t.indexOf(l)<0&&(a[l]=e[l]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,l=Object.getOwnPropertySymbols(e);o<l.length;o++)t.indexOf(l[o])<0&&Object.prototype.propertyIsEnumerable.call(e,l[o])&&(a[l[o]]=e[l[o]]);return a}function Ly(e,t,a){if(a||arguments.length===2)for(var l=0,o=t.length,n;l<o;l++)(n||!(l in t))&&(n||(n=Array.prototype.slice.call(t,0,l)),n[l]=t[l]);return e.concat(n||Array.prototype.slice.call(t))}var Ai=R(U());var ct=R(U());var Ro="right-scroll-bar-position",To="width-before-scroll-bar",fm="with-scroll-bars-hidden",cm="--removed-body-scroll-bar-size";function Ci(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}var Sy=R(U());function vy(e,t){var a=(0,Sy.useState)(function(){return{value:e,callback:t,facade:{get current(){return a.value},set current(l){var o=a.value;o!==l&&(a.value=l,a.callback(l,o))}}}})[0];return a.callback=t,a.facade}var bi=R(U());var HA=typeof window<"u"?bi.useLayoutEffect:bi.useEffect,yy=new WeakMap;function dm(e,t){var a=vy(t||null,function(l){return e.forEach(function(o){return Ci(o,l)})});return HA(function(){var l=yy.get(a);if(l){var o=new Set(l),n=new Set(e),u=a.current;o.forEach(function(r){n.has(r)||Ci(r,null)}),n.forEach(function(r){o.has(r)||Ci(r,u)})}yy.set(a,e)},[e]),a}function zA(e){return e}function NA(e,t){t===void 0&&(t=zA);var a=[],l=!1,o={read:function(){if(l)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return a.length?a[a.length-1]:e},useMedium:function(n){var u=t(n,l);return a.push(u),function(){a=a.filter(function(r){return r!==u})}},assignSyncMedium:function(n){for(l=!0;a.length;){var u=a;a=[],u.forEach(n)}a={push:function(r){return n(r)},filter:function(){return a}}},assignMedium:function(n){l=!0;var u=[];if(a.length){var r=a;a=[],r.forEach(n),u=a}var s=function(){var h=u;u=[],h.forEach(n)},i=function(){return Promise.resolve().then(s)};i(),a={push:function(h){u.push(h),i()},filter:function(h){return u=u.filter(h),a}}}};return o}function mm(e){e===void 0&&(e={});var t=NA(null);return t.options=kt({async:!0,ssr:!1},e),t}var Cy=R(U()),by=function(e){var t=e.sideCar,a=yi(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var l=t.read();if(!l)throw new Error("Sidecar medium not found");return Cy.createElement(l,kt({},a))};by.isSideCarExport=!0;function pm(e,t){return e.useMedium(t),by}var Ii=mm();var hm=function(){},sr=ct.forwardRef(function(e,t){var a=ct.useRef(null),l=ct.useState({onScrollCapture:hm,onWheelCapture:hm,onTouchMoveCapture:hm}),o=l[0],n=l[1],u=e.forwardProps,r=e.children,s=e.className,i=e.removeScrollBar,h=e.enabled,m=e.shards,f=e.sideCar,p=e.noRelative,L=e.noIsolation,S=e.inert,v=e.allowPinchZoom,g=e.as,d=g===void 0?"div":g,c=e.gapMode,x=yi(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),y=f,I=dm([a,t]),b=kt(kt({},x),o);return ct.createElement(ct.Fragment,null,h&&ct.createElement(y,{sideCar:Ii,removeScrollBar:i,shards:m,noRelative:p,noIsolation:L,inert:S,setCallbacks:n,allowPinchZoom:!!v,lockRef:a,gapMode:c}),u?ct.cloneElement(ct.Children.only(r),kt(kt({},b),{ref:I})):ct.createElement(d,kt({},b,{className:s,ref:I}),r))});sr.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};sr.classNames={fullWidth:To,zeroRight:Ro};var Ce=R(U());var Fn=R(U());var Ay=R(U());var Iy;var wy=function(){if(Iy)return Iy;if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function qA(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=wy();return t&&e.setAttribute("nonce",t),e}function FA(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function VA(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var gm=function(){var e=0,t=null;return{add:function(a){e==0&&(t=qA())&&(FA(t,a),VA(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}};var xm=function(){var e=gm();return function(t,a){Ay.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&a])}};var ir=function(){var e=xm(),t=function(a){var l=a.styles,o=a.dynamic;return e(l,o),null};return t};var GA={left:0,top:0,right:0,gap:0},Lm=function(e){return parseInt(e||"",10)||0},XA=function(e){var t=window.getComputedStyle(document.body),a=t[e==="padding"?"paddingLeft":"marginLeft"],l=t[e==="padding"?"paddingTop":"marginTop"],o=t[e==="padding"?"paddingRight":"marginRight"];return[Lm(a),Lm(l),Lm(o)]},Sm=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return GA;var t=XA(e),a=document.documentElement.clientWidth,l=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,l-a+t[2]-t[0])}};var jA=ir(),qn="data-scroll-locked",YA=function(e,t,a,l){var o=e.left,n=e.top,u=e.right,r=e.gap;return a===void 0&&(a="margin"),`
  .`.concat(fm,` {
   overflow: hidden `).concat(l,`;
   padding-right: `).concat(r,"px ").concat(l,`;
  }
  body[`).concat(qn,`] {
    overflow: hidden `).concat(l,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(l,";"),a==="margin"&&`
    padding-left: `.concat(o,`px;
    padding-top: `).concat(n,`px;
    padding-right: `).concat(u,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(r,"px ").concat(l,`;
    `),a==="padding"&&"padding-right: ".concat(r,"px ").concat(l,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(Ro,` {
    right: `).concat(r,"px ").concat(l,`;
  }
  
  .`).concat(To,` {
    margin-right: `).concat(r,"px ").concat(l,`;
  }
  
  .`).concat(Ro," .").concat(Ro,` {
    right: 0 `).concat(l,`;
  }
  
  .`).concat(To," .").concat(To,` {
    margin-right: 0 `).concat(l,`;
  }
  
  body[`).concat(qn,`] {
    `).concat(cm,": ").concat(r,`px;
  }
`)},Ry=function(){var e=parseInt(document.body.getAttribute(qn)||"0",10);return isFinite(e)?e:0},KA=function(){Fn.useEffect(function(){return document.body.setAttribute(qn,(Ry()+1).toString()),function(){var e=Ry()-1;e<=0?document.body.removeAttribute(qn):document.body.setAttribute(qn,e.toString())}},[])},vm=function(e){var t=e.noRelative,a=e.noImportant,l=e.gapMode,o=l===void 0?"margin":l;KA();var n=Fn.useMemo(function(){return Sm(o)},[o]);return Fn.createElement(jA,{styles:YA(n,!t,o,a?"":"!important")})};var ym=!1;if(typeof window<"u")try{fr=Object.defineProperty({},"passive",{get:function(){return ym=!0,!0}}),window.addEventListener("test",fr,fr),window.removeEventListener("test",fr,fr)}catch{ym=!1}var fr,ko=ym?{passive:!1}:!1;var ZA=function(e){return e.tagName==="TEXTAREA"},Ty=function(e,t){if(!(e instanceof Element))return!1;var a=window.getComputedStyle(e);return a[t]!=="hidden"&&!(a.overflowY===a.overflowX&&!ZA(e)&&a[t]==="visible")},QA=function(e){return Ty(e,"overflowY")},WA=function(e){return Ty(e,"overflowX")},Cm=function(e,t){var a=t.ownerDocument,l=t;do{typeof ShadowRoot<"u"&&l instanceof ShadowRoot&&(l=l.host);var o=ky(e,l);if(o){var n=My(e,l),u=n[1],r=n[2];if(u>r)return!0}l=l.parentNode}while(l&&l!==a.body);return!1},JA=function(e){var t=e.scrollTop,a=e.scrollHeight,l=e.clientHeight;return[t,a,l]},$A=function(e){var t=e.scrollLeft,a=e.scrollWidth,l=e.clientWidth;return[t,a,l]},ky=function(e,t){return e==="v"?QA(t):WA(t)},My=function(e,t){return e==="v"?JA(t):$A(t)},eR=function(e,t){return e==="h"&&t==="rtl"?-1:1},Dy=function(e,t,a,l,o){var n=eR(e,window.getComputedStyle(t).direction),u=n*l,r=a.target,s=t.contains(r),i=!1,h=u>0,m=0,f=0;do{if(!r)break;var p=My(e,r),L=p[0],S=p[1],v=p[2],g=S-v-n*L;(L||g)&&ky(e,r)&&(m+=g,f+=L);var d=r.parentNode;r=d&&d.nodeType===Node.DOCUMENT_FRAGMENT_NODE?d.host:d}while(!s&&r!==document.body||s&&(t.contains(r)||t===r));return(h&&(o&&Math.abs(m)<1||!o&&u>m)||!h&&(o&&Math.abs(f)<1||!o&&-u>f))&&(i=!0),i};var wi=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},Ey=function(e){return[e.deltaX,e.deltaY]},Oy=function(e){return e&&"current"in e?e.current:e},tR=function(e,t){return e[0]===t[0]&&e[1]===t[1]},aR=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},lR=0,Vn=[];function By(e){var t=Ce.useRef([]),a=Ce.useRef([0,0]),l=Ce.useRef(),o=Ce.useState(lR++)[0],n=Ce.useState(ir)[0],u=Ce.useRef(e);Ce.useEffect(function(){u.current=e},[e]),Ce.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(o));var S=Ly([e.lockRef.current],(e.shards||[]).map(Oy),!0).filter(Boolean);return S.forEach(function(v){return v.classList.add("allow-interactivity-".concat(o))}),function(){document.body.classList.remove("block-interactivity-".concat(o)),S.forEach(function(v){return v.classList.remove("allow-interactivity-".concat(o))})}}},[e.inert,e.lockRef.current,e.shards]);var r=Ce.useCallback(function(S,v){if("touches"in S&&S.touches.length===2||S.type==="wheel"&&S.ctrlKey)return!u.current.allowPinchZoom;var g=wi(S),d=a.current,c="deltaX"in S?S.deltaX:d[0]-g[0],x="deltaY"in S?S.deltaY:d[1]-g[1],y,I=S.target,b=Math.abs(c)>Math.abs(x)?"h":"v";if("touches"in S&&b==="h"&&I.type==="range")return!1;var C=window.getSelection(),A=C&&C.anchorNode,T=A?A===I||A.contains(I):!1;if(T)return!1;var B=Cm(b,I);if(!B)return!0;if(B?y=b:(y=b==="v"?"h":"v",B=Cm(b,I)),!B)return!1;if(!l.current&&"changedTouches"in S&&(c||x)&&(l.current=y),!y)return!0;var O=l.current||y;return Dy(O,v,S,O==="h"?c:x,!0)},[]),s=Ce.useCallback(function(S){var v=S;if(!(!Vn.length||Vn[Vn.length-1]!==n)){var g="deltaY"in v?Ey(v):wi(v),d=t.current.filter(function(y){return y.name===v.type&&(y.target===v.target||v.target===y.shadowParent)&&tR(y.delta,g)})[0];if(d&&d.should){v.cancelable&&v.preventDefault();return}if(!d){var c=(u.current.shards||[]).map(Oy).filter(Boolean).filter(function(y){return y.contains(v.target)}),x=c.length>0?r(v,c[0]):!u.current.noIsolation;x&&v.cancelable&&v.preventDefault()}}},[]),i=Ce.useCallback(function(S,v,g,d){var c={name:S,delta:v,target:g,should:d,shadowParent:oR(g)};t.current.push(c),setTimeout(function(){t.current=t.current.filter(function(x){return x!==c})},1)},[]),h=Ce.useCallback(function(S){a.current=wi(S),l.current=void 0},[]),m=Ce.useCallback(function(S){i(S.type,Ey(S),S.target,r(S,e.lockRef.current))},[]),f=Ce.useCallback(function(S){i(S.type,wi(S),S.target,r(S,e.lockRef.current))},[]);Ce.useEffect(function(){return Vn.push(n),e.setCallbacks({onScrollCapture:m,onWheelCapture:m,onTouchMoveCapture:f}),document.addEventListener("wheel",s,ko),document.addEventListener("touchmove",s,ko),document.addEventListener("touchstart",h,ko),function(){Vn=Vn.filter(function(S){return S!==n}),document.removeEventListener("wheel",s,ko),document.removeEventListener("touchmove",s,ko),document.removeEventListener("touchstart",h,ko)}},[]);var p=e.removeScrollBar,L=e.inert;return Ce.createElement(Ce.Fragment,null,L?Ce.createElement(n,{styles:aR(o)}):null,p?Ce.createElement(vm,{noRelative:e.noRelative,gapMode:e.gapMode}):null)}function oR(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}var Py=pm(Ii,By);var _y=Ai.forwardRef(function(e,t){return Ai.createElement(sr,kt({},e,{ref:t,sideCar:Py}))});_y.classNames=sr.classNames;var bm=_y;var N=R(V(),1),nR=Object.defineProperty,ge=(e,t)=>nR(e,"name",{value:t,configurable:!0}),uR=[" ","Enter","ArrowUp","ArrowDown"],rR=[" ","Enter"],Gn="Select",[Ti,Am,sR]=Bd(Gn),[Do,cD]=ol(Gn,[sR,nm]),Rm=nm(),[iR,Xl]=Do(Gn),[fR,cR]=Do(Gn);function zy(e){let{__scopeSelect:t,children:a,open:l,defaultOpen:o,onOpenChange:n,value:u,defaultValue:r,onValueChange:s,dir:i,name:h,autoComplete:m,disabled:f,required:p,form:L,internal_do_not_use_render:S}=e,v=Rm(t),[g,d]=D.useState(null),[c,x]=D.useState(null),[y,I]=D.useState(!1),b=_d(i),[C,A]=xi({prop:l,defaultProp:o??!1,onChange:n,caller:Gn}),[T,B]=xi({prop:u,defaultProp:r,onChange:s,caller:Gn}),O=D.useRef(null),_=D.useRef(T);D.useEffect(()=>{let Oe=L?g?.ownerDocument.getElementById(L):g?.form;if(Oe instanceof HTMLFormElement){let ut=ge(()=>B(_.current),"reset");return Oe.addEventListener("reset",ut),()=>Oe.removeEventListener("reset",ut)}},[L,g,B]);let Q=g?!!L||!!g.closest("form"):!0,[ae,H]=D.useState(new Set),j=li(),z=Array.from(ae).map(Oe=>Oe.props.value).join(";"),le=D.useCallback(Oe=>{H(ut=>new Set(ut).add(Oe))},[]),k=D.useCallback(Oe=>{H(ut=>{let Ft=new Set(ut);return Ft.delete(Oe),Ft})},[]),qt={required:p,trigger:g,onTriggerChange:d,valueNode:c,onValueNodeChange:x,valueNodeHasChildren:y,onValueNodeHasChildrenChange:I,contentId:j,value:T,onValueChange:B,open:C,onOpenChange:A,dir:b,triggerPointerDownPosRef:O,disabled:f,name:h,autoComplete:m,form:L,nativeOptions:ae,nativeSelectKey:z,isFormControl:Q};return(0,N.jsx)(ty,{...v,children:(0,N.jsx)(iR,{scope:t,...qt,children:(0,N.jsx)(Ti.Provider,{scope:t,children:(0,N.jsx)(fR,{scope:t,onNativeOptionAdd:le,onNativeOptionRemove:k,children:jy(S)?S(qt):a})})})})}ge(zy,"SelectProvider");var Ny=ge(e=>{let{__scopeSelect:t,children:a,...l}=e;return(0,N.jsx)(zy,{__scopeSelect:t,...l,internal_do_not_use_render:({isFormControl:o})=>(0,N.jsxs)(N.Fragment,{children:[a,o?(0,N.jsx)(AR,{__scopeSelect:t}):null]})})},"Select"),dR="SelectTrigger",Tm=D.forwardRef(ge(function(t,a){let{__scopeSelect:l,disabled:o=!1,...n}=t,u=Rm(l),r=Xl(dR,l),s=r.disabled||o,i=he(a,r.onTriggerChange),h=Am(l),m=D.useRef("touch"),[f,p,L]=Dm(v=>{let g=h().filter(x=>!x.disabled),d=g.find(x=>x.value===r.value),c=Em(g,v,d);c!==void 0&&r.onValueChange(c.value)}),S=ge(v=>{s||(r.onOpenChange(!0),L()),v&&(r.triggerPointerDownPosRef.current={x:Math.round(v.pageX),y:Math.round(v.pageY)})},"handleOpen");return(0,N.jsx)(ay,{asChild:!0,...u,children:(0,N.jsx)(it.button,{type:"button",role:"combobox","aria-controls":r.open?r.contentId:void 0,"aria-expanded":r.open,"aria-required":r.required,"aria-autocomplete":"none",dir:r.dir,"data-state":r.open?"open":"closed",disabled:s,"data-disabled":s?"":void 0,"data-placeholder":cr(r.value)?"":void 0,...n,ref:i,onClick:He(n.onClick,v=>{v.currentTarget.focus(),m.current!=="mouse"&&S(v)}),onPointerDown:He(n.onPointerDown,v=>{m.current=v.pointerType;let g=v.target;g.hasPointerCapture(v.pointerId)&&g.releasePointerCapture(v.pointerId),v.button===0&&v.ctrlKey===!1&&v.pointerType==="mouse"&&(S(v),v.preventDefault())}),onKeyDown:He(n.onKeyDown,v=>{let g=f.current!=="";!(v.ctrlKey||v.altKey||v.metaKey)&&v.key.length===1&&p(v.key),!(g&&v.key===" ")&&uR.includes(v.key)&&(S(),v.preventDefault())})})})},"SelectTrigger")),mR="SelectValue",qy=D.forwardRef(ge(function(t,a){let{__scopeSelect:l,className:o,style:n,children:u,placeholder:r="",...s}=t,i=Xl(mR,l),{onValueNodeHasChildrenChange:h}=i,m=u!==void 0,f=he(a,i.onValueNodeChange);Ee(()=>{h(m)},[h,m]);let p=cr(i.value);return(0,N.jsx)(it.span,{...s,asChild:p?!1:s.asChild,ref:f,style:{pointerEvents:"none"},children:(0,N.jsx)(D.Fragment,{children:p?r:u},p?"placeholder":"value")})},"SelectValue")),Fy=D.forwardRef(ge(function(t,a){let{__scopeSelect:l,children:o,...n}=t;return(0,N.jsx)(it.span,{"aria-hidden":!0,...n,ref:a,children:o||"\u25BC"})},"SelectIcon")),pR="SelectPortal",[dD,hR]=Do(pR,{forceMount:void 0});var Mo="SelectContent",km=D.forwardRef(ge(function(t,a){let l=hR(Mo,t.__scopeSelect),{forceMount:o=l.forceMount,...n}=t,u=Xl(Mo,t.__scopeSelect),[r,s]=D.useState();return Ee(()=>{s(new DocumentFragment)},[]),(0,N.jsx)(uy,{present:o||u.open,children:({present:i})=>i?(0,N.jsx)(LR,{...n,ref:a}):(0,N.jsx)(gR,{...n,fragment:r})})},"SelectContent")),gR=D.forwardRef(ge(function(t,a){let{__scopeSelect:l,children:o,fragment:n}=t;return n?wm.createPortal((0,N.jsx)(Vy,{scope:l,children:(0,N.jsx)(Ti.Slot,{scope:l,children:(0,N.jsx)("div",{ref:a,children:o})})}),n):null},"SelectContentFragment")),Sa=10,[Vy,ki]=Do(Mo),xR=da("SelectContent.RemoveScroll"),LR=D.forwardRef(ge(function(t,a){let{__scopeSelect:l}=t,{position:o="item-aligned",onCloseAutoFocus:n,onEscapeKeyDown:u,onPointerDownOutside:r,side:s,sideOffset:i,align:h,alignOffset:m,arrowPadding:f,collisionBoundary:p,collisionPadding:L,sticky:S,hideWhenDetached:v,avoidCollisions:g,...d}=t,c=Xl(Mo,l),[x,y]=D.useState(null),[I,b]=D.useState(null),C=he(a,y),[A,T]=D.useState(null),[B,O]=D.useState(null),_=Am(l),[Q,ae]=D.useState(!1),H=D.useRef(!1);D.useEffect(()=>{if(x)return xy(x)},[x]),ai();let j=D.useCallback(q=>{let[Y,...qe]=_().map(Ie=>Ie.ref.current),[ue]=qe.slice(-1),re=document.activeElement;for(let Ie of q)if(Ie===re||(Ie?.scrollIntoView({block:"nearest"}),Ie===Y&&I&&(I.scrollTop=0),Ie===ue&&I&&(I.scrollTop=I.scrollHeight),Ie?.focus(),document.activeElement!==re))return},[_,I]),z=D.useCallback(()=>j([A,x]),[j,A,x]);D.useEffect(()=>{Q&&z()},[Q,z]);let{onOpenChange:le,triggerPointerDownPosRef:k}=c;D.useEffect(()=>{if(x){let q={x:0,y:0},Y=ge(ue=>{q={x:Math.abs(Math.round(ue.pageX)-(k.current?.x??0)),y:Math.abs(Math.round(ue.pageY)-(k.current?.y??0))}},"handlePointerMove"),qe=ge(ue=>{q.x<=10&&q.y<=10?ue.preventDefault():ue.composedPath().includes(x)||le(!1),document.removeEventListener("pointermove",Y),k.current=null},"handlePointerUp");return k.current!==null&&(document.addEventListener("pointermove",Y),document.addEventListener("pointerup",qe,{capture:!0,once:!0})),()=>{document.removeEventListener("pointermove",Y),document.removeEventListener("pointerup",qe,{capture:!0})}}},[x,le,k]),D.useEffect(()=>{let q=ge(()=>le(!1),"close");return window.addEventListener("blur",q),window.addEventListener("resize",q),()=>{window.removeEventListener("blur",q),window.removeEventListener("resize",q)}},[le]);let[qt,Oe]=Dm(q=>{let Y=_().filter(re=>!re.disabled),qe=Y.find(re=>re.ref.current===document.activeElement),ue=Em(Y,q,qe);ue&&setTimeout(()=>ue.ref.current?.focus())}),ut=D.useCallback((q,Y,qe)=>{let ue=!H.current&&!qe;(c.value!==void 0&&c.value===Y||ue)&&(T(q),ue&&(H.current=!0))},[c.value]),Ft=D.useCallback(()=>x?.focus(),[x]),be=D.useCallback((q,Y,qe)=>{let ue=!H.current&&!qe;(c.value!==void 0&&c.value===Y||ue)&&O(q)},[c.value]),Re=o==="popper"?Uy:SR,Vt=Re===Uy?{side:s,sideOffset:i,align:h,alignOffset:m,arrowPadding:f,collisionBoundary:p,collisionPadding:L,sticky:S,hideWhenDetached:v,avoidCollisions:g}:{};return(0,N.jsx)(Vy,{scope:l,content:x,viewport:I,onViewportChange:b,itemRefCallback:ut,selectedItem:A,onItemLeave:Ft,itemTextRefCallback:be,focusSelectedItem:z,selectedItemText:B,position:o,isPositioned:Q,searchRef:qt,children:(0,N.jsx)(bm,{as:xR,allowPinchZoom:!0,children:(0,N.jsx)(XS,{asChild:!0,trapped:c.open,onMountAutoFocus:q=>{q.preventDefault()},onUnmountAutoFocus:He(n,q=>{c.trigger?.focus({preventScroll:!0}),q.preventDefault()}),children:(0,N.jsx)(HS,{asChild:!0,disableOutsidePointerEvents:!0,onEscapeKeyDown:u,onPointerDownOutside:r,onFocusOutside:q=>q.preventDefault(),onDismiss:()=>c.onOpenChange(!1),children:(0,N.jsx)(Re,{role:"listbox",id:c.contentId,"data-state":c.open?"open":"closed",dir:c.dir,onContextMenu:q=>q.preventDefault(),...d,...Vt,onPlaced:()=>ae(!0),ref:C,style:{display:"flex",flexDirection:"column",outline:"none",...d.style},onKeyDown:He(d.onKeyDown,q=>{let Y=q.ctrlKey||q.altKey||q.metaKey;if(q.key==="Tab"&&q.preventDefault(),!Y&&q.key.length===1&&Oe(q.key),["ArrowUp","ArrowDown","Home","End"].includes(q.key)){let ue=_().filter(re=>!re.disabled).map(re=>re.ref.current);if(["ArrowUp","End"].includes(q.key)&&(ue=ue.slice().reverse()),["ArrowUp","ArrowDown"].includes(q.key)){let re=q.target,Ie=ue.indexOf(re);ue=ue.slice(Ie+1)}setTimeout(()=>j(ue)),q.preventDefault()}})})})})})})},"SelectContentImpl")),SR=D.forwardRef(ge(function(t,a){let{__scopeSelect:l,onPlaced:o,...n}=t,u=Xl(Mo,l),r=ki(Mo,l),[s,i]=D.useState(null),[h,m]=D.useState(null),f=he(a,m),p=Am(l),L=D.useRef(!1),S=D.useRef(!0),{viewport:v,selectedItem:g,selectedItemText:d,focusSelectedItem:c}=r,x=D.useCallback(()=>{if(u.trigger&&u.valueNode&&s&&h&&v&&g&&d){let C=u.trigger.getBoundingClientRect(),A=h.getBoundingClientRect(),T=u.valueNode.getBoundingClientRect(),B=d.getBoundingClientRect();if(u.dir!=="rtl"){let re=B.left-A.left,Ie=T.left-re,Lt=C.left-Ie,Gt=C.width+Lt,Ei=Math.max(Gt,A.width),Oi=window.innerWidth-Sa,Bi=Qs(Ie,[Sa,Math.max(Sa,Oi-Ei)]);s.style.minWidth=Gt+"px",s.style.left=Bi+"px"}else{let re=A.right-B.right,Ie=window.innerWidth-T.right-re,Lt=window.innerWidth-C.right-Ie,Gt=C.width+Lt,Ei=Math.max(Gt,A.width),Oi=window.innerWidth-Sa,Bi=Qs(Ie,[Sa,Math.max(Sa,Oi-Ei)]);s.style.minWidth=Gt+"px",s.style.right=Bi+"px"}let O=p(),_=window.innerHeight-Sa*2,Q=v.scrollHeight,ae=window.getComputedStyle(h),H=parseInt(ae.borderTopWidth,10),j=parseInt(ae.paddingTop,10),z=parseInt(ae.borderBottomWidth,10),le=parseInt(ae.paddingBottom,10),k=H+j+Q+le+z,qt=Math.min(g.offsetHeight*5,k),Oe=window.getComputedStyle(v),ut=parseInt(Oe.paddingTop,10),Ft=parseInt(Oe.paddingBottom,10),be=C.top+C.height/2-Sa,Re=_-be,Vt=g.offsetHeight/2,q=g.offsetTop+Vt,Y=H+j+q,qe=k-Y;if(Y<=be){let re=O.length>0&&g===O[O.length-1].ref.current;s.style.bottom="0px";let Ie=h.clientHeight-v.offsetTop-v.offsetHeight,Lt=Math.max(Re,Vt+(re?Ft:0)+Ie+z),Gt=Y+Lt;s.style.height=Gt+"px"}else{let re=O.length>0&&g===O[0].ref.current;s.style.top="0px";let Lt=Math.max(be,H+v.offsetTop+(re?ut:0)+Vt)+qe;s.style.height=Lt+"px",v.scrollTop=Y-be+v.offsetTop}s.style.margin=`${Sa}px 0`,s.style.minHeight=qt+"px",s.style.maxHeight=_+"px",o?.(),requestAnimationFrame(()=>L.current=!0)}},[p,u.trigger,u.valueNode,s,h,v,g,d,u.dir,o]);Ee(()=>x(),[x]);let[y,I]=D.useState();Ee(()=>{h&&I(window.getComputedStyle(h).zIndex)},[h]);let b=D.useCallback(C=>{C&&S.current===!0&&(x(),c?.(),S.current=!1)},[x,c]);return(0,N.jsx)(vR,{scope:l,contentWrapper:s,shouldExpandOnScrollRef:L,onScrollButtonChange:b,children:(0,N.jsx)("div",{ref:i,style:{display:"flex",flexDirection:"column",position:"fixed",zIndex:y},children:(0,N.jsx)(it.div,{...n,ref:f,style:{boxSizing:"border-box",maxHeight:"100%",...n.style}})})})},"SelectItemAlignedPosition")),Uy=D.forwardRef(ge(function(t,a){let{__scopeSelect:l,align:o="start",collisionPadding:n=Sa,...u}=t,r=Rm(l);return(0,N.jsx)(ly,{...r,...u,ref:a,align:o,collisionPadding:n,style:{boxSizing:"border-box",...u.style,"--radix-select-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-select-content-available-width":"var(--radix-popper-available-width)","--radix-select-content-available-height":"var(--radix-popper-available-height)","--radix-select-trigger-width":"var(--radix-popper-anchor-width)","--radix-select-trigger-height":"var(--radix-popper-anchor-height)"}})},"SelectPopperPosition")),[vR,yR]=Do(Mo,{}),Hy="SelectViewport",Gy=D.forwardRef(ge(function(t,a){let{__scopeSelect:l,nonce:o,...n}=t,u=ki(Hy,l),r=yR(Hy,l),s=he(a,u.onViewportChange),i=D.useRef(0);return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)("style",{dangerouslySetInnerHTML:{__html:"[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"},nonce:o}),(0,N.jsx)(Ti.Slot,{scope:l,children:(0,N.jsx)(it.div,{"data-radix-select-viewport":"",role:"presentation",...n,ref:s,style:{position:"relative",flex:1,overflow:"hidden auto",...n.style},onScroll:He(n.onScroll,h=>{let m=h.currentTarget,{contentWrapper:f,shouldExpandOnScrollRef:p}=r;if(p?.current&&f){let L=Math.abs(i.current-m.scrollTop);if(L>0){let S=window.innerHeight-Sa*2,v=parseFloat(f.style.minHeight),g=parseFloat(f.style.height),d=Math.max(v,g);if(d<S){let c=d+L,x=Math.min(S,c),y=c-x;f.style.height=x+"px",f.style.bottom==="0px"&&(m.scrollTop=y>0?y:0,f.style.justifyContent="flex-end")}}}i.current=m.scrollTop})})})]})},"SelectViewport")),CR="SelectGroup",[mD,pD]=Do(CR);var Im="SelectItem",[bR,IR]=Do(Im),Mm=D.forwardRef(ge(function(t,a){let{__scopeSelect:l,value:o,disabled:n=!1,textValue:u,...r}=t,s=Xl(Im,l),i=ki(Im,l),h=s.value===o,[m,f]=D.useState(u??""),[p,L]=D.useState(!1),S=Tt(x=>i.itemRefCallback?.(x,o,n)),v=he(a,S),g=li(),d=D.useRef("touch"),c=ge(()=>{n||(s.onValueChange(o),s.onOpenChange(!1))},"handleSelect");return(0,N.jsx)(bR,{scope:l,value:o,disabled:n,textId:g,isSelected:h,onItemTextChange:D.useCallback(x=>{f(y=>y||(x?.textContent??"").trim())},[]),children:(0,N.jsx)(Ti.ItemSlot,{scope:l,value:o,disabled:n,textValue:m,children:(0,N.jsx)(it.div,{role:"option","aria-labelledby":g,"data-highlighted":p?"":void 0,"aria-selected":h&&p,"data-state":h?"checked":"unchecked","aria-disabled":n||void 0,"data-disabled":n?"":void 0,tabIndex:n?void 0:-1,...r,ref:v,onFocus:He(r.onFocus,()=>L(!0)),onBlur:He(r.onBlur,()=>L(!1)),onClick:He(r.onClick,()=>{d.current!=="mouse"&&c()}),onPointerUp:He(r.onPointerUp,()=>{d.current==="mouse"&&c()}),onPointerDown:He(r.onPointerDown,x=>{d.current=x.pointerType}),onPointerMove:He(r.onPointerMove,x=>{d.current=x.pointerType,n?i.onItemLeave?.():d.current==="mouse"&&x.currentTarget.focus({preventScroll:!0})}),onPointerLeave:He(r.onPointerLeave,x=>{x.currentTarget===document.activeElement&&i.onItemLeave?.()}),onKeyDown:He(r.onKeyDown,x=>{n||x.target!==x.currentTarget||i.searchRef?.current!==""&&x.key===" "||(rR.includes(x.key)&&c(),x.key===" "&&x.preventDefault())})})})})},"SelectItem")),Ri="SelectItemText",Xy=D.forwardRef(ge(function(t,a){let{__scopeSelect:l,className:o,style:n,...u}=t,r=Xl(Ri,l),s=ki(Ri,l),i=IR(Ri,l),h=cR(Ri,l),[m,f]=D.useState(null),p=Tt(c=>s.itemTextRefCallback?.(c,i.value,i.disabled)),L=he(a,f,i.onItemTextChange,p),S=m?.textContent,v=D.useMemo(()=>(0,N.jsx)("option",{value:i.value,disabled:i.disabled,children:S},i.value),[i.disabled,i.value,S]),{onNativeOptionAdd:g,onNativeOptionRemove:d}=h;return Ee(()=>(g(v),()=>d(v)),[g,d,v]),(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(it.span,{id:i.textId,...u,ref:L}),i.isSelected&&r.valueNode&&!r.valueNodeHasChildren&&!cr(r.value)?wm.createPortal(u.children,r.valueNode):null]})},"SelectItemText"));var wR="SelectBubbleInput",AR=D.forwardRef(ge(function({__scopeSelect:t,...a},l){let o=Xl(wR,t),{value:n,onValueChange:u,required:r,disabled:s,name:i,autoComplete:h,form:m}=o,{nativeOptions:f,nativeSelectKey:p}=o,L=D.useRef(null),S=he(l,L),v=n??"",g=sm(v),d=Array.from(f).some(c=>(c.props.value??"")==="");return D.useEffect(()=>{let c=L.current;if(!c)return;let x=window.HTMLSelectElement.prototype,I=Object.getOwnPropertyDescriptor(x,"value").set;if(g!==v&&I){let b=new Event("change",{bubbles:!0});I.call(c,v),c.dispatchEvent(b)}},[g,v]),(0,N.jsxs)(it.select,{"aria-hidden":!0,required:r,tabIndex:-1,name:i,autoComplete:h,disabled:s,form:m,onChange:c=>u(c.target.value),...a,style:{...hy,...a.style},ref:S,defaultValue:v,children:[cr(n)&&!d?(0,N.jsx)("option",{value:""}):null,Array.from(f)]},p)},"SelectBubbleInput"));function jy(e){return typeof e=="function"}ge(jy,"isFunction");function cr(e){return e===""||e===void 0}ge(cr,"shouldShowPlaceholder");function Dm(e){let t=Tt(e),a=D.useRef(""),l=D.useRef(0),o=D.useCallback(u=>{let r=a.current+u;t(r),ge((function s(i){a.current=i,window.clearTimeout(l.current),i!==""&&(l.current=window.setTimeout(()=>s(""),1e3))}),"updateSearch")(r)},[t]),n=D.useCallback(()=>{a.current="",window.clearTimeout(l.current)},[]);return D.useEffect(()=>()=>window.clearTimeout(l.current),[]),[a,o,n]}ge(Dm,"useTypeaheadSearch");function Em(e,t,a){let o=t.length>1&&Array.from(t).every(i=>i===t[0])?t[0]:t,n=a?e.indexOf(a):-1,u=Yy(e,Math.max(n,0));o.length===1&&(u=u.filter(i=>i!==a));let s=u.find(i=>i.textValue.toLowerCase().startsWith(o.toLowerCase()));return s!==a?s:void 0}ge(Em,"findNextItem");function Yy(e,t){return e.map((a,l)=>e[(t+l)%e.length])}ge(Yy,"wrapArray");var il=R(V(),1),Xn=Ny;var jn=qy,Eo=(0,Mi.forwardRef)(({className:e,children:t,...a},l)=>(0,il.jsxs)(Tm,{ref:l,className:lt("flex h-8 w-full items-center justify-between gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-md-sm text-foreground","focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1","disabled:cursor-not-allowed disabled:opacity-50","[&>span]:line-clamp-1",e),...a,children:[t,(0,il.jsx)(Fy,{asChild:!0,children:(0,il.jsx)($u,{className:"h-4 w-4 opacity-50"})})]}));Eo.displayName=Tm.displayName;var Oo=(0,Mi.forwardRef)(({className:e,children:t,position:a="item-aligned",...l},o)=>(0,il.jsx)(km,{ref:o,className:lt("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md","data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95","data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",a==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",e),position:a,...l,children:(0,il.jsx)(Gy,{className:lt("p-1",a==="popper"&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:t})}));Oo.displayName=km.displayName;var fl=(0,Mi.forwardRef)(({className:e,children:t,...a},l)=>(0,il.jsx)(Mm,{ref:l,className:lt("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-md-sm outline-none","focus:bg-accent focus:text-accent-foreground","data-[disabled]:pointer-events-none data-[disabled]:opacity-50",e),...a,children:(0,il.jsx)(Xy,{children:t})}));fl.displayName=Mm.displayName;var G=R(V(),1),TR="/rekam-medik/search?opsi=kodeicd10&q=";function Ky({rows:e,onChange:t}){let[a,l]=(0,jl.useState)([]),[o,n]=(0,jl.useState)(-1),[u,r]=(0,jl.useState)({top:0,left:0,width:0}),[s,i]=(0,jl.useState)(""),h=(0,jl.useRef)(null),m=(0,jl.useRef)(null),f=(d,c)=>t(e.map((x,y)=>y===d?{...x,...c}:x)),p=d=>t(e.filter((c,x)=>x!==d)),L=(d,c,x)=>{if(i(""),clearTimeout(h.current??void 0),m.current?.abort(),d.length<3){l([]),n(-1);return}let y=x.getBoundingClientRect();r({top:y.bottom+2,left:y.left,width:y.width}),h.current=setTimeout(async()=>{let I=new AbortController;m.current=I;try{let b=await fetch(`${TR}${encodeURIComponent(d)}`,{signal:I.signal});if(!b.ok){i("HTTP "+b.status);return}let C=await b.text();if(!C||C==="[]"){i("Data tidak ditemukan");return}let A;try{if(A=JSON.parse(C),!Array.isArray(A))throw new Error("not array")}catch{A=C.split(`
`).filter(T=>T.includes("|")).map(T=>{let[B,O,_]=T.split("|");return{NAMA:B.trim(),KODE:O.trim(),ID:_.trim()}}).filter(T=>T.KODE)}A.length>0?(l(A.slice(0,15)),n(c)):i("Data tidak ditemukan")}catch(b){i(String(b))}},300)},S=(d,c)=>{f(d,{idicd:c.ID,kode10:c.KODE,namaDiagnosa:c.NAMA}),l([]),n(-1)},v=d=>c=>{f(d,{namaDiagnosa:c.target.value}),L(c.target.value,d,c.currentTarget)},g=d=>c=>{f(d,{kode10:c.target.value})};return(0,G.jsxs)("div",{children:[(0,G.jsx)("div",{className:"flex justify-end mb-3",children:(0,G.jsxs)(fa,{variant:"default",size:"sm",onClick:()=>t([...e,{idicd:"",kode10:"",namaDiagnosa:"",kasus:"",komplikasi:""}]),children:[(0,G.jsx)(Lo,{className:"size-4"})," Tambah Diagnosa"]})}),e.length===0?(0,G.jsxs)("div",{className:"border-2 border-dashed border-border rounded-xl py-8 text-center bg-card",children:[(0,G.jsx)("p",{className:"text-[16px] text-muted-foreground",children:"Belum ada diagnosa"}),(0,G.jsx)("p",{className:"text-[14px] text-muted-foreground mt-1",children:'Klik "Tambah Diagnosa" untuk menambahkan'})]}):(0,G.jsx)("div",{className:"space-y-3",children:e.map((d,c)=>{let x=c+1;return(0,G.jsxs)("div",{className:"bg-card rounded-xl border-2 border-border p-3",children:[(0,G.jsxs)("div",{className:"mb-2",children:[(0,G.jsx)(Xe,{children:"Nama Diagnosa"}),(0,G.jsxs)("div",{className:"relative",children:[(0,G.jsx)(ll,{id:`rj-nama${x}`,name:"nama[]",value:d.namaDiagnosa,placeholder:"Cari diagnosa...",autoComplete:"off",onChange:v(c)}),(0,G.jsx)("input",{type:"hidden",id:`rj-idicd${x}`,name:"idicd[]",value:d.idicd}),a.length>0&&o===c&&(0,G.jsx)("div",{className:"fixed z-[2147483647] bg-card border-2 border-border rounded-xl shadow-lg max-h-[240px] overflow-auto",style:{top:u.top,left:u.left,width:u.width},children:a.map((y,I)=>(0,G.jsxs)("div",{onClick:()=>S(c,y),className:"px-3.5 py-2.5 cursor-pointer text-sm border-b border-border hover:bg-muted/50 transition-colors",children:[(0,G.jsx)("div",{className:"font-medium text-foreground",children:y.NAMA}),(0,G.jsx)("div",{className:"text-muted-foreground text-xs",children:y.KODE})]},y.ID||I))}),s&&(0,G.jsx)("div",{className:"fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-2.5 py-2 text-sm text-destructive",style:{top:u.top,left:u.left},children:s})]})]}),(0,G.jsxs)("div",{className:"grid grid-cols-[1fr_120px_100px_36px] gap-2 items-end",children:[(0,G.jsxs)("div",{children:[(0,G.jsx)(Xe,{children:"Kode ICD-10"}),(0,G.jsx)(ll,{id:`rj-kode${x}`,name:"kode10[]",value:d.kode10,placeholder:"Kode",onChange:g(c),className:"font-mono"})]}),(0,G.jsxs)("div",{children:[(0,G.jsx)(Xe,{children:"Kasus"}),(0,G.jsxs)(Xn,{value:d.kasus,onValueChange:y=>f(c,{kasus:y}),children:[(0,G.jsx)(Eo,{className:"h-[32px] text-xs",children:(0,G.jsx)(jn,{placeholder:"Pilih"})}),(0,G.jsxs)(Oo,{className:"z-[1050]",children:[(0,G.jsx)(fl,{value:"BARU",children:"Baru"}),(0,G.jsx)(fl,{value:"LAMA",children:"Lama"})]})]})]}),(0,G.jsxs)("div",{children:[(0,G.jsx)(Xe,{children:"Komplikasi"}),(0,G.jsxs)(Xn,{value:d.komplikasi,onValueChange:y=>f(c,{komplikasi:y}),children:[(0,G.jsx)(Eo,{className:"h-[32px] text-xs",children:(0,G.jsx)(jn,{placeholder:"Pilih"})}),(0,G.jsxs)(Oo,{className:"z-[1050]",children:[(0,G.jsx)(fl,{value:"YA",children:"Ya"}),(0,G.jsx)(fl,{value:"TIDAK",children:"Tidak"})]})]})]}),(0,G.jsx)(fa,{variant:"ghost",size:"icon",onClick:()=>p(c),className:"h-8 w-8 text-muted-foreground hover:text-destructive",children:(0,G.jsx)(So,{className:"size-4"})})]})]},c)})})]})}var Yl=R(U(),1);var Z=R(V(),1),kR="/rekam-medik/search?opsi=clauseDiagnose_icd9&q=",MR=[{value:"Primer",label:"Utama (Primer)"},{value:"Sekunder",label:"Tambahan (Sekunder)"}],DR=[{value:"",label:"Pilih Kategori Prosedur"},{value:"24642003",label:"Layanan Psikiatri"},{value:"409063005",label:"Konseling"},{value:"409073007",label:"Edukasi"},{value:"387713003",label:"Tindakan Bedah"},{value:"103693007",label:"Pemeriksaan Diagnostik"},{value:"46947000",label:"Manipulasi Terapi"},{value:"410606002",label:"Pelayanan Sosial"},{value:"277132007",label:"Tindakan Terapeutik"}];function Zy({rows:e,onChange:t}){let[a,l]=(0,Yl.useState)([]),[o,n]=(0,Yl.useState)(-1),[u,r]=(0,Yl.useState)({top:0,left:0,width:0}),[s,i]=(0,Yl.useState)(""),h=(0,Yl.useRef)(null),m=(0,Yl.useRef)(null),f=(d,c)=>t(e.map((x,y)=>y===d?{...x,...c}:x)),p=d=>t(e.filter((c,x)=>x!==d)),L=(d,c,x)=>{if(i(""),clearTimeout(h.current??void 0),m.current?.abort(),d.length<3){l([]),n(-1);return}let y=x.getBoundingClientRect();r({top:y.bottom+2,left:y.left,width:y.width}),h.current=setTimeout(async()=>{let I=new AbortController;m.current=I;try{let b=await fetch(`${kR}${encodeURIComponent(d)}&limit=10`,{signal:I.signal});if(!b.ok){i("HTTP "+b.status);return}let C=await b.text();if(!C||C==="[]"){i("Data tidak ditemukan");return}let A;try{if(A=JSON.parse(C),!Array.isArray(A))throw new Error("not array")}catch{A=C.split(`
`).filter(T=>T.includes("|")).map(T=>{let[B,O,_]=T.split("|");return{NAMA:B.trim(),KODE:O.trim(),ID:_.trim()}}).filter(T=>T.KODE)}A.length>0?(l(A.slice(0,15)),n(c)):i("Data tidak ditemukan")}catch(b){i(String(b))}},300)},S=(d,c)=>{f(d,{idicdTindakan:c.ID,kode9:c.KODE,namaTindakan:c.NAMA}),l([]),n(-1)},v=d=>c=>{f(d,{namaTindakan:c.target.value}),L(c.target.value,d,c.currentTarget)},g=d=>c=>{f(d,{kode9:c.target.value})};return(0,Z.jsxs)("div",{children:[(0,Z.jsx)("div",{className:"flex justify-end mb-3",children:(0,Z.jsxs)(fa,{variant:"default",size:"sm",onClick:()=>t([...e,{idicdTindakan:"",kode9:"",namaTindakan:"",komorbid:"",kategoriProsedur:"",snomedProsedur:"",codeProsedur:""}]),children:[(0,Z.jsx)(Lo,{className:"size-4"})," Tambah Tindakan"]})}),e.length===0?(0,Z.jsxs)("div",{className:"border-2 border-dashed border-border rounded-xl py-8 text-center bg-card",children:[(0,Z.jsx)("p",{className:"text-[16px] text-muted-foreground",children:"Belum ada tindakan"}),(0,Z.jsx)("p",{className:"text-[14px] text-muted-foreground mt-1",children:'Klik "Tambah Tindakan" untuk menambahkan'})]}):(0,Z.jsx)("div",{className:"space-y-3",children:e.map((d,c)=>{let x=c+1;return(0,Z.jsxs)("div",{className:"bg-card rounded-xl border-2 border-border p-3",children:[(0,Z.jsxs)("div",{className:"mb-2",children:[(0,Z.jsx)(Xe,{children:"Nama Tindakan"}),(0,Z.jsxs)("div",{className:"relative",children:[(0,Z.jsx)(ll,{id:`rj-tindakan${x}`,name:"namaTindakan[]",value:d.namaTindakan,placeholder:"Cari tindakan...",autoComplete:"off",onChange:v(c)}),(0,Z.jsx)("input",{type:"hidden",id:`rj-idicdTindakan${x}`,name:"idicdTindakan[]",value:d.idicdTindakan}),a.length>0&&o===c&&(0,Z.jsx)("div",{className:"fixed z-[2147483647] bg-card border-2 border-border rounded-xl shadow-lg max-h-[240px] overflow-auto",style:{top:u.top,left:u.left,width:u.width},children:a.map((y,I)=>(0,Z.jsxs)("div",{onClick:()=>S(c,y),className:"px-3.5 py-2.5 cursor-pointer text-sm border-b border-border hover:bg-muted/50 transition-colors",children:[(0,Z.jsx)("div",{className:"font-medium text-foreground",children:y.NAMA}),(0,Z.jsx)("div",{className:"text-muted-foreground text-xs",children:y.KODE})]},y.ID||I))}),s&&(0,Z.jsx)("div",{className:"fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-2.5 py-2 text-sm text-destructive",style:{top:u.top,left:u.left},children:s})]})]}),(0,Z.jsxs)("div",{className:"grid grid-cols-[1fr_140px_180px_36px] gap-2 items-end",children:[(0,Z.jsxs)("div",{children:[(0,Z.jsx)(Xe,{children:"Kode ICD-9"}),(0,Z.jsx)(ll,{id:`rj-kode9${x}`,name:"kode9[]",value:d.kode9,placeholder:"Kode",onChange:g(c),className:"font-mono"})]}),(0,Z.jsxs)("div",{children:[(0,Z.jsx)(Xe,{children:"Jenis"}),(0,Z.jsxs)(Xn,{value:d.komorbid,onValueChange:y=>f(c,{komorbid:y}),children:[(0,Z.jsx)(Eo,{className:"h-[32px] text-xs",children:(0,Z.jsx)(jn,{placeholder:"Pilih"})}),(0,Z.jsx)(Oo,{className:"z-[1050]",children:MR.map(y=>(0,Z.jsx)(fl,{value:y.value,children:y.label},y.value))})]})]}),(0,Z.jsxs)("div",{children:[(0,Z.jsx)(Xe,{required:!0,children:"Kategori Prosedur"}),(0,Z.jsxs)(Xn,{value:d.kategoriProsedur,onValueChange:y=>f(c,{kategoriProsedur:y}),children:[(0,Z.jsx)(Eo,{className:"h-[32px] text-xs",children:(0,Z.jsx)(jn,{placeholder:"Pilih Kategori"})}),(0,Z.jsx)(Oo,{className:"z-[1050]",children:DR.map(y=>(0,Z.jsx)(fl,{value:y.value,children:y.label},y.value||"empty"))})]})]}),(0,Z.jsx)(fa,{variant:"ghost",size:"icon",onClick:()=>p(c),className:"h-8 w-8 text-muted-foreground hover:text-destructive",children:(0,Z.jsx)(So,{className:"size-4"})})]})]},c)})})]})}var je=R(V(),1);function Qy({errors:e,warnings:t=[]}){return e.length>0||t.length>0?(0,je.jsxs)(je.Fragment,{children:[t.length>0&&(0,je.jsx)("div",{className:"px-6 py-4 border-t-2 border-border bg-yellow-50 dark:bg-yellow-950/30",role:"alert",children:(0,je.jsxs)("div",{className:"flex items-start gap-3",children:[(0,je.jsx)(ia,{className:"size-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5"}),(0,je.jsxs)("div",{children:[(0,je.jsx)("p",{className:"text-[15px] font-bold text-yellow-800 dark:text-yellow-300 mb-1",children:"Perhatian"}),(0,je.jsx)("ul",{className:"space-y-1",children:t.map((l,o)=>(0,je.jsxs)("li",{className:"text-[14px] text-yellow-700 dark:text-yellow-400",children:[l.section,": ",l.message]},o))})]})]})}),e.length>0&&(0,je.jsx)("div",{className:"px-6 py-4 border-t-2 border-border bg-destructive/5",role:"alert",children:(0,je.jsxs)("div",{className:"flex items-start gap-3",children:[(0,je.jsx)(ia,{className:"size-5 text-destructive shrink-0 mt-0.5"}),(0,je.jsxs)("div",{children:[(0,je.jsxs)("p",{className:"text-[15px] font-bold text-destructive mb-1",children:["Terdapat ",e.length," kesalahan"]}),(0,je.jsx)("ul",{className:"space-y-1",children:e.map((l,o)=>(0,je.jsxs)("li",{className:"text-[14px] text-destructive/80",children:[l.section,": ",l.message]},o))})]})]})})]}):null}var Yn=R(V(),1),ER={default:"bg-primary/10 text-primary border-primary/20",success:"bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",warning:"bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",danger:"bg-destructive/10 text-destructive border-destructive/20"},OR={default:er,success:Ju,warning:ia,danger:Dn};function Om({variant:e="default",icon:t,children:a,className:l,onDismiss:o}){let n=OR[e];return(0,Yn.jsxs)("span",{className:lt("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",ER[e],l),children:[t&&(0,Yn.jsx)(n,{className:"size-3"}),a,o&&(0,Yn.jsx)("button",{onClick:o,className:"ml-0.5 hover:opacity-70","aria-label":"Dismiss",children:(0,Yn.jsx)(Dn,{className:"size-2.5"})})]})}var va=R(V(),1);function Wy({onCancel:e,onSave:t,saving:a,hasErrors:l,lastSaved:o,onRefresh:n}){return(0,va.jsxs)("div",{className:"flex items-center justify-between px-5 py-3 border-t border-border shrink-0 bg-card",children:[(0,va.jsxs)("div",{className:"flex items-center gap-3",children:[l&&(0,va.jsx)(Om,{variant:"danger",icon:!0,children:"Validasi gagal"}),o&&(0,va.jsxs)("span",{className:"text-muted-foreground text-xs",children:["Tersimpan ",o]}),a&&(0,va.jsx)(Om,{variant:"default",icon:!0,children:"Menyimpan..."})]}),(0,va.jsxs)("div",{className:"flex items-center gap-2",children:[n&&(0,va.jsx)(fa,{type:"button",variant:"ghost",size:"default",onClick:n,children:"Reset"}),(0,va.jsx)(fa,{type:"button",variant:"outline",size:"default",onClick:e,children:"Batal"}),(0,va.jsx)(fa,{type:"button",variant:"default",size:"lg",onClick:t,disabled:a||l,children:a?"Menyimpan...":"Simpan"})]})]})}var xe=R(V(),1);function Jy(e){let t=[];return e.diagnosa.forEach((a,l)=>{!a.kode10&&!a.namaDiagnosa||(a.kode10&&!a.namaDiagnosa&&t.push({section:`Diagnosa #${l+1}`,message:"Nama diagnosa kosong"}),a.namaDiagnosa&&!a.kode10&&t.push({section:`Diagnosa #${l+1}`,message:"Kode ICD-10 kosong"}))}),e.tindakan.forEach((a,l)=>{a.kode9&&(a.namaTindakan||t.push({section:`Tindakan #${l+1}`,message:"Nama tindakan kosong"}),a.idicdTindakan?.trim()&&a.kode9?.trim()&&a.namaTindakan?.trim()&&!a.kategoriProsedur?.trim()&&t.push({section:`Tindakan #${l+1}`,message:"Kategori Prosedur belum dipilih"}))}),t}function $y({data:e,onSave:t,onClose:a}){let[l,o]=(0,ya.useState)(e),[n,u]=(0,ya.useState)(!1),[r,s]=(0,ya.useState)(null),[i,h]=(0,ya.useState)(!1),[m,f]=(0,ya.useState)([]),[p,L]=(0,ya.useState)([]),S=(0,ya.useRef)(l.diagnosa.some(y=>y.idicd?.trim())),v=i?Jy(l):[],g=[...v,...p],d=v.length>0,c=(0,ya.useCallback)(async()=>{if(h(!0),f([]),L([]),Jy(l).length>0)return;let I=l.diagnosa.filter(b=>b.idicd?.trim()&&b.kode10?.trim()&&b.namaDiagnosa?.trim());S.current&&I.length===0&&f([{section:"Diagnosa",message:"Semua diagnosa telah dihapus. Sistem Morbis biasanya tidak menghapus ICD yang sudah tersimpan ketika daftar diagnosa dikosongkan."}]),u(!0);try{await t(l),s(new Date().toLocaleTimeString())}catch(b){let C=b instanceof Error?b.message:String(b);L([{section:"Server",message:C}])}finally{u(!1)}},[l,t]),x=(y,I)=>o({...l,clinicalNotes:{...l.clinicalNotes,[y]:I}});return(0,xe.jsxs)("div",{className:"resume-modal",children:[(0,xe.jsx)(tS,{title:"Resume Rawat Jalan",onClose:a,patientInfo:l.patientInfo}),(0,xe.jsxs)("div",{className:"flex-1 overflow-y-auto px-5 py-4 space-y-3",children:[(0,xe.jsx)(kn,{title:"Data Klinis",children:(0,xe.jsx)(aS,{anamnesa:l.clinicalNotes.anamnesa,pemeriksaan:l.clinicalNotes.pemeriksaan_fisik,onChange:(y,I)=>x(y==="pemeriksaan"?"pemeriksaan_fisik":y,I)})}),(0,xe.jsx)(kn,{title:"Tanda Vital",children:(0,xe.jsx)(nS,{vitals:l.vitalSigns,onChange:(y,I)=>o({...l,vitalSigns:{...l.vitalSigns,[y]:I}})})}),(0,xe.jsx)(kn,{title:"Catatan Medis",children:(0,xe.jsxs)("div",{className:"space-y-3",children:[(0,xe.jsxs)("div",{children:[(0,xe.jsx)(Xe,{children:"Catatan Diagnosis"}),(0,xe.jsx)(ql,{value:l.clinicalNotes.catatan,onChange:y=>x("catatan",y.target.value),placeholder:"Catatan diagnosa...",rows:3})]}),(0,xe.jsxs)("div",{children:[(0,xe.jsx)(Xe,{children:"Tindakan"}),(0,xe.jsx)(ql,{value:l.clinicalNotes.tindakan,onChange:y=>x("tindakan",y.target.value),placeholder:"Tindakan...",rows:3})]}),(0,xe.jsxs)("div",{children:[(0,xe.jsx)(Xe,{children:"Terapi Pengobatan"}),(0,xe.jsx)(ql,{value:l.clinicalNotes.terapi_pengobatan,onChange:y=>x("terapi_pengobatan",y.target.value),placeholder:"Terapi pengobatan...",rows:3})]})]})}),(0,xe.jsx)(kn,{title:`Diagnosis (ICD-10)${l.diagnosa.length>0?` (${l.diagnosa.length})`:""}`,children:(0,xe.jsx)(Ky,{rows:l.diagnosa,onChange:y=>o({...l,diagnosa:y})})}),(0,xe.jsx)(kn,{title:`Tindakan (ICD-9)${l.tindakan.length>0?` (${l.tindakan.length})`:""}`,children:(0,xe.jsx)(Zy,{rows:l.tindakan,onChange:y=>o({...l,tindakan:y})})})]}),(0,xe.jsx)(Qy,{errors:g,warnings:m}),(0,xe.jsx)(Wy,{saving:n,hasErrors:d,lastSaved:r,onSave:c,onCancel:a,onRefresh:()=>location.reload()})]})}var eC=R(U(),1),Di=class extends eC.Component{constructor(){super(...arguments);this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(){this.props.onError()}render(){return this.state.hasError?null:this.props.children}};var _m=R(V(),1),BR=[{pattern:"periksa.*dokter",weight:1},{pattern:"konsultasi",weight:2},{pattern:"tindakan utama",weight:3},{pattern:"lab",weight:10},{pattern:"glukosa",weight:11},{pattern:"hba1c",weight:12},{pattern:"hb a1c",weight:12}];function tC(e){let t=new Map;return[...e].sort((a,l)=>{let o=n=>{let u=n.toLowerCase().trim();for(let r of BR)if(t.has(r.pattern)||t.set(r.pattern,new RegExp(r.pattern,"i")),t.get(r.pattern).test(u))return r.weight;return 999};return o(a)-o(l)})}function PR(e){if(!e)return"";let t=e.trim();return t?t.charAt(0).toUpperCase()+t.slice(1):""}function aC(e){return e.map(PR).join(`
`)}function nC(){let e=document.getElementById("pembayaran-gabung")||document.body,t=[],a=[],l=e.querySelectorAll("tr"),o=!1;for(let s of l){let i=s.textContent?.trim()||"";if(s.querySelector("b")&&!i.match(/^\d/)){o=!0;continue}if(o&&(i.includes("Total")||i.includes("Sub Total"))){o=!1;continue}if(o){let m=Array.from(s.querySelectorAll("td"));if(m.length>=5&&m[0]?.textContent?.trim().match(/^\d+\.?$/)){let f=m[2]?.textContent?.trim()||"",p=m[4]?.textContent?.trim()||"1";t.push(p&&p!=="1"?`${f} (${p})`:f)}}}let n=Array.from(e.querySelectorAll("b")).find(s=>s.textContent?.includes("Biaya Resep"));if(n){let s=n.closest("tr")?.nextElementSibling;for(;s&&!s.textContent?.includes("Sub Total");){if(s.getAttribute("valign")==="top"){let i=Array.from(s.querySelectorAll("td")),h=i[1]?.textContent?.trim()||"",m=h.match(/^\d+\s+(.*)/),f=m?m[1]:h,p=i[2]?.textContent?.trim()||"";a.push(p?`${f} Jml: ${p}`:f)}s=s.nextElementSibling}}let u=tC(t),r=tC(a);return{tindakan:aC(u),terapiPengobatan:aC(r)}}var $D=location.pathname.includes("rm-rawat-jalan-new");var _R="/rekam-medik/control/rm-rawat-jalan",Kl=null,Bm=null;function UR(){let e=document.getElementById("resume-view");if(!e)return null;let t=r=>{let s=e.querySelectorAll("table table tr, fieldset table tr");for(let i of s){let h=i.querySelectorAll("td");for(let m=0;m<h.length;m++)if(h[m].textContent?.trim()===r&&h[m+1]){let f=h[m+1];return(f.textContent?.trim()===":"?h[m+2]:f)?.textContent?.trim()||""}}return""},a=()=>{let r=Array.from(e.querySelectorAll("tr")).find(m=>m.textContent?.includes("Hasil Pemeriksaan Fisik"));if(!r)return"";let s=r.querySelector("td:last-child table, td[colspan] table");if(!s)return"";let i=Array.from(s.querySelectorAll("tr")).find(m=>{let f=m.querySelectorAll("td");return Array.from(f).some(p=>p.textContent?.trim()==="Lainnya")});if(!i)return"";let h=i.querySelectorAll("td");for(let m=0;m<h.length;m++)if(h[m].textContent?.trim()==="Lainnya"&&m+2<h.length){let f=h[m+2]?.textContent?.trim()||"",p=["Tensi:","Nadi:","Suhu:","Nafas:","Tinggi:","Berat:","Lainnya:"];return f.split(`
`).filter(L=>{let S=L.trim();return S&&!p.some(v=>S.startsWith(v))}).join(`
`)}return""},l=r=>{let s=Array.from(e.querySelectorAll("tr")).find(m=>m.textContent?.includes("Hasil Pemeriksaan Fisik"));if(!s)return"";let i=s.querySelector("td:last-child table, td[colspan] table");if(!i)return"";let h=i.querySelectorAll("tr");for(let m of h){let f=m.querySelectorAll("td");for(let p=0;p<f.length;p++)if(f[p].textContent?.trim()===r&&f[p+1]){let L=f[p+1];return(L.textContent?.trim()===":"?f[p+2]:L)?.textContent?.trim()||""}}return""},o=[],n=Array.from(e.querySelectorAll("tr")).find(r=>r.textContent?.includes("ICD X"));if(n){let r=n.querySelector("td:last-child table, td[colspan] table");if(r){let s=r.querySelectorAll("tr");for(let i of s){let m=(i.textContent?.trim()||"").match(/-\s*(.+?)\s*\(([^)]+)\)\s*-/);m&&o.push({idicd:"",kode10:m[2],namaDiagnosa:m[1],kasus:"",komplikasi:""})}}}let u=[];return{patientInfo:{norm:t("No. Rekam Medis"),pasien:t("Nama Pasien"),nama_dokter:""},clinicalNotes:{anamnesa:t("Anamnesa"),pemeriksaan_fisik:a(),catatan:t("Diagnosa"),tindakan:t("Tindakan"),terapi_pengobatan:t("Terapi Pengobatan")},vitalSigns:{tensi:l("Tensi"),nadi:l("Nadi"),suhu:l("Suhu"),nafas:l("Nafas"),tinggi:l("Tinggi"),berat:l("Berat")},diagnosa:o,tindakan:u}}function HR(){let e=UR(),t=document,a=f=>t.getElementById(f)?.value||"",l=f=>{let p=t.querySelector(`textarea[name="${f}"], input[name="${f}"], #${f}, select[name="${f}"]`);return p?"tagName"in p&&p.tagName==="SELECT"?p.value:p.value||"":""},o=f=>t.querySelector(`input[name="${f}"]:checked`)?.value||"",n={norm:a("norm")||a("no_rm"),pasien:a("pasien")||a("nama_pasien"),nama_dokter:a("nama_dokter")||a("dokter"),id_visit:a("id_visit")||new URLSearchParams(location.search).get("id_visit")||(typeof X?.id_visit=="string"?X.id_visit:""),id_rawat_jalan:a("id_rawat_jalan")||new URLSearchParams(location.search).get("id")||(typeof X?.id_rawat_jalan=="string"?X.id_rawat_jalan:""),id_user:a("id_user")||(typeof X?.id_user=="string"?X.id_user:"")||"1",id_dokter:a("id_dokter")||(typeof X?.id_dokter=="string"?X.id_dokter:""),id_bed:a("id_bed")||(typeof X?.id_bed=="string"?X.id_bed:""),noregis:a("noregis")||(typeof X?.noregis=="string"?X.noregis:"")},u={anamnesa:l("anamnesa"),pemeriksaan_fisik:l("pemeriksaan_fisik")||l("pemeriksaan")||l("fisik")||"",catatan:l("catatan")||"",tindakan:l("tindakan")||l("namaTindakan"),terapi_pengobatan:l("terapi_pengobatan")||"",jenis_kasus:l("jenis_kasus"),status_kasus:o("status_kasus"),tindak_lanjut:l("tindak_lanjut")},r={tensi:a("tensi"),nadi:a("nadi"),suhu:a("suhu"),nafas:a("nafas"),tinggi:a("tinggi"),berat:a("berat")},s=[],i=t.querySelectorAll('input[name="kode10[]"], input[name="kode[]"]');if(i.length===0){let f=1;for(;t.getElementById(`kode${f}`)||t.querySelector(`input[name="kode10[]"]:nth-child(${f})`);){let p=a(`idicd${f}`)||"",L=a(`kode${f}`)||"",S=a(`nama${f}`)||"";(L||S)&&s.push({idicd:p,kode10:L,namaDiagnosa:S,kasus:"",komplikasi:""}),f++}}else i.forEach(f=>{let p=f.closest("tr");if(!p)return;let L=p.querySelector('input[name="idicd[]"], input[name="idicd"]')?.value||"",S=f.value||"",v=p.querySelector('input[name="namaDiagnosa[]"], input[name="nama[]"]')?.value||"",g=p.querySelector('select[name="kasus[]"]')?.value||"",d=p.querySelector('select[name="komplikasi[]"]')?.value||"";(S||v)&&s.push({idicd:L,kode10:S,namaDiagnosa:v,kasus:g,komplikasi:d})});if(s.length===0&&X){let f=Array.isArray(X["kode10[]"])?X["kode10[]"]:[],p=Array.isArray(X["nama[]"])?X["nama[]"]:[],L=Array.isArray(X["idicd[]"])?X["idicd[]"]:[],S=Array.isArray(X["kasus_diagnosa[]"])?X["kasus_diagnosa[]"]:[],v=Array.isArray(X["komplikasi[]"])?X["komplikasi[]"]:[];f.forEach((g,d)=>{g&&s.push({idicd:L[d]||"",kode10:g,namaDiagnosa:p[d]||"",kasus:S[d]||"",komplikasi:v[d]||""})})}let h=[];if(t.querySelectorAll('input[name="kode9[]"]').forEach(f=>{let p=f.closest("tr");if(!p)return;let L=f.value||"";if(!L)return;let S=p.querySelector('input[name="idicdTindakan[]"]')?.value||"",v=p.querySelector('input[name="namaTindakan[]"]')?.value||"",g=p.querySelector('select[name="komorbid[]"]')?.value||"",d=p.querySelector('select[name="kategoriProsedur[]"]')?.value||"",c=p.querySelector('input[name="snomedProsedur[]"]')?.value||"",x=p.querySelector('input[name="codeProsedur[]"]')?.value||L;h.push({idicdTindakan:S,kode9:L,namaTindakan:v,komorbid:g,kategoriProsedur:d,snomedProsedur:c,codeProsedur:x})}),h.length===0&&X){let f=Array.isArray(X["kode9[]"])?X["kode9[]"]:[],p=Array.isArray(X["namaTindakan[]"])?X["namaTindakan[]"]:[],L=Array.isArray(X["idicdTindakan[]"])?X["idicdTindakan[]"]:[],S=Array.isArray(X["komorbid[]"])?X["komorbid[]"]:[],v=Array.isArray(X["kategoriProsedur[]"])?X["kategoriProsedur[]"]:[];f.forEach((g,d)=>{g&&h.push({idicdTindakan:L[d]||"",kode9:g,namaTindakan:p[d]||"",komorbid:S[d]||"",kategoriProsedur:v[d]||""})})}if(e&&(n.norm=n.norm||e.patientInfo.norm,n.pasien=n.pasien||e.patientInfo.pasien,n.nama_dokter=n.nama_dokter||e.patientInfo.nama_dokter,u.anamnesa=u.anamnesa||e.clinicalNotes.anamnesa,u.pemeriksaan_fisik=u.pemeriksaan_fisik||e.clinicalNotes.pemeriksaan_fisik,u.catatan=u.catatan||e.clinicalNotes.catatan,u.tindakan=u.tindakan||e.clinicalNotes.tindakan,u.terapi_pengobatan=u.terapi_pengobatan||e.clinicalNotes.terapi_pengobatan,r.tensi=r.tensi||e.vitalSigns.tensi,r.nadi=r.nadi||e.vitalSigns.nadi,r.suhu=r.suhu||e.vitalSigns.suhu,r.nafas=r.nafas||e.vitalSigns.nafas,r.tinggi=r.tinggi||e.vitalSigns.tinggi,r.berat=r.berat||e.vitalSigns.berat,s.length===0&&s.push(...e.diagnosa),h.length===0&&h.push(...e.tindakan)),!u.tindakan||u.tindakan==="-"||!u.terapi_pengobatan||u.terapi_pengobatan==="-"){let f=nC();f.tindakan&&(!u.tindakan||u.tindakan==="-")&&(u.tindakan=f.tindakan),f.terapiPengobatan&&(!u.terapi_pengobatan||u.terapi_pengobatan==="-")&&(u.terapi_pengobatan=f.terapiPengobatan)}if(X){let f={anamnesa:u.anamnesa,pemeriksaan_fisik:u.pemeriksaan_fisik,catatan:u.catatan,tindakan:u.tindakan,terapi_pengobatan:u.terapi_pengobatan};for(let[p,L]of Object.entries(f))if(!L||L==="-"){let S=X[p];typeof S=="string"&&S&&(u[p]=S)}}return{patientInfo:n,clinicalNotes:u,vitalSigns:r,diagnosa:s,tindakan:h}}function zR(e){let t=[],a=(c,x)=>t.push([c,String(x)]),l=c=>document.querySelector(`input[name="${c}"]`)?.value||"",o=c=>document.getElementById(c)?.value||"",n=c=>document.querySelector(`input[name="${c}"]:checked`)?.value||"",u=c=>typeof X?.[c]=="string"?X[c]:"",r=c=>e.patientInfo?.[c]||"";a("id_visit",r("id_visit")||l("id_visit")||new URLSearchParams(location.search).get("id_visit")||u("id_visit")),a("id_rawat_jalan",r("id_rawat_jalan")||l("id_rawat_jalan")||new URLSearchParams(location.search).get("id")||u("id_rawat_jalan")),a("id_user",r("id_user")||l("id_user")||u("id_user")||"1"),a("id_dokter",r("id_dokter")||l("id_dokter")||u("id_dokter")||""),a("id_bed",r("id_bed")||l("id_bed")||u("id_bed")||""),a("norm",r("norm")||l("norm")||u("norm")||""),a("noregis",r("noregis")||l("noregis")||u("noregis")||""),a("pasien",r("pasien")||l("pasien")||u("pasien")||""),a("nama_dokter",r("nama_dokter")||l("nama_dokter")||u("nama_dokter")||""),a("jenis_kasus",o("jenis_kasus")||u("jenis_kasus")||""),a("tindak_lanjut",o("tindak_lanjut")||u("tindak_lanjut")||""),a("status_kasus",n("status_kasus")||u("status_kasus")||"BARU"),a("rujukan",o("rujukan")||u("rujukan")||"83"),a("keadaan_keluar",o("keadaan_keluar")||u("keadaan_keluar")||"87"),a("cara_keluar",o("cara_keluar")||u("cara_keluar")||"161"),a("pemeriksaan_lanjut",o("pemeriksaan_lanjut")||u("pemeriksaan_lanjut")||"88"),a("pulang_berkas",l("pulang_berkas")||u("pulang_berkas")||""),a("composition_diet",l("composition_diet")||document.getElementById("composition_diet")?.value||u("composition_diet")||""),a("alergiMakananJSON",l("alergiMakananJSON")||u("alergiMakananJSON")||"[]"),a("alergiLingkunganJSON",l("alergiLingkunganJSON")||u("alergiLingkunganJSON")||"[]");let s=new Date,i=c=>c.toString().padStart(2,"0");a("waktu",`${i(s.getDate())}/${i(s.getMonth()+1)}/${s.getFullYear()} ${i(s.getHours())}:${i(s.getMinutes())}:${i(s.getSeconds())}`);let h=c=>c.replace(/\n/g,"<br/>");a("anamnesa",h(e.clinicalNotes.anamnesa)),a("pemeriksaan_fisik",h(e.clinicalNotes.pemeriksaan_fisik)),a("catatan",h(e.clinicalNotes.catatan)),a("tindakan",h(e.clinicalNotes.tindakan)),a("terapi_pengobatan",h(e.clinicalNotes.terapi_pengobatan));let m=c=>c.match(/^([\d/.]+)/)?.[0]||"";a("tensi",m(e.vitalSigns.tensi)),a("nadi",m(e.vitalSigns.nadi)),a("suhu",m(e.vitalSigns.suhu)),a("nafas",m(e.vitalSigns.nafas)),a("tinggi",m(e.vitalSigns.tinggi)),a("berat",m(e.vitalSigns.berat));let f=c=>Array.isArray(X?.[c])?X[c]:[],p=f("kode10[]"),L=f("idicd[]"),S=f("kasus_diagnosa[]"),v=f("komplikasi[]");return e.diagnosa.filter(c=>c.idicd?.trim()&&c.kode10?.trim()&&c.namaDiagnosa?.trim()).filter((c,x,y)=>y.findIndex(I=>I.idicd===c.idicd)===x).forEach(c=>{let x=c.idicd;if(!x&&c.kode10){let y=p.indexOf(c.kode10);y>=0&&L[y]&&(x=L[y])}a("nama[]",c.namaDiagnosa),a("idicd[]",x),a("kode10[]",c.kode10),a("kasus_diagnosa[]",c.kasus||""),a("komplikasi[]",c.komplikasi||"")}),e.tindakan.filter(c=>c.idicdTindakan?.trim()&&c.kode9?.trim()&&c.namaTindakan?.trim()).filter((c,x,y)=>y.findIndex(I=>I.idicdTindakan===c.idicdTindakan&&I.kode9===c.kode9)===x).forEach(c=>{a("namaTindakan[]",c.namaTindakan),a("kode9[]",c.kode9),a("idicdTindakan[]",c.idicdTindakan),a("kategoriProsedur[]",c.kategoriProsedur||""),a("komorbid[]",c.komorbid||""),a("snomedProsedur[]",c.snomedProsedur||""),a("codeProsedur[]",c.codeProsedur||"")}),a("save","Simpan"),t.map(([c,x])=>encodeURIComponent(c)+"="+encodeURIComponent(x)).join("&")}function NR(e){return zR(e)}function Pm(e){Kl&&(Kl.unmount(),Kl=null),e.innerHTML="",e.style.display="none",document.body.classList.remove("ext-resume-open"),Bm&&(Bm.disabled=!1)}function qR(e,t){if(Kl&&(Kl.unmount(),Kl=null),e.innerHTML="",!document.getElementById("morbis-resume-fonts")){let l=document.createElement("link");l.id="morbis-resume-fonts",l.rel="stylesheet",l.href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Lexend:wght@400;500;600;700&display=swap",document.head.appendChild(l)}if(!document.getElementById("morbis-resume-css")){let l=document.createElement("style");l.id="morbis-resume-css",l.textContent=`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

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
*//*
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
.sticky{
  position: sticky;
}
.bottom-4{
  bottom: 1rem;
}
.left-0{
  left: 0px;
}
.left-1\\/2{
  left: 50%;
}
.right-0{
  right: 0px;
}
.right-3{
  right: 0.75rem;
}
.top-1\\/2{
  top: 50%;
}
.top-full{
  top: 100%;
}
.z-50{
  z-index: 50;
}
.z-\\[1050\\]{
  z-index: 1050;
}
.z-\\[2147483647\\]{
  z-index: 2147483647;
}
.col-span-full{
  grid-column: 1 / -1;
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
.mb-2{
  margin-bottom: 0.5rem;
}
.mb-2\\.5{
  margin-bottom: 0.625rem;
}
.mb-3{
  margin-bottom: 0.75rem;
}
.mb-3\\.5{
  margin-bottom: 0.875rem;
}
.ml-0\\.5{
  margin-left: 0.125rem;
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
.mr-auto{
  margin-right: auto;
}
.mt-0\\.5{
  margin-top: 0.125rem;
}
.mt-1{
  margin-top: 0.25rem;
}
.mt-px{
  margin-top: 1px;
}
.block{
  display: block;
}
.inline-block{
  display: inline-block;
}
.inline{
  display: inline;
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
.h-10{
  height: 2.5rem;
}
.h-11{
  height: 2.75rem;
}
.h-2{
  height: 0.5rem;
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
.h-\\[28px\\]{
  height: 28px;
}
.h-\\[300px\\]{
  height: 300px;
}
.h-\\[30px\\]{
  height: 30px;
}
.h-\\[32px\\]{
  height: 32px;
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
.max-h-\\[220px\\]{
  max-height: 220px;
}
.max-h-\\[240px\\]{
  max-height: 240px;
}
.max-h-\\[600px\\]{
  max-height: 600px;
}
.min-h-\\[200px\\]{
  min-height: 200px;
}
.min-h-\\[50px\\]{
  min-height: 50px;
}
.w-10{
  width: 2.5rem;
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
.w-\\[28px\\]{
  width: 28px;
}
.w-\\[30px\\]{
  width: 30px;
}
.w-\\[340px\\]{
  width: 340px;
}
.w-\\[35\\%\\]{
  width: 35%;
}
.w-\\[90px\\]{
  width: 90px;
}
.w-full{
  width: 100%;
}
.w-px{
  width: 1px;
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
.max-w-\\[140px\\]{
  max-width: 140px;
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
.resize-y{
  resize: vertical;
}
.resize{
  resize: both;
}
.grid-cols-2{
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3{
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-\\[1fr_120px_100px_36px\\]{
  grid-template-columns: 1fr 120px 100px 36px;
}
.grid-cols-\\[1fr_140px_180px_36px\\]{
  grid-template-columns: 1fr 140px 180px 36px;
}
.grid-cols-\\[repeat\\(auto-fill\\2c minmax\\(100px\\2c 1fr\\)\\)\\]{
  grid-template-columns: repeat(auto-fill,minmax(100px,1fr));
}
.grid-cols-\\[repeat\\(auto-fill\\2c minmax\\(90px\\2c 1fr\\)\\)\\]{
  grid-template-columns: repeat(auto-fill,minmax(90px,1fr));
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
.items-end{
  align-items: flex-end;
}
.items-center{
  align-items: center;
}
.justify-end{
  justify-content: flex-end;
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
.gap-x-8{
  -moz-column-gap: 2rem;
       column-gap: 2rem;
}
.gap-y-3{
  row-gap: 0.75rem;
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
.divide-y > :not([hidden]) ~ :not([hidden]){
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}
.divide-border > :not([hidden]) ~ :not([hidden]){
  border-color: hsl(var(--border));
}
.overflow-auto{
  overflow: auto;
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
.rounded-xl{
  border-radius: 0.75rem;
}
.border{
  border-width: 1px;
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
.border-l-2{
  border-left-width: 2px;
}
.border-t{
  border-top-width: 1px;
}
.border-t-2{
  border-top-width: 2px;
}
.border-dashed{
  border-style: dashed;
}
.border-none{
  border-style: none;
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
.border-destructive{
  border-color: hsl(var(--destructive));
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
.border-primary\\/15{
  border-color: hsl(var(--primary) / 0.15);
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
.bg-border{
  background-color: hsl(var(--border));
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
.bg-destructive\\/5{
  background-color: hsl(var(--destructive) / 0.05);
}
.bg-foreground{
  background-color: hsl(var(--foreground));
}
.bg-gray-100{
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
}
.bg-green-100{
  --tw-bg-opacity: 1;
  background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
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
.bg-muted\\/40{
  background-color: hsl(var(--muted) / 0.4);
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
.bg-primary\\/5{
  background-color: hsl(var(--primary) / 0.05);
}
.bg-red-100{
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
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
.bg-white\\/15{
  background-color: rgb(255 255 255 / 0.15);
}
.bg-yellow-50{
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
}
.bg-gradient-to-br{
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
.from-muted{
  --tw-gradient-from: hsl(var(--muted)) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--muted) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-primary{
  --tw-gradient-from: hsl(var(--primary)) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--primary) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.to-muted\\/50{
  --tw-gradient-to: hsl(var(--muted) / 0.5) var(--tw-gradient-to-position);
}
.to-primary\\/80{
  --tw-gradient-to: hsl(var(--primary) / 0.8) var(--tw-gradient-to-position);
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
.p-3\\.5{
  padding: 0.875rem;
}
.p-4{
  padding: 1rem;
}
.p-5{
  padding: 1.25rem;
}
.p-8{
  padding: 2rem;
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
.px-6{
  padding-left: 1.5rem;
  padding-right: 1.5rem;
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
.pr-14{
  padding-right: 3.5rem;
}
.pr-8{
  padding-right: 2rem;
}
.pt-3{
  padding-top: 0.75rem;
}
.text-center{
  text-align: center;
}
.font-\\[\\'Inter\\'\\2c system-ui\\2c sans-serif\\]{
  font-family: 'Inter',system-ui,sans-serif;
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
.text-\\[13px\\]{
  font-size: 13px;
}
.text-\\[14px\\]{
  font-size: 14px;
}
.text-\\[15px\\]{
  font-size: 15px;
}
.text-\\[16px\\]{
  font-size: 16px;
}
.text-\\[18px\\]{
  font-size: 18px;
}
.text-\\[8px\\]{
  font-size: 8px;
}
.text-\\[9px\\]{
  font-size: 9px;
}
.text-base{
  font-size: 1rem;
  line-height: 1.5rem;
}
.text-md-sm{
  font-size: 12px;
  line-height: 18px;
}
.text-md-xs{
  font-size: 11px;
  line-height: 16px;
}
.text-sm{
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-xs{
  font-size: 0.75rem;
  line-height: 1rem;
}
.font-bold{
  font-weight: 700;
}
.font-medium{
  font-weight: 500;
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
.leading-snug{
  line-height: 1.375;
}
.tracking-tight{
  letter-spacing: -0.025em;
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
.text-gray-700{
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}
.text-green-500{
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity, 1));
}
.text-green-700{
  --tw-text-opacity: 1;
  color: rgb(21 128 61 / var(--tw-text-opacity, 1));
}
.text-muted-foreground{
  color: hsl(var(--muted-foreground));
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
.text-red-500{
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}
.text-red-600{
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.text-red-700{
  --tw-text-opacity: 1;
  color: rgb(185 28 28 / var(--tw-text-opacity, 1));
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
.text-white\\/70{
  color: rgb(255 255 255 / 0.7);
}
.text-yellow-600{
  --tw-text-opacity: 1;
  color: rgb(202 138 4 / var(--tw-text-opacity, 1));
}
.text-yellow-700{
  --tw-text-opacity: 1;
  color: rgb(161 98 7 / var(--tw-text-opacity, 1));
}
.text-yellow-800{
  --tw-text-opacity: 1;
  color: rgb(133 77 14 / var(--tw-text-opacity, 1));
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
.fade-out{
  --tw-exit-opacity: 0;
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
.last\\:border-b-0:last-child{
  border-bottom-width: 0px;
}
.hover\\:bg-accent:hover{
  background-color: hsl(var(--accent));
}
.hover\\:bg-amber-100\\/50:hover{
  background-color: rgb(254 243 199 / 0.5);
}
.hover\\:bg-destructive\\/10:hover{
  background-color: hsl(var(--destructive) / 0.1);
}
.hover\\:bg-destructive\\/20:hover{
  background-color: hsl(var(--destructive) / 0.2);
}
.hover\\:bg-destructive\\/90:hover{
  background-color: hsl(var(--destructive) / 0.9);
}
.hover\\:bg-green-700:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-muted\\/50:hover{
  background-color: hsl(var(--muted) / 0.5);
}
.hover\\:bg-primary\\/15:hover{
  background-color: hsl(var(--primary) / 0.15);
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
.hover\\:bg-white\\/25:hover{
  background-color: rgb(255 255 255 / 0.25);
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
.dark\\:bg-yellow-950\\/30:is(.dark *){
  background-color: rgb(66 32 6 / 0.3);
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
.dark\\:text-yellow-300:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(253 224 71 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-400:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(250 204 21 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-500:is(.dark *){
  --tw-text-opacity: 1;
  color: rgb(234 179 8 / var(--tw-text-opacity, 1));
}
@media (min-width: 640px){

  .sm\\:grid-cols-3{
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
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

      /* \u2500\u2500 Reset host-page overrides inside the modal \u2500\u2500 */
      /* ponytail: specificity 0-2-0 beats most host styles without !important */
      .resume-modal .resume-modal {
        background: #f8f6f3;
        border-radius: 20px;
        box-shadow: 0 25px 60px rgba(0,0,0,.3);
        width: 94%;
        max-width: 900px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: resume-slideup .3s ease;
        font-size: 16px;
        line-height: 1.6;
        color: #1a1d23;
        font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
      }
      .resume-modal .resume-modal *,
      .resume-modal .resume-modal *::before,
      .resume-modal .resume-modal *::after {
        box-sizing: border-box;
      }
      /* Neutralize host page input/select/textarea defaults.
         No reset on buttons \u2014 our Button component owns its own styling via Tailwind. */
      .resume-modal .resume-modal input,
      .resume-modal .resume-modal select,
      .resume-modal .resume-modal textarea {
        all: unset;
        box-sizing: border-box;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        cursor: default;
      }
      .resume-modal .resume-modal input,
      .resume-modal .resume-modal select,
      .resume-modal .resume-modal textarea {
        height: auto;
        min-height: 32px;
        width: 100%;
        border: 1px solid hsl(214.3 31.8% 91.4%);
        border-radius: 6px;
        background: white;
        padding: 4px 10px;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .resume-modal .resume-modal input:focus,
      .resume-modal .resume-modal select:focus,
      .resume-modal .resume-modal textarea:focus {
        border-color: hsl(221.2 83.2% 53.3%);
        box-shadow: 0 0 0 2px hsl(221.2 83.2% 53.3% / 0.15);
      }
      .resume-modal .resume-modal textarea {
        resize: vertical;
        min-height: 80px;
        padding: 8px 10px;
      }
      .resume-modal .resume-modal select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        padding-right: 28px;
      }
      .resume-modal .resume-modal h1,
      .resume-modal .resume-modal h2,
      .resume-modal .resume-modal h3 {
        font-family: 'Lexend', system-ui, sans-serif;
      }
      /* \u2500\u2500 Radix Select portal (renders outside .resume-modal) \u2500\u2500 */
      [data-radix-select-viewport] {
        padding: 4px;
      }
      [data-radix-select-viewport] [role="option"] {
        all: unset;
        display: flex;
        align-items: center;
        padding: 6px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        line-height: 18px;
        font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
        color: #1a1d23;
      }
      [data-radix-select-viewport] [role="option"]:focus,
      [data-radix-select-viewport] [role="option"][data-highlighted] {
        background: hsl(210 40% 96.1%);
        color: hsl(222.2 47.4% 11.2%);
      }
      [data-radix-popper-content-wrapper] {
        z-index: 2147483646 !important;
      }
      @keyframes resume-slideup { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
    `,document.head.appendChild(l)}Kl=(0,uC.createRoot)(e);let a=async l=>{let o=NR(l),n=await fetch(_R,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o,credentials:"same-origin"}),u=await n.text();if(!n.ok)throw console.error("[RJ] save failed:",n.status,u),new Error("HTTP "+n.status);let r=/(?:<b>)?(?:Notice|Warning|Fatal error|Parse error|Catchable fatal error)(?:<\/b>)?\s*:\s*[^<]*/gi,s=[],i;for(;(i=r.exec(u))!==null;){let h=i[0].trim().replace(/<[^>]+>/g,"");h&&(/github\.com\/newrelic|newrelic-browser|google-analytics|googletagmanager/i.test(h)||s.push(h))}if(s.length>0)throw console.error("[RJ] PHP errors:",s),new Error(s.join(`
`));X=null};Kl.render((0,_m.jsx)(Di,{onError:()=>setTimeout(()=>Pm(e),0),children:(0,_m.jsx)($y,{data:t,onSave:a,onClose:()=>Pm(e)})})),document.body.classList.add("ext-resume-open"),setTimeout(()=>{e.querySelectorAll("textarea").forEach(l=>{l.style.height="auto",l.style.height=l.scrollHeight+"px",l.addEventListener("input",()=>{l.style.height="auto",l.style.height=l.scrollHeight+"px"})})},50)}var X=null;async function FR(){let e=new URLSearchParams(location.search).get("id_visit");if(!e)return{};let t=`${location.origin}/rekam-medik/rm-rawat-jalan-new?id_visit=${e}`;try{let l=await(await fetch(t,{credentials:"same-origin"})).text(),o=new DOMParser().parseFromString(l,"text/html"),n={};o.querySelectorAll('input[type="hidden"], input[type="text"]').forEach(r=>{r.name&&!r.name.endsWith("[]")&&(n[r.name]=r.value)}),o.querySelectorAll("textarea").forEach(r=>{r.name&&(n[r.name]=r.value)}),o.querySelectorAll("select").forEach(r=>{r.id&&(n[r.id]=r.value),r.name&&(r.name.endsWith("[]")?(Array.isArray(n[r.name])||(n[r.name]=[]),n[r.name].push(r.value)):n[r.name]=r.value)}),o.querySelectorAll('input[type="radio"]:checked').forEach(r=>{r.name&&(n[r.name]=r.value)});let u=new Set;o.querySelectorAll('input[name$="[]"]').forEach(r=>{r.name&&u.add(r.name)});for(let r of u){let s=[];o.querySelectorAll(`input[name="${r}"]`).forEach(i=>{i.value&&s.push(i.value)}),s.length>0&&(n[r]=s)}return n}catch(a){return console.error("[RJ] failed to fetch form state:",a),{}}}function VR(){let e=[];for(let t of document.querySelectorAll("p, td")){let a=t.textContent?.trim().match(/No Resep\s*:\s*(\d+)/i);a&&!e.includes(a[1])&&e.push(a[1])}return e}async function GR(e){let a=await(await fetch(e,{credentials:"same-origin"})).text(),o=new DOMParser().parseFromString(a,"text/html").querySelectorAll("h5"),n=null;for(let i of o)if(i.textContent?.trim()==="Resep yang ditebus"){n=i;break}if(!n)return[];let u=n.nextElementSibling;for(;u&&u.tagName!=="TABLE";)u=u.nextElementSibling;if(!u)return[];let r=[],s=u.querySelectorAll("tr");for(let i=1;i<s.length;i++){let h=s[i].querySelectorAll("td");if(h.length<8)continue;let m=h[1]?.textContent?.trim(),f=h[7]?.textContent?.trim(),p=h[5]?.textContent?.trim();m&&r.push(`${m} - ${f||"-"}`)}return r}async function XR(){let e=VR();if(!e.length)return null;let t=await Promise.all(e.map(o=>{let n=`${location.origin}/admisi/pelaksanaan_pelayanan/history/resep?id=${o}`;return GR(n)})),a=new Set,l=[];for(let o of t)for(let n of o){let u=n.split(" - ")[0];a.has(u)||(a.add(u),l.push(n))}return l.length?l.join(`
`):null}function lC(){if(!location.href.startsWith(location.origin+"/v2/m-klaim/detail-v2-refaktor")||!new URLSearchParams(location.search).has("id_visit")||(document.querySelector("input[name=jenis]")?.value??document.querySelector("select[name=jenis]")?.value??"").toUpperCase().includes("INAP")||document.getElementById("ext-resume-float-btn"))return;let l=document.createElement("div");l.id="ext-resume-container",l.className="resume-modal",l.style.cssText="position: fixed; inset: 0; z-index: 1000; display: none; background: rgba(0,0,0,.4); align-items: center; justify-content: center;",document.body.appendChild(l);let o=document.createElement("button");Bm=o,o.id="ext-resume-float-btn",o.textContent="RJ",o.title="Resume Rajal",o.style.cssText="position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:2147483645;width:48px;height:48px;border-radius:12px;border:none;background:#2b5f8a;color:white;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);transition:transform .15s,box-shadow .15s;",o.onmouseenter=()=>{o.style.transform="translateY(-50%) scale(1.05)",o.style.boxShadow="0 4px 16px rgba(43,95,138,.35)"},o.onmouseleave=()=>{o.style.transform="translateY(-50%)",o.style.boxShadow="0 2px 8px rgba(0,0,0,.2)"},o.addEventListener("click",async()=>{if(!o.disabled){o.disabled=!0;try{X||(X=await FR());let n=await XR(),u=HR();n&&(u.clinicalNotes.terapi_pengobatan=n);let r=!u.clinicalNotes.tindakan||u.clinicalNotes.tindakan==="-",s=!u.clinicalNotes.terapi_pengobatan||u.clinicalNotes.terapi_pengobatan==="-";if(r||s){let i=nC();i.tindakan&&r&&(u.clinicalNotes.tindakan=i.tindakan),i.terapiPengobatan&&s&&(u.clinicalNotes.terapi_pengobatan=i.terapiPengobatan)}l.style.display="flex",qR(l,u)}catch(n){console.error("[RJ] click error:",n),l.style.display="none",o.disabled=!1}}}),document.body.appendChild(o),document.addEventListener("keydown",n=>{n.key==="Escape"&&l.style.display!=="none"&&Pm(l)})}function oC(){return document.documentElement.getAttribute("data-ext-resume-modal")==="1"}function jR(){return["/login","/auth","/signin","/masuk","/keluar","/logout"].some(t=>location.pathname.toLowerCase().includes(t))||document.querySelectorAll('input[type="password"]').length>0}function YR(e=5e3){return oC()?Promise.resolve(!0):new Promise(t=>{let a=Date.now(),l=setInterval(()=>{oC()?(clearInterval(l),t(!0)):Date.now()-a>e&&(clearInterval(l),t(!1))},200)})}(async()=>jR()||await YR()&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",lC):lC()))();return dC(KR);})();
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
lucide-react/dist/esm/icons/check.mjs:
lucide-react/dist/esm/icons/chevron-down.mjs:
lucide-react/dist/esm/icons/info.mjs:
lucide-react/dist/esm/icons/plus.mjs:
lucide-react/dist/esm/icons/trash-2.mjs:
lucide-react/dist/esm/icons/triangle-alert.mjs:
lucide-react/dist/esm/icons/x.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.38.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
