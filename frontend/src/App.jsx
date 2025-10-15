import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import CreateGroup from './pages/home/CreateGroup';
import GroupDetails from './pages/GroupDetails';
import Logout from './pages/Logout';
import JoinGroup from './pages/home/JoinGroup';

import Dashboard from './pages/Superuser/Dashboard';
import PublicGroups from './pages/Superuser/PublicGroups';
import Balances from './pages/Superuser/Balances';
import ManageGroup from './pages/Superuser/ManageGroup';

import DashboardLayout from './components/DashboardLayout';
import SuperuserLayout from './components/SuperuserLayout';
import MyEqubPage from './pages/home/MyEqubPage';
import PublicEqubPage from './pages/home/PublicEqubPage';
import InvitationsPage from './pages/home/InvitationsPage';
import MorePage from './pages/home/More';
import Balance from './pages/home/Balance';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PaymentReturn from './pages/PaymentReturn';
import Guide from './pages/Guide';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Home / user */}
        <Route path="/home" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/home/my-equb" />} />
          <Route path="my-equb" element={<MyEqubPage />} />
          <Route path="public-equb" element={<PublicEqubPage />} />
          <Route path="invitations" element={<InvitationsPage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="more/balance" element={<Balance />} />
          <Route path="create-group" element={<CreateGroup />} />
          <Route path="join-group" element={<JoinGroup />} />
          <Route path="group/:id" element={<GroupDetails />} />
        </Route>
        {/* Other pages */}
        <Route path="/logout" element={<Logout />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/payments/return" element={<PaymentReturn />} />
        {/* Superuser */}
        <Route path="/superuser" element={<SuperuserLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="groups" element={<PublicGroups />} />
          <Route path="balances" element={<Balances />} />
          <Route path="manage-group/:id" element={<ManageGroup />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
