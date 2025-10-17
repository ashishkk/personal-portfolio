import Image from "next/image";

type Project = {
  title: string;
  description: string;
  image?: string;
  link?: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="border rounded-lg overflow-hidden">
      {project.image && (
        <div className="w-full h-40 relative">
          <Image src={project.image} alt={project.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{project.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
        {project.link && (
          <div className="mt-3">
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="underline">
              View project
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
