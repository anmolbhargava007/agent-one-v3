
import { useState, useEffect } from 'react';
import { apiClient, CreateModelRequest, UpdateModelRequest } from '@/services/api';
import { Model } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useModels = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getModels({ is_active: true });
      
      if (response.success && response.data) {
        // Transform API data to match our Model interface
        const transformedModels: Model[] = response.data.map((apiModel: any) => ({
          id: apiModel.aimodel_id?.toString() || apiModel.id,
          name: apiModel.aimodel_name || apiModel.name,
          provider: apiModel.provider_name || apiModel.provider,
          type: apiModel.model_type || 'language',
          size: apiModel.model_size || 'medium',
          description: apiModel.descriptions || apiModel.description,
          parameters: parseInt(apiModel.parameters) || 0,
          capabilities: Array.isArray(apiModel.capabilities) ? apiModel.capabilities : [],
          contextWindow: apiModel.context_token || 0,
        }));
        
        setModels(transformedModels);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      toast({
        title: "Error",
        description: "Failed to fetch models. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createModel = async (modelData: Partial<Model>) => {
    try {
      const createData: CreateModelRequest = {
        aimodel_name: modelData.name || '',
        descriptions: modelData.description || '',
        provider_name: modelData.provider || '',
        model_type: modelData.type || 'language',
        model_size: modelData.size || 'medium',
        parameters: modelData.parameters?.toString() || '0',
        context_token: modelData.contextWindow || 0,
        capabilities: modelData.capabilities || [],
        is_active: true,
      };

      const response = await apiClient.createModel(createData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.msg || "Model created successfully.",
        });
        await fetchModels(); // Refresh the list
        return true;
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to create model.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error creating model:', error);
      toast({
        title: "Error",
        description: "Failed to create model. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateModel = async (modelId: string, modelData: Partial<Model>) => {
    try {
      const updateData: UpdateModelRequest = {
        aimodel_id: parseInt(modelId),
        aimodel_name: modelData.name || '',
        descriptions: modelData.description || '',
        provider_name: modelData.provider || '',
        model_type: modelData.type || 'language',
        model_size: modelData.size || 'medium',
        parameters: modelData.parameters?.toString() || '0',
        context_token: modelData.contextWindow || 0,
        capabilities: modelData.capabilities || [],
        is_active: true,
      };

      const response = await apiClient.updateModel(updateData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.msg || "Model updated successfully.",
        });
        await fetchModels(); // Refresh the list
        return true;
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to update model.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating model:', error);
      toast({
        title: "Error",
        description: "Failed to update model. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteModel = async (modelId: string) => {
    try {
      const response = await apiClient.toggleModelStatus({
        aimodel_id: parseInt(modelId),
        is_active: false,
      });
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.msg || "Model deleted successfully.",
        });
        await fetchModels(); // Refresh the list
        return true;
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to delete model.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      toast({
        title: "Error",
        description: "Failed to delete model. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return {
    models,
    isLoading,
    createModel,
    updateModel,
    deleteModel,
    refetch: fetchModels,
  };
};
