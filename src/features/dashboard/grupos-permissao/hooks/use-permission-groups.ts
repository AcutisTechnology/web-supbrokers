"use client";

import { api } from "@/shared/configs/api";
import {
  IPermissionGroup,
  IPermissionGroupFormData,
  IPermissionGroupListResponse,
  IPermissionModule,
} from "@/types/permission-group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = "permission-groups";

async function fetchGroups(params?: {
  search?: string;
  active?: boolean;
  page?: number;
  per_page?: number;
}): Promise<IPermissionGroupListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.active !== undefined)
    searchParams.set("active", String(params.active));
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));

  const qs = searchParams.toString();
  return api.get(`permission-groups${qs ? `?${qs}` : ""}`).json();
}

async function fetchGroup(id: number): Promise<{ success: boolean; data: IPermissionGroup }> {
  return api.get(`permission-groups/${id}`).json();
}

async function fetchAvailablePermissions(): Promise<{
  success: boolean;
  data: IPermissionModule[];
}> {
  return api.get("permission-groups/available-permissions").json();
}

async function createGroup(data: IPermissionGroupFormData): Promise<{ success: boolean; data: IPermissionGroup }> {
  return api.post("permission-groups", { json: data }).json();
}

async function updateGroup(
  id: number,
  data: Partial<IPermissionGroupFormData>
): Promise<{ success: boolean; data: IPermissionGroup }> {
  return api.put(`permission-groups/${id}`, { json: data }).json();
}

async function deleteGroup(id: number): Promise<{ success: boolean; message: string }> {
  return api.delete(`permission-groups/${id}`).json();
}

async function toggleGroupActive(id: number): Promise<{ success: boolean; data: IPermissionGroup }> {
  return api.patch(`permission-groups/${id}/toggle-active`).json();
}

async function assignGroupToUser(data: {
  user_id: number;
  permission_group_id: number | null;
}): Promise<{ success: boolean; message: string; permissions: string[] }> {
  return api.post("permission-groups/assign-user", { json: data }).json();
}

// ─── Queries ───────────────────────────────────────────────────────────────

export function usePermissionGroups(params?: {
  search?: string;
  active?: boolean;
  page?: number;
  per_page?: number;
}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => fetchGroups(params),
  });
}

export function usePermissionGroup(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => fetchGroup(id),
    enabled: !!id,
  });
}

export function useAvailablePermissions() {
  return useQuery({
    queryKey: ["available-permissions"],
    queryFn: fetchAvailablePermissions,
    staleTime: Infinity,
  });
}

// ─── Mutations ─────────────────────────────────────────────────────────────

export function useCreatePermissionGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useUpdatePermissionGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IPermissionGroupFormData> }) =>
      updateGroup(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useDeletePermissionGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useTogglePermissionGroupActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleGroupActive,
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useAssignGroupToUser() {
  return useMutation({ mutationFn: assignGroupToUser });
}
