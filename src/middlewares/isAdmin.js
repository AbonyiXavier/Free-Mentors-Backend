const isAdmin = (req, res, next) => {
  console.log("Admin area stuff", req.user.isAdmin);
  if (!req.user.isAdmin) {
    return res.status(401).json({
      status: 401,
      message: "Only Admin can change a user"
    });
  }
  next();
};
export default isAdmin;
