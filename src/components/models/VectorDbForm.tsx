
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VectorDbFormProps {
  onSave: (db: any) => void;
  onCancel: () => void;
  initialData?: any;
  isEdit?: boolean;
}

const VectorDbForm = ({ onSave, onCancel, initialData, isEdit = false }: VectorDbFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    provider: initialData?.provider || "",
    version: initialData?.version || "1.0",
    scalability: initialData?.scalability || "medium",
    features: initialData?.features || [] as string[],
  });
  const [feature, setFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScalabilityChange = (value: string) => {
    setFormData({ ...formData, scalability: value });
  };

  const addFeature = () => {
    if (!feature) return;
    if (!formData.features.includes(feature)) {
      setFormData({
        ...formData,
        features: [...formData.features, feature],
      });
    }
    setFeature("");
  };

  const removeFeature = (feat: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feat),
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
        title: isEdit ? "Vector DB Updated" : "Vector DB Added",
        description: `${formData.name} has been ${isEdit ? "updated" : "added"} successfully.`,
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Database Name*</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Pinecone"
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
          placeholder="Database capabilities and use cases"
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
          placeholder="e.g. Pinecone, Inc."
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            name="version"
            value={formData.version}
            onChange={handleChange}
            placeholder="e.g. 1.0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scalability">Scalability</Label>
          <Select value={formData.scalability} onValueChange={handleScalabilityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select scalability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex gap-2">
          <Input
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            placeholder="e.g. hybrid-search"
          />
          <Button type="button" onClick={addFeature} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.features.length === 0 && (
            <p className="text-sm text-muted-foreground">No features added</p>
          )}
          {formData.features.map((feat, idx) => (
            <Badge 
              key={idx} 
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {feat}
              <button 
                type="button" 
                onClick={() => removeFeature(feat)}
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
              {isEdit ? "Update Database" : "Add Database"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default VectorDbForm;
