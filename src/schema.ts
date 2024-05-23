 // A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

//scalar types : int, float, string, boolean, ID
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  type Game {
    id : ID!
    title: String!
    platform: [String!]!
  }

  type Review {
    id : ID!
    rating : Int!
    content : String!
  }

  type Author {
    id : ID!
    name : String!
    verified : Boolean
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. THIS IS THE ENTRY POINT INTO THE GRAPHs.
  type Query {
    reviews : [Reviews]
    games : [Game]
    authors : [Author]
  }
`;