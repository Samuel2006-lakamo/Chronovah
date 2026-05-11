/**
 * image.service.ts
 * API calls for the image upload system.
 */

import { protectedAxios } from "../../axios";
import type {
  SignatureResponse,
  ImageRecord,
  ImageUsage,
  RecordType,
} from "../type/ImageType";

/** Get a signed Cloudinary upload token (validates limits server-side). */
export async function getImageSignature(
  recordId: string,
  recordType: RecordType
): Promise<SignatureResponse> {
  const res = await protectedAxios.post("/images/signature", {
    recordId,
    recordType,
  });
  return res.data?.data ?? res.data;
}

/** Confirm a successful Cloudinary upload — persists the Image_Record. */
export async function confirmImageUpload(params: {
  publicId: string;
  url: string;
  secureUrl: string;
  recordId: string;
  recordType: RecordType;
}): Promise<ImageRecord> {
  const res = await protectedAxios.post("/images/confirm", params);
  return res.data?.data ?? res.data;
}

/** Fetch all active images for a record. */
export async function getRecordImages(
  recordType: RecordType,
  recordId: string
): Promise<ImageRecord[]> {
  const res = await protectedAxios.get(`/images/${recordType}/${recordId}`);
  return res.data?.data ?? res.data;
}

/** Get the user's global image usage stats. */
export async function getImageUsage(): Promise<ImageUsage> {
  const res = await protectedAxios.get("/images/usage");
  return res.data?.data ?? res.data;
}

/** Soft-delete an image (30-day restore window). */
export async function softDeleteImage(imageId: string): Promise<ImageRecord> {
  const res = await protectedAxios.delete(`/images/${imageId}/soft`);
  return res.data?.data ?? res.data;
}

/** Restore a soft-deleted image. */
export async function restoreImage(imageId: string): Promise<ImageRecord> {
  const res = await protectedAxios.post(`/images/${imageId}/restore`);
  return res.data?.data ?? res.data;
}

/** Permanently delete an image from Cloudinary and the database. */
export async function permanentDeleteImage(imageId: string): Promise<void> {
  await protectedAxios.delete(`/images/${imageId}/permanent`);
}
