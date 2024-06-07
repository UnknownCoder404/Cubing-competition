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
}

async function main() {
  if (!loggedIn()) {
    window.location.href = "../Login";
  }
  tokenValid(true);
  if (isUser(getRole(true))) {
    window.location.href = "../";
  }
}
main();