"use client";

import * as React from "react";
import useStore from "@/zustand/store";
import { Button } from "@/components/ui/button";

export function ColorChanger() {
  const { setColor, color } = useStore();
  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "purple",
    "pink",
    "gray",
  ];

  React.useEffect(() => {
    document.getElementById("color-changer")!.style.background =
      color.length > 0
        ? `linear-gradient(180deg, ${color} 0%, rgba(255, 255, 255, 0) 50%)`
        : "none";
  }, [color]);

  return (
    <Button
      variant="outline"
      className="min-w-[3rem] text-xs"
      size="icon"
      id="color-changer"
      color={color}
      onClick={() => {
        // set color to the next color in the list
        const currentColor = colors.indexOf(useStore.getState().color);
        const nextColor =
          currentColor >= 0 ? colors[currentColor + 1] : colors[0];
        setColor(nextColor ?? "");
      }}
    >
      {color === "" && "color"}
    </Button>
  );
}
