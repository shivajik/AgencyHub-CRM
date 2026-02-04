import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { Plus, MoreHorizontal, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const statuses = [
  { id: "planning", label: "Planning", color: "bg-blue-500/10 text-blue-500 border-blue-200" },
  { id: "in-progress", label: "In Progress", color: "bg-orange-500/10 text-orange-500 border-orange-200" },
  { id: "review", label: "Review", color: "bg-purple-500/10 text-purple-500 border-purple-200" },
  { id: "completed", label: "Completed", color: "bg-green-500/10 text-green-500 border-green-200" }
];

export default function Board() {
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.getProjects(),
  });

  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: () => api.getClients(),
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.getUsers(),
  });

  const projects = projectsData?.projects || [];
  const clients = clientsData?.clients || [];
  const users = usersData?.users || [];

  const getClientName = (clientId: string) => {
    const client = clients.find((c: any) => c.id === clientId);
    return client?.name || "Unknown Client";
  };

  const getUserById = (userId: string) => {
    return users.find((u: any) => u.id === userId);
  };

  if (projectsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight" data-testid="text-projects-title">Projects Board</h1>
          <p className="text-muted-foreground">Track project progress and status.</p>
        </div>
        <Button className="gap-2" data-testid="button-new-project">
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="flex h-full gap-6 overflow-x-auto pb-6">
        {statuses.map((status) => (
          <div key={status.id} className="flex-1 min-w-[300px] flex flex-col gap-4">
            <div className={`flex items-center justify-between p-3 rounded-lg border ${status.color}`}>
              <span className="font-semibold">{status.label}</span>
              <span className="bg-background/50 px-2 py-0.5 rounded text-xs font-bold">
                {projects.filter((p: any) => p.status === status.id).length}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {projects
                .filter((p: any) => p.status === status.id)
                .map((project: any) => (
                  <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow" data-testid={`card-project-${project.id}`}>
                    <CardHeader className="p-4 pb-2 space-y-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-xs font-normal">
                          {getClientName(project.clientId)}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                      <CardTitle className="text-base font-semibold leading-tight">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Due {format(new Date(project.dueDate), "MMM d, yyyy")}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {(project.assignees || []).slice(0, 3).map((userId: string, i: number) => {
                          const user = getUserById(userId);
                          return (
                            <Avatar key={i} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={user?.avatar} />
                              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                          );
                        })}
                        {(project.assignees?.length || 0) > 3 && (
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                            +{project.assignees.length - 3}
                          </div>
                        )}
                      </div>
                      <Badge variant={
                        project.priority === "high" ? "destructive" : 
                        project.priority === "medium" ? "default" : "secondary"
                      } className="text-[10px] h-5 px-1.5">
                        {project.priority}
                      </Badge>
                    </CardFooter>
                  </Card>
                ))}
              
              <Button variant="ghost" className="w-full border border-dashed border-border/60 text-muted-foreground hover:bg-muted/50" data-testid={`button-add-task-${status.id}`}>
                <Plus className="mr-2 h-3 w-3" /> Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}