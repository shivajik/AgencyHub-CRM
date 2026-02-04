import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTasks, mockTeamMembers, mockMessages, mockProjects } from "@/lib/mockData";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Send, 
  Smile, 
  Paperclip,
  Inbox as InboxIcon,
  MessageSquare,
  Bell
} from "lucide-react";
import { useState } from "react";

export default function TeamInbox() {
  const [messageInput, setMessageInput] = useState("");

  const myTasks = mockTasks; // In a real app, filter by current user
  const onlineMembers = mockTeamMembers.filter(m => m.status === "online");
  const otherMembers = mockTeamMembers.filter(m => m.status !== "online");

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-heading tracking-tight">Team Inbox</h1>
        <p className="text-muted-foreground">Collaborate with your team and manage your tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        
        {/* Left Column: Messages & Channels */}
        <Card className="lg:col-span-7 flex flex-col h-full shadow-sm border-border/60">
          <div className="p-4 border-b flex justify-between items-center bg-muted/20">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Team Chat</h2>
            </div>
            <Tabs defaultValue="general" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {mockMessages.map((msg) => (
                <div key={msg.id} className="flex gap-4 group">
                  <Avatar className="h-10 w-10 mt-0.5">
                    <AvatarImage src={msg.senderAvatar} />
                    <AvatarFallback>{msg.senderName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{msg.senderName}</span>
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{msg.content}</p>
                    {msg.reactions && (
                      <div className="flex gap-1 pt-1">
                        {msg.reactions.map((reaction, i) => (
                          <Badge key={i} variant="secondary" className="px-1.5 py-0 text-xs font-normal h-5 gap-1 hover:bg-muted cursor-pointer transition-colors">
                            <span>{reaction.emoji}</span>
                            <span className="text-muted-foreground">{reaction.count}</span>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Fake historical messages to fill space */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Yesterday
                  </span>
                </div>
              </div>
            </div>
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
                  if (e.key === 'Enter') {
                    setMessageInput("");
                    // Add mock send logic here if needed
                  }
                }}
              />
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                <Smile className="h-5 w-5" />
              </Button>
              <Button size="icon" className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Right Column: Tasks & Team */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-hidden">
          
          {/* My Tasks */}
          <Card className="flex-1 flex flex-col shadow-sm border-border/60 min-h-0">
            <CardHeader className="py-4 px-4 border-b bg-muted/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">My Tasks</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-0">
              <div className="divide-y">
                {myTasks.map((task) => (
                  <div key={task.id} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors group cursor-pointer">
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
                          {task.project}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {task.dueDate}
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
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Team Members */}
          <Card className="shrink-0 shadow-sm border-border/60">
            <CardHeader className="py-3 px-4 border-b bg-muted/20">
              <CardTitle className="text-base">Team Members</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[200px]">
                <div className="divide-y">
                  {[...onlineMembers, ...otherMembers].map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 px-4 hover:bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${
                            member.status === "online" ? "bg-green-500" :
                            member.status === "busy" ? "bg-red-500" :
                            "bg-gray-400"
                          }`} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium leading-none">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
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