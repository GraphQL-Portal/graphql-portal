import { definitions, properties } from '@graphql-mesh/types/config-schema.json';
import sourceConfig from './mesh-source-schema.json';
import apiDefConfig from './api-def-schema.json';
import sources from '@graphql-portal/datasource';
import fs from 'fs';

const dataSourceProperties = Object.keys(sources).map((source: string) => ({ [source]: { "$ref": `#/definitions/${source}` } }));
definitions.Handler.properties = Object.assign({}, definitions.Handler.properties, ...dataSourceProperties);
sourceConfig.definitions = { ...definitions, ...sources }  as any;

fs.writeFileSync(`${__dirname}/mesh-source-schema.json`, JSON.stringify(sourceConfig));

apiDefConfig.definitions = definitions as any;
apiDefConfig.properties.mesh.properties = properties as any;
fs.writeFileSync(`${__dirname}/api-def-schema.json`, JSON.stringify(apiDefConfig));
