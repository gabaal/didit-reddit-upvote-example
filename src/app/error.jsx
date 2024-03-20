"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="max-w-screen-lg mx-auto p-4 mb-4">
        <h2 className="text-3xl">Oh no! Something went wrong on that page!</h2>
        <p className="max-w-screen-lg mx-auto p-4 mb-4">{error.message}</p>
        {/* <button className="max-w-screen-lg mx-auto p-4 mb-4"onClick={() => reset()}>Try again</button> */}
        <Link className="max-w-screen-lg mx-auto p-4 mb-4" href="/">Return to homepage </Link>
      </body>
    </html>
  );
}