export default {
  getApis: `query {
    getApis {
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
