"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAppState } from "@/contexts/app-state-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NewContractPage() {
  const { state } = useAppState()
  const router = useRouter()

  useEffect(() => {
    if (state.userRole !== "contractor") {
      router.push("/dashboard")
    }
  }, [state.userRole, router])

  if (state.userRole !== "contractor") {
    return null
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Contract</CardTitle>
          <CardDescription>Fill out the details below to generate a new contract.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Contract Title</Label>
            <Input id="title" placeholder="e.g., Kitchen Remodel Agreement" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {state.clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {state.projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="value">Contract Value ($)</Label>
              <Input id="value" type="number" placeholder="e.g., 15000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template">Use Template</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Service Agreement</SelectItem>
                  <SelectItem value="fixed-price">Fixed-Price Contract</SelectItem>
                  <SelectItem value="retainer">Monthly Retainer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="terms">Contract Terms</Label>
            <Textarea id="terms" placeholder="Enter the contract terms and conditions here..." rows={8} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button>Create Contract</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
