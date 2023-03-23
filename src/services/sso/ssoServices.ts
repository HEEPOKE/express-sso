import { Profile } from "passport-google-oauth20";
import prisma from "../../prisma";

async function handleGoogleAuth(
  accessToken: string,
  refreshToken: string,
  profile: Profile
) {
  let user = await prisma.user.findFirst({
    where: { googleId: profile.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0].value!,
      },
    });
  }

  return user;
}

const ssoServices = {
  handleGoogleAuth,
};

export default ssoServices;
