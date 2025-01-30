import { Button } from "@gitcoin/ui";

interface MessageProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function MessagePage({ title, message, action, className = "" }: MessageProps) {
  return (
    <div className={`flex min-h-[50vh] flex-col items-center justify-center p-4 ${className}`}>
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-gray-900 mb-3 text-2xl font-bold">{title}</h1>

        <p className="text-gray-600 mb-8">{message}</p>

        {action && <Button onClick={action.onClick} value={action.label} />}
      </div>
    </div>
  );
}
