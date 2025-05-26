import React from 'react'

function Login() {
  return (
    <div className="flex h-screen">
      {/* Left Side */ }
      <div className="hidden md:flex w-[40%] bg-primary items-center justify-center text-white p-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg">Manage your social media posts with ease.</p>
        </div>
      </div>

      {/* Right Side */ }
      <div className="flex w-full md:w-[60%] items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="lg:text-4xl text-2xl  font-bold text-center mb-6 text-primary">Login to Your Account</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral700">Password</label>
              <input
                type="password"
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login