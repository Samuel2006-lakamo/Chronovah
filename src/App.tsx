import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./ui/AppLayout";
import Note from "./pages/Note";
import Journal from "./pages/Journal";
import Places from "./pages/Places";
import People from "./pages/People";
import Setting from "./pages/Setting";
import PageNotFound from "./pages/PageNotFound";
 import ItemDetails from "./ui/ItemDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="notes" element={<Note />} />
          <Route path="journal" element={<Journal />} />
          <Route path="places" element={<Places />} />
          <Route path="people" element={<People />} />
          <Route path="settings" element={<Setting />} />
          <Route path="item/:type/:id" element={<ItemDetails />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
