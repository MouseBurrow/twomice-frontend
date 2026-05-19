import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth.tsx";
import MCF from "./pages/MCF";
import Topic from "./pages/Topic";
import Post from "./pages/Post";
import Layout from "./components/layout/Layout";
import "./assets/App.scss";

// Uncomment each import as that task is completed:
// import Settings from "./pages/Settings";
// import Profile from "./pages/Profile";
// import CreateNib from "./pages/CreateNib";

export default function App() {
    return (
        <Routes>
            {/* Auth stands alone — no NavBar */}
            <Route path="/auth" element={<Auth/>}/>

            {/* All other pages share NavBar via Layout */}
            <Route element={<Layout/>}>
                <Route path="/" element={<MCF/>}/>
                <Route path="/b/:board" element={<Topic/>}/>
                <Route path="/b/:board/nib/:post" element={<Post/>}/>
                {/* Add when tasks complete: */}
                {/* <Route path="/b/:board/new" element={<CreateNib/>}/> */}
                {/* <Route path="/settings" element={<Settings/>}/> */}
                {/* <Route path="/profile" element={<Profile/>}/> */}
            </Route>

            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}
