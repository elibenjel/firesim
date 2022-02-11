if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');

const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const typeDefs = require('./schema/schema');
const resolvers = require('./resolvers/resolvers');
const mg = require('mongoose');
const { UserRoles } = require('./enums');
const { getModels } = require('./datasources/models');
const UserAPI = require('./datasources/user');
const SimulationAPI = require('./datasources/simulation');

function setupExpressMiddleware() {
  const app = express();
  const config = require('../webpack.config.js');
  const compiler = webpack(config);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(require('webpack-hot-middleware')(compiler, {
    log: false,
    path: `/__webpack_hmr`,
    heartbeat: 10 * 1000,
  }));

  app.use(history({
    rewrites: [
      { from: /\/graphql/, to: '/graphql'}
    ]
  }));
  
  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );

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
        userAPI: new UserAPI({ models }),
        simulationAPI: new SimulationAPI({ models })
    }),
    context: async function({ req }) {
      console.log('Received ', req.method, ' request:\n body: ', req.body);
      if (!connectedToDB) {
        console.log('Connecting to database...');
        await mg.connect(process.env.MONGODB_URI);
        try {
          console.log('Connected !');
          connectedToDB = true;
        } catch (err) {
          console.log('Connection to database failed');
        }
      }
  
      // if (process.env.NODE_ENV !== 'production' && req.headers.origin === 'https://studio.apollographql.com') {
      //   console.log(typeDefs);
      //   return {user : { token : '', roles : [UserRoles.ADMIN]}};
      // }
  
      // simple auth check on every request, returns a default unkown user if the authentication fails
      const token = req.headers?.authorization?.split(' ')[1] || null;
      const user = await UserAPI.authUser(token, models);
      // if (!user) throw new AuthenticationError('You must be logged in.');
      
      return { user: { token : token, roles : user?.roles, document : user } };
    },
    formatError: (err) => {
      console.error(err.extensions.exception.stacktrace);
      return err;
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  // app.get('/*', function(req, res) {
  //   // res.sendFile(path.resolve(__dirname, 'path/to/your/index.html'), function(err) {
  //     res.sendFile(path.resolve('build', 'index.html'), function(err) {
  //       if (err) {
  //       res.status(500).send(err)
  //     }
  //   })
  // })

  await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`
    Server is running!
    Listening to graphql requests at http://localhost:${process.env.PORT}${server.graphqlPath}
    Connect to FIRESim at http://localhost:${process.env.PORT}/
    Explore at https://studio.apollographql.com/sandbox
  `);
}

process.on('SIGINT', function() {
  console.log( '\nGracefully shutting down the server and closing connection to database (SIGINT).');
  mg.connection?.close();
});

startApolloServer(typeDefs, resolvers);
