
import { useState } from "react";
import { Plus, ShieldCheck, ShieldAlert, Shield, Info, Edit, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { mockGuardrails } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Guardrail, GuardrailRule, GuardrailType } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const typeInfo = {
  content: {
    label: "Content",
    icon: Shield,
    style: "bg-purple-100 text-purple-800"
  },
  security: {
    label: "Security",
    icon: ShieldCheck,
    style: "bg-green-100 text-green-800"
  },
  compliance: {
    label: "Compliance",
    icon: ShieldAlert,
    style: "bg-blue-100 text-blue-800"
  },
  ethics: {
    label: "Ethics",
    icon: AlertCircle,
    style: "bg-orange-100 text-orange-800"
  },
  performance: {
    label: "Performance",
    icon: Info,
    style: "bg-yellow-100 text-yellow-800"
  },
};

const Guardrails = () => {
  const [guardrails, setGuardrails] = useState<Guardrail[]>(mockGuardrails);
  const [isNewGuardrailModalOpen, setIsNewGuardrailModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedGuardrail, setSelectedGuardrail] = useState<Guardrail | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<GuardrailRule | null>(null);
  
  const [newGuardrail, setNewGuardrail] = useState<{
    name: string;
    description: string;
    type: GuardrailType;
  }>({
    name: "",
    description: "",
    type: "content",
  });

  const [newRule, setNewRule] = useState<{
    name: string;
    description: string;
    condition: string;
    action: string;
  }>({
    name: "",
    description: "",
    condition: "",
    action: "",
  });
  
  const { toast } = useToast();

  const handleNewGuardrail = () => {
    setIsEditMode(false);
    setNewGuardrail({
      name: "",
      description: "",
      type: "content",
    });
    setIsNewGuardrailModalOpen(true);
  };

  const handleEditGuardrail = (guardrail: Guardrail) => {
    setIsEditMode(true);
    setNewGuardrail({
      name: guardrail.name,
      description: guardrail.description,
      type: guardrail.type,
    });
    setSelectedGuardrail(guardrail);
    setIsNewGuardrailModalOpen(true);
  };

  const handleDeleteGuardrail = (guardrail: Guardrail) => {
    setSelectedGuardrail(guardrail);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteGuardrail = () => {
    if (selectedGuardrail) {
      const updatedGuardrails = guardrails.filter(g => g.id !== selectedGuardrail.id);
      setGuardrails(updatedGuardrails);
      
      toast({
        title: "Guardrail Deleted",
        description: `${selectedGuardrail.name} has been removed.`,
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedGuardrail(null);
    }
  };

  const toggleGuardrail = (id: string) => {
    setGuardrails(guardrails.map(guardrail => 
      guardrail.id === id 
        ? { ...guardrail, enabled: !guardrail.enabled }
        : guardrail
    ));

    toast({
      title: "Guardrail Updated",
      description: "The guardrail settings have been updated.",
    });
  };

  const saveGuardrail = () => {
    if (!newGuardrail.name || !newGuardrail.description) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and description for the guardrail.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode && selectedGuardrail) {
      // Update existing guardrail
      setGuardrails(guardrails.map(guardrail => 
        guardrail.id === selectedGuardrail.id 
          ? { 
              ...guardrail, 
              name: newGuardrail.name,
              description: newGuardrail.description,
              type: newGuardrail.type
            }
          : guardrail
      ));
      
      toast({
        title: "Guardrail Updated",
        description: `${newGuardrail.name} has been updated successfully.`,
      });
    } else {
      // Create new guardrail
      const newGuardrailObj: Guardrail = {
        id: `guardrail-${Math.random().toString(36).substring(2, 10)}`,
        name: newGuardrail.name,
        description: newGuardrail.description,
        type: newGuardrail.type,
        enabled: true,
        rules: []
      };

      setGuardrails([...guardrails, newGuardrailObj]);
      
      toast({
        title: "Guardrail Created",
        description: `${newGuardrail.name} has been added successfully.`,
      });
    }

    setIsNewGuardrailModalOpen(false);
  };

  const openAddRuleModal = (guardrail: Guardrail) => {
    setSelectedGuardrail(guardrail);
    setIsEditMode(false);
    setNewRule({
      name: "",
      description: "",
      condition: "",
      action: "",
    });
    setIsRuleModalOpen(true);
  };

  const openEditRuleModal = (guardrail: Guardrail, rule: GuardrailRule) => {
    setSelectedGuardrail(guardrail);
    setSelectedRule(rule);
    setIsEditMode(true);
    setNewRule({
      name: rule.name,
      description: rule.description,
      condition: rule.condition,
      action: rule.action,
    });
    setIsRuleModalOpen(true);
  };

  const deleteRule = (guardrailId: string, ruleId: string) => {
    const updatedGuardrails = guardrails.map(guardrail => {
      if (guardrail.id === guardrailId) {
        return {
          ...guardrail,
          rules: guardrail.rules.filter(rule => rule.id !== ruleId)
        };
      }
      return guardrail;
    });
    
    setGuardrails(updatedGuardrails);
    
    toast({
      title: "Rule Deleted",
      description: "The rule has been removed.",
    });
  };

  const saveRule = () => {
    if (!newRule.name || !newRule.condition || !newRule.action) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedGuardrail) return;

    if (isEditMode && selectedRule) {
      // Update existing rule
      const updatedGuardrails = guardrails.map(guardrail => {
        if (guardrail.id === selectedGuardrail.id) {
          return {
            ...guardrail,
            rules: guardrail.rules.map(rule => 
              rule.id === selectedRule.id 
                ? { 
                    ...rule,
                    name: newRule.name,
                    description: newRule.description,
                    condition: newRule.condition,
                    action: newRule.action
                  }
                : rule
            )
          };
        }
        return guardrail;
      });
      
      setGuardrails(updatedGuardrails);
      
      toast({
        title: "Rule Updated",
        description: `${newRule.name} has been updated successfully.`,
      });
    } else {
      // Create new rule
      const newRuleObj: GuardrailRule = {
        id: `rule-${Math.random().toString(36).substring(2, 10)}`,
        name: newRule.name,
        description: newRule.description,
        condition: newRule.condition,
        action: newRule.action,
        enabled: true
      };

      const updatedGuardrails = guardrails.map(guardrail => {
        if (guardrail.id === selectedGuardrail.id) {
          return {
            ...guardrail,
            rules: [...guardrail.rules, newRuleObj]
          };
        }
        return guardrail;
      });
      
      setGuardrails(updatedGuardrails);
      
      toast({
        title: "Rule Added",
        description: `${newRule.name} has been added to ${selectedGuardrail.name}.`,
      });
    }

    setIsRuleModalOpen(false);
  };

  const toggleRule = (guardrailId: string, ruleId: string) => {
    const updatedGuardrails = guardrails.map(guardrail => {
      if (guardrail.id === guardrailId) {
        return {
          ...guardrail,
          rules: guardrail.rules.map(rule => 
            rule.id === ruleId 
              ? { ...rule, enabled: !rule.enabled }
              : rule
          )
        };
      }
      return guardrail;
    });
    
    setGuardrails(updatedGuardrails);
    
    toast({
      title: "Rule Updated",
      description: "The rule has been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guardrails</h2>
          <p className="text-muted-foreground">
            Manage security, content, compliance, and ethical controls.
          </p>
        </div>
        <Button onClick={handleNewGuardrail}>
          <Plus className="mr-2 h-4 w-4" /> Add Guardrail
        </Button>
      </div>
      
      {guardrails.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/30">
          <Shield className="h-12 w-12 text-muted mb-4" />
          <h3 className="text-lg font-medium mb-2">No guardrails configured</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Guardrails protect your AI agents from generating harmful content and ensure compliance with regulations.
          </p>
          <Button onClick={handleNewGuardrail}>
            <Plus className="mr-2 h-4 w-4" /> Create Your First Guardrail
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guardrails.map((guardrail) => {
            const type = typeInfo[guardrail.type] || typeInfo.content;
            const GuardrailIcon = type.icon;
            return (
              <Card key={guardrail.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GuardrailIcon className="mr-2 h-5 w-5" />
                      {guardrail.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditGuardrail(guardrail)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => handleDeleteGuardrail(guardrail)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={guardrail.enabled}
                        onCheckedChange={() => toggleGuardrail(guardrail.id)}
                      />
                    </div>
                  </div>
                  <CardDescription>{guardrail.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${type.style}`}>
                      {type.label}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted`}>
                      {guardrail.rules.length} rules
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${guardrail.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {guardrail.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <Tabs defaultValue="rules">
                      <TabsList className="w-full">
                        <TabsTrigger value="rules" className="flex-1">Rules</TabsTrigger>
                        <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
                      </TabsList>
                      <TabsContent value="rules" className="mt-2">
                        {guardrail.rules.length === 0 ? (
                          <div className="text-center py-6 px-2">
                            <p className="text-sm text-muted-foreground mb-4">No rules defined yet</p>
                            <Button size="sm" onClick={() => openAddRuleModal(guardrail)}>
                              <Plus className="mr-1 h-3 w-3" /> Add First Rule
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-40 overflow-auto pr-1">
                            {guardrail.rules.map(rule => (
                              <div key={rule.id} className="text-xs border rounded-md p-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium">{rule.name}</span>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => openEditRuleModal(guardrail, rule)}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-500" onClick={() => deleteRule(guardrail.id, rule.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                    <Switch
                                      checked={rule.enabled}
                                      onCheckedChange={() => toggleRule(guardrail.id, rule.id)}
                                      className="scale-75 -mr-1"
                                    />
                                  </div>
                                </div>
                                <p className="text-muted-foreground">{rule.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => openAddRuleModal(guardrail)}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add Rule
                        </Button>
                      </TabsContent>
                      <TabsContent value="info" className="mt-2 space-y-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium ml-1 capitalize">{guardrail.type}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Active Rules:</span>
                          <span className="font-medium ml-1">{guardrail.rules.filter(r => r.enabled).length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <span className={`font-medium ml-1 ${guardrail.enabled ? "text-green-600" : "text-red-600"}`}>
                            {guardrail.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Guardrail Modal */}
      <Dialog open={isNewGuardrailModalOpen} onOpenChange={setIsNewGuardrailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Guardrail" : "Add New Guardrail"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Modify your guardrail settings" 
                : "Create a new guardrail to ensure safety and compliance"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Guardrail Name</Label>
              <Input 
                id="name" 
                value={newGuardrail.name} 
                onChange={e => setNewGuardrail({...newGuardrail, name: e.target.value})}
                placeholder="E.g. PII Filter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={newGuardrail.description}
                onChange={e => setNewGuardrail({...newGuardrail, description: e.target.value})}
                placeholder="What this guardrail does"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Guardrail Type</Label>
              <Select 
                value={newGuardrail.type} 
                onValueChange={value => setNewGuardrail({...newGuardrail, type: value as GuardrailType})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="ethics">Ethics</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewGuardrailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveGuardrail}>
              {isEditMode ? "Update Guardrail" : "Create Guardrail"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rule Modal */}
      <Dialog open={isRuleModalOpen} onOpenChange={setIsRuleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Rule" : "Add New Rule"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Modify your rule settings" 
                : `Add a new rule to ${selectedGuardrail?.name || "guardrail"}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input 
                id="rule-name" 
                value={newRule.name} 
                onChange={e => setNewRule({...newRule, name: e.target.value})}
                placeholder="E.g. Block PII"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-description">Description</Label>
              <Input 
                id="rule-description"
                value={newRule.description}
                onChange={e => setNewRule({...newRule, description: e.target.value})}
                placeholder="What this rule does"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Textarea 
                id="condition"
                value={newRule.condition}
                onChange={e => setNewRule({...newRule, condition: e.target.value})}
                placeholder="When this condition is met..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Textarea 
                id="action"
                value={newRule.action}
                onChange={e => setNewRule({...newRule, action: e.target.value})}
                placeholder="Take this action..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRuleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRule}>
              {isEditMode ? "Update Rule" : "Add Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Guardrail Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Guardrail?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the guardrail
              "{selectedGuardrail?.name}" and all its rules.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGuardrail} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Guardrails;
