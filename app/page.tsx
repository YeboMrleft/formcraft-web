import Navbar from '@/components/Navbar';
import DocCard from '@/components/DocCard';
import { DOCUMENT_TYPES, CATEGORIES } from '@/lib/documents';

export const metadata = {
  title: 'FormCraft AI — Professional Document Generator',
  description: 'Generate professional South African documents in minutes. Invoices, leases, employment contracts, NDAs and more — AI-enhanced.',
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-[#0A1628] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#B8860B]/20 border border-[#B8860B]/40 text-[#B8860B] text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
              ✨ AI-Powered · South African Law Compliant
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Professional Documents,{' '}
              <span className="text-[#B8860B]">Generated in Minutes</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Fill in a form, let our AI enhance your content, then download a print-ready PDF.
              Invoices, leases, employment contracts, NDAs and more — all compliant with South African law.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8 text-sm text-slate-400">
              <span className="flex items-center gap-1">✅ No sign-up required</span>
              <span className="flex items-center gap-1">✅ Print-ready PDF</span>
              <span className="flex items-center gap-1">✅ AI-enhanced content</span>
              <span className="flex items-center gap-1">✅ SA law compliant</span>
            </div>
          </div>
        </section>

        {/* Document Grid */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-[#0A1628] mb-2">Choose a Document</h2>
          <p className="text-slate-500 mb-8">Select a document type to get started.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DOCUMENT_TYPES.map(doc => (
              <DocCard key={doc.id} doc={doc} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-8 px-4 mt-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <div>
              <span className="font-semibold text-[#0A1628]">FormCraft AI</span>
              {' '}· Built by{' '}
              <a href="https://philasandenxele.web.app" target="_blank" rel="noopener noreferrer" className="text-[#B8860B] hover:underline">
                Inka-Tech Solutions
              </a>
            </div>
            <div>Templates only — not legal advice. Consult a qualified attorney for legal matters.</div>
          </div>
        </footer>
      </main>
    </>
  );
}
