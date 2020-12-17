export default {
  getApiDefs: `query {
    getApiDefs {
      name
      endpoint
      sources {
        name
        handler
        transforms
      }
    }
  }`,
};
