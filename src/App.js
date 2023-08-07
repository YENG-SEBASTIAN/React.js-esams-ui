import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Activate from './components/auth/Activate';
import ResetPassword from './components/auth/ResetPassword';
import ResetPasswordConfirm from './components/auth/ResetPasswordConfirm';
import Layout from './components/layout/Layout';
import NotFound from './components/dashboard/NotFound';
import Dashboard from './components/dashboard/dashboard/Dashboard';


function App() {
  return (
    <>
    <Layout>
      <Routes>
        {/* public routes */}
        <Route path='/' exact element={<Login />} />
        <Route path='/signup' exact element={<SignUp />} />
        <Route path='/activate/:uid/:token' exact element={<Activate />} />
        <Route path='/reset-password' exact element={<ResetPassword />} />
        <Route path='password/reset/confirm/:uid/:token' exact element={<ResetPasswordConfirm />} />


        {/* protected routes */}
        <Route path='/dashboard/*' exact element={<Dashboard />} />
        <Route path='*' exact element={<NotFound />} />

      </Routes>
    </Layout>
  </>
  );
}

export default App;
