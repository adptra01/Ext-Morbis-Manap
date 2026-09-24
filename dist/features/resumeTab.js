"use strict";var __morbis_feature=(()=>{var Oh=Object.create;var Lo=Object.defineProperty;var qh=Object.getOwnPropertyDescriptor;var Hh=Object.getOwnPropertyNames;var Uh=Object.getPrototypeOf,zh=Object.prototype.hasOwnProperty;var So=(e,a,t)=>()=>{if(t)throw t[0];try{return e&&(a=e(e=0)),a}catch(l){throw t=[l],l}};var va=(e,a)=>()=>{try{return a||e((a={exports:{}}).exports,a),a.exports}catch(t){throw a=0,t}},_h=(e,a)=>{for(var t in a)Lo(e,t,{get:a[t],enumerable:!0})},yd=(e,a,t,l)=>{if(a&&typeof a=="object"||typeof a=="function")for(let u of Hh(a))!zh.call(e,u)&&u!==t&&Lo(e,u,{get:()=>a[u],enumerable:!(l=qh(a,u))||l.enumerable});return e};var q=(e,a,t)=>(t=e!=null?Oh(Uh(e)):{},yd(a||!e||!e.__esModule?Lo(t,"default",{value:e,enumerable:!0}):t,e)),Nh=e=>yd(Lo({},"__esModule",{value:!0}),e);var Dd=va(le=>{"use strict";function Sr(e,a){var t=e.length;e.push(a);e:for(;0<t;){var l=t-1>>>1,u=e[l];if(0<yo(u,a))e[l]=a,e[t]=u,t=l;else break e}}function Ia(e){return e.length===0?null:e[0]}function bo(e){if(e.length===0)return null;var a=e[0],t=e.pop();if(t!==a){e[0]=t;e:for(var l=0,u=e.length,o=u>>>1;l<o;){var n=2*(l+1)-1,r=e[n],s=n+1,i=e[s];if(0>yo(r,t))s<u&&0>yo(i,r)?(e[l]=i,e[s]=t,l=s):(e[l]=r,e[n]=t,l=n);else if(s<u&&0>yo(i,t))e[l]=i,e[s]=t,l=s;else break e}}return a}function yo(e,a){var t=e.sortIndex-a.sortIndex;return t!==0?t:e.id-a.id}le.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Cd=performance,le.unstable_now=function(){return Cd.now()}):(hr=Date,bd=hr.now(),le.unstable_now=function(){return hr.now()-bd});var Cd,hr,bd,Ba=[],at=[],Ph=1,ta=null,Me=3,yr=!1,su=!1,iu=!1,Cr=!1,kd=typeof setTimeout=="function"?setTimeout:null,Ad=typeof clearTimeout=="function"?clearTimeout:null,vd=typeof setImmediate<"u"?setImmediate:null;function Co(e){for(var a=Ia(at);a!==null;){if(a.callback===null)bo(at);else if(a.startTime<=e)bo(at),a.sortIndex=a.expirationTime,Sr(Ba,a);else break;a=Ia(at)}}function br(e){if(iu=!1,Co(e),!su)if(Ia(Ba)!==null)su=!0,fl||(fl=!0,dl());else{var a=Ia(at);a!==null&&vr(br,a.startTime-e)}}var fl=!1,du=-1,Td=5,wd=-1;function Md(){return Cr?!0:!(le.unstable_now()-wd<Td)}function xr(){if(Cr=!1,fl){var e=le.unstable_now();wd=e;var a=!0;try{e:{su=!1,iu&&(iu=!1,Ad(du),du=-1),yr=!0;var t=Me;try{a:{for(Co(e),ta=Ia(Ba);ta!==null&&!(ta.expirationTime>e&&Md());){var l=ta.callback;if(typeof l=="function"){ta.callback=null,Me=ta.priorityLevel;var u=l(ta.expirationTime<=e);if(e=le.unstable_now(),typeof u=="function"){ta.callback=u,Co(e),a=!0;break a}ta===Ia(Ba)&&bo(Ba),Co(e)}else bo(Ba);ta=Ia(Ba)}if(ta!==null)a=!0;else{var o=Ia(at);o!==null&&vr(br,o.startTime-e),a=!1}}break e}finally{ta=null,Me=t,yr=!1}a=void 0}}finally{a?dl():fl=!1}}}var dl;typeof vd=="function"?dl=function(){vd(xr)}:typeof MessageChannel<"u"?(Lr=new MessageChannel,Id=Lr.port2,Lr.port1.onmessage=xr,dl=function(){Id.postMessage(null)}):dl=function(){kd(xr,0)};var Lr,Id;function vr(e,a){du=kd(function(){e(le.unstable_now())},a)}le.unstable_IdlePriority=5;le.unstable_ImmediatePriority=1;le.unstable_LowPriority=4;le.unstable_NormalPriority=3;le.unstable_Profiling=null;le.unstable_UserBlockingPriority=2;le.unstable_cancelCallback=function(e){e.callback=null};le.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Td=0<e?Math.floor(1e3/e):5};le.unstable_getCurrentPriorityLevel=function(){return Me};le.unstable_next=function(e){switch(Me){case 1:case 2:case 3:var a=3;break;default:a=Me}var t=Me;Me=a;try{return e()}finally{Me=t}};le.unstable_requestPaint=function(){Cr=!0};le.unstable_runWithPriority=function(e,a){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var t=Me;Me=e;try{return a()}finally{Me=t}};le.unstable_scheduleCallback=function(e,a,t){var l=le.unstable_now();switch(typeof t=="object"&&t!==null?(t=t.delay,t=typeof t=="number"&&0<t?l+t:l):t=l,e){case 1:var u=-1;break;case 2:u=250;break;case 5:u=1073741823;break;case 4:u=1e4;break;default:u=5e3}return u=t+u,e={id:Ph++,callback:a,priorityLevel:e,startTime:t,expirationTime:u,sortIndex:-1},t>l?(e.sortIndex=t,Sr(at,e),Ia(Ba)===null&&e===Ia(at)&&(iu?(Ad(du),du=-1):iu=!0,vr(br,t-l))):(e.sortIndex=u,Sr(Ba,e),su||yr||(su=!0,fl||(fl=!0,dl()))),e};le.unstable_shouldYield=Md;le.unstable_wrapCallback=function(e){var a=Me;return function(){var t=Me;Me=a;try{return e.apply(this,arguments)}finally{Me=t}}}});var Bd=va((AC,Rd)=>{"use strict";Rd.exports=Dd()});var Gd=va(B=>{"use strict";var Ar=Symbol.for("react.transitional.element"),Fh=Symbol.for("react.portal"),Gh=Symbol.for("react.fragment"),Vh=Symbol.for("react.strict_mode"),Xh=Symbol.for("react.profiler"),jh=Symbol.for("react.consumer"),Kh=Symbol.for("react.context"),Yh=Symbol.for("react.forward_ref"),Zh=Symbol.for("react.suspense"),Qh=Symbol.for("react.memo"),Ud=Symbol.for("react.lazy"),Jh=Symbol.for("react.activity"),Ed=Symbol.iterator;function Wh(e){return e===null||typeof e!="object"?null:(e=Ed&&e[Ed]||e["@@iterator"],typeof e=="function"?e:null)}var zd={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_d=Object.assign,Nd={};function ml(e,a,t){this.props=e,this.context=a,this.refs=Nd,this.updater=t||zd}ml.prototype.isReactComponent={};ml.prototype.setState=function(e,a){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,a,"setState")};ml.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Pd(){}Pd.prototype=ml.prototype;function Tr(e,a,t){this.props=e,this.context=a,this.refs=Nd,this.updater=t||zd}var wr=Tr.prototype=new Pd;wr.constructor=Tr;_d(wr,ml.prototype);wr.isPureReactComponent=!0;var Od=Array.isArray;function kr(){}var $={H:null,A:null,T:null,S:null},Fd=Object.prototype.hasOwnProperty;function Mr(e,a,t){var l=t.ref;return{$$typeof:Ar,type:e,key:a,ref:l!==void 0?l:null,props:t}}function $h(e,a){return Mr(e.type,a,e.props)}function Dr(e){return typeof e=="object"&&e!==null&&e.$$typeof===Ar}function ex(e){var a={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(t){return a[t]})}var qd=/\/+/g;function Ir(e,a){return typeof e=="object"&&e!==null&&e.key!=null?ex(""+e.key):a.toString(36)}function ax(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(kr,kr):(e.status="pending",e.then(function(a){e.status==="pending"&&(e.status="fulfilled",e.value=a)},function(a){e.status==="pending"&&(e.status="rejected",e.reason=a)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function cl(e,a,t,l,u){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var n=!1;if(e===null)n=!0;else switch(o){case"bigint":case"string":case"number":n=!0;break;case"object":switch(e.$$typeof){case Ar:case Fh:n=!0;break;case Ud:return n=e._init,cl(n(e._payload),a,t,l,u)}}if(n)return u=u(e),n=l===""?"."+Ir(e,0):l,Od(u)?(t="",n!=null&&(t=n.replace(qd,"$&/")+"/"),cl(u,a,t,"",function(i){return i})):u!=null&&(Dr(u)&&(u=$h(u,t+(u.key==null||e&&e.key===u.key?"":(""+u.key).replace(qd,"$&/")+"/")+n)),a.push(u)),1;n=0;var r=l===""?".":l+":";if(Od(e))for(var s=0;s<e.length;s++)l=e[s],o=r+Ir(l,s),n+=cl(l,a,t,o,u);else if(s=Wh(e),typeof s=="function")for(e=s.call(e),s=0;!(l=e.next()).done;)l=l.value,o=r+Ir(l,s++),n+=cl(l,a,t,o,u);else if(o==="object"){if(typeof e.then=="function")return cl(ax(e),a,t,l,u);throw a=String(e),Error("Objects are not valid as a React child (found: "+(a==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":a)+"). If you meant to render a collection of children, use an array instead.")}return n}function vo(e,a,t){if(e==null)return e;var l=[],u=0;return cl(e,l,"","",function(o){return a.call(t,o,u++)}),l}function tx(e){if(e._status===-1){var a=e._result;a=a(),a.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=a)}if(e._status===1)return e._result.default;throw e._result}var Hd=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},lx={map:vo,forEach:function(e,a,t){vo(e,function(){a.apply(this,arguments)},t)},count:function(e){var a=0;return vo(e,function(){a++}),a},toArray:function(e){return vo(e,function(a){return a})||[]},only:function(e){if(!Dr(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};B.Activity=Jh;B.Children=lx;B.Component=ml;B.Fragment=Gh;B.Profiler=Xh;B.PureComponent=Tr;B.StrictMode=Vh;B.Suspense=Zh;B.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=$;B.__COMPILER_RUNTIME={__proto__:null,c:function(e){return $.H.useMemoCache(e)}};B.cache=function(e){return function(){return e.apply(null,arguments)}};B.cacheSignal=function(){return null};B.cloneElement=function(e,a,t){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var l=_d({},e.props),u=e.key;if(a!=null)for(o in a.key!==void 0&&(u=""+a.key),a)!Fd.call(a,o)||o==="key"||o==="__self"||o==="__source"||o==="ref"&&a.ref===void 0||(l[o]=a[o]);var o=arguments.length-2;if(o===1)l.children=t;else if(1<o){for(var n=Array(o),r=0;r<o;r++)n[r]=arguments[r+2];l.children=n}return Mr(e.type,u,l)};B.createContext=function(e){return e={$$typeof:Kh,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:jh,_context:e},e};B.createElement=function(e,a,t){var l,u={},o=null;if(a!=null)for(l in a.key!==void 0&&(o=""+a.key),a)Fd.call(a,l)&&l!=="key"&&l!=="__self"&&l!=="__source"&&(u[l]=a[l]);var n=arguments.length-2;if(n===1)u.children=t;else if(1<n){for(var r=Array(n),s=0;s<n;s++)r[s]=arguments[s+2];u.children=r}if(e&&e.defaultProps)for(l in n=e.defaultProps,n)u[l]===void 0&&(u[l]=n[l]);return Mr(e,o,u)};B.createRef=function(){return{current:null}};B.forwardRef=function(e){return{$$typeof:Yh,render:e}};B.isValidElement=Dr;B.lazy=function(e){return{$$typeof:Ud,_payload:{_status:-1,_result:e},_init:tx}};B.memo=function(e,a){return{$$typeof:Qh,type:e,compare:a===void 0?null:a}};B.startTransition=function(e){var a=$.T,t={};$.T=t;try{var l=e(),u=$.S;u!==null&&u(t,l),typeof l=="object"&&l!==null&&typeof l.then=="function"&&l.then(kr,Hd)}catch(o){Hd(o)}finally{a!==null&&t.types!==null&&(a.types=t.types),$.T=a}};B.unstable_useCacheRefresh=function(){return $.H.useCacheRefresh()};B.use=function(e){return $.H.use(e)};B.useActionState=function(e,a,t){return $.H.useActionState(e,a,t)};B.useCallback=function(e,a){return $.H.useCallback(e,a)};B.useContext=function(e){return $.H.useContext(e)};B.useDebugValue=function(){};B.useDeferredValue=function(e,a){return $.H.useDeferredValue(e,a)};B.useEffect=function(e,a){return $.H.useEffect(e,a)};B.useEffectEvent=function(e){return $.H.useEffectEvent(e)};B.useId=function(){return $.H.useId()};B.useImperativeHandle=function(e,a,t){return $.H.useImperativeHandle(e,a,t)};B.useInsertionEffect=function(e,a){return $.H.useInsertionEffect(e,a)};B.useLayoutEffect=function(e,a){return $.H.useLayoutEffect(e,a)};B.useMemo=function(e,a){return $.H.useMemo(e,a)};B.useOptimistic=function(e,a){return $.H.useOptimistic(e,a)};B.useReducer=function(e,a,t){return $.H.useReducer(e,a,t)};B.useRef=function(e){return $.H.useRef(e)};B.useState=function(e){return $.H.useState(e)};B.useSyncExternalStore=function(e,a,t){return $.H.useSyncExternalStore(e,a,t)};B.useTransition=function(){return $.H.useTransition()};B.version="19.2.8"});var Ge=va((wC,Vd)=>{"use strict";Vd.exports=Gd()});var jd=va(Ee=>{"use strict";var ux=Ge();function Xd(e){var a="https://react.dev/errors/"+e;if(1<arguments.length){a+="?args[]="+encodeURIComponent(arguments[1]);for(var t=2;t<arguments.length;t++)a+="&args[]="+encodeURIComponent(arguments[t])}return"Minified React error #"+e+"; visit "+a+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function tt(){}var Be={d:{f:tt,r:function(){throw Error(Xd(522))},D:tt,C:tt,L:tt,m:tt,X:tt,S:tt,M:tt},p:0,findDOMNode:null},ox=Symbol.for("react.portal");function nx(e,a,t){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ox,key:l==null?null:""+l,children:e,containerInfo:a,implementation:t}}var fu=ux.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Io(e,a){if(e==="font")return"";if(typeof a=="string")return a==="use-credentials"?a:""}Ee.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Be;Ee.createPortal=function(e,a){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!a||a.nodeType!==1&&a.nodeType!==9&&a.nodeType!==11)throw Error(Xd(299));return nx(e,a,null,t)};Ee.flushSync=function(e){var a=fu.T,t=Be.p;try{if(fu.T=null,Be.p=2,e)return e()}finally{fu.T=a,Be.p=t,Be.d.f()}};Ee.preconnect=function(e,a){typeof e=="string"&&(a?(a=a.crossOrigin,a=typeof a=="string"?a==="use-credentials"?a:"":void 0):a=null,Be.d.C(e,a))};Ee.prefetchDNS=function(e){typeof e=="string"&&Be.d.D(e)};Ee.preinit=function(e,a){if(typeof e=="string"&&a&&typeof a.as=="string"){var t=a.as,l=Io(t,a.crossOrigin),u=typeof a.integrity=="string"?a.integrity:void 0,o=typeof a.fetchPriority=="string"?a.fetchPriority:void 0;t==="style"?Be.d.S(e,typeof a.precedence=="string"?a.precedence:void 0,{crossOrigin:l,integrity:u,fetchPriority:o}):t==="script"&&Be.d.X(e,{crossOrigin:l,integrity:u,fetchPriority:o,nonce:typeof a.nonce=="string"?a.nonce:void 0})}};Ee.preinitModule=function(e,a){if(typeof e=="string")if(typeof a=="object"&&a!==null){if(a.as==null||a.as==="script"){var t=Io(a.as,a.crossOrigin);Be.d.M(e,{crossOrigin:t,integrity:typeof a.integrity=="string"?a.integrity:void 0,nonce:typeof a.nonce=="string"?a.nonce:void 0})}}else a==null&&Be.d.M(e)};Ee.preload=function(e,a){if(typeof e=="string"&&typeof a=="object"&&a!==null&&typeof a.as=="string"){var t=a.as,l=Io(t,a.crossOrigin);Be.d.L(e,t,{crossOrigin:l,integrity:typeof a.integrity=="string"?a.integrity:void 0,nonce:typeof a.nonce=="string"?a.nonce:void 0,type:typeof a.type=="string"?a.type:void 0,fetchPriority:typeof a.fetchPriority=="string"?a.fetchPriority:void 0,referrerPolicy:typeof a.referrerPolicy=="string"?a.referrerPolicy:void 0,imageSrcSet:typeof a.imageSrcSet=="string"?a.imageSrcSet:void 0,imageSizes:typeof a.imageSizes=="string"?a.imageSizes:void 0,media:typeof a.media=="string"?a.media:void 0})}};Ee.preloadModule=function(e,a){if(typeof e=="string")if(a){var t=Io(a.as,a.crossOrigin);Be.d.m(e,{as:typeof a.as=="string"&&a.as!=="script"?a.as:void 0,crossOrigin:t,integrity:typeof a.integrity=="string"?a.integrity:void 0})}else Be.d.m(e)};Ee.requestFormReset=function(e){Be.d.r(e)};Ee.unstable_batchedUpdates=function(e,a){return e(a)};Ee.useFormState=function(e,a,t){return fu.H.useFormState(e,a,t)};Ee.useFormStatus=function(){return fu.H.useHostTransitionStatus()};Ee.version="19.2.8"});var Zd=va((DC,Yd)=>{"use strict";function Kd(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Kd)}catch(e){console.error(e)}}Kd(),Yd.exports=jd()});var sg=va(Qn=>{"use strict";var ge=Bd(),bc=Ge(),rx=Zd();function S(e){var a="https://react.dev/errors/"+e;if(1<arguments.length){a+="?args[]="+encodeURIComponent(arguments[1]);for(var t=2;t<arguments.length;t++)a+="&args[]="+encodeURIComponent(arguments[t])}return"Minified React error #"+e+"; visit "+a+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function vc(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ju(e){var a=e,t=e;if(e.alternate)for(;a.return;)a=a.return;else{e=a;do a=e,(a.flags&4098)!==0&&(t=a.return),e=a.return;while(e)}return a.tag===3?t:null}function Ic(e){if(e.tag===13){var a=e.memoizedState;if(a===null&&(e=e.alternate,e!==null&&(a=e.memoizedState)),a!==null)return a.dehydrated}return null}function kc(e){if(e.tag===31){var a=e.memoizedState;if(a===null&&(e=e.alternate,e!==null&&(a=e.memoizedState)),a!==null)return a.dehydrated}return null}function Qd(e){if(Ju(e)!==e)throw Error(S(188))}function sx(e){var a=e.alternate;if(!a){if(a=Ju(e),a===null)throw Error(S(188));return a!==e?null:e}for(var t=e,l=a;;){var u=t.return;if(u===null)break;var o=u.alternate;if(o===null){if(l=u.return,l!==null){t=l;continue}break}if(u.child===o.child){for(o=u.child;o;){if(o===t)return Qd(u),e;if(o===l)return Qd(u),a;o=o.sibling}throw Error(S(188))}if(t.return!==l.return)t=u,l=o;else{for(var n=!1,r=u.child;r;){if(r===t){n=!0,t=u,l=o;break}if(r===l){n=!0,l=u,t=o;break}r=r.sibling}if(!n){for(r=o.child;r;){if(r===t){n=!0,t=o,l=u;break}if(r===l){n=!0,l=o,t=u;break}r=r.sibling}if(!n)throw Error(S(189))}}if(t.alternate!==l)throw Error(S(190))}if(t.tag!==3)throw Error(S(188));return t.stateNode.current===t?e:a}function Ac(e){var a=e.tag;if(a===5||a===26||a===27||a===6)return e;for(e=e.child;e!==null;){if(a=Ac(e),a!==null)return a;e=e.sibling}return null}var te=Object.assign,ix=Symbol.for("react.element"),ko=Symbol.for("react.transitional.element"),Su=Symbol.for("react.portal"),Sl=Symbol.for("react.fragment"),Tc=Symbol.for("react.strict_mode"),ds=Symbol.for("react.profiler"),wc=Symbol.for("react.consumer"),Na=Symbol.for("react.context"),oi=Symbol.for("react.forward_ref"),fs=Symbol.for("react.suspense"),cs=Symbol.for("react.suspense_list"),ni=Symbol.for("react.memo"),lt=Symbol.for("react.lazy"),ms=Symbol.for("react.activity"),dx=Symbol.for("react.memo_cache_sentinel"),Jd=Symbol.iterator;function cu(e){return e===null||typeof e!="object"?null:(e=Jd&&e[Jd]||e["@@iterator"],typeof e=="function"?e:null)}var fx=Symbol.for("react.client.reference");function ps(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===fx?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Sl:return"Fragment";case ds:return"Profiler";case Tc:return"StrictMode";case fs:return"Suspense";case cs:return"SuspenseList";case ms:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case Su:return"Portal";case Na:return e.displayName||"Context";case wc:return(e._context.displayName||"Context")+".Consumer";case oi:var a=e.render;return e=e.displayName,e||(e=a.displayName||a.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ni:return a=e.displayName||null,a!==null?a:ps(e.type)||"Memo";case lt:a=e._payload,e=e._init;try{return ps(e(a))}catch{}}return null}var yu=Array.isArray,R=bc.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,F=rx.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Vt={pending:!1,data:null,method:null,action:null},gs=[],yl=-1;function Ma(e){return{current:e}}function Ce(e){0>yl||(e.current=gs[yl],gs[yl]=null,yl--)}function Z(e,a){yl++,gs[yl]=e.current,e.current=a}var wa=Ma(null),Uu=Ma(null),pt=Ma(null),un=Ma(null);function on(e,a){switch(Z(pt,a),Z(Uu,e),Z(wa,null),a.nodeType){case 9:case 11:e=(e=a.documentElement)&&(e=e.namespaceURI)?oc(e):0;break;default:if(e=a.tagName,a=a.namespaceURI)a=oc(a),e=Yp(a,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Ce(wa),Z(wa,e)}function zl(){Ce(wa),Ce(Uu),Ce(pt)}function hs(e){e.memoizedState!==null&&Z(un,e);var a=wa.current,t=Yp(a,e.type);a!==t&&(Z(Uu,e),Z(wa,t))}function nn(e){Uu.current===e&&(Ce(wa),Ce(Uu)),un.current===e&&(Ce(un),Yu._currentValue=Vt)}var Rr,Wd;function Nt(e){if(Rr===void 0)try{throw Error()}catch(t){var a=t.stack.trim().match(/\n( *(at )?)/);Rr=a&&a[1]||"",Wd=-1<t.stack.indexOf(`
    at`)?" (<anonymous>)":-1<t.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Rr+e+Wd}var Br=!1;function Er(e,a){if(!e||Br)return"";Br=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(a){var g=function(){throw Error()};if(Object.defineProperty(g.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(g,[])}catch(m){var c=m}Reflect.construct(e,[],g)}else{try{g.call()}catch(m){c=m}e.call(g.prototype)}}else{try{throw Error()}catch(m){c=m}(g=e())&&typeof g.catch=="function"&&g.catch(function(){})}}catch(m){if(m&&c&&typeof m.stack=="string")return[m.stack,c.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var o=l.DetermineComponentFrameRoot(),n=o[0],r=o[1];if(n&&r){var s=n.split(`
`),i=r.split(`
`);for(u=l=0;l<s.length&&!s[l].includes("DetermineComponentFrameRoot");)l++;for(;u<i.length&&!i[u].includes("DetermineComponentFrameRoot");)u++;if(l===s.length||u===i.length)for(l=s.length-1,u=i.length-1;1<=l&&0<=u&&s[l]!==i[u];)u--;for(;1<=l&&0<=u;l--,u--)if(s[l]!==i[u]){if(l!==1||u!==1)do if(l--,u--,0>u||s[l]!==i[u]){var p=`
`+s[l].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=l&&0<=u);break}}}finally{Br=!1,Error.prepareStackTrace=t}return(t=e?e.displayName||e.name:"")?Nt(t):""}function cx(e,a){switch(e.tag){case 26:case 27:case 5:return Nt(e.type);case 16:return Nt("Lazy");case 13:return e.child!==a&&a!==null?Nt("Suspense Fallback"):Nt("Suspense");case 19:return Nt("SuspenseList");case 0:case 15:return Er(e.type,!1);case 11:return Er(e.type.render,!1);case 1:return Er(e.type,!0);case 31:return Nt("Activity");default:return""}}function $d(e){try{var a="",t=null;do a+=cx(e,t),t=e,e=e.return;while(e);return a}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var xs=Object.prototype.hasOwnProperty,ri=ge.unstable_scheduleCallback,Or=ge.unstable_cancelCallback,mx=ge.unstable_shouldYield,px=ge.unstable_requestPaint,Ye=ge.unstable_now,gx=ge.unstable_getCurrentPriorityLevel,Mc=ge.unstable_ImmediatePriority,Dc=ge.unstable_UserBlockingPriority,rn=ge.unstable_NormalPriority,hx=ge.unstable_LowPriority,Rc=ge.unstable_IdlePriority,xx=ge.log,Lx=ge.unstable_setDisableYieldValue,Wu=null,Ze=null;function it(e){if(typeof xx=="function"&&Lx(e),Ze&&typeof Ze.setStrictMode=="function")try{Ze.setStrictMode(Wu,e)}catch{}}var Qe=Math.clz32?Math.clz32:Cx,Sx=Math.log,yx=Math.LN2;function Cx(e){return e>>>=0,e===0?32:31-(Sx(e)/yx|0)|0}var Ao=256,To=262144,wo=4194304;function Pt(e){var a=e&42;if(a!==0)return a;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function On(e,a,t){var l=e.pendingLanes;if(l===0)return 0;var u=0,o=e.suspendedLanes,n=e.pingedLanes;e=e.warmLanes;var r=l&134217727;return r!==0?(l=r&~o,l!==0?u=Pt(l):(n&=r,n!==0?u=Pt(n):t||(t=r&~e,t!==0&&(u=Pt(t))))):(r=l&~o,r!==0?u=Pt(r):n!==0?u=Pt(n):t||(t=l&~e,t!==0&&(u=Pt(t)))),u===0?0:a!==0&&a!==u&&(a&o)===0&&(o=u&-u,t=a&-a,o>=t||o===32&&(t&4194048)!==0)?a:u}function $u(e,a){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&a)===0}function bx(e,a){switch(e){case 1:case 2:case 4:case 8:case 64:return a+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Bc(){var e=wo;return wo<<=1,(wo&62914560)===0&&(wo=4194304),e}function qr(e){for(var a=[],t=0;31>t;t++)a.push(e);return a}function eo(e,a){e.pendingLanes|=a,a!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function vx(e,a,t,l,u,o){var n=e.pendingLanes;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=t,e.entangledLanes&=t,e.errorRecoveryDisabledLanes&=t,e.shellSuspendCounter=0;var r=e.entanglements,s=e.expirationTimes,i=e.hiddenUpdates;for(t=n&~t;0<t;){var p=31-Qe(t),g=1<<p;r[p]=0,s[p]=-1;var c=i[p];if(c!==null)for(i[p]=null,p=0;p<c.length;p++){var m=c[p];m!==null&&(m.lane&=-536870913)}t&=~g}l!==0&&Ec(e,l,0),o!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=o&~(n&~a))}function Ec(e,a,t){e.pendingLanes|=a,e.suspendedLanes&=~a;var l=31-Qe(a);e.entangledLanes|=a,e.entanglements[l]=e.entanglements[l]|1073741824|t&261930}function Oc(e,a){var t=e.entangledLanes|=a;for(e=e.entanglements;t;){var l=31-Qe(t),u=1<<l;u&a|e[l]&a&&(e[l]|=a),t&=~u}}function qc(e,a){var t=a&-a;return t=(t&42)!==0?1:si(t),(t&(e.suspendedLanes|a))!==0?0:t}function si(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ii(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Hc(){var e=F.p;return e!==0?e:(e=window.event,e===void 0?32:og(e.type))}function ef(e,a){var t=F.p;try{return F.p=e,a()}finally{F.p=t}}var Tt=Math.random().toString(36).slice(2),Ie="__reactFiber$"+Tt,Ne="__reactProps$"+Tt,Zl="__reactContainer$"+Tt,Ls="__reactEvents$"+Tt,Ix="__reactListeners$"+Tt,kx="__reactHandles$"+Tt,af="__reactResources$"+Tt,ao="__reactMarker$"+Tt;function di(e){delete e[Ie],delete e[Ne],delete e[Ls],delete e[Ix],delete e[kx]}function Cl(e){var a=e[Ie];if(a)return a;for(var t=e.parentNode;t;){if(a=t[Zl]||t[Ie]){if(t=a.alternate,a.child!==null||t!==null&&t.child!==null)for(e=dc(e);e!==null;){if(t=e[Ie])return t;e=dc(e)}return a}e=t,t=e.parentNode}return null}function Ql(e){if(e=e[Ie]||e[Zl]){var a=e.tag;if(a===5||a===6||a===13||a===31||a===26||a===27||a===3)return e}return null}function Cu(e){var a=e.tag;if(a===5||a===26||a===27||a===6)return e.stateNode;throw Error(S(33))}function Rl(e){var a=e[af];return a||(a=e[af]={hoistableStyles:new Map,hoistableScripts:new Map}),a}function ye(e){e[ao]=!0}var Uc=new Set,zc={};function el(e,a){_l(e,a),_l(e+"Capture",a)}function _l(e,a){for(zc[e]=a,e=0;e<a.length;e++)Uc.add(a[e])}var Ax=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),tf={},lf={};function Tx(e){return xs.call(lf,e)?!0:xs.call(tf,e)?!1:Ax.test(e)?lf[e]=!0:(tf[e]=!0,!1)}function Go(e,a,t){if(Tx(a))if(t===null)e.removeAttribute(a);else{switch(typeof t){case"undefined":case"function":case"symbol":e.removeAttribute(a);return;case"boolean":var l=a.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(a);return}}e.setAttribute(a,""+t)}}function Mo(e,a,t){if(t===null)e.removeAttribute(a);else{switch(typeof t){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttribute(a,""+t)}}function Ea(e,a,t,l){if(l===null)e.removeAttribute(t);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttributeNS(a,t,""+l)}}function ua(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function _c(e){var a=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(a==="checkbox"||a==="radio")}function wx(e,a,t){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,a);if(!e.hasOwnProperty(a)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var u=l.get,o=l.set;return Object.defineProperty(e,a,{configurable:!0,get:function(){return u.call(this)},set:function(n){t=""+n,o.call(this,n)}}),Object.defineProperty(e,a,{enumerable:l.enumerable}),{getValue:function(){return t},setValue:function(n){t=""+n},stopTracking:function(){e._valueTracker=null,delete e[a]}}}}function Ss(e){if(!e._valueTracker){var a=_c(e)?"checked":"value";e._valueTracker=wx(e,a,""+e[a])}}function Nc(e){if(!e)return!1;var a=e._valueTracker;if(!a)return!0;var t=a.getValue(),l="";return e&&(l=_c(e)?e.checked?"true":"false":e.value),e=l,e!==t?(a.setValue(e),!0):!1}function sn(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Mx=/[\n"\\]/g;function ra(e){return e.replace(Mx,function(a){return"\\"+a.charCodeAt(0).toString(16)+" "})}function ys(e,a,t,l,u,o,n,r){e.name="",n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"?e.type=n:e.removeAttribute("type"),a!=null?n==="number"?(a===0&&e.value===""||e.value!=a)&&(e.value=""+ua(a)):e.value!==""+ua(a)&&(e.value=""+ua(a)):n!=="submit"&&n!=="reset"||e.removeAttribute("value"),a!=null?Cs(e,n,ua(a)):t!=null?Cs(e,n,ua(t)):l!=null&&e.removeAttribute("value"),u==null&&o!=null&&(e.defaultChecked=!!o),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.name=""+ua(r):e.removeAttribute("name")}function Pc(e,a,t,l,u,o,n,r){if(o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"&&(e.type=o),a!=null||t!=null){if(!(o!=="submit"&&o!=="reset"||a!=null)){Ss(e);return}t=t!=null?""+ua(t):"",a=a!=null?""+ua(a):t,r||a===e.value||(e.value=a),e.defaultValue=a}l=l??u,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=r?e.checked:!!l,e.defaultChecked=!!l,n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(e.name=n),Ss(e)}function Cs(e,a,t){a==="number"&&sn(e.ownerDocument)===e||e.defaultValue===""+t||(e.defaultValue=""+t)}function Bl(e,a,t,l){if(e=e.options,a){a={};for(var u=0;u<t.length;u++)a["$"+t[u]]=!0;for(t=0;t<e.length;t++)u=a.hasOwnProperty("$"+e[t].value),e[t].selected!==u&&(e[t].selected=u),u&&l&&(e[t].defaultSelected=!0)}else{for(t=""+ua(t),a=null,u=0;u<e.length;u++){if(e[u].value===t){e[u].selected=!0,l&&(e[u].defaultSelected=!0);return}a!==null||e[u].disabled||(a=e[u])}a!==null&&(a.selected=!0)}}function Fc(e,a,t){if(a!=null&&(a=""+ua(a),a!==e.value&&(e.value=a),t==null)){e.defaultValue!==a&&(e.defaultValue=a);return}e.defaultValue=t!=null?""+ua(t):""}function Gc(e,a,t,l){if(a==null){if(l!=null){if(t!=null)throw Error(S(92));if(yu(l)){if(1<l.length)throw Error(S(93));l=l[0]}t=l}t==null&&(t=""),a=t}t=ua(a),e.defaultValue=t,l=e.textContent,l===t&&l!==""&&l!==null&&(e.value=l),Ss(e)}function Nl(e,a){if(a){var t=e.firstChild;if(t&&t===e.lastChild&&t.nodeType===3){t.nodeValue=a;return}}e.textContent=a}var Dx=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function uf(e,a,t){var l=a.indexOf("--")===0;t==null||typeof t=="boolean"||t===""?l?e.setProperty(a,""):a==="float"?e.cssFloat="":e[a]="":l?e.setProperty(a,t):typeof t!="number"||t===0||Dx.has(a)?a==="float"?e.cssFloat=t:e[a]=(""+t).trim():e[a]=t+"px"}function Vc(e,a,t){if(a!=null&&typeof a!="object")throw Error(S(62));if(e=e.style,t!=null){for(var l in t)!t.hasOwnProperty(l)||a!=null&&a.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var u in a)l=a[u],a.hasOwnProperty(u)&&t[u]!==l&&uf(e,u,l)}else for(var o in a)a.hasOwnProperty(o)&&uf(e,o,a[o])}function fi(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Rx=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Bx=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Vo(e){return Bx.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Pa(){}var bs=null;function ci(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var bl=null,El=null;function of(e){var a=Ql(e);if(a&&(e=a.stateNode)){var t=e[Ne]||null;e:switch(e=a.stateNode,a.type){case"input":if(ys(e,t.value,t.defaultValue,t.defaultValue,t.checked,t.defaultChecked,t.type,t.name),a=t.name,t.type==="radio"&&a!=null){for(t=e;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll('input[name="'+ra(""+a)+'"][type="radio"]'),a=0;a<t.length;a++){var l=t[a];if(l!==e&&l.form===e.form){var u=l[Ne]||null;if(!u)throw Error(S(90));ys(l,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(a=0;a<t.length;a++)l=t[a],l.form===e.form&&Nc(l)}break e;case"textarea":Fc(e,t.value,t.defaultValue);break e;case"select":a=t.value,a!=null&&Bl(e,!!t.multiple,a,!1)}}}var Hr=!1;function Xc(e,a,t){if(Hr)return e(a,t);Hr=!0;try{var l=e(a);return l}finally{if(Hr=!1,(bl!==null||El!==null)&&(jn(),bl&&(a=bl,e=El,El=bl=null,of(a),e)))for(a=0;a<e.length;a++)of(e[a])}}function zu(e,a){var t=e.stateNode;if(t===null)return null;var l=t[Ne]||null;if(l===null)return null;t=l[a];e:switch(a){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(t&&typeof t!="function")throw Error(S(231,a,typeof t));return t}var ja=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),vs=!1;if(ja)try{pl={},Object.defineProperty(pl,"passive",{get:function(){vs=!0}}),window.addEventListener("test",pl,pl),window.removeEventListener("test",pl,pl)}catch{vs=!1}var pl,dt=null,mi=null,Xo=null;function jc(){if(Xo)return Xo;var e,a=mi,t=a.length,l,u="value"in dt?dt.value:dt.textContent,o=u.length;for(e=0;e<t&&a[e]===u[e];e++);var n=t-e;for(l=1;l<=n&&a[t-l]===u[o-l];l++);return Xo=u.slice(e,1<l?1-l:void 0)}function jo(e){var a=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&a===13&&(e=13)):e=a,e===10&&(e=13),32<=e||e===13?e:0}function Do(){return!0}function nf(){return!1}function Pe(e){function a(t,l,u,o,n){this._reactName=t,this._targetInst=u,this.type=l,this.nativeEvent=o,this.target=n,this.currentTarget=null;for(var r in e)e.hasOwnProperty(r)&&(t=e[r],this[r]=t?t(o):o[r]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?Do:nf,this.isPropagationStopped=nf,this}return te(a.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=Do)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=Do)},persist:function(){},isPersistent:Do}),a}var al={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},qn=Pe(al),to=te({},al,{view:0,detail:0}),Ex=Pe(to),Ur,zr,mu,Hn=te({},to,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:pi,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==mu&&(mu&&e.type==="mousemove"?(Ur=e.screenX-mu.screenX,zr=e.screenY-mu.screenY):zr=Ur=0,mu=e),Ur)},movementY:function(e){return"movementY"in e?e.movementY:zr}}),rf=Pe(Hn),Ox=te({},Hn,{dataTransfer:0}),qx=Pe(Ox),Hx=te({},to,{relatedTarget:0}),_r=Pe(Hx),Ux=te({},al,{animationName:0,elapsedTime:0,pseudoElement:0}),zx=Pe(Ux),_x=te({},al,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Nx=Pe(_x),Px=te({},al,{data:0}),sf=Pe(Px),Fx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Gx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Vx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Xx(e){var a=this.nativeEvent;return a.getModifierState?a.getModifierState(e):(e=Vx[e])?!!a[e]:!1}function pi(){return Xx}var jx=te({},to,{key:function(e){if(e.key){var a=Fx[e.key]||e.key;if(a!=="Unidentified")return a}return e.type==="keypress"?(e=jo(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Gx[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:pi,charCode:function(e){return e.type==="keypress"?jo(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?jo(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Kx=Pe(jx),Yx=te({},Hn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),df=Pe(Yx),Zx=te({},to,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:pi}),Qx=Pe(Zx),Jx=te({},al,{propertyName:0,elapsedTime:0,pseudoElement:0}),Wx=Pe(Jx),$x=te({},Hn,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),eL=Pe($x),aL=te({},al,{newState:0,oldState:0}),tL=Pe(aL),lL=[9,13,27,32],gi=ja&&"CompositionEvent"in window,Iu=null;ja&&"documentMode"in document&&(Iu=document.documentMode);var uL=ja&&"TextEvent"in window&&!Iu,Kc=ja&&(!gi||Iu&&8<Iu&&11>=Iu),ff=" ",cf=!1;function Yc(e,a){switch(e){case"keyup":return lL.indexOf(a.keyCode)!==-1;case"keydown":return a.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Zc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var vl=!1;function oL(e,a){switch(e){case"compositionend":return Zc(a);case"keypress":return a.which!==32?null:(cf=!0,ff);case"textInput":return e=a.data,e===ff&&cf?null:e;default:return null}}function nL(e,a){if(vl)return e==="compositionend"||!gi&&Yc(e,a)?(e=jc(),Xo=mi=dt=null,vl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(a.ctrlKey||a.altKey||a.metaKey)||a.ctrlKey&&a.altKey){if(a.char&&1<a.char.length)return a.char;if(a.which)return String.fromCharCode(a.which)}return null;case"compositionend":return Kc&&a.locale!=="ko"?null:a.data;default:return null}}var rL={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function mf(e){var a=e&&e.nodeName&&e.nodeName.toLowerCase();return a==="input"?!!rL[e.type]:a==="textarea"}function Qc(e,a,t,l){bl?El?El.push(l):El=[l]:bl=l,a=Tn(a,"onChange"),0<a.length&&(t=new qn("onChange","change",null,t,l),e.push({event:t,listeners:a}))}var ku=null,_u=null;function sL(e){Xp(e,0)}function Un(e){var a=Cu(e);if(Nc(a))return e}function pf(e,a){if(e==="change")return a}var Jc=!1;ja&&(ja?(Bo="oninput"in document,Bo||(Nr=document.createElement("div"),Nr.setAttribute("oninput","return;"),Bo=typeof Nr.oninput=="function"),Ro=Bo):Ro=!1,Jc=Ro&&(!document.documentMode||9<document.documentMode));var Ro,Bo,Nr;function gf(){ku&&(ku.detachEvent("onpropertychange",Wc),_u=ku=null)}function Wc(e){if(e.propertyName==="value"&&Un(_u)){var a=[];Qc(a,_u,e,ci(e)),Xc(sL,a)}}function iL(e,a,t){e==="focusin"?(gf(),ku=a,_u=t,ku.attachEvent("onpropertychange",Wc)):e==="focusout"&&gf()}function dL(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Un(_u)}function fL(e,a){if(e==="click")return Un(a)}function cL(e,a){if(e==="input"||e==="change")return Un(a)}function mL(e,a){return e===a&&(e!==0||1/e===1/a)||e!==e&&a!==a}var We=typeof Object.is=="function"?Object.is:mL;function Nu(e,a){if(We(e,a))return!0;if(typeof e!="object"||e===null||typeof a!="object"||a===null)return!1;var t=Object.keys(e),l=Object.keys(a);if(t.length!==l.length)return!1;for(l=0;l<t.length;l++){var u=t[l];if(!xs.call(a,u)||!We(e[u],a[u]))return!1}return!0}function hf(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function xf(e,a){var t=hf(e);e=0;for(var l;t;){if(t.nodeType===3){if(l=e+t.textContent.length,e<=a&&l>=a)return{node:t,offset:a-e};e=l}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=hf(t)}}function $c(e,a){return e&&a?e===a?!0:e&&e.nodeType===3?!1:a&&a.nodeType===3?$c(e,a.parentNode):"contains"in e?e.contains(a):e.compareDocumentPosition?!!(e.compareDocumentPosition(a)&16):!1:!1}function em(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var a=sn(e.document);a instanceof e.HTMLIFrameElement;){try{var t=typeof a.contentWindow.location.href=="string"}catch{t=!1}if(t)e=a.contentWindow;else break;a=sn(e.document)}return a}function hi(e){var a=e&&e.nodeName&&e.nodeName.toLowerCase();return a&&(a==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||a==="textarea"||e.contentEditable==="true")}var pL=ja&&"documentMode"in document&&11>=document.documentMode,Il=null,Is=null,Au=null,ks=!1;function Lf(e,a,t){var l=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;ks||Il==null||Il!==sn(l)||(l=Il,"selectionStart"in l&&hi(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Au&&Nu(Au,l)||(Au=l,l=Tn(Is,"onSelect"),0<l.length&&(a=new qn("onSelect","select",null,a,t),e.push({event:a,listeners:l}),a.target=Il)))}function _t(e,a){var t={};return t[e.toLowerCase()]=a.toLowerCase(),t["Webkit"+e]="webkit"+a,t["Moz"+e]="moz"+a,t}var kl={animationend:_t("Animation","AnimationEnd"),animationiteration:_t("Animation","AnimationIteration"),animationstart:_t("Animation","AnimationStart"),transitionrun:_t("Transition","TransitionRun"),transitionstart:_t("Transition","TransitionStart"),transitioncancel:_t("Transition","TransitionCancel"),transitionend:_t("Transition","TransitionEnd")},Pr={},am={};ja&&(am=document.createElement("div").style,"AnimationEvent"in window||(delete kl.animationend.animation,delete kl.animationiteration.animation,delete kl.animationstart.animation),"TransitionEvent"in window||delete kl.transitionend.transition);function tl(e){if(Pr[e])return Pr[e];if(!kl[e])return e;var a=kl[e],t;for(t in a)if(a.hasOwnProperty(t)&&t in am)return Pr[e]=a[t];return e}var tm=tl("animationend"),lm=tl("animationiteration"),um=tl("animationstart"),gL=tl("transitionrun"),hL=tl("transitionstart"),xL=tl("transitioncancel"),om=tl("transitionend"),nm=new Map,As="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");As.push("scrollEnd");function Sa(e,a){nm.set(e,a),el(a,[e])}var dn=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},la=[],Al=0,xi=0;function zn(){for(var e=Al,a=xi=Al=0;a<e;){var t=la[a];la[a++]=null;var l=la[a];la[a++]=null;var u=la[a];la[a++]=null;var o=la[a];if(la[a++]=null,l!==null&&u!==null){var n=l.pending;n===null?u.next=u:(u.next=n.next,n.next=u),l.pending=u}o!==0&&rm(t,u,o)}}function _n(e,a,t,l){la[Al++]=e,la[Al++]=a,la[Al++]=t,la[Al++]=l,xi|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function Li(e,a,t,l){return _n(e,a,t,l),fn(e)}function ll(e,a){return _n(e,null,null,a),fn(e)}function rm(e,a,t){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t);for(var u=!1,o=e.return;o!==null;)o.childLanes|=t,l=o.alternate,l!==null&&(l.childLanes|=t),o.tag===22&&(e=o.stateNode,e===null||e._visibility&1||(u=!0)),e=o,o=o.return;return e.tag===3?(o=e.stateNode,u&&a!==null&&(u=31-Qe(t),e=o.hiddenUpdates,l=e[u],l===null?e[u]=[a]:l.push(a),a.lane=t|536870912),o):null}function fn(e){if(50<qu)throw qu=0,Ks=null,Error(S(185));for(var a=e.return;a!==null;)e=a,a=e.return;return e.tag===3?e.stateNode:null}var Tl={};function LL(e,a,t,l){this.tag=e,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=a,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function je(e,a,t,l){return new LL(e,a,t,l)}function Si(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ga(e,a){var t=e.alternate;return t===null?(t=je(e.tag,a,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=a,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=e.flags&65011712,t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,a=e.dependencies,t.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext},t.sibling=e.sibling,t.index=e.index,t.ref=e.ref,t.refCleanup=e.refCleanup,t}function sm(e,a){e.flags&=65011714;var t=e.alternate;return t===null?(e.childLanes=0,e.lanes=a,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=t.childLanes,e.lanes=t.lanes,e.child=t.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=t.memoizedProps,e.memoizedState=t.memoizedState,e.updateQueue=t.updateQueue,e.type=t.type,a=t.dependencies,e.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext}),e}function Ko(e,a,t,l,u,o){var n=0;if(l=e,typeof e=="function")Si(e)&&(n=1);else if(typeof e=="string")n=CS(e,t,wa.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case ms:return e=je(31,t,a,u),e.elementType=ms,e.lanes=o,e;case Sl:return Xt(t.children,u,o,a);case Tc:n=8,u|=24;break;case ds:return e=je(12,t,a,u|2),e.elementType=ds,e.lanes=o,e;case fs:return e=je(13,t,a,u),e.elementType=fs,e.lanes=o,e;case cs:return e=je(19,t,a,u),e.elementType=cs,e.lanes=o,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Na:n=10;break e;case wc:n=9;break e;case oi:n=11;break e;case ni:n=14;break e;case lt:n=16,l=null;break e}n=29,t=Error(S(130,e===null?"null":typeof e,"")),l=null}return a=je(n,t,a,u),a.elementType=e,a.type=l,a.lanes=o,a}function Xt(e,a,t,l){return e=je(7,e,l,a),e.lanes=t,e}function Fr(e,a,t){return e=je(6,e,null,a),e.lanes=t,e}function im(e){var a=je(18,null,null,0);return a.stateNode=e,a}function Gr(e,a,t){return a=je(4,e.children!==null?e.children:[],e.key,a),a.lanes=t,a.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},a}var Sf=new WeakMap;function sa(e,a){if(typeof e=="object"&&e!==null){var t=Sf.get(e);return t!==void 0?t:(a={value:e,source:a,stack:$d(a)},Sf.set(e,a),a)}return{value:e,source:a,stack:$d(a)}}var wl=[],Ml=0,cn=null,Pu=0,oa=[],na=0,vt=null,ka=1,Aa="";function za(e,a){wl[Ml++]=Pu,wl[Ml++]=cn,cn=e,Pu=a}function dm(e,a,t){oa[na++]=ka,oa[na++]=Aa,oa[na++]=vt,vt=e;var l=ka;e=Aa;var u=32-Qe(l)-1;l&=~(1<<u),t+=1;var o=32-Qe(a)+u;if(30<o){var n=u-u%5;o=(l&(1<<n)-1).toString(32),l>>=n,u-=n,ka=1<<32-Qe(a)+u|t<<u|l,Aa=o+e}else ka=1<<o|t<<u|l,Aa=e}function yi(e){e.return!==null&&(za(e,1),dm(e,1,0))}function Ci(e){for(;e===cn;)cn=wl[--Ml],wl[Ml]=null,Pu=wl[--Ml],wl[Ml]=null;for(;e===vt;)vt=oa[--na],oa[na]=null,Aa=oa[--na],oa[na]=null,ka=oa[--na],oa[na]=null}function fm(e,a){oa[na++]=ka,oa[na++]=Aa,oa[na++]=vt,ka=a.id,Aa=a.overflow,vt=e}var ke=null,ae=null,N=!1,gt=null,ia=!1,Ts=Error(S(519));function It(e){var a=Error(S(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Fu(sa(a,e)),Ts}function yf(e){var a=e.stateNode,t=e.type,l=e.memoizedProps;switch(a[Ie]=e,a[Ne]=l,t){case"dialog":U("cancel",a),U("close",a);break;case"iframe":case"object":case"embed":U("load",a);break;case"video":case"audio":for(t=0;t<ju.length;t++)U(ju[t],a);break;case"source":U("error",a);break;case"img":case"image":case"link":U("error",a),U("load",a);break;case"details":U("toggle",a);break;case"input":U("invalid",a),Pc(a,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":U("invalid",a);break;case"textarea":U("invalid",a),Gc(a,l.value,l.defaultValue,l.children)}t=l.children,typeof t!="string"&&typeof t!="number"&&typeof t!="bigint"||a.textContent===""+t||l.suppressHydrationWarning===!0||Kp(a.textContent,t)?(l.popover!=null&&(U("beforetoggle",a),U("toggle",a)),l.onScroll!=null&&U("scroll",a),l.onScrollEnd!=null&&U("scrollend",a),l.onClick!=null&&(a.onclick=Pa),a=!0):a=!1,a||It(e,!0)}function Cf(e){for(ke=e.return;ke;)switch(ke.tag){case 5:case 31:case 13:ia=!1;return;case 27:case 3:ia=!0;return;default:ke=ke.return}}function gl(e){if(e!==ke)return!1;if(!N)return Cf(e),N=!0,!1;var a=e.tag,t;if((t=a!==3&&a!==27)&&((t=a===5)&&(t=e.type,t=!(t!=="form"&&t!=="button")||Ws(e.type,e.memoizedProps)),t=!t),t&&ae&&It(e),Cf(e),a===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(S(317));ae=ic(e)}else if(a===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(S(317));ae=ic(e)}else a===27?(a=ae,wt(e.type)?(e=ti,ti=null,ae=e):ae=a):ae=ke?fa(e.stateNode.nextSibling):null;return!0}function Zt(){ae=ke=null,N=!1}function Vr(){var e=gt;return e!==null&&(ze===null?ze=e:ze.push.apply(ze,e),gt=null),e}function Fu(e){gt===null?gt=[e]:gt.push(e)}var ws=Ma(null),ul=null,Fa=null;function ot(e,a,t){Z(ws,a._currentValue),a._currentValue=t}function Va(e){e._currentValue=ws.current,Ce(ws)}function Ms(e,a,t){for(;e!==null;){var l=e.alternate;if((e.childLanes&a)!==a?(e.childLanes|=a,l!==null&&(l.childLanes|=a)):l!==null&&(l.childLanes&a)!==a&&(l.childLanes|=a),e===t)break;e=e.return}}function Ds(e,a,t,l){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var o=u.dependencies;if(o!==null){var n=u.child;o=o.firstContext;e:for(;o!==null;){var r=o;o=u;for(var s=0;s<a.length;s++)if(r.context===a[s]){o.lanes|=t,r=o.alternate,r!==null&&(r.lanes|=t),Ms(o.return,t,e),l||(n=null);break e}o=r.next}}else if(u.tag===18){if(n=u.return,n===null)throw Error(S(341));n.lanes|=t,o=n.alternate,o!==null&&(o.lanes|=t),Ms(n,t,e),n=null}else n=u.child;if(n!==null)n.return=u;else for(n=u;n!==null;){if(n===e){n=null;break}if(u=n.sibling,u!==null){u.return=n.return,n=u;break}n=n.return}u=n}}function Jl(e,a,t,l){e=null;for(var u=a,o=!1;u!==null;){if(!o){if((u.flags&524288)!==0)o=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var n=u.alternate;if(n===null)throw Error(S(387));if(n=n.memoizedProps,n!==null){var r=u.type;We(u.pendingProps.value,n.value)||(e!==null?e.push(r):e=[r])}}else if(u===un.current){if(n=u.alternate,n===null)throw Error(S(387));n.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(Yu):e=[Yu])}u=u.return}e!==null&&Ds(a,e,t,l),a.flags|=262144}function mn(e){for(e=e.firstContext;e!==null;){if(!We(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Qt(e){ul=e,Fa=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ae(e){return cm(ul,e)}function Eo(e,a){return ul===null&&Qt(e),cm(e,a)}function cm(e,a){var t=a._currentValue;if(a={context:a,memoizedValue:t,next:null},Fa===null){if(e===null)throw Error(S(308));Fa=a,e.dependencies={lanes:0,firstContext:a},e.flags|=524288}else Fa=Fa.next=a;return t}var SL=typeof AbortController<"u"?AbortController:function(){var e=[],a=this.signal={aborted:!1,addEventListener:function(t,l){e.push(l)}};this.abort=function(){a.aborted=!0,e.forEach(function(t){return t()})}},yL=ge.unstable_scheduleCallback,CL=ge.unstable_NormalPriority,ce={$$typeof:Na,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function bi(){return{controller:new SL,data:new Map,refCount:0}}function lo(e){e.refCount--,e.refCount===0&&yL(CL,function(){e.controller.abort()})}var Tu=null,Rs=0,Pl=0,Ol=null;function bL(e,a){if(Tu===null){var t=Tu=[];Rs=0,Pl=Ki(),Ol={status:"pending",value:void 0,then:function(l){t.push(l)}}}return Rs++,a.then(bf,bf),a}function bf(){if(--Rs===0&&Tu!==null){Ol!==null&&(Ol.status="fulfilled");var e=Tu;Tu=null,Pl=0,Ol=null;for(var a=0;a<e.length;a++)(0,e[a])()}}function vL(e,a){var t=[],l={status:"pending",value:null,reason:null,then:function(u){t.push(u)}};return e.then(function(){l.status="fulfilled",l.value=a;for(var u=0;u<t.length;u++)(0,t[u])(a)},function(u){for(l.status="rejected",l.reason=u,u=0;u<t.length;u++)(0,t[u])(void 0)}),l}var vf=R.S;R.S=function(e,a){Ap=Ye(),typeof a=="object"&&a!==null&&typeof a.then=="function"&&bL(e,a),vf!==null&&vf(e,a)};var jt=Ma(null);function vi(){var e=jt.current;return e!==null?e:Y.pooledCache}function Yo(e,a){a===null?Z(jt,jt.current):Z(jt,a.pool)}function mm(){var e=vi();return e===null?null:{parent:ce._currentValue,pool:e}}var Wl=Error(S(460)),Ii=Error(S(474)),Nn=Error(S(542)),pn={then:function(){}};function If(e){return e=e.status,e==="fulfilled"||e==="rejected"}function pm(e,a,t){switch(t=e[t],t===void 0?e.push(a):t!==a&&(a.then(Pa,Pa),a=t),a.status){case"fulfilled":return a.value;case"rejected":throw e=a.reason,Af(e),e;default:if(typeof a.status=="string")a.then(Pa,Pa);else{if(e=Y,e!==null&&100<e.shellSuspendCounter)throw Error(S(482));e=a,e.status="pending",e.then(function(l){if(a.status==="pending"){var u=a;u.status="fulfilled",u.value=l}},function(l){if(a.status==="pending"){var u=a;u.status="rejected",u.reason=l}})}switch(a.status){case"fulfilled":return a.value;case"rejected":throw e=a.reason,Af(e),e}throw Kt=a,Wl}}function Ft(e){try{var a=e._init;return a(e._payload)}catch(t){throw t!==null&&typeof t=="object"&&typeof t.then=="function"?(Kt=t,Wl):t}}var Kt=null;function kf(){if(Kt===null)throw Error(S(459));var e=Kt;return Kt=null,e}function Af(e){if(e===Wl||e===Nn)throw Error(S(483))}var ql=null,Gu=0;function Oo(e){var a=Gu;return Gu+=1,ql===null&&(ql=[]),pm(ql,e,a)}function pu(e,a){a=a.props.ref,e.ref=a!==void 0?a:null}function qo(e,a){throw a.$$typeof===ix?Error(S(525)):(e=Object.prototype.toString.call(a),Error(S(31,e==="[object Object]"?"object with keys {"+Object.keys(a).join(", ")+"}":e)))}function gm(e){function a(h,d){if(e){var f=h.deletions;f===null?(h.deletions=[d],h.flags|=16):f.push(d)}}function t(h,d){if(!e)return null;for(;d!==null;)a(h,d),d=d.sibling;return null}function l(h){for(var d=new Map;h!==null;)h.key!==null?d.set(h.key,h):d.set(h.index,h),h=h.sibling;return d}function u(h,d){return h=Ga(h,d),h.index=0,h.sibling=null,h}function o(h,d,f){return h.index=f,e?(f=h.alternate,f!==null?(f=f.index,f<d?(h.flags|=67108866,d):f):(h.flags|=67108866,d)):(h.flags|=1048576,d)}function n(h){return e&&h.alternate===null&&(h.flags|=67108866),h}function r(h,d,f,x){return d===null||d.tag!==6?(d=Fr(f,h.mode,x),d.return=h,d):(d=u(d,f),d.return=h,d)}function s(h,d,f,x){var b=f.type;return b===Sl?p(h,d,f.props.children,x,f.key):d!==null&&(d.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===lt&&Ft(b)===d.type)?(d=u(d,f.props),pu(d,f),d.return=h,d):(d=Ko(f.type,f.key,f.props,null,h.mode,x),pu(d,f),d.return=h,d)}function i(h,d,f,x){return d===null||d.tag!==4||d.stateNode.containerInfo!==f.containerInfo||d.stateNode.implementation!==f.implementation?(d=Gr(f,h.mode,x),d.return=h,d):(d=u(d,f.children||[]),d.return=h,d)}function p(h,d,f,x,b){return d===null||d.tag!==7?(d=Xt(f,h.mode,x,b),d.return=h,d):(d=u(d,f),d.return=h,d)}function g(h,d,f){if(typeof d=="string"&&d!==""||typeof d=="number"||typeof d=="bigint")return d=Fr(""+d,h.mode,f),d.return=h,d;if(typeof d=="object"&&d!==null){switch(d.$$typeof){case ko:return f=Ko(d.type,d.key,d.props,null,h.mode,f),pu(f,d),f.return=h,f;case Su:return d=Gr(d,h.mode,f),d.return=h,d;case lt:return d=Ft(d),g(h,d,f)}if(yu(d)||cu(d))return d=Xt(d,h.mode,f,null),d.return=h,d;if(typeof d.then=="function")return g(h,Oo(d),f);if(d.$$typeof===Na)return g(h,Eo(h,d),f);qo(h,d)}return null}function c(h,d,f,x){var b=d!==null?d.key:null;if(typeof f=="string"&&f!==""||typeof f=="number"||typeof f=="bigint")return b!==null?null:r(h,d,""+f,x);if(typeof f=="object"&&f!==null){switch(f.$$typeof){case ko:return f.key===b?s(h,d,f,x):null;case Su:return f.key===b?i(h,d,f,x):null;case lt:return f=Ft(f),c(h,d,f,x)}if(yu(f)||cu(f))return b!==null?null:p(h,d,f,x,null);if(typeof f.then=="function")return c(h,d,Oo(f),x);if(f.$$typeof===Na)return c(h,d,Eo(h,f),x);qo(h,f)}return null}function m(h,d,f,x,b){if(typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint")return h=h.get(f)||null,r(d,h,""+x,b);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case ko:return h=h.get(x.key===null?f:x.key)||null,s(d,h,x,b);case Su:return h=h.get(x.key===null?f:x.key)||null,i(d,h,x,b);case lt:return x=Ft(x),m(h,d,f,x,b)}if(yu(x)||cu(x))return h=h.get(f)||null,p(d,h,x,b,null);if(typeof x.then=="function")return m(h,d,f,Oo(x),b);if(x.$$typeof===Na)return m(h,d,f,Eo(d,x),b);qo(d,x)}return null}function L(h,d,f,x){for(var b=null,w=null,I=d,C=d=0,v=null;I!==null&&C<f.length;C++){I.index>C?(v=I,I=null):v=I.sibling;var M=c(h,I,f[C],x);if(M===null){I===null&&(I=v);break}e&&I&&M.alternate===null&&a(h,I),d=o(M,d,C),w===null?b=M:w.sibling=M,w=M,I=v}if(C===f.length)return t(h,I),N&&za(h,C),b;if(I===null){for(;C<f.length;C++)I=g(h,f[C],x),I!==null&&(d=o(I,d,C),w===null?b=I:w.sibling=I,w=I);return N&&za(h,C),b}for(I=l(I);C<f.length;C++)v=m(I,h,C,f[C],x),v!==null&&(e&&v.alternate!==null&&I.delete(v.key===null?C:v.key),d=o(v,d,C),w===null?b=v:w.sibling=v,w=v);return e&&I.forEach(function(oe){return a(h,oe)}),N&&za(h,C),b}function y(h,d,f,x){if(f==null)throw Error(S(151));for(var b=null,w=null,I=d,C=d=0,v=null,M=f.next();I!==null&&!M.done;C++,M=f.next()){I.index>C?(v=I,I=null):v=I.sibling;var oe=c(h,I,M.value,x);if(oe===null){I===null&&(I=v);break}e&&I&&oe.alternate===null&&a(h,I),d=o(oe,d,C),w===null?b=oe:w.sibling=oe,w=oe,I=v}if(M.done)return t(h,I),N&&za(h,C),b;if(I===null){for(;!M.done;C++,M=f.next())M=g(h,M.value,x),M!==null&&(d=o(M,d,C),w===null?b=M:w.sibling=M,w=M);return N&&za(h,C),b}for(I=l(I);!M.done;C++,M=f.next())M=m(I,h,C,M.value,x),M!==null&&(e&&M.alternate!==null&&I.delete(M.key===null?C:M.key),d=o(M,d,C),w===null?b=M:w.sibling=M,w=M);return e&&I.forEach(function(aa){return a(h,aa)}),N&&za(h,C),b}function k(h,d,f,x){if(typeof f=="object"&&f!==null&&f.type===Sl&&f.key===null&&(f=f.props.children),typeof f=="object"&&f!==null){switch(f.$$typeof){case ko:e:{for(var b=f.key;d!==null;){if(d.key===b){if(b=f.type,b===Sl){if(d.tag===7){t(h,d.sibling),x=u(d,f.props.children),x.return=h,h=x;break e}}else if(d.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===lt&&Ft(b)===d.type){t(h,d.sibling),x=u(d,f.props),pu(x,f),x.return=h,h=x;break e}t(h,d);break}else a(h,d);d=d.sibling}f.type===Sl?(x=Xt(f.props.children,h.mode,x,f.key),x.return=h,h=x):(x=Ko(f.type,f.key,f.props,null,h.mode,x),pu(x,f),x.return=h,h=x)}return n(h);case Su:e:{for(b=f.key;d!==null;){if(d.key===b)if(d.tag===4&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){t(h,d.sibling),x=u(d,f.children||[]),x.return=h,h=x;break e}else{t(h,d);break}else a(h,d);d=d.sibling}x=Gr(f,h.mode,x),x.return=h,h=x}return n(h);case lt:return f=Ft(f),k(h,d,f,x)}if(yu(f))return L(h,d,f,x);if(cu(f)){if(b=cu(f),typeof b!="function")throw Error(S(150));return f=b.call(f),y(h,d,f,x)}if(typeof f.then=="function")return k(h,d,Oo(f),x);if(f.$$typeof===Na)return k(h,d,Eo(h,f),x);qo(h,f)}return typeof f=="string"&&f!==""||typeof f=="number"||typeof f=="bigint"?(f=""+f,d!==null&&d.tag===6?(t(h,d.sibling),x=u(d,f),x.return=h,h=x):(t(h,d),x=Fr(f,h.mode,x),x.return=h,h=x),n(h)):t(h,d)}return function(h,d,f,x){try{Gu=0;var b=k(h,d,f,x);return ql=null,b}catch(I){if(I===Wl||I===Nn)throw I;var w=je(29,I,null,h.mode);return w.lanes=x,w.return=h,w}}}var Jt=gm(!0),hm=gm(!1),ut=!1;function ki(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Bs(e,a){e=e.updateQueue,a.updateQueue===e&&(a.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function ht(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function xt(e,a,t){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(P&2)!==0){var u=l.pending;return u===null?a.next=a:(a.next=u.next,u.next=a),l.pending=a,a=fn(e),rm(e,null,t),a}return _n(e,l,a,t),fn(e)}function wu(e,a,t){if(a=a.updateQueue,a!==null&&(a=a.shared,(t&4194048)!==0)){var l=a.lanes;l&=e.pendingLanes,t|=l,a.lanes=t,Oc(e,t)}}function Xr(e,a){var t=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,t===l)){var u=null,o=null;if(t=t.firstBaseUpdate,t!==null){do{var n={lane:t.lane,tag:t.tag,payload:t.payload,callback:null,next:null};o===null?u=o=n:o=o.next=n,t=t.next}while(t!==null);o===null?u=o=a:o=o.next=a}else u=o=a;t={baseState:l.baseState,firstBaseUpdate:u,lastBaseUpdate:o,shared:l.shared,callbacks:l.callbacks},e.updateQueue=t;return}e=t.lastBaseUpdate,e===null?t.firstBaseUpdate=a:e.next=a,t.lastBaseUpdate=a}var Es=!1;function Mu(){if(Es){var e=Ol;if(e!==null)throw e}}function Du(e,a,t,l){Es=!1;var u=e.updateQueue;ut=!1;var o=u.firstBaseUpdate,n=u.lastBaseUpdate,r=u.shared.pending;if(r!==null){u.shared.pending=null;var s=r,i=s.next;s.next=null,n===null?o=i:n.next=i,n=s;var p=e.alternate;p!==null&&(p=p.updateQueue,r=p.lastBaseUpdate,r!==n&&(r===null?p.firstBaseUpdate=i:r.next=i,p.lastBaseUpdate=s))}if(o!==null){var g=u.baseState;n=0,p=i=s=null,r=o;do{var c=r.lane&-536870913,m=c!==r.lane;if(m?(_&c)===c:(l&c)===c){c!==0&&c===Pl&&(Es=!0),p!==null&&(p=p.next={lane:0,tag:r.tag,payload:r.payload,callback:null,next:null});e:{var L=e,y=r;c=a;var k=t;switch(y.tag){case 1:if(L=y.payload,typeof L=="function"){g=L.call(k,g,c);break e}g=L;break e;case 3:L.flags=L.flags&-65537|128;case 0:if(L=y.payload,c=typeof L=="function"?L.call(k,g,c):L,c==null)break e;g=te({},g,c);break e;case 2:ut=!0}}c=r.callback,c!==null&&(e.flags|=64,m&&(e.flags|=8192),m=u.callbacks,m===null?u.callbacks=[c]:m.push(c))}else m={lane:c,tag:r.tag,payload:r.payload,callback:r.callback,next:null},p===null?(i=p=m,s=g):p=p.next=m,n|=c;if(r=r.next,r===null){if(r=u.shared.pending,r===null)break;m=r,r=m.next,m.next=null,u.lastBaseUpdate=m,u.shared.pending=null}}while(!0);p===null&&(s=g),u.baseState=s,u.firstBaseUpdate=i,u.lastBaseUpdate=p,o===null&&(u.shared.lanes=0),At|=n,e.lanes=n,e.memoizedState=g}}function xm(e,a){if(typeof e!="function")throw Error(S(191,e));e.call(a)}function Lm(e,a){var t=e.callbacks;if(t!==null)for(e.callbacks=null,e=0;e<t.length;e++)xm(t[e],a)}var Fl=Ma(null),gn=Ma(0);function Tf(e,a){e=Qa,Z(gn,e),Z(Fl,a),Qa=e|a.baseLanes}function Os(){Z(gn,Qa),Z(Fl,Fl.current)}function Ai(){Qa=gn.current,Ce(Fl),Ce(gn)}var $e=Ma(null),da=null;function nt(e){var a=e.alternate;Z(se,se.current&1),Z($e,e),da===null&&(a===null||Fl.current!==null||a.memoizedState!==null)&&(da=e)}function qs(e){Z(se,se.current),Z($e,e),da===null&&(da=e)}function Sm(e){e.tag===22?(Z(se,se.current),Z($e,e),da===null&&(da=e)):rt(e)}function rt(){Z(se,se.current),Z($e,$e.current)}function Xe(e){Ce($e),da===e&&(da=null),Ce(se)}var se=Ma(0);function hn(e){for(var a=e;a!==null;){if(a.tag===13){var t=a.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||ei(t)||ai(t)))return a}else if(a.tag===19&&(a.memoizedProps.revealOrder==="forwards"||a.memoizedProps.revealOrder==="backwards"||a.memoizedProps.revealOrder==="unstable_legacy-backwards"||a.memoizedProps.revealOrder==="together")){if((a.flags&128)!==0)return a}else if(a.child!==null){a.child.return=a,a=a.child;continue}if(a===e)break;for(;a.sibling===null;){if(a.return===null||a.return===e)return null;a=a.return}a.sibling.return=a.return,a=a.sibling}return null}var Ka=0,O=null,K=null,de=null,xn=!1,Hl=!1,Wt=!1,Ln=0,Vu=0,Ul=null,IL=0;function ne(){throw Error(S(321))}function Ti(e,a){if(a===null)return!1;for(var t=0;t<a.length&&t<e.length;t++)if(!We(e[t],a[t]))return!1;return!0}function wi(e,a,t,l,u,o){return Ka=o,O=a,a.memoizedState=null,a.updateQueue=null,a.lanes=0,R.H=e===null||e.memoizedState===null?Qm:_i,Wt=!1,o=t(l,u),Wt=!1,Hl&&(o=Cm(a,t,l,u)),ym(e),o}function ym(e){R.H=Xu;var a=K!==null&&K.next!==null;if(Ka=0,de=K=O=null,xn=!1,Vu=0,Ul=null,a)throw Error(S(300));e===null||me||(e=e.dependencies,e!==null&&mn(e)&&(me=!0))}function Cm(e,a,t,l){O=e;var u=0;do{if(Hl&&(Ul=null),Vu=0,Hl=!1,25<=u)throw Error(S(301));if(u+=1,de=K=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}R.H=Jm,o=a(t,l)}while(Hl);return o}function kL(){var e=R.H,a=e.useState()[0];return a=typeof a.then=="function"?uo(a):a,e=e.useState()[0],(K!==null?K.memoizedState:null)!==e&&(O.flags|=1024),a}function Mi(){var e=Ln!==0;return Ln=0,e}function Di(e,a,t){a.updateQueue=e.updateQueue,a.flags&=-2053,e.lanes&=~t}function Ri(e){if(xn){for(e=e.memoizedState;e!==null;){var a=e.queue;a!==null&&(a.pending=null),e=e.next}xn=!1}Ka=0,de=K=O=null,Hl=!1,Vu=Ln=0,Ul=null}function Oe(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return de===null?O.memoizedState=de=e:de=de.next=e,de}function ie(){if(K===null){var e=O.alternate;e=e!==null?e.memoizedState:null}else e=K.next;var a=de===null?O.memoizedState:de.next;if(a!==null)de=a,K=e;else{if(e===null)throw O.alternate===null?Error(S(467)):Error(S(310));K=e,e={memoizedState:K.memoizedState,baseState:K.baseState,baseQueue:K.baseQueue,queue:K.queue,next:null},de===null?O.memoizedState=de=e:de=de.next=e}return de}function Pn(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function uo(e){var a=Vu;return Vu+=1,Ul===null&&(Ul=[]),e=pm(Ul,e,a),a=O,(de===null?a.memoizedState:de.next)===null&&(a=a.alternate,R.H=a===null||a.memoizedState===null?Qm:_i),e}function Fn(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return uo(e);if(e.$$typeof===Na)return Ae(e)}throw Error(S(438,String(e)))}function Bi(e){var a=null,t=O.updateQueue;if(t!==null&&(a=t.memoCache),a==null){var l=O.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(a={data:l.data.map(function(u){return u.slice()}),index:0})))}if(a==null&&(a={data:[],index:0}),t===null&&(t=Pn(),O.updateQueue=t),t.memoCache=a,t=a.data[a.index],t===void 0)for(t=a.data[a.index]=Array(e),l=0;l<e;l++)t[l]=dx;return a.index++,t}function Ya(e,a){return typeof a=="function"?a(e):a}function Zo(e){var a=ie();return Ei(a,K,e)}function Ei(e,a,t){var l=e.queue;if(l===null)throw Error(S(311));l.lastRenderedReducer=t;var u=e.baseQueue,o=l.pending;if(o!==null){if(u!==null){var n=u.next;u.next=o.next,o.next=n}a.baseQueue=u=o,l.pending=null}if(o=e.baseState,u===null)e.memoizedState=o;else{a=u.next;var r=n=null,s=null,i=a,p=!1;do{var g=i.lane&-536870913;if(g!==i.lane?(_&g)===g:(Ka&g)===g){var c=i.revertLane;if(c===0)s!==null&&(s=s.next={lane:0,revertLane:0,gesture:null,action:i.action,hasEagerState:i.hasEagerState,eagerState:i.eagerState,next:null}),g===Pl&&(p=!0);else if((Ka&c)===c){i=i.next,c===Pl&&(p=!0);continue}else g={lane:0,revertLane:i.revertLane,gesture:null,action:i.action,hasEagerState:i.hasEagerState,eagerState:i.eagerState,next:null},s===null?(r=s=g,n=o):s=s.next=g,O.lanes|=c,At|=c;g=i.action,Wt&&t(o,g),o=i.hasEagerState?i.eagerState:t(o,g)}else c={lane:g,revertLane:i.revertLane,gesture:i.gesture,action:i.action,hasEagerState:i.hasEagerState,eagerState:i.eagerState,next:null},s===null?(r=s=c,n=o):s=s.next=c,O.lanes|=g,At|=g;i=i.next}while(i!==null&&i!==a);if(s===null?n=o:s.next=r,!We(o,e.memoizedState)&&(me=!0,p&&(t=Ol,t!==null)))throw t;e.memoizedState=o,e.baseState=n,e.baseQueue=s,l.lastRenderedState=o}return u===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function jr(e){var a=ie(),t=a.queue;if(t===null)throw Error(S(311));t.lastRenderedReducer=e;var l=t.dispatch,u=t.pending,o=a.memoizedState;if(u!==null){t.pending=null;var n=u=u.next;do o=e(o,n.action),n=n.next;while(n!==u);We(o,a.memoizedState)||(me=!0),a.memoizedState=o,a.baseQueue===null&&(a.baseState=o),t.lastRenderedState=o}return[o,l]}function bm(e,a,t){var l=O,u=ie(),o=N;if(o){if(t===void 0)throw Error(S(407));t=t()}else t=a();var n=!We((K||u).memoizedState,t);if(n&&(u.memoizedState=t,me=!0),u=u.queue,Oi(km.bind(null,l,u,e),[e]),u.getSnapshot!==a||n||de!==null&&de.memoizedState.tag&1){if(l.flags|=2048,Gl(9,{destroy:void 0},Im.bind(null,l,u,t,a),null),Y===null)throw Error(S(349));o||(Ka&127)!==0||vm(l,a,t)}return t}function vm(e,a,t){e.flags|=16384,e={getSnapshot:a,value:t},a=O.updateQueue,a===null?(a=Pn(),O.updateQueue=a,a.stores=[e]):(t=a.stores,t===null?a.stores=[e]:t.push(e))}function Im(e,a,t,l){a.value=t,a.getSnapshot=l,Am(a)&&Tm(e)}function km(e,a,t){return t(function(){Am(a)&&Tm(e)})}function Am(e){var a=e.getSnapshot;e=e.value;try{var t=a();return!We(e,t)}catch{return!0}}function Tm(e){var a=ll(e,2);a!==null&&_e(a,e,2)}function Hs(e){var a=Oe();if(typeof e=="function"){var t=e;if(e=t(),Wt){it(!0);try{t()}finally{it(!1)}}}return a.memoizedState=a.baseState=e,a.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ya,lastRenderedState:e},a}function wm(e,a,t,l){return e.baseState=t,Ei(e,K,typeof l=="function"?l:Ya)}function AL(e,a,t,l,u){if(Vn(e))throw Error(S(485));if(e=a.action,e!==null){var o={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(n){o.listeners.push(n)}};R.T!==null?t(!0):o.isTransition=!1,l(o),t=a.pending,t===null?(o.next=a.pending=o,Mm(a,o)):(o.next=t.next,a.pending=t.next=o)}}function Mm(e,a){var t=a.action,l=a.payload,u=e.state;if(a.isTransition){var o=R.T,n={};R.T=n;try{var r=t(u,l),s=R.S;s!==null&&s(n,r),wf(e,a,r)}catch(i){Us(e,a,i)}finally{o!==null&&n.types!==null&&(o.types=n.types),R.T=o}}else try{o=t(u,l),wf(e,a,o)}catch(i){Us(e,a,i)}}function wf(e,a,t){t!==null&&typeof t=="object"&&typeof t.then=="function"?t.then(function(l){Mf(e,a,l)},function(l){return Us(e,a,l)}):Mf(e,a,t)}function Mf(e,a,t){a.status="fulfilled",a.value=t,Dm(a),e.state=t,a=e.pending,a!==null&&(t=a.next,t===a?e.pending=null:(t=t.next,a.next=t,Mm(e,t)))}function Us(e,a,t){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do a.status="rejected",a.reason=t,Dm(a),a=a.next;while(a!==l)}e.action=null}function Dm(e){e=e.listeners;for(var a=0;a<e.length;a++)(0,e[a])()}function Rm(e,a){return a}function Df(e,a){if(N){var t=Y.formState;if(t!==null){e:{var l=O;if(N){if(ae){a:{for(var u=ae,o=ia;u.nodeType!==8;){if(!o){u=null;break a}if(u=fa(u.nextSibling),u===null){u=null;break a}}o=u.data,u=o==="F!"||o==="F"?u:null}if(u){ae=fa(u.nextSibling),l=u.data==="F!";break e}}It(l)}l=!1}l&&(a=t[0])}}return t=Oe(),t.memoizedState=t.baseState=a,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Rm,lastRenderedState:a},t.queue=l,t=Km.bind(null,O,l),l.dispatch=t,l=Hs(!1),o=zi.bind(null,O,!1,l.queue),l=Oe(),u={state:a,dispatch:null,action:e,pending:null},l.queue=u,t=AL.bind(null,O,u,o,t),u.dispatch=t,l.memoizedState=e,[a,t,!1]}function Rf(e){var a=ie();return Bm(a,K,e)}function Bm(e,a,t){if(a=Ei(e,a,Rm)[0],e=Zo(Ya)[0],typeof a=="object"&&a!==null&&typeof a.then=="function")try{var l=uo(a)}catch(n){throw n===Wl?Nn:n}else l=a;a=ie();var u=a.queue,o=u.dispatch;return t!==a.memoizedState&&(O.flags|=2048,Gl(9,{destroy:void 0},TL.bind(null,u,t),null)),[l,o,e]}function TL(e,a){e.action=a}function Bf(e){var a=ie(),t=K;if(t!==null)return Bm(a,t,e);ie(),a=a.memoizedState,t=ie();var l=t.queue.dispatch;return t.memoizedState=e,[a,l,!1]}function Gl(e,a,t,l){return e={tag:e,create:t,deps:l,inst:a,next:null},a=O.updateQueue,a===null&&(a=Pn(),O.updateQueue=a),t=a.lastEffect,t===null?a.lastEffect=e.next=e:(l=t.next,t.next=e,e.next=l,a.lastEffect=e),e}function Em(){return ie().memoizedState}function Qo(e,a,t,l){var u=Oe();O.flags|=e,u.memoizedState=Gl(1|a,{destroy:void 0},t,l===void 0?null:l)}function Gn(e,a,t,l){var u=ie();l=l===void 0?null:l;var o=u.memoizedState.inst;K!==null&&l!==null&&Ti(l,K.memoizedState.deps)?u.memoizedState=Gl(a,o,t,l):(O.flags|=e,u.memoizedState=Gl(1|a,o,t,l))}function Ef(e,a){Qo(8390656,8,e,a)}function Oi(e,a){Gn(2048,8,e,a)}function wL(e){O.flags|=4;var a=O.updateQueue;if(a===null)a=Pn(),O.updateQueue=a,a.events=[e];else{var t=a.events;t===null?a.events=[e]:t.push(e)}}function Om(e){var a=ie().memoizedState;return wL({ref:a,nextImpl:e}),function(){if((P&2)!==0)throw Error(S(440));return a.impl.apply(void 0,arguments)}}function qm(e,a){return Gn(4,2,e,a)}function Hm(e,a){return Gn(4,4,e,a)}function Um(e,a){if(typeof a=="function"){e=e();var t=a(e);return function(){typeof t=="function"?t():a(null)}}if(a!=null)return e=e(),a.current=e,function(){a.current=null}}function zm(e,a,t){t=t!=null?t.concat([e]):null,Gn(4,4,Um.bind(null,a,e),t)}function qi(){}function _m(e,a){var t=ie();a=a===void 0?null:a;var l=t.memoizedState;return a!==null&&Ti(a,l[1])?l[0]:(t.memoizedState=[e,a],e)}function Nm(e,a){var t=ie();a=a===void 0?null:a;var l=t.memoizedState;if(a!==null&&Ti(a,l[1]))return l[0];if(l=e(),Wt){it(!0);try{e()}finally{it(!1)}}return t.memoizedState=[l,a],l}function Hi(e,a,t){return t===void 0||(Ka&1073741824)!==0&&(_&261930)===0?e.memoizedState=a:(e.memoizedState=t,e=wp(),O.lanes|=e,At|=e,t)}function Pm(e,a,t,l){return We(t,a)?t:Fl.current!==null?(e=Hi(e,t,l),We(e,a)||(me=!0),e):(Ka&42)===0||(Ka&1073741824)!==0&&(_&261930)===0?(me=!0,e.memoizedState=t):(e=wp(),O.lanes|=e,At|=e,a)}function Fm(e,a,t,l,u){var o=F.p;F.p=o!==0&&8>o?o:8;var n=R.T,r={};R.T=r,zi(e,!1,a,t);try{var s=u(),i=R.S;if(i!==null&&i(r,s),s!==null&&typeof s=="object"&&typeof s.then=="function"){var p=vL(s,l);Ru(e,a,p,Je(e))}else Ru(e,a,l,Je(e))}catch(g){Ru(e,a,{then:function(){},status:"rejected",reason:g},Je())}finally{F.p=o,n!==null&&r.types!==null&&(n.types=r.types),R.T=n}}function ML(){}function zs(e,a,t,l){if(e.tag!==5)throw Error(S(476));var u=Gm(e).queue;Fm(e,u,a,Vt,t===null?ML:function(){return Vm(e),t(l)})}function Gm(e){var a=e.memoizedState;if(a!==null)return a;a={memoizedState:Vt,baseState:Vt,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ya,lastRenderedState:Vt},next:null};var t={};return a.next={memoizedState:t,baseState:t,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ya,lastRenderedState:t},next:null},e.memoizedState=a,e=e.alternate,e!==null&&(e.memoizedState=a),a}function Vm(e){var a=Gm(e);a.next===null&&(a=e.alternate.memoizedState),Ru(e,a.next.queue,{},Je())}function Ui(){return Ae(Yu)}function Xm(){return ie().memoizedState}function jm(){return ie().memoizedState}function DL(e){for(var a=e.return;a!==null;){switch(a.tag){case 24:case 3:var t=Je();e=ht(t);var l=xt(a,e,t);l!==null&&(_e(l,a,t),wu(l,a,t)),a={cache:bi()},e.payload=a;return}a=a.return}}function RL(e,a,t){var l=Je();t={lane:l,revertLane:0,gesture:null,action:t,hasEagerState:!1,eagerState:null,next:null},Vn(e)?Ym(a,t):(t=Li(e,a,t,l),t!==null&&(_e(t,e,l),Zm(t,a,l)))}function Km(e,a,t){var l=Je();Ru(e,a,t,l)}function Ru(e,a,t,l){var u={lane:l,revertLane:0,gesture:null,action:t,hasEagerState:!1,eagerState:null,next:null};if(Vn(e))Ym(a,u);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=a.lastRenderedReducer,o!==null))try{var n=a.lastRenderedState,r=o(n,t);if(u.hasEagerState=!0,u.eagerState=r,We(r,n))return _n(e,a,u,0),Y===null&&zn(),!1}catch{}if(t=Li(e,a,u,l),t!==null)return _e(t,e,l),Zm(t,a,l),!0}return!1}function zi(e,a,t,l){if(l={lane:2,revertLane:Ki(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Vn(e)){if(a)throw Error(S(479))}else a=Li(e,t,l,2),a!==null&&_e(a,e,2)}function Vn(e){var a=e.alternate;return e===O||a!==null&&a===O}function Ym(e,a){Hl=xn=!0;var t=e.pending;t===null?a.next=a:(a.next=t.next,t.next=a),e.pending=a}function Zm(e,a,t){if((t&4194048)!==0){var l=a.lanes;l&=e.pendingLanes,t|=l,a.lanes=t,Oc(e,t)}}var Xu={readContext:Ae,use:Fn,useCallback:ne,useContext:ne,useEffect:ne,useImperativeHandle:ne,useLayoutEffect:ne,useInsertionEffect:ne,useMemo:ne,useReducer:ne,useRef:ne,useState:ne,useDebugValue:ne,useDeferredValue:ne,useTransition:ne,useSyncExternalStore:ne,useId:ne,useHostTransitionStatus:ne,useFormState:ne,useActionState:ne,useOptimistic:ne,useMemoCache:ne,useCacheRefresh:ne};Xu.useEffectEvent=ne;var Qm={readContext:Ae,use:Fn,useCallback:function(e,a){return Oe().memoizedState=[e,a===void 0?null:a],e},useContext:Ae,useEffect:Ef,useImperativeHandle:function(e,a,t){t=t!=null?t.concat([e]):null,Qo(4194308,4,Um.bind(null,a,e),t)},useLayoutEffect:function(e,a){return Qo(4194308,4,e,a)},useInsertionEffect:function(e,a){Qo(4,2,e,a)},useMemo:function(e,a){var t=Oe();a=a===void 0?null:a;var l=e();if(Wt){it(!0);try{e()}finally{it(!1)}}return t.memoizedState=[l,a],l},useReducer:function(e,a,t){var l=Oe();if(t!==void 0){var u=t(a);if(Wt){it(!0);try{t(a)}finally{it(!1)}}}else u=a;return l.memoizedState=l.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},l.queue=e,e=e.dispatch=RL.bind(null,O,e),[l.memoizedState,e]},useRef:function(e){var a=Oe();return e={current:e},a.memoizedState=e},useState:function(e){e=Hs(e);var a=e.queue,t=Km.bind(null,O,a);return a.dispatch=t,[e.memoizedState,t]},useDebugValue:qi,useDeferredValue:function(e,a){var t=Oe();return Hi(t,e,a)},useTransition:function(){var e=Hs(!1);return e=Fm.bind(null,O,e.queue,!0,!1),Oe().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,a,t){var l=O,u=Oe();if(N){if(t===void 0)throw Error(S(407));t=t()}else{if(t=a(),Y===null)throw Error(S(349));(_&127)!==0||vm(l,a,t)}u.memoizedState=t;var o={value:t,getSnapshot:a};return u.queue=o,Ef(km.bind(null,l,o,e),[e]),l.flags|=2048,Gl(9,{destroy:void 0},Im.bind(null,l,o,t,a),null),t},useId:function(){var e=Oe(),a=Y.identifierPrefix;if(N){var t=Aa,l=ka;t=(l&~(1<<32-Qe(l)-1)).toString(32)+t,a="_"+a+"R_"+t,t=Ln++,0<t&&(a+="H"+t.toString(32)),a+="_"}else t=IL++,a="_"+a+"r_"+t.toString(32)+"_";return e.memoizedState=a},useHostTransitionStatus:Ui,useFormState:Df,useActionState:Df,useOptimistic:function(e){var a=Oe();a.memoizedState=a.baseState=e;var t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return a.queue=t,a=zi.bind(null,O,!0,t),t.dispatch=a,[e,a]},useMemoCache:Bi,useCacheRefresh:function(){return Oe().memoizedState=DL.bind(null,O)},useEffectEvent:function(e){var a=Oe(),t={impl:e};return a.memoizedState=t,function(){if((P&2)!==0)throw Error(S(440));return t.impl.apply(void 0,arguments)}}},_i={readContext:Ae,use:Fn,useCallback:_m,useContext:Ae,useEffect:Oi,useImperativeHandle:zm,useInsertionEffect:qm,useLayoutEffect:Hm,useMemo:Nm,useReducer:Zo,useRef:Em,useState:function(){return Zo(Ya)},useDebugValue:qi,useDeferredValue:function(e,a){var t=ie();return Pm(t,K.memoizedState,e,a)},useTransition:function(){var e=Zo(Ya)[0],a=ie().memoizedState;return[typeof e=="boolean"?e:uo(e),a]},useSyncExternalStore:bm,useId:Xm,useHostTransitionStatus:Ui,useFormState:Rf,useActionState:Rf,useOptimistic:function(e,a){var t=ie();return wm(t,K,e,a)},useMemoCache:Bi,useCacheRefresh:jm};_i.useEffectEvent=Om;var Jm={readContext:Ae,use:Fn,useCallback:_m,useContext:Ae,useEffect:Oi,useImperativeHandle:zm,useInsertionEffect:qm,useLayoutEffect:Hm,useMemo:Nm,useReducer:jr,useRef:Em,useState:function(){return jr(Ya)},useDebugValue:qi,useDeferredValue:function(e,a){var t=ie();return K===null?Hi(t,e,a):Pm(t,K.memoizedState,e,a)},useTransition:function(){var e=jr(Ya)[0],a=ie().memoizedState;return[typeof e=="boolean"?e:uo(e),a]},useSyncExternalStore:bm,useId:Xm,useHostTransitionStatus:Ui,useFormState:Bf,useActionState:Bf,useOptimistic:function(e,a){var t=ie();return K!==null?wm(t,K,e,a):(t.baseState=e,[e,t.queue.dispatch])},useMemoCache:Bi,useCacheRefresh:jm};Jm.useEffectEvent=Om;function Kr(e,a,t,l){a=e.memoizedState,t=t(l,a),t=t==null?a:te({},a,t),e.memoizedState=t,e.lanes===0&&(e.updateQueue.baseState=t)}var _s={enqueueSetState:function(e,a,t){e=e._reactInternals;var l=Je(),u=ht(l);u.payload=a,t!=null&&(u.callback=t),a=xt(e,u,l),a!==null&&(_e(a,e,l),wu(a,e,l))},enqueueReplaceState:function(e,a,t){e=e._reactInternals;var l=Je(),u=ht(l);u.tag=1,u.payload=a,t!=null&&(u.callback=t),a=xt(e,u,l),a!==null&&(_e(a,e,l),wu(a,e,l))},enqueueForceUpdate:function(e,a){e=e._reactInternals;var t=Je(),l=ht(t);l.tag=2,a!=null&&(l.callback=a),a=xt(e,l,t),a!==null&&(_e(a,e,t),wu(a,e,t))}};function Of(e,a,t,l,u,o,n){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,o,n):a.prototype&&a.prototype.isPureReactComponent?!Nu(t,l)||!Nu(u,o):!0}function qf(e,a,t,l){e=a.state,typeof a.componentWillReceiveProps=="function"&&a.componentWillReceiveProps(t,l),typeof a.UNSAFE_componentWillReceiveProps=="function"&&a.UNSAFE_componentWillReceiveProps(t,l),a.state!==e&&_s.enqueueReplaceState(a,a.state,null)}function $t(e,a){var t=a;if("ref"in a){t={};for(var l in a)l!=="ref"&&(t[l]=a[l])}if(e=e.defaultProps){t===a&&(t=te({},t));for(var u in e)t[u]===void 0&&(t[u]=e[u])}return t}function Wm(e){dn(e)}function $m(e){console.error(e)}function ep(e){dn(e)}function Sn(e,a){try{var t=e.onUncaughtError;t(a.value,{componentStack:a.stack})}catch(l){setTimeout(function(){throw l})}}function Hf(e,a,t){try{var l=e.onCaughtError;l(t.value,{componentStack:t.stack,errorBoundary:a.tag===1?a.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function Ns(e,a,t){return t=ht(t),t.tag=3,t.payload={element:null},t.callback=function(){Sn(e,a)},t}function ap(e){return e=ht(e),e.tag=3,e}function tp(e,a,t,l){var u=t.type.getDerivedStateFromError;if(typeof u=="function"){var o=l.value;e.payload=function(){return u(o)},e.callback=function(){Hf(a,t,l)}}var n=t.stateNode;n!==null&&typeof n.componentDidCatch=="function"&&(e.callback=function(){Hf(a,t,l),typeof u!="function"&&(Lt===null?Lt=new Set([this]):Lt.add(this));var r=l.stack;this.componentDidCatch(l.value,{componentStack:r!==null?r:""})})}function BL(e,a,t,l,u){if(t.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(a=t.alternate,a!==null&&Jl(a,t,u,!0),t=$e.current,t!==null){switch(t.tag){case 31:case 13:return da===null?In():t.alternate===null&&re===0&&(re=3),t.flags&=-257,t.flags|=65536,t.lanes=u,l===pn?t.flags|=16384:(a=t.updateQueue,a===null?t.updateQueue=new Set([l]):a.add(l),us(e,l,u)),!1;case 22:return t.flags|=65536,l===pn?t.flags|=16384:(a=t.updateQueue,a===null?(a={transitions:null,markerInstances:null,retryQueue:new Set([l])},t.updateQueue=a):(t=a.retryQueue,t===null?a.retryQueue=new Set([l]):t.add(l)),us(e,l,u)),!1}throw Error(S(435,t.tag))}return us(e,l,u),In(),!1}if(N)return a=$e.current,a!==null?((a.flags&65536)===0&&(a.flags|=256),a.flags|=65536,a.lanes=u,l!==Ts&&(e=Error(S(422),{cause:l}),Fu(sa(e,t)))):(l!==Ts&&(a=Error(S(423),{cause:l}),Fu(sa(a,t))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,l=sa(l,t),u=Ns(e.stateNode,l,u),Xr(e,u),re!==4&&(re=2)),!1;var o=Error(S(520),{cause:l});if(o=sa(o,t),Ou===null?Ou=[o]:Ou.push(o),re!==4&&(re=2),a===null)return!0;l=sa(l,t),t=a;do{switch(t.tag){case 3:return t.flags|=65536,e=u&-u,t.lanes|=e,e=Ns(t.stateNode,l,e),Xr(t,e),!1;case 1:if(a=t.type,o=t.stateNode,(t.flags&128)===0&&(typeof a.getDerivedStateFromError=="function"||o!==null&&typeof o.componentDidCatch=="function"&&(Lt===null||!Lt.has(o))))return t.flags|=65536,u&=-u,t.lanes|=u,u=ap(u),tp(u,e,t,l),Xr(t,u),!1}t=t.return}while(t!==null);return!1}var Ni=Error(S(461)),me=!1;function ve(e,a,t,l){a.child=e===null?hm(a,null,t,l):Jt(a,e.child,t,l)}function Uf(e,a,t,l,u){t=t.render;var o=a.ref;if("ref"in l){var n={};for(var r in l)r!=="ref"&&(n[r]=l[r])}else n=l;return Qt(a),l=wi(e,a,t,n,o,u),r=Mi(),e!==null&&!me?(Di(e,a,u),Za(e,a,u)):(N&&r&&yi(a),a.flags|=1,ve(e,a,l,u),a.child)}function zf(e,a,t,l,u){if(e===null){var o=t.type;return typeof o=="function"&&!Si(o)&&o.defaultProps===void 0&&t.compare===null?(a.tag=15,a.type=o,lp(e,a,o,l,u)):(e=Ko(t.type,null,l,a,a.mode,u),e.ref=a.ref,e.return=a,a.child=e)}if(o=e.child,!Pi(e,u)){var n=o.memoizedProps;if(t=t.compare,t=t!==null?t:Nu,t(n,l)&&e.ref===a.ref)return Za(e,a,u)}return a.flags|=1,e=Ga(o,l),e.ref=a.ref,e.return=a,a.child=e}function lp(e,a,t,l,u){if(e!==null){var o=e.memoizedProps;if(Nu(o,l)&&e.ref===a.ref)if(me=!1,a.pendingProps=l=o,Pi(e,u))(e.flags&131072)!==0&&(me=!0);else return a.lanes=e.lanes,Za(e,a,u)}return Ps(e,a,t,l,u)}function up(e,a,t,l){var u=l.children,o=e!==null?e.memoizedState:null;if(e===null&&a.stateNode===null&&(a.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((a.flags&128)!==0){if(o=o!==null?o.baseLanes|t:t,e!==null){for(l=a.child=e.child,u=0;l!==null;)u=u|l.lanes|l.childLanes,l=l.sibling;l=u&~o}else l=0,a.child=null;return _f(e,a,o,t,l)}if((t&536870912)!==0)a.memoizedState={baseLanes:0,cachePool:null},e!==null&&Yo(a,o!==null?o.cachePool:null),o!==null?Tf(a,o):Os(),Sm(a);else return l=a.lanes=536870912,_f(e,a,o!==null?o.baseLanes|t:t,t,l)}else o!==null?(Yo(a,o.cachePool),Tf(a,o),rt(a),a.memoizedState=null):(e!==null&&Yo(a,null),Os(),rt(a));return ve(e,a,u,t),a.child}function bu(e,a){return e!==null&&e.tag===22||a.stateNode!==null||(a.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.sibling}function _f(e,a,t,l,u){var o=vi();return o=o===null?null:{parent:ce._currentValue,pool:o},a.memoizedState={baseLanes:t,cachePool:o},e!==null&&Yo(a,null),Os(),Sm(a),e!==null&&Jl(e,a,l,!0),a.childLanes=u,null}function Jo(e,a){return a=yn({mode:a.mode,children:a.children},e.mode),a.ref=e.ref,e.child=a,a.return=e,a}function Nf(e,a,t){return Jt(a,e.child,null,t),e=Jo(a,a.pendingProps),e.flags|=2,Xe(a),a.memoizedState=null,e}function EL(e,a,t){var l=a.pendingProps,u=(a.flags&128)!==0;if(a.flags&=-129,e===null){if(N){if(l.mode==="hidden")return e=Jo(a,l),a.lanes=536870912,bu(null,e);if(qs(a),(e=ae)?(e=Qp(e,ia),e=e!==null&&e.data==="&"?e:null,e!==null&&(a.memoizedState={dehydrated:e,treeContext:vt!==null?{id:ka,overflow:Aa}:null,retryLane:536870912,hydrationErrors:null},t=im(e),t.return=a,a.child=t,ke=a,ae=null)):e=null,e===null)throw It(a);return a.lanes=536870912,null}return Jo(a,l)}var o=e.memoizedState;if(o!==null){var n=o.dehydrated;if(qs(a),u)if(a.flags&256)a.flags&=-257,a=Nf(e,a,t);else if(a.memoizedState!==null)a.child=e.child,a.flags|=128,a=null;else throw Error(S(558));else if(me||Jl(e,a,t,!1),u=(t&e.childLanes)!==0,me||u){if(l=Y,l!==null&&(n=qc(l,t),n!==0&&n!==o.retryLane))throw o.retryLane=n,ll(e,n),_e(l,e,n),Ni;In(),a=Nf(e,a,t)}else e=o.treeContext,ae=fa(n.nextSibling),ke=a,N=!0,gt=null,ia=!1,e!==null&&fm(a,e),a=Jo(a,l),a.flags|=4096;return a}return e=Ga(e.child,{mode:l.mode,children:l.children}),e.ref=a.ref,a.child=e,e.return=a,e}function Wo(e,a){var t=a.ref;if(t===null)e!==null&&e.ref!==null&&(a.flags|=4194816);else{if(typeof t!="function"&&typeof t!="object")throw Error(S(284));(e===null||e.ref!==t)&&(a.flags|=4194816)}}function Ps(e,a,t,l,u){return Qt(a),t=wi(e,a,t,l,void 0,u),l=Mi(),e!==null&&!me?(Di(e,a,u),Za(e,a,u)):(N&&l&&yi(a),a.flags|=1,ve(e,a,t,u),a.child)}function Pf(e,a,t,l,u,o){return Qt(a),a.updateQueue=null,t=Cm(a,l,t,u),ym(e),l=Mi(),e!==null&&!me?(Di(e,a,o),Za(e,a,o)):(N&&l&&yi(a),a.flags|=1,ve(e,a,t,o),a.child)}function Ff(e,a,t,l,u){if(Qt(a),a.stateNode===null){var o=Tl,n=t.contextType;typeof n=="object"&&n!==null&&(o=Ae(n)),o=new t(l,o),a.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,o.updater=_s,a.stateNode=o,o._reactInternals=a,o=a.stateNode,o.props=l,o.state=a.memoizedState,o.refs={},ki(a),n=t.contextType,o.context=typeof n=="object"&&n!==null?Ae(n):Tl,o.state=a.memoizedState,n=t.getDerivedStateFromProps,typeof n=="function"&&(Kr(a,t,n,l),o.state=a.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(n=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),n!==o.state&&_s.enqueueReplaceState(o,o.state,null),Du(a,l,o,u),Mu(),o.state=a.memoizedState),typeof o.componentDidMount=="function"&&(a.flags|=4194308),l=!0}else if(e===null){o=a.stateNode;var r=a.memoizedProps,s=$t(t,r);o.props=s;var i=o.context,p=t.contextType;n=Tl,typeof p=="object"&&p!==null&&(n=Ae(p));var g=t.getDerivedStateFromProps;p=typeof g=="function"||typeof o.getSnapshotBeforeUpdate=="function",r=a.pendingProps!==r,p||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(r||i!==n)&&qf(a,o,l,n),ut=!1;var c=a.memoizedState;o.state=c,Du(a,l,o,u),Mu(),i=a.memoizedState,r||c!==i||ut?(typeof g=="function"&&(Kr(a,t,g,l),i=a.memoizedState),(s=ut||Of(a,t,s,l,c,i,n))?(p||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(a.flags|=4194308)):(typeof o.componentDidMount=="function"&&(a.flags|=4194308),a.memoizedProps=l,a.memoizedState=i),o.props=l,o.state=i,o.context=n,l=s):(typeof o.componentDidMount=="function"&&(a.flags|=4194308),l=!1)}else{o=a.stateNode,Bs(e,a),n=a.memoizedProps,p=$t(t,n),o.props=p,g=a.pendingProps,c=o.context,i=t.contextType,s=Tl,typeof i=="object"&&i!==null&&(s=Ae(i)),r=t.getDerivedStateFromProps,(i=typeof r=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(n!==g||c!==s)&&qf(a,o,l,s),ut=!1,c=a.memoizedState,o.state=c,Du(a,l,o,u),Mu();var m=a.memoizedState;n!==g||c!==m||ut||e!==null&&e.dependencies!==null&&mn(e.dependencies)?(typeof r=="function"&&(Kr(a,t,r,l),m=a.memoizedState),(p=ut||Of(a,t,p,l,c,m,s)||e!==null&&e.dependencies!==null&&mn(e.dependencies))?(i||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(l,m,s),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(l,m,s)),typeof o.componentDidUpdate=="function"&&(a.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(a.flags|=1024)):(typeof o.componentDidUpdate!="function"||n===e.memoizedProps&&c===e.memoizedState||(a.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||n===e.memoizedProps&&c===e.memoizedState||(a.flags|=1024),a.memoizedProps=l,a.memoizedState=m),o.props=l,o.state=m,o.context=s,l=p):(typeof o.componentDidUpdate!="function"||n===e.memoizedProps&&c===e.memoizedState||(a.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||n===e.memoizedProps&&c===e.memoizedState||(a.flags|=1024),l=!1)}return o=l,Wo(e,a),l=(a.flags&128)!==0,o||l?(o=a.stateNode,t=l&&typeof t.getDerivedStateFromError!="function"?null:o.render(),a.flags|=1,e!==null&&l?(a.child=Jt(a,e.child,null,u),a.child=Jt(a,null,t,u)):ve(e,a,t,u),a.memoizedState=o.state,e=a.child):e=Za(e,a,u),e}function Gf(e,a,t,l){return Zt(),a.flags|=256,ve(e,a,t,l),a.child}var Yr={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Zr(e){return{baseLanes:e,cachePool:mm()}}function Qr(e,a,t){return e=e!==null?e.childLanes&~t:0,a&&(e|=Ke),e}function op(e,a,t){var l=a.pendingProps,u=!1,o=(a.flags&128)!==0,n;if((n=o)||(n=e!==null&&e.memoizedState===null?!1:(se.current&2)!==0),n&&(u=!0,a.flags&=-129),n=(a.flags&32)!==0,a.flags&=-33,e===null){if(N){if(u?nt(a):rt(a),(e=ae)?(e=Qp(e,ia),e=e!==null&&e.data!=="&"?e:null,e!==null&&(a.memoizedState={dehydrated:e,treeContext:vt!==null?{id:ka,overflow:Aa}:null,retryLane:536870912,hydrationErrors:null},t=im(e),t.return=a,a.child=t,ke=a,ae=null)):e=null,e===null)throw It(a);return ai(e)?a.lanes=32:a.lanes=536870912,null}var r=l.children;return l=l.fallback,u?(rt(a),u=a.mode,r=yn({mode:"hidden",children:r},u),l=Xt(l,u,t,null),r.return=a,l.return=a,r.sibling=l,a.child=r,l=a.child,l.memoizedState=Zr(t),l.childLanes=Qr(e,n,t),a.memoizedState=Yr,bu(null,l)):(nt(a),Fs(a,r))}var s=e.memoizedState;if(s!==null&&(r=s.dehydrated,r!==null)){if(o)a.flags&256?(nt(a),a.flags&=-257,a=Jr(e,a,t)):a.memoizedState!==null?(rt(a),a.child=e.child,a.flags|=128,a=null):(rt(a),r=l.fallback,u=a.mode,l=yn({mode:"visible",children:l.children},u),r=Xt(r,u,t,null),r.flags|=2,l.return=a,r.return=a,l.sibling=r,a.child=l,Jt(a,e.child,null,t),l=a.child,l.memoizedState=Zr(t),l.childLanes=Qr(e,n,t),a.memoizedState=Yr,a=bu(null,l));else if(nt(a),ai(r)){if(n=r.nextSibling&&r.nextSibling.dataset,n)var i=n.dgst;n=i,l=Error(S(419)),l.stack="",l.digest=n,Fu({value:l,source:null,stack:null}),a=Jr(e,a,t)}else if(me||Jl(e,a,t,!1),n=(t&e.childLanes)!==0,me||n){if(n=Y,n!==null&&(l=qc(n,t),l!==0&&l!==s.retryLane))throw s.retryLane=l,ll(e,l),_e(n,e,l),Ni;ei(r)||In(),a=Jr(e,a,t)}else ei(r)?(a.flags|=192,a.child=e.child,a=null):(e=s.treeContext,ae=fa(r.nextSibling),ke=a,N=!0,gt=null,ia=!1,e!==null&&fm(a,e),a=Fs(a,l.children),a.flags|=4096);return a}return u?(rt(a),r=l.fallback,u=a.mode,s=e.child,i=s.sibling,l=Ga(s,{mode:"hidden",children:l.children}),l.subtreeFlags=s.subtreeFlags&65011712,i!==null?r=Ga(i,r):(r=Xt(r,u,t,null),r.flags|=2),r.return=a,l.return=a,l.sibling=r,a.child=l,bu(null,l),l=a.child,r=e.child.memoizedState,r===null?r=Zr(t):(u=r.cachePool,u!==null?(s=ce._currentValue,u=u.parent!==s?{parent:s,pool:s}:u):u=mm(),r={baseLanes:r.baseLanes|t,cachePool:u}),l.memoizedState=r,l.childLanes=Qr(e,n,t),a.memoizedState=Yr,bu(e.child,l)):(nt(a),t=e.child,e=t.sibling,t=Ga(t,{mode:"visible",children:l.children}),t.return=a,t.sibling=null,e!==null&&(n=a.deletions,n===null?(a.deletions=[e],a.flags|=16):n.push(e)),a.child=t,a.memoizedState=null,t)}function Fs(e,a){return a=yn({mode:"visible",children:a},e.mode),a.return=e,e.child=a}function yn(e,a){return e=je(22,e,null,a),e.lanes=0,e}function Jr(e,a,t){return Jt(a,e.child,null,t),e=Fs(a,a.pendingProps.children),e.flags|=2,a.memoizedState=null,e}function Vf(e,a,t){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a),Ms(e.return,a,t)}function Wr(e,a,t,l,u,o){var n=e.memoizedState;n===null?e.memoizedState={isBackwards:a,rendering:null,renderingStartTime:0,last:l,tail:t,tailMode:u,treeForkCount:o}:(n.isBackwards=a,n.rendering=null,n.renderingStartTime=0,n.last=l,n.tail=t,n.tailMode=u,n.treeForkCount=o)}function np(e,a,t){var l=a.pendingProps,u=l.revealOrder,o=l.tail;l=l.children;var n=se.current,r=(n&2)!==0;if(r?(n=n&1|2,a.flags|=128):n&=1,Z(se,n),ve(e,a,l,t),l=N?Pu:0,!r&&e!==null&&(e.flags&128)!==0)e:for(e=a.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Vf(e,t,a);else if(e.tag===19)Vf(e,t,a);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===a)break e;for(;e.sibling===null;){if(e.return===null||e.return===a)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(t=a.child,u=null;t!==null;)e=t.alternate,e!==null&&hn(e)===null&&(u=t),t=t.sibling;t=u,t===null?(u=a.child,a.child=null):(u=t.sibling,t.sibling=null),Wr(a,!1,u,t,o,l);break;case"backwards":case"unstable_legacy-backwards":for(t=null,u=a.child,a.child=null;u!==null;){if(e=u.alternate,e!==null&&hn(e)===null){a.child=u;break}e=u.sibling,u.sibling=t,t=u,u=e}Wr(a,!0,t,null,o,l);break;case"together":Wr(a,!1,null,null,void 0,l);break;default:a.memoizedState=null}return a.child}function Za(e,a,t){if(e!==null&&(a.dependencies=e.dependencies),At|=a.lanes,(t&a.childLanes)===0)if(e!==null){if(Jl(e,a,t,!1),(t&a.childLanes)===0)return null}else return null;if(e!==null&&a.child!==e.child)throw Error(S(153));if(a.child!==null){for(e=a.child,t=Ga(e,e.pendingProps),a.child=t,t.return=a;e.sibling!==null;)e=e.sibling,t=t.sibling=Ga(e,e.pendingProps),t.return=a;t.sibling=null}return a.child}function Pi(e,a){return(e.lanes&a)!==0?!0:(e=e.dependencies,!!(e!==null&&mn(e)))}function OL(e,a,t){switch(a.tag){case 3:on(a,a.stateNode.containerInfo),ot(a,ce,e.memoizedState.cache),Zt();break;case 27:case 5:hs(a);break;case 4:on(a,a.stateNode.containerInfo);break;case 10:ot(a,a.type,a.memoizedProps.value);break;case 31:if(a.memoizedState!==null)return a.flags|=128,qs(a),null;break;case 13:var l=a.memoizedState;if(l!==null)return l.dehydrated!==null?(nt(a),a.flags|=128,null):(t&a.child.childLanes)!==0?op(e,a,t):(nt(a),e=Za(e,a,t),e!==null?e.sibling:null);nt(a);break;case 19:var u=(e.flags&128)!==0;if(l=(t&a.childLanes)!==0,l||(Jl(e,a,t,!1),l=(t&a.childLanes)!==0),u){if(l)return np(e,a,t);a.flags|=128}if(u=a.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),Z(se,se.current),l)break;return null;case 22:return a.lanes=0,up(e,a,t,a.pendingProps);case 24:ot(a,ce,e.memoizedState.cache)}return Za(e,a,t)}function rp(e,a,t){if(e!==null)if(e.memoizedProps!==a.pendingProps)me=!0;else{if(!Pi(e,t)&&(a.flags&128)===0)return me=!1,OL(e,a,t);me=(e.flags&131072)!==0}else me=!1,N&&(a.flags&1048576)!==0&&dm(a,Pu,a.index);switch(a.lanes=0,a.tag){case 16:e:{var l=a.pendingProps;if(e=Ft(a.elementType),a.type=e,typeof e=="function")Si(e)?(l=$t(e,l),a.tag=1,a=Ff(null,a,e,l,t)):(a.tag=0,a=Ps(null,a,e,l,t));else{if(e!=null){var u=e.$$typeof;if(u===oi){a.tag=11,a=Uf(null,a,e,l,t);break e}else if(u===ni){a.tag=14,a=zf(null,a,e,l,t);break e}}throw a=ps(e)||e,Error(S(306,a,""))}}return a;case 0:return Ps(e,a,a.type,a.pendingProps,t);case 1:return l=a.type,u=$t(l,a.pendingProps),Ff(e,a,l,u,t);case 3:e:{if(on(a,a.stateNode.containerInfo),e===null)throw Error(S(387));l=a.pendingProps;var o=a.memoizedState;u=o.element,Bs(e,a),Du(a,l,null,t);var n=a.memoizedState;if(l=n.cache,ot(a,ce,l),l!==o.cache&&Ds(a,[ce],t,!0),Mu(),l=n.element,o.isDehydrated)if(o={element:l,isDehydrated:!1,cache:n.cache},a.updateQueue.baseState=o,a.memoizedState=o,a.flags&256){a=Gf(e,a,l,t);break e}else if(l!==u){u=sa(Error(S(424)),a),Fu(u),a=Gf(e,a,l,t);break e}else for(e=a.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,ae=fa(e.firstChild),ke=a,N=!0,gt=null,ia=!0,t=hm(a,null,l,t),a.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Zt(),l===u){a=Za(e,a,t);break e}ve(e,a,l,t)}a=a.child}return a;case 26:return Wo(e,a),e===null?(t=cc(a.type,null,a.pendingProps,null))?a.memoizedState=t:N||(t=a.type,e=a.pendingProps,l=wn(pt.current).createElement(t),l[Ie]=a,l[Ne]=e,Te(l,t,e),ye(l),a.stateNode=l):a.memoizedState=cc(a.type,e.memoizedProps,a.pendingProps,e.memoizedState),null;case 27:return hs(a),e===null&&N&&(l=a.stateNode=Jp(a.type,a.pendingProps,pt.current),ke=a,ia=!0,u=ae,wt(a.type)?(ti=u,ae=fa(l.firstChild)):ae=u),ve(e,a,a.pendingProps.children,t),Wo(e,a),e===null&&(a.flags|=4194304),a.child;case 5:return e===null&&N&&((u=l=ae)&&(l=sS(l,a.type,a.pendingProps,ia),l!==null?(a.stateNode=l,ke=a,ae=fa(l.firstChild),ia=!1,u=!0):u=!1),u||It(a)),hs(a),u=a.type,o=a.pendingProps,n=e!==null?e.memoizedProps:null,l=o.children,Ws(u,o)?l=null:n!==null&&Ws(u,n)&&(a.flags|=32),a.memoizedState!==null&&(u=wi(e,a,kL,null,null,t),Yu._currentValue=u),Wo(e,a),ve(e,a,l,t),a.child;case 6:return e===null&&N&&((e=t=ae)&&(t=iS(t,a.pendingProps,ia),t!==null?(a.stateNode=t,ke=a,ae=null,e=!0):e=!1),e||It(a)),null;case 13:return op(e,a,t);case 4:return on(a,a.stateNode.containerInfo),l=a.pendingProps,e===null?a.child=Jt(a,null,l,t):ve(e,a,l,t),a.child;case 11:return Uf(e,a,a.type,a.pendingProps,t);case 7:return ve(e,a,a.pendingProps,t),a.child;case 8:return ve(e,a,a.pendingProps.children,t),a.child;case 12:return ve(e,a,a.pendingProps.children,t),a.child;case 10:return l=a.pendingProps,ot(a,a.type,l.value),ve(e,a,l.children,t),a.child;case 9:return u=a.type._context,l=a.pendingProps.children,Qt(a),u=Ae(u),l=l(u),a.flags|=1,ve(e,a,l,t),a.child;case 14:return zf(e,a,a.type,a.pendingProps,t);case 15:return lp(e,a,a.type,a.pendingProps,t);case 19:return np(e,a,t);case 31:return EL(e,a,t);case 22:return up(e,a,t,a.pendingProps);case 24:return Qt(a),l=Ae(ce),e===null?(u=vi(),u===null&&(u=Y,o=bi(),u.pooledCache=o,o.refCount++,o!==null&&(u.pooledCacheLanes|=t),u=o),a.memoizedState={parent:l,cache:u},ki(a),ot(a,ce,u)):((e.lanes&t)!==0&&(Bs(e,a),Du(a,null,null,t),Mu()),u=e.memoizedState,o=a.memoizedState,u.parent!==l?(u={parent:l,cache:l},a.memoizedState=u,a.lanes===0&&(a.memoizedState=a.updateQueue.baseState=u),ot(a,ce,l)):(l=o.cache,ot(a,ce,l),l!==u.cache&&Ds(a,[ce],t,!0))),ve(e,a,a.pendingProps.children,t),a.child;case 29:throw a.pendingProps}throw Error(S(156,a.tag))}function Oa(e){e.flags|=4}function $r(e,a,t,l,u){if((a=(e.mode&32)!==0)&&(a=!1),a){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(Rp())e.flags|=8192;else throw Kt=pn,Ii}else e.flags&=-16777217}function Xf(e,a){if(a.type!=="stylesheet"||(a.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!eg(a))if(Rp())e.flags|=8192;else throw Kt=pn,Ii}function Ho(e,a){a!==null&&(e.flags|=4),e.flags&16384&&(a=e.tag!==22?Bc():536870912,e.lanes|=a,Vl|=a)}function gu(e,a){if(!N)switch(e.tailMode){case"hidden":a=e.tail;for(var t=null;a!==null;)a.alternate!==null&&(t=a),a=a.sibling;t===null?e.tail=null:t.sibling=null;break;case"collapsed":t=e.tail;for(var l=null;t!==null;)t.alternate!==null&&(l=t),t=t.sibling;l===null?a||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function ee(e){var a=e.alternate!==null&&e.alternate.child===e.child,t=0,l=0;if(a)for(var u=e.child;u!==null;)t|=u.lanes|u.childLanes,l|=u.subtreeFlags&65011712,l|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)t|=u.lanes|u.childLanes,l|=u.subtreeFlags,l|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=l,e.childLanes=t,a}function qL(e,a,t){var l=a.pendingProps;switch(Ci(a),a.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ee(a),null;case 1:return ee(a),null;case 3:return t=a.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),a.memoizedState.cache!==l&&(a.flags|=2048),Va(ce),zl(),t.pendingContext&&(t.context=t.pendingContext,t.pendingContext=null),(e===null||e.child===null)&&(gl(a)?Oa(a):e===null||e.memoizedState.isDehydrated&&(a.flags&256)===0||(a.flags|=1024,Vr())),ee(a),null;case 26:var u=a.type,o=a.memoizedState;return e===null?(Oa(a),o!==null?(ee(a),Xf(a,o)):(ee(a),$r(a,u,null,l,t))):o?o!==e.memoizedState?(Oa(a),ee(a),Xf(a,o)):(ee(a),a.flags&=-16777217):(e=e.memoizedProps,e!==l&&Oa(a),ee(a),$r(a,u,e,l,t)),null;case 27:if(nn(a),t=pt.current,u=a.type,e!==null&&a.stateNode!=null)e.memoizedProps!==l&&Oa(a);else{if(!l){if(a.stateNode===null)throw Error(S(166));return ee(a),null}e=wa.current,gl(a)?yf(a,e):(e=Jp(u,l,t),a.stateNode=e,Oa(a))}return ee(a),null;case 5:if(nn(a),u=a.type,e!==null&&a.stateNode!=null)e.memoizedProps!==l&&Oa(a);else{if(!l){if(a.stateNode===null)throw Error(S(166));return ee(a),null}if(o=wa.current,gl(a))yf(a,o);else{var n=wn(pt.current);switch(o){case 1:o=n.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:o=n.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":o=n.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":o=n.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":o=n.createElement("div"),o.innerHTML="<script><\/script>",o=o.removeChild(o.firstChild);break;case"select":o=typeof l.is=="string"?n.createElement("select",{is:l.is}):n.createElement("select"),l.multiple?o.multiple=!0:l.size&&(o.size=l.size);break;default:o=typeof l.is=="string"?n.createElement(u,{is:l.is}):n.createElement(u)}}o[Ie]=a,o[Ne]=l;e:for(n=a.child;n!==null;){if(n.tag===5||n.tag===6)o.appendChild(n.stateNode);else if(n.tag!==4&&n.tag!==27&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===a)break e;for(;n.sibling===null;){if(n.return===null||n.return===a)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}a.stateNode=o;e:switch(Te(o,u,l),u){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&Oa(a)}}return ee(a),$r(a,a.type,e===null?null:e.memoizedProps,a.pendingProps,t),null;case 6:if(e&&a.stateNode!=null)e.memoizedProps!==l&&Oa(a);else{if(typeof l!="string"&&a.stateNode===null)throw Error(S(166));if(e=pt.current,gl(a)){if(e=a.stateNode,t=a.memoizedProps,l=null,u=ke,u!==null)switch(u.tag){case 27:case 5:l=u.memoizedProps}e[Ie]=a,e=!!(e.nodeValue===t||l!==null&&l.suppressHydrationWarning===!0||Kp(e.nodeValue,t)),e||It(a,!0)}else e=wn(e).createTextNode(l),e[Ie]=a,a.stateNode=e}return ee(a),null;case 31:if(t=a.memoizedState,e===null||e.memoizedState!==null){if(l=gl(a),t!==null){if(e===null){if(!l)throw Error(S(318));if(e=a.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(S(557));e[Ie]=a}else Zt(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;ee(a),e=!1}else t=Vr(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=t),e=!0;if(!e)return a.flags&256?(Xe(a),a):(Xe(a),null);if((a.flags&128)!==0)throw Error(S(558))}return ee(a),null;case 13:if(l=a.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=gl(a),l!==null&&l.dehydrated!==null){if(e===null){if(!u)throw Error(S(318));if(u=a.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(S(317));u[Ie]=a}else Zt(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;ee(a),u=!1}else u=Vr(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return a.flags&256?(Xe(a),a):(Xe(a),null)}return Xe(a),(a.flags&128)!==0?(a.lanes=t,a):(t=l!==null,e=e!==null&&e.memoizedState!==null,t&&(l=a.child,u=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(u=l.alternate.memoizedState.cachePool.pool),o=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(o=l.memoizedState.cachePool.pool),o!==u&&(l.flags|=2048)),t!==e&&t&&(a.child.flags|=8192),Ho(a,a.updateQueue),ee(a),null);case 4:return zl(),e===null&&Yi(a.stateNode.containerInfo),ee(a),null;case 10:return Va(a.type),ee(a),null;case 19:if(Ce(se),l=a.memoizedState,l===null)return ee(a),null;if(u=(a.flags&128)!==0,o=l.rendering,o===null)if(u)gu(l,!1);else{if(re!==0||e!==null&&(e.flags&128)!==0)for(e=a.child;e!==null;){if(o=hn(e),o!==null){for(a.flags|=128,gu(l,!1),e=o.updateQueue,a.updateQueue=e,Ho(a,e),a.subtreeFlags=0,e=t,t=a.child;t!==null;)sm(t,e),t=t.sibling;return Z(se,se.current&1|2),N&&za(a,l.treeForkCount),a.child}e=e.sibling}l.tail!==null&&Ye()>bn&&(a.flags|=128,u=!0,gu(l,!1),a.lanes=4194304)}else{if(!u)if(e=hn(o),e!==null){if(a.flags|=128,u=!0,e=e.updateQueue,a.updateQueue=e,Ho(a,e),gu(l,!0),l.tail===null&&l.tailMode==="hidden"&&!o.alternate&&!N)return ee(a),null}else 2*Ye()-l.renderingStartTime>bn&&t!==536870912&&(a.flags|=128,u=!0,gu(l,!1),a.lanes=4194304);l.isBackwards?(o.sibling=a.child,a.child=o):(e=l.last,e!==null?e.sibling=o:a.child=o,l.last=o)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Ye(),e.sibling=null,t=se.current,Z(se,u?t&1|2:t&1),N&&za(a,l.treeForkCount),e):(ee(a),null);case 22:case 23:return Xe(a),Ai(),l=a.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(a.flags|=8192):l&&(a.flags|=8192),l?(t&536870912)!==0&&(a.flags&128)===0&&(ee(a),a.subtreeFlags&6&&(a.flags|=8192)):ee(a),t=a.updateQueue,t!==null&&Ho(a,t.retryQueue),t=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),l=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(l=a.memoizedState.cachePool.pool),l!==t&&(a.flags|=2048),e!==null&&Ce(jt),null;case 24:return t=null,e!==null&&(t=e.memoizedState.cache),a.memoizedState.cache!==t&&(a.flags|=2048),Va(ce),ee(a),null;case 25:return null;case 30:return null}throw Error(S(156,a.tag))}function HL(e,a){switch(Ci(a),a.tag){case 1:return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 3:return Va(ce),zl(),e=a.flags,(e&65536)!==0&&(e&128)===0?(a.flags=e&-65537|128,a):null;case 26:case 27:case 5:return nn(a),null;case 31:if(a.memoizedState!==null){if(Xe(a),a.alternate===null)throw Error(S(340));Zt()}return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 13:if(Xe(a),e=a.memoizedState,e!==null&&e.dehydrated!==null){if(a.alternate===null)throw Error(S(340));Zt()}return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 19:return Ce(se),null;case 4:return zl(),null;case 10:return Va(a.type),null;case 22:case 23:return Xe(a),Ai(),e!==null&&Ce(jt),e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 24:return Va(ce),null;case 25:return null;default:return null}}function sp(e,a){switch(Ci(a),a.tag){case 3:Va(ce),zl();break;case 26:case 27:case 5:nn(a);break;case 4:zl();break;case 31:a.memoizedState!==null&&Xe(a);break;case 13:Xe(a);break;case 19:Ce(se);break;case 10:Va(a.type);break;case 22:case 23:Xe(a),Ai(),e!==null&&Ce(jt);break;case 24:Va(ce)}}function oo(e,a){try{var t=a.updateQueue,l=t!==null?t.lastEffect:null;if(l!==null){var u=l.next;t=u;do{if((t.tag&e)===e){l=void 0;var o=t.create,n=t.inst;l=o(),n.destroy=l}t=t.next}while(t!==u)}}catch(r){X(a,a.return,r)}}function kt(e,a,t){try{var l=a.updateQueue,u=l!==null?l.lastEffect:null;if(u!==null){var o=u.next;l=o;do{if((l.tag&e)===e){var n=l.inst,r=n.destroy;if(r!==void 0){n.destroy=void 0,u=a;var s=t,i=r;try{i()}catch(p){X(u,s,p)}}}l=l.next}while(l!==o)}}catch(p){X(a,a.return,p)}}function ip(e){var a=e.updateQueue;if(a!==null){var t=e.stateNode;try{Lm(a,t)}catch(l){X(e,e.return,l)}}}function dp(e,a,t){t.props=$t(e.type,e.memoizedProps),t.state=e.memoizedState;try{t.componentWillUnmount()}catch(l){X(e,a,l)}}function Bu(e,a){try{var t=e.ref;if(t!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof t=="function"?e.refCleanup=t(l):t.current=l}}catch(u){X(e,a,u)}}function Ta(e,a){var t=e.ref,l=e.refCleanup;if(t!==null)if(typeof l=="function")try{l()}catch(u){X(e,a,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof t=="function")try{t(null)}catch(u){X(e,a,u)}else t.current=null}function fp(e){var a=e.type,t=e.memoizedProps,l=e.stateNode;try{e:switch(a){case"button":case"input":case"select":case"textarea":t.autoFocus&&l.focus();break e;case"img":t.src?l.src=t.src:t.srcSet&&(l.srcset=t.srcSet)}}catch(u){X(e,e.return,u)}}function es(e,a,t){try{var l=e.stateNode;tS(l,e.type,t,a),l[Ne]=a}catch(u){X(e,e.return,u)}}function cp(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&wt(e.type)||e.tag===4}function as(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||cp(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&wt(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Gs(e,a,t){var l=e.tag;if(l===5||l===6)e=e.stateNode,a?(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t).insertBefore(e,a):(a=t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.appendChild(e),t=t._reactRootContainer,t!=null||a.onclick!==null||(a.onclick=Pa));else if(l!==4&&(l===27&&wt(e.type)&&(t=e.stateNode,a=null),e=e.child,e!==null))for(Gs(e,a,t),e=e.sibling;e!==null;)Gs(e,a,t),e=e.sibling}function Cn(e,a,t){var l=e.tag;if(l===5||l===6)e=e.stateNode,a?t.insertBefore(e,a):t.appendChild(e);else if(l!==4&&(l===27&&wt(e.type)&&(t=e.stateNode),e=e.child,e!==null))for(Cn(e,a,t),e=e.sibling;e!==null;)Cn(e,a,t),e=e.sibling}function mp(e){var a=e.stateNode,t=e.memoizedProps;try{for(var l=e.type,u=a.attributes;u.length;)a.removeAttributeNode(u[0]);Te(a,l,t),a[Ie]=e,a[Ne]=t}catch(o){X(e,e.return,o)}}var _a=!1,fe=!1,ts=!1,jf=typeof WeakSet=="function"?WeakSet:Set,Se=null;function UL(e,a){if(e=e.containerInfo,Qs=Bn,e=em(e),hi(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{t=(t=e.ownerDocument)&&t.defaultView||window;var l=t.getSelection&&t.getSelection();if(l&&l.rangeCount!==0){t=l.anchorNode;var u=l.anchorOffset,o=l.focusNode;l=l.focusOffset;try{t.nodeType,o.nodeType}catch{t=null;break e}var n=0,r=-1,s=-1,i=0,p=0,g=e,c=null;a:for(;;){for(var m;g!==t||u!==0&&g.nodeType!==3||(r=n+u),g!==o||l!==0&&g.nodeType!==3||(s=n+l),g.nodeType===3&&(n+=g.nodeValue.length),(m=g.firstChild)!==null;)c=g,g=m;for(;;){if(g===e)break a;if(c===t&&++i===u&&(r=n),c===o&&++p===l&&(s=n),(m=g.nextSibling)!==null)break;g=c,c=g.parentNode}g=m}t=r===-1||s===-1?null:{start:r,end:s}}else t=null}t=t||{start:0,end:0}}else t=null;for(Js={focusedElem:e,selectionRange:t},Bn=!1,Se=a;Se!==null;)if(a=Se,e=a.child,(a.subtreeFlags&1028)!==0&&e!==null)e.return=a,Se=e;else for(;Se!==null;){switch(a=Se,o=a.alternate,e=a.flags,a.tag){case 0:if((e&4)!==0&&(e=a.updateQueue,e=e!==null?e.events:null,e!==null))for(t=0;t<e.length;t++)u=e[t],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&o!==null){e=void 0,t=a,u=o.memoizedProps,o=o.memoizedState,l=t.stateNode;try{var L=$t(t.type,u);e=l.getSnapshotBeforeUpdate(L,o),l.__reactInternalSnapshotBeforeUpdate=e}catch(y){X(t,t.return,y)}}break;case 3:if((e&1024)!==0){if(e=a.stateNode.containerInfo,t=e.nodeType,t===9)$s(e);else if(t===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":$s(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(S(163))}if(e=a.sibling,e!==null){e.return=a.return,Se=e;break}Se=a.return}}function pp(e,a,t){var l=t.flags;switch(t.tag){case 0:case 11:case 15:Ha(e,t),l&4&&oo(5,t);break;case 1:if(Ha(e,t),l&4)if(e=t.stateNode,a===null)try{e.componentDidMount()}catch(n){X(t,t.return,n)}else{var u=$t(t.type,a.memoizedProps);a=a.memoizedState;try{e.componentDidUpdate(u,a,e.__reactInternalSnapshotBeforeUpdate)}catch(n){X(t,t.return,n)}}l&64&&ip(t),l&512&&Bu(t,t.return);break;case 3:if(Ha(e,t),l&64&&(e=t.updateQueue,e!==null)){if(a=null,t.child!==null)switch(t.child.tag){case 27:case 5:a=t.child.stateNode;break;case 1:a=t.child.stateNode}try{Lm(e,a)}catch(n){X(t,t.return,n)}}break;case 27:a===null&&l&4&&mp(t);case 26:case 5:Ha(e,t),a===null&&l&4&&fp(t),l&512&&Bu(t,t.return);break;case 12:Ha(e,t);break;case 31:Ha(e,t),l&4&&xp(e,t);break;case 13:Ha(e,t),l&4&&Lp(e,t),l&64&&(e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(t=jL.bind(null,t),dS(e,t))));break;case 22:if(l=t.memoizedState!==null||_a,!l){a=a!==null&&a.memoizedState!==null||fe,u=_a;var o=fe;_a=l,(fe=a)&&!o?Ua(e,t,(t.subtreeFlags&8772)!==0):Ha(e,t),_a=u,fe=o}break;case 30:break;default:Ha(e,t)}}function gp(e){var a=e.alternate;a!==null&&(e.alternate=null,gp(a)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(a=e.stateNode,a!==null&&di(a)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var ue=null,Ue=!1;function qa(e,a,t){for(t=t.child;t!==null;)hp(e,a,t),t=t.sibling}function hp(e,a,t){if(Ze&&typeof Ze.onCommitFiberUnmount=="function")try{Ze.onCommitFiberUnmount(Wu,t)}catch{}switch(t.tag){case 26:fe||Ta(t,a),qa(e,a,t),t.memoizedState?t.memoizedState.count--:t.stateNode&&(t=t.stateNode,t.parentNode.removeChild(t));break;case 27:fe||Ta(t,a);var l=ue,u=Ue;wt(t.type)&&(ue=t.stateNode,Ue=!1),qa(e,a,t),Hu(t.stateNode),ue=l,Ue=u;break;case 5:fe||Ta(t,a);case 6:if(l=ue,u=Ue,ue=null,qa(e,a,t),ue=l,Ue=u,ue!==null)if(Ue)try{(ue.nodeType===9?ue.body:ue.nodeName==="HTML"?ue.ownerDocument.body:ue).removeChild(t.stateNode)}catch(o){X(t,a,o)}else try{ue.removeChild(t.stateNode)}catch(o){X(t,a,o)}break;case 18:ue!==null&&(Ue?(e=ue,rc(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,t.stateNode),Yl(e)):rc(ue,t.stateNode));break;case 4:l=ue,u=Ue,ue=t.stateNode.containerInfo,Ue=!0,qa(e,a,t),ue=l,Ue=u;break;case 0:case 11:case 14:case 15:kt(2,t,a),fe||kt(4,t,a),qa(e,a,t);break;case 1:fe||(Ta(t,a),l=t.stateNode,typeof l.componentWillUnmount=="function"&&dp(t,a,l)),qa(e,a,t);break;case 21:qa(e,a,t);break;case 22:fe=(l=fe)||t.memoizedState!==null,qa(e,a,t),fe=l;break;default:qa(e,a,t)}}function xp(e,a){if(a.memoizedState===null&&(e=a.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Yl(e)}catch(t){X(a,a.return,t)}}}function Lp(e,a){if(a.memoizedState===null&&(e=a.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Yl(e)}catch(t){X(a,a.return,t)}}function zL(e){switch(e.tag){case 31:case 13:case 19:var a=e.stateNode;return a===null&&(a=e.stateNode=new jf),a;case 22:return e=e.stateNode,a=e._retryCache,a===null&&(a=e._retryCache=new jf),a;default:throw Error(S(435,e.tag))}}function Uo(e,a){var t=zL(e);a.forEach(function(l){if(!t.has(l)){t.add(l);var u=KL.bind(null,e,l);l.then(u,u)}})}function qe(e,a){var t=a.deletions;if(t!==null)for(var l=0;l<t.length;l++){var u=t[l],o=e,n=a,r=n;e:for(;r!==null;){switch(r.tag){case 27:if(wt(r.type)){ue=r.stateNode,Ue=!1;break e}break;case 5:ue=r.stateNode,Ue=!1;break e;case 3:case 4:ue=r.stateNode.containerInfo,Ue=!0;break e}r=r.return}if(ue===null)throw Error(S(160));hp(o,n,u),ue=null,Ue=!1,o=u.alternate,o!==null&&(o.return=null),u.return=null}if(a.subtreeFlags&13886)for(a=a.child;a!==null;)Sp(a,e),a=a.sibling}var La=null;function Sp(e,a){var t=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:qe(a,e),He(e),l&4&&(kt(3,e,e.return),oo(3,e),kt(5,e,e.return));break;case 1:qe(a,e),He(e),l&512&&(fe||t===null||Ta(t,t.return)),l&64&&_a&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(t=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=t===null?l:t.concat(l))));break;case 26:var u=La;if(qe(a,e),He(e),l&512&&(fe||t===null||Ta(t,t.return)),l&4){var o=t!==null?t.memoizedState:null;if(l=e.memoizedState,t===null)if(l===null)if(e.stateNode===null){e:{l=e.type,t=e.memoizedProps,u=u.ownerDocument||u;a:switch(l){case"title":o=u.getElementsByTagName("title")[0],(!o||o[ao]||o[Ie]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=u.createElement(l),u.head.insertBefore(o,u.querySelector("head > title"))),Te(o,l,t),o[Ie]=e,ye(o),l=o;break e;case"link":var n=pc("link","href",u).get(l+(t.href||""));if(n){for(var r=0;r<n.length;r++)if(o=n[r],o.getAttribute("href")===(t.href==null||t.href===""?null:t.href)&&o.getAttribute("rel")===(t.rel==null?null:t.rel)&&o.getAttribute("title")===(t.title==null?null:t.title)&&o.getAttribute("crossorigin")===(t.crossOrigin==null?null:t.crossOrigin)){n.splice(r,1);break a}}o=u.createElement(l),Te(o,l,t),u.head.appendChild(o);break;case"meta":if(n=pc("meta","content",u).get(l+(t.content||""))){for(r=0;r<n.length;r++)if(o=n[r],o.getAttribute("content")===(t.content==null?null:""+t.content)&&o.getAttribute("name")===(t.name==null?null:t.name)&&o.getAttribute("property")===(t.property==null?null:t.property)&&o.getAttribute("http-equiv")===(t.httpEquiv==null?null:t.httpEquiv)&&o.getAttribute("charset")===(t.charSet==null?null:t.charSet)){n.splice(r,1);break a}}o=u.createElement(l),Te(o,l,t),u.head.appendChild(o);break;default:throw Error(S(468,l))}o[Ie]=e,ye(o),l=o}e.stateNode=l}else gc(u,e.type,e.stateNode);else e.stateNode=mc(u,l,e.memoizedProps);else o!==l?(o===null?t.stateNode!==null&&(t=t.stateNode,t.parentNode.removeChild(t)):o.count--,l===null?gc(u,e.type,e.stateNode):mc(u,l,e.memoizedProps)):l===null&&e.stateNode!==null&&es(e,e.memoizedProps,t.memoizedProps)}break;case 27:qe(a,e),He(e),l&512&&(fe||t===null||Ta(t,t.return)),t!==null&&l&4&&es(e,e.memoizedProps,t.memoizedProps);break;case 5:if(qe(a,e),He(e),l&512&&(fe||t===null||Ta(t,t.return)),e.flags&32){u=e.stateNode;try{Nl(u,"")}catch(L){X(e,e.return,L)}}l&4&&e.stateNode!=null&&(u=e.memoizedProps,es(e,u,t!==null?t.memoizedProps:u)),l&1024&&(ts=!0);break;case 6:if(qe(a,e),He(e),l&4){if(e.stateNode===null)throw Error(S(162));l=e.memoizedProps,t=e.stateNode;try{t.nodeValue=l}catch(L){X(e,e.return,L)}}break;case 3:if(an=null,u=La,La=Mn(a.containerInfo),qe(a,e),La=u,He(e),l&4&&t!==null&&t.memoizedState.isDehydrated)try{Yl(a.containerInfo)}catch(L){X(e,e.return,L)}ts&&(ts=!1,yp(e));break;case 4:l=La,La=Mn(e.stateNode.containerInfo),qe(a,e),He(e),La=l;break;case 12:qe(a,e),He(e);break;case 31:qe(a,e),He(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Uo(e,l)));break;case 13:qe(a,e),He(e),e.child.flags&8192&&e.memoizedState!==null!=(t!==null&&t.memoizedState!==null)&&(Xn=Ye()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Uo(e,l)));break;case 22:u=e.memoizedState!==null;var s=t!==null&&t.memoizedState!==null,i=_a,p=fe;if(_a=i||u,fe=p||s,qe(a,e),fe=p,_a=i,He(e),l&8192)e:for(a=e.stateNode,a._visibility=u?a._visibility&-2:a._visibility|1,u&&(t===null||s||_a||fe||Gt(e)),t=null,a=e;;){if(a.tag===5||a.tag===26){if(t===null){s=t=a;try{if(o=s.stateNode,u)n=o.style,typeof n.setProperty=="function"?n.setProperty("display","none","important"):n.display="none";else{r=s.stateNode;var g=s.memoizedProps.style,c=g!=null&&g.hasOwnProperty("display")?g.display:null;r.style.display=c==null||typeof c=="boolean"?"":(""+c).trim()}}catch(L){X(s,s.return,L)}}}else if(a.tag===6){if(t===null){s=a;try{s.stateNode.nodeValue=u?"":s.memoizedProps}catch(L){X(s,s.return,L)}}}else if(a.tag===18){if(t===null){s=a;try{var m=s.stateNode;u?sc(m,!0):sc(s.stateNode,!1)}catch(L){X(s,s.return,L)}}}else if((a.tag!==22&&a.tag!==23||a.memoizedState===null||a===e)&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===e)break e;for(;a.sibling===null;){if(a.return===null||a.return===e)break e;t===a&&(t=null),a=a.return}t===a&&(t=null),a.sibling.return=a.return,a=a.sibling}l&4&&(l=e.updateQueue,l!==null&&(t=l.retryQueue,t!==null&&(l.retryQueue=null,Uo(e,t))));break;case 19:qe(a,e),He(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Uo(e,l)));break;case 30:break;case 21:break;default:qe(a,e),He(e)}}function He(e){var a=e.flags;if(a&2){try{for(var t,l=e.return;l!==null;){if(cp(l)){t=l;break}l=l.return}if(t==null)throw Error(S(160));switch(t.tag){case 27:var u=t.stateNode,o=as(e);Cn(e,o,u);break;case 5:var n=t.stateNode;t.flags&32&&(Nl(n,""),t.flags&=-33);var r=as(e);Cn(e,r,n);break;case 3:case 4:var s=t.stateNode.containerInfo,i=as(e);Gs(e,i,s);break;default:throw Error(S(161))}}catch(p){X(e,e.return,p)}e.flags&=-3}a&4096&&(e.flags&=-4097)}function yp(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var a=e;yp(a),a.tag===5&&a.flags&1024&&a.stateNode.reset(),e=e.sibling}}function Ha(e,a){if(a.subtreeFlags&8772)for(a=a.child;a!==null;)pp(e,a.alternate,a),a=a.sibling}function Gt(e){for(e=e.child;e!==null;){var a=e;switch(a.tag){case 0:case 11:case 14:case 15:kt(4,a,a.return),Gt(a);break;case 1:Ta(a,a.return);var t=a.stateNode;typeof t.componentWillUnmount=="function"&&dp(a,a.return,t),Gt(a);break;case 27:Hu(a.stateNode);case 26:case 5:Ta(a,a.return),Gt(a);break;case 22:a.memoizedState===null&&Gt(a);break;case 30:Gt(a);break;default:Gt(a)}e=e.sibling}}function Ua(e,a,t){for(t=t&&(a.subtreeFlags&8772)!==0,a=a.child;a!==null;){var l=a.alternate,u=e,o=a,n=o.flags;switch(o.tag){case 0:case 11:case 15:Ua(u,o,t),oo(4,o);break;case 1:if(Ua(u,o,t),l=o,u=l.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(i){X(l,l.return,i)}if(l=o,u=l.updateQueue,u!==null){var r=l.stateNode;try{var s=u.shared.hiddenCallbacks;if(s!==null)for(u.shared.hiddenCallbacks=null,u=0;u<s.length;u++)xm(s[u],r)}catch(i){X(l,l.return,i)}}t&&n&64&&ip(o),Bu(o,o.return);break;case 27:mp(o);case 26:case 5:Ua(u,o,t),t&&l===null&&n&4&&fp(o),Bu(o,o.return);break;case 12:Ua(u,o,t);break;case 31:Ua(u,o,t),t&&n&4&&xp(u,o);break;case 13:Ua(u,o,t),t&&n&4&&Lp(u,o);break;case 22:o.memoizedState===null&&Ua(u,o,t),Bu(o,o.return);break;case 30:break;default:Ua(u,o,t)}a=a.sibling}}function Fi(e,a){var t=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),e=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(e=a.memoizedState.cachePool.pool),e!==t&&(e!=null&&e.refCount++,t!=null&&lo(t))}function Gi(e,a){e=null,a.alternate!==null&&(e=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==e&&(a.refCount++,e!=null&&lo(e))}function xa(e,a,t,l){if(a.subtreeFlags&10256)for(a=a.child;a!==null;)Cp(e,a,t,l),a=a.sibling}function Cp(e,a,t,l){var u=a.flags;switch(a.tag){case 0:case 11:case 15:xa(e,a,t,l),u&2048&&oo(9,a);break;case 1:xa(e,a,t,l);break;case 3:xa(e,a,t,l),u&2048&&(e=null,a.alternate!==null&&(e=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==e&&(a.refCount++,e!=null&&lo(e)));break;case 12:if(u&2048){xa(e,a,t,l),e=a.stateNode;try{var o=a.memoizedProps,n=o.id,r=o.onPostCommit;typeof r=="function"&&r(n,a.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(s){X(a,a.return,s)}}else xa(e,a,t,l);break;case 31:xa(e,a,t,l);break;case 13:xa(e,a,t,l);break;case 23:break;case 22:o=a.stateNode,n=a.alternate,a.memoizedState!==null?o._visibility&2?xa(e,a,t,l):Eu(e,a):o._visibility&2?xa(e,a,t,l):(o._visibility|=2,xl(e,a,t,l,(a.subtreeFlags&10256)!==0||!1)),u&2048&&Fi(n,a);break;case 24:xa(e,a,t,l),u&2048&&Gi(a.alternate,a);break;default:xa(e,a,t,l)}}function xl(e,a,t,l,u){for(u=u&&((a.subtreeFlags&10256)!==0||!1),a=a.child;a!==null;){var o=e,n=a,r=t,s=l,i=n.flags;switch(n.tag){case 0:case 11:case 15:xl(o,n,r,s,u),oo(8,n);break;case 23:break;case 22:var p=n.stateNode;n.memoizedState!==null?p._visibility&2?xl(o,n,r,s,u):Eu(o,n):(p._visibility|=2,xl(o,n,r,s,u)),u&&i&2048&&Fi(n.alternate,n);break;case 24:xl(o,n,r,s,u),u&&i&2048&&Gi(n.alternate,n);break;default:xl(o,n,r,s,u)}a=a.sibling}}function Eu(e,a){if(a.subtreeFlags&10256)for(a=a.child;a!==null;){var t=e,l=a,u=l.flags;switch(l.tag){case 22:Eu(t,l),u&2048&&Fi(l.alternate,l);break;case 24:Eu(t,l),u&2048&&Gi(l.alternate,l);break;default:Eu(t,l)}a=a.sibling}}var vu=8192;function hl(e,a,t){if(e.subtreeFlags&vu)for(e=e.child;e!==null;)bp(e,a,t),e=e.sibling}function bp(e,a,t){switch(e.tag){case 26:hl(e,a,t),e.flags&vu&&e.memoizedState!==null&&bS(t,La,e.memoizedState,e.memoizedProps);break;case 5:hl(e,a,t);break;case 3:case 4:var l=La;La=Mn(e.stateNode.containerInfo),hl(e,a,t),La=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=vu,vu=16777216,hl(e,a,t),vu=l):hl(e,a,t));break;default:hl(e,a,t)}}function vp(e){var a=e.alternate;if(a!==null&&(e=a.child,e!==null)){a.child=null;do a=e.sibling,e.sibling=null,e=a;while(e!==null)}}function hu(e){var a=e.deletions;if((e.flags&16)!==0){if(a!==null)for(var t=0;t<a.length;t++){var l=a[t];Se=l,kp(l,e)}vp(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Ip(e),e=e.sibling}function Ip(e){switch(e.tag){case 0:case 11:case 15:hu(e),e.flags&2048&&kt(9,e,e.return);break;case 3:hu(e);break;case 12:hu(e);break;case 22:var a=e.stateNode;e.memoizedState!==null&&a._visibility&2&&(e.return===null||e.return.tag!==13)?(a._visibility&=-3,$o(e)):hu(e);break;default:hu(e)}}function $o(e){var a=e.deletions;if((e.flags&16)!==0){if(a!==null)for(var t=0;t<a.length;t++){var l=a[t];Se=l,kp(l,e)}vp(e)}for(e=e.child;e!==null;){switch(a=e,a.tag){case 0:case 11:case 15:kt(8,a,a.return),$o(a);break;case 22:t=a.stateNode,t._visibility&2&&(t._visibility&=-3,$o(a));break;default:$o(a)}e=e.sibling}}function kp(e,a){for(;Se!==null;){var t=Se;switch(t.tag){case 0:case 11:case 15:kt(8,t,a);break;case 23:case 22:if(t.memoizedState!==null&&t.memoizedState.cachePool!==null){var l=t.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:lo(t.memoizedState.cache)}if(l=t.child,l!==null)l.return=t,Se=l;else e:for(t=e;Se!==null;){l=Se;var u=l.sibling,o=l.return;if(gp(l),l===t){Se=null;break e}if(u!==null){u.return=o,Se=u;break e}Se=o}}}var _L={getCacheForType:function(e){var a=Ae(ce),t=a.data.get(e);return t===void 0&&(t=e(),a.data.set(e,t)),t},cacheSignal:function(){return Ae(ce).controller.signal}},NL=typeof WeakMap=="function"?WeakMap:Map,P=0,Y=null,z=null,_=0,V=0,Ve=null,ft=!1,$l=!1,Vi=!1,Qa=0,re=0,At=0,Yt=0,Xi=0,Ke=0,Vl=0,Ou=null,ze=null,Vs=!1,Xn=0,Ap=0,bn=1/0,vn=null,Lt=null,pe=0,St=null,Xl=null,Xa=0,Xs=0,js=null,Tp=null,qu=0,Ks=null;function Je(){return(P&2)!==0&&_!==0?_&-_:R.T!==null?Ki():Hc()}function wp(){if(Ke===0)if((_&536870912)===0||N){var e=To;To<<=1,(To&3932160)===0&&(To=262144),Ke=e}else Ke=536870912;return e=$e.current,e!==null&&(e.flags|=32),Ke}function _e(e,a,t){(e===Y&&(V===2||V===9)||e.cancelPendingCommit!==null)&&(jl(e,0),ct(e,_,Ke,!1)),eo(e,t),((P&2)===0||e!==Y)&&(e===Y&&((P&2)===0&&(Yt|=t),re===4&&ct(e,_,Ke,!1)),Da(e))}function Mp(e,a,t){if((P&6)!==0)throw Error(S(327));var l=!t&&(a&127)===0&&(a&e.expiredLanes)===0||$u(e,a),u=l?GL(e,a):ls(e,a,!0),o=l;do{if(u===0){$l&&!l&&ct(e,a,0,!1);break}else{if(t=e.current.alternate,o&&!PL(t)){u=ls(e,a,!1),o=!1;continue}if(u===2){if(o=a,e.errorRecoveryDisabledLanes&o)var n=0;else n=e.pendingLanes&-536870913,n=n!==0?n:n&536870912?536870912:0;if(n!==0){a=n;e:{var r=e;u=Ou;var s=r.current.memoizedState.isDehydrated;if(s&&(jl(r,n).flags|=256),n=ls(r,n,!1),n!==2){if(Vi&&!s){r.errorRecoveryDisabledLanes|=o,Yt|=o,u=4;break e}o=ze,ze=u,o!==null&&(ze===null?ze=o:ze.push.apply(ze,o))}u=n}if(o=!1,u!==2)continue}}if(u===1){jl(e,0),ct(e,a,0,!0);break}e:{switch(l=e,o=u,o){case 0:case 1:throw Error(S(345));case 4:if((a&4194048)!==a)break;case 6:ct(l,a,Ke,!ft);break e;case 2:ze=null;break;case 3:case 5:break;default:throw Error(S(329))}if((a&62914560)===a&&(u=Xn+300-Ye(),10<u)){if(ct(l,a,Ke,!ft),On(l,0,!0)!==0)break e;Xa=a,l.timeoutHandle=Zp(Kf.bind(null,l,t,ze,vn,Vs,a,Ke,Yt,Vl,ft,o,"Throttled",-0,0),u);break e}Kf(l,t,ze,vn,Vs,a,Ke,Yt,Vl,ft,o,null,-0,0)}}break}while(!0);Da(e)}function Kf(e,a,t,l,u,o,n,r,s,i,p,g,c,m){if(e.timeoutHandle=-1,g=a.subtreeFlags,g&8192||(g&16785408)===16785408){g={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Pa},bp(a,o,g);var L=(o&62914560)===o?Xn-Ye():(o&4194048)===o?Ap-Ye():0;if(L=vS(g,L),L!==null){Xa=o,e.cancelPendingCommit=L(Zf.bind(null,e,a,o,t,l,u,n,r,s,p,g,null,c,m)),ct(e,o,n,!i);return}}Zf(e,a,o,t,l,u,n,r,s)}function PL(e){for(var a=e;;){var t=a.tag;if((t===0||t===11||t===15)&&a.flags&16384&&(t=a.updateQueue,t!==null&&(t=t.stores,t!==null)))for(var l=0;l<t.length;l++){var u=t[l],o=u.getSnapshot;u=u.value;try{if(!We(o(),u))return!1}catch{return!1}}if(t=a.child,a.subtreeFlags&16384&&t!==null)t.return=a,a=t;else{if(a===e)break;for(;a.sibling===null;){if(a.return===null||a.return===e)return!0;a=a.return}a.sibling.return=a.return,a=a.sibling}}return!0}function ct(e,a,t,l){a&=~Xi,a&=~Yt,e.suspendedLanes|=a,e.pingedLanes&=~a,l&&(e.warmLanes|=a),l=e.expirationTimes;for(var u=a;0<u;){var o=31-Qe(u),n=1<<o;l[o]=-1,u&=~n}t!==0&&Ec(e,t,a)}function jn(){return(P&6)===0?(no(0,!1),!1):!0}function ji(){if(z!==null){if(V===0)var e=z.return;else e=z,Fa=ul=null,Ri(e),ql=null,Gu=0,e=z;for(;e!==null;)sp(e.alternate,e),e=e.return;z=null}}function jl(e,a){var t=e.timeoutHandle;t!==-1&&(e.timeoutHandle=-1,oS(t)),t=e.cancelPendingCommit,t!==null&&(e.cancelPendingCommit=null,t()),Xa=0,ji(),Y=e,z=t=Ga(e.current,null),_=a,V=0,Ve=null,ft=!1,$l=$u(e,a),Vi=!1,Vl=Ke=Xi=Yt=At=re=0,ze=Ou=null,Vs=!1,(a&8)!==0&&(a|=a&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=a;0<l;){var u=31-Qe(l),o=1<<u;a|=e[u],l&=~o}return Qa=a,zn(),t}function Dp(e,a){O=null,R.H=Xu,a===Wl||a===Nn?(a=kf(),V=3):a===Ii?(a=kf(),V=4):V=a===Ni?8:a!==null&&typeof a=="object"&&typeof a.then=="function"?6:1,Ve=a,z===null&&(re=1,Sn(e,sa(a,e.current)))}function Rp(){var e=$e.current;return e===null?!0:(_&4194048)===_?da===null:(_&62914560)===_||(_&536870912)!==0?e===da:!1}function Bp(){var e=R.H;return R.H=Xu,e===null?Xu:e}function Ep(){var e=R.A;return R.A=_L,e}function In(){re=4,ft||(_&4194048)!==_&&$e.current!==null||($l=!0),(At&134217727)===0&&(Yt&134217727)===0||Y===null||ct(Y,_,Ke,!1)}function ls(e,a,t){var l=P;P|=2;var u=Bp(),o=Ep();(Y!==e||_!==a)&&(vn=null,jl(e,a)),a=!1;var n=re;e:do try{if(V!==0&&z!==null){var r=z,s=Ve;switch(V){case 8:ji(),n=6;break e;case 3:case 2:case 9:case 6:$e.current===null&&(a=!0);var i=V;if(V=0,Ve=null,Dl(e,r,s,i),t&&$l){n=0;break e}break;default:i=V,V=0,Ve=null,Dl(e,r,s,i)}}FL(),n=re;break}catch(p){Dp(e,p)}while(!0);return a&&e.shellSuspendCounter++,Fa=ul=null,P=l,R.H=u,R.A=o,z===null&&(Y=null,_=0,zn()),n}function FL(){for(;z!==null;)Op(z)}function GL(e,a){var t=P;P|=2;var l=Bp(),u=Ep();Y!==e||_!==a?(vn=null,bn=Ye()+500,jl(e,a)):$l=$u(e,a);e:do try{if(V!==0&&z!==null){a=z;var o=Ve;a:switch(V){case 1:V=0,Ve=null,Dl(e,a,o,1);break;case 2:case 9:if(If(o)){V=0,Ve=null,Yf(a);break}a=function(){V!==2&&V!==9||Y!==e||(V=7),Da(e)},o.then(a,a);break e;case 3:V=7;break e;case 4:V=5;break e;case 7:If(o)?(V=0,Ve=null,Yf(a)):(V=0,Ve=null,Dl(e,a,o,7));break;case 5:var n=null;switch(z.tag){case 26:n=z.memoizedState;case 5:case 27:var r=z;if(n?eg(n):r.stateNode.complete){V=0,Ve=null;var s=r.sibling;if(s!==null)z=s;else{var i=r.return;i!==null?(z=i,Kn(i)):z=null}break a}}V=0,Ve=null,Dl(e,a,o,5);break;case 6:V=0,Ve=null,Dl(e,a,o,6);break;case 8:ji(),re=6;break e;default:throw Error(S(462))}}VL();break}catch(p){Dp(e,p)}while(!0);return Fa=ul=null,R.H=l,R.A=u,P=t,z!==null?0:(Y=null,_=0,zn(),re)}function VL(){for(;z!==null&&!mx();)Op(z)}function Op(e){var a=rp(e.alternate,e,Qa);e.memoizedProps=e.pendingProps,a===null?Kn(e):z=a}function Yf(e){var a=e,t=a.alternate;switch(a.tag){case 15:case 0:a=Pf(t,a,a.pendingProps,a.type,void 0,_);break;case 11:a=Pf(t,a,a.pendingProps,a.type.render,a.ref,_);break;case 5:Ri(a);default:sp(t,a),a=z=sm(a,Qa),a=rp(t,a,Qa)}e.memoizedProps=e.pendingProps,a===null?Kn(e):z=a}function Dl(e,a,t,l){Fa=ul=null,Ri(a),ql=null,Gu=0;var u=a.return;try{if(BL(e,u,a,t,_)){re=1,Sn(e,sa(t,e.current)),z=null;return}}catch(o){if(u!==null)throw z=u,o;re=1,Sn(e,sa(t,e.current)),z=null;return}a.flags&32768?(N||l===1?e=!0:$l||(_&536870912)!==0?e=!1:(ft=e=!0,(l===2||l===9||l===3||l===6)&&(l=$e.current,l!==null&&l.tag===13&&(l.flags|=16384))),qp(a,e)):Kn(a)}function Kn(e){var a=e;do{if((a.flags&32768)!==0){qp(a,ft);return}e=a.return;var t=qL(a.alternate,a,Qa);if(t!==null){z=t;return}if(a=a.sibling,a!==null){z=a;return}z=a=e}while(a!==null);re===0&&(re=5)}function qp(e,a){do{var t=HL(e.alternate,e);if(t!==null){t.flags&=32767,z=t;return}if(t=e.return,t!==null&&(t.flags|=32768,t.subtreeFlags=0,t.deletions=null),!a&&(e=e.sibling,e!==null)){z=e;return}z=e=t}while(e!==null);re=6,z=null}function Zf(e,a,t,l,u,o,n,r,s){e.cancelPendingCommit=null;do Yn();while(pe!==0);if((P&6)!==0)throw Error(S(327));if(a!==null){if(a===e.current)throw Error(S(177));if(o=a.lanes|a.childLanes,o|=xi,vx(e,t,o,n,r,s),e===Y&&(z=Y=null,_=0),Xl=a,St=e,Xa=t,Xs=o,js=u,Tp=l,(a.subtreeFlags&10256)!==0||(a.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,YL(rn,function(){return Np(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(a.flags&13878)!==0,(a.subtreeFlags&13878)!==0||l){l=R.T,R.T=null,u=F.p,F.p=2,n=P,P|=4;try{UL(e,a,t)}finally{P=n,F.p=u,R.T=l}}pe=1,Hp(),Up(),zp()}}function Hp(){if(pe===1){pe=0;var e=St,a=Xl,t=(a.flags&13878)!==0;if((a.subtreeFlags&13878)!==0||t){t=R.T,R.T=null;var l=F.p;F.p=2;var u=P;P|=4;try{Sp(a,e);var o=Js,n=em(e.containerInfo),r=o.focusedElem,s=o.selectionRange;if(n!==r&&r&&r.ownerDocument&&$c(r.ownerDocument.documentElement,r)){if(s!==null&&hi(r)){var i=s.start,p=s.end;if(p===void 0&&(p=i),"selectionStart"in r)r.selectionStart=i,r.selectionEnd=Math.min(p,r.value.length);else{var g=r.ownerDocument||document,c=g&&g.defaultView||window;if(c.getSelection){var m=c.getSelection(),L=r.textContent.length,y=Math.min(s.start,L),k=s.end===void 0?y:Math.min(s.end,L);!m.extend&&y>k&&(n=k,k=y,y=n);var h=xf(r,y),d=xf(r,k);if(h&&d&&(m.rangeCount!==1||m.anchorNode!==h.node||m.anchorOffset!==h.offset||m.focusNode!==d.node||m.focusOffset!==d.offset)){var f=g.createRange();f.setStart(h.node,h.offset),m.removeAllRanges(),y>k?(m.addRange(f),m.extend(d.node,d.offset)):(f.setEnd(d.node,d.offset),m.addRange(f))}}}}for(g=[],m=r;m=m.parentNode;)m.nodeType===1&&g.push({element:m,left:m.scrollLeft,top:m.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<g.length;r++){var x=g[r];x.element.scrollLeft=x.left,x.element.scrollTop=x.top}}Bn=!!Qs,Js=Qs=null}finally{P=u,F.p=l,R.T=t}}e.current=a,pe=2}}function Up(){if(pe===2){pe=0;var e=St,a=Xl,t=(a.flags&8772)!==0;if((a.subtreeFlags&8772)!==0||t){t=R.T,R.T=null;var l=F.p;F.p=2;var u=P;P|=4;try{pp(e,a.alternate,a)}finally{P=u,F.p=l,R.T=t}}pe=3}}function zp(){if(pe===4||pe===3){pe=0,px();var e=St,a=Xl,t=Xa,l=Tp;(a.subtreeFlags&10256)!==0||(a.flags&10256)!==0?pe=5:(pe=0,Xl=St=null,_p(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(Lt=null),ii(t),a=a.stateNode,Ze&&typeof Ze.onCommitFiberRoot=="function")try{Ze.onCommitFiberRoot(Wu,a,void 0,(a.current.flags&128)===128)}catch{}if(l!==null){a=R.T,u=F.p,F.p=2,R.T=null;try{for(var o=e.onRecoverableError,n=0;n<l.length;n++){var r=l[n];o(r.value,{componentStack:r.stack})}}finally{R.T=a,F.p=u}}(Xa&3)!==0&&Yn(),Da(e),u=e.pendingLanes,(t&261930)!==0&&(u&42)!==0?e===Ks?qu++:(qu=0,Ks=e):qu=0,no(0,!1)}}function _p(e,a){(e.pooledCacheLanes&=a)===0&&(a=e.pooledCache,a!=null&&(e.pooledCache=null,lo(a)))}function Yn(){return Hp(),Up(),zp(),Np()}function Np(){if(pe!==5)return!1;var e=St,a=Xs;Xs=0;var t=ii(Xa),l=R.T,u=F.p;try{F.p=32>t?32:t,R.T=null,t=js,js=null;var o=St,n=Xa;if(pe=0,Xl=St=null,Xa=0,(P&6)!==0)throw Error(S(331));var r=P;if(P|=4,Ip(o.current),Cp(o,o.current,n,t),P=r,no(0,!1),Ze&&typeof Ze.onPostCommitFiberRoot=="function")try{Ze.onPostCommitFiberRoot(Wu,o)}catch{}return!0}finally{F.p=u,R.T=l,_p(e,a)}}function Qf(e,a,t){a=sa(t,a),a=Ns(e.stateNode,a,2),e=xt(e,a,2),e!==null&&(eo(e,2),Da(e))}function X(e,a,t){if(e.tag===3)Qf(e,e,t);else for(;a!==null;){if(a.tag===3){Qf(a,e,t);break}else if(a.tag===1){var l=a.stateNode;if(typeof a.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Lt===null||!Lt.has(l))){e=sa(t,e),t=ap(2),l=xt(a,t,2),l!==null&&(tp(t,l,a,e),eo(l,2),Da(l));break}}a=a.return}}function us(e,a,t){var l=e.pingCache;if(l===null){l=e.pingCache=new NL;var u=new Set;l.set(a,u)}else u=l.get(a),u===void 0&&(u=new Set,l.set(a,u));u.has(t)||(Vi=!0,u.add(t),e=XL.bind(null,e,a,t),a.then(e,e))}function XL(e,a,t){var l=e.pingCache;l!==null&&l.delete(a),e.pingedLanes|=e.suspendedLanes&t,e.warmLanes&=~t,Y===e&&(_&t)===t&&(re===4||re===3&&(_&62914560)===_&&300>Ye()-Xn?(P&2)===0&&jl(e,0):Xi|=t,Vl===_&&(Vl=0)),Da(e)}function Pp(e,a){a===0&&(a=Bc()),e=ll(e,a),e!==null&&(eo(e,a),Da(e))}function jL(e){var a=e.memoizedState,t=0;a!==null&&(t=a.retryLane),Pp(e,t)}function KL(e,a){var t=0;switch(e.tag){case 31:case 13:var l=e.stateNode,u=e.memoizedState;u!==null&&(t=u.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(S(314))}l!==null&&l.delete(a),Pp(e,t)}function YL(e,a){return ri(e,a)}var kn=null,Ll=null,Ys=!1,An=!1,os=!1,mt=0;function Da(e){e!==Ll&&e.next===null&&(Ll===null?kn=Ll=e:Ll=Ll.next=e),An=!0,Ys||(Ys=!0,QL())}function no(e,a){if(!os&&An){os=!0;do for(var t=!1,l=kn;l!==null;){if(!a)if(e!==0){var u=l.pendingLanes;if(u===0)var o=0;else{var n=l.suspendedLanes,r=l.pingedLanes;o=(1<<31-Qe(42|e)+1)-1,o&=u&~(n&~r),o=o&201326741?o&201326741|1:o?o|2:0}o!==0&&(t=!0,Jf(l,o))}else o=_,o=On(l,l===Y?o:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(o&3)===0||$u(l,o)||(t=!0,Jf(l,o));l=l.next}while(t);os=!1}}function ZL(){Fp()}function Fp(){An=Ys=!1;var e=0;mt!==0&&uS()&&(e=mt);for(var a=Ye(),t=null,l=kn;l!==null;){var u=l.next,o=Gp(l,a);o===0?(l.next=null,t===null?kn=u:t.next=u,u===null&&(Ll=t)):(t=l,(e!==0||(o&3)!==0)&&(An=!0)),l=u}pe!==0&&pe!==5||no(e,!1),mt!==0&&(mt=0)}function Gp(e,a){for(var t=e.suspendedLanes,l=e.pingedLanes,u=e.expirationTimes,o=e.pendingLanes&-62914561;0<o;){var n=31-Qe(o),r=1<<n,s=u[n];s===-1?((r&t)===0||(r&l)!==0)&&(u[n]=bx(r,a)):s<=a&&(e.expiredLanes|=r),o&=~r}if(a=Y,t=_,t=On(e,e===a?t:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,t===0||e===a&&(V===2||V===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&Or(l),e.callbackNode=null,e.callbackPriority=0;if((t&3)===0||$u(e,t)){if(a=t&-t,a===e.callbackPriority)return a;switch(l!==null&&Or(l),ii(t)){case 2:case 8:t=Dc;break;case 32:t=rn;break;case 268435456:t=Rc;break;default:t=rn}return l=Vp.bind(null,e),t=ri(t,l),e.callbackPriority=a,e.callbackNode=t,a}return l!==null&&l!==null&&Or(l),e.callbackPriority=2,e.callbackNode=null,2}function Vp(e,a){if(pe!==0&&pe!==5)return e.callbackNode=null,e.callbackPriority=0,null;var t=e.callbackNode;if(Yn()&&e.callbackNode!==t)return null;var l=_;return l=On(e,e===Y?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(Mp(e,l,a),Gp(e,Ye()),e.callbackNode!=null&&e.callbackNode===t?Vp.bind(null,e):null)}function Jf(e,a){if(Yn())return null;Mp(e,a,!0)}function QL(){nS(function(){(P&6)!==0?ri(Mc,ZL):Fp()})}function Ki(){if(mt===0){var e=Pl;e===0&&(e=Ao,Ao<<=1,(Ao&261888)===0&&(Ao=256)),mt=e}return mt}function Wf(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Vo(""+e)}function $f(e,a){var t=a.ownerDocument.createElement("input");return t.name=a.name,t.value=a.value,e.id&&t.setAttribute("form",e.id),a.parentNode.insertBefore(t,a),e=new FormData(e),t.parentNode.removeChild(t),e}function JL(e,a,t,l,u){if(a==="submit"&&t&&t.stateNode===u){var o=Wf((u[Ne]||null).action),n=l.submitter;n&&(a=(a=n[Ne]||null)?Wf(a.formAction):n.getAttribute("formAction"),a!==null&&(o=a,n=null));var r=new qn("action","action",null,l,u);e.push({event:r,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(mt!==0){var s=n?$f(u,n):new FormData(u);zs(t,{pending:!0,data:s,method:u.method,action:o},null,s)}}else typeof o=="function"&&(r.preventDefault(),s=n?$f(u,n):new FormData(u),zs(t,{pending:!0,data:s,method:u.method,action:o},o,s))},currentTarget:u}]})}}for(zo=0;zo<As.length;zo++)_o=As[zo],ec=_o.toLowerCase(),ac=_o[0].toUpperCase()+_o.slice(1),Sa(ec,"on"+ac);var _o,ec,ac,zo;Sa(tm,"onAnimationEnd");Sa(lm,"onAnimationIteration");Sa(um,"onAnimationStart");Sa("dblclick","onDoubleClick");Sa("focusin","onFocus");Sa("focusout","onBlur");Sa(gL,"onTransitionRun");Sa(hL,"onTransitionStart");Sa(xL,"onTransitionCancel");Sa(om,"onTransitionEnd");_l("onMouseEnter",["mouseout","mouseover"]);_l("onMouseLeave",["mouseout","mouseover"]);_l("onPointerEnter",["pointerout","pointerover"]);_l("onPointerLeave",["pointerout","pointerover"]);el("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));el("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));el("onBeforeInput",["compositionend","keypress","textInput","paste"]);el("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));el("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));el("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ju="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),WL=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ju));function Xp(e,a){a=(a&4)!==0;for(var t=0;t<e.length;t++){var l=e[t],u=l.event;l=l.listeners;e:{var o=void 0;if(a)for(var n=l.length-1;0<=n;n--){var r=l[n],s=r.instance,i=r.currentTarget;if(r=r.listener,s!==o&&u.isPropagationStopped())break e;o=r,u.currentTarget=i;try{o(u)}catch(p){dn(p)}u.currentTarget=null,o=s}else for(n=0;n<l.length;n++){if(r=l[n],s=r.instance,i=r.currentTarget,r=r.listener,s!==o&&u.isPropagationStopped())break e;o=r,u.currentTarget=i;try{o(u)}catch(p){dn(p)}u.currentTarget=null,o=s}}}}function U(e,a){var t=a[Ls];t===void 0&&(t=a[Ls]=new Set);var l=e+"__bubble";t.has(l)||(jp(a,e,2,!1),t.add(l))}function ns(e,a,t){var l=0;a&&(l|=4),jp(t,e,l,a)}var No="_reactListening"+Math.random().toString(36).slice(2);function Yi(e){if(!e[No]){e[No]=!0,Uc.forEach(function(t){t!=="selectionchange"&&(WL.has(t)||ns(t,!1,e),ns(t,!0,e))});var a=e.nodeType===9?e:e.ownerDocument;a===null||a[No]||(a[No]=!0,ns("selectionchange",!1,a))}}function jp(e,a,t,l){switch(og(a)){case 2:var u=AS;break;case 8:u=TS;break;default:u=Wi}t=u.bind(null,a,t,e),u=void 0,!vs||a!=="touchstart"&&a!=="touchmove"&&a!=="wheel"||(u=!0),l?u!==void 0?e.addEventListener(a,t,{capture:!0,passive:u}):e.addEventListener(a,t,!0):u!==void 0?e.addEventListener(a,t,{passive:u}):e.addEventListener(a,t,!1)}function rs(e,a,t,l,u){var o=l;if((a&1)===0&&(a&2)===0&&l!==null)e:for(;;){if(l===null)return;var n=l.tag;if(n===3||n===4){var r=l.stateNode.containerInfo;if(r===u)break;if(n===4)for(n=l.return;n!==null;){var s=n.tag;if((s===3||s===4)&&n.stateNode.containerInfo===u)return;n=n.return}for(;r!==null;){if(n=Cl(r),n===null)return;if(s=n.tag,s===5||s===6||s===26||s===27){l=o=n;continue e}r=r.parentNode}}l=l.return}Xc(function(){var i=o,p=ci(t),g=[];e:{var c=nm.get(e);if(c!==void 0){var m=qn,L=e;switch(e){case"keypress":if(jo(t)===0)break e;case"keydown":case"keyup":m=Kx;break;case"focusin":L="focus",m=_r;break;case"focusout":L="blur",m=_r;break;case"beforeblur":case"afterblur":m=_r;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=rf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=qx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=Qx;break;case tm:case lm:case um:m=zx;break;case om:m=Wx;break;case"scroll":case"scrollend":m=Ex;break;case"wheel":m=eL;break;case"copy":case"cut":case"paste":m=Nx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=df;break;case"toggle":case"beforetoggle":m=tL}var y=(a&4)!==0,k=!y&&(e==="scroll"||e==="scrollend"),h=y?c!==null?c+"Capture":null:c;y=[];for(var d=i,f;d!==null;){var x=d;if(f=x.stateNode,x=x.tag,x!==5&&x!==26&&x!==27||f===null||h===null||(x=zu(d,h),x!=null&&y.push(Ku(d,x,f))),k)break;d=d.return}0<y.length&&(c=new m(c,L,null,t,p),g.push({event:c,listeners:y}))}}if((a&7)===0){e:{if(c=e==="mouseover"||e==="pointerover",m=e==="mouseout"||e==="pointerout",c&&t!==bs&&(L=t.relatedTarget||t.fromElement)&&(Cl(L)||L[Zl]))break e;if((m||c)&&(c=p.window===p?p:(c=p.ownerDocument)?c.defaultView||c.parentWindow:window,m?(L=t.relatedTarget||t.toElement,m=i,L=L?Cl(L):null,L!==null&&(k=Ju(L),y=L.tag,L!==k||y!==5&&y!==27&&y!==6)&&(L=null)):(m=null,L=i),m!==L)){if(y=rf,x="onMouseLeave",h="onMouseEnter",d="mouse",(e==="pointerout"||e==="pointerover")&&(y=df,x="onPointerLeave",h="onPointerEnter",d="pointer"),k=m==null?c:Cu(m),f=L==null?c:Cu(L),c=new y(x,d+"leave",m,t,p),c.target=k,c.relatedTarget=f,x=null,Cl(p)===i&&(y=new y(h,d+"enter",L,t,p),y.target=f,y.relatedTarget=k,x=y),k=x,m&&L)a:{for(y=$L,h=m,d=L,f=0,x=h;x;x=y(x))f++;x=0;for(var b=d;b;b=y(b))x++;for(;0<f-x;)h=y(h),f--;for(;0<x-f;)d=y(d),x--;for(;f--;){if(h===d||d!==null&&h===d.alternate){y=h;break a}h=y(h),d=y(d)}y=null}else y=null;m!==null&&tc(g,c,m,y,!1),L!==null&&k!==null&&tc(g,k,L,y,!0)}}e:{if(c=i?Cu(i):window,m=c.nodeName&&c.nodeName.toLowerCase(),m==="select"||m==="input"&&c.type==="file")var w=pf;else if(mf(c))if(Jc)w=cL;else{w=dL;var I=iL}else m=c.nodeName,!m||m.toLowerCase()!=="input"||c.type!=="checkbox"&&c.type!=="radio"?i&&fi(i.elementType)&&(w=pf):w=fL;if(w&&(w=w(e,i))){Qc(g,w,t,p);break e}I&&I(e,c,i),e==="focusout"&&i&&c.type==="number"&&i.memoizedProps.value!=null&&Cs(c,"number",c.value)}switch(I=i?Cu(i):window,e){case"focusin":(mf(I)||I.contentEditable==="true")&&(Il=I,Is=i,Au=null);break;case"focusout":Au=Is=Il=null;break;case"mousedown":ks=!0;break;case"contextmenu":case"mouseup":case"dragend":ks=!1,Lf(g,t,p);break;case"selectionchange":if(pL)break;case"keydown":case"keyup":Lf(g,t,p)}var C;if(gi)e:{switch(e){case"compositionstart":var v="onCompositionStart";break e;case"compositionend":v="onCompositionEnd";break e;case"compositionupdate":v="onCompositionUpdate";break e}v=void 0}else vl?Yc(e,t)&&(v="onCompositionEnd"):e==="keydown"&&t.keyCode===229&&(v="onCompositionStart");v&&(Kc&&t.locale!=="ko"&&(vl||v!=="onCompositionStart"?v==="onCompositionEnd"&&vl&&(C=jc()):(dt=p,mi="value"in dt?dt.value:dt.textContent,vl=!0)),I=Tn(i,v),0<I.length&&(v=new sf(v,e,null,t,p),g.push({event:v,listeners:I}),C?v.data=C:(C=Zc(t),C!==null&&(v.data=C)))),(C=uL?oL(e,t):nL(e,t))&&(v=Tn(i,"onBeforeInput"),0<v.length&&(I=new sf("onBeforeInput","beforeinput",null,t,p),g.push({event:I,listeners:v}),I.data=C)),JL(g,e,i,t,p)}Xp(g,a)})}function Ku(e,a,t){return{instance:e,listener:a,currentTarget:t}}function Tn(e,a){for(var t=a+"Capture",l=[];e!==null;){var u=e,o=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||o===null||(u=zu(e,t),u!=null&&l.unshift(Ku(e,u,o)),u=zu(e,a),u!=null&&l.push(Ku(e,u,o))),e.tag===3)return l;e=e.return}return[]}function $L(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function tc(e,a,t,l,u){for(var o=a._reactName,n=[];t!==null&&t!==l;){var r=t,s=r.alternate,i=r.stateNode;if(r=r.tag,s!==null&&s===l)break;r!==5&&r!==26&&r!==27||i===null||(s=i,u?(i=zu(t,o),i!=null&&n.unshift(Ku(t,i,s))):u||(i=zu(t,o),i!=null&&n.push(Ku(t,i,s)))),t=t.return}n.length!==0&&e.push({event:a,listeners:n})}var eS=/\r\n?/g,aS=/\u0000|\uFFFD/g;function lc(e){return(typeof e=="string"?e:""+e).replace(eS,`
`).replace(aS,"")}function Kp(e,a){return a=lc(a),lc(e)===a}function j(e,a,t,l,u,o){switch(t){case"children":typeof l=="string"?a==="body"||a==="textarea"&&l===""||Nl(e,l):(typeof l=="number"||typeof l=="bigint")&&a!=="body"&&Nl(e,""+l);break;case"className":Mo(e,"class",l);break;case"tabIndex":Mo(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Mo(e,t,l);break;case"style":Vc(e,l,o);break;case"data":if(a!=="object"){Mo(e,"data",l);break}case"src":case"href":if(l===""&&(a!=="a"||t!=="href")){e.removeAttribute(t);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(t);break}l=Vo(""+l),e.setAttribute(t,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(t,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof o=="function"&&(t==="formAction"?(a!=="input"&&j(e,a,"name",u.name,u,null),j(e,a,"formEncType",u.formEncType,u,null),j(e,a,"formMethod",u.formMethod,u,null),j(e,a,"formTarget",u.formTarget,u,null)):(j(e,a,"encType",u.encType,u,null),j(e,a,"method",u.method,u,null),j(e,a,"target",u.target,u,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(t);break}l=Vo(""+l),e.setAttribute(t,l);break;case"onClick":l!=null&&(e.onclick=Pa);break;case"onScroll":l!=null&&U("scroll",e);break;case"onScrollEnd":l!=null&&U("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(S(61));if(t=l.__html,t!=null){if(u.children!=null)throw Error(S(60));e.innerHTML=t}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}t=Vo(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",t);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(t,""+l):e.removeAttribute(t);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(t,""):e.removeAttribute(t);break;case"capture":case"download":l===!0?e.setAttribute(t,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(t,l):e.removeAttribute(t);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(t,l):e.removeAttribute(t);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(t):e.setAttribute(t,l);break;case"popover":U("beforetoggle",e),U("toggle",e),Go(e,"popover",l);break;case"xlinkActuate":Ea(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":Ea(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":Ea(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":Ea(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":Ea(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":Ea(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":Ea(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":Ea(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":Ea(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Go(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(t=Rx.get(t)||t,Go(e,t,l))}}function Zs(e,a,t,l,u,o){switch(t){case"style":Vc(e,l,o);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(S(61));if(t=l.__html,t!=null){if(u.children!=null)throw Error(S(60));e.innerHTML=t}}break;case"children":typeof l=="string"?Nl(e,l):(typeof l=="number"||typeof l=="bigint")&&Nl(e,""+l);break;case"onScroll":l!=null&&U("scroll",e);break;case"onScrollEnd":l!=null&&U("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Pa);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!zc.hasOwnProperty(t))e:{if(t[0]==="o"&&t[1]==="n"&&(u=t.endsWith("Capture"),a=t.slice(2,u?t.length-7:void 0),o=e[Ne]||null,o=o!=null?o[t]:null,typeof o=="function"&&e.removeEventListener(a,o,u),typeof l=="function")){typeof o!="function"&&o!==null&&(t in e?e[t]=null:e.hasAttribute(t)&&e.removeAttribute(t)),e.addEventListener(a,l,u);break e}t in e?e[t]=l:l===!0?e.setAttribute(t,""):Go(e,t,l)}}}function Te(e,a,t){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":U("error",e),U("load",e);var l=!1,u=!1,o;for(o in t)if(t.hasOwnProperty(o)){var n=t[o];if(n!=null)switch(o){case"src":l=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(S(137,a));default:j(e,a,o,n,t,null)}}u&&j(e,a,"srcSet",t.srcSet,t,null),l&&j(e,a,"src",t.src,t,null);return;case"input":U("invalid",e);var r=o=n=u=null,s=null,i=null;for(l in t)if(t.hasOwnProperty(l)){var p=t[l];if(p!=null)switch(l){case"name":u=p;break;case"type":n=p;break;case"checked":s=p;break;case"defaultChecked":i=p;break;case"value":o=p;break;case"defaultValue":r=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(S(137,a));break;default:j(e,a,l,p,t,null)}}Pc(e,o,r,s,i,n,u,!1);return;case"select":U("invalid",e),l=n=o=null;for(u in t)if(t.hasOwnProperty(u)&&(r=t[u],r!=null))switch(u){case"value":o=r;break;case"defaultValue":n=r;break;case"multiple":l=r;default:j(e,a,u,r,t,null)}a=o,t=n,e.multiple=!!l,a!=null?Bl(e,!!l,a,!1):t!=null&&Bl(e,!!l,t,!0);return;case"textarea":U("invalid",e),o=u=l=null;for(n in t)if(t.hasOwnProperty(n)&&(r=t[n],r!=null))switch(n){case"value":l=r;break;case"defaultValue":u=r;break;case"children":o=r;break;case"dangerouslySetInnerHTML":if(r!=null)throw Error(S(91));break;default:j(e,a,n,r,t,null)}Gc(e,l,u,o);return;case"option":for(s in t)t.hasOwnProperty(s)&&(l=t[s],l!=null)&&(s==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":j(e,a,s,l,t,null));return;case"dialog":U("beforetoggle",e),U("toggle",e),U("cancel",e),U("close",e);break;case"iframe":case"object":U("load",e);break;case"video":case"audio":for(l=0;l<ju.length;l++)U(ju[l],e);break;case"image":U("error",e),U("load",e);break;case"details":U("toggle",e);break;case"embed":case"source":case"link":U("error",e),U("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(i in t)if(t.hasOwnProperty(i)&&(l=t[i],l!=null))switch(i){case"children":case"dangerouslySetInnerHTML":throw Error(S(137,a));default:j(e,a,i,l,t,null)}return;default:if(fi(a)){for(p in t)t.hasOwnProperty(p)&&(l=t[p],l!==void 0&&Zs(e,a,p,l,t,void 0));return}}for(r in t)t.hasOwnProperty(r)&&(l=t[r],l!=null&&j(e,a,r,l,t,null))}function tS(e,a,t,l){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,o=null,n=null,r=null,s=null,i=null,p=null;for(m in t){var g=t[m];if(t.hasOwnProperty(m)&&g!=null)switch(m){case"checked":break;case"value":break;case"defaultValue":s=g;default:l.hasOwnProperty(m)||j(e,a,m,null,l,g)}}for(var c in l){var m=l[c];if(g=t[c],l.hasOwnProperty(c)&&(m!=null||g!=null))switch(c){case"type":o=m;break;case"name":u=m;break;case"checked":i=m;break;case"defaultChecked":p=m;break;case"value":n=m;break;case"defaultValue":r=m;break;case"children":case"dangerouslySetInnerHTML":if(m!=null)throw Error(S(137,a));break;default:m!==g&&j(e,a,c,m,l,g)}}ys(e,n,r,s,i,p,o,u);return;case"select":m=n=r=c=null;for(o in t)if(s=t[o],t.hasOwnProperty(o)&&s!=null)switch(o){case"value":break;case"multiple":m=s;default:l.hasOwnProperty(o)||j(e,a,o,null,l,s)}for(u in l)if(o=l[u],s=t[u],l.hasOwnProperty(u)&&(o!=null||s!=null))switch(u){case"value":c=o;break;case"defaultValue":r=o;break;case"multiple":n=o;default:o!==s&&j(e,a,u,o,l,s)}a=r,t=n,l=m,c!=null?Bl(e,!!t,c,!1):!!l!=!!t&&(a!=null?Bl(e,!!t,a,!0):Bl(e,!!t,t?[]:"",!1));return;case"textarea":m=c=null;for(r in t)if(u=t[r],t.hasOwnProperty(r)&&u!=null&&!l.hasOwnProperty(r))switch(r){case"value":break;case"children":break;default:j(e,a,r,null,l,u)}for(n in l)if(u=l[n],o=t[n],l.hasOwnProperty(n)&&(u!=null||o!=null))switch(n){case"value":c=u;break;case"defaultValue":m=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(S(91));break;default:u!==o&&j(e,a,n,u,l,o)}Fc(e,c,m);return;case"option":for(var L in t)c=t[L],t.hasOwnProperty(L)&&c!=null&&!l.hasOwnProperty(L)&&(L==="selected"?e.selected=!1:j(e,a,L,null,l,c));for(s in l)c=l[s],m=t[s],l.hasOwnProperty(s)&&c!==m&&(c!=null||m!=null)&&(s==="selected"?e.selected=c&&typeof c!="function"&&typeof c!="symbol":j(e,a,s,c,l,m));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var y in t)c=t[y],t.hasOwnProperty(y)&&c!=null&&!l.hasOwnProperty(y)&&j(e,a,y,null,l,c);for(i in l)if(c=l[i],m=t[i],l.hasOwnProperty(i)&&c!==m&&(c!=null||m!=null))switch(i){case"children":case"dangerouslySetInnerHTML":if(c!=null)throw Error(S(137,a));break;default:j(e,a,i,c,l,m)}return;default:if(fi(a)){for(var k in t)c=t[k],t.hasOwnProperty(k)&&c!==void 0&&!l.hasOwnProperty(k)&&Zs(e,a,k,void 0,l,c);for(p in l)c=l[p],m=t[p],!l.hasOwnProperty(p)||c===m||c===void 0&&m===void 0||Zs(e,a,p,c,l,m);return}}for(var h in t)c=t[h],t.hasOwnProperty(h)&&c!=null&&!l.hasOwnProperty(h)&&j(e,a,h,null,l,c);for(g in l)c=l[g],m=t[g],!l.hasOwnProperty(g)||c===m||c==null&&m==null||j(e,a,g,c,l,m)}function uc(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function lS(){if(typeof performance.getEntriesByType=="function"){for(var e=0,a=0,t=performance.getEntriesByType("resource"),l=0;l<t.length;l++){var u=t[l],o=u.transferSize,n=u.initiatorType,r=u.duration;if(o&&r&&uc(n)){for(n=0,r=u.responseEnd,l+=1;l<t.length;l++){var s=t[l],i=s.startTime;if(i>r)break;var p=s.transferSize,g=s.initiatorType;p&&uc(g)&&(s=s.responseEnd,n+=p*(s<r?1:(r-i)/(s-i)))}if(--l,a+=8*(o+n)/(u.duration/1e3),e++,10<e)break}}if(0<e)return a/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Qs=null,Js=null;function wn(e){return e.nodeType===9?e:e.ownerDocument}function oc(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Yp(e,a){if(e===0)switch(a){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&a==="foreignObject"?0:e}function Ws(e,a){return e==="textarea"||e==="noscript"||typeof a.children=="string"||typeof a.children=="number"||typeof a.children=="bigint"||typeof a.dangerouslySetInnerHTML=="object"&&a.dangerouslySetInnerHTML!==null&&a.dangerouslySetInnerHTML.__html!=null}var ss=null;function uS(){var e=window.event;return e&&e.type==="popstate"?e===ss?!1:(ss=e,!0):(ss=null,!1)}var Zp=typeof setTimeout=="function"?setTimeout:void 0,oS=typeof clearTimeout=="function"?clearTimeout:void 0,nc=typeof Promise=="function"?Promise:void 0,nS=typeof queueMicrotask=="function"?queueMicrotask:typeof nc<"u"?function(e){return nc.resolve(null).then(e).catch(rS)}:Zp;function rS(e){setTimeout(function(){throw e})}function wt(e){return e==="head"}function rc(e,a){var t=a,l=0;do{var u=t.nextSibling;if(e.removeChild(t),u&&u.nodeType===8)if(t=u.data,t==="/$"||t==="/&"){if(l===0){e.removeChild(u),Yl(a);return}l--}else if(t==="$"||t==="$?"||t==="$~"||t==="$!"||t==="&")l++;else if(t==="html")Hu(e.ownerDocument.documentElement);else if(t==="head"){t=e.ownerDocument.head,Hu(t);for(var o=t.firstChild;o;){var n=o.nextSibling,r=o.nodeName;o[ao]||r==="SCRIPT"||r==="STYLE"||r==="LINK"&&o.rel.toLowerCase()==="stylesheet"||t.removeChild(o),o=n}}else t==="body"&&Hu(e.ownerDocument.body);t=u}while(t);Yl(a)}function sc(e,a){var t=e;e=0;do{var l=t.nextSibling;if(t.nodeType===1?a?(t._stashedDisplay=t.style.display,t.style.display="none"):(t.style.display=t._stashedDisplay||"",t.getAttribute("style")===""&&t.removeAttribute("style")):t.nodeType===3&&(a?(t._stashedText=t.nodeValue,t.nodeValue=""):t.nodeValue=t._stashedText||""),l&&l.nodeType===8)if(t=l.data,t==="/$"){if(e===0)break;e--}else t!=="$"&&t!=="$?"&&t!=="$~"&&t!=="$!"||e++;t=l}while(t)}function $s(e){var a=e.firstChild;for(a&&a.nodeType===10&&(a=a.nextSibling);a;){var t=a;switch(a=a.nextSibling,t.nodeName){case"HTML":case"HEAD":case"BODY":$s(t),di(t);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(t.rel.toLowerCase()==="stylesheet")continue}e.removeChild(t)}}function sS(e,a,t,l){for(;e.nodeType===1;){var u=t;if(e.nodeName.toLowerCase()!==a.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[ao])switch(a){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(o=e.getAttribute("rel"),o==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(o!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(o=e.getAttribute("src"),(o!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&o&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(a==="input"&&e.type==="hidden"){var o=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===o)return e}else return e;if(e=fa(e.nextSibling),e===null)break}return null}function iS(e,a,t){if(a==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=fa(e.nextSibling),e===null))return null;return e}function Qp(e,a){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=fa(e.nextSibling),e===null))return null;return e}function ei(e){return e.data==="$?"||e.data==="$~"}function ai(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function dS(e,a){var t=e.ownerDocument;if(e.data==="$~")e._reactRetry=a;else if(e.data!=="$?"||t.readyState!=="loading")a();else{var l=function(){a(),t.removeEventListener("DOMContentLoaded",l)};t.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function fa(e){for(;e!=null;e=e.nextSibling){var a=e.nodeType;if(a===1||a===3)break;if(a===8){if(a=e.data,a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"||a==="F!"||a==="F")break;if(a==="/$"||a==="/&")return null}}return e}var ti=null;function ic(e){e=e.nextSibling;for(var a=0;e;){if(e.nodeType===8){var t=e.data;if(t==="/$"||t==="/&"){if(a===0)return fa(e.nextSibling);a--}else t!=="$"&&t!=="$!"&&t!=="$?"&&t!=="$~"&&t!=="&"||a++}e=e.nextSibling}return null}function dc(e){e=e.previousSibling;for(var a=0;e;){if(e.nodeType===8){var t=e.data;if(t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"){if(a===0)return e;a--}else t!=="/$"&&t!=="/&"||a++}e=e.previousSibling}return null}function Jp(e,a,t){switch(a=wn(t),e){case"html":if(e=a.documentElement,!e)throw Error(S(452));return e;case"head":if(e=a.head,!e)throw Error(S(453));return e;case"body":if(e=a.body,!e)throw Error(S(454));return e;default:throw Error(S(451))}}function Hu(e){for(var a=e.attributes;a.length;)e.removeAttributeNode(a[0]);di(e)}var ca=new Map,fc=new Set;function Mn(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Ja=F.d;F.d={f:fS,r:cS,D:mS,C:pS,L:gS,m:hS,X:LS,S:xS,M:SS};function fS(){var e=Ja.f(),a=jn();return e||a}function cS(e){var a=Ql(e);a!==null&&a.tag===5&&a.type==="form"?Vm(a):Ja.r(e)}var eu=typeof document>"u"?null:document;function Wp(e,a,t){var l=eu;if(l&&typeof a=="string"&&a){var u=ra(a);u='link[rel="'+e+'"][href="'+u+'"]',typeof t=="string"&&(u+='[crossorigin="'+t+'"]'),fc.has(u)||(fc.add(u),e={rel:e,crossOrigin:t,href:a},l.querySelector(u)===null&&(a=l.createElement("link"),Te(a,"link",e),ye(a),l.head.appendChild(a)))}}function mS(e){Ja.D(e),Wp("dns-prefetch",e,null)}function pS(e,a){Ja.C(e,a),Wp("preconnect",e,a)}function gS(e,a,t){Ja.L(e,a,t);var l=eu;if(l&&e&&a){var u='link[rel="preload"][as="'+ra(a)+'"]';a==="image"&&t&&t.imageSrcSet?(u+='[imagesrcset="'+ra(t.imageSrcSet)+'"]',typeof t.imageSizes=="string"&&(u+='[imagesizes="'+ra(t.imageSizes)+'"]')):u+='[href="'+ra(e)+'"]';var o=u;switch(a){case"style":o=Kl(e);break;case"script":o=au(e)}ca.has(o)||(e=te({rel:"preload",href:a==="image"&&t&&t.imageSrcSet?void 0:e,as:a},t),ca.set(o,e),l.querySelector(u)!==null||a==="style"&&l.querySelector(ro(o))||a==="script"&&l.querySelector(so(o))||(a=l.createElement("link"),Te(a,"link",e),ye(a),l.head.appendChild(a)))}}function hS(e,a){Ja.m(e,a);var t=eu;if(t&&e){var l=a&&typeof a.as=="string"?a.as:"script",u='link[rel="modulepreload"][as="'+ra(l)+'"][href="'+ra(e)+'"]',o=u;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":o=au(e)}if(!ca.has(o)&&(e=te({rel:"modulepreload",href:e},a),ca.set(o,e),t.querySelector(u)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(t.querySelector(so(o)))return}l=t.createElement("link"),Te(l,"link",e),ye(l),t.head.appendChild(l)}}}function xS(e,a,t){Ja.S(e,a,t);var l=eu;if(l&&e){var u=Rl(l).hoistableStyles,o=Kl(e);a=a||"default";var n=u.get(o);if(!n){var r={loading:0,preload:null};if(n=l.querySelector(ro(o)))r.loading=5;else{e=te({rel:"stylesheet",href:e,"data-precedence":a},t),(t=ca.get(o))&&Zi(e,t);var s=n=l.createElement("link");ye(s),Te(s,"link",e),s._p=new Promise(function(i,p){s.onload=i,s.onerror=p}),s.addEventListener("load",function(){r.loading|=1}),s.addEventListener("error",function(){r.loading|=2}),r.loading|=4,en(n,a,l)}n={type:"stylesheet",instance:n,count:1,state:r},u.set(o,n)}}}function LS(e,a){Ja.X(e,a);var t=eu;if(t&&e){var l=Rl(t).hoistableScripts,u=au(e),o=l.get(u);o||(o=t.querySelector(so(u)),o||(e=te({src:e,async:!0},a),(a=ca.get(u))&&Qi(e,a),o=t.createElement("script"),ye(o),Te(o,"link",e),t.head.appendChild(o)),o={type:"script",instance:o,count:1,state:null},l.set(u,o))}}function SS(e,a){Ja.M(e,a);var t=eu;if(t&&e){var l=Rl(t).hoistableScripts,u=au(e),o=l.get(u);o||(o=t.querySelector(so(u)),o||(e=te({src:e,async:!0,type:"module"},a),(a=ca.get(u))&&Qi(e,a),o=t.createElement("script"),ye(o),Te(o,"link",e),t.head.appendChild(o)),o={type:"script",instance:o,count:1,state:null},l.set(u,o))}}function cc(e,a,t,l){var u=(u=pt.current)?Mn(u):null;if(!u)throw Error(S(446));switch(e){case"meta":case"title":return null;case"style":return typeof t.precedence=="string"&&typeof t.href=="string"?(a=Kl(t.href),t=Rl(u).hoistableStyles,l=t.get(a),l||(l={type:"style",instance:null,count:0,state:null},t.set(a,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(t.rel==="stylesheet"&&typeof t.href=="string"&&typeof t.precedence=="string"){e=Kl(t.href);var o=Rl(u).hoistableStyles,n=o.get(e);if(n||(u=u.ownerDocument||u,n={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},o.set(e,n),(o=u.querySelector(ro(e)))&&!o._p&&(n.instance=o,n.state.loading=5),ca.has(e)||(t={rel:"preload",as:"style",href:t.href,crossOrigin:t.crossOrigin,integrity:t.integrity,media:t.media,hrefLang:t.hrefLang,referrerPolicy:t.referrerPolicy},ca.set(e,t),o||yS(u,e,t,n.state))),a&&l===null)throw Error(S(528,""));return n}if(a&&l!==null)throw Error(S(529,""));return null;case"script":return a=t.async,t=t.src,typeof t=="string"&&a&&typeof a!="function"&&typeof a!="symbol"?(a=au(t),t=Rl(u).hoistableScripts,l=t.get(a),l||(l={type:"script",instance:null,count:0,state:null},t.set(a,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(S(444,e))}}function Kl(e){return'href="'+ra(e)+'"'}function ro(e){return'link[rel="stylesheet"]['+e+"]"}function $p(e){return te({},e,{"data-precedence":e.precedence,precedence:null})}function yS(e,a,t,l){e.querySelector('link[rel="preload"][as="style"]['+a+"]")?l.loading=1:(a=e.createElement("link"),l.preload=a,a.addEventListener("load",function(){return l.loading|=1}),a.addEventListener("error",function(){return l.loading|=2}),Te(a,"link",t),ye(a),e.head.appendChild(a))}function au(e){return'[src="'+ra(e)+'"]'}function so(e){return"script[async]"+e}function mc(e,a,t){if(a.count++,a.instance===null)switch(a.type){case"style":var l=e.querySelector('style[data-href~="'+ra(t.href)+'"]');if(l)return a.instance=l,ye(l),l;var u=te({},t,{"data-href":t.href,"data-precedence":t.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),ye(l),Te(l,"style",u),en(l,t.precedence,e),a.instance=l;case"stylesheet":u=Kl(t.href);var o=e.querySelector(ro(u));if(o)return a.state.loading|=4,a.instance=o,ye(o),o;l=$p(t),(u=ca.get(u))&&Zi(l,u),o=(e.ownerDocument||e).createElement("link"),ye(o);var n=o;return n._p=new Promise(function(r,s){n.onload=r,n.onerror=s}),Te(o,"link",l),a.state.loading|=4,en(o,t.precedence,e),a.instance=o;case"script":return o=au(t.src),(u=e.querySelector(so(o)))?(a.instance=u,ye(u),u):(l=t,(u=ca.get(o))&&(l=te({},t),Qi(l,u)),e=e.ownerDocument||e,u=e.createElement("script"),ye(u),Te(u,"link",l),e.head.appendChild(u),a.instance=u);case"void":return null;default:throw Error(S(443,a.type))}else a.type==="stylesheet"&&(a.state.loading&4)===0&&(l=a.instance,a.state.loading|=4,en(l,t.precedence,e));return a.instance}function en(e,a,t){for(var l=t.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=l.length?l[l.length-1]:null,o=u,n=0;n<l.length;n++){var r=l[n];if(r.dataset.precedence===a)o=r;else if(o!==u)break}o?o.parentNode.insertBefore(e,o.nextSibling):(a=t.nodeType===9?t.head:t,a.insertBefore(e,a.firstChild))}function Zi(e,a){e.crossOrigin==null&&(e.crossOrigin=a.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=a.referrerPolicy),e.title==null&&(e.title=a.title)}function Qi(e,a){e.crossOrigin==null&&(e.crossOrigin=a.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=a.referrerPolicy),e.integrity==null&&(e.integrity=a.integrity)}var an=null;function pc(e,a,t){if(an===null){var l=new Map,u=an=new Map;u.set(t,l)}else u=an,l=u.get(t),l||(l=new Map,u.set(t,l));if(l.has(e))return l;for(l.set(e,null),t=t.getElementsByTagName(e),u=0;u<t.length;u++){var o=t[u];if(!(o[ao]||o[Ie]||e==="link"&&o.getAttribute("rel")==="stylesheet")&&o.namespaceURI!=="http://www.w3.org/2000/svg"){var n=o.getAttribute(a)||"";n=e+n;var r=l.get(n);r?r.push(o):l.set(n,[o])}}return l}function gc(e,a,t){e=e.ownerDocument||e,e.head.insertBefore(t,a==="title"?e.querySelector("head > title"):null)}function CS(e,a,t){if(t===1||a.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof a.precedence!="string"||typeof a.href!="string"||a.href==="")break;return!0;case"link":if(typeof a.rel!="string"||typeof a.href!="string"||a.href===""||a.onLoad||a.onError)break;return a.rel==="stylesheet"?(e=a.disabled,typeof a.precedence=="string"&&e==null):!0;case"script":if(a.async&&typeof a.async!="function"&&typeof a.async!="symbol"&&!a.onLoad&&!a.onError&&a.src&&typeof a.src=="string")return!0}return!1}function eg(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function bS(e,a,t,l){if(t.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(t.state.loading&4)===0){if(t.instance===null){var u=Kl(l.href),o=a.querySelector(ro(u));if(o){a=o._p,a!==null&&typeof a=="object"&&typeof a.then=="function"&&(e.count++,e=Dn.bind(e),a.then(e,e)),t.state.loading|=4,t.instance=o,ye(o);return}o=a.ownerDocument||a,l=$p(l),(u=ca.get(u))&&Zi(l,u),o=o.createElement("link"),ye(o);var n=o;n._p=new Promise(function(r,s){n.onload=r,n.onerror=s}),Te(o,"link",l),t.instance=o}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(t,a),(a=t.state.preload)&&(t.state.loading&3)===0&&(e.count++,t=Dn.bind(e),a.addEventListener("load",t),a.addEventListener("error",t))}}var is=0;function vS(e,a){return e.stylesheets&&e.count===0&&tn(e,e.stylesheets),0<e.count||0<e.imgCount?function(t){var l=setTimeout(function(){if(e.stylesheets&&tn(e,e.stylesheets),e.unsuspend){var o=e.unsuspend;e.unsuspend=null,o()}},6e4+a);0<e.imgBytes&&is===0&&(is=62500*lS());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&tn(e,e.stylesheets),e.unsuspend)){var o=e.unsuspend;e.unsuspend=null,o()}},(e.imgBytes>is?50:800)+a);return e.unsuspend=t,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(u)}}:null}function Dn(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)tn(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Rn=null;function tn(e,a){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Rn=new Map,a.forEach(IS,e),Rn=null,Dn.call(e))}function IS(e,a){if(!(a.state.loading&4)){var t=Rn.get(e);if(t)var l=t.get(null);else{t=new Map,Rn.set(e,t);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),o=0;o<u.length;o++){var n=u[o];(n.nodeName==="LINK"||n.getAttribute("media")!=="not all")&&(t.set(n.dataset.precedence,n),l=n)}l&&t.set(null,l)}u=a.instance,n=u.getAttribute("data-precedence"),o=t.get(n)||l,o===l&&t.set(null,u),t.set(n,u),this.count++,l=Dn.bind(this),u.addEventListener("load",l),u.addEventListener("error",l),o?o.parentNode.insertBefore(u,o.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),a.state.loading|=4}}var Yu={$$typeof:Na,Provider:null,Consumer:null,_currentValue:Vt,_currentValue2:Vt,_threadCount:0};function kS(e,a,t,l,u,o,n,r,s){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=qr(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=qr(0),this.hiddenUpdates=qr(null),this.identifierPrefix=l,this.onUncaughtError=u,this.onCaughtError=o,this.onRecoverableError=n,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=s,this.incompleteTransitions=new Map}function ag(e,a,t,l,u,o,n,r,s,i,p,g){return e=new kS(e,a,t,n,s,i,p,g,r),a=1,o===!0&&(a|=24),o=je(3,null,null,a),e.current=o,o.stateNode=e,a=bi(),a.refCount++,e.pooledCache=a,a.refCount++,o.memoizedState={element:l,isDehydrated:t,cache:a},ki(o),e}function tg(e){return e?(e=Tl,e):Tl}function lg(e,a,t,l,u,o){u=tg(u),l.context===null?l.context=u:l.pendingContext=u,l=ht(a),l.payload={element:t},o=o===void 0?null:o,o!==null&&(l.callback=o),t=xt(e,l,a),t!==null&&(_e(t,e,a),wu(t,e,a))}function hc(e,a){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var t=e.retryLane;e.retryLane=t!==0&&t<a?t:a}}function Ji(e,a){hc(e,a),(e=e.alternate)&&hc(e,a)}function ug(e){if(e.tag===13||e.tag===31){var a=ll(e,67108864);a!==null&&_e(a,e,67108864),Ji(e,67108864)}}function xc(e){if(e.tag===13||e.tag===31){var a=Je();a=si(a);var t=ll(e,a);t!==null&&_e(t,e,a),Ji(e,a)}}var Bn=!0;function AS(e,a,t,l){var u=R.T;R.T=null;var o=F.p;try{F.p=2,Wi(e,a,t,l)}finally{F.p=o,R.T=u}}function TS(e,a,t,l){var u=R.T;R.T=null;var o=F.p;try{F.p=8,Wi(e,a,t,l)}finally{F.p=o,R.T=u}}function Wi(e,a,t,l){if(Bn){var u=li(l);if(u===null)rs(e,a,l,En,t),Lc(e,l);else if(MS(u,e,a,t,l))l.stopPropagation();else if(Lc(e,l),a&4&&-1<wS.indexOf(e)){for(;u!==null;){var o=Ql(u);if(o!==null)switch(o.tag){case 3:if(o=o.stateNode,o.current.memoizedState.isDehydrated){var n=Pt(o.pendingLanes);if(n!==0){var r=o;for(r.pendingLanes|=2,r.entangledLanes|=2;n;){var s=1<<31-Qe(n);r.entanglements[1]|=s,n&=~s}Da(o),(P&6)===0&&(bn=Ye()+500,no(0,!1))}}break;case 31:case 13:r=ll(o,2),r!==null&&_e(r,o,2),jn(),Ji(o,2)}if(o=li(l),o===null&&rs(e,a,l,En,t),o===u)break;u=o}u!==null&&l.stopPropagation()}else rs(e,a,l,null,t)}}function li(e){return e=ci(e),$i(e)}var En=null;function $i(e){if(En=null,e=Cl(e),e!==null){var a=Ju(e);if(a===null)e=null;else{var t=a.tag;if(t===13){if(e=Ic(a),e!==null)return e;e=null}else if(t===31){if(e=kc(a),e!==null)return e;e=null}else if(t===3){if(a.stateNode.current.memoizedState.isDehydrated)return a.tag===3?a.stateNode.containerInfo:null;e=null}else a!==e&&(e=null)}}return En=e,null}function og(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(gx()){case Mc:return 2;case Dc:return 8;case rn:case hx:return 32;case Rc:return 268435456;default:return 32}default:return 32}}var ui=!1,yt=null,Ct=null,bt=null,Zu=new Map,Qu=new Map,st=[],wS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Lc(e,a){switch(e){case"focusin":case"focusout":yt=null;break;case"dragenter":case"dragleave":Ct=null;break;case"mouseover":case"mouseout":bt=null;break;case"pointerover":case"pointerout":Zu.delete(a.pointerId);break;case"gotpointercapture":case"lostpointercapture":Qu.delete(a.pointerId)}}function xu(e,a,t,l,u,o){return e===null||e.nativeEvent!==o?(e={blockedOn:a,domEventName:t,eventSystemFlags:l,nativeEvent:o,targetContainers:[u]},a!==null&&(a=Ql(a),a!==null&&ug(a)),e):(e.eventSystemFlags|=l,a=e.targetContainers,u!==null&&a.indexOf(u)===-1&&a.push(u),e)}function MS(e,a,t,l,u){switch(a){case"focusin":return yt=xu(yt,e,a,t,l,u),!0;case"dragenter":return Ct=xu(Ct,e,a,t,l,u),!0;case"mouseover":return bt=xu(bt,e,a,t,l,u),!0;case"pointerover":var o=u.pointerId;return Zu.set(o,xu(Zu.get(o)||null,e,a,t,l,u)),!0;case"gotpointercapture":return o=u.pointerId,Qu.set(o,xu(Qu.get(o)||null,e,a,t,l,u)),!0}return!1}function ng(e){var a=Cl(e.target);if(a!==null){var t=Ju(a);if(t!==null){if(a=t.tag,a===13){if(a=Ic(t),a!==null){e.blockedOn=a,ef(e.priority,function(){xc(t)});return}}else if(a===31){if(a=kc(t),a!==null){e.blockedOn=a,ef(e.priority,function(){xc(t)});return}}else if(a===3&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}e.blockedOn=null}function ln(e){if(e.blockedOn!==null)return!1;for(var a=e.targetContainers;0<a.length;){var t=li(e.nativeEvent);if(t===null){t=e.nativeEvent;var l=new t.constructor(t.type,t);bs=l,t.target.dispatchEvent(l),bs=null}else return a=Ql(t),a!==null&&ug(a),e.blockedOn=t,!1;a.shift()}return!0}function Sc(e,a,t){ln(e)&&t.delete(a)}function DS(){ui=!1,yt!==null&&ln(yt)&&(yt=null),Ct!==null&&ln(Ct)&&(Ct=null),bt!==null&&ln(bt)&&(bt=null),Zu.forEach(Sc),Qu.forEach(Sc)}function Po(e,a){e.blockedOn===a&&(e.blockedOn=null,ui||(ui=!0,ge.unstable_scheduleCallback(ge.unstable_NormalPriority,DS)))}var Fo=null;function yc(e){Fo!==e&&(Fo=e,ge.unstable_scheduleCallback(ge.unstable_NormalPriority,function(){Fo===e&&(Fo=null);for(var a=0;a<e.length;a+=3){var t=e[a],l=e[a+1],u=e[a+2];if(typeof l!="function"){if($i(l||t)===null)continue;break}var o=Ql(t);o!==null&&(e.splice(a,3),a-=3,zs(o,{pending:!0,data:u,method:t.method,action:l},l,u))}}))}function Yl(e){function a(s){return Po(s,e)}yt!==null&&Po(yt,e),Ct!==null&&Po(Ct,e),bt!==null&&Po(bt,e),Zu.forEach(a),Qu.forEach(a);for(var t=0;t<st.length;t++){var l=st[t];l.blockedOn===e&&(l.blockedOn=null)}for(;0<st.length&&(t=st[0],t.blockedOn===null);)ng(t),t.blockedOn===null&&st.shift();if(t=(e.ownerDocument||e).$$reactFormReplay,t!=null)for(l=0;l<t.length;l+=3){var u=t[l],o=t[l+1],n=u[Ne]||null;if(typeof o=="function")n||yc(t);else if(n){var r=null;if(o&&o.hasAttribute("formAction")){if(u=o,n=o[Ne]||null)r=n.formAction;else if($i(u)!==null)continue}else r=n.action;typeof r=="function"?t[l+1]=r:(t.splice(l,3),l-=3),yc(t)}}}function rg(){function e(o){o.canIntercept&&o.info==="react-transition"&&o.intercept({handler:function(){return new Promise(function(n){return u=n})},focusReset:"manual",scroll:"manual"})}function a(){u!==null&&(u(),u=null),l||setTimeout(t,20)}function t(){if(!l&&!navigation.transition){var o=navigation.currentEntry;o&&o.url!=null&&navigation.navigate(o.url,{state:o.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",a),navigation.addEventListener("navigateerror",a),setTimeout(t,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",a),navigation.removeEventListener("navigateerror",a),u!==null&&(u(),u=null)}}}function ed(e){this._internalRoot=e}Zn.prototype.render=ed.prototype.render=function(e){var a=this._internalRoot;if(a===null)throw Error(S(409));var t=a.current,l=Je();lg(t,l,e,a,null,null)};Zn.prototype.unmount=ed.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var a=e.containerInfo;lg(e.current,2,null,e,null,null),jn(),a[Zl]=null}};function Zn(e){this._internalRoot=e}Zn.prototype.unstable_scheduleHydration=function(e){if(e){var a=Hc();e={blockedOn:null,target:e,priority:a};for(var t=0;t<st.length&&a!==0&&a<st[t].priority;t++);st.splice(t,0,e),t===0&&ng(e)}};var Cc=bc.version;if(Cc!=="19.2.8")throw Error(S(527,Cc,"19.2.8"));F.findDOMNode=function(e){var a=e._reactInternals;if(a===void 0)throw typeof e.render=="function"?Error(S(188)):(e=Object.keys(e).join(","),Error(S(268,e)));return e=sx(a),e=e!==null?Ac(e):null,e=e===null?null:e.stateNode,e};var RS={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:R,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Lu=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Lu.isDisabled&&Lu.supportsFiber))try{Wu=Lu.inject(RS),Ze=Lu}catch{}var Lu;Qn.createRoot=function(e,a){if(!vc(e))throw Error(S(299));var t=!1,l="",u=Wm,o=$m,n=ep;return a!=null&&(a.unstable_strictMode===!0&&(t=!0),a.identifierPrefix!==void 0&&(l=a.identifierPrefix),a.onUncaughtError!==void 0&&(u=a.onUncaughtError),a.onCaughtError!==void 0&&(o=a.onCaughtError),a.onRecoverableError!==void 0&&(n=a.onRecoverableError)),a=ag(e,1,!1,null,null,t,l,null,u,o,n,rg),e[Zl]=a.current,Yi(e),new ed(a)};Qn.hydrateRoot=function(e,a,t){if(!vc(e))throw Error(S(299));var l=!1,u="",o=Wm,n=$m,r=ep,s=null;return t!=null&&(t.unstable_strictMode===!0&&(l=!0),t.identifierPrefix!==void 0&&(u=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(n=t.onCaughtError),t.onRecoverableError!==void 0&&(r=t.onRecoverableError),t.formState!==void 0&&(s=t.formState)),a=ag(e,1,!0,a,t??null,l,u,s,o,n,r,rg),a.context=tg(null),t=a.current,l=Je(),l=si(l),u=ht(l),u.callback=null,xt(t,u,l),t=l,a.current.lanes=t,eo(a,t),Da(a),e[Zl]=a.current,Yi(e),new Zn(a)};Qn.version="19.2.8"});var fg=va((BC,dg)=>{"use strict";function ig(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ig)}catch(e){console.error(e)}}ig(),dg.exports=sg()});var Wg=va(lr=>{"use strict";var Vy=Symbol.for("react.transitional.element"),Xy=Symbol.for("react.fragment");function Jg(e,a,t){var l=null;if(t!==void 0&&(l=""+t),a.key!==void 0&&(l=""+a.key),"key"in a){t={};for(var u in a)u!=="key"&&(t[u]=a[u])}else t=a;return a=t.ref,{$$typeof:Vy,type:e,key:l,ref:a!==void 0?a:null,props:t}}lr.Fragment=Xy;lr.jsx=Jg;lr.jsxs=Jg});var G=va((VC,$g)=>{"use strict";$g.exports=Wg()});function uC(){return sr||(sr=new CSSStyleSheet,sr.replaceSync(lC)),sr}function oC(){if(yh||document.getElementById("ext-pjs-font"))return;yh=!0;let e=document.createElement("link");e.id="ext-pjs-font",e.rel="stylesheet",e.href="http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",document.head.appendChild(e)}function ir(e,a="open"){let t=e.attachShadow({mode:a});return t.adoptedStyleSheets=[uC()],oC(),t}var tC,lC,sr,yh,dd=So(()=>{"use strict";tC='"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif',lC=`
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
    --ext-font-family: ${tC};
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
`,sr=null;yh=!1});var nC,fd,Ch=So(()=>{"use strict";dd();nC=`
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
`,fd=class extends HTMLElement{constructor(){super();this.handleKey=t=>{t.key==="Escape"&&this.hasAttribute("open")&&this.cancel()};this.root=ir(this),this.root.innerHTML=`
      <style>${nC}</style>
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
    `}connectedCallback(){let t=this.root.querySelector(".overlay");this.root.querySelector(".close").addEventListener("click",()=>this.cancel()),t.addEventListener("click",u=>{u.target===t&&this.cancel()}),document.addEventListener("keydown",this.handleKey)}disconnectedCallback(){document.removeEventListener("keydown",this.handleKey)}get titleSlot(){return this.querySelector('[slot="title"]')}get footerSlot(){return this.querySelector('[slot="footer"]')}open(){this.setAttribute("open","")}close(){this.removeAttribute("open")}cancel(){this.dispatchEvent(new CustomEvent("ext-cancel")),this.close()}ok(){this.dispatchEvent(new CustomEvent("ext-ok"))}};customElements.get("ext-modal")||customElements.define("ext-modal",fd)});var rC,cd,bh=So(()=>{"use strict";dd();rC=`
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
`,cd=class extends HTMLElement{constructor(){super();let a=ir(this);a.innerHTML=`
      <style>${rC}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `,this.btn=a.querySelector("button")}connectedCallback(){this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"),this.btn.addEventListener("click",a=>{if(this.hasAttribute("loading")||this.hasAttribute("disabled")){a.stopPropagation(),a.preventDefault();return}})}static get observedAttributes(){return["disabled","loading"]}attributeChangedCallback(a){(a==="disabled"||a==="loading")&&(this.btn.disabled=this.hasAttribute("disabled")||this.hasAttribute("loading"),this.btn.setAttribute("aria-busy",this.hasAttribute("loading")?"true":"false"))}};customElements.get("ext-btn")||customElements.define("ext-btn",cd)});var vh={};_h(vh,{confirmExt:()=>sC});function sC(e){return new Promise(a=>{let t=document.createElement("ext-modal");t.setAttribute("variant",e.variant??"warning"),e.okLabel&&t.setAttribute("ok-label",e.okLabel),e.cancelLabel&&t.setAttribute("cancel-label",e.cancelLabel),e.hideCancel&&t.setAttribute("hide-cancel",""),t.innerHTML=`<h3 slot="title"></h3><div class="ext-confirm-body"></div><div slot="footer">
         <ext-btn data-ext-confirm-cancel variant="secondary"></ext-btn>
         <ext-btn data-ext-confirm-ok></ext-btn>
       </div>`;let l=t.querySelector('[slot="title"]');l.textContent=e.title;let u=t.querySelector(".ext-confirm-body");if(e.icon){let r=document.createElement("div");r.className="ext-confirm-icon",r.textContent=e.icon,u.appendChild(r)}e.message&&e.message.split(`
`).forEach((s,i)=>{i>0&&u.appendChild(document.createElement("br")),u.appendChild(document.createTextNode(s))}),t.querySelector("[data-ext-confirm-ok]").textContent=e.okLabel??"Lanjut";let o=t.querySelector("[data-ext-confirm-ok]");o.setAttribute("variant",e.variant==="danger"?"danger":"primary"),e.hideCancel?t.querySelector("[data-ext-confirm-cancel]")?.remove():t.querySelector("[data-ext-confirm-cancel]").textContent=e.cancelLabel??"Batal",o.addEventListener("click",()=>t.ok()),e.hideCancel||t.querySelector("[data-ext-confirm-cancel]").addEventListener("click",()=>t.cancel());let n=r=>{t.remove(),a(r)};t.addEventListener("ext-ok",()=>n(!0)),t.addEventListener("ext-cancel",()=>n(!1)),document.body.appendChild(t),t.open()})}var Ih=So(()=>{"use strict";Ch();bh()});var vC={},Eh=q(fg(),1);var ba=q(Ge(),1);function ea(e){let a=e.trim();return a===""||/^[-–—]+$/.test(a)}var BS="http://dev.rsudkotajambi.id/rs",ES="ext-farmasi-app-base";var OS=["dev.rsudkotajambi.id","103.147.236.138","localhost","127.0.0.1"],qS=".rsudkotajambi.id";var cg="Fitur nonaktif: server Reports belum HTTPS";function Jn(e){try{return new URL(e??Wn()).protocol==="https:"?null:cg}catch{return cg}}function HS(e){try{let a=new URL(e);if(a.protocol!=="http:"&&a.protocol!=="https:")return!1;let t=a.hostname.toLowerCase();return OS.includes(t)?!0:t.endsWith(qS)}catch{return!1}}function Wn(){try{let e=localStorage.getItem(ES);if(e&&HS(e))return e.replace(/\/+$/,"")}catch{}return BS}async function US(e,a,t=fetch){let l=new AbortController,u=globalThis.setTimeout(()=>l.abort(),25e3);try{return await t(e,{...a,signal:l.signal})}finally{globalThis.clearTimeout(u)}}async function zS(e,a=fetch){try{let t=Wn(),l=Jn(t);if(l)return console.warn("[casemixApi]",l,"\u2014 baca pusat dilewati:",e),null;let u=await US(t+e,{cache:"no-store",credentials:"omit",headers:{Accept:"application/json"}},a);return u.ok?await u.json():null}catch{return null}}async function mg(e,a,t=fetch){if(!e)return[];let l="/api/reports/resume-history?id_visit="+encodeURIComponent(e)+(a?"&tipe="+a:""),u=await zS(l,t);return!u?.ok||!Array.isArray(u.data)?[]:u.data}function _S(){try{let e=globalThis.crypto;if(e&&typeof e.randomUUID=="function")return e.randomUUID()}catch{}return`${Date.now().toString(36)}-${Math.floor(Math.random()*1e9).toString(36)}`}function ol(){try{if(typeof window<"u"&&window.localStorage)return window.localStorage}catch{}return null}var yg="ext_rv_history_",NS=yg,Cg="ext_rv_lastform_",PS="ext_migrated_rv_",bg=50;function td(e,a){return`${yg}${a==="ranap"?"ri":"rj"}_${e||"unknown"}`}function vg(e,a){return`${Cg}${a==="ranap"?"ri":"rj"}_${e||"unknown"}`}function $n(e,a){if(!e)return null;try{let t=e.getItem(a);return t?JSON.parse(t):null}catch{return null}}function ld(e,a,t){if(e)try{e.setItem(a,JSON.stringify(t))}catch{}}function FS(e,a){return JSON.stringify(e??null)===JSON.stringify(a??null)}function Ig(e,a){let t={};return Object.keys(e).forEach(l=>t[l]=!0),Object.keys(a).forEach(l=>t[l]=!0),Object.keys(t).filter(l=>!FS(e[l],a[l]))}function pg(e){let a=e===void 0?"-":JSON.stringify(e);return a.length>60?a.slice(0,60)+"\u2026":a}function ad(e,a,t=ol()){let l=$n(t,td(e,a)),u=Array.isArray(l)?l:[];if(a==="ranap"){let o=$n(t,NS+e);if(Array.isArray(o)&&o.length>0&&u.length===0){let n=o.map(r=>({...r,tipe:"ranap"}));return ud(n,e,"ranap",t),n}}return u}function ud(e,a,t,l=ol()){ld(l,td(a,t),e.slice(-bg))}function kg(e,a,t=ol()){let l=$n(t,vg(e,a));return l||(a==="ranap"?$n(t,Cg+e):null)}function gg(e,a,t,l=ol()){ld(l,vg(a,t),e)}function GS(){try{let e=document.getElementById("userpanel");if(e){let o="",n="";if(e.querySelectorAll(".subgroup").forEach(i=>{let p=(i.querySelector(".subtitle")?.textContent||"").trim().toLowerCase(),g=(i.querySelector(".subcontent")?.textContent||"").trim();p==="username"&&g&&(o=g),p==="role"&&g&&(n=g)}),o)return`${o}${n?` (${n})`:""}`;let s=(e.querySelector("a")?.textContent||"").trim();if(s&&s!=="Petugas Rumah Sakit")return s}let t=(document.querySelector("#petugas, .petugas, .username, #username, .user-name")?.textContent||"").trim();if(t)return t.slice(0,80);let l=document.querySelector('input[name="dokter"], #dokter, input[name="nama_dokter"]')?.value?.trim();if(l)return l.slice(0,80);let u=document.querySelector('input[name="id_user"], #id_user')?.value?.trim();if(u)return`User #${u}`}catch{}return"petugas"}var VS="/api/reports/resume-history";function XS(){return Wn()}function jS(e){return PS+e}function KS(e,a){if(!e)return 0;try{let t=e.getItem(a);if(t===null)return 0;let l=Number(JSON.parse(t));return Number.isFinite(l)?l:0}catch{return 0}}function YS(e,a,t,l){if(!(!e||!a))try{let u=jS(td(a,t));l>KS(e,u)&&ld(e,u,l)}catch{}}function ZS(e,a,t=fetch,l=ol(),u=e.tipe){let o={client_id:e.client_id??null,id_visit:a,id_resume:e.id_resume,aksi:e.aksi,tipe:e.tipe,waktu:new Date(e.at).toISOString(),user:e.user,before:e.before,after:e.after,changed:e.changed},n=async()=>{try{let r=XS(),s=Jn(r);return s?(console.warn("[resumeHistory]",s,"\u2014 kirim resume dilewati:",a),!1):(await t(r+VS,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(o),keepalive:!0,credentials:"omit"})).ok?(YS(l,a,u,e.at),!0):!1}catch{return!1}};try{return n()}catch{return Promise.resolve(!1)}}var hg=null,xg=0;function Ag(e){if(!e.idVisit)return null;let a=e.now??Date.now(),t=e.store??ol();gg(e.after,e.idVisit,e.tipe,t);let l=JSON.stringify([e.idVisit,e.aksi,e.after]);if(hg===l&&a-xg<5e3)return null;hg=l,xg=a;let u={at:a,aksi:e.aksi,id_resume:e.idResume??"",user:e.user??GS(),tipe:e.tipe,before:e.before??{},after:e.after,changed:Ig(e.before??{},e.after),client_id:_S()},o=ad(e.idVisit,e.tipe,t);o.push(u),ud(o,e.idVisit,e.tipe,t),gg(e.after,e.idVisit,e.tipe,t);try{ZS(u,e.idVisit,e.fetcher??fetch,t,e.tipe)}catch{}return u}function QS(e){if(e!=null){if(typeof e=="string")return e;if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e))return e.map(a=>{if(typeof a=="string")return a;try{return JSON.stringify(a)??""}catch{return""}});try{return JSON.stringify(e)??""}catch{return""}}}function Lg(e){let a={};if(!e||typeof e!="object"||Array.isArray(e))return a;for(let t of Object.keys(e)){let l=QS(e[t]);l!==void 0&&(a[t]=l)}return a}function JS(e,a){try{if(!e||typeof e!="object")return null;let t=e.waktu?Date.parse(e.waktu):NaN;if(!Number.isFinite(t))return null;let l=Lg(e.after),u=Lg(e.before),o=e.tipe==="rajal"?"rajal":e.tipe==="ranap"?"ranap":a,n=Array.isArray(e.changed)?e.changed.filter(s=>typeof s=="string"):Ig(u,l),r=typeof e.client_id=="string"&&e.client_id?e.client_id:void 0;return{at:t,aksi:e.aksi==="buat"?"buat":"ubah",id_resume:typeof e.id_resume=="string"?e.id_resume:"",user:typeof e.user=="string"&&e.user?e.user:"petugas",tipe:o,before:u,after:l,changed:n,...r?{client_id:r}:{}}}catch{return null}}function Sg(e){if(e.client_id)return"cid:"+e.client_id;try{return"h:"+e.at+"|"+e.user+"|"+e.aksi+"|"+JSON.stringify(e.after)}catch{return"h:"+e.at+"|"+e.user+"|"+e.aksi}}function WS(e,a){let t=new Set(e.map(Sg)),l=e.slice();for(let u of a){let o=Sg(u);t.has(o)||(t.add(o),l.push(u))}return l.sort((u,o)=>u.at-o.at),l.slice(-bg)}var $S="'Roboto','Segoe UI',system-ui,-apple-system,Arial,sans-serif";function Tg(e){try{document.querySelector("#ext-rv-history-overlay")?.remove()}catch{}let a=e.store??ol(),t=ad(e.idVisit,e.tipe,a).slice().reverse(),l=e.zIndex??99998,u=document.createElement("div");u.id="ext-rv-history-overlay",u.style.cssText=`position:fixed;inset:0;z-index:${l};background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:24px;`,u.addEventListener("click",function(g){g.target===u&&u.remove()});let o=document.createElement("div");o.style.cssText="background:#fff;border-radius:12px;max-width:680px;width:100%;max-height:82vh;display:flex;flex-direction:column;overflow:hidden;font-size:16px!important;line-height:1.6!important;color:#1c2530;font-family:"+$S+"!important;",u.appendChild(o);let n=document.createElement("div");n.style.cssText="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #d0d5dd;font-weight:700;";let r=document.createElement("span");r.textContent=`${e.title??"Riwayat Resume"} (${t.length})`,n.appendChild(r);let s=document.createElement("button");s.type="button",s.textContent="\xD7",s.style.cssText="border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;font-family:inherit!important;font-size:16px!important;line-height:1!important;cursor:pointer;",s.onclick=function(){u.remove()},n.appendChild(s),o.appendChild(n);let i=document.createElement("div");i.style.cssText="padding:14px 18px;overflow-y:auto;",o.appendChild(i);let p=g=>{if(t=g,r.textContent=`${e.title??"Riwayat Resume"} (${t.length})`,i.replaceChildren(),!t.length){i.textContent="Belum ada riwayat untuk kunjungan ini. Riwayat tercatat otomatis setiap kali Simpan ditekan.";return}t.forEach(function(c,m){let L=t.length-m,y=document.createElement("div");y.style.cssText="border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;";let k=document.createElement("div");k.style.fontWeight="600";let h=c.user?` \u2014 oleh ${c.user}`:"";k.textContent=`#${L} \u2014 ${new Date(c.at).toLocaleString("id-ID")} \u2014 ${c.aksi==="buat"?"Buat baru":"Ubah"}${h} \u2014 ${c.changed.length} field berubah`,y.appendChild(k);let d=document.createElement("div");d.style.cssText="display:none;margin-top:8px;background:#f8fafc;border-radius:6px;padding:8px 10px;font-size:13px;line-height:1.6;max-height:180px;overflow-y:auto;white-space:pre-wrap;",c.changed.length?d.textContent=c.changed.map(function(w){return w+": "+pg(c.before[w])+" \u2192 "+pg(c.after[w])}).join(`
`):d.textContent="Tidak ada perbedaan field.",y.appendChild(d);let f=document.createElement("div");f.style.cssText="margin-top:8px;display:flex;gap:8px;";let x=document.createElement("button");x.type="button",x.textContent="Lihat",x.style.cssText="border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;",x.onclick=function(){d.style.display=d.style.display==="none"?"block":"none"},f.appendChild(x);let b=document.createElement("button");b.type="button",b.textContent="Salin ke Form",b.style.cssText="background:#00875a;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;",b.onclick=function(){try{e.onApply(c.after),u.remove()}catch{}},f.appendChild(b),y.appendChild(f),i.appendChild(y)})};p(t);try{document.body.appendChild(u)}catch{}if(e.idVisit){let g=Jn();if(g)try{let c=document.createElement("div");c.textContent=g+" \u2014 riwayat hanya dari PC ini.",c.style.cssText="margin-top:10px;padding:8px 10px;background:#fef3c7;color:#92400e;border-radius:6px;font-size:13px;line-height:1.5;",i.appendChild(c)}catch{}else try{mg(e.idVisit,e.tipe).then(c=>{try{if(!c.length||!u.isConnected)return;let m=[];for(let k of c){let h=JS(k,e.tipe);h&&m.push(h)}if(!m.length)return;let L=ad(e.idVisit,e.tipe,a),y=WS(L,m);if(y.length===L.length)return;ud(y,e.idVisit,e.tipe,a),p(y.slice().reverse());try{document.dispatchEvent(new CustomEvent("ext-rv-history-merged",{detail:{idVisit:e.idVisit,tipe:e.tipe,count:y.length}}))}catch{}}catch{}})}catch{}}}function be(e,a){let t=e[a];return Array.isArray(t)?t:t===void 0?[]:[t]}function Fe(e,a){let t=e[a];return typeof t=="string"?t:Array.isArray(t)?t[0]??"":""}function wg(e){let a=e.clinicalNotes,t=e.vitalSigns,l={anamnesa:a.anamnesa,pemeriksaan_fisik:a.pemeriksaan_fisik,catatan:a.catatan,tindakan:a.tindakan,terapi_pengobatan:a.terapi_pengobatan,tensi:t.tensi,nadi:t.nadi,suhu:t.suhu,nafas:t.nafas,tinggi:t.tinggi,berat:t.berat},u=a;for(let o of["jenis_kasus","status_kasus","tindak_lanjut"])u[o]&&(l[o]=u[o]);return l["kode10[]"]=e.diagnosa.map(o=>o.kode10),l["idicd[]"]=e.diagnosa.map(o=>o.idicd),l["nama[]"]=e.diagnosa.map(o=>o.namaDiagnosa),l["kasus_diagnosa[]"]=e.diagnosa.map(o=>o.kasus),l["komplikasi[]"]=e.diagnosa.map(o=>o.komplikasi),l["kode9[]"]=e.tindakan.map(o=>o.kode9),l["idicdTindakan[]"]=e.tindakan.map(o=>o.idicdTindakan),l["namaTindakan[]"]=e.tindakan.map(o=>o.namaTindakan),l["komorbid[]"]=e.tindakan.map(o=>o.komorbid),l["kategoriProsedur[]"]=e.tindakan.map(o=>o.kategoriProsedur),l["snomedProsedur[]"]=e.tindakan.map(o=>o.snomedProsedur),l["codeProsedur[]"]=e.tindakan.map(o=>o.codeProsedur),l}function Mg(e,a){let t=Math.max(be(e,"kode10[]").length,be(e,"idicd[]").length,be(e,"nama[]").length),l=[];for(let n=0;n<t;n++){let r=be(e,"idicd[]")[n]??"",s=be(e,"kode10[]")[n]??"",i=be(e,"nama[]")[n]??"";!r&&!s&&!i||l.push({idicd:r,kode10:s,namaDiagnosa:i,kasus:be(e,"kasus_diagnosa[]")[n]??"",komplikasi:be(e,"komplikasi[]")[n]??""})}let u=Math.max(be(e,"kode9[]").length,be(e,"idicdTindakan[]").length,be(e,"namaTindakan[]").length),o=[];for(let n=0;n<u;n++){let r=be(e,"idicdTindakan[]")[n]??"",s=be(e,"kode9[]")[n]??"",i=be(e,"namaTindakan[]")[n]??"";!r&&!s&&!i||o.push({idicdTindakan:r,kode9:s,namaTindakan:i,komorbid:be(e,"komorbid[]")[n]??"",kategoriProsedur:be(e,"kategoriProsedur[]")[n]??"",snomedProsedur:be(e,"snomedProsedur[]")[n]??"",codeProsedur:be(e,"codeProsedur[]")[n]??""})}return{patientInfo:a.patientInfo,clinicalNotes:{anamnesa:Fe(e,"anamnesa"),pemeriksaan_fisik:Fe(e,"pemeriksaan_fisik"),catatan:Fe(e,"catatan"),tindakan:Fe(e,"tindakan"),terapi_pengobatan:Fe(e,"terapi_pengobatan"),jenis_kasus:Fe(e,"jenis_kasus"),status_kasus:Fe(e,"status_kasus"),tindak_lanjut:Fe(e,"tindak_lanjut")},vitalSigns:{tensi:Fe(e,"tensi"),nadi:Fe(e,"nadi"),suhu:Fe(e,"suhu"),nafas:Fe(e,"nafas"),tinggi:Fe(e,"tinggi"),berat:Fe(e,"berat")},diagnosa:l,tindakan:o}}var tu=q(Ge(),1);function Dg(e){var a,t,l="";if(typeof e=="string"||typeof e=="number")l+=e;else if(typeof e=="object")if(Array.isArray(e)){var u=e.length;for(a=0;a<u;a++)e[a]&&(t=Dg(e[a]))&&(l&&(l+=" "),l+=t)}else for(t in e)e[t]&&(l&&(l+=" "),l+=t);return l}function er(){for(var e,a,t=0,l="",u=arguments.length;t<u;t++)(e=arguments[t])&&(a=Dg(e))&&(l&&(l+=" "),l+=a);return l}var ey=(e,a)=>{let t=new Array(e.length+a.length);for(let l=0;l<e.length;l++)t[l]=e[l];for(let l=0;l<a.length;l++)t[e.length+l]=a[l];return t},ay=(e,a)=>({classGroupId:e,validator:a}),Hg=(e=new Map,a=null,t)=>({nextPart:e,validators:a,classGroupId:t});var Rg=[],ty="arbitrary..",ly=e=>{let a=oy(e),{conflictingClassGroups:t,conflictingClassGroupModifiers:l}=e;return{getClassGroupId:n=>{if(n.startsWith("[")&&n.endsWith("]"))return uy(n);let r=n.split("-"),s=r[0]===""&&r.length>1?1:0;return Ug(r,s,a)},getConflictingClassGroupIds:(n,r)=>{if(r){let s=l[n],i=t[n];return s?i?ey(i,s):s:i||Rg}return t[n]||Rg}}},Ug=(e,a,t)=>{if(e.length-a===0)return t.classGroupId;let u=e[a],o=t.nextPart.get(u);if(o){let i=Ug(e,a+1,o);if(i)return i}let n=t.validators;if(n===null)return;let r=a===0?e.join("-"):e.slice(a).join("-"),s=n.length;for(let i=0;i<s;i++){let p=n[i];if(p.validator(r))return p.classGroupId}},uy=e=>e.slice(1,-1).indexOf(":")===-1?void 0:(()=>{let a=e.slice(1,-1),t=a.indexOf(":"),l=a.slice(0,t);return l?ty+l:void 0})(),oy=e=>{let{theme:a,classGroups:t}=e;return ny(t,a)},ny=(e,a)=>{let t=Hg();for(let l in e){let u=e[l];nd(u,t,l,a)}return t},nd=(e,a,t,l)=>{let u=e.length;for(let o=0;o<u;o++){let n=e[o];ry(n,a,t,l)}},ry=(e,a,t,l)=>{if(typeof e=="string"){sy(e,a,t);return}if(typeof e=="function"){iy(e,a,t,l);return}dy(e,a,t,l)},sy=(e,a,t)=>{let l=e===""?a:zg(a,e);l.classGroupId=t},iy=(e,a,t,l)=>{if(fy(e)){nd(e(l),a,t,l);return}a.validators===null&&(a.validators=[]),a.validators.push(ay(t,e))},dy=(e,a,t,l)=>{let u=Object.entries(e),o=u.length;for(let n=0;n<o;n++){let[r,s]=u[n];nd(s,zg(a,r),t,l)}},zg=(e,a)=>{let t=e,l=a.split("-"),u=l.length;for(let o=0;o<u;o++){let n=l[o],r=t.nextPart.get(n);r||(r=Hg(),t.nextPart.set(n,r)),t=r}return t},fy=e=>"isThemeGetter"in e&&e.isThemeGetter===!0,cy=e=>{if(e<1)return{get:()=>{},set:()=>{}};let a=0,t=Object.create(null),l=Object.create(null),u=(o,n)=>{t[o]=n,a++,a>e&&(a=0,l=t,t=Object.create(null))};return{get(o){let n=t[o];if(n!==void 0)return n;if((n=l[o])!==void 0)return u(o,n),n},set(o,n){o in t?t[o]=n:u(o,n)}}};var my=[],Bg=(e,a,t,l,u)=>({modifiers:e,hasImportantModifier:a,baseClassName:t,maybePostfixModifierPosition:l,isExternal:u}),py=e=>{let{prefix:a,experimentalParseClassName:t}=e,l=u=>{let o=[],n=0,r=0,s=0,i,p=u.length;for(let y=0;y<p;y++){let k=u[y];if(n===0&&r===0){if(k===":"){o.push(u.slice(s,y)),s=y+1;continue}if(k==="/"){i=y;continue}}k==="["?n++:k==="]"?n--:k==="("?r++:k===")"&&r--}let g=o.length===0?u:u.slice(s),c=g,m=!1;g.endsWith("!")?(c=g.slice(0,-1),m=!0):g.startsWith("!")&&(c=g.slice(1),m=!0);let L=i&&i>s?i-s:void 0;return Bg(o,m,c,L)};if(a){let u=a+":",o=l;l=n=>n.startsWith(u)?o(n.slice(u.length)):Bg(my,!1,n,void 0,!0)}if(t){let u=l;l=o=>t({className:o,parseClassName:u})}return l},gy=e=>{let a=new Map;return e.orderSensitiveModifiers.forEach((t,l)=>{a.set(t,1e6+l)}),t=>{let l=[],u=[];for(let o=0;o<t.length;o++){let n=t[o],r=n[0]==="[",s=a.has(n);r||s?(u.length>0&&(u.sort(),l.push(...u),u=[]),l.push(n)):u.push(n)}return u.length>0&&(u.sort(),l.push(...u)),l}},hy=e=>({cache:cy(e.cacheSize),parseClassName:py(e),sortModifiers:gy(e),postfixLookupClassGroupIds:xy(e),...ly(e)}),xy=e=>{let a=Object.create(null),t=e.postfixLookupClassGroups;if(t)for(let l=0;l<t.length;l++)a[t[l]]=!0;return a},Ly=/\s+/,Sy=(e,a)=>{let{parseClassName:t,getClassGroupId:l,getConflictingClassGroupIds:u,sortModifiers:o,postfixLookupClassGroupIds:n}=a,r=[],s=e.trim().split(Ly),i="";for(let p=s.length-1;p>=0;p-=1){let g=s[p],{isExternal:c,modifiers:m,hasImportantModifier:L,baseClassName:y,maybePostfixModifierPosition:k}=t(g);if(c){i=g+(i.length>0?" "+i:i);continue}let h=!!k,d;if(h){let I=y.substring(0,k);d=l(I);let C=d&&n[d]?l(y):void 0;C&&C!==d&&(d=C,h=!1)}else d=l(y);if(!d){if(!h){i=g+(i.length>0?" "+i:i);continue}if(d=l(y),!d){i=g+(i.length>0?" "+i:i);continue}h=!1}let f=m.length===0?"":m.length===1?m[0]:o(m).join(":"),x=L?f+"!":f,b=x+d;if(r.indexOf(b)>-1)continue;r.push(b);let w=u(d,h);for(let I=0;I<w.length;++I){let C=w[I];r.push(x+C)}i=g+(i.length>0?" "+i:i)}return i},yy=(...e)=>{let a=0,t,l,u="";for(;a<e.length;)(t=e[a++])&&(l=_g(t))&&(u&&(u+=" "),u+=l);return u},_g=e=>{if(typeof e=="string")return e;let a,t="";for(let l=0;l<e.length;l++)e[l]&&(a=_g(e[l]))&&(t&&(t+=" "),t+=a);return t},Cy=(e,...a)=>{let t,l,u,o,n=s=>{let i=a.reduce((p,g)=>g(p),e());return t=hy(i),l=t.cache.get,u=t.cache.set,o=r,r(s)},r=s=>{let i=l(s);if(i)return i;let p=Sy(s,t);return u(s,p),p};return o=n,(...s)=>o(yy(...s))},by=[],he=e=>{let a=t=>t[e]||by;return a.isThemeGetter=!0,a},Ng=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Pg=/^\((?:(\w[\w-]*):)?(.+)\)$/i,vy=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,Iy=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,ky=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,Ay=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,Ty=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,wy=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,Mt=e=>vy.test(e),H=e=>!!e&&!Number.isNaN(Number(e)),Ra=e=>!!e&&Number.isInteger(Number(e)),od=e=>e.endsWith("%")&&H(e.slice(0,-1)),Wa=e=>Iy.test(e),Fg=()=>!0,My=e=>ky.test(e)&&!Ay.test(e),rd=()=>!1,Dy=e=>Ty.test(e),Ry=e=>wy.test(e),By=e=>!A(e)&&!T(e),Ey=e=>e.startsWith("@container")&&(e[10]==="/"&&e[11]!==void 0||e[11]==="s"&&e[16]!==void 0&&e.startsWith("-size/",10)||e[11]==="n"&&e[18]!==void 0&&e.startsWith("-normal/",10)),Oy=e=>Dt(e,Xg,rd),A=e=>Ng.test(e),nl=e=>Dt(e,jg,My),Eg=e=>Dt(e,Fy,H),qy=e=>Dt(e,Yg,Fg),Hy=e=>Dt(e,Kg,rd),Og=e=>Dt(e,Gg,rd),Uy=e=>Dt(e,Vg,Ry),ar=e=>Dt(e,Zg,Dy),T=e=>Pg.test(e),io=e=>rl(e,jg),zy=e=>rl(e,Kg),qg=e=>rl(e,Gg),_y=e=>rl(e,Xg),Ny=e=>rl(e,Vg),tr=e=>rl(e,Zg,!0),Py=e=>rl(e,Yg,!0),Dt=(e,a,t)=>{let l=Ng.exec(e);return l?l[1]?a(l[1]):t(l[2]):!1},rl=(e,a,t=!1)=>{let l=Pg.exec(e);return l?l[1]?a(l[1]):t:!1},Gg=e=>e==="position"||e==="percentage",Vg=e=>e==="image"||e==="url",Xg=e=>e==="length"||e==="size"||e==="bg-size",jg=e=>e==="length",Fy=e=>e==="number",Kg=e=>e==="family-name",Yg=e=>e==="number"||e==="weight",Zg=e=>e==="shadow";var Gy=()=>{let e=he("color"),a=he("font"),t=he("text"),l=he("font-weight"),u=he("tracking"),o=he("leading"),n=he("breakpoint"),r=he("container"),s=he("spacing"),i=he("radius"),p=he("shadow"),g=he("inset-shadow"),c=he("text-shadow"),m=he("drop-shadow"),L=he("blur"),y=he("perspective"),k=he("aspect"),h=he("ease"),d=he("animate"),f=()=>["auto","avoid","all","avoid-page","page","left","right","column"],x=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],b=()=>[...x(),T,A],w=()=>["auto","hidden","clip","visible","scroll"],I=()=>["auto","contain","none"],C=()=>[T,A,s],v=()=>[Mt,"full","auto",...C()],M=()=>[Ra,"none","subgrid",T,A],oe=()=>["auto",{span:["full",Ra,T,A]},Ra,T,A],aa=()=>[Ra,"auto",T,A],sl=()=>["auto","min","max","fr",T,A],fr=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],il=()=>["start","end","center","stretch","center-safe","end-safe"],ha=()=>["auto",...C()],zt=()=>[Mt,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...C()],cr=()=>[Mt,"screen","full","dvw","lvw","svw","min","max","fit",...C()],mr=()=>[Mt,"screen","full","lh","dvh","lvh","svh","min","max","fit",...C()],D=()=>[e,T,A],gd=()=>[...x(),qg,Og,{position:[T,A]}],hd=()=>["no-repeat",{repeat:["","x","y","space","round"]}],xd=()=>["auto","cover","contain",_y,Oy,{size:[T,A]}],pr=()=>[od,io,nl],De=()=>["","none","full",i,T,A],Re=()=>["",H,io,nl],po=()=>["solid","dashed","dotted","double"],Ld=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],Le=()=>[H,od,qg,Og],Sd=()=>["","none",L,T,A],go=()=>["none",H,T,A],ho=()=>["none",H,T,A],gr=()=>[H,T,A],xo=()=>[Mt,"full",...C()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[Wa],breakpoint:[Wa],color:[Fg],container:[Wa],"drop-shadow":[Wa],ease:["in","out","in-out"],font:[By],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[Wa],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[Wa],shadow:[Wa],spacing:["px",H],text:[Wa],"text-shadow":[Wa],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",Mt,A,T,k]}],container:["container"],"container-type":[{"@container":["","normal","size",T,A]}],"container-named":[Ey],columns:[{columns:[H,A,T,r]}],"break-after":[{"break-after":f()}],"break-before":[{"break-before":f()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:b()}],overflow:[{overflow:w()}],"overflow-x":[{"overflow-x":w()}],"overflow-y":[{"overflow-y":w()}],overscroll:[{overscroll:I()}],"overscroll-x":[{"overscroll-x":I()}],"overscroll-y":[{"overscroll-y":I()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:v()}],"inset-x":[{"inset-x":v()}],"inset-y":[{"inset-y":v()}],start:[{"inset-s":v(),start:v()}],end:[{"inset-e":v(),end:v()}],"inset-bs":[{"inset-bs":v()}],"inset-be":[{"inset-be":v()}],top:[{top:v()}],right:[{right:v()}],bottom:[{bottom:v()}],left:[{left:v()}],visibility:["visible","invisible","collapse"],z:[{z:[Ra,"auto",T,A]}],basis:[{basis:[Mt,"full","auto",r,...C()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[H,Mt,"auto","initial","none",A]}],grow:[{grow:["",H,T,A]}],shrink:[{shrink:["",H,T,A]}],order:[{order:[Ra,"first","last","none",T,A]}],"grid-cols":[{"grid-cols":M()}],"col-start-end":[{col:oe()}],"col-start":[{"col-start":aa()}],"col-end":[{"col-end":aa()}],"grid-rows":[{"grid-rows":M()}],"row-start-end":[{row:oe()}],"row-start":[{"row-start":aa()}],"row-end":[{"row-end":aa()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":sl()}],"auto-rows":[{"auto-rows":sl()}],gap:[{gap:C()}],"gap-x":[{"gap-x":C()}],"gap-y":[{"gap-y":C()}],"justify-content":[{justify:[...fr(),"normal"]}],"justify-items":[{"justify-items":[...il(),"normal"]}],"justify-self":[{"justify-self":["auto",...il()]}],"align-content":[{content:["normal",...fr()]}],"align-items":[{items:[...il(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...il(),{baseline:["","last"]}]}],"place-content":[{"place-content":fr()}],"place-items":[{"place-items":[...il(),"baseline"]}],"place-self":[{"place-self":["auto",...il()]}],p:[{p:C()}],px:[{px:C()}],py:[{py:C()}],ps:[{ps:C()}],pe:[{pe:C()}],pbs:[{pbs:C()}],pbe:[{pbe:C()}],pt:[{pt:C()}],pr:[{pr:C()}],pb:[{pb:C()}],pl:[{pl:C()}],m:[{m:ha()}],mx:[{mx:ha()}],my:[{my:ha()}],ms:[{ms:ha()}],me:[{me:ha()}],mbs:[{mbs:ha()}],mbe:[{mbe:ha()}],mt:[{mt:ha()}],mr:[{mr:ha()}],mb:[{mb:ha()}],ml:[{ml:ha()}],"space-x":[{"space-x":C()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":C()}],"space-y-reverse":["space-y-reverse"],size:[{size:zt()}],"inline-size":[{inline:["auto",...cr()]}],"min-inline-size":[{"min-inline":["auto",...cr()]}],"max-inline-size":[{"max-inline":["none",...cr()]}],"block-size":[{block:["auto",...mr()]}],"min-block-size":[{"min-block":["auto",...mr()]}],"max-block-size":[{"max-block":["none",...mr()]}],w:[{w:[r,"screen",...zt()]}],"min-w":[{"min-w":[r,"screen","none",...zt()]}],"max-w":[{"max-w":[r,"screen","none","prose",{screen:[n]},...zt()]}],h:[{h:["screen","lh",...zt()]}],"min-h":[{"min-h":["screen","lh","none",...zt()]}],"max-h":[{"max-h":["screen","lh",...zt()]}],"font-size":[{text:["base",t,io,nl]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[l,Py,qy]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",od,A]}],"font-family":[{font:[zy,Hy,a]}],"font-features":[{"font-features":[A]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[u,T,A]}],"line-clamp":[{"line-clamp":[H,"none",T,Eg]}],leading:[{leading:[o,...C()]}],"list-image":[{"list-image":["none",T,A]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",T,A]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:D()}],"text-color":[{text:D()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...po(),"wavy"]}],"text-decoration-thickness":[{decoration:[H,"from-font","auto",T,nl]}],"text-decoration-color":[{decoration:D()}],"underline-offset":[{"underline-offset":[H,"auto",T,A]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:C()}],"tab-size":[{tab:[Ra,T,A]}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",T,A]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",T,A]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:gd()}],"bg-repeat":[{bg:hd()}],"bg-size":[{bg:xd()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},Ra,T,A],radial:["",T,A],conic:[Ra,T,A]},Ny,Uy]}],"bg-color":[{bg:D()}],"gradient-from-pos":[{from:pr()}],"gradient-via-pos":[{via:pr()}],"gradient-to-pos":[{to:pr()}],"gradient-from":[{from:D()}],"gradient-via":[{via:D()}],"gradient-to":[{to:D()}],rounded:[{rounded:De()}],"rounded-s":[{"rounded-s":De()}],"rounded-e":[{"rounded-e":De()}],"rounded-t":[{"rounded-t":De()}],"rounded-r":[{"rounded-r":De()}],"rounded-b":[{"rounded-b":De()}],"rounded-l":[{"rounded-l":De()}],"rounded-ss":[{"rounded-ss":De()}],"rounded-se":[{"rounded-se":De()}],"rounded-ee":[{"rounded-ee":De()}],"rounded-es":[{"rounded-es":De()}],"rounded-tl":[{"rounded-tl":De()}],"rounded-tr":[{"rounded-tr":De()}],"rounded-br":[{"rounded-br":De()}],"rounded-bl":[{"rounded-bl":De()}],"border-w":[{border:Re()}],"border-w-x":[{"border-x":Re()}],"border-w-y":[{"border-y":Re()}],"border-w-s":[{"border-s":Re()}],"border-w-e":[{"border-e":Re()}],"border-w-bs":[{"border-bs":Re()}],"border-w-be":[{"border-be":Re()}],"border-w-t":[{"border-t":Re()}],"border-w-r":[{"border-r":Re()}],"border-w-b":[{"border-b":Re()}],"border-w-l":[{"border-l":Re()}],"divide-x":[{"divide-x":Re()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":Re()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...po(),"hidden","none"]}],"divide-style":[{divide:[...po(),"hidden","none"]}],"border-color":[{border:D()}],"border-color-x":[{"border-x":D()}],"border-color-y":[{"border-y":D()}],"border-color-s":[{"border-s":D()}],"border-color-e":[{"border-e":D()}],"border-color-bs":[{"border-bs":D()}],"border-color-be":[{"border-be":D()}],"border-color-t":[{"border-t":D()}],"border-color-r":[{"border-r":D()}],"border-color-b":[{"border-b":D()}],"border-color-l":[{"border-l":D()}],"divide-color":[{divide:D()}],"outline-style":[{outline:[...po(),"none","hidden"]}],"outline-offset":[{"outline-offset":[H,T,A]}],"outline-w":[{outline:["",H,io,nl]}],"outline-color":[{outline:D()}],shadow:[{shadow:["","none",p,tr,ar]}],"shadow-color":[{shadow:D()}],"inset-shadow":[{"inset-shadow":["none",g,tr,ar]}],"inset-shadow-color":[{"inset-shadow":D()}],"ring-w":[{ring:Re()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:D()}],"ring-offset-w":[{"ring-offset":[H,nl]}],"ring-offset-color":[{"ring-offset":D()}],"inset-ring-w":[{"inset-ring":Re()}],"inset-ring-color":[{"inset-ring":D()}],"text-shadow":[{"text-shadow":["none",c,tr,ar]}],"text-shadow-color":[{"text-shadow":D()}],opacity:[{opacity:[H,T,A]}],"mix-blend":[{"mix-blend":[...Ld(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":Ld()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[H]}],"mask-image-linear-from-pos":[{"mask-linear-from":Le()}],"mask-image-linear-to-pos":[{"mask-linear-to":Le()}],"mask-image-linear-from-color":[{"mask-linear-from":D()}],"mask-image-linear-to-color":[{"mask-linear-to":D()}],"mask-image-t-from-pos":[{"mask-t-from":Le()}],"mask-image-t-to-pos":[{"mask-t-to":Le()}],"mask-image-t-from-color":[{"mask-t-from":D()}],"mask-image-t-to-color":[{"mask-t-to":D()}],"mask-image-r-from-pos":[{"mask-r-from":Le()}],"mask-image-r-to-pos":[{"mask-r-to":Le()}],"mask-image-r-from-color":[{"mask-r-from":D()}],"mask-image-r-to-color":[{"mask-r-to":D()}],"mask-image-b-from-pos":[{"mask-b-from":Le()}],"mask-image-b-to-pos":[{"mask-b-to":Le()}],"mask-image-b-from-color":[{"mask-b-from":D()}],"mask-image-b-to-color":[{"mask-b-to":D()}],"mask-image-l-from-pos":[{"mask-l-from":Le()}],"mask-image-l-to-pos":[{"mask-l-to":Le()}],"mask-image-l-from-color":[{"mask-l-from":D()}],"mask-image-l-to-color":[{"mask-l-to":D()}],"mask-image-x-from-pos":[{"mask-x-from":Le()}],"mask-image-x-to-pos":[{"mask-x-to":Le()}],"mask-image-x-from-color":[{"mask-x-from":D()}],"mask-image-x-to-color":[{"mask-x-to":D()}],"mask-image-y-from-pos":[{"mask-y-from":Le()}],"mask-image-y-to-pos":[{"mask-y-to":Le()}],"mask-image-y-from-color":[{"mask-y-from":D()}],"mask-image-y-to-color":[{"mask-y-to":D()}],"mask-image-radial":[{"mask-radial":[T,A]}],"mask-image-radial-from-pos":[{"mask-radial-from":Le()}],"mask-image-radial-to-pos":[{"mask-radial-to":Le()}],"mask-image-radial-from-color":[{"mask-radial-from":D()}],"mask-image-radial-to-color":[{"mask-radial-to":D()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":x()}],"mask-image-conic-pos":[{"mask-conic":[H]}],"mask-image-conic-from-pos":[{"mask-conic-from":Le()}],"mask-image-conic-to-pos":[{"mask-conic-to":Le()}],"mask-image-conic-from-color":[{"mask-conic-from":D()}],"mask-image-conic-to-color":[{"mask-conic-to":D()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:gd()}],"mask-repeat":[{mask:hd()}],"mask-size":[{mask:xd()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",T,A]}],filter:[{filter:["","none",T,A]}],blur:[{blur:Sd()}],brightness:[{brightness:[H,T,A]}],contrast:[{contrast:[H,T,A]}],"drop-shadow":[{"drop-shadow":["","none",m,tr,ar]}],"drop-shadow-color":[{"drop-shadow":D()}],grayscale:[{grayscale:["",H,T,A]}],"hue-rotate":[{"hue-rotate":[H,T,A]}],invert:[{invert:["",H,T,A]}],saturate:[{saturate:[H,T,A]}],sepia:[{sepia:["",H,T,A]}],"backdrop-filter":[{"backdrop-filter":["","none",T,A]}],"backdrop-blur":[{"backdrop-blur":Sd()}],"backdrop-brightness":[{"backdrop-brightness":[H,T,A]}],"backdrop-contrast":[{"backdrop-contrast":[H,T,A]}],"backdrop-grayscale":[{"backdrop-grayscale":["",H,T,A]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[H,T,A]}],"backdrop-invert":[{"backdrop-invert":["",H,T,A]}],"backdrop-opacity":[{"backdrop-opacity":[H,T,A]}],"backdrop-saturate":[{"backdrop-saturate":[H,T,A]}],"backdrop-sepia":[{"backdrop-sepia":["",H,T,A]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":C()}],"border-spacing-x":[{"border-spacing-x":C()}],"border-spacing-y":[{"border-spacing-y":C()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",T,A]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[H,"initial",T,A]}],ease:[{ease:["linear","initial",h,T,A]}],delay:[{delay:[H,T,A]}],animate:[{animate:["none",d,T,A]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[y,T,A]}],"perspective-origin":[{"perspective-origin":b()}],rotate:[{rotate:go()}],"rotate-x":[{"rotate-x":go()}],"rotate-y":[{"rotate-y":go()}],"rotate-z":[{"rotate-z":go()}],scale:[{scale:ho()}],"scale-x":[{"scale-x":ho()}],"scale-y":[{"scale-y":ho()}],"scale-z":[{"scale-z":ho()}],"scale-3d":["scale-3d"],skew:[{skew:gr()}],"skew-x":[{"skew-x":gr()}],"skew-y":[{"skew-y":gr()}],transform:[{transform:[T,A,"","none","gpu","cpu"]}],"transform-origin":[{origin:b()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:xo()}],"translate-x":[{"translate-x":xo()}],"translate-y":[{"translate-y":xo()}],"translate-z":[{"translate-z":xo()}],"translate-none":["translate-none"],zoom:[{zoom:[Ra,T,A]}],accent:[{accent:D()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:D()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",T,A]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scrollbar-thumb-color":[{"scrollbar-thumb":D()}],"scrollbar-track-color":[{"scrollbar-track":D()}],"scrollbar-gutter":[{"scrollbar-gutter":["auto","stable","both"]}],"scrollbar-w":[{scrollbar:["auto","thin","none"]}],"scroll-m":[{"scroll-m":C()}],"scroll-mx":[{"scroll-mx":C()}],"scroll-my":[{"scroll-my":C()}],"scroll-ms":[{"scroll-ms":C()}],"scroll-me":[{"scroll-me":C()}],"scroll-mbs":[{"scroll-mbs":C()}],"scroll-mbe":[{"scroll-mbe":C()}],"scroll-mt":[{"scroll-mt":C()}],"scroll-mr":[{"scroll-mr":C()}],"scroll-mb":[{"scroll-mb":C()}],"scroll-ml":[{"scroll-ml":C()}],"scroll-p":[{"scroll-p":C()}],"scroll-px":[{"scroll-px":C()}],"scroll-py":[{"scroll-py":C()}],"scroll-ps":[{"scroll-ps":C()}],"scroll-pe":[{"scroll-pe":C()}],"scroll-pbs":[{"scroll-pbs":C()}],"scroll-pbe":[{"scroll-pbe":C()}],"scroll-pt":[{"scroll-pt":C()}],"scroll-pr":[{"scroll-pr":C()}],"scroll-pb":[{"scroll-pb":C()}],"scroll-pl":[{"scroll-pl":C()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",T,A]}],fill:[{fill:["none",...D()]}],"stroke-w":[{stroke:[H,io,nl,Eg]}],stroke:[{stroke:["none",...D()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{"container-named":["container-type"],overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},postfixLookupClassGroups:["container-type"],orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}};var Qg=Cy(Gy);function ma(...e){return Qg(er(e))}var eh=q(G(),1),Rt=(0,tu.forwardRef)(({className:e,autoResize:a=!0,onChange:t,...l},u)=>{let o=(0,tu.useRef)(null),n=u||o;(0,tu.useEffect)(()=>{a&&n.current&&(n.current.style.height="auto",n.current.style.height=n.current.scrollHeight+"px")},[l.value,a,n]);let r=s=>{a&&(s.target.style.height="auto",s.target.style.height=s.target.scrollHeight+"px"),t?.(s)};return(0,eh.jsx)("textarea",{ref:n,className:ma("flex w-full rounded-lg border-2 border-input bg-background px-3.5 py-3 text-base text-foreground leading-[1.7]","placeholder:text-muted-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-primary/50","disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted","resize-y min-h-[80px]",e),onChange:r,...l})});Rt.displayName="Textarea";var ur=q(G(),1);function $a({className:e,required:a,helperText:t,children:l,...u}){return(0,ur.jsxs)("label",{className:ma("block text-base font-semibold text-foreground uppercase tracking-[0.03em] mb-1.5",e),...u,children:[l,a&&(0,ur.jsx)("span",{className:"text-destructive ml-1","aria-hidden":"true",children:"*"})]})}var lu=q(G(),1);function uu({title:e,children:a,className:t}){return(0,lu.jsxs)("div",{className:ma("bg-background border-2 border-border rounded-xl mb-4 overflow-hidden shadow-sm",t),children:[(0,lu.jsxs)("div",{className:"px-4 py-3 bg-primary/5 border-b border-primary/20 text-base font-bold text-primary flex items-center gap-2",children:[(0,lu.jsx)("span",{className:"text-base","aria-hidden":"true",children:"\u25CF"}),e]}),(0,lu.jsx)("div",{className:"p-4 space-y-4",children:a})]})}var rr=q(Ge(),1);var or=(...e)=>e.filter((a,t,l)=>!!a&&a.trim()!==""&&l.indexOf(a)===t).join(" ").trim();var ah=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();var th=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,t,l)=>l?l.toUpperCase():t.toLowerCase());var sd=e=>{let a=th(e);return a.charAt(0).toUpperCase()+a.slice(1)};var fo=q(Ge(),1);var nr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};var lh=e=>{for(let a in e)if(a.startsWith("aria-")||a==="role"||a==="title")return!0;return!1};var ou=q(Ge(),1);var jy=(0,ou.createContext)({});var uh=()=>(0,ou.useContext)(jy);var oh=(0,fo.forwardRef)(({color:e,size:a,strokeWidth:t,absoluteStrokeWidth:l,className:u="",children:o,iconNode:n,...r},s)=>{let{size:i=24,strokeWidth:p=2,absoluteStrokeWidth:g=!1,color:c="currentColor",className:m=""}=uh()??{},L=l??g?Number(t??p)*24/Number(a??i):t??p;return(0,fo.createElement)("svg",{ref:s,...nr,width:a??i??nr.width,height:a??i??nr.height,stroke:e??c,strokeWidth:L,className:or("lucide",m,u),...!o&&!lh(r)&&{"aria-hidden":"true"},...r},[...n.map(([y,k])=>(0,fo.createElement)(y,k)),...Array.isArray(o)?o:[o]])});var Bt=(e,a)=>{let t=(0,rr.forwardRef)(({className:l,...u},o)=>(0,rr.createElement)(oh,{ref:o,iconNode:a,className:or(`lucide-${ah(sd(e))}`,`lucide-${e}`,l),...u}));return t.displayName=sd(e),t};var Ky=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],co=Bt("check",Ky);var Yy=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],mo=Bt("info",Yy);var Zy=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],ya=Bt("triangle-alert",Zy);var Qy=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Et=Bt("x",Qy);var we=q(G(),1);function nh({title:e,subtitle:a,onClose:t,patientInfo:l}){return(0,we.jsxs)("div",{className:"flex items-center justify-between px-5 py-4 bg-primary text-white shrink-0",children:[(0,we.jsxs)("div",{className:"flex items-center gap-3 min-w-0",children:[(0,we.jsx)("div",{className:"flex items-center justify-center w-11 h-11 rounded-xl bg-white/15 flex-shrink-0",children:(0,we.jsxs)("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,we.jsx)("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),(0,we.jsx)("polyline",{points:"14 2 14 8 20 8"}),(0,we.jsx)("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),(0,we.jsx)("line",{x1:"16",y1:"17",x2:"8",y2:"17"}),(0,we.jsx)("polyline",{points:"10 9 9 9 8 9"})]})}),(0,we.jsxs)("div",{className:"min-w-0",children:[(0,we.jsx)("h2",{className:"text-base font-bold",children:e}),a?(0,we.jsx)("p",{className:"text-base text-white/80 mt-0.5",children:a}):null,l&&(l.norm||l.pasien||l.nama_dokter)&&(0,we.jsxs)("div",{className:"text-base text-white/90 mt-1",children:["RM ",l.norm||"\u2014"," \xB7 ",l.pasien||"\u2014"," \xB7"," ",l.nama_dokter||"\u2014"]})]})]}),(0,we.jsx)("button",{type:"button",onClick:t,className:"bg-white/15 hover:bg-white/25 border-none text-white w-12 h-12 rounded-lg text-xl flex items-center justify-center cursor-pointer transition-colors flex-shrink-0","aria-label":"Tutup modal",children:(0,we.jsx)(Et,{className:"size-6"})})]})}var Ca=q(G(),1);function rh({anamnesa:e,pemeriksaan:a,onChange:t}){return(0,Ca.jsxs)("div",{className:"space-y-5",children:[(0,Ca.jsxs)("div",{children:[(0,Ca.jsx)($a,{children:"Anamnesa"}),(0,Ca.jsx)(Rt,{value:e,onChange:l=>t("anamnesa",l.target.value),placeholder:"Keluhan pasien...",rows:5,"aria-describedby":"anamnesa-help"}),(0,Ca.jsx)("p",{id:"anamnesa-help",className:"text-base text-muted-foreground mt-1",children:"Tuliskan keluhan utama, riwayat penyakit sekarang, dan riwayat penyakit dahulu"})]}),(0,Ca.jsxs)("div",{children:[(0,Ca.jsx)($a,{children:"Pemeriksaan Fisik"}),(0,Ca.jsx)(Rt,{value:a,onChange:l=>t("pemeriksaan",l.target.value),placeholder:"Hasil pemeriksaan fisik...",rows:5,"aria-describedby":"pemeriksaan-help"}),(0,Ca.jsx)("p",{id:"pemeriksaan-help",className:"text-base text-muted-foreground mt-1",children:"Catat hasil pemeriksaan umum dan sistemik"})]})]})}var sh=q(Ge(),1);var ih=q(G(),1),et=(0,sh.forwardRef)(({className:e,type:a,...t},l)=>(0,ih.jsx)("input",{type:a,className:ma("flex h-11 w-full rounded-lg border-2 border-input bg-background px-3.5 py-2.5 text-base text-foreground leading-normal","placeholder:text-muted-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-primary/50","disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",e),ref:l,...t}));et.displayName="Input";var Ot=q(G(),1);function dh({vitals:e,onChange:a}){return(0,Ot.jsx)("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-4",children:[{key:"tensi",label:"Tekanan Darah",unit:"mmHg",placeholder:"120/80"},{key:"nadi",label:"Nadi",unit:"x/menit",placeholder:"80"},{key:"suhu",label:"Suhu Tubuh",unit:"\xB0C",placeholder:"36.5"},{key:"nafas",label:"Respirasi",unit:"x/menit",placeholder:"20"},{key:"berat",label:"Berat Badan",unit:"kg",placeholder:"60"},{key:"tinggi",label:"Tinggi Badan",unit:"cm",placeholder:"165"}].map(l=>(0,Ot.jsxs)("div",{className:"space-y-1.5",children:[(0,Ot.jsx)($a,{children:l.label}),(0,Ot.jsxs)("div",{className:"relative",children:[(0,Ot.jsx)(et,{value:e[l.key],onChange:u=>a(l.key,u.target.value),placeholder:l.placeholder,className:"pr-20 font-mono font-semibold","aria-label":l.label}),(0,Ot.jsx)("span",{className:"absolute right-4 top-1/2 -translate-y-1/2 text-base font-semibold text-muted-foreground pointer-events-none",children:l.unit})]})]},l.key))})}var qt=q(Ge(),1);var ph=q(Ge(),1);var fh=e=>typeof e=="boolean"?`${e}`:e===0?"0":e,ch=er,mh=(e,a)=>t=>{var l;if(a?.variants==null)return ch(e,t?.class,t?.className);let{variants:u,defaultVariants:o}=a,n=Object.keys(u).map(i=>{let p=t?.[i],g=o?.[i];if(p===null)return null;let c=fh(p)||fh(g);return u[i][c]}),r=t&&Object.entries(t).reduce((i,p)=>{let[g,c]=p;return c===void 0||(i[g]=c),i},{}),s=a==null||(l=a.compoundVariants)===null||l===void 0?void 0:l.reduce((i,p)=>{let{class:g,className:c,...m}=p;return Object.entries(m).every(L=>{let[y,k]=L;return Array.isArray(k)?k.includes({...o,...r}[y]):{...o,...r}[y]===k})?[...i,g,c]:i},[]);return ch(e,n,s,t?.class,t?.className)};var gh=q(G(),1),Jy=mh("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive",outline:"border-2 border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-accent",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary",success:"bg-green-600 text-green-50 shadow-sm hover:bg-green-600/90 active:bg-green-600",dark:"bg-neutral-950 text-white shadow-sm hover:bg-neutral-900 active:bg-neutral-950",ghost:"hover:bg-accent hover:text-accent-foreground active:bg-accent",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-11 px-5 min-w-[90px]",sm:"h-9 px-3.5 min-w-[80px]",xs:"h-7 px-2.5 min-w-0 gap-1.5 text-xs font-medium [&_svg]:size-3.5",lg:"h-12 px-6 text-base min-w-[100px]",xl:"h-13 px-7 text-lg min-w-[110px]",icon:"h-11 w-11"}},defaultVariants:{variant:"default",size:"default"}}),pa=(0,ph.forwardRef)(({className:e,variant:a,size:t,...l},u)=>(0,gh.jsx)("button",{className:ma(Jy({variant:a,size:t,className:e})),ref:u,...l}));pa.displayName="Button";var Q=q(G(),1),Wy="/rekam-medik/search?opsi=kodeicd10&q=";function hh({rows:e,onChange:a}){let[t,l]=(0,qt.useState)([]),[u,o]=(0,qt.useState)(-1),[n,r]=(0,qt.useState)({top:0,left:0,width:0}),[s,i]=(0,qt.useState)(""),p=(0,qt.useRef)(null),g=(0,qt.useRef)(null),c=(d,f)=>a(e.map((x,b)=>b===d?{...x,...f}:x)),m=d=>a(e.filter((f,x)=>x!==d)),L=(d,f,x)=>{if(i(""),clearTimeout(p.current??void 0),g.current?.abort(),d.length<3){l([]),o(-1);return}let b=x.getBoundingClientRect();r({top:b.bottom+4,left:b.left,width:b.width}),p.current=setTimeout(async()=>{let w=new AbortController;g.current=w;try{let I=await fetch(`${Wy}${encodeURIComponent(d)}`,{signal:w.signal});if(!I.ok){i("HTTP "+I.status);return}let C=await I.text();if(!C||C==="[]"){i("Data tidak ditemukan");return}let v;try{if(v=JSON.parse(C),!Array.isArray(v))throw new Error("not array")}catch{v=C.split(`
`).filter(M=>M.includes("|")).map(M=>{let[oe,aa,sl]=M.split("|");return{NAMA:oe.trim(),KODE:aa.trim(),ID:sl.trim()}}).filter(M=>M.KODE)}v.length>0?(l(v.slice(0,15)),o(f)):i("Data tidak ditemukan")}catch(I){i(String(I))}},300)},y=(d,f)=>{c(d,{idicd:f.ID,kode10:f.KODE,namaDiagnosa:f.NAMA}),l([]),o(-1)},k=d=>f=>{c(d,{namaDiagnosa:f.target.value}),L(f.target.value,d,f.currentTarget)},h=d=>f=>{c(d,{kode10:f.target.value})};return(0,Q.jsxs)("div",{className:"space-y-2",children:[e.length>0&&(0,Q.jsxs)("div",{className:"flex gap-2 text-base font-bold text-muted-foreground px-1",children:[(0,Q.jsx)("span",{className:"flex-1",children:"Nama Diagnosa"}),(0,Q.jsx)("span",{className:"w-28",children:"Kode ICD"}),(0,Q.jsx)("span",{className:"w-[76px] text-right",children:"Aksi"})]}),e.length===0?(0,Q.jsx)("div",{className:"border-2 border-dashed border-border rounded-xl py-6 text-center bg-background",children:(0,Q.jsx)("p",{className:"text-base text-muted-foreground",children:"Belum ada diagnosa"})}):(0,Q.jsx)("div",{className:"space-y-2",children:e.map((d,f)=>{let x=f+1;return(0,Q.jsxs)("div",{className:"flex gap-2 items-center",children:[(0,Q.jsxs)("div",{className:"flex-1 min-w-0 relative",children:[(0,Q.jsx)(et,{id:`rj-nama${x}`,name:"nama[]",value:d.namaDiagnosa,placeholder:"Cari diagnosa...",autoComplete:"off",onChange:k(f),"aria-label":`Nama diagnosa ${x}`,"aria-describedby":`rj-nama-help-${x}`}),(0,Q.jsx)("p",{id:`rj-nama-help-${x}`,className:"sr-only",children:"Ketik minimal 3 karakter untuk mencari diagnosis ICD-10"}),(0,Q.jsx)("input",{type:"hidden",id:`rj-idicd${x}`,name:"idicd[]",value:d.idicd}),t.length>0&&u===f&&(0,Q.jsx)("div",{className:"fixed z-[2147483647] bg-background border-2 border-border rounded-xl shadow-lg max-h-[280px] overflow-auto",style:{top:n.top,left:n.left,width:n.width},role:"listbox","aria-label":"Hasil pencarian ICD-10",children:t.map((b,w)=>(0,Q.jsxs)("div",{onClick:()=>y(f,b),role:"option",className:"px-4 py-3 cursor-pointer text-base border-b border-border hover:bg-accent transition-colors",children:[(0,Q.jsx)("div",{className:"font-medium text-foreground",children:b.NAMA}),(0,Q.jsx)("div",{className:"text-muted-foreground text-base font-mono",children:b.KODE})]},b.ID||w))}),s&&u===f&&(0,Q.jsx)("div",{className:"fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-3 py-2.5 text-base text-destructive",style:{top:n.top,left:n.left},role:"alert",children:s})]}),(0,Q.jsxs)("div",{className:"w-28 shrink-0",children:[(0,Q.jsx)(et,{id:`rj-kode${x}`,name:"kode10[]",value:d.kode10,placeholder:"Kode",onChange:h(f),className:"font-mono text-base","aria-label":`Kode ICD-10 ${x}`}),(0,Q.jsx)("input",{type:"hidden",name:"kasus[]",value:d.kasus}),(0,Q.jsx)("input",{type:"hidden",name:"komplikasi[]",value:d.komplikasi})]}),(0,Q.jsx)(pa,{variant:"destructive",size:"default",onClick:()=>m(f),className:"w-[76px] shrink-0","aria-label":`Hapus diagnosa ${x}`,children:"Hapus"})]},f)})}),(0,Q.jsx)(pa,{variant:"default",size:"default",className:"gap-2 w-full",onClick:()=>a([...e,{idicd:"",kode10:"",namaDiagnosa:"",kasus:"LAMA",komplikasi:"TIDAK"}]),children:"\uFF0B Tambah Diagnosa"})]})}var Ht=q(Ge(),1);var J=q(G(),1),$y="/rekam-medik/search?opsi=clauseDiagnose_icd9&q=";function xh({rows:e,onChange:a}){let[t,l]=(0,Ht.useState)([]),[u,o]=(0,Ht.useState)(-1),[n,r]=(0,Ht.useState)({top:0,left:0,width:0}),[s,i]=(0,Ht.useState)(""),p=(0,Ht.useRef)(null),g=(0,Ht.useRef)(null),c=(d,f)=>a(e.map((x,b)=>b===d?{...x,...f}:x)),m=d=>a(e.filter((f,x)=>x!==d)),L=(d,f,x)=>{if(i(""),clearTimeout(p.current??void 0),g.current?.abort(),d.length<3){l([]),o(-1);return}let b=x.getBoundingClientRect();r({top:b.bottom+4,left:b.left,width:b.width}),p.current=setTimeout(async()=>{let w=new AbortController;g.current=w;try{let I=await fetch(`${$y}${encodeURIComponent(d)}`,{signal:w.signal});if(!I.ok){i("HTTP "+I.status);return}let C=await I.text();if(!C||C==="[]"){i("Data tidak ditemukan");return}let v;try{if(v=JSON.parse(C),!Array.isArray(v))throw new Error("not array")}catch{v=C.split(`
`).filter(M=>M.includes("|")).map(M=>{let[oe,aa,sl]=M.split("|");return{NAMA:oe.trim(),KODE:aa.trim(),ID:sl.trim()}}).filter(M=>M.KODE)}v.length>0?(l(v.slice(0,15)),o(f)):i("Data tidak ditemukan")}catch(I){i(String(I))}},300)},y=(d,f)=>{c(d,{idicdTindakan:f.ID,kode9:f.KODE,namaTindakan:f.NAMA}),l([]),o(-1)},k=d=>f=>{c(d,{namaTindakan:f.target.value}),L(f.target.value,d,f.currentTarget)},h=d=>f=>{c(d,{kode9:f.target.value})};return(0,J.jsxs)("div",{className:"space-y-2",children:[e.length>0&&(0,J.jsxs)("div",{className:"flex gap-2 text-base font-bold text-muted-foreground px-1",children:[(0,J.jsx)("span",{className:"flex-1",children:"Nama Tindakan"}),(0,J.jsx)("span",{className:"w-28",children:"Kode ICD"}),(0,J.jsx)("span",{className:"w-[76px] text-right",children:"Aksi"})]}),e.length===0?(0,J.jsx)("div",{className:"border-2 border-dashed border-border rounded-xl py-6 text-center bg-background",children:(0,J.jsx)("p",{className:"text-base text-muted-foreground",children:"Belum ada tindakan"})}):(0,J.jsx)("div",{className:"space-y-2",children:e.map((d,f)=>{let x=f+1;return(0,J.jsxs)("div",{className:"flex gap-2 items-center",children:[(0,J.jsxs)("div",{className:"flex-1 min-w-0 relative",children:[(0,J.jsx)(et,{id:`rj-nama-tindakan${x}`,name:"nama_tindakan[]",value:d.namaTindakan,placeholder:"Cari tindakan...",autoComplete:"off",onChange:k(f),"aria-label":`Nama tindakan ${x}`,"aria-describedby":`rj-tindakan-help-${x}`}),(0,J.jsx)("p",{id:`rj-tindakan-help-${x}`,className:"sr-only",children:"Ketik minimal 3 karakter untuk mencari tindakan ICD-9"}),(0,J.jsx)("input",{type:"hidden",id:`rj-idicd-tindakan${x}`,name:"idicd_tindakan[]",value:d.idicdTindakan,autoComplete:"off"}),t.length>0&&u===f&&(0,J.jsx)("div",{className:"fixed z-[2147483647] bg-background border-2 border-border rounded-xl shadow-lg max-h-[280px] overflow-auto",style:{top:n.top,left:n.left,width:n.width},role:"listbox","aria-label":"Hasil pencarian ICD-9",children:t.map((b,w)=>(0,J.jsxs)("div",{onClick:()=>y(f,b),role:"option",className:"px-4 py-3 cursor-pointer text-base border-b border-border hover:bg-accent transition-colors",children:[(0,J.jsx)("div",{className:"font-medium text-foreground",children:b.NAMA}),(0,J.jsx)("div",{className:"text-muted-foreground text-base font-mono",children:b.KODE})]},b.ID||w))}),s&&u===f&&(0,J.jsx)("div",{className:"fixed z-[2147483647] bg-destructive/10 border-2 border-destructive rounded-xl px-3 py-2.5 text-base text-destructive",style:{top:n.top,left:n.left},role:"alert",children:s})]}),(0,J.jsxs)("div",{className:"w-28 shrink-0",children:[(0,J.jsx)(et,{id:`rj-kode9${x}`,name:"kode9[]",value:d.kode9,placeholder:"Kode",onChange:h(f),className:"font-mono text-base","aria-label":`Kode ICD-9 ${x}`}),(0,J.jsx)("input",{type:"hidden",name:"jenis[]",value:d.jenis||"Primer"}),(0,J.jsx)("input",{type:"hidden",name:"kategoriProsedur[]",value:d.kategoriProsedur})]}),(0,J.jsx)(pa,{variant:"destructive",size:"default",onClick:()=>m(f),className:"w-[76px] shrink-0","aria-label":`Hapus tindakan ${x}`,children:"Hapus"})]},f)})}),(0,J.jsx)(pa,{variant:"default",size:"default",className:"gap-2 w-full",onClick:()=>a([...e,{idicdTindakan:"",kode9:"",namaTindakan:"",jenis:e.length===0?"Primer":"Sekunder",komorbid:"",kategoriProsedur:"410606002",snomedProsedur:"",codeProsedur:""}]),children:"\uFF0B Tambah Tindakan"})]})}var xe=q(G(),1);function Lh({errors:e,warnings:a=[]}){return e.length>0||a.length>0?(0,xe.jsxs)(xe.Fragment,{children:[a.length>0&&(0,xe.jsx)("div",{className:"px-6 py-4 border-t-2 border-border bg-yellow-50 dark:bg-yellow-950/30",role:"alert",children:(0,xe.jsxs)("div",{className:"flex items-start gap-3",children:[(0,xe.jsx)(ya,{className:"size-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5"}),(0,xe.jsxs)("div",{children:[(0,xe.jsx)("p",{className:"text-base font-bold text-yellow-800 dark:text-yellow-300 mb-1",children:"Perhatian"}),(0,xe.jsx)("ul",{className:"space-y-1",children:a.map((l,u)=>(0,xe.jsxs)("li",{className:"text-base text-yellow-700 dark:text-yellow-400",children:[l.section,": ",l.message]},u))})]})]})}),e.length>0&&(0,xe.jsx)("div",{className:"px-6 py-4 border-t-2 border-border bg-destructive/5",role:"alert",children:(0,xe.jsxs)("div",{className:"flex items-start gap-3",children:[(0,xe.jsx)(ya,{className:"size-5 text-destructive shrink-0 mt-0.5"}),(0,xe.jsxs)("div",{children:[(0,xe.jsxs)("p",{className:"text-base font-bold text-destructive mb-1",children:["Terdapat ",e.length," kesalahan"]}),(0,xe.jsx)("ul",{className:"space-y-1",children:e.map((l,u)=>(0,xe.jsxs)("li",{className:"text-base text-destructive/80",children:[l.section,": ",l.message]},u))})]})]})})]}):null}var nu=q(G(),1),eC={default:"bg-primary/10 text-primary border-primary/20",success:"bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",warning:"bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",danger:"bg-destructive/10 text-destructive border-destructive/20"},aC={default:mo,success:co,warning:ya,danger:Et};function id({variant:e="default",icon:a,children:t,className:l,onDismiss:u}){let o=aC[e];return(0,nu.jsxs)("span",{className:ma("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-base font-semibold",eC[e],l),children:[a&&(0,nu.jsx)(o,{className:"size-3.5"}),t,u&&(0,nu.jsx)("button",{onClick:u,className:"ml-1 hover:opacity-70 p-0.5","aria-label":"Dismiss",children:(0,nu.jsx)(Et,{className:"size-3.5"})})]})}var ga=q(G(),1);function Sh({onCancel:e,onSave:a,onRefresh:t,onReset:l,onHistory:u,saving:o,hasErrors:n,lastSaved:r}){let s=l??t;return(0,ga.jsxs)("div",{className:"flex items-center justify-between px-6 py-4 border-t-2 border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0 sticky bottom-0 z-[1]",children:[(0,ga.jsxs)("div",{className:"flex items-center gap-3 min-w-0",children:[n&&(0,ga.jsx)(id,{variant:"danger",icon:!0,children:"Validasi gagal"}),r&&(0,ga.jsxs)("span",{className:"text-base text-muted-foreground truncate",children:["Tersimpan ",r]}),o&&(0,ga.jsx)(id,{variant:"default",icon:!0,children:"Menyimpan..."})]}),(0,ga.jsxs)("div",{className:"flex items-center gap-3",children:[u&&(0,ga.jsx)(pa,{type:"button",variant:"success",size:"default",onClick:u,className:"gap-2",children:"Riwayat"}),s&&(0,ga.jsx)(pa,{type:"button",variant:"outline",size:"default",onClick:s,className:"gap-2",children:"Reset Formulir"}),(0,ga.jsx)(pa,{type:"button",variant:"dark",size:"default",onClick:e,children:"Batal"}),(0,ga.jsx)(pa,{type:"button",variant:"default",size:"lg",onClick:a,disabled:o||n,className:"gap-2 px-7 min-h-11","aria-label":"Simpan resume",children:o?"Menyimpan...":"Simpan"})]})]})}var W=q(G(),1);function kh(e){let a=[];return e.diagnosa.forEach((t,l)=>{ea(t.kode10)&&ea(t.namaDiagnosa)||(!ea(t.kode10)&&ea(t.namaDiagnosa)&&a.push({section:`Diagnosa #${l+1}`,message:"Nama diagnosa kosong"}),!ea(t.namaDiagnosa)&&ea(t.kode10)&&a.push({section:`Diagnosa #${l+1}`,message:"Kode ICD-10 kosong"}))}),e.tindakan.forEach((t,l)=>{ea(t.kode9)||(ea(t.namaTindakan)&&a.push({section:`Tindakan #${l+1}`,message:"Nama tindakan kosong"}),!ea(t.idicdTindakan)&&!ea(t.kode9)&&!ea(t.namaTindakan)&&ea(t.kategoriProsedur)&&a.push({section:`Tindakan #${l+1}`,message:"Kategori Prosedur belum dipilih"}))}),a}function Ah({data:e,onSave:a,onClose:t}){let[l,u]=(0,ba.useState)(e),[o,n]=(0,ba.useState)(!1),[r,s]=(0,ba.useState)(null),[i,p]=(0,ba.useState)(!1),[g,c]=(0,ba.useState)([]),[m,L]=(0,ba.useState)([]),y=(0,ba.useRef)(l.diagnosa.some(v=>v.idicd?.trim())),k=i?kh(l):[],h=[...k,...m],d=k.length>0,f=(0,ba.useCallback)(async()=>{if(p(!0),c([]),L([]),kh(l).length>0)return;let M=l.diagnosa.filter(oe=>oe.idicd?.trim()&&oe.kode10?.trim()&&oe.namaDiagnosa?.trim());y.current&&M.length===0&&c([{section:"Diagnosa",message:"Semua diagnosa telah dihapus. Sistem Morbis biasanya tidak menghapus ICD yang sudah tersimpan ketika daftar diagnosa dikosongkan."}]),n(!0);try{await a(l),s(new Date().toLocaleTimeString()),window.setTimeout(()=>window.location.reload(),900)}catch(oe){let aa=oe instanceof Error?oe.message:String(oe);L([{section:"Server",message:aa}])}finally{n(!1)}},[l,a]),x=(v,M)=>u({...l,clinicalNotes:{...l.clinicalNotes,[v]:M}}),b=async()=>{let{confirmExt:v}=await Promise.resolve().then(()=>(Ih(),vh));return v({title:"Reset semua data?",message:"Semua data yang sudah dimasukkan akan dihapus. Tindakan ini tidak dapat dibatalkan.",variant:"danger",cancelLabel:"Kembali",okLabel:"Reset"})},w=async()=>{await b()&&location.reload()},I=async()=>{if(k.length>0){p(!0);return}await f()},C=()=>{Tg({idVisit:l.patientInfo.id_visit||new URLSearchParams(location.search).get("id_visit")||"",tipe:"rajal",title:"Riwayat Resume Rajal",zIndex:2147483647,onApply:v=>u(Mg(v,l))})};return(0,W.jsxs)("div",{className:"resume-modal",children:[(0,W.jsx)(nh,{title:"Resume Rawat Jalan",onClose:t,patientInfo:l.patientInfo}),(0,W.jsxs)("div",{className:"flex-1 overflow-y-auto px-5 py-4 space-y-3",children:[(0,W.jsx)(uu,{title:"Data Klinis",children:(0,W.jsx)(rh,{anamnesa:l.clinicalNotes.anamnesa,pemeriksaan:l.clinicalNotes.pemeriksaan_fisik,onChange:(v,M)=>x(v==="pemeriksaan"?"pemeriksaan_fisik":v,M)})}),(0,W.jsx)(uu,{title:"Tanda Vital",children:(0,W.jsx)(dh,{vitals:l.vitalSigns,onChange:(v,M)=>u({...l,vitalSigns:{...l.vitalSigns,[v]:M}})})}),(0,W.jsx)(uu,{title:"Catatan Medis",children:(0,W.jsxs)("div",{className:"space-y-3",children:[(0,W.jsxs)("div",{children:[(0,W.jsx)($a,{children:"Catatan Diagnosis"}),(0,W.jsx)(Rt,{value:l.clinicalNotes.catatan,onChange:v=>x("catatan",v.target.value),placeholder:"Catatan diagnosa...",rows:3})]}),(0,W.jsxs)("div",{children:[(0,W.jsx)($a,{children:"Tindakan"}),(0,W.jsx)(Rt,{value:l.clinicalNotes.tindakan,onChange:v=>x("tindakan",v.target.value),placeholder:"Tindakan...",rows:3})]}),(0,W.jsxs)("div",{children:[(0,W.jsx)($a,{children:"Terapi Pengobatan"}),(0,W.jsx)(Rt,{value:l.clinicalNotes.terapi_pengobatan,onChange:v=>x("terapi_pengobatan",v.target.value),placeholder:"Terapi pengobatan...",rows:3})]})]})}),(0,W.jsx)(uu,{title:`Diagnosis (ICD-10)${l.diagnosa.length>0?` (${l.diagnosa.length})`:""}`,children:(0,W.jsx)(hh,{rows:l.diagnosa,onChange:v=>u({...l,diagnosa:v})})}),(0,W.jsx)(uu,{title:`Tindakan (ICD-9)${l.tindakan.length>0?` (${l.tindakan.length})`:""}`,children:(0,W.jsx)(xh,{rows:l.tindakan,onChange:v=>u({...l,tindakan:v})})})]}),(0,W.jsx)(Lh,{errors:h,warnings:g}),(0,W.jsx)(Sh,{saving:o,hasErrors:d,lastSaved:r,onSave:I,onCancel:t,onRefresh:w,onHistory:C})]})}var Th=q(Ge(),1),dr=class extends Th.Component{constructor(){super(...arguments);this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(){this.props.onError()}render(){return this.state.hasError?null:this.props.children}};var pd=q(G(),1),iC=[{pattern:"periksa.*dokter",weight:1},{pattern:"konsultasi",weight:2},{pattern:"tindakan utama",weight:3},{pattern:"lab",weight:10},{pattern:"glukosa",weight:11},{pattern:"hba1c",weight:12},{pattern:"hb a1c",weight:12}];function wh(e){let a=new Map;return[...e].sort((t,l)=>{let u=o=>{let n=o.toLowerCase().trim();for(let r of iC)if(a.has(r.pattern)||a.set(r.pattern,new RegExp(r.pattern,"i")),a.get(r.pattern).test(n))return r.weight;return 999};return u(t)-u(l)})}function dC(e){if(!e)return"";let a=e.trim();return a?a.charAt(0).toUpperCase()+a.slice(1):""}function Mh(e){return e.map(dC).join(`
`)}function Bh(){let e=document.getElementById("pembayaran-gabung")||document.body,a=[],t=[],l=e.querySelectorAll("tr"),u=!1;for(let s of l){let i=s.textContent?.trim()||"";if(s.querySelector("b")&&!i.match(/^\d/)){u=!0;continue}if(u&&(i.includes("Total")||i.includes("Sub Total"))){u=!1;continue}if(u){let g=Array.from(s.querySelectorAll("td"));if(g.length>=5&&g[0]?.textContent?.trim().match(/^\d+\.?$/)){let c=g[2]?.textContent?.trim()||"",m=g[4]?.textContent?.trim()||"1";a.push(m&&m!=="1"?`${c} (${m})`:c)}}}let o=Array.from(e.querySelectorAll("b")).find(s=>s.textContent?.includes("Biaya Resep"));if(o){let s=o.closest("tr")?.nextElementSibling;for(;s&&!s.textContent?.includes("Sub Total");){if(s.getAttribute("valign")==="top"){let i=Array.from(s.querySelectorAll("td")),p=i[1]?.textContent?.trim()||"",g=p.match(/^\d+\s+(.*)/),c=g?g[1]:p,m=i[2]?.textContent?.trim()||"";t.push(m?`${c} Jml: ${m}`:c)}s=s.nextElementSibling}}let n=wh(a),r=wh(t);return{tindakan:Mh(n),terapiPengobatan:Mh(r)}}var Mv=location.pathname.includes("rm-rawat-jalan-new");var fC="/rekam-medik/control/rm-rawat-jalan",Ut=null,ru=null;function cC(){let e=document.getElementById("resume-view");if(!e)return null;let a=r=>{let s=e.querySelectorAll("table table tr, fieldset table tr");for(let i of s){let p=i.querySelectorAll("td");for(let g=0;g<p.length;g++)if(p[g].textContent?.trim()===r&&p[g+1]){let c=p[g+1];return(c.textContent?.trim()===":"?p[g+2]:c)?.textContent?.trim()||""}}return""},t=()=>{let r=Array.from(e.querySelectorAll("tr")).find(g=>g.textContent?.includes("Hasil Pemeriksaan Fisik"));if(!r)return"";let s=r.querySelector("td:last-child table, td[colspan] table");if(!s)return"";let i=Array.from(s.querySelectorAll("tr")).find(g=>{let c=g.querySelectorAll("td");return Array.from(c).some(m=>m.textContent?.trim()==="Lainnya")});if(!i)return"";let p=i.querySelectorAll("td");for(let g=0;g<p.length;g++)if(p[g].textContent?.trim()==="Lainnya"&&g+2<p.length){let c=p[g+2]?.textContent?.trim()||"",m=["Tensi:","Nadi:","Suhu:","Nafas:","Tinggi:","Berat:","Lainnya:"];return c.split(`
`).filter(L=>{let y=L.trim();return y&&!m.some(k=>y.startsWith(k))}).join(`
`)}return""},l=r=>{let s=Array.from(e.querySelectorAll("tr")).find(g=>g.textContent?.includes("Hasil Pemeriksaan Fisik"));if(!s)return"";let i=s.querySelector("td:last-child table, td[colspan] table");if(!i)return"";let p=i.querySelectorAll("tr");for(let g of p){let c=g.querySelectorAll("td");for(let m=0;m<c.length;m++)if(c[m].textContent?.trim()===r&&c[m+1]){let L=c[m+1];return(L.textContent?.trim()===":"?c[m+2]:L)?.textContent?.trim()||""}}return""},u=[],o=Array.from(e.querySelectorAll("tr")).find(r=>r.textContent?.includes("ICD X"));if(o){let r=o.querySelector("td:last-child table, td[colspan] table");if(r){let s=r.querySelectorAll("tr");for(let i of s){let g=(i.textContent?.trim()||"").match(/-\s*(.+?)\s*\(([^)]+)\)\s*-/);g&&u.push({idicd:"",kode10:g[2],namaDiagnosa:g[1],kasus:"",komplikasi:""})}}}let n=[];return{patientInfo:{norm:a("No. Rekam Medis"),pasien:a("Nama Pasien"),nama_dokter:""},clinicalNotes:{anamnesa:a("Anamnesa"),pemeriksaan_fisik:t(),catatan:a("Diagnosa"),tindakan:a("Tindakan"),terapi_pengobatan:a("Terapi Pengobatan")},vitalSigns:{tensi:l("Tensi"),nadi:l("Nadi"),suhu:l("Suhu"),nafas:l("Nafas"),tinggi:l("Tinggi"),berat:l("Berat")},diagnosa:u,tindakan:n}}function mC(){let e=cC(),a=document,t=c=>a.getElementById(c)?.value||"",l=c=>{let m=a.querySelector(`textarea[name="${c}"], input[name="${c}"], #${c}, select[name="${c}"]`);return m?"tagName"in m&&m.tagName==="SELECT"?m.value:m.value||"":""},u=c=>a.querySelector(`input[name="${c}"]:checked`)?.value||"",o={norm:t("norm")||t("no_rm"),pasien:t("pasien")||t("nama_pasien"),nama_dokter:t("nama_dokter")||t("dokter"),id_visit:t("id_visit")||new URLSearchParams(location.search).get("id_visit")||(typeof E?.id_visit=="string"?E.id_visit:""),id_rawat_jalan:t("id_rawat_jalan")||new URLSearchParams(location.search).get("id")||(typeof E?.id_rawat_jalan=="string"?E.id_rawat_jalan:""),id_user:t("id_user")||(typeof E?.id_user=="string"?E.id_user:"")||"1",id_dokter:t("id_dokter")||(typeof E?.id_dokter=="string"?E.id_dokter:""),id_bed:t("id_bed")||(typeof E?.id_bed=="string"?E.id_bed:""),noregis:t("noregis")||(typeof E?.noregis=="string"?E.noregis:"")},n={anamnesa:l("anamnesa"),pemeriksaan_fisik:l("pemeriksaan_fisik")||l("pemeriksaan")||l("fisik")||"",catatan:l("catatan")||"",tindakan:l("tindakan")||l("namaTindakan"),terapi_pengobatan:l("terapi_pengobatan")||"",jenis_kasus:l("jenis_kasus"),status_kasus:u("status_kasus"),tindak_lanjut:l("tindak_lanjut")},r={tensi:t("tensi"),nadi:t("nadi"),suhu:t("suhu"),nafas:t("nafas"),tinggi:t("tinggi"),berat:t("berat")},s=[],i=a.querySelectorAll('input[name="kode10[]"], input[name="kode[]"]');if(i.length===0){let c=1;for(;a.getElementById(`kode${c}`)||a.querySelector(`input[name="kode10[]"]:nth-child(${c})`);){let m=t(`idicd${c}`)||"",L=t(`kode${c}`)||"",y=t(`nama${c}`)||"";(L||y)&&s.push({idicd:m,kode10:L,namaDiagnosa:y,kasus:"",komplikasi:""}),c++}}else i.forEach(c=>{let m=c.closest("tr");if(!m)return;let L=m.querySelector('input[name="idicd[]"], input[name="idicd"]')?.value||"",y=c.value||"",k=m.querySelector('input[name="namaDiagnosa[]"], input[name="nama[]"]')?.value||"",h=m.querySelector('select[name="kasus[]"]')?.value||"",d=m.querySelector('select[name="komplikasi[]"]')?.value||"";(y||k)&&s.push({idicd:L,kode10:y,namaDiagnosa:k,kasus:h,komplikasi:d})});if(s.length===0&&E){let c=Array.isArray(E["kode10[]"])?E["kode10[]"]:[],m=Array.isArray(E["nama[]"])?E["nama[]"]:[],L=Array.isArray(E["idicd[]"])?E["idicd[]"]:[],y=Array.isArray(E["kasus_diagnosa[]"])?E["kasus_diagnosa[]"]:[],k=Array.isArray(E["komplikasi[]"])?E["komplikasi[]"]:[];c.forEach((h,d)=>{h&&s.push({idicd:L[d]||"",kode10:h,namaDiagnosa:m[d]||"",kasus:y[d]||"",komplikasi:k[d]||""})})}let p=[];if(a.querySelectorAll('input[name="kode9[]"]').forEach(c=>{let m=c.closest("tr");if(!m)return;let L=c.value||"";if(!L)return;let y=m.querySelector('input[name="idicdTindakan[]"]')?.value||"",k=m.querySelector('input[name="namaTindakan[]"]')?.value||"",h=m.querySelector('select[name="komorbid[]"]')?.value||"",d=m.querySelector('select[name="kategoriProsedur[]"]')?.value||"",f=m.querySelector('input[name="snomedProsedur[]"]')?.value||"",x=m.querySelector('input[name="codeProsedur[]"]')?.value||L;p.push({idicdTindakan:y,kode9:L,namaTindakan:k,komorbid:h,kategoriProsedur:d,snomedProsedur:f,codeProsedur:x})}),p.length===0&&E){let c=Array.isArray(E["kode9[]"])?E["kode9[]"]:[],m=Array.isArray(E["namaTindakan[]"])?E["namaTindakan[]"]:[],L=Array.isArray(E["idicdTindakan[]"])?E["idicdTindakan[]"]:[],y=Array.isArray(E["komorbid[]"])?E["komorbid[]"]:[],k=Array.isArray(E["kategoriProsedur[]"])?E["kategoriProsedur[]"]:[];c.forEach((h,d)=>{h&&p.push({idicdTindakan:L[d]||"",kode9:h,namaTindakan:m[d]||"",komorbid:y[d]||"",kategoriProsedur:k[d]||""})})}if(e&&(o.norm=o.norm||e.patientInfo.norm,o.pasien=o.pasien||e.patientInfo.pasien,o.nama_dokter=o.nama_dokter||e.patientInfo.nama_dokter,n.anamnesa=n.anamnesa||e.clinicalNotes.anamnesa,n.pemeriksaan_fisik=n.pemeriksaan_fisik||e.clinicalNotes.pemeriksaan_fisik,n.catatan=n.catatan||e.clinicalNotes.catatan,n.tindakan=n.tindakan||e.clinicalNotes.tindakan,n.terapi_pengobatan=n.terapi_pengobatan||e.clinicalNotes.terapi_pengobatan,r.tensi=r.tensi||e.vitalSigns.tensi,r.nadi=r.nadi||e.vitalSigns.nadi,r.suhu=r.suhu||e.vitalSigns.suhu,r.nafas=r.nafas||e.vitalSigns.nafas,r.tinggi=r.tinggi||e.vitalSigns.tinggi,r.berat=r.berat||e.vitalSigns.berat,s.length===0&&s.push(...e.diagnosa),p.length===0&&p.push(...e.tindakan)),!n.tindakan||n.tindakan==="-"||!n.terapi_pengobatan||n.terapi_pengobatan==="-"){let c=Bh();c.tindakan&&(!n.tindakan||n.tindakan==="-")&&(n.tindakan=c.tindakan),c.terapiPengobatan&&(!n.terapi_pengobatan||n.terapi_pengobatan==="-")&&(n.terapi_pengobatan=c.terapiPengobatan)}if(E){let c={anamnesa:n.anamnesa,pemeriksaan_fisik:n.pemeriksaan_fisik,catatan:n.catatan,tindakan:n.tindakan,terapi_pengobatan:n.terapi_pengobatan};for(let[m,L]of Object.entries(c))if(!L||L==="-"){let y=E[m];typeof y=="string"&&y&&(n[m]=y)}}return{patientInfo:o,clinicalNotes:n,vitalSigns:r,diagnosa:s,tindakan:p}}function pC(e){let a=[],t=(f,x)=>a.push([f,String(x)]),l=f=>document.querySelector(`input[name="${f}"]`)?.value||"",u=f=>document.getElementById(f)?.value||"",o=f=>document.querySelector(`input[name="${f}"]:checked`)?.value||"",n=f=>typeof E?.[f]=="string"?E[f]:"",r=f=>e.patientInfo?.[f]||"";t("id_visit",r("id_visit")||l("id_visit")||new URLSearchParams(location.search).get("id_visit")||n("id_visit")),t("id_rawat_jalan",r("id_rawat_jalan")||l("id_rawat_jalan")||new URLSearchParams(location.search).get("id")||n("id_rawat_jalan")),t("id_user",r("id_user")||l("id_user")||n("id_user")||"1"),t("id_dokter",r("id_dokter")||l("id_dokter")||n("id_dokter")||""),t("id_bed",r("id_bed")||l("id_bed")||n("id_bed")||""),t("norm",r("norm")||l("norm")||n("norm")||""),t("noregis",r("noregis")||l("noregis")||n("noregis")||""),t("pasien",r("pasien")||l("pasien")||n("pasien")||""),t("nama_dokter",r("nama_dokter")||l("nama_dokter")||n("nama_dokter")||""),t("jenis_kasus",u("jenis_kasus")||n("jenis_kasus")||""),t("tindak_lanjut",u("tindak_lanjut")||n("tindak_lanjut")||""),t("status_kasus",o("status_kasus")||n("status_kasus")||"BARU"),t("rujukan",u("rujukan")||n("rujukan")||"83"),t("keadaan_keluar",u("keadaan_keluar")||n("keadaan_keluar")||"87"),t("cara_keluar",u("cara_keluar")||n("cara_keluar")||"161"),t("pemeriksaan_lanjut",u("pemeriksaan_lanjut")||n("pemeriksaan_lanjut")||"88"),t("pulang_berkas",l("pulang_berkas")||n("pulang_berkas")||""),t("composition_diet",l("composition_diet")||document.getElementById("composition_diet")?.value||n("composition_diet")||""),t("alergiMakananJSON",l("alergiMakananJSON")||n("alergiMakananJSON")||"[]"),t("alergiLingkunganJSON",l("alergiLingkunganJSON")||n("alergiLingkunganJSON")||"[]");let s=new Date,i=f=>f.toString().padStart(2,"0");t("waktu",`${i(s.getDate())}/${i(s.getMonth()+1)}/${s.getFullYear()} ${i(s.getHours())}:${i(s.getMinutes())}:${i(s.getSeconds())}`);let p=f=>f.replace(/\n/g,"<br/>");t("anamnesa",p(e.clinicalNotes.anamnesa)),t("pemeriksaan_fisik",p(e.clinicalNotes.pemeriksaan_fisik)),t("catatan",p(e.clinicalNotes.catatan)),t("tindakan",p(e.clinicalNotes.tindakan)),t("terapi_pengobatan",p(e.clinicalNotes.terapi_pengobatan));let g=f=>f.match(/^([\d/.]+)/)?.[0]||"";t("tensi",g(e.vitalSigns.tensi)),t("nadi",g(e.vitalSigns.nadi)),t("suhu",g(e.vitalSigns.suhu)),t("nafas",g(e.vitalSigns.nafas)),t("tinggi",g(e.vitalSigns.tinggi)),t("berat",g(e.vitalSigns.berat));let c=f=>Array.isArray(E?.[f])?E[f]:[],m=c("kode10[]"),L=c("idicd[]"),y=c("kasus_diagnosa[]"),k=c("komplikasi[]");return e.diagnosa.filter(f=>f.idicd?.trim()&&f.kode10?.trim()&&f.namaDiagnosa?.trim()).filter((f,x,b)=>b.findIndex(w=>w.idicd===f.idicd)===x).forEach(f=>{let x=f.idicd;if(!x&&f.kode10){let b=m.indexOf(f.kode10);b>=0&&L[b]&&(x=L[b])}t("nama[]",f.namaDiagnosa),t("idicd[]",x),t("kode10[]",f.kode10),t("kasus_diagnosa[]",f.kasus||""),t("komplikasi[]",f.komplikasi||"")}),e.tindakan.filter(f=>f.idicdTindakan?.trim()&&f.kode9?.trim()&&f.namaTindakan?.trim()).filter((f,x,b)=>b.findIndex(w=>w.idicdTindakan===f.idicdTindakan&&w.kode9===f.kode9)===x).forEach(f=>{t("namaTindakan[]",f.namaTindakan),t("kode9[]",f.kode9),t("idicdTindakan[]",f.idicdTindakan),t("kategoriProsedur[]",f.kategoriProsedur||""),t("komorbid[]",f.komorbid||""),t("snomedProsedur[]",f.snomedProsedur||""),t("codeProsedur[]",f.codeProsedur||"")}),t("save","Simpan"),a.map(([f,x])=>encodeURIComponent(f)+"="+encodeURIComponent(x)).join("&")}function gC(e){return pC(e)}function md(e){Ut&&(Ut.unmount(),Ut=null);try{e.innerHTML="",e.style.display="none"}catch{}let t=document.getElementById("morbis-manap-root")?.shadowRoot?.getElementById("ext-resume-shadow-container");if(t){try{t._reactRoot?.unmount?.()}catch{}t.remove()}document.body.classList.remove("ext-resume-open"),ru&&(ru.disabled=!1,ru.style.display="");let l=document.querySelector("[data-scroll-buttons]");l&&(l.style.display="")}function hC(e,a){if(Ut){try{Ut.unmount()}catch{}Ut=null}try{e.innerHTML=""}catch{}if(!document.getElementById("morbis-resume-fonts")){let i=document.createElement("link");i.id="morbis-resume-fonts",i.rel="stylesheet",i.href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Lexend:wght@400;500;600;700&family=Roboto:wght@400;500;600;700&display=swap",document.head.appendChild(i)}let l=(()=>{let i=document.getElementById("morbis-manap-root");if(i?.shadowRoot)return i.shadowRoot;if(i&&!i.shadowRoot)return null;i=document.createElement("div"),i.id="morbis-manap-root",i.style.cssText="position:fixed;inset:0;z-index:2147483647;pointer-events:none;display:block",document.body.appendChild(i);let p=i.attachShadow({mode:"open"}),g=document.createElement("div");g.id="app",p.appendChild(g);let c=document.createElement("style");c.id="morbis-shadow-reset",c.textContent=":host{display:block}#app{isolation:isolate;color-scheme:light}",p.appendChild(c);try{let m=`/* shadow-dom base */
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
`;if(m=m.replace(/@import[^;]+;/g,""),m&&"adoptedStyleSheets"in p&&"CSSStyleSheet"in window)try{let L=new window.CSSStyleSheet;L.replaceSync(m),p.adoptedStyleSheets=[...p.adoptedStyleSheets,L]}catch{let L=document.createElement("style");L.textContent=m,p.appendChild(L)}else if(m){let L=document.createElement("style");L.textContent=m,p.appendChild(L)}}catch{}return p})(),o=`/* shadow-dom base */
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
`.replace(/@import[^;]+;/g,""),n=`
      .resume-modal {
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
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
      }
      /* Paksa Roboto 16px/1.6 di atas CSS host (termasuk yang !important):
         menang di light-DOM fallback & elemen yang tidak inherit font
         (button native). Kode ICD (.font-mono) dikecualikan. */
      .resume-modal,
      .resume-modal *:not(.font-mono) {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
      /* Dropdown bawaan browser (option/optgroup): render native, paksa eksplisit. */
      .resume-modal option,
      .resume-modal optgroup {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
      }
      .resume-modal *,
      .resume-modal *::before,
      .resume-modal *::after {
        box-sizing: border-box;
      }
      .resume-modal input,
      .resume-modal select,
      .resume-modal textarea {
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
      .resume-modal input:focus,
      .resume-modal select:focus,
      .resume-modal textarea:focus {
        border-color: hsl(221.2 83.2% 53.3%);
        box-shadow: 0 0 0 2px hsl(221.2 83.2% 53.3% / 0.15);
      }
      .resume-modal textarea {
        resize: vertical;
        min-height: 80px;
        padding: 8px 10px;
      }
      .resume-modal select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        padding-right: 28px;
      }
      .resume-modal h1,
      .resume-modal h2,
      .resume-modal h3 {
        font-family: 'Lexend', system-ui, sans-serif;
      }
    `;if(l&&!l.getElementById("morbis-resume-shadow-css")){let i=document.createElement("style");i.id="morbis-resume-shadow-css",i.textContent=o+n,l.appendChild(i)}if(!document.getElementById("morbis-resume-css")){let i=document.createElement("style");i.id="morbis-resume-css",i.textContent=o+`
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
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
      }
      /* Paksa Roboto 16px/1.6 di atas CSS host (termasuk yang !important):
         menang di light-DOM fallback & elemen yang tidak inherit font
         (button native). Kode ICD (.font-mono) dikecualikan. */
      .resume-modal,
      .resume-modal *:not(.font-mono) {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
      /* Dropdown bawaan browser (option/optgroup): render native, paksa eksplisit. */
      .resume-modal option,
      .resume-modal optgroup {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
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
      @keyframes resume-slideup { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
    `,document.head.appendChild(i)}let r=(()=>{if(!l)return e;e.style.display="none";let i=l.getElementById("app"),p=l.getElementById("ext-resume-shadow-container");p||(p=document.createElement("div"),p.id="ext-resume-shadow-container",p.style.cssText="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;pointer-events:auto",(i??l).appendChild(p)),p.style.display="flex",ru&&(ru.style.display="none");let g=document.querySelector("[data-scroll-buttons]");return g&&(g.style.display="none"),p})();Ut=(0,Eh.createRoot)(r);let s=async i=>{let p=gC(i),g=await fetch(fC,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:p,credentials:"same-origin"}),c=await g.text();if(!g.ok)throw console.error("[RJ] save failed:",g.status,c),new Error("HTTP "+g.status);let m=/(?:<b>)?(?:Notice|Warning|Fatal error|Parse error|Catchable fatal error)(?:<\/b>)?\s*:\s*[^<]*/gi,L=[],y;for(;(y=m.exec(c))!==null;){let d=y[0].trim().replace(/<[^>]+>/g,"");d&&(/github\.com\/newrelic|newrelic-browser|google-analytics|googletagmanager/i.test(d)||L.push(d))}if(L.length>0)throw console.error("[RJ] PHP errors:",L),new Error(L.join(`
`));E=null;let k=i.patientInfo.id_visit||new URLSearchParams(location.search).get("id_visit")||"",h=i.patientInfo.id_rawat_jalan||new URLSearchParams(location.search).get("id")||"";Ag({idVisit:k,idResume:h,tipe:"rajal",aksi:h?"ubah":"buat",before:kg(k,"rajal")??{},after:wg(i)})};Ut.render((0,pd.jsx)(dr,{onError:()=>setTimeout(()=>md(e),0),children:(0,pd.jsx)(Ah,{data:a,onSave:s,onClose:()=>md(e)})})),document.body.classList.add("ext-resume-open"),setTimeout(()=>{(l?.getElementById("ext-resume-shadow-container")??e).querySelectorAll("textarea").forEach(p=>{let g=p;g.addEventListener("input",()=>{g.style.height="auto",g.style.height=g.scrollHeight+"px"}),g.dispatchEvent(new Event("input"))})},50)}var E=null;async function xC(){let e=new URLSearchParams(location.search).get("id_visit");if(!e)return{};let a=`${location.origin}/rekam-medik/rm-rawat-jalan-new?id_visit=${e}`;try{let l=await(await fetch(a,{credentials:"same-origin"})).text(),u=new DOMParser().parseFromString(l,"text/html"),o={};u.querySelectorAll('input[type="hidden"], input[type="text"]').forEach(r=>{r.name&&!r.name.endsWith("[]")&&(o[r.name]=r.value)}),u.querySelectorAll("textarea").forEach(r=>{r.name&&(o[r.name]=r.value)}),u.querySelectorAll("select").forEach(r=>{r.id&&(o[r.id]=r.value),r.name&&(r.name.endsWith("[]")?(Array.isArray(o[r.name])||(o[r.name]=[]),o[r.name].push(r.value)):o[r.name]=r.value)}),u.querySelectorAll('input[type="radio"]:checked').forEach(r=>{r.name&&(o[r.name]=r.value)});let n=new Set;u.querySelectorAll('input[name$="[]"]').forEach(r=>{r.name&&n.add(r.name)});for(let r of n){let s=[];u.querySelectorAll(`input[name="${r}"]`).forEach(i=>{i.value&&s.push(i.value)}),s.length>0&&(o[r]=s)}return o}catch(t){return console.error("[RJ] failed to fetch form state:",t),{}}}function LC(){let e=[];for(let a of document.querySelectorAll("p, td")){let t=a.textContent?.trim().match(/No Resep\s*:\s*(\d+)/i);t&&!e.includes(t[1])&&e.push(t[1])}return e}async function SC(e){let t=await(await fetch(e,{credentials:"same-origin"})).text(),u=new DOMParser().parseFromString(t,"text/html").querySelectorAll("h5"),o=null;for(let i of u)if(i.textContent?.trim()==="Resep yang ditebus"){o=i;break}if(!o)return[];let n=o.nextElementSibling;for(;n&&n.tagName!=="TABLE";)n=n.nextElementSibling;if(!n)return[];let r=[],s=n.querySelectorAll("tr");for(let i=1;i<s.length;i++){let p=s[i].querySelectorAll("td");if(p.length<8)continue;let g=p[1]?.textContent?.trim(),c=p[7]?.textContent?.trim(),m=p[5]?.textContent?.trim();g&&r.push(`${g} - ${c||"-"}`)}return r}async function yC(){let e=LC();if(!e.length)return null;let a=await Promise.all(e.map(u=>{let o=`${location.origin}/admisi/pelaksanaan_pelayanan/history/resep?id=${u}`;return SC(o)})),t=new Set,l=[];for(let u of a)for(let o of u){let n=o.split(" - ")[0];t.has(n)||(t.add(n),l.push(o))}return l.length?l.join(`
`):null}function Dh(){if(!location.href.startsWith(location.origin+"/v2/m-klaim/detail-v2-refaktor")||!new URLSearchParams(location.search).has("id_visit")||(document.querySelector("input[name=jenis]")?.value??document.querySelector("select[name=jenis]")?.value??"").toUpperCase().includes("INAP")||document.getElementById("ext-resume-float-btn"))return;let l=document.createElement("div");l.id="ext-resume-container",l.className="resume-modal",l.style.cssText="position: fixed; inset: 0; z-index: 2147483647; display: none; background: rgba(0,0,0,.4); align-items: center; justify-content: center;",document.body.appendChild(l);let u=document.createElement("button");ru=u,u.id="ext-resume-float-btn",u.textContent="RJ",u.title="Resume Rajal",u.style.cssText="position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:2147483645;width:48px;height:48px;border-radius:12px;border:none;background:#2b5f8a;color:white;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);transition:transform .15s,box-shadow .15s;",u.onmouseenter=()=>{u.style.transform="translateY(-50%) scale(1.05)",u.style.boxShadow="0 4px 16px rgba(43,95,138,.35)"},u.onmouseleave=()=>{u.style.transform="translateY(-50%)",u.style.boxShadow="0 2px 8px rgba(0,0,0,.2)"},u.addEventListener("click",async()=>{if(!u.disabled){u.disabled=!0;try{E||(E=await xC());let o=await yC(),n=mC();o&&(n.clinicalNotes.terapi_pengobatan=o);let r=!n.clinicalNotes.tindakan||n.clinicalNotes.tindakan==="-",s=!n.clinicalNotes.terapi_pengobatan||n.clinicalNotes.terapi_pengobatan==="-";if(r||s){let i=Bh();i.tindakan&&r&&(n.clinicalNotes.tindakan=i.tindakan),i.terapiPengobatan&&s&&(n.clinicalNotes.terapi_pengobatan=i.terapiPengobatan)}l.style.display="flex",hC(l,n)}catch(o){console.error("[RJ] click error:",o),l.style.display="none",u.disabled=!1}}}),document.body.appendChild(u),document.addEventListener("keydown",o=>{o.key==="Escape"&&l.style.display!=="none"&&md(l)})}function Rh(){return document.documentElement.getAttribute("data-ext-resume-modal")==="1"}function CC(){return["/login","/auth","/signin","/masuk","/keluar","/logout"].some(a=>location.pathname.toLowerCase().includes(a))||document.querySelectorAll('input[type="password"]').length>0}function bC(e=5e3){return Rh()?Promise.resolve(!0):new Promise(a=>{let t=Date.now(),l=setInterval(()=>{Rh()?(clearInterval(l),a(!0)):Date.now()-t>e&&(clearInterval(l),a(!1))},200)})}(async()=>CC()||await bC()&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Dh):Dh()))();return Nh(vC);})();
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
