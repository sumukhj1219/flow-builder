"use client"
import React from 'react'
import { ReactFlow, Controls, Background, ConnectionLineType, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTools } from '@/context/tools';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/globals/app-sidebar";

const FlowLayout = ({ children }: { children: React.ReactNode }) => {
    const { nodes, edges, selectNode, onNodesChange, onEdgesChange, onConnect } = useTools()
    const styledEdges = edges.map(edge => ({
        ...edge,
        markerEnd: { type: MarkerType.Arrow } 
    }));
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <div className='w-screen h-screen'>
                <ReactFlow
                    nodes={nodes}
                    edges={styledEdges}
                    onNodeClick={(_, node) => selectNode(node.id)}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    connectionLineType={ConnectionLineType.Bezier}
                >
                    <Background />
                    <Controls className='text-black' />
                    {children}
                </ReactFlow>
            </div>
        </SidebarProvider>

    )
}

export default FlowLayout