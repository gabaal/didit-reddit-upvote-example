import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import { Vote } from "@/components/Vote";
import { db } from "@/db";
import NotFound from "../not-found";
export const metadata = {
  title: "Posts",
};

export default async function SinglePostPage({ params }) {
  const postId = params.postId;
  
  async function generateMetadata() {
    // load the post
    const { rows: posts } =
      await db.query(`SELECT title FROM posts WHERE posts.id = $1`, [postId]);
    const post = posts[0]; // get the first one
    console.log(post);
    return {
      title: post.title,
    };
  }

  await generateMetadata();
  const { rows: posts } = await db.query(
    `SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, 
    COALESCE(SUM(votes.vote), 0) AS vote_total
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN votes ON votes.post_id = posts.id
    WHERE posts.id = $1
    GROUP BY posts.id, users.name
    LIMIT 1;`,
    [postId]
  );
  const post = posts[0];

   // if there is no post, run the notFound function to show the not-found.jsx page.
   if (!post) {
    NotFound();
    // return;
  }
  
 // Ensure generateMetadata is awaited
  const { rows: votes } = await db.query(
    `SELECT *, users.name from votes
     JOIN users on votes.user_id = users.id`
  );

  return (
    <div className="max-w-screen-lg mx-auto pt-4 pr-4">
      <div className="flex space-x-6">
        <Vote postId={post.id} votes={post.vote_total} />
        <div className="">
          <h1 className="text-2xl">{post.title}</h1>
          <p className="text-zinc-400 mb-4">Posted by {post.name}</p>
        </div>
      </div>
      <main className="whitespace-pre-wrap m-4">{post.body}</main>

      <CommentForm postId={post.id} />
      <CommentList postId={post.id} />
    </div>
  );
}
