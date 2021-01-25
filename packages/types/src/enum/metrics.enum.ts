enum MetricsChannels {
  NETWORK = 'network-metrics',
  RESOLVER_CALLED = 'resolver-called',
  RESOLVER_ERROR = 'resolver-error',
  RESOLVER_DONE = 'resolver-done',
  SENT_RESPONSE = 'sent-response',
  GOT_REQUEST = 'got-request',
  GOT_ERROR = 'got-error',
  REQUEST_IDS = 'request-ids',
}

enum PubSubEvents {
  RESOLVER_CALLED = 'resolverCalled',
  RESOLVER_DONE = 'resolverDone',
  RESOLVER_ERROR = 'resolverError',
}

export { MetricsChannels, PubSubEvents };
