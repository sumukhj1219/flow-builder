import { Connection, EdgeChange, NodeChange } from "@xyflow/react";

export interface NodeInterface {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
  draggable?: boolean;
}

export interface EdgeInterface {
  id: string;
  source: string;
  target: string;
  markerEnd: { type?: string };
  label?: string;
}

export interface MenuPositionInterface {
  x: number | string;
  y: number | string;
}

export interface ToolsContextType {
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
  onEdgeClick: (edge: EdgeInterface) => void;
  selectedEdgeId: string | null;
  setMenuPosition: (x: number, y: number) => void;
  deleteEdge: () => void;
  updateEdgeLabel: (label: string) => void;
  menu: MenuPositionInterface | undefined;
}