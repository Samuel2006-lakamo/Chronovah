/**
 * ImageType.ts
 * Type definitions for the image upload system.
 */

/** A record type that supports image uploads. */
export type RecordType = "journal" | "person" | "place";

/** An image record as returned by the backend. */
export interface ImageRecord {
  id: string;
  userId: string;
  recordId: string;
  recordType: RecordType;
  publicId: string;
  url: string;
  secureUrl: string;
  createdAt: string;
  deletedAt: string | null;
}

/** Response from POST /api/v1/images/signature */
export interface SignatureResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  publicId: string;
  // Current usage counts returned with the signature for optimistic updates
  perRecordCount: number;
  perRecordLimit: number;
  globalCount: number;
  globalLimit: number | null; // null for pro users
  plan: "free" | "pro";
}

/** Response from GET /api/v1/images/usage */
export interface ImageUsage {
  totalImagesUploaded: number;
  plan: "free" | "pro";
  globalLimit: number | null;
  perRecordLimit: number;
}

/** Upload stage shown in the progress indicator. */
export type UploadStage = "idle" | "compressing" | "uploading" | "saving" | "done" | "error";

/** Error codes returned by the backend signature/confirm endpoints. */
export type ImageErrorCode =
  | "per_record_limit_reached"
  | "global_limit_reached"
  | "upload_failed"
  | "network_error"
  | "invalid_file"
  | "file_too_large";
