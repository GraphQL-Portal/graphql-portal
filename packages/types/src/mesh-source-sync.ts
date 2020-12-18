import meshConfig from '@graphql-mesh/types/config-schema.json';
import sourceConfig from './mesh-source-schema.json';
import fs from 'fs';

sourceConfig.definitions = meshConfig.definitions as any;
fs.writeFileSync(`${__dirname}/mesh-source-schema.json`, JSON.stringify(sourceConfig));
