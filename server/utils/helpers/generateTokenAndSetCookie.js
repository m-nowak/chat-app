import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // res.cookie("jwt", token, {
  //   origin: [
  //     "http://localhost:3000",
  //     "https://chat-app-frontend-6y8l.onrender.com",
  //   ],
  //   httpOnly: true,
  //   maxAge: 15 * 24 * 60 * 60 * 1000,
  //   sameSite: "lax",
  // });

  return token;
};

export default generateTokenAndSetCookie;
