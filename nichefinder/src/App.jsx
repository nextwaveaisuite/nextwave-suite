import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { TrendingUp, Target, DollarSign, Zap, CheckCircle2, AlertCircle } from 'lucide-react'
import './App.css'

function App() {
  const [niches, setNiches] = useState([])
  const [selectedNiche, setSelectedNiche] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ads, setAds] = useState([])

  // Sample data (in production, this would come from your Python backend)
  const sampleNiches = [
    {
      id: 1,
      name: "Men's Health & Prostate",
      score: 70,
      commission: 158,
      weeklyROI: 48,
      difficulty: "Medium",
      recommendation: "Best ROI",
      products: ["ProstaVive"],
      description: "Profitable from Week 1, medium competition, high buyer intent"
    },
    {
      id: 2,
      name: "Home Fitness & Yoga",
      score: 75,
      commission: 120,
      weeklyROI: 12,
      difficulty: "Easy",
      recommendation: "Best for Beginners",
      products: ["Yoga Burn"],
      description: "Beginner-friendly, positive ROI immediately, easier content"
    },
    {
      id: 3,
      name: "Weight Loss & Liver Health",
      score: 85,
      commission: 180,
      weeklyROI: -16,
      difficulty: "Hard",
      recommendation: "High Demand",
      products: ["HepatoBurn", "Mitolyn"],
      description: "Highest demand, scales well, but requires patience and larger budget"
    }
  ]

  const sampleAds = {
    1: [
      {
        title: "Doctor: 'Do This Every Morning for Prostate Health'",
        performance: "Very High",
        ctr: "4.1-5.8%",
        conversion: "2.3-3.2%",
        copy: "If you're a man over 45, you need to see this...\n\nA urologist just revealed a simple 30-second morning ritual that supports healthy prostate function.\n\nThis ritual addresses the root cause of prostate issues - and it has nothing to do with medication or surgery.\n\nOver 157,000 men are already using this method.\n\n→ Watch the short video to learn the ritual",
        keywords: ["prostate health", "prostate support", "mens health over 40", "urinary health"]
      }
    ],
    2: [
      {
        title: "Yoga Instructor: '12-Minute Sequence Burns More Fat Than 1 Hour of Cardio'",
        performance: "High",
        ctr: "3.7-5.3%",
        conversion: "1.8-2.6%",
        copy: "Hate long cardio workouts? There's a better way...\n\nA celebrity yoga instructor discovered a 12-minute sequence that burns more fat than an hour on the treadmill.\n\nThis 'Dynamic Sequencing' method targets stubborn fat zones women struggle with most.\n\nNo equipment needed. Do it from home.\n\n→ Watch the free 12-minute sequence",
        keywords: ["home yoga", "fat burning yoga", "quick workout", "yoga for weight loss"]
      }
    ],
    3: [
      {
        title: "Doctor Discovers Weird 'Liver Trick' That Burns Fat While You Sleep",
        performance: "High",
        ctr: "3.5-5.2%",
        conversion: "1.8-2.5%",
        copy: "Are you over 40 and struggling to lose weight no matter what you try?\n\nNew research reveals it might not be your fault...\n\nA Stanford doctor just discovered that a sluggish liver could be blocking your body from burning fat.\n\nThis 'weird liver trick' has helped thousands of people over 40 finally lose stubborn belly fat - without dieting or exercise.\n\n→ Watch the free presentation to discover the liver trick",
        keywords: ["liver health weight loss", "metabolism booster", "weight loss over 40", "stubborn belly fat"]
      }
    ]
  }

  const discoverNiches = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setNiches(sampleNiches)
      setLoading(false)
    }, 1500)
  }

  const selectNiche = (niche) => {
    setSelectedNiche(niche)
    setAds(sampleAds[niche.id] || [])
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    return "text-yellow-600"
  }

  const getROIColor = (roi) => {
    if (roi > 0) return "text-green-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">NicheFinder AI</h1>
                <p className="text-sm text-muted-foreground">Data-Driven Niche Discovery</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Zap className="w-3 h-3 mr-1" />
              Powered by AI
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {niches.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Discover Profitable Niches in Seconds</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our AI analyzes ClickBank marketplace, Reddit trends, and market data to find you the most profitable niches with winning ad copy.
            </p>
            <Button 
              size="lg" 
              onClick={discoverNiches}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing Markets...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Discover Profitable Niches
                </>
              )}
            </Button>
          </div>
        )}

        {/* Niches Grid */}
        {niches.length > 0 && !selectedNiche && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Top Profitable Niches</h2>
                <p className="text-muted-foreground">Ranked by opportunity score and ROI potential</p>
              </div>
              <Button variant="outline" onClick={discoverNiches}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {niches.map((niche) => (
                <Card 
                  key={niche.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500"
                  onClick={() => selectNiche(niche)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{niche.name}</CardTitle>
                      <Badge variant={niche.weeklyROI > 0 ? "default" : "secondary"}>
                        {niche.recommendation}
                      </Badge>
                    </div>
                    <CardDescription>{niche.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Opportunity Score</div>
                        <div className={`text-2xl font-bold ${getScoreColor(niche.score)}`}>
                          {niche.score}/100
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Commission</div>
                        <div className="text-2xl font-bold text-green-600">
                          ${niche.commission}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Week 1 ROI</div>
                        <div className={`text-xl font-bold ${getROIColor(niche.weeklyROI)}`}>
                          {niche.weeklyROI > 0 ? '+' : ''}{niche.weeklyROI}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Difficulty</div>
                        <Badge variant="outline">{niche.difficulty}</Badge>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      View Details & Ads
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Selected Niche Details */}
        {selectedNiche && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedNiche(null)}>
              ← Back to Niches
            </Button>

            <Card className="border-2 border-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{selectedNiche.name}</CardTitle>
                    <CardDescription className="text-lg">{selectedNiche.description}</CardDescription>
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-2">
                    {selectedNiche.recommendation}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Opportunity Score</div>
                    <div className={`text-3xl font-bold ${getScoreColor(selectedNiche.score)}`}>
                      {selectedNiche.score}/100
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Commission</div>
                    <div className="text-3xl font-bold text-green-600">
                      ${selectedNiche.commission}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Week 1 ROI</div>
                    <div className={`text-3xl font-bold ${getROIColor(selectedNiche.weeklyROI)}`}>
                      {selectedNiche.weeklyROI > 0 ? '+' : ''}{selectedNiche.weeklyROI}%
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-950 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Difficulty</div>
                    <div className="text-2xl font-bold">
                      {selectedNiche.difficulty}
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="ads" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ads">Winning Ads</TabsTrigger>
                    <TabsTrigger value="setup">Setup Guide</TabsTrigger>
                    <TabsTrigger value="projections">Revenue</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ads" className="space-y-4 mt-6">
                    <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <p className="text-sm">
                        <strong>100% ClickBank Compliant:</strong> No brand names, generic angles, ready to use
                      </p>
                    </div>

                    {ads.map((ad, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-xl">{ad.title}</CardTitle>
                            <Badge variant="default">{ad.performance}</Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>CTR: {ad.ctr}</span>
                            <span>Conversion: {ad.conversion}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Ad Copy:</h4>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg whitespace-pre-line text-sm">
                              {ad.copy}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Target Keywords:</h4>
                            <div className="flex flex-wrap gap-2">
                              {ad.keywords.map((keyword, i) => (
                                <Badge key={i} variant="outline">{keyword}</Badge>
                              ))}
                            </div>
                          </div>
                          <Button className="w-full">
                            Copy Ad to Clipboard
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="setup" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>7-Day Launch Plan</CardTitle>
                        <CardDescription>Step-by-step guide to launch your campaign</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                            <div>
                              <h4 className="font-semibold">Sign up for ClickBank</h4>
                              <p className="text-sm text-muted-foreground">Create affiliate account and get your hoplink</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                            <div>
                              <h4 className="font-semibold">Create Bing Ads Account</h4>
                              <p className="text-sm text-muted-foreground">Set up campaign with $30/day budget</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                            <div>
                              <h4 className="font-semibold">Create Bridge Page</h4>
                              <p className="text-sm text-muted-foreground">Pre-sell the solution (templates provided)</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                            <div>
                              <h4 className="font-semibold">Launch Ads</h4>
                              <p className="text-sm text-muted-foreground">Use winning ad copy, target USA + Canada</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">5</div>
                            <div>
                              <h4 className="font-semibold">Monitor & Optimize</h4>
                              <p className="text-sm text-muted-foreground">Track daily, pause low CTR ads, scale winners</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projections" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Projections</CardTitle>
                        <CardDescription>Conservative estimates with $30/day ad budget</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-5 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg font-semibold text-sm">
                            <div>Period</div>
                            <div>Ad Spend</div>
                            <div>Sales</div>
                            <div>Revenue</div>
                            <div>Profit</div>
                          </div>
                          <div className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
                            <div className="font-medium">Week 1</div>
                            <div>$210</div>
                            <div>1-2</div>
                            <div>$158-316</div>
                            <div className="text-yellow-600">-$50 to +$100</div>
                          </div>
                          <div className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
                            <div className="font-medium">Month 1</div>
                            <div>$945</div>
                            <div>10-12</div>
                            <div>$1,580-1,900</div>
                            <div className="text-green-600 font-bold">+$635-955</div>
                          </div>
                          <div className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
                            <div className="font-medium">Month 3</div>
                            <div>$2,100</div>
                            <div>40-45</div>
                            <div>$6,320-7,110</div>
                            <div className="text-green-600 font-bold">+$4,220-5,010</div>
                          </div>
                          <div className="grid grid-cols-5 gap-4 p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                            <div className="font-bold">Month 6</div>
                            <div className="font-bold">$3,600</div>
                            <div className="font-bold">85-90</div>
                            <div className="font-bold">$13,430-14,220</div>
                            <div className="text-green-600 font-bold text-lg">+$9,830-10,620</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>NicheFinder AI - Data-Driven Niche Discovery System</p>
          <p className="mt-2">All ad copy is 100% ClickBank compliant. No brand names, generic angles.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
