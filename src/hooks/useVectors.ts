
import { useState, useEffect } from 'react';
import { apiClient, CreateVectorRequest, UpdateVectorRequest } from '@/services/api';
import { VectorDB } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useVectors = () => {
  const [vectors, setVectors] = useState<VectorDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchVectors = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getVectors({ is_active: true });
      
      if (response.success && response.data) {
        // Transform API data to match our VectorDB interface
        const transformedVectors: VectorDB[] = response.data.map((apiVector: any) => ({
          id: apiVector.aivector_id?.toString() || apiVector.id,
          name: apiVector.aivector_name || apiVector.name,
          provider: apiVector.provider_name || apiVector.provider,
          description: apiVector.descriptions || apiVector.description,
          features: Array.isArray(apiVector.features) ? apiVector.features : [],
          scalability: apiVector.scalability || 'medium',
          version: apiVector.version || '1.0',
        }));
        
        setVectors(transformedVectors);
      }
    } catch (error) {
      console.error('Error fetching vectors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vector databases. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createVector = async (vectorData: Partial<VectorDB>) => {
    try {
      const createData: CreateVectorRequest = {
        aivector_name: vectorData.name || '',
        descriptions: vectorData.description || '',
        provider_name: vectorData.provider || '',
        version: vectorData.version || '1.0',
        scalability: vectorData.scalability || 'medium',
        features: vectorData.features || [],
        is_active: true,
      };

      const response = await apiClient.createVector(createData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.msg || "Vector database created successfully.",
        });
        await fetchVectors(); // Refresh the list
        return true;
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to create vector database.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error creating vector:', error);
      toast({
        title: "Error",
        description: "Failed to create vector database. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateVector = async (vectorId: string, vectorData: Partial<VectorDB>) => {
    try {
      const updateData: UpdateVectorRequest = {
        aivector_id: parseInt(vectorId),
        aivector_name: vectorData.name || '',
        descriptions: vectorData.description || '',
        provider_name: vectorData.provider || '',
        version: vectorData.version || '1.0',
        scalability: vectorData.scalability || 'medium',
        features: vectorData.features || [],
        is_active: true,
      };

      const response = await apiClient.updateVector(updateData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.msg || "Vector database updated successfully.",
        });
        await fetchVectors(); // Refresh the list
        return true;
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to update vector database.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating vector:', error);
      toast({
        title: "Error",
        description: "Failed to update vector database. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteVector = async (vectorId: string) => {
    try {
      const response = await apiClient.toggleVectorStatus({
        aivector_id: parseInt(vectorId),
        is_active: false,
      });
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.msg || "Vector database deleted successfully.",
        });
        await fetchVectors(); // Refresh the list
        return true;
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to delete vector database.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting vector:', error);
      toast({
        title: "Error",
        description: "Failed to delete vector database. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchVectors();
  }, []);

  return {
    vectors,
    isLoading,
    createVector,
    updateVector,
    deleteVector,
    refetch: fetchVectors,
  };
};
