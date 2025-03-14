"use client";

import { useContext, createContext, useState } from "react";
import { nanoid } from "nanoid";
import { applyNodeChanges, NodeChange } from "@xyflow/react";

interface NodeInterface {
  id: string;
  type: string;
  position: {
    x: number;  
    y: number;
  };
  data: {
    label: string;
  };
}

interface EdgeInterface {
  id: string;
  source: string;
  target: string;
}

interface ToolsContextType {
  nodes: NodeInterface[];
  edges: EdgeInterface[];
  addNode: (type?: string, position?: { x: number; y: number }) => void; 
  deleteNode: () => void;
  selectedNode: (nodeId: string) => void;
  onNodesChange: (changes:NodeChange[]) => void;
  setEdges: React.Dispatch<React.SetStateAction<EdgeInterface[]>>;
  activeNode: string | undefined;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: React.ReactNode }) => {
  const [nodes, setNodes] = useState<NodeInterface[]>([]);
  const [edges, setEdges] = useState<EdgeInterface[]>([]);
  const [activeNode, setActiveNode] = useState<string>()

  function addNode(type = "default", position = { x: 100, y: 100 }) {
    const newNode: NodeInterface = {
      id: nanoid(),
      type,
      position,
      data: { label: `Node : ${nodes.length + 1}` },
    };

    setNodes((prev) => [...prev, newNode]);
  }

  function deleteNode() { 
    setNodes((prev) => prev.filter((node) => node.id !== activeNode));
    setEdges((prev) => prev.filter((edge) => edge.source !== activeNode && edge.target !== activeNode));
  }

  function selectedNode(nodeId: string) {
    setActiveNode(nodeId)
  }

  function onNodesChange(changes: NodeChange[]) {
    setNodes((prev) => applyNodeChanges(changes, prev));
  }

  return (
    <ToolsContext.Provider value={{ nodes, edges, addNode, deleteNode, setEdges, selectedNode, activeNode, onNodesChange }}>
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (!context) throw new Error("useTools must be used within a ToolsProvider");
  return context;
};
