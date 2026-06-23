import jwt from "jsonwebtoken";
import User from "../../modules/users/user.model.js";
import config from "../config/config.js";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../exceptions/http.exceptions.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return next(
      new UnauthorizedException("Authorization header is missing or invalid")
    );
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(
      new UnauthorizedException("Token is missing in the authorization header")
    );
  }
  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new UnauthorizedException("User not found"));
    }
    if (user.tokenVersion !== decoded.tokenVersion) {
      return next(new ForbiddenException("Token has been revoked"));
    }

    req.user = {
      ...decoded,
      isVerified: user.isVerified,
      role: user.role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedException("Token has expired"));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedException("Invalid token"));
    } else {
      next(err);
    }
  }
};

export default authMiddleware;
