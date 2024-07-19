import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import TeachersPage from "./pages/TeachersPage"
import StudentsPage from "./pages/StudentsPage"
import { useEffect, useState } from "react"
import NotFoundPage from "./pages/NotFoundPage"
import { TOKEN } from "./constants"
import AdminLayout from "./layout/AdminLayout"

function App() {

    const [islogin,setIsLogin]=useState( false);

    useEffect(() => {
      const token = localStorage.getItem(TOKEN);
      if (token) {
        setIsLogin(true);
      }
    }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<LoginPage setIsLogin={setIsLogin} />} />

        {
        islogin ?
         <Route  element={<AdminLayout setIsLogin={setIsLogin}/>}>
         <Route path="/teachers" element={<TeachersPage />} />
         <Route path={`/teacher/:id/student`} element={<StudentsPage />} />
       </Route>
       :
       null
       }
       <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
