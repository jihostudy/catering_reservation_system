"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ErrorModal } from "./ErrorModal";

export function ErrorHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error === "invalid_domain" && message) {
      setErrorMessage(decodeURIComponent(message));
      // URL에서 에러 파라미터 제거
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  const handleClose = () => {
    setErrorMessage(null);
  };

  return (
    <ErrorModal
      isOpen={!!errorMessage}
      message={errorMessage || ""}
      onClose={handleClose}
    />
  );
}

