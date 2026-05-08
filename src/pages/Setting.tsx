import DangerZone from "../features/settings/DangerZone";
import IndividualDataManagement from "../features/settings/IndividualDataManagement";
import CommonPageHeader from "../components/CommonPageHeader";
import AppearanceStorage from "../features/settings/AppearanceStorage";
import BackupRestore from "../features/settings/BackupRestore";
import TrashBin from "../features/settings/TrashBin";
import NotificationSettings from "../features/settings/NotificationSettings";
import ConfirmationModal from "../components/ConfirmationModal";
import { useToast } from "../hooks/useToast";
import { useState } from "react";
import { db } from "../database/db";
import { useAuth } from "../hooks/useAuth";

export default function Settings() {
  const { success, error } = useToast();
  const { user } = useAuth();
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAll = async () => {
    setShowClearModal(true);
  };

  const confirmClearAll = async () => {
    if (!user?.id) {
      error("User not authenticated");
      return;
    }

    setIsClearing(true);
    try {
      await Promise.all([
        db.people.where("userId").equals(user.id).delete(),
        db.places.where("userId").equals(user.id).delete(),
        db.notes.where("userId").equals(user.id).delete(),
        db.journal.where("userId").equals(user.id).delete(),
      ]);
      success("All data cleared successfully.");
    } catch (err) {
      error("Failed to clear data. Please try again.");
    } finally {
      setIsClearing(false);
      setShowClearModal(false);
    }
  };
  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 my-16 sm:my-20">
      <CommonPageHeader heading="Settings" isSetting={true} />
      <AppearanceStorage />
      <NotificationSettings />
      <BackupRestore />
      <TrashBin />

      <IndividualDataManagement />
      <DangerZone onClick={handleClearAll}>Clear all data</DangerZone>

      <ConfirmationModal
        isOpen={showClearModal}
        title="Clear All Data"
        message="This will remove ALL data permanently. This action cannot be undone. Continue?"
        confirmText="Clear All Data"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmClearAll}
        onCancel={() => setShowClearModal(false)}
        isLoading={isClearing}
      />
    </div>
  );
}
