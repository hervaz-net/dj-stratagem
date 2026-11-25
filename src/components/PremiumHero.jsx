import React from 'react';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

export function PremiumHero() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-surface via-surface to-surface overflow-hidden">
      {/* Subtle geometric accent — top right */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand/5 to-transparent rounded-full -mr-48 -mt-48 pointer-events-none" />
      
      {/* Subtle geometric accent — bottom left */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-brand/5 to-transparent rounded-full -ml-40 -mb-40 pointer-events-none" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Headline + CTA */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full w-fit">
              <Zap className="w-4 h-4 text-brand" />
              <span className="text-sm font-semibold text-brand">Modern Bidding Platform</span>
            </div>

            {/* Headline — dark, bold, corporate */}
            <div className="space-y-4">
              <h1 className="text-fg text-6xl leading-[0.95] md:text-8xl">
                Win More <span className="text-brand">Bids</span>. 
                <br />
                Less Work.
              </h1>
              <p className="text-lg text-fg-muted leading-relaxed max-w-lg">
                Modern bidding platform for contractors, subcontractors, and suppliers. Find qualified opportunities, submit smart bids, and manage your pipeline—all in one place.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-4 bg-brand hover:bg-brand-hover text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                Browse Active Bids
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white border-2 border-bid-navy text-bid-navy font-semibold rounded-lg hover:bg-bid-navy hover:text-white transition-colors">
                Learn More
              </button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-line">
              <div>
                <div className="text-3xl font-bold text-bid-navy">500+</div>
                <p className="text-sm text-fg-muted">Active Bids</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-bid-navy">2.4K</div>
                <p className="text-sm text-fg-muted">Contractors</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-bid-navy">$85M</div>
                <p className="text-sm text-fg-muted">Total Work</p>
              </div>
            </div>
          </div>

          {/* Right: Dashboard preview mockup */}
          <div className="relative h-[600px] hidden lg:flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-bid-navy to-brand rounded-2xl opacity-5" />
            
            {/* Premium card stack — modern, clean */}
            <div className="relative w-full max-w-md">
              {/* Card 1 — back */}
              <div className="absolute -bottom-4 -right-4 w-full bg-white border border-line rounded-xl p-6 transform rotate-3">
                <div className="space-y-3">
                  <div className="h-4 bg-line rounded w-3/4" />
                  <div className="h-3 bg-line rounded w-1/2" />
                </div>
              </div>

              {/* Card 2 — middle */}
              <div className="absolute -bottom-2 -right-2 w-full bg-white border border-line rounded-xl p-6 transform -rotate-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-line rounded w-1/3" />
                    <div className="px-3 py-1 bg-brand/10 rounded text-xs font-semibold text-brand">ACTIVE</div>
                  </div>
                  <div className="h-4 bg-line rounded w-5/6" />
                  <div className="h-3 bg-line rounded w-2/3" />
                </div>
              </div>

              {/* Card 3 — front (featured) */}
              <div className="relative bg-white border border-line rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-bid-navy">Commercial HVAC Retrofit</h3>
                    <span className="inline-block px-3 py-1 bg-brand/10 rounded text-xs font-semibold text-brand">ACTIVE</span>
                  </div>
                  
                  <p className="text-sm text-fg-muted">Downtown Medical Center, New York</p>
                  
                  <div className="border-t border-line pt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-fg-muted">Budget</span>
                      <span className="font-bold text-fg">$85,000–$120,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-fg-muted">Bids Due</span>
                      <span className="font-bold text-fg">5 Days</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-fg-muted">Bids Submitted</span>
                      <span className="font-bold text-brand">12</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-3 bg-brand hover:bg-brand-hover text-white font-semibold rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features row — below fold */}
      <div className="relative border-t border-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-3">
              <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-brand" />
              </div>
              <h3 className="font-bold text-fg">Smart Bid Matching</h3>
              <p className="text-sm text-fg-muted">AI-matched opportunities based on your trade, location, and expertise.</p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3">
              <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-brand" />
              </div>
              <h3 className="font-bold text-fg">Secure Pipeline</h3>
              <p className="text-sm text-fg-muted">Real-time tracking from bid to award. Never miss a deadline.</p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3">
              <div className="w-12 h-12 bg-bid-navy/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-bid-navy" />
              </div>
              <h3 className="font-bold text-fg">Instant Insights</h3>
              <p className="text-sm text-fg-muted">Competitive analysis and bid intelligence to win smarter.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
