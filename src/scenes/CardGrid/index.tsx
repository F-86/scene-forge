import { HeartIcon } from 'lucide-react'
import { Avatar, Card, EmptyState, Grid, Tag } from '@/ui'
import { useMockVariant } from '@/hooks/useMockVariant'
import { mockScenes } from './mock'
import styles from './index.module.css'

const CardGrid = () => {
  const { current } = useMockVariant()
  const items = mockScenes[current]

  if (items.length === 0) {
    return <EmptyState title="暂无卡片" description="当前没有任何卡片，切换左侧 Mock 变体查看效果" />
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>卡片网格</h2>
        <span className={styles.count}>{items.length} 张卡片</span>
      </div>

      <Grid columns={3} gap={16}>
        {items.map(item => (
          <Card key={item.id} onClick={() => {}}>
            <div className={styles.cardInner}>
              {/* 顶部：标签 */}
              <div className={styles.cardTop}>
                {item.tag ? (
                  <Tag label={item.tag} color={item.tagColor} />
                ) : (
                  <span />
                )}
              </div>

              {/* 标题 */}
              <h3 className={styles.cardTitle}>{item.title || '（无标题）'}</h3>

              {/* 描述 */}
              <p className={styles.cardDesc}>{item.description || '（暂无描述）'}</p>

              {/* 底部：作者 + 统计 */}
              <div className={styles.cardFooter}>
                <div className={styles.authorInfo}>
                  <Avatar
                    color={item.avatarColor}
                    label={item.avatarLabel || '?'}
                    size={24}
                  />
                  <span className={styles.authorName}>{item.author || '未知作者'}</span>
                </div>
                <div className={styles.stat}>
                  <HeartIcon size={13} className={styles.statIcon} />
                  <span>{item.statCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </Grid>
    </div>
  )
}

export default CardGrid
