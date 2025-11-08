import { useState } from "react";

import ImagePreview from "../features/people/ImagePreview";
import PeopleList from "../features/people/PeopleList";
import CommonPageHeader from "../components/CommonPageHeader";
import PeopleInput from "../features/people/PeopleInput";

function People() {
  const [preview, setPreview] = useState<string | null>(null); 
  return (
    <div className="p-4 sm:p-6 mt-20 pb-28 transition-colors duration-300">
      <CommonPageHeader heading="People"/>
      <PeopleInput/>
      <PeopleList setPreview={setPreview} />
      <ImagePreview preview={preview} setPreview={setPreview} />
    </div>
  );
}

export default People;
