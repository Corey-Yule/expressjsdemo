import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  "https://garrivevhpafuokloots.supabase.co",
  "YOUR_PUBLIC_ANON_KEY"
);

// Email/password login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "/dashboard";
  }
});

// GitHub OAuth Test
document.getElementById("github").addEventListener("click", async () => {
  await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });
});
