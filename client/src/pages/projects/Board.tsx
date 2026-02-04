import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockProjects } from "@/lib/mockData";
import { Plus, MoreHorizontal, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const statuses = [
  { id: "planning", label: "Planning", color: "bg-blue-500/10 text-blue-500 border-blue-200" },
  { id: "in-progress", label: "In Progress", color: "bg-orange-500/10 text-orange-500 border-orange-200" },
  { id: "review", label: "Review", color: "bg-purple-500/10 text-purple-500 border-purple-200" },
  { id: "completed", label: "Completed", color: "bg-green-500/10 text-green-500 border-green-200" }
];

export default function Board() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">Projects Board</h1>
          <p className="text-muted-foreground">Track project progress and status.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="flex h-full gap-6 overflow-x-auto pb-6">
        {statuses.map((status) => (
          <div key={status.id} className="flex-1 min-w-[300px] flex flex-col gap-4">
            <div className={`flex items-center justify-between p-3 rounded-lg border ${status.color}`}>
              <span className="font-semibold">{status.label}</span>
              <span className="bg-background/50 px-2 py-0.5 rounded text-xs font-bold">
                {mockProjects.filter(p => p.status === status.id).length}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {mockProjects
                .filter(p => p.status === status.id)
                .map((project) => (
                  <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 pb-2 space-y-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-xs font-normal">
                          {project.client}
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
                        <span>Due {project.dueDate}</span>
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
                        {project.assignees.map((avatar, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={avatar} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        ))}
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
              
              <Button variant="ghost" className="w-full border border-dashed border-border/60 text-muted-foreground hover:bg-muted/50">
                <Plus className="mr-2 h-3 w-3" /> Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}