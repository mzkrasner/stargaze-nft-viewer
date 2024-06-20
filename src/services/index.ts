import { type NftProps } from "@/types/index";
import {
  ApolloClient,
  ApolloQueryResult,
  InMemoryCache,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://graphql.mainnet.stargaze-apis.com/graphql",
  cache: new InMemoryCache(),
});

export const getOwnedNfts = (
  ownerAddrOrName: string,
  limit: number,
): Promise<ApolloQueryResult<{ tokens: { tokens: NftProps[] } }>> => {
  return client.query<{
    tokens: {
      tokens: NftProps[];
    };
  }>({
    query: gql`
			query {
			  tokens(ownerAddrOrName: "${ownerAddrOrName}", limit: ${limit}) {
                tokens {
                    name
                    description
                    edition
                    tokenId
                    tokenUri
                    media {
                        height
                        type
                        urls
                        width
                        visualAssets {
                            lg {
                                height
                                staticUrl
                                type
                                url
                                width
                                staticUrl
                            }
                            md {
                                height
                                staticUrl
                                type
                                url
                                width
                            }
                            sm {
                                height
                                staticUrl
                                type
                                url
                                width
                            }
                        }
                        
                    }
                    listPrice {
                        amount
                    }
                    lastSalePrice {
                        amount
                        amountUsd
                    }
                    collection {
                        contractAddress
                        contractUri
                        floorPrice
                    }
                }
			  }
			}
  		`,
  });
};

export const getAllNfts = (
  ownerAddrOrName: string
): Promise<ApolloQueryResult<{ tokens: { tokens: NftProps[] } }>> => {
  return client.query<{
    tokens: {
      tokens: NftProps[];
    };
  }>({
    query: gql`
			query {
			  tokens(ownerAddrOrName: "${ownerAddrOrName}") {
                tokens {
                    name
                    description
                    edition
                    tokenId
                    tokenUri
                    media {
                        height
                        type
                        urls
                        width
                        visualAssets {
                            lg {
                                height
                                staticUrl
                                type
                                url
                                width
                                staticUrl
                            }
                            md {
                                height
                                staticUrl
                                type
                                url
                                width
                            }
                            sm {
                                height
                                staticUrl
                                type
                                url
                                width
                            }
                        }
                        
                    }
                    listPrice {
                        amount
                    }
                    lastSalePrice {
                        amount
                        amountUsd
                    }
                    collection {
                        contractAddress
                        contractUri
                        floorPrice
                    }
                }
			  }
			}
  		`,
  });
};
