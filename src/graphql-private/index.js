const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginLandingPageDisabled } = require('@apollo/server/plugin/disabled');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const express = require('express');
const http = require('http');
const cors = require('cors');
const { json } = require('body-parser');
const graphqlConfig = require('../config/graphql.config');
const { loadFilesSync } = require('@graphql-tools/load-files');

const _ = require('lodash');
const { GraphQLError } = require('graphql');

let contextRedis = null; 
const graphqlServer = async (app, httpServer) => {
    
  const typeDefsFromFile = loadFilesSync('src/graphql-private/**/*.graphql');
  const resolversFromFile = loadFilesSync('src/graphql-private/**/*.{js,ts}');

  const pluginRegistry = [
    ApolloServerPluginDrainHttpServer({ httpServer })
  ];

  
  if(!graphqlConfig.private_landing_page_enable){
    pluginRegistry.push(ApolloServerPluginLandingPageDisabled());
  }

  const server = new ApolloServer({
    typeDefs: typeDefsFromFile, 
    resolvers: resolversFromFile,
    includeStacktraceInErrorResponses: false,
    plugins: pluginRegistry,
    // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (formattedError, error) => {
      return {
        error: formattedError.extensions.message,
        message: formattedError.message,
        code : formattedError.extensions.code,
      };
    },
  });
  await server.start();

  app.use(
    graphqlConfig.private_path,   // default is /gql
    cors(),
    json(),
    expressMiddleware(server, {
    //   context: async ({req, res, next}) => {

    //     // const opName = req.body.operationName || null;
    //     // // try{
    //     // //   if(opName != 'IntrospectionQuery' && opName != null){
    //     // //     const counterIndex = `request_counter:private:${opName}`;
    //     // //     const counter = await contextRedis.get(counterIndex) || 0;
    //     // //     const newCounter = parseInt(counter) + 1 % 1000000; 
    //     // //     contextRedis.set(counterIndex, newCounter);
    //     // //   }
    //     // // }catch(ex){
    //     // //     console.log(ex.message);
    //     // // }
        
    //     // ///////////////////////////////////
    //     // // Check authroization
    //     // // - Prevent check authorzation for IntrospectionQuery
    //     // //
    //     // if (req?.body?.operationName == "IntrospectionQuery") {
    //     //   return ({});
    //     // }
        
    //     // let filteredHeader = {};
    //     // // const authorization = req?.headers?.authorization || undefined;
    //     // // if(authorization){
    //     // //   filteredHeader.authorization = authorization;

    //     // //   const tokenSplit = authorization.split(' ');
    //     // //   const method = tokenSplit[0] || undefined;
    //     // //   const token = tokenSplit[1] || undefined;

    //     // //   // filteredHeader.tokenMethod = method;
    //     // //   // filteredHeader.token = token;

    //     // //   // set crud_user_id to header
    //     // // //   try{
    //     // // //     const getMeResult = await getMeRedis(token);
    //     // // //     // console.log(getMeResult);
    //     // // //     if (
    //     // // //       getMeResult?.code === 1000 &&
    //     // // //       getMeResult?.success == true &&
    //     // // //       !_.isEmpty(getMeResult?.user)
    //     // // //     ) {
    //     // // //       filteredHeader.crud_user_id = getMeResult?.user?.crud_user_id || undefined;
    //     // // //     }
    //     // // //   }catch(ex){
    //     // // //     console.log(`[middleware:get_crud_user_id:error] ex=${ex.message}`)
    //     // // //   }
    //     // // }

    //     // return (filteredHeader);

    //   }
    })
  );
  
};
module.exports = graphqlServer;