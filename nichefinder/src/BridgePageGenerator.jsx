import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Download, Eye, FileCode } from 'lucide-react'

export function BridgePageGenerator({ niche, ad }) {
  const [hoplink, setHoplink] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const generateBridgePageHTML = () => {
    const nicheTemplates = {
      "Men's Health & Prostate": {
        title: "The 30-Second Morning Ritual for Prostate Health",
        headline: "Discover the Natural Solution for Healthy Prostate Function",
        subheadline: "A urologist reveals the simple morning ritual that's helping thousands of men over 45",
        benefit1: "Reduce nighttime bathroom trips by up to 70%",
        benefit2: "Support healthy urinary flow naturally",
        benefit3: "No prescription medications or surgery required",
        cta: "Watch the Free Presentation Now"
      },
      "Home Fitness & Yoga": {
        title: "The 12-Minute Fat-Burning Yoga Sequence",
        headline: "Burn More Fat in 12 Minutes Than 1 Hour of Cardio",
        subheadline: "A celebrity yoga instructor reveals the dynamic sequencing method",
        benefit1: "Target stubborn fat zones effectively",
        benefit2: "No equipment needed - do it from home",
        benefit3: "Suitable for all fitness levels",
        cta: "Watch the Free 12-Minute Sequence"
      },
      "Weight Loss & Liver Health": {
        title: "The Liver Trick That Burns Fat While You Sleep",
        headline: "Why Your Liver Might Be Blocking Weight Loss",
        subheadline: "A Stanford doctor discovers the root cause of stubborn belly fat",
        benefit1: "Address the real cause of slow metabolism",
        benefit2: "No dieting or exercise required",
        benefit3: "Thousands of people over 40 seeing results",
        cta: "Watch the Free Presentation"
      }
    }

    const template = nicheTemplates[niche.name] || nicheTemplates["Men's Health & Prostate"]
    const finalHoplink = hoplink || "YOUR-CLICKBANK-HOPLINK-HERE"

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
            line-height: 1.2;
        }
        
        .header p {
            font-size: 1.3em;
            opacity: 0.95;
        }
        
        .content {
            padding: 60px 40px;
        }
        
        .intro {
            font-size: 1.2em;
            margin-bottom: 40px;
            color: #555;
            text-align: center;
        }
        
        .benefits {
            margin: 40px 0;
        }
        
        .benefit {
            display: flex;
            align-items: start;
            margin-bottom: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        
        .benefit-icon {
            width: 30px;
            height: 30px;
            background: #667eea;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .benefit-text {
            font-size: 1.1em;
            color: #333;
        }
        
        .cta-section {
            text-align: center;
            margin: 50px 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 20px 50px;
            font-size: 1.3em;
            font-weight: bold;
            text-decoration: none;
            border-radius: 50px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .social-proof {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: #fff3cd;
            border-radius: 10px;
            border: 2px solid #ffc107;
        }
        
        .social-proof-text {
            font-size: 1.1em;
            color: #856404;
            font-weight: 500;
        }
        
        .disclaimer {
            margin-top: 50px;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 10px;
            font-size: 0.9em;
            color: #666;
            text-align: center;
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            background: #f8f9fa;
            color: #666;
            font-size: 0.9em;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }
            
            .header p {
                font-size: 1.1em;
            }
            
            .content {
                padding: 40px 20px;
            }
            
            .cta-button {
                padding: 15px 30px;
                font-size: 1.1em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${template.headline}</h1>
            <p>${template.subheadline}</p>
        </div>
        
        <div class="content">
            <div class="intro">
                ${ad.copy.split('\n\n')[0]}
            </div>
            
            <div class="benefits">
                <div class="benefit">
                    <div class="benefit-icon">✓</div>
                    <div class="benefit-text">${template.benefit1}</div>
                </div>
                <div class="benefit">
                    <div class="benefit-icon">✓</div>
                    <div class="benefit-text">${template.benefit2}</div>
                </div>
                <div class="benefit">
                    <div class="benefit-icon">✓</div>
                    <div class="benefit-text">${template.benefit3}</div>
                </div>
            </div>
            
            <div class="social-proof">
                <p class="social-proof-text">
                    ⭐⭐⭐⭐⭐ Over 157,000 people have already discovered this method
                </p>
            </div>
            
            <div class="cta-section">
                <a href="${finalHoplink}" class="cta-button">
                    ${template.cta} →
                </a>
            </div>
            
            <div class="disclaimer">
                <p><strong>Disclaimer:</strong> This page contains affiliate links. I may earn a commission if you purchase through these links at no extra cost to you. Results may vary. Please consult your healthcare provider before starting any new health regimen.</p>
                <p style="margin-top: 15px;"><strong>FTC Disclosure:</strong> This website contains affiliate links, which means I may receive a commission if you click a link and purchase something. While clicking these links won't cost you any extra money, they will help me keep this site up and running.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} All Rights Reserved | <a href="#" style="color: #667eea;">Privacy Policy</a> | <a href="#" style="color: #667eea;">Terms of Service</a></p>
        </div>
    </div>
</body>
</html>`
  }

  const downloadBridgePage = () => {
    const html = generateBridgePageHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${niche.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-bridge-page.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const previewBridgePage = () => {
    const html = generateBridgePageHTML()
    const newWindow = window.open()
    newWindow.document.write(html)
    newWindow.document.close()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5" />
          Bridge Page Generator
        </CardTitle>
        <CardDescription>
          Create a professional, compliant bridge page for your campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">What is a Bridge Page?</h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            A bridge page sits between your ad and the ClickBank offer. It pre-sells the visitor, 
            builds trust, and increases conversions by 2-3x. It's also required for ClickBank compliance.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="hoplink">Your ClickBank Hoplink (Affiliate Link)</Label>
            <Input
              id="hoplink"
              type="url"
              placeholder="https://hop.clickbank.net/?affiliate=YOUR_ID&vendor=PRODUCT"
              value={hoplink}
              onChange={(e) => setHoplink(e.target.value)}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Get this from ClickBank after clicking "Promote" on a product
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <h4 className="font-semibold mb-2">Your Bridge Page Will Include:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Compelling headline and subheadline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Key benefits from the winning ad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Social proof (157,000+ users)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Professional design (mobile-responsive)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>FTC disclosure (compliant)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Clear call-to-action button</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={previewBridgePage}
            variant="outline"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Page
          </Button>
          <Button 
            onClick={downloadBridgePage}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download HTML
          </Button>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">Next Steps:</h4>
          <ol className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
            <li>1. Enter your ClickBank hoplink above</li>
            <li>2. Click "Preview Page" to see how it looks</li>
            <li>3. Click "Download HTML" to save the file</li>
            <li>4. Upload to your hosting (GitHub Pages, Netlify, or your domain)</li>
            <li>5. Use this URL as your "Final URL" in Bing Ads</li>
          </ol>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>The bridge page is pre-filled with content from your selected niche and winning ad.</p>
          <p className="mt-1">You can customize the HTML file after downloading if needed.</p>
        </div>
      </CardContent>
    </Card>
  )
}
