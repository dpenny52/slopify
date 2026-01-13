import { Routes, Route } from 'react-router-dom'
import Layout from '@components/Layout'
import HomePage from '@pages/HomePage'
import EditorPage from '@pages/EditorPage'
import LoginPage from '@pages/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="editor" element={<EditorPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
