import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import OhelOr from './experiences/OhelOr'
import UploadOr from './experiences/UploadOr'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ohel-or" element={<OhelOr />} />
      <Route path="/upload-or" element={<UploadOr />} />
    </Routes>
  )
}
