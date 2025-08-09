
# Blog Application E2E Test Cases (Exercises 5.17–5.23)

## 5.17: Verify Login Form is Displayed by Default

**Goal:** Ensure that the login form is shown when the application is opened.

**Steps:**

1. Navigate to `http://localhost:5173`
2. Check that a login form or heading like `Login` is visible
3. Verify that username and password input fields are present

---

## 5.18: Login Tests

### 5.18.1: Successful Login

**Goal:** Verify that login succeeds with correct credentials.

**Setup:** Before the test, reset the database and create a user with username `testuser` and password `password123`.

**Steps:**

1. Go to the login page
2. Enter `testuser` in the username field
3. Enter `password123` in the password field
4. Click the login button
5. Confirm that a message or UI element appears indicating the user is logged in (e.g., `Test User logged in`)

---

### 5.18.2: Failed Login

**Goal:** Verify that login fails with incorrect credentials.

**Steps:**

1. Go to the login page
2. Enter `testuser` in the username field
3. Enter an incorrect password
4. Click the login button
5. Confirm that an error message is shown (e.g., `invalid username or password`)
6. Verify that the user is not logged in (no welcome message)

---

## 5.19: Creating a New Blog

**Goal:** Verify that a logged-in user can create a new blog.

**Setup:** Log in as user `testuser` with password `password123`.

**Steps:**

1. Click the button to create a new blog
2. Fill in the blog title, author, and URL fields
3. Submit the form
4. Verify that the new blog appears in the blog list

---

## 5.20: Liking a Blog

**Goal:** Verify that a user can like a blog.

**Steps:**

1. Click the `View` button to show blog details
2. Click the `Like` button
3. Verify that the number of likes increases by 1
4. Optionally, repeat and verify the likes increment accordingly

---

## 5.21: Deleting a Blog

**Goal:** Verify that the user who added the blog can delete it.

**Steps:**

1. Click the `View` button on a blog created by the logged-in user
2. Confirm the deletion dialog (handle `window.confirm`)
3. Click the `Delete` button
4. Verify the blog no longer appears in the list

---

## 5.22: Delete Button Only Visible to Blog Creator

**Goal:** Verify that only the creator of a blog sees the delete button.

**Steps:**

1. Log in as a different user
2. View details of any blog
3. Confirm that the `Delete` button is not visible

---

## 5.23: Blogs Are Ordered by Likes Descending

**Goal:** Verify that blogs are displayed sorted by the number of likes in descending order (most liked first).

**Setup:** Create several blogs with varying numbers of likes.

**Steps:**

1. Navigate to the blog list page
2. Verify that the blog with the highest number of likes is shown at the top
3. Optionally, verify the order of the other blogs follows descending likes

