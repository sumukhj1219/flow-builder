"use client"
import React from 'react'
import { ReactFlow, Controls, Background, ConnectionLineType, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTools } from '@/context/tools';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import EdgeOptionsMenu from '@/components/tools/edit-edge';

const FlowLayout = ({ children }: { children: React.ReactNode }) => {
    const { nodes, edges, selectNode, onNodesChange, onEdgesChange, onConnect, onEdgeClick, setMenuPosition, selectedEdgeId } = useTools()
    const styledEdges = edges.map(edge => ({
        ...edge,
        markerEnd: { type: MarkerType.Arrow } ,
        interactive:true,
    }));
    return (
        <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className='w-screen h-screen'>
                <ReactFlow
                    nodes={nodes}
                    edges={styledEdges}
                    onNodeClick={(_, node) => selectNode(node.id)}
                    onEdgeClick={(event, edge) => {
                      event.preventDefault()
                      onEdgeClick(edge)
                      setMenuPosition(event.clientX, event.clientY)
                  }}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    connectionLineType={ConnectionLineType.Bezier}
                    elementsSelectable={true}
                >
                    <Background />
                    <Controls className='text-black' />
                    {children}
                </ReactFlow>
                {
                    selectedEdgeId && <EdgeOptionsMenu />
                }
            </div>
        </SidebarInset>
      </SidebarProvider>
    )
}

export default FlowLayout