// pages/People/PersonEditor.tsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
 
  Hash,
  Check,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import ImageUpload, { type ImageUploadHandle } from "../../components/ImageUpload";
import type { Person } from "../../type/PeopleType";

interface PersonEditorProps {
  person: Partial<Person> | null;
  onSave: (person: Partial<Person>) => void;
  onClose: () => void;
}

const relations = [
  "Family",
  "Friend",
  "Colleague",
  "Client",
  "Mentor",
  "Partner",
  "Acquaintance",
  "Other",
];

export default function PersonEditor({
  person,
  onSave,
  onClose,
}: PersonEditorProps) {
  const [name, setName] = useState(person?.name || "");
  const [nickname, setNickname] = useState(person?.nickname || "");
  const [description, setDescription] = useState(person?.description || "");
  const [image] = useState(person?.image || "");
  // images is kept for backward compat with onSave; updated via ImageUpload's onImagesChange
  const [images, setImages] = useState<string[]>(person?.images || []);
  const [relation, setRelation] = useState(person?.relation || "Friend");
  const [birthday, setBirthday] = useState(person?.birthday || "");
  const [email, setEmail] = useState(person?.email || "");
  const [phone, setPhone] = useState(person?.phone || "");
  const [address, setAddress] = useState(person?.address || "");
  const [company, setCompany] = useState(person?.company || "");
  const [jobTitle, setJobTitle] = useState(person?.jobTitle || "");
  const [website, setWebsite] = useState(person?.website || "");
  const [notes, setNotes] = useState(person?.notes || "");
  const [tags, setTags] = useState<string[]>(person?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isFavorite] = useState(person?.isFavorite || false);
  const [socialMedia, setSocialMedia] = useState(person?.socialMedia || {});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSocial, setShowSocial] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<ImageUploadHandle>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleCancel = async () => {
    await imageUploadRef.current?.cancelSession();
    onClose();
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
      name,
      nickname: nickname || undefined,
      description,
      image: image || undefined,
      images: images.length > 0 ? images : undefined,
      relation,
      birthday: birthday || undefined,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
      company: company || undefined,
      jobTitle: jobTitle || undefined,
      website: website || undefined,
      notes: notes || undefined,
      tags,
      isFavorite,
      socialMedia: Object.values(socialMedia).some(Boolean)
        ? socialMedia
        : undefined,
    });
  };

  const isFormValid = name && relation;

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
            {person?.id ? "Edit Person" : "Add New Person"}
          </h3>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-default rounded-lg transition-colors"
          >
            <X size={18} className="text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted flex items-center gap-1">
                  <User size={14} />
                  Full Name *
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted flex items-center gap-1">
                  Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Johnny"
                  className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                />
              </div>
            </div>

            {/* Relation */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-muted flex items-center gap-1">
                Relation *
              </label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
              >
                {relations.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-muted">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description about this person..."
                rows={2}
                className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-muted flex items-center gap-1">
                <ImageIcon size={14} />
                Photos
              </label>
              {person?.id ? (
                <ImageUpload
                  ref={imageUploadRef}
                  recordId={person.id}
                  recordType="person"
                  onImagesChange={setImages}
                />
              ) : (
                <p className="text-xs text-muted py-2">
                  Save the person first to add photos.
                </p>
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

            {/* Contact Info Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              <Plus size={16} className={showAdvanced ? "rotate-45" : ""} />
              {showAdvanced ? "Hide" : "Show"} contact information
            </button>

            {/* Contact Info */}
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted flex items-center gap-1">
                      <Mail size={12} />
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted flex items-center gap-1">
                      <Phone size={12} />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 890"
                      className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted flex items-center gap-1">
                    <MapPin size={12} />
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted flex items-center gap-1">
                      <Briefcase size={12} />
                      Company
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company name"
                      className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Software Engineer"
                      className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted flex items-center gap-1">
                    <Calendar size={12} />
                    Birthday
                  </label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted flex items-center gap-1">
                    <Globe size={12} />
                    Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                  />
                </div>

                {/* Social Media Toggle */}
                <button
                  onClick={() => setShowSocial(!showSocial)}
                  className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
                >
                  <Plus size={16} className={showSocial ? "rotate-45" : ""} />
                  {showSocial ? "Hide" : "Show"} social media
                </button>

                {/* Social Media */}
                {showSocial && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted flex items-center gap-1">
                        <Twitter size={12} />
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={socialMedia.twitter || ""}
                        onChange={(e) =>
                          setSocialMedia({
                            ...socialMedia,
                            twitter: e.target.value,
                          })
                        }
                        placeholder="@username"
                        className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted flex items-center gap-1">
                        <Instagram size={12} />
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={socialMedia.instagram || ""}
                        onChange={(e) =>
                          setSocialMedia({
                            ...socialMedia,
                            instagram: e.target.value,
                          })
                        }
                        placeholder="@username"
                        className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted flex items-center gap-1">
                        <Linkedin size={12} />
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={socialMedia.linkedin || ""}
                        onChange={(e) =>
                          setSocialMedia({
                            ...socialMedia,
                            linkedin: e.target.value,
                          })
                        }
                        placeholder="profile-url"
                        className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted">
                    Additional Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information..."
                    rows={2}
                    className="w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary text-sm resize-none"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-3 sm:p-4 border-t border-default">
          <button
            onClick={handleCancel}
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
            <span>Save Person</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
