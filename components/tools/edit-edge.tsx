"use client";

import React, { useState } from "react";
import { useTools } from "@/context/tools";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const EdgeOptionsMenu = () => {
  const { selectedEdgeId, deleteEdge, updateEdgeLabel, menu, edges } = useTools();
  const currentLabel = edges.find(edge => edge.id === selectedEdgeId)?.label || "";
  const [label, setLabel] = useState(currentLabel);

  if (!selectedEdgeId) return null;

  const handleSave = () => {
    updateEdgeLabel(label);
  };

  return (
    <div
      className="absolute"
      style={{ top: menu?.y, left: menu?.x }}
    >
      <Card className="w-64 shadow-md border">
        <CardHeader className="font-semibold text-sm">Edge Options</CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="text"
            placeholder="Enter edge label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          <div className="flex justify-between">
            <Button size="sm" onClick={handleSave}>Save</Button>
            <Button size="sm" variant="destructive" onClick={deleteEdge}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EdgeOptionsMenu;
