import { FieldDef } from '@/lib/documents';

interface Props {
  field: FieldDef;
  value: string;
  onChange: (id: string, value: string) => void;
}

export default function FormField({ field, value, onChange }: Props) {
  const base =
    'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-colors bg-white';

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          className={`${base} resize-none min-h-[96px]`}
          placeholder={field.placeholder}
          value={value}
          onChange={e => onChange(field.id, e.target.value)}
          required={field.required}
          rows={4}
        />
      ) : field.type === 'select' && field.options ? (
        <select
          className={base}
          value={value}
          onChange={e => onChange(field.id, e.target.value)}
          required={field.required}
        >
          <option value="">Select…</option>
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={
            field.type === 'email' ? 'email'
            : field.type === 'number' ? 'number'
            : field.type === 'date' ? 'date'
            : field.type === 'phone' ? 'tel'
            : 'text'
          }
          className={base}
          placeholder={field.placeholder}
          value={value}
          onChange={e => onChange(field.id, e.target.value)}
          required={field.required}
          min={field.type === 'number' ? '0' : undefined}
          step={field.type === 'number' ? '0.01' : undefined}
        />
      )}
    </div>
  );
}
