"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1.5 text-xs text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
    >
      로그아웃
    </button>
  );
}
