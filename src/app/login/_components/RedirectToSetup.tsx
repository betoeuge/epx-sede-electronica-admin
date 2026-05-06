"use client";

import { useEffect } from "react";

export function RedirectToSetup() {
  useEffect(() => {
    document.cookie = "sede_installed=; path=/; max-age=0; SameSite=Strict";
    window.location.href = "/setup";
  }, []);

  return null;
}
