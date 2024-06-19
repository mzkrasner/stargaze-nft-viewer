import { ChainInfo } from "@keplr-wallet/types";

export const EmbedChainInfos: ChainInfo[] = [
  {
    rpc: "https://rpc.cosmos.directory/stargaze",
    rest: "https://rest.stargaze-apis.com/",
    chainId: "stargaze-1",
    chainName: "Stargaze",
    stakeCurrency: {
      coinDenom: "STARS",
      coinMinimalDenom: "ustars",
      coinDecimals: 6,
      coinGeckoId: "stars",
      coinImageUrl: "https://stargaze.zone/logo.png",
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "stars",
      bech32PrefixAccPub: "stars" + "pub",
      bech32PrefixValAddr: "stars" + "valoper",
      bech32PrefixValPub: "stars" + "valoperpub",
      bech32PrefixConsAddr: "stars" + "valcons",
      bech32PrefixConsPub: "stars" + "valconspub",
    },
    currencies: [
      {
        coinDenom: "STARS",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
        coinGeckoId: "stars",
        coinImageUrl: "https://stargaze.zone/logo.png",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "STARS",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
        coinGeckoId: "stargaze",
        coinImageUrl: "https://stargaze.zone/logo.png",
      },
    ],
    features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
  },
];
