import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Rocket, TrendingUp, Target, Zap, Copy, Download, Play, Pause, 
  BarChart3, DollarSign, MousePointerClick, Eye, Lock
} from 'lucide-react'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [clickbankHoplink, setClickbankHoplink] = useState('')

  // Mock products from Product 1
  const availableProducts = [
    {
      id: 1,
      name: "Men's Health & Prostate",
      commission: 158,
      score: 70,
      baseAd: {
        headline: "Doctor: Do This Every Morning to Support Prostate Health",
        description: "A urologist just revealed a simple 30-second morning ritual that supports healthy prostate function. This addresses the root cause - and it has nothing to do with medication or surgery.",
        keywords: ["prostate health", "prostate support", "mens health over 50", "frequent urination", "prostate supplement"]
      }
    },
    {
      id: 2,
      name: "Home Fitness & Yoga",
      commission: 120,
      score: 75,
      baseAd: {
        headline: "This 10-Minute Morning Routine Transformed My Body at 45",
        description: "No gym needed. No equipment required. Just 10 minutes each morning using this simple yoga-based routine. Thousands are seeing results in weeks.",
        keywords: ["home workout", "yoga for beginners", "morning yoga routine", "fitness at home", "yoga for weight loss"]
      }
    },
    {
      id: 3,
      name: "Weight Loss & Metabolism",
      commission: 180,
      score: 85,
      baseAd: {
        headline: "Weird Liver Trick Melts Stubborn Fat While You Sleep",
        description: "Scientists discovered that sluggish liver function is the real reason you can't lose weight. This simple bedtime ritual targets the root cause.",
        keywords: ["weight loss", "lose belly fat", "metabolism booster", "fat burning", "liver health weight loss"]
      }
    }
  ]

  // Ad variation generator
  const generateAdVariations = (baseAd) => {
    const headlines = [
      baseAd.headline,
      `Discover: ${baseAd.headline.split(':')[1] || baseAd.headline}`,
      `New 2025: ${baseAd.headline.toLowerCase().includes('doctor') ? 'Medical Breakthrough' : 'Revolutionary Method'}`,
      `Why Thousands Are Trying This ${baseAd.headline.includes('Morning') ? 'Morning Ritual' : 'Simple Method'}`,
      `${baseAd.headline.includes('Weird') ? 'Unusual' : 'Surprising'} ${baseAd.headline.split(' ').slice(-3).join(' ')}`
    ]

    const descriptions = [
      baseAd.description,
      `${baseAd.description.split('.')[0]}. See why it's trending. Click to learn more.`,
      `Thousands of success stories. ${baseAd.description.split('.')[0]}. Limited time access.`,
      `${baseAd.description.split('.')[1] || baseAd.description} Join the movement today.`
    ]

    const variations = []
    let id = 1
    
    for (let i = 0; i < Math.min(3, headlines.length); i++) {
      for (let j = 0; j < Math.min(3, descriptions.length); j++) {
        if (variations.length < 10) {
          variations.push({
            id: id++,
            headline: headlines[i],
            description: descriptions[j],
            status: 'draft',
            impressions: 0,
            clicks: 0,
            ctr: 0,
            spend: 0
          })
        }
      }
    }

    return variations
  }

  // Generate bridge page HTML
  const generateBridgePage = (product, hoplink) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} - Discover the Solution</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
            color: #2d3748;
            line-height: 1.2;
        }
        .highlight {
            color: #667eea;
            font-weight: bold;
        }
        p {
            font-size: 18px;
            margin-bottom: 20px;
            color: #4a5568;
        }
        .benefits {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
        }
        .benefits ul {
            list-style: none;
            padding: 0;
        }
        .benefits li {
            padding: 10px 0;
            padding-left: 30px;
            position: relative;
        }
        .benefits li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #48bb78;
            font-weight: bold;
            font-size: 20px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 18px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            margin: 20px 0;
            width: 100%;
            display: block;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
        }
        .social-proof {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #fff5f5;
            border-radius: 10px;
        }
        .social-proof strong {
            color: #e53e3e;
            font-size: 24px;
        }
        .disclosure {
            font-size: 12px;
            color: #718096;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
        }
        @media (max-width: 600px) {
            .container { padding: 30px 20px; }
            h1 { font-size: 24px; }
            p { font-size: 16px; }
            .cta-button { font-size: 18px; padding: 15px 30px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${product.baseAd.headline}</h1>
        <p>${product.baseAd.description}</p>
        
        <div class="benefits">
            <h3 style="margin-bottom: 15px; color: #2d3748;">What You'll Discover:</h3>
            <ul>
                <li>The root cause most people miss</li>
                <li>A simple, natural solution that works</li>
                <li>Why traditional methods often fail</li>
                <li>Real results from real people</li>
            </ul>
        </div>

        <div class="social-proof">
            <p><strong>157,000+</strong> people have already discovered this solution</p>
            <p style="margin-top: 10px; font-size: 14px;">⭐⭐⭐⭐⭐ 4.8/5 average rating</p>
        </div>

        <a href="${hoplink || '#'}" class="cta-button">
            🔥 Click Here to Learn More
        </a>

        <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #718096;">
            Limited time access - Don't miss out
        </p>

        <div class="disclosure">
            <p><strong>Disclosure:</strong> This site contains affiliate links. We may receive a commission if you make a purchase through our links, at no additional cost to you. We only recommend products we believe will provide value.</p>
        </div>
    </div>
</body>
</html>`
  }

  // Mock campaign data
  const mockCampaigns = [
    {
      id: 1,
      name: "Men's Health - Campaign 1",
      status: 'active',
      dailyBudget: 30,
      spend: 245.50,
      revenue: 632.00,
      profit: 386.50,
      roi: 157,
      impressions: 12450,
      clicks: 389,
      conversions: 4,
      ctr: 3.1
    }
  ]

  const handleLogin = () => {
    if (password === 'NicheFinder2025!') {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
  }

  const handleLaunchCampaign = () => {
    if (!clickbankHoplink) {
      alert('Please enter your ClickBank hoplink first')
      return
    }

    const newCampaign = {
      id: campaigns.length + 1,
      name: `${selectedProduct.name} - Campaign ${campaigns.length + 1}`,
      status: 'active',
      dailyBudget: 30,
      spend: 0,
      revenue: 0,
      profit: 0,
      roi: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      ads: generateAdVariations(selectedProduct.baseAd)
    }

    setCampaigns([...campaigns, newCampaign])
    alert('Campaign created! In the full version, this would automatically create the campaign in Bing Ads.')
  }

  const downloadBridgePage = () => {
    const html = generateBridgePage(selectedProduct, clickbankHoplink)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bridge-page-${selectedProduct.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">CampaignMaster Pro</CardTitle>
            <CardDescription>Private Access - Owner Only</CardDescription>
            <Badge variant="outline" className="mt-2">Product 2 - Automation Engine</Badge>
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CampaignMaster Pro</h1>
                <p className="text-sm text-gray-500">Automated Campaign Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Private Access
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
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                  <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spend</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${campaigns.reduce((sum, c) => sum + c.spend, 0).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${campaigns.reduce((sum, c) => sum + c.revenue, 0).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Profit</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${campaigns.reduce((sum, c) => sum + c.profit, 0).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Campaign</TabsTrigger>
            <TabsTrigger value="campaigns">My Campaigns ({campaigns.length})</TabsTrigger>
            <TabsTrigger value="monitor">Monitor & Optimize</TabsTrigger>
          </TabsList>

          {/* Create Campaign Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Import Product from NicheFinder AI</CardTitle>
                <CardDescription>Select a niche from Product 1 to create a campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableProducts.map(product => (
                    <Card 
                      key={product.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedProduct?.id === product.id ? 'ring-2 ring-purple-600' : ''
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">Score: {product.score}</Badge>
                          <Badge className="bg-green-100 text-green-700">${product.commission}/sale</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedProduct && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Step 2: Generated Ad Variations</CardTitle>
                    <CardDescription>10 ad variations automatically created from winning ad copy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generateAdVariations(selectedProduct.baseAd).slice(0, 3).map((ad, idx) => (
                        <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline">Ad #{ad.id}</Badge>
                            <Button size="sm" variant="ghost">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{ad.headline}</h4>
                          <p className="text-sm text-gray-600">{ad.description}</p>
                        </div>
                      ))}
                      <p className="text-sm text-gray-500 text-center">+ 7 more variations</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Step 3: Bridge Page & ClickBank Setup</CardTitle>
                    <CardDescription>Generate compliant bridge page and enter your ClickBank hoplink</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your ClickBank Hoplink
                      </label>
                      <Input
                        placeholder="https://hop.clickbank.net/?affiliate=YOUR_ID&vendor=PRODUCT"
                        value={clickbankHoplink}
                        onChange={(e) => setClickbankHoplink(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button onClick={downloadBridgePage} variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download Bridge Page
                      </Button>
                      <Button onClick={() => {
                        const html = generateBridgePage(selectedProduct, clickbankHoplink)
                        const newWindow = window.open()
                        newWindow.document.write(html)
                      }} variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Bridge Page
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Step 4: Launch Campaign</CardTitle>
                    <CardDescription>Configure and launch your Bing Ads campaign</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daily Budget
                        </label>
                        <Input type="number" defaultValue="30" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Countries
                        </label>
                        <Input defaultValue="USA, Canada" disabled />
                      </div>
                    </div>
                    <Button onClick={handleLaunchCampaign} className="w-full" size="lg">
                      <Play className="w-5 h-5 mr-2" />
                      Launch Campaign to Bing Ads
                    </Button>
                    <p className="text-sm text-gray-500 text-center">
                      MVP Note: This creates a simulated campaign. Full version connects to Bing Ads API.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* My Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            {campaigns.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                  <p className="text-gray-600 mb-4">Create your first campaign to get started</p>
                  <Button onClick={() => document.querySelector('[value="create"]').click()}>
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>
            ) : (
              campaigns.map(campaign => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{campaign.name}</CardTitle>
                        <CardDescription>Daily Budget: ${campaign.dailyBudget}</CardDescription>
                      </div>
                      <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Spend</p>
                        <p className="text-xl font-bold text-gray-900">${campaign.spend.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-xl font-bold text-green-600">${campaign.revenue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Profit</p>
                        <p className="text-xl font-bold text-purple-600">${campaign.profit.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ROI</p>
                        <p className="text-xl font-bold text-blue-600">{campaign.roi}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">Impressions</p>
                        <p className="text-lg font-semibold">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Clicks</p>
                        <p className="text-lg font-semibold">{campaign.clicks}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">CTR</p>
                        <p className="text-lg font-semibold">{campaign.ctr}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Monitor & Optimize Tab */}
          <TabsContent value="monitor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Optimization Status</CardTitle>
                <CardDescription>24/7 monitoring and optimization is active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Zap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Auto-Optimization Enabled</p>
                        <p className="text-sm text-gray-600">System monitors and optimizes every hour</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Optimization Rules</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>✓ Pause ads with CTR &lt; 1.0%</li>
                        <li>✓ Increase bids on CTR &gt; 3.0%</li>
                        <li>✓ Reallocate budget to winners</li>
                        <li>✓ Test new variations automatically</li>
                      </ul>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Recent Actions</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• No campaigns running yet</li>
                        <li>• Create a campaign to see optimization</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>MVP Note:</strong> In the full version, this system connects to Bing Ads API and performs real-time optimization automatically. The MVP demonstrates the UI and workflow.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
