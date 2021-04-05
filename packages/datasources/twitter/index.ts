import { name as packageName } from './package.json';
import definitions from './src/definitions.json';
import handler from './src/handler';

export default handler;
export { packageName, definitions, handler };
