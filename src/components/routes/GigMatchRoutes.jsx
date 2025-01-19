import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../logins/Login";
import Home from "../home/Home";
import UserRegister from "../register/UserRegister";
import AdminRegister from "../register/AdminRegister";
import MainCalendar from "../calendars/MasterCalendar";
import Logout from "../logout/Logout";
import { useUser } from "../../contexts/UserContext";
import UserCalendar from "../calendars/UserCalendar";
import UserProfile from "../user/UserProfile";
import UserList from "../user/UserList";

const GigMatchRouter = () => {
  const { currentUser } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/artist-register" element={<UserRegister />} />
      <Route path="/venue-register" element={<AdminRegister />} />  
      <Route path="/master-calendar" element={<MainCalendar />} />
      <Route path="/logout" element={<Logout />} />
      {currentUser ? (
        <>
        <Route path={`/users/${currentUser.artistname}/calendar`} element={<UserCalendar />} />
        <Route path={`/users/${currentUser.userid}/profile`} element={<UserProfile />} />
        <Route path="users/list" element={<UserList />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/artist-login" />} />
      )}
    </Routes>
  );
};

export default GigMatchRouter;
