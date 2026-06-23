export const PERMISSIONS = {
  ADD_USER: "ADD_USER",
  VIEW_USERS: "VIEW_USERS",
  EDIT_USER: "EDIT_USER",
  DELETE_USER: "DELETE_USER",
  CHANGE_USER_ROLE: "CHANGE_USER_ROLE",
};

export const ROLE_PERMISSIONS = {
  ADMIN: [
    PERMISSIONS.ADD_USER,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.CHANGE_USER_ROLE,
  ],

  USER: [PERMISSIONS.EDIT_USER],
};

export const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  return rolePermissions.includes(permission);
};

export const getRolePermissions = (userRole) => {
  return ROLE_PERMISSIONS[userRole] || [];
};
