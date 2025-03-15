import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white text-center py-6">
      <p>&copy; {new Date().getFullYear()} Sakkaram - Instant Agricultural Vehicle Booking</p>
    </footer>
  );
};

export default Footer;