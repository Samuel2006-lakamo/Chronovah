
import type { Person } from "../Database/peopleDB";

export interface PersonCardProps {
  person: Person;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
}
