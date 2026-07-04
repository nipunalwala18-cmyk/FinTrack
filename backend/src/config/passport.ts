import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (req: any, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          // Return profile info to controller/service via callback context
          const googleUser = {
            email,
            fullName: profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
            providerId: profile.id,
            profileImage: profile.photos?.[0]?.value || null,
          };

          return done(null, googleUser);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
} else {
  console.warn('⚠️ Google OAuth variables are not fully configured. Google OAuth strategy is disabled.');
}

export default passport;
