"use client";

import { useState } from "react";
import { 
  RiGlobeLine, 
  RiLayoutGridLine, 
  RiCheckLine, 
  RiMailLine, 
  RiFileLine, 
  RiCloudLine, 
  RiCalendarLine, 
  RiTaskLine,
  RiNotification3Line,
  RiPushpinLine,
  RiEyeLine,
  RiInformationLine,
  RiShieldCheckLine,
  RiLockLine,
  RiGoogleFill
} from "react-icons/ri";

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

const dashboardWidgets = [
  { id: "gmail", label: "Correos recientes", icon: <RiMailLine className="h-4 w-4" />, enabled: true },
  { id: "tasks", label: "Tareas pendientes", icon: <RiTaskLine className="h-4 w-4" />, enabled: true },
  { id: "calendar", label: "Eventos de hoy", icon: <RiCalendarLine className="h-4 w-4" />, enabled: true },
  { id: "storage", label: "Almacenamiento", icon: <RiCloudLine className="h-4 w-4" />, enabled: true },
  { id: "recentFiles", label: "Archivos recientes", icon: <RiFileLine className="h-4 w-4" />, enabled: false },
];

const notificationSettings = [
  { id: "push", label: "Notificaciones push", description: "Alertas en el navegador", enabled: true },
  { id: "tasks", label: "Tareas", description: "Recordatorios de fechas límite", enabled: true },
  { id: "calendar", label: "Calendario", description: "Próximos eventos", enabled: false },
];

const integrations = [
  { name: "Gmail", connected: true, description: "Correos electrónicos" },
  { name: "Drive", connected: true, description: "Archivos en la nube" },
  { name: "Calendar", connected: true, description: "Eventos y reuniones" },
];

const SettingsPage = () => {
  const [language, setLanguage] = useState("es");
  const [widgets, setWidgets] = useState(
    dashboardWidgets.reduce((acc, w) => ({ ...acc, [w.id]: w.enabled }), {} as Record<string, boolean>)
  );
  const [notifications, setNotifications] = useState(
    notificationSettings.reduce((acc, n) => ({ ...acc, [n.id]: n.enabled }), {} as Record<string, boolean>)
  );

  const toggleWidget = (id: string) => {
    setWidgets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="rounded-2xl border bg-(--axis-surface) px-6 py-5 mt-10 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-(--axis-text)">Configuración</h1>
          <p className="mt-1 text-sm text-(--axis-muted)">Personaliza tu experiencia</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
              <RiGlobeLine className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h3 className="font-semibold text-(--axis-text)">Idioma</h3>
              <p className="text-xs text-(--axis-muted)">Idioma de la interfaz</p>
            </div>
          </div>
          <div className="flex gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex-1 flex flex-col items-center gap-2 rounded-2xl border px-4 py-4 transition ${
                  language === lang.code
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-(--axis-border) bg-(--axis-surface) hover:border-violet-500/50"
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className={`text-sm font-medium ${language === lang.code ? "text-violet-500" : "text-(--axis-muted)"}`}>
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10">
              <RiLayoutGridLine className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-semibold text-(--axis-text)">Widgets</h3>
              <p className="text-xs text-(--axis-muted)">Qué mostrar en el dashboard</p>
            </div>
          </div>
          <div className="space-y-2">
            {dashboardWidgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between rounded-xl border border-(--axis-border) bg-(--axis-surface) p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--axis-surface-strong) text-(--axis-muted)">
                    {widget.icon}
                  </div>
                  <span className="text-sm font-medium text-(--axis-text)">{widget.label}</span>
                </div>
                <button
                  onClick={() => toggleWidget(widget.id)}
                  className={`relative h-6 w-10 rounded-full transition-all cursor-pointer ${
                    widgets[widget.id] ? "bg-green-500" : "bg-(--axis-surface-strong)"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-all ${
                      widgets[widget.id] ? "left-4.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
              <RiNotification3Line className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-(--axis-text)">Notificaciones</h3>
              <p className="text-xs text-(--axis-muted)">Cómo recibir alertas</p>
            </div>
          </div>
          <div className="space-y-2">
            {notificationSettings.map((notif) => (
              <div
                key={notif.id}
                className="flex items-center justify-between rounded-xl border border-(--axis-border) bg-(--axis-surface) p-3"
              >
                <div>
                  <p className="text-sm font-medium text-(--axis-text)">{notif.label}</p>
                  <p className="text-xs text-(--axis-muted)">{notif.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(notif.id)}
                  className={`relative h-6 w-10 rounded-full transition-all cursor-pointer ${
                    notifications[notif.id] ? "bg-green-500" : "bg-(--axis-surface-strong)"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-all ${
                      notifications[notif.id] ? "left-4.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
              <RiGoogleFill className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-(--axis-text)">Integraciones</h3>
              <p className="text-xs text-(--axis-muted)">Cuentas conectadas</p>
            </div>
          </div>
          <div className="space-y-2">
            {integrations.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-(--axis-border) bg-(--axis-surface) p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                    <RiGoogleFill className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-(--axis-text)">{item.name}</p>
                    <p className="text-xs text-(--axis-muted)">{item.description}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-[10px] font-medium text-green-400">
                  <RiCheckLine className="h-3 w-3" />
                  OK
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
              <RiEyeLine className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h3 className="font-semibold text-(--axis-text)">Privacidad</h3>
              <p className="text-xs text-(--axis-muted)">Control de datos</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-(--axis-border) bg-(--axis-surface) p-4">
              <div className="flex items-center gap-3">
                <RiPushpinLine className="h-5 w-5 text-(--axis-muted)" />
                <div>
                  <p className="text-sm font-medium text-(--axis-text)">Fijar ventana</p>
                  <p className="text-xs text-(--axis-muted)">Mantener en primer plano</p>
                </div>
              </div>
              <button className="relative h-6 w-10 rounded-full transition-all bg-(--axis-surface-strong) cursor-pointer">
                <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-all left-0.5" />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-(--axis-border) bg-(--axis-surface) p-4">
              <div className="flex items-center gap-3">
                <RiLockLine className="h-5 w-5 text-(--axis-muted)" />
                <div>
                  <p className="text-sm font-medium text-(--axis-text)">Pantalla de bloqueo</p>
                  <p className="text-xs text-(--axis-muted)">Bloquear al minimizar</p>
                </div>
              </div>
              <button className="relative h-6 w-10 rounded-full transition-all bg-(--axis-surface-strong) cursor-pointer">
                <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-all left-0.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10">
              <RiInformationLine className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <h3 className="font-semibold text-(--axis-text)">Acerca de</h3>
              <p className="text-xs text-(--axis-muted)">Información de la app</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-(--axis-border) bg-(--axis-surface) p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--axis-muted)">Versión</span>
                <span className="text-sm font-medium text-(--axis-text)">1.0.0</span>
              </div>
            </div>
            <div className="rounded-xl border border-(--axis-border) bg-(--axis-surface) p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--axis-muted)">Estado</span>
                <span className="flex items-center gap-1 text-sm font-medium text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Activo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <button className="rounded-xl border border-(--axis-border) bg-(--axis-surface-strong) px-5 py-2.5 text-sm font-medium text-(--axis-muted) hover:bg-(--axis-surface) transition cursor-pointer">
          Cancelar
        </button>
        <button className="rounded-xl bg-(--axis-accent) px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition cursor-pointer flex items-center gap-2">
          <RiCheckLine className="h-4 w-4" />
          Guardar cambios
        </button>
      </div>
    </section>
  );
};

export default SettingsPage;
