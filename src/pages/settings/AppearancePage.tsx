import SettingsSubPageLayout from "../../components/SettingsSubPageLayout";
import AppearanceStorage from "../../features/settings/AppearanceStorage";

export default function AppearancePage() {
  return (
    <SettingsSubPageLayout
      title="Appearance"
      description="Customize how Chronovah looks and feels."
    >
      <AppearanceStorage />
    </SettingsSubPageLayout>
  );
}
