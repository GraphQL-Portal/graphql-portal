export default {
  getApiDefs: `query {
    getApiDefs {
      timestamp
      apiDefs {
        name
        endpoint
        sources {
          name
          handler
          transforms
        }
      }
    }
  }`,
};
