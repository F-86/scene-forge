import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import styles from './index.module.css'

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
