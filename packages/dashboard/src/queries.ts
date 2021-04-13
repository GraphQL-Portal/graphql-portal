export default {
  getAllApiDefsForGateway: `query {
    getAllApiDefsForGateway {
      timestamp
      apiDefs {
        name
        endpoint
        playground
        sources {
          name
          handler
          transforms
        }
        authentication {
          auth_tokens
          auth_header_name
        }
        mesh
      }
    }
  }`,
};
