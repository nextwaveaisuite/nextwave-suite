import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Lock, AlertCircle } from 'lucide-react'

export function Auth({ onAuthenticated }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Your private access password (you can change this)
  const MASTER_PASSWORD = 'NicheFinder2025!'

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate authentication delay
    setTimeout(() => {
      if (password === MASTER_PASSWORD) {
        // Store authentication in session
        sessionStorage.setItem('nichefinder_authenticated', 'true')
        sessionStorage.setItem('nichefinder_auth_time', Date.now().toString())
        onAuthenticated()
      } else {
        setError('Invalid password. Access denied.')
        setPassword('')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">NicheFinder AI</CardTitle>
          <CardDescription>Private Access - Owner Only</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Access Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading || !password}
            >
              {loading ? 'Authenticating...' : 'Access System'}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>This software is private and restricted.</p>
              <p>Unauthorized access is prohibited.</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
