"use client"
import React from 'react'
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTools } from '@/context/tools';

const FlowLayout = ({ children }: { children: React.ReactNode }) => {
    const {nodes, edges, selectedNode, onNodesChange} = useTools()
    return (
        <div className='w-screen h-screen'>
            <ReactFlow nodes={nodes} edges={edges} onNodeClick={(_,node)=>selectedNode(node.id)} onNodesChange={onNodesChange}>
                <Background />
                <Controls className='text-black' />
                {children}
            </ReactFlow>
        </div>
    )
}

export default FlowLayout