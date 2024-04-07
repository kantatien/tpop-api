require("dotenv").config();

const privateEnable = process.env.GRAPHQL_PRIVATE_ENABLE || 'ENABLE';
const privateLandingPageEnable = process.env.GRAPHQL_PRIVATE_LANDING_PAGE_ENABLE || 'ENABLE';
const publicEnable = process.env.GRAPHQL_PUBLIC_ENABLE || 'ENABLE';
const publicLandingPageEnable = process.env.GRAPHQL_PUBLIC_LANDING_PAGE_ENABLE || 'ENABLE';

const graphqlConfig = {
  port : process.env.GRAPHQL_PORT || '55000', 
  private_enable : privateEnable.toLowerCase() == 'enable',
  private_path : process.env.GRAPHQL_PRIVATE_PATH || '/gql',
  private_landing_page_enable : privateLandingPageEnable.toLowerCase() == 'enable',
  public_enable : publicEnable.toLowerCase() == 'enable',
  public_path : process.env.GRAPHQL_PUBLIC_PATH || '/gql-public',
  public_landing_page_enable : publicLandingPageEnable.toLowerCase() == 'enable',
};

module.exports = graphqlConfig;
