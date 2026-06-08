import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/scenes/Home'
import VirtualList from '@/scenes/VirtualList'

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="virtual-list" element={<VirtualList />} />
          {/* 新增场景在此追加 Route */}
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
