import TextInputForm from "./TextInputForm";
import styles from "./CommentForm.module.css";

function CommentForm({ currentUserInfo, onSubmit, buttonDisabled }) {
  const handleSubmit = async (content) => {
    const newComment = {
      username: currentUserInfo.username,
      content: content,
    };

    onSubmit(newComment);
  };

  return (
    <div className={styles.commentForm}>
      <TextInputForm onSubmit={handleSubmit} currentUserInfo={currentUserInfo} placeholder="댓글을 입력하세요." buttonText="댓글 달기" buttonDisabled={buttonDisabled} />
    </div>
  );
}
export default CommentForm;
