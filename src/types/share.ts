// Portfolio sharing system TypeScript interfaces

export interface ShareSettings {
  allowDownload: boolean;
  viewOnly: boolean;
  requirePasscode: boolean;
  passcode?: string;
  expiryDate?: string;
  maxViews?: number;
}

export interface ShareLink {
  id: string;
  portfolioId: string;
  url: string;
  createdAt: string;
  settings: ShareSettings;
  views: number;
}

export interface AccessLog {
  id: string;
  portfolioId: string;
  timestamp: string;
  device: string;
  location: string;
}

// Utility functions for share management
export interface CreateShareLinkInput {
  portfolioId: string;
  settings: ShareSettings;
}

export interface ShareLinkResponse {
  shareLink: ShareLink;
  success: boolean;
  message?: string;
}

export interface AccessLogEntry {
  id: string;
  portfolioId: string;
  timestamp: string;
  device: string;
  location: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
}

// Share validation types
export interface ShareValidationResult {
  isValid: boolean;
  reason?: string;
  remainingViews?: number;
  isExpired?: boolean;
}

// Share analytics types
export interface ShareAnalytics {
  totalViews: number;
  uniqueViewers: number;
  downloads: number;
  averageViewTime: number;
  deviceBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
  dailyViews: Array<{
    date: string;
    views: number;
  }>;
}
