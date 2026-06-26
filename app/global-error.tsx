"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-4xl font-semibold">Something went wrong</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          We&apos;re sorry, but an unexpected error occurred. Please refresh the page or try again later.
        </p>
        {error.digest && <p className="mt-2 text-xs text-slate-400">Error ID: {error.digest}</p>}
      </body>
    </html>
  );
}
