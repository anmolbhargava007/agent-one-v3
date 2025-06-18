
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export interface GuardrailData {
  guardrail_id?: number;
  guardrail_name: string;
  descriptions: string;
  guardrail_type: string;
  rules?: any[];
  is_active: boolean;
}

export const useGuardrails = () => {
  const queryClient = useQueryClient();

  const { data: guardrails = [], isLoading, error } = useQuery({
    queryKey: ['guardrails'],
    queryFn: async () => {
      const response = await apiClient.getGuardrails();
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.msg || 'Failed to fetch guardrails');
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: GuardrailData) => {
      const response = await apiClient.createGuardrail(data);
      if (!response.success) {
        throw new Error(response.msg || 'Failed to create guardrail');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardrails'] });
      toast({
        title: "Success",
        description: "Guardrail created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create guardrail",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: GuardrailData) => {
      const response = await apiClient.updateGuardrail(data);
      if (!response.success) {
        throw new Error(response.msg || 'Failed to update guardrail');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardrails'] });
      toast({
        title: "Success",
        description: "Guardrail updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update guardrail",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ guardrail_id, is_active }: { guardrail_id: number; is_active: boolean }) => {
      const response = await apiClient.toggleGuardrailStatus({ guardrail_id, is_active });
      if (!response.success) {
        throw new Error(response.msg || 'Failed to toggle guardrail status');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardrails'] });
      toast({
        title: "Success",
        description: "Guardrail status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update guardrail status",
        variant: "destructive",
      });
    },
  });

  const checkDuplicateMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiClient.checkGuardrailDuplicate(name);
      return response;
    },
  });

  return {
    guardrails,
    isLoading,
    error,
    createGuardrail: createMutation.mutate,
    updateGuardrail: updateMutation.mutate,
    toggleStatus: toggleStatusMutation.mutate,
    checkDuplicate: checkDuplicateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
  };
};
