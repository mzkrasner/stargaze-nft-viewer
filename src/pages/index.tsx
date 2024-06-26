import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import SortableItem from "@/components/ui/sortableItem";
import Item from "@/components/ui/item";
import { type NftProps } from "@/types/index";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useAccount } from "graz";
import { getAllNfts } from "@/services/index";
import useStore from "@/zustand/store";
import Head from "next/head";

export default function Home() {
  const { data: account } = useAccount();
  const [allTokens, setAllTokens] = useState<NftProps[]>([]);
  const [deletedTokens, setDeletedTokens] = useState<NftProps[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>(
    undefined,
  );
  const [displayedTokens, setDisplayedTokens] = useState<number>(3);
  const [none, setNone] = useState<boolean>(false);
  const { color } = useStore();
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Drag and drop handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setAllTokens((tokens) => {
        const oldIndex = Number(active.id);
        const newIndex = Number(over?.id);
        return arrayMove(tokens, oldIndex, newIndex);
      });
    }

    setActiveId(undefined);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(undefined);
  }, []);

  // Call for NFTs will occur each time there is a change to the account connected
  const getNfts = async (addr: string): Promise<NftProps[] | undefined> => {
    try {
      const allResponse = await getAllNfts(addr);
      // sort by lastSalePrice.amountUsd since this option is not available in the query
      const allResponseTokens = allResponse.data.tokens.tokens
        .map((item) => Object.assign({}, item, { selected: false }))
        .sort((a, b) => {
          if (a.lastSalePrice?.amountUsd && b.lastSalePrice?.amountUsd) {
            return b.lastSalePrice.amountUsd - a.lastSalePrice.amountUsd;
          }
          return 0;
        });

      if (allResponseTokens.length === 0) {
        setNone(true);
        setTotal(undefined);
        setAllTokens([]);
        return;
      }
      setNone(false);
      if (allResponseTokens.length < 3) {
        setDisplayedTokens(allResponseTokens.length);
      } else {
        setDisplayedTokens(3);
      }
      setAllTokens(allResponseTokens);
      setTotal(allResponseTokens.length);
      return allTokens;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  // Allowing the user to show more or less NFTs
  const alterView = (caseType: number) => {
    switch (caseType) {
      case 1:
        setDisplayedTokens(displayedTokens + 1);
        break;
      case 2:
        setDisplayedTokens(displayedTokens - 1);
        break;
      default:
        break;
    }
  };

  // Necessary for allowing individual removal of NFTs
  const removeItem = (tokenId: string) => {
    // remove item based on tokenId from tokens
    const tokenToRemove = allTokens.find((token) => token.tokenId === tokenId);
    if (tokenToRemove) {
      setDeletedTokens((deletedTokens) => [...deletedTokens, tokenToRemove]);
      setAllTokens((allTokens) =>
        allTokens.filter((token) => token.tokenId !== tokenId),
      );
      setDisplayedTokens(displayedTokens - 1);
    }
  };

  // Necessary for allowing individual adding back of NFTs
  const reverseRemoval = (tokenId: string) => {
    const tokenToReverse = deletedTokens.find(
      (token) => token.tokenId === tokenId,
    );
    if (tokenToReverse) {
      setDeletedTokens((deletedTokens) =>
        deletedTokens.filter((token) => token.tokenId !== tokenId),
      );
      setAllTokens((allTokens) => [...allTokens, tokenToReverse]);
      setDisplayedTokens(displayedTokens + 1);
    }
  };

  useEffect(() => {
    if (account) {
      void getNfts(account.bech32Address);
    }
    return () => {
      setAllTokens([]);
      setTotal(undefined);
      setDisplayedTokens(3);
    };
  }, [account]);

  useEffect(() => {
    document.body.style.backgroundImage =
      color.length > 0
        ? `linear-gradient(180deg, ${color} 0%, rgba(255, 255, 255, 0) 50%)`
        : "none";
  }, [color]);

  return (
    <div className="min-h-screen" id="home">
      <Head>
        <title>Stargaze NFT Viewer</title>
        <meta
          name="description"
          content="View your favorite Stargaze NFTs - drag and drop to organize them in whichever way you desire."
        />
        <meta
          property="og:description"
          content="View your favorite Stargaze NFTs - drag and drop to organize them in whichever way you desire."
        />
      </Head>
      <div className="border-border">
        <main className="container mx-auto">
          <div className="relative mx-auto w-full max-w-4xl pt-4 text-center md:mt-24">
            <div className="hidden justify-center md:flex"></div>
            <h1 className="my-4 text-4xl font-extrabold md:text-7xl md:leading-tight">
              Stargaze NFT Viewer
            </h1>
            <h2 className="my-4 text-2xl font-bold">
              View your favorite Stargaze NFTs
            </h2>
            <h3 className="text-md my-4 font-medium">
              Drag and drop to organize them in whichever way you desire.
            </h3>
            <div className="my-8 flex flex-row items-center justify-center space-x-4">
              {account && (
                <Button onClick={() => getNfts(account.bech32Address)}>
                  Logged in with:{" "}
                  {account?.bech32Address.slice(0, 6) +
                    "..." +
                    account?.bech32Address.slice(-6)}
                </Button>
              )}
            </div>
            <div className="absolute top-0 -z-10 h-full max-h-full w-full max-w-screen-lg blur-2xl">
              <div className="absolute left-24 top-24 h-56 w-56 animate-blob rounded-full bg-violet-600 opacity-70 mix-blend-multiply blur-3xl filter"></div>
              <div className="absolute bottom-2 right-1/4 hidden h-56 w-56 animate-blob rounded-full bg-sky-600 opacity-70 mix-blend-multiply blur-3xl filter delay-1000 md:block"></div>
              <div className="absolute bottom-1/4 left-1/3 hidden h-56 w-56 animate-blob rounded-full bg-pink-600 opacity-70 mix-blend-multiply blur-3xl filter delay-500 md:block"></div>
            </div>
          </div>
        </main>
      </div>
      <section className="relative border-border  from-background via-background via-90% to-transparent">
        <div className="container mx-auto text-center">
          <div className="my-10">
            {!account && (
              <p className="mx-auto my-4 w-full max-w-md bg-transparent text-center text-sm font-medium leading-relaxed tracking-wide text-muted-foreground">
                Connect your wallet to view your NFTs.
              </p>
            )}
            <div className="my-16">
              {" "}
              {allTokens.length > 0 && (
                <p className="mx-auto my-4 w-full max-w-md bg-transparent text-center text-sm font-medium leading-relaxed tracking-wide text-muted-foreground">
                  Showing: {displayedTokens} out of {total} NFTs
                </p>
              )}{" "}
              {allTokens.length > displayedTokens && (
                <Button
                  onClick={() => alterView(1)}
                  variant="default"
                  className="mr-4"
                >
                  Show More
                </Button>
              )}
              {allTokens.length > 0 && displayedTokens !== 0 && (
                <Button onClick={() => alterView(2)} variant="secondary">
                  Show Less
                </Button>
              )}
            </div>
            {account && none && (
              <p className="mx-auto my-4 w-full max-w-md bg-transparent text-center text-sm font-medium leading-relaxed tracking-wide text-muted-foreground">
                No NFTs found in your wallet.
              </p>
            )}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
              key="dnd-context"
            >
              <div
                className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                key="grid"
              >
                {account &&
                  allTokens.length > 0 &&
                  allTokens.map((token, index) => (
                    <div key={`item-${index.toString()}`}>
                      {index < displayedTokens ? (
                        <div className="mt-6">
                          <SortableContext
                            items={allTokens.map((token) => token.tokenId)}
                            strategy={rectSortingStrategy}
                            key={`context-${index.toString()}`}
                          >
                            <SortableItem
                              className="relative border-hidden"
                              token={token}
                              index={index}
                            />
                            <Button
                              onClick={() => removeItem(token.tokenId)}
                              variant="secondary"
                              className="mt-4   shadow-sm hover:bg-destructive/90"
                            >
                              Remove
                            </Button>
                          </SortableContext>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
                  {activeId !== undefined &&
                    allTokens[Number(activeId)] !== undefined && (
                      <Item
                        id={activeId.toString()}
                        isDragging
                        token={allTokens[Number(activeId)]!}
                        index={Number(activeId)}
                      />
                    )}
                </DragOverlay>
              </div>
            </DndContext>
          </div>
        </div>
        <div className="absolute top-0 -z-10 h-full max-h-full w-full blur-2xl">
          <div className="absolute bottom-0 left-0 h-56 w-1/2 animate-blob rounded-full bg-violet-600 opacity-70 mix-blend-multiply blur-3xl filter"></div>
          <div className="absolute bottom-0 right-0 h-56 w-1/2 animate-blob rounded-full bg-sky-600 opacity-70 mix-blend-multiply blur-3xl filter delay-1000"></div>
        </div>
      </section>
      <section className="relative border-border from-background via-background via-90% to-transparent">
        {deletedTokens.length > 0 && (
          <div className="container mx-auto text-center">
            <div className="my-10">
              <h2 className="my-4 text-2xl font-bold">Deleted NFTs</h2>
              <div className="my-16">
                {" "}
                <p className="mx-auto my-4 w-full max-w-md bg-transparent text-center text-sm font-medium leading-relaxed tracking-wide text-muted-foreground">
                  Showing: {deletedTokens.length} NFTs
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {deletedTokens.length > 0 &&
                  deletedTokens.map((token, index) => (
                    <button
                      key={`item-${index.toString()}`}
                      className="max-w-xs"
                      onClick={() => reverseRemoval(token.tokenId)}
                    >
                      <p className="text-center text-sm font-medium leading-relaxed tracking-wide text-muted-foreground">
                        Bring Back
                      </p>
                      <Item token={token} index={index} />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-0 -z-10 h-full max-h-full w-full blur-2xl">
          <div className="absolute bottom-0 left-0 h-56 w-1/2 animate-blob rounded-full bg-violet-600 opacity-70 mix-blend-multiply blur-3xl filter"></div>
          <div className="absolute bottom-0 right-0 h-56 w-1/2 animate-blob rounded-full bg-sky-600 opacity-70 mix-blend-multiply blur-3xl filter delay-1000"></div>
        </div>
      </section>
    </div>
  );
}
