import { Spinner } from "@gitcoin/ui";

interface LoadingPageProps {
  title?: string;
  className?: string;
}

export function LoadingPage({ title = "Loading...", className = "" }: LoadingPageProps) {
  return (
    <div className={`flex min-h-[50vh] flex-col items-center justify-center p-4 ${className}`}>
      <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
        <h1 className="text-gray-900 mb-3 text-2xl font-bold">{title}</h1>
        <Spinner size="md" />
      </div>
    </div>
  );
}
