import { NavLink } from 'react-router-dom'
import { SCENE_LIST } from '@/scenes'
import MockSwitcher from '@/components/MockSwitcher'
import styles from './index.module.css'

const Sidebar = () => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>Scene Forge</span>
        <MockSwitcher />
      </div>
      <ul className={styles.list}>
        {SCENE_LIST.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
            >
              <Icon size={16} className={styles.icon} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar
