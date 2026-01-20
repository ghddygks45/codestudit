import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Card from "./Card";
import ContentInfo from "./ContentInfo";
import Button from "./Button";
import CommentList from "./CommentList";
import { QUERY_KEYS } from "../values";
import { getCommentCountByPostId } from "../api";
import { LoginContext } from "../context/LoginContext";
import greyHeartImage from "../assets/grey-heart.png";
import styles from "./Post.module.css";

function Post({ post }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showCommentList, setShowCommentList] = useState(false);
  const { currentUsername } = useContext(LoginContext);
  const currentUserInfo = queryClient.getQueryData([QUERY_KEYS.USER_INFO, currentUsername]);

  const { data: commentCount, refetch: refetchCommentCount } = useQuery({
    queryKey: [QUERY_KEYS.COMMENT_COUNT, post.id],
    queryFn: () => getCommentCountByPostId(post.id),
  });

  const handleCommentButtonClick = () => {
    if (!currentUsername) {
      navigate("/not-logged-in");
      return;
    }
    setShowCommentList((prev) => !prev);
    refetchCommentCount();
  };

  return (
    <Card className={styles.post}>
      <div className={styles.content}>
        <ContentInfo user={post.user} updatedTime={post.updatedAt} />
        <p className={styles.description}>{post.content}</p>
        <div className={styles.engagement}>
          <Button className={styles.likeButton}>
            <img className={styles.like} src={greyHeartImage} alt="좋아요" />
            {`좋아요 0개`}
          </Button>
          <Button onClick={() => handleCommentButtonClick(post.id)}>{`댓글 ${commentCount ?? 0}개`}</Button>
        </div>
        {showCommentList ? (
          <div>
            <CommentList currentUserInfo={currentUserInfo} postId={post.id} />
          </div>
        ) : (
          ""
        )}
      </div>
    </Card>
  );
}

export default Post;
