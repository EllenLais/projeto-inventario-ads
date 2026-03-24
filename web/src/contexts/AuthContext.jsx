import { useEffect, useMemo, useState } from 'react';
import {
  loginWithEmailAndPassword,
  logoutUser,
  registerWithEmailAndPassword,
} from '@/services/authService';
import { AuthContext } from '@/contexts/auth-context';
import { auth, firebaseStatus } from '@/services/firebase/client';
import { buildFallbackProfile, ensureUserProfile, getUserProfile } from '@/services/userService';
import { onAuthStateChanged } from 'firebase/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseStatus.isConfigured || !auth) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        await ensureUserProfile(currentUser);
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile || buildFallbackProfile(currentUser));
      } catch (error) {
        console.warn('Unable to sync the signed-in user profile.', error);
        setProfile(buildFallbackProfile(currentUser));
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user),
      login: loginWithEmailAndPassword,
      register: registerWithEmailAndPassword,
      logout: logoutUser,
    }),
    [loading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
