import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Lock, TrendingUp, Target, Zap, ExternalLink, Shield, CheckCircle2 } from 'lucide-react'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const MASTER_PASSWORD = 'NicheFinder2025!'

  // Product URLs - these will be updated with actual permanent URLs
  const products = [
    {
      id: 1,
      name: 'NicheFinder AI Pro',
      description: 'Discover profitable niches with AI-powered research and analysis',
      icon: TrendingUp,
      url: 'https://8888-ixj0b5g8c9rp5nolyu185-039271ca.manusvm.computer',
      status: 'live',
      features: ['8 Macro Niches', '32 Sub-Niches', 'Winning Ad Copy', 'Revenue Projections'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'CampaignMaster Pro',
      description: 'Automate campaign creation, optimization, and management',
      icon: Target,
      url: '#', // Will be updated after deployment
      status: 'live',
      features: ['Auto Ad Generation', 'Bridge Page Builder', 'Campaign Monitor', 'Auto-Optimization'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      name: 'TrendScout Live',
      description: 'Real-time niche discovery from multiple data sources',
      icon: Zap,
      url: '#', // Will be updated after deployment
      status: 'live',
      features: ['Live Trend Scanning', 'Multi-Source Analysis', 'Opportunity Scoring', 'Auto-Export'],
      color: 'from-orange-500 to-red-500'
    }
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === MASTER_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password. Access denied.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">
              Affiliate Marketing Suite
            </CardTitle>
            <CardDescription className="text-slate-300">
              Private Owner Access - Password Required
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your master password"
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-md p-2">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Access Suite
              </Button>
              <p className="text-xs text-center text-slate-400 mt-4">
                🔒 Private Access Only • Full Owner Privileges
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700 rounded-full text-green-400 text-sm mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Authenticated - Full Owner Access</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Affiliate Marketing Suite
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your complete automation platform for discovering profitable niches, creating campaigns, and scaling your affiliate business
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {products.map((product) => {
            const Icon = product.icon
            return (
              <Card 
                key={product.id} 
                className="border-slate-700 bg-slate-800/50 backdrop-blur hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <CardHeader>
                  <div className={`w-14 h-14 bg-gradient-to-br ${product.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{product.name}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <Button 
                      className={`w-full bg-gradient-to-r ${product.color} hover:opacity-90`}
                      onClick={() => window.open(product.url, '_blank')}
                      disabled={product.url === '#'}
                    >
                      <span>Launch {product.name}</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    {product.url === '#' && (
                      <p className="text-xs text-center text-yellow-400 mt-2">
                        URL will be updated after deployment
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Workflow Section */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Complete Workflow</CardTitle>
            <CardDescription className="text-slate-300">
              How the three products work together to automate your affiliate business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold">1. Discover</h3>
                <p className="text-sm text-slate-300">TrendScout finds profitable niches</p>
              </div>
              <div className="text-slate-500 text-2xl">→</div>
              <div className="flex-1 text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold">2. Research</h3>
                <p className="text-sm text-slate-300">NicheFinder analyzes & enriches</p>
              </div>
              <div className="text-slate-500 text-2xl">→</div>
              <div className="flex-1 text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold">3. Automate</h3>
                <p className="text-sm text-slate-300">CampaignMaster launches & optimizes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">8</div>
                <div className="text-sm text-slate-400">Macro Niches</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">32</div>
                <div className="text-sm text-slate-400">Sub-Niches</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100+</div>
                <div className="text-sm text-slate-400">Winning Ads</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">$32K+</div>
                <div className="text-sm text-slate-400">6-Month Potential</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>🔒 Private Owner Access • Full Unrestricted Privileges</p>
          <p className="mt-2">Master Password: NicheFinder2025!</p>
        </div>
      </div>
    </div>
  )
}

export default App
