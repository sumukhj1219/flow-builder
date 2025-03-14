"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Plus, Trash } from 'lucide-react'
import { useTools } from '@/context/tools'

const DeleteNode = () => {
    const {deleteNode, selectedNodeId} = useTools()

  return (
        <Button 
            size="sm"
            onClick={() => deleteNode()}
            variant={selectedNodeId ? 'destructive' : 'ghost'}
            className="font-normal"
            
        >
            <Trash className="w-4 h-4" /> Delete this node
        </Button>
  )
}

export default DeleteNode