(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[839],{3905:function(e,t,r){"use strict";r.d(t,{Zo:function(){return p},kt:function(){return m}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=c(r),m=o,f=d["".concat(s,".").concat(m)]||d[m]||u[m]||a;return r?n.createElement(f,i(i({ref:t},p),{},{components:r})):n.createElement(f,i({ref:t},p))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},6431:function(e,t,r){"use strict";r.r(t),r.d(t,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return c},default:function(){return u}});var n=r(2122),o=r(9756),a=(r(7294),r(3905)),i={id:"introduction",title:"Introduction",sidebar_label:"Introduction",slug:"/"},l=void 0,s={unversionedId:"overview/introduction",id:"overview/introduction",isDocsHomePage:!1,title:"Introduction",description:"GraphQL Portal is a single point of entry of your application to the data scattered across multiple APIs and other data sources.",source:"@site/docs/overview/introduction.md",sourceDirName:"overview",slug:"/",permalink:"/",editUrl:"https://github.com/graphql-portal/graphql-portal/edit/main/docs-website/docs/overview/introduction.md",version:"current",frontMatter:{id:"introduction",title:"Introduction",sidebar_label:"Introduction",slug:"/"},sidebar:"docs",next:{title:"How It Works",permalink:"/overview/how-it-works"}},c=[],p={toc:c};function u(e){var t=e.components,r=(0,o.Z)(e,["components"]);return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",{align:"center"},(0,a.kt)("img",{alt:"GraphQL Portal Logo animation",src:"https://raw.githubusercontent.com/graphql-portal/graphql-portal-docker/main/graphql-portal.gif"})),(0,a.kt)("p",null,"GraphQL Portal is a single point of entry of your application to the data scattered across multiple APIs and other data sources."),(0,a.kt)("p",null,"The GraphQL Community and Ecosystem are growing rapidly, and the goal of GraphQL Portal is to bring an API Gateway that\nis native to GraphQL. It is designed to be a simple and universal GraphQL Gateway for those who must mix legacy services\nwith new ones exposing GraphQL APIs, but also for those who already have GraphQL APIs and want to have a light gateway\nthat will bring more control and visibility to their APIs."),(0,a.kt)("p",null,"It is open source by choice, relies on existing open source tools by design, is extendable, scalable and configurable.\nIt can either be installed on-premises, or be used as a ",(0,a.kt)("a",{parentName:"p",href:"https://www.graphql-portal.com/"},"SaaS Gateway")," (",(0,a.kt)("em",{parentName:"p"},"coming soon"),")."),(0,a.kt)("p",null,"Key facts and features:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"it is open source but is also available in a SaaS version (coming soon)"),(0,a.kt)("li",{parentName:"ul"},"written in TypeScript"),(0,a.kt)("li",{parentName:"ul"},"based on ",(0,a.kt)("a",{parentName:"li",href:"https://graphql-mesh.com/"},"GraphQL Mesh")," and supports most of its input handlers"),(0,a.kt)("li",{parentName:"ul"},"provides its own data connectors in addition to those by Mesh"),(0,a.kt)("li",{parentName:"ul"},"is distributed and can easily be scaled"),(0,a.kt)("li",{parentName:"ul"},"can be configured via YAML/JSON files or via the interactive web-dashboard"),(0,a.kt)("li",{parentName:"ul"},"has built-in monitoring and analytics"),(0,a.kt)("li",{parentName:"ul"},"is extendable with custom middlewares.")))}u.isMDXComponent=!0}}]);