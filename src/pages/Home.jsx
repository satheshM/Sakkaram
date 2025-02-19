import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Sakkaram</h1>
      <p className="text-gray-600 mb-6">
        Book an agricultural vehicle with ease!
      </p>
    </div>
  );
};

export default Home;





// import React from "react";
// import { useNavigate } from "react-router-dom";

// const LandingPage = () => {
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     localStorage.setItem("user", "true"); // Fake login (replace with real auth)
//     navigate("/home"); // Redirect to home page
//     window.location.reload(); // Refresh to apply navbar visibility
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center text-center p-8">
//       <h1 className="text-4xl font-bold mb-4">Welcome to Sakkaram 🚜</h1>
//       <p className="text-gray-600 mb-6">Find and book farm vehicles instantly!</p>
//       <button onClick={handleLogin} className="bg-green-500 text-white px-6 py-2 rounded">
//         Login / Sign Up
//       </button>
//     </div>
//   );
// };

// export default LandingPage;
