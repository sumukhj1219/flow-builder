"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Plus, Trash } from 'lucide-react'
import { useTools } from '@/context/tools'

const DeleteNode = () => {
    const {deleteNode, activeNode} = useTools()

  return (
    <div>
        <Button 
            className="w-full px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-x-2"
            size="lg"
            onClick={() => deleteNode()}
            variant={'destructive'}
            {
                ...activeNode ? {disabled:false} : {disabled:true}
            }
            
        >
            <Trash className="w-4 h-4" /> Delete this node
        </Button>
    </div>
  )
}

export default DeleteNode