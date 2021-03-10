import contentfulDefinition from './contentful/src/definitions.json';
import slackDefinitions from './slack/src/definitions.json';
import stripeDefinitions from './stripe/src/definitions.json';
import weatherbitDefinitions from './weatherbit/src/definitions.json';
import crunchbaseDefinitions from './crunchbase/src/definitions.json';
import salesforceDefinitions from './salesforce/src/definitions.json';
import twitteroDefinitions from './twitter/src/definitions.json';
import ipApiDefinitions from './ip-api/src/definitions.json';

export default {
  ...contentfulDefinition,
  ...crunchbaseDefinitions,
  ...salesforceDefinitions,
  ...slackDefinitions,
  ...stripeDefinitions,
  ...twitteroDefinitions,
  ...weatherbitDefinitions,
  ...ipApiDefinitions,
};
