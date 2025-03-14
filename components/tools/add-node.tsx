"use client";

import { useTools } from "@/context/tools";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export function AddNode() {
    const { addNode } = useTools();

    return (
        <Button
            variant={'ghost'}
            size="sm"
            onClick={() => addNode()}
            className="font-normal"
        >
            <Plus className="w-4 h-4" />New node
        </Button>

    );
}
