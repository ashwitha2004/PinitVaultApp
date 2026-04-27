import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Portfolio } from '../../types/Portfolio';

interface SharePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio;
}

const SharePortfolioModal: React.FC<SharePortfolioModalProps> = ({
  isOpen,
  onClose,
  portfolio
}) => {
  const navigate = useNavigate();
  const [viewOnly, setViewOnly] = useState(true);
  const [allowDownload, setAllowDownload] = useState(false);
  const [requirePasscode, setRequirePasscode] = useState(false);
  const [expiry, setExpiry] = useState('7d');
  const [maxViews, setMaxViews] = useState(10);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isRevoked, setIsRevoked] = useState(false);
  const [shareMethod, setShareMethod] = useState<'link' | 'qr' | 'email'>('link');
  const [email, setEmail] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [views, setViews] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  const generateLink = () => {
    console.log('Portfolio data:', portfolio);
    if (!portfolio || !portfolio.id) {
      alert('Portfolio data not available');
      return;
    }
    if (isRevoked) {
      alert('Access Revoked');
      return;
    }
    if (views >= maxViews) {
      alert('View limit reached');
      return;
    }
    if (isExpired) {
      alert('Link expired');
      return;
    }
    const link = `https://vault.app/p/${portfolio.id}`;
    setGeneratedLink(link);
  };

  const revokeAccess = () => {
    setIsRevoked(true);
    setGeneratedLink('');
  };

  const generateQRCode = () => {
    const link = `https://vault.app/p/${portfolio.id}`;
    setQrCode(link);
  };

  const simulateView = () => {
    setViews(prev => prev + 1);
  };

  const sendEmailInvite = () => {
    console.log(`Sending invite to: ${email}`);
    console.log(`Portfolio link: https://vault.app/p/${portfolio.id}`);
  };

  // Disable download when viewOnly is ON
  useEffect(() => {
    if (viewOnly) {
      setAllowDownload(false);
    }
  }, [viewOnly]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4 z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Share Portfolio</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">{portfolio.name}</p>
        </div>

        <div className="p-6 pb-24 space-y-4">
          {/* Section 1: Share Method */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Share Method</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setShareMethod('link')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  shareMethod === 'link'
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Secure Link</p>
              </button>

              <button
                onClick={() => setShareMethod('qr')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  shareMethod === 'qr'
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">QR Code</p>
              </button>

              <button
                onClick={() => setShareMethod('email')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  shareMethod === 'email'
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Email Invite</p>
              </button>
            </div>
          </div>

          {/* Section 2: Controls - Only show for Secure Link */}
          {shareMethod === 'link' && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Controls</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <label className="text-sm font-medium text-gray-700">View Only Mode</label>
                  <button
                    onClick={() => setViewOnly(!viewOnly)}
                    className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors ${
                      viewOnly ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        viewOnly ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <label className="text-sm font-medium text-gray-700">Allow Download</label>
                  <button
                    onClick={() => setAllowDownload(!allowDownload)}
                    className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors ${
                      allowDownload ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        allowDownload ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <label className="text-sm font-medium text-gray-700">Require Passcode</label>
                  <button
                    onClick={() => setRequirePasscode(!requirePasscode)}
                    className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors ${
                      requirePasscode ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        requirePasscode ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Expiry - Only show for Secure Link */}
          {shareMethod === 'link' && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Expiry</h3>
              <div className="flex gap-3">
                {['24h', '7d', '30d'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setExpiry(option)}
                    className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-colors ${
                      expiry === option
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {option === '24h' ? '24 hours' : option === '7d' ? '7 days' : '30 days'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: View Limit - Only show for Secure Link */}
          {shareMethod === 'link' && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">View Limit</h3>
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Total Views: {views}</span>
                <button
                  onClick={simulateView}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  Simulate View
                </button>
              </div>
              <input
                type="number"
                min="1"
                value={maxViews}
                onChange={(e) => setMaxViews(parseInt(e.target.value) || 1)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Maximum number of views"
              />
            </div>
          )}

          {/* Section 5: QR Code - Only show for QR Code method */}
          {shareMethod === 'qr' && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">QR Code</h3>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center">
                {qrCode ? (
                  <div className="text-center">
                    <div className="w-40 h-40 bg-white border-2 border-gray-300 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <p className="text-sm text-gray-600 break-all px-3">{qrCode}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-700">QR Code Generated</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-40 h-40 bg-gray-200 rounded-2xl flex items-center justify-center mb-4">
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700">QR Code Placeholder</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 6: Email Invite - Only show for Email method */}
          {shareMethod === 'email' && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Email Invite</h3>
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
                <button
                  onClick={sendEmailInvite}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
                >
                  Send Invite
                </button>
              </div>
            </div>
          )}

          {/* Sticky Bottom Button */}
          {(shareMethod === 'link' || shareMethod === 'email') && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <div className="max-w-md mx-auto">
                <button
                  onClick={() => {
                    if (shareMethod === 'link') {
                      generateLink();
                      navigator.clipboard.writeText(`https://vault.app/p/${portfolio.id}`);
                      alert("Link generated and copied!");
                    } else if (shareMethod === 'email') {
                      sendEmailInvite();
                    }
                  }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
                >
                  {shareMethod === 'link' ? 'Share' : 'Send Invite'}
                </button>
              </div>
            </div>
          )}

          {/* Generated Link Section */}
          {generatedLink && (
            <div className="p-3 bg-green-100 rounded-xl text-sm">
              Link: {generatedLink}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharePortfolioModal;