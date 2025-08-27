import React, { useMemo, useState, useEffect, useRef, createContext, useContext } from "react";
import { X, Plus, Search as SearchIcon, Wand2, Trash2, Link as LinkIcon } from "lucide-react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "ghost"; size?: "default" | "icon" };
export function Button({ className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm font-medium shadow-sm transition border";
  const variants = {
    default: "bg-black text-white border-black/10 hover:opacity-90",
    secondary: "bg-white text-black border-gray-300 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 border-transparent hover:bg-gray-100",
  } as const;
  const sizes = {
    default: "h-9",
    icon: "h-9 w-9 p-0",
  } as const;
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export function Input({ className = "", ...props }: InputProps) {
  return <input className={`h-9 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300 ${className}`} {...props} />;
}

export function Badge({ children, variant = "default" as "default" | "secondary" | "outline", className = "" }: { children: React.ReactNode; variant?: "default" | "secondary" | "outline"; className?: string }) {
  const styles = {
    default: "bg-black text-white border border-black/10",
    secondary: "bg-gray-100 text-gray-900 border border-gray-200",
    outline: "bg-transparent text-gray-800 border border-gray-300",
  } as const;
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${styles[variant]} ${className}`}>{children}</span>;
}

export function Checkbox({ checked, onCheckedChange }: { checked?: boolean; onCheckedChange?: (v: boolean) => void }) {
  return (
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-gray-300"
    />
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border bg-red-900 ${className}`}>{children}</div>;
}
export function CardHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`border-b px-4 py-3 ${className}`}>{children}</div>;
}
export function CardTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`text-xl font-semibold ${className}`}>{children}</div>;
}
export function CardContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
}

// Tabs (very small context impl)
const TabsCtx = createContext<{ value: string; set: (v: string) => void } | null>(null);
export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [value, set] = useState(defaultValue);
  return <TabsCtx.Provider value={{ value, set }}>{children}</TabsCtx.Provider>;
}
export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex gap-2 rounded-2xl border p-1 bg-gray-50">{children}</div>;
}
export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.set(value)}
      className={`px-3 py-1.5 text-sm rounded-xl transition ${active ? "bg-white shadow border" : "text-gray-600 hover:bg-white/60"}`}
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div className="mt-4">{children}</div>;
}

// ————————————————————————————————————————————————
// TYPES
// ————————————————————————————————————————————————
type Row = { id: string; name: string; code?: string; group?: string };

// A mapping can be many-to-many: sets of left IDs and right IDs
export type Mapping = {
  id: string;
  leftIds: string[];
  rightIds: string[];
  rule?: string;
  confidence?: number;
};

// ————————————————————————————————————————————————
// MOCK DATA
// ————————————————————————————————————————————————
const makeRows = (prefix: string, count: number, groups: string[]): Row[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-${i + 1}`,
    name: `${prefix} ${i + 1}`,
    code: `${prefix.substring(0, 2).toUpperCase()}${(i + 1).toString().padStart(3, "0")}`,
    group: groups[i % groups.length],
  }));

const LEFT_ROWS: Row[] = [
  ...makeRows("Alpha", 30, ["A", "B", "C"]),
  ...makeRows("Bravo", 30, ["A", "B", "C"]),
  ...makeRows("Charlie", 40, ["A", "B", "C"]),
];

const RIGHT_ROWS: Row[] = [
  ...makeRows("A", 50, ["North", "South"]),
  ...makeRows("B", 25, ["North", "South"]),
  ...makeRows("C", 25, ["North", "South"]),
];

// ————————————————————————————————————————————————
// UTILS
// ————————————————————————————————————————————————
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const similarity = (a: string, b: string) => {
  const A = Array.from(new Set(normalize(a).split("")));
  const B = Array.from(new Set(normalize(b).split("")));
  const inter = A.filter((c) => B.includes(c)).length;
  const avgLen = (A.length + B.length) / 2 || 1;
  return inter / avgLen;
};

const useFiltered = (rows: Row[], q: string, group: string) =>
  useMemo(() => {
    const nq = normalize(q);
    return rows.filter((r) => {
      const text = normalize(`${r.name} ${r.code ?? ""}`);
      const groupOk = group ? r.group === group : true;
      return text.includes(nq) && groupOk;
    });
  }, [rows, q, group]);

// ————————————————————————————————————————————————
// MAIN COMPONENT
// ————————————————————————————————————————————————
export default function RecordMappingDemo() {
  const [leftQuery, setLeftQuery] = useState("");
  const [rightQuery, setRightQuery] = useState("");
  const [leftGroup, setLeftGroup] = useState("");
  const [rightGroup, setRightGroup] = useState("");

  const left = useFiltered(LEFT_ROWS, leftQuery, leftGroup);
  const right = useFiltered(RIGHT_ROWS, rightQuery, rightGroup);

  const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
  const [selectedRight, setSelectedRight] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [suggestions, setSuggestions] = useState<Mapping[]>([]);

  const createMapping = (idsL: string[], idsR: string[], meta?: Partial<Mapping>) => {
    if (!idsL.length || !idsR.length) return;
    setMappings((prev) => [
      { id: crypto.randomUUID(), leftIds: [...idsL], rightIds: [...idsR], ...meta },
      ...prev,
    ]);
    setSelectedLeft([]);
    setSelectedRight([]);
  };

  const removeMapping = (id: string) => setMappings((prev) => prev.filter((m) => m.id !== id));

  const [thresh, setThresh] = useState(0.6);
  const [ruleField, setRuleField] = useState<"name" | "code">("name");

  const suggested = useMemo(() => {
    const out: Mapping[] = [];
    LEFT_ROWS.forEach((L) => {
      const ranked = RIGHT_ROWS.map((R) => {
        const a = ruleField === "name" ? L.name : L.code ?? L.name;
        const b = ruleField === "name" ? R.name : R.code ?? R.name;
        return { id: R.id, score: similarity(a, b) };
      }).sort((a, b) => b.score - a.score);
      const top = ranked[0];
      if (top && top.score >= thresh) {
        out.push({ id: crypto.randomUUID(), leftIds: [L.id], rightIds: [top.id], rule: ruleField, confidence: top.score });
      }
    });
    return out;
  }, [thresh, ruleField]);

  function toggleLeft(id: string) {
    setSelectedLeft((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  function toggleRight(id: string) {
    setSelectedRight((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Record Mapping Demo</h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Source (Left)</h2>
          <SearchBox value={leftQuery} onChange={setLeftQuery} placeholder="Search left…" />
          <SelectableList rows={left} selected={selectedLeft} onToggle={toggleLeft} />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Target (Right)</h2>
          <SearchBox value={rightQuery} onChange={setRightQuery} placeholder="Search right…" />
          <SelectableList rows={right} selected={selectedRight} onToggle={toggleRight} />
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={() => createMapping(selectedLeft, selectedRight)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Mapping
        </button>
        <button onClick={() => setSuggestions(suggested)} className="bg-green-600 text-white px-4 py-2 rounded">
          Generate Suggestions
        </button>
        {suggestions.length > 0 && (
          <button onClick={() => setMappings((prev) => [...suggestions, ...prev])} className="bg-gray-600 text-white px-4 py-2 rounded">
            Accept {suggestions.length} Suggestions
          </button>
        )}
      </div>
      <div>
        <h2 className="font-semibold mb-2">Pending Mappings</h2>
        {mappings.length === 0 ? (
          <p className="text-sm text-gray-500">No mappings yet.</p>
        ) : (
          <div className="space-y-2">
            {mappings.map((m) => (
              <div key={m.id} className="flex justify-between items-center border rounded p-2">
                <div>
                  <strong>Left:</strong> {m.leftIds.join(", ")} — <strong>Right:</strong> {m.rightIds.join(", ")}
                </div>
                <button onClick={() => removeMapping(m.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectableList({ rows, selected, onToggle }: { rows: Row[]; selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="max-h-80 overflow-auto border rounded">
      {rows.map((r) => (
        <div
          key={r.id}
          onClick={() => onToggle(r.id)}
          className={`flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${selected.includes(r.id) ? "bg-gray-200" : ""}`}
        >
          <span>{r.name}</span>
          <input type="checkbox" readOnly checked={selected.includes(r.id)} />
        </div>
      ))}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (s: string) => void; placeholder?: string }) {
  return (
    <div className="mb-2">
      <div className="flex items-center border rounded px-2">
        <SearchIcon className="w-4 h-4 text-gray-500 mr-2" />
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="flex-1 py-1 outline-none" />
      </div>
    </div>
  );
}
