import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/scenes/Home'

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* 新增场景在此追加 Route */}
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
