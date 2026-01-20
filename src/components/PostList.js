import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getPosts, getPostsByUsername, uploadPost } from "../api";
import Post from "./Post";
import { FEED_VARIANT, POSTS_PAGE_LIMIT, QUERY_KEYS } from "../values";
import LoadingPage from "../pages/LoadingPage";
import ErrorPage from "../pages/ErrorPage";
import PostForm from "./PostForm";
import Button from "./Button";
import { LoginContext } from "../context/LoginContext";
import styles from "./PostList.module.css";
import { useContext } from "react";

function PostList({ variant = FEED_VARIANT.HOME_FEED, showPostForm }) {
  const { currentUsername } = useContext(LoginContext);
  const queryClient = useQueryClient();

  let postsQueryKey;
  let postsQueryFn;

  if (variant === FEED_VARIANT.HOME_FEED) {
    postsQueryKey = [QUERY_KEYS.POSTS];
    postsQueryFn = ({ pageParam }) => getPosts(pageParam, POSTS_PAGE_LIMIT);
  } else if (variant === FEED_VARIANT.MY_FEED) {
    postsQueryKey = [QUERY_KEYS.POSTS, currentUsername];
    postsQueryFn = ({ pageParam }) => getPostsByUsername(currentUsername, pageParam, POSTS_PAGE_LIMIT);
  } else {
    console.warn("Invalid feed request.");
  }

  const {
    data: postsData,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: postsQueryKey,
    queryFn: postsQueryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => (lastPage.hasMore ? lastPageParam + 1 : undefined),
  });

  const uploadPostMutation = useMutation({
    mutationFn: (newPost) => uploadPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
    },
  });

  const handleUploadPost = (newPost) => {
    uploadPostMutation.mutate(newPost, {
      onSuccess: () => {
        toast("포스트가 성공적으로 업로드 되었습니다!");
      },
    });
  };

  if (isPending) return <LoadingPage />;

  if (isError) return <ErrorPage />;

  const postsPages = postsData?.pages ?? [];

  return (
    <div className={styles.postList}>
      {showPostForm ? <PostForm onSubmit={handleUploadPost} buttonDisabled={uploadPostMutation.isPending} /> : ""}
      {postsPages.map((postPage) => postPage.results.map((post) => <Post key={post.id} post={post} />))}
      <Button onClick={fetchNextPage} disabled={!hasNextPage || isFetchingNextPage}>
        더 불러오기
      </Button>
    </div>
  );
}

export default PostList;
