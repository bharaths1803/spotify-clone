import { clerkClient } from "@clerk/express";

export const protectRoute = (req, res, next) => {
  if (!req.auth.userId) {
    return res
      .status(401)
      .json({ message: `Unauthorised - you must be logged in` });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentuser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentuser.primaryEmailAddress?.emailAddress;
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: `Unauthorised - you must be an admin` });
    }
    next();
  } catch (error) {
    console.log(`Error in require admin ${error}`);
    next(error);
  }
};
