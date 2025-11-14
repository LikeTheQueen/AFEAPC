import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import LoadingPage from "./routes/loadingPage";
import { SupabaseProvider } from "./types/SupabaseContext"; 
import PageNotFound from "./routes/pageNotFound";
//import {pdfjs} from 'react-pdf'

//pdfjs.GlobalWorkerOptions.workerSrc='/pdf.worker.min.js' 


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AFE Partner Connections</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
//This may need to be changed to Root
export default function Root() {
  
  //return <SupabaseProvider><LoggedInUserLayout /></SupabaseProvider>;
  return (
  <SupabaseProvider><Outlet/></SupabaseProvider>
  
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "Page Not Found"
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
    
  } 

  return (
     <PageNotFound message={message} details={details} stack={stack} />
  );
}

export function HydrateFallback() {
  return (
    <LoadingPage/>
  );
}
