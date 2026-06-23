import { hasPermission } from "../../constants/permissions.constants.js";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../exceptions/http.exceptions.js";

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedException("Authentication required"));
    }

    if (!hasPermission(req.user.role, permission)) {
      return next(
        new ForbiddenException(
          `Access denied. Required permission: ${permission}`,
        ),
      );
    }

    next();
  };
};

export const requireAllPermissions = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedException("Authentication required"));
    }

    for (const permission of permissions) {
      if (!hasPermission(req.user.role, permission)) {
        return next(
          new ForbiddenException(
            `Access denied. Required permission: ${permission}`,
          ),
        );
      }
    }

    next();
  };
};

export const requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedException("Authentication required"));
    }

    const hasAnyPermission = permissions.some((permission) =>
      hasPermission(req.user.role, permission),
    );

    if (!hasAnyPermission) {
      return next(
        new ForbiddenException(
          `Access denied. Required any of: ${permissions.join(", ")}`,
        ),
      );
    }

    next();
  };
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedException("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenException(
          `Access denied. Required role: ${allowedRoles.join(" or ")}`,
        ),
      );
    }

    next();
  };
};

export default requirePermission;
