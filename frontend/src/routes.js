import React from "react";
import { Router } from "@reach/router";

import Main from "./pages/main/MainPage";
import NotFound from "./pages/not_found/NotFoundPage";
import ErrorPage from "./pages/error/ErrorPage";
import Login from "./pages/login/LoginPage";
import Doctor from "./pages/doctor/DoctorPage";
import Marketer from "./pages/marketer/MarketerPage";
import PrivacyPolicy from "./pages/privacy_policy/PrivacyPolicy";
import Contact from "./pages/contact/Contact";

import Layout from './components/layout/Layout'

import PatientData from "./pages/doctor/PatientDataPage";
import MedicalHistory from "./pages/doctor/MedicalHistoryPage";
import DifferentialDiagnosis from "./pages/doctor/DifferentialDiagnosisPage";
import AddInfo from "./pages/marketer/AddInfoPage";
import UploadPicture from "./pages/marketer/UploadPicturePage";
import StartCampaign from "./pages/marketer/StartCampaignPage";

export function MainRouter() {
  return (
    <Layout>
      <Router>
        <NotFound default />
        <Main path="/"/>
        <Login path="/login" />
        <Doctor path="/doctor/:pageId/" />
        <Marketer path="/marketer/:pageId" />
        <PrivacyPolicy path="/privacy_policy" />
        <Contact path="/contact" />
        <ErrorPage path="/500" />
      </Router>
    </Layout>
  );
}

export function DoctorRoutes() {
  return [
    {
      title: "Patient data",
      component: props => <PatientData {...props} />,
    },
    {
      title: "Medical history",
      component: props => <MedicalHistory {...props} />,
    },
    {
      title: "Differential diagnosis",
      component: props => <DifferentialDiagnosis {...props} />,
    },
  ];
}

export function MarketerRoutes() {
  return [
    {
      title: "Drug information",
      component: props => <AddInfo {...props} />,
    },
    {
      title: "Upload picture",
      component: props => <UploadPicture {...props} />,
    },
    {
      title: "Start campaign",
      component: props => <StartCampaign {...props} />,
    },
  ];
}
