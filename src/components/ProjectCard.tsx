import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import StageBadge from '@/components/StageBadge';
import { PROJECT_TYPE_LABELS, Project } from '@/lib/types';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/p/${project.slug}`}>
      <Card className="group border-border bg-card transition hover:border-primary/30 hover:glow-gold">
        <CardContent className="p-5">
          <div className="mb-3 flex items-start justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gradient-gold transition">
              {project.title}
            </h3>
            <StageBadge stage={project.current_stage} />
          </div>
          {project.summary && (
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {PROJECT_TYPE_LABELS[project.type]}
            </span>
            {project.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
