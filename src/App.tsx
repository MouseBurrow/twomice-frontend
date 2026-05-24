import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth.tsx";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Nib from "./pages/Nib";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import CreateNib from "./pages/CreateNib";
import Layout from "./components/layout/Layout";
import "./assets/App.scss";

export default function App() {
    return (
        <Routes>
            <Route path="/auth" element={<Auth/>}/>
            <Route element={<Layout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/b/:board" element={<Board/>}/>
                <Route path="/b/:board/nib/:post" element={<Nib/>}/>
                <Route path="/b/:board/new" element={<CreateNib/>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/profile" element={<Profile/>}/>
            </Route>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}
