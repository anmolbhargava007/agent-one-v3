
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, Plus, Search, Database, Network, Shield, ArrowRight, Clock, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockAgents } from "@/data/mockData";
import { AgentStatus, Agent } from "@/types";

const Agents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "all">("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Filter agents based on search query and status
  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">
            Create, manage, and deploy intelligent agents
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Agent
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === "active" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("active")}
          >
            Active
          </Button>
          <Button 
            variant={statusFilter === "draft" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("draft")}
          >
            Draft
          </Button>
          <Button 
            variant={statusFilter === "inactive" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("inactive")}
          >
            Inactive
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No agents found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              No agents match your current filters. Try adjusting your search or create a new agent.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create New Agent
            </Button>
          </div>
        )}
        
        <Card className="border-dashed border-2 bg-transparent hover:bg-muted/50 cursor-pointer transition-colors flex flex-col justify-center items-center p-6 h-full" onClick={() => setCreateDialogOpen(true)}>
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Create New Agent</h3>
          <p className="text-muted-foreground text-center">
            Build a custom agent to automate tasks and processes
          </p>
        </Card>
      </div>
      
      <CreateAgentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
};

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className={cn(
        "h-2",
        agent.status === "active" ? "bg-green-500" :
        agent.status === "draft" ? "bg-amber-500" :
        "bg-gray-500"
      )} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{agent.name}</CardTitle>
          <Badge variant={agent.status === "active" ? "default" : "outline"}>
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </Badge>
        </div>
        <CardDescription>{agent.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Cpu size={16} className="text-muted-foreground" />
            <span className="text-sm">{agent.model.name}</span>
            <Badge variant="outline" className="ml-auto">
              {agent.model.type}
            </Badge>
          </div>
          
          <div className="flex gap-2 items-center">
            <Database size={16} className="text-muted-foreground" />
            <span className="text-sm">{agent.vectorDB.name}</span>
            <Badge variant="outline" className="ml-auto">
              {agent.vectorDB.provider}
            </Badge>
          </div>
          
          <div className="flex gap-2 items-center">
            <Network size={16} className="text-muted-foreground" />
            <span className="text-sm">{agent.integrations.length} Integration{agent.integrations.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex gap-2 items-center">
            <Shield size={16} className="text-muted-foreground" />
            <span className="text-sm">{agent.guardrails.length} Guardrail{agent.guardrails.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4 pb-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={agent.creator.avatar} alt={agent.creator.name} />
            <AvatarFallback>{agent.creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            Created by {agent.creator.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {new Date(agent.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </CardFooter>
      <div className="bg-muted p-2 flex justify-end gap-2">
        <Button variant="outline" size="sm">
          Edit
        </Button>
        <Button size="sm">
          <span>View</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateAgentDialog = ({ open, onOpenChange }: CreateAgentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Configure your new AI agent using the form below.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="model">Model Selection</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="guardrails">Guardrails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Agent Name</label>
                <Input id="name" placeholder="Enter agent name" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea
                  id="description"
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  placeholder="Enter a description of what this agent does"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Draft</Button>
                  <Button variant="outline" size="sm" className="flex-1">Inactive</Button>
                  <Button size="sm" className="flex-1">Active</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="model" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="overflow-hidden border-2 border-primary">
                <CardHeader className="pb-2">
                  <CardTitle>Small Language Model</CardTitle>
                  <CardDescription>Efficient for basic tasks</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Provider</span>
                      <span className="text-sm font-medium">OpenAI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Parameters</span>
                      <span className="text-sm font-medium">1B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Context Window</span>
                      <span className="text-sm font-medium">4096 tokens</span>
                    </div>
                  </div>
                </CardContent>
                <div className="bg-muted p-2 text-center">
                  <Badge variant="outline">Selected</Badge>
                </div>
              </Card>
              
              <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle>Medium Language Model</CardTitle>
                  <CardDescription>Balanced for various tasks</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Provider</span>
                      <span className="text-sm font-medium">Anthropic</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Parameters</span>
                      <span className="text-sm font-medium">7B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Context Window</span>
                      <span className="text-sm font-medium">8192 tokens</span>
                    </div>
                  </div>
                </CardContent>
                <div className="bg-muted p-2 text-center">
                  <Button variant="outline" size="sm">Select</Button>
                </div>
              </Card>
              
              {/* Additional models would go here */}
            </div>
            
            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium">Vector Database</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="overflow-hidden border-2 border-primary">
                  <CardHeader className="pb-2">
                    <CardTitle>FastVector</CardTitle>
                    <CardDescription>High-performance for smaller datasets</CardDescription>
                  </CardHeader>
                  <div className="bg-muted p-2 text-center">
                    <Badge variant="outline">Selected</Badge>
                  </div>
                </Card>
                
                <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle>ScalableVector</CardTitle>
                    <CardDescription>For enterprise applications</CardDescription>
                  </CardHeader>
                  <div className="bg-muted p-2 text-center">
                    <Button variant="outline" size="sm">Select</Button>
                  </div>
                </Card>
                
                <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle>SecureVector</CardTitle>
                    <CardDescription>With advanced encryption</CardDescription>
                  </CardHeader>
                  <div className="bg-muted p-2 text-center">
                    <Button variant="outline" size="sm">Select</Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>SQL Connector</CardTitle>
                      <CardDescription>Connect to SQL databases</CardDescription>
                    </div>
                    <div className="flex items-center h-6">
                      <input type="checkbox" id="sql" className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">Connect to SQL databases for data retrieval and storage</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">data</Badge>
                    <Badge variant="outline">AgentOne</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>REST API Connector</CardTitle>
                      <CardDescription>Connect to REST APIs</CardDescription>
                    </div>
                    <div className="flex items-center h-6">
                      <input type="checkbox" id="rest" className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">Connect to REST APIs for data exchange</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">api</Badge>
                    <Badge variant="outline">AgentOne</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Document Processing</CardTitle>
                      <CardDescription>Process documents</CardDescription>
                    </div>
                    <div className="flex items-center h-6">
                      <input type="checkbox" id="doc" className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">Process and extract data from documents</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">tool</Badge>
                    <Badge variant="outline">AgentOne</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Email Service</CardTitle>
                      <CardDescription>Send and receive emails</CardDescription>
                    </div>
                    <div className="flex items-center h-6">
                      <input type="checkbox" id="email" className="h-4 w-4" checked/>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">Send and receive emails</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">service</Badge>
                    <Badge variant="outline">SendGrid</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="guardrails" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Content Filtering</CardTitle>
                      <CardDescription>Filter inappropriate content</CardDescription>
                    </div>
                    <div className="flex items-center h-6">
                      <input type="checkbox" id="content" className="h-4 w-4" checked />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">Filter inappropriate content from model outputs</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">content</Badge>
                  </div>
                </CardContent>
                <div className="bg-muted p-4">
                  <h4 className="text-sm font-medium mb-2">Rules</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="rule1" className="h-4 w-4" checked />
                      <label htmlFor="rule1" className="text-sm">Profanity Filter</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="rule2" className="h-4 w-4" checked />
                      <label htmlFor="rule2" className="text-sm">Harmful Content Detection</label>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Security Controls</CardTitle>
                      <CardDescription>Implement security controls</CardDescription>
                    </div>
                    <div className="flex items-center h-6">
                      <input type="checkbox" id="security" className="h-4 w-4" checked />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">Implement security controls for sensitive data</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">security</Badge>
                  </div>
                </CardContent>
                <div className="bg-muted p-4">
                  <h4 className="text-sm font-medium mb-2">Rules</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="rule3" className="h-4 w-4" checked />
                      <label htmlFor="rule3" className="text-sm">PII Detection</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="rule4" className="h-4 w-4" checked />
                      <label htmlFor="rule4" className="text-sm">Injection Prevention</label>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Compliance Framework</CardTitle>
                      <CardDescription>Ensure regulatory compliance</CardDescription>
                    </div>
                    <div className="flex items-center h-6">
                      <input type="checkbox" id="compliance" className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">Ensure compliance with regulations</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">compliance</Badge>
                  </div>
                </CardContent>
                <div className="bg-muted p-4">
                  <h4 className="text-sm font-medium mb-2">Rules</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="rule5" className="h-4 w-4" />
                      <label htmlFor="rule5" className="text-sm">GDPR Compliance</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="rule6" className="h-4 w-4" />
                      <label htmlFor="rule6" className="text-sm">HIPAA Compliance</label>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            <Plus className="mr-2 h-4 w-4" /> Create Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Agents;
