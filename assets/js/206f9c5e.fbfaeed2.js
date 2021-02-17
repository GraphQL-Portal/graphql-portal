(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{72:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return r})),n.d(t,"metadata",(function(){return l})),n.d(t,"toc",(function(){return c})),n.d(t,"default",(function(){return p}));var a=n(3),i=n(7),o=(n(0),n(85)),r={id:"gateway-options",title:"Gateway configuration options",sidebar_label:"Gateway Config Options"},l={unversionedId:"configuration/gateway-options",id:"configuration/gateway-options",isDocsHomePage:!1,title:"Gateway configuration options",description:"Gateway Configuration File",source:"@site/docs/configuration/gateway-options.md",slug:"/configuration/gateway-options",permalink:"/configuration/gateway-options",editUrl:"https://github.com/graphql-portal/graphql-portal/edit/main/docs-website/docs/configuration/gateway-options.md",version:"current",sidebar_label:"Gateway Config Options",sidebar:"docs",previous:{title:"Basic configuration",permalink:"/configuration/basic"},next:{title:"GraphQL API Definitions",permalink:"/configuration/api-definitions"}},c=[{value:"Gateway Configuration File",id:"gateway-configuration-file",children:[]},{value:"API Configuration Files",id:"api-configuration-files",children:[]},{value:"Environment variables",id:"environment-variables",children:[]},{value:"hostname",id:"hostname",children:[]},{value:"listen_port",id:"listen_port",children:[]},{value:"pool_size",id:"pool_size",children:[]},{value:"use_dashboard_configs",id:"use_dashboard_configs",children:[{value:"dashboard_config",id:"dashboard_config",children:[]}]},{value:"apis_path",id:"apis_path",children:[]},{value:"middleware_path",id:"middleware_path",children:[]},{value:"sources_path",id:"sources_path",children:[]},{value:"enable_control_api",id:"enable_control_api",children:[{value:"control_api_config",id:"control_api_config",children:[]}]},{value:"metrics",id:"metrics",children:[]},{value:"log_format",id:"log_format",children:[]},{value:"log_level",id:"log_level",children:[]},{value:"redis_connection_string",id:"redis_connection_string",children:[]},{value:"request_size_limit",id:"request_size_limit",children:[]}],s={toc:c};function p(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"gateway-configuration-file"},"Gateway Configuration File"),Object(o.b)("p",null,"GraphQL Portal Gateway server is configured from ",Object(o.b)("inlineCode",{parentName:"p"},"gateway.json|yaml")," file which should be located in a directory ",Object(o.b)("inlineCode",{parentName:"p"},"./config"),"\nrelative to the command."),Object(o.b)("p",null,"For example, if we are launching ",Object(o.b)("inlineCode",{parentName:"p"},"graphql-portal")," command from ",Object(o.b)("inlineCode",{parentName:"p"},"/opt/graphql-portal")," directory, then the gateway configuration\nshould be located in ",Object(o.b)("inlineCode",{parentName:"p"},"/opt/graphql-portal/config/gateway.json|yaml"),"."),Object(o.b)("h2",{id:"api-configuration-files"},"API Configuration Files"),Object(o.b)("p",null,"It is possible to use the gateway with static configuration files, in that case you have to set ",Object(o.b)("inlineCode",{parentName:"p"},"use_dashboard_configs"),"\nto ",Object(o.b)("inlineCode",{parentName:"p"},"false"),"."),Object(o.b)("p",null,"When done so, the gateway will try to load API Configurations from the directories specified in the following options:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"apis_path"),Object(o.b)("li",{parentName:"ul"},"middleware_path"),Object(o.b)("li",{parentName:"ul"},"sources_path.")),Object(o.b)("div",{className:"admonition admonition-info alert alert--info"},Object(o.b)("div",{parentName:"div",className:"admonition-heading"},Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",{parentName:"h5",className:"admonition-icon"},Object(o.b)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},Object(o.b)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Important")),Object(o.b)("div",{parentName:"div",className:"admonition-content"},Object(o.b)("p",{parentName:"div"},"In all of the above options, the path is relative to the directory in which we launch the gateway, i.e. if we are launching\nthe server in ",Object(o.b)("inlineCode",{parentName:"p"},"/opt/graphql-portal")," and the ",Object(o.b)("inlineCode",{parentName:"p"},"apis_path")," is set to ",Object(o.b)("inlineCode",{parentName:"p"},"config/apis"),", then we'll look for the files in\n",Object(o.b)("inlineCode",{parentName:"p"},"/opt/graphql-portal/config/apis/")," directory."))),Object(o.b)("p",null,"The combination of these options allows us to have a flexible configuration structure with separation of concerns,\nwhich if necessary can then be versioned. Here is an example of a typical configuration structure:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-json",metastring:'title="config/gateway.json"',title:'"config/gateway.json"'},'{\n  "use_dashboard_configs": false,\n  "apis_path": "config/apidefs",\n  "middleware_path": "config/middlewares",\n  "sources_path": "config/sources"\n}\n')),Object(o.b)("p",null,"Our directory listing will then look like that:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-text"},"$ tree config/\nconfig\n\u251c\u2500\u2500 apidefs\n\u2502\xa0\xa0 \u2514\u2500\u2500 test-api.json\n\u251c\u2500\u2500 datasources\n\u2502\xa0\xa0 \u2514\u2500\u2500 test-data-source.yaml\n\u251c\u2500\u2500 gateway.json\n\u2514\u2500\u2500 middlewares\n")),Object(o.b)("h2",{id:"environment-variables"},"Environment variables"),Object(o.b)("p",null,"It is possible to override certain configuration options by using environment variables. To do that, you'll have to replace\nthe values of the variables in the configuration file with ",Object(o.b)("inlineCode",{parentName:"p"},"@@ENV_VARIABLE_NAME"),"."),Object(o.b)("p",null,"For example, lets take the following configuration file:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-json",metastring:'title="gateway.json" {2,3,12}',title:'"gateway.json"',"{2,3,12}":!0},'{\n  "hostname": "@@HOSTNAME",\n  "listen_port": @@PORT,\n  "pool_size": 1,\n  "secret": "",\n  "apis_path": "config/apidefs",\n  "sources_path": "config/datasources",\n  "middleware_path": "config/middlewares",\n  "redis_connection_string": "redis://localhost:6379",\n  "use_dashboard_configs": false,\n  "enable_control_api": false,\n  "log_level": "@@LOG_LEVEL"\n}\n')),Object(o.b)("p",null,"As you can see, there are three values which were replaced with ",Object(o.b)("inlineCode",{parentName:"p"},"@@VARIABLE"),". Values which were specified in that way are\ngoing to be taken from the environment variables."),Object(o.b)("h2",{id:"hostname"},"hostname"),Object(o.b)("p",null,"The hostname to bind the gateway node to."),Object(o.b)("h2",{id:"listen_port"},"listen_port"),Object(o.b)("p",null,"The port on which GraphQL Portal Gateway will listen for the incoming connections."),Object(o.b)("h2",{id:"pool_size"},"pool_size"),Object(o.b)("p",null,"The size of the NodeJS Cluster pool, i.e. how many instances of the gateway are going to be launched on the same host.\nIt is recommended to keep this number equal to the number of CPU cores on the machine. Setting this value to 1 will\nlaunch a single-instance gateway."),Object(o.b)("h2",{id:"use_dashboard_configs"},"use_dashboard_configs"),Object(o.b)("p",null,"This boolean value specifies whether to read the API configurations from the local file or from a GraphQL Portal Dashboard."),Object(o.b)("p",null,"If set to ",Object(o.b)("inlineCode",{parentName:"p"},"false"),", the gateway will try to read the configuration files locally and will search for them in the locations\nspecified in the following configuration options:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"apis_path "),Object(o.b)("li",{parentName:"ul"},"middleware_path"),Object(o.b)("li",{parentName:"ul"},"sources_path.")),Object(o.b)("p",null,"If set to ",Object(o.b)("inlineCode",{parentName:"p"},"true"),", it will try to connect to dashboard (see below for dashboard configuration) and get the configuration\nfrom there."),Object(o.b)("h3",{id:"dashboard_config"},"dashboard_config"),Object(o.b)("p",null,"Optional. This value will be used only when ",Object(o.b)("inlineCode",{parentName:"p"},"use_dashboard_configs")," is set to ",Object(o.b)("inlineCode",{parentName:"p"},"true"),"."),Object(o.b)("p",null,"It contains a required options ",Object(o.b)("inlineCode",{parentName:"p"},"connection_string"),", which specifies the URL and connection parameters to the Dashboard.\nExample:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-json"},'{\n  "use_dashboard_configs": true,\n  "dashboard_config": {\n    "connection_string": "http://graphql-portal-dashboard.svc.local:8080"\n  }\n}\n')),Object(o.b)("h2",{id:"apis_path"},"apis_path"),Object(o.b)("p",null,"Path to a directory with API definition files. Read more about ",Object(o.b)("a",{parentName:"p",href:"#api-configuration-files"},"API Configuration Files here"),"."),Object(o.b)("h2",{id:"middleware_path"},"middleware_path"),Object(o.b)("p",null,"Path to a directory with custom middlewares. ",Object(o.b)("a",{parentName:"p",href:"#api-configuration-files"},"API Configuration Files here")),Object(o.b)("h2",{id:"sources_path"},"sources_path"),Object(o.b)("p",null,"Path to a directory with data source files. ",Object(o.b)("a",{parentName:"p",href:"#api-configuration-files"},"API Configuration Files here")),Object(o.b)("h2",{id:"enable_control_api"},"enable_control_api"),Object(o.b)("p",null,"Enables or disables the Control API which is used to update GraphQL Schema definitions."),Object(o.b)("h3",{id:"control_api_config"},"control_api_config"),Object(o.b)("p",null,"Optional. Used only when ",Object(o.b)("inlineCode",{parentName:"p"},"enable_control_api")," is set to ",Object(o.b)("inlineCode",{parentName:"p"},"true"),". Contains only one property ",Object(o.b)("inlineCode",{parentName:"p"},"endpoint")," which specifies\nthe URL path on which to which the Control API will be bind."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-json"},'{\n  "enable_control_api": true,\n  "control_api_config": {\n    "endpoint": "/control-api"\n  }\n}\n')),Object(o.b)("h2",{id:"metrics"},"metrics"),Object(o.b)("p",null,"Optional. Enables metrics gathering. Disabled by default."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-json"},'{\n  "metrics": {\n    "enabled": false\n  }\n}\n')),Object(o.b)("h2",{id:"log_format"},"log_format"),Object(o.b)("p",null,"Optional. Can be ",Object(o.b)("inlineCode",{parentName:"p"},"text")," or ",Object(o.b)("inlineCode",{parentName:"p"},"json"),". Default value is ",Object(o.b)("inlineCode",{parentName:"p"},"text"),"."),Object(o.b)("h2",{id:"log_level"},"log_level"),Object(o.b)("p",null,"Possible values are: 'debug' | 'info' | 'warn' | 'error'."),Object(o.b)("h2",{id:"redis_connection_string"},"redis_connection_string"),Object(o.b)("p",null,"Connection string specifying access to a Redis instance, for example:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-json"},'{\n  "redis_connection_string": "redis://localhost:6379"\n}\n')),Object(o.b)("h2",{id:"request_size_limit"},"request_size_limit"),Object(o.b)("p",null,"Optional. Default value is 100kb. This value specifies an HTTP Request size limit. Accepts numeric (in bytes) or string\nvalues. When string is used, the following abbreviations are used:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"b for bytes"),Object(o.b)("li",{parentName:"ul"},"kb for kilobytes"),Object(o.b)("li",{parentName:"ul"},"mb for megabytes"),Object(o.b)("li",{parentName:"ul"},"gb for gigabytes"),Object(o.b)("li",{parentName:"ul"},"tb for terabytes"),Object(o.b)("li",{parentName:"ul"},"pb for petabytes.")),Object(o.b)("p",null,"Example:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-json"},'{\n  "request_size_limit": "20mb"\n}\n')))}p.isMDXComponent=!0},85:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return h}));var a=n(0),i=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=i.a.createContext({}),p=function(e){var t=i.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},b=function(e){var t=p(e.components);return i.a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},u=i.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,r=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),b=p(n),u=a,h=b["".concat(r,".").concat(u)]||b[u]||d[u]||o;return n?i.a.createElement(h,l(l({ref:t},s),{},{components:n})):i.a.createElement(h,l({ref:t},s))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,r=new Array(o);r[0]=u;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,r[1]=l;for(var s=2;s<o;s++)r[s]=n[s];return i.a.createElement.apply(null,r)}return i.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);