import Card from "./Card";
import ContentInfo from "./ContentInfo";
import styles from "./Post.module.css";

export default function Post({ post }) {
  return (
    <Card className={styles.post}>
      <div className={styles.content}>
        <ContentInfo user={post.user} updatedTime={post.updatedAt} />
        <p className={styles.description}>{post.content}</p>
      </div>
    </Card>
  );
}
