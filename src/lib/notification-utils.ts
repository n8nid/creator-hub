import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  NotificationInsert,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES,
  RELATED_TYPES,
} from "./supabase";

// Utility function untuk create notification
export async function createNotification(
  notificationData: Omit<NotificationInsert, "id" | "created_at" | "updated_at">
) {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      ...notificationData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    throw error;
  }

  return data;
}

// Notification creators untuk setiap jenis notifikasi
export const notificationCreators = {
  // Creator Application Pending
  creatorApplicationPending: async (userId: string, userEmail: string) => {
    return createNotification({
      user_id: userId,
      type: NOTIFICATION_TYPES.CREATOR_APPLICATION_PENDING,
      title: "Pengajuan Creator Baru",
      message: `User ${userEmail} mengajukan menjadi creator`,
      related_id: userId,
      related_type: RELATED_TYPES.USER,
      priority: NOTIFICATION_PRIORITIES.HIGH,
      read: false,
    });
  },

  // Creator Application Approved
  creatorApplicationApproved: async (
    userId: string,
    userEmail: string,
    applicationId: string
  ) => {
    return createNotification({
      user_id: userId,
      type: NOTIFICATION_TYPES.CREATOR_APPLICATION_APPROVED,
      title: "Pengajuan Creator Disetujui",
      message: `Pengajuan creator ${userEmail} telah disetujui`,
      related_id: applicationId,
      related_type: RELATED_TYPES.CREATOR_APPLICATION,
      priority: NOTIFICATION_PRIORITIES.MEDIUM,
      read: false,
    });
  },

  // Creator Application Rejected
  creatorApplicationRejected: async (
    userId: string,
    userEmail: string,
    applicationId: string,
    reason: string
  ) => {
    return createNotification({
      user_id: userId,
      type: NOTIFICATION_TYPES.CREATOR_APPLICATION_REJECTED,
      title: "Pengajuan Creator Ditolak",
      message: `Pengajuan creator ${userEmail} ditolak - ${reason}`,
      related_id: applicationId,
      related_type: RELATED_TYPES.CREATOR_APPLICATION,
      priority: NOTIFICATION_PRIORITIES.MEDIUM,
      read: false,
    });
  },

  // Workflow Submission Pending
  workflowSubmissionPending: async (
    userId: string,
    creatorName: string,
    workflowTitle: string,
    workflowId: string
  ) => {
    return createNotification({
      user_id: userId,
      type: NOTIFICATION_TYPES.WORKFLOW_SUBMISSION_PENDING,
      title: "Workflow Baru Menunggu Review",
      message: `Creator ${creatorName} mengirim workflow baru: ${workflowTitle}`,
      related_id: workflowId,
      related_type: RELATED_TYPES.WORKFLOW,
      priority: NOTIFICATION_PRIORITIES.HIGH,
      read: false,
    });
  },

  // Workflow Approved
  workflowApproved: async (
    userId: string,
    creatorName: string,
    workflowTitle: string,
    workflowId: string
  ) => {
    return createNotification({
      user_id: userId,
      type: NOTIFICATION_TYPES.WORKFLOW_APPROVED,
      title: "Workflow Disetujui",
      message: `Workflow "${workflowTitle}" oleh ${creatorName} telah disetujui`,
      related_id: workflowId,
      related_type: RELATED_TYPES.WORKFLOW,
      priority: NOTIFICATION_PRIORITIES.MEDIUM,
      read: false,
    });
  },

  // Workflow Rejected
  workflowRejected: async (
    userId: string,
    creatorName: string,
    workflowTitle: string,
    workflowId: string,
    reason: string
  ) => {
    return createNotification({
      user_id: userId,
      type: NOTIFICATION_TYPES.WORKFLOW_REJECTED,
      title: "Workflow Ditolak",
      message: `Workflow "${workflowTitle}" oleh ${creatorName} ditolak - ${reason}`,
      related_id: workflowId,
      related_type: RELATED_TYPES.WORKFLOW,
      priority: NOTIFICATION_PRIORITIES.MEDIUM,
      read: false,
    });
  },

  // New User Registration
  userRegistration: async (userId: string, userEmail: string) => {
    return createNotification({
      user_id: userId,
      type: NOTIFICATION_TYPES.USER_REGISTRATION,
      title: "User Baru Terdaftar",
      message: `User baru terdaftar: ${userEmail}`,
      related_id: userId,
      related_type: RELATED_TYPES.USER,
      priority: NOTIFICATION_PRIORITIES.MEDIUM,
      read: false,
    });
  },

  // Content Moderation
  contentModeration: async (
    userId: string,
    contentType: string,
    contentTitle: string,
    contentId: string,
    action: string
  ) => {
    return createNotification({
      user_id: userId,
      type: NOTIFICATION_TYPES.CONTENT_MODERATION,
      title: "Konten Dimoderasi",
      message: `Konten ${contentType} "${contentTitle}" telah ${action}`,
      related_id: contentId,
      related_type: RELATED_TYPES.CONTENT,
      priority: NOTIFICATION_PRIORITIES.LOW,
      read: false,
    });
  },
};

// Helper function untuk get admin user IDs
export async function getAdminUserIds(): Promise<string[]> {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase.from("admin_users").select("user_id");

  if (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }

  return data?.map((admin) => admin.user_id) || [];
}

// Helper function untuk create notifications untuk semua admin
export async function createNotificationForAllAdmins(
  notificationData: Omit<
    NotificationInsert,
    "id" | "created_at" | "updated_at" | "user_id"
  >
) {
  const adminUserIds = await getAdminUserIds();

  const notifications = await Promise.all(
    adminUserIds.map((adminId) =>
      createNotification({
        ...notificationData,
        user_id: adminId,
      })
    )
  );

  return notifications;
}
