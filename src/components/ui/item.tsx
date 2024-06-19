import React, { forwardRef, HTMLAttributes, CSSProperties } from "react";
import Image from "next/image";
import { type NftProps } from "@/types";

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  token: NftProps;
  index: number;
  withOpacity?: boolean;
  isDragging?: boolean;
};

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ token, index, withOpacity, isDragging, style, ...props }, ref) => {
    const inlineStyles: CSSProperties = {
      opacity: withOpacity ? "0.5" : "1",
      cursor: isDragging ? "grabbing" : "grab",
      // boxShadow: isDragging  ? 'rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px' : 'rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px',
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      ...style,
    };

    return (
      <div ref={ref} {...props} id={index.toString()} style={inlineStyles}>
        <Image
          priority
          src={token.media.visualAssets.lg.staticUrl}
          alt={token.name}
          unoptimized={true}
          width={token.media.visualAssets.lg.width}
          height={token.media.visualAssets.lg.height}
          className="rounded-lg border-none object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 m-auto flex max-h-10 flex-row items-center justify-center rounded-b-lg bg-background/70 p-4 align-middle backdrop-blur-lg">
          <h5 className="text-center text-xs font-semibold">{token.name}</h5>
        </div>
      </div>
    );
  },
);

export default Item;
