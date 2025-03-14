"use client";

import { useTools } from "@/context/tools";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export function AddNode() {
    const { addNode } = useTools();

    return (
        <Button 
            className="w-full px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-x-2"
            size="lg"
            onClick={() => addNode()}
        >
            <Plus className="w-4 h-4" /> Add New Node
        </Button>
    );
}
