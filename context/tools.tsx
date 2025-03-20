"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection } from "@xyflow/react";
import { EdgeInterface, MenuPositionInterface, NodeInterface, ToolsContextType } from "@/interfaces/interface";

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: React.ReactNode }) => {
  const [nodes, setNodes] = useState<NodeInterface[]>([]);
  const [edges, setEdges] = useState<EdgeInterface[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuPositionInterface | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedNodes = localStorage.getItem("nodes");
    const savedEdges = localStorage.getItem("edges");
  
    setNodes(savedNodes ? JSON.parse(savedNodes) : []);  
    setEdges(savedEdges ? JSON.parse(savedEdges) : []);
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
      localStorage.setItem("nodes", JSON.stringify(nodes));
    }
    if (edges.length > 0) {
      localStorage.setItem("edges", JSON.stringify(edges));
    }
  }, [nodes, edges]);
  

  function addNode(type = "default", position = { x: 100, y: 100 }) {
    const newNode: NodeInterface = {
      id: nanoid(),
      type,
      position: {x:position.x, y:position.y},
      data: { label: `Node : ${nodes.length + 1}` },
      draggable: true,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedEdgeId(null);
  }

  function deleteNode() {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((node) => node.id !== selectedNodeId));
    setEdges((prev) => prev.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }

  function selectNode(nodeId: string) {
    setSelectedNodeId(nodeId);
    console.log(`Selected Node: ${nodeId}`);
    setSelectedEdgeId(null);
  }

  function onNodesChange(changes: NodeChange[]) {
    setNodes((prev) => applyNodeChanges(changes, prev));
    setSelectedEdgeId(null);
  }

  function onEdgesChange(changes: EdgeChange[]) {
    setEdges((prev) => applyEdgeChanges(changes, prev));
    setSelectedEdgeId(null);
  }

  function onConnect(connection: Connection) {
    if (!connection.source || !connection.target) return;

    const newEdge: EdgeInterface = {
      id: nanoid(),
      source: connection.source,
      target: connection.target,
      markerEnd: { type: "arrow" },
      label: "New Edge", // Default label
    };

    setEdges((prev) => [...prev, newEdge]);
    setSelectedEdgeId(null);
  }

  function onEdgeClick(edge: EdgeInterface) {
    setSelectedEdgeId(edge.id);
  }

  function setMenuPosition(x: number, y: number) {
    console.log(x, y);
    setMenu({ x, y });
  }

  function deleteEdge() {
    if (!selectedEdgeId) return;
    setEdges((prev) => prev.filter((edge) => edge.id !== selectedEdgeId));
    setSelectedEdgeId(null);
  }

  function updateEdgeLabel(label: string) {
    if (!selectedEdgeId) return;
    setEdges((prev) =>
      prev.map((edge) =>
        edge.id === selectedEdgeId ? { ...edge, label } : edge
      )
    );
  }

  return (
    <ToolsContext.Provider
      value={{
        nodes,
        edges,
        addNode,
        deleteNode,
        setEdges,
        selectNode,
        selectedNodeId,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onEdgeClick,
        selectedEdgeId,
        setMenuPosition,
        deleteEdge,
        updateEdgeLabel,
        menu,
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (!context) throw new Error("useTools must be used within a ToolsProvider");
  return context;
};
