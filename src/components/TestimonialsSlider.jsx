// TestimonialsSlider.jsx
import { useState, useEffect } from "react";
import Testimonial from "./Testimonial";

const TestimonialsSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      content:
        '"The team at Premium Motors made finding my dream car an absolute pleasure. Their knowledge and no-pressure approach really set them apart."',
      author: "James Wilson",
      role: "BMW M5 Owner",
      image: "/api/placeholder/60/60",
    },
    {
      id: 2,
      content:
        '"From the moment I walked in, I felt valued as a customer. The follow-up service has been exceptional, and I couldn\'t be happier with my purchase."',
      author: "Sarah Johnson",
      role: "Mercedes GLE Owner",
      image: "/api/placeholder/60/60",
    },
    {
      id: 3,
      content:
        '"Premium Motors provided me with an exceptional car buying experience. Their attention to detail and customer service is unmatched."',
      author: "Michael Brown",
      role: "Audi Q7 Owner",
      image: "/api/placeholder/60/60",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="testimonials">
      <div className="container">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-slider">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              style={{ display: index === activeIndex ? "block" : "none" }}
            >
              <Testimonial testimonial={testimonial} />
            </div>
          ))}
        </div>
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
