"use client";

import { useContext, createContext, useState, FormEvent } from "react";
import { nanoid } from "nanoid";
import { applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection } from "@xyflow/react";

interface NodeInterface {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
  draggable?: boolean;
}

interface EdgeInterface {
  id: string;
  source: string;
  target: string;
  markerEnd: {type?:string}
}

interface MenuPositionInterface{
  x:number | string
  y:number | string
}

interface ToolsContextType {
  nodes: NodeInterface[];
  edges: EdgeInterface[];

  addNode: (type?: string, position?: { x: number; y: number }) => void;
  deleteNode: () => void;
  selectedNodeId: string | null;
  selectNode: (nodeId: string) => void;

  setEdges: React.Dispatch<React.SetStateAction<EdgeInterface[]>>;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void; 
  onEdgeClick: (edge: EdgeInterface)=>void;
  selectedEdgeId: string | null;
  setMenuPosition: (x:Number, y:Number) => void;
  deleteEdge: ()=>void;
  menu: MenuPositionInterface | undefined;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: React.ReactNode }) => {
  const [nodes, setNodes] = useState<NodeInterface[]>([]);
  const [edges, setEdges] = useState<EdgeInterface[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuPositionInterface | undefined>(undefined)

  function addNode(type = "default", position = { x: 100, y: 100 }) {
    const newNode: NodeInterface = {
      id: nanoid(),
      type,
      position,
      data: { label: `Node : ${nodes.length + 1}` },
      draggable: true,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedEdgeId(null)
  }

  function deleteNode() {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((node) => node.id !== selectedNodeId));
    setEdges((prev) => prev.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
    setSelectedEdgeId(null)
  }

  function selectNode(nodeId: string) {
    setSelectedNodeId(nodeId);
    console.log(`Selected Node: ${nodeId}`);
    setSelectedEdgeId(null)

  }

  function onNodesChange(changes: NodeChange[]) {
    setNodes((prev) => applyNodeChanges(changes, prev));
    setSelectedEdgeId(null)

  }

  function onEdgesChange(changes: EdgeChange[]) {
    setEdges((prev) => applyEdgeChanges(changes, prev));
    setSelectedEdgeId(null)

  }

  function onConnect(connection: Connection) {
    if (!connection.source || !connection.target) return;

    const newEdge: EdgeInterface = {
      id: nanoid(),
      source: connection.source,
      target: connection.target,
      markerEnd: { type: "arrow" }, 
    };

    setEdges((prev) => [...prev, newEdge]);
    setSelectedEdgeId(null)

  }

  function onEdgeClick( edge: EdgeInterface) {
    setSelectedEdgeId(edge.id)
  }

  function setMenuPosition(x:Number, y:Number){
      console.log(x , y)
      setMenu({x, y})
  }

  function deleteEdge(){
    if(!selectedEdgeId) return;
    setEdges((prev)=>prev.filter((edge)=>edge.id !== selectedEdgeId))
    setSelectedEdgeId(null)
  }

  return (
    <ToolsContext.Provider value={{ nodes, edges, addNode, deleteNode, setEdges, selectNode, selectedNodeId, onNodesChange, onEdgesChange, onConnect, onEdgeClick, selectedEdgeId, setMenuPosition, deleteEdge, menu }}>
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (!context) throw new Error("useTools must be used within a ToolsProvider");
  return context;
};
