import React, { useState } from 'react';
import { Menu, X, ChevronDown, Bell, User, LogOut } from 'lucide-react';

export function ModernNavbar({ isLoggedIn = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white border-b border-line z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-bid-navy to-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D&J</span>
              </div>
              <span className="hidden sm:inline font-bold text-lg text-bid-navy">D&J Stratagem</span>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="/bids" className="text-fg-muted hover:text-brand font-medium transition-colors">
              Browse Bids
            </a>
            <a href="/how-it-works" className="text-fg-muted hover:text-brand font-medium transition-colors">
              How It Works
            </a>
            <a href="/pricing" className="text-fg-muted hover:text-brand font-medium transition-colors">
              Pricing
            </a>
            <a href="/resources" className="text-fg-muted hover:text-brand font-medium transition-colors">
              Resources
            </a>
          </div>

          {/* Right side: CTA + user menu */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <a
                  href="/login"
                  className="px-6 py-2 text-bid-navy font-semibold hover:text-brand transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="px-6 py-3 bg-brand hover:bg-brand-hover text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Get Started
                </a>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-fg-muted hover:text-bid-navy transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
                </button>

                {/* Profile menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-surface rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-brand" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-fg-muted" />
                  </button>

                  {/* Dropdown */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-line rounded-lg shadow-lg overflow-hidden">
                      <a
                        href="/dashboard"
                        className="block px-4 py-3 text-fg hover:bg-surface transition-colors border-b border-line"
                      >
                        Dashboard
                      </a>
                      <a
                        href="/profile"
                        className="block px-4 py-3 text-fg hover:bg-surface transition-colors border-b border-line"
                      >
                        Profile
                      </a>
                      <a
                        href="/settings"
                        className="block px-4 py-3 text-fg hover:bg-surface transition-colors border-b border-line"
                      >
                        Settings
                      </a>
                      <button className="w-full text-left px-4 py-3 text-fg-muted hover:bg-surface hover:text-danger transition-colors flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-fg-muted hover:text-bid-navy transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-line">
            <div className="px-4 py-4 space-y-3">
              <a
                href="/bids"
                className="block px-4 py-2 text-fg-muted hover:text-brand font-medium rounded-lg hover:bg-surface transition-colors"
              >
                Browse Bids
              </a>
              <a
                href="/how-it-works"
                className="block px-4 py-2 text-fg-muted hover:text-brand font-medium rounded-lg hover:bg-surface transition-colors"
              >
                How It Works
              </a>
              <a
                href="/pricing"
                className="block px-4 py-2 text-fg-muted hover:text-brand font-medium rounded-lg hover:bg-surface transition-colors"
              >
                Pricing
              </a>
              <a
                href="/resources"
                className="block px-4 py-2 text-fg-muted hover:text-brand font-medium rounded-lg hover:bg-surface transition-colors"
              >
                Resources
              </a>

              <div className="border-t border-line pt-3 mt-3 space-y-2">
                {!isLoggedIn ? (
                  <>
                    <a
                      href="/login"
                      className="block px-4 py-2 text-bid-navy font-semibold rounded-lg hover:bg-surface"
                    >
                      Sign In
                    </a>
                    <a
                      href="/signup"
                      className="block px-4 py-3 bg-brand hover:bg-brand-hover text-white font-semibold rounded-lg text-center transition-colors"
                    >
                      Get Started
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-fg hover:bg-surface rounded-lg"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-fg hover:bg-surface rounded-lg"
                    >
                      Profile
                    </a>
                    <button className="w-full text-left px-4 py-2 text-fg-muted hover:text-danger hover:bg-surface rounded-lg">
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
