
import { useState } from "react";
import { Plus, Plug, Database, Link, Mail, Slack, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { mockIntegrations } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Integration, IntegrationType } from "@/types";

// Map integration type to icon
const typeIcon = {
  data: Database,
  api: Link,
  tool: Plug,
  service: Mail,
};

const Integrations = () => {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [showNewIntegrationModal, setShowNewIntegrationModal] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    description: "",
    type: "data" as IntegrationType,
    provider: "",
    authType: "API Key"
  });
  const { toast } = useToast();

  const handleNewIntegration = () => {
    setShowNewIntegrationModal(true);
  };

  const handleToggle = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, enabled: !integration.enabled } 
        : integration
    ));

    const integration = integrations.find(i => i.id === id);
    
    toast({
      title: integration?.enabled ? "Integration Disconnected" : "Integration Connected",
      description: `${integration?.name} has been ${integration?.enabled ? "disconnected" : "connected"} successfully.`,
    });
  };

  const handleCreateIntegration = () => {
    if (!newIntegration.name || !newIntegration.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newIntegrationObj: Integration = {
      id: `int-${Math.random().toString(36).substring(2, 10)}`,
      ...newIntegration,
      enabled: false
    };

    setIntegrations([...integrations, newIntegrationObj]);
    setNewIntegration({
      name: "",
      description: "",
      type: "data" as IntegrationType,
      provider: "",
      authType: "API Key"
    });
    setShowNewIntegrationModal(false);

    toast({
      title: "Integration Created",
      description: `${newIntegration.name} has been added successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
          <p className="text-muted-foreground">
            Manage your data connections and API integrations.
          </p>
        </div>
        <Button onClick={handleNewIntegration}>
          <Plus className="mr-2 h-4 w-4" /> Add Integration
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = typeIcon[integration.type] || Plug;
          return (
            <Card key={integration.id} className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-accent" />
                  <CardTitle>{integration.name}</CardTitle>
                </div>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize">{integration.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider</span>
                    <span>{integration.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auth Type</span>
                    <span>{integration.authType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={integration.enabled ? "text-green-500" : "text-red-500"}>
                      {integration.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant={integration.enabled ? "destructive" : "default"} 
                    onClick={() => handleToggle(integration.id)}
                  >
                    {integration.enabled ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* New Integration Modal */}
      <Dialog open={showNewIntegrationModal} onOpenChange={setShowNewIntegrationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Integration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Integration Name</Label>
              <Input 
                id="name" 
                value={newIntegration.name} 
                onChange={e => setNewIntegration({...newIntegration, name: e.target.value})}
                placeholder="E.g. Salesforce CRM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description"
                value={newIntegration.description}
                onChange={e => setNewIntegration({...newIntegration, description: e.target.value})}
                placeholder="What this integration does"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Integration Type</Label>
              <Select 
                value={newIntegration.type} 
                onValueChange={value => setNewIntegration({...newIntegration, type: value as IntegrationType})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input 
                id="provider"
                value={newIntegration.provider}
                onChange={e => setNewIntegration({...newIntegration, provider: e.target.value})}
                placeholder="E.g. Salesforce"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authType">Auth Type</Label>
              <Select 
                value={newIntegration.authType} 
                onValueChange={value => setNewIntegration({...newIntegration, authType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="API Key">API Key</SelectItem>
                  <SelectItem value="OAuth">OAuth</SelectItem>
                  <SelectItem value="Basic Auth">Basic Auth</SelectItem>
                  <SelectItem value="Token">Token</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewIntegrationModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateIntegration}>
              Create Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Integrations;
