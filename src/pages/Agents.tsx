
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, Plus, Search, Database, Network, Shield, ArrowRight, Clock, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgents } from "@/hooks/useAgents";
import { useModels } from "@/hooks/useModels";
import { useVectors } from "@/hooks/useVectors";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useGuardrails } from "@/hooks/useGuardrails";
import { EditAgentModal } from "@/components/modals/EditAgentModal";

const Agents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  // Use real API data
  const { agents, isLoading, createAgent, updateAgent, isCreating, isUpdating } = useAgents();
  const { models } = useModels();
  const { vectors } = useVectors();
  const { integrations } = useIntegrations();
  const { guardrails } = useGuardrails();

  // Filter agents based on search query and status
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.agent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.descriptions.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.agents_status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleEditAgent = (agent: any) => {
    setSelectedAgent(agent);
    setEditModalOpen(true);
  };

  const handleSaveAgent = (agentData: any) => {
    updateAgent(agentData);
    setEditModalOpen(false);
    setSelectedAgent(null);
  };

  const routeFunction = () => {
    window.open("http://15.206.121.90:3005", "_blank");
  };  

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">AI Agents</h1>
            <p className="text-muted-foreground">
              Create, manage, and deploy intelligent agents
            </p>
          </div>
          {/* <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create New Agent
          </Button> */}
          <Button onClick={() => routeFunction()}>
            <Plus className="mr-2 h-4 w-4" /> Create New Agent
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Bot className="h-8 w-8 text-muted-foreground animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading agents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">
            Create, manage, and deploy intelligent agents
          </p>
        </div>
        <Button onClick={() => routeFunction()}>
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
            <AgentCard
              key={agent.agent_id}
              agent={agent}
              models={models}
              vectors={vectors}
              integrations={integrations}
              guardrails={guardrails}
              onEdit={handleEditAgent}
            />
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
            <Button onClick={() => routeFunction()}>
            <Plus className="mr-2 h-4 w-4" /> Create New Agent
          </Button>
          </div>
        )}

        <Card className="border-dashed border-2 bg-transparent hover:bg-muted/50 cursor-pointer transition-colors flex flex-col justify-center items-center p-6 h-full" onClick={() => routeFunction()}>
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Create New Agent</h3>
          <p className="text-muted-foreground text-center">
            Build a custom agent to automate tasks and processes
          </p>
        </Card>
      </div>

      <CreateAgentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        models={models}
        vectors={vectors}
        integrations={integrations}
        guardrails={guardrails}
        createAgent={createAgent}
        isCreating={isCreating}
      />

      <EditAgentModal
        agent={selectedAgent}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedAgent(null);
        }}
        onSave={handleSaveAgent}
        isLoading={isUpdating}
      />
    </div>
  );
};

interface AgentCardProps {
  agent: any;
  models: any[];
  vectors: any[];
  integrations: any[];
  guardrails: any[];
  onEdit: (agent: any) => void;
}

const AgentCard = ({ agent, models, vectors, integrations, guardrails, onEdit }: AgentCardProps) => {
  // Find the related model, vector, integrations, and guardrails
  const model = models.find(m => m.id === agent.aimodel_id?.toString());
  const vector = vectors.find(v => v.id === agent.aivector_id?.toString());
  const agentIntegrations = integrations.filter(i => agent.integrator_ids?.includes(i.integrator_id));
  const agentGuardrails = guardrails.filter(g => agent.guardrail_ids?.includes(g.guardrail_id));

  return (
    <Card className="overflow-hidden">
      <div className={cn(
        "h-2",
        agent.agents_status?.toLowerCase() === "active" ? "bg-green-500" :
          agent.agents_status?.toLowerCase() === "draft" ? "bg-amber-500" :
            "bg-gray-500"
      )} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{agent.agent_name}</CardTitle>
          <Badge variant={agent.agents_status?.toLowerCase() === "active" ? "default" : "outline"}>
            {agent.agents_status}
          </Badge>
        </div>
        <CardDescription>{agent.descriptions}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Cpu size={16} className="text-muted-foreground" />
            <span className="text-sm">{model?.name || 'Unknown Model'}</span>
            <Badge variant="outline" className="ml-auto">
              {model?.type || 'N/A'}
            </Badge>
          </div>

          <div className="flex gap-2 items-center">
            <Database size={16} className="text-muted-foreground" />
            <span className="text-sm">{vector?.name || 'Unknown Vector DB'}</span>
            <Badge variant="outline" className="ml-auto">
              {vector?.provider || 'N/A'}
            </Badge>
          </div>

          <div className="flex gap-2 items-center">
            <Network size={16} className="text-muted-foreground" />
            <span className="text-sm">{agentIntegrations.length} Integration{agentIntegrations.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex gap-2 items-center">
            <Shield size={16} className="text-muted-foreground" />
            <span className="text-sm">{agentGuardrails.length} Guardrail{agentGuardrails.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4 pb-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            Created by User
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </CardFooter>
      <div className="bg-muted p-2 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(agent)}>
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
  models: any[];
  vectors: any[];
  integrations: any[];
  guardrails: any[];
  createAgent: (data: any) => void;
  isCreating: boolean;
}

const CreateAgentDialog = ({ open, onOpenChange, models, vectors, integrations, guardrails, createAgent, isCreating }: CreateAgentDialogProps) => {
  const [agentData, setAgentData] = useState({
    agent_name: "",
    descriptions: "",
    agents_status: "Active",
    aimodel_id: "",
    aivector_id: "",
    integrator_ids: [] as number[],
    guardrail_ids: [] as number[],
  });

  const handleSubmit = () => {
    if (!agentData.agent_name || !agentData.descriptions || !agentData.aimodel_id || !agentData.aivector_id) {
      return;
    }

    createAgent({
      ...agentData,
      aimodel_id: parseInt(agentData.aimodel_id),
      aivector_id: parseInt(agentData.aivector_id),
      is_active: true,
    });

    // Reset form
    setAgentData({
      agent_name: "",
      descriptions: "",
      agents_status: "Active",
      aimodel_id: "",
      aivector_id: "",
      integrator_ids: [],
      guardrail_ids: [],
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Configure your new AI agent using the form below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Agent Name</label>
              <Input
                id="name"
                placeholder="Enter agent name"
                value={agentData.agent_name}
                onChange={e => setAgentData({ ...agentData, agent_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description"
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Enter a description of what this agent does"
                value={agentData.descriptions}
                onChange={e => setAgentData({ ...agentData, descriptions: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Model</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={agentData.aimodel_id}
                  onChange={e => setAgentData({ ...agentData, aimodel_id: e.target.value })}
                >
                  <option value="">Select a model</option>
                  {models.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Vector Database</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={agentData.aivector_id}
                  onChange={e => setAgentData({ ...agentData, aivector_id: e.target.value })}
                >
                  <option value="">Select a vector database</option>
                  {vectors.map(vector => (
                    <option key={vector.id} value={vector.id}>{vector.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Agent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Agents;
