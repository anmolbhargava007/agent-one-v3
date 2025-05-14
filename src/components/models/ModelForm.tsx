
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModelSize, ModelType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModelFormProps {
  onSave: (model: any) => void;
  onCancel: () => void;
  initialData?: any;
  isEdit?: boolean;
}

const ModelForm = ({ onSave, onCancel, initialData, isEdit = false }: ModelFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    provider: initialData?.provider || "",
    type: initialData?.type || "language" as ModelType,
    size: initialData?.size || "medium" as ModelSize,
    parameters: initialData?.parameters || 7000000000,
    contextWindow: initialData?.contextWindow || 8192,
    capabilities: initialData?.capabilities || [] as string[],
  });
  const [capability, setCapability] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value as ModelType });
  };

  const handleSizeChange = (value: string) => {
    setFormData({ ...formData, size: value as ModelSize });
  };

  const handleParametersChange = (value: number[]) => {
    setFormData({ ...formData, parameters: value[0] });
  };

  const handleContextWindowChange = (value: number[]) => {
    setFormData({ ...formData, contextWindow: value[0] });
  };

  const addCapability = () => {
    if (!capability) return;
    if (!formData.capabilities.includes(capability)) {
      setFormData({
        ...formData,
        capabilities: [...formData.capabilities, capability],
      });
    }
    setCapability("");
  };

  const removeCapability = (cap: string) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.filter(c => c !== cap),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.provider) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      
      toast({
        title: isEdit ? "Model Updated" : "Model Added",
        description: `${formData.name} has been ${isEdit ? "updated" : "added"} successfully.`,
      });
    }, 1000);
  };

  // Format parameter count for display
  const formatParams = (params: number) => {
    if (params >= 1_000_000_000) {
      return `${(params / 1_000_000_000).toFixed(1)}B`;
    }
    return `${(params / 1_000_000).toFixed(0)}M`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Model Name*</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. GPT-4 Turbo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Model capabilities and use cases"
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="provider">Provider*</Label>
        <Input
          id="provider"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          placeholder="e.g. OpenAI"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Model Type</Label>
          <Select value={formData.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="language">Language</SelectItem>
              <SelectItem value="vision">Vision</SelectItem>
              <SelectItem value="multi-modal">Multi-modal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="size">Model Size</Label>
          <Select value={formData.size} onValueChange={handleSizeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Parameters</Label>
          <span className="text-sm font-medium">{formatParams(formData.parameters)}</span>
        </div>
        <Slider
          defaultValue={[formData.parameters]}
          max={70000000000}
          min={1000000}
          step={1000000}
          onValueChange={handleParametersChange}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Context Window (tokens)</Label>
          <span className="text-sm font-medium">{formData.contextWindow.toLocaleString()}</span>
        </div>
        <Slider
          defaultValue={[formData.contextWindow]}
          max={128000}
          min={1024}
          step={1024}
          onValueChange={handleContextWindowChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Capabilities</Label>
        <div className="flex gap-2">
          <Input
            value={capability}
            onChange={(e) => setCapability(e.target.value)}
            placeholder="e.g. text-generation"
          />
          <Button type="button" onClick={addCapability} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.capabilities.length === 0 && (
            <p className="text-sm text-muted-foreground">No capabilities added</p>
          )}
          {formData.capabilities.map((cap, idx) => (
            <Badge 
              key={idx} 
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {cap}
              <button 
                type="button" 
                onClick={() => removeCapability(cap)}
                className="ml-1 hover:bg-muted rounded-full h-4 w-4 inline-flex items-center justify-center"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              {isEdit ? "Update Model" : "Add Model"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ModelForm;
