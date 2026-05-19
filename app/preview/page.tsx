'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PaywallModal from '@/components/PaywallModal';

type AccessState = 'checking' | 'free' | 'locked' | 'unlocked';

function getAccessState(docId: string): 'free' | 'locked' | 'unlocked' {
  try {
    const payments = JSON.parse(localStorage.getItem('formcraft_payments') || '{}');
    if (payments['subscription']) return 'unlocked';
    if (payments[docId]) return 'unlocked';

    const freeKey = `formcraft_free_${new Date().toISOString().slice(0, 7)}`;
    const used = localStorage.getItem(freeKey);
    return used ? 'locked' : 'free';
  } catch {
    return 'free';
  }
}

function markFreeUsed() {
  try {
    const freeKey = `formcraft_free_${new Date().toISOString().slice(0, 7)}`;
    localStorage.setItem(freeKey, '1');
  } catch {}
}

export default function PreviewPage() {
  const router = useRouter();
  const [html, setHtml] = useState('');
  const [docName, setDocName] = useState('Document');
  const [docId, setDocId] = useState('');
  const [access, setAccess] = useState<AccessState>('checking');
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('formcraft_html');
    const name = sessionStorage.getItem('formcraft_docName') || 'Document';
    const id = sessionStorage.getItem('formcraft_docId') || `doc-${Date.now()}`;
    if (!stored) { router.push('/'); return; }
    setHtml(stored);
    setDocName(name);
    setDocId(id);
    setAccess(getAccessState(id));
  }, [router]);

  const handleUnlockFree = () => {
    markFreeUsed();
    setAccess('unlocked');
  };

  const handlePaywallSuccess = () => {
    setShowPaywall(false);
    setAccess('unlocked');
  };

  const doPrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  const doDownload = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docName.replace(/\s+/g, '_')}_FormCraft.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!html || access === 'checking') {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>;
  }

  const isLocked = access === 'locked';
  const isFree = access === 'free';
  const isUnlocked = access === 'unlocked';

  return (
    <>
      <Navbar />
      <div className="bg-slate-100 min-h-screen">

        {/* Action bar — only shown when unlocked */}
        {isUnlocked && (
          <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="text-sm text-slate-500 hover:text-[#B8860B] transition-colors">
                  ← Edit
                </button>
                <span className="text-slate-300">|</span>
                <span className="font-semibold text-[#0A1628] text-sm">{docName}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={doDownload}
                  className="border border-slate-300 hover:border-[#B8860B] hover:text-[#B8860B] text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  ⬇ Download HTML
                </button>
                <button
                  onClick={doPrint}
                  className="bg-[#B8860B] hover:bg-[#a07609] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  🖨 Print / Save as PDF
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 py-6 pb-12">

          {/* Free banner */}
          {isFree && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-emerald-800 text-sm font-semibold">
                🎁 You have <strong>1 free export</strong> available this month
              </div>
              <button
                onClick={handleUnlockFree}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Use Free Export →
              </button>
            </div>
          )}

          {/* Print tip — only when unlocked */}
          {isUnlocked && (
            <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg px-3 py-2">
              💡 <strong>Tip:</strong> Click &quot;Print / Save as PDF&quot; → choose &quot;Save as PDF&quot; in your browser&apos;s print dialog.
            </div>
          )}

          {/* Document preview container */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative select-none">

            {/* The iframe — always clipped to header when locked */}
            <div
              className="relative"
              style={{
                maxHeight: isUnlocked ? '1200px' : '300px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}
            >
              <iframe
                srcDoc={html}
                className="w-full border-0 pointer-events-none"
                style={{ height: '1200px' }}
                title="Document Preview"
                sandbox="allow-same-origin"
              />
            </div>

            {/* Paywall overlay — shown when locked or free (before claim) */}
            {!isUnlocked && (
              <div
                className="relative"
                style={{
                  background: 'linear-gradient(to bottom, rgba(15,23,42,0) 0%, rgba(15,23,42,0.97) 18%, #0f172a 100%)',
                  marginTop: '-80px',
                  paddingTop: '80px',
                  paddingBottom: '48px',
                }}
              >
                <div className="flex flex-col items-center text-center px-6 py-8 gap-5">

                  {/* Lock icon */}
                  <div className="w-16 h-16 rounded-full bg-[#B8860B]/20 border-2 border-[#B8860B]/40 flex items-center justify-center text-3xl">
                    🔒
                  </div>

                  <div>
                    <h3 className="text-white text-xl font-bold mb-1">
                      {isFree ? 'Your document is ready' : 'Unlock to Download'}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto">
                      {isFree
                        ? 'Claim your free export to download and print this document.'
                        : 'You\'ve used your free export for this month. Choose a plan to continue.'}
                    </p>
                  </div>

                  {/* CTA buttons */}
                  {isFree ? (
                    <button
                      onClick={handleUnlockFree}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl transition-colors text-sm"
                    >
                      🎁 Claim Free Export
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPaywall(true)}
                      className="bg-[#B8860B] hover:bg-[#a07609] text-white font-bold px-8 py-3 rounded-xl transition-colors text-sm"
                    >
                      Unlock for R50 — or subscribe from R35/month
                    </button>
                  )}

                  {/* Plan pills */}
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">📄 R50 once-off</span>
                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">🎓 R35/month Student</span>
                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">🏢 R99/month Business</span>
                  </div>

                  <p className="text-slate-600 text-xs">🔒 Secure payments via PayFast · No subscription required for once-off</p>
                </div>
              </div>
            )}

          </div>

          {/* Edit link */}
          <div className="mt-4 text-center">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
              ← Go back and edit your document
            </button>
          </div>
        </div>
      </div>

      {showPaywall && (
        <PaywallModal
          docName={docName}
          docId={docId}
          onClose={() => setShowPaywall(false)}
          onSuccess={handlePaywallSuccess}
        />
      )}
    </>
  );
}
