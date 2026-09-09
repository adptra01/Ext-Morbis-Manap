"use strict";var __morbis_feature=(()=>{var Qg=Object.create;var rn=Object.defineProperty;var Jg=Object.getOwnPropertyDescriptor;var Wg=Object.getOwnPropertyNames;var $g=Object.getPrototypeOf,eh=Object.prototype.hasOwnProperty;var La=(e,a)=>()=>{try{return a||e((a={exports:{}}).exports,a),a.exports}catch(t){throw a=0,t}};var ah=(e,a,t,l)=>{if(a&&typeof a=="object"||typeof a=="function")for(let u of Wg(a))!eh.call(e,u)&&u!==t&&rn(e,u,{get:()=>a[u],enumerable:!(l=Jg(a,u))||l.enumerable});return e};var G=(e,a,t)=>(t=e!=null?Qg($g(e)):{},ah(a||!e||!e.__esModule?rn(t,"default",{value:e,enumerable:!0}):t,e));var Sn=La(ae=>{"use strict";function sf(e,a){var t=e.length;e.push(a);e:for(;0<t;){var l=t-1>>>1,u=e[l];if(0<so(u,a))e[l]=a,e[t]=u,t=l;else break e}}function xa(e){return e.length===0?null:e[0]}function io(e){if(e.length===0)return null;var a=e[0],t=e.pop();if(t!==a){e[0]=t;e:for(var l=0,u=e.length,o=u>>>1;l<o;){var d=2*(l+1)-1,f=e[d],r=d+1,s=e[r];if(0>so(f,t))r<u&&0>so(s,f)?(e[l]=s,e[r]=t,l=r):(e[l]=f,e[d]=t,l=d);else if(r<u&&0>so(s,t))e[l]=s,e[r]=t,l=r;else break e}}return a}function so(e,a){var t=e.sortIndex-a.sortIndex;return t!==0?t:e.id-a.id}ae.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(sn=performance,ae.unstable_now=function(){return sn.now()}):(df=Date,nn=df.now(),ae.unstable_now=function(){return df.now()-nn});var sn,df,nn,Ma=[],ja=[],th=1,$e=null,Me=3,nf=!1,Jl=!1,Wl=!1,cf=!1,pn=typeof setTimeout=="function"?setTimeout:null,gn=typeof clearTimeout=="function"?clearTimeout:null,cn=typeof setImmediate<"u"?setImmediate:null;function no(e){for(var a=xa(ja);a!==null;){if(a.callback===null)io(ja);else if(a.startTime<=e)io(ja),a.sortIndex=a.expirationTime,sf(Ma,a);else break;a=xa(ja)}}function mf(e){if(Wl=!1,no(e),!Jl)if(xa(Ma)!==null)Jl=!0,$t||($t=!0,Wt());else{var a=xa(ja);a!==null&&pf(mf,a.startTime-e)}}var $t=!1,$l=-1,hn=5,Ln=-1;function xn(){return cf?!0:!(ae.unstable_now()-Ln<hn)}function ff(){if(cf=!1,$t){var e=ae.unstable_now();Ln=e;var a=!0;try{e:{Jl=!1,Wl&&(Wl=!1,gn($l),$l=-1),nf=!0;var t=Me;try{a:{for(no(e),$e=xa(Ma);$e!==null&&!($e.expirationTime>e&&xn());){var l=$e.callback;if(typeof l=="function"){$e.callback=null,Me=$e.priorityLevel;var u=l($e.expirationTime<=e);if(e=ae.unstable_now(),typeof u=="function"){$e.callback=u,no(e),a=!0;break a}$e===xa(Ma)&&io(Ma),no(e)}else io(Ma);$e=xa(Ma)}if($e!==null)a=!0;else{var o=xa(ja);o!==null&&pf(mf,o.startTime-e),a=!1}}break e}finally{$e=null,Me=t,nf=!1}a=void 0}}finally{a?Wt():$t=!1}}}var Wt;typeof cn=="function"?Wt=function(){cn(ff)}:typeof MessageChannel<"u"?(rf=new MessageChannel,mn=rf.port2,rf.port1.onmessage=ff,Wt=function(){mn.postMessage(null)}):Wt=function(){pn(ff,0)};var rf,mn;function pf(e,a){$l=pn(function(){e(ae.unstable_now())},a)}ae.unstable_IdlePriority=5;ae.unstable_ImmediatePriority=1;ae.unstable_LowPriority=4;ae.unstable_NormalPriority=3;ae.unstable_Profiling=null;ae.unstable_UserBlockingPriority=2;ae.unstable_cancelCallback=function(e){e.callback=null};ae.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):hn=0<e?Math.floor(1e3/e):5};ae.unstable_getCurrentPriorityLevel=function(){return Me};ae.unstable_next=function(e){switch(Me){case 1:case 2:case 3:var a=3;break;default:a=Me}var t=Me;Me=a;try{return e()}finally{Me=t}};ae.unstable_requestPaint=function(){cf=!0};ae.unstable_runWithPriority=function(e,a){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var t=Me;Me=e;try{return a()}finally{Me=t}};ae.unstable_scheduleCallback=function(e,a,t){var l=ae.unstable_now();switch(typeof t=="object"&&t!==null?(t=t.delay,t=typeof t=="number"&&0<t?l+t:l):t=l,e){case 1:var u=-1;break;case 2:u=250;break;case 5:u=1073741823;break;case 4:u=1e4;break;default:u=5e3}return u=t+u,e={id:th++,callback:a,priorityLevel:e,startTime:t,expirationTime:u,sortIndex:-1},t>l?(e.sortIndex=t,sf(ja,e),xa(Ma)===null&&e===xa(ja)&&(Wl?(gn($l),$l=-1):Wl=!0,pf(mf,t-l))):(e.sortIndex=u,sf(Ma,e),Jl||nf||(Jl=!0,$t||($t=!0,Wt()))),e};ae.unstable_shouldYield=xn;ae.unstable_wrapCallback=function(e){var a=Me;return function(){var t=Me;Me=a;try{return e.apply(this,arguments)}finally{Me=t}}}});var vn=La((iC,Cn)=>{"use strict";Cn.exports=Sn()});var Rn=La(R=>{"use strict";var Lf=Symbol.for("react.transitional.element"),lh=Symbol.for("react.portal"),uh=Symbol.for("react.fragment"),oh=Symbol.for("react.strict_mode"),dh=Symbol.for("react.profiler"),fh=Symbol.for("react.consumer"),rh=Symbol.for("react.context"),sh=Symbol.for("react.forward_ref"),nh=Symbol.for("react.suspense"),ih=Symbol.for("react.memo"),kn=Symbol.for("react.lazy"),ch=Symbol.for("react.activity"),yn=Symbol.iterator;function mh(e){return e===null||typeof e!="object"?null:(e=yn&&e[yn]||e["@@iterator"],typeof e=="function"?e:null)}var Mn={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Tn=Object.assign,wn={};function al(e,a,t){this.props=e,this.context=a,this.refs=wn,this.updater=t||Mn}al.prototype.isReactComponent={};al.prototype.setState=function(e,a){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,a,"setState")};al.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Dn(){}Dn.prototype=al.prototype;function xf(e,a,t){this.props=e,this.context=a,this.refs=wn,this.updater=t||Mn}var Sf=xf.prototype=new Dn;Sf.constructor=xf;Tn(Sf,al.prototype);Sf.isPureReactComponent=!0;var bn=Array.isArray;function hf(){}var J={H:null,A:null,T:null,S:null},Bn=Object.prototype.hasOwnProperty;function Cf(e,a,t){var l=t.ref;return{$$typeof:Lf,type:e,key:a,ref:l!==void 0?l:null,props:t}}function ph(e,a){return Cf(e.type,a,e.props)}function vf(e){return typeof e=="object"&&e!==null&&e.$$typeof===Lf}function gh(e){var a={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(t){return a[t]})}var In=/\/+/g;function gf(e,a){return typeof e=="object"&&e!==null&&e.key!=null?gh(""+e.key):a.toString(36)}function hh(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(hf,hf):(e.status="pending",e.then(function(a){e.status==="pending"&&(e.status="fulfilled",e.value=a)},function(a){e.status==="pending"&&(e.status="rejected",e.reason=a)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function el(e,a,t,l,u){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var d=!1;if(e===null)d=!0;else switch(o){case"bigint":case"string":case"number":d=!0;break;case"object":switch(e.$$typeof){case Lf:case lh:d=!0;break;case kn:return d=e._init,el(d(e._payload),a,t,l,u)}}if(d)return u=u(e),d=l===""?"."+gf(e,0):l,bn(u)?(t="",d!=null&&(t=d.replace(In,"$&/")+"/"),el(u,a,t,"",function(s){return s})):u!=null&&(vf(u)&&(u=ph(u,t+(u.key==null||e&&e.key===u.key?"":(""+u.key).replace(In,"$&/")+"/")+d)),a.push(u)),1;d=0;var f=l===""?".":l+":";if(bn(e))for(var r=0;r<e.length;r++)l=e[r],o=f+gf(l,r),d+=el(l,a,t,o,u);else if(r=mh(e),typeof r=="function")for(e=r.call(e),r=0;!(l=e.next()).done;)l=l.value,o=f+gf(l,r++),d+=el(l,a,t,o,u);else if(o==="object"){if(typeof e.then=="function")return el(hh(e),a,t,l,u);throw a=String(e),Error("Objects are not valid as a React child (found: "+(a==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":a)+"). If you meant to render a collection of children, use an array instead.")}return d}function co(e,a,t){if(e==null)return e;var l=[],u=0;return el(e,l,"","",function(o){return a.call(t,o,u++)}),l}function Lh(e){if(e._status===-1){var a=e._result;a=a(),a.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=a)}if(e._status===1)return e._result.default;throw e._result}var An=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},xh={map:co,forEach:function(e,a,t){co(e,function(){a.apply(this,arguments)},t)},count:function(e){var a=0;return co(e,function(){a++}),a},toArray:function(e){return co(e,function(a){return a})||[]},only:function(e){if(!vf(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};R.Activity=ch;R.Children=xh;R.Component=al;R.Fragment=uh;R.Profiler=dh;R.PureComponent=xf;R.StrictMode=oh;R.Suspense=nh;R.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=J;R.__COMPILER_RUNTIME={__proto__:null,c:function(e){return J.H.useMemoCache(e)}};R.cache=function(e){return function(){return e.apply(null,arguments)}};R.cacheSignal=function(){return null};R.cloneElement=function(e,a,t){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var l=Tn({},e.props),u=e.key;if(a!=null)for(o in a.key!==void 0&&(u=""+a.key),a)!Bn.call(a,o)||o==="key"||o==="__self"||o==="__source"||o==="ref"&&a.ref===void 0||(l[o]=a[o]);var o=arguments.length-2;if(o===1)l.children=t;else if(1<o){for(var d=Array(o),f=0;f<o;f++)d[f]=arguments[f+2];l.children=d}return Cf(e.type,u,l)};R.createContext=function(e){return e={$$typeof:rh,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:fh,_context:e},e};R.createElement=function(e,a,t){var l,u={},o=null;if(a!=null)for(l in a.key!==void 0&&(o=""+a.key),a)Bn.call(a,l)&&l!=="key"&&l!=="__self"&&l!=="__source"&&(u[l]=a[l]);var d=arguments.length-2;if(d===1)u.children=t;else if(1<d){for(var f=Array(d),r=0;r<d;r++)f[r]=arguments[r+2];u.children=f}if(e&&e.defaultProps)for(l in d=e.defaultProps,d)u[l]===void 0&&(u[l]=d[l]);return Cf(e,o,u)};R.createRef=function(){return{current:null}};R.forwardRef=function(e){return{$$typeof:sh,render:e}};R.isValidElement=vf;R.lazy=function(e){return{$$typeof:kn,_payload:{_status:-1,_result:e},_init:Lh}};R.memo=function(e,a){return{$$typeof:ih,type:e,compare:a===void 0?null:a}};R.startTransition=function(e){var a=J.T,t={};J.T=t;try{var l=e(),u=J.S;u!==null&&u(t,l),typeof l=="object"&&l!==null&&typeof l.then=="function"&&l.then(hf,An)}catch(o){An(o)}finally{a!==null&&t.types!==null&&(a.types=t.types),J.T=a}};R.unstable_useCacheRefresh=function(){return J.H.useCacheRefresh()};R.use=function(e){return J.H.use(e)};R.useActionState=function(e,a,t){return J.H.useActionState(e,a,t)};R.useCallback=function(e,a){return J.H.useCallback(e,a)};R.useContext=function(e){return J.H.useContext(e)};R.useDebugValue=function(){};R.useDeferredValue=function(e,a){return J.H.useDeferredValue(e,a)};R.useEffect=function(e,a){return J.H.useEffect(e,a)};R.useEffectEvent=function(e){return J.H.useEffectEvent(e)};R.useId=function(){return J.H.useId()};R.useImperativeHandle=function(e,a,t){return J.H.useImperativeHandle(e,a,t)};R.useInsertionEffect=function(e,a){return J.H.useInsertionEffect(e,a)};R.useLayoutEffect=function(e,a){return J.H.useLayoutEffect(e,a)};R.useMemo=function(e,a){return J.H.useMemo(e,a)};R.useOptimistic=function(e,a){return J.H.useOptimistic(e,a)};R.useReducer=function(e,a,t){return J.H.useReducer(e,a,t)};R.useRef=function(e){return J.H.useRef(e)};R.useState=function(e){return J.H.useState(e)};R.useSyncExternalStore=function(e,a,t){return J.H.useSyncExternalStore(e,a,t)};R.useTransition=function(){return J.H.useTransition()};R.version="19.2.8"});var ea=La((mC,On)=>{"use strict";On.exports=Rn()});var qn=La(Be=>{"use strict";var Sh=ea();function En(e){var a="https://react.dev/errors/"+e;if(1<arguments.length){a+="?args[]="+encodeURIComponent(arguments[1]);for(var t=2;t<arguments.length;t++)a+="&args[]="+encodeURIComponent(arguments[t])}return"Minified React error #"+e+"; visit "+a+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Ka(){}var De={d:{f:Ka,r:function(){throw Error(En(522))},D:Ka,C:Ka,L:Ka,m:Ka,X:Ka,S:Ka,M:Ka},p:0,findDOMNode:null},Ch=Symbol.for("react.portal");function vh(e,a,t){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Ch,key:l==null?null:""+l,children:e,containerInfo:a,implementation:t}}var eu=Sh.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function mo(e,a){if(e==="font")return"";if(typeof a=="string")return a==="use-credentials"?a:""}Be.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=De;Be.createPortal=function(e,a){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!a||a.nodeType!==1&&a.nodeType!==9&&a.nodeType!==11)throw Error(En(299));return vh(e,a,null,t)};Be.flushSync=function(e){var a=eu.T,t=De.p;try{if(eu.T=null,De.p=2,e)return e()}finally{eu.T=a,De.p=t,De.d.f()}};Be.preconnect=function(e,a){typeof e=="string"&&(a?(a=a.crossOrigin,a=typeof a=="string"?a==="use-credentials"?a:"":void 0):a=null,De.d.C(e,a))};Be.prefetchDNS=function(e){typeof e=="string"&&De.d.D(e)};Be.preinit=function(e,a){if(typeof e=="string"&&a&&typeof a.as=="string"){var t=a.as,l=mo(t,a.crossOrigin),u=typeof a.integrity=="string"?a.integrity:void 0,o=typeof a.fetchPriority=="string"?a.fetchPriority:void 0;t==="style"?De.d.S(e,typeof a.precedence=="string"?a.precedence:void 0,{crossOrigin:l,integrity:u,fetchPriority:o}):t==="script"&&De.d.X(e,{crossOrigin:l,integrity:u,fetchPriority:o,nonce:typeof a.nonce=="string"?a.nonce:void 0})}};Be.preinitModule=function(e,a){if(typeof e=="string")if(typeof a=="object"&&a!==null){if(a.as==null||a.as==="script"){var t=mo(a.as,a.crossOrigin);De.d.M(e,{crossOrigin:t,integrity:typeof a.integrity=="string"?a.integrity:void 0,nonce:typeof a.nonce=="string"?a.nonce:void 0})}}else a==null&&De.d.M(e)};Be.preload=function(e,a){if(typeof e=="string"&&typeof a=="object"&&a!==null&&typeof a.as=="string"){var t=a.as,l=mo(t,a.crossOrigin);De.d.L(e,t,{crossOrigin:l,integrity:typeof a.integrity=="string"?a.integrity:void 0,nonce:typeof a.nonce=="string"?a.nonce:void 0,type:typeof a.type=="string"?a.type:void 0,fetchPriority:typeof a.fetchPriority=="string"?a.fetchPriority:void 0,referrerPolicy:typeof a.referrerPolicy=="string"?a.referrerPolicy:void 0,imageSrcSet:typeof a.imageSrcSet=="string"?a.imageSrcSet:void 0,imageSizes:typeof a.imageSizes=="string"?a.imageSizes:void 0,media:typeof a.media=="string"?a.media:void 0})}};Be.preloadModule=function(e,a){if(typeof e=="string")if(a){var t=mo(a.as,a.crossOrigin);De.d.m(e,{as:typeof a.as=="string"&&a.as!=="script"?a.as:void 0,crossOrigin:t,integrity:typeof a.integrity=="string"?a.integrity:void 0})}else De.d.m(e)};Be.requestFormReset=function(e){De.d.r(e)};Be.unstable_batchedUpdates=function(e,a){return e(a)};Be.useFormState=function(e,a,t){return eu.H.useFormState(e,a,t)};Be.useFormStatus=function(){return eu.H.useHostTransitionStatus()};Be.version="19.2.8"});var Hn=La((gC,zn)=>{"use strict";function Un(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Un)}catch(e){console.error(e)}}Un(),zn.exports=qn()});var Qp=La(Hd=>{"use strict";var me=vn(),nc=ea(),yh=Hn();function C(e){var a="https://react.dev/errors/"+e;if(1<arguments.length){a+="?args[]="+encodeURIComponent(arguments[1]);for(var t=2;t<arguments.length;t++)a+="&args[]="+encodeURIComponent(arguments[t])}return"Minified React error #"+e+"; visit "+a+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function ic(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Fu(e){var a=e,t=e;if(e.alternate)for(;a.return;)a=a.return;else{e=a;do a=e,(a.flags&4098)!==0&&(t=a.return),e=a.return;while(e)}return a.tag===3?t:null}function cc(e){if(e.tag===13){var a=e.memoizedState;if(a===null&&(e=e.alternate,e!==null&&(a=e.memoizedState)),a!==null)return a.dehydrated}return null}function mc(e){if(e.tag===31){var a=e.memoizedState;if(a===null&&(e=e.alternate,e!==null&&(a=e.memoizedState)),a!==null)return a.dehydrated}return null}function _n(e){if(Fu(e)!==e)throw Error(C(188))}function bh(e){var a=e.alternate;if(!a){if(a=Fu(e),a===null)throw Error(C(188));return a!==e?null:e}for(var t=e,l=a;;){var u=t.return;if(u===null)break;var o=u.alternate;if(o===null){if(l=u.return,l!==null){t=l;continue}break}if(u.child===o.child){for(o=u.child;o;){if(o===t)return _n(u),e;if(o===l)return _n(u),a;o=o.sibling}throw Error(C(188))}if(t.return!==l.return)t=u,l=o;else{for(var d=!1,f=u.child;f;){if(f===t){d=!0,t=u,l=o;break}if(f===l){d=!0,l=u,t=o;break}f=f.sibling}if(!d){for(f=o.child;f;){if(f===t){d=!0,t=o,l=u;break}if(f===l){d=!0,l=o,t=u;break}f=f.sibling}if(!d)throw Error(C(189))}}if(t.alternate!==l)throw Error(C(190))}if(t.tag!==3)throw Error(C(188));return t.stateNode.current===t?e:a}function pc(e){var a=e.tag;if(a===5||a===26||a===27||a===6)return e;for(e=e.child;e!==null;){if(a=pc(e),a!==null)return a;e=e.sibling}return null}var ee=Object.assign,Ih=Symbol.for("react.element"),po=Symbol.for("react.transitional.element"),ru=Symbol.for("react.portal"),fl=Symbol.for("react.fragment"),gc=Symbol.for("react.strict_mode"),ar=Symbol.for("react.profiler"),hc=Symbol.for("react.consumer"),qa=Symbol.for("react.context"),Qr=Symbol.for("react.forward_ref"),tr=Symbol.for("react.suspense"),lr=Symbol.for("react.suspense_list"),Jr=Symbol.for("react.memo"),Qa=Symbol.for("react.lazy"),ur=Symbol.for("react.activity"),Ah=Symbol.for("react.memo_cache_sentinel"),Fn=Symbol.iterator;function au(e){return e===null||typeof e!="object"?null:(e=Fn&&e[Fn]||e["@@iterator"],typeof e=="function"?e:null)}var kh=Symbol.for("react.client.reference");function or(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===kh?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case fl:return"Fragment";case ar:return"Profiler";case gc:return"StrictMode";case tr:return"Suspense";case lr:return"SuspenseList";case ur:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case ru:return"Portal";case qa:return e.displayName||"Context";case hc:return(e._context.displayName||"Context")+".Consumer";case Qr:var a=e.render;return e=e.displayName,e||(e=a.displayName||a.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Jr:return a=e.displayName||null,a!==null?a:or(e.type)||"Memo";case Qa:a=e._payload,e=e._init;try{return or(e(a))}catch{}}return null}var su=Array.isArray,B=nc.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,N=yh.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Ot={pending:!1,data:null,method:null,action:null},dr=[],rl=-1;function ba(e){return{current:e}}function xe(e){0>rl||(e.current=dr[rl],dr[rl]=null,rl--)}function Q(e,a){rl++,dr[rl]=e.current,e.current=a}var ya=ba(null),ku=ba(null),ft=ba(null),Zo=ba(null);function jo(e,a){switch(Q(ft,a),Q(ku,e),Q(ya,null),a.nodeType){case 9:case 11:e=(e=a.documentElement)&&(e=e.namespaceURI)?Zi(e):0;break;default:if(e=a.tagName,a=a.namespaceURI)a=Zi(a),e=Up(a,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}xe(ya),Q(ya,e)}function kl(){xe(ya),xe(ku),xe(ft)}function fr(e){e.memoizedState!==null&&Q(Zo,e);var a=ya.current,t=Up(a,e.type);a!==t&&(Q(ku,e),Q(ya,t))}function Ko(e){ku.current===e&&(xe(ya),xe(ku)),Zo.current===e&&(xe(Zo),zu._currentValue=Ot)}var yf,Pn;function wt(e){if(yf===void 0)try{throw Error()}catch(t){var a=t.stack.trim().match(/\n( *(at )?)/);yf=a&&a[1]||"",Pn=-1<t.stack.indexOf(`
    at`)?" (<anonymous>)":-1<t.stack.indexOf("@")?"@unknown:0:0":""}return`
`+yf+e+Pn}var bf=!1;function If(e,a){if(!e||bf)return"";bf=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(a){var L=function(){throw Error()};if(Object.defineProperty(L.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(L,[])}catch(g){var m=g}Reflect.construct(e,[],L)}else{try{L.call()}catch(g){m=g}e.call(L.prototype)}}else{try{throw Error()}catch(g){m=g}(L=e())&&typeof L.catch=="function"&&L.catch(function(){})}}catch(g){if(g&&m&&typeof g.stack=="string")return[g.stack,m.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var o=l.DetermineComponentFrameRoot(),d=o[0],f=o[1];if(d&&f){var r=d.split(`
`),s=f.split(`
`);for(u=l=0;l<r.length&&!r[l].includes("DetermineComponentFrameRoot");)l++;for(;u<s.length&&!s[u].includes("DetermineComponentFrameRoot");)u++;if(l===r.length||u===s.length)for(l=r.length-1,u=s.length-1;1<=l&&0<=u&&r[l]!==s[u];)u--;for(;1<=l&&0<=u;l--,u--)if(r[l]!==s[u]){if(l!==1||u!==1)do if(l--,u--,0>u||r[l]!==s[u]){var h=`
`+r[l].replace(" at new "," at ");return e.displayName&&h.includes("<anonymous>")&&(h=h.replace("<anonymous>",e.displayName)),h}while(1<=l&&0<=u);break}}}finally{bf=!1,Error.prepareStackTrace=t}return(t=e?e.displayName||e.name:"")?wt(t):""}function Mh(e,a){switch(e.tag){case 26:case 27:case 5:return wt(e.type);case 16:return wt("Lazy");case 13:return e.child!==a&&a!==null?wt("Suspense Fallback"):wt("Suspense");case 19:return wt("SuspenseList");case 0:case 15:return If(e.type,!1);case 11:return If(e.type.render,!1);case 1:return If(e.type,!0);case 31:return wt("Activity");default:return""}}function Nn(e){try{var a="",t=null;do a+=Mh(e,t),t=e,e=e.return;while(e);return a}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var rr=Object.prototype.hasOwnProperty,Wr=me.unstable_scheduleCallback,Af=me.unstable_cancelCallback,Th=me.unstable_shouldYield,wh=me.unstable_requestPaint,Ye=me.unstable_now,Dh=me.unstable_getCurrentPriorityLevel,Lc=me.unstable_ImmediatePriority,xc=me.unstable_UserBlockingPriority,Qo=me.unstable_NormalPriority,Bh=me.unstable_LowPriority,Sc=me.unstable_IdlePriority,Rh=me.log,Oh=me.unstable_setDisableYieldValue,Pu=null,Ze=null;function tt(e){if(typeof Rh=="function"&&Oh(e),Ze&&typeof Ze.setStrictMode=="function")try{Ze.setStrictMode(Pu,e)}catch{}}var je=Math.clz32?Math.clz32:Uh,Eh=Math.log,qh=Math.LN2;function Uh(e){return e>>>=0,e===0?32:31-(Eh(e)/qh|0)|0}var go=256,ho=262144,Lo=4194304;function Dt(e){var a=e&42;if(a!==0)return a;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function yd(e,a,t){var l=e.pendingLanes;if(l===0)return 0;var u=0,o=e.suspendedLanes,d=e.pingedLanes;e=e.warmLanes;var f=l&134217727;return f!==0?(l=f&~o,l!==0?u=Dt(l):(d&=f,d!==0?u=Dt(d):t||(t=f&~e,t!==0&&(u=Dt(t))))):(f=l&~o,f!==0?u=Dt(f):d!==0?u=Dt(d):t||(t=l&~e,t!==0&&(u=Dt(t)))),u===0?0:a!==0&&a!==u&&(a&o)===0&&(o=u&-u,t=a&-a,o>=t||o===32&&(t&4194048)!==0)?a:u}function Nu(e,a){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&a)===0}function zh(e,a){switch(e){case 1:case 2:case 4:case 8:case 64:return a+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Cc(){var e=Lo;return Lo<<=1,(Lo&62914560)===0&&(Lo=4194304),e}function kf(e){for(var a=[],t=0;31>t;t++)a.push(e);return a}function Gu(e,a){e.pendingLanes|=a,a!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Hh(e,a,t,l,u,o){var d=e.pendingLanes;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=t,e.entangledLanes&=t,e.errorRecoveryDisabledLanes&=t,e.shellSuspendCounter=0;var f=e.entanglements,r=e.expirationTimes,s=e.hiddenUpdates;for(t=d&~t;0<t;){var h=31-je(t),L=1<<h;f[h]=0,r[h]=-1;var m=s[h];if(m!==null)for(s[h]=null,h=0;h<m.length;h++){var g=m[h];g!==null&&(g.lane&=-536870913)}t&=~L}l!==0&&vc(e,l,0),o!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=o&~(d&~a))}function vc(e,a,t){e.pendingLanes|=a,e.suspendedLanes&=~a;var l=31-je(a);e.entangledLanes|=a,e.entanglements[l]=e.entanglements[l]|1073741824|t&261930}function yc(e,a){var t=e.entangledLanes|=a;for(e=e.entanglements;t;){var l=31-je(t),u=1<<l;u&a|e[l]&a&&(e[l]|=a),t&=~u}}function bc(e,a){var t=a&-a;return t=(t&42)!==0?1:$r(t),(t&(e.suspendedLanes|a))!==0?0:t}function $r(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function es(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Ic(){var e=N.p;return e!==0?e:(e=window.event,e===void 0?32:Zp(e.type))}function Gn(e,a){var t=N.p;try{return N.p=e,a()}finally{N.p=t}}var Ct=Math.random().toString(36).slice(2),ye="__reactFiber$"+Ct,He="__reactProps$"+Ct,zl="__reactContainer$"+Ct,sr="__reactEvents$"+Ct,_h="__reactListeners$"+Ct,Fh="__reactHandles$"+Ct,Vn="__reactResources$"+Ct,Vu="__reactMarker$"+Ct;function as(e){delete e[ye],delete e[He],delete e[sr],delete e[_h],delete e[Fh]}function sl(e){var a=e[ye];if(a)return a;for(var t=e.parentNode;t;){if(a=t[zl]||t[ye]){if(t=a.alternate,a.child!==null||t!==null&&t.child!==null)for(e=Wi(e);e!==null;){if(t=e[ye])return t;e=Wi(e)}return a}e=t,t=e.parentNode}return null}function Hl(e){if(e=e[ye]||e[zl]){var a=e.tag;if(a===5||a===6||a===13||a===31||a===26||a===27||a===3)return e}return null}function nu(e){var a=e.tag;if(a===5||a===26||a===27||a===6)return e.stateNode;throw Error(C(33))}function Sl(e){var a=e[Vn];return a||(a=e[Vn]={hoistableStyles:new Map,hoistableScripts:new Map}),a}function Le(e){e[Vu]=!0}var Ac=new Set,kc={};function Gt(e,a){Ml(e,a),Ml(e+"Capture",a)}function Ml(e,a){for(kc[e]=a,e=0;e<a.length;e++)Ac.add(a[e])}var Ph=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Xn={},Yn={};function Nh(e){return rr.call(Yn,e)?!0:rr.call(Xn,e)?!1:Ph.test(e)?Yn[e]=!0:(Xn[e]=!0,!1)}function Ro(e,a,t){if(Nh(a))if(t===null)e.removeAttribute(a);else{switch(typeof t){case"undefined":case"function":case"symbol":e.removeAttribute(a);return;case"boolean":var l=a.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(a);return}}e.setAttribute(a,""+t)}}function xo(e,a,t){if(t===null)e.removeAttribute(a);else{switch(typeof t){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttribute(a,""+t)}}function Ta(e,a,t,l){if(l===null)e.removeAttribute(t);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttributeNS(a,t,""+l)}}function ta(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Mc(e){var a=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(a==="checkbox"||a==="radio")}function Gh(e,a,t){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,a);if(!e.hasOwnProperty(a)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var u=l.get,o=l.set;return Object.defineProperty(e,a,{configurable:!0,get:function(){return u.call(this)},set:function(d){t=""+d,o.call(this,d)}}),Object.defineProperty(e,a,{enumerable:l.enumerable}),{getValue:function(){return t},setValue:function(d){t=""+d},stopTracking:function(){e._valueTracker=null,delete e[a]}}}}function nr(e){if(!e._valueTracker){var a=Mc(e)?"checked":"value";e._valueTracker=Gh(e,a,""+e[a])}}function Tc(e){if(!e)return!1;var a=e._valueTracker;if(!a)return!0;var t=a.getValue(),l="";return e&&(l=Mc(e)?e.checked?"true":"false":e.value),e=l,e!==t?(a.setValue(e),!0):!1}function Jo(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Vh=/[\n"\\]/g;function oa(e){return e.replace(Vh,function(a){return"\\"+a.charCodeAt(0).toString(16)+" "})}function ir(e,a,t,l,u,o,d,f){e.name="",d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"?e.type=d:e.removeAttribute("type"),a!=null?d==="number"?(a===0&&e.value===""||e.value!=a)&&(e.value=""+ta(a)):e.value!==""+ta(a)&&(e.value=""+ta(a)):d!=="submit"&&d!=="reset"||e.removeAttribute("value"),a!=null?cr(e,d,ta(a)):t!=null?cr(e,d,ta(t)):l!=null&&e.removeAttribute("value"),u==null&&o!=null&&(e.defaultChecked=!!o),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"?e.name=""+ta(f):e.removeAttribute("name")}function wc(e,a,t,l,u,o,d,f){if(o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"&&(e.type=o),a!=null||t!=null){if(!(o!=="submit"&&o!=="reset"||a!=null)){nr(e);return}t=t!=null?""+ta(t):"",a=a!=null?""+ta(a):t,f||a===e.value||(e.value=a),e.defaultValue=a}l=l??u,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=f?e.checked:!!l,e.defaultChecked=!!l,d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"&&(e.name=d),nr(e)}function cr(e,a,t){a==="number"&&Jo(e.ownerDocument)===e||e.defaultValue===""+t||(e.defaultValue=""+t)}function Cl(e,a,t,l){if(e=e.options,a){a={};for(var u=0;u<t.length;u++)a["$"+t[u]]=!0;for(t=0;t<e.length;t++)u=a.hasOwnProperty("$"+e[t].value),e[t].selected!==u&&(e[t].selected=u),u&&l&&(e[t].defaultSelected=!0)}else{for(t=""+ta(t),a=null,u=0;u<e.length;u++){if(e[u].value===t){e[u].selected=!0,l&&(e[u].defaultSelected=!0);return}a!==null||e[u].disabled||(a=e[u])}a!==null&&(a.selected=!0)}}function Dc(e,a,t){if(a!=null&&(a=""+ta(a),a!==e.value&&(e.value=a),t==null)){e.defaultValue!==a&&(e.defaultValue=a);return}e.defaultValue=t!=null?""+ta(t):""}function Bc(e,a,t,l){if(a==null){if(l!=null){if(t!=null)throw Error(C(92));if(su(l)){if(1<l.length)throw Error(C(93));l=l[0]}t=l}t==null&&(t=""),a=t}t=ta(a),e.defaultValue=t,l=e.textContent,l===t&&l!==""&&l!==null&&(e.value=l),nr(e)}function Tl(e,a){if(a){var t=e.firstChild;if(t&&t===e.lastChild&&t.nodeType===3){t.nodeValue=a;return}}e.textContent=a}var Xh=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Zn(e,a,t){var l=a.indexOf("--")===0;t==null||typeof t=="boolean"||t===""?l?e.setProperty(a,""):a==="float"?e.cssFloat="":e[a]="":l?e.setProperty(a,t):typeof t!="number"||t===0||Xh.has(a)?a==="float"?e.cssFloat=t:e[a]=(""+t).trim():e[a]=t+"px"}function Rc(e,a,t){if(a!=null&&typeof a!="object")throw Error(C(62));if(e=e.style,t!=null){for(var l in t)!t.hasOwnProperty(l)||a!=null&&a.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var u in a)l=a[u],a.hasOwnProperty(u)&&t[u]!==l&&Zn(e,u,l)}else for(var o in a)a.hasOwnProperty(o)&&Zn(e,o,a[o])}function ts(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Yh=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Zh=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Oo(e){return Zh.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Ua(){}var mr=null;function ls(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var nl=null,vl=null;function jn(e){var a=Hl(e);if(a&&(e=a.stateNode)){var t=e[He]||null;e:switch(e=a.stateNode,a.type){case"input":if(ir(e,t.value,t.defaultValue,t.defaultValue,t.checked,t.defaultChecked,t.type,t.name),a=t.name,t.type==="radio"&&a!=null){for(t=e;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll('input[name="'+oa(""+a)+'"][type="radio"]'),a=0;a<t.length;a++){var l=t[a];if(l!==e&&l.form===e.form){var u=l[He]||null;if(!u)throw Error(C(90));ir(l,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(a=0;a<t.length;a++)l=t[a],l.form===e.form&&Tc(l)}break e;case"textarea":Dc(e,t.value,t.defaultValue);break e;case"select":a=t.value,a!=null&&Cl(e,!!t.multiple,a,!1)}}}var Mf=!1;function Oc(e,a,t){if(Mf)return e(a,t);Mf=!0;try{var l=e(a);return l}finally{if(Mf=!1,(nl!==null||vl!==null)&&(Ed(),nl&&(a=nl,e=vl,vl=nl=null,jn(a),e)))for(a=0;a<e.length;a++)jn(e[a])}}function Mu(e,a){var t=e.stateNode;if(t===null)return null;var l=t[He]||null;if(l===null)return null;t=l[a];e:switch(a){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(t&&typeof t!="function")throw Error(C(231,a,typeof t));return t}var Pa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),pr=!1;if(Pa)try{tl={},Object.defineProperty(tl,"passive",{get:function(){pr=!0}}),window.addEventListener("test",tl,tl),window.removeEventListener("test",tl,tl)}catch{pr=!1}var tl,lt=null,us=null,Eo=null;function Ec(){if(Eo)return Eo;var e,a=us,t=a.length,l,u="value"in lt?lt.value:lt.textContent,o=u.length;for(e=0;e<t&&a[e]===u[e];e++);var d=t-e;for(l=1;l<=d&&a[t-l]===u[o-l];l++);return Eo=u.slice(e,1<l?1-l:void 0)}function qo(e){var a=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&a===13&&(e=13)):e=a,e===10&&(e=13),32<=e||e===13?e:0}function So(){return!0}function Kn(){return!1}function _e(e){function a(t,l,u,o,d){this._reactName=t,this._targetInst=u,this.type=l,this.nativeEvent=o,this.target=d,this.currentTarget=null;for(var f in e)e.hasOwnProperty(f)&&(t=e[f],this[f]=t?t(o):o[f]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?So:Kn,this.isPropagationStopped=Kn,this}return ee(a.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=So)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=So)},persist:function(){},isPersistent:So}),a}var Vt={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},bd=_e(Vt),Xu=ee({},Vt,{view:0,detail:0}),jh=_e(Xu),Tf,wf,tu,Id=ee({},Xu,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:os,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==tu&&(tu&&e.type==="mousemove"?(Tf=e.screenX-tu.screenX,wf=e.screenY-tu.screenY):wf=Tf=0,tu=e),Tf)},movementY:function(e){return"movementY"in e?e.movementY:wf}}),Qn=_e(Id),Kh=ee({},Id,{dataTransfer:0}),Qh=_e(Kh),Jh=ee({},Xu,{relatedTarget:0}),Df=_e(Jh),Wh=ee({},Vt,{animationName:0,elapsedTime:0,pseudoElement:0}),$h=_e(Wh),eL=ee({},Vt,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),aL=_e(eL),tL=ee({},Vt,{data:0}),Jn=_e(tL),lL={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},uL={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},oL={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function dL(e){var a=this.nativeEvent;return a.getModifierState?a.getModifierState(e):(e=oL[e])?!!a[e]:!1}function os(){return dL}var fL=ee({},Xu,{key:function(e){if(e.key){var a=lL[e.key]||e.key;if(a!=="Unidentified")return a}return e.type==="keypress"?(e=qo(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?uL[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:os,charCode:function(e){return e.type==="keypress"?qo(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?qo(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),rL=_e(fL),sL=ee({},Id,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Wn=_e(sL),nL=ee({},Xu,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:os}),iL=_e(nL),cL=ee({},Vt,{propertyName:0,elapsedTime:0,pseudoElement:0}),mL=_e(cL),pL=ee({},Id,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),gL=_e(pL),hL=ee({},Vt,{newState:0,oldState:0}),LL=_e(hL),xL=[9,13,27,32],ds=Pa&&"CompositionEvent"in window,mu=null;Pa&&"documentMode"in document&&(mu=document.documentMode);var SL=Pa&&"TextEvent"in window&&!mu,qc=Pa&&(!ds||mu&&8<mu&&11>=mu),$n=" ",ei=!1;function Uc(e,a){switch(e){case"keyup":return xL.indexOf(a.keyCode)!==-1;case"keydown":return a.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function zc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var il=!1;function CL(e,a){switch(e){case"compositionend":return zc(a);case"keypress":return a.which!==32?null:(ei=!0,$n);case"textInput":return e=a.data,e===$n&&ei?null:e;default:return null}}function vL(e,a){if(il)return e==="compositionend"||!ds&&Uc(e,a)?(e=Ec(),Eo=us=lt=null,il=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(a.ctrlKey||a.altKey||a.metaKey)||a.ctrlKey&&a.altKey){if(a.char&&1<a.char.length)return a.char;if(a.which)return String.fromCharCode(a.which)}return null;case"compositionend":return qc&&a.locale!=="ko"?null:a.data;default:return null}}var yL={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ai(e){var a=e&&e.nodeName&&e.nodeName.toLowerCase();return a==="input"?!!yL[e.type]:a==="textarea"}function Hc(e,a,t,l){nl?vl?vl.push(l):vl=[l]:nl=l,a=gd(a,"onChange"),0<a.length&&(t=new bd("onChange","change",null,t,l),e.push({event:t,listeners:a}))}var pu=null,Tu=null;function bL(e){Op(e,0)}function Ad(e){var a=nu(e);if(Tc(a))return e}function ti(e,a){if(e==="change")return a}var _c=!1;Pa&&(Pa?(vo="oninput"in document,vo||(Bf=document.createElement("div"),Bf.setAttribute("oninput","return;"),vo=typeof Bf.oninput=="function"),Co=vo):Co=!1,_c=Co&&(!document.documentMode||9<document.documentMode));var Co,vo,Bf;function li(){pu&&(pu.detachEvent("onpropertychange",Fc),Tu=pu=null)}function Fc(e){if(e.propertyName==="value"&&Ad(Tu)){var a=[];Hc(a,Tu,e,ls(e)),Oc(bL,a)}}function IL(e,a,t){e==="focusin"?(li(),pu=a,Tu=t,pu.attachEvent("onpropertychange",Fc)):e==="focusout"&&li()}function AL(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ad(Tu)}function kL(e,a){if(e==="click")return Ad(a)}function ML(e,a){if(e==="input"||e==="change")return Ad(a)}function TL(e,a){return e===a&&(e!==0||1/e===1/a)||e!==e&&a!==a}var Qe=typeof Object.is=="function"?Object.is:TL;function wu(e,a){if(Qe(e,a))return!0;if(typeof e!="object"||e===null||typeof a!="object"||a===null)return!1;var t=Object.keys(e),l=Object.keys(a);if(t.length!==l.length)return!1;for(l=0;l<t.length;l++){var u=t[l];if(!rr.call(a,u)||!Qe(e[u],a[u]))return!1}return!0}function ui(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function oi(e,a){var t=ui(e);e=0;for(var l;t;){if(t.nodeType===3){if(l=e+t.textContent.length,e<=a&&l>=a)return{node:t,offset:a-e};e=l}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=ui(t)}}function Pc(e,a){return e&&a?e===a?!0:e&&e.nodeType===3?!1:a&&a.nodeType===3?Pc(e,a.parentNode):"contains"in e?e.contains(a):e.compareDocumentPosition?!!(e.compareDocumentPosition(a)&16):!1:!1}function Nc(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var a=Jo(e.document);a instanceof e.HTMLIFrameElement;){try{var t=typeof a.contentWindow.location.href=="string"}catch{t=!1}if(t)e=a.contentWindow;else break;a=Jo(e.document)}return a}function fs(e){var a=e&&e.nodeName&&e.nodeName.toLowerCase();return a&&(a==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||a==="textarea"||e.contentEditable==="true")}var wL=Pa&&"documentMode"in document&&11>=document.documentMode,cl=null,gr=null,gu=null,hr=!1;function di(e,a,t){var l=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;hr||cl==null||cl!==Jo(l)||(l=cl,"selectionStart"in l&&fs(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),gu&&wu(gu,l)||(gu=l,l=gd(gr,"onSelect"),0<l.length&&(a=new bd("onSelect","select",null,a,t),e.push({event:a,listeners:l}),a.target=cl)))}function Tt(e,a){var t={};return t[e.toLowerCase()]=a.toLowerCase(),t["Webkit"+e]="webkit"+a,t["Moz"+e]="moz"+a,t}var ml={animationend:Tt("Animation","AnimationEnd"),animationiteration:Tt("Animation","AnimationIteration"),animationstart:Tt("Animation","AnimationStart"),transitionrun:Tt("Transition","TransitionRun"),transitionstart:Tt("Transition","TransitionStart"),transitioncancel:Tt("Transition","TransitionCancel"),transitionend:Tt("Transition","TransitionEnd")},Rf={},Gc={};Pa&&(Gc=document.createElement("div").style,"AnimationEvent"in window||(delete ml.animationend.animation,delete ml.animationiteration.animation,delete ml.animationstart.animation),"TransitionEvent"in window||delete ml.transitionend.transition);function Xt(e){if(Rf[e])return Rf[e];if(!ml[e])return e;var a=ml[e],t;for(t in a)if(a.hasOwnProperty(t)&&t in Gc)return Rf[e]=a[t];return e}var Vc=Xt("animationend"),Xc=Xt("animationiteration"),Yc=Xt("animationstart"),DL=Xt("transitionrun"),BL=Xt("transitionstart"),RL=Xt("transitioncancel"),Zc=Xt("transitionend"),jc=new Map,Lr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Lr.push("scrollEnd");function pa(e,a){jc.set(e,a),Gt(a,[e])}var Wo=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},aa=[],pl=0,rs=0;function kd(){for(var e=pl,a=rs=pl=0;a<e;){var t=aa[a];aa[a++]=null;var l=aa[a];aa[a++]=null;var u=aa[a];aa[a++]=null;var o=aa[a];if(aa[a++]=null,l!==null&&u!==null){var d=l.pending;d===null?u.next=u:(u.next=d.next,d.next=u),l.pending=u}o!==0&&Kc(t,u,o)}}function Md(e,a,t,l){aa[pl++]=e,aa[pl++]=a,aa[pl++]=t,aa[pl++]=l,rs|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function ss(e,a,t,l){return Md(e,a,t,l),$o(e)}function Yt(e,a){return Md(e,null,null,a),$o(e)}function Kc(e,a,t){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t);for(var u=!1,o=e.return;o!==null;)o.childLanes|=t,l=o.alternate,l!==null&&(l.childLanes|=t),o.tag===22&&(e=o.stateNode,e===null||e._visibility&1||(u=!0)),e=o,o=o.return;return e.tag===3?(o=e.stateNode,u&&a!==null&&(u=31-je(t),e=o.hiddenUpdates,l=e[u],l===null?e[u]=[a]:l.push(a),a.lane=t|536870912),o):null}function $o(e){if(50<Iu)throw Iu=0,Hr=null,Error(C(185));for(var a=e.return;a!==null;)e=a,a=e.return;return e.tag===3?e.stateNode:null}var gl={};function OL(e,a,t,l){this.tag=e,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=a,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ve(e,a,t,l){return new OL(e,a,t,l)}function ns(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ha(e,a){var t=e.alternate;return t===null?(t=Ve(e.tag,a,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=a,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=e.flags&65011712,t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,a=e.dependencies,t.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext},t.sibling=e.sibling,t.index=e.index,t.ref=e.ref,t.refCleanup=e.refCleanup,t}function Qc(e,a){e.flags&=65011714;var t=e.alternate;return t===null?(e.childLanes=0,e.lanes=a,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=t.childLanes,e.lanes=t.lanes,e.child=t.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=t.memoizedProps,e.memoizedState=t.memoizedState,e.updateQueue=t.updateQueue,e.type=t.type,a=t.dependencies,e.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext}),e}function Uo(e,a,t,l,u,o){var d=0;if(l=e,typeof e=="function")ns(e)&&(d=1);else if(typeof e=="string")d=Ux(e,t,ya.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case ur:return e=Ve(31,t,a,u),e.elementType=ur,e.lanes=o,e;case fl:return Et(t.children,u,o,a);case gc:d=8,u|=24;break;case ar:return e=Ve(12,t,a,u|2),e.elementType=ar,e.lanes=o,e;case tr:return e=Ve(13,t,a,u),e.elementType=tr,e.lanes=o,e;case lr:return e=Ve(19,t,a,u),e.elementType=lr,e.lanes=o,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case qa:d=10;break e;case hc:d=9;break e;case Qr:d=11;break e;case Jr:d=14;break e;case Qa:d=16,l=null;break e}d=29,t=Error(C(130,e===null?"null":typeof e,"")),l=null}return a=Ve(d,t,a,u),a.elementType=e,a.type=l,a.lanes=o,a}function Et(e,a,t,l){return e=Ve(7,e,l,a),e.lanes=t,e}function Of(e,a,t){return e=Ve(6,e,null,a),e.lanes=t,e}function Jc(e){var a=Ve(18,null,null,0);return a.stateNode=e,a}function Ef(e,a,t){return a=Ve(4,e.children!==null?e.children:[],e.key,a),a.lanes=t,a.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},a}var fi=new WeakMap;function da(e,a){if(typeof e=="object"&&e!==null){var t=fi.get(e);return t!==void 0?t:(a={value:e,source:a,stack:Nn(a)},fi.set(e,a),a)}return{value:e,source:a,stack:Nn(a)}}var hl=[],Ll=0,ed=null,Du=0,la=[],ua=0,ht=null,Sa=1,Ca="";function Oa(e,a){hl[Ll++]=Du,hl[Ll++]=ed,ed=e,Du=a}function Wc(e,a,t){la[ua++]=Sa,la[ua++]=Ca,la[ua++]=ht,ht=e;var l=Sa;e=Ca;var u=32-je(l)-1;l&=~(1<<u),t+=1;var o=32-je(a)+u;if(30<o){var d=u-u%5;o=(l&(1<<d)-1).toString(32),l>>=d,u-=d,Sa=1<<32-je(a)+u|t<<u|l,Ca=o+e}else Sa=1<<o|t<<u|l,Ca=e}function is(e){e.return!==null&&(Oa(e,1),Wc(e,1,0))}function cs(e){for(;e===ed;)ed=hl[--Ll],hl[Ll]=null,Du=hl[--Ll],hl[Ll]=null;for(;e===ht;)ht=la[--ua],la[ua]=null,Ca=la[--ua],la[ua]=null,Sa=la[--ua],la[ua]=null}function $c(e,a){la[ua++]=Sa,la[ua++]=Ca,la[ua++]=ht,Sa=a.id,Ca=a.overflow,ht=e}var be=null,$=null,_=!1,rt=null,fa=!1,xr=Error(C(519));function Lt(e){var a=Error(C(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Bu(da(a,e)),xr}function ri(e){var a=e.stateNode,t=e.type,l=e.memoizedProps;switch(a[ye]=e,a[He]=l,t){case"dialog":U("cancel",a),U("close",a);break;case"iframe":case"object":case"embed":U("load",a);break;case"video":case"audio":for(t=0;t<qu.length;t++)U(qu[t],a);break;case"source":U("error",a);break;case"img":case"image":case"link":U("error",a),U("load",a);break;case"details":U("toggle",a);break;case"input":U("invalid",a),wc(a,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":U("invalid",a);break;case"textarea":U("invalid",a),Bc(a,l.value,l.defaultValue,l.children)}t=l.children,typeof t!="string"&&typeof t!="number"&&typeof t!="bigint"||a.textContent===""+t||l.suppressHydrationWarning===!0||qp(a.textContent,t)?(l.popover!=null&&(U("beforetoggle",a),U("toggle",a)),l.onScroll!=null&&U("scroll",a),l.onScrollEnd!=null&&U("scrollend",a),l.onClick!=null&&(a.onclick=Ua),a=!0):a=!1,a||Lt(e,!0)}function si(e){for(be=e.return;be;)switch(be.tag){case 5:case 31:case 13:fa=!1;return;case 27:case 3:fa=!0;return;default:be=be.return}}function ll(e){if(e!==be)return!1;if(!_)return si(e),_=!0,!1;var a=e.tag,t;if((t=a!==3&&a!==27)&&((t=a===5)&&(t=e.type,t=!(t!=="form"&&t!=="button")||Gr(e.type,e.memoizedProps)),t=!t),t&&$&&Lt(e),si(e),a===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(C(317));$=Ji(e)}else if(a===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(C(317));$=Ji(e)}else a===27?(a=$,vt(e.type)?(e=Zr,Zr=null,$=e):$=a):$=be?sa(e.stateNode.nextSibling):null;return!0}function Ht(){$=be=null,_=!1}function qf(){var e=rt;return e!==null&&(Ue===null?Ue=e:Ue.push.apply(Ue,e),rt=null),e}function Bu(e){rt===null?rt=[e]:rt.push(e)}var Sr=ba(null),Zt=null,za=null;function Wa(e,a,t){Q(Sr,a._currentValue),a._currentValue=t}function _a(e){e._currentValue=Sr.current,xe(Sr)}function Cr(e,a,t){for(;e!==null;){var l=e.alternate;if((e.childLanes&a)!==a?(e.childLanes|=a,l!==null&&(l.childLanes|=a)):l!==null&&(l.childLanes&a)!==a&&(l.childLanes|=a),e===t)break;e=e.return}}function vr(e,a,t,l){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var o=u.dependencies;if(o!==null){var d=u.child;o=o.firstContext;e:for(;o!==null;){var f=o;o=u;for(var r=0;r<a.length;r++)if(f.context===a[r]){o.lanes|=t,f=o.alternate,f!==null&&(f.lanes|=t),Cr(o.return,t,e),l||(d=null);break e}o=f.next}}else if(u.tag===18){if(d=u.return,d===null)throw Error(C(341));d.lanes|=t,o=d.alternate,o!==null&&(o.lanes|=t),Cr(d,t,e),d=null}else d=u.child;if(d!==null)d.return=u;else for(d=u;d!==null;){if(d===e){d=null;break}if(u=d.sibling,u!==null){u.return=d.return,d=u;break}d=d.return}u=d}}function _l(e,a,t,l){e=null;for(var u=a,o=!1;u!==null;){if(!o){if((u.flags&524288)!==0)o=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var d=u.alternate;if(d===null)throw Error(C(387));if(d=d.memoizedProps,d!==null){var f=u.type;Qe(u.pendingProps.value,d.value)||(e!==null?e.push(f):e=[f])}}else if(u===Zo.current){if(d=u.alternate,d===null)throw Error(C(387));d.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(zu):e=[zu])}u=u.return}e!==null&&vr(a,e,t,l),a.flags|=262144}function ad(e){for(e=e.firstContext;e!==null;){if(!Qe(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function _t(e){Zt=e,za=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ie(e){return em(Zt,e)}function yo(e,a){return Zt===null&&_t(e),em(e,a)}function em(e,a){var t=a._currentValue;if(a={context:a,memoizedValue:t,next:null},za===null){if(e===null)throw Error(C(308));za=a,e.dependencies={lanes:0,firstContext:a},e.flags|=524288}else za=za.next=a;return t}var EL=typeof AbortController<"u"?AbortController:function(){var e=[],a=this.signal={aborted:!1,addEventListener:function(t,l){e.push(l)}};this.abort=function(){a.aborted=!0,e.forEach(function(t){return t()})}},qL=me.unstable_scheduleCallback,UL=me.unstable_NormalPriority,ne={$$typeof:qa,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function ms(){return{controller:new EL,data:new Map,refCount:0}}function Yu(e){e.refCount--,e.refCount===0&&qL(UL,function(){e.controller.abort()})}var hu=null,yr=0,wl=0,yl=null;function zL(e,a){if(hu===null){var t=hu=[];yr=0,wl=Hs(),yl={status:"pending",value:void 0,then:function(l){t.push(l)}}}return yr++,a.then(ni,ni),a}function ni(){if(--yr===0&&hu!==null){yl!==null&&(yl.status="fulfilled");var e=hu;hu=null,wl=0,yl=null;for(var a=0;a<e.length;a++)(0,e[a])()}}function HL(e,a){var t=[],l={status:"pending",value:null,reason:null,then:function(u){t.push(u)}};return e.then(function(){l.status="fulfilled",l.value=a;for(var u=0;u<t.length;u++)(0,t[u])(a)},function(u){for(l.status="rejected",l.reason=u,u=0;u<t.length;u++)(0,t[u])(void 0)}),l}var ii=B.S;B.S=function(e,a){pp=Ye(),typeof a=="object"&&a!==null&&typeof a.then=="function"&&zL(e,a),ii!==null&&ii(e,a)};var qt=ba(null);function ps(){var e=qt.current;return e!==null?e:K.pooledCache}function zo(e,a){a===null?Q(qt,qt.current):Q(qt,a.pool)}function am(){var e=ps();return e===null?null:{parent:ne._currentValue,pool:e}}var Fl=Error(C(460)),gs=Error(C(474)),Td=Error(C(542)),td={then:function(){}};function ci(e){return e=e.status,e==="fulfilled"||e==="rejected"}function tm(e,a,t){switch(t=e[t],t===void 0?e.push(a):t!==a&&(a.then(Ua,Ua),a=t),a.status){case"fulfilled":return a.value;case"rejected":throw e=a.reason,pi(e),e;default:if(typeof a.status=="string")a.then(Ua,Ua);else{if(e=K,e!==null&&100<e.shellSuspendCounter)throw Error(C(482));e=a,e.status="pending",e.then(function(l){if(a.status==="pending"){var u=a;u.status="fulfilled",u.value=l}},function(l){if(a.status==="pending"){var u=a;u.status="rejected",u.reason=l}})}switch(a.status){case"fulfilled":return a.value;case"rejected":throw e=a.reason,pi(e),e}throw Ut=a,Fl}}function Bt(e){try{var a=e._init;return a(e._payload)}catch(t){throw t!==null&&typeof t=="object"&&typeof t.then=="function"?(Ut=t,Fl):t}}var Ut=null;function mi(){if(Ut===null)throw Error(C(459));var e=Ut;return Ut=null,e}function pi(e){if(e===Fl||e===Td)throw Error(C(483))}var bl=null,Ru=0;function bo(e){var a=Ru;return Ru+=1,bl===null&&(bl=[]),tm(bl,e,a)}function lu(e,a){a=a.props.ref,e.ref=a!==void 0?a:null}function Io(e,a){throw a.$$typeof===Ih?Error(C(525)):(e=Object.prototype.toString.call(a),Error(C(31,e==="[object Object]"?"object with keys {"+Object.keys(a).join(", ")+"}":e)))}function lm(e){function a(c,n){if(e){var p=c.deletions;p===null?(c.deletions=[n],c.flags|=16):p.push(n)}}function t(c,n){if(!e)return null;for(;n!==null;)a(c,n),n=n.sibling;return null}function l(c){for(var n=new Map;c!==null;)c.key!==null?n.set(c.key,c):n.set(c.index,c),c=c.sibling;return n}function u(c,n){return c=Ha(c,n),c.index=0,c.sibling=null,c}function o(c,n,p){return c.index=p,e?(p=c.alternate,p!==null?(p=p.index,p<n?(c.flags|=67108866,n):p):(c.flags|=67108866,n)):(c.flags|=1048576,n)}function d(c){return e&&c.alternate===null&&(c.flags|=67108866),c}function f(c,n,p,i){return n===null||n.tag!==6?(n=Of(p,c.mode,i),n.return=c,n):(n=u(n,p),n.return=c,n)}function r(c,n,p,i){var S=p.type;return S===fl?h(c,n,p.props.children,i,p.key):n!==null&&(n.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===Qa&&Bt(S)===n.type)?(n=u(n,p.props),lu(n,p),n.return=c,n):(n=Uo(p.type,p.key,p.props,null,c.mode,i),lu(n,p),n.return=c,n)}function s(c,n,p,i){return n===null||n.tag!==4||n.stateNode.containerInfo!==p.containerInfo||n.stateNode.implementation!==p.implementation?(n=Ef(p,c.mode,i),n.return=c,n):(n=u(n,p.children||[]),n.return=c,n)}function h(c,n,p,i,S){return n===null||n.tag!==7?(n=Et(p,c.mode,i,S),n.return=c,n):(n=u(n,p),n.return=c,n)}function L(c,n,p){if(typeof n=="string"&&n!==""||typeof n=="number"||typeof n=="bigint")return n=Of(""+n,c.mode,p),n.return=c,n;if(typeof n=="object"&&n!==null){switch(n.$$typeof){case po:return p=Uo(n.type,n.key,n.props,null,c.mode,p),lu(p,n),p.return=c,p;case ru:return n=Ef(n,c.mode,p),n.return=c,n;case Qa:return n=Bt(n),L(c,n,p)}if(su(n)||au(n))return n=Et(n,c.mode,p,null),n.return=c,n;if(typeof n.then=="function")return L(c,bo(n),p);if(n.$$typeof===qa)return L(c,yo(c,n),p);Io(c,n)}return null}function m(c,n,p,i){var S=n!==null?n.key:null;if(typeof p=="string"&&p!==""||typeof p=="number"||typeof p=="bigint")return S!==null?null:f(c,n,""+p,i);if(typeof p=="object"&&p!==null){switch(p.$$typeof){case po:return p.key===S?r(c,n,p,i):null;case ru:return p.key===S?s(c,n,p,i):null;case Qa:return p=Bt(p),m(c,n,p,i)}if(su(p)||au(p))return S!==null?null:h(c,n,p,i,null);if(typeof p.then=="function")return m(c,n,bo(p),i);if(p.$$typeof===qa)return m(c,n,yo(c,p),i);Io(c,p)}return null}function g(c,n,p,i,S){if(typeof i=="string"&&i!==""||typeof i=="number"||typeof i=="bigint")return c=c.get(p)||null,f(n,c,""+i,S);if(typeof i=="object"&&i!==null){switch(i.$$typeof){case po:return c=c.get(i.key===null?p:i.key)||null,r(n,c,i,S);case ru:return c=c.get(i.key===null?p:i.key)||null,s(n,c,i,S);case Qa:return i=Bt(i),g(c,n,p,i,S)}if(su(i)||au(i))return c=c.get(p)||null,h(n,c,i,S,null);if(typeof i.then=="function")return g(c,n,p,bo(i),S);if(i.$$typeof===qa)return g(c,n,p,yo(n,i),S);Io(n,i)}return null}function y(c,n,p,i){for(var S=null,k=null,b=n,v=n=0,T=null;b!==null&&v<p.length;v++){b.index>v?(T=b,b=null):T=b.sibling;var E=m(c,b,p[v],i);if(E===null){b===null&&(b=T);break}e&&b&&E.alternate===null&&a(c,b),n=o(E,n,v),k===null?S=E:k.sibling=E,k=E,b=T}if(v===p.length)return t(c,b),_&&Oa(c,v),S;if(b===null){for(;v<p.length;v++)b=L(c,p[v],i),b!==null&&(n=o(b,n,v),k===null?S=b:k.sibling=b,k=b);return _&&Oa(c,v),S}for(b=l(b);v<p.length;v++)T=g(b,c,v,p[v],i),T!==null&&(e&&T.alternate!==null&&b.delete(T.key===null?v:T.key),n=o(T,n,v),k===null?S=T:k.sibling=T,k=T);return e&&b.forEach(function(Pe){return a(c,Pe)}),_&&Oa(c,v),S}function I(c,n,p,i){if(p==null)throw Error(C(151));for(var S=null,k=null,b=n,v=n=0,T=null,E=p.next();b!==null&&!E.done;v++,E=p.next()){b.index>v?(T=b,b=null):T=b.sibling;var Pe=m(c,b,E.value,i);if(Pe===null){b===null&&(b=T);break}e&&b&&Pe.alternate===null&&a(c,b),n=o(Pe,n,v),k===null?S=Pe:k.sibling=Pe,k=Pe,b=T}if(E.done)return t(c,b),_&&Oa(c,v),S;if(b===null){for(;!E.done;v++,E=p.next())E=L(c,E.value,i),E!==null&&(n=o(E,n,v),k===null?S=E:k.sibling=E,k=E);return _&&Oa(c,v),S}for(b=l(b);!E.done;v++,E=p.next())E=g(b,c,v,E.value,i),E!==null&&(e&&E.alternate!==null&&b.delete(E.key===null?v:E.key),n=o(E,n,v),k===null?S=E:k.sibling=E,k=E);return e&&b.forEach(function(ha){return a(c,ha)}),_&&Oa(c,v),S}function w(c,n,p,i){if(typeof p=="object"&&p!==null&&p.type===fl&&p.key===null&&(p=p.props.children),typeof p=="object"&&p!==null){switch(p.$$typeof){case po:e:{for(var S=p.key;n!==null;){if(n.key===S){if(S=p.type,S===fl){if(n.tag===7){t(c,n.sibling),i=u(n,p.props.children),i.return=c,c=i;break e}}else if(n.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===Qa&&Bt(S)===n.type){t(c,n.sibling),i=u(n,p.props),lu(i,p),i.return=c,c=i;break e}t(c,n);break}else a(c,n);n=n.sibling}p.type===fl?(i=Et(p.props.children,c.mode,i,p.key),i.return=c,c=i):(i=Uo(p.type,p.key,p.props,null,c.mode,i),lu(i,p),i.return=c,c=i)}return d(c);case ru:e:{for(S=p.key;n!==null;){if(n.key===S)if(n.tag===4&&n.stateNode.containerInfo===p.containerInfo&&n.stateNode.implementation===p.implementation){t(c,n.sibling),i=u(n,p.children||[]),i.return=c,c=i;break e}else{t(c,n);break}else a(c,n);n=n.sibling}i=Ef(p,c.mode,i),i.return=c,c=i}return d(c);case Qa:return p=Bt(p),w(c,n,p,i)}if(su(p))return y(c,n,p,i);if(au(p)){if(S=au(p),typeof S!="function")throw Error(C(150));return p=S.call(p),I(c,n,p,i)}if(typeof p.then=="function")return w(c,n,bo(p),i);if(p.$$typeof===qa)return w(c,n,yo(c,p),i);Io(c,p)}return typeof p=="string"&&p!==""||typeof p=="number"||typeof p=="bigint"?(p=""+p,n!==null&&n.tag===6?(t(c,n.sibling),i=u(n,p),i.return=c,c=i):(t(c,n),i=Of(p,c.mode,i),i.return=c,c=i),d(c)):t(c,n)}return function(c,n,p,i){try{Ru=0;var S=w(c,n,p,i);return bl=null,S}catch(b){if(b===Fl||b===Td)throw b;var k=Ve(29,b,null,c.mode);return k.lanes=i,k.return=c,k}}}var Ft=lm(!0),um=lm(!1),Ja=!1;function hs(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function br(e,a){e=e.updateQueue,a.updateQueue===e&&(a.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function st(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function nt(e,a,t){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(P&2)!==0){var u=l.pending;return u===null?a.next=a:(a.next=u.next,u.next=a),l.pending=a,a=$o(e),Kc(e,null,t),a}return Md(e,l,a,t),$o(e)}function Lu(e,a,t){if(a=a.updateQueue,a!==null&&(a=a.shared,(t&4194048)!==0)){var l=a.lanes;l&=e.pendingLanes,t|=l,a.lanes=t,yc(e,t)}}function Uf(e,a){var t=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,t===l)){var u=null,o=null;if(t=t.firstBaseUpdate,t!==null){do{var d={lane:t.lane,tag:t.tag,payload:t.payload,callback:null,next:null};o===null?u=o=d:o=o.next=d,t=t.next}while(t!==null);o===null?u=o=a:o=o.next=a}else u=o=a;t={baseState:l.baseState,firstBaseUpdate:u,lastBaseUpdate:o,shared:l.shared,callbacks:l.callbacks},e.updateQueue=t;return}e=t.lastBaseUpdate,e===null?t.firstBaseUpdate=a:e.next=a,t.lastBaseUpdate=a}var Ir=!1;function xu(){if(Ir){var e=yl;if(e!==null)throw e}}function Su(e,a,t,l){Ir=!1;var u=e.updateQueue;Ja=!1;var o=u.firstBaseUpdate,d=u.lastBaseUpdate,f=u.shared.pending;if(f!==null){u.shared.pending=null;var r=f,s=r.next;r.next=null,d===null?o=s:d.next=s,d=r;var h=e.alternate;h!==null&&(h=h.updateQueue,f=h.lastBaseUpdate,f!==d&&(f===null?h.firstBaseUpdate=s:f.next=s,h.lastBaseUpdate=r))}if(o!==null){var L=u.baseState;d=0,h=s=r=null,f=o;do{var m=f.lane&-536870913,g=m!==f.lane;if(g?(H&m)===m:(l&m)===m){m!==0&&m===wl&&(Ir=!0),h!==null&&(h=h.next={lane:0,tag:f.tag,payload:f.payload,callback:null,next:null});e:{var y=e,I=f;m=a;var w=t;switch(I.tag){case 1:if(y=I.payload,typeof y=="function"){L=y.call(w,L,m);break e}L=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=I.payload,m=typeof y=="function"?y.call(w,L,m):y,m==null)break e;L=ee({},L,m);break e;case 2:Ja=!0}}m=f.callback,m!==null&&(e.flags|=64,g&&(e.flags|=8192),g=u.callbacks,g===null?u.callbacks=[m]:g.push(m))}else g={lane:m,tag:f.tag,payload:f.payload,callback:f.callback,next:null},h===null?(s=h=g,r=L):h=h.next=g,d|=m;if(f=f.next,f===null){if(f=u.shared.pending,f===null)break;g=f,f=g.next,g.next=null,u.lastBaseUpdate=g,u.shared.pending=null}}while(!0);h===null&&(r=L),u.baseState=r,u.firstBaseUpdate=s,u.lastBaseUpdate=h,o===null&&(u.shared.lanes=0),St|=d,e.lanes=d,e.memoizedState=L}}function om(e,a){if(typeof e!="function")throw Error(C(191,e));e.call(a)}function dm(e,a){var t=e.callbacks;if(t!==null)for(e.callbacks=null,e=0;e<t.length;e++)om(t[e],a)}var Dl=ba(null),ld=ba(0);function gi(e,a){e=Xa,Q(ld,e),Q(Dl,a),Xa=e|a.baseLanes}function Ar(){Q(ld,Xa),Q(Dl,Dl.current)}function Ls(){Xa=ld.current,xe(Dl),xe(ld)}var Je=ba(null),ra=null;function $a(e){var a=e.alternate;Q(oe,oe.current&1),Q(Je,e),ra===null&&(a===null||Dl.current!==null||a.memoizedState!==null)&&(ra=e)}function kr(e){Q(oe,oe.current),Q(Je,e),ra===null&&(ra=e)}function fm(e){e.tag===22?(Q(oe,oe.current),Q(Je,e),ra===null&&(ra=e)):et(e)}function et(){Q(oe,oe.current),Q(Je,Je.current)}function Ge(e){xe(Je),ra===e&&(ra=null),xe(oe)}var oe=ba(0);function ud(e){for(var a=e;a!==null;){if(a.tag===13){var t=a.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||Xr(t)||Yr(t)))return a}else if(a.tag===19&&(a.memoizedProps.revealOrder==="forwards"||a.memoizedProps.revealOrder==="backwards"||a.memoizedProps.revealOrder==="unstable_legacy-backwards"||a.memoizedProps.revealOrder==="together")){if((a.flags&128)!==0)return a}else if(a.child!==null){a.child.return=a,a=a.child;continue}if(a===e)break;for(;a.sibling===null;){if(a.return===null||a.return===e)return null;a=a.return}a.sibling.return=a.return,a=a.sibling}return null}var Na=0,O=null,Z=null,re=null,od=!1,Il=!1,Pt=!1,dd=0,Ou=0,Al=null,_L=0;function le(){throw Error(C(321))}function xs(e,a){if(a===null)return!1;for(var t=0;t<a.length&&t<e.length;t++)if(!Qe(e[t],a[t]))return!1;return!0}function Ss(e,a,t,l,u,o){return Na=o,O=a,a.memoizedState=null,a.updateQueue=null,a.lanes=0,B.H=e===null||e.memoizedState===null?Hm:Ds,Pt=!1,o=t(l,u),Pt=!1,Il&&(o=sm(a,t,l,u)),rm(e),o}function rm(e){B.H=Eu;var a=Z!==null&&Z.next!==null;if(Na=0,re=Z=O=null,od=!1,Ou=0,Al=null,a)throw Error(C(300));e===null||ie||(e=e.dependencies,e!==null&&ad(e)&&(ie=!0))}function sm(e,a,t,l){O=e;var u=0;do{if(Il&&(Al=null),Ou=0,Il=!1,25<=u)throw Error(C(301));if(u+=1,re=Z=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}B.H=_m,o=a(t,l)}while(Il);return o}function FL(){var e=B.H,a=e.useState()[0];return a=typeof a.then=="function"?Zu(a):a,e=e.useState()[0],(Z!==null?Z.memoizedState:null)!==e&&(O.flags|=1024),a}function Cs(){var e=dd!==0;return dd=0,e}function vs(e,a,t){a.updateQueue=e.updateQueue,a.flags&=-2053,e.lanes&=~t}function ys(e){if(od){for(e=e.memoizedState;e!==null;){var a=e.queue;a!==null&&(a.pending=null),e=e.next}od=!1}Na=0,re=Z=O=null,Il=!1,Ou=dd=0,Al=null}function Re(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return re===null?O.memoizedState=re=e:re=re.next=e,re}function de(){if(Z===null){var e=O.alternate;e=e!==null?e.memoizedState:null}else e=Z.next;var a=re===null?O.memoizedState:re.next;if(a!==null)re=a,Z=e;else{if(e===null)throw O.alternate===null?Error(C(467)):Error(C(310));Z=e,e={memoizedState:Z.memoizedState,baseState:Z.baseState,baseQueue:Z.baseQueue,queue:Z.queue,next:null},re===null?O.memoizedState=re=e:re=re.next=e}return re}function wd(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Zu(e){var a=Ou;return Ou+=1,Al===null&&(Al=[]),e=tm(Al,e,a),a=O,(re===null?a.memoizedState:re.next)===null&&(a=a.alternate,B.H=a===null||a.memoizedState===null?Hm:Ds),e}function Dd(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Zu(e);if(e.$$typeof===qa)return Ie(e)}throw Error(C(438,String(e)))}function bs(e){var a=null,t=O.updateQueue;if(t!==null&&(a=t.memoCache),a==null){var l=O.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(a={data:l.data.map(function(u){return u.slice()}),index:0})))}if(a==null&&(a={data:[],index:0}),t===null&&(t=wd(),O.updateQueue=t),t.memoCache=a,t=a.data[a.index],t===void 0)for(t=a.data[a.index]=Array(e),l=0;l<e;l++)t[l]=Ah;return a.index++,t}function Ga(e,a){return typeof a=="function"?a(e):a}function Ho(e){var a=de();return Is(a,Z,e)}function Is(e,a,t){var l=e.queue;if(l===null)throw Error(C(311));l.lastRenderedReducer=t;var u=e.baseQueue,o=l.pending;if(o!==null){if(u!==null){var d=u.next;u.next=o.next,o.next=d}a.baseQueue=u=o,l.pending=null}if(o=e.baseState,u===null)e.memoizedState=o;else{a=u.next;var f=d=null,r=null,s=a,h=!1;do{var L=s.lane&-536870913;if(L!==s.lane?(H&L)===L:(Na&L)===L){var m=s.revertLane;if(m===0)r!==null&&(r=r.next={lane:0,revertLane:0,gesture:null,action:s.action,hasEagerState:s.hasEagerState,eagerState:s.eagerState,next:null}),L===wl&&(h=!0);else if((Na&m)===m){s=s.next,m===wl&&(h=!0);continue}else L={lane:0,revertLane:s.revertLane,gesture:null,action:s.action,hasEagerState:s.hasEagerState,eagerState:s.eagerState,next:null},r===null?(f=r=L,d=o):r=r.next=L,O.lanes|=m,St|=m;L=s.action,Pt&&t(o,L),o=s.hasEagerState?s.eagerState:t(o,L)}else m={lane:L,revertLane:s.revertLane,gesture:s.gesture,action:s.action,hasEagerState:s.hasEagerState,eagerState:s.eagerState,next:null},r===null?(f=r=m,d=o):r=r.next=m,O.lanes|=L,St|=L;s=s.next}while(s!==null&&s!==a);if(r===null?d=o:r.next=f,!Qe(o,e.memoizedState)&&(ie=!0,h&&(t=yl,t!==null)))throw t;e.memoizedState=o,e.baseState=d,e.baseQueue=r,l.lastRenderedState=o}return u===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function zf(e){var a=de(),t=a.queue;if(t===null)throw Error(C(311));t.lastRenderedReducer=e;var l=t.dispatch,u=t.pending,o=a.memoizedState;if(u!==null){t.pending=null;var d=u=u.next;do o=e(o,d.action),d=d.next;while(d!==u);Qe(o,a.memoizedState)||(ie=!0),a.memoizedState=o,a.baseQueue===null&&(a.baseState=o),t.lastRenderedState=o}return[o,l]}function nm(e,a,t){var l=O,u=de(),o=_;if(o){if(t===void 0)throw Error(C(407));t=t()}else t=a();var d=!Qe((Z||u).memoizedState,t);if(d&&(u.memoizedState=t,ie=!0),u=u.queue,As(mm.bind(null,l,u,e),[e]),u.getSnapshot!==a||d||re!==null&&re.memoizedState.tag&1){if(l.flags|=2048,Bl(9,{destroy:void 0},cm.bind(null,l,u,t,a),null),K===null)throw Error(C(349));o||(Na&127)!==0||im(l,a,t)}return t}function im(e,a,t){e.flags|=16384,e={getSnapshot:a,value:t},a=O.updateQueue,a===null?(a=wd(),O.updateQueue=a,a.stores=[e]):(t=a.stores,t===null?a.stores=[e]:t.push(e))}function cm(e,a,t,l){a.value=t,a.getSnapshot=l,pm(a)&&gm(e)}function mm(e,a,t){return t(function(){pm(a)&&gm(e)})}function pm(e){var a=e.getSnapshot;e=e.value;try{var t=a();return!Qe(e,t)}catch{return!0}}function gm(e){var a=Yt(e,2);a!==null&&ze(a,e,2)}function Mr(e){var a=Re();if(typeof e=="function"){var t=e;if(e=t(),Pt){tt(!0);try{t()}finally{tt(!1)}}}return a.memoizedState=a.baseState=e,a.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ga,lastRenderedState:e},a}function hm(e,a,t,l){return e.baseState=t,Is(e,Z,typeof l=="function"?l:Ga)}function PL(e,a,t,l,u){if(Rd(e))throw Error(C(485));if(e=a.action,e!==null){var o={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(d){o.listeners.push(d)}};B.T!==null?t(!0):o.isTransition=!1,l(o),t=a.pending,t===null?(o.next=a.pending=o,Lm(a,o)):(o.next=t.next,a.pending=t.next=o)}}function Lm(e,a){var t=a.action,l=a.payload,u=e.state;if(a.isTransition){var o=B.T,d={};B.T=d;try{var f=t(u,l),r=B.S;r!==null&&r(d,f),hi(e,a,f)}catch(s){Tr(e,a,s)}finally{o!==null&&d.types!==null&&(o.types=d.types),B.T=o}}else try{o=t(u,l),hi(e,a,o)}catch(s){Tr(e,a,s)}}function hi(e,a,t){t!==null&&typeof t=="object"&&typeof t.then=="function"?t.then(function(l){Li(e,a,l)},function(l){return Tr(e,a,l)}):Li(e,a,t)}function Li(e,a,t){a.status="fulfilled",a.value=t,xm(a),e.state=t,a=e.pending,a!==null&&(t=a.next,t===a?e.pending=null:(t=t.next,a.next=t,Lm(e,t)))}function Tr(e,a,t){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do a.status="rejected",a.reason=t,xm(a),a=a.next;while(a!==l)}e.action=null}function xm(e){e=e.listeners;for(var a=0;a<e.length;a++)(0,e[a])()}function Sm(e,a){return a}function xi(e,a){if(_){var t=K.formState;if(t!==null){e:{var l=O;if(_){if($){a:{for(var u=$,o=fa;u.nodeType!==8;){if(!o){u=null;break a}if(u=sa(u.nextSibling),u===null){u=null;break a}}o=u.data,u=o==="F!"||o==="F"?u:null}if(u){$=sa(u.nextSibling),l=u.data==="F!";break e}}Lt(l)}l=!1}l&&(a=t[0])}}return t=Re(),t.memoizedState=t.baseState=a,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Sm,lastRenderedState:a},t.queue=l,t=qm.bind(null,O,l),l.dispatch=t,l=Mr(!1),o=ws.bind(null,O,!1,l.queue),l=Re(),u={state:a,dispatch:null,action:e,pending:null},l.queue=u,t=PL.bind(null,O,u,o,t),u.dispatch=t,l.memoizedState=e,[a,t,!1]}function Si(e){var a=de();return Cm(a,Z,e)}function Cm(e,a,t){if(a=Is(e,a,Sm)[0],e=Ho(Ga)[0],typeof a=="object"&&a!==null&&typeof a.then=="function")try{var l=Zu(a)}catch(d){throw d===Fl?Td:d}else l=a;a=de();var u=a.queue,o=u.dispatch;return t!==a.memoizedState&&(O.flags|=2048,Bl(9,{destroy:void 0},NL.bind(null,u,t),null)),[l,o,e]}function NL(e,a){e.action=a}function Ci(e){var a=de(),t=Z;if(t!==null)return Cm(a,t,e);de(),a=a.memoizedState,t=de();var l=t.queue.dispatch;return t.memoizedState=e,[a,l,!1]}function Bl(e,a,t,l){return e={tag:e,create:t,deps:l,inst:a,next:null},a=O.updateQueue,a===null&&(a=wd(),O.updateQueue=a),t=a.lastEffect,t===null?a.lastEffect=e.next=e:(l=t.next,t.next=e,e.next=l,a.lastEffect=e),e}function vm(){return de().memoizedState}function _o(e,a,t,l){var u=Re();O.flags|=e,u.memoizedState=Bl(1|a,{destroy:void 0},t,l===void 0?null:l)}function Bd(e,a,t,l){var u=de();l=l===void 0?null:l;var o=u.memoizedState.inst;Z!==null&&l!==null&&xs(l,Z.memoizedState.deps)?u.memoizedState=Bl(a,o,t,l):(O.flags|=e,u.memoizedState=Bl(1|a,o,t,l))}function vi(e,a){_o(8390656,8,e,a)}function As(e,a){Bd(2048,8,e,a)}function GL(e){O.flags|=4;var a=O.updateQueue;if(a===null)a=wd(),O.updateQueue=a,a.events=[e];else{var t=a.events;t===null?a.events=[e]:t.push(e)}}function ym(e){var a=de().memoizedState;return GL({ref:a,nextImpl:e}),function(){if((P&2)!==0)throw Error(C(440));return a.impl.apply(void 0,arguments)}}function bm(e,a){return Bd(4,2,e,a)}function Im(e,a){return Bd(4,4,e,a)}function Am(e,a){if(typeof a=="function"){e=e();var t=a(e);return function(){typeof t=="function"?t():a(null)}}if(a!=null)return e=e(),a.current=e,function(){a.current=null}}function km(e,a,t){t=t!=null?t.concat([e]):null,Bd(4,4,Am.bind(null,a,e),t)}function ks(){}function Mm(e,a){var t=de();a=a===void 0?null:a;var l=t.memoizedState;return a!==null&&xs(a,l[1])?l[0]:(t.memoizedState=[e,a],e)}function Tm(e,a){var t=de();a=a===void 0?null:a;var l=t.memoizedState;if(a!==null&&xs(a,l[1]))return l[0];if(l=e(),Pt){tt(!0);try{e()}finally{tt(!1)}}return t.memoizedState=[l,a],l}function Ms(e,a,t){return t===void 0||(Na&1073741824)!==0&&(H&261930)===0?e.memoizedState=a:(e.memoizedState=t,e=hp(),O.lanes|=e,St|=e,t)}function wm(e,a,t,l){return Qe(t,a)?t:Dl.current!==null?(e=Ms(e,t,l),Qe(e,a)||(ie=!0),e):(Na&42)===0||(Na&1073741824)!==0&&(H&261930)===0?(ie=!0,e.memoizedState=t):(e=hp(),O.lanes|=e,St|=e,a)}function Dm(e,a,t,l,u){var o=N.p;N.p=o!==0&&8>o?o:8;var d=B.T,f={};B.T=f,ws(e,!1,a,t);try{var r=u(),s=B.S;if(s!==null&&s(f,r),r!==null&&typeof r=="object"&&typeof r.then=="function"){var h=HL(r,l);Cu(e,a,h,Ke(e))}else Cu(e,a,l,Ke(e))}catch(L){Cu(e,a,{then:function(){},status:"rejected",reason:L},Ke())}finally{N.p=o,d!==null&&f.types!==null&&(d.types=f.types),B.T=d}}function VL(){}function wr(e,a,t,l){if(e.tag!==5)throw Error(C(476));var u=Bm(e).queue;Dm(e,u,a,Ot,t===null?VL:function(){return Rm(e),t(l)})}function Bm(e){var a=e.memoizedState;if(a!==null)return a;a={memoizedState:Ot,baseState:Ot,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ga,lastRenderedState:Ot},next:null};var t={};return a.next={memoizedState:t,baseState:t,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ga,lastRenderedState:t},next:null},e.memoizedState=a,e=e.alternate,e!==null&&(e.memoizedState=a),a}function Rm(e){var a=Bm(e);a.next===null&&(a=e.alternate.memoizedState),Cu(e,a.next.queue,{},Ke())}function Ts(){return Ie(zu)}function Om(){return de().memoizedState}function Em(){return de().memoizedState}function XL(e){for(var a=e.return;a!==null;){switch(a.tag){case 24:case 3:var t=Ke();e=st(t);var l=nt(a,e,t);l!==null&&(ze(l,a,t),Lu(l,a,t)),a={cache:ms()},e.payload=a;return}a=a.return}}function YL(e,a,t){var l=Ke();t={lane:l,revertLane:0,gesture:null,action:t,hasEagerState:!1,eagerState:null,next:null},Rd(e)?Um(a,t):(t=ss(e,a,t,l),t!==null&&(ze(t,e,l),zm(t,a,l)))}function qm(e,a,t){var l=Ke();Cu(e,a,t,l)}function Cu(e,a,t,l){var u={lane:l,revertLane:0,gesture:null,action:t,hasEagerState:!1,eagerState:null,next:null};if(Rd(e))Um(a,u);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=a.lastRenderedReducer,o!==null))try{var d=a.lastRenderedState,f=o(d,t);if(u.hasEagerState=!0,u.eagerState=f,Qe(f,d))return Md(e,a,u,0),K===null&&kd(),!1}catch{}if(t=ss(e,a,u,l),t!==null)return ze(t,e,l),zm(t,a,l),!0}return!1}function ws(e,a,t,l){if(l={lane:2,revertLane:Hs(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Rd(e)){if(a)throw Error(C(479))}else a=ss(e,t,l,2),a!==null&&ze(a,e,2)}function Rd(e){var a=e.alternate;return e===O||a!==null&&a===O}function Um(e,a){Il=od=!0;var t=e.pending;t===null?a.next=a:(a.next=t.next,t.next=a),e.pending=a}function zm(e,a,t){if((t&4194048)!==0){var l=a.lanes;l&=e.pendingLanes,t|=l,a.lanes=t,yc(e,t)}}var Eu={readContext:Ie,use:Dd,useCallback:le,useContext:le,useEffect:le,useImperativeHandle:le,useLayoutEffect:le,useInsertionEffect:le,useMemo:le,useReducer:le,useRef:le,useState:le,useDebugValue:le,useDeferredValue:le,useTransition:le,useSyncExternalStore:le,useId:le,useHostTransitionStatus:le,useFormState:le,useActionState:le,useOptimistic:le,useMemoCache:le,useCacheRefresh:le};Eu.useEffectEvent=le;var Hm={readContext:Ie,use:Dd,useCallback:function(e,a){return Re().memoizedState=[e,a===void 0?null:a],e},useContext:Ie,useEffect:vi,useImperativeHandle:function(e,a,t){t=t!=null?t.concat([e]):null,_o(4194308,4,Am.bind(null,a,e),t)},useLayoutEffect:function(e,a){return _o(4194308,4,e,a)},useInsertionEffect:function(e,a){_o(4,2,e,a)},useMemo:function(e,a){var t=Re();a=a===void 0?null:a;var l=e();if(Pt){tt(!0);try{e()}finally{tt(!1)}}return t.memoizedState=[l,a],l},useReducer:function(e,a,t){var l=Re();if(t!==void 0){var u=t(a);if(Pt){tt(!0);try{t(a)}finally{tt(!1)}}}else u=a;return l.memoizedState=l.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},l.queue=e,e=e.dispatch=YL.bind(null,O,e),[l.memoizedState,e]},useRef:function(e){var a=Re();return e={current:e},a.memoizedState=e},useState:function(e){e=Mr(e);var a=e.queue,t=qm.bind(null,O,a);return a.dispatch=t,[e.memoizedState,t]},useDebugValue:ks,useDeferredValue:function(e,a){var t=Re();return Ms(t,e,a)},useTransition:function(){var e=Mr(!1);return e=Dm.bind(null,O,e.queue,!0,!1),Re().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,a,t){var l=O,u=Re();if(_){if(t===void 0)throw Error(C(407));t=t()}else{if(t=a(),K===null)throw Error(C(349));(H&127)!==0||im(l,a,t)}u.memoizedState=t;var o={value:t,getSnapshot:a};return u.queue=o,vi(mm.bind(null,l,o,e),[e]),l.flags|=2048,Bl(9,{destroy:void 0},cm.bind(null,l,o,t,a),null),t},useId:function(){var e=Re(),a=K.identifierPrefix;if(_){var t=Ca,l=Sa;t=(l&~(1<<32-je(l)-1)).toString(32)+t,a="_"+a+"R_"+t,t=dd++,0<t&&(a+="H"+t.toString(32)),a+="_"}else t=_L++,a="_"+a+"r_"+t.toString(32)+"_";return e.memoizedState=a},useHostTransitionStatus:Ts,useFormState:xi,useActionState:xi,useOptimistic:function(e){var a=Re();a.memoizedState=a.baseState=e;var t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return a.queue=t,a=ws.bind(null,O,!0,t),t.dispatch=a,[e,a]},useMemoCache:bs,useCacheRefresh:function(){return Re().memoizedState=XL.bind(null,O)},useEffectEvent:function(e){var a=Re(),t={impl:e};return a.memoizedState=t,function(){if((P&2)!==0)throw Error(C(440));return t.impl.apply(void 0,arguments)}}},Ds={readContext:Ie,use:Dd,useCallback:Mm,useContext:Ie,useEffect:As,useImperativeHandle:km,useInsertionEffect:bm,useLayoutEffect:Im,useMemo:Tm,useReducer:Ho,useRef:vm,useState:function(){return Ho(Ga)},useDebugValue:ks,useDeferredValue:function(e,a){var t=de();return wm(t,Z.memoizedState,e,a)},useTransition:function(){var e=Ho(Ga)[0],a=de().memoizedState;return[typeof e=="boolean"?e:Zu(e),a]},useSyncExternalStore:nm,useId:Om,useHostTransitionStatus:Ts,useFormState:Si,useActionState:Si,useOptimistic:function(e,a){var t=de();return hm(t,Z,e,a)},useMemoCache:bs,useCacheRefresh:Em};Ds.useEffectEvent=ym;var _m={readContext:Ie,use:Dd,useCallback:Mm,useContext:Ie,useEffect:As,useImperativeHandle:km,useInsertionEffect:bm,useLayoutEffect:Im,useMemo:Tm,useReducer:zf,useRef:vm,useState:function(){return zf(Ga)},useDebugValue:ks,useDeferredValue:function(e,a){var t=de();return Z===null?Ms(t,e,a):wm(t,Z.memoizedState,e,a)},useTransition:function(){var e=zf(Ga)[0],a=de().memoizedState;return[typeof e=="boolean"?e:Zu(e),a]},useSyncExternalStore:nm,useId:Om,useHostTransitionStatus:Ts,useFormState:Ci,useActionState:Ci,useOptimistic:function(e,a){var t=de();return Z!==null?hm(t,Z,e,a):(t.baseState=e,[e,t.queue.dispatch])},useMemoCache:bs,useCacheRefresh:Em};_m.useEffectEvent=ym;function Hf(e,a,t,l){a=e.memoizedState,t=t(l,a),t=t==null?a:ee({},a,t),e.memoizedState=t,e.lanes===0&&(e.updateQueue.baseState=t)}var Dr={enqueueSetState:function(e,a,t){e=e._reactInternals;var l=Ke(),u=st(l);u.payload=a,t!=null&&(u.callback=t),a=nt(e,u,l),a!==null&&(ze(a,e,l),Lu(a,e,l))},enqueueReplaceState:function(e,a,t){e=e._reactInternals;var l=Ke(),u=st(l);u.tag=1,u.payload=a,t!=null&&(u.callback=t),a=nt(e,u,l),a!==null&&(ze(a,e,l),Lu(a,e,l))},enqueueForceUpdate:function(e,a){e=e._reactInternals;var t=Ke(),l=st(t);l.tag=2,a!=null&&(l.callback=a),a=nt(e,l,t),a!==null&&(ze(a,e,t),Lu(a,e,t))}};function yi(e,a,t,l,u,o,d){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,o,d):a.prototype&&a.prototype.isPureReactComponent?!wu(t,l)||!wu(u,o):!0}function bi(e,a,t,l){e=a.state,typeof a.componentWillReceiveProps=="function"&&a.componentWillReceiveProps(t,l),typeof a.UNSAFE_componentWillReceiveProps=="function"&&a.UNSAFE_componentWillReceiveProps(t,l),a.state!==e&&Dr.enqueueReplaceState(a,a.state,null)}function Nt(e,a){var t=a;if("ref"in a){t={};for(var l in a)l!=="ref"&&(t[l]=a[l])}if(e=e.defaultProps){t===a&&(t=ee({},t));for(var u in e)t[u]===void 0&&(t[u]=e[u])}return t}function Fm(e){Wo(e)}function Pm(e){console.error(e)}function Nm(e){Wo(e)}function fd(e,a){try{var t=e.onUncaughtError;t(a.value,{componentStack:a.stack})}catch(l){setTimeout(function(){throw l})}}function Ii(e,a,t){try{var l=e.onCaughtError;l(t.value,{componentStack:t.stack,errorBoundary:a.tag===1?a.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function Br(e,a,t){return t=st(t),t.tag=3,t.payload={element:null},t.callback=function(){fd(e,a)},t}function Gm(e){return e=st(e),e.tag=3,e}function Vm(e,a,t,l){var u=t.type.getDerivedStateFromError;if(typeof u=="function"){var o=l.value;e.payload=function(){return u(o)},e.callback=function(){Ii(a,t,l)}}var d=t.stateNode;d!==null&&typeof d.componentDidCatch=="function"&&(e.callback=function(){Ii(a,t,l),typeof u!="function"&&(it===null?it=new Set([this]):it.add(this));var f=l.stack;this.componentDidCatch(l.value,{componentStack:f!==null?f:""})})}function ZL(e,a,t,l,u){if(t.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(a=t.alternate,a!==null&&_l(a,t,u,!0),t=Je.current,t!==null){switch(t.tag){case 31:case 13:return ra===null?cd():t.alternate===null&&ue===0&&(ue=3),t.flags&=-257,t.flags|=65536,t.lanes=u,l===td?t.flags|=16384:(a=t.updateQueue,a===null?t.updateQueue=new Set([l]):a.add(l),Kf(e,l,u)),!1;case 22:return t.flags|=65536,l===td?t.flags|=16384:(a=t.updateQueue,a===null?(a={transitions:null,markerInstances:null,retryQueue:new Set([l])},t.updateQueue=a):(t=a.retryQueue,t===null?a.retryQueue=new Set([l]):t.add(l)),Kf(e,l,u)),!1}throw Error(C(435,t.tag))}return Kf(e,l,u),cd(),!1}if(_)return a=Je.current,a!==null?((a.flags&65536)===0&&(a.flags|=256),a.flags|=65536,a.lanes=u,l!==xr&&(e=Error(C(422),{cause:l}),Bu(da(e,t)))):(l!==xr&&(a=Error(C(423),{cause:l}),Bu(da(a,t))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,l=da(l,t),u=Br(e.stateNode,l,u),Uf(e,u),ue!==4&&(ue=2)),!1;var o=Error(C(520),{cause:l});if(o=da(o,t),bu===null?bu=[o]:bu.push(o),ue!==4&&(ue=2),a===null)return!0;l=da(l,t),t=a;do{switch(t.tag){case 3:return t.flags|=65536,e=u&-u,t.lanes|=e,e=Br(t.stateNode,l,e),Uf(t,e),!1;case 1:if(a=t.type,o=t.stateNode,(t.flags&128)===0&&(typeof a.getDerivedStateFromError=="function"||o!==null&&typeof o.componentDidCatch=="function"&&(it===null||!it.has(o))))return t.flags|=65536,u&=-u,t.lanes|=u,u=Gm(u),Vm(u,e,t,l),Uf(t,u),!1}t=t.return}while(t!==null);return!1}var Bs=Error(C(461)),ie=!1;function ve(e,a,t,l){a.child=e===null?um(a,null,t,l):Ft(a,e.child,t,l)}function Ai(e,a,t,l,u){t=t.render;var o=a.ref;if("ref"in l){var d={};for(var f in l)f!=="ref"&&(d[f]=l[f])}else d=l;return _t(a),l=Ss(e,a,t,d,o,u),f=Cs(),e!==null&&!ie?(vs(e,a,u),Va(e,a,u)):(_&&f&&is(a),a.flags|=1,ve(e,a,l,u),a.child)}function ki(e,a,t,l,u){if(e===null){var o=t.type;return typeof o=="function"&&!ns(o)&&o.defaultProps===void 0&&t.compare===null?(a.tag=15,a.type=o,Xm(e,a,o,l,u)):(e=Uo(t.type,null,l,a,a.mode,u),e.ref=a.ref,e.return=a,a.child=e)}if(o=e.child,!Rs(e,u)){var d=o.memoizedProps;if(t=t.compare,t=t!==null?t:wu,t(d,l)&&e.ref===a.ref)return Va(e,a,u)}return a.flags|=1,e=Ha(o,l),e.ref=a.ref,e.return=a,a.child=e}function Xm(e,a,t,l,u){if(e!==null){var o=e.memoizedProps;if(wu(o,l)&&e.ref===a.ref)if(ie=!1,a.pendingProps=l=o,Rs(e,u))(e.flags&131072)!==0&&(ie=!0);else return a.lanes=e.lanes,Va(e,a,u)}return Rr(e,a,t,l,u)}function Ym(e,a,t,l){var u=l.children,o=e!==null?e.memoizedState:null;if(e===null&&a.stateNode===null&&(a.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((a.flags&128)!==0){if(o=o!==null?o.baseLanes|t:t,e!==null){for(l=a.child=e.child,u=0;l!==null;)u=u|l.lanes|l.childLanes,l=l.sibling;l=u&~o}else l=0,a.child=null;return Mi(e,a,o,t,l)}if((t&536870912)!==0)a.memoizedState={baseLanes:0,cachePool:null},e!==null&&zo(a,o!==null?o.cachePool:null),o!==null?gi(a,o):Ar(),fm(a);else return l=a.lanes=536870912,Mi(e,a,o!==null?o.baseLanes|t:t,t,l)}else o!==null?(zo(a,o.cachePool),gi(a,o),et(a),a.memoizedState=null):(e!==null&&zo(a,null),Ar(),et(a));return ve(e,a,u,t),a.child}function iu(e,a){return e!==null&&e.tag===22||a.stateNode!==null||(a.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.sibling}function Mi(e,a,t,l,u){var o=ps();return o=o===null?null:{parent:ne._currentValue,pool:o},a.memoizedState={baseLanes:t,cachePool:o},e!==null&&zo(a,null),Ar(),fm(a),e!==null&&_l(e,a,l,!0),a.childLanes=u,null}function Fo(e,a){return a=rd({mode:a.mode,children:a.children},e.mode),a.ref=e.ref,e.child=a,a.return=e,a}function Ti(e,a,t){return Ft(a,e.child,null,t),e=Fo(a,a.pendingProps),e.flags|=2,Ge(a),a.memoizedState=null,e}function jL(e,a,t){var l=a.pendingProps,u=(a.flags&128)!==0;if(a.flags&=-129,e===null){if(_){if(l.mode==="hidden")return e=Fo(a,l),a.lanes=536870912,iu(null,e);if(kr(a),(e=$)?(e=Hp(e,fa),e=e!==null&&e.data==="&"?e:null,e!==null&&(a.memoizedState={dehydrated:e,treeContext:ht!==null?{id:Sa,overflow:Ca}:null,retryLane:536870912,hydrationErrors:null},t=Jc(e),t.return=a,a.child=t,be=a,$=null)):e=null,e===null)throw Lt(a);return a.lanes=536870912,null}return Fo(a,l)}var o=e.memoizedState;if(o!==null){var d=o.dehydrated;if(kr(a),u)if(a.flags&256)a.flags&=-257,a=Ti(e,a,t);else if(a.memoizedState!==null)a.child=e.child,a.flags|=128,a=null;else throw Error(C(558));else if(ie||_l(e,a,t,!1),u=(t&e.childLanes)!==0,ie||u){if(l=K,l!==null&&(d=bc(l,t),d!==0&&d!==o.retryLane))throw o.retryLane=d,Yt(e,d),ze(l,e,d),Bs;cd(),a=Ti(e,a,t)}else e=o.treeContext,$=sa(d.nextSibling),be=a,_=!0,rt=null,fa=!1,e!==null&&$c(a,e),a=Fo(a,l),a.flags|=4096;return a}return e=Ha(e.child,{mode:l.mode,children:l.children}),e.ref=a.ref,a.child=e,e.return=a,e}function Po(e,a){var t=a.ref;if(t===null)e!==null&&e.ref!==null&&(a.flags|=4194816);else{if(typeof t!="function"&&typeof t!="object")throw Error(C(284));(e===null||e.ref!==t)&&(a.flags|=4194816)}}function Rr(e,a,t,l,u){return _t(a),t=Ss(e,a,t,l,void 0,u),l=Cs(),e!==null&&!ie?(vs(e,a,u),Va(e,a,u)):(_&&l&&is(a),a.flags|=1,ve(e,a,t,u),a.child)}function wi(e,a,t,l,u,o){return _t(a),a.updateQueue=null,t=sm(a,l,t,u),rm(e),l=Cs(),e!==null&&!ie?(vs(e,a,o),Va(e,a,o)):(_&&l&&is(a),a.flags|=1,ve(e,a,t,o),a.child)}function Di(e,a,t,l,u){if(_t(a),a.stateNode===null){var o=gl,d=t.contextType;typeof d=="object"&&d!==null&&(o=Ie(d)),o=new t(l,o),a.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,o.updater=Dr,a.stateNode=o,o._reactInternals=a,o=a.stateNode,o.props=l,o.state=a.memoizedState,o.refs={},hs(a),d=t.contextType,o.context=typeof d=="object"&&d!==null?Ie(d):gl,o.state=a.memoizedState,d=t.getDerivedStateFromProps,typeof d=="function"&&(Hf(a,t,d,l),o.state=a.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(d=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),d!==o.state&&Dr.enqueueReplaceState(o,o.state,null),Su(a,l,o,u),xu(),o.state=a.memoizedState),typeof o.componentDidMount=="function"&&(a.flags|=4194308),l=!0}else if(e===null){o=a.stateNode;var f=a.memoizedProps,r=Nt(t,f);o.props=r;var s=o.context,h=t.contextType;d=gl,typeof h=="object"&&h!==null&&(d=Ie(h));var L=t.getDerivedStateFromProps;h=typeof L=="function"||typeof o.getSnapshotBeforeUpdate=="function",f=a.pendingProps!==f,h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(f||s!==d)&&bi(a,o,l,d),Ja=!1;var m=a.memoizedState;o.state=m,Su(a,l,o,u),xu(),s=a.memoizedState,f||m!==s||Ja?(typeof L=="function"&&(Hf(a,t,L,l),s=a.memoizedState),(r=Ja||yi(a,t,r,l,m,s,d))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(a.flags|=4194308)):(typeof o.componentDidMount=="function"&&(a.flags|=4194308),a.memoizedProps=l,a.memoizedState=s),o.props=l,o.state=s,o.context=d,l=r):(typeof o.componentDidMount=="function"&&(a.flags|=4194308),l=!1)}else{o=a.stateNode,br(e,a),d=a.memoizedProps,h=Nt(t,d),o.props=h,L=a.pendingProps,m=o.context,s=t.contextType,r=gl,typeof s=="object"&&s!==null&&(r=Ie(s)),f=t.getDerivedStateFromProps,(s=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(d!==L||m!==r)&&bi(a,o,l,r),Ja=!1,m=a.memoizedState,o.state=m,Su(a,l,o,u),xu();var g=a.memoizedState;d!==L||m!==g||Ja||e!==null&&e.dependencies!==null&&ad(e.dependencies)?(typeof f=="function"&&(Hf(a,t,f,l),g=a.memoizedState),(h=Ja||yi(a,t,h,l,m,g,r)||e!==null&&e.dependencies!==null&&ad(e.dependencies))?(s||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(l,g,r),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(l,g,r)),typeof o.componentDidUpdate=="function"&&(a.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(a.flags|=1024)):(typeof o.componentDidUpdate!="function"||d===e.memoizedProps&&m===e.memoizedState||(a.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&m===e.memoizedState||(a.flags|=1024),a.memoizedProps=l,a.memoizedState=g),o.props=l,o.state=g,o.context=r,l=h):(typeof o.componentDidUpdate!="function"||d===e.memoizedProps&&m===e.memoizedState||(a.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&m===e.memoizedState||(a.flags|=1024),l=!1)}return o=l,Po(e,a),l=(a.flags&128)!==0,o||l?(o=a.stateNode,t=l&&typeof t.getDerivedStateFromError!="function"?null:o.render(),a.flags|=1,e!==null&&l?(a.child=Ft(a,e.child,null,u),a.child=Ft(a,null,t,u)):ve(e,a,t,u),a.memoizedState=o.state,e=a.child):e=Va(e,a,u),e}function Bi(e,a,t,l){return Ht(),a.flags|=256,ve(e,a,t,l),a.child}var _f={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Ff(e){return{baseLanes:e,cachePool:am()}}function Pf(e,a,t){return e=e!==null?e.childLanes&~t:0,a&&(e|=Xe),e}function Zm(e,a,t){var l=a.pendingProps,u=!1,o=(a.flags&128)!==0,d;if((d=o)||(d=e!==null&&e.memoizedState===null?!1:(oe.current&2)!==0),d&&(u=!0,a.flags&=-129),d=(a.flags&32)!==0,a.flags&=-33,e===null){if(_){if(u?$a(a):et(a),(e=$)?(e=Hp(e,fa),e=e!==null&&e.data!=="&"?e:null,e!==null&&(a.memoizedState={dehydrated:e,treeContext:ht!==null?{id:Sa,overflow:Ca}:null,retryLane:536870912,hydrationErrors:null},t=Jc(e),t.return=a,a.child=t,be=a,$=null)):e=null,e===null)throw Lt(a);return Yr(e)?a.lanes=32:a.lanes=536870912,null}var f=l.children;return l=l.fallback,u?(et(a),u=a.mode,f=rd({mode:"hidden",children:f},u),l=Et(l,u,t,null),f.return=a,l.return=a,f.sibling=l,a.child=f,l=a.child,l.memoizedState=Ff(t),l.childLanes=Pf(e,d,t),a.memoizedState=_f,iu(null,l)):($a(a),Or(a,f))}var r=e.memoizedState;if(r!==null&&(f=r.dehydrated,f!==null)){if(o)a.flags&256?($a(a),a.flags&=-257,a=Nf(e,a,t)):a.memoizedState!==null?(et(a),a.child=e.child,a.flags|=128,a=null):(et(a),f=l.fallback,u=a.mode,l=rd({mode:"visible",children:l.children},u),f=Et(f,u,t,null),f.flags|=2,l.return=a,f.return=a,l.sibling=f,a.child=l,Ft(a,e.child,null,t),l=a.child,l.memoizedState=Ff(t),l.childLanes=Pf(e,d,t),a.memoizedState=_f,a=iu(null,l));else if($a(a),Yr(f)){if(d=f.nextSibling&&f.nextSibling.dataset,d)var s=d.dgst;d=s,l=Error(C(419)),l.stack="",l.digest=d,Bu({value:l,source:null,stack:null}),a=Nf(e,a,t)}else if(ie||_l(e,a,t,!1),d=(t&e.childLanes)!==0,ie||d){if(d=K,d!==null&&(l=bc(d,t),l!==0&&l!==r.retryLane))throw r.retryLane=l,Yt(e,l),ze(d,e,l),Bs;Xr(f)||cd(),a=Nf(e,a,t)}else Xr(f)?(a.flags|=192,a.child=e.child,a=null):(e=r.treeContext,$=sa(f.nextSibling),be=a,_=!0,rt=null,fa=!1,e!==null&&$c(a,e),a=Or(a,l.children),a.flags|=4096);return a}return u?(et(a),f=l.fallback,u=a.mode,r=e.child,s=r.sibling,l=Ha(r,{mode:"hidden",children:l.children}),l.subtreeFlags=r.subtreeFlags&65011712,s!==null?f=Ha(s,f):(f=Et(f,u,t,null),f.flags|=2),f.return=a,l.return=a,l.sibling=f,a.child=l,iu(null,l),l=a.child,f=e.child.memoizedState,f===null?f=Ff(t):(u=f.cachePool,u!==null?(r=ne._currentValue,u=u.parent!==r?{parent:r,pool:r}:u):u=am(),f={baseLanes:f.baseLanes|t,cachePool:u}),l.memoizedState=f,l.childLanes=Pf(e,d,t),a.memoizedState=_f,iu(e.child,l)):($a(a),t=e.child,e=t.sibling,t=Ha(t,{mode:"visible",children:l.children}),t.return=a,t.sibling=null,e!==null&&(d=a.deletions,d===null?(a.deletions=[e],a.flags|=16):d.push(e)),a.child=t,a.memoizedState=null,t)}function Or(e,a){return a=rd({mode:"visible",children:a},e.mode),a.return=e,e.child=a}function rd(e,a){return e=Ve(22,e,null,a),e.lanes=0,e}function Nf(e,a,t){return Ft(a,e.child,null,t),e=Or(a,a.pendingProps.children),e.flags|=2,a.memoizedState=null,e}function Ri(e,a,t){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a),Cr(e.return,a,t)}function Gf(e,a,t,l,u,o){var d=e.memoizedState;d===null?e.memoizedState={isBackwards:a,rendering:null,renderingStartTime:0,last:l,tail:t,tailMode:u,treeForkCount:o}:(d.isBackwards=a,d.rendering=null,d.renderingStartTime=0,d.last=l,d.tail=t,d.tailMode=u,d.treeForkCount=o)}function jm(e,a,t){var l=a.pendingProps,u=l.revealOrder,o=l.tail;l=l.children;var d=oe.current,f=(d&2)!==0;if(f?(d=d&1|2,a.flags|=128):d&=1,Q(oe,d),ve(e,a,l,t),l=_?Du:0,!f&&e!==null&&(e.flags&128)!==0)e:for(e=a.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ri(e,t,a);else if(e.tag===19)Ri(e,t,a);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===a)break e;for(;e.sibling===null;){if(e.return===null||e.return===a)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(t=a.child,u=null;t!==null;)e=t.alternate,e!==null&&ud(e)===null&&(u=t),t=t.sibling;t=u,t===null?(u=a.child,a.child=null):(u=t.sibling,t.sibling=null),Gf(a,!1,u,t,o,l);break;case"backwards":case"unstable_legacy-backwards":for(t=null,u=a.child,a.child=null;u!==null;){if(e=u.alternate,e!==null&&ud(e)===null){a.child=u;break}e=u.sibling,u.sibling=t,t=u,u=e}Gf(a,!0,t,null,o,l);break;case"together":Gf(a,!1,null,null,void 0,l);break;default:a.memoizedState=null}return a.child}function Va(e,a,t){if(e!==null&&(a.dependencies=e.dependencies),St|=a.lanes,(t&a.childLanes)===0)if(e!==null){if(_l(e,a,t,!1),(t&a.childLanes)===0)return null}else return null;if(e!==null&&a.child!==e.child)throw Error(C(153));if(a.child!==null){for(e=a.child,t=Ha(e,e.pendingProps),a.child=t,t.return=a;e.sibling!==null;)e=e.sibling,t=t.sibling=Ha(e,e.pendingProps),t.return=a;t.sibling=null}return a.child}function Rs(e,a){return(e.lanes&a)!==0?!0:(e=e.dependencies,!!(e!==null&&ad(e)))}function KL(e,a,t){switch(a.tag){case 3:jo(a,a.stateNode.containerInfo),Wa(a,ne,e.memoizedState.cache),Ht();break;case 27:case 5:fr(a);break;case 4:jo(a,a.stateNode.containerInfo);break;case 10:Wa(a,a.type,a.memoizedProps.value);break;case 31:if(a.memoizedState!==null)return a.flags|=128,kr(a),null;break;case 13:var l=a.memoizedState;if(l!==null)return l.dehydrated!==null?($a(a),a.flags|=128,null):(t&a.child.childLanes)!==0?Zm(e,a,t):($a(a),e=Va(e,a,t),e!==null?e.sibling:null);$a(a);break;case 19:var u=(e.flags&128)!==0;if(l=(t&a.childLanes)!==0,l||(_l(e,a,t,!1),l=(t&a.childLanes)!==0),u){if(l)return jm(e,a,t);a.flags|=128}if(u=a.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),Q(oe,oe.current),l)break;return null;case 22:return a.lanes=0,Ym(e,a,t,a.pendingProps);case 24:Wa(a,ne,e.memoizedState.cache)}return Va(e,a,t)}function Km(e,a,t){if(e!==null)if(e.memoizedProps!==a.pendingProps)ie=!0;else{if(!Rs(e,t)&&(a.flags&128)===0)return ie=!1,KL(e,a,t);ie=(e.flags&131072)!==0}else ie=!1,_&&(a.flags&1048576)!==0&&Wc(a,Du,a.index);switch(a.lanes=0,a.tag){case 16:e:{var l=a.pendingProps;if(e=Bt(a.elementType),a.type=e,typeof e=="function")ns(e)?(l=Nt(e,l),a.tag=1,a=Di(null,a,e,l,t)):(a.tag=0,a=Rr(null,a,e,l,t));else{if(e!=null){var u=e.$$typeof;if(u===Qr){a.tag=11,a=Ai(null,a,e,l,t);break e}else if(u===Jr){a.tag=14,a=ki(null,a,e,l,t);break e}}throw a=or(e)||e,Error(C(306,a,""))}}return a;case 0:return Rr(e,a,a.type,a.pendingProps,t);case 1:return l=a.type,u=Nt(l,a.pendingProps),Di(e,a,l,u,t);case 3:e:{if(jo(a,a.stateNode.containerInfo),e===null)throw Error(C(387));l=a.pendingProps;var o=a.memoizedState;u=o.element,br(e,a),Su(a,l,null,t);var d=a.memoizedState;if(l=d.cache,Wa(a,ne,l),l!==o.cache&&vr(a,[ne],t,!0),xu(),l=d.element,o.isDehydrated)if(o={element:l,isDehydrated:!1,cache:d.cache},a.updateQueue.baseState=o,a.memoizedState=o,a.flags&256){a=Bi(e,a,l,t);break e}else if(l!==u){u=da(Error(C(424)),a),Bu(u),a=Bi(e,a,l,t);break e}else for(e=a.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,$=sa(e.firstChild),be=a,_=!0,rt=null,fa=!0,t=um(a,null,l,t),a.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Ht(),l===u){a=Va(e,a,t);break e}ve(e,a,l,t)}a=a.child}return a;case 26:return Po(e,a),e===null?(t=ec(a.type,null,a.pendingProps,null))?a.memoizedState=t:_||(t=a.type,e=a.pendingProps,l=hd(ft.current).createElement(t),l[ye]=a,l[He]=e,Ae(l,t,e),Le(l),a.stateNode=l):a.memoizedState=ec(a.type,e.memoizedProps,a.pendingProps,e.memoizedState),null;case 27:return fr(a),e===null&&_&&(l=a.stateNode=_p(a.type,a.pendingProps,ft.current),be=a,fa=!0,u=$,vt(a.type)?(Zr=u,$=sa(l.firstChild)):$=u),ve(e,a,a.pendingProps.children,t),Po(e,a),e===null&&(a.flags|=4194304),a.child;case 5:return e===null&&_&&((u=l=$)&&(l=bx(l,a.type,a.pendingProps,fa),l!==null?(a.stateNode=l,be=a,$=sa(l.firstChild),fa=!1,u=!0):u=!1),u||Lt(a)),fr(a),u=a.type,o=a.pendingProps,d=e!==null?e.memoizedProps:null,l=o.children,Gr(u,o)?l=null:d!==null&&Gr(u,d)&&(a.flags|=32),a.memoizedState!==null&&(u=Ss(e,a,FL,null,null,t),zu._currentValue=u),Po(e,a),ve(e,a,l,t),a.child;case 6:return e===null&&_&&((e=t=$)&&(t=Ix(t,a.pendingProps,fa),t!==null?(a.stateNode=t,be=a,$=null,e=!0):e=!1),e||Lt(a)),null;case 13:return Zm(e,a,t);case 4:return jo(a,a.stateNode.containerInfo),l=a.pendingProps,e===null?a.child=Ft(a,null,l,t):ve(e,a,l,t),a.child;case 11:return Ai(e,a,a.type,a.pendingProps,t);case 7:return ve(e,a,a.pendingProps,t),a.child;case 8:return ve(e,a,a.pendingProps.children,t),a.child;case 12:return ve(e,a,a.pendingProps.children,t),a.child;case 10:return l=a.pendingProps,Wa(a,a.type,l.value),ve(e,a,l.children,t),a.child;case 9:return u=a.type._context,l=a.pendingProps.children,_t(a),u=Ie(u),l=l(u),a.flags|=1,ve(e,a,l,t),a.child;case 14:return ki(e,a,a.type,a.pendingProps,t);case 15:return Xm(e,a,a.type,a.pendingProps,t);case 19:return jm(e,a,t);case 31:return jL(e,a,t);case 22:return Ym(e,a,t,a.pendingProps);case 24:return _t(a),l=Ie(ne),e===null?(u=ps(),u===null&&(u=K,o=ms(),u.pooledCache=o,o.refCount++,o!==null&&(u.pooledCacheLanes|=t),u=o),a.memoizedState={parent:l,cache:u},hs(a),Wa(a,ne,u)):((e.lanes&t)!==0&&(br(e,a),Su(a,null,null,t),xu()),u=e.memoizedState,o=a.memoizedState,u.parent!==l?(u={parent:l,cache:l},a.memoizedState=u,a.lanes===0&&(a.memoizedState=a.updateQueue.baseState=u),Wa(a,ne,l)):(l=o.cache,Wa(a,ne,l),l!==u.cache&&vr(a,[ne],t,!0))),ve(e,a,a.pendingProps.children,t),a.child;case 29:throw a.pendingProps}throw Error(C(156,a.tag))}function wa(e){e.flags|=4}function Vf(e,a,t,l,u){if((a=(e.mode&32)!==0)&&(a=!1),a){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(Sp())e.flags|=8192;else throw Ut=td,gs}else e.flags&=-16777217}function Oi(e,a){if(a.type!=="stylesheet"||(a.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Np(a))if(Sp())e.flags|=8192;else throw Ut=td,gs}function Ao(e,a){a!==null&&(e.flags|=4),e.flags&16384&&(a=e.tag!==22?Cc():536870912,e.lanes|=a,Rl|=a)}function uu(e,a){if(!_)switch(e.tailMode){case"hidden":a=e.tail;for(var t=null;a!==null;)a.alternate!==null&&(t=a),a=a.sibling;t===null?e.tail=null:t.sibling=null;break;case"collapsed":t=e.tail;for(var l=null;t!==null;)t.alternate!==null&&(l=t),t=t.sibling;l===null?a||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function W(e){var a=e.alternate!==null&&e.alternate.child===e.child,t=0,l=0;if(a)for(var u=e.child;u!==null;)t|=u.lanes|u.childLanes,l|=u.subtreeFlags&65011712,l|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)t|=u.lanes|u.childLanes,l|=u.subtreeFlags,l|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=l,e.childLanes=t,a}function QL(e,a,t){var l=a.pendingProps;switch(cs(a),a.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return W(a),null;case 1:return W(a),null;case 3:return t=a.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),a.memoizedState.cache!==l&&(a.flags|=2048),_a(ne),kl(),t.pendingContext&&(t.context=t.pendingContext,t.pendingContext=null),(e===null||e.child===null)&&(ll(a)?wa(a):e===null||e.memoizedState.isDehydrated&&(a.flags&256)===0||(a.flags|=1024,qf())),W(a),null;case 26:var u=a.type,o=a.memoizedState;return e===null?(wa(a),o!==null?(W(a),Oi(a,o)):(W(a),Vf(a,u,null,l,t))):o?o!==e.memoizedState?(wa(a),W(a),Oi(a,o)):(W(a),a.flags&=-16777217):(e=e.memoizedProps,e!==l&&wa(a),W(a),Vf(a,u,e,l,t)),null;case 27:if(Ko(a),t=ft.current,u=a.type,e!==null&&a.stateNode!=null)e.memoizedProps!==l&&wa(a);else{if(!l){if(a.stateNode===null)throw Error(C(166));return W(a),null}e=ya.current,ll(a)?ri(a,e):(e=_p(u,l,t),a.stateNode=e,wa(a))}return W(a),null;case 5:if(Ko(a),u=a.type,e!==null&&a.stateNode!=null)e.memoizedProps!==l&&wa(a);else{if(!l){if(a.stateNode===null)throw Error(C(166));return W(a),null}if(o=ya.current,ll(a))ri(a,o);else{var d=hd(ft.current);switch(o){case 1:o=d.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:o=d.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":o=d.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":o=d.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":o=d.createElement("div"),o.innerHTML="<script><\/script>",o=o.removeChild(o.firstChild);break;case"select":o=typeof l.is=="string"?d.createElement("select",{is:l.is}):d.createElement("select"),l.multiple?o.multiple=!0:l.size&&(o.size=l.size);break;default:o=typeof l.is=="string"?d.createElement(u,{is:l.is}):d.createElement(u)}}o[ye]=a,o[He]=l;e:for(d=a.child;d!==null;){if(d.tag===5||d.tag===6)o.appendChild(d.stateNode);else if(d.tag!==4&&d.tag!==27&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===a)break e;for(;d.sibling===null;){if(d.return===null||d.return===a)break e;d=d.return}d.sibling.return=d.return,d=d.sibling}a.stateNode=o;e:switch(Ae(o,u,l),u){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&wa(a)}}return W(a),Vf(a,a.type,e===null?null:e.memoizedProps,a.pendingProps,t),null;case 6:if(e&&a.stateNode!=null)e.memoizedProps!==l&&wa(a);else{if(typeof l!="string"&&a.stateNode===null)throw Error(C(166));if(e=ft.current,ll(a)){if(e=a.stateNode,t=a.memoizedProps,l=null,u=be,u!==null)switch(u.tag){case 27:case 5:l=u.memoizedProps}e[ye]=a,e=!!(e.nodeValue===t||l!==null&&l.suppressHydrationWarning===!0||qp(e.nodeValue,t)),e||Lt(a,!0)}else e=hd(e).createTextNode(l),e[ye]=a,a.stateNode=e}return W(a),null;case 31:if(t=a.memoizedState,e===null||e.memoizedState!==null){if(l=ll(a),t!==null){if(e===null){if(!l)throw Error(C(318));if(e=a.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(C(557));e[ye]=a}else Ht(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;W(a),e=!1}else t=qf(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=t),e=!0;if(!e)return a.flags&256?(Ge(a),a):(Ge(a),null);if((a.flags&128)!==0)throw Error(C(558))}return W(a),null;case 13:if(l=a.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=ll(a),l!==null&&l.dehydrated!==null){if(e===null){if(!u)throw Error(C(318));if(u=a.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(C(317));u[ye]=a}else Ht(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;W(a),u=!1}else u=qf(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return a.flags&256?(Ge(a),a):(Ge(a),null)}return Ge(a),(a.flags&128)!==0?(a.lanes=t,a):(t=l!==null,e=e!==null&&e.memoizedState!==null,t&&(l=a.child,u=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(u=l.alternate.memoizedState.cachePool.pool),o=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(o=l.memoizedState.cachePool.pool),o!==u&&(l.flags|=2048)),t!==e&&t&&(a.child.flags|=8192),Ao(a,a.updateQueue),W(a),null);case 4:return kl(),e===null&&_s(a.stateNode.containerInfo),W(a),null;case 10:return _a(a.type),W(a),null;case 19:if(xe(oe),l=a.memoizedState,l===null)return W(a),null;if(u=(a.flags&128)!==0,o=l.rendering,o===null)if(u)uu(l,!1);else{if(ue!==0||e!==null&&(e.flags&128)!==0)for(e=a.child;e!==null;){if(o=ud(e),o!==null){for(a.flags|=128,uu(l,!1),e=o.updateQueue,a.updateQueue=e,Ao(a,e),a.subtreeFlags=0,e=t,t=a.child;t!==null;)Qc(t,e),t=t.sibling;return Q(oe,oe.current&1|2),_&&Oa(a,l.treeForkCount),a.child}e=e.sibling}l.tail!==null&&Ye()>nd&&(a.flags|=128,u=!0,uu(l,!1),a.lanes=4194304)}else{if(!u)if(e=ud(o),e!==null){if(a.flags|=128,u=!0,e=e.updateQueue,a.updateQueue=e,Ao(a,e),uu(l,!0),l.tail===null&&l.tailMode==="hidden"&&!o.alternate&&!_)return W(a),null}else 2*Ye()-l.renderingStartTime>nd&&t!==536870912&&(a.flags|=128,u=!0,uu(l,!1),a.lanes=4194304);l.isBackwards?(o.sibling=a.child,a.child=o):(e=l.last,e!==null?e.sibling=o:a.child=o,l.last=o)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Ye(),e.sibling=null,t=oe.current,Q(oe,u?t&1|2:t&1),_&&Oa(a,l.treeForkCount),e):(W(a),null);case 22:case 23:return Ge(a),Ls(),l=a.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(a.flags|=8192):l&&(a.flags|=8192),l?(t&536870912)!==0&&(a.flags&128)===0&&(W(a),a.subtreeFlags&6&&(a.flags|=8192)):W(a),t=a.updateQueue,t!==null&&Ao(a,t.retryQueue),t=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),l=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(l=a.memoizedState.cachePool.pool),l!==t&&(a.flags|=2048),e!==null&&xe(qt),null;case 24:return t=null,e!==null&&(t=e.memoizedState.cache),a.memoizedState.cache!==t&&(a.flags|=2048),_a(ne),W(a),null;case 25:return null;case 30:return null}throw Error(C(156,a.tag))}function JL(e,a){switch(cs(a),a.tag){case 1:return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 3:return _a(ne),kl(),e=a.flags,(e&65536)!==0&&(e&128)===0?(a.flags=e&-65537|128,a):null;case 26:case 27:case 5:return Ko(a),null;case 31:if(a.memoizedState!==null){if(Ge(a),a.alternate===null)throw Error(C(340));Ht()}return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 13:if(Ge(a),e=a.memoizedState,e!==null&&e.dehydrated!==null){if(a.alternate===null)throw Error(C(340));Ht()}return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 19:return xe(oe),null;case 4:return kl(),null;case 10:return _a(a.type),null;case 22:case 23:return Ge(a),Ls(),e!==null&&xe(qt),e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 24:return _a(ne),null;case 25:return null;default:return null}}function Qm(e,a){switch(cs(a),a.tag){case 3:_a(ne),kl();break;case 26:case 27:case 5:Ko(a);break;case 4:kl();break;case 31:a.memoizedState!==null&&Ge(a);break;case 13:Ge(a);break;case 19:xe(oe);break;case 10:_a(a.type);break;case 22:case 23:Ge(a),Ls(),e!==null&&xe(qt);break;case 24:_a(ne)}}function ju(e,a){try{var t=a.updateQueue,l=t!==null?t.lastEffect:null;if(l!==null){var u=l.next;t=u;do{if((t.tag&e)===e){l=void 0;var o=t.create,d=t.inst;l=o(),d.destroy=l}t=t.next}while(t!==u)}}catch(f){X(a,a.return,f)}}function xt(e,a,t){try{var l=a.updateQueue,u=l!==null?l.lastEffect:null;if(u!==null){var o=u.next;l=o;do{if((l.tag&e)===e){var d=l.inst,f=d.destroy;if(f!==void 0){d.destroy=void 0,u=a;var r=t,s=f;try{s()}catch(h){X(u,r,h)}}}l=l.next}while(l!==o)}}catch(h){X(a,a.return,h)}}function Jm(e){var a=e.updateQueue;if(a!==null){var t=e.stateNode;try{dm(a,t)}catch(l){X(e,e.return,l)}}}function Wm(e,a,t){t.props=Nt(e.type,e.memoizedProps),t.state=e.memoizedState;try{t.componentWillUnmount()}catch(l){X(e,a,l)}}function vu(e,a){try{var t=e.ref;if(t!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof t=="function"?e.refCleanup=t(l):t.current=l}}catch(u){X(e,a,u)}}function va(e,a){var t=e.ref,l=e.refCleanup;if(t!==null)if(typeof l=="function")try{l()}catch(u){X(e,a,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof t=="function")try{t(null)}catch(u){X(e,a,u)}else t.current=null}function $m(e){var a=e.type,t=e.memoizedProps,l=e.stateNode;try{e:switch(a){case"button":case"input":case"select":case"textarea":t.autoFocus&&l.focus();break e;case"img":t.src?l.src=t.src:t.srcSet&&(l.srcset=t.srcSet)}}catch(u){X(e,e.return,u)}}function Xf(e,a,t){try{var l=e.stateNode;Lx(l,e.type,t,a),l[He]=a}catch(u){X(e,e.return,u)}}function ep(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&vt(e.type)||e.tag===4}function Yf(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||ep(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&vt(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Er(e,a,t){var l=e.tag;if(l===5||l===6)e=e.stateNode,a?(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t).insertBefore(e,a):(a=t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.appendChild(e),t=t._reactRootContainer,t!=null||a.onclick!==null||(a.onclick=Ua));else if(l!==4&&(l===27&&vt(e.type)&&(t=e.stateNode,a=null),e=e.child,e!==null))for(Er(e,a,t),e=e.sibling;e!==null;)Er(e,a,t),e=e.sibling}function sd(e,a,t){var l=e.tag;if(l===5||l===6)e=e.stateNode,a?t.insertBefore(e,a):t.appendChild(e);else if(l!==4&&(l===27&&vt(e.type)&&(t=e.stateNode),e=e.child,e!==null))for(sd(e,a,t),e=e.sibling;e!==null;)sd(e,a,t),e=e.sibling}function ap(e){var a=e.stateNode,t=e.memoizedProps;try{for(var l=e.type,u=a.attributes;u.length;)a.removeAttributeNode(u[0]);Ae(a,l,t),a[ye]=e,a[He]=t}catch(o){X(e,e.return,o)}}var Ea=!1,se=!1,Zf=!1,Ei=typeof WeakSet=="function"?WeakSet:Set,he=null;function WL(e,a){if(e=e.containerInfo,Pr=Cd,e=Nc(e),fs(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{t=(t=e.ownerDocument)&&t.defaultView||window;var l=t.getSelection&&t.getSelection();if(l&&l.rangeCount!==0){t=l.anchorNode;var u=l.anchorOffset,o=l.focusNode;l=l.focusOffset;try{t.nodeType,o.nodeType}catch{t=null;break e}var d=0,f=-1,r=-1,s=0,h=0,L=e,m=null;a:for(;;){for(var g;L!==t||u!==0&&L.nodeType!==3||(f=d+u),L!==o||l!==0&&L.nodeType!==3||(r=d+l),L.nodeType===3&&(d+=L.nodeValue.length),(g=L.firstChild)!==null;)m=L,L=g;for(;;){if(L===e)break a;if(m===t&&++s===u&&(f=d),m===o&&++h===l&&(r=d),(g=L.nextSibling)!==null)break;L=m,m=L.parentNode}L=g}t=f===-1||r===-1?null:{start:f,end:r}}else t=null}t=t||{start:0,end:0}}else t=null;for(Nr={focusedElem:e,selectionRange:t},Cd=!1,he=a;he!==null;)if(a=he,e=a.child,(a.subtreeFlags&1028)!==0&&e!==null)e.return=a,he=e;else for(;he!==null;){switch(a=he,o=a.alternate,e=a.flags,a.tag){case 0:if((e&4)!==0&&(e=a.updateQueue,e=e!==null?e.events:null,e!==null))for(t=0;t<e.length;t++)u=e[t],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&o!==null){e=void 0,t=a,u=o.memoizedProps,o=o.memoizedState,l=t.stateNode;try{var y=Nt(t.type,u);e=l.getSnapshotBeforeUpdate(y,o),l.__reactInternalSnapshotBeforeUpdate=e}catch(I){X(t,t.return,I)}}break;case 3:if((e&1024)!==0){if(e=a.stateNode.containerInfo,t=e.nodeType,t===9)Vr(e);else if(t===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Vr(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(C(163))}if(e=a.sibling,e!==null){e.return=a.return,he=e;break}he=a.return}}function tp(e,a,t){var l=t.flags;switch(t.tag){case 0:case 11:case 15:Ba(e,t),l&4&&ju(5,t);break;case 1:if(Ba(e,t),l&4)if(e=t.stateNode,a===null)try{e.componentDidMount()}catch(d){X(t,t.return,d)}else{var u=Nt(t.type,a.memoizedProps);a=a.memoizedState;try{e.componentDidUpdate(u,a,e.__reactInternalSnapshotBeforeUpdate)}catch(d){X(t,t.return,d)}}l&64&&Jm(t),l&512&&vu(t,t.return);break;case 3:if(Ba(e,t),l&64&&(e=t.updateQueue,e!==null)){if(a=null,t.child!==null)switch(t.child.tag){case 27:case 5:a=t.child.stateNode;break;case 1:a=t.child.stateNode}try{dm(e,a)}catch(d){X(t,t.return,d)}}break;case 27:a===null&&l&4&&ap(t);case 26:case 5:Ba(e,t),a===null&&l&4&&$m(t),l&512&&vu(t,t.return);break;case 12:Ba(e,t);break;case 31:Ba(e,t),l&4&&op(e,t);break;case 13:Ba(e,t),l&4&&dp(e,t),l&64&&(e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(t=fx.bind(null,t),Ax(e,t))));break;case 22:if(l=t.memoizedState!==null||Ea,!l){a=a!==null&&a.memoizedState!==null||se,u=Ea;var o=se;Ea=l,(se=a)&&!o?Ra(e,t,(t.subtreeFlags&8772)!==0):Ba(e,t),Ea=u,se=o}break;case 30:break;default:Ba(e,t)}}function lp(e){var a=e.alternate;a!==null&&(e.alternate=null,lp(a)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(a=e.stateNode,a!==null&&as(a)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var te=null,qe=!1;function Da(e,a,t){for(t=t.child;t!==null;)up(e,a,t),t=t.sibling}function up(e,a,t){if(Ze&&typeof Ze.onCommitFiberUnmount=="function")try{Ze.onCommitFiberUnmount(Pu,t)}catch{}switch(t.tag){case 26:se||va(t,a),Da(e,a,t),t.memoizedState?t.memoizedState.count--:t.stateNode&&(t=t.stateNode,t.parentNode.removeChild(t));break;case 27:se||va(t,a);var l=te,u=qe;vt(t.type)&&(te=t.stateNode,qe=!1),Da(e,a,t),Au(t.stateNode),te=l,qe=u;break;case 5:se||va(t,a);case 6:if(l=te,u=qe,te=null,Da(e,a,t),te=l,qe=u,te!==null)if(qe)try{(te.nodeType===9?te.body:te.nodeName==="HTML"?te.ownerDocument.body:te).removeChild(t.stateNode)}catch(o){X(t,a,o)}else try{te.removeChild(t.stateNode)}catch(o){X(t,a,o)}break;case 18:te!==null&&(qe?(e=te,Ki(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,t.stateNode),Ul(e)):Ki(te,t.stateNode));break;case 4:l=te,u=qe,te=t.stateNode.containerInfo,qe=!0,Da(e,a,t),te=l,qe=u;break;case 0:case 11:case 14:case 15:xt(2,t,a),se||xt(4,t,a),Da(e,a,t);break;case 1:se||(va(t,a),l=t.stateNode,typeof l.componentWillUnmount=="function"&&Wm(t,a,l)),Da(e,a,t);break;case 21:Da(e,a,t);break;case 22:se=(l=se)||t.memoizedState!==null,Da(e,a,t),se=l;break;default:Da(e,a,t)}}function op(e,a){if(a.memoizedState===null&&(e=a.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Ul(e)}catch(t){X(a,a.return,t)}}}function dp(e,a){if(a.memoizedState===null&&(e=a.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Ul(e)}catch(t){X(a,a.return,t)}}function $L(e){switch(e.tag){case 31:case 13:case 19:var a=e.stateNode;return a===null&&(a=e.stateNode=new Ei),a;case 22:return e=e.stateNode,a=e._retryCache,a===null&&(a=e._retryCache=new Ei),a;default:throw Error(C(435,e.tag))}}function ko(e,a){var t=$L(e);a.forEach(function(l){if(!t.has(l)){t.add(l);var u=rx.bind(null,e,l);l.then(u,u)}})}function Oe(e,a){var t=a.deletions;if(t!==null)for(var l=0;l<t.length;l++){var u=t[l],o=e,d=a,f=d;e:for(;f!==null;){switch(f.tag){case 27:if(vt(f.type)){te=f.stateNode,qe=!1;break e}break;case 5:te=f.stateNode,qe=!1;break e;case 3:case 4:te=f.stateNode.containerInfo,qe=!0;break e}f=f.return}if(te===null)throw Error(C(160));up(o,d,u),te=null,qe=!1,o=u.alternate,o!==null&&(o.return=null),u.return=null}if(a.subtreeFlags&13886)for(a=a.child;a!==null;)fp(a,e),a=a.sibling}var ma=null;function fp(e,a){var t=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Oe(a,e),Ee(e),l&4&&(xt(3,e,e.return),ju(3,e),xt(5,e,e.return));break;case 1:Oe(a,e),Ee(e),l&512&&(se||t===null||va(t,t.return)),l&64&&Ea&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(t=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=t===null?l:t.concat(l))));break;case 26:var u=ma;if(Oe(a,e),Ee(e),l&512&&(se||t===null||va(t,t.return)),l&4){var o=t!==null?t.memoizedState:null;if(l=e.memoizedState,t===null)if(l===null)if(e.stateNode===null){e:{l=e.type,t=e.memoizedProps,u=u.ownerDocument||u;a:switch(l){case"title":o=u.getElementsByTagName("title")[0],(!o||o[Vu]||o[ye]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=u.createElement(l),u.head.insertBefore(o,u.querySelector("head > title"))),Ae(o,l,t),o[ye]=e,Le(o),l=o;break e;case"link":var d=tc("link","href",u).get(l+(t.href||""));if(d){for(var f=0;f<d.length;f++)if(o=d[f],o.getAttribute("href")===(t.href==null||t.href===""?null:t.href)&&o.getAttribute("rel")===(t.rel==null?null:t.rel)&&o.getAttribute("title")===(t.title==null?null:t.title)&&o.getAttribute("crossorigin")===(t.crossOrigin==null?null:t.crossOrigin)){d.splice(f,1);break a}}o=u.createElement(l),Ae(o,l,t),u.head.appendChild(o);break;case"meta":if(d=tc("meta","content",u).get(l+(t.content||""))){for(f=0;f<d.length;f++)if(o=d[f],o.getAttribute("content")===(t.content==null?null:""+t.content)&&o.getAttribute("name")===(t.name==null?null:t.name)&&o.getAttribute("property")===(t.property==null?null:t.property)&&o.getAttribute("http-equiv")===(t.httpEquiv==null?null:t.httpEquiv)&&o.getAttribute("charset")===(t.charSet==null?null:t.charSet)){d.splice(f,1);break a}}o=u.createElement(l),Ae(o,l,t),u.head.appendChild(o);break;default:throw Error(C(468,l))}o[ye]=e,Le(o),l=o}e.stateNode=l}else lc(u,e.type,e.stateNode);else e.stateNode=ac(u,l,e.memoizedProps);else o!==l?(o===null?t.stateNode!==null&&(t=t.stateNode,t.parentNode.removeChild(t)):o.count--,l===null?lc(u,e.type,e.stateNode):ac(u,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Xf(e,e.memoizedProps,t.memoizedProps)}break;case 27:Oe(a,e),Ee(e),l&512&&(se||t===null||va(t,t.return)),t!==null&&l&4&&Xf(e,e.memoizedProps,t.memoizedProps);break;case 5:if(Oe(a,e),Ee(e),l&512&&(se||t===null||va(t,t.return)),e.flags&32){u=e.stateNode;try{Tl(u,"")}catch(y){X(e,e.return,y)}}l&4&&e.stateNode!=null&&(u=e.memoizedProps,Xf(e,u,t!==null?t.memoizedProps:u)),l&1024&&(Zf=!0);break;case 6:if(Oe(a,e),Ee(e),l&4){if(e.stateNode===null)throw Error(C(162));l=e.memoizedProps,t=e.stateNode;try{t.nodeValue=l}catch(y){X(e,e.return,y)}}break;case 3:if(Vo=null,u=ma,ma=Ld(a.containerInfo),Oe(a,e),ma=u,Ee(e),l&4&&t!==null&&t.memoizedState.isDehydrated)try{Ul(a.containerInfo)}catch(y){X(e,e.return,y)}Zf&&(Zf=!1,rp(e));break;case 4:l=ma,ma=Ld(e.stateNode.containerInfo),Oe(a,e),Ee(e),ma=l;break;case 12:Oe(a,e),Ee(e);break;case 31:Oe(a,e),Ee(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,ko(e,l)));break;case 13:Oe(a,e),Ee(e),e.child.flags&8192&&e.memoizedState!==null!=(t!==null&&t.memoizedState!==null)&&(Od=Ye()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,ko(e,l)));break;case 22:u=e.memoizedState!==null;var r=t!==null&&t.memoizedState!==null,s=Ea,h=se;if(Ea=s||u,se=h||r,Oe(a,e),se=h,Ea=s,Ee(e),l&8192)e:for(a=e.stateNode,a._visibility=u?a._visibility&-2:a._visibility|1,u&&(t===null||r||Ea||se||Rt(e)),t=null,a=e;;){if(a.tag===5||a.tag===26){if(t===null){r=t=a;try{if(o=r.stateNode,u)d=o.style,typeof d.setProperty=="function"?d.setProperty("display","none","important"):d.display="none";else{f=r.stateNode;var L=r.memoizedProps.style,m=L!=null&&L.hasOwnProperty("display")?L.display:null;f.style.display=m==null||typeof m=="boolean"?"":(""+m).trim()}}catch(y){X(r,r.return,y)}}}else if(a.tag===6){if(t===null){r=a;try{r.stateNode.nodeValue=u?"":r.memoizedProps}catch(y){X(r,r.return,y)}}}else if(a.tag===18){if(t===null){r=a;try{var g=r.stateNode;u?Qi(g,!0):Qi(r.stateNode,!1)}catch(y){X(r,r.return,y)}}}else if((a.tag!==22&&a.tag!==23||a.memoizedState===null||a===e)&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===e)break e;for(;a.sibling===null;){if(a.return===null||a.return===e)break e;t===a&&(t=null),a=a.return}t===a&&(t=null),a.sibling.return=a.return,a=a.sibling}l&4&&(l=e.updateQueue,l!==null&&(t=l.retryQueue,t!==null&&(l.retryQueue=null,ko(e,t))));break;case 19:Oe(a,e),Ee(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,ko(e,l)));break;case 30:break;case 21:break;default:Oe(a,e),Ee(e)}}function Ee(e){var a=e.flags;if(a&2){try{for(var t,l=e.return;l!==null;){if(ep(l)){t=l;break}l=l.return}if(t==null)throw Error(C(160));switch(t.tag){case 27:var u=t.stateNode,o=Yf(e);sd(e,o,u);break;case 5:var d=t.stateNode;t.flags&32&&(Tl(d,""),t.flags&=-33);var f=Yf(e);sd(e,f,d);break;case 3:case 4:var r=t.stateNode.containerInfo,s=Yf(e);Er(e,s,r);break;default:throw Error(C(161))}}catch(h){X(e,e.return,h)}e.flags&=-3}a&4096&&(e.flags&=-4097)}function rp(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var a=e;rp(a),a.tag===5&&a.flags&1024&&a.stateNode.reset(),e=e.sibling}}function Ba(e,a){if(a.subtreeFlags&8772)for(a=a.child;a!==null;)tp(e,a.alternate,a),a=a.sibling}function Rt(e){for(e=e.child;e!==null;){var a=e;switch(a.tag){case 0:case 11:case 14:case 15:xt(4,a,a.return),Rt(a);break;case 1:va(a,a.return);var t=a.stateNode;typeof t.componentWillUnmount=="function"&&Wm(a,a.return,t),Rt(a);break;case 27:Au(a.stateNode);case 26:case 5:va(a,a.return),Rt(a);break;case 22:a.memoizedState===null&&Rt(a);break;case 30:Rt(a);break;default:Rt(a)}e=e.sibling}}function Ra(e,a,t){for(t=t&&(a.subtreeFlags&8772)!==0,a=a.child;a!==null;){var l=a.alternate,u=e,o=a,d=o.flags;switch(o.tag){case 0:case 11:case 15:Ra(u,o,t),ju(4,o);break;case 1:if(Ra(u,o,t),l=o,u=l.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(s){X(l,l.return,s)}if(l=o,u=l.updateQueue,u!==null){var f=l.stateNode;try{var r=u.shared.hiddenCallbacks;if(r!==null)for(u.shared.hiddenCallbacks=null,u=0;u<r.length;u++)om(r[u],f)}catch(s){X(l,l.return,s)}}t&&d&64&&Jm(o),vu(o,o.return);break;case 27:ap(o);case 26:case 5:Ra(u,o,t),t&&l===null&&d&4&&$m(o),vu(o,o.return);break;case 12:Ra(u,o,t);break;case 31:Ra(u,o,t),t&&d&4&&op(u,o);break;case 13:Ra(u,o,t),t&&d&4&&dp(u,o);break;case 22:o.memoizedState===null&&Ra(u,o,t),vu(o,o.return);break;case 30:break;default:Ra(u,o,t)}a=a.sibling}}function Os(e,a){var t=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),e=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(e=a.memoizedState.cachePool.pool),e!==t&&(e!=null&&e.refCount++,t!=null&&Yu(t))}function Es(e,a){e=null,a.alternate!==null&&(e=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==e&&(a.refCount++,e!=null&&Yu(e))}function ca(e,a,t,l){if(a.subtreeFlags&10256)for(a=a.child;a!==null;)sp(e,a,t,l),a=a.sibling}function sp(e,a,t,l){var u=a.flags;switch(a.tag){case 0:case 11:case 15:ca(e,a,t,l),u&2048&&ju(9,a);break;case 1:ca(e,a,t,l);break;case 3:ca(e,a,t,l),u&2048&&(e=null,a.alternate!==null&&(e=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==e&&(a.refCount++,e!=null&&Yu(e)));break;case 12:if(u&2048){ca(e,a,t,l),e=a.stateNode;try{var o=a.memoizedProps,d=o.id,f=o.onPostCommit;typeof f=="function"&&f(d,a.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(r){X(a,a.return,r)}}else ca(e,a,t,l);break;case 31:ca(e,a,t,l);break;case 13:ca(e,a,t,l);break;case 23:break;case 22:o=a.stateNode,d=a.alternate,a.memoizedState!==null?o._visibility&2?ca(e,a,t,l):yu(e,a):o._visibility&2?ca(e,a,t,l):(o._visibility|=2,ol(e,a,t,l,(a.subtreeFlags&10256)!==0||!1)),u&2048&&Os(d,a);break;case 24:ca(e,a,t,l),u&2048&&Es(a.alternate,a);break;default:ca(e,a,t,l)}}function ol(e,a,t,l,u){for(u=u&&((a.subtreeFlags&10256)!==0||!1),a=a.child;a!==null;){var o=e,d=a,f=t,r=l,s=d.flags;switch(d.tag){case 0:case 11:case 15:ol(o,d,f,r,u),ju(8,d);break;case 23:break;case 22:var h=d.stateNode;d.memoizedState!==null?h._visibility&2?ol(o,d,f,r,u):yu(o,d):(h._visibility|=2,ol(o,d,f,r,u)),u&&s&2048&&Os(d.alternate,d);break;case 24:ol(o,d,f,r,u),u&&s&2048&&Es(d.alternate,d);break;default:ol(o,d,f,r,u)}a=a.sibling}}function yu(e,a){if(a.subtreeFlags&10256)for(a=a.child;a!==null;){var t=e,l=a,u=l.flags;switch(l.tag){case 22:yu(t,l),u&2048&&Os(l.alternate,l);break;case 24:yu(t,l),u&2048&&Es(l.alternate,l);break;default:yu(t,l)}a=a.sibling}}var cu=8192;function ul(e,a,t){if(e.subtreeFlags&cu)for(e=e.child;e!==null;)np(e,a,t),e=e.sibling}function np(e,a,t){switch(e.tag){case 26:ul(e,a,t),e.flags&cu&&e.memoizedState!==null&&zx(t,ma,e.memoizedState,e.memoizedProps);break;case 5:ul(e,a,t);break;case 3:case 4:var l=ma;ma=Ld(e.stateNode.containerInfo),ul(e,a,t),ma=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=cu,cu=16777216,ul(e,a,t),cu=l):ul(e,a,t));break;default:ul(e,a,t)}}function ip(e){var a=e.alternate;if(a!==null&&(e=a.child,e!==null)){a.child=null;do a=e.sibling,e.sibling=null,e=a;while(e!==null)}}function ou(e){var a=e.deletions;if((e.flags&16)!==0){if(a!==null)for(var t=0;t<a.length;t++){var l=a[t];he=l,mp(l,e)}ip(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)cp(e),e=e.sibling}function cp(e){switch(e.tag){case 0:case 11:case 15:ou(e),e.flags&2048&&xt(9,e,e.return);break;case 3:ou(e);break;case 12:ou(e);break;case 22:var a=e.stateNode;e.memoizedState!==null&&a._visibility&2&&(e.return===null||e.return.tag!==13)?(a._visibility&=-3,No(e)):ou(e);break;default:ou(e)}}function No(e){var a=e.deletions;if((e.flags&16)!==0){if(a!==null)for(var t=0;t<a.length;t++){var l=a[t];he=l,mp(l,e)}ip(e)}for(e=e.child;e!==null;){switch(a=e,a.tag){case 0:case 11:case 15:xt(8,a,a.return),No(a);break;case 22:t=a.stateNode,t._visibility&2&&(t._visibility&=-3,No(a));break;default:No(a)}e=e.sibling}}function mp(e,a){for(;he!==null;){var t=he;switch(t.tag){case 0:case 11:case 15:xt(8,t,a);break;case 23:case 22:if(t.memoizedState!==null&&t.memoizedState.cachePool!==null){var l=t.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Yu(t.memoizedState.cache)}if(l=t.child,l!==null)l.return=t,he=l;else e:for(t=e;he!==null;){l=he;var u=l.sibling,o=l.return;if(lp(l),l===t){he=null;break e}if(u!==null){u.return=o,he=u;break e}he=o}}}var ex={getCacheForType:function(e){var a=Ie(ne),t=a.data.get(e);return t===void 0&&(t=e(),a.data.set(e,t)),t},cacheSignal:function(){return Ie(ne).controller.signal}},ax=typeof WeakMap=="function"?WeakMap:Map,P=0,K=null,z=null,H=0,V=0,Ne=null,ut=!1,Pl=!1,qs=!1,Xa=0,ue=0,St=0,zt=0,Us=0,Xe=0,Rl=0,bu=null,Ue=null,qr=!1,Od=0,pp=0,nd=1/0,id=null,it=null,ce=0,ct=null,Ol=null,Fa=0,Ur=0,zr=null,gp=null,Iu=0,Hr=null;function Ke(){return(P&2)!==0&&H!==0?H&-H:B.T!==null?Hs():Ic()}function hp(){if(Xe===0)if((H&536870912)===0||_){var e=ho;ho<<=1,(ho&3932160)===0&&(ho=262144),Xe=e}else Xe=536870912;return e=Je.current,e!==null&&(e.flags|=32),Xe}function ze(e,a,t){(e===K&&(V===2||V===9)||e.cancelPendingCommit!==null)&&(El(e,0),ot(e,H,Xe,!1)),Gu(e,t),((P&2)===0||e!==K)&&(e===K&&((P&2)===0&&(zt|=t),ue===4&&ot(e,H,Xe,!1)),Ia(e))}function Lp(e,a,t){if((P&6)!==0)throw Error(C(327));var l=!t&&(a&127)===0&&(a&e.expiredLanes)===0||Nu(e,a),u=l?ux(e,a):jf(e,a,!0),o=l;do{if(u===0){Pl&&!l&&ot(e,a,0,!1);break}else{if(t=e.current.alternate,o&&!tx(t)){u=jf(e,a,!1),o=!1;continue}if(u===2){if(o=a,e.errorRecoveryDisabledLanes&o)var d=0;else d=e.pendingLanes&-536870913,d=d!==0?d:d&536870912?536870912:0;if(d!==0){a=d;e:{var f=e;u=bu;var r=f.current.memoizedState.isDehydrated;if(r&&(El(f,d).flags|=256),d=jf(f,d,!1),d!==2){if(qs&&!r){f.errorRecoveryDisabledLanes|=o,zt|=o,u=4;break e}o=Ue,Ue=u,o!==null&&(Ue===null?Ue=o:Ue.push.apply(Ue,o))}u=d}if(o=!1,u!==2)continue}}if(u===1){El(e,0),ot(e,a,0,!0);break}e:{switch(l=e,o=u,o){case 0:case 1:throw Error(C(345));case 4:if((a&4194048)!==a)break;case 6:ot(l,a,Xe,!ut);break e;case 2:Ue=null;break;case 3:case 5:break;default:throw Error(C(329))}if((a&62914560)===a&&(u=Od+300-Ye(),10<u)){if(ot(l,a,Xe,!ut),yd(l,0,!0)!==0)break e;Fa=a,l.timeoutHandle=zp(qi.bind(null,l,t,Ue,id,qr,a,Xe,zt,Rl,ut,o,"Throttled",-0,0),u);break e}qi(l,t,Ue,id,qr,a,Xe,zt,Rl,ut,o,null,-0,0)}}break}while(!0);Ia(e)}function qi(e,a,t,l,u,o,d,f,r,s,h,L,m,g){if(e.timeoutHandle=-1,L=a.subtreeFlags,L&8192||(L&16785408)===16785408){L={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ua},np(a,o,L);var y=(o&62914560)===o?Od-Ye():(o&4194048)===o?pp-Ye():0;if(y=Hx(L,y),y!==null){Fa=o,e.cancelPendingCommit=y(zi.bind(null,e,a,o,t,l,u,d,f,r,h,L,null,m,g)),ot(e,o,d,!s);return}}zi(e,a,o,t,l,u,d,f,r)}function tx(e){for(var a=e;;){var t=a.tag;if((t===0||t===11||t===15)&&a.flags&16384&&(t=a.updateQueue,t!==null&&(t=t.stores,t!==null)))for(var l=0;l<t.length;l++){var u=t[l],o=u.getSnapshot;u=u.value;try{if(!Qe(o(),u))return!1}catch{return!1}}if(t=a.child,a.subtreeFlags&16384&&t!==null)t.return=a,a=t;else{if(a===e)break;for(;a.sibling===null;){if(a.return===null||a.return===e)return!0;a=a.return}a.sibling.return=a.return,a=a.sibling}}return!0}function ot(e,a,t,l){a&=~Us,a&=~zt,e.suspendedLanes|=a,e.pingedLanes&=~a,l&&(e.warmLanes|=a),l=e.expirationTimes;for(var u=a;0<u;){var o=31-je(u),d=1<<o;l[o]=-1,u&=~d}t!==0&&vc(e,t,a)}function Ed(){return(P&6)===0?(Ku(0,!1),!1):!0}function zs(){if(z!==null){if(V===0)var e=z.return;else e=z,za=Zt=null,ys(e),bl=null,Ru=0,e=z;for(;e!==null;)Qm(e.alternate,e),e=e.return;z=null}}function El(e,a){var t=e.timeoutHandle;t!==-1&&(e.timeoutHandle=-1,Cx(t)),t=e.cancelPendingCommit,t!==null&&(e.cancelPendingCommit=null,t()),Fa=0,zs(),K=e,z=t=Ha(e.current,null),H=a,V=0,Ne=null,ut=!1,Pl=Nu(e,a),qs=!1,Rl=Xe=Us=zt=St=ue=0,Ue=bu=null,qr=!1,(a&8)!==0&&(a|=a&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=a;0<l;){var u=31-je(l),o=1<<u;a|=e[u],l&=~o}return Xa=a,kd(),t}function xp(e,a){O=null,B.H=Eu,a===Fl||a===Td?(a=mi(),V=3):a===gs?(a=mi(),V=4):V=a===Bs?8:a!==null&&typeof a=="object"&&typeof a.then=="function"?6:1,Ne=a,z===null&&(ue=1,fd(e,da(a,e.current)))}function Sp(){var e=Je.current;return e===null?!0:(H&4194048)===H?ra===null:(H&62914560)===H||(H&536870912)!==0?e===ra:!1}function Cp(){var e=B.H;return B.H=Eu,e===null?Eu:e}function vp(){var e=B.A;return B.A=ex,e}function cd(){ue=4,ut||(H&4194048)!==H&&Je.current!==null||(Pl=!0),(St&134217727)===0&&(zt&134217727)===0||K===null||ot(K,H,Xe,!1)}function jf(e,a,t){var l=P;P|=2;var u=Cp(),o=vp();(K!==e||H!==a)&&(id=null,El(e,a)),a=!1;var d=ue;e:do try{if(V!==0&&z!==null){var f=z,r=Ne;switch(V){case 8:zs(),d=6;break e;case 3:case 2:case 9:case 6:Je.current===null&&(a=!0);var s=V;if(V=0,Ne=null,xl(e,f,r,s),t&&Pl){d=0;break e}break;default:s=V,V=0,Ne=null,xl(e,f,r,s)}}lx(),d=ue;break}catch(h){xp(e,h)}while(!0);return a&&e.shellSuspendCounter++,za=Zt=null,P=l,B.H=u,B.A=o,z===null&&(K=null,H=0,kd()),d}function lx(){for(;z!==null;)yp(z)}function ux(e,a){var t=P;P|=2;var l=Cp(),u=vp();K!==e||H!==a?(id=null,nd=Ye()+500,El(e,a)):Pl=Nu(e,a);e:do try{if(V!==0&&z!==null){a=z;var o=Ne;a:switch(V){case 1:V=0,Ne=null,xl(e,a,o,1);break;case 2:case 9:if(ci(o)){V=0,Ne=null,Ui(a);break}a=function(){V!==2&&V!==9||K!==e||(V=7),Ia(e)},o.then(a,a);break e;case 3:V=7;break e;case 4:V=5;break e;case 7:ci(o)?(V=0,Ne=null,Ui(a)):(V=0,Ne=null,xl(e,a,o,7));break;case 5:var d=null;switch(z.tag){case 26:d=z.memoizedState;case 5:case 27:var f=z;if(d?Np(d):f.stateNode.complete){V=0,Ne=null;var r=f.sibling;if(r!==null)z=r;else{var s=f.return;s!==null?(z=s,qd(s)):z=null}break a}}V=0,Ne=null,xl(e,a,o,5);break;case 6:V=0,Ne=null,xl(e,a,o,6);break;case 8:zs(),ue=6;break e;default:throw Error(C(462))}}ox();break}catch(h){xp(e,h)}while(!0);return za=Zt=null,B.H=l,B.A=u,P=t,z!==null?0:(K=null,H=0,kd(),ue)}function ox(){for(;z!==null&&!Th();)yp(z)}function yp(e){var a=Km(e.alternate,e,Xa);e.memoizedProps=e.pendingProps,a===null?qd(e):z=a}function Ui(e){var a=e,t=a.alternate;switch(a.tag){case 15:case 0:a=wi(t,a,a.pendingProps,a.type,void 0,H);break;case 11:a=wi(t,a,a.pendingProps,a.type.render,a.ref,H);break;case 5:ys(a);default:Qm(t,a),a=z=Qc(a,Xa),a=Km(t,a,Xa)}e.memoizedProps=e.pendingProps,a===null?qd(e):z=a}function xl(e,a,t,l){za=Zt=null,ys(a),bl=null,Ru=0;var u=a.return;try{if(ZL(e,u,a,t,H)){ue=1,fd(e,da(t,e.current)),z=null;return}}catch(o){if(u!==null)throw z=u,o;ue=1,fd(e,da(t,e.current)),z=null;return}a.flags&32768?(_||l===1?e=!0:Pl||(H&536870912)!==0?e=!1:(ut=e=!0,(l===2||l===9||l===3||l===6)&&(l=Je.current,l!==null&&l.tag===13&&(l.flags|=16384))),bp(a,e)):qd(a)}function qd(e){var a=e;do{if((a.flags&32768)!==0){bp(a,ut);return}e=a.return;var t=QL(a.alternate,a,Xa);if(t!==null){z=t;return}if(a=a.sibling,a!==null){z=a;return}z=a=e}while(a!==null);ue===0&&(ue=5)}function bp(e,a){do{var t=JL(e.alternate,e);if(t!==null){t.flags&=32767,z=t;return}if(t=e.return,t!==null&&(t.flags|=32768,t.subtreeFlags=0,t.deletions=null),!a&&(e=e.sibling,e!==null)){z=e;return}z=e=t}while(e!==null);ue=6,z=null}function zi(e,a,t,l,u,o,d,f,r){e.cancelPendingCommit=null;do Ud();while(ce!==0);if((P&6)!==0)throw Error(C(327));if(a!==null){if(a===e.current)throw Error(C(177));if(o=a.lanes|a.childLanes,o|=rs,Hh(e,t,o,d,f,r),e===K&&(z=K=null,H=0),Ol=a,ct=e,Fa=t,Ur=o,zr=u,gp=l,(a.subtreeFlags&10256)!==0||(a.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,sx(Qo,function(){return Tp(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(a.flags&13878)!==0,(a.subtreeFlags&13878)!==0||l){l=B.T,B.T=null,u=N.p,N.p=2,d=P,P|=4;try{WL(e,a,t)}finally{P=d,N.p=u,B.T=l}}ce=1,Ip(),Ap(),kp()}}function Ip(){if(ce===1){ce=0;var e=ct,a=Ol,t=(a.flags&13878)!==0;if((a.subtreeFlags&13878)!==0||t){t=B.T,B.T=null;var l=N.p;N.p=2;var u=P;P|=4;try{fp(a,e);var o=Nr,d=Nc(e.containerInfo),f=o.focusedElem,r=o.selectionRange;if(d!==f&&f&&f.ownerDocument&&Pc(f.ownerDocument.documentElement,f)){if(r!==null&&fs(f)){var s=r.start,h=r.end;if(h===void 0&&(h=s),"selectionStart"in f)f.selectionStart=s,f.selectionEnd=Math.min(h,f.value.length);else{var L=f.ownerDocument||document,m=L&&L.defaultView||window;if(m.getSelection){var g=m.getSelection(),y=f.textContent.length,I=Math.min(r.start,y),w=r.end===void 0?I:Math.min(r.end,y);!g.extend&&I>w&&(d=w,w=I,I=d);var c=oi(f,I),n=oi(f,w);if(c&&n&&(g.rangeCount!==1||g.anchorNode!==c.node||g.anchorOffset!==c.offset||g.focusNode!==n.node||g.focusOffset!==n.offset)){var p=L.createRange();p.setStart(c.node,c.offset),g.removeAllRanges(),I>w?(g.addRange(p),g.extend(n.node,n.offset)):(p.setEnd(n.node,n.offset),g.addRange(p))}}}}for(L=[],g=f;g=g.parentNode;)g.nodeType===1&&L.push({element:g,left:g.scrollLeft,top:g.scrollTop});for(typeof f.focus=="function"&&f.focus(),f=0;f<L.length;f++){var i=L[f];i.element.scrollLeft=i.left,i.element.scrollTop=i.top}}Cd=!!Pr,Nr=Pr=null}finally{P=u,N.p=l,B.T=t}}e.current=a,ce=2}}function Ap(){if(ce===2){ce=0;var e=ct,a=Ol,t=(a.flags&8772)!==0;if((a.subtreeFlags&8772)!==0||t){t=B.T,B.T=null;var l=N.p;N.p=2;var u=P;P|=4;try{tp(e,a.alternate,a)}finally{P=u,N.p=l,B.T=t}}ce=3}}function kp(){if(ce===4||ce===3){ce=0,wh();var e=ct,a=Ol,t=Fa,l=gp;(a.subtreeFlags&10256)!==0||(a.flags&10256)!==0?ce=5:(ce=0,Ol=ct=null,Mp(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(it=null),es(t),a=a.stateNode,Ze&&typeof Ze.onCommitFiberRoot=="function")try{Ze.onCommitFiberRoot(Pu,a,void 0,(a.current.flags&128)===128)}catch{}if(l!==null){a=B.T,u=N.p,N.p=2,B.T=null;try{for(var o=e.onRecoverableError,d=0;d<l.length;d++){var f=l[d];o(f.value,{componentStack:f.stack})}}finally{B.T=a,N.p=u}}(Fa&3)!==0&&Ud(),Ia(e),u=e.pendingLanes,(t&261930)!==0&&(u&42)!==0?e===Hr?Iu++:(Iu=0,Hr=e):Iu=0,Ku(0,!1)}}function Mp(e,a){(e.pooledCacheLanes&=a)===0&&(a=e.pooledCache,a!=null&&(e.pooledCache=null,Yu(a)))}function Ud(){return Ip(),Ap(),kp(),Tp()}function Tp(){if(ce!==5)return!1;var e=ct,a=Ur;Ur=0;var t=es(Fa),l=B.T,u=N.p;try{N.p=32>t?32:t,B.T=null,t=zr,zr=null;var o=ct,d=Fa;if(ce=0,Ol=ct=null,Fa=0,(P&6)!==0)throw Error(C(331));var f=P;if(P|=4,cp(o.current),sp(o,o.current,d,t),P=f,Ku(0,!1),Ze&&typeof Ze.onPostCommitFiberRoot=="function")try{Ze.onPostCommitFiberRoot(Pu,o)}catch{}return!0}finally{N.p=u,B.T=l,Mp(e,a)}}function Hi(e,a,t){a=da(t,a),a=Br(e.stateNode,a,2),e=nt(e,a,2),e!==null&&(Gu(e,2),Ia(e))}function X(e,a,t){if(e.tag===3)Hi(e,e,t);else for(;a!==null;){if(a.tag===3){Hi(a,e,t);break}else if(a.tag===1){var l=a.stateNode;if(typeof a.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(it===null||!it.has(l))){e=da(t,e),t=Gm(2),l=nt(a,t,2),l!==null&&(Vm(t,l,a,e),Gu(l,2),Ia(l));break}}a=a.return}}function Kf(e,a,t){var l=e.pingCache;if(l===null){l=e.pingCache=new ax;var u=new Set;l.set(a,u)}else u=l.get(a),u===void 0&&(u=new Set,l.set(a,u));u.has(t)||(qs=!0,u.add(t),e=dx.bind(null,e,a,t),a.then(e,e))}function dx(e,a,t){var l=e.pingCache;l!==null&&l.delete(a),e.pingedLanes|=e.suspendedLanes&t,e.warmLanes&=~t,K===e&&(H&t)===t&&(ue===4||ue===3&&(H&62914560)===H&&300>Ye()-Od?(P&2)===0&&El(e,0):Us|=t,Rl===H&&(Rl=0)),Ia(e)}function wp(e,a){a===0&&(a=Cc()),e=Yt(e,a),e!==null&&(Gu(e,a),Ia(e))}function fx(e){var a=e.memoizedState,t=0;a!==null&&(t=a.retryLane),wp(e,t)}function rx(e,a){var t=0;switch(e.tag){case 31:case 13:var l=e.stateNode,u=e.memoizedState;u!==null&&(t=u.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(C(314))}l!==null&&l.delete(a),wp(e,t)}function sx(e,a){return Wr(e,a)}var md=null,dl=null,_r=!1,pd=!1,Qf=!1,dt=0;function Ia(e){e!==dl&&e.next===null&&(dl===null?md=dl=e:dl=dl.next=e),pd=!0,_r||(_r=!0,ix())}function Ku(e,a){if(!Qf&&pd){Qf=!0;do for(var t=!1,l=md;l!==null;){if(!a)if(e!==0){var u=l.pendingLanes;if(u===0)var o=0;else{var d=l.suspendedLanes,f=l.pingedLanes;o=(1<<31-je(42|e)+1)-1,o&=u&~(d&~f),o=o&201326741?o&201326741|1:o?o|2:0}o!==0&&(t=!0,_i(l,o))}else o=H,o=yd(l,l===K?o:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(o&3)===0||Nu(l,o)||(t=!0,_i(l,o));l=l.next}while(t);Qf=!1}}function nx(){Dp()}function Dp(){pd=_r=!1;var e=0;dt!==0&&Sx()&&(e=dt);for(var a=Ye(),t=null,l=md;l!==null;){var u=l.next,o=Bp(l,a);o===0?(l.next=null,t===null?md=u:t.next=u,u===null&&(dl=t)):(t=l,(e!==0||(o&3)!==0)&&(pd=!0)),l=u}ce!==0&&ce!==5||Ku(e,!1),dt!==0&&(dt=0)}function Bp(e,a){for(var t=e.suspendedLanes,l=e.pingedLanes,u=e.expirationTimes,o=e.pendingLanes&-62914561;0<o;){var d=31-je(o),f=1<<d,r=u[d];r===-1?((f&t)===0||(f&l)!==0)&&(u[d]=zh(f,a)):r<=a&&(e.expiredLanes|=f),o&=~f}if(a=K,t=H,t=yd(e,e===a?t:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,t===0||e===a&&(V===2||V===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&Af(l),e.callbackNode=null,e.callbackPriority=0;if((t&3)===0||Nu(e,t)){if(a=t&-t,a===e.callbackPriority)return a;switch(l!==null&&Af(l),es(t)){case 2:case 8:t=xc;break;case 32:t=Qo;break;case 268435456:t=Sc;break;default:t=Qo}return l=Rp.bind(null,e),t=Wr(t,l),e.callbackPriority=a,e.callbackNode=t,a}return l!==null&&l!==null&&Af(l),e.callbackPriority=2,e.callbackNode=null,2}function Rp(e,a){if(ce!==0&&ce!==5)return e.callbackNode=null,e.callbackPriority=0,null;var t=e.callbackNode;if(Ud()&&e.callbackNode!==t)return null;var l=H;return l=yd(e,e===K?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(Lp(e,l,a),Bp(e,Ye()),e.callbackNode!=null&&e.callbackNode===t?Rp.bind(null,e):null)}function _i(e,a){if(Ud())return null;Lp(e,a,!0)}function ix(){vx(function(){(P&6)!==0?Wr(Lc,nx):Dp()})}function Hs(){if(dt===0){var e=wl;e===0&&(e=go,go<<=1,(go&261888)===0&&(go=256)),dt=e}return dt}function Fi(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Oo(""+e)}function Pi(e,a){var t=a.ownerDocument.createElement("input");return t.name=a.name,t.value=a.value,e.id&&t.setAttribute("form",e.id),a.parentNode.insertBefore(t,a),e=new FormData(e),t.parentNode.removeChild(t),e}function cx(e,a,t,l,u){if(a==="submit"&&t&&t.stateNode===u){var o=Fi((u[He]||null).action),d=l.submitter;d&&(a=(a=d[He]||null)?Fi(a.formAction):d.getAttribute("formAction"),a!==null&&(o=a,d=null));var f=new bd("action","action",null,l,u);e.push({event:f,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(dt!==0){var r=d?Pi(u,d):new FormData(u);wr(t,{pending:!0,data:r,method:u.method,action:o},null,r)}}else typeof o=="function"&&(f.preventDefault(),r=d?Pi(u,d):new FormData(u),wr(t,{pending:!0,data:r,method:u.method,action:o},o,r))},currentTarget:u}]})}}for(Mo=0;Mo<Lr.length;Mo++)To=Lr[Mo],Ni=To.toLowerCase(),Gi=To[0].toUpperCase()+To.slice(1),pa(Ni,"on"+Gi);var To,Ni,Gi,Mo;pa(Vc,"onAnimationEnd");pa(Xc,"onAnimationIteration");pa(Yc,"onAnimationStart");pa("dblclick","onDoubleClick");pa("focusin","onFocus");pa("focusout","onBlur");pa(DL,"onTransitionRun");pa(BL,"onTransitionStart");pa(RL,"onTransitionCancel");pa(Zc,"onTransitionEnd");Ml("onMouseEnter",["mouseout","mouseover"]);Ml("onMouseLeave",["mouseout","mouseover"]);Ml("onPointerEnter",["pointerout","pointerover"]);Ml("onPointerLeave",["pointerout","pointerover"]);Gt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Gt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Gt("onBeforeInput",["compositionend","keypress","textInput","paste"]);Gt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Gt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Gt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var qu="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mx=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(qu));function Op(e,a){a=(a&4)!==0;for(var t=0;t<e.length;t++){var l=e[t],u=l.event;l=l.listeners;e:{var o=void 0;if(a)for(var d=l.length-1;0<=d;d--){var f=l[d],r=f.instance,s=f.currentTarget;if(f=f.listener,r!==o&&u.isPropagationStopped())break e;o=f,u.currentTarget=s;try{o(u)}catch(h){Wo(h)}u.currentTarget=null,o=r}else for(d=0;d<l.length;d++){if(f=l[d],r=f.instance,s=f.currentTarget,f=f.listener,r!==o&&u.isPropagationStopped())break e;o=f,u.currentTarget=s;try{o(u)}catch(h){Wo(h)}u.currentTarget=null,o=r}}}}function U(e,a){var t=a[sr];t===void 0&&(t=a[sr]=new Set);var l=e+"__bubble";t.has(l)||(Ep(a,e,2,!1),t.add(l))}function Jf(e,a,t){var l=0;a&&(l|=4),Ep(t,e,l,a)}var wo="_reactListening"+Math.random().toString(36).slice(2);function _s(e){if(!e[wo]){e[wo]=!0,Ac.forEach(function(t){t!=="selectionchange"&&(mx.has(t)||Jf(t,!1,e),Jf(t,!0,e))});var a=e.nodeType===9?e:e.ownerDocument;a===null||a[wo]||(a[wo]=!0,Jf("selectionchange",!1,a))}}function Ep(e,a,t,l){switch(Zp(a)){case 2:var u=Px;break;case 8:u=Nx;break;default:u=Gs}t=u.bind(null,a,t,e),u=void 0,!pr||a!=="touchstart"&&a!=="touchmove"&&a!=="wheel"||(u=!0),l?u!==void 0?e.addEventListener(a,t,{capture:!0,passive:u}):e.addEventListener(a,t,!0):u!==void 0?e.addEventListener(a,t,{passive:u}):e.addEventListener(a,t,!1)}function Wf(e,a,t,l,u){var o=l;if((a&1)===0&&(a&2)===0&&l!==null)e:for(;;){if(l===null)return;var d=l.tag;if(d===3||d===4){var f=l.stateNode.containerInfo;if(f===u)break;if(d===4)for(d=l.return;d!==null;){var r=d.tag;if((r===3||r===4)&&d.stateNode.containerInfo===u)return;d=d.return}for(;f!==null;){if(d=sl(f),d===null)return;if(r=d.tag,r===5||r===6||r===26||r===27){l=o=d;continue e}f=f.parentNode}}l=l.return}Oc(function(){var s=o,h=ls(t),L=[];e:{var m=jc.get(e);if(m!==void 0){var g=bd,y=e;switch(e){case"keypress":if(qo(t)===0)break e;case"keydown":case"keyup":g=rL;break;case"focusin":y="focus",g=Df;break;case"focusout":y="blur",g=Df;break;case"beforeblur":case"afterblur":g=Df;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":g=Qn;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":g=Qh;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":g=iL;break;case Vc:case Xc:case Yc:g=$h;break;case Zc:g=mL;break;case"scroll":case"scrollend":g=jh;break;case"wheel":g=gL;break;case"copy":case"cut":case"paste":g=aL;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":g=Wn;break;case"toggle":case"beforetoggle":g=LL}var I=(a&4)!==0,w=!I&&(e==="scroll"||e==="scrollend"),c=I?m!==null?m+"Capture":null:m;I=[];for(var n=s,p;n!==null;){var i=n;if(p=i.stateNode,i=i.tag,i!==5&&i!==26&&i!==27||p===null||c===null||(i=Mu(n,c),i!=null&&I.push(Uu(n,i,p))),w)break;n=n.return}0<I.length&&(m=new g(m,y,null,t,h),L.push({event:m,listeners:I}))}}if((a&7)===0){e:{if(m=e==="mouseover"||e==="pointerover",g=e==="mouseout"||e==="pointerout",m&&t!==mr&&(y=t.relatedTarget||t.fromElement)&&(sl(y)||y[zl]))break e;if((g||m)&&(m=h.window===h?h:(m=h.ownerDocument)?m.defaultView||m.parentWindow:window,g?(y=t.relatedTarget||t.toElement,g=s,y=y?sl(y):null,y!==null&&(w=Fu(y),I=y.tag,y!==w||I!==5&&I!==27&&I!==6)&&(y=null)):(g=null,y=s),g!==y)){if(I=Qn,i="onMouseLeave",c="onMouseEnter",n="mouse",(e==="pointerout"||e==="pointerover")&&(I=Wn,i="onPointerLeave",c="onPointerEnter",n="pointer"),w=g==null?m:nu(g),p=y==null?m:nu(y),m=new I(i,n+"leave",g,t,h),m.target=w,m.relatedTarget=p,i=null,sl(h)===s&&(I=new I(c,n+"enter",y,t,h),I.target=p,I.relatedTarget=w,i=I),w=i,g&&y)a:{for(I=px,c=g,n=y,p=0,i=c;i;i=I(i))p++;i=0;for(var S=n;S;S=I(S))i++;for(;0<p-i;)c=I(c),p--;for(;0<i-p;)n=I(n),i--;for(;p--;){if(c===n||n!==null&&c===n.alternate){I=c;break a}c=I(c),n=I(n)}I=null}else I=null;g!==null&&Vi(L,m,g,I,!1),y!==null&&w!==null&&Vi(L,w,y,I,!0)}}e:{if(m=s?nu(s):window,g=m.nodeName&&m.nodeName.toLowerCase(),g==="select"||g==="input"&&m.type==="file")var k=ti;else if(ai(m))if(_c)k=ML;else{k=AL;var b=IL}else g=m.nodeName,!g||g.toLowerCase()!=="input"||m.type!=="checkbox"&&m.type!=="radio"?s&&ts(s.elementType)&&(k=ti):k=kL;if(k&&(k=k(e,s))){Hc(L,k,t,h);break e}b&&b(e,m,s),e==="focusout"&&s&&m.type==="number"&&s.memoizedProps.value!=null&&cr(m,"number",m.value)}switch(b=s?nu(s):window,e){case"focusin":(ai(b)||b.contentEditable==="true")&&(cl=b,gr=s,gu=null);break;case"focusout":gu=gr=cl=null;break;case"mousedown":hr=!0;break;case"contextmenu":case"mouseup":case"dragend":hr=!1,di(L,t,h);break;case"selectionchange":if(wL)break;case"keydown":case"keyup":di(L,t,h)}var v;if(ds)e:{switch(e){case"compositionstart":var T="onCompositionStart";break e;case"compositionend":T="onCompositionEnd";break e;case"compositionupdate":T="onCompositionUpdate";break e}T=void 0}else il?Uc(e,t)&&(T="onCompositionEnd"):e==="keydown"&&t.keyCode===229&&(T="onCompositionStart");T&&(qc&&t.locale!=="ko"&&(il||T!=="onCompositionStart"?T==="onCompositionEnd"&&il&&(v=Ec()):(lt=h,us="value"in lt?lt.value:lt.textContent,il=!0)),b=gd(s,T),0<b.length&&(T=new Jn(T,e,null,t,h),L.push({event:T,listeners:b}),v?T.data=v:(v=zc(t),v!==null&&(T.data=v)))),(v=SL?CL(e,t):vL(e,t))&&(T=gd(s,"onBeforeInput"),0<T.length&&(b=new Jn("onBeforeInput","beforeinput",null,t,h),L.push({event:b,listeners:T}),b.data=v)),cx(L,e,s,t,h)}Op(L,a)})}function Uu(e,a,t){return{instance:e,listener:a,currentTarget:t}}function gd(e,a){for(var t=a+"Capture",l=[];e!==null;){var u=e,o=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||o===null||(u=Mu(e,t),u!=null&&l.unshift(Uu(e,u,o)),u=Mu(e,a),u!=null&&l.push(Uu(e,u,o))),e.tag===3)return l;e=e.return}return[]}function px(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Vi(e,a,t,l,u){for(var o=a._reactName,d=[];t!==null&&t!==l;){var f=t,r=f.alternate,s=f.stateNode;if(f=f.tag,r!==null&&r===l)break;f!==5&&f!==26&&f!==27||s===null||(r=s,u?(s=Mu(t,o),s!=null&&d.unshift(Uu(t,s,r))):u||(s=Mu(t,o),s!=null&&d.push(Uu(t,s,r)))),t=t.return}d.length!==0&&e.push({event:a,listeners:d})}var gx=/\r\n?/g,hx=/\u0000|\uFFFD/g;function Xi(e){return(typeof e=="string"?e:""+e).replace(gx,`
`).replace(hx,"")}function qp(e,a){return a=Xi(a),Xi(e)===a}function Y(e,a,t,l,u,o){switch(t){case"children":typeof l=="string"?a==="body"||a==="textarea"&&l===""||Tl(e,l):(typeof l=="number"||typeof l=="bigint")&&a!=="body"&&Tl(e,""+l);break;case"className":xo(e,"class",l);break;case"tabIndex":xo(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":xo(e,t,l);break;case"style":Rc(e,l,o);break;case"data":if(a!=="object"){xo(e,"data",l);break}case"src":case"href":if(l===""&&(a!=="a"||t!=="href")){e.removeAttribute(t);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(t);break}l=Oo(""+l),e.setAttribute(t,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(t,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof o=="function"&&(t==="formAction"?(a!=="input"&&Y(e,a,"name",u.name,u,null),Y(e,a,"formEncType",u.formEncType,u,null),Y(e,a,"formMethod",u.formMethod,u,null),Y(e,a,"formTarget",u.formTarget,u,null)):(Y(e,a,"encType",u.encType,u,null),Y(e,a,"method",u.method,u,null),Y(e,a,"target",u.target,u,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(t);break}l=Oo(""+l),e.setAttribute(t,l);break;case"onClick":l!=null&&(e.onclick=Ua);break;case"onScroll":l!=null&&U("scroll",e);break;case"onScrollEnd":l!=null&&U("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(C(61));if(t=l.__html,t!=null){if(u.children!=null)throw Error(C(60));e.innerHTML=t}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}t=Oo(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",t);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(t,""+l):e.removeAttribute(t);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(t,""):e.removeAttribute(t);break;case"capture":case"download":l===!0?e.setAttribute(t,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(t,l):e.removeAttribute(t);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(t,l):e.removeAttribute(t);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(t):e.setAttribute(t,l);break;case"popover":U("beforetoggle",e),U("toggle",e),Ro(e,"popover",l);break;case"xlinkActuate":Ta(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":Ta(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":Ta(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":Ta(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":Ta(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":Ta(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":Ta(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":Ta(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":Ta(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Ro(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(t=Yh.get(t)||t,Ro(e,t,l))}}function Fr(e,a,t,l,u,o){switch(t){case"style":Rc(e,l,o);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(C(61));if(t=l.__html,t!=null){if(u.children!=null)throw Error(C(60));e.innerHTML=t}}break;case"children":typeof l=="string"?Tl(e,l):(typeof l=="number"||typeof l=="bigint")&&Tl(e,""+l);break;case"onScroll":l!=null&&U("scroll",e);break;case"onScrollEnd":l!=null&&U("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Ua);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!kc.hasOwnProperty(t))e:{if(t[0]==="o"&&t[1]==="n"&&(u=t.endsWith("Capture"),a=t.slice(2,u?t.length-7:void 0),o=e[He]||null,o=o!=null?o[t]:null,typeof o=="function"&&e.removeEventListener(a,o,u),typeof l=="function")){typeof o!="function"&&o!==null&&(t in e?e[t]=null:e.hasAttribute(t)&&e.removeAttribute(t)),e.addEventListener(a,l,u);break e}t in e?e[t]=l:l===!0?e.setAttribute(t,""):Ro(e,t,l)}}}function Ae(e,a,t){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":U("error",e),U("load",e);var l=!1,u=!1,o;for(o in t)if(t.hasOwnProperty(o)){var d=t[o];if(d!=null)switch(o){case"src":l=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(C(137,a));default:Y(e,a,o,d,t,null)}}u&&Y(e,a,"srcSet",t.srcSet,t,null),l&&Y(e,a,"src",t.src,t,null);return;case"input":U("invalid",e);var f=o=d=u=null,r=null,s=null;for(l in t)if(t.hasOwnProperty(l)){var h=t[l];if(h!=null)switch(l){case"name":u=h;break;case"type":d=h;break;case"checked":r=h;break;case"defaultChecked":s=h;break;case"value":o=h;break;case"defaultValue":f=h;break;case"children":case"dangerouslySetInnerHTML":if(h!=null)throw Error(C(137,a));break;default:Y(e,a,l,h,t,null)}}wc(e,o,f,r,s,d,u,!1);return;case"select":U("invalid",e),l=d=o=null;for(u in t)if(t.hasOwnProperty(u)&&(f=t[u],f!=null))switch(u){case"value":o=f;break;case"defaultValue":d=f;break;case"multiple":l=f;default:Y(e,a,u,f,t,null)}a=o,t=d,e.multiple=!!l,a!=null?Cl(e,!!l,a,!1):t!=null&&Cl(e,!!l,t,!0);return;case"textarea":U("invalid",e),o=u=l=null;for(d in t)if(t.hasOwnProperty(d)&&(f=t[d],f!=null))switch(d){case"value":l=f;break;case"defaultValue":u=f;break;case"children":o=f;break;case"dangerouslySetInnerHTML":if(f!=null)throw Error(C(91));break;default:Y(e,a,d,f,t,null)}Bc(e,l,u,o);return;case"option":for(r in t)t.hasOwnProperty(r)&&(l=t[r],l!=null)&&(r==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":Y(e,a,r,l,t,null));return;case"dialog":U("beforetoggle",e),U("toggle",e),U("cancel",e),U("close",e);break;case"iframe":case"object":U("load",e);break;case"video":case"audio":for(l=0;l<qu.length;l++)U(qu[l],e);break;case"image":U("error",e),U("load",e);break;case"details":U("toggle",e);break;case"embed":case"source":case"link":U("error",e),U("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(s in t)if(t.hasOwnProperty(s)&&(l=t[s],l!=null))switch(s){case"children":case"dangerouslySetInnerHTML":throw Error(C(137,a));default:Y(e,a,s,l,t,null)}return;default:if(ts(a)){for(h in t)t.hasOwnProperty(h)&&(l=t[h],l!==void 0&&Fr(e,a,h,l,t,void 0));return}}for(f in t)t.hasOwnProperty(f)&&(l=t[f],l!=null&&Y(e,a,f,l,t,null))}function Lx(e,a,t,l){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,o=null,d=null,f=null,r=null,s=null,h=null;for(g in t){var L=t[g];if(t.hasOwnProperty(g)&&L!=null)switch(g){case"checked":break;case"value":break;case"defaultValue":r=L;default:l.hasOwnProperty(g)||Y(e,a,g,null,l,L)}}for(var m in l){var g=l[m];if(L=t[m],l.hasOwnProperty(m)&&(g!=null||L!=null))switch(m){case"type":o=g;break;case"name":u=g;break;case"checked":s=g;break;case"defaultChecked":h=g;break;case"value":d=g;break;case"defaultValue":f=g;break;case"children":case"dangerouslySetInnerHTML":if(g!=null)throw Error(C(137,a));break;default:g!==L&&Y(e,a,m,g,l,L)}}ir(e,d,f,r,s,h,o,u);return;case"select":g=d=f=m=null;for(o in t)if(r=t[o],t.hasOwnProperty(o)&&r!=null)switch(o){case"value":break;case"multiple":g=r;default:l.hasOwnProperty(o)||Y(e,a,o,null,l,r)}for(u in l)if(o=l[u],r=t[u],l.hasOwnProperty(u)&&(o!=null||r!=null))switch(u){case"value":m=o;break;case"defaultValue":f=o;break;case"multiple":d=o;default:o!==r&&Y(e,a,u,o,l,r)}a=f,t=d,l=g,m!=null?Cl(e,!!t,m,!1):!!l!=!!t&&(a!=null?Cl(e,!!t,a,!0):Cl(e,!!t,t?[]:"",!1));return;case"textarea":g=m=null;for(f in t)if(u=t[f],t.hasOwnProperty(f)&&u!=null&&!l.hasOwnProperty(f))switch(f){case"value":break;case"children":break;default:Y(e,a,f,null,l,u)}for(d in l)if(u=l[d],o=t[d],l.hasOwnProperty(d)&&(u!=null||o!=null))switch(d){case"value":m=u;break;case"defaultValue":g=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(C(91));break;default:u!==o&&Y(e,a,d,u,l,o)}Dc(e,m,g);return;case"option":for(var y in t)m=t[y],t.hasOwnProperty(y)&&m!=null&&!l.hasOwnProperty(y)&&(y==="selected"?e.selected=!1:Y(e,a,y,null,l,m));for(r in l)m=l[r],g=t[r],l.hasOwnProperty(r)&&m!==g&&(m!=null||g!=null)&&(r==="selected"?e.selected=m&&typeof m!="function"&&typeof m!="symbol":Y(e,a,r,m,l,g));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var I in t)m=t[I],t.hasOwnProperty(I)&&m!=null&&!l.hasOwnProperty(I)&&Y(e,a,I,null,l,m);for(s in l)if(m=l[s],g=t[s],l.hasOwnProperty(s)&&m!==g&&(m!=null||g!=null))switch(s){case"children":case"dangerouslySetInnerHTML":if(m!=null)throw Error(C(137,a));break;default:Y(e,a,s,m,l,g)}return;default:if(ts(a)){for(var w in t)m=t[w],t.hasOwnProperty(w)&&m!==void 0&&!l.hasOwnProperty(w)&&Fr(e,a,w,void 0,l,m);for(h in l)m=l[h],g=t[h],!l.hasOwnProperty(h)||m===g||m===void 0&&g===void 0||Fr(e,a,h,m,l,g);return}}for(var c in t)m=t[c],t.hasOwnProperty(c)&&m!=null&&!l.hasOwnProperty(c)&&Y(e,a,c,null,l,m);for(L in l)m=l[L],g=t[L],!l.hasOwnProperty(L)||m===g||m==null&&g==null||Y(e,a,L,m,l,g)}function Yi(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function xx(){if(typeof performance.getEntriesByType=="function"){for(var e=0,a=0,t=performance.getEntriesByType("resource"),l=0;l<t.length;l++){var u=t[l],o=u.transferSize,d=u.initiatorType,f=u.duration;if(o&&f&&Yi(d)){for(d=0,f=u.responseEnd,l+=1;l<t.length;l++){var r=t[l],s=r.startTime;if(s>f)break;var h=r.transferSize,L=r.initiatorType;h&&Yi(L)&&(r=r.responseEnd,d+=h*(r<f?1:(f-s)/(r-s)))}if(--l,a+=8*(o+d)/(u.duration/1e3),e++,10<e)break}}if(0<e)return a/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Pr=null,Nr=null;function hd(e){return e.nodeType===9?e:e.ownerDocument}function Zi(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Up(e,a){if(e===0)switch(a){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&a==="foreignObject"?0:e}function Gr(e,a){return e==="textarea"||e==="noscript"||typeof a.children=="string"||typeof a.children=="number"||typeof a.children=="bigint"||typeof a.dangerouslySetInnerHTML=="object"&&a.dangerouslySetInnerHTML!==null&&a.dangerouslySetInnerHTML.__html!=null}var $f=null;function Sx(){var e=window.event;return e&&e.type==="popstate"?e===$f?!1:($f=e,!0):($f=null,!1)}var zp=typeof setTimeout=="function"?setTimeout:void 0,Cx=typeof clearTimeout=="function"?clearTimeout:void 0,ji=typeof Promise=="function"?Promise:void 0,vx=typeof queueMicrotask=="function"?queueMicrotask:typeof ji<"u"?function(e){return ji.resolve(null).then(e).catch(yx)}:zp;function yx(e){setTimeout(function(){throw e})}function vt(e){return e==="head"}function Ki(e,a){var t=a,l=0;do{var u=t.nextSibling;if(e.removeChild(t),u&&u.nodeType===8)if(t=u.data,t==="/$"||t==="/&"){if(l===0){e.removeChild(u),Ul(a);return}l--}else if(t==="$"||t==="$?"||t==="$~"||t==="$!"||t==="&")l++;else if(t==="html")Au(e.ownerDocument.documentElement);else if(t==="head"){t=e.ownerDocument.head,Au(t);for(var o=t.firstChild;o;){var d=o.nextSibling,f=o.nodeName;o[Vu]||f==="SCRIPT"||f==="STYLE"||f==="LINK"&&o.rel.toLowerCase()==="stylesheet"||t.removeChild(o),o=d}}else t==="body"&&Au(e.ownerDocument.body);t=u}while(t);Ul(a)}function Qi(e,a){var t=e;e=0;do{var l=t.nextSibling;if(t.nodeType===1?a?(t._stashedDisplay=t.style.display,t.style.display="none"):(t.style.display=t._stashedDisplay||"",t.getAttribute("style")===""&&t.removeAttribute("style")):t.nodeType===3&&(a?(t._stashedText=t.nodeValue,t.nodeValue=""):t.nodeValue=t._stashedText||""),l&&l.nodeType===8)if(t=l.data,t==="/$"){if(e===0)break;e--}else t!=="$"&&t!=="$?"&&t!=="$~"&&t!=="$!"||e++;t=l}while(t)}function Vr(e){var a=e.firstChild;for(a&&a.nodeType===10&&(a=a.nextSibling);a;){var t=a;switch(a=a.nextSibling,t.nodeName){case"HTML":case"HEAD":case"BODY":Vr(t),as(t);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(t.rel.toLowerCase()==="stylesheet")continue}e.removeChild(t)}}function bx(e,a,t,l){for(;e.nodeType===1;){var u=t;if(e.nodeName.toLowerCase()!==a.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Vu])switch(a){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(o=e.getAttribute("rel"),o==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(o!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(o=e.getAttribute("src"),(o!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&o&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(a==="input"&&e.type==="hidden"){var o=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===o)return e}else return e;if(e=sa(e.nextSibling),e===null)break}return null}function Ix(e,a,t){if(a==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=sa(e.nextSibling),e===null))return null;return e}function Hp(e,a){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=sa(e.nextSibling),e===null))return null;return e}function Xr(e){return e.data==="$?"||e.data==="$~"}function Yr(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Ax(e,a){var t=e.ownerDocument;if(e.data==="$~")e._reactRetry=a;else if(e.data!=="$?"||t.readyState!=="loading")a();else{var l=function(){a(),t.removeEventListener("DOMContentLoaded",l)};t.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function sa(e){for(;e!=null;e=e.nextSibling){var a=e.nodeType;if(a===1||a===3)break;if(a===8){if(a=e.data,a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"||a==="F!"||a==="F")break;if(a==="/$"||a==="/&")return null}}return e}var Zr=null;function Ji(e){e=e.nextSibling;for(var a=0;e;){if(e.nodeType===8){var t=e.data;if(t==="/$"||t==="/&"){if(a===0)return sa(e.nextSibling);a--}else t!=="$"&&t!=="$!"&&t!=="$?"&&t!=="$~"&&t!=="&"||a++}e=e.nextSibling}return null}function Wi(e){e=e.previousSibling;for(var a=0;e;){if(e.nodeType===8){var t=e.data;if(t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"){if(a===0)return e;a--}else t!=="/$"&&t!=="/&"||a++}e=e.previousSibling}return null}function _p(e,a,t){switch(a=hd(t),e){case"html":if(e=a.documentElement,!e)throw Error(C(452));return e;case"head":if(e=a.head,!e)throw Error(C(453));return e;case"body":if(e=a.body,!e)throw Error(C(454));return e;default:throw Error(C(451))}}function Au(e){for(var a=e.attributes;a.length;)e.removeAttributeNode(a[0]);as(e)}var na=new Map,$i=new Set;function Ld(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Ya=N.d;N.d={f:kx,r:Mx,D:Tx,C:wx,L:Dx,m:Bx,X:Ox,S:Rx,M:Ex};function kx(){var e=Ya.f(),a=Ed();return e||a}function Mx(e){var a=Hl(e);a!==null&&a.tag===5&&a.type==="form"?Rm(a):Ya.r(e)}var Nl=typeof document>"u"?null:document;function Fp(e,a,t){var l=Nl;if(l&&typeof a=="string"&&a){var u=oa(a);u='link[rel="'+e+'"][href="'+u+'"]',typeof t=="string"&&(u+='[crossorigin="'+t+'"]'),$i.has(u)||($i.add(u),e={rel:e,crossOrigin:t,href:a},l.querySelector(u)===null&&(a=l.createElement("link"),Ae(a,"link",e),Le(a),l.head.appendChild(a)))}}function Tx(e){Ya.D(e),Fp("dns-prefetch",e,null)}function wx(e,a){Ya.C(e,a),Fp("preconnect",e,a)}function Dx(e,a,t){Ya.L(e,a,t);var l=Nl;if(l&&e&&a){var u='link[rel="preload"][as="'+oa(a)+'"]';a==="image"&&t&&t.imageSrcSet?(u+='[imagesrcset="'+oa(t.imageSrcSet)+'"]',typeof t.imageSizes=="string"&&(u+='[imagesizes="'+oa(t.imageSizes)+'"]')):u+='[href="'+oa(e)+'"]';var o=u;switch(a){case"style":o=ql(e);break;case"script":o=Gl(e)}na.has(o)||(e=ee({rel:"preload",href:a==="image"&&t&&t.imageSrcSet?void 0:e,as:a},t),na.set(o,e),l.querySelector(u)!==null||a==="style"&&l.querySelector(Qu(o))||a==="script"&&l.querySelector(Ju(o))||(a=l.createElement("link"),Ae(a,"link",e),Le(a),l.head.appendChild(a)))}}function Bx(e,a){Ya.m(e,a);var t=Nl;if(t&&e){var l=a&&typeof a.as=="string"?a.as:"script",u='link[rel="modulepreload"][as="'+oa(l)+'"][href="'+oa(e)+'"]',o=u;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":o=Gl(e)}if(!na.has(o)&&(e=ee({rel:"modulepreload",href:e},a),na.set(o,e),t.querySelector(u)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(t.querySelector(Ju(o)))return}l=t.createElement("link"),Ae(l,"link",e),Le(l),t.head.appendChild(l)}}}function Rx(e,a,t){Ya.S(e,a,t);var l=Nl;if(l&&e){var u=Sl(l).hoistableStyles,o=ql(e);a=a||"default";var d=u.get(o);if(!d){var f={loading:0,preload:null};if(d=l.querySelector(Qu(o)))f.loading=5;else{e=ee({rel:"stylesheet",href:e,"data-precedence":a},t),(t=na.get(o))&&Fs(e,t);var r=d=l.createElement("link");Le(r),Ae(r,"link",e),r._p=new Promise(function(s,h){r.onload=s,r.onerror=h}),r.addEventListener("load",function(){f.loading|=1}),r.addEventListener("error",function(){f.loading|=2}),f.loading|=4,Go(d,a,l)}d={type:"stylesheet",instance:d,count:1,state:f},u.set(o,d)}}}function Ox(e,a){Ya.X(e,a);var t=Nl;if(t&&e){var l=Sl(t).hoistableScripts,u=Gl(e),o=l.get(u);o||(o=t.querySelector(Ju(u)),o||(e=ee({src:e,async:!0},a),(a=na.get(u))&&Ps(e,a),o=t.createElement("script"),Le(o),Ae(o,"link",e),t.head.appendChild(o)),o={type:"script",instance:o,count:1,state:null},l.set(u,o))}}function Ex(e,a){Ya.M(e,a);var t=Nl;if(t&&e){var l=Sl(t).hoistableScripts,u=Gl(e),o=l.get(u);o||(o=t.querySelector(Ju(u)),o||(e=ee({src:e,async:!0,type:"module"},a),(a=na.get(u))&&Ps(e,a),o=t.createElement("script"),Le(o),Ae(o,"link",e),t.head.appendChild(o)),o={type:"script",instance:o,count:1,state:null},l.set(u,o))}}function ec(e,a,t,l){var u=(u=ft.current)?Ld(u):null;if(!u)throw Error(C(446));switch(e){case"meta":case"title":return null;case"style":return typeof t.precedence=="string"&&typeof t.href=="string"?(a=ql(t.href),t=Sl(u).hoistableStyles,l=t.get(a),l||(l={type:"style",instance:null,count:0,state:null},t.set(a,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(t.rel==="stylesheet"&&typeof t.href=="string"&&typeof t.precedence=="string"){e=ql(t.href);var o=Sl(u).hoistableStyles,d=o.get(e);if(d||(u=u.ownerDocument||u,d={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},o.set(e,d),(o=u.querySelector(Qu(e)))&&!o._p&&(d.instance=o,d.state.loading=5),na.has(e)||(t={rel:"preload",as:"style",href:t.href,crossOrigin:t.crossOrigin,integrity:t.integrity,media:t.media,hrefLang:t.hrefLang,referrerPolicy:t.referrerPolicy},na.set(e,t),o||qx(u,e,t,d.state))),a&&l===null)throw Error(C(528,""));return d}if(a&&l!==null)throw Error(C(529,""));return null;case"script":return a=t.async,t=t.src,typeof t=="string"&&a&&typeof a!="function"&&typeof a!="symbol"?(a=Gl(t),t=Sl(u).hoistableScripts,l=t.get(a),l||(l={type:"script",instance:null,count:0,state:null},t.set(a,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(C(444,e))}}function ql(e){return'href="'+oa(e)+'"'}function Qu(e){return'link[rel="stylesheet"]['+e+"]"}function Pp(e){return ee({},e,{"data-precedence":e.precedence,precedence:null})}function qx(e,a,t,l){e.querySelector('link[rel="preload"][as="style"]['+a+"]")?l.loading=1:(a=e.createElement("link"),l.preload=a,a.addEventListener("load",function(){return l.loading|=1}),a.addEventListener("error",function(){return l.loading|=2}),Ae(a,"link",t),Le(a),e.head.appendChild(a))}function Gl(e){return'[src="'+oa(e)+'"]'}function Ju(e){return"script[async]"+e}function ac(e,a,t){if(a.count++,a.instance===null)switch(a.type){case"style":var l=e.querySelector('style[data-href~="'+oa(t.href)+'"]');if(l)return a.instance=l,Le(l),l;var u=ee({},t,{"data-href":t.href,"data-precedence":t.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),Le(l),Ae(l,"style",u),Go(l,t.precedence,e),a.instance=l;case"stylesheet":u=ql(t.href);var o=e.querySelector(Qu(u));if(o)return a.state.loading|=4,a.instance=o,Le(o),o;l=Pp(t),(u=na.get(u))&&Fs(l,u),o=(e.ownerDocument||e).createElement("link"),Le(o);var d=o;return d._p=new Promise(function(f,r){d.onload=f,d.onerror=r}),Ae(o,"link",l),a.state.loading|=4,Go(o,t.precedence,e),a.instance=o;case"script":return o=Gl(t.src),(u=e.querySelector(Ju(o)))?(a.instance=u,Le(u),u):(l=t,(u=na.get(o))&&(l=ee({},t),Ps(l,u)),e=e.ownerDocument||e,u=e.createElement("script"),Le(u),Ae(u,"link",l),e.head.appendChild(u),a.instance=u);case"void":return null;default:throw Error(C(443,a.type))}else a.type==="stylesheet"&&(a.state.loading&4)===0&&(l=a.instance,a.state.loading|=4,Go(l,t.precedence,e));return a.instance}function Go(e,a,t){for(var l=t.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=l.length?l[l.length-1]:null,o=u,d=0;d<l.length;d++){var f=l[d];if(f.dataset.precedence===a)o=f;else if(o!==u)break}o?o.parentNode.insertBefore(e,o.nextSibling):(a=t.nodeType===9?t.head:t,a.insertBefore(e,a.firstChild))}function Fs(e,a){e.crossOrigin==null&&(e.crossOrigin=a.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=a.referrerPolicy),e.title==null&&(e.title=a.title)}function Ps(e,a){e.crossOrigin==null&&(e.crossOrigin=a.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=a.referrerPolicy),e.integrity==null&&(e.integrity=a.integrity)}var Vo=null;function tc(e,a,t){if(Vo===null){var l=new Map,u=Vo=new Map;u.set(t,l)}else u=Vo,l=u.get(t),l||(l=new Map,u.set(t,l));if(l.has(e))return l;for(l.set(e,null),t=t.getElementsByTagName(e),u=0;u<t.length;u++){var o=t[u];if(!(o[Vu]||o[ye]||e==="link"&&o.getAttribute("rel")==="stylesheet")&&o.namespaceURI!=="http://www.w3.org/2000/svg"){var d=o.getAttribute(a)||"";d=e+d;var f=l.get(d);f?f.push(o):l.set(d,[o])}}return l}function lc(e,a,t){e=e.ownerDocument||e,e.head.insertBefore(t,a==="title"?e.querySelector("head > title"):null)}function Ux(e,a,t){if(t===1||a.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof a.precedence!="string"||typeof a.href!="string"||a.href==="")break;return!0;case"link":if(typeof a.rel!="string"||typeof a.href!="string"||a.href===""||a.onLoad||a.onError)break;return a.rel==="stylesheet"?(e=a.disabled,typeof a.precedence=="string"&&e==null):!0;case"script":if(a.async&&typeof a.async!="function"&&typeof a.async!="symbol"&&!a.onLoad&&!a.onError&&a.src&&typeof a.src=="string")return!0}return!1}function Np(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function zx(e,a,t,l){if(t.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(t.state.loading&4)===0){if(t.instance===null){var u=ql(l.href),o=a.querySelector(Qu(u));if(o){a=o._p,a!==null&&typeof a=="object"&&typeof a.then=="function"&&(e.count++,e=xd.bind(e),a.then(e,e)),t.state.loading|=4,t.instance=o,Le(o);return}o=a.ownerDocument||a,l=Pp(l),(u=na.get(u))&&Fs(l,u),o=o.createElement("link"),Le(o);var d=o;d._p=new Promise(function(f,r){d.onload=f,d.onerror=r}),Ae(o,"link",l),t.instance=o}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(t,a),(a=t.state.preload)&&(t.state.loading&3)===0&&(e.count++,t=xd.bind(e),a.addEventListener("load",t),a.addEventListener("error",t))}}var er=0;function Hx(e,a){return e.stylesheets&&e.count===0&&Xo(e,e.stylesheets),0<e.count||0<e.imgCount?function(t){var l=setTimeout(function(){if(e.stylesheets&&Xo(e,e.stylesheets),e.unsuspend){var o=e.unsuspend;e.unsuspend=null,o()}},6e4+a);0<e.imgBytes&&er===0&&(er=62500*xx());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xo(e,e.stylesheets),e.unsuspend)){var o=e.unsuspend;e.unsuspend=null,o()}},(e.imgBytes>er?50:800)+a);return e.unsuspend=t,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(u)}}:null}function xd(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xo(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Sd=null;function Xo(e,a){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Sd=new Map,a.forEach(_x,e),Sd=null,xd.call(e))}function _x(e,a){if(!(a.state.loading&4)){var t=Sd.get(e);if(t)var l=t.get(null);else{t=new Map,Sd.set(e,t);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),o=0;o<u.length;o++){var d=u[o];(d.nodeName==="LINK"||d.getAttribute("media")!=="not all")&&(t.set(d.dataset.precedence,d),l=d)}l&&t.set(null,l)}u=a.instance,d=u.getAttribute("data-precedence"),o=t.get(d)||l,o===l&&t.set(null,u),t.set(d,u),this.count++,l=xd.bind(this),u.addEventListener("load",l),u.addEventListener("error",l),o?o.parentNode.insertBefore(u,o.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),a.state.loading|=4}}var zu={$$typeof:qa,Provider:null,Consumer:null,_currentValue:Ot,_currentValue2:Ot,_threadCount:0};function Fx(e,a,t,l,u,o,d,f,r){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=kf(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=kf(0),this.hiddenUpdates=kf(null),this.identifierPrefix=l,this.onUncaughtError=u,this.onCaughtError=o,this.onRecoverableError=d,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=r,this.incompleteTransitions=new Map}function Gp(e,a,t,l,u,o,d,f,r,s,h,L){return e=new Fx(e,a,t,d,r,s,h,L,f),a=1,o===!0&&(a|=24),o=Ve(3,null,null,a),e.current=o,o.stateNode=e,a=ms(),a.refCount++,e.pooledCache=a,a.refCount++,o.memoizedState={element:l,isDehydrated:t,cache:a},hs(o),e}function Vp(e){return e?(e=gl,e):gl}function Xp(e,a,t,l,u,o){u=Vp(u),l.context===null?l.context=u:l.pendingContext=u,l=st(a),l.payload={element:t},o=o===void 0?null:o,o!==null&&(l.callback=o),t=nt(e,l,a),t!==null&&(ze(t,e,a),Lu(t,e,a))}function uc(e,a){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var t=e.retryLane;e.retryLane=t!==0&&t<a?t:a}}function Ns(e,a){uc(e,a),(e=e.alternate)&&uc(e,a)}function Yp(e){if(e.tag===13||e.tag===31){var a=Yt(e,67108864);a!==null&&ze(a,e,67108864),Ns(e,67108864)}}function oc(e){if(e.tag===13||e.tag===31){var a=Ke();a=$r(a);var t=Yt(e,a);t!==null&&ze(t,e,a),Ns(e,a)}}var Cd=!0;function Px(e,a,t,l){var u=B.T;B.T=null;var o=N.p;try{N.p=2,Gs(e,a,t,l)}finally{N.p=o,B.T=u}}function Nx(e,a,t,l){var u=B.T;B.T=null;var o=N.p;try{N.p=8,Gs(e,a,t,l)}finally{N.p=o,B.T=u}}function Gs(e,a,t,l){if(Cd){var u=jr(l);if(u===null)Wf(e,a,l,vd,t),dc(e,l);else if(Vx(u,e,a,t,l))l.stopPropagation();else if(dc(e,l),a&4&&-1<Gx.indexOf(e)){for(;u!==null;){var o=Hl(u);if(o!==null)switch(o.tag){case 3:if(o=o.stateNode,o.current.memoizedState.isDehydrated){var d=Dt(o.pendingLanes);if(d!==0){var f=o;for(f.pendingLanes|=2,f.entangledLanes|=2;d;){var r=1<<31-je(d);f.entanglements[1]|=r,d&=~r}Ia(o),(P&6)===0&&(nd=Ye()+500,Ku(0,!1))}}break;case 31:case 13:f=Yt(o,2),f!==null&&ze(f,o,2),Ed(),Ns(o,2)}if(o=jr(l),o===null&&Wf(e,a,l,vd,t),o===u)break;u=o}u!==null&&l.stopPropagation()}else Wf(e,a,l,null,t)}}function jr(e){return e=ls(e),Vs(e)}var vd=null;function Vs(e){if(vd=null,e=sl(e),e!==null){var a=Fu(e);if(a===null)e=null;else{var t=a.tag;if(t===13){if(e=cc(a),e!==null)return e;e=null}else if(t===31){if(e=mc(a),e!==null)return e;e=null}else if(t===3){if(a.stateNode.current.memoizedState.isDehydrated)return a.tag===3?a.stateNode.containerInfo:null;e=null}else a!==e&&(e=null)}}return vd=e,null}function Zp(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Dh()){case Lc:return 2;case xc:return 8;case Qo:case Bh:return 32;case Sc:return 268435456;default:return 32}default:return 32}}var Kr=!1,mt=null,pt=null,gt=null,Hu=new Map,_u=new Map,at=[],Gx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function dc(e,a){switch(e){case"focusin":case"focusout":mt=null;break;case"dragenter":case"dragleave":pt=null;break;case"mouseover":case"mouseout":gt=null;break;case"pointerover":case"pointerout":Hu.delete(a.pointerId);break;case"gotpointercapture":case"lostpointercapture":_u.delete(a.pointerId)}}function du(e,a,t,l,u,o){return e===null||e.nativeEvent!==o?(e={blockedOn:a,domEventName:t,eventSystemFlags:l,nativeEvent:o,targetContainers:[u]},a!==null&&(a=Hl(a),a!==null&&Yp(a)),e):(e.eventSystemFlags|=l,a=e.targetContainers,u!==null&&a.indexOf(u)===-1&&a.push(u),e)}function Vx(e,a,t,l,u){switch(a){case"focusin":return mt=du(mt,e,a,t,l,u),!0;case"dragenter":return pt=du(pt,e,a,t,l,u),!0;case"mouseover":return gt=du(gt,e,a,t,l,u),!0;case"pointerover":var o=u.pointerId;return Hu.set(o,du(Hu.get(o)||null,e,a,t,l,u)),!0;case"gotpointercapture":return o=u.pointerId,_u.set(o,du(_u.get(o)||null,e,a,t,l,u)),!0}return!1}function jp(e){var a=sl(e.target);if(a!==null){var t=Fu(a);if(t!==null){if(a=t.tag,a===13){if(a=cc(t),a!==null){e.blockedOn=a,Gn(e.priority,function(){oc(t)});return}}else if(a===31){if(a=mc(t),a!==null){e.blockedOn=a,Gn(e.priority,function(){oc(t)});return}}else if(a===3&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Yo(e){if(e.blockedOn!==null)return!1;for(var a=e.targetContainers;0<a.length;){var t=jr(e.nativeEvent);if(t===null){t=e.nativeEvent;var l=new t.constructor(t.type,t);mr=l,t.target.dispatchEvent(l),mr=null}else return a=Hl(t),a!==null&&Yp(a),e.blockedOn=t,!1;a.shift()}return!0}function fc(e,a,t){Yo(e)&&t.delete(a)}function Xx(){Kr=!1,mt!==null&&Yo(mt)&&(mt=null),pt!==null&&Yo(pt)&&(pt=null),gt!==null&&Yo(gt)&&(gt=null),Hu.forEach(fc),_u.forEach(fc)}function Do(e,a){e.blockedOn===a&&(e.blockedOn=null,Kr||(Kr=!0,me.unstable_scheduleCallback(me.unstable_NormalPriority,Xx)))}var Bo=null;function rc(e){Bo!==e&&(Bo=e,me.unstable_scheduleCallback(me.unstable_NormalPriority,function(){Bo===e&&(Bo=null);for(var a=0;a<e.length;a+=3){var t=e[a],l=e[a+1],u=e[a+2];if(typeof l!="function"){if(Vs(l||t)===null)continue;break}var o=Hl(t);o!==null&&(e.splice(a,3),a-=3,wr(o,{pending:!0,data:u,method:t.method,action:l},l,u))}}))}function Ul(e){function a(r){return Do(r,e)}mt!==null&&Do(mt,e),pt!==null&&Do(pt,e),gt!==null&&Do(gt,e),Hu.forEach(a),_u.forEach(a);for(var t=0;t<at.length;t++){var l=at[t];l.blockedOn===e&&(l.blockedOn=null)}for(;0<at.length&&(t=at[0],t.blockedOn===null);)jp(t),t.blockedOn===null&&at.shift();if(t=(e.ownerDocument||e).$$reactFormReplay,t!=null)for(l=0;l<t.length;l+=3){var u=t[l],o=t[l+1],d=u[He]||null;if(typeof o=="function")d||rc(t);else if(d){var f=null;if(o&&o.hasAttribute("formAction")){if(u=o,d=o[He]||null)f=d.formAction;else if(Vs(u)!==null)continue}else f=d.action;typeof f=="function"?t[l+1]=f:(t.splice(l,3),l-=3),rc(t)}}}function Kp(){function e(o){o.canIntercept&&o.info==="react-transition"&&o.intercept({handler:function(){return new Promise(function(d){return u=d})},focusReset:"manual",scroll:"manual"})}function a(){u!==null&&(u(),u=null),l||setTimeout(t,20)}function t(){if(!l&&!navigation.transition){var o=navigation.currentEntry;o&&o.url!=null&&navigation.navigate(o.url,{state:o.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",a),navigation.addEventListener("navigateerror",a),setTimeout(t,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",a),navigation.removeEventListener("navigateerror",a),u!==null&&(u(),u=null)}}}function Xs(e){this._internalRoot=e}zd.prototype.render=Xs.prototype.render=function(e){var a=this._internalRoot;if(a===null)throw Error(C(409));var t=a.current,l=Ke();Xp(t,l,e,a,null,null)};zd.prototype.unmount=Xs.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var a=e.containerInfo;Xp(e.current,2,null,e,null,null),Ed(),a[zl]=null}};function zd(e){this._internalRoot=e}zd.prototype.unstable_scheduleHydration=function(e){if(e){var a=Ic();e={blockedOn:null,target:e,priority:a};for(var t=0;t<at.length&&a!==0&&a<at[t].priority;t++);at.splice(t,0,e),t===0&&jp(e)}};var sc=nc.version;if(sc!=="19.2.8")throw Error(C(527,sc,"19.2.8"));N.findDOMNode=function(e){var a=e._reactInternals;if(a===void 0)throw typeof e.render=="function"?Error(C(188)):(e=Object.keys(e).join(","),Error(C(268,e)));return e=bh(a),e=e!==null?pc(e):null,e=e===null?null:e.stateNode,e};var Yx={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:B,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(fu=__REACT_DEVTOOLS_GLOBAL_HOOK__,!fu.isDisabled&&fu.supportsFiber))try{Pu=fu.inject(Yx),Ze=fu}catch{}var fu;Hd.createRoot=function(e,a){if(!ic(e))throw Error(C(299));var t=!1,l="",u=Fm,o=Pm,d=Nm;return a!=null&&(a.unstable_strictMode===!0&&(t=!0),a.identifierPrefix!==void 0&&(l=a.identifierPrefix),a.onUncaughtError!==void 0&&(u=a.onUncaughtError),a.onCaughtError!==void 0&&(o=a.onCaughtError),a.onRecoverableError!==void 0&&(d=a.onRecoverableError)),a=Gp(e,1,!1,null,null,t,l,null,u,o,d,Kp),e[zl]=a.current,_s(e),new Xs(a)};Hd.hydrateRoot=function(e,a,t){if(!ic(e))throw Error(C(299));var l=!1,u="",o=Fm,d=Pm,f=Nm,r=null;return t!=null&&(t.unstable_strictMode===!0&&(l=!0),t.identifierPrefix!==void 0&&(u=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(d=t.onCaughtError),t.onRecoverableError!==void 0&&(f=t.onRecoverableError),t.formState!==void 0&&(r=t.formState)),a=Gp(e,1,!0,a,t??null,l,u,r,o,d,f,Kp),a.context=Vp(null),t=a.current,l=Ke(),l=$r(l),u=st(l),u.callback=null,nt(t,u,l),t=l,a.current.lanes=t,Gu(a,t),Ia(a),e[zl]=a.current,_s(e),new zd(a)};Hd.version="19.2.8"});var $p=La((LC,Wp)=>{"use strict";function Jp(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Jp)}catch(e){console.error(e)}}Jp(),Wp.exports=Qp()});var Ag=La(jd=>{"use strict";var GS=Symbol.for("react.transitional.element"),VS=Symbol.for("react.fragment");function Ig(e,a,t){var l=null;if(t!==void 0&&(l=""+t),a.key!==void 0&&(l=""+a.key),"key"in a){t={};for(var u in a)u!=="key"&&(t[u]=a[u])}else t=a;return a=t.ref,{$$typeof:GS,type:e,key:l,ref:a!==void 0?a:null,props:t}}jd.Fragment=VS;jd.jsx=Ig;jd.jsxs=Ig});var fe=La((QC,kg)=>{"use strict";kg.exports=Ag()});var Kg=G($p(),1);var Zx='"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',jx=`
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
    --ext-font-family: ${Zx};
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
`,_d=null;function ag(){return _d||(_d=new CSSStyleSheet,_d.replaceSync(jx)),_d}var eg=!1;function tg(){if(eg||document.getElementById("ext-pjs-font"))return;eg=!0;let e=document.createElement("link");e.id="ext-pjs-font",e.rel="stylesheet",e.href="http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",document.head.appendChild(e)}function yt(e,a="open"){let t=e.attachShadow({mode:a});return t.adoptedStyleSheets=[ag()],tg(),t}var Kx=`
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
`,Fd=class extends HTMLElement{constructor(){super();let a=yt(this);a.innerHTML=`
      <style>${Kx}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `,this.btn=a.querySelector("button")}connectedCallback(){this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"),this.btn.addEventListener("click",a=>{if(this.hasAttribute("loading")||this.hasAttribute("disabled")){a.stopPropagation(),a.preventDefault();return}})}static get observedAttributes(){return["disabled","loading"]}attributeChangedCallback(a){(a==="disabled"||a==="loading")&&(this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"))}};customElements.get("ext-btn")||customElements.define("ext-btn",Fd);var Qx=`
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
`,Pd=class extends HTMLElement{constructor(){super();let a=yt(this);a.innerHTML=`<style>${Qx}</style><slot></slot>`}};customElements.get("ext-badge")||customElements.define("ext-badge",Pd);var Jx=`
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
`,Nd=class extends HTMLElement{constructor(){super(),this.attachShadowWithTokens()}attachShadowWithTokens(){let a=yt(this);a.innerHTML=`
      <style>${Jx}</style>
      <div class="tablist"><slot name="tab"></slot></div>
      <div class="panels"><slot name="panel"></slot></div>
    `}connectedCallback(){this.addEventListener("click",t=>{let l=t.target.closest('[slot="tab"]');!l||!this.contains(l)||this.activate(l.getAttribute("data-tab")||"")});let a=this.querySelector('[slot="tab"][data-active]');a&&this.activate(a.getAttribute("data-tab")||"")}activate(a){a&&(this.querySelectorAll('[slot="tab"]').forEach(t=>{t.getAttribute("data-tab")===a?t.setAttribute("data-active",""):t.removeAttribute("data-active")}),this.querySelectorAll('[slot="panel"]').forEach(t=>{t.getAttribute("data-panel")===a?t.setAttribute("data-active",""):t.removeAttribute("data-active")}),this.dispatchEvent(new CustomEvent("ext-tab-change",{detail:{tab:a}})))}};customElements.get("ext-tabs")||customElements.define("ext-tabs",Nd);var Wx=`
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
`,Gd=class extends HTMLElement{constructor(){super();this.handleKey=t=>{t.key==="Escape"&&this.hasAttribute("open")&&this.cancel()};this.root=yt(this),this.root.innerHTML=`
      <style>${Wx}</style>
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
    `}connectedCallback(){let t=this.root.querySelector(".overlay");this.root.querySelector(".close").addEventListener("click",()=>this.cancel()),t.addEventListener("click",u=>{u.target===t&&this.cancel()}),document.addEventListener("keydown",this.handleKey)}disconnectedCallback(){document.removeEventListener("keydown",this.handleKey)}get titleSlot(){return this.querySelector('[slot="title"]')}get footerSlot(){return this.querySelector('[slot="footer"]')}open(){this.setAttribute("open","")}close(){this.removeAttribute("open")}cancel(){this.dispatchEvent(new CustomEvent("ext-cancel")),this.close()}ok(){this.dispatchEvent(new CustomEvent("ext-ok"))}};customElements.get("ext-modal")||customElements.define("ext-modal",Gd);function Vd(e){return new Promise(a=>{let t=document.createElement("ext-modal");t.setAttribute("variant",e.variant??"warning"),e.okLabel&&t.setAttribute("ok-label",e.okLabel),e.cancelLabel&&t.setAttribute("cancel-label",e.cancelLabel),e.hideCancel&&t.setAttribute("hide-cancel",""),t.innerHTML=`<h3 slot="title"></h3><div class="ext-confirm-body"></div><div slot="footer">
         <ext-btn data-ext-confirm-cancel variant="secondary"></ext-btn>
         <ext-btn data-ext-confirm-ok></ext-btn>
       </div>`;let l=t.querySelector('[slot="title"]');l.textContent=e.title;let u=t.querySelector(".ext-confirm-body");if(e.icon){let f=document.createElement("div");f.className="ext-confirm-icon",f.textContent=e.icon,u.appendChild(f)}e.message&&e.message.split(`
`).forEach((r,s)=>{s>0&&u.appendChild(document.createElement("br")),u.appendChild(document.createTextNode(r))}),t.querySelector("[data-ext-confirm-ok]").textContent=e.okLabel??"Lanjut",t.querySelector("[data-ext-confirm-ok]").setAttribute("variant",e.variant==="danger"?"danger":"primary"),e.hideCancel?t.querySelector("[data-ext-confirm-cancel]")?.remove():t.querySelector("[data-ext-confirm-cancel]").textContent=e.cancelLabel??"Batal";let d=f=>{t.remove(),a(f)};t.addEventListener("ext-ok",()=>d(!0)),t.addEventListener("ext-cancel",()=>d(!1)),document.body.appendChild(t),t.open()})}var Ce=G(ea(),1);var Mg=G(ea(),1);function lg(e){var a,t,l="";if(typeof e=="string"||typeof e=="number")l+=e;else if(typeof e=="object")if(Array.isArray(e)){var u=e.length;for(a=0;a<u;a++)e[a]&&(t=lg(e[a]))&&(l&&(l+=" "),l+=t)}else for(t in e)e[t]&&(l&&(l+=" "),l+=t);return l}function Xd(){for(var e,a,t=0,l="",u=arguments.length;t<u;t++)(e=arguments[t])&&(a=lg(e))&&(l&&(l+=" "),l+=a);return l}var $x=(e,a)=>{let t=new Array(e.length+a.length);for(let l=0;l<e.length;l++)t[l]=e[l];for(let l=0;l<a.length;l++)t[e.length+l]=a[l];return t},eS=(e,a)=>({classGroupId:e,validator:a}),sg=(e=new Map,a=null,t)=>({nextPart:e,validators:a,classGroupId:t});var ug=[],aS="arbitrary..",tS=e=>{let a=uS(e),{conflictingClassGroups:t,conflictingClassGroupModifiers:l}=e;return{getClassGroupId:d=>{if(d.startsWith("[")&&d.endsWith("]"))return lS(d);let f=d.split("-"),r=f[0]===""&&f.length>1?1:0;return ng(f,r,a)},getConflictingClassGroupIds:(d,f)=>{if(f){let r=l[d],s=t[d];return r?s?$x(s,r):r:s||ug}return t[d]||ug}}},ng=(e,a,t)=>{if(e.length-a===0)return t.classGroupId;let u=e[a],o=t.nextPart.get(u);if(o){let s=ng(e,a+1,o);if(s)return s}let d=t.validators;if(d===null)return;let f=a===0?e.join("-"):e.slice(a).join("-"),r=d.length;for(let s=0;s<r;s++){let h=d[s];if(h.validator(f))return h.classGroupId}},lS=e=>e.slice(1,-1).indexOf(":")===-1?void 0:(()=>{let a=e.slice(1,-1),t=a.indexOf(":"),l=a.slice(0,t);return l?aS+l:void 0})(),uS=e=>{let{theme:a,classGroups:t}=e;return oS(t,a)},oS=(e,a)=>{let t=sg();for(let l in e){let u=e[l];Zs(u,t,l,a)}return t},Zs=(e,a,t,l)=>{let u=e.length;for(let o=0;o<u;o++){let d=e[o];dS(d,a,t,l)}},dS=(e,a,t,l)=>{if(typeof e=="string"){fS(e,a,t);return}if(typeof e=="function"){rS(e,a,t,l);return}sS(e,a,t,l)},fS=(e,a,t)=>{let l=e===""?a:ig(a,e);l.classGroupId=t},rS=(e,a,t,l)=>{if(nS(e)){Zs(e(l),a,t,l);return}a.validators===null&&(a.validators=[]),a.validators.push(eS(t,e))},sS=(e,a,t,l)=>{let u=Object.entries(e),o=u.length;for(let d=0;d<o;d++){let[f,r]=u[d];Zs(r,ig(a,f),t,l)}},ig=(e,a)=>{let t=e,l=a.split("-"),u=l.length;for(let o=0;o<u;o++){let d=l[o],f=t.nextPart.get(d);f||(f=sg(),t.nextPart.set(d,f)),t=f}return t},nS=e=>"isThemeGetter"in e&&e.isThemeGetter===!0,iS=e=>{if(e<1)return{get:()=>{},set:()=>{}};let a=0,t=Object.create(null),l=Object.create(null),u=(o,d)=>{t[o]=d,a++,a>e&&(a=0,l=t,t=Object.create(null))};return{get(o){let d=t[o];if(d!==void 0)return d;if((d=l[o])!==void 0)return u(o,d),d},set(o,d){o in t?t[o]=d:u(o,d)}}};var cS=[],og=(e,a,t,l,u)=>({modifiers:e,hasImportantModifier:a,baseClassName:t,maybePostfixModifierPosition:l,isExternal:u}),mS=e=>{let{prefix:a,experimentalParseClassName:t}=e,l=u=>{let o=[],d=0,f=0,r=0,s,h=u.length;for(let I=0;I<h;I++){let w=u[I];if(d===0&&f===0){if(w===":"){o.push(u.slice(r,I)),r=I+1;continue}if(w==="/"){s=I;continue}}w==="["?d++:w==="]"?d--:w==="("?f++:w===")"&&f--}let L=o.length===0?u:u.slice(r),m=L,g=!1;L.endsWith("!")?(m=L.slice(0,-1),g=!0):L.startsWith("!")&&(m=L.slice(1),g=!0);let y=s&&s>r?s-r:void 0;return og(o,g,m,y)};if(a){let u=a+":",o=l;l=d=>d.startsWith(u)?o(d.slice(u.length)):og(cS,!1,d,void 0,!0)}if(t){let u=l;l=o=>t({className:o,parseClassName:u})}return l},pS=e=>{let a=new Map;return e.orderSensitiveModifiers.forEach((t,l)=>{a.set(t,1e6+l)}),t=>{let l=[],u=[];for(let o=0;o<t.length;o++){let d=t[o],f=d[0]==="[",r=a.has(d);f||r?(u.length>0&&(u.sort(),l.push(...u),u=[]),l.push(d)):u.push(d)}return u.length>0&&(u.sort(),l.push(...u)),l}},gS=e=>({cache:iS(e.cacheSize),parseClassName:mS(e),sortModifiers:pS(e),postfixLookupClassGroupIds:hS(e),...tS(e)}),hS=e=>{let a=Object.create(null),t=e.postfixLookupClassGroups;if(t)for(let l=0;l<t.length;l++)a[t[l]]=!0;return a},LS=/\s+/,xS=(e,a)=>{let{parseClassName:t,getClassGroupId:l,getConflictingClassGroupIds:u,sortModifiers:o,postfixLookupClassGroupIds:d}=a,f=[],r=e.trim().split(LS),s="";for(let h=r.length-1;h>=0;h-=1){let L=r[h],{isExternal:m,modifiers:g,hasImportantModifier:y,baseClassName:I,maybePostfixModifierPosition:w}=t(L);if(m){s=L+(s.length>0?" "+s:s);continue}let c=!!w,n;if(c){let b=I.substring(0,w);n=l(b);let v=n&&d[n]?l(I):void 0;v&&v!==n&&(n=v,c=!1)}else n=l(I);if(!n){if(!c){s=L+(s.length>0?" "+s:s);continue}if(n=l(I),!n){s=L+(s.length>0?" "+s:s);continue}c=!1}let p=g.length===0?"":g.length===1?g[0]:o(g).join(":"),i=y?p+"!":p,S=i+n;if(f.indexOf(S)>-1)continue;f.push(S);let k=u(n,c);for(let b=0;b<k.length;++b){let v=k[b];f.push(i+v)}s=L+(s.length>0?" "+s:s)}return s},SS=(...e)=>{let a=0,t,l,u="";for(;a<e.length;)(t=e[a++])&&(l=cg(t))&&(u&&(u+=" "),u+=l);return u},cg=e=>{if(typeof e=="string")return e;let a,t="";for(let l=0;l<e.length;l++)e[l]&&(a=cg(e[l]))&&(t&&(t+=" "),t+=a);return t},CS=(e,...a)=>{let t,l,u,o,d=r=>{let s=a.reduce((h,L)=>L(h),e());return t=gS(s),l=t.cache.get,u=t.cache.set,o=f,f(r)},f=r=>{let s=l(r);if(s)return s;let h=xS(r,t);return u(r,h),h};return o=d,(...r)=>o(SS(...r))},vS=[],pe=e=>{let a=t=>t[e]||vS;return a.isThemeGetter=!0,a},mg=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,pg=/^\((?:(\w[\w-]*):)?(.+)\)$/i,yS=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,bS=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,IS=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,AS=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,kS=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,MS=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,bt=e=>yS.test(e),q=e=>!!e&&!Number.isNaN(Number(e)),Aa=e=>!!e&&Number.isInteger(Number(e)),Ys=e=>e.endsWith("%")&&q(e.slice(0,-1)),Za=e=>bS.test(e),gg=()=>!0,TS=e=>IS.test(e)&&!AS.test(e),js=()=>!1,wS=e=>kS.test(e),DS=e=>MS.test(e),BS=e=>!A(e)&&!M(e),RS=e=>e.startsWith("@container")&&(e[10]==="/"&&e[11]!==void 0||e[11]==="s"&&e[16]!==void 0&&e.startsWith("-size/",10)||e[11]==="n"&&e[18]!==void 0&&e.startsWith("-normal/",10)),OS=e=>It(e,xg,js),A=e=>mg.test(e),jt=e=>It(e,Sg,TS),dg=e=>It(e,PS,q),ES=e=>It(e,vg,gg),qS=e=>It(e,Cg,js),fg=e=>It(e,hg,js),US=e=>It(e,Lg,DS),Yd=e=>It(e,yg,wS),M=e=>pg.test(e),Wu=e=>Kt(e,Sg),zS=e=>Kt(e,Cg),rg=e=>Kt(e,hg),HS=e=>Kt(e,xg),_S=e=>Kt(e,Lg),Zd=e=>Kt(e,yg,!0),FS=e=>Kt(e,vg,!0),It=(e,a,t)=>{let l=mg.exec(e);return l?l[1]?a(l[1]):t(l[2]):!1},Kt=(e,a,t=!1)=>{let l=pg.exec(e);return l?l[1]?a(l[1]):t:!1},hg=e=>e==="position"||e==="percentage",Lg=e=>e==="image"||e==="url",xg=e=>e==="length"||e==="size"||e==="bg-size",Sg=e=>e==="length",PS=e=>e==="number",Cg=e=>e==="family-name",vg=e=>e==="number"||e==="weight",yg=e=>e==="shadow";var NS=()=>{let e=pe("color"),a=pe("font"),t=pe("text"),l=pe("font-weight"),u=pe("tracking"),o=pe("leading"),d=pe("breakpoint"),f=pe("container"),r=pe("spacing"),s=pe("radius"),h=pe("shadow"),L=pe("inset-shadow"),m=pe("text-shadow"),g=pe("drop-shadow"),y=pe("blur"),I=pe("perspective"),w=pe("aspect"),c=pe("ease"),n=pe("animate"),p=()=>["auto","avoid","all","avoid-page","page","left","right","column"],i=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],S=()=>[...i(),M,A],k=()=>["auto","hidden","clip","visible","scroll"],b=()=>["auto","contain","none"],v=()=>[M,A,r],T=()=>[bt,"full","auto",...v()],E=()=>[Aa,"none","subgrid",M,A],Pe=()=>["auto",{span:["full",Aa,M,A]},Aa,M,A],ha=()=>[Aa,"auto",M,A],tn=()=>["auto","min","max","fr",M,A],af=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],Jt=()=>["start","end","center","stretch","center-safe","end-safe"],ia=()=>["auto",...v()],Mt=()=>[bt,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...v()],tf=()=>[bt,"screen","full","dvw","lvw","svw","min","max","fit",...v()],lf=()=>[bt,"screen","full","lh","dvh","lvh","svh","min","max","fit",...v()],D=()=>[e,M,A],ln=()=>[...i(),rg,fg,{position:[M,A]}],un=()=>["no-repeat",{repeat:["","x","y","space","round"]}],on=()=>["auto","cover","contain",HS,OS,{size:[M,A]}],uf=()=>[Ys,Wu,jt],Te=()=>["","none","full",s,M,A],we=()=>["",q,Wu,jt],uo=()=>["solid","dashed","dotted","double"],dn=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],ge=()=>[q,Ys,rg,fg],fn=()=>["","none",y,M,A],oo=()=>["none",q,M,A],fo=()=>["none",q,M,A],of=()=>[q,M,A],ro=()=>[bt,"full",...v()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[Za],breakpoint:[Za],color:[gg],container:[Za],"drop-shadow":[Za],ease:["in","out","in-out"],font:[BS],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[Za],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[Za],shadow:[Za],spacing:["px",q],text:[Za],"text-shadow":[Za],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",bt,A,M,w]}],container:["container"],"container-type":[{"@container":["","normal","size",M,A]}],"container-named":[RS],columns:[{columns:[q,A,M,f]}],"break-after":[{"break-after":p()}],"break-before":[{"break-before":p()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:S()}],overflow:[{overflow:k()}],"overflow-x":[{"overflow-x":k()}],"overflow-y":[{"overflow-y":k()}],overscroll:[{overscroll:b()}],"overscroll-x":[{"overscroll-x":b()}],"overscroll-y":[{"overscroll-y":b()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:T()}],"inset-x":[{"inset-x":T()}],"inset-y":[{"inset-y":T()}],start:[{"inset-s":T(),start:T()}],end:[{"inset-e":T(),end:T()}],"inset-bs":[{"inset-bs":T()}],"inset-be":[{"inset-be":T()}],top:[{top:T()}],right:[{right:T()}],bottom:[{bottom:T()}],left:[{left:T()}],visibility:["visible","invisible","collapse"],z:[{z:[Aa,"auto",M,A]}],basis:[{basis:[bt,"full","auto",f,...v()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[q,bt,"auto","initial","none",A]}],grow:[{grow:["",q,M,A]}],shrink:[{shrink:["",q,M,A]}],order:[{order:[Aa,"first","last","none",M,A]}],"grid-cols":[{"grid-cols":E()}],"col-start-end":[{col:Pe()}],"col-start":[{"col-start":ha()}],"col-end":[{"col-end":ha()}],"grid-rows":[{"grid-rows":E()}],"row-start-end":[{row:Pe()}],"row-start":[{"row-start":ha()}],"row-end":[{"row-end":ha()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":tn()}],"auto-rows":[{"auto-rows":tn()}],gap:[{gap:v()}],"gap-x":[{"gap-x":v()}],"gap-y":[{"gap-y":v()}],"justify-content":[{justify:[...af(),"normal"]}],"justify-items":[{"justify-items":[...Jt(),"normal"]}],"justify-self":[{"justify-self":["auto",...Jt()]}],"align-content":[{content:["normal",...af()]}],"align-items":[{items:[...Jt(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...Jt(),{baseline:["","last"]}]}],"place-content":[{"place-content":af()}],"place-items":[{"place-items":[...Jt(),"baseline"]}],"place-self":[{"place-self":["auto",...Jt()]}],p:[{p:v()}],px:[{px:v()}],py:[{py:v()}],ps:[{ps:v()}],pe:[{pe:v()}],pbs:[{pbs:v()}],pbe:[{pbe:v()}],pt:[{pt:v()}],pr:[{pr:v()}],pb:[{pb:v()}],pl:[{pl:v()}],m:[{m:ia()}],mx:[{mx:ia()}],my:[{my:ia()}],ms:[{ms:ia()}],me:[{me:ia()}],mbs:[{mbs:ia()}],mbe:[{mbe:ia()}],mt:[{mt:ia()}],mr:[{mr:ia()}],mb:[{mb:ia()}],ml:[{ml:ia()}],"space-x":[{"space-x":v()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":v()}],"space-y-reverse":["space-y-reverse"],size:[{size:Mt()}],"inline-size":[{inline:["auto",...tf()]}],"min-inline-size":[{"min-inline":["auto",...tf()]}],"max-inline-size":[{"max-inline":["none",...tf()]}],"block-size":[{block:["auto",...lf()]}],"min-block-size":[{"min-block":["auto",...lf()]}],"max-block-size":[{"max-block":["none",...lf()]}],w:[{w:[f,"screen",...Mt()]}],"min-w":[{"min-w":[f,"screen","none",...Mt()]}],"max-w":[{"max-w":[f,"screen","none","prose",{screen:[d]},...Mt()]}],h:[{h:["screen","lh",...Mt()]}],"min-h":[{"min-h":["screen","lh","none",...Mt()]}],"max-h":[{"max-h":["screen","lh",...Mt()]}],"font-size":[{text:["base",t,Wu,jt]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[l,FS,ES]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",Ys,A]}],"font-family":[{font:[zS,qS,a]}],"font-features":[{"font-features":[A]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[u,M,A]}],"line-clamp":[{"line-clamp":[q,"none",M,dg]}],leading:[{leading:[o,...v()]}],"list-image":[{"list-image":["none",M,A]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",M,A]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:D()}],"text-color":[{text:D()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...uo(),"wavy"]}],"text-decoration-thickness":[{decoration:[q,"from-font","auto",M,jt]}],"text-decoration-color":[{decoration:D()}],"underline-offset":[{"underline-offset":[q,"auto",M,A]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:v()}],"tab-size":[{tab:[Aa,M,A]}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",M,A]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",M,A]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:ln()}],"bg-repeat":[{bg:un()}],"bg-size":[{bg:on()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},Aa,M,A],radial:["",M,A],conic:[Aa,M,A]},_S,US]}],"bg-color":[{bg:D()}],"gradient-from-pos":[{from:uf()}],"gradient-via-pos":[{via:uf()}],"gradient-to-pos":[{to:uf()}],"gradient-from":[{from:D()}],"gradient-via":[{via:D()}],"gradient-to":[{to:D()}],rounded:[{rounded:Te()}],"rounded-s":[{"rounded-s":Te()}],"rounded-e":[{"rounded-e":Te()}],"rounded-t":[{"rounded-t":Te()}],"rounded-r":[{"rounded-r":Te()}],"rounded-b":[{"rounded-b":Te()}],"rounded-l":[{"rounded-l":Te()}],"rounded-ss":[{"rounded-ss":Te()}],"rounded-se":[{"rounded-se":Te()}],"rounded-ee":[{"rounded-ee":Te()}],"rounded-es":[{"rounded-es":Te()}],"rounded-tl":[{"rounded-tl":Te()}],"rounded-tr":[{"rounded-tr":Te()}],"rounded-br":[{"rounded-br":Te()}],"rounded-bl":[{"rounded-bl":Te()}],"border-w":[{border:we()}],"border-w-x":[{"border-x":we()}],"border-w-y":[{"border-y":we()}],"border-w-s":[{"border-s":we()}],"border-w-e":[{"border-e":we()}],"border-w-bs":[{"border-bs":we()}],"border-w-be":[{"border-be":we()}],"border-w-t":[{"border-t":we()}],"border-w-r":[{"border-r":we()}],"border-w-b":[{"border-b":we()}],"border-w-l":[{"border-l":we()}],"divide-x":[{"divide-x":we()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":we()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...uo(),"hidden","none"]}],"divide-style":[{divide:[...uo(),"hidden","none"]}],"border-color":[{border:D()}],"border-color-x":[{"border-x":D()}],"border-color-y":[{"border-y":D()}],"border-color-s":[{"border-s":D()}],"border-color-e":[{"border-e":D()}],"border-color-bs":[{"border-bs":D()}],"border-color-be":[{"border-be":D()}],"border-color-t":[{"border-t":D()}],"border-color-r":[{"border-r":D()}],"border-color-b":[{"border-b":D()}],"border-color-l":[{"border-l":D()}],"divide-color":[{divide:D()}],"outline-style":[{outline:[...uo(),"none","hidden"]}],"outline-offset":[{"outline-offset":[q,M,A]}],"outline-w":[{outline:["",q,Wu,jt]}],"outline-color":[{outline:D()}],shadow:[{shadow:["","none",h,Zd,Yd]}],"shadow-color":[{shadow:D()}],"inset-shadow":[{"inset-shadow":["none",L,Zd,Yd]}],"inset-shadow-color":[{"inset-shadow":D()}],"ring-w":[{ring:we()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:D()}],"ring-offset-w":[{"ring-offset":[q,jt]}],"ring-offset-color":[{"ring-offset":D()}],"inset-ring-w":[{"inset-ring":we()}],"inset-ring-color":[{"inset-ring":D()}],"text-shadow":[{"text-shadow":["none",m,Zd,Yd]}],"text-shadow-color":[{"text-shadow":D()}],opacity:[{opacity:[q,M,A]}],"mix-blend":[{"mix-blend":[...dn(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":dn()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[q]}],"mask-image-linear-from-pos":[{"mask-linear-from":ge()}],"mask-image-linear-to-pos":[{"mask-linear-to":ge()}],"mask-image-linear-from-color":[{"mask-linear-from":D()}],"mask-image-linear-to-color":[{"mask-linear-to":D()}],"mask-image-t-from-pos":[{"mask-t-from":ge()}],"mask-image-t-to-pos":[{"mask-t-to":ge()}],"mask-image-t-from-color":[{"mask-t-from":D()}],"mask-image-t-to-color":[{"mask-t-to":D()}],"mask-image-r-from-pos":[{"mask-r-from":ge()}],"mask-image-r-to-pos":[{"mask-r-to":ge()}],"mask-image-r-from-color":[{"mask-r-from":D()}],"mask-image-r-to-color":[{"mask-r-to":D()}],"mask-image-b-from-pos":[{"mask-b-from":ge()}],"mask-image-b-to-pos":[{"mask-b-to":ge()}],"mask-image-b-from-color":[{"mask-b-from":D()}],"mask-image-b-to-color":[{"mask-b-to":D()}],"mask-image-l-from-pos":[{"mask-l-from":ge()}],"mask-image-l-to-pos":[{"mask-l-to":ge()}],"mask-image-l-from-color":[{"mask-l-from":D()}],"mask-image-l-to-color":[{"mask-l-to":D()}],"mask-image-x-from-pos":[{"mask-x-from":ge()}],"mask-image-x-to-pos":[{"mask-x-to":ge()}],"mask-image-x-from-color":[{"mask-x-from":D()}],"mask-image-x-to-color":[{"mask-x-to":D()}],"mask-image-y-from-pos":[{"mask-y-from":ge()}],"mask-image-y-to-pos":[{"mask-y-to":ge()}],"mask-image-y-from-color":[{"mask-y-from":D()}],"mask-image-y-to-color":[{"mask-y-to":D()}],"mask-image-radial":[{"mask-radial":[M,A]}],"mask-image-radial-from-pos":[{"mask-radial-from":ge()}],"mask-image-radial-to-pos":[{"mask-radial-to":ge()}],"mask-image-radial-from-color":[{"mask-radial-from":D()}],"mask-image-radial-to-color":[{"mask-radial-to":D()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":i()}],"mask-image-conic-pos":[{"mask-conic":[q]}],"mask-image-conic-from-pos":[{"mask-conic-from":ge()}],"mask-image-conic-to-pos":[{"mask-conic-to":ge()}],"mask-image-conic-from-color":[{"mask-conic-from":D()}],"mask-image-conic-to-color":[{"mask-conic-to":D()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:ln()}],"mask-repeat":[{mask:un()}],"mask-size":[{mask:on()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",M,A]}],filter:[{filter:["","none",M,A]}],blur:[{blur:fn()}],brightness:[{brightness:[q,M,A]}],contrast:[{contrast:[q,M,A]}],"drop-shadow":[{"drop-shadow":["","none",g,Zd,Yd]}],"drop-shadow-color":[{"drop-shadow":D()}],grayscale:[{grayscale:["",q,M,A]}],"hue-rotate":[{"hue-rotate":[q,M,A]}],invert:[{invert:["",q,M,A]}],saturate:[{saturate:[q,M,A]}],sepia:[{sepia:["",q,M,A]}],"backdrop-filter":[{"backdrop-filter":["","none",M,A]}],"backdrop-blur":[{"backdrop-blur":fn()}],"backdrop-brightness":[{"backdrop-brightness":[q,M,A]}],"backdrop-contrast":[{"backdrop-contrast":[q,M,A]}],"backdrop-grayscale":[{"backdrop-grayscale":["",q,M,A]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[q,M,A]}],"backdrop-invert":[{"backdrop-invert":["",q,M,A]}],"backdrop-opacity":[{"backdrop-opacity":[q,M,A]}],"backdrop-saturate":[{"backdrop-saturate":[q,M,A]}],"backdrop-sepia":[{"backdrop-sepia":["",q,M,A]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":v()}],"border-spacing-x":[{"border-spacing-x":v()}],"border-spacing-y":[{"border-spacing-y":v()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",M,A]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[q,"initial",M,A]}],ease:[{ease:["linear","initial",c,M,A]}],delay:[{delay:[q,M,A]}],animate:[{animate:["none",n,M,A]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[I,M,A]}],"perspective-origin":[{"perspective-origin":S()}],rotate:[{rotate:oo()}],"rotate-x":[{"rotate-x":oo()}],"rotate-y":[{"rotate-y":oo()}],"rotate-z":[{"rotate-z":oo()}],scale:[{scale:fo()}],"scale-x":[{"scale-x":fo()}],"scale-y":[{"scale-y":fo()}],"scale-z":[{"scale-z":fo()}],"scale-3d":["scale-3d"],skew:[{skew:of()}],"skew-x":[{"skew-x":of()}],"skew-y":[{"skew-y":of()}],transform:[{transform:[M,A,"","none","gpu","cpu"]}],"transform-origin":[{origin:S()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:ro()}],"translate-x":[{"translate-x":ro()}],"translate-y":[{"translate-y":ro()}],"translate-z":[{"translate-z":ro()}],"translate-none":["translate-none"],zoom:[{zoom:[Aa,M,A]}],accent:[{accent:D()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:D()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",M,A]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scrollbar-thumb-color":[{"scrollbar-thumb":D()}],"scrollbar-track-color":[{"scrollbar-track":D()}],"scrollbar-gutter":[{"scrollbar-gutter":["auto","stable","both"]}],"scrollbar-w":[{scrollbar:["auto","thin","none"]}],"scroll-m":[{"scroll-m":v()}],"scroll-mx":[{"scroll-mx":v()}],"scroll-my":[{"scroll-my":v()}],"scroll-ms":[{"scroll-ms":v()}],"scroll-me":[{"scroll-me":v()}],"scroll-mbs":[{"scroll-mbs":v()}],"scroll-mbe":[{"scroll-mbe":v()}],"scroll-mt":[{"scroll-mt":v()}],"scroll-mr":[{"scroll-mr":v()}],"scroll-mb":[{"scroll-mb":v()}],"scroll-ml":[{"scroll-ml":v()}],"scroll-p":[{"scroll-p":v()}],"scroll-px":[{"scroll-px":v()}],"scroll-py":[{"scroll-py":v()}],"scroll-ps":[{"scroll-ps":v()}],"scroll-pe":[{"scroll-pe":v()}],"scroll-pbs":[{"scroll-pbs":v()}],"scroll-pbe":[{"scroll-pbe":v()}],"scroll-pt":[{"scroll-pt":v()}],"scroll-pr":[{"scroll-pr":v()}],"scroll-pb":[{"scroll-pb":v()}],"scroll-pl":[{"scroll-pl":v()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",M,A]}],fill:[{fill:["none",...D()]}],"stroke-w":[{stroke:[q,Wu,jt,dg]}],stroke:[{stroke:["none",...D()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{"container-named":["container-type"],overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},postfixLookupClassGroups:["container-type"],orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}};var bg=CS(NS);function ke(...e){return bg(Xd(e))}var Tg=G(fe(),1),ka=(0,Mg.forwardRef)(({className:e,type:a,...t},l)=>(0,Tg.jsx)("input",{type:a,className:ke("flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-md-sm text-foreground","placeholder:text-muted-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1","disabled:cursor-not-allowed disabled:opacity-50",e),ref:l,...t}));ka.displayName="Input";var Vl=G(ea(),1);var wg=G(fe(),1),Se=(0,Vl.forwardRef)(({className:e,autoResize:a=!0,onChange:t,...l},u)=>{let o=(0,Vl.useRef)(null),d=u||o;(0,Vl.useEffect)(()=>{a&&d.current&&(d.current.style.height="auto",d.current.style.height=d.current.scrollHeight+"px")},[l.value,a,d]);let f=r=>{a&&(r.target.style.height="auto",r.target.style.height=r.target.scrollHeight+"px"),t?.(r)};return(0,wg.jsx)("textarea",{ref:d,className:ke("flex w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-md-sm text-foreground","placeholder:text-muted-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1","disabled:cursor-not-allowed disabled:opacity-50","resize-y min-h-[50px] leading-relaxed",e),onChange:f,...l})});Se.displayName="Textarea";var Kd=G(fe(),1);function j({className:e,required:a,children:t,...l}){return(0,Kd.jsxs)("label",{className:ke("block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1",e),...l,children:[t,a&&(0,Kd.jsx)("span",{className:"text-destructive ml-0.5",children:"*"})]})}var Xl=G(fe(),1);function Qt({title:e,children:a,className:t}){return(0,Xl.jsxs)("div",{className:ke("bg-card border border-border rounded-lg mb-3 overflow-hidden",t),children:[(0,Xl.jsxs)("div",{className:"px-3.5 py-2 bg-primary/5 border-b border-primary/15 text-[13px] font-bold text-primary flex items-center gap-1.5",children:[(0,Xl.jsx)("span",{className:"text-sm",children:"\u25CF"}),e]}),(0,Xl.jsx)("div",{className:"p-3.5",children:a})]})}var Ks=G(fe(),1);function Qd({children:e,cols:a=2,className:t}){return(0,Ks.jsx)("div",{className:ke("grid gap-2.5",a===2&&"grid-cols-2",a===3&&"grid-cols-3",t),children:e})}function ga({children:e,className:a}){return(0,Ks.jsx)("div",{className:ke("col-span-full",a),children:e})}var Dg=G(ea(),1);var Qs=G(fe(),1),Yl=(0,Dg.forwardRef)(({className:e,options:a,...t},l)=>(0,Qs.jsx)("select",{className:ke("flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-md-sm text-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1","disabled:cursor-not-allowed disabled:opacity-50",e),ref:l,...t,children:a.map(u=>(0,Qs.jsx)("option",{value:u.value,children:u.label},u.value))}));Yl.displayName="SelectNative";var Eg=G(ea(),1);var Bg=e=>typeof e=="boolean"?`${e}`:e===0?"0":e,Rg=Xd,Og=(e,a)=>t=>{var l;if(a?.variants==null)return Rg(e,t?.class,t?.className);let{variants:u,defaultVariants:o}=a,d=Object.keys(u).map(s=>{let h=t?.[s],L=o?.[s];if(h===null)return null;let m=Bg(h)||Bg(L);return u[s][m]}),f=t&&Object.entries(t).reduce((s,h)=>{let[L,m]=h;return m===void 0||(s[L]=m),s},{}),r=a==null||(l=a.compoundVariants)===null||l===void 0?void 0:l.reduce((s,h)=>{let{class:L,className:m,...g}=h;return Object.entries(g).every(y=>{let[I,w]=y;return Array.isArray(w)?w.includes({...o,...f}[I]):{...o,...f}[I]===w})?[...s,L,m]:s},[]);return Rg(e,d,r,t?.class,t?.className)};var qg=G(fe(),1),XS=Og("inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-md-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-8 px-3.5",sm:"h-7 px-2.5",lg:"h-9 px-4",xl:"h-11 px-6 text-base",icon:"h-8 w-8"}},defaultVariants:{variant:"default",size:"default"}}),Zl=(0,Eg.forwardRef)(({className:e,variant:a,size:t,...l},u)=>(0,qg.jsx)("button",{className:ke(XS({variant:a,size:t,className:e})),ref:u,...l}));Zl.displayName="Button";var $d=G(ea(),1);var Jd=(...e)=>e.filter((a,t,l)=>!!a&&a.trim()!==""&&l.indexOf(a)===t).join(" ").trim();var Ug=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();var zg=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,t,l)=>l?l.toUpperCase():t.toLowerCase());var Js=e=>{let a=zg(e);return a.charAt(0).toUpperCase()+a.slice(1)};var $u=G(ea(),1);var Wd={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};var Hg=e=>{for(let a in e)if(a.startsWith("aria-")||a==="role"||a==="title")return!0;return!1};var jl=G(ea(),1);var YS=(0,jl.createContext)({});var _g=()=>(0,jl.useContext)(YS);var Fg=(0,$u.forwardRef)(({color:e,size:a,strokeWidth:t,absoluteStrokeWidth:l,className:u="",children:o,iconNode:d,...f},r)=>{let{size:s=24,strokeWidth:h=2,absoluteStrokeWidth:L=!1,color:m="currentColor",className:g=""}=_g()??{},y=l??L?Number(t??h)*24/Number(a??s):t??h;return(0,$u.createElement)("svg",{ref:r,...Wd,width:a??s??Wd.width,height:a??s??Wd.height,stroke:e??m,strokeWidth:y,className:Jd("lucide",g,u),...!o&&!Hg(f)&&{"aria-hidden":"true"},...f},[...d.map(([I,w])=>(0,$u.createElement)(I,w)),...Array.isArray(o)?o:[o]])});var At=(e,a)=>{let t=(0,$d.forwardRef)(({className:l,...u},o)=>(0,$d.createElement)(Fg,{ref:o,iconNode:a,className:Jd(`lucide-${Ug(Js(e))}`,`lucide-${e}`,l),...u}));return t.displayName=Js(e),t};var ZS=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],eo=At("check",ZS);var jS=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],ao=At("info",jS);var KS=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],kt=At("triangle-alert",KS);var QS=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Kl=At("x",QS);var Ql=G(fe(),1),JS={default:"bg-primary/10 text-primary border-primary/20",success:"bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",warning:"bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",danger:"bg-destructive/10 text-destructive border-destructive/20"},WS={default:ao,success:eo,warning:kt,danger:Kl};function Pg({variant:e="default",icon:a,children:t,className:l,onDismiss:u}){let o=WS[e];return(0,Ql.jsxs)("span",{className:ke("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",JS[e],l),children:[a&&(0,Ql.jsx)(o,{className:"size-3"}),t,u&&(0,Ql.jsx)("button",{onClick:u,className:"ml-0.5 hover:opacity-70","aria-label":"Dismiss",children:(0,Ql.jsx)(Kl,{className:"size-2.5"})})]})}var x=G(fe(),1),$S=[{value:"",label:"Pilih jenis kasus"},{value:"203",label:"Jantung"},{value:"209",label:"Bedah Onkologi"},{value:"215",label:"Fisioterapi"},{value:"220",label:"Okupasi"},{value:"204",label:"Gigi"},{value:"206",label:"Jiwa"},{value:"207",label:"Mata"},{value:"211",label:"Paru"},{value:"212",label:"Syaraf"},{value:"214",label:"Urologi"},{value:"223",label:"Rehab Medis"},{value:"226",label:"Kulit Kelamin"},{value:"216",label:"Bedah Syaraf"},{value:"219",label:"Geriatri"},{value:"221",label:"Paru - Paru"},{value:"217",label:"Psikiatri"},{value:"181",label:"Kulit Kelamin"},{value:"205",label:"Non Bedah"},{value:"208",label:"Bedah"},{value:"218",label:"Orthopedi"},{value:"224",label:"Psikologi"},{value:"225",label:"Tht"},{value:"210",label:"Anak"},{value:"213",label:"Kebidanan dan Kandungan"},{value:"222",label:"Penyakit Dalam"},{value:"228",label:"Gigi"}],eC=[{value:"",label:"Pilih keadaan keluar"},{value:"31",label:"Aps / Atas Permintaan Sendiri"},{value:"73",label:"Batal Rawat Inap"},{value:"30",label:"Belum Sembuh"},{value:"121",label:"Dirujuk Lebih Tinggi"},{value:"181",label:"Melarikan Diri"},{value:"32",label:"Meninggal < 48 Jam"},{value:"74",label:"Meninggal > 8 Jam"},{value:"33",label:"Meninggal >= 48 jam"},{value:"87",label:"Pulang Hidup"}],aC=[{value:"",label:"Pilih cara keluar"},{value:"167",label:"APS/Paksa"},{value:"35",label:"Atas Permintaan Sendiri"},{value:"142",label:"Atas Persetujuan Dokter"},{value:"201",label:"Batal Rawat Inap"},{value:"141",label:"Di Rujuk"},{value:"51",label:"Diijinkan Pulang"},{value:"163",label:"Dirujuk"},{value:"164",label:"Dirujuk Lebih Rendah"},{value:"165",label:"Dirujuk Puskesmas"},{value:"162",label:"Dirujuk ke Dokter"},{value:"166",label:"Dirujuk ke Panti"},{value:"168",label:"Ke Rumah Sakit"},{value:"72",label:"Lain-lain"},{value:"169",label:"Masih Menginap"},{value:"57",label:"Masuk Rawat Inap"},{value:"58",label:"Melarikan Diri"},{value:"143",label:"Meninggal"},{value:"170",label:"Meninggal Kurang 48 Jam"},{value:"171",label:"Meninggal Lebih 48 Jam"},{value:"161",label:"Pulang Hidup"}],tC=[{value:"",label:"Pilih pemeriksaan lanjut"},{value:"52",label:"Bangsal"},{value:"88",label:"Kontrol"},{value:"11",label:"Lainnya"},{value:"8",label:"Poliklinik RS"},{value:"10",label:"Puskesmas"},{value:"9",label:"RS Lain"},{value:"49",label:"Tidak Ada"}];function Ng({kode:e,nama:a,icdType:t,onPick:l}){let[u,o]=(0,Ce.useState)([]),[d,f]=(0,Ce.useState)(!1),[r,s]=(0,Ce.useState)(e),[h,L]=(0,Ce.useState)(a),[m,g]=(0,Ce.useState)(-1),y=(0,Ce.useRef)(void 0),I=(0,Ce.useRef)(null),w=(0,Ce.useRef)(null);(0,Ce.useEffect)(()=>{w.current?.scrollIntoView({block:"nearest"})},[m]);let c=(0,Ce.useCallback)(async S=>{if(S.length<3){o([]),f(!1);return}let b=`/rekam-medik/search?opsi=${t==="icd9"?"clauseDiagnose_icd9":"kodeicd10"}&q=${encodeURIComponent(S)}${t==="icd9"?"&limit=10":""}`;try{let T=await(await fetch(b,{credentials:"same-origin"})).text(),E;try{E=JSON.parse(T)}catch{E=T.split(`
`).filter(Boolean).map(Pe=>{let ha=Pe.split("|");return{ID:ha[2]||"",KODE:ha[1]||"",NAMA:ha[0]||""}})}o(E),f(E.length>0),g(-1)}catch{}},[t]),n=S=>{s(S),clearTimeout(y.current),y.current=setTimeout(()=>c(S),300)},p=S=>{s(S.KODE),L(S.NAMA),f(!1),l(S.KODE,S.NAMA,S.ID)};(0,Ce.useEffect)(()=>{let S=k=>{I.current&&!I.current.contains(k.target)&&f(!1)};return document.addEventListener("mousedown",S),()=>document.removeEventListener("mousedown",S)},[]);let i=S=>{d&&(S.key==="ArrowDown"&&(S.preventDefault(),g(k=>Math.min(k+1,u.length-1))),S.key==="ArrowUp"&&(S.preventDefault(),g(k=>Math.max(k-1,0))),S.key==="Enter"&&m>=0&&(S.preventDefault(),p(u[m])),S.key==="Escape"&&f(!1))};return(0,x.jsxs)("div",{ref:I,className:"relative",children:[(0,x.jsxs)("div",{className:"flex gap-1",children:[(0,x.jsx)("div",{className:"w-[35%]",children:(0,x.jsx)(ka,{value:r,onChange:S=>n(S.target.value),onKeyDown:i,placeholder:"Kode",className:"text-xs font-mono"})}),(0,x.jsx)("div",{className:"flex-1",children:(0,x.jsx)(ka,{value:h,onChange:S=>L(S.target.value),onKeyDown:i,placeholder:"Nama diagnosis",className:"text-xs"})})]}),d&&u.length>0&&(0,x.jsx)("div",{className:"absolute top-full left-0 right-0 z-50 bg-card border border-border rounded-lg max-h-[220px] overflow-auto shadow-lg mt-1",children:u.map((S,k)=>{let b=k===m;return(0,x.jsxs)("div",{ref:b?w:void 0,onClick:()=>p(S),onMouseEnter:()=>g(k),className:`px-3 py-2 text-sm cursor-pointer border-b last:border-b-0 border-border transition-colors ${b?"bg-primary text-primary-foreground":"bg-card hover:bg-primary/15"}`,children:[(0,x.jsxs)("div",{className:"flex items-center justify-between",children:[(0,x.jsx)("span",{className:`font-mono text-[13px] font-bold ${b?"text-primary-foreground":"text-primary"}`,children:S.KODE}),b&&(0,x.jsx)("span",{className:"text-primary-foreground font-bold",children:"\u2713"})]}),(0,x.jsx)("div",{className:`${b?"text-primary-foreground":"text-foreground"} leading-snug mt-0.5`,children:S.NAMA})]},S.ID)})})]})}function Ws({items:e,icdType:a,onChange:t,onAdd:l,onRemove:u,label:o,emptyText:d}){return(0,x.jsxs)("div",{className:e.length?"mb-2.5":"",children:[(0,x.jsxs)("div",{className:"flex items-center gap-2 mb-1.5",children:[(0,x.jsx)("span",{className:"text-xs font-semibold text-muted-foreground uppercase tracking-wide",children:o}),(0,x.jsx)(Zl,{variant:"outline",size:"sm",type:"button",onClick:l,children:"+ Tambah"})]}),e.length>0?(0,x.jsx)("div",{className:"flex flex-col gap-1.5",children:e.map((f,r)=>(0,x.jsxs)("div",{className:"flex gap-1.5 items-start",children:[(0,x.jsx)("div",{className:"flex-1",children:(0,x.jsx)(Ng,{kode:f.kode,nama:f.nama,icdType:a,onPick:(s,h,L)=>t(r,{...f,kode:s,nama:h,id:L})})}),(0,x.jsx)(Zl,{variant:"destructive",size:"sm",type:"button",onClick:()=>u(r),className:"mt-px",children:"Hapus"})]},r))}):(0,x.jsx)("span",{className:"text-xs text-muted-foreground",children:d})]})}function Gg({data:e,onSave:a,onClose:t}){let[l,u]=(0,Ce.useState)(()=>structuredClone(e)),[o,d]=(0,Ce.useState)(!1),[f,r]=(0,Ce.useState)(""),s=i=>u(S=>({...S,...i})),h=async i=>{i.preventDefault(),d(!0),r("");try{await a(l),t()}catch(S){r(S instanceof Error?S.message:"Gagal menyimpan")}finally{d(!1)}},L=(i,S)=>{let k=[...l.icd_sekunder];k[i]=S,s({icd_sekunder:k})},m=()=>s({icd_sekunder:[...l.icd_sekunder,{id:"",kode:"",nama:""}]}),g=i=>s({icd_sekunder:l.icd_sekunder.filter((S,k)=>k!==i)}),y=(i,S)=>{let k=[...l.icd_tindakan];k[i]=S,s({icd_tindakan:k})},I=()=>s({icd_tindakan:[...l.icd_tindakan,{id:"",kode:"",nama:""}]}),w=i=>s({icd_tindakan:l.icd_tindakan.filter((S,k)=>k!==i)}),c=(i,S)=>{let k=[...l.icd_nosokomial];k[i]=S,s({icd_nosokomial:k})},n=()=>s({icd_nosokomial:[...l.icd_nosokomial,{id:"",kode:"",nama:""}]}),p=i=>s({icd_nosokomial:l.icd_nosokomial.filter((S,k)=>k!==i)});return(0,x.jsxs)("form",{onSubmit:h,className:"ri-modal font-['Inter',system-ui,sans-serif]",onClick:i=>i.stopPropagation(),children:[(0,x.jsxs)("div",{className:"flex items-center justify-between px-5 py-3 bg-gradient-to-br from-primary to-primary/80 text-white shrink-0",children:[(0,x.jsxs)("div",{className:"flex items-center gap-2.5",children:[(0,x.jsx)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,x.jsx)("path",{d:"M22 12h-4l-3 9L9 3l-3 9H2"})}),(0,x.jsx)("span",{className:"text-[15px] font-bold tracking-tight",children:"Resume Rawat Inap"})]}),(0,x.jsx)("button",{type:"button",onClick:t,className:"bg-white/15 hover:bg-white/25 border-none text-white w-[30px] h-[30px] rounded-md text-base flex items-center justify-center cursor-pointer transition-colors",children:"\u2715"})]}),(0,x.jsxs)("div",{className:"overflow-auto p-3.5 flex-1 bg-background",children:[(0,x.jsx)("div",{className:"flex gap-4 flex-wrap items-center mb-3.5 p-2.5 px-3.5 bg-card border border-border rounded-lg text-xs shadow-sm",children:[{label:"RM",value:l.norm},{label:"Pasien",value:l.pasien},{label:"Reg",value:l.noreg},{label:"Unit",value:l.unit}].map(i=>(0,x.jsxs)("span",{className:"flex items-center gap-1",children:[(0,x.jsx)("span",{className:"font-bold text-primary text-[11px] uppercase",children:i.label}),(0,x.jsx)("span",{className:"text-foreground",children:i.value})]},i.label))}),(0,x.jsx)(Qt,{title:"Ringkasan",children:(0,x.jsxs)(Qd,{cols:2,children:[(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Dokter Rawat Bersama"}),(0,x.jsx)(Se,{value:l.dokter_bersama,onChange:i=>s({dokter_bersama:i.target.value}),rows:2})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Alasan / Indikasi Rawat"}),(0,x.jsx)(Se,{value:l.alasan_rawat,onChange:i=>s({alasan_rawat:i.target.value}),rows:2})]}),(0,x.jsxs)(ga,{children:[(0,x.jsx)(j,{children:"Anamnesa"}),(0,x.jsx)(Se,{value:l.anamnesa,onChange:i=>s({anamnesa:i.target.value}),rows:4})]}),(0,x.jsxs)(ga,{children:[(0,x.jsx)(j,{children:"Riwayat Penyakit"}),(0,x.jsx)(Se,{value:l.riwayat_penyakit,onChange:i=>s({riwayat_penyakit:i.target.value}),rows:3})]})]})}),(0,x.jsx)(Qt,{title:"Vital Sign",children:(0,x.jsxs)("div",{className:"grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2.5",children:[["tensi","nadi","suhu","spo2","nafas"].map(i=>(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:i.toUpperCase()}),(0,x.jsx)(ka,{value:l[i],onChange:S=>s({[i]:S.target.value})})]},i)),["gcs_e","gcs_m","gcs_v"].map(i=>(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:i.replace("_"," ").toUpperCase()}),(0,x.jsx)(ka,{value:l[i],onChange:S=>s({[i]:S.target.value})})]},i))]})}),(0,x.jsx)(Qt,{title:"Pemeriksaan & Diagnosa",children:(0,x.jsxs)(Qd,{cols:2,children:[(0,x.jsxs)(ga,{children:[(0,x.jsx)(j,{children:"Pemeriksaan Fisik"}),(0,x.jsx)(Se,{value:l.fisik_text,onChange:i=>s({fisik_text:i.target.value}),rows:5})]}),(0,x.jsxs)(ga,{children:[(0,x.jsx)(j,{children:"Hasil Pemeriksaan Diagnostik (Lab, Rontgen, dll)"}),(0,x.jsx)(Se,{value:l.laborat,onChange:i=>s({laborat:i.target.value}),rows:4})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{required:!0,children:"Diagnosa Utama"}),(0,x.jsx)(Se,{value:l.diagnosa_primary,onChange:i=>s({diagnosa_primary:i.target.value}),rows:2})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Diagnosa Sekunder"}),(0,x.jsx)(Se,{value:l.diagnosa_skunder,onChange:i=>s({diagnosa_skunder:i.target.value}),rows:2})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Diagnosa Tindakan"}),(0,x.jsx)(Se,{value:l.diagnosa_tindakan,onChange:i=>s({diagnosa_tindakan:i.target.value}),rows:2})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Prosedur / Operasi"}),(0,x.jsx)(Se,{value:l.tindakan,onChange:i=>s({tindakan:i.target.value}),rows:2})]}),(0,x.jsxs)(ga,{children:[(0,x.jsx)(j,{children:"Pengobatan"}),(0,x.jsx)(Se,{value:l.terapi_pengobatan,onChange:i=>s({terapi_pengobatan:i.target.value}),rows:4})]}),(0,x.jsxs)(ga,{children:[(0,x.jsx)(j,{children:"Obat Pulang"}),(0,x.jsx)(Se,{value:l.obat_plg,onChange:i=>s({obat_plg:i.target.value}),rows:3})]}),(0,x.jsxs)(ga,{children:[(0,x.jsx)(j,{children:"Tindakan"}),(0,x.jsx)(Se,{value:l.tindakan_dua,onChange:i=>s({tindakan_dua:i.target.value}),rows:4})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Jenis Kasus"}),(0,x.jsx)(Yl,{value:l.jenis_kasus,onChange:i=>s({jenis_kasus:i.target.value}),options:$S})]})]})}),(0,x.jsxs)(Qt,{title:"ICD",children:[(0,x.jsxs)("div",{className:"mb-3",children:[(0,x.jsx)(j,{required:!0,children:"Diagnosa Utama"}),(0,x.jsx)(Ng,{kode:l.kode_diagnosa_utama,nama:l.diagnosa_utama_nama,icdType:"icd10",onPick:(i,S,k)=>s({kode_diagnosa_utama:i,diagnosa_utama_nama:S,id_diagnosa_utama:k})})]}),(0,x.jsx)(Ws,{items:l.icd_sekunder,icdType:"icd10",onChange:L,onAdd:m,onRemove:g,label:"Diagnosa Sekunder",emptyText:"Belum ada diagnosa sekunder"}),(0,x.jsx)(Ws,{items:l.icd_tindakan,icdType:"icd9",onChange:y,onAdd:I,onRemove:w,label:"Tindakan",emptyText:"Belum ada tindakan"}),(0,x.jsx)(Ws,{items:l.icd_nosokomial,icdType:"icd10",onChange:c,onAdd:n,onRemove:p,label:"Infeksi Nosokomial",emptyText:"Belum ada nosokomial"})]}),(0,x.jsx)(Qt,{title:"Kondisi Pulang",children:(0,x.jsxs)("div",{className:"grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5",children:[["ku","kes","td_pulang","nadi_pulang","suhu_pulang","rr_pulang","spo2_pulang"].map(i=>(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:i.replace("_"," ").toUpperCase()}),(0,x.jsx)(ka,{value:l[i],onChange:S=>s({[i]:S.target.value})})]},i)),(0,x.jsxs)(ga,{children:[(0,x.jsx)(j,{children:"Catatan Kondisi Pulang"}),(0,x.jsx)(Se,{value:l.catatan_keluar,onChange:i=>s({catatan_keluar:i.target.value}),rows:2})]})]})}),(0,x.jsx)(Qt,{title:"Keluar",children:(0,x.jsxs)(Qd,{cols:2,children:[(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Keadaan Keluar"}),(0,x.jsx)(Yl,{value:l.keadaan_keluar,onChange:i=>s({keadaan_keluar:i.target.value}),options:eC})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Cara Pulang"}),(0,x.jsx)(Yl,{value:l.cara_keluar,onChange:i=>s({cara_keluar:i.target.value}),options:aC})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Tanggal Keluar"}),(0,x.jsx)(ka,{value:l.tgl_keluar,onChange:i=>s({tgl_keluar:i.target.value})})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Pemeriksaan Lanjutan"}),(0,x.jsx)(Yl,{value:l.pemeriksaan_lanjut,onChange:i=>s({pemeriksaan_lanjut:i.target.value}),options:tC})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Jadwal Kontrol"}),(0,x.jsx)(ka,{value:l.jadwal_kontrol,onChange:i=>s({jadwal_kontrol:i.target.value})})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(j,{children:"Kelas"}),(0,x.jsx)(ka,{value:l.kelas,onChange:i=>s({kelas:i.target.value})})]}),(0,x.jsxs)(ga,{children:[(0,x.jsx)(j,{children:"Instruksi Pulang"}),(0,x.jsx)(Se,{value:l.instruksi_pulang,onChange:i=>s({instruksi_pulang:i.target.value}),rows:3})]}),(0,x.jsxs)(ga,{children:[(0,x.jsx)(j,{children:"Penyebab Kematian"}),(0,x.jsx)(Se,{value:l.penyebab_kematian,onChange:i=>s({penyebab_kematian:i.target.value}),rows:2})]})]})})]}),(0,x.jsxs)("div",{className:"flex justify-end gap-2 py-2.5 px-4 border-t border-border items-center shrink-0 bg-card",children:[f&&(0,x.jsx)(Pg,{variant:"danger",icon:!0,className:"mr-auto",children:f}),(0,x.jsx)(Zl,{type:"button",variant:"outline",onClick:t,disabled:o,children:"Batal"}),(0,x.jsx)(Zl,{type:"submit",variant:"default",disabled:o,children:o?"Menyimpan...":"Simpan"})]})]})}var Vg=G(ea(),1),ef=class extends Vg.Component{constructor(){super(...arguments);this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(t,l){console.error("[RI ErrorBoundary]",t,l.componentStack),this.props.onError()}render(){return this.state.hasError?null:this.props.children}};var an=G(fe(),1),Xg="/admisi/detail-rawat-inap/edit-resume-ri",lC="/rekam-medik/control/edit-resume-rawat-inap",lo=null,We=null,to=null;function F(e,a){return e.querySelector(`[name="${a}"]`)?.value??""}function Fe(e,a){let t=e.querySelector(`textarea[name="${a}"]`);return t?.textContent?.trim()??t?.value?.trim()??""}function $s(e,a){return Array.from(e.querySelectorAll(`[name="${a}"]`)).map(t=>t.value).filter(Boolean)}function en(e,a,t){let l=[],u=1;for(;e.querySelector(`#${a}${u}`);){let o=e.querySelector(`#kode_${a}${u}`),d=e.querySelector(`#${a}${u}`);l.push({kode:o?.value??"",nama:d?.value??"",id:t[u-1]??""}),u++}return l}function uC(e){let a=new DOMParser().parseFromString(e,"text/html"),t=$s(a,"id_diagnosa_sekunder[]"),l=$s(a,"id_tindakan[]"),u=$s(a,"id_nosokomial[]");return{id_visit:F(a,"id_visit"),id_resume_inap:F(a,"id_resume_inap"),id_user:F(a,"id_user"),id_bed:F(a,"id_bed"),unit:F(a,"unit"),noreg:F(a,"noreg"),norm:F(a,"norm"),pasien:F(a,"pasien"),dokter_bersama:F(a,"dokter_bersama"),alasan_rawat:F(a,"alasan_rawat"),anamnesa:Fe(a,"anamnesa"),riwayat_penyakit:Fe(a,"riwayat_penyakit"),tensi:F(a,"tensi"),nadi:F(a,"nadi"),suhu:F(a,"suhu"),spo2:F(a,"spo2"),nafas:F(a,"nafas"),gcs_e:F(a,"gcs_e"),gcs_m:F(a,"gcs_m"),gcs_v:F(a,"gcs_v"),fisik_text:Fe(a,"fisik_text"),laborat:Fe(a,"laborat"),diagnosa_primary:Fe(a,"diagnosa_primary"),diagnosa_skunder:Fe(a,"diagnosa_skunder"),diagnosa_tindakan:Fe(a,"diagnosa_tindakan"),tindakan:Fe(a,"tindakan"),terapi_pengobatan:Fe(a,"terapi_pengobatan"),obat_plg:Fe(a,"obat_plg"),tindakan_dua:Fe(a,"tindakan_dua"),jenis_kasus:F(a,"jenis_kasus"),kode_diagnosa_utama:a.querySelector("#kode_diagnosa_utama")?.value??"",diagnosa_utama_nama:a.querySelector("#diagnosa_utama")?.value??"",id_diagnosa_utama:F(a,"id_diagnosa_utama"),icd_sekunder:en(a,"diagnosa_sekunder",t),icd_tindakan:en(a,"tindakan",l),icd_nosokomial:en(a,"nosokomial",u),ku:F(a,"ku"),kes:F(a,"kes"),td_pulang:F(a,"td_pulang"),nadi_pulang:F(a,"nadi_pulang"),suhu_pulang:F(a,"suhu_pulang"),rr_pulang:F(a,"rr_pulang"),spo2_pulang:F(a,"spo2_pulang"),catatan_keluar:Fe(a,"catatan_keluar"),keadaan_keluar:F(a,"keadaan_keluar"),cara_keluar:F(a,"cara_keluar"),penyebab_kematian:Fe(a,"penyebab_kematian"),instruksi_pulang:Fe(a,"instruksi_pulang"),tgl_keluar:F(a,"tgl_keluar"),jadwal_kontrol:F(a,"jadwal_kontrol"),pemeriksaan_lanjut:F(a,"pemeriksaan_lanjut"),kelas:F(a,"kelas"),id_kelas:F(a,"id_kelas")}}async function oC(){let e=new URLSearchParams(location.search).get("id_visit");if(!e)return null;try{let l=(await(await fetch(`/admisi/detail-rawat-inap/resume-ri?idVisit=${e}`,{credentials:"same-origin"})).text()).match(/edit\((\d+),/)?.[1]??"";l||console.warn("[RI] no existing resume found, using empty form");let u=l?`${Xg}?idVisit=${e}&id=${l}`:`${Xg}?idVisit=${e}`,d=await(await fetch(u,{credentials:"same-origin"})).text();return uC(d)}catch(a){return console.error("[RI] fetch failed:",a),null}}function dC(e){let a=[],t=(l,u)=>{u&&a.push([l,u])};return t("id_visit",e.id_visit),t("id_resume_inap",e.id_resume_inap),t("id_user",e.id_user),t("id_bed",e.id_bed),t("unit",e.unit),t("noreg",e.noreg),t("norm",e.norm),t("pasien",e.pasien),t("dokter_bersama",e.dokter_bersama),t("alasan_rawat",e.alasan_rawat),t("anamnesa",e.anamnesa),t("riwayat_penyakit",e.riwayat_penyakit),t("tensi",e.tensi),t("nadi",e.nadi),t("suhu",e.suhu),t("spo2",e.spo2),t("nafas",e.nafas),t("gcs_e",e.gcs_e),t("gcs_m",e.gcs_m),t("gcs_v",e.gcs_v),t("fisik_text",e.fisik_text),t("laborat",e.laborat),t("diagnosa_primary",e.diagnosa_primary),t("diagnosa_skunder",e.diagnosa_skunder),t("diagnosa_tindakan",e.diagnosa_tindakan),t("tindakan",e.tindakan),t("terapi_pengobatan",e.terapi_pengobatan),t("obat_plg",e.obat_plg),t("tindakan_dua",e.tindakan_dua),t("jenis_kasus",e.jenis_kasus),t("id_diagnosa_utama",e.id_diagnosa_utama),e.icd_sekunder.forEach(l=>t("id_diagnosa_sekunder[]",l.id)),e.icd_tindakan.forEach(l=>t("id_tindakan[]",l.id)),e.icd_nosokomial.forEach(l=>t("id_nosokomial[]",l.id)),t("ku",e.ku),t("kes",e.kes),t("td_pulang",e.td_pulang),t("nadi_pulang",e.nadi_pulang),t("suhu_pulang",e.suhu_pulang),t("rr_pulang",e.rr_pulang),t("spo2_pulang",e.spo2_pulang),t("catatan_keluar",e.catatan_keluar),t("keadaan_keluar",e.keadaan_keluar),t("cara_keluar",e.cara_keluar),t("penyebab_kematian",e.penyebab_kematian),t("instruksi_pulang",e.instruksi_pulang),t("tgl_keluar",e.tgl_keluar),t("jadwal_kontrol",e.jadwal_kontrol),t("pemeriksaan_lanjut",e.pemeriksaan_lanjut),t("kelas",e.kelas),t("id_kelas",e.id_kelas),t("save","Simpan"),a.map(([l,u])=>`${encodeURIComponent(l)}=${encodeURIComponent(u)}`).join("&")}function Yg(){lo&&(lo.unmount(),lo=null);let e=document.getElementById("ext-ri-container");e&&e.remove(),document.body.classList.remove("ext-ri-open"),We&&(We.disabled=!1)}function fC(e){let a=document.createElement("div");if(a.id="ext-ri-container",a.className="ri-modal",a.style.cssText="position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center",document.body.appendChild(a),document.body.classList.add("ext-ri-open"),!document.getElementById("ext-ri-css")){let l=document.createElement("style");l.id="ext-ri-css",l.textContent=`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

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
      .ri-modal .ri-modal {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 25px 60px rgba(0,0,0,.25);
        width: 94%;
        max-width: 900px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: ri-up .25s ease;
        font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #1a1d23;
      }
      .ri-modal .ri-modal *,
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
      @keyframes ri-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    `,document.head.appendChild(l)}lo=(0,Kg.createRoot)(a);let t=async l=>{let u=dC(l),o=await fetch(lC,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:u,credentials:"same-origin"}),d=await o.text();if(!o.ok)throw new Error("HTTP "+o.status);if(/(?:Notice|Warning|Fatal error|Parse error)/i.test(d)&&d.length<300)throw new Error("PHP error");to=null};lo.render((0,an.jsx)(ef,{onError:()=>setTimeout(Yg,0),children:(0,an.jsx)(Gg,{data:e,onSave:t,onClose:Yg})})),setTimeout(()=>{a.querySelectorAll("textarea").forEach(l=>{l.addEventListener("input",()=>{l.style.height="auto",l.style.height=l.scrollHeight+"px"}),l.dispatchEvent(new Event("input"))})},0)}function Zg(){return document.documentElement.getAttribute("data-ext-resume-ranap")==="1"}function rC(e=5e3){return Zg()?Promise.resolve(!0):new Promise(a=>{let t=Date.now(),l=setInterval(()=>{Zg()?(clearInterval(l),a(!0)):Date.now()-t>e&&(clearInterval(l),a(!1))},200)})}async function jg(){!location.href.startsWith(location.origin+"/v2/m-klaim/detail-v2-refaktor")||!await rC()||["/login","/auth","/signin","/masuk","/keluar","/logout"].some(l=>location.pathname.toLowerCase().includes(l))||document.querySelectorAll('input[type="password"]').length>0||!new URLSearchParams(location.search).get("id_visit")||!(document.querySelector("input[name=jenis]")?.value??document.querySelector("select[name=jenis]")?.value??"").toUpperCase().includes("INAP")||document.getElementById("ext-ri-container")||(We=document.createElement("button"),We.id="ext-ri-float-btn",We.textContent="RI",We.title="Resume Rawat Inap",We.style.cssText="position:fixed;right:16px;top:calc(50% + 52px);transform:translateY(-50%);z-index:2147483645;width:44px;height:44px;border-radius:10px;border:none;background:#059669;color:#fff;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2)",We.onclick=async()=>{if(!We.disabled){We.disabled=!0;try{if(to||(to=await oC()),!to){Vd({title:"Gagal",message:"Gagal memuat data",variant:"danger",okLabel:"OK",hideCancel:!0}),We.disabled=!1;return}fC(to)}catch(l){console.error("[RI] error:",l),Vd({title:"Gagal",message:l instanceof Error?l.message:String(l),variant:"danger",okLabel:"OK",hideCancel:!0}),We.disabled=!1}}},document.body.appendChild(We))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>jg()):jg().catch(e=>console.error("[RI] init error:",e));})();
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
