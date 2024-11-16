interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between py-4">
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold capitalize md:text-2xl">
          {heading}
        </h1>
        {text && <p className="text-md text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}
