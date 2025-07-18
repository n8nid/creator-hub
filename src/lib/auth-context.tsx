"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

type Profile = {
  id: string;
  user_id: string;
  name: string;
  profile_image: string | null;
  status: string;
  experience_level: string | null;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: (userId: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Use the auth helpers client for better SSR support
  const supabase = createClientComponentClient();

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", !!session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, !!session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (user && session) {
      console.log("[Auth Debug] User:", user);
      console.log("[Auth Debug] Session:", session);
      console.log("[Auth Debug] Profile:", profile);
    }
  }, [user, session, profile]);

  const signIn = async (email: string, password: string) => {
    console.log("SignIn called with email:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("SignIn error:", error);

        // Handle specific error types with user-friendly messages
        if (error.message.includes("Invalid login credentials")) {
          toast.error(
            "Email dan password yang Anda masukkan salah. Silahkan masukkan akun yang benar."
          );
        } else if (error.message.includes("Email not confirmed")) {
          toast.error(
            "Email belum dikonfirmasi. Silahkan cek email Anda dan klik link konfirmasi."
          );
        } else if (error.message.includes("Too many requests")) {
          toast.error(
            "Terlalu banyak percobaan login. Silahkan tunggu beberapa menit lagi."
          );
        } else {
          toast.error("Terjadi kesalahan saat login. Silahkan coba lagi.");
        }

        throw error;
      }

      console.log("SignIn successful, data:", {
        hasSession: !!data.session,
        hasUser: !!data.user,
      });

      // Success toast
      toast.success("Login berhasil! Selamat datang kembali.");

      // Let the middleware handle the redirect after session is established
      return;
    } catch (error) {
      // Error sudah dihandle di atas, re-throw untuk form handling
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setSession(data.session);
    setUser(data.session?.user ?? null);
    // Insert ke tabel profiles dengan status approved (user aktif), BUKAN creator
    if (data.user) {
      await supabase.from("profiles").insert({
        user_id: data.user.id,
        name: email,
        status: "approved", // hanya menandakan user aktif/email verified
        // JANGAN set flag creator apapun di sini
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const isAdmin = async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", userId)
      .single();
    return !!data && !error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
