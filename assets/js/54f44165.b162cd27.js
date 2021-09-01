(self.webpackChunkdocs_website=self.webpackChunkdocs_website||[]).push([[152],{3905:function(e,t,n){"use strict";n.d(t,{Zo:function(){return p},kt:function(){return h}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=a.createContext({}),s=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=s(e.components);return a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=s(n),h=o,g=u["".concat(c,".").concat(h)]||u[h]||d[h]||r;return n?a.createElement(g,l(l({ref:t},p),{},{components:n})):a.createElement(g,l({ref:t},p))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,l=new Array(r);l[0]=u;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var s=2;s<r;s++)l[s]=n[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},681:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return i},metadata:function(){return c},toc:function(){return s},default:function(){return d}});var a=n(2122),o=n(9756),r=(n(7294),n(3905)),l={id:"installation",title:"Installation",sidebar_label:"Installation"},i=void 0,c={unversionedId:"getting-started/installation",id:"getting-started/installation",isDocsHomePage:!1,title:"Installation",description:"Prerequisites",source:"@site/docs/getting-started/installation.md",sourceDirName:"getting-started",slug:"/getting-started/installation",permalink:"/getting-started/installation",editUrl:"https://github.com/graphql-portal/graphql-portal/edit/main/docs-website/docs/getting-started/installation.md",tags:[],version:"current",frontMatter:{id:"installation",title:"Installation",sidebar_label:"Installation"},sidebar:"docs",previous:{title:"Quick Start",permalink:"/getting-started/quick-start"},next:{title:"Data Connectors",permalink:"/getting-started/available-data-connectors"}},s=[{value:"Prerequisites",id:"prerequisites",children:[]},{value:"Docker Compose",id:"docker-compose",children:[]},{value:"Standalone Docker containers",id:"standalone-docker-containers",children:[]},{value:"Standalone Gateway with Yarn/NPM",id:"standalone-gateway-with-yarnnpm",children:[]},{value:"Standalone Dashboard without Docker",id:"standalone-dashboard-without-docker",children:[]}],p={toc:s};function d(e){var t=e.components,n=(0,o.Z)(e,["components"]);return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h3",{id:"prerequisites"},"Prerequisites"),(0,r.kt)("p",null,"Unless installed via docker compose, you will need:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Redis \u2013 required by Gateway and Dashboard"),(0,r.kt)("li",{parentName:"ul"},"MongoDB - required by Dashboard only")),(0,r.kt)("h3",{id:"docker-compose"},"Docker Compose"),(0,r.kt)("p",null,"Check out ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/graphql-portal/graphql-portal-docker"},"our dedicated repository")," with docker compose files and examples of the configuration:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"git clone git@github.com:GraphQL-Portal/graphql-portal-docker.git\ncd graphql-portal-docker\n\ndocker-compose -f docker-compose.yml up\n")),(0,r.kt)("h3",{id:"standalone-docker-containers"},"Standalone Docker containers"),(0,r.kt)("p",null,"Install and launch the Gateway:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"docker pull gqlportal/gateway:latest\n")),(0,r.kt)("p",null,"Now that you have Docker image locally, you will need to prepare a basic configuration file.\nYou may download a sample config:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"curl -s -o ./gateway.yaml https://raw.githubusercontent.com/graphql-portal/graphql-portal-docker/main/basic.gateway.yaml\n")),(0,r.kt)("p",null,"Once that is done, you can now launch the Gateway in a standalone mode (you may have to specify a Redis connection\nstring relevant to your local environment):"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},'docker run --name graphql-gateway \\\n  -p 3000:3000 \\\n  -e REDIS="redis://localhost:6379" \\\n  -v $(pwd)/gateway.yaml:/opt/graphql-portal/config/gateway.yaml \\\n  gqlportal/gateway:latest\n')),(0,r.kt)("p",null,"Install and launch Dashboard:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},'docker pull gqlportal/dashboard:latest\n\n# Modify the connection strings depending on your environment\ndocker run --name graphql-dashboard \\\n  -e REDIS_CONNECTION_STRING="redis://localhost:6379" \\\n  -e MONGODB_CONNECTION_STRING="mongodb://localhost:27017" \\\n  -p 3030:3030 \\\n  -p 8080:8080 \\\n  gqlportal/dashboard:latest\n')),(0,r.kt)("p",null,"You now should be able to open the configuration dashboard by going to http://localhost:8080 in your browser."),(0,r.kt)("h3",{id:"standalone-gateway-with-yarnnpm"},"Standalone Gateway with Yarn/NPM"),(0,r.kt)("p",null,"The Gateway can also be installed either via npm/yarn, or by pulling this repository and then building the source codes."),(0,r.kt)("p",null,"The package ",(0,r.kt)("inlineCode",{parentName:"p"},"@graphql-portal/gateway")," provides a CLI command ",(0,r.kt)("inlineCode",{parentName:"p"},"graphql-portal")," which will start the server.\nHowever, in order for the server to start correctly, we should first create (or download) a configuration file. By\ndefault, GraphQL Portal will search for a configuration in ",(0,r.kt)("inlineCode",{parentName:"p"},"./config/gateway.json|yaml")," file. That's why, prior to\nlaunching the gateway, you may want to create a directory and place a config file into it. You can use a ",(0,r.kt)("a",{parentName:"p",href:"https://raw.githubusercontent.com/graphql-portal/graphql-portal-docker/main/basic.gateway.yaml"},"basic configuration\nfile"),"\nfrom our ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/graphql-portal/graphql-portal-docker"},"examples repository here"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"# create directories for configuration\nmkdir -p /opt/graphql-portal/config && cd /opt/graphql-portal\n\n# download a basic configuration file\ncurl -s -o ./config/gateway.yaml https://raw.githubusercontent.com/graphql-portal/graphql-portal-docker/main/basic.gateway.yaml\n")),(0,r.kt)("p",null,"Now that the configuration is in place, we can install and launch the gateway:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},'# install the gateway and go to the directory with configuration\nyarn global add @graphql-portal/gateway\n\n# @graphql-portal/gateway package provides a CLI command graphql-portal\n# we will also need a Redis connection string in order to launch the gateway\nenv REDIS="redis://localhost:6379" NODE_ENV=production graphql-portal\n')),(0,r.kt)("p",null,"You should now see the output of the server without any errors.\n",(0,r.kt)("a",{parentName:"p",href:"/configuration/basic"},"Read more about the configuration of the gateway here.")),(0,r.kt)("h3",{id:"standalone-dashboard-without-docker"},"Standalone Dashboard without Docker"),(0,r.kt)("p",null,"At the moment, GraphQL Portal Dashboard consists from the following components:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Backend (NestJS)"),(0,r.kt)("li",{parentName:"ul"},"Frontend (React),")),(0,r.kt)("p",null,"and requires the following dependencies:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"MongoDB"),(0,r.kt)("li",{parentName:"ul"},"connection to Redis \u2013 same Redis used by Gateway.")),(0,r.kt)("p",null,"It is not distributed via Yarn/NPM and can be installed locally by pulling and building the source code from the repository:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"mkdir /opt/graphql-portal-dashboard\ngit clone https://github.com/graphql-portal/graphql-portal-dashboard /opt/graphql-portal-dashboard\n\ncd /opt/graphql-portal-dashboard\n\n# the following two steps can take some time\nyarn install --frozen-lockfile\nyarn build\n")),(0,r.kt)("p",null,"We'll have to edit the configuration file before launching the server. To do that, open the configuration file for\n",(0,r.kt)("em",{parentName:"p"},"production")," environment:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"vim packages/backend/config/env/production.json\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="packages/backend/config/env/production.json"',title:'"packages/backend/config/env/production.json"'},'{\n  "gateway": {\n    "secret": "@@DASHBOARD_SECRET"\n  },\n  "application": {\n    "env": "production",\n    "host": "@@HOST",\n    "publicHost": "@@PUBLIC_HOST",\n    "useSwaggerUi": false,\n    "port": "@@DASHBOARD_PORT",\n    "graphQL": {\n      "playground": "@@GRAPHQL_PLAYGROUND",\n      "debug": "@@GRAPHQL_PLAYGROUND"\n    },\n    "serveStatic": "false",\n    "jwtSecret": "@@JWT_SECRET",\n    "logLevel": "log",\n    "maxmind": {\n      "dbPath": "@@MAXMIND_DB_PATH",\n      "licenseKey": "@@MAXMIND_LICENSE_KEY",\n      "accountId": "@@MAXMIND_ACCOUNT_ID"\n    },\n    "sendgrid": {\n      "senderEmail": "@@SENDGRID_SENDER_EMAIL",\n      "confirmationTemplateId": "@@SENDGRID_CONFIRMATION_TEMPLATE",\n      "resetPasswordTemplateId": "@@SENDGRID_RESET_PASSWORD_TEMPLATE",\n      "apiKey": "@@SENDGRID_API_KEY"\n    },\n    "defaultAdmin": {\n      "email": "@@DEFAULT_ADMIN_EMAIL",\n      "password": "@@DEFAULT_ADMIN_PASSWORD"\n    },\n    "metrics": {\n      "enabled": "@@METRICS_ENABLED",\n      "chunk": "@@METRICS_CHUNK",\n      "delay": "@@METRICS_DELAY"\n    },\n    "cryptoSecret": "@@CRYPTO_SECRET"\n  },\n  "client": {\n    "host": "@@CLIENT_HOST"\n  },\n  "db": {\n    "redis": {\n      "connectionString": "@@REDIS_CONNECTION_STRING"\n    },\n    "mongodb": {\n      "connectionString": "@@MONGODB_CONNECTION_STRING"\n    }\n  }\n}\n')),(0,r.kt)("p",null,"In that file, we have 3 main configuration variables which we have to specify:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"port \u2013 it is a port on which the dashboard application is going to be available;"),(0,r.kt)("li",{parentName:"ul"},"redis:connectionString \u2013 self-explicative, connection string for Redis"),(0,r.kt)("li",{parentName:"ul"},"mongodb:connectionString \u2013 connection string for Mongo.")),(0,r.kt)("p",null,"Now, we have two choices: either we can pass these values as environment variables, or we can put them directly in the file.\nIn our current case, we will pass them as environment variables. Read more about ",(0,r.kt)("a",{parentName:"p",href:"/configuration/basic"},"the configuration of the Gateway and\nDashboard here"),"."),(0,r.kt)("p",null,"We can now launch the server:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},'# replace the following values with those relevant to your environment\nDASHBOARD_PORT=8080 \\\nREDIS_CONNECTION_STRING="redis://localhost:6379" \\\nMONGODB_CONNECTION_STRING="mongodb://localhost:27017" \\\nNODE_ENV=production yarn start:prod\n')),(0,r.kt)("p",null,"Once the server is launched, you can open the dashboard by going to http://localhost:8080."))}d.isMDXComponent=!0}}]);