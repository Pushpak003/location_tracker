import {useState,} from "react";
import {Link,useNavigate,} from "react-router-dom";

function Register() {

  const navigate = useNavigate()
  const [formData, setFormData] =useState({
      name: "",
      username: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };
  const handleSubmit =
    async (e) => {
      e.preventDefault();
      try {
        const response =
          await fetch(
            "http://localhost:5000/api/auth/register",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                formData
              ),
            }
          );

        const data =
          await response.json();

        if (data.success) {

          alert(
            "Account created successfully"
          );
          navigate("/login");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
  };
  return (
    <div
      className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        px-4
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-8
          shadow-2xl
        "
      >

        <h1
          className="
            text-white
            text-4xl
            font-bold
            text-center
            mb-2
          "
        >
          Create Account
        </h1>

        <p
          className="
            text-zinc-400
            text-center
            mb-8
          "
        >
          Start sharing live location
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"

            onChange={handleChange}

            className="
              w-full
              bg-zinc-800
              border
              border-zinc-700
              rounded-2xl
              p-4
              text-white
              outline-none
            "
          />

          <input
            type="text"
            name="username"
            placeholder="Username"

            onChange={handleChange}

            className="
              w-full
              bg-zinc-800
              border
              border-zinc-700
              rounded-2xl
              p-4
              text-white
              outline-none
            "
          />

          <input
            type="email"
            name="email"
            placeholder="Email"

            onChange={handleChange}

            className="
              w-full
              bg-zinc-800
              border
              border-zinc-700
              rounded-2xl
              p-4
              text-white
              outline-none
            "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"

            onChange={handleChange}

            className="
              w-full
              bg-zinc-800
              border
              border-zinc-700
              rounded-2xl
              p-4
              text-white
              outline-none
            "
          />

          <button
            type="submit"
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              p-4
              rounded-2xl
              font-semibold
              transition
            "
          >
            Create Account
          </button>

        </form>

        <p
          className="
            text-zinc-400
            text-center
            mt-6
          "
        >
          Already have an account?{" "}

          <Link
            to="/login"
            className="
              text-blue-500
              hover:underline
            "
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;