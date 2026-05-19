import Link from 'next/link';
import { DocumentType } from '@/lib/documents';

interface Props {
  doc: DocumentType;
}

const categoryColors: Record<string, string> = {
  Finance:    'bg-emerald-100 text-emerald-700',
  Legal:      'bg-purple-100 text-purple-700',
  Property:   'bg-blue-100 text-blue-700',
  Employment: 'bg-orange-100 text-orange-700',
  Personal:   'bg-pink-100 text-pink-700',
};

export default function DocCard({ doc }: Props) {
  const badgeClass = categoryColors[doc.category] ?? 'bg-gray-100 text-gray-700';

  return (
    <Link
      href={`/build/${doc.id}`}
      className="group flex flex-col gap-3 bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#B8860B] hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl">{doc.icon}</span>
        {doc.popular && (
          <span className="text-[10px] font-bold bg-[#0A1628] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
            Popular
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-[#0A1628] text-base group-hover:text-[#B8860B] transition-colors">
          {doc.name}
        </h3>
        <p className="text-slate-500 text-sm mt-1 leading-relaxed">{doc.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
          {doc.category}
        </span>
        <span className="text-[#B8860B] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Create →
        </span>
      </div>
    </Link>
  );
}
