"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText, Edit, Trash2 } from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ContractTemplatesPage() {
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

  const templates = [
    { id: "1", name: "Standard Service Agreement", description: "A general-purpose service contract." },
    { id: "2", name: "Fixed-Price Project Contract", description: "For projects with a defined scope and budget." },
    { id: "3", name: "Monthly Retainer Agreement", description: "For ongoing services with a monthly fee." },
  ]

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contract Templates</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Templates</CardTitle>
          <CardDescription>Manage your reusable contract templates.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
