'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Card } from '@workspace/ui/components/card'
import { authClient } from '@/lib/auth/client'

export function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isValidated = formSchema.safeParse(values).success
    if (isValidated) {
      const data = await authClient.signUp.email({
        email: values.username + '@placeholder.com', // We arent currently using emails, but it is required
        name: 'placeholder', // we arent currenlty using names, but it is required
        password: values.password,
        username: values.username,
      })
      if (data.data?.token) {
        await authClient.signIn.username({
          username: values.username,
          password: values.password,
        })
      }
    }
  }

  return (
    <div className="flex min-h-svh flex-1 items-center justify-center">
      <Card className="flex w-96 p-8">
        <div className="flex w-full flex-col gap-y-6">
          <h2 className="text-center text-2xl font-bold">Sign Up</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Durial321"
                        className="placeholder:italic"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        className="placeholder:italic"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  )
}

const formSchema = z.object({
  username: z.string().min(1).trim(),
  password: z.string().min(12).trim(),
})
