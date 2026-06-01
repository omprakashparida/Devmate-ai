import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const client =
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
  );

export const getMe =
  async (req, res) => {
    res.json({
      _id: req.user._id,
      username:
        req.user.username,
      email:
        req.user.email,
      avatar:
        req.user.avatar,
    });
  };

export const googleLogin =
  async (req, res) => {
    try {

      const {
        credential,
      } = req.body;

      const ticket =
        await client.verifyIdToken({
          idToken:
            credential,
          audience:
            process.env
              .GOOGLE_CLIENT_ID,
        });

      const payload =
        ticket.getPayload();

      const {
        sub,
        email,
        name,
        picture,
      } = payload;

      let user =
        await User.findOne({
          email,
        });

      if (!user) {

        user =
          await User.create({
            username:
              name,
            email,
            googleId:
              sub,
            avatar:
              picture,
          });

      }

      res.json({
        _id: user._id,
        username:
          user.username,
        email:
          user.email,
        avatar:
          user.avatar,
        token:
          generateToken(
            user._id
          ),
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Google login failed",
      });

    }
  };