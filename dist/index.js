import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
//db
let games = [
    { id: '1', title: 'Zelda, Tears of the Kingdom', platform: ['Switch'] },
    { id: '2', title: 'Final Fantasy 7 Remake', platform: ['PS5', 'Xbox'] },
    { id: '3', title: 'Elden Ring', platform: ['PS5', 'Xbox', 'PC'] },
    { id: '4', title: 'Mario Kart', platform: ['Switch'] },
    { id: '5', title: 'Pokemon Scarlet', platform: ['PS5', 'Xbox', 'PC'] },
];
let authors = [
    { id: '1', name: 'mario', verified: true },
    { id: '2', name: 'yoshi', verified: false },
    { id: '3', name: 'peach', verified: true },
];
let reviews = [
    { id: '1', rating: 9, content: 'lorem ipsum', author_id: '1', game_id: '2' },
    { id: '2', rating: 10, content: 'lorem ipsum', author_id: '2', game_id: '1' },
    { id: '3', rating: 7, content: 'lorem ipsum', author_id: '3', game_id: '3' },
    { id: '4', rating: 5, content: 'lorem ipsum', author_id: '2', game_id: '4' },
    { id: '5', rating: 8, content: 'lorem ipsum', author_id: '2', game_id: '5' },
    { id: '6', rating: 7, content: 'lorem ipsum', author_id: '1', game_id: '2' },
    { id: '7', rating: 10, content: 'lorem ipsum', author_id: '3', game_id: '1' },
];
//types
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
//scalar types : int, float, string, boolean, ID
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  type Game {
    id : ID!
    title: String!
    platform: [String!]!
    reviews : [Review!]
  }

  type Review {
    id : ID!
    rating : Int!
    content : String!
    game : Game!
    author : Author!
  }

  type Author {
    id : ID!
    name : String!
    verified : Boolean
    reviews : [Review!]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. THIS IS THE ENTRY POINT INTO THE GRAPHs.
  type Query {
    reviews : [Review]
    review(id : ID!) : Review
    games : [Game]
    game(id: ID!) : Game
    authors : [Author]
    author(id : ID!) : Author
  }

  type Mutation {
    addGame(game : AddGameInput!) : Game
    deleteGame(id: ID!) : [Game]
    updateGame(id : ID!, updatedGame : UpdateGameInput!) : Game
  }

  input AddGameInput {
    title : String!,
    platform : [String!]!
  }

  input UpdateGameInput {
    title : String,
    platform : [String!]
  }
`;
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        games: () => games,
        game: (_, args) => {
            return games.find((game) => game.id === args.id);
        },
        reviews: () => reviews,
        review: (_, args) => {
            return reviews.find((review) => review.id === args.id);
        },
        authors: () => authors,
        author: (_, args) => {
            return authors.find((author) => author.id === args.id);
        }
    },
    Game: {
        reviews: (parent) => {
            return reviews.filter((review) => review.game_id === parent.id);
        }
    },
    Author: {
        reviews: (parent) => {
            return reviews.filter((review) => review.author_id === parent.id);
        }
    },
    Review: {
        author: (parent) => {
            return authors.find((author) => author.id === parent.author_id);
        },
        game: (parent) => {
            return games.find((game) => game.id === parent.game_id);
        }
    },
    Mutation: {
        deleteGame: (_, args) => {
            return games.filter((game) => game.id !== args.id);
        },
        addGame: (_, args) => {
            let newGame = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString()
            };
            games.push(newGame);
            return newGame;
        },
        updateGame: (_, args) => {
            let updatedGames = games.map((game) => {
                if (game.id === args.id) {
                    return { ...game, ...args.updatedGame };
                }
                return game;
            });
            games = updatedGames;
            return games.find((game) => game.id === args.id);
        }
    }
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
