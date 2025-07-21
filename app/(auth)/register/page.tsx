"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { UserAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createUserProfile } from "@/lib/actions/user.actions"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
})

const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { createUser } = UserAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const email = localStorage.getItem("email")
      const password = localStorage.getItem("password")

      if (!email || !password) {
        toast.error("Email or password not found in local storage.")
        return
      }

      const { user } = await createUser(email, password)

      if (user) {
        await createUserProfile({
          userId: user.uid,
          firstName: values.firstName,
          lastName: values.lastName,
          email: user.email || "",
          profileImageUrl: user.photoURL || "",
        })

        toast.success("Account created!")
        await router.replace("/dashboard")
      } else {
        toast.error("Failed to create account.")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error(error.message || "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-4">Create Account</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default RegisterPage
