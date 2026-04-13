import axios from "axios";

export const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) {
      return "La sesion expiro. Inicia sesion nuevamente.";
    }
    if (status === 403) {
      return "No tienes permisos para acceder a esta informacion.";
    }
    return (
      (error.response?.data as { error?: { message?: string } })?.error?.message ||
      "Ocurrio un error al consultar Google."
    );
  }

  return "Ocurrio un error inesperado.";
};