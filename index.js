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
            },

        },
        Game:{
            reviews(parent){
                return _db.reviews.filter(review => review.game_id === parent.id)
            }

        },
        Author:{
            reviews(parent){
                return _db.reviews.filter(review => review.author_id === parent.id);
            }
        },
        Review:{
            game(parent){
                return _db.games.find((game)=> game.id === parent.game_id) 
            },
            author(parent){
                return _db.authors.find((author)=> author.id === parent.author_id)
            }
        },
        Mutation:{
            deleteGame(_, args){
                _db.games = _db.games.filter(game => game.id !== args.id);
                return _db.games;
            },
            deleteAuthor(_, args){
                _db.authors = _db.authors.filter(author => author.id !== args.id);
                return _db.authors;
            },
            deleteReview(_, args){
                _db.reviews = _db.reviews.filter(review => review.id !== args.id);
                return _db.reviews;
            },
            addGame(_,args){
                let game = {
                    ...args.game,
                    id: Math.floor(Math.random() * 10000).toString(),
                }
                _db.games.push(game);
                return game;
            },
            updateGame(_, args){
                let game = _db.games.find(game => game.id === args.id);
                if(!game) throw new Error("Game not found");
                Object.assign(game, args.edits);
                return game;
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