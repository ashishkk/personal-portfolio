import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold">About</h1>
        <p className="mt-4 text-muted-foreground">
          I&apos;m a frontend developer who enjoys turning design into
          accessible, high-performance interfaces. I have experience building
          apps with Next.js, TypeScript, and modern CSS techniques. Outside of
          work I enjoy photography and long runs.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">Work</h2>
        <p className="mt-2 text-muted-foreground">
          I&apos;ve worked on web products at small startups and on open-source
          tooling. I focus on shipping reliable features and improving
          developer experience.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">Get in touch</h2>
        <p className="mt-2 text-muted-foreground">Email: <a className="underline" href="mailto:hi@example.com">hi@example.com</a></p>

        <p className="mt-8">
          <Link href="/">← Back home</Link>
        </p>
      </main>
    </div>
  );
}
