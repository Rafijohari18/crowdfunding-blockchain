import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProgramSelection from "./components/ProgramSelection";
import TransferPage from "./components/TransferPage";
import ReportPage from "./components/ReportPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<ProgramSelection />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="report" element={<ReportPage />} />
      </Route>
    </Routes>
  );
};

export default App;
