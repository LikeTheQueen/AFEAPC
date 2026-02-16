// __mocks__/react-pdf.ts
export const Document = ({ children }: any) => children;
export const Page = () => null;
export const pdfjs = { GlobalWorkerOptions: { workerSrc: '' } };
export default { Document, Page, pdfjs };