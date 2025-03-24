// export const generateToken=(user,message,statusCode,res)=>{
//     const token=user.generateJWT();
//     const cookieName=`${(user.role).toLowerCase()}Token`
//     res.status(statusCode).cookie(cookieName, token, {
//         expireIn: new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000)
//     }).json({
//         success: true,
//         message,
//         user,
//         token
//     })
// }

export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJWT();
  // Determine the cookie name based on the user's role
  const cookieName = `${user.role.toLowerCase()}Token`;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};