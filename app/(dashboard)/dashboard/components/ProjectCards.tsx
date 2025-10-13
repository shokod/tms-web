import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ChevronRight } from "lucide-react";
import { Project } from "../types";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on-track': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'behind': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'at-risk': return 'text-red-600 bg-red-50 border-red-200';
    case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group cursor-pointer">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
            {project.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{project.client}</p>
          <Badge className={`text-xs px-2 py-1 ${getStatusColor(typeof project.status === 'string' ? project.status : project.status?.name || project.status?.status || 'unknown')}`}>
            {(typeof project.status === 'string' ? project.status : project.status?.name || project.status?.status || 'unknown').replace('-', ' ')}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                project.progress >= 80 ? 'bg-emerald-500' : 
                project.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'
              }`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Hours Logged</div>
            <div className="font-semibold">{project.hoursLogged}h</div>
          </div>
          <div>
            <div className="text-gray-600">Budget</div>
            <div className="font-semibold">{formatCurrency(project.budget)}</div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ActiveProjects: React.FC<{ projects: Project[] }> = ({ projects }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
        View All <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  </div>
);