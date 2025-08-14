import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import _db from "./_db.js";


const resolvers = {
    Query:{
        games(){
            return _db.games
        },
        authors(){
            return _db.authors
        },
        reviews(){
            return _db.reviews
        },
        review(_, args){
            return _db.reviews.find(review => review.id === args.id)
        },
        game(_, args){
            return _db.games.find(game => game.id === args.id)
        },
        author(_, args){
            return _db.authors.find(author => author.id === args.id)
        }
    }
}

const server = new ApolloServer({
    typeDefs, // apolloServer so now knows about our types.
    resolvers // to handle the queries.
});

const {url} = await startStandaloneServer(server,
    {
        listen:{port:8000},
    }
);
console.log(`🚀  Server ready at: ${url}`);