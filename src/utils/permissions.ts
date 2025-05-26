// /src/utils/permissions.ts

export const groupPermissions: Record<string, Record<string, boolean>> = {
  Admin: {
    create_user: true,
    read_user: true,
    update_user: true,
    delete_user: true,
    restore_user: true,
    manage_groups: true,
    manage_companies: true,
  },
  Editor: {
    read_user: true,
    update_user: true,
  },
  Viewer: {
    read_user: true,
  },
};

export function getPermissions(groupName: string): Record<string, boolean> {
  return groupPermissions[groupName] || {};
}
