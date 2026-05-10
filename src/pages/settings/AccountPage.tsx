import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsSubPageLayout from "../../components/SettingsSubPageLayout";
import PasswordSetting from "../../features/profileSetting/PasswordSetting";
import DangerZone from "../../features/settings/DangerZone";
import settingApiCall from "../../services/SettingApiCall";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";

export default function AccountPage() {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeleteAccount = async () => {
    const response = await settingApiCall.deleteAccount();
    if (response.success) {
      success("Account deleted. Redirecting…");
      setTimeout(() => navigate("/signin"), 1000);
    } else {
      error(response.error || "Failed to delete account");
      setErrorMessage(response.error || "Failed to delete account");
    }
  };

  return (
    <SettingsSubPageLayout
      title="Account & Security"
      description="Manage your password and account access."
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-accent-red/30 rounded-xl text-accent-red text-sm">
          {errorMessage}
        </div>
      )}

      <PasswordSetting />

      <DangerZone
        onClick={handleDeleteAccount}
        title="Delete Account"
        description="Once you delete your account, there is no going back. All your data will be permanently deleted."
        confirmText="Delete my account"
      >
        Delete Account
      </DangerZone>
    </SettingsSubPageLayout>
  );
}
