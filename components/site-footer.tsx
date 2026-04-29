export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background/80 px-6 py-10 text-sm text-muted-foreground backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>Curiosity is the key to greatness.Dev Grit to Crinde for a better "ME".</p>
        <p>© {new Date().getFullYear()} Fullstack Portfolio</p>
      </div>
    </footer>
  );
}
