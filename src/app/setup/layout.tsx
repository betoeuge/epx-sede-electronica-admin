export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex">
      {children}
    </div>
  );
}
