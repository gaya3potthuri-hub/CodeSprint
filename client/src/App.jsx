import { useState } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState('login')

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
          <h2>{page === 'login' ? 'Welcome back!' : 'Create account'}</h2>
          <p>
            {page === 'login'
              ? 'Log in to continue your adventure.'
              : 'Join CodeSprint and start learning.'}
          </p>

          <form onSubmit={(event) => {
            event.preventDefault()
            alert('Frontend demo only. Authentication will be connected later.')
          }}>
            {page === 'register' && (
              <>
                <label>Full name</label>
                <input type="text" placeholder="Enter your full name" required />

                <label>Username</label>
                <input type="text" placeholder="Choose a username" required />
              </>
            )}

            <label>Email address</label>
            <input type="email" placeholder="Enter your email" required />

            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />

            {page === 'register' && (
              <>
                <label>Confirm password</label>
                <input type="password" placeholder="Confirm your password" required />
              </>
            )}

            <button type="submit">
              {page === 'login' ? 'Log In' : 'Create Account'} →
            </button>
          </form>

          <p className="switch-page">
            {page === 'login'
              ? "New to CodeSprint? "
              : 'Already have an account? '}
            <button
              className="text-button"
              onClick={() => setPage(page === 'login' ? 'register' : 'login')}
            >
              {page === 'login' ? 'Register' : 'Log in'}
            </button>
          </p>
        </section>
      </main>

      <footer>© 2026 CodeSprint · Your journey, your progress.</footer>
    </div>
  )
}

export default App