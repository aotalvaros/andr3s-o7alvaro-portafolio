'use client';

interface WorkInProgressProps {
  readonly message?: string;
}

export function WorkInProgress({ message = 'Módulo en construcción 🛠️' }: WorkInProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
      <span className="text-4xl">🚧</span>
      <h3 className="text-lg font-medium text-muted-foreground">{message}</h3>
    </div>
  );
}
