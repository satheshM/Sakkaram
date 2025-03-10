import React from "react";

const testimonials = [
  {
    id: 1,
    name: "Ramesh Kumar",
    feedback: "Sakkaram helped me find a tractor during peak season when none were available locally. The booking process was simple and the vehicle arrived on time.",
    location: "Tamil Nadu",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Anita Devi",
    feedback: "As a small farmer, owning equipment is expensive. This platform lets me rent what I need at affordable rates. The app is easy to use even for someone not tech-savvy.",
    location: "Karnataka",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
  },
  {
    id: 3,
    name: "Vikram Singh",
    feedback: "I needed a harvester urgently and found one within 10km of my farm. The owner was verified and the machine was in excellent condition. Saved my harvest!",
    location: "Punjab",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    rating: 5,
  },
  {
    id: 4,
    name: "Lakshmi Prasad",
    feedback: "I've been renting out my tractor when not in use. The platform handles everything from booking to payments securely. Great additional income!",
    location: "Andhra Pradesh",
    image: "https://randomuser.me/api/portraits/women/58.jpg",
    rating: 5,
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Testimonial = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thousands of farmers and vehicle owners across India trust Sakkaram for their agricultural vehicle needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-green-500"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              
              <StarRating rating={testimonial.rating} />
              
              <p className="mt-3 text-gray-600 italic flex-grow">"{testimonial.feedback}"</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-green-600 font-semibold">Verified User</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;