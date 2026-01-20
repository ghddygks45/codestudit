import ContentInfo from "./ContentInfo";
import styles from "./Comment.module.css";

function Comment({ comment }) {
  return (
    <div className={styles.comment}>
      <ContentInfo user={comment.user} updatedTime={comment.updatedAt} />
      <p className={styles.description}>{comment.content}</p>
    </div>
  );
}

export default Comment;
