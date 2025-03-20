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
  const [historyNodes, setHistoryNodes] = useState<NodeInterface[]>([]);
  const [historyEdges, setHistoryEdges] = useState<EdgeInterface[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
  
    const savedNodes = localStorage.getItem("nodes");
    const savedEdges = localStorage.getItem("edges");
    const savedHistoryNodes = localStorage.getItem("historyNodes");
    const savedHistoryEdges = localStorage.getItem("historyEdges");

    setNodes(savedNodes ? JSON.parse(savedNodes) : []);
    setEdges(savedEdges ? JSON.parse(savedEdges) : []);
    setHistoryNodes(savedHistoryNodes ? JSON.parse(savedHistoryNodes) : []);
    setHistoryEdges(savedHistoryEdges ? JSON.parse(savedHistoryEdges) : []);
  }, []);

  const updateHistory = () => {
    setHistoryNodes((prev) => {
      const newNodes = nodes.filter((n) => !prev.some((hn) => hn.id === n.id));
      if (newNodes.length > 0) {
        const updatedHistory = [...prev, ...newNodes];
        localStorage.setItem("historyNodes", JSON.stringify(updatedHistory));
        return updatedHistory;
      }
      return prev;
    });

    setHistoryEdges((prev) => {
      const newEdges = edges.filter((e) => !prev.some((he) => he.id === e.id));
      if (newEdges.length > 0) {
        const updatedHistory = [...prev, ...newEdges];
        localStorage.setItem("historyEdges", JSON.stringify(updatedHistory));
        return updatedHistory;
      }
      return prev;
    });
  };

  useEffect(() => {
    if (nodes.length > 0) localStorage.setItem("nodes", JSON.stringify(nodes));
    if (edges.length > 0) localStorage.setItem("edges", JSON.stringify(edges));

    updateHistory(); // Append new elements to history
  }, [nodes, edges]);

  function addNode(type = "default", position = { x: 100, y: 100 }) {
    const newNode: NodeInterface = {
      id: nanoid(),
      type,
      position: { x: position.x, y: position.y },
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
      label: "New Edge",
    };

    setEdges((prev) => [...prev, newEdge]);
    setSelectedEdgeId(null);
  }

  function onEdgeClick(edge: EdgeInterface) {
    setSelectedEdgeId(edge.id);
  }

  function setMenuPosition(x: number, y: number) {
    setMenu({ x, y });
  }

  function deleteEdge() {
    if (!selectedEdgeId) return;

    setEdges((prev) => {
      const updatedEdges = prev.filter((edge) => edge.id !== selectedEdgeId);
      localStorage.setItem("edges", JSON.stringify(updatedEdges));
      return updatedEdges;
    });

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
