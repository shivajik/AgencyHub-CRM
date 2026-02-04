import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Send, 
  Smile, 
  Paperclip,
  MessageSquare,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";

export default function TeamInbox() {
  const [messageInput, setMessageInput] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");
  const queryClient = useQueryClient();

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.getTasks(),
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.getUsers(),
  });

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", activeChannel],
    queryFn: () => api.getMessages(activeChannel),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.getProjects(),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: { content: string; channel: string }) => api.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", activeChannel] });
      setMessageInput("");
    },
  });

  const tasks = tasksData?.tasks || [];
  const users = usersData?.users || [];
  const messages = messagesData?.messages || [];
  const projects = projectsData?.projects || [];

  const teamMembers = users.filter((u: any) => u.role !== "client");
  const onlineMembers = teamMembers.filter((m: any) => m.status === "online");
  const otherMembers = teamMembers.filter((m: any) => m.status !== "online");

  const getUserById = (id: string) => users.find((u: any) => u.id === id);
  const getProjectById = (id: string) => projects.find((p: any) => p.id === id);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessageMutation.mutate({ content: messageInput, channel: activeChannel });
    }
  };

  if (tasksLoading || usersLoading) {
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
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-heading tracking-tight" data-testid="text-inbox-title">Team Inbox</h1>
        <p className="text-muted-foreground">Collaborate with your team and manage your tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        
        <Card className="lg:col-span-7 flex flex-col h-full shadow-sm border-border/60">
          <div className="p-4 border-b flex justify-between items-center bg-muted/20">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Team Chat</h2>
            </div>
            <Tabs value={activeChannel} onValueChange={setActiveChannel} className="w-[240px]">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                <TabsTrigger value="project-updates" className="text-xs">Projects</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            {messagesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg: any) => {
                  const sender = getUserById(msg.senderId);
                  return (
                    <div key={msg.id} className="flex gap-4 group" data-testid={`message-${msg.id}`}>
                      <Avatar className="h-10 w-10 mt-0.5">
                        <AvatarImage src={sender?.avatar} />
                        <AvatarFallback>{sender?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{sender?.name || "Unknown"}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">{msg.content}</p>
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex gap-1 pt-1">
                            {msg.reactions.map((reaction: any, i: number) => (
                              <Badge key={i} variant="secondary" className="px-1.5 py-0 text-xs font-normal h-5 gap-1 hover:bg-muted cursor-pointer transition-colors">
                                <span>{reaction.emoji}</span>
                                <span className="text-muted-foreground">{reaction.count}</span>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-4 border-t bg-muted/10">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input 
                placeholder="Type a message..." 
                className="flex-1 bg-background"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                data-testid="input-message"
              />
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                <Smile className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                className="shrink-0" 
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending || !messageInput.trim()}
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-hidden">
          
          <Card className="flex-1 flex flex-col shadow-sm border-border/60 min-h-0">
            <CardHeader className="py-4 px-4 border-b bg-muted/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">All Tasks</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-0">
              <div className="divide-y">
                {tasks.map((task: any) => {
                  const project = getProjectById(task.projectId);
                  return (
                    <div key={task.id} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors group cursor-pointer" data-testid={`task-item-${task.id}`}>
                      <div className="mt-1">
                        {task.status === "done" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-normal border-primary/20 text-primary bg-primary/5">
                            {project?.title || "No Project"}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {format(new Date(task.dueDate), "MMM d")}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        variant={task.priority === "high" ? "destructive" : "secondary"}
                        className="text-[10px] h-5 px-1.5"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>

          <Card className="shrink-0 shadow-sm border-border/60">
            <CardHeader className="py-3 px-4 border-b bg-muted/20">
              <CardTitle className="text-base">Team Members</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[200px]">
                <div className="divide-y">
                  {[...onlineMembers, ...otherMembers].map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-3 px-4 hover:bg-muted/30" data-testid={`team-member-${member.id}`}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${
                            member.status === "online" ? "bg-green-500" :
                            member.status === "busy" ? "bg-red-500" :
                            "bg-gray-400"
                          }`} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium leading-none">{member.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}