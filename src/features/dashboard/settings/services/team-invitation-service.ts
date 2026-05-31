import { api } from "@/shared/configs/api";

export interface TeamInvitationSent {
  id: number;
  invitee_email: string;
  role: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface TeamInvitationReceived {
  id: number;
  inviter_name: string | null;
  inviter_email: string | null;
  inviter_slug: string | null;
  role: string;
  status: "pending";
  created_at: string;
}

export interface TeamMemberReal {
  id: number;
  name: string;
  email: string;
  user_type: string | null;
  status: "active";
}

export interface TeamMembersResponse {
  success: boolean;
  data: {
    members: TeamMemberReal[];
    invitations: TeamInvitationSent[];
  };
}

export async function sendTeamInvitation(email: string, role: string) {
  return api.post("team/invitations", { json: { email, role } }).json<{ success: boolean }>();
}

export async function getReceivedInvitations() {
  return api.get("team/invitations/received").json<{ success: boolean; data: TeamInvitationReceived[] }>();
}

export async function acceptInvitation(id: number) {
  return api.post(`team/invitations/${id}/accept`).json<{ success: boolean }>();
}

export async function rejectInvitation(id: number) {
  return api.post(`team/invitations/${id}/reject`).json<{ success: boolean }>();
}

export async function getTeamMembers() {
  return api.get("team/members").json<TeamMembersResponse>();
}

export async function removeTeamMember(memberUserId: number) {
  return api.delete("team/members", { json: { member_user_id: memberUserId } }).json<{ success: boolean }>();
}
