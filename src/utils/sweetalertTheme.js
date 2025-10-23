// src/utils/sweetalertTheme.js
import Swal from "sweetalert2";

export function themedSwal(options) {
  const isDark = document.body.classList.contains("dark-mode");

  const baseOptions = {
    background: isDark ? "#1e293b" : "#ffffff",
    color: isDark ? "#e2e8f0" : "#111827",
    confirmButtonColor: "#3399ff",
    cancelButtonColor: isDark ? "#475569" : "#6c757d",
    customClass: {
      popup: isDark ? "swal2-dark-popup" : "",
      title: "swal2-title",
      confirmButton: "swal2-confirm",
      cancelButton: "swal2-cancel",
    },
  };

  return Swal.fire({
    ...baseOptions,
    ...options,
  });
}
