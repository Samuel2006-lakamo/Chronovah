import { useState } from "react";
import SettingsSubPageLayout from "../../components/SettingsSubPageLayout";
import BackupRestore from "../../features/settings/BackupRestore";
import TrashBin from "../../features/settings/TrashBin";
import IndividualDataManagement from "../../features/settings/IndividualDataManagement";
import DangerZone from "../../features/settings/DangerZone";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../database/db";
import { ToastContainer } from "../../components/Toast";

export default function StoragePage() {
  const { user } = useAuth();
  const { toasts, removeToast, success, error } = useToast();
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const confirmClearAll = async () => {
    if (!user?.id) { error("User not authenticated"); return; }
    setIsClearing(true);
    try {
      await Promise.all([
        db.people.where("userId").equals(user.id).delete(),
        db.places.where("userId").equals(user.id).delete(),
        db.notes.where("userId").equals(user.id).delete(),
        db.journal.where("userId").equals(user.id).delete(),
      ]);
      success("All data cleared successfully.");
    } catch {
      error("Failed to clear data. Please try again.");
    } finally {
      setIsClearing(false);
      setShowClearModal(false);
    }
  };

  return (
    <SettingsSubPageLayout
      title="Storage & Data"
      description="Manage your data, backups, and deleted items."
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <BackupRestore />
      <TrashBin />
      <IndividualDataManagement />
      <DangerZone onClick={() => setShowClearModal(true)}>
        Clear all data
      </DangerZone>

      <ConfirmationModal
        isOpen={showClearModal}
        title="Clear All Data"
        message="This will permanently remove ALL your notes, journal entries, people, and places. This cannot be undone."
        confirmText="Clear All Data"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmClearAll}
        onCancel={() => setShowClearModal(false)}
        isLoading={isClearing}
      />
    </SettingsSubPageLayout>
  );
}
