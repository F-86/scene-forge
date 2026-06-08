import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/scenes/Home'
import BasicForm from '@/scenes/BasicForm'

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="scenes/basic-form" element={<BasicForm />} />
          {/* 新增场景在此追加 Route */}
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
