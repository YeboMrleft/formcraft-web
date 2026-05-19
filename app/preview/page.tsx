'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PaywallModal from '@/components/PaywallModal';

function canDownload(docId: string): boolean {
  try {
    const payments = JSON.parse(localStorage.getItem('formcraft_payments') || '{}');
    if (payments['subscription']) return true;
    if (payments[docId]) return true;

    // 1 free export per month
    const freeKey = `formcraft_free_${new Date().toISOString().slice(0, 7)}`;
    const used = localStorage.getItem(freeKey);
    return !used;
  } catch {
    return true;
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
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingAction, setPendingAction] = useState<'print' | 'download' | null>(null);
  const [isFree, setIsFree] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('formcraft_html');
    const name = sessionStorage.getItem('formcraft_docName') || 'Document';
    const id = sessionStorage.getItem('formcraft_docId') || `doc-${Date.now()}`;
    if (!stored) { router.push('/'); return; }
    setHtml(stored);
    setDocName(name);
    setDocId(id);
    setIsFree(canDownload(id));
  }, [router]);

  const tryAction = (action: 'print' | 'download') => {
    if (canDownload(docId)) {
      markFreeUsed();
      if (action === 'print') doPrint();
      else doDownload();
    } else {
      setPendingAction(action);
      setShowPaywall(true);
    }
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

  const handlePaywallSuccess = () => {
    setShowPaywall(false);
    if (pendingAction === 'print') doPrint();
    else if (pendingAction === 'download') doDownload();
    setPendingAction(null);
  };

  if (!html) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-slate-100 min-h-screen">
        {/* Action Bar */}
        <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-sm text-slate-500 hover:text-[#B8860B] transition-colors"
              >
                ← Edit
              </button>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-[#0A1628] text-sm">{docName}</span>
              {isFree && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                  1 free export available
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => tryAction('download')}
                className="border border-slate-300 hover:border-[#B8860B] hover:text-[#B8860B] text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                ⬇ Download HTML
              </button>
              <button
                onClick={() => tryAction('print')}
                className="bg-[#B8860B] hover:bg-[#a07609] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                🖨 Print / Save as PDF
              </button>
            </div>
          </div>
        </div>

        {/* Print tip */}
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-2">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg px-3 py-2">
            💡 <strong>Tip:</strong> Click &quot;Print / Save as PDF&quot; → choose &quot;Save as PDF&quot; in your browser&apos;s print dialog.
          </div>
        </div>

        {/* Document Preview */}
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <iframe
              srcDoc={html}
              className="w-full border-0"
              style={{ height: '1200px' }}
              title="Document Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>

      {showPaywall && (
        <PaywallModal
          docName={docName}
          docId={docId}
          onClose={() => { setShowPaywall(false); setPendingAction(null); }}
          onSuccess={handlePaywallSuccess}
        />
      )}
    </>
  );
}
