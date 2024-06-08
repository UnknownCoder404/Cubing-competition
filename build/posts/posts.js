import { url, loadingHTML } from "../Scripts/variables.js";
import {
  addToken,
  getRole,
  isUser,
  tokenValid,
  loggedIn,
} from "../Scripts/credentials.js";
const postButton = document.querySelector(".post-btn");
const postButtonPrevHTML = postButton.innerHTML;
const titleInput = document.querySelector(".title");
const descriptionInput = document.querySelector(".description");

postButton.addEventListener("click", () => {
  const title = titleInput.value;
  const description = descriptionInput.value;
  try {
    createPost(title, description);
  } catch (error) {
    console.error("Error creating post:", error);
  }
});
function addLoadingAnimationToPostBtn() {
  postButton.disabled = true;
  postButton.innerHTML = loadingHTML;
}
function removeLoadingAnimatioToPostBtn() {
  postButton.disabled = false;
  postButton.innerHTML = postButtonPrevHTML;
}
async function createPost(title = undefined, description = undefined) {
  if (
    !title ||
    !description ||
    typeof title !== "string" ||
    typeof description !== "string"
  ) {
    alert("Unesi i naslov i opis objave.");
    return;
  }
  try {
    addLoadingAnimationToPostBtn();
    const response = await fetch(`${url}/posts/new`, {
      method: "POST",
      headers: addToken({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ title, description }),
    });
    const data = await response.json();
    if (response.ok) {
      const newPost = data;
      console.log("New post created:", newPost);
    } else {
      const errorData = data;
      console.error("Error creating post:", errorData.message);
      alert("Error creating post: " + errorData.message);
    }
  } catch (error) {
    console.error("Failed to create post:", error);
    alert("Failed to create post. Please try again later.");
  }
  removeLoadingAnimatioToPostBtn();
  main();
}
function createPostHtml(post) {
  const { title, description, id } = post;
  const authorUsername = post.author.username;
  const html = `<div class="post">
  <div> 
    <h2 class="post-title">${title}</h2>
  </div>
    <div>
      <p class="post-description">
      ${description}
      </p>
    </div>
    <div> 
      <p class="post-author-p">
        Objavio <span class="post-author">${authorUsername}
        </span>
      </p>
    </div>
    <div class="post-btns-container">
      <button data-id="${id}"
      class="delete-post-btn">
        <img src="../Images/delete.svg"/>
      </button>
    </div>
</div>`;
  return html;
}
async function getPosts() {
  try {
    // Returns json of posts
    const data = await fetch(`${url}/posts`);
    const posts = await data.json();
    return posts;
  } catch (error) {
    throw new Error("Failed to get posts. Please try again later.");
  }
}
async function deletePost(id) {
  const response = await fetch(`${url}/posts/delete/${id}`, {
    method: "DELETE",
    headers: addToken({
      "Content-Type": "application/json",
    }),
  });
  if (response.ok) {
    alert("Uspješno izbrisana objava.");
  } else {
    throw new Error("Failed to delete post.");
  }
}
function attachDeleteEvent(deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    const prevHTML = deleteBtn.innerHTML;
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = loadingHTML;
    const id = deleteBtn.dataset.id;
    try {
      await deletePost(id);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
    deleteBtn.disabled = false;
    deleteBtn.innerHTML = prevHTML;
    main();
  });
}
async function loadPosts() {
  const posts = await getPosts();
  document.querySelector(".posts").innerHTML = "";
  posts.forEach((post) => {
    const html = createPostHtml(post);
    document.querySelector(".posts").insertAdjacentHTML("beforeend", html);
    attachDeleteEvent(
      document.querySelector(`.delete-post-btn[data-id="${post.id}"]`)
    );
  });
}

async function editPost(
  id = undefined,
  newTitle = undefined,
  newDescription = undefined
) {
  if (
    !id ||
    !newTitle ||
    !newDescription ||
    typeof id !== "string" ||
    typeof newTitle !== "string" ||
    typeof newDescription !== "string"
  ) {
    throw new Error("Unesi novi naslov i novi opis objave te ID.");
  }
  try {
    const response = await fetch(`${url}/posts/edit/${id}`, {
      method: "PUT",
      headers: addToken({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    });
    const data = await response.json();
    if (response.ok) {
      const newPost = data;
      console.log("New post created:", newPost);
    }
  } catch (error) {}
}
function bolded(text) {
  return `<span class="bolded">${text}</span>`;
}
function italicized(text) {
  return `<span class="italicized">${text}</span>`;
}
function underlined(text) {
  return `<span class="underlined">${text}</span>`;
}
function hyperlink(text, url) {
  return `<a href="${url}" target="_blank">${text}</a>`;
}
function emailTo(text, email) {
  return `<a href="mailto:${email}">${text}</a>`;
}
function header(text, level) {
  if (level < 1 || level > 6) {
    throw new Error("Invalid header level.");
  }
  return `<h${level}>${text}</h${level}>`;
}
async function main() {
  if (!loggedIn()) {
    window.location.href = "../Login";
  }
  tokenValid(true);
  if (isUser(getRole(true))) {
    window.location.href = "../";
  }
  loadPosts();
}
main();
