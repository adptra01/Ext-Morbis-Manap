"use strict";var __morbis_feature=(()=>{var wh=Object.create;var Ci=Object.defineProperty;var Th=Object.getOwnPropertyDescriptor;var Mh=Object.getOwnPropertyNames;var Dh=Object.getPrototypeOf,Rh=Object.prototype.hasOwnProperty;var ha=(e,a)=>()=>{try{return a||e((a={exports:{}}).exports,a),a.exports}catch(t){throw a=0,t}};var Bh=(e,a,t,l)=>{if(a&&typeof a=="object"||typeof a=="function")for(let u of Mh(a))!Rh.call(e,u)&&u!==t&&Ci(e,u,{get:()=>a[u],enumerable:!(l=Th(a,u))||l.enumerable});return e};var G=(e,a,t)=>(t=e!=null?wh(Dh(e)):{},Bh(a||!e||!e.__esModule?Ci(t,"default",{value:e,enumerable:!0}):t,e));var Di=ha(ae=>{"use strict";function hr(e,a){var t=e.length;e.push(a);e:for(;0<t;){var l=t-1>>>1,u=e[l];if(0<co(u,a))e[l]=a,e[t]=u,t=l;else break e}}function xa(e){return e.length===0?null:e[0]}function po(e){if(e.length===0)return null;var a=e[0],t=e.pop();if(t!==a){e[0]=t;e:for(var l=0,u=e.length,o=u>>>1;l<o;){var n=2*(l+1)-1,r=e[n],s=n+1,d=e[s];if(0>co(r,t))s<u&&0>co(d,r)?(e[l]=d,e[s]=t,l=s):(e[l]=r,e[n]=t,l=n);else if(s<u&&0>co(d,t))e[l]=d,e[s]=t,l=s;else break e}}return a}function co(e,a){var t=e.sortIndex-a.sortIndex;return t!==0?t:e.id-a.id}ae.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(yi=performance,ae.unstable_now=function(){return yi.now()}):(mr=Date,bi=mr.now(),ae.unstable_now=function(){return mr.now()-bi});var yi,mr,bi,Aa=[],Za=[],Eh=1,$e=null,Te=3,xr=!1,eu=!1,au=!1,Lr=!1,ki=typeof setTimeout=="function"?setTimeout:null,Ai=typeof clearTimeout=="function"?clearTimeout:null,vi=typeof setImmediate<"u"?setImmediate:null;function mo(e){for(var a=xa(Za);a!==null;){if(a.callback===null)po(Za);else if(a.startTime<=e)po(Za),a.sortIndex=a.expirationTime,hr(Aa,a);else break;a=xa(Za)}}function Sr(e){if(au=!1,mo(e),!eu)if(xa(Aa)!==null)eu=!0,ll||(ll=!0,tl());else{var a=xa(Za);a!==null&&Cr(Sr,a.startTime-e)}}var ll=!1,tu=-1,wi=5,Ti=-1;function Mi(){return Lr?!0:!(ae.unstable_now()-Ti<wi)}function pr(){if(Lr=!1,ll){var e=ae.unstable_now();Ti=e;var a=!0;try{e:{eu=!1,au&&(au=!1,Ai(tu),tu=-1),xr=!0;var t=Te;try{a:{for(mo(e),$e=xa(Aa);$e!==null&&!($e.expirationTime>e&&Mi());){var l=$e.callback;if(typeof l=="function"){$e.callback=null,Te=$e.priorityLevel;var u=l($e.expirationTime<=e);if(e=ae.unstable_now(),typeof u=="function"){$e.callback=u,mo(e),a=!0;break a}$e===xa(Aa)&&po(Aa),mo(e)}else po(Aa);$e=xa(Aa)}if($e!==null)a=!0;else{var o=xa(Za);o!==null&&Cr(Sr,o.startTime-e),a=!1}}break e}finally{$e=null,Te=t,xr=!1}a=void 0}}finally{a?tl():ll=!1}}}var tl;typeof vi=="function"?tl=function(){vi(pr)}:typeof MessageChannel<"u"?(gr=new MessageChannel,Ii=gr.port2,gr.port1.onmessage=pr,tl=function(){Ii.postMessage(null)}):tl=function(){ki(pr,0)};var gr,Ii;function Cr(e,a){tu=ki(function(){e(ae.unstable_now())},a)}ae.unstable_IdlePriority=5;ae.unstable_ImmediatePriority=1;ae.unstable_LowPriority=4;ae.unstable_NormalPriority=3;ae.unstable_Profiling=null;ae.unstable_UserBlockingPriority=2;ae.unstable_cancelCallback=function(e){e.callback=null};ae.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):wi=0<e?Math.floor(1e3/e):5};ae.unstable_getCurrentPriorityLevel=function(){return Te};ae.unstable_next=function(e){switch(Te){case 1:case 2:case 3:var a=3;break;default:a=Te}var t=Te;Te=a;try{return e()}finally{Te=t}};ae.unstable_requestPaint=function(){Lr=!0};ae.unstable_runWithPriority=function(e,a){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var t=Te;Te=e;try{return a()}finally{Te=t}};ae.unstable_scheduleCallback=function(e,a,t){var l=ae.unstable_now();switch(typeof t=="object"&&t!==null?(t=t.delay,t=typeof t=="number"&&0<t?l+t:l):t=l,e){case 1:var u=-1;break;case 2:u=250;break;case 5:u=1073741823;break;case 4:u=1e4;break;default:u=5e3}return u=t+u,e={id:Eh++,callback:a,priorityLevel:e,startTime:t,expirationTime:u,sortIndex:-1},t>l?(e.sortIndex=t,hr(Za,e),xa(Aa)===null&&e===xa(Za)&&(au?(Ai(tu),tu=-1):au=!0,Cr(Sr,t-l))):(e.sortIndex=u,hr(Aa,e),eu||xr||(eu=!0,ll||(ll=!0,tl()))),e};ae.unstable_shouldYield=Mi;ae.unstable_wrapCallback=function(e){var a=Te;return function(){var t=Te;Te=a;try{return e.apply(this,arguments)}finally{Te=t}}}});var Bi=ha((my,Ri)=>{"use strict";Ri.exports=Di()});var Gi=ha(E=>{"use strict";var vr=Symbol.for("react.transitional.element"),Oh=Symbol.for("react.portal"),_h=Symbol.for("react.fragment"),Uh=Symbol.for("react.strict_mode"),zh=Symbol.for("react.profiler"),qh=Symbol.for("react.consumer"),Hh=Symbol.for("react.context"),Fh=Symbol.for("react.forward_ref"),Ph=Symbol.for("react.suspense"),Nh=Symbol.for("react.memo"),zi=Symbol.for("react.lazy"),Gh=Symbol.for("react.activity"),Ei=Symbol.iterator;function Vh(e){return e===null||typeof e!="object"?null:(e=Ei&&e[Ei]||e["@@iterator"],typeof e=="function"?e:null)}var qi={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Hi=Object.assign,Fi={};function ol(e,a,t){this.props=e,this.context=a,this.refs=Fi,this.updater=t||qi}ol.prototype.isReactComponent={};ol.prototype.setState=function(e,a){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,a,"setState")};ol.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Pi(){}Pi.prototype=ol.prototype;function Ir(e,a,t){this.props=e,this.context=a,this.refs=Fi,this.updater=t||qi}var kr=Ir.prototype=new Pi;kr.constructor=Ir;Hi(kr,ol.prototype);kr.isPureReactComponent=!0;var Oi=Array.isArray;function br(){}var J={H:null,A:null,T:null,S:null},Ni=Object.prototype.hasOwnProperty;function Ar(e,a,t){var l=t.ref;return{$$typeof:vr,type:e,key:a,ref:l!==void 0?l:null,props:t}}function Xh(e,a){return Ar(e.type,a,e.props)}function wr(e){return typeof e=="object"&&e!==null&&e.$$typeof===vr}function jh(e){var a={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(t){return a[t]})}var _i=/\/+/g;function yr(e,a){return typeof e=="object"&&e!==null&&e.key!=null?jh(""+e.key):a.toString(36)}function Kh(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(br,br):(e.status="pending",e.then(function(a){e.status==="pending"&&(e.status="fulfilled",e.value=a)},function(a){e.status==="pending"&&(e.status="rejected",e.reason=a)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function ul(e,a,t,l,u){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var n=!1;if(e===null)n=!0;else switch(o){case"bigint":case"string":case"number":n=!0;break;case"object":switch(e.$$typeof){case vr:case Oh:n=!0;break;case zi:return n=e._init,ul(n(e._payload),a,t,l,u)}}if(n)return u=u(e),n=l===""?"."+yr(e,0):l,Oi(u)?(t="",n!=null&&(t=n.replace(_i,"$&/")+"/"),ul(u,a,t,"",function(d){return d})):u!=null&&(wr(u)&&(u=Xh(u,t+(u.key==null||e&&e.key===u.key?"":(""+u.key).replace(_i,"$&/")+"/")+n)),a.push(u)),1;n=0;var r=l===""?".":l+":";if(Oi(e))for(var s=0;s<e.length;s++)l=e[s],o=r+yr(l,s),n+=ul(l,a,t,o,u);else if(s=Vh(e),typeof s=="function")for(e=s.call(e),s=0;!(l=e.next()).done;)l=l.value,o=r+yr(l,s++),n+=ul(l,a,t,o,u);else if(o==="object"){if(typeof e.then=="function")return ul(Kh(e),a,t,l,u);throw a=String(e),Error("Objects are not valid as a React child (found: "+(a==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":a)+"). If you meant to render a collection of children, use an array instead.")}return n}function go(e,a,t){if(e==null)return e;var l=[],u=0;return ul(e,l,"","",function(o){return a.call(t,o,u++)}),l}function Yh(e){if(e._status===-1){var a=e._result;a=a(),a.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=a)}if(e._status===1)return e._result.default;throw e._result}var Ui=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Zh={map:go,forEach:function(e,a,t){go(e,function(){a.apply(this,arguments)},t)},count:function(e){var a=0;return go(e,function(){a++}),a},toArray:function(e){return go(e,function(a){return a})||[]},only:function(e){if(!wr(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};E.Activity=Gh;E.Children=Zh;E.Component=ol;E.Fragment=_h;E.Profiler=zh;E.PureComponent=Ir;E.StrictMode=Uh;E.Suspense=Ph;E.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=J;E.__COMPILER_RUNTIME={__proto__:null,c:function(e){return J.H.useMemoCache(e)}};E.cache=function(e){return function(){return e.apply(null,arguments)}};E.cacheSignal=function(){return null};E.cloneElement=function(e,a,t){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var l=Hi({},e.props),u=e.key;if(a!=null)for(o in a.key!==void 0&&(u=""+a.key),a)!Ni.call(a,o)||o==="key"||o==="__self"||o==="__source"||o==="ref"&&a.ref===void 0||(l[o]=a[o]);var o=arguments.length-2;if(o===1)l.children=t;else if(1<o){for(var n=Array(o),r=0;r<o;r++)n[r]=arguments[r+2];l.children=n}return Ar(e.type,u,l)};E.createContext=function(e){return e={$$typeof:Hh,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:qh,_context:e},e};E.createElement=function(e,a,t){var l,u={},o=null;if(a!=null)for(l in a.key!==void 0&&(o=""+a.key),a)Ni.call(a,l)&&l!=="key"&&l!=="__self"&&l!=="__source"&&(u[l]=a[l]);var n=arguments.length-2;if(n===1)u.children=t;else if(1<n){for(var r=Array(n),s=0;s<n;s++)r[s]=arguments[s+2];u.children=r}if(e&&e.defaultProps)for(l in n=e.defaultProps,n)u[l]===void 0&&(u[l]=n[l]);return Ar(e,o,u)};E.createRef=function(){return{current:null}};E.forwardRef=function(e){return{$$typeof:Fh,render:e}};E.isValidElement=wr;E.lazy=function(e){return{$$typeof:zi,_payload:{_status:-1,_result:e},_init:Yh}};E.memo=function(e,a){return{$$typeof:Nh,type:e,compare:a===void 0?null:a}};E.startTransition=function(e){var a=J.T,t={};J.T=t;try{var l=e(),u=J.S;u!==null&&u(t,l),typeof l=="object"&&l!==null&&typeof l.then=="function"&&l.then(br,Ui)}catch(o){Ui(o)}finally{a!==null&&t.types!==null&&(a.types=t.types),J.T=a}};E.unstable_useCacheRefresh=function(){return J.H.useCacheRefresh()};E.use=function(e){return J.H.use(e)};E.useActionState=function(e,a,t){return J.H.useActionState(e,a,t)};E.useCallback=function(e,a){return J.H.useCallback(e,a)};E.useContext=function(e){return J.H.useContext(e)};E.useDebugValue=function(){};E.useDeferredValue=function(e,a){return J.H.useDeferredValue(e,a)};E.useEffect=function(e,a){return J.H.useEffect(e,a)};E.useEffectEvent=function(e){return J.H.useEffectEvent(e)};E.useId=function(){return J.H.useId()};E.useImperativeHandle=function(e,a,t){return J.H.useImperativeHandle(e,a,t)};E.useInsertionEffect=function(e,a){return J.H.useInsertionEffect(e,a)};E.useLayoutEffect=function(e,a){return J.H.useLayoutEffect(e,a)};E.useMemo=function(e,a){return J.H.useMemo(e,a)};E.useOptimistic=function(e,a){return J.H.useOptimistic(e,a)};E.useReducer=function(e,a,t){return J.H.useReducer(e,a,t)};E.useRef=function(e){return J.H.useRef(e)};E.useState=function(e){return J.H.useState(e)};E.useSyncExternalStore=function(e,a,t){return J.H.useSyncExternalStore(e,a,t)};E.useTransition=function(){return J.H.useTransition()};E.version="19.2.8"});var ea=ha((gy,Vi)=>{"use strict";Vi.exports=Gi()});var ji=ha(Ee=>{"use strict";var Qh=ea();function Xi(e){var a="https://react.dev/errors/"+e;if(1<arguments.length){a+="?args[]="+encodeURIComponent(arguments[1]);for(var t=2;t<arguments.length;t++)a+="&args[]="+encodeURIComponent(arguments[t])}return"Minified React error #"+e+"; visit "+a+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Qa(){}var Be={d:{f:Qa,r:function(){throw Error(Xi(522))},D:Qa,C:Qa,L:Qa,m:Qa,X:Qa,S:Qa,M:Qa},p:0,findDOMNode:null},Jh=Symbol.for("react.portal");function Wh(e,a,t){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Jh,key:l==null?null:""+l,children:e,containerInfo:a,implementation:t}}var lu=Qh.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function ho(e,a){if(e==="font")return"";if(typeof a=="string")return a==="use-credentials"?a:""}Ee.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Be;Ee.createPortal=function(e,a){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!a||a.nodeType!==1&&a.nodeType!==9&&a.nodeType!==11)throw Error(Xi(299));return Wh(e,a,null,t)};Ee.flushSync=function(e){var a=lu.T,t=Be.p;try{if(lu.T=null,Be.p=2,e)return e()}finally{lu.T=a,Be.p=t,Be.d.f()}};Ee.preconnect=function(e,a){typeof e=="string"&&(a?(a=a.crossOrigin,a=typeof a=="string"?a==="use-credentials"?a:"":void 0):a=null,Be.d.C(e,a))};Ee.prefetchDNS=function(e){typeof e=="string"&&Be.d.D(e)};Ee.preinit=function(e,a){if(typeof e=="string"&&a&&typeof a.as=="string"){var t=a.as,l=ho(t,a.crossOrigin),u=typeof a.integrity=="string"?a.integrity:void 0,o=typeof a.fetchPriority=="string"?a.fetchPriority:void 0;t==="style"?Be.d.S(e,typeof a.precedence=="string"?a.precedence:void 0,{crossOrigin:l,integrity:u,fetchPriority:o}):t==="script"&&Be.d.X(e,{crossOrigin:l,integrity:u,fetchPriority:o,nonce:typeof a.nonce=="string"?a.nonce:void 0})}};Ee.preinitModule=function(e,a){if(typeof e=="string")if(typeof a=="object"&&a!==null){if(a.as==null||a.as==="script"){var t=ho(a.as,a.crossOrigin);Be.d.M(e,{crossOrigin:t,integrity:typeof a.integrity=="string"?a.integrity:void 0,nonce:typeof a.nonce=="string"?a.nonce:void 0})}}else a==null&&Be.d.M(e)};Ee.preload=function(e,a){if(typeof e=="string"&&typeof a=="object"&&a!==null&&typeof a.as=="string"){var t=a.as,l=ho(t,a.crossOrigin);Be.d.L(e,t,{crossOrigin:l,integrity:typeof a.integrity=="string"?a.integrity:void 0,nonce:typeof a.nonce=="string"?a.nonce:void 0,type:typeof a.type=="string"?a.type:void 0,fetchPriority:typeof a.fetchPriority=="string"?a.fetchPriority:void 0,referrerPolicy:typeof a.referrerPolicy=="string"?a.referrerPolicy:void 0,imageSrcSet:typeof a.imageSrcSet=="string"?a.imageSrcSet:void 0,imageSizes:typeof a.imageSizes=="string"?a.imageSizes:void 0,media:typeof a.media=="string"?a.media:void 0})}};Ee.preloadModule=function(e,a){if(typeof e=="string")if(a){var t=ho(a.as,a.crossOrigin);Be.d.m(e,{as:typeof a.as=="string"&&a.as!=="script"?a.as:void 0,crossOrigin:t,integrity:typeof a.integrity=="string"?a.integrity:void 0})}else Be.d.m(e)};Ee.requestFormReset=function(e){Be.d.r(e)};Ee.unstable_batchedUpdates=function(e,a){return e(a)};Ee.useFormState=function(e,a,t){return lu.H.useFormState(e,a,t)};Ee.useFormStatus=function(){return lu.H.useHostTransitionStatus()};Ee.version="19.2.8"});var Zi=ha((xy,Yi)=>{"use strict";function Ki(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ki)}catch(e){console.error(e)}}Ki(),Yi.exports=ji()});var sg=ha(Nn=>{"use strict";var ge=Bi(),bc=ea(),$h=Zi();function y(e){var a="https://react.dev/errors/"+e;if(1<arguments.length){a+="?args[]="+encodeURIComponent(arguments[1]);for(var t=2;t<arguments.length;t++)a+="&args[]="+encodeURIComponent(arguments[t])}return"Minified React error #"+e+"; visit "+a+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function vc(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Gu(e){var a=e,t=e;if(e.alternate)for(;a.return;)a=a.return;else{e=a;do a=e,(a.flags&4098)!==0&&(t=a.return),e=a.return;while(e)}return a.tag===3?t:null}function Ic(e){if(e.tag===13){var a=e.memoizedState;if(a===null&&(e=e.alternate,e!==null&&(a=e.memoizedState)),a!==null)return a.dehydrated}return null}function kc(e){if(e.tag===31){var a=e.memoizedState;if(a===null&&(e=e.alternate,e!==null&&(a=e.memoizedState)),a!==null)return a.dehydrated}return null}function Qi(e){if(Gu(e)!==e)throw Error(y(188))}function ex(e){var a=e.alternate;if(!a){if(a=Gu(e),a===null)throw Error(y(188));return a!==e?null:e}for(var t=e,l=a;;){var u=t.return;if(u===null)break;var o=u.alternate;if(o===null){if(l=u.return,l!==null){t=l;continue}break}if(u.child===o.child){for(o=u.child;o;){if(o===t)return Qi(u),e;if(o===l)return Qi(u),a;o=o.sibling}throw Error(y(188))}if(t.return!==l.return)t=u,l=o;else{for(var n=!1,r=u.child;r;){if(r===t){n=!0,t=u,l=o;break}if(r===l){n=!0,l=u,t=o;break}r=r.sibling}if(!n){for(r=o.child;r;){if(r===t){n=!0,t=o,l=u;break}if(r===l){n=!0,l=o,t=u;break}r=r.sibling}if(!n)throw Error(y(189))}}if(t.alternate!==l)throw Error(y(190))}if(t.tag!==3)throw Error(y(188));return t.stateNode.current===t?e:a}function Ac(e){var a=e.tag;if(a===5||a===26||a===27||a===6)return e;for(e=e.child;e!==null;){if(a=Ac(e),a!==null)return a;e=e.sibling}return null}var ee=Object.assign,ax=Symbol.for("react.element"),xo=Symbol.for("react.transitional.element"),fu=Symbol.for("react.portal"),fl=Symbol.for("react.fragment"),wc=Symbol.for("react.strict_mode"),rs=Symbol.for("react.profiler"),Tc=Symbol.for("react.consumer"),Oa=Symbol.for("react.context"),td=Symbol.for("react.forward_ref"),ss=Symbol.for("react.suspense"),ds=Symbol.for("react.suspense_list"),ld=Symbol.for("react.memo"),Ja=Symbol.for("react.lazy"),is=Symbol.for("react.activity"),tx=Symbol.for("react.memo_cache_sentinel"),Ji=Symbol.iterator;function uu(e){return e===null||typeof e!="object"?null:(e=Ji&&e[Ji]||e["@@iterator"],typeof e=="function"?e:null)}var lx=Symbol.for("react.client.reference");function fs(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===lx?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case fl:return"Fragment";case rs:return"Profiler";case wc:return"StrictMode";case ss:return"Suspense";case ds:return"SuspenseList";case is:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case fu:return"Portal";case Oa:return e.displayName||"Context";case Tc:return(e._context.displayName||"Context")+".Consumer";case td:var a=e.render;return e=e.displayName,e||(e=a.displayName||a.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ld:return a=e.displayName||null,a!==null?a:fs(e.type)||"Memo";case Ja:a=e._payload,e=e._init;try{return fs(e(a))}catch{}}return null}var cu=Array.isArray,R=bc.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,N=$h.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Ut={pending:!1,data:null,method:null,action:null},cs=[],cl=-1;function ba(e){return{current:e}}function Ce(e){0>cl||(e.current=cs[cl],cs[cl]=null,cl--)}function Q(e,a){cl++,cs[cl]=e.current,e.current=a}var ya=ba(null),Mu=ba(null),st=ba(null),Qo=ba(null);function Jo(e,a){switch(Q(st,a),Q(Mu,e),Q(ya,null),a.nodeType){case 9:case 11:e=(e=a.documentElement)&&(e=e.namespaceURI)?oc(e):0;break;default:if(e=a.tagName,a=a.namespaceURI)a=oc(a),e=Yp(a,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Ce(ya),Q(ya,e)}function Dl(){Ce(ya),Ce(Mu),Ce(st)}function ms(e){e.memoizedState!==null&&Q(Qo,e);var a=ya.current,t=Yp(a,e.type);a!==t&&(Q(Mu,e),Q(ya,t))}function Wo(e){Mu.current===e&&(Ce(ya),Ce(Mu)),Qo.current===e&&(Ce(Qo),Fu._currentValue=Ut)}var Tr,Wi;function Bt(e){if(Tr===void 0)try{throw Error()}catch(t){var a=t.stack.trim().match(/\n( *(at )?)/);Tr=a&&a[1]||"",Wi=-1<t.stack.indexOf(`
    at`)?" (<anonymous>)":-1<t.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Tr+e+Wi}var Mr=!1;function Dr(e,a){if(!e||Mr)return"";Mr=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(a){var f=function(){throw Error()};if(Object.defineProperty(f.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(f,[])}catch(h){var c=h}Reflect.construct(e,[],f)}else{try{f.call()}catch(h){c=h}e.call(f.prototype)}}else{try{throw Error()}catch(h){c=h}(f=e())&&typeof f.catch=="function"&&f.catch(function(){})}}catch(h){if(h&&c&&typeof h.stack=="string")return[h.stack,c.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var o=l.DetermineComponentFrameRoot(),n=o[0],r=o[1];if(n&&r){var s=n.split(`
`),d=r.split(`
`);for(u=l=0;l<s.length&&!s[l].includes("DetermineComponentFrameRoot");)l++;for(;u<d.length&&!d[u].includes("DetermineComponentFrameRoot");)u++;if(l===s.length||u===d.length)for(l=s.length-1,u=d.length-1;1<=l&&0<=u&&s[l]!==d[u];)u--;for(;1<=l&&0<=u;l--,u--)if(s[l]!==d[u]){if(l!==1||u!==1)do if(l--,u--,0>u||s[l]!==d[u]){var g=`
`+s[l].replace(" at new "," at ");return e.displayName&&g.includes("<anonymous>")&&(g=g.replace("<anonymous>",e.displayName)),g}while(1<=l&&0<=u);break}}}finally{Mr=!1,Error.prepareStackTrace=t}return(t=e?e.displayName||e.name:"")?Bt(t):""}function ux(e,a){switch(e.tag){case 26:case 27:case 5:return Bt(e.type);case 16:return Bt("Lazy");case 13:return e.child!==a&&a!==null?Bt("Suspense Fallback"):Bt("Suspense");case 19:return Bt("SuspenseList");case 0:case 15:return Dr(e.type,!1);case 11:return Dr(e.type.render,!1);case 1:return Dr(e.type,!0);case 31:return Bt("Activity");default:return""}}function $i(e){try{var a="",t=null;do a+=ux(e,t),t=e,e=e.return;while(e);return a}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var ps=Object.prototype.hasOwnProperty,ud=ge.unstable_scheduleCallback,Rr=ge.unstable_cancelCallback,ox=ge.unstable_shouldYield,nx=ge.unstable_requestPaint,Ke=ge.unstable_now,rx=ge.unstable_getCurrentPriorityLevel,Mc=ge.unstable_ImmediatePriority,Dc=ge.unstable_UserBlockingPriority,$o=ge.unstable_NormalPriority,sx=ge.unstable_LowPriority,Rc=ge.unstable_IdlePriority,dx=ge.log,ix=ge.unstable_setDisableYieldValue,Vu=null,Ye=null;function lt(e){if(typeof dx=="function"&&ix(e),Ye&&typeof Ye.setStrictMode=="function")try{Ye.setStrictMode(Vu,e)}catch{}}var Ze=Math.clz32?Math.clz32:mx,fx=Math.log,cx=Math.LN2;function mx(e){return e>>>=0,e===0?32:31-(fx(e)/cx|0)|0}var Lo=256,So=262144,Co=4194304;function Et(e){var a=e&42;if(a!==0)return a;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function An(e,a,t){var l=e.pendingLanes;if(l===0)return 0;var u=0,o=e.suspendedLanes,n=e.pingedLanes;e=e.warmLanes;var r=l&134217727;return r!==0?(l=r&~o,l!==0?u=Et(l):(n&=r,n!==0?u=Et(n):t||(t=r&~e,t!==0&&(u=Et(t))))):(r=l&~o,r!==0?u=Et(r):n!==0?u=Et(n):t||(t=l&~e,t!==0&&(u=Et(t)))),u===0?0:a!==0&&a!==u&&(a&o)===0&&(o=u&-u,t=a&-a,o>=t||o===32&&(t&4194048)!==0)?a:u}function Xu(e,a){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&a)===0}function px(e,a){switch(e){case 1:case 2:case 4:case 8:case 64:return a+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Bc(){var e=Co;return Co<<=1,(Co&62914560)===0&&(Co=4194304),e}function Br(e){for(var a=[],t=0;31>t;t++)a.push(e);return a}function ju(e,a){e.pendingLanes|=a,a!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function gx(e,a,t,l,u,o){var n=e.pendingLanes;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=t,e.entangledLanes&=t,e.errorRecoveryDisabledLanes&=t,e.shellSuspendCounter=0;var r=e.entanglements,s=e.expirationTimes,d=e.hiddenUpdates;for(t=n&~t;0<t;){var g=31-Ze(t),f=1<<g;r[g]=0,s[g]=-1;var c=d[g];if(c!==null)for(d[g]=null,g=0;g<c.length;g++){var h=c[g];h!==null&&(h.lane&=-536870913)}t&=~f}l!==0&&Ec(e,l,0),o!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=o&~(n&~a))}function Ec(e,a,t){e.pendingLanes|=a,e.suspendedLanes&=~a;var l=31-Ze(a);e.entangledLanes|=a,e.entanglements[l]=e.entanglements[l]|1073741824|t&261930}function Oc(e,a){var t=e.entangledLanes|=a;for(e=e.entanglements;t;){var l=31-Ze(t),u=1<<l;u&a|e[l]&a&&(e[l]|=a),t&=~u}}function _c(e,a){var t=a&-a;return t=(t&42)!==0?1:od(t),(t&(e.suspendedLanes|a))!==0?0:t}function od(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function nd(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Uc(){var e=N.p;return e!==0?e:(e=window.event,e===void 0?32:og(e.type))}function ef(e,a){var t=N.p;try{return N.p=e,a()}finally{N.p=t}}var yt=Math.random().toString(36).slice(2),ve="__reactFiber$"+yt,Fe="__reactProps$"+yt,Pl="__reactContainer$"+yt,gs="__reactEvents$"+yt,hx="__reactListeners$"+yt,xx="__reactHandles$"+yt,af="__reactResources$"+yt,Ku="__reactMarker$"+yt;function rd(e){delete e[ve],delete e[Fe],delete e[gs],delete e[hx],delete e[xx]}function ml(e){var a=e[ve];if(a)return a;for(var t=e.parentNode;t;){if(a=t[Pl]||t[ve]){if(t=a.alternate,a.child!==null||t!==null&&t.child!==null)for(e=ic(e);e!==null;){if(t=e[ve])return t;e=ic(e)}return a}e=t,t=e.parentNode}return null}function Nl(e){if(e=e[ve]||e[Pl]){var a=e.tag;if(a===5||a===6||a===13||a===31||a===26||a===27||a===3)return e}return null}function mu(e){var a=e.tag;if(a===5||a===26||a===27||a===6)return e.stateNode;throw Error(y(33))}function vl(e){var a=e[af];return a||(a=e[af]={hoistableStyles:new Map,hoistableScripts:new Map}),a}function Se(e){e[Ku]=!0}var zc=new Set,qc={};function jt(e,a){Rl(e,a),Rl(e+"Capture",a)}function Rl(e,a){for(qc[e]=a,e=0;e<a.length;e++)zc.add(a[e])}var Lx=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),tf={},lf={};function Sx(e){return ps.call(lf,e)?!0:ps.call(tf,e)?!1:Lx.test(e)?lf[e]=!0:(tf[e]=!0,!1)}function _o(e,a,t){if(Sx(a))if(t===null)e.removeAttribute(a);else{switch(typeof t){case"undefined":case"function":case"symbol":e.removeAttribute(a);return;case"boolean":var l=a.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(a);return}}e.setAttribute(a,""+t)}}function yo(e,a,t){if(t===null)e.removeAttribute(a);else{switch(typeof t){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttribute(a,""+t)}}function wa(e,a,t,l){if(l===null)e.removeAttribute(t);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttributeNS(a,t,""+l)}}function ta(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Hc(e){var a=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(a==="checkbox"||a==="radio")}function Cx(e,a,t){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,a);if(!e.hasOwnProperty(a)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var u=l.get,o=l.set;return Object.defineProperty(e,a,{configurable:!0,get:function(){return u.call(this)},set:function(n){t=""+n,o.call(this,n)}}),Object.defineProperty(e,a,{enumerable:l.enumerable}),{getValue:function(){return t},setValue:function(n){t=""+n},stopTracking:function(){e._valueTracker=null,delete e[a]}}}}function hs(e){if(!e._valueTracker){var a=Hc(e)?"checked":"value";e._valueTracker=Cx(e,a,""+e[a])}}function Fc(e){if(!e)return!1;var a=e._valueTracker;if(!a)return!0;var t=a.getValue(),l="";return e&&(l=Hc(e)?e.checked?"true":"false":e.value),e=l,e!==t?(a.setValue(e),!0):!1}function en(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var yx=/[\n"\\]/g;function oa(e){return e.replace(yx,function(a){return"\\"+a.charCodeAt(0).toString(16)+" "})}function xs(e,a,t,l,u,o,n,r){e.name="",n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"?e.type=n:e.removeAttribute("type"),a!=null?n==="number"?(a===0&&e.value===""||e.value!=a)&&(e.value=""+ta(a)):e.value!==""+ta(a)&&(e.value=""+ta(a)):n!=="submit"&&n!=="reset"||e.removeAttribute("value"),a!=null?Ls(e,n,ta(a)):t!=null?Ls(e,n,ta(t)):l!=null&&e.removeAttribute("value"),u==null&&o!=null&&(e.defaultChecked=!!o),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.name=""+ta(r):e.removeAttribute("name")}function Pc(e,a,t,l,u,o,n,r){if(o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"&&(e.type=o),a!=null||t!=null){if(!(o!=="submit"&&o!=="reset"||a!=null)){hs(e);return}t=t!=null?""+ta(t):"",a=a!=null?""+ta(a):t,r||a===e.value||(e.value=a),e.defaultValue=a}l=l??u,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=r?e.checked:!!l,e.defaultChecked=!!l,n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(e.name=n),hs(e)}function Ls(e,a,t){a==="number"&&en(e.ownerDocument)===e||e.defaultValue===""+t||(e.defaultValue=""+t)}function Il(e,a,t,l){if(e=e.options,a){a={};for(var u=0;u<t.length;u++)a["$"+t[u]]=!0;for(t=0;t<e.length;t++)u=a.hasOwnProperty("$"+e[t].value),e[t].selected!==u&&(e[t].selected=u),u&&l&&(e[t].defaultSelected=!0)}else{for(t=""+ta(t),a=null,u=0;u<e.length;u++){if(e[u].value===t){e[u].selected=!0,l&&(e[u].defaultSelected=!0);return}a!==null||e[u].disabled||(a=e[u])}a!==null&&(a.selected=!0)}}function Nc(e,a,t){if(a!=null&&(a=""+ta(a),a!==e.value&&(e.value=a),t==null)){e.defaultValue!==a&&(e.defaultValue=a);return}e.defaultValue=t!=null?""+ta(t):""}function Gc(e,a,t,l){if(a==null){if(l!=null){if(t!=null)throw Error(y(92));if(cu(l)){if(1<l.length)throw Error(y(93));l=l[0]}t=l}t==null&&(t=""),a=t}t=ta(a),e.defaultValue=t,l=e.textContent,l===t&&l!==""&&l!==null&&(e.value=l),hs(e)}function Bl(e,a){if(a){var t=e.firstChild;if(t&&t===e.lastChild&&t.nodeType===3){t.nodeValue=a;return}}e.textContent=a}var bx=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function uf(e,a,t){var l=a.indexOf("--")===0;t==null||typeof t=="boolean"||t===""?l?e.setProperty(a,""):a==="float"?e.cssFloat="":e[a]="":l?e.setProperty(a,t):typeof t!="number"||t===0||bx.has(a)?a==="float"?e.cssFloat=t:e[a]=(""+t).trim():e[a]=t+"px"}function Vc(e,a,t){if(a!=null&&typeof a!="object")throw Error(y(62));if(e=e.style,t!=null){for(var l in t)!t.hasOwnProperty(l)||a!=null&&a.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var u in a)l=a[u],a.hasOwnProperty(u)&&t[u]!==l&&uf(e,u,l)}else for(var o in a)a.hasOwnProperty(o)&&uf(e,o,a[o])}function sd(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var vx=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Ix=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Uo(e){return Ix.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function _a(){}var Ss=null;function dd(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var pl=null,kl=null;function of(e){var a=Nl(e);if(a&&(e=a.stateNode)){var t=e[Fe]||null;e:switch(e=a.stateNode,a.type){case"input":if(xs(e,t.value,t.defaultValue,t.defaultValue,t.checked,t.defaultChecked,t.type,t.name),a=t.name,t.type==="radio"&&a!=null){for(t=e;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll('input[name="'+oa(""+a)+'"][type="radio"]'),a=0;a<t.length;a++){var l=t[a];if(l!==e&&l.form===e.form){var u=l[Fe]||null;if(!u)throw Error(y(90));xs(l,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(a=0;a<t.length;a++)l=t[a],l.form===e.form&&Fc(l)}break e;case"textarea":Nc(e,t.value,t.defaultValue);break e;case"select":a=t.value,a!=null&&Il(e,!!t.multiple,a,!1)}}}var Er=!1;function Xc(e,a,t){if(Er)return e(a,t);Er=!0;try{var l=e(a);return l}finally{if(Er=!1,(pl!==null||kl!==null)&&(qn(),pl&&(a=pl,e=kl,kl=pl=null,of(a),e)))for(a=0;a<e.length;a++)of(e[a])}}function Du(e,a){var t=e.stateNode;if(t===null)return null;var l=t[Fe]||null;if(l===null)return null;t=l[a];e:switch(a){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(t&&typeof t!="function")throw Error(y(231,a,typeof t));return t}var Fa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Cs=!1;if(Fa)try{nl={},Object.defineProperty(nl,"passive",{get:function(){Cs=!0}}),window.addEventListener("test",nl,nl),window.removeEventListener("test",nl,nl)}catch{Cs=!1}var nl,ut=null,id=null,zo=null;function jc(){if(zo)return zo;var e,a=id,t=a.length,l,u="value"in ut?ut.value:ut.textContent,o=u.length;for(e=0;e<t&&a[e]===u[e];e++);var n=t-e;for(l=1;l<=n&&a[t-l]===u[o-l];l++);return zo=u.slice(e,1<l?1-l:void 0)}function qo(e){var a=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&a===13&&(e=13)):e=a,e===10&&(e=13),32<=e||e===13?e:0}function bo(){return!0}function nf(){return!1}function Pe(e){function a(t,l,u,o,n){this._reactName=t,this._targetInst=u,this.type=l,this.nativeEvent=o,this.target=n,this.currentTarget=null;for(var r in e)e.hasOwnProperty(r)&&(t=e[r],this[r]=t?t(o):o[r]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?bo:nf,this.isPropagationStopped=nf,this}return ee(a.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=bo)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=bo)},persist:function(){},isPersistent:bo}),a}var Kt={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wn=Pe(Kt),Yu=ee({},Kt,{view:0,detail:0}),kx=Pe(Yu),Or,_r,ou,Tn=ee({},Yu,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:fd,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ou&&(ou&&e.type==="mousemove"?(Or=e.screenX-ou.screenX,_r=e.screenY-ou.screenY):_r=Or=0,ou=e),Or)},movementY:function(e){return"movementY"in e?e.movementY:_r}}),rf=Pe(Tn),Ax=ee({},Tn,{dataTransfer:0}),wx=Pe(Ax),Tx=ee({},Yu,{relatedTarget:0}),Ur=Pe(Tx),Mx=ee({},Kt,{animationName:0,elapsedTime:0,pseudoElement:0}),Dx=Pe(Mx),Rx=ee({},Kt,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Bx=Pe(Rx),Ex=ee({},Kt,{data:0}),sf=Pe(Ex),Ox={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},_x={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ux={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function zx(e){var a=this.nativeEvent;return a.getModifierState?a.getModifierState(e):(e=Ux[e])?!!a[e]:!1}function fd(){return zx}var qx=ee({},Yu,{key:function(e){if(e.key){var a=Ox[e.key]||e.key;if(a!=="Unidentified")return a}return e.type==="keypress"?(e=qo(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?_x[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:fd,charCode:function(e){return e.type==="keypress"?qo(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?qo(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Hx=Pe(qx),Fx=ee({},Tn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),df=Pe(Fx),Px=ee({},Yu,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:fd}),Nx=Pe(Px),Gx=ee({},Kt,{propertyName:0,elapsedTime:0,pseudoElement:0}),Vx=Pe(Gx),Xx=ee({},Tn,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),jx=Pe(Xx),Kx=ee({},Kt,{newState:0,oldState:0}),Yx=Pe(Kx),Zx=[9,13,27,32],cd=Fa&&"CompositionEvent"in window,hu=null;Fa&&"documentMode"in document&&(hu=document.documentMode);var Qx=Fa&&"TextEvent"in window&&!hu,Kc=Fa&&(!cd||hu&&8<hu&&11>=hu),ff=" ",cf=!1;function Yc(e,a){switch(e){case"keyup":return Zx.indexOf(a.keyCode)!==-1;case"keydown":return a.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Zc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var gl=!1;function Jx(e,a){switch(e){case"compositionend":return Zc(a);case"keypress":return a.which!==32?null:(cf=!0,ff);case"textInput":return e=a.data,e===ff&&cf?null:e;default:return null}}function Wx(e,a){if(gl)return e==="compositionend"||!cd&&Yc(e,a)?(e=jc(),zo=id=ut=null,gl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(a.ctrlKey||a.altKey||a.metaKey)||a.ctrlKey&&a.altKey){if(a.char&&1<a.char.length)return a.char;if(a.which)return String.fromCharCode(a.which)}return null;case"compositionend":return Kc&&a.locale!=="ko"?null:a.data;default:return null}}var $x={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function mf(e){var a=e&&e.nodeName&&e.nodeName.toLowerCase();return a==="input"?!!$x[e.type]:a==="textarea"}function Qc(e,a,t,l){pl?kl?kl.push(l):kl=[l]:pl=l,a=Sn(a,"onChange"),0<a.length&&(t=new wn("onChange","change",null,t,l),e.push({event:t,listeners:a}))}var xu=null,Ru=null;function eL(e){Xp(e,0)}function Mn(e){var a=mu(e);if(Fc(a))return e}function pf(e,a){if(e==="change")return a}var Jc=!1;Fa&&(Fa?(Io="oninput"in document,Io||(zr=document.createElement("div"),zr.setAttribute("oninput","return;"),Io=typeof zr.oninput=="function"),vo=Io):vo=!1,Jc=vo&&(!document.documentMode||9<document.documentMode));var vo,Io,zr;function gf(){xu&&(xu.detachEvent("onpropertychange",Wc),Ru=xu=null)}function Wc(e){if(e.propertyName==="value"&&Mn(Ru)){var a=[];Qc(a,Ru,e,dd(e)),Xc(eL,a)}}function aL(e,a,t){e==="focusin"?(gf(),xu=a,Ru=t,xu.attachEvent("onpropertychange",Wc)):e==="focusout"&&gf()}function tL(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Mn(Ru)}function lL(e,a){if(e==="click")return Mn(a)}function uL(e,a){if(e==="input"||e==="change")return Mn(a)}function oL(e,a){return e===a&&(e!==0||1/e===1/a)||e!==e&&a!==a}var Je=typeof Object.is=="function"?Object.is:oL;function Bu(e,a){if(Je(e,a))return!0;if(typeof e!="object"||e===null||typeof a!="object"||a===null)return!1;var t=Object.keys(e),l=Object.keys(a);if(t.length!==l.length)return!1;for(l=0;l<t.length;l++){var u=t[l];if(!ps.call(a,u)||!Je(e[u],a[u]))return!1}return!0}function hf(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function xf(e,a){var t=hf(e);e=0;for(var l;t;){if(t.nodeType===3){if(l=e+t.textContent.length,e<=a&&l>=a)return{node:t,offset:a-e};e=l}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=hf(t)}}function $c(e,a){return e&&a?e===a?!0:e&&e.nodeType===3?!1:a&&a.nodeType===3?$c(e,a.parentNode):"contains"in e?e.contains(a):e.compareDocumentPosition?!!(e.compareDocumentPosition(a)&16):!1:!1}function em(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var a=en(e.document);a instanceof e.HTMLIFrameElement;){try{var t=typeof a.contentWindow.location.href=="string"}catch{t=!1}if(t)e=a.contentWindow;else break;a=en(e.document)}return a}function md(e){var a=e&&e.nodeName&&e.nodeName.toLowerCase();return a&&(a==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||a==="textarea"||e.contentEditable==="true")}var nL=Fa&&"documentMode"in document&&11>=document.documentMode,hl=null,ys=null,Lu=null,bs=!1;function Lf(e,a,t){var l=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;bs||hl==null||hl!==en(l)||(l=hl,"selectionStart"in l&&md(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Lu&&Bu(Lu,l)||(Lu=l,l=Sn(ys,"onSelect"),0<l.length&&(a=new wn("onSelect","select",null,a,t),e.push({event:a,listeners:l}),a.target=hl)))}function Rt(e,a){var t={};return t[e.toLowerCase()]=a.toLowerCase(),t["Webkit"+e]="webkit"+a,t["Moz"+e]="moz"+a,t}var xl={animationend:Rt("Animation","AnimationEnd"),animationiteration:Rt("Animation","AnimationIteration"),animationstart:Rt("Animation","AnimationStart"),transitionrun:Rt("Transition","TransitionRun"),transitionstart:Rt("Transition","TransitionStart"),transitioncancel:Rt("Transition","TransitionCancel"),transitionend:Rt("Transition","TransitionEnd")},qr={},am={};Fa&&(am=document.createElement("div").style,"AnimationEvent"in window||(delete xl.animationend.animation,delete xl.animationiteration.animation,delete xl.animationstart.animation),"TransitionEvent"in window||delete xl.transitionend.transition);function Yt(e){if(qr[e])return qr[e];if(!xl[e])return e;var a=xl[e],t;for(t in a)if(a.hasOwnProperty(t)&&t in am)return qr[e]=a[t];return e}var tm=Yt("animationend"),lm=Yt("animationiteration"),um=Yt("animationstart"),rL=Yt("transitionrun"),sL=Yt("transitionstart"),dL=Yt("transitioncancel"),om=Yt("transitionend"),nm=new Map,vs="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");vs.push("scrollEnd");function ga(e,a){nm.set(e,a),jt(a,[e])}var an=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},aa=[],Ll=0,pd=0;function Dn(){for(var e=Ll,a=pd=Ll=0;a<e;){var t=aa[a];aa[a++]=null;var l=aa[a];aa[a++]=null;var u=aa[a];aa[a++]=null;var o=aa[a];if(aa[a++]=null,l!==null&&u!==null){var n=l.pending;n===null?u.next=u:(u.next=n.next,n.next=u),l.pending=u}o!==0&&rm(t,u,o)}}function Rn(e,a,t,l){aa[Ll++]=e,aa[Ll++]=a,aa[Ll++]=t,aa[Ll++]=l,pd|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function gd(e,a,t,l){return Rn(e,a,t,l),tn(e)}function Zt(e,a){return Rn(e,null,null,a),tn(e)}function rm(e,a,t){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t);for(var u=!1,o=e.return;o!==null;)o.childLanes|=t,l=o.alternate,l!==null&&(l.childLanes|=t),o.tag===22&&(e=o.stateNode,e===null||e._visibility&1||(u=!0)),e=o,o=o.return;return e.tag===3?(o=e.stateNode,u&&a!==null&&(u=31-Ze(t),e=o.hiddenUpdates,l=e[u],l===null?e[u]=[a]:l.push(a),a.lane=t|536870912),o):null}function tn(e){if(50<wu)throw wu=0,Vs=null,Error(y(185));for(var a=e.return;a!==null;)e=a,a=e.return;return e.tag===3?e.stateNode:null}var Sl={};function iL(e,a,t,l){this.tag=e,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=a,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Xe(e,a,t,l){return new iL(e,a,t,l)}function hd(e){return e=e.prototype,!(!e||!e.isReactComponent)}function za(e,a){var t=e.alternate;return t===null?(t=Xe(e.tag,a,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=a,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=e.flags&65011712,t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,a=e.dependencies,t.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext},t.sibling=e.sibling,t.index=e.index,t.ref=e.ref,t.refCleanup=e.refCleanup,t}function sm(e,a){e.flags&=65011714;var t=e.alternate;return t===null?(e.childLanes=0,e.lanes=a,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=t.childLanes,e.lanes=t.lanes,e.child=t.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=t.memoizedProps,e.memoizedState=t.memoizedState,e.updateQueue=t.updateQueue,e.type=t.type,a=t.dependencies,e.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext}),e}function Ho(e,a,t,l,u,o){var n=0;if(l=e,typeof e=="function")hd(e)&&(n=1);else if(typeof e=="string")n=mS(e,t,ya.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case is:return e=Xe(31,t,a,u),e.elementType=is,e.lanes=o,e;case fl:return zt(t.children,u,o,a);case wc:n=8,u|=24;break;case rs:return e=Xe(12,t,a,u|2),e.elementType=rs,e.lanes=o,e;case ss:return e=Xe(13,t,a,u),e.elementType=ss,e.lanes=o,e;case ds:return e=Xe(19,t,a,u),e.elementType=ds,e.lanes=o,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Oa:n=10;break e;case Tc:n=9;break e;case td:n=11;break e;case ld:n=14;break e;case Ja:n=16,l=null;break e}n=29,t=Error(y(130,e===null?"null":typeof e,"")),l=null}return a=Xe(n,t,a,u),a.elementType=e,a.type=l,a.lanes=o,a}function zt(e,a,t,l){return e=Xe(7,e,l,a),e.lanes=t,e}function Hr(e,a,t){return e=Xe(6,e,null,a),e.lanes=t,e}function dm(e){var a=Xe(18,null,null,0);return a.stateNode=e,a}function Fr(e,a,t){return a=Xe(4,e.children!==null?e.children:[],e.key,a),a.lanes=t,a.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},a}var Sf=new WeakMap;function na(e,a){if(typeof e=="object"&&e!==null){var t=Sf.get(e);return t!==void 0?t:(a={value:e,source:a,stack:$i(a)},Sf.set(e,a),a)}return{value:e,source:a,stack:$i(a)}}var Cl=[],yl=0,ln=null,Eu=0,la=[],ua=0,xt=null,La=1,Sa="";function Ba(e,a){Cl[yl++]=Eu,Cl[yl++]=ln,ln=e,Eu=a}function im(e,a,t){la[ua++]=La,la[ua++]=Sa,la[ua++]=xt,xt=e;var l=La;e=Sa;var u=32-Ze(l)-1;l&=~(1<<u),t+=1;var o=32-Ze(a)+u;if(30<o){var n=u-u%5;o=(l&(1<<n)-1).toString(32),l>>=n,u-=n,La=1<<32-Ze(a)+u|t<<u|l,Sa=o+e}else La=1<<o|t<<u|l,Sa=e}function xd(e){e.return!==null&&(Ba(e,1),im(e,1,0))}function Ld(e){for(;e===ln;)ln=Cl[--yl],Cl[yl]=null,Eu=Cl[--yl],Cl[yl]=null;for(;e===xt;)xt=la[--ua],la[ua]=null,Sa=la[--ua],la[ua]=null,La=la[--ua],la[ua]=null}function fm(e,a){la[ua++]=La,la[ua++]=Sa,la[ua++]=xt,La=a.id,Sa=a.overflow,xt=e}var Ie=null,$=null,H=!1,dt=null,ra=!1,Is=Error(y(519));function Lt(e){var a=Error(y(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ou(na(a,e)),Is}function Cf(e){var a=e.stateNode,t=e.type,l=e.memoizedProps;switch(a[ve]=e,a[Fe]=l,t){case"dialog":U("cancel",a),U("close",a);break;case"iframe":case"object":case"embed":U("load",a);break;case"video":case"audio":for(t=0;t<qu.length;t++)U(qu[t],a);break;case"source":U("error",a);break;case"img":case"image":case"link":U("error",a),U("load",a);break;case"details":U("toggle",a);break;case"input":U("invalid",a),Pc(a,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":U("invalid",a);break;case"textarea":U("invalid",a),Gc(a,l.value,l.defaultValue,l.children)}t=l.children,typeof t!="string"&&typeof t!="number"&&typeof t!="bigint"||a.textContent===""+t||l.suppressHydrationWarning===!0||Kp(a.textContent,t)?(l.popover!=null&&(U("beforetoggle",a),U("toggle",a)),l.onScroll!=null&&U("scroll",a),l.onScrollEnd!=null&&U("scrollend",a),l.onClick!=null&&(a.onclick=_a),a=!0):a=!1,a||Lt(e,!0)}function yf(e){for(Ie=e.return;Ie;)switch(Ie.tag){case 5:case 31:case 13:ra=!1;return;case 27:case 3:ra=!0;return;default:Ie=Ie.return}}function rl(e){if(e!==Ie)return!1;if(!H)return yf(e),H=!0,!1;var a=e.tag,t;if((t=a!==3&&a!==27)&&((t=a===5)&&(t=e.type,t=!(t!=="form"&&t!=="button")||Zs(e.type,e.memoizedProps)),t=!t),t&&$&&Lt(e),yf(e),a===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(317));$=dc(e)}else if(a===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(317));$=dc(e)}else a===27?(a=$,bt(e.type)?(e=$s,$s=null,$=e):$=a):$=Ie?da(e.stateNode.nextSibling):null;return!0}function Pt(){$=Ie=null,H=!1}function Pr(){var e=dt;return e!==null&&(qe===null?qe=e:qe.push.apply(qe,e),dt=null),e}function Ou(e){dt===null?dt=[e]:dt.push(e)}var ks=ba(null),Qt=null,Ua=null;function $a(e,a,t){Q(ks,a._currentValue),a._currentValue=t}function qa(e){e._currentValue=ks.current,Ce(ks)}function As(e,a,t){for(;e!==null;){var l=e.alternate;if((e.childLanes&a)!==a?(e.childLanes|=a,l!==null&&(l.childLanes|=a)):l!==null&&(l.childLanes&a)!==a&&(l.childLanes|=a),e===t)break;e=e.return}}function ws(e,a,t,l){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var o=u.dependencies;if(o!==null){var n=u.child;o=o.firstContext;e:for(;o!==null;){var r=o;o=u;for(var s=0;s<a.length;s++)if(r.context===a[s]){o.lanes|=t,r=o.alternate,r!==null&&(r.lanes|=t),As(o.return,t,e),l||(n=null);break e}o=r.next}}else if(u.tag===18){if(n=u.return,n===null)throw Error(y(341));n.lanes|=t,o=n.alternate,o!==null&&(o.lanes|=t),As(n,t,e),n=null}else n=u.child;if(n!==null)n.return=u;else for(n=u;n!==null;){if(n===e){n=null;break}if(u=n.sibling,u!==null){u.return=n.return,n=u;break}n=n.return}u=n}}function Gl(e,a,t,l){e=null;for(var u=a,o=!1;u!==null;){if(!o){if((u.flags&524288)!==0)o=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var n=u.alternate;if(n===null)throw Error(y(387));if(n=n.memoizedProps,n!==null){var r=u.type;Je(u.pendingProps.value,n.value)||(e!==null?e.push(r):e=[r])}}else if(u===Qo.current){if(n=u.alternate,n===null)throw Error(y(387));n.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(Fu):e=[Fu])}u=u.return}e!==null&&ws(a,e,t,l),a.flags|=262144}function un(e){for(e=e.firstContext;e!==null;){if(!Je(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Nt(e){Qt=e,Ua=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function ke(e){return cm(Qt,e)}function ko(e,a){return Qt===null&&Nt(e),cm(e,a)}function cm(e,a){var t=a._currentValue;if(a={context:a,memoizedValue:t,next:null},Ua===null){if(e===null)throw Error(y(308));Ua=a,e.dependencies={lanes:0,firstContext:a},e.flags|=524288}else Ua=Ua.next=a;return t}var fL=typeof AbortController<"u"?AbortController:function(){var e=[],a=this.signal={aborted:!1,addEventListener:function(t,l){e.push(l)}};this.abort=function(){a.aborted=!0,e.forEach(function(t){return t()})}},cL=ge.unstable_scheduleCallback,mL=ge.unstable_NormalPriority,ce={$$typeof:Oa,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Sd(){return{controller:new fL,data:new Map,refCount:0}}function Zu(e){e.refCount--,e.refCount===0&&cL(mL,function(){e.controller.abort()})}var Su=null,Ts=0,El=0,Al=null;function pL(e,a){if(Su===null){var t=Su=[];Ts=0,El=Vd(),Al={status:"pending",value:void 0,then:function(l){t.push(l)}}}return Ts++,a.then(bf,bf),a}function bf(){if(--Ts===0&&Su!==null){Al!==null&&(Al.status="fulfilled");var e=Su;Su=null,El=0,Al=null;for(var a=0;a<e.length;a++)(0,e[a])()}}function gL(e,a){var t=[],l={status:"pending",value:null,reason:null,then:function(u){t.push(u)}};return e.then(function(){l.status="fulfilled",l.value=a;for(var u=0;u<t.length;u++)(0,t[u])(a)},function(u){for(l.status="rejected",l.reason=u,u=0;u<t.length;u++)(0,t[u])(void 0)}),l}var vf=R.S;R.S=function(e,a){Ap=Ke(),typeof a=="object"&&a!==null&&typeof a.then=="function"&&pL(e,a),vf!==null&&vf(e,a)};var qt=ba(null);function Cd(){var e=qt.current;return e!==null?e:Y.pooledCache}function Fo(e,a){a===null?Q(qt,qt.current):Q(qt,a.pool)}function mm(){var e=Cd();return e===null?null:{parent:ce._currentValue,pool:e}}var Vl=Error(y(460)),yd=Error(y(474)),Bn=Error(y(542)),on={then:function(){}};function If(e){return e=e.status,e==="fulfilled"||e==="rejected"}function pm(e,a,t){switch(t=e[t],t===void 0?e.push(a):t!==a&&(a.then(_a,_a),a=t),a.status){case"fulfilled":return a.value;case"rejected":throw e=a.reason,Af(e),e;default:if(typeof a.status=="string")a.then(_a,_a);else{if(e=Y,e!==null&&100<e.shellSuspendCounter)throw Error(y(482));e=a,e.status="pending",e.then(function(l){if(a.status==="pending"){var u=a;u.status="fulfilled",u.value=l}},function(l){if(a.status==="pending"){var u=a;u.status="rejected",u.reason=l}})}switch(a.status){case"fulfilled":return a.value;case"rejected":throw e=a.reason,Af(e),e}throw Ht=a,Vl}}function Ot(e){try{var a=e._init;return a(e._payload)}catch(t){throw t!==null&&typeof t=="object"&&typeof t.then=="function"?(Ht=t,Vl):t}}var Ht=null;function kf(){if(Ht===null)throw Error(y(459));var e=Ht;return Ht=null,e}function Af(e){if(e===Vl||e===Bn)throw Error(y(483))}var wl=null,_u=0;function Ao(e){var a=_u;return _u+=1,wl===null&&(wl=[]),pm(wl,e,a)}function nu(e,a){a=a.props.ref,e.ref=a!==void 0?a:null}function wo(e,a){throw a.$$typeof===ax?Error(y(525)):(e=Object.prototype.toString.call(a),Error(y(31,e==="[object Object]"?"object with keys {"+Object.keys(a).join(", ")+"}":e)))}function gm(e){function a(m,i){if(e){var x=m.deletions;x===null?(m.deletions=[i],m.flags|=16):x.push(i)}}function t(m,i){if(!e)return null;for(;i!==null;)a(m,i),i=i.sibling;return null}function l(m){for(var i=new Map;m!==null;)m.key!==null?i.set(m.key,m):i.set(m.index,m),m=m.sibling;return i}function u(m,i){return m=za(m,i),m.index=0,m.sibling=null,m}function o(m,i,x){return m.index=x,e?(x=m.alternate,x!==null?(x=x.index,x<i?(m.flags|=67108866,i):x):(m.flags|=67108866,i)):(m.flags|=1048576,i)}function n(m){return e&&m.alternate===null&&(m.flags|=67108866),m}function r(m,i,x,S){return i===null||i.tag!==6?(i=Hr(x,m.mode,S),i.return=m,i):(i=u(i,x),i.return=m,i)}function s(m,i,x,S){var k=x.type;return k===fl?g(m,i,x.props.children,S,x.key):i!==null&&(i.elementType===k||typeof k=="object"&&k!==null&&k.$$typeof===Ja&&Ot(k)===i.type)?(i=u(i,x.props),nu(i,x),i.return=m,i):(i=Ho(x.type,x.key,x.props,null,m.mode,S),nu(i,x),i.return=m,i)}function d(m,i,x,S){return i===null||i.tag!==4||i.stateNode.containerInfo!==x.containerInfo||i.stateNode.implementation!==x.implementation?(i=Fr(x,m.mode,S),i.return=m,i):(i=u(i,x.children||[]),i.return=m,i)}function g(m,i,x,S,k){return i===null||i.tag!==7?(i=zt(x,m.mode,S,k),i.return=m,i):(i=u(i,x),i.return=m,i)}function f(m,i,x){if(typeof i=="string"&&i!==""||typeof i=="number"||typeof i=="bigint")return i=Hr(""+i,m.mode,x),i.return=m,i;if(typeof i=="object"&&i!==null){switch(i.$$typeof){case xo:return x=Ho(i.type,i.key,i.props,null,m.mode,x),nu(x,i),x.return=m,x;case fu:return i=Fr(i,m.mode,x),i.return=m,i;case Ja:return i=Ot(i),f(m,i,x)}if(cu(i)||uu(i))return i=zt(i,m.mode,x,null),i.return=m,i;if(typeof i.then=="function")return f(m,Ao(i),x);if(i.$$typeof===Oa)return f(m,ko(m,i),x);wo(m,i)}return null}function c(m,i,x,S){var k=i!==null?i.key:null;if(typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint")return k!==null?null:r(m,i,""+x,S);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case xo:return x.key===k?s(m,i,x,S):null;case fu:return x.key===k?d(m,i,x,S):null;case Ja:return x=Ot(x),c(m,i,x,S)}if(cu(x)||uu(x))return k!==null?null:g(m,i,x,S,null);if(typeof x.then=="function")return c(m,i,Ao(x),S);if(x.$$typeof===Oa)return c(m,i,ko(m,x),S);wo(m,x)}return null}function h(m,i,x,S,k){if(typeof S=="string"&&S!==""||typeof S=="number"||typeof S=="bigint")return m=m.get(x)||null,r(i,m,""+S,k);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case xo:return m=m.get(S.key===null?x:S.key)||null,s(i,m,S,k);case fu:return m=m.get(S.key===null?x:S.key)||null,d(i,m,S,k);case Ja:return S=Ot(S),h(m,i,x,S,k)}if(cu(S)||uu(S))return m=m.get(x)||null,g(i,m,S,k,null);if(typeof S.then=="function")return h(m,i,x,Ao(S),k);if(S.$$typeof===Oa)return h(m,i,x,ko(i,S),k);wo(i,S)}return null}function v(m,i,x,S){for(var k=null,D=null,p=i,C=i=0,I=null;p!==null&&C<x.length;C++){p.index>C?(I=p,p=null):I=p.sibling;var B=c(m,p,x[C],S);if(B===null){p===null&&(p=I);break}e&&p&&B.alternate===null&&a(m,p),i=o(B,i,C),D===null?k=B:D.sibling=B,D=B,p=I}if(C===x.length)return t(m,p),H&&Ba(m,C),k;if(p===null){for(;C<x.length;C++)p=f(m,x[C],S),p!==null&&(i=o(p,i,C),D===null?k=p:D.sibling=p,D=p);return H&&Ba(m,C),k}for(p=l(p);C<x.length;C++)I=h(p,m,C,x[C],S),I!==null&&(e&&I.alternate!==null&&p.delete(I.key===null?C:I.key),i=o(I,i,C),D===null?k=I:D.sibling=I,D=I);return e&&p.forEach(function(de){return a(m,de)}),H&&Ba(m,C),k}function b(m,i,x,S){if(x==null)throw Error(y(151));for(var k=null,D=null,p=i,C=i=0,I=null,B=x.next();p!==null&&!B.done;C++,B=x.next()){p.index>C?(I=p,p=null):I=p.sibling;var de=c(m,p,B.value,S);if(de===null){p===null&&(p=I);break}e&&p&&de.alternate===null&&a(m,p),i=o(de,i,C),D===null?k=de:D.sibling=de,D=de,p=I}if(B.done)return t(m,p),H&&Ba(m,C),k;if(p===null){for(;!B.done;C++,B=x.next())B=f(m,B.value,S),B!==null&&(i=o(B,i,C),D===null?k=B:D.sibling=B,D=B);return H&&Ba(m,C),k}for(p=l(p);!B.done;C++,B=x.next())B=h(p,m,C,B.value,S),B!==null&&(e&&B.alternate!==null&&p.delete(B.key===null?C:B.key),i=o(B,i,C),D===null?k=B:D.sibling=B,D=B);return e&&p.forEach(function(fa){return a(m,fa)}),H&&Ba(m,C),k}function T(m,i,x,S){if(typeof x=="object"&&x!==null&&x.type===fl&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case xo:e:{for(var k=x.key;i!==null;){if(i.key===k){if(k=x.type,k===fl){if(i.tag===7){t(m,i.sibling),S=u(i,x.props.children),S.return=m,m=S;break e}}else if(i.elementType===k||typeof k=="object"&&k!==null&&k.$$typeof===Ja&&Ot(k)===i.type){t(m,i.sibling),S=u(i,x.props),nu(S,x),S.return=m,m=S;break e}t(m,i);break}else a(m,i);i=i.sibling}x.type===fl?(S=zt(x.props.children,m.mode,S,x.key),S.return=m,m=S):(S=Ho(x.type,x.key,x.props,null,m.mode,S),nu(S,x),S.return=m,m=S)}return n(m);case fu:e:{for(k=x.key;i!==null;){if(i.key===k)if(i.tag===4&&i.stateNode.containerInfo===x.containerInfo&&i.stateNode.implementation===x.implementation){t(m,i.sibling),S=u(i,x.children||[]),S.return=m,m=S;break e}else{t(m,i);break}else a(m,i);i=i.sibling}S=Fr(x,m.mode,S),S.return=m,m=S}return n(m);case Ja:return x=Ot(x),T(m,i,x,S)}if(cu(x))return v(m,i,x,S);if(uu(x)){if(k=uu(x),typeof k!="function")throw Error(y(150));return x=k.call(x),b(m,i,x,S)}if(typeof x.then=="function")return T(m,i,Ao(x),S);if(x.$$typeof===Oa)return T(m,i,ko(m,x),S);wo(m,x)}return typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint"?(x=""+x,i!==null&&i.tag===6?(t(m,i.sibling),S=u(i,x),S.return=m,m=S):(t(m,i),S=Hr(x,m.mode,S),S.return=m,m=S),n(m)):t(m,i)}return function(m,i,x,S){try{_u=0;var k=T(m,i,x,S);return wl=null,k}catch(p){if(p===Vl||p===Bn)throw p;var D=Xe(29,p,null,m.mode);return D.lanes=S,D.return=m,D}}}var Gt=gm(!0),hm=gm(!1),Wa=!1;function bd(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ms(e,a){e=e.updateQueue,a.updateQueue===e&&(a.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function it(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function ft(e,a,t){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(P&2)!==0){var u=l.pending;return u===null?a.next=a:(a.next=u.next,u.next=a),l.pending=a,a=tn(e),rm(e,null,t),a}return Rn(e,l,a,t),tn(e)}function Cu(e,a,t){if(a=a.updateQueue,a!==null&&(a=a.shared,(t&4194048)!==0)){var l=a.lanes;l&=e.pendingLanes,t|=l,a.lanes=t,Oc(e,t)}}function Nr(e,a){var t=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,t===l)){var u=null,o=null;if(t=t.firstBaseUpdate,t!==null){do{var n={lane:t.lane,tag:t.tag,payload:t.payload,callback:null,next:null};o===null?u=o=n:o=o.next=n,t=t.next}while(t!==null);o===null?u=o=a:o=o.next=a}else u=o=a;t={baseState:l.baseState,firstBaseUpdate:u,lastBaseUpdate:o,shared:l.shared,callbacks:l.callbacks},e.updateQueue=t;return}e=t.lastBaseUpdate,e===null?t.firstBaseUpdate=a:e.next=a,t.lastBaseUpdate=a}var Ds=!1;function yu(){if(Ds){var e=Al;if(e!==null)throw e}}function bu(e,a,t,l){Ds=!1;var u=e.updateQueue;Wa=!1;var o=u.firstBaseUpdate,n=u.lastBaseUpdate,r=u.shared.pending;if(r!==null){u.shared.pending=null;var s=r,d=s.next;s.next=null,n===null?o=d:n.next=d,n=s;var g=e.alternate;g!==null&&(g=g.updateQueue,r=g.lastBaseUpdate,r!==n&&(r===null?g.firstBaseUpdate=d:r.next=d,g.lastBaseUpdate=s))}if(o!==null){var f=u.baseState;n=0,g=d=s=null,r=o;do{var c=r.lane&-536870913,h=c!==r.lane;if(h?(q&c)===c:(l&c)===c){c!==0&&c===El&&(Ds=!0),g!==null&&(g=g.next={lane:0,tag:r.tag,payload:r.payload,callback:null,next:null});e:{var v=e,b=r;c=a;var T=t;switch(b.tag){case 1:if(v=b.payload,typeof v=="function"){f=v.call(T,f,c);break e}f=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=b.payload,c=typeof v=="function"?v.call(T,f,c):v,c==null)break e;f=ee({},f,c);break e;case 2:Wa=!0}}c=r.callback,c!==null&&(e.flags|=64,h&&(e.flags|=8192),h=u.callbacks,h===null?u.callbacks=[c]:h.push(c))}else h={lane:c,tag:r.tag,payload:r.payload,callback:r.callback,next:null},g===null?(d=g=h,s=f):g=g.next=h,n|=c;if(r=r.next,r===null){if(r=u.shared.pending,r===null)break;h=r,r=h.next,h.next=null,u.lastBaseUpdate=h,u.shared.pending=null}}while(!0);g===null&&(s=f),u.baseState=s,u.firstBaseUpdate=d,u.lastBaseUpdate=g,o===null&&(u.shared.lanes=0),Ct|=n,e.lanes=n,e.memoizedState=f}}function xm(e,a){if(typeof e!="function")throw Error(y(191,e));e.call(a)}function Lm(e,a){var t=e.callbacks;if(t!==null)for(e.callbacks=null,e=0;e<t.length;e++)xm(t[e],a)}var Ol=ba(null),nn=ba(0);function wf(e,a){e=Va,Q(nn,e),Q(Ol,a),Va=e|a.baseLanes}function Rs(){Q(nn,Va),Q(Ol,Ol.current)}function vd(){Va=nn.current,Ce(Ol),Ce(nn)}var We=ba(null),sa=null;function et(e){var a=e.alternate;Q(ne,ne.current&1),Q(We,e),sa===null&&(a===null||Ol.current!==null||a.memoizedState!==null)&&(sa=e)}function Bs(e){Q(ne,ne.current),Q(We,e),sa===null&&(sa=e)}function Sm(e){e.tag===22?(Q(ne,ne.current),Q(We,e),sa===null&&(sa=e)):at(e)}function at(){Q(ne,ne.current),Q(We,We.current)}function Ve(e){Ce(We),sa===e&&(sa=null),Ce(ne)}var ne=ba(0);function rn(e){for(var a=e;a!==null;){if(a.tag===13){var t=a.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||Js(t)||Ws(t)))return a}else if(a.tag===19&&(a.memoizedProps.revealOrder==="forwards"||a.memoizedProps.revealOrder==="backwards"||a.memoizedProps.revealOrder==="unstable_legacy-backwards"||a.memoizedProps.revealOrder==="together")){if((a.flags&128)!==0)return a}else if(a.child!==null){a.child.return=a,a=a.child;continue}if(a===e)break;for(;a.sibling===null;){if(a.return===null||a.return===e)return null;a=a.return}a.sibling.return=a.return,a=a.sibling}return null}var Pa=0,O=null,K=null,ie=null,sn=!1,Tl=!1,Vt=!1,dn=0,Uu=0,Ml=null,hL=0;function le(){throw Error(y(321))}function Id(e,a){if(a===null)return!1;for(var t=0;t<a.length&&t<e.length;t++)if(!Je(e[t],a[t]))return!1;return!0}function kd(e,a,t,l,u,o){return Pa=o,O=a,a.memoizedState=null,a.updateQueue=null,a.lanes=0,R.H=e===null||e.memoizedState===null?Qm:Ud,Vt=!1,o=t(l,u),Vt=!1,Tl&&(o=ym(a,t,l,u)),Cm(e),o}function Cm(e){R.H=zu;var a=K!==null&&K.next!==null;if(Pa=0,ie=K=O=null,sn=!1,Uu=0,Ml=null,a)throw Error(y(300));e===null||me||(e=e.dependencies,e!==null&&un(e)&&(me=!0))}function ym(e,a,t,l){O=e;var u=0;do{if(Tl&&(Ml=null),Uu=0,Tl=!1,25<=u)throw Error(y(301));if(u+=1,ie=K=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}R.H=Jm,o=a(t,l)}while(Tl);return o}function xL(){var e=R.H,a=e.useState()[0];return a=typeof a.then=="function"?Qu(a):a,e=e.useState()[0],(K!==null?K.memoizedState:null)!==e&&(O.flags|=1024),a}function Ad(){var e=dn!==0;return dn=0,e}function wd(e,a,t){a.updateQueue=e.updateQueue,a.flags&=-2053,e.lanes&=~t}function Td(e){if(sn){for(e=e.memoizedState;e!==null;){var a=e.queue;a!==null&&(a.pending=null),e=e.next}sn=!1}Pa=0,ie=K=O=null,Tl=!1,Uu=dn=0,Ml=null}function Oe(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ie===null?O.memoizedState=ie=e:ie=ie.next=e,ie}function re(){if(K===null){var e=O.alternate;e=e!==null?e.memoizedState:null}else e=K.next;var a=ie===null?O.memoizedState:ie.next;if(a!==null)ie=a,K=e;else{if(e===null)throw O.alternate===null?Error(y(467)):Error(y(310));K=e,e={memoizedState:K.memoizedState,baseState:K.baseState,baseQueue:K.baseQueue,queue:K.queue,next:null},ie===null?O.memoizedState=ie=e:ie=ie.next=e}return ie}function En(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Qu(e){var a=Uu;return Uu+=1,Ml===null&&(Ml=[]),e=pm(Ml,e,a),a=O,(ie===null?a.memoizedState:ie.next)===null&&(a=a.alternate,R.H=a===null||a.memoizedState===null?Qm:Ud),e}function On(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Qu(e);if(e.$$typeof===Oa)return ke(e)}throw Error(y(438,String(e)))}function Md(e){var a=null,t=O.updateQueue;if(t!==null&&(a=t.memoCache),a==null){var l=O.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(a={data:l.data.map(function(u){return u.slice()}),index:0})))}if(a==null&&(a={data:[],index:0}),t===null&&(t=En(),O.updateQueue=t),t.memoCache=a,t=a.data[a.index],t===void 0)for(t=a.data[a.index]=Array(e),l=0;l<e;l++)t[l]=tx;return a.index++,t}function Na(e,a){return typeof a=="function"?a(e):a}function Po(e){var a=re();return Dd(a,K,e)}function Dd(e,a,t){var l=e.queue;if(l===null)throw Error(y(311));l.lastRenderedReducer=t;var u=e.baseQueue,o=l.pending;if(o!==null){if(u!==null){var n=u.next;u.next=o.next,o.next=n}a.baseQueue=u=o,l.pending=null}if(o=e.baseState,u===null)e.memoizedState=o;else{a=u.next;var r=n=null,s=null,d=a,g=!1;do{var f=d.lane&-536870913;if(f!==d.lane?(q&f)===f:(Pa&f)===f){var c=d.revertLane;if(c===0)s!==null&&(s=s.next={lane:0,revertLane:0,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),f===El&&(g=!0);else if((Pa&c)===c){d=d.next,c===El&&(g=!0);continue}else f={lane:0,revertLane:d.revertLane,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},s===null?(r=s=f,n=o):s=s.next=f,O.lanes|=c,Ct|=c;f=d.action,Vt&&t(o,f),o=d.hasEagerState?d.eagerState:t(o,f)}else c={lane:f,revertLane:d.revertLane,gesture:d.gesture,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},s===null?(r=s=c,n=o):s=s.next=c,O.lanes|=f,Ct|=f;d=d.next}while(d!==null&&d!==a);if(s===null?n=o:s.next=r,!Je(o,e.memoizedState)&&(me=!0,g&&(t=Al,t!==null)))throw t;e.memoizedState=o,e.baseState=n,e.baseQueue=s,l.lastRenderedState=o}return u===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function Gr(e){var a=re(),t=a.queue;if(t===null)throw Error(y(311));t.lastRenderedReducer=e;var l=t.dispatch,u=t.pending,o=a.memoizedState;if(u!==null){t.pending=null;var n=u=u.next;do o=e(o,n.action),n=n.next;while(n!==u);Je(o,a.memoizedState)||(me=!0),a.memoizedState=o,a.baseQueue===null&&(a.baseState=o),t.lastRenderedState=o}return[o,l]}function bm(e,a,t){var l=O,u=re(),o=H;if(o){if(t===void 0)throw Error(y(407));t=t()}else t=a();var n=!Je((K||u).memoizedState,t);if(n&&(u.memoizedState=t,me=!0),u=u.queue,Rd(km.bind(null,l,u,e),[e]),u.getSnapshot!==a||n||ie!==null&&ie.memoizedState.tag&1){if(l.flags|=2048,_l(9,{destroy:void 0},Im.bind(null,l,u,t,a),null),Y===null)throw Error(y(349));o||(Pa&127)!==0||vm(l,a,t)}return t}function vm(e,a,t){e.flags|=16384,e={getSnapshot:a,value:t},a=O.updateQueue,a===null?(a=En(),O.updateQueue=a,a.stores=[e]):(t=a.stores,t===null?a.stores=[e]:t.push(e))}function Im(e,a,t,l){a.value=t,a.getSnapshot=l,Am(a)&&wm(e)}function km(e,a,t){return t(function(){Am(a)&&wm(e)})}function Am(e){var a=e.getSnapshot;e=e.value;try{var t=a();return!Je(e,t)}catch{return!0}}function wm(e){var a=Zt(e,2);a!==null&&He(a,e,2)}function Es(e){var a=Oe();if(typeof e=="function"){var t=e;if(e=t(),Vt){lt(!0);try{t()}finally{lt(!1)}}}return a.memoizedState=a.baseState=e,a.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Na,lastRenderedState:e},a}function Tm(e,a,t,l){return e.baseState=t,Dd(e,K,typeof l=="function"?l:Na)}function LL(e,a,t,l,u){if(Un(e))throw Error(y(485));if(e=a.action,e!==null){var o={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(n){o.listeners.push(n)}};R.T!==null?t(!0):o.isTransition=!1,l(o),t=a.pending,t===null?(o.next=a.pending=o,Mm(a,o)):(o.next=t.next,a.pending=t.next=o)}}function Mm(e,a){var t=a.action,l=a.payload,u=e.state;if(a.isTransition){var o=R.T,n={};R.T=n;try{var r=t(u,l),s=R.S;s!==null&&s(n,r),Tf(e,a,r)}catch(d){Os(e,a,d)}finally{o!==null&&n.types!==null&&(o.types=n.types),R.T=o}}else try{o=t(u,l),Tf(e,a,o)}catch(d){Os(e,a,d)}}function Tf(e,a,t){t!==null&&typeof t=="object"&&typeof t.then=="function"?t.then(function(l){Mf(e,a,l)},function(l){return Os(e,a,l)}):Mf(e,a,t)}function Mf(e,a,t){a.status="fulfilled",a.value=t,Dm(a),e.state=t,a=e.pending,a!==null&&(t=a.next,t===a?e.pending=null:(t=t.next,a.next=t,Mm(e,t)))}function Os(e,a,t){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do a.status="rejected",a.reason=t,Dm(a),a=a.next;while(a!==l)}e.action=null}function Dm(e){e=e.listeners;for(var a=0;a<e.length;a++)(0,e[a])()}function Rm(e,a){return a}function Df(e,a){if(H){var t=Y.formState;if(t!==null){e:{var l=O;if(H){if($){a:{for(var u=$,o=ra;u.nodeType!==8;){if(!o){u=null;break a}if(u=da(u.nextSibling),u===null){u=null;break a}}o=u.data,u=o==="F!"||o==="F"?u:null}if(u){$=da(u.nextSibling),l=u.data==="F!";break e}}Lt(l)}l=!1}l&&(a=t[0])}}return t=Oe(),t.memoizedState=t.baseState=a,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Rm,lastRenderedState:a},t.queue=l,t=Km.bind(null,O,l),l.dispatch=t,l=Es(!1),o=_d.bind(null,O,!1,l.queue),l=Oe(),u={state:a,dispatch:null,action:e,pending:null},l.queue=u,t=LL.bind(null,O,u,o,t),u.dispatch=t,l.memoizedState=e,[a,t,!1]}function Rf(e){var a=re();return Bm(a,K,e)}function Bm(e,a,t){if(a=Dd(e,a,Rm)[0],e=Po(Na)[0],typeof a=="object"&&a!==null&&typeof a.then=="function")try{var l=Qu(a)}catch(n){throw n===Vl?Bn:n}else l=a;a=re();var u=a.queue,o=u.dispatch;return t!==a.memoizedState&&(O.flags|=2048,_l(9,{destroy:void 0},SL.bind(null,u,t),null)),[l,o,e]}function SL(e,a){e.action=a}function Bf(e){var a=re(),t=K;if(t!==null)return Bm(a,t,e);re(),a=a.memoizedState,t=re();var l=t.queue.dispatch;return t.memoizedState=e,[a,l,!1]}function _l(e,a,t,l){return e={tag:e,create:t,deps:l,inst:a,next:null},a=O.updateQueue,a===null&&(a=En(),O.updateQueue=a),t=a.lastEffect,t===null?a.lastEffect=e.next=e:(l=t.next,t.next=e,e.next=l,a.lastEffect=e),e}function Em(){return re().memoizedState}function No(e,a,t,l){var u=Oe();O.flags|=e,u.memoizedState=_l(1|a,{destroy:void 0},t,l===void 0?null:l)}function _n(e,a,t,l){var u=re();l=l===void 0?null:l;var o=u.memoizedState.inst;K!==null&&l!==null&&Id(l,K.memoizedState.deps)?u.memoizedState=_l(a,o,t,l):(O.flags|=e,u.memoizedState=_l(1|a,o,t,l))}function Ef(e,a){No(8390656,8,e,a)}function Rd(e,a){_n(2048,8,e,a)}function CL(e){O.flags|=4;var a=O.updateQueue;if(a===null)a=En(),O.updateQueue=a,a.events=[e];else{var t=a.events;t===null?a.events=[e]:t.push(e)}}function Om(e){var a=re().memoizedState;return CL({ref:a,nextImpl:e}),function(){if((P&2)!==0)throw Error(y(440));return a.impl.apply(void 0,arguments)}}function _m(e,a){return _n(4,2,e,a)}function Um(e,a){return _n(4,4,e,a)}function zm(e,a){if(typeof a=="function"){e=e();var t=a(e);return function(){typeof t=="function"?t():a(null)}}if(a!=null)return e=e(),a.current=e,function(){a.current=null}}function qm(e,a,t){t=t!=null?t.concat([e]):null,_n(4,4,zm.bind(null,a,e),t)}function Bd(){}function Hm(e,a){var t=re();a=a===void 0?null:a;var l=t.memoizedState;return a!==null&&Id(a,l[1])?l[0]:(t.memoizedState=[e,a],e)}function Fm(e,a){var t=re();a=a===void 0?null:a;var l=t.memoizedState;if(a!==null&&Id(a,l[1]))return l[0];if(l=e(),Vt){lt(!0);try{e()}finally{lt(!1)}}return t.memoizedState=[l,a],l}function Ed(e,a,t){return t===void 0||(Pa&1073741824)!==0&&(q&261930)===0?e.memoizedState=a:(e.memoizedState=t,e=Tp(),O.lanes|=e,Ct|=e,t)}function Pm(e,a,t,l){return Je(t,a)?t:Ol.current!==null?(e=Ed(e,t,l),Je(e,a)||(me=!0),e):(Pa&42)===0||(Pa&1073741824)!==0&&(q&261930)===0?(me=!0,e.memoizedState=t):(e=Tp(),O.lanes|=e,Ct|=e,a)}function Nm(e,a,t,l,u){var o=N.p;N.p=o!==0&&8>o?o:8;var n=R.T,r={};R.T=r,_d(e,!1,a,t);try{var s=u(),d=R.S;if(d!==null&&d(r,s),s!==null&&typeof s=="object"&&typeof s.then=="function"){var g=gL(s,l);vu(e,a,g,Qe(e))}else vu(e,a,l,Qe(e))}catch(f){vu(e,a,{then:function(){},status:"rejected",reason:f},Qe())}finally{N.p=o,n!==null&&r.types!==null&&(n.types=r.types),R.T=n}}function yL(){}function _s(e,a,t,l){if(e.tag!==5)throw Error(y(476));var u=Gm(e).queue;Nm(e,u,a,Ut,t===null?yL:function(){return Vm(e),t(l)})}function Gm(e){var a=e.memoizedState;if(a!==null)return a;a={memoizedState:Ut,baseState:Ut,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Na,lastRenderedState:Ut},next:null};var t={};return a.next={memoizedState:t,baseState:t,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Na,lastRenderedState:t},next:null},e.memoizedState=a,e=e.alternate,e!==null&&(e.memoizedState=a),a}function Vm(e){var a=Gm(e);a.next===null&&(a=e.alternate.memoizedState),vu(e,a.next.queue,{},Qe())}function Od(){return ke(Fu)}function Xm(){return re().memoizedState}function jm(){return re().memoizedState}function bL(e){for(var a=e.return;a!==null;){switch(a.tag){case 24:case 3:var t=Qe();e=it(t);var l=ft(a,e,t);l!==null&&(He(l,a,t),Cu(l,a,t)),a={cache:Sd()},e.payload=a;return}a=a.return}}function vL(e,a,t){var l=Qe();t={lane:l,revertLane:0,gesture:null,action:t,hasEagerState:!1,eagerState:null,next:null},Un(e)?Ym(a,t):(t=gd(e,a,t,l),t!==null&&(He(t,e,l),Zm(t,a,l)))}function Km(e,a,t){var l=Qe();vu(e,a,t,l)}function vu(e,a,t,l){var u={lane:l,revertLane:0,gesture:null,action:t,hasEagerState:!1,eagerState:null,next:null};if(Un(e))Ym(a,u);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=a.lastRenderedReducer,o!==null))try{var n=a.lastRenderedState,r=o(n,t);if(u.hasEagerState=!0,u.eagerState=r,Je(r,n))return Rn(e,a,u,0),Y===null&&Dn(),!1}catch{}if(t=gd(e,a,u,l),t!==null)return He(t,e,l),Zm(t,a,l),!0}return!1}function _d(e,a,t,l){if(l={lane:2,revertLane:Vd(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Un(e)){if(a)throw Error(y(479))}else a=gd(e,t,l,2),a!==null&&He(a,e,2)}function Un(e){var a=e.alternate;return e===O||a!==null&&a===O}function Ym(e,a){Tl=sn=!0;var t=e.pending;t===null?a.next=a:(a.next=t.next,t.next=a),e.pending=a}function Zm(e,a,t){if((t&4194048)!==0){var l=a.lanes;l&=e.pendingLanes,t|=l,a.lanes=t,Oc(e,t)}}var zu={readContext:ke,use:On,useCallback:le,useContext:le,useEffect:le,useImperativeHandle:le,useLayoutEffect:le,useInsertionEffect:le,useMemo:le,useReducer:le,useRef:le,useState:le,useDebugValue:le,useDeferredValue:le,useTransition:le,useSyncExternalStore:le,useId:le,useHostTransitionStatus:le,useFormState:le,useActionState:le,useOptimistic:le,useMemoCache:le,useCacheRefresh:le};zu.useEffectEvent=le;var Qm={readContext:ke,use:On,useCallback:function(e,a){return Oe().memoizedState=[e,a===void 0?null:a],e},useContext:ke,useEffect:Ef,useImperativeHandle:function(e,a,t){t=t!=null?t.concat([e]):null,No(4194308,4,zm.bind(null,a,e),t)},useLayoutEffect:function(e,a){return No(4194308,4,e,a)},useInsertionEffect:function(e,a){No(4,2,e,a)},useMemo:function(e,a){var t=Oe();a=a===void 0?null:a;var l=e();if(Vt){lt(!0);try{e()}finally{lt(!1)}}return t.memoizedState=[l,a],l},useReducer:function(e,a,t){var l=Oe();if(t!==void 0){var u=t(a);if(Vt){lt(!0);try{t(a)}finally{lt(!1)}}}else u=a;return l.memoizedState=l.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},l.queue=e,e=e.dispatch=vL.bind(null,O,e),[l.memoizedState,e]},useRef:function(e){var a=Oe();return e={current:e},a.memoizedState=e},useState:function(e){e=Es(e);var a=e.queue,t=Km.bind(null,O,a);return a.dispatch=t,[e.memoizedState,t]},useDebugValue:Bd,useDeferredValue:function(e,a){var t=Oe();return Ed(t,e,a)},useTransition:function(){var e=Es(!1);return e=Nm.bind(null,O,e.queue,!0,!1),Oe().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,a,t){var l=O,u=Oe();if(H){if(t===void 0)throw Error(y(407));t=t()}else{if(t=a(),Y===null)throw Error(y(349));(q&127)!==0||vm(l,a,t)}u.memoizedState=t;var o={value:t,getSnapshot:a};return u.queue=o,Ef(km.bind(null,l,o,e),[e]),l.flags|=2048,_l(9,{destroy:void 0},Im.bind(null,l,o,t,a),null),t},useId:function(){var e=Oe(),a=Y.identifierPrefix;if(H){var t=Sa,l=La;t=(l&~(1<<32-Ze(l)-1)).toString(32)+t,a="_"+a+"R_"+t,t=dn++,0<t&&(a+="H"+t.toString(32)),a+="_"}else t=hL++,a="_"+a+"r_"+t.toString(32)+"_";return e.memoizedState=a},useHostTransitionStatus:Od,useFormState:Df,useActionState:Df,useOptimistic:function(e){var a=Oe();a.memoizedState=a.baseState=e;var t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return a.queue=t,a=_d.bind(null,O,!0,t),t.dispatch=a,[e,a]},useMemoCache:Md,useCacheRefresh:function(){return Oe().memoizedState=bL.bind(null,O)},useEffectEvent:function(e){var a=Oe(),t={impl:e};return a.memoizedState=t,function(){if((P&2)!==0)throw Error(y(440));return t.impl.apply(void 0,arguments)}}},Ud={readContext:ke,use:On,useCallback:Hm,useContext:ke,useEffect:Rd,useImperativeHandle:qm,useInsertionEffect:_m,useLayoutEffect:Um,useMemo:Fm,useReducer:Po,useRef:Em,useState:function(){return Po(Na)},useDebugValue:Bd,useDeferredValue:function(e,a){var t=re();return Pm(t,K.memoizedState,e,a)},useTransition:function(){var e=Po(Na)[0],a=re().memoizedState;return[typeof e=="boolean"?e:Qu(e),a]},useSyncExternalStore:bm,useId:Xm,useHostTransitionStatus:Od,useFormState:Rf,useActionState:Rf,useOptimistic:function(e,a){var t=re();return Tm(t,K,e,a)},useMemoCache:Md,useCacheRefresh:jm};Ud.useEffectEvent=Om;var Jm={readContext:ke,use:On,useCallback:Hm,useContext:ke,useEffect:Rd,useImperativeHandle:qm,useInsertionEffect:_m,useLayoutEffect:Um,useMemo:Fm,useReducer:Gr,useRef:Em,useState:function(){return Gr(Na)},useDebugValue:Bd,useDeferredValue:function(e,a){var t=re();return K===null?Ed(t,e,a):Pm(t,K.memoizedState,e,a)},useTransition:function(){var e=Gr(Na)[0],a=re().memoizedState;return[typeof e=="boolean"?e:Qu(e),a]},useSyncExternalStore:bm,useId:Xm,useHostTransitionStatus:Od,useFormState:Bf,useActionState:Bf,useOptimistic:function(e,a){var t=re();return K!==null?Tm(t,K,e,a):(t.baseState=e,[e,t.queue.dispatch])},useMemoCache:Md,useCacheRefresh:jm};Jm.useEffectEvent=Om;function Vr(e,a,t,l){a=e.memoizedState,t=t(l,a),t=t==null?a:ee({},a,t),e.memoizedState=t,e.lanes===0&&(e.updateQueue.baseState=t)}var Us={enqueueSetState:function(e,a,t){e=e._reactInternals;var l=Qe(),u=it(l);u.payload=a,t!=null&&(u.callback=t),a=ft(e,u,l),a!==null&&(He(a,e,l),Cu(a,e,l))},enqueueReplaceState:function(e,a,t){e=e._reactInternals;var l=Qe(),u=it(l);u.tag=1,u.payload=a,t!=null&&(u.callback=t),a=ft(e,u,l),a!==null&&(He(a,e,l),Cu(a,e,l))},enqueueForceUpdate:function(e,a){e=e._reactInternals;var t=Qe(),l=it(t);l.tag=2,a!=null&&(l.callback=a),a=ft(e,l,t),a!==null&&(He(a,e,t),Cu(a,e,t))}};function Of(e,a,t,l,u,o,n){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,o,n):a.prototype&&a.prototype.isPureReactComponent?!Bu(t,l)||!Bu(u,o):!0}function _f(e,a,t,l){e=a.state,typeof a.componentWillReceiveProps=="function"&&a.componentWillReceiveProps(t,l),typeof a.UNSAFE_componentWillReceiveProps=="function"&&a.UNSAFE_componentWillReceiveProps(t,l),a.state!==e&&Us.enqueueReplaceState(a,a.state,null)}function Xt(e,a){var t=a;if("ref"in a){t={};for(var l in a)l!=="ref"&&(t[l]=a[l])}if(e=e.defaultProps){t===a&&(t=ee({},t));for(var u in e)t[u]===void 0&&(t[u]=e[u])}return t}function Wm(e){an(e)}function $m(e){console.error(e)}function ep(e){an(e)}function fn(e,a){try{var t=e.onUncaughtError;t(a.value,{componentStack:a.stack})}catch(l){setTimeout(function(){throw l})}}function Uf(e,a,t){try{var l=e.onCaughtError;l(t.value,{componentStack:t.stack,errorBoundary:a.tag===1?a.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function zs(e,a,t){return t=it(t),t.tag=3,t.payload={element:null},t.callback=function(){fn(e,a)},t}function ap(e){return e=it(e),e.tag=3,e}function tp(e,a,t,l){var u=t.type.getDerivedStateFromError;if(typeof u=="function"){var o=l.value;e.payload=function(){return u(o)},e.callback=function(){Uf(a,t,l)}}var n=t.stateNode;n!==null&&typeof n.componentDidCatch=="function"&&(e.callback=function(){Uf(a,t,l),typeof u!="function"&&(ct===null?ct=new Set([this]):ct.add(this));var r=l.stack;this.componentDidCatch(l.value,{componentStack:r!==null?r:""})})}function IL(e,a,t,l,u){if(t.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(a=t.alternate,a!==null&&Gl(a,t,u,!0),t=We.current,t!==null){switch(t.tag){case 31:case 13:return sa===null?hn():t.alternate===null&&ue===0&&(ue=3),t.flags&=-257,t.flags|=65536,t.lanes=u,l===on?t.flags|=16384:(a=t.updateQueue,a===null?t.updateQueue=new Set([l]):a.add(l),as(e,l,u)),!1;case 22:return t.flags|=65536,l===on?t.flags|=16384:(a=t.updateQueue,a===null?(a={transitions:null,markerInstances:null,retryQueue:new Set([l])},t.updateQueue=a):(t=a.retryQueue,t===null?a.retryQueue=new Set([l]):t.add(l)),as(e,l,u)),!1}throw Error(y(435,t.tag))}return as(e,l,u),hn(),!1}if(H)return a=We.current,a!==null?((a.flags&65536)===0&&(a.flags|=256),a.flags|=65536,a.lanes=u,l!==Is&&(e=Error(y(422),{cause:l}),Ou(na(e,t)))):(l!==Is&&(a=Error(y(423),{cause:l}),Ou(na(a,t))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,l=na(l,t),u=zs(e.stateNode,l,u),Nr(e,u),ue!==4&&(ue=2)),!1;var o=Error(y(520),{cause:l});if(o=na(o,t),Au===null?Au=[o]:Au.push(o),ue!==4&&(ue=2),a===null)return!0;l=na(l,t),t=a;do{switch(t.tag){case 3:return t.flags|=65536,e=u&-u,t.lanes|=e,e=zs(t.stateNode,l,e),Nr(t,e),!1;case 1:if(a=t.type,o=t.stateNode,(t.flags&128)===0&&(typeof a.getDerivedStateFromError=="function"||o!==null&&typeof o.componentDidCatch=="function"&&(ct===null||!ct.has(o))))return t.flags|=65536,u&=-u,t.lanes|=u,u=ap(u),tp(u,e,t,l),Nr(t,u),!1}t=t.return}while(t!==null);return!1}var zd=Error(y(461)),me=!1;function be(e,a,t,l){a.child=e===null?hm(a,null,t,l):Gt(a,e.child,t,l)}function zf(e,a,t,l,u){t=t.render;var o=a.ref;if("ref"in l){var n={};for(var r in l)r!=="ref"&&(n[r]=l[r])}else n=l;return Nt(a),l=kd(e,a,t,n,o,u),r=Ad(),e!==null&&!me?(wd(e,a,u),Ga(e,a,u)):(H&&r&&xd(a),a.flags|=1,be(e,a,l,u),a.child)}function qf(e,a,t,l,u){if(e===null){var o=t.type;return typeof o=="function"&&!hd(o)&&o.defaultProps===void 0&&t.compare===null?(a.tag=15,a.type=o,lp(e,a,o,l,u)):(e=Ho(t.type,null,l,a,a.mode,u),e.ref=a.ref,e.return=a,a.child=e)}if(o=e.child,!qd(e,u)){var n=o.memoizedProps;if(t=t.compare,t=t!==null?t:Bu,t(n,l)&&e.ref===a.ref)return Ga(e,a,u)}return a.flags|=1,e=za(o,l),e.ref=a.ref,e.return=a,a.child=e}function lp(e,a,t,l,u){if(e!==null){var o=e.memoizedProps;if(Bu(o,l)&&e.ref===a.ref)if(me=!1,a.pendingProps=l=o,qd(e,u))(e.flags&131072)!==0&&(me=!0);else return a.lanes=e.lanes,Ga(e,a,u)}return qs(e,a,t,l,u)}function up(e,a,t,l){var u=l.children,o=e!==null?e.memoizedState:null;if(e===null&&a.stateNode===null&&(a.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((a.flags&128)!==0){if(o=o!==null?o.baseLanes|t:t,e!==null){for(l=a.child=e.child,u=0;l!==null;)u=u|l.lanes|l.childLanes,l=l.sibling;l=u&~o}else l=0,a.child=null;return Hf(e,a,o,t,l)}if((t&536870912)!==0)a.memoizedState={baseLanes:0,cachePool:null},e!==null&&Fo(a,o!==null?o.cachePool:null),o!==null?wf(a,o):Rs(),Sm(a);else return l=a.lanes=536870912,Hf(e,a,o!==null?o.baseLanes|t:t,t,l)}else o!==null?(Fo(a,o.cachePool),wf(a,o),at(a),a.memoizedState=null):(e!==null&&Fo(a,null),Rs(),at(a));return be(e,a,u,t),a.child}function pu(e,a){return e!==null&&e.tag===22||a.stateNode!==null||(a.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.sibling}function Hf(e,a,t,l,u){var o=Cd();return o=o===null?null:{parent:ce._currentValue,pool:o},a.memoizedState={baseLanes:t,cachePool:o},e!==null&&Fo(a,null),Rs(),Sm(a),e!==null&&Gl(e,a,l,!0),a.childLanes=u,null}function Go(e,a){return a=cn({mode:a.mode,children:a.children},e.mode),a.ref=e.ref,e.child=a,a.return=e,a}function Ff(e,a,t){return Gt(a,e.child,null,t),e=Go(a,a.pendingProps),e.flags|=2,Ve(a),a.memoizedState=null,e}function kL(e,a,t){var l=a.pendingProps,u=(a.flags&128)!==0;if(a.flags&=-129,e===null){if(H){if(l.mode==="hidden")return e=Go(a,l),a.lanes=536870912,pu(null,e);if(Bs(a),(e=$)?(e=Qp(e,ra),e=e!==null&&e.data==="&"?e:null,e!==null&&(a.memoizedState={dehydrated:e,treeContext:xt!==null?{id:La,overflow:Sa}:null,retryLane:536870912,hydrationErrors:null},t=dm(e),t.return=a,a.child=t,Ie=a,$=null)):e=null,e===null)throw Lt(a);return a.lanes=536870912,null}return Go(a,l)}var o=e.memoizedState;if(o!==null){var n=o.dehydrated;if(Bs(a),u)if(a.flags&256)a.flags&=-257,a=Ff(e,a,t);else if(a.memoizedState!==null)a.child=e.child,a.flags|=128,a=null;else throw Error(y(558));else if(me||Gl(e,a,t,!1),u=(t&e.childLanes)!==0,me||u){if(l=Y,l!==null&&(n=_c(l,t),n!==0&&n!==o.retryLane))throw o.retryLane=n,Zt(e,n),He(l,e,n),zd;hn(),a=Ff(e,a,t)}else e=o.treeContext,$=da(n.nextSibling),Ie=a,H=!0,dt=null,ra=!1,e!==null&&fm(a,e),a=Go(a,l),a.flags|=4096;return a}return e=za(e.child,{mode:l.mode,children:l.children}),e.ref=a.ref,a.child=e,e.return=a,e}function Vo(e,a){var t=a.ref;if(t===null)e!==null&&e.ref!==null&&(a.flags|=4194816);else{if(typeof t!="function"&&typeof t!="object")throw Error(y(284));(e===null||e.ref!==t)&&(a.flags|=4194816)}}function qs(e,a,t,l,u){return Nt(a),t=kd(e,a,t,l,void 0,u),l=Ad(),e!==null&&!me?(wd(e,a,u),Ga(e,a,u)):(H&&l&&xd(a),a.flags|=1,be(e,a,t,u),a.child)}function Pf(e,a,t,l,u,o){return Nt(a),a.updateQueue=null,t=ym(a,l,t,u),Cm(e),l=Ad(),e!==null&&!me?(wd(e,a,o),Ga(e,a,o)):(H&&l&&xd(a),a.flags|=1,be(e,a,t,o),a.child)}function Nf(e,a,t,l,u){if(Nt(a),a.stateNode===null){var o=Sl,n=t.contextType;typeof n=="object"&&n!==null&&(o=ke(n)),o=new t(l,o),a.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,o.updater=Us,a.stateNode=o,o._reactInternals=a,o=a.stateNode,o.props=l,o.state=a.memoizedState,o.refs={},bd(a),n=t.contextType,o.context=typeof n=="object"&&n!==null?ke(n):Sl,o.state=a.memoizedState,n=t.getDerivedStateFromProps,typeof n=="function"&&(Vr(a,t,n,l),o.state=a.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(n=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),n!==o.state&&Us.enqueueReplaceState(o,o.state,null),bu(a,l,o,u),yu(),o.state=a.memoizedState),typeof o.componentDidMount=="function"&&(a.flags|=4194308),l=!0}else if(e===null){o=a.stateNode;var r=a.memoizedProps,s=Xt(t,r);o.props=s;var d=o.context,g=t.contextType;n=Sl,typeof g=="object"&&g!==null&&(n=ke(g));var f=t.getDerivedStateFromProps;g=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function",r=a.pendingProps!==r,g||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(r||d!==n)&&_f(a,o,l,n),Wa=!1;var c=a.memoizedState;o.state=c,bu(a,l,o,u),yu(),d=a.memoizedState,r||c!==d||Wa?(typeof f=="function"&&(Vr(a,t,f,l),d=a.memoizedState),(s=Wa||Of(a,t,s,l,c,d,n))?(g||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(a.flags|=4194308)):(typeof o.componentDidMount=="function"&&(a.flags|=4194308),a.memoizedProps=l,a.memoizedState=d),o.props=l,o.state=d,o.context=n,l=s):(typeof o.componentDidMount=="function"&&(a.flags|=4194308),l=!1)}else{o=a.stateNode,Ms(e,a),n=a.memoizedProps,g=Xt(t,n),o.props=g,f=a.pendingProps,c=o.context,d=t.contextType,s=Sl,typeof d=="object"&&d!==null&&(s=ke(d)),r=t.getDerivedStateFromProps,(d=typeof r=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(n!==f||c!==s)&&_f(a,o,l,s),Wa=!1,c=a.memoizedState,o.state=c,bu(a,l,o,u),yu();var h=a.memoizedState;n!==f||c!==h||Wa||e!==null&&e.dependencies!==null&&un(e.dependencies)?(typeof r=="function"&&(Vr(a,t,r,l),h=a.memoizedState),(g=Wa||Of(a,t,g,l,c,h,s)||e!==null&&e.dependencies!==null&&un(e.dependencies))?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(l,h,s),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(l,h,s)),typeof o.componentDidUpdate=="function"&&(a.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(a.flags|=1024)):(typeof o.componentDidUpdate!="function"||n===e.memoizedProps&&c===e.memoizedState||(a.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||n===e.memoizedProps&&c===e.memoizedState||(a.flags|=1024),a.memoizedProps=l,a.memoizedState=h),o.props=l,o.state=h,o.context=s,l=g):(typeof o.componentDidUpdate!="function"||n===e.memoizedProps&&c===e.memoizedState||(a.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||n===e.memoizedProps&&c===e.memoizedState||(a.flags|=1024),l=!1)}return o=l,Vo(e,a),l=(a.flags&128)!==0,o||l?(o=a.stateNode,t=l&&typeof t.getDerivedStateFromError!="function"?null:o.render(),a.flags|=1,e!==null&&l?(a.child=Gt(a,e.child,null,u),a.child=Gt(a,null,t,u)):be(e,a,t,u),a.memoizedState=o.state,e=a.child):e=Ga(e,a,u),e}function Gf(e,a,t,l){return Pt(),a.flags|=256,be(e,a,t,l),a.child}var Xr={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function jr(e){return{baseLanes:e,cachePool:mm()}}function Kr(e,a,t){return e=e!==null?e.childLanes&~t:0,a&&(e|=je),e}function op(e,a,t){var l=a.pendingProps,u=!1,o=(a.flags&128)!==0,n;if((n=o)||(n=e!==null&&e.memoizedState===null?!1:(ne.current&2)!==0),n&&(u=!0,a.flags&=-129),n=(a.flags&32)!==0,a.flags&=-33,e===null){if(H){if(u?et(a):at(a),(e=$)?(e=Qp(e,ra),e=e!==null&&e.data!=="&"?e:null,e!==null&&(a.memoizedState={dehydrated:e,treeContext:xt!==null?{id:La,overflow:Sa}:null,retryLane:536870912,hydrationErrors:null},t=dm(e),t.return=a,a.child=t,Ie=a,$=null)):e=null,e===null)throw Lt(a);return Ws(e)?a.lanes=32:a.lanes=536870912,null}var r=l.children;return l=l.fallback,u?(at(a),u=a.mode,r=cn({mode:"hidden",children:r},u),l=zt(l,u,t,null),r.return=a,l.return=a,r.sibling=l,a.child=r,l=a.child,l.memoizedState=jr(t),l.childLanes=Kr(e,n,t),a.memoizedState=Xr,pu(null,l)):(et(a),Hs(a,r))}var s=e.memoizedState;if(s!==null&&(r=s.dehydrated,r!==null)){if(o)a.flags&256?(et(a),a.flags&=-257,a=Yr(e,a,t)):a.memoizedState!==null?(at(a),a.child=e.child,a.flags|=128,a=null):(at(a),r=l.fallback,u=a.mode,l=cn({mode:"visible",children:l.children},u),r=zt(r,u,t,null),r.flags|=2,l.return=a,r.return=a,l.sibling=r,a.child=l,Gt(a,e.child,null,t),l=a.child,l.memoizedState=jr(t),l.childLanes=Kr(e,n,t),a.memoizedState=Xr,a=pu(null,l));else if(et(a),Ws(r)){if(n=r.nextSibling&&r.nextSibling.dataset,n)var d=n.dgst;n=d,l=Error(y(419)),l.stack="",l.digest=n,Ou({value:l,source:null,stack:null}),a=Yr(e,a,t)}else if(me||Gl(e,a,t,!1),n=(t&e.childLanes)!==0,me||n){if(n=Y,n!==null&&(l=_c(n,t),l!==0&&l!==s.retryLane))throw s.retryLane=l,Zt(e,l),He(n,e,l),zd;Js(r)||hn(),a=Yr(e,a,t)}else Js(r)?(a.flags|=192,a.child=e.child,a=null):(e=s.treeContext,$=da(r.nextSibling),Ie=a,H=!0,dt=null,ra=!1,e!==null&&fm(a,e),a=Hs(a,l.children),a.flags|=4096);return a}return u?(at(a),r=l.fallback,u=a.mode,s=e.child,d=s.sibling,l=za(s,{mode:"hidden",children:l.children}),l.subtreeFlags=s.subtreeFlags&65011712,d!==null?r=za(d,r):(r=zt(r,u,t,null),r.flags|=2),r.return=a,l.return=a,l.sibling=r,a.child=l,pu(null,l),l=a.child,r=e.child.memoizedState,r===null?r=jr(t):(u=r.cachePool,u!==null?(s=ce._currentValue,u=u.parent!==s?{parent:s,pool:s}:u):u=mm(),r={baseLanes:r.baseLanes|t,cachePool:u}),l.memoizedState=r,l.childLanes=Kr(e,n,t),a.memoizedState=Xr,pu(e.child,l)):(et(a),t=e.child,e=t.sibling,t=za(t,{mode:"visible",children:l.children}),t.return=a,t.sibling=null,e!==null&&(n=a.deletions,n===null?(a.deletions=[e],a.flags|=16):n.push(e)),a.child=t,a.memoizedState=null,t)}function Hs(e,a){return a=cn({mode:"visible",children:a},e.mode),a.return=e,e.child=a}function cn(e,a){return e=Xe(22,e,null,a),e.lanes=0,e}function Yr(e,a,t){return Gt(a,e.child,null,t),e=Hs(a,a.pendingProps.children),e.flags|=2,a.memoizedState=null,e}function Vf(e,a,t){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a),As(e.return,a,t)}function Zr(e,a,t,l,u,o){var n=e.memoizedState;n===null?e.memoizedState={isBackwards:a,rendering:null,renderingStartTime:0,last:l,tail:t,tailMode:u,treeForkCount:o}:(n.isBackwards=a,n.rendering=null,n.renderingStartTime=0,n.last=l,n.tail=t,n.tailMode=u,n.treeForkCount=o)}function np(e,a,t){var l=a.pendingProps,u=l.revealOrder,o=l.tail;l=l.children;var n=ne.current,r=(n&2)!==0;if(r?(n=n&1|2,a.flags|=128):n&=1,Q(ne,n),be(e,a,l,t),l=H?Eu:0,!r&&e!==null&&(e.flags&128)!==0)e:for(e=a.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Vf(e,t,a);else if(e.tag===19)Vf(e,t,a);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===a)break e;for(;e.sibling===null;){if(e.return===null||e.return===a)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(t=a.child,u=null;t!==null;)e=t.alternate,e!==null&&rn(e)===null&&(u=t),t=t.sibling;t=u,t===null?(u=a.child,a.child=null):(u=t.sibling,t.sibling=null),Zr(a,!1,u,t,o,l);break;case"backwards":case"unstable_legacy-backwards":for(t=null,u=a.child,a.child=null;u!==null;){if(e=u.alternate,e!==null&&rn(e)===null){a.child=u;break}e=u.sibling,u.sibling=t,t=u,u=e}Zr(a,!0,t,null,o,l);break;case"together":Zr(a,!1,null,null,void 0,l);break;default:a.memoizedState=null}return a.child}function Ga(e,a,t){if(e!==null&&(a.dependencies=e.dependencies),Ct|=a.lanes,(t&a.childLanes)===0)if(e!==null){if(Gl(e,a,t,!1),(t&a.childLanes)===0)return null}else return null;if(e!==null&&a.child!==e.child)throw Error(y(153));if(a.child!==null){for(e=a.child,t=za(e,e.pendingProps),a.child=t,t.return=a;e.sibling!==null;)e=e.sibling,t=t.sibling=za(e,e.pendingProps),t.return=a;t.sibling=null}return a.child}function qd(e,a){return(e.lanes&a)!==0?!0:(e=e.dependencies,!!(e!==null&&un(e)))}function AL(e,a,t){switch(a.tag){case 3:Jo(a,a.stateNode.containerInfo),$a(a,ce,e.memoizedState.cache),Pt();break;case 27:case 5:ms(a);break;case 4:Jo(a,a.stateNode.containerInfo);break;case 10:$a(a,a.type,a.memoizedProps.value);break;case 31:if(a.memoizedState!==null)return a.flags|=128,Bs(a),null;break;case 13:var l=a.memoizedState;if(l!==null)return l.dehydrated!==null?(et(a),a.flags|=128,null):(t&a.child.childLanes)!==0?op(e,a,t):(et(a),e=Ga(e,a,t),e!==null?e.sibling:null);et(a);break;case 19:var u=(e.flags&128)!==0;if(l=(t&a.childLanes)!==0,l||(Gl(e,a,t,!1),l=(t&a.childLanes)!==0),u){if(l)return np(e,a,t);a.flags|=128}if(u=a.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),Q(ne,ne.current),l)break;return null;case 22:return a.lanes=0,up(e,a,t,a.pendingProps);case 24:$a(a,ce,e.memoizedState.cache)}return Ga(e,a,t)}function rp(e,a,t){if(e!==null)if(e.memoizedProps!==a.pendingProps)me=!0;else{if(!qd(e,t)&&(a.flags&128)===0)return me=!1,AL(e,a,t);me=(e.flags&131072)!==0}else me=!1,H&&(a.flags&1048576)!==0&&im(a,Eu,a.index);switch(a.lanes=0,a.tag){case 16:e:{var l=a.pendingProps;if(e=Ot(a.elementType),a.type=e,typeof e=="function")hd(e)?(l=Xt(e,l),a.tag=1,a=Nf(null,a,e,l,t)):(a.tag=0,a=qs(null,a,e,l,t));else{if(e!=null){var u=e.$$typeof;if(u===td){a.tag=11,a=zf(null,a,e,l,t);break e}else if(u===ld){a.tag=14,a=qf(null,a,e,l,t);break e}}throw a=fs(e)||e,Error(y(306,a,""))}}return a;case 0:return qs(e,a,a.type,a.pendingProps,t);case 1:return l=a.type,u=Xt(l,a.pendingProps),Nf(e,a,l,u,t);case 3:e:{if(Jo(a,a.stateNode.containerInfo),e===null)throw Error(y(387));l=a.pendingProps;var o=a.memoizedState;u=o.element,Ms(e,a),bu(a,l,null,t);var n=a.memoizedState;if(l=n.cache,$a(a,ce,l),l!==o.cache&&ws(a,[ce],t,!0),yu(),l=n.element,o.isDehydrated)if(o={element:l,isDehydrated:!1,cache:n.cache},a.updateQueue.baseState=o,a.memoizedState=o,a.flags&256){a=Gf(e,a,l,t);break e}else if(l!==u){u=na(Error(y(424)),a),Ou(u),a=Gf(e,a,l,t);break e}else for(e=a.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,$=da(e.firstChild),Ie=a,H=!0,dt=null,ra=!0,t=hm(a,null,l,t),a.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Pt(),l===u){a=Ga(e,a,t);break e}be(e,a,l,t)}a=a.child}return a;case 26:return Vo(e,a),e===null?(t=cc(a.type,null,a.pendingProps,null))?a.memoizedState=t:H||(t=a.type,e=a.pendingProps,l=Cn(st.current).createElement(t),l[ve]=a,l[Fe]=e,Ae(l,t,e),Se(l),a.stateNode=l):a.memoizedState=cc(a.type,e.memoizedProps,a.pendingProps,e.memoizedState),null;case 27:return ms(a),e===null&&H&&(l=a.stateNode=Jp(a.type,a.pendingProps,st.current),Ie=a,ra=!0,u=$,bt(a.type)?($s=u,$=da(l.firstChild)):$=u),be(e,a,a.pendingProps.children,t),Vo(e,a),e===null&&(a.flags|=4194304),a.child;case 5:return e===null&&H&&((u=l=$)&&(l=eS(l,a.type,a.pendingProps,ra),l!==null?(a.stateNode=l,Ie=a,$=da(l.firstChild),ra=!1,u=!0):u=!1),u||Lt(a)),ms(a),u=a.type,o=a.pendingProps,n=e!==null?e.memoizedProps:null,l=o.children,Zs(u,o)?l=null:n!==null&&Zs(u,n)&&(a.flags|=32),a.memoizedState!==null&&(u=kd(e,a,xL,null,null,t),Fu._currentValue=u),Vo(e,a),be(e,a,l,t),a.child;case 6:return e===null&&H&&((e=t=$)&&(t=aS(t,a.pendingProps,ra),t!==null?(a.stateNode=t,Ie=a,$=null,e=!0):e=!1),e||Lt(a)),null;case 13:return op(e,a,t);case 4:return Jo(a,a.stateNode.containerInfo),l=a.pendingProps,e===null?a.child=Gt(a,null,l,t):be(e,a,l,t),a.child;case 11:return zf(e,a,a.type,a.pendingProps,t);case 7:return be(e,a,a.pendingProps,t),a.child;case 8:return be(e,a,a.pendingProps.children,t),a.child;case 12:return be(e,a,a.pendingProps.children,t),a.child;case 10:return l=a.pendingProps,$a(a,a.type,l.value),be(e,a,l.children,t),a.child;case 9:return u=a.type._context,l=a.pendingProps.children,Nt(a),u=ke(u),l=l(u),a.flags|=1,be(e,a,l,t),a.child;case 14:return qf(e,a,a.type,a.pendingProps,t);case 15:return lp(e,a,a.type,a.pendingProps,t);case 19:return np(e,a,t);case 31:return kL(e,a,t);case 22:return up(e,a,t,a.pendingProps);case 24:return Nt(a),l=ke(ce),e===null?(u=Cd(),u===null&&(u=Y,o=Sd(),u.pooledCache=o,o.refCount++,o!==null&&(u.pooledCacheLanes|=t),u=o),a.memoizedState={parent:l,cache:u},bd(a),$a(a,ce,u)):((e.lanes&t)!==0&&(Ms(e,a),bu(a,null,null,t),yu()),u=e.memoizedState,o=a.memoizedState,u.parent!==l?(u={parent:l,cache:l},a.memoizedState=u,a.lanes===0&&(a.memoizedState=a.updateQueue.baseState=u),$a(a,ce,l)):(l=o.cache,$a(a,ce,l),l!==u.cache&&ws(a,[ce],t,!0))),be(e,a,a.pendingProps.children,t),a.child;case 29:throw a.pendingProps}throw Error(y(156,a.tag))}function Ta(e){e.flags|=4}function Qr(e,a,t,l,u){if((a=(e.mode&32)!==0)&&(a=!1),a){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(Rp())e.flags|=8192;else throw Ht=on,yd}else e.flags&=-16777217}function Xf(e,a){if(a.type!=="stylesheet"||(a.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!eg(a))if(Rp())e.flags|=8192;else throw Ht=on,yd}function To(e,a){a!==null&&(e.flags|=4),e.flags&16384&&(a=e.tag!==22?Bc():536870912,e.lanes|=a,Ul|=a)}function ru(e,a){if(!H)switch(e.tailMode){case"hidden":a=e.tail;for(var t=null;a!==null;)a.alternate!==null&&(t=a),a=a.sibling;t===null?e.tail=null:t.sibling=null;break;case"collapsed":t=e.tail;for(var l=null;t!==null;)t.alternate!==null&&(l=t),t=t.sibling;l===null?a||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function W(e){var a=e.alternate!==null&&e.alternate.child===e.child,t=0,l=0;if(a)for(var u=e.child;u!==null;)t|=u.lanes|u.childLanes,l|=u.subtreeFlags&65011712,l|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)t|=u.lanes|u.childLanes,l|=u.subtreeFlags,l|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=l,e.childLanes=t,a}function wL(e,a,t){var l=a.pendingProps;switch(Ld(a),a.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return W(a),null;case 1:return W(a),null;case 3:return t=a.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),a.memoizedState.cache!==l&&(a.flags|=2048),qa(ce),Dl(),t.pendingContext&&(t.context=t.pendingContext,t.pendingContext=null),(e===null||e.child===null)&&(rl(a)?Ta(a):e===null||e.memoizedState.isDehydrated&&(a.flags&256)===0||(a.flags|=1024,Pr())),W(a),null;case 26:var u=a.type,o=a.memoizedState;return e===null?(Ta(a),o!==null?(W(a),Xf(a,o)):(W(a),Qr(a,u,null,l,t))):o?o!==e.memoizedState?(Ta(a),W(a),Xf(a,o)):(W(a),a.flags&=-16777217):(e=e.memoizedProps,e!==l&&Ta(a),W(a),Qr(a,u,e,l,t)),null;case 27:if(Wo(a),t=st.current,u=a.type,e!==null&&a.stateNode!=null)e.memoizedProps!==l&&Ta(a);else{if(!l){if(a.stateNode===null)throw Error(y(166));return W(a),null}e=ya.current,rl(a)?Cf(a,e):(e=Jp(u,l,t),a.stateNode=e,Ta(a))}return W(a),null;case 5:if(Wo(a),u=a.type,e!==null&&a.stateNode!=null)e.memoizedProps!==l&&Ta(a);else{if(!l){if(a.stateNode===null)throw Error(y(166));return W(a),null}if(o=ya.current,rl(a))Cf(a,o);else{var n=Cn(st.current);switch(o){case 1:o=n.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:o=n.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":o=n.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":o=n.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":o=n.createElement("div"),o.innerHTML="<script><\/script>",o=o.removeChild(o.firstChild);break;case"select":o=typeof l.is=="string"?n.createElement("select",{is:l.is}):n.createElement("select"),l.multiple?o.multiple=!0:l.size&&(o.size=l.size);break;default:o=typeof l.is=="string"?n.createElement(u,{is:l.is}):n.createElement(u)}}o[ve]=a,o[Fe]=l;e:for(n=a.child;n!==null;){if(n.tag===5||n.tag===6)o.appendChild(n.stateNode);else if(n.tag!==4&&n.tag!==27&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===a)break e;for(;n.sibling===null;){if(n.return===null||n.return===a)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}a.stateNode=o;e:switch(Ae(o,u,l),u){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&Ta(a)}}return W(a),Qr(a,a.type,e===null?null:e.memoizedProps,a.pendingProps,t),null;case 6:if(e&&a.stateNode!=null)e.memoizedProps!==l&&Ta(a);else{if(typeof l!="string"&&a.stateNode===null)throw Error(y(166));if(e=st.current,rl(a)){if(e=a.stateNode,t=a.memoizedProps,l=null,u=Ie,u!==null)switch(u.tag){case 27:case 5:l=u.memoizedProps}e[ve]=a,e=!!(e.nodeValue===t||l!==null&&l.suppressHydrationWarning===!0||Kp(e.nodeValue,t)),e||Lt(a,!0)}else e=Cn(e).createTextNode(l),e[ve]=a,a.stateNode=e}return W(a),null;case 31:if(t=a.memoizedState,e===null||e.memoizedState!==null){if(l=rl(a),t!==null){if(e===null){if(!l)throw Error(y(318));if(e=a.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(557));e[ve]=a}else Pt(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;W(a),e=!1}else t=Pr(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=t),e=!0;if(!e)return a.flags&256?(Ve(a),a):(Ve(a),null);if((a.flags&128)!==0)throw Error(y(558))}return W(a),null;case 13:if(l=a.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=rl(a),l!==null&&l.dehydrated!==null){if(e===null){if(!u)throw Error(y(318));if(u=a.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(y(317));u[ve]=a}else Pt(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;W(a),u=!1}else u=Pr(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return a.flags&256?(Ve(a),a):(Ve(a),null)}return Ve(a),(a.flags&128)!==0?(a.lanes=t,a):(t=l!==null,e=e!==null&&e.memoizedState!==null,t&&(l=a.child,u=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(u=l.alternate.memoizedState.cachePool.pool),o=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(o=l.memoizedState.cachePool.pool),o!==u&&(l.flags|=2048)),t!==e&&t&&(a.child.flags|=8192),To(a,a.updateQueue),W(a),null);case 4:return Dl(),e===null&&Xd(a.stateNode.containerInfo),W(a),null;case 10:return qa(a.type),W(a),null;case 19:if(Ce(ne),l=a.memoizedState,l===null)return W(a),null;if(u=(a.flags&128)!==0,o=l.rendering,o===null)if(u)ru(l,!1);else{if(ue!==0||e!==null&&(e.flags&128)!==0)for(e=a.child;e!==null;){if(o=rn(e),o!==null){for(a.flags|=128,ru(l,!1),e=o.updateQueue,a.updateQueue=e,To(a,e),a.subtreeFlags=0,e=t,t=a.child;t!==null;)sm(t,e),t=t.sibling;return Q(ne,ne.current&1|2),H&&Ba(a,l.treeForkCount),a.child}e=e.sibling}l.tail!==null&&Ke()>pn&&(a.flags|=128,u=!0,ru(l,!1),a.lanes=4194304)}else{if(!u)if(e=rn(o),e!==null){if(a.flags|=128,u=!0,e=e.updateQueue,a.updateQueue=e,To(a,e),ru(l,!0),l.tail===null&&l.tailMode==="hidden"&&!o.alternate&&!H)return W(a),null}else 2*Ke()-l.renderingStartTime>pn&&t!==536870912&&(a.flags|=128,u=!0,ru(l,!1),a.lanes=4194304);l.isBackwards?(o.sibling=a.child,a.child=o):(e=l.last,e!==null?e.sibling=o:a.child=o,l.last=o)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Ke(),e.sibling=null,t=ne.current,Q(ne,u?t&1|2:t&1),H&&Ba(a,l.treeForkCount),e):(W(a),null);case 22:case 23:return Ve(a),vd(),l=a.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(a.flags|=8192):l&&(a.flags|=8192),l?(t&536870912)!==0&&(a.flags&128)===0&&(W(a),a.subtreeFlags&6&&(a.flags|=8192)):W(a),t=a.updateQueue,t!==null&&To(a,t.retryQueue),t=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),l=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(l=a.memoizedState.cachePool.pool),l!==t&&(a.flags|=2048),e!==null&&Ce(qt),null;case 24:return t=null,e!==null&&(t=e.memoizedState.cache),a.memoizedState.cache!==t&&(a.flags|=2048),qa(ce),W(a),null;case 25:return null;case 30:return null}throw Error(y(156,a.tag))}function TL(e,a){switch(Ld(a),a.tag){case 1:return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 3:return qa(ce),Dl(),e=a.flags,(e&65536)!==0&&(e&128)===0?(a.flags=e&-65537|128,a):null;case 26:case 27:case 5:return Wo(a),null;case 31:if(a.memoizedState!==null){if(Ve(a),a.alternate===null)throw Error(y(340));Pt()}return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 13:if(Ve(a),e=a.memoizedState,e!==null&&e.dehydrated!==null){if(a.alternate===null)throw Error(y(340));Pt()}return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 19:return Ce(ne),null;case 4:return Dl(),null;case 10:return qa(a.type),null;case 22:case 23:return Ve(a),vd(),e!==null&&Ce(qt),e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 24:return qa(ce),null;case 25:return null;default:return null}}function sp(e,a){switch(Ld(a),a.tag){case 3:qa(ce),Dl();break;case 26:case 27:case 5:Wo(a);break;case 4:Dl();break;case 31:a.memoizedState!==null&&Ve(a);break;case 13:Ve(a);break;case 19:Ce(ne);break;case 10:qa(a.type);break;case 22:case 23:Ve(a),vd(),e!==null&&Ce(qt);break;case 24:qa(ce)}}function Ju(e,a){try{var t=a.updateQueue,l=t!==null?t.lastEffect:null;if(l!==null){var u=l.next;t=u;do{if((t.tag&e)===e){l=void 0;var o=t.create,n=t.inst;l=o(),n.destroy=l}t=t.next}while(t!==u)}}catch(r){X(a,a.return,r)}}function St(e,a,t){try{var l=a.updateQueue,u=l!==null?l.lastEffect:null;if(u!==null){var o=u.next;l=o;do{if((l.tag&e)===e){var n=l.inst,r=n.destroy;if(r!==void 0){n.destroy=void 0,u=a;var s=t,d=r;try{d()}catch(g){X(u,s,g)}}}l=l.next}while(l!==o)}}catch(g){X(a,a.return,g)}}function dp(e){var a=e.updateQueue;if(a!==null){var t=e.stateNode;try{Lm(a,t)}catch(l){X(e,e.return,l)}}}function ip(e,a,t){t.props=Xt(e.type,e.memoizedProps),t.state=e.memoizedState;try{t.componentWillUnmount()}catch(l){X(e,a,l)}}function Iu(e,a){try{var t=e.ref;if(t!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof t=="function"?e.refCleanup=t(l):t.current=l}}catch(u){X(e,a,u)}}function Ca(e,a){var t=e.ref,l=e.refCleanup;if(t!==null)if(typeof l=="function")try{l()}catch(u){X(e,a,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof t=="function")try{t(null)}catch(u){X(e,a,u)}else t.current=null}function fp(e){var a=e.type,t=e.memoizedProps,l=e.stateNode;try{e:switch(a){case"button":case"input":case"select":case"textarea":t.autoFocus&&l.focus();break e;case"img":t.src?l.src=t.src:t.srcSet&&(l.srcset=t.srcSet)}}catch(u){X(e,e.return,u)}}function Jr(e,a,t){try{var l=e.stateNode;YL(l,e.type,t,a),l[Fe]=a}catch(u){X(e,e.return,u)}}function cp(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&bt(e.type)||e.tag===4}function Wr(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||cp(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&bt(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Fs(e,a,t){var l=e.tag;if(l===5||l===6)e=e.stateNode,a?(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t).insertBefore(e,a):(a=t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.appendChild(e),t=t._reactRootContainer,t!=null||a.onclick!==null||(a.onclick=_a));else if(l!==4&&(l===27&&bt(e.type)&&(t=e.stateNode,a=null),e=e.child,e!==null))for(Fs(e,a,t),e=e.sibling;e!==null;)Fs(e,a,t),e=e.sibling}function mn(e,a,t){var l=e.tag;if(l===5||l===6)e=e.stateNode,a?t.insertBefore(e,a):t.appendChild(e);else if(l!==4&&(l===27&&bt(e.type)&&(t=e.stateNode),e=e.child,e!==null))for(mn(e,a,t),e=e.sibling;e!==null;)mn(e,a,t),e=e.sibling}function mp(e){var a=e.stateNode,t=e.memoizedProps;try{for(var l=e.type,u=a.attributes;u.length;)a.removeAttributeNode(u[0]);Ae(a,l,t),a[ve]=e,a[Fe]=t}catch(o){X(e,e.return,o)}}var Ea=!1,fe=!1,$r=!1,jf=typeof WeakSet=="function"?WeakSet:Set,Le=null;function ML(e,a){if(e=e.containerInfo,Ks=In,e=em(e),md(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{t=(t=e.ownerDocument)&&t.defaultView||window;var l=t.getSelection&&t.getSelection();if(l&&l.rangeCount!==0){t=l.anchorNode;var u=l.anchorOffset,o=l.focusNode;l=l.focusOffset;try{t.nodeType,o.nodeType}catch{t=null;break e}var n=0,r=-1,s=-1,d=0,g=0,f=e,c=null;a:for(;;){for(var h;f!==t||u!==0&&f.nodeType!==3||(r=n+u),f!==o||l!==0&&f.nodeType!==3||(s=n+l),f.nodeType===3&&(n+=f.nodeValue.length),(h=f.firstChild)!==null;)c=f,f=h;for(;;){if(f===e)break a;if(c===t&&++d===u&&(r=n),c===o&&++g===l&&(s=n),(h=f.nextSibling)!==null)break;f=c,c=f.parentNode}f=h}t=r===-1||s===-1?null:{start:r,end:s}}else t=null}t=t||{start:0,end:0}}else t=null;for(Ys={focusedElem:e,selectionRange:t},In=!1,Le=a;Le!==null;)if(a=Le,e=a.child,(a.subtreeFlags&1028)!==0&&e!==null)e.return=a,Le=e;else for(;Le!==null;){switch(a=Le,o=a.alternate,e=a.flags,a.tag){case 0:if((e&4)!==0&&(e=a.updateQueue,e=e!==null?e.events:null,e!==null))for(t=0;t<e.length;t++)u=e[t],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&o!==null){e=void 0,t=a,u=o.memoizedProps,o=o.memoizedState,l=t.stateNode;try{var v=Xt(t.type,u);e=l.getSnapshotBeforeUpdate(v,o),l.__reactInternalSnapshotBeforeUpdate=e}catch(b){X(t,t.return,b)}}break;case 3:if((e&1024)!==0){if(e=a.stateNode.containerInfo,t=e.nodeType,t===9)Qs(e);else if(t===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Qs(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(y(163))}if(e=a.sibling,e!==null){e.return=a.return,Le=e;break}Le=a.return}}function pp(e,a,t){var l=t.flags;switch(t.tag){case 0:case 11:case 15:Da(e,t),l&4&&Ju(5,t);break;case 1:if(Da(e,t),l&4)if(e=t.stateNode,a===null)try{e.componentDidMount()}catch(n){X(t,t.return,n)}else{var u=Xt(t.type,a.memoizedProps);a=a.memoizedState;try{e.componentDidUpdate(u,a,e.__reactInternalSnapshotBeforeUpdate)}catch(n){X(t,t.return,n)}}l&64&&dp(t),l&512&&Iu(t,t.return);break;case 3:if(Da(e,t),l&64&&(e=t.updateQueue,e!==null)){if(a=null,t.child!==null)switch(t.child.tag){case 27:case 5:a=t.child.stateNode;break;case 1:a=t.child.stateNode}try{Lm(e,a)}catch(n){X(t,t.return,n)}}break;case 27:a===null&&l&4&&mp(t);case 26:case 5:Da(e,t),a===null&&l&4&&fp(t),l&512&&Iu(t,t.return);break;case 12:Da(e,t);break;case 31:Da(e,t),l&4&&xp(e,t);break;case 13:Da(e,t),l&4&&Lp(e,t),l&64&&(e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(t=qL.bind(null,t),tS(e,t))));break;case 22:if(l=t.memoizedState!==null||Ea,!l){a=a!==null&&a.memoizedState!==null||fe,u=Ea;var o=fe;Ea=l,(fe=a)&&!o?Ra(e,t,(t.subtreeFlags&8772)!==0):Da(e,t),Ea=u,fe=o}break;case 30:break;default:Da(e,t)}}function gp(e){var a=e.alternate;a!==null&&(e.alternate=null,gp(a)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(a=e.stateNode,a!==null&&rd(a)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var te=null,ze=!1;function Ma(e,a,t){for(t=t.child;t!==null;)hp(e,a,t),t=t.sibling}function hp(e,a,t){if(Ye&&typeof Ye.onCommitFiberUnmount=="function")try{Ye.onCommitFiberUnmount(Vu,t)}catch{}switch(t.tag){case 26:fe||Ca(t,a),Ma(e,a,t),t.memoizedState?t.memoizedState.count--:t.stateNode&&(t=t.stateNode,t.parentNode.removeChild(t));break;case 27:fe||Ca(t,a);var l=te,u=ze;bt(t.type)&&(te=t.stateNode,ze=!1),Ma(e,a,t),Tu(t.stateNode),te=l,ze=u;break;case 5:fe||Ca(t,a);case 6:if(l=te,u=ze,te=null,Ma(e,a,t),te=l,ze=u,te!==null)if(ze)try{(te.nodeType===9?te.body:te.nodeName==="HTML"?te.ownerDocument.body:te).removeChild(t.stateNode)}catch(o){X(t,a,o)}else try{te.removeChild(t.stateNode)}catch(o){X(t,a,o)}break;case 18:te!==null&&(ze?(e=te,rc(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,t.stateNode),Fl(e)):rc(te,t.stateNode));break;case 4:l=te,u=ze,te=t.stateNode.containerInfo,ze=!0,Ma(e,a,t),te=l,ze=u;break;case 0:case 11:case 14:case 15:St(2,t,a),fe||St(4,t,a),Ma(e,a,t);break;case 1:fe||(Ca(t,a),l=t.stateNode,typeof l.componentWillUnmount=="function"&&ip(t,a,l)),Ma(e,a,t);break;case 21:Ma(e,a,t);break;case 22:fe=(l=fe)||t.memoizedState!==null,Ma(e,a,t),fe=l;break;default:Ma(e,a,t)}}function xp(e,a){if(a.memoizedState===null&&(e=a.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Fl(e)}catch(t){X(a,a.return,t)}}}function Lp(e,a){if(a.memoizedState===null&&(e=a.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Fl(e)}catch(t){X(a,a.return,t)}}function DL(e){switch(e.tag){case 31:case 13:case 19:var a=e.stateNode;return a===null&&(a=e.stateNode=new jf),a;case 22:return e=e.stateNode,a=e._retryCache,a===null&&(a=e._retryCache=new jf),a;default:throw Error(y(435,e.tag))}}function Mo(e,a){var t=DL(e);a.forEach(function(l){if(!t.has(l)){t.add(l);var u=HL.bind(null,e,l);l.then(u,u)}})}function _e(e,a){var t=a.deletions;if(t!==null)for(var l=0;l<t.length;l++){var u=t[l],o=e,n=a,r=n;e:for(;r!==null;){switch(r.tag){case 27:if(bt(r.type)){te=r.stateNode,ze=!1;break e}break;case 5:te=r.stateNode,ze=!1;break e;case 3:case 4:te=r.stateNode.containerInfo,ze=!0;break e}r=r.return}if(te===null)throw Error(y(160));hp(o,n,u),te=null,ze=!1,o=u.alternate,o!==null&&(o.return=null),u.return=null}if(a.subtreeFlags&13886)for(a=a.child;a!==null;)Sp(a,e),a=a.sibling}var pa=null;function Sp(e,a){var t=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:_e(a,e),Ue(e),l&4&&(St(3,e,e.return),Ju(3,e),St(5,e,e.return));break;case 1:_e(a,e),Ue(e),l&512&&(fe||t===null||Ca(t,t.return)),l&64&&Ea&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(t=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=t===null?l:t.concat(l))));break;case 26:var u=pa;if(_e(a,e),Ue(e),l&512&&(fe||t===null||Ca(t,t.return)),l&4){var o=t!==null?t.memoizedState:null;if(l=e.memoizedState,t===null)if(l===null)if(e.stateNode===null){e:{l=e.type,t=e.memoizedProps,u=u.ownerDocument||u;a:switch(l){case"title":o=u.getElementsByTagName("title")[0],(!o||o[Ku]||o[ve]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=u.createElement(l),u.head.insertBefore(o,u.querySelector("head > title"))),Ae(o,l,t),o[ve]=e,Se(o),l=o;break e;case"link":var n=pc("link","href",u).get(l+(t.href||""));if(n){for(var r=0;r<n.length;r++)if(o=n[r],o.getAttribute("href")===(t.href==null||t.href===""?null:t.href)&&o.getAttribute("rel")===(t.rel==null?null:t.rel)&&o.getAttribute("title")===(t.title==null?null:t.title)&&o.getAttribute("crossorigin")===(t.crossOrigin==null?null:t.crossOrigin)){n.splice(r,1);break a}}o=u.createElement(l),Ae(o,l,t),u.head.appendChild(o);break;case"meta":if(n=pc("meta","content",u).get(l+(t.content||""))){for(r=0;r<n.length;r++)if(o=n[r],o.getAttribute("content")===(t.content==null?null:""+t.content)&&o.getAttribute("name")===(t.name==null?null:t.name)&&o.getAttribute("property")===(t.property==null?null:t.property)&&o.getAttribute("http-equiv")===(t.httpEquiv==null?null:t.httpEquiv)&&o.getAttribute("charset")===(t.charSet==null?null:t.charSet)){n.splice(r,1);break a}}o=u.createElement(l),Ae(o,l,t),u.head.appendChild(o);break;default:throw Error(y(468,l))}o[ve]=e,Se(o),l=o}e.stateNode=l}else gc(u,e.type,e.stateNode);else e.stateNode=mc(u,l,e.memoizedProps);else o!==l?(o===null?t.stateNode!==null&&(t=t.stateNode,t.parentNode.removeChild(t)):o.count--,l===null?gc(u,e.type,e.stateNode):mc(u,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Jr(e,e.memoizedProps,t.memoizedProps)}break;case 27:_e(a,e),Ue(e),l&512&&(fe||t===null||Ca(t,t.return)),t!==null&&l&4&&Jr(e,e.memoizedProps,t.memoizedProps);break;case 5:if(_e(a,e),Ue(e),l&512&&(fe||t===null||Ca(t,t.return)),e.flags&32){u=e.stateNode;try{Bl(u,"")}catch(v){X(e,e.return,v)}}l&4&&e.stateNode!=null&&(u=e.memoizedProps,Jr(e,u,t!==null?t.memoizedProps:u)),l&1024&&($r=!0);break;case 6:if(_e(a,e),Ue(e),l&4){if(e.stateNode===null)throw Error(y(162));l=e.memoizedProps,t=e.stateNode;try{t.nodeValue=l}catch(v){X(e,e.return,v)}}break;case 3:if(Ko=null,u=pa,pa=yn(a.containerInfo),_e(a,e),pa=u,Ue(e),l&4&&t!==null&&t.memoizedState.isDehydrated)try{Fl(a.containerInfo)}catch(v){X(e,e.return,v)}$r&&($r=!1,Cp(e));break;case 4:l=pa,pa=yn(e.stateNode.containerInfo),_e(a,e),Ue(e),pa=l;break;case 12:_e(a,e),Ue(e);break;case 31:_e(a,e),Ue(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Mo(e,l)));break;case 13:_e(a,e),Ue(e),e.child.flags&8192&&e.memoizedState!==null!=(t!==null&&t.memoizedState!==null)&&(zn=Ke()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Mo(e,l)));break;case 22:u=e.memoizedState!==null;var s=t!==null&&t.memoizedState!==null,d=Ea,g=fe;if(Ea=d||u,fe=g||s,_e(a,e),fe=g,Ea=d,Ue(e),l&8192)e:for(a=e.stateNode,a._visibility=u?a._visibility&-2:a._visibility|1,u&&(t===null||s||Ea||fe||_t(e)),t=null,a=e;;){if(a.tag===5||a.tag===26){if(t===null){s=t=a;try{if(o=s.stateNode,u)n=o.style,typeof n.setProperty=="function"?n.setProperty("display","none","important"):n.display="none";else{r=s.stateNode;var f=s.memoizedProps.style,c=f!=null&&f.hasOwnProperty("display")?f.display:null;r.style.display=c==null||typeof c=="boolean"?"":(""+c).trim()}}catch(v){X(s,s.return,v)}}}else if(a.tag===6){if(t===null){s=a;try{s.stateNode.nodeValue=u?"":s.memoizedProps}catch(v){X(s,s.return,v)}}}else if(a.tag===18){if(t===null){s=a;try{var h=s.stateNode;u?sc(h,!0):sc(s.stateNode,!1)}catch(v){X(s,s.return,v)}}}else if((a.tag!==22&&a.tag!==23||a.memoizedState===null||a===e)&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===e)break e;for(;a.sibling===null;){if(a.return===null||a.return===e)break e;t===a&&(t=null),a=a.return}t===a&&(t=null),a.sibling.return=a.return,a=a.sibling}l&4&&(l=e.updateQueue,l!==null&&(t=l.retryQueue,t!==null&&(l.retryQueue=null,Mo(e,t))));break;case 19:_e(a,e),Ue(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Mo(e,l)));break;case 30:break;case 21:break;default:_e(a,e),Ue(e)}}function Ue(e){var a=e.flags;if(a&2){try{for(var t,l=e.return;l!==null;){if(cp(l)){t=l;break}l=l.return}if(t==null)throw Error(y(160));switch(t.tag){case 27:var u=t.stateNode,o=Wr(e);mn(e,o,u);break;case 5:var n=t.stateNode;t.flags&32&&(Bl(n,""),t.flags&=-33);var r=Wr(e);mn(e,r,n);break;case 3:case 4:var s=t.stateNode.containerInfo,d=Wr(e);Fs(e,d,s);break;default:throw Error(y(161))}}catch(g){X(e,e.return,g)}e.flags&=-3}a&4096&&(e.flags&=-4097)}function Cp(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var a=e;Cp(a),a.tag===5&&a.flags&1024&&a.stateNode.reset(),e=e.sibling}}function Da(e,a){if(a.subtreeFlags&8772)for(a=a.child;a!==null;)pp(e,a.alternate,a),a=a.sibling}function _t(e){for(e=e.child;e!==null;){var a=e;switch(a.tag){case 0:case 11:case 14:case 15:St(4,a,a.return),_t(a);break;case 1:Ca(a,a.return);var t=a.stateNode;typeof t.componentWillUnmount=="function"&&ip(a,a.return,t),_t(a);break;case 27:Tu(a.stateNode);case 26:case 5:Ca(a,a.return),_t(a);break;case 22:a.memoizedState===null&&_t(a);break;case 30:_t(a);break;default:_t(a)}e=e.sibling}}function Ra(e,a,t){for(t=t&&(a.subtreeFlags&8772)!==0,a=a.child;a!==null;){var l=a.alternate,u=e,o=a,n=o.flags;switch(o.tag){case 0:case 11:case 15:Ra(u,o,t),Ju(4,o);break;case 1:if(Ra(u,o,t),l=o,u=l.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(d){X(l,l.return,d)}if(l=o,u=l.updateQueue,u!==null){var r=l.stateNode;try{var s=u.shared.hiddenCallbacks;if(s!==null)for(u.shared.hiddenCallbacks=null,u=0;u<s.length;u++)xm(s[u],r)}catch(d){X(l,l.return,d)}}t&&n&64&&dp(o),Iu(o,o.return);break;case 27:mp(o);case 26:case 5:Ra(u,o,t),t&&l===null&&n&4&&fp(o),Iu(o,o.return);break;case 12:Ra(u,o,t);break;case 31:Ra(u,o,t),t&&n&4&&xp(u,o);break;case 13:Ra(u,o,t),t&&n&4&&Lp(u,o);break;case 22:o.memoizedState===null&&Ra(u,o,t),Iu(o,o.return);break;case 30:break;default:Ra(u,o,t)}a=a.sibling}}function Hd(e,a){var t=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),e=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(e=a.memoizedState.cachePool.pool),e!==t&&(e!=null&&e.refCount++,t!=null&&Zu(t))}function Fd(e,a){e=null,a.alternate!==null&&(e=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==e&&(a.refCount++,e!=null&&Zu(e))}function ma(e,a,t,l){if(a.subtreeFlags&10256)for(a=a.child;a!==null;)yp(e,a,t,l),a=a.sibling}function yp(e,a,t,l){var u=a.flags;switch(a.tag){case 0:case 11:case 15:ma(e,a,t,l),u&2048&&Ju(9,a);break;case 1:ma(e,a,t,l);break;case 3:ma(e,a,t,l),u&2048&&(e=null,a.alternate!==null&&(e=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==e&&(a.refCount++,e!=null&&Zu(e)));break;case 12:if(u&2048){ma(e,a,t,l),e=a.stateNode;try{var o=a.memoizedProps,n=o.id,r=o.onPostCommit;typeof r=="function"&&r(n,a.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(s){X(a,a.return,s)}}else ma(e,a,t,l);break;case 31:ma(e,a,t,l);break;case 13:ma(e,a,t,l);break;case 23:break;case 22:o=a.stateNode,n=a.alternate,a.memoizedState!==null?o._visibility&2?ma(e,a,t,l):ku(e,a):o._visibility&2?ma(e,a,t,l):(o._visibility|=2,dl(e,a,t,l,(a.subtreeFlags&10256)!==0||!1)),u&2048&&Hd(n,a);break;case 24:ma(e,a,t,l),u&2048&&Fd(a.alternate,a);break;default:ma(e,a,t,l)}}function dl(e,a,t,l,u){for(u=u&&((a.subtreeFlags&10256)!==0||!1),a=a.child;a!==null;){var o=e,n=a,r=t,s=l,d=n.flags;switch(n.tag){case 0:case 11:case 15:dl(o,n,r,s,u),Ju(8,n);break;case 23:break;case 22:var g=n.stateNode;n.memoizedState!==null?g._visibility&2?dl(o,n,r,s,u):ku(o,n):(g._visibility|=2,dl(o,n,r,s,u)),u&&d&2048&&Hd(n.alternate,n);break;case 24:dl(o,n,r,s,u),u&&d&2048&&Fd(n.alternate,n);break;default:dl(o,n,r,s,u)}a=a.sibling}}function ku(e,a){if(a.subtreeFlags&10256)for(a=a.child;a!==null;){var t=e,l=a,u=l.flags;switch(l.tag){case 22:ku(t,l),u&2048&&Hd(l.alternate,l);break;case 24:ku(t,l),u&2048&&Fd(l.alternate,l);break;default:ku(t,l)}a=a.sibling}}var gu=8192;function sl(e,a,t){if(e.subtreeFlags&gu)for(e=e.child;e!==null;)bp(e,a,t),e=e.sibling}function bp(e,a,t){switch(e.tag){case 26:sl(e,a,t),e.flags&gu&&e.memoizedState!==null&&pS(t,pa,e.memoizedState,e.memoizedProps);break;case 5:sl(e,a,t);break;case 3:case 4:var l=pa;pa=yn(e.stateNode.containerInfo),sl(e,a,t),pa=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=gu,gu=16777216,sl(e,a,t),gu=l):sl(e,a,t));break;default:sl(e,a,t)}}function vp(e){var a=e.alternate;if(a!==null&&(e=a.child,e!==null)){a.child=null;do a=e.sibling,e.sibling=null,e=a;while(e!==null)}}function su(e){var a=e.deletions;if((e.flags&16)!==0){if(a!==null)for(var t=0;t<a.length;t++){var l=a[t];Le=l,kp(l,e)}vp(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Ip(e),e=e.sibling}function Ip(e){switch(e.tag){case 0:case 11:case 15:su(e),e.flags&2048&&St(9,e,e.return);break;case 3:su(e);break;case 12:su(e);break;case 22:var a=e.stateNode;e.memoizedState!==null&&a._visibility&2&&(e.return===null||e.return.tag!==13)?(a._visibility&=-3,Xo(e)):su(e);break;default:su(e)}}function Xo(e){var a=e.deletions;if((e.flags&16)!==0){if(a!==null)for(var t=0;t<a.length;t++){var l=a[t];Le=l,kp(l,e)}vp(e)}for(e=e.child;e!==null;){switch(a=e,a.tag){case 0:case 11:case 15:St(8,a,a.return),Xo(a);break;case 22:t=a.stateNode,t._visibility&2&&(t._visibility&=-3,Xo(a));break;default:Xo(a)}e=e.sibling}}function kp(e,a){for(;Le!==null;){var t=Le;switch(t.tag){case 0:case 11:case 15:St(8,t,a);break;case 23:case 22:if(t.memoizedState!==null&&t.memoizedState.cachePool!==null){var l=t.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Zu(t.memoizedState.cache)}if(l=t.child,l!==null)l.return=t,Le=l;else e:for(t=e;Le!==null;){l=Le;var u=l.sibling,o=l.return;if(gp(l),l===t){Le=null;break e}if(u!==null){u.return=o,Le=u;break e}Le=o}}}var RL={getCacheForType:function(e){var a=ke(ce),t=a.data.get(e);return t===void 0&&(t=e(),a.data.set(e,t)),t},cacheSignal:function(){return ke(ce).controller.signal}},BL=typeof WeakMap=="function"?WeakMap:Map,P=0,Y=null,z=null,q=0,V=0,Ge=null,ot=!1,Xl=!1,Pd=!1,Va=0,ue=0,Ct=0,Ft=0,Nd=0,je=0,Ul=0,Au=null,qe=null,Ps=!1,zn=0,Ap=0,pn=1/0,gn=null,ct=null,pe=0,mt=null,zl=null,Ha=0,Ns=0,Gs=null,wp=null,wu=0,Vs=null;function Qe(){return(P&2)!==0&&q!==0?q&-q:R.T!==null?Vd():Uc()}function Tp(){if(je===0)if((q&536870912)===0||H){var e=So;So<<=1,(So&3932160)===0&&(So=262144),je=e}else je=536870912;return e=We.current,e!==null&&(e.flags|=32),je}function He(e,a,t){(e===Y&&(V===2||V===9)||e.cancelPendingCommit!==null)&&(ql(e,0),nt(e,q,je,!1)),ju(e,t),((P&2)===0||e!==Y)&&(e===Y&&((P&2)===0&&(Ft|=t),ue===4&&nt(e,q,je,!1)),va(e))}function Mp(e,a,t){if((P&6)!==0)throw Error(y(327));var l=!t&&(a&127)===0&&(a&e.expiredLanes)===0||Xu(e,a),u=l?_L(e,a):es(e,a,!0),o=l;do{if(u===0){Xl&&!l&&nt(e,a,0,!1);break}else{if(t=e.current.alternate,o&&!EL(t)){u=es(e,a,!1),o=!1;continue}if(u===2){if(o=a,e.errorRecoveryDisabledLanes&o)var n=0;else n=e.pendingLanes&-536870913,n=n!==0?n:n&536870912?536870912:0;if(n!==0){a=n;e:{var r=e;u=Au;var s=r.current.memoizedState.isDehydrated;if(s&&(ql(r,n).flags|=256),n=es(r,n,!1),n!==2){if(Pd&&!s){r.errorRecoveryDisabledLanes|=o,Ft|=o,u=4;break e}o=qe,qe=u,o!==null&&(qe===null?qe=o:qe.push.apply(qe,o))}u=n}if(o=!1,u!==2)continue}}if(u===1){ql(e,0),nt(e,a,0,!0);break}e:{switch(l=e,o=u,o){case 0:case 1:throw Error(y(345));case 4:if((a&4194048)!==a)break;case 6:nt(l,a,je,!ot);break e;case 2:qe=null;break;case 3:case 5:break;default:throw Error(y(329))}if((a&62914560)===a&&(u=zn+300-Ke(),10<u)){if(nt(l,a,je,!ot),An(l,0,!0)!==0)break e;Ha=a,l.timeoutHandle=Zp(Kf.bind(null,l,t,qe,gn,Ps,a,je,Ft,Ul,ot,o,"Throttled",-0,0),u);break e}Kf(l,t,qe,gn,Ps,a,je,Ft,Ul,ot,o,null,-0,0)}}break}while(!0);va(e)}function Kf(e,a,t,l,u,o,n,r,s,d,g,f,c,h){if(e.timeoutHandle=-1,f=a.subtreeFlags,f&8192||(f&16785408)===16785408){f={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:_a},bp(a,o,f);var v=(o&62914560)===o?zn-Ke():(o&4194048)===o?Ap-Ke():0;if(v=gS(f,v),v!==null){Ha=o,e.cancelPendingCommit=v(Zf.bind(null,e,a,o,t,l,u,n,r,s,g,f,null,c,h)),nt(e,o,n,!d);return}}Zf(e,a,o,t,l,u,n,r,s)}function EL(e){for(var a=e;;){var t=a.tag;if((t===0||t===11||t===15)&&a.flags&16384&&(t=a.updateQueue,t!==null&&(t=t.stores,t!==null)))for(var l=0;l<t.length;l++){var u=t[l],o=u.getSnapshot;u=u.value;try{if(!Je(o(),u))return!1}catch{return!1}}if(t=a.child,a.subtreeFlags&16384&&t!==null)t.return=a,a=t;else{if(a===e)break;for(;a.sibling===null;){if(a.return===null||a.return===e)return!0;a=a.return}a.sibling.return=a.return,a=a.sibling}}return!0}function nt(e,a,t,l){a&=~Nd,a&=~Ft,e.suspendedLanes|=a,e.pingedLanes&=~a,l&&(e.warmLanes|=a),l=e.expirationTimes;for(var u=a;0<u;){var o=31-Ze(u),n=1<<o;l[o]=-1,u&=~n}t!==0&&Ec(e,t,a)}function qn(){return(P&6)===0?(Wu(0,!1),!1):!0}function Gd(){if(z!==null){if(V===0)var e=z.return;else e=z,Ua=Qt=null,Td(e),wl=null,_u=0,e=z;for(;e!==null;)sp(e.alternate,e),e=e.return;z=null}}function ql(e,a){var t=e.timeoutHandle;t!==-1&&(e.timeoutHandle=-1,JL(t)),t=e.cancelPendingCommit,t!==null&&(e.cancelPendingCommit=null,t()),Ha=0,Gd(),Y=e,z=t=za(e.current,null),q=a,V=0,Ge=null,ot=!1,Xl=Xu(e,a),Pd=!1,Ul=je=Nd=Ft=Ct=ue=0,qe=Au=null,Ps=!1,(a&8)!==0&&(a|=a&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=a;0<l;){var u=31-Ze(l),o=1<<u;a|=e[u],l&=~o}return Va=a,Dn(),t}function Dp(e,a){O=null,R.H=zu,a===Vl||a===Bn?(a=kf(),V=3):a===yd?(a=kf(),V=4):V=a===zd?8:a!==null&&typeof a=="object"&&typeof a.then=="function"?6:1,Ge=a,z===null&&(ue=1,fn(e,na(a,e.current)))}function Rp(){var e=We.current;return e===null?!0:(q&4194048)===q?sa===null:(q&62914560)===q||(q&536870912)!==0?e===sa:!1}function Bp(){var e=R.H;return R.H=zu,e===null?zu:e}function Ep(){var e=R.A;return R.A=RL,e}function hn(){ue=4,ot||(q&4194048)!==q&&We.current!==null||(Xl=!0),(Ct&134217727)===0&&(Ft&134217727)===0||Y===null||nt(Y,q,je,!1)}function es(e,a,t){var l=P;P|=2;var u=Bp(),o=Ep();(Y!==e||q!==a)&&(gn=null,ql(e,a)),a=!1;var n=ue;e:do try{if(V!==0&&z!==null){var r=z,s=Ge;switch(V){case 8:Gd(),n=6;break e;case 3:case 2:case 9:case 6:We.current===null&&(a=!0);var d=V;if(V=0,Ge=null,bl(e,r,s,d),t&&Xl){n=0;break e}break;default:d=V,V=0,Ge=null,bl(e,r,s,d)}}OL(),n=ue;break}catch(g){Dp(e,g)}while(!0);return a&&e.shellSuspendCounter++,Ua=Qt=null,P=l,R.H=u,R.A=o,z===null&&(Y=null,q=0,Dn()),n}function OL(){for(;z!==null;)Op(z)}function _L(e,a){var t=P;P|=2;var l=Bp(),u=Ep();Y!==e||q!==a?(gn=null,pn=Ke()+500,ql(e,a)):Xl=Xu(e,a);e:do try{if(V!==0&&z!==null){a=z;var o=Ge;a:switch(V){case 1:V=0,Ge=null,bl(e,a,o,1);break;case 2:case 9:if(If(o)){V=0,Ge=null,Yf(a);break}a=function(){V!==2&&V!==9||Y!==e||(V=7),va(e)},o.then(a,a);break e;case 3:V=7;break e;case 4:V=5;break e;case 7:If(o)?(V=0,Ge=null,Yf(a)):(V=0,Ge=null,bl(e,a,o,7));break;case 5:var n=null;switch(z.tag){case 26:n=z.memoizedState;case 5:case 27:var r=z;if(n?eg(n):r.stateNode.complete){V=0,Ge=null;var s=r.sibling;if(s!==null)z=s;else{var d=r.return;d!==null?(z=d,Hn(d)):z=null}break a}}V=0,Ge=null,bl(e,a,o,5);break;case 6:V=0,Ge=null,bl(e,a,o,6);break;case 8:Gd(),ue=6;break e;default:throw Error(y(462))}}UL();break}catch(g){Dp(e,g)}while(!0);return Ua=Qt=null,R.H=l,R.A=u,P=t,z!==null?0:(Y=null,q=0,Dn(),ue)}function UL(){for(;z!==null&&!ox();)Op(z)}function Op(e){var a=rp(e.alternate,e,Va);e.memoizedProps=e.pendingProps,a===null?Hn(e):z=a}function Yf(e){var a=e,t=a.alternate;switch(a.tag){case 15:case 0:a=Pf(t,a,a.pendingProps,a.type,void 0,q);break;case 11:a=Pf(t,a,a.pendingProps,a.type.render,a.ref,q);break;case 5:Td(a);default:sp(t,a),a=z=sm(a,Va),a=rp(t,a,Va)}e.memoizedProps=e.pendingProps,a===null?Hn(e):z=a}function bl(e,a,t,l){Ua=Qt=null,Td(a),wl=null,_u=0;var u=a.return;try{if(IL(e,u,a,t,q)){ue=1,fn(e,na(t,e.current)),z=null;return}}catch(o){if(u!==null)throw z=u,o;ue=1,fn(e,na(t,e.current)),z=null;return}a.flags&32768?(H||l===1?e=!0:Xl||(q&536870912)!==0?e=!1:(ot=e=!0,(l===2||l===9||l===3||l===6)&&(l=We.current,l!==null&&l.tag===13&&(l.flags|=16384))),_p(a,e)):Hn(a)}function Hn(e){var a=e;do{if((a.flags&32768)!==0){_p(a,ot);return}e=a.return;var t=wL(a.alternate,a,Va);if(t!==null){z=t;return}if(a=a.sibling,a!==null){z=a;return}z=a=e}while(a!==null);ue===0&&(ue=5)}function _p(e,a){do{var t=TL(e.alternate,e);if(t!==null){t.flags&=32767,z=t;return}if(t=e.return,t!==null&&(t.flags|=32768,t.subtreeFlags=0,t.deletions=null),!a&&(e=e.sibling,e!==null)){z=e;return}z=e=t}while(e!==null);ue=6,z=null}function Zf(e,a,t,l,u,o,n,r,s){e.cancelPendingCommit=null;do Fn();while(pe!==0);if((P&6)!==0)throw Error(y(327));if(a!==null){if(a===e.current)throw Error(y(177));if(o=a.lanes|a.childLanes,o|=pd,gx(e,t,o,n,r,s),e===Y&&(z=Y=null,q=0),zl=a,mt=e,Ha=t,Ns=o,Gs=u,wp=l,(a.subtreeFlags&10256)!==0||(a.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,FL($o,function(){return Fp(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(a.flags&13878)!==0,(a.subtreeFlags&13878)!==0||l){l=R.T,R.T=null,u=N.p,N.p=2,n=P,P|=4;try{ML(e,a,t)}finally{P=n,N.p=u,R.T=l}}pe=1,Up(),zp(),qp()}}function Up(){if(pe===1){pe=0;var e=mt,a=zl,t=(a.flags&13878)!==0;if((a.subtreeFlags&13878)!==0||t){t=R.T,R.T=null;var l=N.p;N.p=2;var u=P;P|=4;try{Sp(a,e);var o=Ys,n=em(e.containerInfo),r=o.focusedElem,s=o.selectionRange;if(n!==r&&r&&r.ownerDocument&&$c(r.ownerDocument.documentElement,r)){if(s!==null&&md(r)){var d=s.start,g=s.end;if(g===void 0&&(g=d),"selectionStart"in r)r.selectionStart=d,r.selectionEnd=Math.min(g,r.value.length);else{var f=r.ownerDocument||document,c=f&&f.defaultView||window;if(c.getSelection){var h=c.getSelection(),v=r.textContent.length,b=Math.min(s.start,v),T=s.end===void 0?b:Math.min(s.end,v);!h.extend&&b>T&&(n=T,T=b,b=n);var m=xf(r,b),i=xf(r,T);if(m&&i&&(h.rangeCount!==1||h.anchorNode!==m.node||h.anchorOffset!==m.offset||h.focusNode!==i.node||h.focusOffset!==i.offset)){var x=f.createRange();x.setStart(m.node,m.offset),h.removeAllRanges(),b>T?(h.addRange(x),h.extend(i.node,i.offset)):(x.setEnd(i.node,i.offset),h.addRange(x))}}}}for(f=[],h=r;h=h.parentNode;)h.nodeType===1&&f.push({element:h,left:h.scrollLeft,top:h.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<f.length;r++){var S=f[r];S.element.scrollLeft=S.left,S.element.scrollTop=S.top}}In=!!Ks,Ys=Ks=null}finally{P=u,N.p=l,R.T=t}}e.current=a,pe=2}}function zp(){if(pe===2){pe=0;var e=mt,a=zl,t=(a.flags&8772)!==0;if((a.subtreeFlags&8772)!==0||t){t=R.T,R.T=null;var l=N.p;N.p=2;var u=P;P|=4;try{pp(e,a.alternate,a)}finally{P=u,N.p=l,R.T=t}}pe=3}}function qp(){if(pe===4||pe===3){pe=0,nx();var e=mt,a=zl,t=Ha,l=wp;(a.subtreeFlags&10256)!==0||(a.flags&10256)!==0?pe=5:(pe=0,zl=mt=null,Hp(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(ct=null),nd(t),a=a.stateNode,Ye&&typeof Ye.onCommitFiberRoot=="function")try{Ye.onCommitFiberRoot(Vu,a,void 0,(a.current.flags&128)===128)}catch{}if(l!==null){a=R.T,u=N.p,N.p=2,R.T=null;try{for(var o=e.onRecoverableError,n=0;n<l.length;n++){var r=l[n];o(r.value,{componentStack:r.stack})}}finally{R.T=a,N.p=u}}(Ha&3)!==0&&Fn(),va(e),u=e.pendingLanes,(t&261930)!==0&&(u&42)!==0?e===Vs?wu++:(wu=0,Vs=e):wu=0,Wu(0,!1)}}function Hp(e,a){(e.pooledCacheLanes&=a)===0&&(a=e.pooledCache,a!=null&&(e.pooledCache=null,Zu(a)))}function Fn(){return Up(),zp(),qp(),Fp()}function Fp(){if(pe!==5)return!1;var e=mt,a=Ns;Ns=0;var t=nd(Ha),l=R.T,u=N.p;try{N.p=32>t?32:t,R.T=null,t=Gs,Gs=null;var o=mt,n=Ha;if(pe=0,zl=mt=null,Ha=0,(P&6)!==0)throw Error(y(331));var r=P;if(P|=4,Ip(o.current),yp(o,o.current,n,t),P=r,Wu(0,!1),Ye&&typeof Ye.onPostCommitFiberRoot=="function")try{Ye.onPostCommitFiberRoot(Vu,o)}catch{}return!0}finally{N.p=u,R.T=l,Hp(e,a)}}function Qf(e,a,t){a=na(t,a),a=zs(e.stateNode,a,2),e=ft(e,a,2),e!==null&&(ju(e,2),va(e))}function X(e,a,t){if(e.tag===3)Qf(e,e,t);else for(;a!==null;){if(a.tag===3){Qf(a,e,t);break}else if(a.tag===1){var l=a.stateNode;if(typeof a.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(ct===null||!ct.has(l))){e=na(t,e),t=ap(2),l=ft(a,t,2),l!==null&&(tp(t,l,a,e),ju(l,2),va(l));break}}a=a.return}}function as(e,a,t){var l=e.pingCache;if(l===null){l=e.pingCache=new BL;var u=new Set;l.set(a,u)}else u=l.get(a),u===void 0&&(u=new Set,l.set(a,u));u.has(t)||(Pd=!0,u.add(t),e=zL.bind(null,e,a,t),a.then(e,e))}function zL(e,a,t){var l=e.pingCache;l!==null&&l.delete(a),e.pingedLanes|=e.suspendedLanes&t,e.warmLanes&=~t,Y===e&&(q&t)===t&&(ue===4||ue===3&&(q&62914560)===q&&300>Ke()-zn?(P&2)===0&&ql(e,0):Nd|=t,Ul===q&&(Ul=0)),va(e)}function Pp(e,a){a===0&&(a=Bc()),e=Zt(e,a),e!==null&&(ju(e,a),va(e))}function qL(e){var a=e.memoizedState,t=0;a!==null&&(t=a.retryLane),Pp(e,t)}function HL(e,a){var t=0;switch(e.tag){case 31:case 13:var l=e.stateNode,u=e.memoizedState;u!==null&&(t=u.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(y(314))}l!==null&&l.delete(a),Pp(e,t)}function FL(e,a){return ud(e,a)}var xn=null,il=null,Xs=!1,Ln=!1,ts=!1,rt=0;function va(e){e!==il&&e.next===null&&(il===null?xn=il=e:il=il.next=e),Ln=!0,Xs||(Xs=!0,NL())}function Wu(e,a){if(!ts&&Ln){ts=!0;do for(var t=!1,l=xn;l!==null;){if(!a)if(e!==0){var u=l.pendingLanes;if(u===0)var o=0;else{var n=l.suspendedLanes,r=l.pingedLanes;o=(1<<31-Ze(42|e)+1)-1,o&=u&~(n&~r),o=o&201326741?o&201326741|1:o?o|2:0}o!==0&&(t=!0,Jf(l,o))}else o=q,o=An(l,l===Y?o:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(o&3)===0||Xu(l,o)||(t=!0,Jf(l,o));l=l.next}while(t);ts=!1}}function PL(){Np()}function Np(){Ln=Xs=!1;var e=0;rt!==0&&QL()&&(e=rt);for(var a=Ke(),t=null,l=xn;l!==null;){var u=l.next,o=Gp(l,a);o===0?(l.next=null,t===null?xn=u:t.next=u,u===null&&(il=t)):(t=l,(e!==0||(o&3)!==0)&&(Ln=!0)),l=u}pe!==0&&pe!==5||Wu(e,!1),rt!==0&&(rt=0)}function Gp(e,a){for(var t=e.suspendedLanes,l=e.pingedLanes,u=e.expirationTimes,o=e.pendingLanes&-62914561;0<o;){var n=31-Ze(o),r=1<<n,s=u[n];s===-1?((r&t)===0||(r&l)!==0)&&(u[n]=px(r,a)):s<=a&&(e.expiredLanes|=r),o&=~r}if(a=Y,t=q,t=An(e,e===a?t:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,t===0||e===a&&(V===2||V===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&Rr(l),e.callbackNode=null,e.callbackPriority=0;if((t&3)===0||Xu(e,t)){if(a=t&-t,a===e.callbackPriority)return a;switch(l!==null&&Rr(l),nd(t)){case 2:case 8:t=Dc;break;case 32:t=$o;break;case 268435456:t=Rc;break;default:t=$o}return l=Vp.bind(null,e),t=ud(t,l),e.callbackPriority=a,e.callbackNode=t,a}return l!==null&&l!==null&&Rr(l),e.callbackPriority=2,e.callbackNode=null,2}function Vp(e,a){if(pe!==0&&pe!==5)return e.callbackNode=null,e.callbackPriority=0,null;var t=e.callbackNode;if(Fn()&&e.callbackNode!==t)return null;var l=q;return l=An(e,e===Y?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(Mp(e,l,a),Gp(e,Ke()),e.callbackNode!=null&&e.callbackNode===t?Vp.bind(null,e):null)}function Jf(e,a){if(Fn())return null;Mp(e,a,!0)}function NL(){WL(function(){(P&6)!==0?ud(Mc,PL):Np()})}function Vd(){if(rt===0){var e=El;e===0&&(e=Lo,Lo<<=1,(Lo&261888)===0&&(Lo=256)),rt=e}return rt}function Wf(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Uo(""+e)}function $f(e,a){var t=a.ownerDocument.createElement("input");return t.name=a.name,t.value=a.value,e.id&&t.setAttribute("form",e.id),a.parentNode.insertBefore(t,a),e=new FormData(e),t.parentNode.removeChild(t),e}function GL(e,a,t,l,u){if(a==="submit"&&t&&t.stateNode===u){var o=Wf((u[Fe]||null).action),n=l.submitter;n&&(a=(a=n[Fe]||null)?Wf(a.formAction):n.getAttribute("formAction"),a!==null&&(o=a,n=null));var r=new wn("action","action",null,l,u);e.push({event:r,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(rt!==0){var s=n?$f(u,n):new FormData(u);_s(t,{pending:!0,data:s,method:u.method,action:o},null,s)}}else typeof o=="function"&&(r.preventDefault(),s=n?$f(u,n):new FormData(u),_s(t,{pending:!0,data:s,method:u.method,action:o},o,s))},currentTarget:u}]})}}for(Do=0;Do<vs.length;Do++)Ro=vs[Do],ec=Ro.toLowerCase(),ac=Ro[0].toUpperCase()+Ro.slice(1),ga(ec,"on"+ac);var Ro,ec,ac,Do;ga(tm,"onAnimationEnd");ga(lm,"onAnimationIteration");ga(um,"onAnimationStart");ga("dblclick","onDoubleClick");ga("focusin","onFocus");ga("focusout","onBlur");ga(rL,"onTransitionRun");ga(sL,"onTransitionStart");ga(dL,"onTransitionCancel");ga(om,"onTransitionEnd");Rl("onMouseEnter",["mouseout","mouseover"]);Rl("onMouseLeave",["mouseout","mouseover"]);Rl("onPointerEnter",["pointerout","pointerover"]);Rl("onPointerLeave",["pointerout","pointerover"]);jt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));jt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));jt("onBeforeInput",["compositionend","keypress","textInput","paste"]);jt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));jt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));jt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var qu="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),VL=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(qu));function Xp(e,a){a=(a&4)!==0;for(var t=0;t<e.length;t++){var l=e[t],u=l.event;l=l.listeners;e:{var o=void 0;if(a)for(var n=l.length-1;0<=n;n--){var r=l[n],s=r.instance,d=r.currentTarget;if(r=r.listener,s!==o&&u.isPropagationStopped())break e;o=r,u.currentTarget=d;try{o(u)}catch(g){an(g)}u.currentTarget=null,o=s}else for(n=0;n<l.length;n++){if(r=l[n],s=r.instance,d=r.currentTarget,r=r.listener,s!==o&&u.isPropagationStopped())break e;o=r,u.currentTarget=d;try{o(u)}catch(g){an(g)}u.currentTarget=null,o=s}}}}function U(e,a){var t=a[gs];t===void 0&&(t=a[gs]=new Set);var l=e+"__bubble";t.has(l)||(jp(a,e,2,!1),t.add(l))}function ls(e,a,t){var l=0;a&&(l|=4),jp(t,e,l,a)}var Bo="_reactListening"+Math.random().toString(36).slice(2);function Xd(e){if(!e[Bo]){e[Bo]=!0,zc.forEach(function(t){t!=="selectionchange"&&(VL.has(t)||ls(t,!1,e),ls(t,!0,e))});var a=e.nodeType===9?e:e.ownerDocument;a===null||a[Bo]||(a[Bo]=!0,ls("selectionchange",!1,a))}}function jp(e,a,t,l){switch(og(a)){case 2:var u=LS;break;case 8:u=SS;break;default:u=Zd}t=u.bind(null,a,t,e),u=void 0,!Cs||a!=="touchstart"&&a!=="touchmove"&&a!=="wheel"||(u=!0),l?u!==void 0?e.addEventListener(a,t,{capture:!0,passive:u}):e.addEventListener(a,t,!0):u!==void 0?e.addEventListener(a,t,{passive:u}):e.addEventListener(a,t,!1)}function us(e,a,t,l,u){var o=l;if((a&1)===0&&(a&2)===0&&l!==null)e:for(;;){if(l===null)return;var n=l.tag;if(n===3||n===4){var r=l.stateNode.containerInfo;if(r===u)break;if(n===4)for(n=l.return;n!==null;){var s=n.tag;if((s===3||s===4)&&n.stateNode.containerInfo===u)return;n=n.return}for(;r!==null;){if(n=ml(r),n===null)return;if(s=n.tag,s===5||s===6||s===26||s===27){l=o=n;continue e}r=r.parentNode}}l=l.return}Xc(function(){var d=o,g=dd(t),f=[];e:{var c=nm.get(e);if(c!==void 0){var h=wn,v=e;switch(e){case"keypress":if(qo(t)===0)break e;case"keydown":case"keyup":h=Hx;break;case"focusin":v="focus",h=Ur;break;case"focusout":v="blur",h=Ur;break;case"beforeblur":case"afterblur":h=Ur;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":h=rf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":h=wx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":h=Nx;break;case tm:case lm:case um:h=Dx;break;case om:h=Vx;break;case"scroll":case"scrollend":h=kx;break;case"wheel":h=jx;break;case"copy":case"cut":case"paste":h=Bx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":h=df;break;case"toggle":case"beforetoggle":h=Yx}var b=(a&4)!==0,T=!b&&(e==="scroll"||e==="scrollend"),m=b?c!==null?c+"Capture":null:c;b=[];for(var i=d,x;i!==null;){var S=i;if(x=S.stateNode,S=S.tag,S!==5&&S!==26&&S!==27||x===null||m===null||(S=Du(i,m),S!=null&&b.push(Hu(i,S,x))),T)break;i=i.return}0<b.length&&(c=new h(c,v,null,t,g),f.push({event:c,listeners:b}))}}if((a&7)===0){e:{if(c=e==="mouseover"||e==="pointerover",h=e==="mouseout"||e==="pointerout",c&&t!==Ss&&(v=t.relatedTarget||t.fromElement)&&(ml(v)||v[Pl]))break e;if((h||c)&&(c=g.window===g?g:(c=g.ownerDocument)?c.defaultView||c.parentWindow:window,h?(v=t.relatedTarget||t.toElement,h=d,v=v?ml(v):null,v!==null&&(T=Gu(v),b=v.tag,v!==T||b!==5&&b!==27&&b!==6)&&(v=null)):(h=null,v=d),h!==v)){if(b=rf,S="onMouseLeave",m="onMouseEnter",i="mouse",(e==="pointerout"||e==="pointerover")&&(b=df,S="onPointerLeave",m="onPointerEnter",i="pointer"),T=h==null?c:mu(h),x=v==null?c:mu(v),c=new b(S,i+"leave",h,t,g),c.target=T,c.relatedTarget=x,S=null,ml(g)===d&&(b=new b(m,i+"enter",v,t,g),b.target=x,b.relatedTarget=T,S=b),T=S,h&&v)a:{for(b=XL,m=h,i=v,x=0,S=m;S;S=b(S))x++;S=0;for(var k=i;k;k=b(k))S++;for(;0<x-S;)m=b(m),x--;for(;0<S-x;)i=b(i),S--;for(;x--;){if(m===i||i!==null&&m===i.alternate){b=m;break a}m=b(m),i=b(i)}b=null}else b=null;h!==null&&tc(f,c,h,b,!1),v!==null&&T!==null&&tc(f,T,v,b,!0)}}e:{if(c=d?mu(d):window,h=c.nodeName&&c.nodeName.toLowerCase(),h==="select"||h==="input"&&c.type==="file")var D=pf;else if(mf(c))if(Jc)D=uL;else{D=tL;var p=aL}else h=c.nodeName,!h||h.toLowerCase()!=="input"||c.type!=="checkbox"&&c.type!=="radio"?d&&sd(d.elementType)&&(D=pf):D=lL;if(D&&(D=D(e,d))){Qc(f,D,t,g);break e}p&&p(e,c,d),e==="focusout"&&d&&c.type==="number"&&d.memoizedProps.value!=null&&Ls(c,"number",c.value)}switch(p=d?mu(d):window,e){case"focusin":(mf(p)||p.contentEditable==="true")&&(hl=p,ys=d,Lu=null);break;case"focusout":Lu=ys=hl=null;break;case"mousedown":bs=!0;break;case"contextmenu":case"mouseup":case"dragend":bs=!1,Lf(f,t,g);break;case"selectionchange":if(nL)break;case"keydown":case"keyup":Lf(f,t,g)}var C;if(cd)e:{switch(e){case"compositionstart":var I="onCompositionStart";break e;case"compositionend":I="onCompositionEnd";break e;case"compositionupdate":I="onCompositionUpdate";break e}I=void 0}else gl?Yc(e,t)&&(I="onCompositionEnd"):e==="keydown"&&t.keyCode===229&&(I="onCompositionStart");I&&(Kc&&t.locale!=="ko"&&(gl||I!=="onCompositionStart"?I==="onCompositionEnd"&&gl&&(C=jc()):(ut=g,id="value"in ut?ut.value:ut.textContent,gl=!0)),p=Sn(d,I),0<p.length&&(I=new sf(I,e,null,t,g),f.push({event:I,listeners:p}),C?I.data=C:(C=Zc(t),C!==null&&(I.data=C)))),(C=Qx?Jx(e,t):Wx(e,t))&&(I=Sn(d,"onBeforeInput"),0<I.length&&(p=new sf("onBeforeInput","beforeinput",null,t,g),f.push({event:p,listeners:I}),p.data=C)),GL(f,e,d,t,g)}Xp(f,a)})}function Hu(e,a,t){return{instance:e,listener:a,currentTarget:t}}function Sn(e,a){for(var t=a+"Capture",l=[];e!==null;){var u=e,o=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||o===null||(u=Du(e,t),u!=null&&l.unshift(Hu(e,u,o)),u=Du(e,a),u!=null&&l.push(Hu(e,u,o))),e.tag===3)return l;e=e.return}return[]}function XL(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function tc(e,a,t,l,u){for(var o=a._reactName,n=[];t!==null&&t!==l;){var r=t,s=r.alternate,d=r.stateNode;if(r=r.tag,s!==null&&s===l)break;r!==5&&r!==26&&r!==27||d===null||(s=d,u?(d=Du(t,o),d!=null&&n.unshift(Hu(t,d,s))):u||(d=Du(t,o),d!=null&&n.push(Hu(t,d,s)))),t=t.return}n.length!==0&&e.push({event:a,listeners:n})}var jL=/\r\n?/g,KL=/\u0000|\uFFFD/g;function lc(e){return(typeof e=="string"?e:""+e).replace(jL,`
`).replace(KL,"")}function Kp(e,a){return a=lc(a),lc(e)===a}function j(e,a,t,l,u,o){switch(t){case"children":typeof l=="string"?a==="body"||a==="textarea"&&l===""||Bl(e,l):(typeof l=="number"||typeof l=="bigint")&&a!=="body"&&Bl(e,""+l);break;case"className":yo(e,"class",l);break;case"tabIndex":yo(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":yo(e,t,l);break;case"style":Vc(e,l,o);break;case"data":if(a!=="object"){yo(e,"data",l);break}case"src":case"href":if(l===""&&(a!=="a"||t!=="href")){e.removeAttribute(t);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(t);break}l=Uo(""+l),e.setAttribute(t,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(t,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof o=="function"&&(t==="formAction"?(a!=="input"&&j(e,a,"name",u.name,u,null),j(e,a,"formEncType",u.formEncType,u,null),j(e,a,"formMethod",u.formMethod,u,null),j(e,a,"formTarget",u.formTarget,u,null)):(j(e,a,"encType",u.encType,u,null),j(e,a,"method",u.method,u,null),j(e,a,"target",u.target,u,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(t);break}l=Uo(""+l),e.setAttribute(t,l);break;case"onClick":l!=null&&(e.onclick=_a);break;case"onScroll":l!=null&&U("scroll",e);break;case"onScrollEnd":l!=null&&U("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(y(61));if(t=l.__html,t!=null){if(u.children!=null)throw Error(y(60));e.innerHTML=t}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}t=Uo(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",t);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(t,""+l):e.removeAttribute(t);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(t,""):e.removeAttribute(t);break;case"capture":case"download":l===!0?e.setAttribute(t,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(t,l):e.removeAttribute(t);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(t,l):e.removeAttribute(t);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(t):e.setAttribute(t,l);break;case"popover":U("beforetoggle",e),U("toggle",e),_o(e,"popover",l);break;case"xlinkActuate":wa(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":wa(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":wa(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":wa(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":wa(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":wa(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":wa(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":wa(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":wa(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":_o(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(t=vx.get(t)||t,_o(e,t,l))}}function js(e,a,t,l,u,o){switch(t){case"style":Vc(e,l,o);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(y(61));if(t=l.__html,t!=null){if(u.children!=null)throw Error(y(60));e.innerHTML=t}}break;case"children":typeof l=="string"?Bl(e,l):(typeof l=="number"||typeof l=="bigint")&&Bl(e,""+l);break;case"onScroll":l!=null&&U("scroll",e);break;case"onScrollEnd":l!=null&&U("scrollend",e);break;case"onClick":l!=null&&(e.onclick=_a);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!qc.hasOwnProperty(t))e:{if(t[0]==="o"&&t[1]==="n"&&(u=t.endsWith("Capture"),a=t.slice(2,u?t.length-7:void 0),o=e[Fe]||null,o=o!=null?o[t]:null,typeof o=="function"&&e.removeEventListener(a,o,u),typeof l=="function")){typeof o!="function"&&o!==null&&(t in e?e[t]=null:e.hasAttribute(t)&&e.removeAttribute(t)),e.addEventListener(a,l,u);break e}t in e?e[t]=l:l===!0?e.setAttribute(t,""):_o(e,t,l)}}}function Ae(e,a,t){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":U("error",e),U("load",e);var l=!1,u=!1,o;for(o in t)if(t.hasOwnProperty(o)){var n=t[o];if(n!=null)switch(o){case"src":l=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(y(137,a));default:j(e,a,o,n,t,null)}}u&&j(e,a,"srcSet",t.srcSet,t,null),l&&j(e,a,"src",t.src,t,null);return;case"input":U("invalid",e);var r=o=n=u=null,s=null,d=null;for(l in t)if(t.hasOwnProperty(l)){var g=t[l];if(g!=null)switch(l){case"name":u=g;break;case"type":n=g;break;case"checked":s=g;break;case"defaultChecked":d=g;break;case"value":o=g;break;case"defaultValue":r=g;break;case"children":case"dangerouslySetInnerHTML":if(g!=null)throw Error(y(137,a));break;default:j(e,a,l,g,t,null)}}Pc(e,o,r,s,d,n,u,!1);return;case"select":U("invalid",e),l=n=o=null;for(u in t)if(t.hasOwnProperty(u)&&(r=t[u],r!=null))switch(u){case"value":o=r;break;case"defaultValue":n=r;break;case"multiple":l=r;default:j(e,a,u,r,t,null)}a=o,t=n,e.multiple=!!l,a!=null?Il(e,!!l,a,!1):t!=null&&Il(e,!!l,t,!0);return;case"textarea":U("invalid",e),o=u=l=null;for(n in t)if(t.hasOwnProperty(n)&&(r=t[n],r!=null))switch(n){case"value":l=r;break;case"defaultValue":u=r;break;case"children":o=r;break;case"dangerouslySetInnerHTML":if(r!=null)throw Error(y(91));break;default:j(e,a,n,r,t,null)}Gc(e,l,u,o);return;case"option":for(s in t)t.hasOwnProperty(s)&&(l=t[s],l!=null)&&(s==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":j(e,a,s,l,t,null));return;case"dialog":U("beforetoggle",e),U("toggle",e),U("cancel",e),U("close",e);break;case"iframe":case"object":U("load",e);break;case"video":case"audio":for(l=0;l<qu.length;l++)U(qu[l],e);break;case"image":U("error",e),U("load",e);break;case"details":U("toggle",e);break;case"embed":case"source":case"link":U("error",e),U("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(d in t)if(t.hasOwnProperty(d)&&(l=t[d],l!=null))switch(d){case"children":case"dangerouslySetInnerHTML":throw Error(y(137,a));default:j(e,a,d,l,t,null)}return;default:if(sd(a)){for(g in t)t.hasOwnProperty(g)&&(l=t[g],l!==void 0&&js(e,a,g,l,t,void 0));return}}for(r in t)t.hasOwnProperty(r)&&(l=t[r],l!=null&&j(e,a,r,l,t,null))}function YL(e,a,t,l){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,o=null,n=null,r=null,s=null,d=null,g=null;for(h in t){var f=t[h];if(t.hasOwnProperty(h)&&f!=null)switch(h){case"checked":break;case"value":break;case"defaultValue":s=f;default:l.hasOwnProperty(h)||j(e,a,h,null,l,f)}}for(var c in l){var h=l[c];if(f=t[c],l.hasOwnProperty(c)&&(h!=null||f!=null))switch(c){case"type":o=h;break;case"name":u=h;break;case"checked":d=h;break;case"defaultChecked":g=h;break;case"value":n=h;break;case"defaultValue":r=h;break;case"children":case"dangerouslySetInnerHTML":if(h!=null)throw Error(y(137,a));break;default:h!==f&&j(e,a,c,h,l,f)}}xs(e,n,r,s,d,g,o,u);return;case"select":h=n=r=c=null;for(o in t)if(s=t[o],t.hasOwnProperty(o)&&s!=null)switch(o){case"value":break;case"multiple":h=s;default:l.hasOwnProperty(o)||j(e,a,o,null,l,s)}for(u in l)if(o=l[u],s=t[u],l.hasOwnProperty(u)&&(o!=null||s!=null))switch(u){case"value":c=o;break;case"defaultValue":r=o;break;case"multiple":n=o;default:o!==s&&j(e,a,u,o,l,s)}a=r,t=n,l=h,c!=null?Il(e,!!t,c,!1):!!l!=!!t&&(a!=null?Il(e,!!t,a,!0):Il(e,!!t,t?[]:"",!1));return;case"textarea":h=c=null;for(r in t)if(u=t[r],t.hasOwnProperty(r)&&u!=null&&!l.hasOwnProperty(r))switch(r){case"value":break;case"children":break;default:j(e,a,r,null,l,u)}for(n in l)if(u=l[n],o=t[n],l.hasOwnProperty(n)&&(u!=null||o!=null))switch(n){case"value":c=u;break;case"defaultValue":h=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(y(91));break;default:u!==o&&j(e,a,n,u,l,o)}Nc(e,c,h);return;case"option":for(var v in t)c=t[v],t.hasOwnProperty(v)&&c!=null&&!l.hasOwnProperty(v)&&(v==="selected"?e.selected=!1:j(e,a,v,null,l,c));for(s in l)c=l[s],h=t[s],l.hasOwnProperty(s)&&c!==h&&(c!=null||h!=null)&&(s==="selected"?e.selected=c&&typeof c!="function"&&typeof c!="symbol":j(e,a,s,c,l,h));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var b in t)c=t[b],t.hasOwnProperty(b)&&c!=null&&!l.hasOwnProperty(b)&&j(e,a,b,null,l,c);for(d in l)if(c=l[d],h=t[d],l.hasOwnProperty(d)&&c!==h&&(c!=null||h!=null))switch(d){case"children":case"dangerouslySetInnerHTML":if(c!=null)throw Error(y(137,a));break;default:j(e,a,d,c,l,h)}return;default:if(sd(a)){for(var T in t)c=t[T],t.hasOwnProperty(T)&&c!==void 0&&!l.hasOwnProperty(T)&&js(e,a,T,void 0,l,c);for(g in l)c=l[g],h=t[g],!l.hasOwnProperty(g)||c===h||c===void 0&&h===void 0||js(e,a,g,c,l,h);return}}for(var m in t)c=t[m],t.hasOwnProperty(m)&&c!=null&&!l.hasOwnProperty(m)&&j(e,a,m,null,l,c);for(f in l)c=l[f],h=t[f],!l.hasOwnProperty(f)||c===h||c==null&&h==null||j(e,a,f,c,l,h)}function uc(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function ZL(){if(typeof performance.getEntriesByType=="function"){for(var e=0,a=0,t=performance.getEntriesByType("resource"),l=0;l<t.length;l++){var u=t[l],o=u.transferSize,n=u.initiatorType,r=u.duration;if(o&&r&&uc(n)){for(n=0,r=u.responseEnd,l+=1;l<t.length;l++){var s=t[l],d=s.startTime;if(d>r)break;var g=s.transferSize,f=s.initiatorType;g&&uc(f)&&(s=s.responseEnd,n+=g*(s<r?1:(r-d)/(s-d)))}if(--l,a+=8*(o+n)/(u.duration/1e3),e++,10<e)break}}if(0<e)return a/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Ks=null,Ys=null;function Cn(e){return e.nodeType===9?e:e.ownerDocument}function oc(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Yp(e,a){if(e===0)switch(a){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&a==="foreignObject"?0:e}function Zs(e,a){return e==="textarea"||e==="noscript"||typeof a.children=="string"||typeof a.children=="number"||typeof a.children=="bigint"||typeof a.dangerouslySetInnerHTML=="object"&&a.dangerouslySetInnerHTML!==null&&a.dangerouslySetInnerHTML.__html!=null}var os=null;function QL(){var e=window.event;return e&&e.type==="popstate"?e===os?!1:(os=e,!0):(os=null,!1)}var Zp=typeof setTimeout=="function"?setTimeout:void 0,JL=typeof clearTimeout=="function"?clearTimeout:void 0,nc=typeof Promise=="function"?Promise:void 0,WL=typeof queueMicrotask=="function"?queueMicrotask:typeof nc<"u"?function(e){return nc.resolve(null).then(e).catch($L)}:Zp;function $L(e){setTimeout(function(){throw e})}function bt(e){return e==="head"}function rc(e,a){var t=a,l=0;do{var u=t.nextSibling;if(e.removeChild(t),u&&u.nodeType===8)if(t=u.data,t==="/$"||t==="/&"){if(l===0){e.removeChild(u),Fl(a);return}l--}else if(t==="$"||t==="$?"||t==="$~"||t==="$!"||t==="&")l++;else if(t==="html")Tu(e.ownerDocument.documentElement);else if(t==="head"){t=e.ownerDocument.head,Tu(t);for(var o=t.firstChild;o;){var n=o.nextSibling,r=o.nodeName;o[Ku]||r==="SCRIPT"||r==="STYLE"||r==="LINK"&&o.rel.toLowerCase()==="stylesheet"||t.removeChild(o),o=n}}else t==="body"&&Tu(e.ownerDocument.body);t=u}while(t);Fl(a)}function sc(e,a){var t=e;e=0;do{var l=t.nextSibling;if(t.nodeType===1?a?(t._stashedDisplay=t.style.display,t.style.display="none"):(t.style.display=t._stashedDisplay||"",t.getAttribute("style")===""&&t.removeAttribute("style")):t.nodeType===3&&(a?(t._stashedText=t.nodeValue,t.nodeValue=""):t.nodeValue=t._stashedText||""),l&&l.nodeType===8)if(t=l.data,t==="/$"){if(e===0)break;e--}else t!=="$"&&t!=="$?"&&t!=="$~"&&t!=="$!"||e++;t=l}while(t)}function Qs(e){var a=e.firstChild;for(a&&a.nodeType===10&&(a=a.nextSibling);a;){var t=a;switch(a=a.nextSibling,t.nodeName){case"HTML":case"HEAD":case"BODY":Qs(t),rd(t);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(t.rel.toLowerCase()==="stylesheet")continue}e.removeChild(t)}}function eS(e,a,t,l){for(;e.nodeType===1;){var u=t;if(e.nodeName.toLowerCase()!==a.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Ku])switch(a){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(o=e.getAttribute("rel"),o==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(o!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(o=e.getAttribute("src"),(o!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&o&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(a==="input"&&e.type==="hidden"){var o=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===o)return e}else return e;if(e=da(e.nextSibling),e===null)break}return null}function aS(e,a,t){if(a==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=da(e.nextSibling),e===null))return null;return e}function Qp(e,a){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=da(e.nextSibling),e===null))return null;return e}function Js(e){return e.data==="$?"||e.data==="$~"}function Ws(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function tS(e,a){var t=e.ownerDocument;if(e.data==="$~")e._reactRetry=a;else if(e.data!=="$?"||t.readyState!=="loading")a();else{var l=function(){a(),t.removeEventListener("DOMContentLoaded",l)};t.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function da(e){for(;e!=null;e=e.nextSibling){var a=e.nodeType;if(a===1||a===3)break;if(a===8){if(a=e.data,a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"||a==="F!"||a==="F")break;if(a==="/$"||a==="/&")return null}}return e}var $s=null;function dc(e){e=e.nextSibling;for(var a=0;e;){if(e.nodeType===8){var t=e.data;if(t==="/$"||t==="/&"){if(a===0)return da(e.nextSibling);a--}else t!=="$"&&t!=="$!"&&t!=="$?"&&t!=="$~"&&t!=="&"||a++}e=e.nextSibling}return null}function ic(e){e=e.previousSibling;for(var a=0;e;){if(e.nodeType===8){var t=e.data;if(t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"){if(a===0)return e;a--}else t!=="/$"&&t!=="/&"||a++}e=e.previousSibling}return null}function Jp(e,a,t){switch(a=Cn(t),e){case"html":if(e=a.documentElement,!e)throw Error(y(452));return e;case"head":if(e=a.head,!e)throw Error(y(453));return e;case"body":if(e=a.body,!e)throw Error(y(454));return e;default:throw Error(y(451))}}function Tu(e){for(var a=e.attributes;a.length;)e.removeAttributeNode(a[0]);rd(e)}var ia=new Map,fc=new Set;function yn(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Xa=N.d;N.d={f:lS,r:uS,D:oS,C:nS,L:rS,m:sS,X:iS,S:dS,M:fS};function lS(){var e=Xa.f(),a=qn();return e||a}function uS(e){var a=Nl(e);a!==null&&a.tag===5&&a.type==="form"?Vm(a):Xa.r(e)}var jl=typeof document>"u"?null:document;function Wp(e,a,t){var l=jl;if(l&&typeof a=="string"&&a){var u=oa(a);u='link[rel="'+e+'"][href="'+u+'"]',typeof t=="string"&&(u+='[crossorigin="'+t+'"]'),fc.has(u)||(fc.add(u),e={rel:e,crossOrigin:t,href:a},l.querySelector(u)===null&&(a=l.createElement("link"),Ae(a,"link",e),Se(a),l.head.appendChild(a)))}}function oS(e){Xa.D(e),Wp("dns-prefetch",e,null)}function nS(e,a){Xa.C(e,a),Wp("preconnect",e,a)}function rS(e,a,t){Xa.L(e,a,t);var l=jl;if(l&&e&&a){var u='link[rel="preload"][as="'+oa(a)+'"]';a==="image"&&t&&t.imageSrcSet?(u+='[imagesrcset="'+oa(t.imageSrcSet)+'"]',typeof t.imageSizes=="string"&&(u+='[imagesizes="'+oa(t.imageSizes)+'"]')):u+='[href="'+oa(e)+'"]';var o=u;switch(a){case"style":o=Hl(e);break;case"script":o=Kl(e)}ia.has(o)||(e=ee({rel:"preload",href:a==="image"&&t&&t.imageSrcSet?void 0:e,as:a},t),ia.set(o,e),l.querySelector(u)!==null||a==="style"&&l.querySelector($u(o))||a==="script"&&l.querySelector(eo(o))||(a=l.createElement("link"),Ae(a,"link",e),Se(a),l.head.appendChild(a)))}}function sS(e,a){Xa.m(e,a);var t=jl;if(t&&e){var l=a&&typeof a.as=="string"?a.as:"script",u='link[rel="modulepreload"][as="'+oa(l)+'"][href="'+oa(e)+'"]',o=u;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":o=Kl(e)}if(!ia.has(o)&&(e=ee({rel:"modulepreload",href:e},a),ia.set(o,e),t.querySelector(u)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(t.querySelector(eo(o)))return}l=t.createElement("link"),Ae(l,"link",e),Se(l),t.head.appendChild(l)}}}function dS(e,a,t){Xa.S(e,a,t);var l=jl;if(l&&e){var u=vl(l).hoistableStyles,o=Hl(e);a=a||"default";var n=u.get(o);if(!n){var r={loading:0,preload:null};if(n=l.querySelector($u(o)))r.loading=5;else{e=ee({rel:"stylesheet",href:e,"data-precedence":a},t),(t=ia.get(o))&&jd(e,t);var s=n=l.createElement("link");Se(s),Ae(s,"link",e),s._p=new Promise(function(d,g){s.onload=d,s.onerror=g}),s.addEventListener("load",function(){r.loading|=1}),s.addEventListener("error",function(){r.loading|=2}),r.loading|=4,jo(n,a,l)}n={type:"stylesheet",instance:n,count:1,state:r},u.set(o,n)}}}function iS(e,a){Xa.X(e,a);var t=jl;if(t&&e){var l=vl(t).hoistableScripts,u=Kl(e),o=l.get(u);o||(o=t.querySelector(eo(u)),o||(e=ee({src:e,async:!0},a),(a=ia.get(u))&&Kd(e,a),o=t.createElement("script"),Se(o),Ae(o,"link",e),t.head.appendChild(o)),o={type:"script",instance:o,count:1,state:null},l.set(u,o))}}function fS(e,a){Xa.M(e,a);var t=jl;if(t&&e){var l=vl(t).hoistableScripts,u=Kl(e),o=l.get(u);o||(o=t.querySelector(eo(u)),o||(e=ee({src:e,async:!0,type:"module"},a),(a=ia.get(u))&&Kd(e,a),o=t.createElement("script"),Se(o),Ae(o,"link",e),t.head.appendChild(o)),o={type:"script",instance:o,count:1,state:null},l.set(u,o))}}function cc(e,a,t,l){var u=(u=st.current)?yn(u):null;if(!u)throw Error(y(446));switch(e){case"meta":case"title":return null;case"style":return typeof t.precedence=="string"&&typeof t.href=="string"?(a=Hl(t.href),t=vl(u).hoistableStyles,l=t.get(a),l||(l={type:"style",instance:null,count:0,state:null},t.set(a,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(t.rel==="stylesheet"&&typeof t.href=="string"&&typeof t.precedence=="string"){e=Hl(t.href);var o=vl(u).hoistableStyles,n=o.get(e);if(n||(u=u.ownerDocument||u,n={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},o.set(e,n),(o=u.querySelector($u(e)))&&!o._p&&(n.instance=o,n.state.loading=5),ia.has(e)||(t={rel:"preload",as:"style",href:t.href,crossOrigin:t.crossOrigin,integrity:t.integrity,media:t.media,hrefLang:t.hrefLang,referrerPolicy:t.referrerPolicy},ia.set(e,t),o||cS(u,e,t,n.state))),a&&l===null)throw Error(y(528,""));return n}if(a&&l!==null)throw Error(y(529,""));return null;case"script":return a=t.async,t=t.src,typeof t=="string"&&a&&typeof a!="function"&&typeof a!="symbol"?(a=Kl(t),t=vl(u).hoistableScripts,l=t.get(a),l||(l={type:"script",instance:null,count:0,state:null},t.set(a,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(y(444,e))}}function Hl(e){return'href="'+oa(e)+'"'}function $u(e){return'link[rel="stylesheet"]['+e+"]"}function $p(e){return ee({},e,{"data-precedence":e.precedence,precedence:null})}function cS(e,a,t,l){e.querySelector('link[rel="preload"][as="style"]['+a+"]")?l.loading=1:(a=e.createElement("link"),l.preload=a,a.addEventListener("load",function(){return l.loading|=1}),a.addEventListener("error",function(){return l.loading|=2}),Ae(a,"link",t),Se(a),e.head.appendChild(a))}function Kl(e){return'[src="'+oa(e)+'"]'}function eo(e){return"script[async]"+e}function mc(e,a,t){if(a.count++,a.instance===null)switch(a.type){case"style":var l=e.querySelector('style[data-href~="'+oa(t.href)+'"]');if(l)return a.instance=l,Se(l),l;var u=ee({},t,{"data-href":t.href,"data-precedence":t.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),Se(l),Ae(l,"style",u),jo(l,t.precedence,e),a.instance=l;case"stylesheet":u=Hl(t.href);var o=e.querySelector($u(u));if(o)return a.state.loading|=4,a.instance=o,Se(o),o;l=$p(t),(u=ia.get(u))&&jd(l,u),o=(e.ownerDocument||e).createElement("link"),Se(o);var n=o;return n._p=new Promise(function(r,s){n.onload=r,n.onerror=s}),Ae(o,"link",l),a.state.loading|=4,jo(o,t.precedence,e),a.instance=o;case"script":return o=Kl(t.src),(u=e.querySelector(eo(o)))?(a.instance=u,Se(u),u):(l=t,(u=ia.get(o))&&(l=ee({},t),Kd(l,u)),e=e.ownerDocument||e,u=e.createElement("script"),Se(u),Ae(u,"link",l),e.head.appendChild(u),a.instance=u);case"void":return null;default:throw Error(y(443,a.type))}else a.type==="stylesheet"&&(a.state.loading&4)===0&&(l=a.instance,a.state.loading|=4,jo(l,t.precedence,e));return a.instance}function jo(e,a,t){for(var l=t.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=l.length?l[l.length-1]:null,o=u,n=0;n<l.length;n++){var r=l[n];if(r.dataset.precedence===a)o=r;else if(o!==u)break}o?o.parentNode.insertBefore(e,o.nextSibling):(a=t.nodeType===9?t.head:t,a.insertBefore(e,a.firstChild))}function jd(e,a){e.crossOrigin==null&&(e.crossOrigin=a.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=a.referrerPolicy),e.title==null&&(e.title=a.title)}function Kd(e,a){e.crossOrigin==null&&(e.crossOrigin=a.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=a.referrerPolicy),e.integrity==null&&(e.integrity=a.integrity)}var Ko=null;function pc(e,a,t){if(Ko===null){var l=new Map,u=Ko=new Map;u.set(t,l)}else u=Ko,l=u.get(t),l||(l=new Map,u.set(t,l));if(l.has(e))return l;for(l.set(e,null),t=t.getElementsByTagName(e),u=0;u<t.length;u++){var o=t[u];if(!(o[Ku]||o[ve]||e==="link"&&o.getAttribute("rel")==="stylesheet")&&o.namespaceURI!=="http://www.w3.org/2000/svg"){var n=o.getAttribute(a)||"";n=e+n;var r=l.get(n);r?r.push(o):l.set(n,[o])}}return l}function gc(e,a,t){e=e.ownerDocument||e,e.head.insertBefore(t,a==="title"?e.querySelector("head > title"):null)}function mS(e,a,t){if(t===1||a.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof a.precedence!="string"||typeof a.href!="string"||a.href==="")break;return!0;case"link":if(typeof a.rel!="string"||typeof a.href!="string"||a.href===""||a.onLoad||a.onError)break;return a.rel==="stylesheet"?(e=a.disabled,typeof a.precedence=="string"&&e==null):!0;case"script":if(a.async&&typeof a.async!="function"&&typeof a.async!="symbol"&&!a.onLoad&&!a.onError&&a.src&&typeof a.src=="string")return!0}return!1}function eg(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function pS(e,a,t,l){if(t.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(t.state.loading&4)===0){if(t.instance===null){var u=Hl(l.href),o=a.querySelector($u(u));if(o){a=o._p,a!==null&&typeof a=="object"&&typeof a.then=="function"&&(e.count++,e=bn.bind(e),a.then(e,e)),t.state.loading|=4,t.instance=o,Se(o);return}o=a.ownerDocument||a,l=$p(l),(u=ia.get(u))&&jd(l,u),o=o.createElement("link"),Se(o);var n=o;n._p=new Promise(function(r,s){n.onload=r,n.onerror=s}),Ae(o,"link",l),t.instance=o}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(t,a),(a=t.state.preload)&&(t.state.loading&3)===0&&(e.count++,t=bn.bind(e),a.addEventListener("load",t),a.addEventListener("error",t))}}var ns=0;function gS(e,a){return e.stylesheets&&e.count===0&&Yo(e,e.stylesheets),0<e.count||0<e.imgCount?function(t){var l=setTimeout(function(){if(e.stylesheets&&Yo(e,e.stylesheets),e.unsuspend){var o=e.unsuspend;e.unsuspend=null,o()}},6e4+a);0<e.imgBytes&&ns===0&&(ns=62500*ZL());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Yo(e,e.stylesheets),e.unsuspend)){var o=e.unsuspend;e.unsuspend=null,o()}},(e.imgBytes>ns?50:800)+a);return e.unsuspend=t,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(u)}}:null}function bn(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Yo(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var vn=null;function Yo(e,a){e.stylesheets=null,e.unsuspend!==null&&(e.count++,vn=new Map,a.forEach(hS,e),vn=null,bn.call(e))}function hS(e,a){if(!(a.state.loading&4)){var t=vn.get(e);if(t)var l=t.get(null);else{t=new Map,vn.set(e,t);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),o=0;o<u.length;o++){var n=u[o];(n.nodeName==="LINK"||n.getAttribute("media")!=="not all")&&(t.set(n.dataset.precedence,n),l=n)}l&&t.set(null,l)}u=a.instance,n=u.getAttribute("data-precedence"),o=t.get(n)||l,o===l&&t.set(null,u),t.set(n,u),this.count++,l=bn.bind(this),u.addEventListener("load",l),u.addEventListener("error",l),o?o.parentNode.insertBefore(u,o.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),a.state.loading|=4}}var Fu={$$typeof:Oa,Provider:null,Consumer:null,_currentValue:Ut,_currentValue2:Ut,_threadCount:0};function xS(e,a,t,l,u,o,n,r,s){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Br(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Br(0),this.hiddenUpdates=Br(null),this.identifierPrefix=l,this.onUncaughtError=u,this.onCaughtError=o,this.onRecoverableError=n,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=s,this.incompleteTransitions=new Map}function ag(e,a,t,l,u,o,n,r,s,d,g,f){return e=new xS(e,a,t,n,s,d,g,f,r),a=1,o===!0&&(a|=24),o=Xe(3,null,null,a),e.current=o,o.stateNode=e,a=Sd(),a.refCount++,e.pooledCache=a,a.refCount++,o.memoizedState={element:l,isDehydrated:t,cache:a},bd(o),e}function tg(e){return e?(e=Sl,e):Sl}function lg(e,a,t,l,u,o){u=tg(u),l.context===null?l.context=u:l.pendingContext=u,l=it(a),l.payload={element:t},o=o===void 0?null:o,o!==null&&(l.callback=o),t=ft(e,l,a),t!==null&&(He(t,e,a),Cu(t,e,a))}function hc(e,a){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var t=e.retryLane;e.retryLane=t!==0&&t<a?t:a}}function Yd(e,a){hc(e,a),(e=e.alternate)&&hc(e,a)}function ug(e){if(e.tag===13||e.tag===31){var a=Zt(e,67108864);a!==null&&He(a,e,67108864),Yd(e,67108864)}}function xc(e){if(e.tag===13||e.tag===31){var a=Qe();a=od(a);var t=Zt(e,a);t!==null&&He(t,e,a),Yd(e,a)}}var In=!0;function LS(e,a,t,l){var u=R.T;R.T=null;var o=N.p;try{N.p=2,Zd(e,a,t,l)}finally{N.p=o,R.T=u}}function SS(e,a,t,l){var u=R.T;R.T=null;var o=N.p;try{N.p=8,Zd(e,a,t,l)}finally{N.p=o,R.T=u}}function Zd(e,a,t,l){if(In){var u=ed(l);if(u===null)us(e,a,l,kn,t),Lc(e,l);else if(yS(u,e,a,t,l))l.stopPropagation();else if(Lc(e,l),a&4&&-1<CS.indexOf(e)){for(;u!==null;){var o=Nl(u);if(o!==null)switch(o.tag){case 3:if(o=o.stateNode,o.current.memoizedState.isDehydrated){var n=Et(o.pendingLanes);if(n!==0){var r=o;for(r.pendingLanes|=2,r.entangledLanes|=2;n;){var s=1<<31-Ze(n);r.entanglements[1]|=s,n&=~s}va(o),(P&6)===0&&(pn=Ke()+500,Wu(0,!1))}}break;case 31:case 13:r=Zt(o,2),r!==null&&He(r,o,2),qn(),Yd(o,2)}if(o=ed(l),o===null&&us(e,a,l,kn,t),o===u)break;u=o}u!==null&&l.stopPropagation()}else us(e,a,l,null,t)}}function ed(e){return e=dd(e),Qd(e)}var kn=null;function Qd(e){if(kn=null,e=ml(e),e!==null){var a=Gu(e);if(a===null)e=null;else{var t=a.tag;if(t===13){if(e=Ic(a),e!==null)return e;e=null}else if(t===31){if(e=kc(a),e!==null)return e;e=null}else if(t===3){if(a.stateNode.current.memoizedState.isDehydrated)return a.tag===3?a.stateNode.containerInfo:null;e=null}else a!==e&&(e=null)}}return kn=e,null}function og(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(rx()){case Mc:return 2;case Dc:return 8;case $o:case sx:return 32;case Rc:return 268435456;default:return 32}default:return 32}}var ad=!1,pt=null,gt=null,ht=null,Pu=new Map,Nu=new Map,tt=[],CS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Lc(e,a){switch(e){case"focusin":case"focusout":pt=null;break;case"dragenter":case"dragleave":gt=null;break;case"mouseover":case"mouseout":ht=null;break;case"pointerover":case"pointerout":Pu.delete(a.pointerId);break;case"gotpointercapture":case"lostpointercapture":Nu.delete(a.pointerId)}}function du(e,a,t,l,u,o){return e===null||e.nativeEvent!==o?(e={blockedOn:a,domEventName:t,eventSystemFlags:l,nativeEvent:o,targetContainers:[u]},a!==null&&(a=Nl(a),a!==null&&ug(a)),e):(e.eventSystemFlags|=l,a=e.targetContainers,u!==null&&a.indexOf(u)===-1&&a.push(u),e)}function yS(e,a,t,l,u){switch(a){case"focusin":return pt=du(pt,e,a,t,l,u),!0;case"dragenter":return gt=du(gt,e,a,t,l,u),!0;case"mouseover":return ht=du(ht,e,a,t,l,u),!0;case"pointerover":var o=u.pointerId;return Pu.set(o,du(Pu.get(o)||null,e,a,t,l,u)),!0;case"gotpointercapture":return o=u.pointerId,Nu.set(o,du(Nu.get(o)||null,e,a,t,l,u)),!0}return!1}function ng(e){var a=ml(e.target);if(a!==null){var t=Gu(a);if(t!==null){if(a=t.tag,a===13){if(a=Ic(t),a!==null){e.blockedOn=a,ef(e.priority,function(){xc(t)});return}}else if(a===31){if(a=kc(t),a!==null){e.blockedOn=a,ef(e.priority,function(){xc(t)});return}}else if(a===3&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Zo(e){if(e.blockedOn!==null)return!1;for(var a=e.targetContainers;0<a.length;){var t=ed(e.nativeEvent);if(t===null){t=e.nativeEvent;var l=new t.constructor(t.type,t);Ss=l,t.target.dispatchEvent(l),Ss=null}else return a=Nl(t),a!==null&&ug(a),e.blockedOn=t,!1;a.shift()}return!0}function Sc(e,a,t){Zo(e)&&t.delete(a)}function bS(){ad=!1,pt!==null&&Zo(pt)&&(pt=null),gt!==null&&Zo(gt)&&(gt=null),ht!==null&&Zo(ht)&&(ht=null),Pu.forEach(Sc),Nu.forEach(Sc)}function Eo(e,a){e.blockedOn===a&&(e.blockedOn=null,ad||(ad=!0,ge.unstable_scheduleCallback(ge.unstable_NormalPriority,bS)))}var Oo=null;function Cc(e){Oo!==e&&(Oo=e,ge.unstable_scheduleCallback(ge.unstable_NormalPriority,function(){Oo===e&&(Oo=null);for(var a=0;a<e.length;a+=3){var t=e[a],l=e[a+1],u=e[a+2];if(typeof l!="function"){if(Qd(l||t)===null)continue;break}var o=Nl(t);o!==null&&(e.splice(a,3),a-=3,_s(o,{pending:!0,data:u,method:t.method,action:l},l,u))}}))}function Fl(e){function a(s){return Eo(s,e)}pt!==null&&Eo(pt,e),gt!==null&&Eo(gt,e),ht!==null&&Eo(ht,e),Pu.forEach(a),Nu.forEach(a);for(var t=0;t<tt.length;t++){var l=tt[t];l.blockedOn===e&&(l.blockedOn=null)}for(;0<tt.length&&(t=tt[0],t.blockedOn===null);)ng(t),t.blockedOn===null&&tt.shift();if(t=(e.ownerDocument||e).$$reactFormReplay,t!=null)for(l=0;l<t.length;l+=3){var u=t[l],o=t[l+1],n=u[Fe]||null;if(typeof o=="function")n||Cc(t);else if(n){var r=null;if(o&&o.hasAttribute("formAction")){if(u=o,n=o[Fe]||null)r=n.formAction;else if(Qd(u)!==null)continue}else r=n.action;typeof r=="function"?t[l+1]=r:(t.splice(l,3),l-=3),Cc(t)}}}function rg(){function e(o){o.canIntercept&&o.info==="react-transition"&&o.intercept({handler:function(){return new Promise(function(n){return u=n})},focusReset:"manual",scroll:"manual"})}function a(){u!==null&&(u(),u=null),l||setTimeout(t,20)}function t(){if(!l&&!navigation.transition){var o=navigation.currentEntry;o&&o.url!=null&&navigation.navigate(o.url,{state:o.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",a),navigation.addEventListener("navigateerror",a),setTimeout(t,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",a),navigation.removeEventListener("navigateerror",a),u!==null&&(u(),u=null)}}}function Jd(e){this._internalRoot=e}Pn.prototype.render=Jd.prototype.render=function(e){var a=this._internalRoot;if(a===null)throw Error(y(409));var t=a.current,l=Qe();lg(t,l,e,a,null,null)};Pn.prototype.unmount=Jd.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var a=e.containerInfo;lg(e.current,2,null,e,null,null),qn(),a[Pl]=null}};function Pn(e){this._internalRoot=e}Pn.prototype.unstable_scheduleHydration=function(e){if(e){var a=Uc();e={blockedOn:null,target:e,priority:a};for(var t=0;t<tt.length&&a!==0&&a<tt[t].priority;t++);tt.splice(t,0,e),t===0&&ng(e)}};var yc=bc.version;if(yc!=="19.2.8")throw Error(y(527,yc,"19.2.8"));N.findDOMNode=function(e){var a=e._reactInternals;if(a===void 0)throw typeof e.render=="function"?Error(y(188)):(e=Object.keys(e).join(","),Error(y(268,e)));return e=ex(a),e=e!==null?Ac(e):null,e=e===null?null:e.stateNode,e};var vS={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:R,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(iu=__REACT_DEVTOOLS_GLOBAL_HOOK__,!iu.isDisabled&&iu.supportsFiber))try{Vu=iu.inject(vS),Ye=iu}catch{}var iu;Nn.createRoot=function(e,a){if(!vc(e))throw Error(y(299));var t=!1,l="",u=Wm,o=$m,n=ep;return a!=null&&(a.unstable_strictMode===!0&&(t=!0),a.identifierPrefix!==void 0&&(l=a.identifierPrefix),a.onUncaughtError!==void 0&&(u=a.onUncaughtError),a.onCaughtError!==void 0&&(o=a.onCaughtError),a.onRecoverableError!==void 0&&(n=a.onRecoverableError)),a=ag(e,1,!1,null,null,t,l,null,u,o,n,rg),e[Pl]=a.current,Xd(e),new Jd(a)};Nn.hydrateRoot=function(e,a,t){if(!vc(e))throw Error(y(299));var l=!1,u="",o=Wm,n=$m,r=ep,s=null;return t!=null&&(t.unstable_strictMode===!0&&(l=!0),t.identifierPrefix!==void 0&&(u=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(n=t.onCaughtError),t.onRecoverableError!==void 0&&(r=t.onRecoverableError),t.formState!==void 0&&(s=t.formState)),a=ag(e,1,!0,a,t??null,l,u,s,o,n,r,rg),a.context=tg(null),t=a.current,l=Qe(),l=od(l),u=it(l),u.callback=null,ft(t,u,l),t=l,a.current.lanes=t,ju(a,t),va(a),e[Pl]=a.current,Xd(e),new Pn(a)};Nn.version="19.2.8"});var fg=ha((Sy,ig)=>{"use strict";function dg(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(dg)}catch(e){console.error(e)}}dg(),ig.exports=sg()});var th=ha(tr=>{"use strict";var NC=Symbol.for("react.transitional.element"),GC=Symbol.for("react.fragment");function ah(e,a,t){var l=null;if(t!==void 0&&(l=""+t),a.key!==void 0&&(l=""+a.key),"key"in a){t={};for(var u in a)u!=="key"&&(t[u]=a[u])}else t=a;return a=t.ref,{$$typeof:NC,type:e,key:l,ref:a!==void 0?a:null,props:t}}tr.Fragment=GC;tr.jsx=ah;tr.jsxs=ah});var se=ha((tb,lh)=>{"use strict";lh.exports=th()});var Ah=G(fg(),1);var IS='"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',kS=`
  :host {
    /* Brand */
    --ext-primary: #00875a;
    --ext-primary-hover: #007049;
    --ext-primary-soft: #e6f4ef;

    /* Semantic */
    --ext-success: #027a48;
    --ext-success-soft: #e8f6ef;
    --ext-warning: #b54708;
    --ext-warning-soft: #fdf1e3;
    --ext-danger: #d92d20;
    --ext-danger-hover: #b42318;
    --ext-danger-soft: #fdeceb;
    --ext-info: #175cd3;
    --ext-info-soft: #e8f0fd;

    /* Surface */
    --ext-bg: #f4f6f8;
    --ext-surface: #ffffff;
    --ext-surface-2: #f8fafc;
    --ext-border: #d0d5dd;

    /* Text \u2014 kontras tinggi untuk keterbacaan usia 30-40 */
    --ext-text: #1c2530;
    --ext-text-secondary: #475467;
    --ext-text-muted: #667085;
    --ext-text-on-primary: #ffffff;

    /* Typography \u2014 lebih besar dari default, untuk mudah dibaca */
    --ext-font-family: ${IS};
    --ext-font-size-xs: 12px;
    --ext-font-size-sm: 13px;
    --ext-font-size-md: 15px;
    --ext-font-size-lg: 17px;
    --ext-font-size-xl: 20px;
    --ext-line-height: 1.5;

    /* Radius */
    --ext-radius-sm: 6px;
    --ext-radius-md: 10px;
    --ext-radius-lg: 14px;

    /* Spacing */
    --ext-space-1: 4px;
    --ext-space-2: 8px;
    --ext-space-3: 12px;
    --ext-space-4: 16px;
    --ext-space-5: 20px;
    --ext-space-6: 24px;
    --ext-space-8: 32px;

    /* Shadow */
    --ext-shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
    --ext-shadow-md: 0 6px 20px rgba(16, 24, 40, 0.1);
    --ext-shadow-lg: 0 20px 50px rgba(16, 24, 40, 0.18);

    /* Focus ring \u2014 terlihat jelas, penting utk usability */
    --ext-ring: 0 0 0 3px rgba(0, 135, 90, 0.35);

    /* Motion */
    --ext-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --ext-duration-fast: 140ms;
    --ext-duration-normal: 220ms;
  }
`,Gn=null;function mg(){return Gn||(Gn=new CSSStyleSheet,Gn.replaceSync(kS)),Gn}var cg=!1;function pg(){if(cg||document.getElementById("ext-pjs-font"))return;cg=!0;let e=document.createElement("link");e.id="ext-pjs-font",e.rel="stylesheet",e.href="http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",document.head.appendChild(e)}function vt(e,a="open"){let t=e.attachShadow({mode:a});return t.adoptedStyleSheets=[mg()],pg(),t}var AS=`
  :host { display: inline-block; }
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ext-space-2);
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    font-weight: 600;
    line-height: 1.2;
    border: 1px solid transparent;
    border-radius: var(--ext-radius-md);
    padding: 10px 18px;
    cursor: pointer;
    transition: background-color var(--ext-duration-fast) var(--ext-ease),
      border-color var(--ext-duration-fast) var(--ext-ease),
      transform var(--ext-duration-fast) var(--ext-ease),
      box-shadow var(--ext-duration-fast) var(--ext-ease);
    min-height: 42px;
    white-space: nowrap;
  }
  button:hover:not(:disabled) { transform: translateY(-1px); }
  button:active:not(:disabled) { transform: translateY(0); }
  button:focus-visible { outline: none; box-shadow: var(--ext-ring); }
  button:disabled { opacity: 0.55; cursor: not-allowed; }

  /* sizes */
  :host([size='sm']) button { font-size: var(--ext-font-size-sm); padding: 6px 12px; min-height: 32px; border-radius: var(--ext-radius-sm); }
  :host([size='lg']) button { font-size: var(--ext-font-size-lg); padding: 13px 24px; min-height: 50px; }

  /* variants */
  :host([variant='primary']) button { background: var(--ext-primary); color: var(--ext-text-on-primary); }
  :host([variant='primary']) button:hover:not(:disabled) { background: var(--ext-primary-hover); }
  :host([variant='danger']) button { background: var(--ext-danger); color: var(--ext-text-on-primary); }
  :host([variant='danger']) button:hover:not(:disabled) { background: var(--ext-danger-hover); }
  :host([variant='success']) button { background: var(--ext-success); color: var(--ext-text-on-primary); }
  :host([variant='secondary']) button { background: var(--ext-surface); color: var(--ext-text); border-color: var(--ext-border); }
  :host([variant='secondary']) button:hover:not(:disabled) { background: var(--ext-surface-2); }
  :host([variant='ghost']) button { background: transparent; color: var(--ext-primary); }
  :host([variant='ghost']) button:hover:not(:disabled) { background: var(--ext-primary-soft); }
  :host([variant='ghost-danger']) button { background: transparent; color: var(--ext-danger); }
  :host([variant='ghost-danger']) button:hover:not(:disabled) { background: var(--ext-danger-soft); }

  /* loading spinner */
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ext-spin 0.7s linear infinite;
    display: none;
  }
  :host([loading]) .spinner { display: inline-block; }
  :host([loading]) button { pointer-events: none; opacity: 0.8; }
  @keyframes ext-spin { to { transform: rotate(360deg); } }
`,Vn=class extends HTMLElement{constructor(){super();let a=vt(this);a.innerHTML=`
      <style>${AS}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `,this.btn=a.querySelector("button")}connectedCallback(){this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"),this.btn.addEventListener("click",a=>{if(this.hasAttribute("loading")||this.hasAttribute("disabled")){a.stopPropagation(),a.preventDefault();return}})}static get observedAttributes(){return["disabled","loading"]}attributeChangedCallback(a){(a==="disabled"||a==="loading")&&(this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"))}};customElements.get("ext-btn")||customElements.define("ext-btn",Vn);var wS=`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-xs);
    font-weight: 700;
    line-height: 1;
    padding: 5px 10px;
    border-radius: 999px;
    border: 1px solid transparent;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
  :host([variant='success']) { background: var(--ext-success-soft); color: var(--ext-success); border-color: #bfe3cf; }
  :host([variant='warning']) { background: var(--ext-warning-soft); color: var(--ext-warning); border-color: #f2d3ae; }
  :host([variant='danger']) { background: var(--ext-danger-soft); color: var(--ext-danger); border-color: #f3c1be; }
  :host([variant='info']) { background: var(--ext-info-soft); color: var(--ext-info); border-color: #c3d6f5; }
  :host([variant='neutral']) { background: var(--ext-surface-2); color: var(--ext-text-secondary); border-color: var(--ext-border); }
  :host([variant='primary']) { background: var(--ext-primary-soft); color: var(--ext-primary); border-color: #b8ddcd; }
`,Xn=class extends HTMLElement{constructor(){super();let a=vt(this);a.innerHTML=`<style>${wS}</style><slot></slot>`}};customElements.get("ext-badge")||customElements.define("ext-badge",Xn);var TS=`
  :host {
    display: flex;
    flex-direction: column;
    font-family: var(--ext-font-family);
    background: var(--ext-surface);
    border: 1px solid var(--ext-border);
    border-radius: var(--ext-radius-lg);
    overflow: hidden;
  }
  .tablist {
    display: flex;
    border-bottom: 1px solid var(--ext-border);
    background: var(--ext-surface-2);
    overflow-x: auto;
  }
  ::slotted([slot='tab']) {
    appearance: none;
    border: none;
    background: transparent;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    font-weight: 600;
    color: var(--ext-text-secondary);
    padding: 14px 20px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    margin-bottom: -1px;
    white-space: nowrap;
    transition: color var(--ext-duration-fast) var(--ext-ease),
      border-color var(--ext-duration-fast) var(--ext-ease),
      background-color var(--ext-duration-fast) var(--ext-ease);
  }
  ::slotted([slot='tab']:hover) { color: var(--ext-primary); background: var(--ext-primary-soft); }
  ::slotted([slot='tab'][data-active]) { color: var(--ext-primary); border-bottom-color: var(--ext-primary); font-weight: 700; }
  ::slotted([slot='tab']:focus-visible) { outline: none; box-shadow: inset var(--ext-ring); }
  .panels { padding: var(--ext-space-5); }
  ::slotted([slot='panel']) { display: none; }
  ::slotted([slot='panel'][data-active]) { display: block; }
`,jn=class extends HTMLElement{constructor(){super(),this.attachShadowWithTokens()}attachShadowWithTokens(){let a=vt(this);a.innerHTML=`
      <style>${TS}</style>
      <div class="tablist"><slot name="tab"></slot></div>
      <div class="panels"><slot name="panel"></slot></div>
    `}connectedCallback(){this.addEventListener("click",t=>{let l=t.target.closest('[slot="tab"]');!l||!this.contains(l)||this.activate(l.getAttribute("data-tab")||"")});let a=this.querySelector('[slot="tab"][data-active]');a&&this.activate(a.getAttribute("data-tab")||"")}activate(a){a&&(this.querySelectorAll('[slot="tab"]').forEach(t=>{t.getAttribute("data-tab")===a?t.setAttribute("data-active",""):t.removeAttribute("data-active")}),this.querySelectorAll('[slot="panel"]').forEach(t=>{t.getAttribute("data-panel")===a?t.setAttribute("data-active",""):t.removeAttribute("data-active")}),this.dispatchEvent(new CustomEvent("ext-tab-change",{detail:{tab:a}})))}};customElements.get("ext-tabs")||customElements.define("ext-tabs",jn);var MS=`
  :host { display: none; }
  :host([open]) { display: block; }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(2px);
    animation: ext-fade var(--ext-duration-normal) var(--ext-ease);
    padding: var(--ext-space-6);
  }
  .modal {
    width: 520px;
    max-width: 100%;
    background: var(--ext-surface);
    border-radius: var(--ext-radius-lg);
    box-shadow: var(--ext-shadow-lg);
    overflow: hidden;
    animation: ext-slide-up var(--ext-duration-normal) var(--ext-ease);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ext-space-4);
    padding: var(--ext-space-5) var(--ext-space-6);
    border-bottom: 1px solid var(--ext-border);
  }
  .title {
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-lg);
    font-weight: 700;
    color: var(--ext-text);
    margin: 0;
  }
  .close {
    appearance: none;
    border: none;
    background: var(--ext-surface-2);
    color: var(--ext-text-secondary);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--ext-duration-fast) var(--ext-ease), color var(--ext-duration-fast) var(--ext-ease);
  }
  .close:hover { background: var(--ext-danger-soft); color: var(--ext-danger); }
  .close:focus-visible { outline: none; box-shadow: var(--ext-ring); }

  .body {
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    line-height: var(--ext-line-height);
    color: var(--ext-text-secondary);
    padding: var(--ext-space-6);
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--ext-space-3);
    padding: 0 var(--ext-space-6) var(--ext-space-6);
  }
  /* tombol utama di dalam modal memakai komponen ext-btn \u2014 styling via atribut host */
  ::slotted(*) { font-family: var(--ext-font-family); }

  /* variant accent line */
  :host([variant='danger']) .header { box-shadow: inset 4px 0 0 var(--ext-danger); }
  :host([variant='success']) .header { box-shadow: inset 4px 0 0 var(--ext-success); }
  :host([variant='info']) .header { box-shadow: inset 4px 0 0 var(--ext-info); }
  :host([variant='warning']) .header { box-shadow: inset 4px 0 0 var(--ext-warning); }

  @keyframes ext-fade { from { opacity: 0; } }
  @keyframes ext-slide-up {
    from { opacity: 0; transform: translateY(18px) scale(0.98); }
  }
`,Kn=class extends HTMLElement{constructor(){super();this.handleKey=t=>{t.key==="Escape"&&this.hasAttribute("open")&&this.cancel()};this.root=vt(this),this.root.innerHTML=`
      <style>${MS}</style>
      <div class="overlay">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="header">
            <h3 class="title"><slot name="title"></slot></h3>
            <button class="close" part="close" aria-label="Tutup">&times;</button>
          </div>
          <div class="body"><slot></slot></div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `}connectedCallback(){let t=this.root.querySelector(".overlay");this.root.querySelector(".close").addEventListener("click",()=>this.cancel()),t.addEventListener("click",u=>{u.target===t&&this.cancel()}),document.addEventListener("keydown",this.handleKey)}disconnectedCallback(){document.removeEventListener("keydown",this.handleKey)}get titleSlot(){return this.querySelector('[slot="title"]')}get footerSlot(){return this.querySelector('[slot="footer"]')}open(){this.setAttribute("open","")}close(){this.removeAttribute("open")}cancel(){this.dispatchEvent(new CustomEvent("ext-cancel")),this.close()}ok(){this.dispatchEvent(new CustomEvent("ext-ok"))}};customElements.get("ext-modal")||customElements.define("ext-modal",Kn);function Yn(e){return new Promise(a=>{let t=document.createElement("ext-modal");t.setAttribute("variant",e.variant??"warning"),e.okLabel&&t.setAttribute("ok-label",e.okLabel),e.cancelLabel&&t.setAttribute("cancel-label",e.cancelLabel),e.hideCancel&&t.setAttribute("hide-cancel",""),t.innerHTML=`<h3 slot="title"></h3><div class="ext-confirm-body"></div><div slot="footer">
         <ext-btn data-ext-confirm-cancel variant="secondary"></ext-btn>
         <ext-btn data-ext-confirm-ok></ext-btn>
       </div>`;let l=t.querySelector('[slot="title"]');l.textContent=e.title;let u=t.querySelector(".ext-confirm-body");if(e.icon){let r=document.createElement("div");r.className="ext-confirm-icon",r.textContent=e.icon,u.appendChild(r)}e.message&&e.message.split(`
`).forEach((s,d)=>{d>0&&u.appendChild(document.createElement("br")),u.appendChild(document.createTextNode(s))}),t.querySelector("[data-ext-confirm-ok]").textContent=e.okLabel??"Lanjut";let o=t.querySelector("[data-ext-confirm-ok]");o.setAttribute("variant",e.variant==="danger"?"danger":"primary"),e.hideCancel?t.querySelector("[data-ext-confirm-cancel]")?.remove():t.querySelector("[data-ext-confirm-cancel]").textContent=e.cancelLabel??"Batal",o.addEventListener("click",()=>t.ok()),e.hideCancel||t.querySelector("[data-ext-confirm-cancel]").addEventListener("click",()=>t.cancel());let n=r=>{t.remove(),a(r)};t.addEventListener("ext-ok",()=>n(!0)),t.addEventListener("ext-cancel",()=>n(!1)),document.body.appendChild(t),t.open()})}var oe=G(ea(),1);var DS="http://dev.rsudkotajambi.id/rs",RS="ext-farmasi-app-base";var BS=["dev.rsudkotajambi.id","103.147.236.138","localhost","127.0.0.1"],ES=".rsudkotajambi.id";var gg="Fitur nonaktif: server Reports belum HTTPS";function Zn(e){try{return new URL(e??Qn()).protocol==="https:"?null:gg}catch{return gg}}function OS(e){try{let a=new URL(e);if(a.protocol!=="http:"&&a.protocol!=="https:")return!1;let t=a.hostname.toLowerCase();return BS.includes(t)?!0:t.endsWith(ES)}catch{return!1}}function Qn(){try{let e=localStorage.getItem(RS);if(e&&OS(e))return e.replace(/\/+$/,"")}catch{}return DS}async function _S(e,a,t=fetch){let l=new AbortController,u=globalThis.setTimeout(()=>l.abort(),25e3);try{return await t(e,{...a,signal:l.signal})}finally{globalThis.clearTimeout(u)}}async function US(e,a=fetch){try{let t=Qn(),l=Zn(t);if(l)return console.warn("[casemixApi]",l,"\u2014 baca pusat dilewati:",e),null;let u=await _S(t+e,{cache:"no-store",credentials:"omit",headers:{Accept:"application/json"}},a);return u.ok?await u.json():null}catch{return null}}async function hg(e,a,t=fetch){if(!e)return[];let l="/api/reports/resume-history?id_visit="+encodeURIComponent(e)+(a?"&tipe="+a:""),u=await US(l,t);return!u?.ok||!Array.isArray(u.data)?[]:u.data}function zS(){try{let e=globalThis.crypto;if(e&&typeof e.randomUUID=="function")return e.randomUUID()}catch{}return`${Date.now().toString(36)}-${Math.floor(Math.random()*1e9).toString(36)}`}function Jt(){try{if(typeof window<"u"&&window.localStorage)return window.localStorage}catch{}return null}var vg="ext_rv_history_",qS=vg,Ig="ext_rv_lastform_",HS="ext_migrated_rv_",kg=50;function $d(e,a){return`${vg}${a==="ranap"?"ri":"rj"}_${e||"unknown"}`}function Ag(e,a){return`${Ig}${a==="ranap"?"ri":"rj"}_${e||"unknown"}`}function Jn(e,a){if(!e)return null;try{let t=e.getItem(a);return t?JSON.parse(t):null}catch{return null}}function ei(e,a,t){if(e)try{e.setItem(a,JSON.stringify(t))}catch{}}function FS(e,a){return JSON.stringify(e??null)===JSON.stringify(a??null)}function wg(e,a){let t={};return Object.keys(e).forEach(l=>t[l]=!0),Object.keys(a).forEach(l=>t[l]=!0),Object.keys(t).filter(l=>!FS(e[l],a[l]))}function xg(e){let a=e===void 0?"-":JSON.stringify(e);return a.length>60?a.slice(0,60)+"\u2026":a}function Wd(e,a,t=Jt()){let l=Jn(t,$d(e,a)),u=Array.isArray(l)?l:[];if(a==="ranap"){let o=Jn(t,qS+e);if(Array.isArray(o)&&o.length>0&&u.length===0){let n=o.map(r=>({...r,tipe:"ranap"}));return ai(n,e,"ranap",t),n}}return u}function ai(e,a,t,l=Jt()){ei(l,$d(a,t),e.slice(-kg))}function Tg(e,a,t=Jt()){let l=Jn(t,Ag(e,a));return l||(a==="ranap"?Jn(t,Ig+e):null)}function Lg(e,a,t,l=Jt()){ei(l,Ag(a,t),e)}function PS(){try{let e=document.getElementById("userpanel");if(e){let o="",n="";if(e.querySelectorAll(".subgroup").forEach(d=>{let g=(d.querySelector(".subtitle")?.textContent||"").trim().toLowerCase(),f=(d.querySelector(".subcontent")?.textContent||"").trim();g==="username"&&f&&(o=f),g==="role"&&f&&(n=f)}),o)return`${o}${n?` (${n})`:""}`;let s=(e.querySelector("a")?.textContent||"").trim();if(s&&s!=="Petugas Rumah Sakit")return s}let t=(document.querySelector("#petugas, .petugas, .username, #username, .user-name")?.textContent||"").trim();if(t)return t.slice(0,80);let l=document.querySelector('input[name="dokter"], #dokter, input[name="nama_dokter"]')?.value?.trim();if(l)return l.slice(0,80);let u=document.querySelector('input[name="id_user"], #id_user')?.value?.trim();if(u)return`User #${u}`}catch{}return"petugas"}var NS="/api/reports/resume-history";function GS(){return Qn()}function VS(e){return HS+e}function XS(e,a){if(!e)return 0;try{let t=e.getItem(a);if(t===null)return 0;let l=Number(JSON.parse(t));return Number.isFinite(l)?l:0}catch{return 0}}function jS(e,a,t,l){if(!(!e||!a))try{let u=VS($d(a,t));l>XS(e,u)&&ei(e,u,l)}catch{}}function KS(e,a,t=fetch,l=Jt(),u=e.tipe){let o={client_id:e.client_id??null,id_visit:a,id_resume:e.id_resume,aksi:e.aksi,tipe:e.tipe,waktu:new Date(e.at).toISOString(),user:e.user,before:e.before,after:e.after,changed:e.changed},n=async()=>{try{let r=GS(),s=Zn(r);return s?(console.warn("[resumeHistory]",s,"\u2014 kirim resume dilewati:",a),!1):(await t(r+NS,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(o),keepalive:!0,credentials:"omit"})).ok?(jS(l,a,u,e.at),!0):!1}catch{return!1}};try{return n()}catch{return Promise.resolve(!1)}}var Sg=null,Cg=0;function Mg(e){if(!e.idVisit)return null;let a=e.now??Date.now(),t=e.store??Jt();Lg(e.after,e.idVisit,e.tipe,t);let l=JSON.stringify([e.idVisit,e.aksi,e.after]);if(Sg===l&&a-Cg<5e3)return null;Sg=l,Cg=a;let u={at:a,aksi:e.aksi,id_resume:e.idResume??"",user:e.user??PS(),tipe:e.tipe,before:e.before??{},after:e.after,changed:wg(e.before??{},e.after),client_id:zS()},o=Wd(e.idVisit,e.tipe,t);o.push(u),ai(o,e.idVisit,e.tipe,t),Lg(e.after,e.idVisit,e.tipe,t);try{KS(u,e.idVisit,e.fetcher??fetch,t,e.tipe)}catch{}return u}function YS(e){if(e!=null){if(typeof e=="string")return e;if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e))return e.map(a=>{if(typeof a=="string")return a;try{return JSON.stringify(a)??""}catch{return""}});try{return JSON.stringify(e)??""}catch{return""}}}function yg(e){let a={};if(!e||typeof e!="object"||Array.isArray(e))return a;for(let t of Object.keys(e)){let l=YS(e[t]);l!==void 0&&(a[t]=l)}return a}function ZS(e,a){try{if(!e||typeof e!="object")return null;let t=e.waktu?Date.parse(e.waktu):NaN;if(!Number.isFinite(t))return null;let l=yg(e.after),u=yg(e.before),o=e.tipe==="rajal"?"rajal":e.tipe==="ranap"?"ranap":a,n=Array.isArray(e.changed)?e.changed.filter(s=>typeof s=="string"):wg(u,l),r=typeof e.client_id=="string"&&e.client_id?e.client_id:void 0;return{at:t,aksi:e.aksi==="buat"?"buat":"ubah",id_resume:typeof e.id_resume=="string"?e.id_resume:"",user:typeof e.user=="string"&&e.user?e.user:"petugas",tipe:o,before:u,after:l,changed:n,...r?{client_id:r}:{}}}catch{return null}}function bg(e){if(e.client_id)return"cid:"+e.client_id;try{return"h:"+e.at+"|"+e.user+"|"+e.aksi+"|"+JSON.stringify(e.after)}catch{return"h:"+e.at+"|"+e.user+"|"+e.aksi}}function QS(e,a){let t=new Set(e.map(bg)),l=e.slice();for(let u of a){let o=bg(u);t.has(o)||(t.add(o),l.push(u))}return l.sort((u,o)=>u.at-o.at),l.slice(-kg)}var JS="'Roboto','Segoe UI',system-ui,-apple-system,Arial,sans-serif";function Dg(e){try{document.querySelector("#ext-rv-history-overlay")?.remove()}catch{}let a=e.store??Jt(),t=Wd(e.idVisit,e.tipe,a).slice().reverse(),l=e.zIndex??99998,u=document.createElement("div");u.id="ext-rv-history-overlay",u.style.cssText=`position:fixed;inset:0;z-index:${l};background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:24px;`,u.addEventListener("click",function(f){f.target===u&&u.remove()});let o=document.createElement("div");o.style.cssText="background:#fff;border-radius:12px;max-width:680px;width:100%;max-height:82vh;display:flex;flex-direction:column;overflow:hidden;font-size:16px!important;line-height:1.6!important;color:#1c2530;font-family:"+JS+"!important;",u.appendChild(o);let n=document.createElement("div");n.style.cssText="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #d0d5dd;font-weight:700;";let r=document.createElement("span");r.textContent=`${e.title??"Riwayat Resume"} (${t.length})`,n.appendChild(r);let s=document.createElement("button");s.type="button",s.textContent="\xD7",s.style.cssText="border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;font-family:inherit!important;font-size:16px!important;line-height:1!important;cursor:pointer;",s.onclick=function(){u.remove()},n.appendChild(s),o.appendChild(n);let d=document.createElement("div");d.style.cssText="padding:14px 18px;overflow-y:auto;",o.appendChild(d);let g=f=>{if(t=f,r.textContent=`${e.title??"Riwayat Resume"} (${t.length})`,d.replaceChildren(),!t.length){d.textContent="Belum ada riwayat untuk kunjungan ini. Riwayat tercatat otomatis setiap kali Simpan ditekan.";return}t.forEach(function(c,h){let v=t.length-h,b=document.createElement("div");b.style.cssText="border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;";let T=document.createElement("div");T.style.fontWeight="600";let m=c.user?` \u2014 oleh ${c.user}`:"";T.textContent=`#${v} \u2014 ${new Date(c.at).toLocaleString("id-ID")} \u2014 ${c.aksi==="buat"?"Buat baru":"Ubah"}${m} \u2014 ${c.changed.length} field berubah`,b.appendChild(T);let i=document.createElement("div");i.style.cssText="display:none;margin-top:8px;background:#f8fafc;border-radius:6px;padding:8px 10px;font-size:13px;line-height:1.6;max-height:180px;overflow-y:auto;white-space:pre-wrap;",c.changed.length?i.textContent=c.changed.map(function(D){return D+": "+xg(c.before[D])+" \u2192 "+xg(c.after[D])}).join(`
`):i.textContent="Tidak ada perbedaan field.",b.appendChild(i);let x=document.createElement("div");x.style.cssText="margin-top:8px;display:flex;gap:8px;";let S=document.createElement("button");S.type="button",S.textContent="Lihat",S.style.cssText="border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;",S.onclick=function(){i.style.display=i.style.display==="none"?"block":"none"},x.appendChild(S);let k=document.createElement("button");k.type="button",k.textContent="Salin ke Form",k.style.cssText="background:#00875a;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;",k.onclick=function(){try{e.onApply(c.after),u.remove()}catch{}},x.appendChild(k),b.appendChild(x),d.appendChild(b)})};g(t);try{document.body.appendChild(u)}catch{}if(e.idVisit){let f=Zn();if(f)try{let c=document.createElement("div");c.textContent=f+" \u2014 riwayat hanya dari PC ini.",c.style.cssText="margin-top:10px;padding:8px 10px;background:#fef3c7;color:#92400e;border-radius:6px;font-size:13px;line-height:1.5;",d.appendChild(c)}catch{}else try{hg(e.idVisit,e.tipe).then(c=>{try{if(!c.length||!u.isConnected)return;let h=[];for(let T of c){let m=ZS(T,e.tipe);m&&h.push(m)}if(!h.length)return;let v=Wd(e.idVisit,e.tipe,a),b=QS(v,h);if(b.length===v.length)return;ai(b,e.idVisit,e.tipe,a),g(b.slice().reverse());try{document.dispatchEvent(new CustomEvent("ext-rv-history-merged",{detail:{idVisit:e.idVisit,tipe:e.tipe,count:b.length}}))}catch{}}catch{}})}catch{}}}var Rg=["alasan_rawat","anamnesa","riwayat_penyakit","tensi","nadi","suhu","spo2","nafas","gcs_e","gcs_m","gcs_v","fisik_text","laborat","diagnosa_primary","diagnosa_skunder","diagnosa_tindakan","tindakan","terapi_pengobatan","obat_plg","tindakan_dua","jenis_kasus","kode_diagnosa_utama","id_diagnosa_utama","ku","kes","td_pulang","nadi_pulang","suhu_pulang","rr_pulang","spo2_pulang","catatan_keluar","keadaan_keluar","cara_keluar","penyebab_kematian","instruksi_pulang","tgl_keluar","jadwal_kontrol","pemeriksaan_lanjut","kelas","id_kelas"],Wn=[{field:"icd_sekunder",idName:"id_diagnosa_sekunder[]",kodePrefix:"kode_diagnosa_sekunder",namaPrefix:"diagnosa_sekunder"},{field:"icd_tindakan",idName:"id_tindakan[]",kodePrefix:"kode_tindakan",namaPrefix:"tindakan"},{field:"icd_nosokomial",idName:"id_nosokomial[]",kodePrefix:"kode_nosokomial",namaPrefix:"nosokomial"}];function Bg(e){let a={};for(let t of Rg){let l=e[t];typeof l=="string"&&(a[t]=l)}a.diagnosa_utama=e.diagnosa_utama_nama;for(let t of Wn){let l=e[t.field];a[t.idName]=l.map(u=>u.id),l.forEach((u,o)=>{a[`${t.kodePrefix}${o+1}`]=u.kode,a[`${t.namaPrefix}${o+1}`]=u.nama})}return a}function ti(e,a){let t=e[a];return typeof t=="string"?t:Array.isArray(t)?t[0]??"":""}function Eg(e,a){let t=structuredClone(a);for(let o of Rg){let n=e[o];typeof n=="string"&&(t[o]=n)}let l=ti(e,"diagnosa_utama");l&&(t.diagnosa_utama_nama=l);let u=o=>{let n=e[o.idName],r=Array.isArray(n)?n:[],s=[];for(let d=1;d<=10;d++){let g=ti(e,`${o.kodePrefix}${d}`),f=ti(e,`${o.namaPrefix}${d}`);!g&&!f||s.push({id:r[d-1]??"",kode:g,nama:f})}return s};return t.icd_sekunder=u(Wn[0]),t.icd_tindakan=u(Wn[1]),t.icd_nosokomial=u(Wn[2]),t}var uh=G(ea(),1);function Og(e){var a,t,l="";if(typeof e=="string"||typeof e=="number")l+=e;else if(typeof e=="object")if(Array.isArray(e)){var u=e.length;for(a=0;a<u;a++)e[a]&&(t=Og(e[a]))&&(l&&(l+=" "),l+=t)}else for(t in e)e[t]&&(l&&(l+=" "),l+=t);return l}function $n(){for(var e,a,t=0,l="",u=arguments.length;t<u;t++)(e=arguments[t])&&(a=Og(e))&&(l&&(l+=" "),l+=a);return l}var WS=(e,a)=>{let t=new Array(e.length+a.length);for(let l=0;l<e.length;l++)t[l]=e[l];for(let l=0;l<a.length;l++)t[e.length+l]=a[l];return t},$S=(e,a)=>({classGroupId:e,validator:a}),Fg=(e=new Map,a=null,t)=>({nextPart:e,validators:a,classGroupId:t});var _g=[],eC="arbitrary..",aC=e=>{let a=lC(e),{conflictingClassGroups:t,conflictingClassGroupModifiers:l}=e;return{getClassGroupId:n=>{if(n.startsWith("[")&&n.endsWith("]"))return tC(n);let r=n.split("-"),s=r[0]===""&&r.length>1?1:0;return Pg(r,s,a)},getConflictingClassGroupIds:(n,r)=>{if(r){let s=l[n],d=t[n];return s?d?WS(d,s):s:d||_g}return t[n]||_g}}},Pg=(e,a,t)=>{if(e.length-a===0)return t.classGroupId;let u=e[a],o=t.nextPart.get(u);if(o){let d=Pg(e,a+1,o);if(d)return d}let n=t.validators;if(n===null)return;let r=a===0?e.join("-"):e.slice(a).join("-"),s=n.length;for(let d=0;d<s;d++){let g=n[d];if(g.validator(r))return g.classGroupId}},tC=e=>e.slice(1,-1).indexOf(":")===-1?void 0:(()=>{let a=e.slice(1,-1),t=a.indexOf(":"),l=a.slice(0,t);return l?eC+l:void 0})(),lC=e=>{let{theme:a,classGroups:t}=e;return uC(t,a)},uC=(e,a)=>{let t=Fg();for(let l in e){let u=e[l];ui(u,t,l,a)}return t},ui=(e,a,t,l)=>{let u=e.length;for(let o=0;o<u;o++){let n=e[o];oC(n,a,t,l)}},oC=(e,a,t,l)=>{if(typeof e=="string"){nC(e,a,t);return}if(typeof e=="function"){rC(e,a,t,l);return}sC(e,a,t,l)},nC=(e,a,t)=>{let l=e===""?a:Ng(a,e);l.classGroupId=t},rC=(e,a,t,l)=>{if(dC(e)){ui(e(l),a,t,l);return}a.validators===null&&(a.validators=[]),a.validators.push($S(t,e))},sC=(e,a,t,l)=>{let u=Object.entries(e),o=u.length;for(let n=0;n<o;n++){let[r,s]=u[n];ui(s,Ng(a,r),t,l)}},Ng=(e,a)=>{let t=e,l=a.split("-"),u=l.length;for(let o=0;o<u;o++){let n=l[o],r=t.nextPart.get(n);r||(r=Fg(),t.nextPart.set(n,r)),t=r}return t},dC=e=>"isThemeGetter"in e&&e.isThemeGetter===!0,iC=e=>{if(e<1)return{get:()=>{},set:()=>{}};let a=0,t=Object.create(null),l=Object.create(null),u=(o,n)=>{t[o]=n,a++,a>e&&(a=0,l=t,t=Object.create(null))};return{get(o){let n=t[o];if(n!==void 0)return n;if((n=l[o])!==void 0)return u(o,n),n},set(o,n){o in t?t[o]=n:u(o,n)}}};var fC=[],Ug=(e,a,t,l,u)=>({modifiers:e,hasImportantModifier:a,baseClassName:t,maybePostfixModifierPosition:l,isExternal:u}),cC=e=>{let{prefix:a,experimentalParseClassName:t}=e,l=u=>{let o=[],n=0,r=0,s=0,d,g=u.length;for(let b=0;b<g;b++){let T=u[b];if(n===0&&r===0){if(T===":"){o.push(u.slice(s,b)),s=b+1;continue}if(T==="/"){d=b;continue}}T==="["?n++:T==="]"?n--:T==="("?r++:T===")"&&r--}let f=o.length===0?u:u.slice(s),c=f,h=!1;f.endsWith("!")?(c=f.slice(0,-1),h=!0):f.startsWith("!")&&(c=f.slice(1),h=!0);let v=d&&d>s?d-s:void 0;return Ug(o,h,c,v)};if(a){let u=a+":",o=l;l=n=>n.startsWith(u)?o(n.slice(u.length)):Ug(fC,!1,n,void 0,!0)}if(t){let u=l;l=o=>t({className:o,parseClassName:u})}return l},mC=e=>{let a=new Map;return e.orderSensitiveModifiers.forEach((t,l)=>{a.set(t,1e6+l)}),t=>{let l=[],u=[];for(let o=0;o<t.length;o++){let n=t[o],r=n[0]==="[",s=a.has(n);r||s?(u.length>0&&(u.sort(),l.push(...u),u=[]),l.push(n)):u.push(n)}return u.length>0&&(u.sort(),l.push(...u)),l}},pC=e=>({cache:iC(e.cacheSize),parseClassName:cC(e),sortModifiers:mC(e),postfixLookupClassGroupIds:gC(e),...aC(e)}),gC=e=>{let a=Object.create(null),t=e.postfixLookupClassGroups;if(t)for(let l=0;l<t.length;l++)a[t[l]]=!0;return a},hC=/\s+/,xC=(e,a)=>{let{parseClassName:t,getClassGroupId:l,getConflictingClassGroupIds:u,sortModifiers:o,postfixLookupClassGroupIds:n}=a,r=[],s=e.trim().split(hC),d="";for(let g=s.length-1;g>=0;g-=1){let f=s[g],{isExternal:c,modifiers:h,hasImportantModifier:v,baseClassName:b,maybePostfixModifierPosition:T}=t(f);if(c){d=f+(d.length>0?" "+d:d);continue}let m=!!T,i;if(m){let p=b.substring(0,T);i=l(p);let C=i&&n[i]?l(b):void 0;C&&C!==i&&(i=C,m=!1)}else i=l(b);if(!i){if(!m){d=f+(d.length>0?" "+d:d);continue}if(i=l(b),!i){d=f+(d.length>0?" "+d:d);continue}m=!1}let x=h.length===0?"":h.length===1?h[0]:o(h).join(":"),S=v?x+"!":x,k=S+i;if(r.indexOf(k)>-1)continue;r.push(k);let D=u(i,m);for(let p=0;p<D.length;++p){let C=D[p];r.push(S+C)}d=f+(d.length>0?" "+d:d)}return d},LC=(...e)=>{let a=0,t,l,u="";for(;a<e.length;)(t=e[a++])&&(l=Gg(t))&&(u&&(u+=" "),u+=l);return u},Gg=e=>{if(typeof e=="string")return e;let a,t="";for(let l=0;l<e.length;l++)e[l]&&(a=Gg(e[l]))&&(t&&(t+=" "),t+=a);return t},SC=(e,...a)=>{let t,l,u,o,n=s=>{let d=a.reduce((g,f)=>f(g),e());return t=pC(d),l=t.cache.get,u=t.cache.set,o=r,r(s)},r=s=>{let d=l(s);if(d)return d;let g=xC(s,t);return u(s,g),g};return o=n,(...s)=>o(LC(...s))},CC=[],he=e=>{let a=t=>t[e]||CC;return a.isThemeGetter=!0,a},Vg=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Xg=/^\((?:(\w[\w-]*):)?(.+)\)$/i,yC=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,bC=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,vC=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,IC=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,kC=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,AC=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,It=e=>yC.test(e),_=e=>!!e&&!Number.isNaN(Number(e)),Ia=e=>!!e&&Number.isInteger(Number(e)),li=e=>e.endsWith("%")&&_(e.slice(0,-1)),ja=e=>bC.test(e),jg=()=>!0,wC=e=>vC.test(e)&&!IC.test(e),oi=()=>!1,TC=e=>kC.test(e),MC=e=>AC.test(e),DC=e=>!A(e)&&!w(e),RC=e=>e.startsWith("@container")&&(e[10]==="/"&&e[11]!==void 0||e[11]==="s"&&e[16]!==void 0&&e.startsWith("-size/",10)||e[11]==="n"&&e[18]!==void 0&&e.startsWith("-normal/",10)),BC=e=>kt(e,Zg,oi),A=e=>Vg.test(e),Wt=e=>kt(e,Qg,wC),zg=e=>kt(e,FC,_),EC=e=>kt(e,Wg,jg),OC=e=>kt(e,Jg,oi),qg=e=>kt(e,Kg,oi),_C=e=>kt(e,Yg,MC),er=e=>kt(e,$g,TC),w=e=>Xg.test(e),ao=e=>$t(e,Qg),UC=e=>$t(e,Jg),Hg=e=>$t(e,Kg),zC=e=>$t(e,Zg),qC=e=>$t(e,Yg),ar=e=>$t(e,$g,!0),HC=e=>$t(e,Wg,!0),kt=(e,a,t)=>{let l=Vg.exec(e);return l?l[1]?a(l[1]):t(l[2]):!1},$t=(e,a,t=!1)=>{let l=Xg.exec(e);return l?l[1]?a(l[1]):t:!1},Kg=e=>e==="position"||e==="percentage",Yg=e=>e==="image"||e==="url",Zg=e=>e==="length"||e==="size"||e==="bg-size",Qg=e=>e==="length",FC=e=>e==="number",Jg=e=>e==="family-name",Wg=e=>e==="number"||e==="weight",$g=e=>e==="shadow";var PC=()=>{let e=he("color"),a=he("font"),t=he("text"),l=he("font-weight"),u=he("tracking"),o=he("leading"),n=he("breakpoint"),r=he("container"),s=he("spacing"),d=he("radius"),g=he("shadow"),f=he("inset-shadow"),c=he("text-shadow"),h=he("drop-shadow"),v=he("blur"),b=he("perspective"),T=he("aspect"),m=he("ease"),i=he("animate"),x=()=>["auto","avoid","all","avoid-page","page","left","right","column"],S=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],k=()=>[...S(),w,A],D=()=>["auto","hidden","clip","visible","scroll"],p=()=>["auto","contain","none"],C=()=>[w,A,s],I=()=>[It,"full","auto",...C()],B=()=>[Ia,"none","subgrid",w,A],de=()=>["auto",{span:["full",Ia,w,A]},Ia,w,A],fa=()=>[Ia,"auto",w,A],Ya=()=>["auto","min","max","fr",w,A],Mt=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],al=()=>["start","end","center","stretch","center-safe","end-safe"],ca=()=>["auto",...C()],Dt=()=>[It,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...C()],dr=()=>[It,"screen","full","dvw","lvw","svw","min","max","fit",...C()],ir=()=>[It,"screen","full","lh","dvh","lvh","svh","min","max","fit",...C()],M=()=>[e,w,A],gi=()=>[...S(),Hg,qg,{position:[w,A]}],hi=()=>["no-repeat",{repeat:["","x","y","space","round"]}],xi=()=>["auto","cover","contain",zC,BC,{size:[w,A]}],fr=()=>[li,ao,Wt],De=()=>["","none","full",d,w,A],Re=()=>["",_,ao,Wt],ro=()=>["solid","dashed","dotted","double"],Li=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],xe=()=>[_,li,Hg,qg],Si=()=>["","none",v,w,A],so=()=>["none",_,w,A],io=()=>["none",_,w,A],cr=()=>[_,w,A],fo=()=>[It,"full",...C()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[ja],breakpoint:[ja],color:[jg],container:[ja],"drop-shadow":[ja],ease:["in","out","in-out"],font:[DC],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[ja],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[ja],shadow:[ja],spacing:["px",_],text:[ja],"text-shadow":[ja],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",It,A,w,T]}],container:["container"],"container-type":[{"@container":["","normal","size",w,A]}],"container-named":[RC],columns:[{columns:[_,A,w,r]}],"break-after":[{"break-after":x()}],"break-before":[{"break-before":x()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:k()}],overflow:[{overflow:D()}],"overflow-x":[{"overflow-x":D()}],"overflow-y":[{"overflow-y":D()}],overscroll:[{overscroll:p()}],"overscroll-x":[{"overscroll-x":p()}],"overscroll-y":[{"overscroll-y":p()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:I()}],"inset-x":[{"inset-x":I()}],"inset-y":[{"inset-y":I()}],start:[{"inset-s":I(),start:I()}],end:[{"inset-e":I(),end:I()}],"inset-bs":[{"inset-bs":I()}],"inset-be":[{"inset-be":I()}],top:[{top:I()}],right:[{right:I()}],bottom:[{bottom:I()}],left:[{left:I()}],visibility:["visible","invisible","collapse"],z:[{z:[Ia,"auto",w,A]}],basis:[{basis:[It,"full","auto",r,...C()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[_,It,"auto","initial","none",A]}],grow:[{grow:["",_,w,A]}],shrink:[{shrink:["",_,w,A]}],order:[{order:[Ia,"first","last","none",w,A]}],"grid-cols":[{"grid-cols":B()}],"col-start-end":[{col:de()}],"col-start":[{"col-start":fa()}],"col-end":[{"col-end":fa()}],"grid-rows":[{"grid-rows":B()}],"row-start-end":[{row:de()}],"row-start":[{"row-start":fa()}],"row-end":[{"row-end":fa()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":Ya()}],"auto-rows":[{"auto-rows":Ya()}],gap:[{gap:C()}],"gap-x":[{"gap-x":C()}],"gap-y":[{"gap-y":C()}],"justify-content":[{justify:[...Mt(),"normal"]}],"justify-items":[{"justify-items":[...al(),"normal"]}],"justify-self":[{"justify-self":["auto",...al()]}],"align-content":[{content:["normal",...Mt()]}],"align-items":[{items:[...al(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...al(),{baseline:["","last"]}]}],"place-content":[{"place-content":Mt()}],"place-items":[{"place-items":[...al(),"baseline"]}],"place-self":[{"place-self":["auto",...al()]}],p:[{p:C()}],px:[{px:C()}],py:[{py:C()}],ps:[{ps:C()}],pe:[{pe:C()}],pbs:[{pbs:C()}],pbe:[{pbe:C()}],pt:[{pt:C()}],pr:[{pr:C()}],pb:[{pb:C()}],pl:[{pl:C()}],m:[{m:ca()}],mx:[{mx:ca()}],my:[{my:ca()}],ms:[{ms:ca()}],me:[{me:ca()}],mbs:[{mbs:ca()}],mbe:[{mbe:ca()}],mt:[{mt:ca()}],mr:[{mr:ca()}],mb:[{mb:ca()}],ml:[{ml:ca()}],"space-x":[{"space-x":C()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":C()}],"space-y-reverse":["space-y-reverse"],size:[{size:Dt()}],"inline-size":[{inline:["auto",...dr()]}],"min-inline-size":[{"min-inline":["auto",...dr()]}],"max-inline-size":[{"max-inline":["none",...dr()]}],"block-size":[{block:["auto",...ir()]}],"min-block-size":[{"min-block":["auto",...ir()]}],"max-block-size":[{"max-block":["none",...ir()]}],w:[{w:[r,"screen",...Dt()]}],"min-w":[{"min-w":[r,"screen","none",...Dt()]}],"max-w":[{"max-w":[r,"screen","none","prose",{screen:[n]},...Dt()]}],h:[{h:["screen","lh",...Dt()]}],"min-h":[{"min-h":["screen","lh","none",...Dt()]}],"max-h":[{"max-h":["screen","lh",...Dt()]}],"font-size":[{text:["base",t,ao,Wt]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[l,HC,EC]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",li,A]}],"font-family":[{font:[UC,OC,a]}],"font-features":[{"font-features":[A]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[u,w,A]}],"line-clamp":[{"line-clamp":[_,"none",w,zg]}],leading:[{leading:[o,...C()]}],"list-image":[{"list-image":["none",w,A]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",w,A]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:M()}],"text-color":[{text:M()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...ro(),"wavy"]}],"text-decoration-thickness":[{decoration:[_,"from-font","auto",w,Wt]}],"text-decoration-color":[{decoration:M()}],"underline-offset":[{"underline-offset":[_,"auto",w,A]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:C()}],"tab-size":[{tab:[Ia,w,A]}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",w,A]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",w,A]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:gi()}],"bg-repeat":[{bg:hi()}],"bg-size":[{bg:xi()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},Ia,w,A],radial:["",w,A],conic:[Ia,w,A]},qC,_C]}],"bg-color":[{bg:M()}],"gradient-from-pos":[{from:fr()}],"gradient-via-pos":[{via:fr()}],"gradient-to-pos":[{to:fr()}],"gradient-from":[{from:M()}],"gradient-via":[{via:M()}],"gradient-to":[{to:M()}],rounded:[{rounded:De()}],"rounded-s":[{"rounded-s":De()}],"rounded-e":[{"rounded-e":De()}],"rounded-t":[{"rounded-t":De()}],"rounded-r":[{"rounded-r":De()}],"rounded-b":[{"rounded-b":De()}],"rounded-l":[{"rounded-l":De()}],"rounded-ss":[{"rounded-ss":De()}],"rounded-se":[{"rounded-se":De()}],"rounded-ee":[{"rounded-ee":De()}],"rounded-es":[{"rounded-es":De()}],"rounded-tl":[{"rounded-tl":De()}],"rounded-tr":[{"rounded-tr":De()}],"rounded-br":[{"rounded-br":De()}],"rounded-bl":[{"rounded-bl":De()}],"border-w":[{border:Re()}],"border-w-x":[{"border-x":Re()}],"border-w-y":[{"border-y":Re()}],"border-w-s":[{"border-s":Re()}],"border-w-e":[{"border-e":Re()}],"border-w-bs":[{"border-bs":Re()}],"border-w-be":[{"border-be":Re()}],"border-w-t":[{"border-t":Re()}],"border-w-r":[{"border-r":Re()}],"border-w-b":[{"border-b":Re()}],"border-w-l":[{"border-l":Re()}],"divide-x":[{"divide-x":Re()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":Re()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...ro(),"hidden","none"]}],"divide-style":[{divide:[...ro(),"hidden","none"]}],"border-color":[{border:M()}],"border-color-x":[{"border-x":M()}],"border-color-y":[{"border-y":M()}],"border-color-s":[{"border-s":M()}],"border-color-e":[{"border-e":M()}],"border-color-bs":[{"border-bs":M()}],"border-color-be":[{"border-be":M()}],"border-color-t":[{"border-t":M()}],"border-color-r":[{"border-r":M()}],"border-color-b":[{"border-b":M()}],"border-color-l":[{"border-l":M()}],"divide-color":[{divide:M()}],"outline-style":[{outline:[...ro(),"none","hidden"]}],"outline-offset":[{"outline-offset":[_,w,A]}],"outline-w":[{outline:["",_,ao,Wt]}],"outline-color":[{outline:M()}],shadow:[{shadow:["","none",g,ar,er]}],"shadow-color":[{shadow:M()}],"inset-shadow":[{"inset-shadow":["none",f,ar,er]}],"inset-shadow-color":[{"inset-shadow":M()}],"ring-w":[{ring:Re()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:M()}],"ring-offset-w":[{"ring-offset":[_,Wt]}],"ring-offset-color":[{"ring-offset":M()}],"inset-ring-w":[{"inset-ring":Re()}],"inset-ring-color":[{"inset-ring":M()}],"text-shadow":[{"text-shadow":["none",c,ar,er]}],"text-shadow-color":[{"text-shadow":M()}],opacity:[{opacity:[_,w,A]}],"mix-blend":[{"mix-blend":[...Li(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":Li()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[_]}],"mask-image-linear-from-pos":[{"mask-linear-from":xe()}],"mask-image-linear-to-pos":[{"mask-linear-to":xe()}],"mask-image-linear-from-color":[{"mask-linear-from":M()}],"mask-image-linear-to-color":[{"mask-linear-to":M()}],"mask-image-t-from-pos":[{"mask-t-from":xe()}],"mask-image-t-to-pos":[{"mask-t-to":xe()}],"mask-image-t-from-color":[{"mask-t-from":M()}],"mask-image-t-to-color":[{"mask-t-to":M()}],"mask-image-r-from-pos":[{"mask-r-from":xe()}],"mask-image-r-to-pos":[{"mask-r-to":xe()}],"mask-image-r-from-color":[{"mask-r-from":M()}],"mask-image-r-to-color":[{"mask-r-to":M()}],"mask-image-b-from-pos":[{"mask-b-from":xe()}],"mask-image-b-to-pos":[{"mask-b-to":xe()}],"mask-image-b-from-color":[{"mask-b-from":M()}],"mask-image-b-to-color":[{"mask-b-to":M()}],"mask-image-l-from-pos":[{"mask-l-from":xe()}],"mask-image-l-to-pos":[{"mask-l-to":xe()}],"mask-image-l-from-color":[{"mask-l-from":M()}],"mask-image-l-to-color":[{"mask-l-to":M()}],"mask-image-x-from-pos":[{"mask-x-from":xe()}],"mask-image-x-to-pos":[{"mask-x-to":xe()}],"mask-image-x-from-color":[{"mask-x-from":M()}],"mask-image-x-to-color":[{"mask-x-to":M()}],"mask-image-y-from-pos":[{"mask-y-from":xe()}],"mask-image-y-to-pos":[{"mask-y-to":xe()}],"mask-image-y-from-color":[{"mask-y-from":M()}],"mask-image-y-to-color":[{"mask-y-to":M()}],"mask-image-radial":[{"mask-radial":[w,A]}],"mask-image-radial-from-pos":[{"mask-radial-from":xe()}],"mask-image-radial-to-pos":[{"mask-radial-to":xe()}],"mask-image-radial-from-color":[{"mask-radial-from":M()}],"mask-image-radial-to-color":[{"mask-radial-to":M()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":S()}],"mask-image-conic-pos":[{"mask-conic":[_]}],"mask-image-conic-from-pos":[{"mask-conic-from":xe()}],"mask-image-conic-to-pos":[{"mask-conic-to":xe()}],"mask-image-conic-from-color":[{"mask-conic-from":M()}],"mask-image-conic-to-color":[{"mask-conic-to":M()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:gi()}],"mask-repeat":[{mask:hi()}],"mask-size":[{mask:xi()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",w,A]}],filter:[{filter:["","none",w,A]}],blur:[{blur:Si()}],brightness:[{brightness:[_,w,A]}],contrast:[{contrast:[_,w,A]}],"drop-shadow":[{"drop-shadow":["","none",h,ar,er]}],"drop-shadow-color":[{"drop-shadow":M()}],grayscale:[{grayscale:["",_,w,A]}],"hue-rotate":[{"hue-rotate":[_,w,A]}],invert:[{invert:["",_,w,A]}],saturate:[{saturate:[_,w,A]}],sepia:[{sepia:["",_,w,A]}],"backdrop-filter":[{"backdrop-filter":["","none",w,A]}],"backdrop-blur":[{"backdrop-blur":Si()}],"backdrop-brightness":[{"backdrop-brightness":[_,w,A]}],"backdrop-contrast":[{"backdrop-contrast":[_,w,A]}],"backdrop-grayscale":[{"backdrop-grayscale":["",_,w,A]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[_,w,A]}],"backdrop-invert":[{"backdrop-invert":["",_,w,A]}],"backdrop-opacity":[{"backdrop-opacity":[_,w,A]}],"backdrop-saturate":[{"backdrop-saturate":[_,w,A]}],"backdrop-sepia":[{"backdrop-sepia":["",_,w,A]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":C()}],"border-spacing-x":[{"border-spacing-x":C()}],"border-spacing-y":[{"border-spacing-y":C()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",w,A]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[_,"initial",w,A]}],ease:[{ease:["linear","initial",m,w,A]}],delay:[{delay:[_,w,A]}],animate:[{animate:["none",i,w,A]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[b,w,A]}],"perspective-origin":[{"perspective-origin":k()}],rotate:[{rotate:so()}],"rotate-x":[{"rotate-x":so()}],"rotate-y":[{"rotate-y":so()}],"rotate-z":[{"rotate-z":so()}],scale:[{scale:io()}],"scale-x":[{"scale-x":io()}],"scale-y":[{"scale-y":io()}],"scale-z":[{"scale-z":io()}],"scale-3d":["scale-3d"],skew:[{skew:cr()}],"skew-x":[{"skew-x":cr()}],"skew-y":[{"skew-y":cr()}],transform:[{transform:[w,A,"","none","gpu","cpu"]}],"transform-origin":[{origin:k()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:fo()}],"translate-x":[{"translate-x":fo()}],"translate-y":[{"translate-y":fo()}],"translate-z":[{"translate-z":fo()}],"translate-none":["translate-none"],zoom:[{zoom:[Ia,w,A]}],accent:[{accent:M()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:M()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",w,A]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scrollbar-thumb-color":[{"scrollbar-thumb":M()}],"scrollbar-track-color":[{"scrollbar-track":M()}],"scrollbar-gutter":[{"scrollbar-gutter":["auto","stable","both"]}],"scrollbar-w":[{scrollbar:["auto","thin","none"]}],"scroll-m":[{"scroll-m":C()}],"scroll-mx":[{"scroll-mx":C()}],"scroll-my":[{"scroll-my":C()}],"scroll-ms":[{"scroll-ms":C()}],"scroll-me":[{"scroll-me":C()}],"scroll-mbs":[{"scroll-mbs":C()}],"scroll-mbe":[{"scroll-mbe":C()}],"scroll-mt":[{"scroll-mt":C()}],"scroll-mr":[{"scroll-mr":C()}],"scroll-mb":[{"scroll-mb":C()}],"scroll-ml":[{"scroll-ml":C()}],"scroll-p":[{"scroll-p":C()}],"scroll-px":[{"scroll-px":C()}],"scroll-py":[{"scroll-py":C()}],"scroll-ps":[{"scroll-ps":C()}],"scroll-pe":[{"scroll-pe":C()}],"scroll-pbs":[{"scroll-pbs":C()}],"scroll-pbe":[{"scroll-pbe":C()}],"scroll-pt":[{"scroll-pt":C()}],"scroll-pr":[{"scroll-pr":C()}],"scroll-pb":[{"scroll-pb":C()}],"scroll-pl":[{"scroll-pl":C()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",w,A]}],fill:[{fill:["none",...M()]}],"stroke-w":[{stroke:[_,ao,Wt,zg]}],stroke:[{stroke:["none",...M()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{"container-named":["container-type"],overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},postfixLookupClassGroups:["container-type"],orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}};var eh=SC(PC);function we(...e){return eh($n(e))}var oh=G(se(),1),Ka=(0,uh.forwardRef)(({className:e,type:a,...t},l)=>(0,oh.jsx)("input",{type:a,className:we("flex h-11 w-full rounded-lg border-2 border-input bg-background px-3.5 py-2.5 text-base text-foreground leading-normal","placeholder:text-muted-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-primary/50","disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",e),ref:l,...t}));Ka.displayName="Input";var Yl=G(ea(),1);var nh=G(se(),1),ye=(0,Yl.forwardRef)(({className:e,autoResize:a=!0,onChange:t,...l},u)=>{let o=(0,Yl.useRef)(null),n=u||o;(0,Yl.useEffect)(()=>{a&&n.current&&(n.current.style.height="auto",n.current.style.height=n.current.scrollHeight+"px")},[l.value,a,n]);let r=s=>{a&&(s.target.style.height="auto",s.target.style.height=s.target.scrollHeight+"px"),t?.(s)};return(0,nh.jsx)("textarea",{ref:n,className:we("flex w-full rounded-lg border-2 border-input bg-background px-3.5 py-3 text-base text-foreground leading-[1.7]","placeholder:text-muted-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-primary/50","disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted","resize-y min-h-[80px]",e),onChange:r,...l})});ye.displayName="Textarea";var lr=G(se(),1);function Z({className:e,required:a,helperText:t,children:l,...u}){return(0,lr.jsxs)("label",{className:we("block text-base font-semibold text-foreground uppercase tracking-[0.03em] mb-1.5",e),...u,children:[l,a&&(0,lr.jsx)("span",{className:"text-destructive ml-1","aria-hidden":"true",children:"*"})]})}var Zl=G(se(),1);function At({title:e,children:a,className:t}){return(0,Zl.jsxs)("div",{className:we("bg-background border-2 border-border rounded-xl mb-4 overflow-hidden shadow-sm",t),children:[(0,Zl.jsxs)("div",{className:"px-4 py-3 bg-primary/5 border-b border-primary/20 text-base font-bold text-primary flex items-center gap-2",children:[(0,Zl.jsx)("span",{className:"text-base","aria-hidden":"true",children:"\u25CF"}),e]}),(0,Zl.jsx)("div",{className:"p-4 space-y-4",children:a})]})}var ni=G(se(),1);function ur({children:e,cols:a=2,className:t}){return(0,ni.jsx)("div",{className:we("grid gap-4",a===2&&"grid-cols-1 md:grid-cols-2",a===3&&"grid-cols-1 md:grid-cols-2 lg:grid-cols-3",t),children:e})}function ka({children:e,className:a}){return(0,ni.jsx)("div",{className:we("col-span-full",a),children:e})}var rh=G(ea(),1);var si=G(se(),1),Ql=(0,rh.forwardRef)(({className:e,options:a,...t},l)=>(0,si.jsx)("select",{className:we("flex h-11 w-full rounded-lg border-2 border-input bg-background px-3.5 py-2.5 text-base text-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-primary/50","disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",e),ref:l,...t,children:a.map(u=>(0,si.jsx)("option",{value:u.value,children:u.label},u.value))}));Ql.displayName="SelectNative";var fh=G(ea(),1);var sh=e=>typeof e=="boolean"?`${e}`:e===0?"0":e,dh=$n,ih=(e,a)=>t=>{var l;if(a?.variants==null)return dh(e,t?.class,t?.className);let{variants:u,defaultVariants:o}=a,n=Object.keys(u).map(d=>{let g=t?.[d],f=o?.[d];if(g===null)return null;let c=sh(g)||sh(f);return u[d][c]}),r=t&&Object.entries(t).reduce((d,g)=>{let[f,c]=g;return c===void 0||(d[f]=c),d},{}),s=a==null||(l=a.compoundVariants)===null||l===void 0?void 0:l.reduce((d,g)=>{let{class:f,className:c,...h}=g;return Object.entries(h).every(v=>{let[b,T]=v;return Array.isArray(T)?T.includes({...o,...r}[b]):{...o,...r}[b]===T})?[...d,f,c]:d},[]);return dh(e,n,s,t?.class,t?.className)};var ch=G(se(),1),VC=ih("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive",outline:"border-2 border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-accent",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary",success:"bg-green-600 text-green-50 shadow-sm hover:bg-green-600/90 active:bg-green-600",dark:"bg-neutral-950 text-white shadow-sm hover:bg-neutral-900 active:bg-neutral-950",ghost:"hover:bg-accent hover:text-accent-foreground active:bg-accent",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-11 px-5 min-w-[90px]",sm:"h-9 px-3.5 min-w-[80px]",xs:"h-7 px-2.5 min-w-0 gap-1.5 text-xs font-medium [&_svg]:size-3.5",lg:"h-12 px-6 text-base min-w-[100px]",xl:"h-13 px-7 text-lg min-w-[110px]",icon:"h-11 w-11"}},defaultVariants:{variant:"default",size:"default"}}),el=(0,fh.forwardRef)(({className:e,variant:a,size:t,...l},u)=>(0,ch.jsx)("button",{className:we(VC({variant:a,size:t,className:e})),ref:u,...l}));el.displayName="Button";var rr=G(ea(),1);var or=(...e)=>e.filter((a,t,l)=>!!a&&a.trim()!==""&&l.indexOf(a)===t).join(" ").trim();var mh=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();var ph=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,t,l)=>l?l.toUpperCase():t.toLowerCase());var di=e=>{let a=ph(e);return a.charAt(0).toUpperCase()+a.slice(1)};var to=G(ea(),1);var nr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};var gh=e=>{for(let a in e)if(a.startsWith("aria-")||a==="role"||a==="title")return!0;return!1};var Jl=G(ea(),1);var XC=(0,Jl.createContext)({});var hh=()=>(0,Jl.useContext)(XC);var xh=(0,to.forwardRef)(({color:e,size:a,strokeWidth:t,absoluteStrokeWidth:l,className:u="",children:o,iconNode:n,...r},s)=>{let{size:d=24,strokeWidth:g=2,absoluteStrokeWidth:f=!1,color:c="currentColor",className:h=""}=hh()??{},v=l??f?Number(t??g)*24/Number(a??d):t??g;return(0,to.createElement)("svg",{ref:s,...nr,width:a??d??nr.width,height:a??d??nr.height,stroke:e??c,strokeWidth:v,className:or("lucide",h,u),...!o&&!gh(r)&&{"aria-hidden":"true"},...r},[...n.map(([b,T])=>(0,to.createElement)(b,T)),...Array.isArray(o)?o:[o]])});var wt=(e,a)=>{let t=(0,rr.forwardRef)(({className:l,...u},o)=>(0,rr.createElement)(xh,{ref:o,iconNode:a,className:or(`lucide-${mh(di(e))}`,`lucide-${e}`,l),...u}));return t.displayName=di(e),t};var jC=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],lo=wt("check",jC);var KC=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],uo=wt("info",KC);var YC=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],Tt=wt("triangle-alert",YC);var ZC=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Wl=wt("x",ZC);var $l=G(se(),1),QC={default:"bg-primary/10 text-primary border-primary/20",success:"bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",warning:"bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",danger:"bg-destructive/10 text-destructive border-destructive/20"},JC={default:uo,success:lo,warning:Tt,danger:Wl};function ii({variant:e="default",icon:a,children:t,className:l,onDismiss:u}){let o=JC[e];return(0,$l.jsxs)("span",{className:we("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-base font-semibold",QC[e],l),children:[a&&(0,$l.jsx)(o,{className:"size-3.5"}),t,u&&(0,$l.jsx)("button",{onClick:u,className:"ml-1 hover:opacity-70 p-0.5","aria-label":"Dismiss",children:(0,$l.jsx)(Wl,{className:"size-3.5"})})]})}var L=G(se(),1),WC=[{value:"",label:"Pilih jenis kasus"},{value:"203",label:"Jantung"},{value:"209",label:"Bedah Onkologi"},{value:"215",label:"Fisioterapi"},{value:"220",label:"Okupasi"},{value:"204",label:"Gigi"},{value:"206",label:"Jiwa"},{value:"207",label:"Mata"},{value:"211",label:"Paru"},{value:"212",label:"Syaraf"},{value:"214",label:"Urologi"},{value:"223",label:"Rehab Medis"},{value:"226",label:"Kulit Kelamin"},{value:"216",label:"Bedah Syaraf"},{value:"219",label:"Geriatri"},{value:"221",label:"Paru - Paru"},{value:"217",label:"Psikiatri"},{value:"181",label:"Kulit Kelamin"},{value:"205",label:"Non Bedah"},{value:"208",label:"Bedah"},{value:"218",label:"Orthopedi"},{value:"224",label:"Psikologi"},{value:"225",label:"Tht"},{value:"210",label:"Anak"},{value:"213",label:"Kebidanan dan Kandungan"},{value:"222",label:"Penyakit Dalam"},{value:"228",label:"Gigi"}],$C=[{value:"",label:"Pilih keadaan keluar"},{value:"31",label:"Aps / Atas Permintaan Sendiri"},{value:"73",label:"Batal Rawat Inap"},{value:"30",label:"Belum Sembuh"},{value:"121",label:"Dirujuk Lebih Tinggi"},{value:"181",label:"Melarikan Diri"},{value:"32",label:"Meninggal < 48 Jam"},{value:"74",label:"Meninggal > 8 Jam"},{value:"33",label:"Meninggal >= 48 jam"},{value:"87",label:"Pulang Hidup"}],ey=[{value:"",label:"Pilih cara keluar"},{value:"167",label:"APS/Paksa"},{value:"35",label:"Atas Permintaan Sendiri"},{value:"142",label:"Atas Persetujuan Dokter"},{value:"201",label:"Batal Rawat Inap"},{value:"141",label:"Di Rujuk"},{value:"51",label:"Diijinkan Pulang"},{value:"163",label:"Dirujuk"},{value:"164",label:"Dirujuk Lebih Rendah"},{value:"165",label:"Dirujuk Puskesmas"},{value:"162",label:"Dirujuk ke Dokter"},{value:"166",label:"Dirujuk ke Panti"},{value:"168",label:"Ke Rumah Sakit"},{value:"72",label:"Lain-lain"},{value:"169",label:"Masih Menginap"},{value:"57",label:"Masuk Rawat Inap"},{value:"58",label:"Melarikan Diri"},{value:"143",label:"Meninggal"},{value:"170",label:"Meninggal Kurang 48 Jam"},{value:"171",label:"Meninggal Lebih 48 Jam"},{value:"161",label:"Pulang Hidup"}],ay=[{value:"",label:"Pilih pemeriksaan lanjut"},{value:"52",label:"Bangsal"},{value:"88",label:"Kontrol"},{value:"11",label:"Lainnya"},{value:"8",label:"Poliklinik RS"},{value:"10",label:"Puskesmas"},{value:"9",label:"RS Lain"},{value:"49",label:"Tidak Ada"}];function Sh({kode:e,nama:a,icdType:t,onPick:l}){let[u,o]=(0,oe.useState)([]),[n,r]=(0,oe.useState)(!1),[s,d]=(0,oe.useState)(e),[g,f]=(0,oe.useState)(a);(0,oe.useEffect)(()=>{d(e)},[e]),(0,oe.useEffect)(()=>{f(a)},[a]);let[c,h]=(0,oe.useState)(-1),v=(0,oe.useRef)(void 0),b=(0,oe.useRef)(null),T=(0,oe.useRef)(null),[m,i]=(0,oe.useState)({top:0,left:0,width:0});(0,oe.useEffect)(()=>{T.current?.scrollIntoView({block:"nearest"})},[c]);let x=(0,oe.useCallback)(async p=>{if(p.length<3){o([]),r(!1);return}let I=`/rekam-medik/search?opsi=${t==="icd9"?"clauseDiagnose_icd9":"kodeicd10"}&q=${encodeURIComponent(p)}${t==="icd9"?"&limit=10":""}`;try{let de=await(await fetch(I,{credentials:"same-origin"})).text(),fa;try{fa=JSON.parse(de)}catch{fa=de.split(`
`).filter(Boolean).map(Ya=>{let Mt=Ya.split("|");return{ID:Mt[2]||"",KODE:Mt[1]||"",NAMA:Mt[0]||""}})}if(o(fa),r(fa.length>0),h(-1),b.current){let Ya=b.current.getBoundingClientRect();i({top:Ya.top,left:Ya.left,width:Ya.width})}}catch{}},[t]),S=p=>{d(p),clearTimeout(v.current),v.current=setTimeout(()=>x(p),300)},k=p=>{d(p.KODE),f(p.NAMA),r(!1),l(p.KODE,p.NAMA,p.ID)};(0,oe.useEffect)(()=>{let p=b.current?.getRootNode?.()??document,C=B=>{b.current&&!b.current.contains(B.target)&&r(!1)};p.addEventListener("mousedown",C);let I=B=>{let de=document.getElementById("morbis-manap-root");de&&(B.target===de||de.contains(B.target))||r(!1)};return document.addEventListener("mousedown",I),()=>{p.removeEventListener("mousedown",C),document.removeEventListener("mousedown",I)}},[]);let D=p=>{n&&(p.key==="ArrowDown"&&(p.preventDefault(),h(C=>Math.min(C+1,u.length-1))),p.key==="ArrowUp"&&(p.preventDefault(),h(C=>Math.max(C-1,0))),p.key==="Enter"&&c>=0&&(p.preventDefault(),k(u[c])),p.key==="Escape"&&r(!1))};return(0,L.jsxs)("div",{ref:b,className:"relative flex-1 min-w-0",children:[(0,L.jsxs)("div",{className:"flex gap-2",children:[(0,L.jsx)("div",{className:"flex-1 min-w-0",children:(0,L.jsx)(Ka,{value:g,onChange:p=>f(p.target.value),onKeyDown:D,placeholder:"Nama",className:"text-base font-medium","aria-label":"Nama diagnosis"})}),(0,L.jsx)("div",{className:"w-28 shrink-0",children:(0,L.jsx)(Ka,{value:s,onChange:p=>S(p.target.value),onKeyDown:D,placeholder:"Kode",className:"text-base font-mono font-semibold","aria-label":"Kode ICD"})})]}),n&&u.length>0&&(0,L.jsx)("div",{className:"fixed z-[2147483647] bg-popover border-2 border-border rounded-xl max-h-[280px] overflow-auto shadow-xl",style:{top:m.top,left:m.left,width:m.width},role:"listbox",children:u.map((p,C)=>{let I=C===c;return(0,L.jsxs)("div",{ref:I?T:void 0,onClick:()=>k(p),onMouseEnter:()=>h(C),role:"option","aria-selected":I,className:`px-4 py-3 text-base cursor-pointer border-b last:border-b-0 border-border transition-colors ${I?"bg-primary text-primary-foreground":"bg-popover hover:bg-accent"}`,children:[(0,L.jsxs)("div",{className:"flex items-center justify-between gap-2",children:[(0,L.jsx)("span",{className:`font-mono text-base font-bold ${I?"text-primary-foreground":"text-primary"}`,children:p.KODE}),I&&(0,L.jsx)("span",{className:"text-primary-foreground font-bold","aria-hidden":"true",children:"\u2713"})]}),(0,L.jsx)("div",{className:`${I?"text-primary-foreground":"text-foreground"} text-base font-medium leading-[1.6] mt-1`,children:p.NAMA})]},p.ID||`${p.KODE}-${ri}`)})})]})}function fi({items:e,icdType:a,onChange:t,onAdd:l,onRemove:u,label:o,emptyText:n}){return(0,L.jsxs)("div",{className:e.length?"mb-3":"",children:[(0,L.jsxs)("div",{className:"flex items-center gap-2.5 mb-2",children:[(0,L.jsx)("span",{className:"text-base font-bold text-foreground tracking-tight",children:o}),(0,L.jsxs)("span",{className:"text-base text-muted-foreground",children:["(",e.length," item)"]})]}),e.length>0&&(0,L.jsxs)(L.Fragment,{children:[(0,L.jsxs)("div",{className:"flex gap-2 text-base font-bold text-muted-foreground px-1 mb-1",children:[(0,L.jsx)("span",{className:"flex-1",children:"Nama"}),(0,L.jsx)("span",{className:"w-28",children:"Kode ICD"}),(0,L.jsx)("span",{className:"w-[76px] text-right",children:"Aksi"})]}),(0,L.jsx)("div",{className:"flex flex-col gap-2",children:e.map((r,s)=>(0,L.jsxs)("div",{className:"flex gap-2 items-center",children:[(0,L.jsx)(Sh,{kode:r.kode,nama:r.nama,icdType:a,onPick:(d,g,f)=>t(s,{...r,kode:d,nama:g,id:f})}),(0,L.jsx)(el,{variant:"destructive",size:"default",type:"button",onClick:()=>u(s),"aria-label":`Hapus ${o} ${s+1}`,className:"w-[76px] shrink-0",children:"Hapus"})]},s))})]}),e.length===0&&(0,L.jsx)("div",{className:"border-2 border-dashed border-border rounded-xl py-6 text-center bg-background mb-2",children:(0,L.jsx)("p",{className:"text-base text-muted-foreground",children:n})}),(0,L.jsxs)(el,{variant:"default",size:"default",type:"button",onClick:l,className:"gap-2 w-full mt-2",children:["\uFF0B Tambah"," ",o.includes("Sekunder")?"Diagnosa":o.includes("Tindakan")?"Tindakan":o.includes("Nosokomial")?"Nosokomial":"Item"]})]})}var Lh={gcs_e:4,gcs_m:6,gcs_v:5},ty={gcs_e:"1-4",gcs_m:"1-6",gcs_v:"1-5"},ly={tensi:"Tekanan Darah (TD)",nadi:"Nadi (N)",suhu:"Suhu Tubuh (S)",spo2:"Saturasi Oksigen (SpO2)",nafas:"Laju Napas (RR)",gcs_e:"GCS Mata (E)",gcs_m:"GCS Motorik (M)",gcs_v:"GCS Verbal (V)"},uy={ku:"Keadaan Umum (KU)",kes:"Kesadaran",td_pulang:"Tekanan Darah (TD)",nadi_pulang:"Nadi (N)",suhu_pulang:"Suhu Tubuh (S)",rr_pulang:"Laju Napas (RR)",spo2_pulang:"Saturasi Oksigen (SpO2)"};function Ch({data:e,onSave:a,onClose:t}){let[l,u]=(0,oe.useState)(()=>structuredClone(e)),[o,n]=(0,oe.useState)(!1),[r,s]=(0,oe.useState)(""),[d,g]=(0,oe.useState)(null),f=p=>u(C=>({...C,...p})),c=async p=>{p.preventDefault(),n(!0),s("");try{await a(l),g(new Date().toLocaleTimeString()),window.setTimeout(()=>window.location.reload(),900)}catch(C){s(C instanceof Error?C.message:"Gagal menyimpan")}finally{n(!1)}},h=(p,C)=>{let I=[...l.icd_sekunder];I[p]=C,f({icd_sekunder:I})},v=()=>f({icd_sekunder:[...l.icd_sekunder,{id:"",kode:"",nama:""}]}),b=p=>f({icd_sekunder:l.icd_sekunder.filter((C,I)=>I!==p)}),T=(p,C)=>{let I=[...l.icd_tindakan];I[p]=C,f({icd_tindakan:I})},m=()=>f({icd_tindakan:[...l.icd_tindakan,{id:"",kode:"",nama:""}]}),i=p=>f({icd_tindakan:l.icd_tindakan.filter((C,I)=>I!==p)}),x=(p,C)=>{let I=[...l.icd_nosokomial];I[p]=C,f({icd_nosokomial:I})},S=()=>f({icd_nosokomial:[...l.icd_nosokomial,{id:"",kode:"",nama:""}]}),k=p=>f({icd_nosokomial:l.icd_nosokomial.filter((C,I)=>I!==p)}),D=()=>{Dg({idVisit:l.id_visit,tipe:"ranap",title:"Riwayat Resume Rawat Inap",zIndex:2147483647,onApply:p=>u(Eg(p,l))})};return(0,L.jsxs)("form",{onSubmit:c,className:"ri-modal font-['Roboto','Segoe_UI',system-ui,sans-serif]",onClick:p=>p.stopPropagation(),children:[(0,L.jsxs)("div",{className:"flex items-center justify-between px-5 py-4 bg-primary text-white shrink-0",children:[(0,L.jsxs)("div",{className:"flex items-center gap-3 min-w-0",children:[(0,L.jsx)("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,L.jsx)("path",{d:"M22 12h-4l-3 9L9 3l-3 9H2"})}),(0,L.jsxs)("div",{children:[(0,L.jsx)("span",{className:"text-base font-bold",children:"Resume Rawat Inap"}),(0,L.jsx)("p",{className:"text-base text-white/90",children:"Lengkapi ringkasan dan ICD rawat inap"})]})]}),(0,L.jsx)("button",{type:"button",onClick:t,className:"bg-white/15 hover:bg-white/25 border-none text-white w-12 h-12 rounded-lg text-base flex items-center justify-center cursor-pointer transition-colors flex-shrink-0","aria-label":"Tutup modal",children:"\u2715"})]}),(0,L.jsxs)("div",{className:"overflow-auto p-5 flex-1 bg-muted",children:[(0,L.jsxs)("div",{className:"flex gap-4 flex-wrap items-center mb-4 p-3 px-4 bg-card border border-border rounded-lg text-base shadow-sm",children:[(0,L.jsx)("span",{className:"text-base text-muted-foreground",children:"Field bertanda (*) wajib diisi."}),[{label:"RM",value:l.norm},{label:"Pasien",value:l.pasien},{label:"Reg",value:l.noreg},{label:"Unit",value:l.unit}].map(p=>(0,L.jsxs)("span",{className:"flex items-center gap-1.5",children:[(0,L.jsx)("span",{className:"font-bold text-primary text-base uppercase tracking-wide",children:p.label}),(0,L.jsx)("span",{className:"text-foreground text-base",children:p.value||"\u2014"})]},p.label))]}),(0,L.jsx)("p",{className:"text-base text-muted-foreground mb-4 text-center md:text-left",children:"Diagnosa utama dan ICD menunjukkan ringkasan utama. Gunakan Riwayat jika ingin memulihkan log terakhir."}),(0,L.jsx)(At,{title:"Ringkasan",children:(0,L.jsxs)(ur,{cols:2,children:[(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Dokter Rawat Bersama"}),(0,L.jsx)(ye,{value:l.dokter_bersama,onChange:p=>f({dokter_bersama:p.target.value}),rows:2})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Alasan / Indikasi Rawat"}),(0,L.jsx)(ye,{value:l.alasan_rawat,onChange:p=>f({alasan_rawat:p.target.value}),rows:2})]}),(0,L.jsxs)(ka,{children:[(0,L.jsx)(Z,{children:"Anamnesa"}),(0,L.jsx)(ye,{value:l.anamnesa,onChange:p=>f({anamnesa:p.target.value}),rows:4})]}),(0,L.jsxs)(ka,{children:[(0,L.jsx)(Z,{children:"Riwayat Penyakit"}),(0,L.jsx)(ye,{value:l.riwayat_penyakit,onChange:p=>f({riwayat_penyakit:p.target.value}),rows:3})]})]})}),(0,L.jsx)(At,{title:"Vital Sign",children:(0,L.jsx)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-2.5",children:["tensi","nadi","suhu","spo2","nafas","gcs_e","gcs_m","gcs_v"].map(p=>(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:ly[p]}),(0,L.jsx)(Ka,{value:l[p],onChange:C=>{let I=Lh[p];if(I===void 0){f({[p]:C.target.value});return}let B=C.target.value.replace(/\D/g,"").slice(0,String(I).length);if(!B){f({[p]:""});return}let de=Math.min(Math.max(parseInt(B,10),1),I);f({[p]:String(de)})},inputMode:Lh[p]===void 0?void 0:"numeric",placeholder:ty[p],className:"font-semibold"})]},p))})}),(0,L.jsx)(At,{title:"Pemeriksaan & Diagnosa",children:(0,L.jsxs)(ur,{cols:2,children:[(0,L.jsxs)(ka,{children:[(0,L.jsx)(Z,{children:"Pemeriksaan Fisik"}),(0,L.jsx)(ye,{value:l.fisik_text,onChange:p=>f({fisik_text:p.target.value}),rows:5})]}),(0,L.jsxs)(ka,{children:[(0,L.jsx)(Z,{children:"Hasil Pemeriksaan Diagnostik (Lab, Rontgen, dll)"}),(0,L.jsx)(ye,{value:l.laborat,onChange:p=>f({laborat:p.target.value}),rows:4})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{required:!0,children:"Diagnosa Utama"}),(0,L.jsx)(ye,{value:l.diagnosa_primary,onChange:p=>f({diagnosa_primary:p.target.value}),rows:2})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Diagnosa Sekunder"}),(0,L.jsx)(ye,{value:l.diagnosa_skunder,onChange:p=>f({diagnosa_skunder:p.target.value}),rows:2})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Diagnosa Tindakan"}),(0,L.jsx)(ye,{value:l.diagnosa_tindakan,onChange:p=>f({diagnosa_tindakan:p.target.value}),rows:2})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Prosedur / Operasi"}),(0,L.jsx)(ye,{value:l.tindakan,onChange:p=>f({tindakan:p.target.value}),rows:2})]}),(0,L.jsxs)(ka,{children:[(0,L.jsx)(Z,{children:"Pengobatan"}),(0,L.jsx)(ye,{value:l.terapi_pengobatan,onChange:p=>f({terapi_pengobatan:p.target.value}),rows:4})]}),(0,L.jsxs)(ka,{children:[(0,L.jsx)(Z,{children:"Obat Pulang"}),(0,L.jsx)(ye,{value:l.obat_plg,onChange:p=>f({obat_plg:p.target.value}),rows:3})]}),(0,L.jsxs)(ka,{children:[(0,L.jsx)(Z,{children:"Tindakan"}),(0,L.jsx)(ye,{value:l.tindakan_dua,onChange:p=>f({tindakan_dua:p.target.value}),rows:4})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Jenis Kasus"}),(0,L.jsx)(Ql,{value:l.jenis_kasus,onChange:p=>f({jenis_kasus:p.target.value}),options:WC})]})]})}),(0,L.jsxs)(At,{title:"Diagnosa (ICD-10)",children:[(0,L.jsxs)("div",{className:"mb-3",children:[(0,L.jsx)(Z,{required:!0,children:"Diagnosa Utama"}),(0,L.jsx)(Sh,{kode:l.kode_diagnosa_utama,nama:l.diagnosa_utama_nama,icdType:"icd10",onPick:(p,C,I)=>f({kode_diagnosa_utama:p,diagnosa_utama_nama:C,id_diagnosa_utama:I})})]}),(0,L.jsx)(fi,{items:l.icd_sekunder,icdType:"icd10",onChange:h,onAdd:v,onRemove:b,label:"Diagnosa Sekunder",emptyText:"Belum ada diagnosa sekunder"})]}),(0,L.jsxs)(At,{title:"Tindakan & Infeksi Nosokomial",children:[(0,L.jsx)(fi,{items:l.icd_tindakan,icdType:"icd9",onChange:T,onAdd:m,onRemove:i,label:"Tindakan",emptyText:"Belum ada tindakan"}),(0,L.jsx)(fi,{items:l.icd_nosokomial,icdType:"icd10",onChange:x,onAdd:S,onRemove:k,label:"Infeksi Nosokomial",emptyText:"Belum ada nosokomial"})]}),(0,L.jsxs)(At,{title:"Kondisi Pulang",children:[(0,L.jsx)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3",children:["ku","kes","td_pulang","nadi_pulang","suhu_pulang","rr_pulang","spo2_pulang"].map(p=>(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:uy[p]}),(0,L.jsx)(Ka,{value:l[p],onChange:C=>f({[p]:C.target.value}),className:"font-semibold"})]},p))}),(0,L.jsxs)("div",{className:"mt-3",children:[(0,L.jsx)(Z,{children:"Catatan Kondisi Pulang"}),(0,L.jsx)(ye,{value:l.catatan_keluar,onChange:p=>f({catatan_keluar:p.target.value}),rows:2})]})]}),(0,L.jsx)(At,{title:"Keluar",children:(0,L.jsxs)(ur,{cols:2,children:[(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Keadaan Keluar"}),(0,L.jsx)(Ql,{value:l.keadaan_keluar,onChange:p=>f({keadaan_keluar:p.target.value}),options:$C})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Cara Pulang"}),(0,L.jsx)(Ql,{value:l.cara_keluar,onChange:p=>f({cara_keluar:p.target.value}),options:ey})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Tanggal Keluar"}),(0,L.jsx)(Ka,{value:l.tgl_keluar,onChange:p=>f({tgl_keluar:p.target.value})})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Pemeriksaan Lanjutan"}),(0,L.jsx)(Ql,{value:l.pemeriksaan_lanjut,onChange:p=>f({pemeriksaan_lanjut:p.target.value}),options:ay})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Jadwal Kontrol"}),(0,L.jsx)(Ka,{value:l.jadwal_kontrol,onChange:p=>f({jadwal_kontrol:p.target.value})})]}),(0,L.jsxs)("div",{children:[(0,L.jsx)(Z,{children:"Kelas"}),(0,L.jsx)(Ka,{value:l.kelas,onChange:p=>f({kelas:p.target.value})})]}),(0,L.jsxs)(ka,{children:[(0,L.jsx)(Z,{children:"Instruksi Pulang"}),(0,L.jsx)(ye,{value:l.instruksi_pulang,onChange:p=>f({instruksi_pulang:p.target.value}),rows:3})]}),(0,L.jsxs)(ka,{children:[(0,L.jsx)(Z,{children:"Penyebab Kematian"}),(0,L.jsx)(ye,{value:l.penyebab_kematian,onChange:p=>f({penyebab_kematian:p.target.value}),rows:2})]})]})})]}),(0,L.jsxs)("div",{className:"flex justify-end gap-2.5 py-3.5 px-5 border-t-2 border-border items-center shrink-0 bg-card sticky bottom-0 z-10 rounded-b-2xl",children:[r&&(0,L.jsx)(ii,{variant:"danger",icon:!0,className:"mr-auto text-base",children:r}),d&&!r&&(0,L.jsxs)(ii,{variant:"success",icon:!0,className:"mr-auto text-base",children:["Berhasil tersimpan ",d]}),(0,L.jsx)(el,{type:"button",variant:"success",onClick:D,disabled:o,size:"default",children:"Riwayat"}),(0,L.jsx)(el,{type:"button",variant:"dark",onClick:t,disabled:o,size:"default",children:"Batal"}),(0,L.jsxs)(el,{type:"submit",variant:"default",disabled:o,size:"lg",className:"px-7",children:[" ",o?"Menyimpan...":"Simpan"," "]})]})]})}var yh=G(ea(),1),sr=class extends yh.Component{constructor(){super(...arguments);this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(t,l){console.error("[RI ErrorBoundary]",t,l.componentStack),this.props.onError()}render(){return this.state.hasError?null:this.props.children}};var pi=G(se(),1),bh="/admisi/detail-rawat-inap/edit-resume-ri",oy="/rekam-medik/control/edit-resume-rawat-inap",no=null,Me=null,oo=null;function F(e,a){return e.querySelector(`[name="${a}"]`)?.value??""}function Ne(e,a){let t=e.querySelector(`textarea[name="${a}"]`);return t?.textContent?.trim()??t?.value?.trim()??""}function ci(e,a){return Array.from(e.querySelectorAll(`[name="${a}"]`)).map(t=>t.value).filter(Boolean)}function mi(e,a,t){let l=[],u=1;for(;e.querySelector(`#${a}${u}`);){let o=e.querySelector(`#kode_${a}${u}`),n=e.querySelector(`#${a}${u}`);l.push({kode:o?.value??"",nama:n?.value??"",id:t[u-1]??""}),u++}return l}function ny(e){let a=new DOMParser().parseFromString(e,"text/html"),t=ci(a,"id_diagnosa_sekunder[]"),l=ci(a,"id_tindakan[]"),u=ci(a,"id_nosokomial[]");return{id_visit:F(a,"id_visit"),id_resume_inap:F(a,"id_resume_inap"),id_user:F(a,"id_user"),id_bed:F(a,"id_bed"),unit:F(a,"unit"),noreg:F(a,"noreg"),norm:F(a,"norm"),pasien:F(a,"pasien"),dokter_bersama:F(a,"dokter_bersama"),alasan_rawat:F(a,"alasan_rawat"),anamnesa:Ne(a,"anamnesa"),riwayat_penyakit:Ne(a,"riwayat_penyakit"),tensi:F(a,"tensi"),nadi:F(a,"nadi"),suhu:F(a,"suhu"),spo2:F(a,"spo2"),nafas:F(a,"nafas"),gcs_e:F(a,"gcs_e"),gcs_m:F(a,"gcs_m"),gcs_v:F(a,"gcs_v"),fisik_text:Ne(a,"fisik_text"),laborat:Ne(a,"laborat"),diagnosa_primary:Ne(a,"diagnosa_primary"),diagnosa_skunder:Ne(a,"diagnosa_skunder"),diagnosa_tindakan:Ne(a,"diagnosa_tindakan"),tindakan:Ne(a,"tindakan"),terapi_pengobatan:Ne(a,"terapi_pengobatan"),obat_plg:Ne(a,"obat_plg"),tindakan_dua:Ne(a,"tindakan_dua"),jenis_kasus:F(a,"jenis_kasus"),kode_diagnosa_utama:a.querySelector("#kode_diagnosa_utama")?.value??"",diagnosa_utama_nama:a.querySelector("#diagnosa_utama")?.value??"",id_diagnosa_utama:F(a,"id_diagnosa_utama"),icd_sekunder:mi(a,"diagnosa_sekunder",t),icd_tindakan:mi(a,"tindakan",l),icd_nosokomial:mi(a,"nosokomial",u),ku:F(a,"ku"),kes:F(a,"kes"),td_pulang:F(a,"td_pulang"),nadi_pulang:F(a,"nadi_pulang"),suhu_pulang:F(a,"suhu_pulang"),rr_pulang:F(a,"rr_pulang"),spo2_pulang:F(a,"spo2_pulang"),catatan_keluar:Ne(a,"catatan_keluar"),keadaan_keluar:F(a,"keadaan_keluar"),cara_keluar:F(a,"cara_keluar"),penyebab_kematian:Ne(a,"penyebab_kematian"),instruksi_pulang:Ne(a,"instruksi_pulang"),tgl_keluar:F(a,"tgl_keluar"),jadwal_kontrol:F(a,"jadwal_kontrol"),pemeriksaan_lanjut:F(a,"pemeriksaan_lanjut"),kelas:F(a,"kelas"),id_kelas:F(a,"id_kelas")}}async function ry(){let e=new URLSearchParams(location.search).get("id_visit");if(!e)return null;try{let l=(await(await fetch(`/admisi/detail-rawat-inap/resume-ri?idVisit=${e}`,{credentials:"same-origin"})).text()).match(/edit\((\d+),/)?.[1]??"";l||console.warn("[RI] no existing resume found, using empty form");let u=l?`${bh}?idVisit=${e}&id=${l}`:`${bh}?idVisit=${e}`,n=await(await fetch(u,{credentials:"same-origin"})).text();return ny(n)}catch(a){return console.error("[RI] fetch failed:",a),null}}function sy(e){let a=[],t=(l,u)=>{u&&a.push([l,u])};return t("id_visit",e.id_visit),t("id_resume_inap",e.id_resume_inap),t("id_user",e.id_user),t("id_bed",e.id_bed),t("unit",e.unit),t("noreg",e.noreg),t("norm",e.norm),t("pasien",e.pasien),t("dokter_bersama",e.dokter_bersama),t("alasan_rawat",e.alasan_rawat),t("anamnesa",e.anamnesa),t("riwayat_penyakit",e.riwayat_penyakit),t("tensi",e.tensi),t("nadi",e.nadi),t("suhu",e.suhu),t("spo2",e.spo2),t("nafas",e.nafas),t("gcs_e",e.gcs_e),t("gcs_m",e.gcs_m),t("gcs_v",e.gcs_v),t("fisik_text",e.fisik_text),t("laborat",e.laborat),t("diagnosa_primary",e.diagnosa_primary),t("diagnosa_skunder",e.diagnosa_skunder),t("diagnosa_tindakan",e.diagnosa_tindakan),t("tindakan",e.tindakan),t("terapi_pengobatan",e.terapi_pengobatan),t("obat_plg",e.obat_plg),t("tindakan_dua",e.tindakan_dua),t("jenis_kasus",e.jenis_kasus),t("id_diagnosa_utama",e.id_diagnosa_utama),e.icd_sekunder.forEach(l=>t("id_diagnosa_sekunder[]",l.id)),e.icd_tindakan.forEach(l=>t("id_tindakan[]",l.id)),e.icd_nosokomial.forEach(l=>t("id_nosokomial[]",l.id)),t("ku",e.ku),t("kes",e.kes),t("td_pulang",e.td_pulang),t("nadi_pulang",e.nadi_pulang),t("suhu_pulang",e.suhu_pulang),t("rr_pulang",e.rr_pulang),t("spo2_pulang",e.spo2_pulang),t("catatan_keluar",e.catatan_keluar),t("keadaan_keluar",e.keadaan_keluar),t("cara_keluar",e.cara_keluar),t("penyebab_kematian",e.penyebab_kematian),t("instruksi_pulang",e.instruksi_pulang),t("tgl_keluar",e.tgl_keluar),t("jadwal_kontrol",e.jadwal_kontrol),t("pemeriksaan_lanjut",e.pemeriksaan_lanjut),t("kelas",e.kelas),t("id_kelas",e.id_kelas),t("save","Simpan"),a.map(([l,u])=>`${encodeURIComponent(l)}=${encodeURIComponent(u)}`).join("&")}function vh(){if(no){try{no.unmount()}catch{}no=null}let e=document.getElementById("ext-ri-container");e&&e.remove();let t=document.getElementById("morbis-manap-root")?.shadowRoot?.getElementById("ext-ri-shadow-container");if(t){try{t._reactRoot?.unmount?.()}catch{}t.remove()}document.body.classList.remove("ext-ri-open"),Me&&(Me.disabled=!1,Me.style.display="");let l=document.querySelector("[data-scroll-buttons]");l&&(l.style.display="")}function dy(e){if(document.body.classList.add("ext-ri-open"),!document.getElementById("morbis-resume-fonts")){let s=document.createElement("link");s.id="morbis-resume-fonts",s.rel="stylesheet",s.href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Lexend:wght@400;500;600;700&family=Roboto:wght@400;500;600;700&display=swap",document.head.appendChild(s)}let a=document.getElementById("ext-ri-container");a||(a=document.createElement("div"),a.id="ext-ri-container",a.className="ri-modal",a.style.cssText="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center",document.body.appendChild(a));let t=()=>{let s=document.getElementById("morbis-manap-root");if(s?.shadowRoot)return s.shadowRoot;if(s&&!s.shadowRoot)return null;s=document.createElement("div"),s.id="morbis-manap-root",s.style.cssText="position:fixed;inset:0;z-index:2147483647;pointer-events:none;display:block",document.body.appendChild(s);let d=s.attachShadow({mode:"open"}),g=document.createElement("div");g.id="app",d.appendChild(g);let f=document.createElement("style");f.id="morbis-shadow-reset",f.textContent=":host{display:block}#app{isolation:isolate;color-scheme:light}",d.appendChild(f);try{let c=`/* shadow-dom base */
*, ::before, ::after {
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
::backdrop {
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
/* ! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com *//*
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

  /* ponytail: senior preset \u2014 :root for popup/sidepanel, :host+#app for Shadow DOM (resume modals).
     Keep in sync: edit :root. */
  :root,
  :host,
  #app {
    --background: 0 0% 100%;
    --foreground: 222.2 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47% 11%;
    --primary: 221.2 83% 53%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 20% 35%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 214 32% 72%;
    --input: 214 32% 72%;
    --ring: 221 83% 53%;
    --radius: 0.75rem;
    --warning: 38 92% 50%;
    --warning-foreground: 48 96% 12%;
  }

  /* ponytail: Shadow DOM needs its own color-scheme + base reset; :host isolates from page CSS */
  :host {
    all: initial;
  }
  #app {
    color-scheme: light;
    isolation: isolate;
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
  #app *,
  #app *::before,
  #app *::after {
    box-sizing: border-box;
  }

  @theme inline {
    --color-warning: var(--warning);
    --color-warning-foreground: var(--warning-foreground);
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
.\\!container {
  width: 100% !important;
}
.container {
  width: 100%;
}
@media (min-width: 640px) {
  .\\!container {
    max-width: 640px !important;
  }
  .container {
    max-width: 640px;
  }
}
@media (min-width: 768px) {
  .\\!container {
    max-width: 768px !important;
  }
  .container {
    max-width: 768px;
  }
}
@media (min-width: 1024px) {
  .\\!container {
    max-width: 1024px !important;
  }
  .container {
    max-width: 1024px;
  }
}
@media (min-width: 1280px) {
  .\\!container {
    max-width: 1280px !important;
  }
  .container {
    max-width: 1280px;
  }
}
@media (min-width: 1536px) {
  .\\!container {
    max-width: 1536px !important;
  }
  .container {
    max-width: 1536px;
  }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.pointer-events-none {
  pointer-events: none;
}
.visible {
  visibility: visible;
}
.invisible {
  visibility: hidden;
}
.collapse {
  visibility: collapse;
}
.static {
  position: static;
}
.fixed {
  position: fixed;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.sticky {
  position: sticky;
}
.bottom-0 {
  bottom: 0px;
}
.bottom-4 {
  bottom: 1rem;
}
.left-1\\/2 {
  left: 50%;
}
.right-4 {
  right: 1rem;
}
.top-1\\/2 {
  top: 50%;
}
.z-10 {
  z-index: 10;
}
.z-50 {
  z-index: 50;
}
.z-\\[1\\] {
  z-index: 1;
}
.z-\\[2147483647\\] {
  z-index: 2147483647;
}
.col-span-full {
  grid-column: 1 / -1;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.-mb-\\[1px\\] {
  margin-bottom: -1px;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-1\\.5 {
  margin-bottom: 0.375rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.ml-1 {
  margin-left: 0.25rem;
}
.mr-1 {
  margin-right: 0.25rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mr-3 {
  margin-right: 0.75rem;
}
.mr-auto {
  margin-right: auto;
}
.mt-0\\.5 {
  margin-top: 0.125rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-3 {
  margin-top: 0.75rem;
}
.block {
  display: block;
}
.inline-block {
  display: inline-block;
}
.inline {
  display: inline;
}
.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.\\!table {
  display: table !important;
}
.table {
  display: table;
}
.grid {
  display: grid;
}
.\\!contents {
  display: contents !important;
}
.contents {
  display: contents;
}
.hidden {
  display: none;
}
.size-1\\.5 {
  width: 0.375rem;
  height: 0.375rem;
}
.size-10 {
  width: 2.5rem;
  height: 2.5rem;
}
.size-3 {
  width: 0.75rem;
  height: 0.75rem;
}
.size-3\\.5 {
  width: 0.875rem;
  height: 0.875rem;
}
.size-4 {
  width: 1rem;
  height: 1rem;
}
.size-5 {
  width: 1.25rem;
  height: 1.25rem;
}
.size-6 {
  width: 1.5rem;
  height: 1.5rem;
}
.h-1 {
  height: 0.25rem;
}
.h-10 {
  height: 2.5rem;
}
.h-11 {
  height: 2.75rem;
}
.h-12 {
  height: 3rem;
}
.h-2 {
  height: 0.5rem;
}
.h-24 {
  height: 6rem;
}
.h-4 {
  height: 1rem;
}
.h-5 {
  height: 1.25rem;
}
.h-6 {
  height: 1.5rem;
}
.h-7 {
  height: 1.75rem;
}
.h-8 {
  height: 2rem;
}
.h-9 {
  height: 2.25rem;
}
.h-\\[300px\\] {
  height: 300px;
}
.h-\\[var\\(--radix-select-trigger-height\\)\\] {
  height: var(--radix-select-trigger-height);
}
.h-full {
  height: 100%;
}
.max-h-60 {
  max-height: 15rem;
}
.max-h-\\[220px\\] {
  max-height: 220px;
}
.max-h-\\[280px\\] {
  max-height: 280px;
}
.max-h-\\[360px\\] {
  max-height: 360px;
}
.max-h-\\[600px\\] {
  max-height: 600px;
}
.min-h-11 {
  min-height: 2.75rem;
}
.min-h-\\[200px\\] {
  min-height: 200px;
}
.min-h-\\[80px\\] {
  min-height: 80px;
}
.w-10 {
  width: 2.5rem;
}
.w-11 {
  width: 2.75rem;
}
.w-12 {
  width: 3rem;
}
.w-2 {
  width: 0.5rem;
}
.w-28 {
  width: 7rem;
}
.w-4 {
  width: 1rem;
}
.w-5 {
  width: 1.25rem;
}
.w-6 {
  width: 1.5rem;
}
.w-7 {
  width: 1.75rem;
}
.w-9 {
  width: 2.25rem;
}
.w-\\[100px\\] {
  width: 100px;
}
.w-\\[120px\\] {
  width: 120px;
}
.w-\\[340px\\] {
  width: 340px;
}
.w-\\[76px\\] {
  width: 76px;
}
.w-\\[90px\\] {
  width: 90px;
}
.w-full {
  width: 100%;
}
.w-px {
  width: 1px;
}
.min-w-0 {
  min-width: 0px;
}
.min-w-\\[100px\\] {
  min-width: 100px;
}
.min-w-\\[110px\\] {
  min-width: 110px;
}
.min-w-\\[12rem\\] {
  min-width: 12rem;
}
.min-w-\\[80px\\] {
  min-width: 80px;
}
.min-w-\\[90px\\] {
  min-width: 90px;
}
.min-w-\\[var\\(--radix-select-trigger-width\\)\\] {
  min-width: var(--radix-select-trigger-width);
}
.max-w-\\[120px\\] {
  max-width: 120px;
}
.max-w-\\[140px\\] {
  max-width: 140px;
}
.max-w-\\[200px\\] {
  max-width: 200px;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-shrink {
  flex-shrink: 1;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.shrink-0 {
  flex-shrink: 0;
}
.-translate-x-1\\/2 {
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.-translate-y-1\\/2 {
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.scale-90 {
  --tw-scale-x: .9;
  --tw-scale-y: .9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
@keyframes pulse {
  50% {
    opacity: .5;
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slide-up 0.15s ease-out;
}
.cursor-default {
  cursor: default;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
.cursor-pointer {
  cursor: pointer;
}
.select-none {
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.resize-none {
  resize: none;
}
.resize-y {
  resize: vertical;
}
.resize {
  resize: both;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.flex-col {
  flex-direction: column;
}
.flex-wrap {
  flex-wrap: wrap;
}
.items-start {
  align-items: flex-start;
}
.items-center {
  align-items: center;
}
.justify-end {
  justify-content: flex-end;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-0 {
  gap: 0px;
}
.gap-1 {
  gap: 0.25rem;
}
.gap-1\\.5 {
  gap: 0.375rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-2\\.5 {
  gap: 0.625rem;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-x-8 {
  -moz-column-gap: 2rem;
       column-gap: 2rem;
}
.gap-y-3 {
  row-gap: 0.75rem;
}
.space-y-0\\.5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));
}
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}
.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.375rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.375rem * var(--tw-space-y-reverse));
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}
.space-y-2\\.5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.625rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.625rem * var(--tw-space-y-reverse));
}
.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
.space-y-5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.25rem * var(--tw-space-y-reverse));
}
.divide-y > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}
.divide-border > :not([hidden]) ~ :not([hidden]) {
  border-color: hsl(var(--border));
}
.overflow-auto {
  overflow: auto;
}
.overflow-hidden {
  overflow: hidden;
}
.overflow-y-auto {
  overflow-y: auto;
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
.break-words {
  overflow-wrap: break-word;
}
.rounded {
  border-radius: 0.25rem;
}
.rounded-full {
  border-radius: 9999px;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.rounded-md {
  border-radius: 6px;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.rounded-b-2xl {
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}
.border {
  border-width: 1px;
}
.border-2 {
  border-width: 2px;
}
.border-b {
  border-bottom-width: 1px;
}
.border-b-2 {
  border-bottom-width: 2px;
}
.border-l-2 {
  border-left-width: 2px;
}
.border-t {
  border-top-width: 1px;
}
.border-t-2 {
  border-top-width: 2px;
}
.border-dashed {
  border-style: dashed;
}
.border-none {
  border-style: none;
}
.border-\\[\\#2469f0\\] {
  --tw-border-opacity: 1;
  border-color: rgb(36 105 240 / var(--tw-border-opacity, 1));
}
.border-amber-200 {
  --tw-border-opacity: 1;
  border-color: rgb(253 230 138 / var(--tw-border-opacity, 1));
}
.border-border {
  border-color: hsl(var(--border));
}
.border-destructive {
  border-color: hsl(var(--destructive));
}
.border-destructive\\/20 {
  border-color: hsl(var(--destructive) / 0.2);
}
.border-foreground {
  border-color: hsl(var(--foreground));
}
.border-green-200 {
  --tw-border-opacity: 1;
  border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
}
.border-input {
  border-color: hsl(var(--input));
}
.border-primary {
  border-color: hsl(var(--primary));
}
.border-primary\\/20 {
  border-color: hsl(var(--primary) / 0.2);
}
.border-primary\\/50 {
  border-color: hsl(var(--primary) / 0.5);
}
.border-red-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
}
.border-red-500 {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
}
.border-transparent {
  border-color: transparent;
}
.bg-\\[\\#2469f0\\] {
  --tw-bg-opacity: 1;
  background-color: rgb(36 105 240 / var(--tw-bg-opacity, 1));
}
.bg-accent {
  background-color: hsl(var(--accent));
}
.bg-accent\\/20 {
  background-color: hsl(var(--accent) / 0.2);
}
.bg-accent\\/40 {
  background-color: hsl(var(--accent) / 0.4);
}
.bg-accent\\/50 {
  background-color: hsl(var(--accent) / 0.5);
}
.bg-amber-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(255 251 235 / var(--tw-bg-opacity, 1));
}
.bg-amber-50\\/50 {
  background-color: rgb(255 251 235 / 0.5);
}
.bg-background {
  background-color: hsl(var(--background));
}
.bg-background\\/60 {
  background-color: hsl(var(--background) / 0.6);
}
.bg-blue-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
}
.bg-blue-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}
.bg-border {
  background-color: hsl(var(--border));
}
.bg-card {
  background-color: hsl(var(--card));
}
.bg-destructive {
  background-color: hsl(var(--destructive));
}
.bg-destructive\\/10 {
  background-color: hsl(var(--destructive) / 0.1);
}
.bg-destructive\\/5 {
  background-color: hsl(var(--destructive) / 0.05);
}
.bg-foreground {
  background-color: hsl(var(--foreground));
}
.bg-gray-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
}
.bg-green-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
}
.bg-green-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
}
.bg-green-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}
.bg-green-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
}
.bg-muted {
  background-color: hsl(var(--muted));
}
.bg-muted-foreground {
  background-color: hsl(var(--muted-foreground));
}
.bg-muted\\/40 {
  background-color: hsl(var(--muted) / 0.4);
}
.bg-neutral-950 {
  --tw-bg-opacity: 1;
  background-color: rgb(10 10 10 / var(--tw-bg-opacity, 1));
}
.bg-popover {
  background-color: hsl(var(--popover));
}
.bg-primary {
  background-color: hsl(var(--primary));
}
.bg-primary\\/10 {
  background-color: hsl(var(--primary) / 0.1);
}
.bg-primary\\/5 {
  background-color: hsl(var(--primary) / 0.05);
}
.bg-red-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
}
.bg-red-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
}
.bg-red-500\\/5 {
  background-color: rgb(239 68 68 / 0.05);
}
.bg-red-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity, 1));
}
.bg-secondary {
  background-color: hsl(var(--secondary));
}
.bg-white\\/15 {
  background-color: rgb(255 255 255 / 0.15);
}
.bg-yellow-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
}
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
.from-muted {
  --tw-gradient-from: hsl(var(--muted)) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--muted) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.to-muted\\/50 {
  --tw-gradient-to: hsl(var(--muted) / 0.5) var(--tw-gradient-to-position);
}
.p-0\\.5 {
  padding: 0.125rem;
}
.p-1 {
  padding: 0.25rem;
}
.p-1\\.5 {
  padding: 0.375rem;
}
.p-2 {
  padding: 0.5rem;
}
.p-2\\.5 {
  padding: 0.625rem;
}
.p-3 {
  padding: 0.75rem;
}
.p-4 {
  padding: 1rem;
}
.p-5 {
  padding: 1.25rem;
}
.p-8 {
  padding: 2rem;
}
.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
.px-1\\.5 {
  padding-left: 0.375rem;
  padding-right: 0.375rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-2\\.5 {
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-3\\.5 {
  padding-left: 0.875rem;
  padding-right: 0.875rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.px-7 {
  padding-left: 1.75rem;
  padding-right: 1.75rem;
}
.py-0 {
  padding-top: 0px;
  padding-bottom: 0px;
}
.py-0\\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-1\\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-2\\.5 {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-3\\.5 {
  padding-top: 0.875rem;
  padding-bottom: 0.875rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.pb-1\\.5 {
  padding-bottom: 0.375rem;
}
.pb-2 {
  padding-bottom: 0.5rem;
}
.pr-20 {
  padding-right: 5rem;
}
.pt-3 {
  padding-top: 0.75rem;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.font-\\[\\'Roboto\\'\\2c \\'Segoe_UI\\'\\2c system-ui\\2c sans-serif\\] {
  font-family: 'Roboto','Segoe UI',system-ui,sans-serif;
}
.font-mono {
  font-family: JetBrains Mono, Fira Code, Consolas, monospace;
}
.text-\\[10px\\] {
  font-size: 10px;
}
.text-\\[11px\\] {
  font-size: 11px;
}
.text-\\[8px\\] {
  font-size: 8px;
}
.text-\\[9px\\] {
  font-size: 9px;
}
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-md-sm {
  font-size: 12px;
  line-height: 18px;
}
.text-md-xs {
  font-size: 11px;
  line-height: 16px;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.font-bold {
  font-weight: 700;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.uppercase {
  text-transform: uppercase;
}
.lowercase {
  text-transform: lowercase;
}
.italic {
  font-style: italic;
}
.leading-\\[1\\.6\\] {
  line-height: 1.6;
}
.leading-\\[1\\.7\\] {
  line-height: 1.7;
}
.leading-normal {
  line-height: 1.5;
}
.leading-relaxed {
  line-height: 1.625;
}
.tracking-\\[0\\.03em\\] {
  letter-spacing: 0.03em;
}
.tracking-tight {
  letter-spacing: -0.025em;
}
.tracking-wide {
  letter-spacing: 0.025em;
}
.tracking-wider {
  letter-spacing: 0.05em;
}
.text-\\[\\#2469f0\\] {
  --tw-text-opacity: 1;
  color: rgb(36 105 240 / var(--tw-text-opacity, 1));
}
.text-amber-700 {
  --tw-text-opacity: 1;
  color: rgb(180 83 9 / var(--tw-text-opacity, 1));
}
.text-background {
  color: hsl(var(--background));
}
.text-blue-700 {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}
.text-card-foreground {
  color: hsl(var(--card-foreground));
}
.text-destructive {
  color: hsl(var(--destructive));
}
.text-destructive-foreground {
  color: hsl(var(--destructive-foreground));
}
.text-destructive\\/80 {
  color: hsl(var(--destructive) / 0.8);
}
.text-foreground {
  color: hsl(var(--foreground));
}
.text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}
.text-green-50 {
  --tw-text-opacity: 1;
  color: rgb(240 253 244 / var(--tw-text-opacity, 1));
}
.text-green-500 {
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity, 1));
}
.text-green-700 {
  --tw-text-opacity: 1;
  color: rgb(21 128 61 / var(--tw-text-opacity, 1));
}
.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}
.text-popover-foreground {
  color: hsl(var(--popover-foreground));
}
.text-primary {
  color: hsl(var(--primary));
}
.text-primary-foreground {
  color: hsl(var(--primary-foreground));
}
.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}
.text-red-600 {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.text-red-700 {
  --tw-text-opacity: 1;
  color: rgb(185 28 28 / var(--tw-text-opacity, 1));
}
.text-red-800 {
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
}
.text-red-900 {
  --tw-text-opacity: 1;
  color: rgb(127 29 29 / var(--tw-text-opacity, 1));
}
.text-secondary-foreground {
  color: hsl(var(--secondary-foreground));
}
.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.text-white\\/80 {
  color: rgb(255 255 255 / 0.8);
}
.text-white\\/90 {
  color: rgb(255 255 255 / 0.9);
}
.text-yellow-600 {
  --tw-text-opacity: 1;
  color: rgb(202 138 4 / var(--tw-text-opacity, 1));
}
.text-yellow-700 {
  --tw-text-opacity: 1;
  color: rgb(161 98 7 / var(--tw-text-opacity, 1));
}
.text-yellow-800 {
  --tw-text-opacity: 1;
  color: rgb(133 77 14 / var(--tw-text-opacity, 1));
}
.underline {
  text-decoration-line: underline;
}
.underline-offset-4 {
  text-underline-offset: 4px;
}
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.opacity-0 {
  opacity: 0;
}
.opacity-30 {
  opacity: 0.3;
}
.opacity-50 {
  opacity: 0.5;
}
.opacity-60 {
  opacity: 0.6;
}
.opacity-85 {
  opacity: 0.85;
}
.opacity-90 {
  opacity: 0.9;
}
.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.outline-none {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.outline {
  outline-style: solid;
}
.ring {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.ring-0 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.blur {
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.grayscale {
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.backdrop-blur {
  --tw-backdrop-blur: blur(8px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.backdrop-filter {
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.duration-200 {
  transition-duration: 200ms;
}
.duration-300 {
  transition-duration: 300ms;
}
.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
@keyframes enter {
  from {
    opacity: var(--tw-enter-opacity, 1);
    transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0));
  }
}
@keyframes exit {
  to {
    opacity: var(--tw-exit-opacity, 1);
    transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0));
  }
}
.animate-in {
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}
.fade-in {
  --tw-enter-opacity: 0;
}
.fade-out {
  --tw-exit-opacity: 0;
}
.duration-200 {
  animation-duration: 200ms;
}
.duration-300 {
  animation-duration: 300ms;
}
.ease-in-out {
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.ease-out {
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
.running {
  animation-play-state: running;
}
.placeholder\\:text-muted-foreground::-moz-placeholder {
  color: hsl(var(--muted-foreground));
}
.placeholder\\:text-muted-foreground::placeholder {
  color: hsl(var(--muted-foreground));
}
.last\\:border-b-0:last-child {
  border-bottom-width: 0px;
}
.hover\\:bg-accent:hover {
  background-color: hsl(var(--accent));
}
.hover\\:bg-amber-100\\/50:hover {
  background-color: rgb(254 243 199 / 0.5);
}
.hover\\:bg-destructive\\/10:hover {
  background-color: hsl(var(--destructive) / 0.1);
}
.hover\\:bg-destructive\\/20:hover {
  background-color: hsl(var(--destructive) / 0.2);
}
.hover\\:bg-destructive\\/90:hover {
  background-color: hsl(var(--destructive) / 0.9);
}
.hover\\:bg-green-600\\/90:hover {
  background-color: rgb(22 163 74 / 0.9);
}
.hover\\:bg-green-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-neutral-900:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(23 23 23 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-primary\\/5:hover {
  background-color: hsl(var(--primary) / 0.05);
}
.hover\\:bg-primary\\/90:hover {
  background-color: hsl(var(--primary) / 0.9);
}
.hover\\:bg-red-500\\/10:hover {
  background-color: rgb(239 68 68 / 0.1);
}
.hover\\:bg-red-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(185 28 28 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-secondary\\/80:hover {
  background-color: hsl(var(--secondary) / 0.8);
}
.hover\\:bg-white\\/25:hover {
  background-color: rgb(255 255 255 / 0.25);
}
.hover\\:text-accent-foreground:hover {
  color: hsl(var(--accent-foreground));
}
.hover\\:text-destructive:hover {
  color: hsl(var(--destructive));
}
.hover\\:text-foreground:hover {
  color: hsl(var(--foreground));
}
.hover\\:text-red-600:hover {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.hover\\:underline:hover {
  text-decoration-line: underline;
}
.hover\\:opacity-70:hover {
  opacity: 0.7;
}
.focus\\:bg-accent:focus {
  background-color: hsl(var(--accent));
}
.focus\\:text-accent-foreground:focus {
  color: hsl(var(--accent-foreground));
}
.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus\\:ring-1:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-primary:focus {
  --tw-ring-color: hsl(var(--primary));
}
.focus\\:ring-red-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(239 68 68 / var(--tw-ring-opacity, 1));
}
.focus\\:ring-ring:focus {
  --tw-ring-color: hsl(var(--ring));
}
.focus\\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}
.focus-visible\\:outline-none:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus-visible\\:ring-2:focus-visible {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus-visible\\:ring-primary:focus-visible {
  --tw-ring-color: hsl(var(--primary));
}
.focus-visible\\:ring-ring:focus-visible {
  --tw-ring-color: hsl(var(--ring));
}
.focus-visible\\:ring-offset-1:focus-visible {
  --tw-ring-offset-width: 1px;
}
.focus-visible\\:ring-offset-2:focus-visible {
  --tw-ring-offset-width: 2px;
}
.active\\:bg-accent:active {
  background-color: hsl(var(--accent));
}
.active\\:bg-destructive:active {
  background-color: hsl(var(--destructive));
}
.active\\:bg-green-600:active {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
}
.active\\:bg-neutral-950:active {
  --tw-bg-opacity: 1;
  background-color: rgb(10 10 10 / var(--tw-bg-opacity, 1));
}
.active\\:bg-primary:active {
  background-color: hsl(var(--primary));
}
.active\\:bg-secondary:active {
  background-color: hsl(var(--secondary));
}
.disabled\\:pointer-events-none:disabled {
  pointer-events: none;
}
.disabled\\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
.disabled\\:bg-muted:disabled {
  background-color: hsl(var(--muted));
}
.disabled\\:opacity-50:disabled {
  opacity: 0.5;
}
.group:hover .group-hover\\:opacity-100 {
  opacity: 1;
}
.data-\\[disabled\\]\\:pointer-events-none[data-disabled] {
  pointer-events: none;
}
.data-\\[side\\=bottom\\]\\:translate-y-1[data-side="bottom"] {
  --tw-translate-y: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[side\\=top\\]\\:-translate-y-1[data-side="top"] {
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=checked\\]\\:translate-x-4[data-state="checked"] {
  --tw-translate-x: 1rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=unchecked\\]\\:translate-x-0[data-state="unchecked"] {
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=checked\\]\\:bg-primary[data-state="checked"] {
  background-color: hsl(var(--primary));
}
.data-\\[state\\=unchecked\\]\\:bg-input[data-state="unchecked"] {
  background-color: hsl(var(--input));
}
.data-\\[disabled\\]\\:opacity-50[data-disabled] {
  opacity: 0.5;
}
.data-\\[state\\=open\\]\\:animate-in[data-state="open"] {
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}
.data-\\[state\\=closed\\]\\:animate-out[data-state="closed"] {
  animation-name: exit;
  animation-duration: 150ms;
  --tw-exit-opacity: initial;
  --tw-exit-scale: initial;
  --tw-exit-rotate: initial;
  --tw-exit-translate-x: initial;
  --tw-exit-translate-y: initial;
}
.data-\\[state\\=closed\\]\\:fade-out-0[data-state="closed"] {
  --tw-exit-opacity: 0;
}
.data-\\[state\\=open\\]\\:fade-in-0[data-state="open"] {
  --tw-enter-opacity: 0;
}
.data-\\[state\\=closed\\]\\:zoom-out-95[data-state="closed"] {
  --tw-exit-scale: .95;
}
.data-\\[state\\=open\\]\\:zoom-in-95[data-state="open"] {
  --tw-enter-scale: .95;
}
@supports (backdrop-filter: var(--tw)) {
  .supports-\\[backdrop-filter\\]\\:bg-background\\/60 {
    background-color: hsl(var(--background) / 0.6);
  }
}
.dark\\:border-amber-800:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(146 64 14 / var(--tw-border-opacity, 1));
}
.dark\\:border-green-800:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(22 101 52 / var(--tw-border-opacity, 1));
}
.dark\\:border-red-900:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(127 29 29 / var(--tw-border-opacity, 1));
}
.dark\\:bg-amber-900\\/30:is(.dark *) {
  background-color: rgb(120 53 15 / 0.3);
}
.dark\\:bg-amber-950\\/20:is(.dark *) {
  background-color: rgb(69 26 3 / 0.2);
}
.dark\\:bg-blue-900\\/30:is(.dark *) {
  background-color: rgb(30 58 138 / 0.3);
}
.dark\\:bg-blue-950\\/20:is(.dark *) {
  background-color: rgb(23 37 84 / 0.2);
}
.dark\\:bg-green-950\\/20:is(.dark *) {
  background-color: rgb(5 46 22 / 0.2);
}
.dark\\:bg-red-950\\/20:is(.dark *) {
  background-color: rgb(69 10 10 / 0.2);
}
.dark\\:bg-yellow-950\\/30:is(.dark *) {
  background-color: rgb(66 32 6 / 0.3);
}
.dark\\:text-amber-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(252 211 77 / var(--tw-text-opacity, 1));
}
.dark\\:text-blue-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(147 197 253 / var(--tw-text-opacity, 1));
}
.dark\\:text-green-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(134 239 172 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-200:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(254 202 202 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(253 224 71 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-400:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(250 204 21 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-500:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(234 179 8 / var(--tw-text-opacity, 1));
}
@media (min-width: 640px) {
  .sm\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 768px) {
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .md\\:text-left {
    text-align: left;
  }
}
@media (min-width: 1024px) {
  .lg\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.\\[\\&\\>span\\]\\:line-clamp-1>span {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.\\[\\&\\>span\\]\\:h-3>span {
  height: 0.75rem;
}
.\\[\\&\\>span\\]\\:w-3>span {
  width: 0.75rem;
}
.data-\\[state\\=checked\\]\\:\\[\\&\\>span\\]\\:translate-x-3>span[data-state="checked"] {
  --tw-translate-x: 0.75rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.\\[\\&_svg\\]\\:pointer-events-none svg {
  pointer-events: none;
}
.\\[\\&_svg\\]\\:size-3\\.5 svg {
  width: 0.875rem;
  height: 0.875rem;
}
.\\[\\&_svg\\]\\:size-5 svg {
  width: 1.25rem;
  height: 1.25rem;
}
.\\[\\&_svg\\]\\:shrink-0 svg {
  flex-shrink: 0;
}
`;if(c=c.replace(/@import[^;]+;/g,""),c&&"adoptedStyleSheets"in d&&"CSSStyleSheet"in window)try{let h=new window.CSSStyleSheet;h.replaceSync(c),d.adoptedStyleSheets=[...d.adoptedStyleSheets,h]}catch{let h=document.createElement("style");h.textContent=c,d.appendChild(h)}else if(c){let h=document.createElement("style");h.textContent=c,d.appendChild(h)}}catch{}return d},l=t(),o=`/* shadow-dom base */
*, ::before, ::after {
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
::backdrop {
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
/* ! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com *//*
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

  /* ponytail: senior preset \u2014 :root for popup/sidepanel, :host+#app for Shadow DOM (resume modals).
     Keep in sync: edit :root. */
  :root,
  :host,
  #app {
    --background: 0 0% 100%;
    --foreground: 222.2 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47% 11%;
    --primary: 221.2 83% 53%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 20% 35%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 214 32% 72%;
    --input: 214 32% 72%;
    --ring: 221 83% 53%;
    --radius: 0.75rem;
    --warning: 38 92% 50%;
    --warning-foreground: 48 96% 12%;
  }

  /* ponytail: Shadow DOM needs its own color-scheme + base reset; :host isolates from page CSS */
  :host {
    all: initial;
  }
  #app {
    color-scheme: light;
    isolation: isolate;
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
  #app *,
  #app *::before,
  #app *::after {
    box-sizing: border-box;
  }

  @theme inline {
    --color-warning: var(--warning);
    --color-warning-foreground: var(--warning-foreground);
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
.\\!container {
  width: 100% !important;
}
.container {
  width: 100%;
}
@media (min-width: 640px) {
  .\\!container {
    max-width: 640px !important;
  }
  .container {
    max-width: 640px;
  }
}
@media (min-width: 768px) {
  .\\!container {
    max-width: 768px !important;
  }
  .container {
    max-width: 768px;
  }
}
@media (min-width: 1024px) {
  .\\!container {
    max-width: 1024px !important;
  }
  .container {
    max-width: 1024px;
  }
}
@media (min-width: 1280px) {
  .\\!container {
    max-width: 1280px !important;
  }
  .container {
    max-width: 1280px;
  }
}
@media (min-width: 1536px) {
  .\\!container {
    max-width: 1536px !important;
  }
  .container {
    max-width: 1536px;
  }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.pointer-events-none {
  pointer-events: none;
}
.visible {
  visibility: visible;
}
.invisible {
  visibility: hidden;
}
.collapse {
  visibility: collapse;
}
.static {
  position: static;
}
.fixed {
  position: fixed;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.sticky {
  position: sticky;
}
.bottom-0 {
  bottom: 0px;
}
.bottom-4 {
  bottom: 1rem;
}
.left-1\\/2 {
  left: 50%;
}
.right-4 {
  right: 1rem;
}
.top-1\\/2 {
  top: 50%;
}
.z-10 {
  z-index: 10;
}
.z-50 {
  z-index: 50;
}
.z-\\[1\\] {
  z-index: 1;
}
.z-\\[2147483647\\] {
  z-index: 2147483647;
}
.col-span-full {
  grid-column: 1 / -1;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.-mb-\\[1px\\] {
  margin-bottom: -1px;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-1\\.5 {
  margin-bottom: 0.375rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.ml-1 {
  margin-left: 0.25rem;
}
.mr-1 {
  margin-right: 0.25rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mr-3 {
  margin-right: 0.75rem;
}
.mr-auto {
  margin-right: auto;
}
.mt-0\\.5 {
  margin-top: 0.125rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-3 {
  margin-top: 0.75rem;
}
.block {
  display: block;
}
.inline-block {
  display: inline-block;
}
.inline {
  display: inline;
}
.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.\\!table {
  display: table !important;
}
.table {
  display: table;
}
.grid {
  display: grid;
}
.\\!contents {
  display: contents !important;
}
.contents {
  display: contents;
}
.hidden {
  display: none;
}
.size-1\\.5 {
  width: 0.375rem;
  height: 0.375rem;
}
.size-10 {
  width: 2.5rem;
  height: 2.5rem;
}
.size-3 {
  width: 0.75rem;
  height: 0.75rem;
}
.size-3\\.5 {
  width: 0.875rem;
  height: 0.875rem;
}
.size-4 {
  width: 1rem;
  height: 1rem;
}
.size-5 {
  width: 1.25rem;
  height: 1.25rem;
}
.size-6 {
  width: 1.5rem;
  height: 1.5rem;
}
.h-1 {
  height: 0.25rem;
}
.h-10 {
  height: 2.5rem;
}
.h-11 {
  height: 2.75rem;
}
.h-12 {
  height: 3rem;
}
.h-2 {
  height: 0.5rem;
}
.h-24 {
  height: 6rem;
}
.h-4 {
  height: 1rem;
}
.h-5 {
  height: 1.25rem;
}
.h-6 {
  height: 1.5rem;
}
.h-7 {
  height: 1.75rem;
}
.h-8 {
  height: 2rem;
}
.h-9 {
  height: 2.25rem;
}
.h-\\[300px\\] {
  height: 300px;
}
.h-\\[var\\(--radix-select-trigger-height\\)\\] {
  height: var(--radix-select-trigger-height);
}
.h-full {
  height: 100%;
}
.max-h-60 {
  max-height: 15rem;
}
.max-h-\\[220px\\] {
  max-height: 220px;
}
.max-h-\\[280px\\] {
  max-height: 280px;
}
.max-h-\\[360px\\] {
  max-height: 360px;
}
.max-h-\\[600px\\] {
  max-height: 600px;
}
.min-h-11 {
  min-height: 2.75rem;
}
.min-h-\\[200px\\] {
  min-height: 200px;
}
.min-h-\\[80px\\] {
  min-height: 80px;
}
.w-10 {
  width: 2.5rem;
}
.w-11 {
  width: 2.75rem;
}
.w-12 {
  width: 3rem;
}
.w-2 {
  width: 0.5rem;
}
.w-28 {
  width: 7rem;
}
.w-4 {
  width: 1rem;
}
.w-5 {
  width: 1.25rem;
}
.w-6 {
  width: 1.5rem;
}
.w-7 {
  width: 1.75rem;
}
.w-9 {
  width: 2.25rem;
}
.w-\\[100px\\] {
  width: 100px;
}
.w-\\[120px\\] {
  width: 120px;
}
.w-\\[340px\\] {
  width: 340px;
}
.w-\\[76px\\] {
  width: 76px;
}
.w-\\[90px\\] {
  width: 90px;
}
.w-full {
  width: 100%;
}
.w-px {
  width: 1px;
}
.min-w-0 {
  min-width: 0px;
}
.min-w-\\[100px\\] {
  min-width: 100px;
}
.min-w-\\[110px\\] {
  min-width: 110px;
}
.min-w-\\[12rem\\] {
  min-width: 12rem;
}
.min-w-\\[80px\\] {
  min-width: 80px;
}
.min-w-\\[90px\\] {
  min-width: 90px;
}
.min-w-\\[var\\(--radix-select-trigger-width\\)\\] {
  min-width: var(--radix-select-trigger-width);
}
.max-w-\\[120px\\] {
  max-width: 120px;
}
.max-w-\\[140px\\] {
  max-width: 140px;
}
.max-w-\\[200px\\] {
  max-width: 200px;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-shrink {
  flex-shrink: 1;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.shrink-0 {
  flex-shrink: 0;
}
.-translate-x-1\\/2 {
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.-translate-y-1\\/2 {
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.scale-90 {
  --tw-scale-x: .9;
  --tw-scale-y: .9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
@keyframes pulse {
  50% {
    opacity: .5;
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slide-up 0.15s ease-out;
}
.cursor-default {
  cursor: default;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
.cursor-pointer {
  cursor: pointer;
}
.select-none {
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.resize-none {
  resize: none;
}
.resize-y {
  resize: vertical;
}
.resize {
  resize: both;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.flex-col {
  flex-direction: column;
}
.flex-wrap {
  flex-wrap: wrap;
}
.items-start {
  align-items: flex-start;
}
.items-center {
  align-items: center;
}
.justify-end {
  justify-content: flex-end;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-0 {
  gap: 0px;
}
.gap-1 {
  gap: 0.25rem;
}
.gap-1\\.5 {
  gap: 0.375rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-2\\.5 {
  gap: 0.625rem;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-x-8 {
  -moz-column-gap: 2rem;
       column-gap: 2rem;
}
.gap-y-3 {
  row-gap: 0.75rem;
}
.space-y-0\\.5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));
}
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}
.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.375rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.375rem * var(--tw-space-y-reverse));
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}
.space-y-2\\.5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.625rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.625rem * var(--tw-space-y-reverse));
}
.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
.space-y-5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.25rem * var(--tw-space-y-reverse));
}
.divide-y > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}
.divide-border > :not([hidden]) ~ :not([hidden]) {
  border-color: hsl(var(--border));
}
.overflow-auto {
  overflow: auto;
}
.overflow-hidden {
  overflow: hidden;
}
.overflow-y-auto {
  overflow-y: auto;
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
.break-words {
  overflow-wrap: break-word;
}
.rounded {
  border-radius: 0.25rem;
}
.rounded-full {
  border-radius: 9999px;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.rounded-md {
  border-radius: 6px;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.rounded-b-2xl {
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}
.border {
  border-width: 1px;
}
.border-2 {
  border-width: 2px;
}
.border-b {
  border-bottom-width: 1px;
}
.border-b-2 {
  border-bottom-width: 2px;
}
.border-l-2 {
  border-left-width: 2px;
}
.border-t {
  border-top-width: 1px;
}
.border-t-2 {
  border-top-width: 2px;
}
.border-dashed {
  border-style: dashed;
}
.border-none {
  border-style: none;
}
.border-\\[\\#2469f0\\] {
  --tw-border-opacity: 1;
  border-color: rgb(36 105 240 / var(--tw-border-opacity, 1));
}
.border-amber-200 {
  --tw-border-opacity: 1;
  border-color: rgb(253 230 138 / var(--tw-border-opacity, 1));
}
.border-border {
  border-color: hsl(var(--border));
}
.border-destructive {
  border-color: hsl(var(--destructive));
}
.border-destructive\\/20 {
  border-color: hsl(var(--destructive) / 0.2);
}
.border-foreground {
  border-color: hsl(var(--foreground));
}
.border-green-200 {
  --tw-border-opacity: 1;
  border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
}
.border-input {
  border-color: hsl(var(--input));
}
.border-primary {
  border-color: hsl(var(--primary));
}
.border-primary\\/20 {
  border-color: hsl(var(--primary) / 0.2);
}
.border-primary\\/50 {
  border-color: hsl(var(--primary) / 0.5);
}
.border-red-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
}
.border-red-500 {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
}
.border-transparent {
  border-color: transparent;
}
.bg-\\[\\#2469f0\\] {
  --tw-bg-opacity: 1;
  background-color: rgb(36 105 240 / var(--tw-bg-opacity, 1));
}
.bg-accent {
  background-color: hsl(var(--accent));
}
.bg-accent\\/20 {
  background-color: hsl(var(--accent) / 0.2);
}
.bg-accent\\/40 {
  background-color: hsl(var(--accent) / 0.4);
}
.bg-accent\\/50 {
  background-color: hsl(var(--accent) / 0.5);
}
.bg-amber-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(255 251 235 / var(--tw-bg-opacity, 1));
}
.bg-amber-50\\/50 {
  background-color: rgb(255 251 235 / 0.5);
}
.bg-background {
  background-color: hsl(var(--background));
}
.bg-background\\/60 {
  background-color: hsl(var(--background) / 0.6);
}
.bg-blue-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
}
.bg-blue-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}
.bg-border {
  background-color: hsl(var(--border));
}
.bg-card {
  background-color: hsl(var(--card));
}
.bg-destructive {
  background-color: hsl(var(--destructive));
}
.bg-destructive\\/10 {
  background-color: hsl(var(--destructive) / 0.1);
}
.bg-destructive\\/5 {
  background-color: hsl(var(--destructive) / 0.05);
}
.bg-foreground {
  background-color: hsl(var(--foreground));
}
.bg-gray-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
}
.bg-green-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
}
.bg-green-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
}
.bg-green-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}
.bg-green-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
}
.bg-muted {
  background-color: hsl(var(--muted));
}
.bg-muted-foreground {
  background-color: hsl(var(--muted-foreground));
}
.bg-muted\\/40 {
  background-color: hsl(var(--muted) / 0.4);
}
.bg-neutral-950 {
  --tw-bg-opacity: 1;
  background-color: rgb(10 10 10 / var(--tw-bg-opacity, 1));
}
.bg-popover {
  background-color: hsl(var(--popover));
}
.bg-primary {
  background-color: hsl(var(--primary));
}
.bg-primary\\/10 {
  background-color: hsl(var(--primary) / 0.1);
}
.bg-primary\\/5 {
  background-color: hsl(var(--primary) / 0.05);
}
.bg-red-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
}
.bg-red-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
}
.bg-red-500\\/5 {
  background-color: rgb(239 68 68 / 0.05);
}
.bg-red-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity, 1));
}
.bg-secondary {
  background-color: hsl(var(--secondary));
}
.bg-white\\/15 {
  background-color: rgb(255 255 255 / 0.15);
}
.bg-yellow-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
}
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
.from-muted {
  --tw-gradient-from: hsl(var(--muted)) var(--tw-gradient-from-position);
  --tw-gradient-to: hsl(var(--muted) / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.to-muted\\/50 {
  --tw-gradient-to: hsl(var(--muted) / 0.5) var(--tw-gradient-to-position);
}
.p-0\\.5 {
  padding: 0.125rem;
}
.p-1 {
  padding: 0.25rem;
}
.p-1\\.5 {
  padding: 0.375rem;
}
.p-2 {
  padding: 0.5rem;
}
.p-2\\.5 {
  padding: 0.625rem;
}
.p-3 {
  padding: 0.75rem;
}
.p-4 {
  padding: 1rem;
}
.p-5 {
  padding: 1.25rem;
}
.p-8 {
  padding: 2rem;
}
.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
.px-1\\.5 {
  padding-left: 0.375rem;
  padding-right: 0.375rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-2\\.5 {
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-3\\.5 {
  padding-left: 0.875rem;
  padding-right: 0.875rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.px-7 {
  padding-left: 1.75rem;
  padding-right: 1.75rem;
}
.py-0 {
  padding-top: 0px;
  padding-bottom: 0px;
}
.py-0\\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-1\\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-2\\.5 {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-3\\.5 {
  padding-top: 0.875rem;
  padding-bottom: 0.875rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.pb-1\\.5 {
  padding-bottom: 0.375rem;
}
.pb-2 {
  padding-bottom: 0.5rem;
}
.pr-20 {
  padding-right: 5rem;
}
.pt-3 {
  padding-top: 0.75rem;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.font-\\[\\'Roboto\\'\\2c \\'Segoe_UI\\'\\2c system-ui\\2c sans-serif\\] {
  font-family: 'Roboto','Segoe UI',system-ui,sans-serif;
}
.font-mono {
  font-family: JetBrains Mono, Fira Code, Consolas, monospace;
}
.text-\\[10px\\] {
  font-size: 10px;
}
.text-\\[11px\\] {
  font-size: 11px;
}
.text-\\[8px\\] {
  font-size: 8px;
}
.text-\\[9px\\] {
  font-size: 9px;
}
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-md-sm {
  font-size: 12px;
  line-height: 18px;
}
.text-md-xs {
  font-size: 11px;
  line-height: 16px;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.font-bold {
  font-weight: 700;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.uppercase {
  text-transform: uppercase;
}
.lowercase {
  text-transform: lowercase;
}
.italic {
  font-style: italic;
}
.leading-\\[1\\.6\\] {
  line-height: 1.6;
}
.leading-\\[1\\.7\\] {
  line-height: 1.7;
}
.leading-normal {
  line-height: 1.5;
}
.leading-relaxed {
  line-height: 1.625;
}
.tracking-\\[0\\.03em\\] {
  letter-spacing: 0.03em;
}
.tracking-tight {
  letter-spacing: -0.025em;
}
.tracking-wide {
  letter-spacing: 0.025em;
}
.tracking-wider {
  letter-spacing: 0.05em;
}
.text-\\[\\#2469f0\\] {
  --tw-text-opacity: 1;
  color: rgb(36 105 240 / var(--tw-text-opacity, 1));
}
.text-amber-700 {
  --tw-text-opacity: 1;
  color: rgb(180 83 9 / var(--tw-text-opacity, 1));
}
.text-background {
  color: hsl(var(--background));
}
.text-blue-700 {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}
.text-card-foreground {
  color: hsl(var(--card-foreground));
}
.text-destructive {
  color: hsl(var(--destructive));
}
.text-destructive-foreground {
  color: hsl(var(--destructive-foreground));
}
.text-destructive\\/80 {
  color: hsl(var(--destructive) / 0.8);
}
.text-foreground {
  color: hsl(var(--foreground));
}
.text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}
.text-green-50 {
  --tw-text-opacity: 1;
  color: rgb(240 253 244 / var(--tw-text-opacity, 1));
}
.text-green-500 {
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity, 1));
}
.text-green-700 {
  --tw-text-opacity: 1;
  color: rgb(21 128 61 / var(--tw-text-opacity, 1));
}
.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}
.text-popover-foreground {
  color: hsl(var(--popover-foreground));
}
.text-primary {
  color: hsl(var(--primary));
}
.text-primary-foreground {
  color: hsl(var(--primary-foreground));
}
.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}
.text-red-600 {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.text-red-700 {
  --tw-text-opacity: 1;
  color: rgb(185 28 28 / var(--tw-text-opacity, 1));
}
.text-red-800 {
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
}
.text-red-900 {
  --tw-text-opacity: 1;
  color: rgb(127 29 29 / var(--tw-text-opacity, 1));
}
.text-secondary-foreground {
  color: hsl(var(--secondary-foreground));
}
.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.text-white\\/80 {
  color: rgb(255 255 255 / 0.8);
}
.text-white\\/90 {
  color: rgb(255 255 255 / 0.9);
}
.text-yellow-600 {
  --tw-text-opacity: 1;
  color: rgb(202 138 4 / var(--tw-text-opacity, 1));
}
.text-yellow-700 {
  --tw-text-opacity: 1;
  color: rgb(161 98 7 / var(--tw-text-opacity, 1));
}
.text-yellow-800 {
  --tw-text-opacity: 1;
  color: rgb(133 77 14 / var(--tw-text-opacity, 1));
}
.underline {
  text-decoration-line: underline;
}
.underline-offset-4 {
  text-underline-offset: 4px;
}
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.opacity-0 {
  opacity: 0;
}
.opacity-30 {
  opacity: 0.3;
}
.opacity-50 {
  opacity: 0.5;
}
.opacity-60 {
  opacity: 0.6;
}
.opacity-85 {
  opacity: 0.85;
}
.opacity-90 {
  opacity: 0.9;
}
.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.outline-none {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.outline {
  outline-style: solid;
}
.ring {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.ring-0 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.blur {
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.grayscale {
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.backdrop-blur {
  --tw-backdrop-blur: blur(8px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.backdrop-filter {
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.duration-200 {
  transition-duration: 200ms;
}
.duration-300 {
  transition-duration: 300ms;
}
.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
@keyframes enter {
  from {
    opacity: var(--tw-enter-opacity, 1);
    transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0));
  }
}
@keyframes exit {
  to {
    opacity: var(--tw-exit-opacity, 1);
    transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0));
  }
}
.animate-in {
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}
.fade-in {
  --tw-enter-opacity: 0;
}
.fade-out {
  --tw-exit-opacity: 0;
}
.duration-200 {
  animation-duration: 200ms;
}
.duration-300 {
  animation-duration: 300ms;
}
.ease-in-out {
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.ease-out {
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
.running {
  animation-play-state: running;
}
.placeholder\\:text-muted-foreground::-moz-placeholder {
  color: hsl(var(--muted-foreground));
}
.placeholder\\:text-muted-foreground::placeholder {
  color: hsl(var(--muted-foreground));
}
.last\\:border-b-0:last-child {
  border-bottom-width: 0px;
}
.hover\\:bg-accent:hover {
  background-color: hsl(var(--accent));
}
.hover\\:bg-amber-100\\/50:hover {
  background-color: rgb(254 243 199 / 0.5);
}
.hover\\:bg-destructive\\/10:hover {
  background-color: hsl(var(--destructive) / 0.1);
}
.hover\\:bg-destructive\\/20:hover {
  background-color: hsl(var(--destructive) / 0.2);
}
.hover\\:bg-destructive\\/90:hover {
  background-color: hsl(var(--destructive) / 0.9);
}
.hover\\:bg-green-600\\/90:hover {
  background-color: rgb(22 163 74 / 0.9);
}
.hover\\:bg-green-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-neutral-900:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(23 23 23 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-primary\\/5:hover {
  background-color: hsl(var(--primary) / 0.05);
}
.hover\\:bg-primary\\/90:hover {
  background-color: hsl(var(--primary) / 0.9);
}
.hover\\:bg-red-500\\/10:hover {
  background-color: rgb(239 68 68 / 0.1);
}
.hover\\:bg-red-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(185 28 28 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-secondary\\/80:hover {
  background-color: hsl(var(--secondary) / 0.8);
}
.hover\\:bg-white\\/25:hover {
  background-color: rgb(255 255 255 / 0.25);
}
.hover\\:text-accent-foreground:hover {
  color: hsl(var(--accent-foreground));
}
.hover\\:text-destructive:hover {
  color: hsl(var(--destructive));
}
.hover\\:text-foreground:hover {
  color: hsl(var(--foreground));
}
.hover\\:text-red-600:hover {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.hover\\:underline:hover {
  text-decoration-line: underline;
}
.hover\\:opacity-70:hover {
  opacity: 0.7;
}
.focus\\:bg-accent:focus {
  background-color: hsl(var(--accent));
}
.focus\\:text-accent-foreground:focus {
  color: hsl(var(--accent-foreground));
}
.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus\\:ring-1:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-primary:focus {
  --tw-ring-color: hsl(var(--primary));
}
.focus\\:ring-red-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(239 68 68 / var(--tw-ring-opacity, 1));
}
.focus\\:ring-ring:focus {
  --tw-ring-color: hsl(var(--ring));
}
.focus\\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}
.focus-visible\\:outline-none:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus-visible\\:ring-2:focus-visible {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus-visible\\:ring-primary:focus-visible {
  --tw-ring-color: hsl(var(--primary));
}
.focus-visible\\:ring-ring:focus-visible {
  --tw-ring-color: hsl(var(--ring));
}
.focus-visible\\:ring-offset-1:focus-visible {
  --tw-ring-offset-width: 1px;
}
.focus-visible\\:ring-offset-2:focus-visible {
  --tw-ring-offset-width: 2px;
}
.active\\:bg-accent:active {
  background-color: hsl(var(--accent));
}
.active\\:bg-destructive:active {
  background-color: hsl(var(--destructive));
}
.active\\:bg-green-600:active {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
}
.active\\:bg-neutral-950:active {
  --tw-bg-opacity: 1;
  background-color: rgb(10 10 10 / var(--tw-bg-opacity, 1));
}
.active\\:bg-primary:active {
  background-color: hsl(var(--primary));
}
.active\\:bg-secondary:active {
  background-color: hsl(var(--secondary));
}
.disabled\\:pointer-events-none:disabled {
  pointer-events: none;
}
.disabled\\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
.disabled\\:bg-muted:disabled {
  background-color: hsl(var(--muted));
}
.disabled\\:opacity-50:disabled {
  opacity: 0.5;
}
.group:hover .group-hover\\:opacity-100 {
  opacity: 1;
}
.data-\\[disabled\\]\\:pointer-events-none[data-disabled] {
  pointer-events: none;
}
.data-\\[side\\=bottom\\]\\:translate-y-1[data-side="bottom"] {
  --tw-translate-y: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[side\\=top\\]\\:-translate-y-1[data-side="top"] {
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=checked\\]\\:translate-x-4[data-state="checked"] {
  --tw-translate-x: 1rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=unchecked\\]\\:translate-x-0[data-state="unchecked"] {
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.data-\\[state\\=checked\\]\\:bg-primary[data-state="checked"] {
  background-color: hsl(var(--primary));
}
.data-\\[state\\=unchecked\\]\\:bg-input[data-state="unchecked"] {
  background-color: hsl(var(--input));
}
.data-\\[disabled\\]\\:opacity-50[data-disabled] {
  opacity: 0.5;
}
.data-\\[state\\=open\\]\\:animate-in[data-state="open"] {
  animation-name: enter;
  animation-duration: 150ms;
  --tw-enter-opacity: initial;
  --tw-enter-scale: initial;
  --tw-enter-rotate: initial;
  --tw-enter-translate-x: initial;
  --tw-enter-translate-y: initial;
}
.data-\\[state\\=closed\\]\\:animate-out[data-state="closed"] {
  animation-name: exit;
  animation-duration: 150ms;
  --tw-exit-opacity: initial;
  --tw-exit-scale: initial;
  --tw-exit-rotate: initial;
  --tw-exit-translate-x: initial;
  --tw-exit-translate-y: initial;
}
.data-\\[state\\=closed\\]\\:fade-out-0[data-state="closed"] {
  --tw-exit-opacity: 0;
}
.data-\\[state\\=open\\]\\:fade-in-0[data-state="open"] {
  --tw-enter-opacity: 0;
}
.data-\\[state\\=closed\\]\\:zoom-out-95[data-state="closed"] {
  --tw-exit-scale: .95;
}
.data-\\[state\\=open\\]\\:zoom-in-95[data-state="open"] {
  --tw-enter-scale: .95;
}
@supports (backdrop-filter: var(--tw)) {
  .supports-\\[backdrop-filter\\]\\:bg-background\\/60 {
    background-color: hsl(var(--background) / 0.6);
  }
}
.dark\\:border-amber-800:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(146 64 14 / var(--tw-border-opacity, 1));
}
.dark\\:border-green-800:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(22 101 52 / var(--tw-border-opacity, 1));
}
.dark\\:border-red-900:is(.dark *) {
  --tw-border-opacity: 1;
  border-color: rgb(127 29 29 / var(--tw-border-opacity, 1));
}
.dark\\:bg-amber-900\\/30:is(.dark *) {
  background-color: rgb(120 53 15 / 0.3);
}
.dark\\:bg-amber-950\\/20:is(.dark *) {
  background-color: rgb(69 26 3 / 0.2);
}
.dark\\:bg-blue-900\\/30:is(.dark *) {
  background-color: rgb(30 58 138 / 0.3);
}
.dark\\:bg-blue-950\\/20:is(.dark *) {
  background-color: rgb(23 37 84 / 0.2);
}
.dark\\:bg-green-950\\/20:is(.dark *) {
  background-color: rgb(5 46 22 / 0.2);
}
.dark\\:bg-red-950\\/20:is(.dark *) {
  background-color: rgb(69 10 10 / 0.2);
}
.dark\\:bg-yellow-950\\/30:is(.dark *) {
  background-color: rgb(66 32 6 / 0.3);
}
.dark\\:text-amber-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(252 211 77 / var(--tw-text-opacity, 1));
}
.dark\\:text-blue-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(147 197 253 / var(--tw-text-opacity, 1));
}
.dark\\:text-green-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(134 239 172 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-200:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(254 202 202 / var(--tw-text-opacity, 1));
}
.dark\\:text-red-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-300:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(253 224 71 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-400:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(250 204 21 / var(--tw-text-opacity, 1));
}
.dark\\:text-yellow-500:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(234 179 8 / var(--tw-text-opacity, 1));
}
@media (min-width: 640px) {
  .sm\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 768px) {
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .md\\:text-left {
    text-align: left;
  }
}
@media (min-width: 1024px) {
  .lg\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.\\[\\&\\>span\\]\\:line-clamp-1>span {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.\\[\\&\\>span\\]\\:h-3>span {
  height: 0.75rem;
}
.\\[\\&\\>span\\]\\:w-3>span {
  width: 0.75rem;
}
.data-\\[state\\=checked\\]\\:\\[\\&\\>span\\]\\:translate-x-3>span[data-state="checked"] {
  --tw-translate-x: 0.75rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.\\[\\&_svg\\]\\:pointer-events-none svg {
  pointer-events: none;
}
.\\[\\&_svg\\]\\:size-3\\.5 svg {
  width: 0.875rem;
  height: 0.875rem;
}
.\\[\\&_svg\\]\\:size-5 svg {
  width: 1.25rem;
  height: 1.25rem;
}
.\\[\\&_svg\\]\\:shrink-0 svg {
  flex-shrink: 0;
}
`.replace(/@import[^;]+;/g,"");if(l&&!l.getElementById("morbis-ri-shadow-css")){let s=document.createElement("style");s.id="morbis-ri-shadow-css",s.textContent=o+`
      .ri-modal {
        background: #f8f6f3;
        border-radius: 16px;
        box-shadow: 0 25px 60px rgba(0,0,0,.25);
        width: 96%;
        max-width: 1140px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: ri-up .25s ease;
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #1a1d23;
      }
      /* Paksa Roboto 16px/1.6 di atas CSS host (termasuk yang !important):
         menang di light-DOM fallback & elemen yang tidak inherit font
         (button native). Kode ICD (.font-mono) dikecualikan. */
      .ri-modal,
      .ri-modal *:not(.font-mono) {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
      /* Dropdown bawaan browser (option/optgroup): render native, paksa eksplisit. */
      .ri-modal option,
      .ri-modal optgroup {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
      }
      .ri-modal *,
      .ri-modal *::before,
      .ri-modal *::after {
        box-sizing: border-box;
      }
      .ri-modal input,
      .ri-modal select,
      .ri-modal textarea {
        all: unset;
        box-sizing: border-box;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        cursor: default;
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
      .ri-modal input:focus,
      .ri-modal select:focus,
      .ri-modal textarea:focus {
        border-color: hsl(221.2 83.2% 53.3%);
        box-shadow: 0 0 0 2px hsl(221.2 83.2% 53.3% / 0.15);
      }
      .ri-modal textarea {
        resize: vertical;
        min-height: 80px;
        padding: 8px 10px;
      }
      .ri-modal select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        padding-right: 28px;
      }
      .ri-modal h1,
      .ri-modal h2,
      .ri-modal h3 {
        font-family: 'Lexend', system-ui, sans-serif;
      }
    `,l.appendChild(s)}if(!document.getElementById("ext-ri-css")){let s=document.createElement("style");s.id="ext-ri-css",s.textContent=o+`
        .ri-modal {
        border-radius: 16px;
        box-shadow: 0 25px 60px rgba(0,0,0,.25);
        width: 96%;
        max-width: 1140px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: ri-up .25s ease;
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #1a1d23;
      }
      /* Paksa Roboto 16px/1.6 di atas CSS host (termasuk yang !important):
         menang di light-DOM fallback & elemen yang tidak inherit font
         (button native). Kode ICD (.font-mono) dikecualikan. */
      .ri-modal,
      .ri-modal *:not(.font-mono) {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
      /* Dropdown bawaan browser (option/optgroup): render native, paksa eksplisit. */
      .ri-modal option,
      .ri-modal optgroup {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
      }
      .ri-modal *,
      .ri-modal .ri-modal *::before,
      .ri-modal .ri-modal *::after {
        box-sizing: border-box;
      }
      /* Neutralize host page button/input/select/textarea defaults */
      .ri-modal .ri-modal button,
      .ri-modal .ri-modal input,
      .ri-modal .ri-modal select,
      .ri-modal .ri-modal textarea {
        all: unset;
        box-sizing: border-box;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        cursor: default;
      }
      .ri-modal .ri-modal button {
        cursor: pointer;
        min-height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        white-space: nowrap;
        border-radius: 6px;
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        padding: 4px 10px;
        transition: background-color 0.15s, color 0.15s;
      }
      .ri-modal .ri-modal button:disabled {
        pointer-events: none;
        opacity: 0.5;
      }
      .ri-modal .ri-modal input,
      .ri-modal .ri-modal select,
      .ri-modal .ri-modal textarea {
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
      .ri-modal .ri-modal input:focus,
      .ri-modal .ri-modal select:focus,
      .ri-modal .ri-modal textarea:focus {
        border-color: hsl(221.2 83.2% 53.3%);
        box-shadow: 0 0 0 2px hsl(221.2 83.2% 53.3% / 0.15);
      }
      .ri-modal .ri-modal textarea {
        resize: vertical;
        min-height: 80px;
        padding: 8px 10px;
      }
      .ri-modal .ri-modal select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        padding-right: 28px;
      }
      .ri-modal .ri-modal h1,
      .ri-modal .ri-modal h2,
      .ri-modal .ri-modal h3 {
        font-family: 'Lexend', system-ui, sans-serif;
      }
      /* \u2500\u2500 Radix Select portal (renders outside .ri-modal) \u2500\u2500 */
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
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
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
      @keyframes ri-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    `,document.head.appendChild(s)}let n=(()=>{let s=l??t();if(!s)return a;a.style.display="none";let d=s.getElementById("app"),g=s.getElementById("ext-ri-shadow-container");g||(g=document.createElement("div"),g.id="ext-ri-shadow-container",g.style.cssText="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;pointer-events:auto",(d??s).appendChild(g)),g.style.display="flex",Me&&(Me.style.display="none");let f=document.querySelector("[data-scroll-buttons]");return f&&(f.style.display="none"),g})();no=(0,Ah.createRoot)(n);let r=async s=>{let d=sy(s),g=await fetch(oy,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:d,credentials:"same-origin"}),f=await g.text();if(!g.ok)throw new Error("HTTP "+g.status);if(/(?:Notice|Warning|Fatal error|Parse error)/i.test(f)&&f.length<300)throw new Error("PHP error");oo=null,Mg({idVisit:s.id_visit,idResume:s.id_resume_inap,tipe:"ranap",aksi:s.id_resume_inap?"ubah":"buat",before:Tg(s.id_visit,"ranap")??{},after:Bg(s)})};no.render((0,pi.jsx)(sr,{onError:()=>setTimeout(vh,0),children:(0,pi.jsx)(Ch,{data:e,onSave:r,onClose:vh})})),setTimeout(()=>{(l?.getElementById("ext-ri-shadow-container")??a).querySelectorAll("textarea").forEach(d=>{let g=d;g.addEventListener("input",()=>{g.style.height="auto",g.style.height=g.scrollHeight+"px"}),g.dispatchEvent(new Event("input"))})},0)}function Ih(){return document.documentElement.getAttribute("data-ext-resume-ranap")==="1"}function iy(e=5e3){return Ih()?Promise.resolve(!0):new Promise(a=>{let t=Date.now(),l=setInterval(()=>{Ih()?(clearInterval(l),a(!0)):Date.now()-t>e&&(clearInterval(l),a(!1))},200)})}async function kh(){!location.href.startsWith(location.origin+"/v2/m-klaim/detail-v2-refaktor")||!await iy()||["/login","/auth","/signin","/masuk","/keluar","/logout"].some(l=>location.pathname.toLowerCase().includes(l))||document.querySelectorAll('input[type="password"]').length>0||!new URLSearchParams(location.search).get("id_visit")||!(document.querySelector("input[name=jenis]")?.value??document.querySelector("select[name=jenis]")?.value??"").toUpperCase().includes("INAP")||document.getElementById("ext-ri-container")||(Me=document.createElement("button"),Me.id="ext-ri-float-btn",Me.textContent="RI",Me.title="Resume Rawat Inap",Me.style.cssText="position:fixed;right:16px;top:calc(50% + 52px);transform:translateY(-50%);z-index:2147483645;width:44px;height:44px;border-radius:10px;border:none;background:#059669;color:#fff;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2)",Me.onclick=async()=>{if(!Me.disabled){Me.disabled=!0;try{if(oo||(oo=await ry()),!oo){Yn({title:"Gagal",message:"Gagal memuat data",variant:"danger",okLabel:"OK",hideCancel:!0}),Me.disabled=!1;return}dy(oo)}catch(l){console.error("[RI] error:",l),Yn({title:"Gagal",message:l instanceof Error?l.message:String(l),variant:"danger",okLabel:"OK",hideCancel:!0}),Me.disabled=!1}}},document.body.appendChild(Me))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>kh()):kh().catch(e=>console.error("[RI] init error:",e));})();
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
lucide-react/dist/esm/icons/info.mjs:
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
