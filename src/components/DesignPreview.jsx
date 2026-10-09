import React from 'react';
import { PremiumHero } from './PremiumHero';
import { CompactDashboard } from './CompactDashboard';
import { ModernNavbar } from './ModernNavbar';

export function DesignPreview() {
  const [activeTab, setActiveTab] = React.useState('hero');

  return (
    <div className="bg-surface min-h-screen">
      {/* Tab navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { id: 'hero', label: '🎨 Hero Section' },
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'navbar', label: '📱 Navigation' },
              { id: 'system', label: '📋 Design System' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-bid-orange text-bid-orange'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'hero' && (
          <div>
            <ModernNavbar isLoggedIn={false} />
            <PremiumHero />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div>
            <ModernNavbar isLoggedIn={true} />
            <CompactDashboard />
          </div>
        )}

        {activeTab === 'navbar' && (
          <div className="space-y-8 p-8">
            <div>
              <h2 className="text-2xl font-bold text-bid-navy mb-4">Logged Out State</h2>
              <ModernNavbar isLoggedIn={false} />
            </div>
            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold text-bid-navy mb-4">Logged In State</h2>
              <ModernNavbar isLoggedIn={true} />
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
            {/* Color palette */}
            <section>
              <h2 className="text-bid-navy mb-6 text-5xl leading-[1] md:text-6xl">Color Palette</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Brand */}
                <div className="space-y-3">
                  <h3 className="font-bold text-text">Brand Colors</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Bid Navy', hex: '#0B1F33', class: 'bg-bid-navy' },
                      { name: 'Bid Blue', hex: '#2B6A8A', class: 'bg-bid-blue' },
                      { name: 'Bid Orange', hex: '#E85D04', class: 'bg-bid-orange' },
                    ].map((color) => (
                      <div key={color.hex} className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${color.class}`} />
                        <div>
                          <p className="font-semibold text-text">{color.name}</p>
                          <p className="text-xs text-text-muted">{color.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neutrals */}
                <div className="space-y-3">
                  <h3 className="font-bold text-text">Neutrals</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Text', hex: '#1A2330', class: 'bg-text' },
                      { name: 'Surface', hex: '#F4F5F7', class: 'bg-surface border border-border' },
                      { name: 'Card', hex: '#FFFFFF', class: 'bg-card border border-border' },
                    ].map((color) => (
                      <div key={color.hex} className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${color.class}`} />
                        <div>
                          <p className="font-semibold text-text">{color.name}</p>
                          <p className="text-xs text-text-muted">{color.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <h3 className="font-bold text-text">Status Colors</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Success', hex: '#15803D', class: 'bg-success' },
                      { name: 'Warning', hex: '#D97706', class: 'bg-warning' },
                      { name: 'Danger', hex: '#B91C1C', class: 'bg-danger' },
                    ].map((color) => (
                      <div key={color.hex} className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${color.class}`} />
                        <div>
                          <p className="font-semibold text-white">{color.name}</p>
                          <p className="text-xs text-white/70">{color.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Buttons */}
            <section>
              <h2 className="text-bid-navy mb-6 text-5xl leading-[1] md:text-6xl">Button Styles</h2>
              <div className="space-y-4">
                <div className="flex gap-3 flex-wrap">
                  <button className="px-6 py-3 bg-bid-orange hover:bg-bid-orange-hover text-white font-semibold rounded-lg transition-colors">
                    Primary CTA
                  </button>
                  <button className="px-6 py-3 bg-white border-2 border-bid-navy text-bid-navy font-semibold rounded-lg hover:bg-bid-navy hover:text-white transition-colors">
                    Secondary
                  </button>
                  <button className="px-6 py-3 bg-bid-blue hover:bg-bid-blue-hover text-white font-semibold rounded-lg transition-colors">
                    Tertiary Action
                  </button>
                  <button className="px-6 py-3 bg-surface text-text-muted font-semibold rounded-lg hover:bg-border transition-colors">
                    Disabled State
                  </button>
                </div>
              </div>
            </section>

            {/* Badges */}
            <section>
              <h2 className="text-bid-navy mb-6 text-5xl leading-[1] md:text-6xl">Status Badges</h2>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: 'ACTIVE', bg: 'bg-bid-orange/10', text: 'text-bid-orange' },
                  { label: 'AWARDED', bg: 'bg-success-light', text: 'text-success' },
                  { label: 'SUBMITTED', bg: 'bg-warning-light', text: 'text-warning' },
                  { label: 'OVERDUE', bg: 'bg-danger-light', text: 'text-danger' },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    className={`px-3 py-1 ${badge.bg} ${badge.text} text-xs font-semibold rounded-full`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </section>

            {/* Typography */}
            <section>
              <h2 className="text-bid-navy mb-6 text-5xl leading-[1] md:text-6xl">Typography</h2>
              <div className="space-y-6">
                <div>
                  <h1 className="text-text mb-2 text-6xl leading-[0.95] md:text-8xl">Display Heading</h1>
                  <p className="text-xs text-text-muted">48px / Bold</p>
                </div>
                <div>
                  <h2 className="text-text mb-2 text-5xl leading-[1] md:text-6xl">Section Heading</h2>
                  <p className="text-xs text-text-muted">32px / Bold</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text mb-2">Subsection Heading</h3>
                  <p className="text-xs text-text-muted">24px / Bold</p>
                </div>
                <div>
                  <p className="text-base text-text mb-2">Body text — clean, modern, readable on all devices.</p>
                  <p className="text-xs text-text-muted">16px / Regular</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-2">Secondary text — hints, captions, muted context</p>
                  <p className="text-xs text-text-muted">14px / Regular</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
