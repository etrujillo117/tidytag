'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-destructive">Something went wrong!</CardTitle>
          <CardDescription>
            An unexpected error occurred. You can try to recover from this error by clicking the button below.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                Error: {error.message}
            </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => reset()} className='w-full'>
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
