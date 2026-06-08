import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/scenes/Home'
import KanbanBoard from '@/scenes/KanbanBoard'

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="kanban-board" element={<KanbanBoard />} />
          {/* 新增场景在此追加 Route */}
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
