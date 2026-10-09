import React, { useState } from 'react';
import { Menu, X, ChevronDown, Bell, User, LogOut } from 'lucide-react';

export function ModernNavbar({ isLoggedIn = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white border-b border-border z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-bid-navy to-bid-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D&J</span>
              </div>
              <span className="hidden sm:inline font-bold text-lg text-bid-navy">D&J Stratagem</span>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="/bids" className="text-text-muted hover:text-bid-blue font-medium transition-colors">
              Browse Bids
            </a>
            <a href="/how-it-works" className="text-text-muted hover:text-bid-blue font-medium transition-colors">
              How It Works
            </a>
            <a href="/pricing" className="text-text-muted hover:text-bid-blue font-medium transition-colors">
              Pricing
            </a>
            <a href="/resources" className="text-text-muted hover:text-bid-blue font-medium transition-colors">
              Resources
            </a>
          </div>

          {/* Right side: CTA + user menu */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <a
                  href="/login"
                  className="px-6 py-2 text-bid-navy font-semibold hover:text-bid-blue transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="px-6 py-3 bg-bid-orange hover:bg-bid-orange-hover text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Get Started
                </a>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-text-muted hover:text-bid-navy transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
                </button>

                {/* Profile menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-surface rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-bid-blue/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-bid-blue" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  </button>

                  {/* Dropdown */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg overflow-hidden">
                      <a
                        href="/dashboard"
                        className="block px-4 py-3 text-text hover:bg-surface transition-colors border-b border-border"
                      >
                        Dashboard
                      </a>
                      <a
                        href="/profile"
                        className="block px-4 py-3 text-text hover:bg-surface transition-colors border-b border-border"
                      >
                        Profile
                      </a>
                      <a
                        href="/settings"
                        className="block px-4 py-3 text-text hover:bg-surface transition-colors border-b border-border"
                      >
                        Settings
                      </a>
                      <button className="w-full text-left px-4 py-3 text-text-muted hover:bg-surface hover:text-danger transition-colors flex items-center gap-2">
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
            className="lg:hidden p-2 text-text-muted hover:text-bid-navy transition-colors"
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
          <div className="lg:hidden border-t border-border">
            <div className="px-4 py-4 space-y-3">
              <a
                href="/bids"
                className="block px-4 py-2 text-text-muted hover:text-bid-blue font-medium rounded-lg hover:bg-surface transition-colors"
              >
                Browse Bids
              </a>
              <a
                href="/how-it-works"
                className="block px-4 py-2 text-text-muted hover:text-bid-blue font-medium rounded-lg hover:bg-surface transition-colors"
              >
                How It Works
              </a>
              <a
                href="/pricing"
                className="block px-4 py-2 text-text-muted hover:text-bid-blue font-medium rounded-lg hover:bg-surface transition-colors"
              >
                Pricing
              </a>
              <a
                href="/resources"
                className="block px-4 py-2 text-text-muted hover:text-bid-blue font-medium rounded-lg hover:bg-surface transition-colors"
              >
                Resources
              </a>

              <div className="border-t border-border pt-3 mt-3 space-y-2">
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
                      className="block px-4 py-3 bg-bid-orange hover:bg-bid-orange-hover text-white font-semibold rounded-lg text-center transition-colors"
                    >
                      Get Started
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-text hover:bg-surface rounded-lg"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-text hover:bg-surface rounded-lg"
                    >
                      Profile
                    </a>
                    <button className="w-full text-left px-4 py-2 text-text-muted hover:text-danger hover:bg-surface rounded-lg">
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
