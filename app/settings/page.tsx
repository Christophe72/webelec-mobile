import { ThemeStatus } from "@/components/mobile/ThemeStatus";

export default function SettingsPage() {
  return (
    <div className="p-4 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reglages</h1>
        <p className="app-muted text-sm">
          Configuration de l&apos;application et préférences utilisateur.
        </p>
      </div>

      <div className="app-surface p-4 space-y-3">
        <p className="font-semibold">Theme</p>
        <ThemeStatus />
        <p className="text-sm app-muted">
          Le bouton dans la barre du haut applique ce thème à toute l&apos;application.
        </p>
      </div>
    </div>
  );
}
