export default {
  getAllApiDefs: `query {
    getAllApiDefs {
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
