import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import TeachersPage from "./pages/TeachersPage"
import StudentsPage from "./pages/StudentsPage"
import { useState } from "react"
import NotFoundPage from "./pages/NotFoundPage"
import { TOKEN } from "./constants"

function App() {

    const [islogin,setIsLogin]=useState(localStorage.getItem(TOKEN) ? true : false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<LoginPage setIsLogin={setIsLogin} />} />

        {
        islogin ?
         <Route >
         <Route path="/teachers" element={<TeachersPage />} />
         <Route path="/students" element={<StudentsPage />} />
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
