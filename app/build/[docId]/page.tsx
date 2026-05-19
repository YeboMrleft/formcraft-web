'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FormField from '@/components/FormField';
import { DOCUMENT_TYPES } from '@/lib/documents';
import { generateHTML } from '@/lib/generator';

interface Props {
  params: Promise<{ docId: string }>;
}

export default function BuildPage({ params }: Props) {
  const { docId } = use(params);
  const router = useRouter();
  const doc = DOCUMENT_TYPES.find(d => d.id === docId);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currentGroup, setCurrentGroup] = useState(0);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState('');

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Document type not found.
      </div>
    );
  }

  const group = doc.fields[currentGroup];
  const isLast = currentGroup === doc.fields.length - 1;
  const isFirst = currentGroup === 0;

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (!isLast) setCurrentGroup(g => g + 1);
  };

  const handleBack = () => {
    if (!isFirst) setCurrentGroup(g => g - 1);
  };

  const handlePreview = () => {
    const html = generateHTML(doc, formData);
    sessionStorage.setItem('formcraft_html', html);
    sessionStorage.setItem('formcraft_docName', doc.name);
    sessionStorage.setItem('formcraft_docId', `${doc.id}-${Date.now()}`);
    router.push('/preview');
  };

  const handleEnhance = async () => {
    setEnhancing(true);
    setEnhanceError('');
    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType: doc.name, fields: formData }),
      });
      if (!res.ok) throw new Error('Enhancement failed');
      const { enhanced } = await res.json();
      setFormData(prev => ({ ...prev, ...enhanced }));
    } catch {
      setEnhanceError('AI enhancement unavailable. You can continue without it.');
    } finally {
      setEnhancing(false);
    }
  };

  const progress = ((currentGroup + 1) / doc.fields.length) * 100;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-slate-500 hover:text-[#B8860B] flex items-center gap-1 mb-3 transition-colors"
            >
              ← Back to documents
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{doc.icon}</span>
              <div>
                <h1 className="text-xl font-bold text-[#0A1628]">{doc.name}</h1>
                <p className="text-sm text-slate-500">
                  Step {currentGroup + 1} of {doc.fields.length} · {group.title}
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B8860B] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">{group.icon}</span>
              <h2 className="text-base font-semibold text-[#0A1628]">{group.title}</h2>
            </div>
            <div className="flex flex-col gap-4">
              {group.fields.map(field => (
                <FormField
                  key={field.id}
                  field={field}
                  value={formData[field.id] || ''}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>

          {/* AI Enhance (only on last step) */}
          {isLast && (
            <div className="mt-4 bg-gradient-to-r from-[#0A1628] to-[#1a2f4e] rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-white font-semibold text-sm">✨ AI Enhancement</div>
                <div className="text-slate-400 text-xs mt-0.5">Let Claude improve your document content automatically</div>
                {enhanceError && <div className="text-red-400 text-xs mt-1">{enhanceError}</div>}
              </div>
              <button
                onClick={handleEnhance}
                disabled={enhancing}
                className="bg-[#B8860B] hover:bg-[#a07609] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                {enhancing ? 'Enhancing…' : 'Enhance with AI'}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-4">
            {!isFirst && (
              <button
                onClick={handleBack}
                className="flex-1 border border-slate-300 text-slate-700 hover:border-[#B8860B] hover:text-[#B8860B] py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                ← Back
              </button>
            )}
            {!isLast ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-[#0A1628] hover:bg-[#162440] text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handlePreview}
                className="flex-1 bg-[#B8860B] hover:bg-[#a07609] text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Preview & Download →
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
