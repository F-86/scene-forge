import styles from './index.module.css'

const Home = () => {
  return (
    <div className={styles.home}>
      <h2 className={styles.title}>欢迎使用 Scene Forge</h2>
      <p className={styles.desc}>从左侧选择一个场景开始验证</p>
    </div>
  )
}

export default Home
