const { test, expect } = require('@playwright/test')
const { testUser, blogs } = require('./testData')

test.describe('Blog app', () => {

  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')

    await request.post('http://localhost:3001/api/users', {
      data: testUser
    })

    await page.goto('http://localhost:5173')
  })

  test('5.17 Login form is shown by default', async ({ page }) => {
    await expect(page.locator('text=Login')).toBeVisible()
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test.describe('Login', () => {
    test('5.18 succeeds with correct credentials', async ({ page }) => {
      await page.fill('input[name="username"]', testUser.username)
      await page.fill('input[name="password"]', testUser.password)
      await page.click('button:has-text("Login")')

      await expect(page.locator(`text=${testUser.name} logged in`)).toBeVisible()
    })

    test('5.18 fails with wrong credentials', async ({ page }) => {
      await page.fill('input[name="username"]', testUser.username)
      await page.fill('input[name="password"]', 'wrongpassword')
      await page.click('button:has-text("Login")')

      await expect(page.locator('text=invalid username or password')).toBeVisible()
      await expect(page.locator(`text=${testUser.name} logged in`)).not.toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      // Login
      await page.fill('input[name="username"]', testUser.username)
      await page.fill('input[name="password"]', testUser.password)
      await page.click('button:has-text("Login")')

      await expect(page.locator(`text=${testUser.name} logged in`)).toBeVisible()
    })

    test('5.19 a new blog can be created', async ({ page }) => {
      await page.click('button:has-text("Create New Blog")')
      await page.fill('input[name="title"]', 'My New Blog')
      await page.fill('input[name="author"]', 'Jane Doe')
      await page.fill('input[name="url"]', 'http://mynewblog.com')
      await page.click('button:has-text("Create")')

      await expect(page.locator('text=My New Blog')).toBeVisible()
      await expect(page.locator('text=Jane Doe')).toBeVisible()
    })

    test('5.20 a blog can be liked', async ({ page, request }) => {
      const loginRes = await request.post('http://localhost:3001/api/login', { data: { username: testUser.username, password: testUser.password } })
      const { token } = await loginRes.json()

      await request.post('http://localhost:3001/api/blogs', {
        data: blogs[0],
        headers: { Authorization: `Bearer ${token}` }
      })

      await page.reload()

      await page.click('text=View') 
      const likeButton = page.locator('button:has-text("Like")')
      const likesCount = page.locator('text=Likes:')

      const beforeLikesText = await likesCount.textContent()

      await likeButton.click()
      await expect(likesCount).toHaveText(/Likes: \d+/)

      const afterLikesText = await likesCount.textContent()
      expect(parseInt(afterLikesText.match(/\d+/)[0])).toBeGreaterThan(parseInt(beforeLikesText.match(/\d+/)[0]))
    })

    test('5.21 user who added a blog can delete it', async ({ page, request }) => {
      
      const loginRes = await request.post('http://localhost:3001/api/login', { data: { username: testUser.username, password: testUser.password } })
      const { token } = await loginRes.json()

      await request.post('http://localhost:3001/api/blogs', {
        data: blogs[1],
        headers: { Authorization: `Bearer ${token}` }
      })

      await page.reload()

      await page.click('text=View')
      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      await page.click('button:has-text("Delete")')
      await expect(page.locator(`text=${blogs[1].title}`)).not.toBeVisible()
    })

    test('5.22 only creator sees delete button', async ({ page, request }) => {
      const loginRes = await request.post('http://localhost:3001/api/login', { data: { username: testUser.username, password: testUser.password } })
      const { token } = await loginRes.json()

      await request.post('http://localhost:3001/api/blogs', {
        data: blogs[2],
        headers: { Authorization: `Bearer ${token}` }
      })

      await request.post('http://localhost:3001/api/users', {
        data: { username: 'otheruser', name: 'Other User', password: 'pass123' }
      })

      await page.reload()
      await page.click('button:has-text("Logout")')
      await page.fill('input[name="username"]', 'otheruser')
      await page.fill('input[name="password"]', 'pass123')
      await page.click('button:has-text("Login")')

      await page.click('text=View')

      const deleteButtons = await page.locator('button:has-text("Delete")').count()
      expect(deleteButtons).toBe(0)
    })

    test('5.23 blogs are ordered by likes descending', async ({ page, request }) => {
      const loginRes = await request.post('http://localhost:3001/api/login', { data: { username: testUser.username, password: testUser.password } })
      const { token } = await loginRes.json()

      for (const blog of blogs) {
        await request.post('http://localhost:3001/api/blogs', {
          data: blog,
          headers: { Authorization: `Bearer ${token}` }
        })
      }

      await page.reload()

      const blogTitles = await page.locator('.blog').allTextContents()

      const sortedByLikes = blogs.slice().sort((a,b) => b.likes - a.likes).map(b => b.title)

      for (let i = 0; i < sortedByLikes.length; i++) {
        expect(blogTitles[i]).toContain(sortedByLikes[i])
      }
    })
  })
})
