import Header from "../components/Header";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-16 grid gap-12">
        <section className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-5xl font-bold">Ashish Kumar Kadasi</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            I&apos;m a Senior Frontend Engineer with 9+ years of experience designing and delivering enterprise-scale web applications
            using Angular (v12+), TypeScript, RxJS, and NgRx. Proven track record in performance optimization, scalable
            architecture, state management, and CI/CD automation. Skilled in mentoring teams, leading Agile practices,
            integrating REST APIs, and deploying applications to AWS/GCP. Passionate about building secure, reliable, and
            user-centric digital solutions. Experienced in leveraging AI-powered development tools such as GitHub Copilot to
            accelerate coding workflows, automate repetitive tasks, and enhance code quality across large-scale projects.
          </p>
          <div className="flex gap-3">
            <a
              href="#projects"
              className="inline-block rounded bg-foreground text-background px-4 py-2 font-medium"
            >
              See projects
            </a>
            <a
              href="/about"
              className="inline-block rounded border border-current px-4 py-2 font-medium"
            >
              About
            </a>
          </div>
        </section>

        <section id="projects" className="grid gap-6">
          <h2 className="text-2xl font-semibold">Selected projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </section>

        <section id="contact" className="py-8">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="mt-3">Email me at <a className="underline" href="mailto:hi@example.com">ashishkadasi09@gmail.com</a> or connect on <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/ashishk09/">LinkedIn</a>.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
