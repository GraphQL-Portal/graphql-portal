import contentfulDefinition from './contentful/src/definitions.json';
import slackDefinitions from './slack/src/definitions.json';
import stripeDefinitions from './stripe/src/definitions.json';
import weatherbitDefinitions from './weatherbit/src/definitions.json';
import crunchbaseDefinitions from './crunchbase/src/definitions.json';
import fedexDefinitions from './fedex/src/definitions.json';
import salesforceDefinitions from './salesforce/src/definitions.json';
import twitteroDefinitions from './twitter/src/definitions.json';

export default {
  ...contentfulDefinition,
  ...crunchbaseDefinitions,
  ...fedexDefinitions,
  ...salesforceDefinitions,
  ...slackDefinitions,
  ...stripeDefinitions,
  ...twitteroDefinitions,
  ...weatherbitDefinitions,
};
