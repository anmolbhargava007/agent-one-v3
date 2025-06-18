
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, CreateAgentRequest } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const useAgents = () => {
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await apiClient.getAgents();
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.msg || 'Failed to fetch agents');
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateAgentRequest) => {
      const response = await apiClient.createAgent(data);
      if (!response.success) {
        throw new Error(response.msg || 'Failed to create agent');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: "Success",
        description: "Agent created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create agent",
        variant: "destructive",
      });
    },
  });

  return {
    agents,
    isLoading,
    error,
    createAgent: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
};
