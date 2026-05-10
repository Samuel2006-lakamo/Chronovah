// pages/Journal/JournalEditor.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  Hash,
  Cloud,
  MapPin,
  Image as ImageIcon,
  Check,
  Plus,
  Eye,
} from "lucide-react";

import MoodPicker from "./MoodPicker";
import ImageUpload from "../../components/ImageUpload";
import MarkdownContent from "../../components/MarkdownContent";
import AdvancedMarkdownEditor from "../../components/AdvancedMarkdownEditor";
import type { JournalEntry, MoodType, WeatherType } from "../../type/JournalType";

interface JournalEditorProps {
  entry: Partial<JournalEntry> | null;
  onSave: (entry: Partial<JournalEntry>) => void;
  onClose: () => void;
}

const weatherOptions: WeatherType[] = [
  "Sunny",
  "Cloudy",
  "Rainy",
  "Stormy",
  "Snowy",
  "Windy",
];

export default function JournalEditor({
  entry,
  onSave,
  onClose,
}: JournalEditorProps) {
  const [mood, setMood] = useState<MoodType | null>(entry?.mood || null);
  const [note, setNote] = useState(entry?.note || "");
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [weather, setWeather] = useState<WeatherType | undefined>(
    entry?.weather,
  );
  const [location, setLocation] = useState(entry?.location || "");
  const [images, setImages] = useState<string[]>(entry?.images || []);
  const [isFavorite] = useState(entry?.isFavorite || false);
  const [isPreview, setIsPreview] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    if (!mood) return;

    onSave({
      mood,
      note,
      tags,
      weather,
      location: location || undefined,
      images,
      isFavorite,
    });
  };

  const isFormValid = mood && note.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card rounded-xl border border-default w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-default">
          <h3 className="text-base sm:text-lg font-semibold text-primary">
            {entry?.id ? "Edit Journal Entry" : "New Journal Entry"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-default rounded-lg transition-colors"
          >
            <X size={18} className="text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Mood Picker */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted mb-2 block">
                How are you feeling today? *
              </label>
              <div className="overflow-x-auto pb-2">
                <MoodPicker selectedMood={mood} onMoodSelect={setMood} />
              </div>
            </div>

            {/* Preview toggle */}
            <div className="flex items-center justify-between p-2 border border-default rounded-lg bg-default/50">
              <span className="text-xs font-ui-xs text-muted uppercase">Formatting:</span>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className={`p-1.5 rounded transition-colors ${
                  isPreview
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary"
                }`}
                title="Toggle preview"
              >
                <Eye size={16} />
              </button>
            </div>

            {/* Journal Entry */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-muted flex items-center gap-1">
                Your thoughts *
              </label>
              {isPreview ? (
                <div className="min-h-[150px] sm:min-h-[200px] max-h-[min(50vh,320px)] p-3 bg-default border border-default rounded-lg overflow-y-auto">
                  <MarkdownContent
                    size="sm"
                    emptyFallback="*Nothing written yet…*"
                  >
                    {note}
                  </MarkdownContent>
                </div>
              ) : (
                <AdvancedMarkdownEditor
                  value={note}
                  onChange={setNote}
                  placeholder="Write about your day, your thoughts, your feelings..."
                  rows={6}
                />
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-muted flex items-center gap-1">
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
                      className="hover:text-red-500"
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
                    className="w-20 sm:w-24 px-2 py-1 bg-default border border-default rounded-lg text-xs text-primary focus:outline-none focus:border-primary-500"
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
              className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              <Plus size={16} className={showAdvanced ? "rotate-45" : ""} />
              {showAdvanced ? "Hide" : "Show"} additional details
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2"
              >
                {/* Weather */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-muted flex items-center gap-1">
                    <Cloud size={14} />
                    Weather
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weatherOptions.map((w) => (
                      <button
                        key={w}
                        onClick={() =>
                          setWeather(weather === w ? undefined : w)
                        }
                        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-colors ${
                          weather === w
                            ? "bg-primary-500 text-white"
                            : "bg-default text-muted hover:text-primary"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-muted flex items-center gap-1">
                    <MapPin size={14} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where were you?"
                    className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                  />
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-muted flex items-center gap-1">
                    <ImageIcon size={14} />
                    Photos
                  </label>
                  <ImageUpload
                    images={images}
                    onImagesChange={setImages}
                    maxImages={5}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-3 sm:p-4 border-t border-default">
          <button
            onClick={onClose}
            className="px-4 py-2 text-muted hover:text-primary transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Save size={16} />
            <span>Save Entry</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
