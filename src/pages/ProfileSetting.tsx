import SettingsSubPageLayout from "../components/SettingsSubPageLayout";
import PersonalInfo from "../features/profileSetting/PersonalInfo";
import { ToastContainer } from "../components/Toast";
import { useToast } from "../hooks/useToast";

function ProfileSetting() {
  const { toasts, removeToast } = useToast();

  return (
    <SettingsSubPageLayout
      title="Profile"
      description="Update your name, username, bio, and profile picture."
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <PersonalInfo />
    </SettingsSubPageLayout>
  );
}

export default ProfileSetting;
