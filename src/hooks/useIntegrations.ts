
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export interface IntegrationData {
  integrator_id?: number;
  integrator_name: string;
  descriptions: string;
  integration_type: string;
  provider_name: string;
  auth_type: string;
  is_active: boolean;
}

export const useIntegrations = () => {
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading, error } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const response = await apiClient.getIntegrators();
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.msg || 'Failed to fetch integrations');
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: IntegrationData) => {
      const response = await apiClient.createIntegrator(data);
      if (!response.success) {
        throw new Error(response.msg || 'Failed to create integration');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Success",
        description: "Integration created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create integration",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: IntegrationData) => {
      const response = await apiClient.updateIntegrator(data);
      if (!response.success) {
        throw new Error(response.msg || 'Failed to update integration');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Success",
        description: "Integration updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update integration",
        variant: "destructive",
      });
    },
  });

  return {
    integrations,
    isLoading,
    error,
    createIntegration: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateIntegration: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
