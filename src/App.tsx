import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/scenes/Home'
import Timeline from '@/scenes/Timeline'

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="timeline" element={<Timeline />} />
          {/* 新增场景在此追加 Route */}
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
