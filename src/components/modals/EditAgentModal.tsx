
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useModels } from "@/hooks/useModels";
import { useVectors } from "@/hooks/useVectors";
import { useGuardrails } from "@/hooks/useGuardrails";
import { useIntegrations } from "@/hooks/useIntegrations";

interface EditAgentModalProps {
  agent: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (agentData: any) => void;
  isLoading?: boolean;
}

export const EditAgentModal = ({ agent, isOpen, onClose, onSave, isLoading }: EditAgentModalProps) => {
  const [formData, setFormData] = useState({
    agent_id: 0,
    agent_name: "",
    descriptions: "",
    agents_status: "Active",
    aimodel_id: 0,
    aivector_id: 0,
    integrator_ids: [] as number[],
    guardrail_ids: [] as number[],
    is_active: true,
  });

  const { models } = useModels();
  const { vectors } = useVectors();
  const { guardrails } = useGuardrails();
  const { integrations } = useIntegrations();

  useEffect(() => {
    if (agent) {
      setFormData({
        agent_id: agent.agent_id || 0,
        agent_name: agent.agent_name || "",
        descriptions: agent.descriptions || "",
        agents_status: agent.agents_status || "Active",
        aimodel_id: agent.aimodel_id || 0,
        aivector_id: agent.aivector_id || 0,
        integrator_ids: agent.integrator_ids || [],
        guardrail_ids: agent.guardrail_ids || [],
        is_active: agent.is_active !== undefined ? agent.is_active : true,
      });
    }
  }, [agent]);

  const handleSave = () => {
    onSave(formData);
  };

  const handleIntegratorChange = (integratorId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      integrator_ids: checked 
        ? [...prev.integrator_ids, integratorId]
        : prev.integrator_ids.filter(id => id !== integratorId)
    }));
  };

  const handleGuardrailChange = (guardrailId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      guardrail_ids: checked 
        ? [...prev.guardrail_ids, guardrailId]
        : prev.guardrail_ids.filter(id => id !== guardrailId)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent_name">Agent Name</Label>
            <Input
              id="agent_name"
              value={formData.agent_name}
              onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
              placeholder="Enter agent name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descriptions">Description</Label>
            <Textarea
              id="descriptions"
              value={formData.descriptions}
              onChange={(e) => setFormData({ ...formData, descriptions: e.target.value })}
              placeholder="Describe what this agent does"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agents_status">Status</Label>
            <Select
              value={formData.agents_status}
              onValueChange={(value) => setFormData({ ...formData, agents_status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aimodel_id">AI Model</Label>
            <Select
              value={formData.aimodel_id.toString()}
              onValueChange={(value) => setFormData({ ...formData, aimodel_id: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aivector_id">Vector Database</Label>
            <Select
              value={formData.aivector_id.toString()}
              onValueChange={(value) => setFormData({ ...formData, aivector_id: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vector DB" />
              </SelectTrigger>
              <SelectContent>
                {vectors.map((vector) => (
                  <SelectItem key={vector.id} value={vector.id}>
                    {vector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Integrations</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
              {integrations.map((integration) => (
                <div key={integration.integrator_id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`integration-${integration.integrator_id}`}
                    checked={formData.integrator_ids.includes(integration.integrator_id || 0)}
                    onCheckedChange={(checked) => 
                      handleIntegratorChange(integration.integrator_id || 0, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`integration-${integration.integrator_id}`}
                    className="text-sm"
                  >
                    {integration.integrator_name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Guardrails</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
              {guardrails.map((guardrail) => (
                <div key={guardrail.guardrail_id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`guardrail-${guardrail.guardrail_id}`}
                    checked={formData.guardrail_ids.includes(guardrail.guardrail_id || 0)}
                    onCheckedChange={(checked) => 
                      handleGuardrailChange(guardrail.guardrail_id || 0, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`guardrail-${guardrail.guardrail_id}`}
                    className="text-sm"
                  >
                    {guardrail.guardrail_name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
            />
            <Label htmlFor="is_active">Active Agent</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
