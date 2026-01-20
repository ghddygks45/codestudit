import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import Loading from "./Loading";
import Button from "./Button";
import { COMMENTS_PAGE_LIMIT, QUERY_KEYS } from "../values";
import { addComment, getCommentsByPostId } from "../api";
import styles from "./CommentList.module.css";

function CommentList({ currentUserInfo, postId }) {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const {
    data: commentsData,
    isPending,
    isPlaceholderData,
  } = useQuery({
    queryKey: [QUERY_KEYS.COMMENTS, postId, page],
    queryFn: () => getCommentsByPostId(postId, page, COMMENTS_PAGE_LIMIT),
    placeholderData: keepPreviousData,
  });

  const addCommentMutation = useMutation({
    mutationFn: (newComment) => addComment(postId, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, postId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENT_COUNT, postId],
      });
    },
  });

  const handleAddComment = (newComment) => {
    setPage(0);
    addCommentMutation.mutate(newComment);
  };

  useEffect(() => {
    if (!isPlaceholderData && commentsData?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.COMMENTS, postId, page + 1],
        queryFn: () => getCommentsByPostId(postId, page + 1, COMMENTS_PAGE_LIMIT),
      });
    }
  }, [isPlaceholderData, commentsData, queryClient, postId, page]);

  if (isPending) return <Loading description="로딩 중입니다..." />;

  const comments = commentsData?.results ?? [];

  const paginationButtons = (
    <div className={styles.pagination}>
      <Button disabled={page === 0} onClick={() => setPage((old) => Math.max(old - 1, 0))}>
        &lt;
      </Button>
      <Button disabled={isPlaceholderData || !commentsData?.hasMore} onClick={() => setPage((old) => old + 1)}>
        &gt;
      </Button>
    </div>
  );

  return (
    <div className={styles.commentList}>
      <div>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        {comments.length > 0 ? paginationButtons : ""}
      </div>
      <CommentForm currentUserInfo={currentUserInfo} onSubmit={handleAddComment} buttonDisabled={addCommentMutation.isLoading} />
    </div>
  );
}

export default CommentList;
