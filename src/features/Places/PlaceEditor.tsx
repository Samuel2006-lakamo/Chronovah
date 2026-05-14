// pages/Places/PlaceEditor.tsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  MapPin,
  Globe,
  Phone,
  Clock,
  DollarSign,
  Tag,
  Hash,
  Star,
  Calendar,
  Link as LinkIcon,
  Check,
  ImageIcon,
} from "lucide-react";
import ImageUpload, { type ImageUploadHandle } from "../../components/ImageUpload";
import type { Place, PlaceType } from "../../type/PlaceType";
import { newId } from "../../lib/helpers";

interface PlaceEditorProps {
  place: Partial<Place> | null;
  onSave: (place: Partial<Place>) => void;
  onClose: () => void;
}

const placeTypes: PlaceType[] = [
  "City",
  "Village",
  "Landmark",
  "Restaurant",
  "Cafe",
  "School",
  "Park",
  "Beach",
  "Mountain",
  "Museum",
  "Hotel",
  "Other",
];

const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "Other"];

export default function PlaceEditor({
  place,
  onSave,
  onClose,
}: PlaceEditorProps) {
  const [name, setName] = useState(place?.name || "");
  const [country, setCountry] = useState(place?.country || "");
  const [location, setLocation] = useState(place?.location || "");
  const [type, setType] = useState<PlaceType>(place?.type || "City");
  const [notes, setNotes] = useState(place?.notes || "");
  // images is kept for backward compat with onSave; updated via ImageUpload's onImagesChange
  const [images, setImages] = useState<string[]>(place?.images || []);
  const [visitedDate, setVisitedDate] = useState(place?.visitedDate || "");
  const [rating, setRating] = useState(place?.rating || 0);
  const [cost, setCost] = useState(place?.cost || 0);
  const [currency, setCurrency] = useState(place?.currency || "USD");
  const [website, setWebsite] = useState(place?.website || "");
  const [phone, setPhone] = useState(place?.phone || "");
  const [openingHours, setOpeningHours] = useState(place?.openingHours || "");
  const [tags, setTags] = useState<string[]>(place?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Pre-generate the record ID so images can be uploaded before the record is saved.
  const [recordId] = useState<string>(() => place?.id ?? newId());

  const nameRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<ImageUploadHandle>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleCancel = async () => {
    try {
      await imageUploadRef.current?.cancelSession();
    } catch (err) {
      console.warn('[PlaceEditor] Failed to cancel image session:', err);
    } finally {
      onClose();
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    onSave({
      id: recordId,
      name,
      country,
      location,
      type,
      notes,
      images,
      visitedDate: visitedDate || undefined,
      rating: rating || undefined,
      cost: cost || undefined,
      currency: cost ? currency : undefined,
      website: website || undefined,
      phone: phone || undefined,
      openingHours: openingHours || undefined,
      tags,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card rounded-xl border border-default w-full max-w-3xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-default">
          <h3 className="text-lg font-semibold text-primary">
            {place?.id ? "Edit Place" : "Add New Place"}
          </h3>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-default rounded-lg transition-colors"
          >
            <X size={18} className="text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-1">
                  <MapPin size={14} />
                  Place Name *
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eiffel Tower"
                  className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-1">
                  <Globe size={14} />
                  Country *
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="France"
                  className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-1">
                <MapPin size={14} />
                Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="7th arrondissement, Paris"
                className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-1">
                  <Tag size={14} />
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PlaceType)}
                  className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
                >
                  {placeTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-1">
                  <Calendar size={14} />
                  Visited Date
                </label>
                <input
                  type="date"
                  value={visitedDate}
                  onChange={(e) => setVisitedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-1">
                <ImageIcon size={14} />
                Photos
              </label>
              <ImageUpload
                ref={imageUploadRef}
                recordId={recordId}
                recordType="place"
                onImagesChange={setImages}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your memories about this place..."
                rows={3}
                className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-1">
                <Hash size={14} />
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-default rounded-lg text-xs text-primary"
                  >
                    <span>#{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-accent-red"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="Add tag..."
                    className="w-24 px-2 py-1 bg-default border border-default rounded-lg text-xs text-primary focus:outline-none focus:border-primary-500"
                  />
                  <button
                    onClick={addTag}
                    className="p-1 text-muted hover:text-primary-500"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary-500 hover:text-primary-600"
            >
              {showAdvanced ? "- Hide" : "+ Show"} advanced options
            </button>

            {/* Advanced Fields */}
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted flex items-center gap-1">
                      <Star size={14} />
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.5"
                      value={rating}
                      onChange={(e) => setRating(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted flex items-center gap-1">
                        <DollarSign size={14} />
                        Cost
                      </label>
                      <input
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
                      >
                        {currencies.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted flex items-center gap-1">
                    <LinkIcon size={14} />
                    Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted flex items-center gap-1">
                    <Phone size={14} />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                    className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted flex items-center gap-1">
                    <Clock size={14} />
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="9:00 AM - 6:00 PM"
                    className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-default">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-muted hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name || !country}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            <span>Save Place</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
