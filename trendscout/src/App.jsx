import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  TrendingUp, Search, Zap, AlertCircle, Download, Send, Lock,
  Activity, DollarSign, Target, BarChart3, Clock, CheckCircle
} from 'lucide-react'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [discoveries, setDiscoveries] = useState([])
  const [scanProgress, setScanProgress] = useState(0)

  // Mock discovered niches
  const mockDiscoveries = [
    {
      id: 1,
      name: "Nighttime Urination Solutions (Men 60+)",
      category: "Men's Health",
      score: 98,
      trend: "Rising",
      clickbankProduct: "ProstaVive",
      commission: 158,
      searchVolume: 45000,
      competition: "Low",
      cpc: 0.85,
      conversionRate: 6.5,
      roi: 1217,
      discovered: "2 hours ago",
      sources: ["ClickBank", "Google Trends", "Reddit"],
      keywords: ["nighttime urination men", "frequent urination 60+", "prostate nighttime", "wake up to urinate"],
      subNiches: [
        "Nighttime urination 3+ times",
        "Prostate health for truck drivers",
        "Post-surgery prostate support"
      ]
    },
    {
      id: 2,
      name: "Yoga for Lower Back Pain (Office Workers)",
      category: "Home Fitness",
      score: 96,
      trend: "Hot",
      clickbankProduct: "Yoga Burn",
      commission: 120,
      searchVolume: 38000,
      competition: "Low",
      cpc: 0.95,
      conversionRate: 5.8,
      roi: 847,
      discovered: "5 hours ago",
      sources: ["Reddit", "Google Trends", "Amazon"],
      keywords: ["yoga lower back pain", "office worker back pain", "desk job yoga", "back pain relief yoga"],
      subNiches: [
        "10-minute morning yoga for back pain",
        "Yoga for postpartum back pain",
        "Chair yoga for office workers"
      ]
    },
    {
      id: 3,
      name: "Keto for Women Over 50",
      category: "Weight Loss",
      score: 94,
      trend: "Rising",
      clickbankProduct: "Custom Keto Diet",
      commission: 75,
      searchVolume: 52000,
      competition: "Medium",
      cpc: 1.20,
      conversionRate: 4.2,
      roi: 425,
      discovered: "1 day ago",
      sources: ["ClickBank", "Facebook Groups", "Google Trends"],
      keywords: ["keto women over 50", "menopause keto diet", "keto for hormones", "weight loss women 50+"],
      subNiches: [
        "Keto for menopause weight gain",
        "Keto for thyroid issues",
        "Easy keto for beginners over 50"
      ]
    },
    {
      id: 4,
      name: "Smart Pet Feeders for Busy Professionals",
      category: "Pet Tech",
      score: 92,
      trend: "Hot",
      clickbankProduct: "Various Amazon products",
      commission: 45,
      searchVolume: 28000,
      competition: "Low",
      cpc: 0.75,
      conversionRate: 5.5,
      roi: 680,
      discovered: "3 hours ago",
      sources: ["Amazon", "Reddit", "TikTok"],
      keywords: ["smart pet feeder", "automatic pet feeder wifi", "pet feeder camera", "remote pet feeding"],
      subNiches: [
        "Pet feeders for multiple pets",
        "Pet feeders for travel",
        "Pet feeders with portion control"
      ]
    },
    {
      id: 5,
      name: "AI Writing Tools for Content Creators",
      category: "AI Productivity",
      score: 90,
      trend: "Exploding",
      clickbankProduct: "Various SaaS",
      commission: 150,
      searchVolume: 67000,
      competition: "Medium",
      cpc: 2.50,
      conversionRate: 3.8,
      roi: 328,
      discovered: "4 hours ago",
      sources: ["Twitter", "Product Hunt", "Google Trends"],
      keywords: ["ai writing assistant", "content creation ai", "ai blog writer", "ai copywriting tool"],
      subNiches: [
        "AI for social media content",
        "AI for email marketing",
        "AI for SEO content"
      ]
    }
  ]

  const handleLogin = () => {
    if (password === 'NicheFinder2025!') {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  const handleScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    setDiscoveries([])

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setDiscoveries(mockDiscoveries)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const exportToProduct1 = (niche) => {
    alert(`In the full version, this would automatically export "${niche.name}" to NicheFinder AI Pro (Product 1) via API.`)
  }

  const getTrendBadge = (trend) => {
    const colors = {
      'Exploding': 'bg-red-100 text-red-700',
      'Hot': 'bg-orange-100 text-orange-700',
      'Rising': 'bg-green-100 text-green-700',
      'Steady': 'bg-blue-100 text-blue-700'
    }
    return colors[trend] || 'bg-gray-100 text-gray-700'
  }

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 90) return 'text-blue-600'
    if (score >= 85) return 'text-yellow-600'
    return 'text-gray-600'
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl">TrendScout Live</CardTitle>
            <CardDescription>Private Access - Owner Only</CardDescription>
            <Badge variant="outline" className="mt-2">Product 3 - Discovery Engine</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">
                Access System
              </Button>
              <p className="text-sm text-gray-500 text-center">
                This software is private and restricted
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TrendScout Live</h1>
                <p className="text-sm text-gray-500">Real-Time Niche Discovery</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live Monitoring
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Discoveries Today</p>
                  <p className="text-3xl font-bold text-gray-900">{discoveries.length}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Opportunity Score</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {discoveries.length > 0 ? Math.round(discoveries.reduce((sum, d) => sum + d.score, 0) / discoveries.length) : 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg ROI Potential</p>
                  <p className="text-3xl font-bold text-green-600">
                    {discoveries.length > 0 ? Math.round(discoveries.reduce((sum, d) => sum + d.roi, 0) / discoveries.length) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Data Sources</p>
                  <p className="text-3xl font-bold text-gray-900">5</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scanner */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Niche Discovery Scanner</CardTitle>
            <CardDescription>Scan multiple data sources to discover profitable opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleScan} 
                  disabled={isScanning}
                  size="lg"
                  className="flex-1"
                >
                  {isScanning ? (
                    <>
                      <Activity className="w-5 h-5 mr-2 animate-spin" />
                      Scanning... {scanProgress}%
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Start Discovery Scan
                    </>
                  )}
                </Button>
              </div>

              {isScanning && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-sm">
                    <div className={`p-2 rounded text-center ${scanProgress >= 20 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      ClickBank
                    </div>
                    <div className={`p-2 rounded text-center ${scanProgress >= 40 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      Google Trends
                    </div>
                    <div className={`p-2 rounded text-center ${scanProgress >= 60 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      Reddit
                    </div>
                    <div className={`p-2 rounded text-center ${scanProgress >= 80 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      Amazon
                    </div>
                    <div className={`p-2 rounded text-center ${scanProgress >= 100 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      Analysis
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>MVP Note:</strong> This MVP demonstrates the UI with simulated data. The full version connects to real APIs (ClickBank, Google Trends, Reddit, Amazon) and discovers niches automatically every hour.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discoveries */}
        {discoveries.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Latest Discoveries ({discoveries.length})
              </h2>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>

            {discoveries.map(niche => (
              <Card key={niche.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl">{niche.name}</CardTitle>
                        <Badge className={getTrendBadge(niche.trend)}>
                          {niche.trend}
                        </Badge>
                      </div>
                      <CardDescription>
                        Category: {niche.category} • Discovered {niche.discovered}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Opportunity Score</p>
                      <p className={`text-4xl font-bold ${getScoreColor(niche.score)}`}>
                        {niche.score}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="metrics">Metrics</TabsTrigger>
                      <TabsTrigger value="keywords">Keywords</TabsTrigger>
                      <TabsTrigger value="sub-niches">Sub-Niches</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Commission</p>
                          <p className="text-xl font-bold text-green-600">${niche.commission}/sale</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Search Volume</p>
                          <p className="text-xl font-bold text-gray-900">{niche.searchVolume.toLocaleString()}/mo</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Competition</p>
                          <Badge variant="outline" className={niche.competition === 'Low' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {niche.competition}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg CPC</p>
                          <p className="text-xl font-bold text-gray-900">${niche.cpc}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">📊 {niche.sources.join(', ')}</Badge>
                        <Badge variant="outline">🎯 {niche.clickbankProduct}</Badge>
                      </div>
                    </TabsContent>

                    <TabsContent value="metrics" className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Expected Conversion</p>
                          <p className="text-2xl font-bold text-gray-900">{niche.conversionRate}%</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Projected ROI</p>
                          <p className="text-2xl font-bold text-green-600">{niche.roi}%</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Cost Per Click</p>
                          <p className="text-2xl font-bold text-blue-600">${niche.cpc}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-900 mb-2">Why This Niche Scores {niche.score}/100:</h4>
                        <ul className="space-y-1 text-sm text-purple-800">
                          <li>✓ {niche.competition} competition with {niche.searchVolume.toLocaleString()} monthly searches</li>
                          <li>✓ High conversion rate ({niche.conversionRate}%) and strong ROI ({niche.roi}%)</li>
                          <li>✓ Affordable CPC (${niche.cpc}) with ${niche.commission} commission</li>
                          <li>✓ {niche.trend} trend across multiple data sources</li>
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="keywords" className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {niche.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        These keywords have been analyzed for search volume, competition, and buyer intent.
                      </p>
                    </TabsContent>

                    <TabsContent value="sub-niches" className="space-y-4">
                      <div className="space-y-2">
                        {niche.subNiches.map((subNiche, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium">{subNiche}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">2-5x better ROI</Badge>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Sub-niches typically have 2-5x better ROI due to lower competition and higher buyer intent.
                      </p>
                    </TabsContent>
                  </Tabs>

                  <div className="flex space-x-4 mt-6 pt-6 border-t border-gray-200">
                    <Button onClick={() => exportToProduct1(niche)} className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Export to NicheFinder AI
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {discoveries.length === 0 && !isScanning && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No discoveries yet</h3>
              <p className="text-gray-600 mb-4">Click "Start Discovery Scan" to find profitable niches</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App
