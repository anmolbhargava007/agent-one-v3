
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockModels, mockVectorDBs, mockIntegrations } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { CircleCheck, Loader2 } from "lucide-react";

interface CreateAgentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (agent: any) => void;
}

export default function CreateAgentModal({ open, onClose, onCreated }: CreateAgentModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    model: "",
    vectorDb: "",
    integration: "",
  });
  const { toast } = useToast();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  
  const resetForm = () => {
    setForm({ name: "", description: "", model: "", vectorDb: "", integration: "" });
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    if (!form.name || !form.model || !form.vectorDb) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newAgent = {
      ...form,
      id: Math.random().toString(36).substring(2),
      status: "active",
      createdAt: new Date().toISOString(),
      model: {
        name: form.model,
        provider: form.model.includes("GPT") ? "OpenAI" : "Anthropic",
        size: form.model.includes("4") ? "large" : "medium",
      }
    };

    onCreated(newAgent);
    toast({
      title: "Agent Created",
      description: `Agent "${form.name}" was created successfully.`,
    });
    
    resetForm();
    setIsSubmitting(false);
    onClose();
  };

  const progressPercentage = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-1 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </DialogHeader>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Agent Name*</Label>
              <Input 
                id="name" 
                name="name" 
                value={form.name} 
                onChange={handleInput} 
                placeholder="E.g. Customer Support Bot" 
              />
            </div>
            <div>
              <Label htmlFor="description">Description*</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={form.description} 
                onChange={handleInput} 
                placeholder="What does this agent do? Describe its purpose and capabilities."
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleNext} disabled={!form.name || !form.description}>Next</Button>
            </DialogFooter>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Assign a Model*</Label>
              <Select value={form.model} onValueChange={v => handleSelect("model", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {mockModels.map(model => (
                    <SelectItem value={model.name} key={model.id}>{model.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Choose the AI model that powers this agent's capabilities
              </p>
            </div>
            <div>
              <Label>Select VectorDB*</Label>
              <Select value={form.vectorDb} onValueChange={v => handleSelect("vectorDb", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vector db" />
                </SelectTrigger>
                <SelectContent>
                  {mockVectorDBs.map(db => (
                    <SelectItem value={db.name} key={db.id}>{db.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Vector database for storing embeddings and knowledge
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
              <Button type="button" onClick={handleNext} disabled={!form.model || !form.vectorDb}>Next</Button>
            </DialogFooter>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Attach Integration (optional)</Label>
              <Select value={form.integration} onValueChange={v => handleSelect("integration", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select integration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {mockIntegrations.map(integ => (
                    <SelectItem value={integ.name} key={integ.id}>{integ.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Connect your agent to an existing integration
              </p>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Name:</div>
                <div className="font-medium">{form.name}</div>
                
                <div className="text-muted-foreground">Model:</div>
                <div className="font-medium">{form.model}</div>
                
                <div className="text-muted-foreground">Vector DB:</div>
                <div className="font-medium">{form.vectorDb}</div>
                
                <div className="text-muted-foreground">Integration:</div>
                <div className="font-medium">{form.integration || "None"}</div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleBack} disabled={isSubmitting}>Back</Button>
              <Button 
                type="submit" 
                onClick={handleCreate} 
                disabled={isSubmitting || !form.name || !form.model || !form.vectorDb}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CircleCheck className="mr-2 h-4 w-4" />
                    Create Agent
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
