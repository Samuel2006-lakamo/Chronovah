import SettingsSubPageLayout from "../../components/SettingsSubPageLayout";
import NotificationSettings from "../../features/settings/NotificationSettings";

export default function NotificationsPage() {
  return (
    <SettingsSubPageLayout
      title="Notifications"
      description="Control how and when Chronovah contacts you."
    >
      <NotificationSettings />
    </SettingsSubPageLayout>
  );
}
