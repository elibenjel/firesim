if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');

const bodyParser = require("body-parser");
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const mg = require('mongoose');
const { getModels } = require('./models');
const { UserRoles } = require('./enums');
const UserAPI = require('./datasources/user');

function setupExpressMiddleware() {
  const app = express();
  const config = require('./webpack.config.js');
  const compiler = webpack(config);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );

  app.use(require("webpack-hot-middleware")(compiler, {
    log: false,
    path: `/__webpack_hmr`,
    heartbeat: 10 * 1000,
  }));

  return app;
}

async function startApolloServer(typeDefs, resolvers) {
  const app = setupExpressMiddleware();
  const httpServer = http.createServer(app);
  const models = getModels(mg);
  let connectedToDB = false;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    dataSources: () => ({
        userAPI: new UserAPI({ models })
    }),
    context: async function({ req }) {
      if (!connectedToDB) {
        console.log('Connecting to database...');
        mg.connect(process.env.MONGODB_URI).then(() => console.log('Connected !')).catch((err) => { throw err });
        connectedToDB = true;
      }
  
      if (process.env.NODE_ENV !== 'production' && req.headers.origin === 'https://studio.apollographql.com') {
        console.log(typeDefs);
        return {user : { token : '', roles : [UserRoles.ADMIN]}};
      }
  
      // simple auth check on every request
      const token = req.headers?.authorization?.split(' ')[1] || null;
      const user = token ? await UserAPI.authUser(token) : null;
      // if (!user) throw new AuthenticationError('You must be logged in.');
      
      return { user: {token : token, roles : user?.roles} };
    },
    formatError: (err) => {
      console.error(err.extensions.exception.stacktrace);
      return err;
    }
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`
    Server is running!
    Listening at http://localhost:${process.env.PORT}${server.graphqlPath}
    Explore at https://studio.apollographql.com/sandbox
  `);
}

process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down the server and closing connection to database (SIGINT).");
  mg.connection?.close();
});

startApolloServer(typeDefs, resolvers);
