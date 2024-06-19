
export interface NftProps {
  name: string;
  description: string;
  lastSalePrice: {
    amount: string;
    amountUsd: number;
  }
  price?: number;
  tokenId: string;
  media: {
    height: number;
    width: number;
    visualAssets: {
      lg: {
        height: number;
        staticUrl: string;
        type: string;
        url: string;
        width: number;
      }
      md: {
        height: number;
        staticUrl: string;
        type: string;
        url: string;
        width: number;
      }
      sm: {
        height: number;
        staticUrl: string;
        type: string;
        url: string;
        width: number;
      }
    }
  }
  collection: {
    contractAddress: string;
    contractUri: string;
    floorPrice: string;
  }
}
