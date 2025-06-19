
import { useState } from "react";
import { Plus, Plug, Database, Link, Mail, Slack, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIntegrations, IntegrationData } from "@/hooks/useIntegrations";

// Map integration type to icon
const typeIcon = {
  data: Database,
  api: Link,
  tool: Plug,
  service: Mail,
};

const Integrations = () => {
  const [showNewIntegrationModal, setShowNewIntegrationModal] = useState(false);
  const [newIntegration, setNewIntegration] = useState<IntegrationData>({
    integrator_name: "",
    descriptions: "",
    integration_type: "data",
    provider_name: "",
    auth_type: "API Key",
    is_active: true
  });
  const { toast } = useToast();

  // Use real API data
  const { integrations, isLoading, createIntegration, isCreating, updateIntegration, isUpdating } = useIntegrations();

  const handleNewIntegration = () => {
    setShowNewIntegrationModal(true);
  };

  const handleToggle = async (integration: any) => {
    const updatedIntegration = {
      ...integration,
      is_active: !integration.is_active
    };
    updateIntegration(updatedIntegration);
  };

  const handleCreateIntegration = async () => {
    if (!newIntegration.integrator_name || !newIntegration.integration_type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    createIntegration(newIntegration);
    
    setNewIntegration({
      integrator_name: "",
      descriptions: "",
      integration_type: "data",
      provider_name: "",
      auth_type: "API Key",
      is_active: true
    });
    setShowNewIntegrationModal(false);
  };

  if (isLoading) {
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
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Plug className="h-8 w-8 text-muted-foreground animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading integrations...</p>
          </div>
        </div>
      </div>
    );
  }

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
      
      {integrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/30">
          <Plug className="h-12 w-12 text-muted mb-4" />
          <h3 className="text-lg font-medium mb-2">No integrations configured</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Connect to external services and APIs to extend your agent capabilities.
          </p>
          <Button onClick={handleNewIntegration}>
            <Plus className="mr-2 h-4 w-4" /> Create Your First Integration
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const Icon = typeIcon[integration.integration_type as keyof typeof typeIcon] || Plug;
            return (
              <Card key={integration.integrator_id} className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-accent" />
                    <CardTitle>{integration.integrator_name}</CardTitle>
                  </div>
                  <CardDescription>{integration.descriptions}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="capitalize">{integration.integration_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider</span>
                      <span>{integration.provider_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Auth Type</span>
                      <span>{integration.auth_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={integration.is_active ? "text-green-500" : "text-red-500"}>
                        {integration.is_active ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                    <Button 
                      className={`w-full mt-4 ${integration.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      onClick={() => handleToggle(integration)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : (integration.is_active ? "Disconnect" : "Connect")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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
                value={newIntegration.integrator_name} 
                onChange={e => setNewIntegration({...newIntegration, integrator_name: e.target.value})}
                placeholder="E.g. Salesforce CRM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description"
                value={newIntegration.descriptions}
                onChange={e => setNewIntegration({...newIntegration, descriptions: e.target.value})}
                placeholder="What this integration does"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Integration Type</Label>
              <Select 
                value={newIntegration.integration_type} 
                onValueChange={value => setNewIntegration({...newIntegration, integration_type: value})}
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
                value={newIntegration.provider_name}
                onChange={e => setNewIntegration({...newIntegration, provider_name: e.target.value})}
                placeholder="E.g. Salesforce"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authType">Auth Type</Label>
              <Select 
                value={newIntegration.auth_type} 
                onValueChange={value => setNewIntegration({...newIntegration, auth_type: value})}
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
            <Button onClick={handleCreateIntegration} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Integration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Integrations;
