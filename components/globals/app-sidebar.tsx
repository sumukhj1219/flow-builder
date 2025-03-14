import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
  } from "@/components/ui/sidebar";
  import { AddNode } from "../tools/add-node";
  import React from "react";
import DeleteNode from "../tools/delete-node";
  
  const items = [
    {
      title: "New Node",
      component: <AddNode />,
    },
    {
        title: "Delete Node",
        component: <DeleteNode />
    }
  ];
  
  export function AppSidebar() {
    return (
      <Sidebar className="w-64 bg-gray-900 text-white">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary text-xl">Components</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title} className="mt-3">
                    {item.component} 
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }
  