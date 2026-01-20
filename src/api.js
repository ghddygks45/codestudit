const BASE_URL = "https://learn.codeit.kr/api/codestudit";

export async function getPosts() {
  const response = await fetch(`${BASE_URL}/posts`);
  return await response.json();
}

export async function getPostsByUsername(username) {
  const response = await fetch(`${BASE_URL}/posts?username=${username}`);

  return await response.json();
}

export async function uploadPost(newPost) {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });

  if (!response.ok) {
    throw new Error("Failed to upload the post.");
  }

  return await response.json();
}

export async function getUserInfo(username) {
  const response = await fetch(`${BASE_URL}/users/${username}`);
  return await response.json();
}

export async function getCommentCountByPostId(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  const body = await response.json();
  return body.count;
}

export async function getCommentsByPostId(postId, page, limit) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`);
  const body = await response.json();
  return body;
}

export async function addComment(postId, newComment) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newComment),
  });

  if (!response.ok) {
    throw new Error("Failed to add the comment.");
  }
  return await response.json();
}
