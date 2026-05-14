import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import "./index.css";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./pages/ProtectedRoute";
import PlaceDetail from "./features/Places/PlaceDetail";
import JournalDetail from "./features/Journal/JournalDetail";
import PersonDetail from "./features/people/PersonDetail";
import PlanGuard from "./components/subscription/PlanGuard";
import Spinner from "./ui/Spinner";
import { initializeFont } from "./lib/font";
import InstallPromptBanner from "./components/InstallPromptBanner";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Note = lazy(() => import("./pages/Note"));
const NoteDetail = lazy(() => import("./features/Note/NoteDetail"));
const Journal = lazy(() => import("./pages/Journal"));
const Places = lazy(() => import("./pages/Places"));
const People = lazy(() => import("./pages/People"));
const Setting = lazy(() => import("./pages/Setting"));
const ProfileSetting = lazy(() => import("./pages/ProfileSetting"));
const SettingsAppearance = lazy(() => import("./pages/settings/AppearancePage"));
const SettingsNotifications = lazy(() => import("./pages/settings/NotificationsPage"));
const SettingsStorage = lazy(() => import("./pages/settings/StoragePage"));
const SettingsAccount = lazy(() => import("./pages/settings/AccountPage"));
const SettingsHelpSupport = lazy(() => import("./pages/settings/HelpSupportPage"));
const ItemDetails = lazy(() => import("./ui/ItemDetails"));
const Homepage = lazy(() => import("./pages/Homepage"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgetPassword"));
const OtpVerification = lazy(() => import("./pages/OTP"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const OAuthCallback = lazy(() => import("./pages/OAuthCallback"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const UpgradePage = lazy(() => import("./pages/UpgradePage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const BillingPage = lazy(() => import("./pages/BillingPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

function App() {
  useEffect(() => {
    // Initialize font system on app startup
    initializeFont();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner/>}>
        <Routes>
          <Route index path="/" element={<Homepage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsOfServicePage />} />
          <Route path="refund" element={<RefundPolicyPage />} />
          <Route path="contact" element={<ContactPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notes" element={<Note />} />
            <Route path="notes/:id" element={<NoteDetail />} />
            <Route
              path="journal"
              element={
                <PlanGuard section="journal">
                  <Journal />
                </PlanGuard>
              }
            />
            <Route
              path="journal/:id"
              element={
                <PlanGuard section="journal">
                  <JournalDetail />
                </PlanGuard>
              }
            />
            <Route
              path="places"
              element={
                <PlanGuard section="places">
                  <Places />
                </PlanGuard>
              }
            />
            <Route
              path="places/:id"
              element={
                <PlanGuard section="places">
                  <PlaceDetail />
                </PlanGuard>
              }
            />
            <Route
              path="people"
              element={
                <PlanGuard section="people">
                  <People />
                </PlanGuard>
              }
            />
            <Route
              path="people/:id"
              element={
                <PlanGuard section="people">
                  <PersonDetail />
                </PlanGuard>
              }
            />
            <Route path="settings" element={<Setting />} />
            <Route path="settings/profile" element={<ProfileSetting />} />
            <Route path="settings/appearance" element={<SettingsAppearance />} />
            <Route path="settings/notifications" element={<SettingsNotifications />} />
            <Route path="settings/storage" element={<SettingsStorage />} />
            <Route path="settings/account" element={<SettingsAccount />} />
            <Route path="settings/help-support" element={<SettingsHelpSupport />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="item/:type/:id" element={<ItemDetails />} />
          </Route>

          <Route path="upgrade" element={<UpgradePage />} />
          <Route path="payment/success" element={<PaymentSuccessPage />} />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/otpverification" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      {/* PWA install prompt — shown to first-time visitors on supported browsers */}
      <InstallPromptBanner />
    </BrowserRouter>
  );
}

export default App;
