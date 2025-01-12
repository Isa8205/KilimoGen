import { useEffect } from "react"

export function Members() {

    useEffect(()=> {
        const form = document.querySelector('form')
        form?.addEventListener('submit', async (e) => {
            e.preventDefault()

            const formData = new FormData(form)
            console.log(formData.values())

            await fetch('http://192.168.56.1:3000/api/add-clerk', {
                method: 'POST',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(formData)
            })
        })
    }, [])

    return (
  <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-fit">
    <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">Signup Form</h1>
    <form action="#" method="POST" className="space-y-4 text-black">

      <span className="flex justify-between flex-wrap gap-4">
      <div className="flex-grow">
        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          id="first-name"
          name="firstName"
          placeholder="Enter your first name"
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="flex-grow">
        <label htmlFor="middle-name" className="block text-sm font-medium text-gray-700">Middle Name(optional)</label>
        <input
          type="text"
          id="middle-name"
          name="middleName"
          placeholder="Enter your middle name"
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex-grow">
        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          id="last-name"
          name="lastName"
          placeholder="Enter your last name"
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      </span>


      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          placeholder="Enter your age"
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          id="gender"
          name="gender"
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="" disabled selected>Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email address"
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          placeholder="Confirm your password"
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
        >
          Sign Up
        </button>
      </div>
    </form>
  </div>

    )
}