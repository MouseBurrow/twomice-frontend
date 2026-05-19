import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth.tsx";
import MCF from "./pages/MCF";
import Topic from "./pages/Topic";
import Post from "./pages/Post";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Layout from "./components/layout/Layout";
import "./assets/App.scss";

// import CreateNib from "./pages/CreateNib";

export default function App() {
    return (
        <Routes>
            <Route path="/auth" element={<Auth/>}/>
            <Route element={<Layout/>}>
                <Route path="/" element={<MCF/>}/>
                <Route path="/b/:board" element={<Topic/>}/>
                <Route path="/b/:board/nib/:post" element={<Post/>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/profile" element={<Profile/>}/>
                {/* <Route path="/b/:board/new" element={<CreateNib/>}/> */}
            </Route>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}
