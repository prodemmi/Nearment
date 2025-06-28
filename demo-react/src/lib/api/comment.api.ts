export async function getComments(product_id: string | number) {
  const result = await fetch(`http://localhost:8000/comments/${product_id}`);
  const { data } = await result.json();
  return data;
}

export async function createComment(text: string, product_id: string | number) {
  const result = await fetch(`http://localhost:8000/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, product_id }),
  });
  return await result.json();
}

export async function findSameComments(comment_id: string | number) {
  const result = await fetch(
    `http://localhost:8000/same.comments/${comment_id}`
  );
  const { data } = await result.json();
  return data;
}

export async function findSameCommentsBySubject(
  subject: string,
  product_id: string | number
) {
  const encodedSubject = encodeURIComponent(subject);
  const result = await fetch(`http://localhost:8000/same.subject?subject=${encodedSubject}&product_id=${product_id}`);
  const { data } = await result.json();
  return data;
}
