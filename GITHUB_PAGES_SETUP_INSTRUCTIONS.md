# How to Configure GitHub Pages for the Snake Game

This document provides instructions on how to enable GitHub Pages for this repository to make the Snake game playable live in a browser.

## 1. Ensure Your Code is Ready

Make sure that your `index.html`, `style.css`, and `script.js` files are committed and pushed to the default branch of your repository (e.g., `main` or `master`).

## 2. Enable GitHub Pages

Follow these steps in your GitHub repository:

1.  **Navigate to Repository Settings:**
    *   Go to your repository on GitHub.com.
    *   Click on the **"Settings"** tab (usually located near the top of the repository page).

2.  **Go to the "Pages" Section:**
    *   In the left sidebar of the Settings page, click on **"Pages"** (it might be under "Code and automation").

3.  **Configure the Source:**
    *   Under "Build and deployment", in the "Source" section, select **"Deploy from a branch"**.
    *   **Branch:**
        *   Select your default branch (e.g., `main`, `master`) from the dropdown menu.
        *   Choose the folder: Select **`/root`** (sometimes displayed as just `/` or "root"). This is because your `index.html` file is located at the root of the repository.
    *   Click **"Save"**.

## 3. Find Your Published Game URL

*   After saving, GitHub Pages will start building your site. This might take a minute or two.
*   Once deployed, the **Pages** section in your repository **Settings** will display the URL where your site is published (e.g., `https://<your-username>.github.io/<repository-name>/`).
*   You can visit this URL in your browser to play the Snake game.

## 4. Update Repository Description (Recommended)

Once your game is live, it's a good idea to make it easily accessible for others:

1.  **Go to your Repository's Main Page.**
2.  On the right-hand side, find the **"About"** section.
3.  Click the **edit icon** (often a small gear or pencil) next to the description.
4.  **Add the live game URL** to your repository description. For example:
    > "A classic Snake game implemented using HTML, CSS, and plain JavaScript. Play it live here: `https://<your-username>.github.io/<repository-name>/`"
5.  Click **"Save changes"**.

This will provide a direct link to your game for anyone visiting your repository.

---

If you encounter any issues, refer to the official [GitHub Pages documentation](https://docs.github.com/en/pages) for more detailed information and troubleshooting steps.
