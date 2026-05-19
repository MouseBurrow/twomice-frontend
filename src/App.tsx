import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth.tsx";
import MCF from "./pages/MCF";
import Topic from "./pages/Topic";
import Post from "./pages/Post";
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
                <Route path="/" element={<MCF/>}/>
                <Route path="/b/:board" element={<Topic/>}/>
                <Route path="/b/:board/nib/:post" element={<Post/>}/>
                <Route path="/b/:board/new" element={<CreateNib/>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/profile" element={<Profile/>}/>
            </Route>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}
