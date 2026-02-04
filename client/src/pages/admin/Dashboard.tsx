import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClients, mockProjects, recentActivity } from "@/lib/mockData";
import { Users, Briefcase, DollarSign, Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

const data = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 4500 },
  { name: "Jul", total: 4100 },
];

export default function AdminDashboard() {
  const totalRevenue = mockClients.reduce((acc, client) => acc + client.totalRevenue, 0);
  const activeProjects = mockProjects.filter(p => p.status === "in-progress").length;
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-heading tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your agency's performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={DollarSign}
          trend="up"
          trendValue="+12.5%"
          description="from last month"
        />
        <StatCard 
          title="Active Clients" 
          value={mockClients.filter(c => c.status === "active").length} 
          icon={Users}
          trend="up"
          trendValue="+2"
          description="new this month"
        />
        <StatCard 
          title="Active Projects" 
          value={activeProjects} 
          icon={Briefcase}
          trend="neutral"
          trendValue="0"
          description="same as last week"
        />
        <StatCard 
          title="Avg. Project Value" 
          value="$12,500" 
          icon={Activity}
          trend="down"
          trendValue="-2.1%"
          description="from last quarter"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activity.avatar} alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold text-primary">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Projects Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProjects.slice(0, 3).map(project => (
                <div key={project.id} className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{project.title}</p>
                    <p className="text-xs text-muted-foreground">{project.client}</p>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">{project.progress}%</div>
                  </div>
                  <div className="ml-4 w-[100px]">
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: `${project.progress}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer flex items-center gap-3 transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Create New Project</span>
            </div>
            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer flex items-center gap-3 transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Add New Client</span>
            </div>
            <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer flex items-center gap-3 transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <DollarSign className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Create Invoice</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}