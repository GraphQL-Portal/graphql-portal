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
        authentication {
          auth_tokens
          auth_header_name
        }
      }
    }
  }`,
};
