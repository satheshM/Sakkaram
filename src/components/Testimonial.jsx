import React from "react";

const testimonials = [
  {
    id: 1,
    name: "Ramesh Kumar",
    feedback: "The app helped me find a tractor quickly. Very useful!",
    location: "Tamil Nadu",
  },
  {
    id: 2,
    name: "Anita Devi",
    feedback: "Affordable and easy to use. Booking was simple!",
    location: "Karnataka",
  },
  {
    id: 3,
    name: "Vikram Singh",
    feedback: "Great service! Found a harvester within minutes.",
    location: "Punjab",
  },
];

const Testimonial = () => {
  return (
    <div className="bg-gray-100 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">What Farmers Say</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-4 rounded-lg shadow-md max-w-sm">
            <h3 className="font-semibold">{testimonial.name}</h3>
            <p className="italic">"{testimonial.feedback}"</p>
            <span className="text-sm text-gray-500">{testimonial.location}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
