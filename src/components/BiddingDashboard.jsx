import React, { useState } from 'react';
import { Search, Filter, Clock, DollarSign, MapPin, ChevronRight, Star, AlertCircle } from 'lucide-react';
import { formatCompactMoney } from '../lib/money';

export function BiddingDashboard() {
  const [activeFilter, setActiveFilter] = useState('all');

  const bids = [
    {
      id: 1,
      title: 'Commercial HVAC Retrofit',
      location: 'Downtown Medical Center, New York',
      budget: { min: 85000, max: 120000 },
      daysLeft: 5,
      status: 'active',
      submissions: 12,
      yourBid: true,
      specialty: 'HVAC',
    },
    {
      id: 2,
      title: 'Roofing Repair & Replacement',
      location: 'Industrial Complex, New Jersey',
      budget: { min: 45000, max: 65000 },
      daysLeft: 2,
      status: 'active',
      submissions: 8,
      yourBid: false,
      specialty: 'Roofing',
    },
    {
      id: 3,
      title: 'Plumbing System Overhaul',
      location: 'Office Tower, Boston MA',
      budget: { min: 120000, max: 180000 },
      daysLeft: 12,
      status: 'active',
      submissions: 5,
      yourBid: false,
      specialty: 'Plumbing',
    },
    {
      id: 4,
      title: 'Electrical Panel Upgrade',
      location: 'Retail Center, Philadelphia PA',
      budget: { min: 35000, max: 55000 },
      daysLeft: 0,
      status: 'closed',
      submissions: 18,
      yourBid: true,
      specialty: 'Electrical',
    },
    {
      id: 5,
      title: 'Concrete Foundation Repair',
      location: 'Warehouse, Detroit MI',
      budget: { min: 25000, max: 40000 },
      daysLeft: 8,
      status: 'active',
      submissions: 3,
      yourBid: false,
      specialty: 'Concrete',
    },
  ];

  const getStatusBadge = (status, daysLeft) => {
    if (status === 'closed') {
      return { bg: 'bg-danger-light', text: 'text-danger', label: 'Closed' };
    }
    if (daysLeft === 0) {
      return { bg: 'bg-warning-light', text: 'text-warning', label: 'Due Today' };
    }
    return { bg: 'bg-bid-orange/10', text: 'text-bid-orange', label: 'Active' };
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-bid-navy text-6xl leading-[0.95] md:text-8xl">Bid Marketplace</h1>
              <p className="text-sm text-text-muted mt-1">Discover opportunities matched to your trade and location</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search by project name, location, or specialty..."
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bid-blue/50 text-text placeholder-text-muted"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {['all', 'my-bids', 'urgent', 'high-budget', 'nearby'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                    activeFilter === filter
                      ? 'bg-bid-navy text-white'
                      : 'bg-surface text-text-muted hover:bg-border'
                  }`}
                >
                  {filter === 'all' && 'All Bids'}
                  {filter === 'my-bids' && 'My Bids'}
                  {filter === 'urgent' && 'Urgent (< 3 days)'}
                  {filter === 'high-budget' && 'High Budget'}
                  {filter === 'nearby' && 'Nearby'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bid cards grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-4">
          {bids.map((bid) => {
            const statusStyle = getStatusBadge(bid.status, bid.daysLeft);
            const isUrgent = bid.daysLeft <= 2;

            return (
              <div
                key={bid.id}
                className="group bg-white border border-border rounded-xl p-6 transition-all hover:border-bid-blue/30 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-text group-hover:text-bid-blue transition-colors">
                          {bid.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-text-muted">
                          <MapPin className="w-4 h-4" />
                          {bid.location}
                        </div>
                      </div>
                      {bid.yourBid && (
                        <Star className="w-5 h-5 fill-bid-orange text-bid-orange flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {statusStyle.label}
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border">
                  {/* Budget */}
                  <div>
                    <p className="text-xs text-text-muted font-semibold mb-1">Budget</p>
                    <p className="text-sm font-bold text-bid-navy">
                      {formatCompactMoney(bid.budget.min)} – {formatCompactMoney(bid.budget.max)}
                    </p>
                  </div>

                  {/* Time */}
                  <div>
                    <p className="text-xs text-text-muted font-semibold mb-1">Time Left</p>
                    <p
                      className={`text-sm font-bold ${
                        isUrgent ? 'text-danger' : 'text-bid-blue'
                      }`}
                    >
                      {bid.daysLeft === 0 ? 'Today' : `${bid.daysLeft} days`}
                    </p>
                  </div>

                  {/* Submissions */}
                  <div>
                    <p className="text-xs text-text-muted font-semibold mb-1">Submissions</p>
                    <p className="text-sm font-bold text-text">{bid.submissions} bids</p>
                  </div>
                </div>

                {/* Bottom: specialty + CTA */}
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 bg-bid-blue/10 text-bid-blue text-xs font-semibold rounded-full">
                    {bid.specialty}
                  </span>
                  <button className="flex items-center gap-2 text-bid-orange font-semibold hover:text-bid-orange-hover transition-colors">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Urgent badge — if applicable */}
                {isUrgent && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-warning-light rounded-lg">
                    <AlertCircle className="w-4 h-4 text-warning flex-shrink-0" />
                    <p className="text-xs font-semibold text-warning">This bid closes soon</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
