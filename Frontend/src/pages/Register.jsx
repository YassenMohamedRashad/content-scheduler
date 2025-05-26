import React from 'react'

function Register() {
  return (
    <div className="flex h-screen">
      {/* Left Side - Signup Form */ }
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-primary">Create Your Account</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral700">Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Branding */ }
      <div className="hidden md:flex w-1/2 bg-primary items-center justify-center text-white p-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">Join Us Today!</h1>
          <p className="text-lg">Start scheduling your social media posts like a pro.</p>
        </div>
      </div>
    </div>
  )
}

export default Register