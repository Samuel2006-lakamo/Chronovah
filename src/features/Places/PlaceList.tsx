// pages/Places/index.tsx
import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  X,
  Map,
  Filter,
  
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CommonPageHeader from "../../components/CommonPageHeader";
import PlaceEditor from "./PlaceEditor";
import PlaceStats from "./PlaceStats";
import PlaceCard from "./PlaceCard";
import type { Place, PlaceType } from "../../type/PlaceType";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";
import ConfirmationModal from "../../components/ConfirmationModal";
import { usePlaces } from "../../hooks/usePlaces";
import PlacesSkeleton from "../../components/skeletons/PlacesSkeleton";

type SortOption = "name" | "country" | "visitedDate" | "createdAt";

export default function Places() {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();
  const { places, isLoading, createPlace, updatePlace, deletePlace } = usePlaces();

  // State for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [pendingDeletePlace, setPendingDeletePlace] = useState<Place | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Extract unique tags from places
  useEffect(() => {
    if (places) {
      const tags = new Set<string>();
      places.forEach((place) => place.tags?.forEach((tag) => tags.add(tag)));
      setAvailableTags(Array.from(tags));
    }
  }, [places]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!places || places.length === 0) {
      return {
        totalPlaces: 0,
        visitedCountries: 0,
        favoritePlaces: 0,
        typesCount: {},
      };
    }

    const countries = new Set(places.map((p) => p.country));
    const typesCount: Record<string, number> = {};
    places.forEach((p) => {
      typesCount[p.type] = (typesCount[p.type] || 0) + 1;
    });

    return {
      totalPlaces: places.length,
      visitedCountries: countries.size,
      favoritePlaces: places.filter((p) => p.isFavorite).length,
      typesCount,
    };
  }, [places]);

  // Filter and sort places
  const filteredPlaces = useMemo(() => {
    if (!places) return [];

    let filtered = [...places];

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.country.toLowerCase().includes(searchLower) ||
          p.location?.toLowerCase().includes(searchLower) ||
          p.notes?.toLowerCase().includes(searchLower) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTags.every((tag) => p.tags?.includes(tag)),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      // Favorites first
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;

      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "country":
          return a.country.localeCompare(b.country);
        case "visitedDate":
          return (b.visitedDate || "").localeCompare(a.visitedDate || "");
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [places, debouncedSearch, selectedType, selectedTags, sortBy]);

  const handleAddPlace = () => {
    setEditingPlace(null);
    setShowEditor(true);
  };

  const handleEditPlace = (place: Place) => {
    setEditingPlace(place);
    setShowEditor(true);
  };

  const handleSavePlace = async (placeData: Partial<Place>) => {
    try {
      if (editingPlace?.id) {
        // Update existing place
        await updatePlace(editingPlace.id, placeData);
        success(`${placeData.name} updated successfully`);
      } else {
        // Add new place
        await createPlace({
          name: placeData.name || "",
          country: placeData.country || "",
          location: placeData.location,
          type: placeData.type || "City",
          notes: placeData.notes,
          images: placeData.images || [],
          visitedDate: placeData.visitedDate,
          isFavorite: false,
          tags: placeData.tags || [],
          rating: placeData.rating,
          cost: placeData.cost,
          currency: placeData.currency,
          website: placeData.website,
          phone: placeData.phone,
          openingHours: placeData.openingHours,
        });
        success(`${placeData.name} added successfully`);
      }

      setShowEditor(false);
      setEditingPlace(null);
    } catch (err) {
      console.log(err);
      error("Failed to save place. Please try again.");
    }
  };

  const handleDeletePlace = (place: Place) => {
    setPendingDeletePlace(place);
  };

  const confirmDeletePlace = async () => {
    if (!pendingDeletePlace) return;
    setIsDeleteLoading(true);
    try {
      await deletePlace(pendingDeletePlace.id!);
      success("Place deleted successfully");
    } catch (err) {
      console.log(err);
      error("Failed to delete place. Please try again.");
    } finally {
      setIsDeleteLoading(false);
      setPendingDeletePlace(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedType("all");
    setSelectedTags([]);
  };

  const hasActiveFilters =
    searchTerm || selectedType !== "all" || selectedTags.length > 0;

  return (
    <div className="min-h-screen  pt-20 pb-24 px-3 sm:px-6">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <CommonPageHeader isSetting={false} heading="Places" />

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-card border-default text-muted hover:text-primary"
              }`}
            >
              <Filter size={18} />
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddPlace}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
            >
              <Plus size={18} />
              <span>Add Place</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        {stats && <PlaceStats stats={stats} />}

        {/* Editor Modal */}
        <AnimatePresence>
          {showEditor && (
            <PlaceEditor
              place={editingPlace}
              onSave={handleSavePlace}
              onClose={() => {
                setShowEditor(false);
                setEditingPlace(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card border border-default rounded-xl p-4 mt-4 space-y-4">
                {/* Type filter */}
                <div>
                  <label className="text-xs font-medium text-muted mb-2 block">
                    Place Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedType("all")}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        selectedType === "all"
                          ? "bg-primary-500 text-white"
                          : "bg-default text-muted hover:text-primary"
                      }`}
                    >
                      All
                    </button>
                    {[
                      "City",
                      "Landmark",
                      "Restaurant",
                      "Cafe",
                      "Beach",
                      "Mountain",
                      "Museum",
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type as PlaceType)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          selectedType === type
                            ? "bg-primary-500 text-white"
                            : "bg-default text-muted hover:text-primary"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags filter */}
                {availableTags.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-muted mb-2 block">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() =>
                            setSelectedTags((prev) =>
                              prev.includes(tag)
                                ? prev.filter((t) => t !== tag)
                                : [...prev, tag],
                            )
                          }
                          className={`px-3 py-1 rounded-lg text-sm ${
                            selectedTags.includes(tag)
                              ? "bg-primary-500 text-white"
                              : "bg-default text-muted hover:text-primary"
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-500 hover:text-primary-600"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and view controls */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search places by name, country, or tags..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-card border border-default rounded-xl text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="createdAt">Recently added</option>
              <option value="name">Name</option>
              <option value="country">Country</option>
              <option value="visitedDate">Visited date</option>
            </select>

            <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-default">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary"
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-muted">
          {filteredPlaces.length}{" "}
          {filteredPlaces.length === 1 ? "place" : "places"} found
        </div>

        {/* Places grid/list */}
        {places === undefined || isLoading ? (
          <PlacesSkeleton viewMode={viewMode} />
        ) : filteredPlaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Map size={64} className="mx-auto text-muted opacity-30" />
            <h3 className="text-lg font-semibold text-primary mt-6 mb-2">
              {hasActiveFilters ? "No places found" : "No places yet"}
            </h3>
            <p className="text-muted max-w-md mx-auto mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Start adding the places you've visited"}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={handleAddPlace}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
              >
                Add Your First Place
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3"
            }`}
          >
            <AnimatePresence>
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onEdit={() => handleEditPlace(place)}
                  onDelete={() => handleDeletePlace(place)}
                  onClick={() => navigate(`/places/${place.id}`)}
                  onUpdate={updatePlace}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!pendingDeletePlace}
        title="Delete Place"
        message={`Are you sure you want to delete "${pendingDeletePlace?.name ?? "this place"}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmDeletePlace}
        onCancel={() => setPendingDeletePlace(null)}
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
