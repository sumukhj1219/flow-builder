"use client";

import React, { useState } from "react";
import { useTools } from "@/context/tools";
import { Button } from "../ui/button";

const EdgeOptionsMenu = () => {
  const { selectedEdgeId,  deleteEdge, menu } = useTools();

  if (!selectedEdgeId) return null; 

  return (
    <div
      className="absolute bg-white shadow-lg p-4 rounded-md border border-gray-200"
      style={{ top: menu?.y, left:menu?.x }}
    >
      <h3 className="font-semibold mb-2">Edge Options</h3>

      <input
        type="text"
        placeholder="Enter edge label"
        className="w-full border p-2 rounded-md"
      />

      {/* Buttons */}
      <div className="flex gap-2 mt-3">
        <Button size="sm" >
          Save Label
        </Button>
        <Button size="sm" variant="destructive" onClick={() => { deleteEdge() }}>
          Delete Edge
        </Button>
      </div>
    </div>
  );
};

export default EdgeOptionsMenu;
