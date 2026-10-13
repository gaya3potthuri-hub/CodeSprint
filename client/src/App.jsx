
import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [page, setPage] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (page === 'register' && password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    if (page === 'register' && password.length < 8) {
      setMessage('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      if (page === 'register') {
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed.')
        }

        setMessage('Registration successful! You can now log in.')
        setPage('login')
        setUsername('')
        setPassword('')
        setConfirmPassword('')
      } else {
        setMessage(
          'Registration API is connected. We will add the login API next.'
        )
      }
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to the backend. Make sure your server is running.'
          : error.message
      )
    } finally {
      setLoading(false)
    }
  }

  function switchPage() {
    setPage(page === 'login' ? 'register' : 'login')
    setMessage('')
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>⚡ CodeSprint</h2>
        <span>Explore. Learn. Level Up.</span>
      </nav>

      <main className="auth-container">
        <section className="welcome">
          <p className="tagline">YOUR TECH ADVENTURE STARTS HERE</p>

          <h1>
            Level up your <span>coding skills.</span>
          </h1>

          <p>
            Explore a virtual tech world, complete challenges,
            earn XP, and unlock new technology zones.
          </p>

          <div className="tech-cards">
            <div>🐍<br />Python Island</div>
            <div>🌐<br />Web Town</div>
            <div>🤖<br />AI Lab</div>
          </div>
        </section>

        <section className="auth-card">
          <h2>
            {page === 'login' ? 'Welcome back!' : 'Create account'}
          </h2>

          <p>
            {page === 'login'
              ? 'Log in to continue your adventure.'
              : 'Join CodeSprint and start learning.'}
          </p>

          <form onSubmit={handleSubmit}>
            {page === 'register' && (
              <>
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </>
            )}

            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />

            {page === 'register' && (
              <>
                <label>Confirm password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  minLength={8}
                  required
                />
              </>
            )}

            <button type="submit" disabled={loading}>
              {loading
                ? 'Please wait...'
                : page === 'login'
                  ? 'Log In →'
                  : 'Create Account →'}
            </button>
          </form>

          {message && (
            <p role="status" aria-live="polite">
              {message}
            </p>
          )}

          <p className="switch-page">
            {page === 'login'
              ? 'New to CodeSprint? '
              : 'Already have an account? '}

            <button
              type="button"
              className="text-button"
              onClick={switchPage}
            >
              {page === 'login' ? 'Register' : 'Log in'}
            </button>
          </p>
        </section>
      </main>

      <footer>
        © 2026 CodeSprint · Your journey, your progress.
      </footer>
    </div>
  )
}

export default App
