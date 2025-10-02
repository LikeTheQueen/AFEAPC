// DocumentBrowser.tsx
import { useEffect, useMemo, useState } from "react";
//import { type IDocument } from "react-doc-viewer";
//import { fetchRelatedDocuments } from "provider/fetch";
import { Document, Page, pdfjs } from 'react-pdf';


import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&url';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
import samplePDF from './test.pdf';

type Props = {
  apc_op_id: string;
  apc_partner_id: string;
  token: string;
};
type RelatedDoc = { uri: string; fileName?: string };

export default function DocumentBrowser({ apc_op_id, apc_partner_id, token }: Props) {
  //const [docs, setDocs] = useState<IDocument[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  

  //if (loading) return <div style={{ padding: 12 }}>Loading…</div>;
  //if (err) return <div style={{ padding: 12, color: "crimson" }}>{err}</div>;
  //if (!docs.length) return <div style={{ padding: 12 }}>Nothing to show. Check your path or perms.</div>;

  //const selected = docs[selectedIdx];
//console.log(selected, 'the selected')
//console.log(docs)
  return (
    <>
    <p>'hello</p>
    <Document file={samplePDF}>
      <Page pageNumber={1} />
    </Document>
    </>
  );
}