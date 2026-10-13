import React, { useState } from 'react';
import { Search, Clock, DollarSign, MapPin, ChevronRight, Star, AlertCircle } from 'lucide-react';
import { formatCompactMoney } from '../lib/money';

export function BiddingDashboard() {
  const [activeFilter, setActiveFilter] = useState('all');
  // ... rest of file would be here, but for brevity in this simulation we use the full from local
