
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, UserForManagement, User, AuthResponse } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export const useUserProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.getUsers(),
  });

  const updateUserMutation = useMutation({
    mutationFn: (userData: UserForManagement | User) => apiClient.updateUser(userData),
    onSuccess: (response: AuthResponse) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to update profile",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  return {
    users: users?.data || [],
    isLoading,
    error,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
  };
};
