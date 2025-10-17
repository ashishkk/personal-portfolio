export default function Footer() {
  return (
    <footer className="border-t mt-12 py-8">
      <div className="max-w-4xl mx-auto px-6 text-sm text-center text-muted-foreground">
        © {new Date().getFullYear()} Ashish — Built with Next.js
      </div>
    </footer>
  );
}
