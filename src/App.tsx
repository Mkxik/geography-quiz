import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import ClassicType from './pages/ClassicType'
import ContinentClicker from './pages/ContinentClicker'
import Doppelgangers from './pages/Doppelgangers'
import Explorer from './pages/Explorer'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="classic" element={<ClassicType />} />
        <Route path="continents" element={<ContinentClicker />} />
        <Route path="doppelgangers" element={<Doppelgangers />} />
        <Route path="explorer" element={<Explorer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
