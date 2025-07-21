"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  task_name: string
  unit_price: number
  description: string
}

export default function ContractorPricingPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      task_name: "Ceiling Fan Install",
      unit_price: 150,
      description: "Standard swap out",
    },
    {
      id: "2",
      task_name: "Bathroom Remodel",
      unit_price: 2000,
      description: "Labor only",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const addNewTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      task_name: "",
      unit_price: 0,
      description: "",
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (id: string, field: keyof Task, value: string | number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, [field]: value } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const saveChanges = async () => {
    setIsLoading(true)
    try {
      const payload = {
        contractor_id: "contractor_123", // This would come from auth context
        tasks: tasks.map(({ id, ...task }) => task),
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Pricing list updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pricing list",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Task Pricing</h1>
        <Button onClick={saveChanges} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Pricing List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-xl">
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium mb-1">Task Name</label>
                  <Input
                    value={task.task_name}
                    onChange={(e) => updateTask(task.id, "task_name", e.target.value)}
                    placeholder="Enter task name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Unit Price ($)</label>
                  <Input
                    type="number"
                    value={task.unit_price}
                    onChange={(e) => updateTask(task.id, "unit_price", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-5">
                  <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                  <Textarea
                    value={task.description}
                    onChange={(e) => updateTask(task.id, "description", e.target.value)}
                    placeholder="Additional details..."
                    className="min-h-[40px]"
                  />
                </div>

                <div className="md:col-span-1 flex items-end">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={addNewTask} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Task
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
