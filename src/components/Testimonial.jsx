// Testimonial.jsx
const Testimonial = ({ testimonial }) => {
  return (
    <div className="testimonial">
      <div className="testimonial-content">
        <p>{testimonial.content}</p>
      </div>
      <div className="testimonial-author">
        <img
          src={testimonial.image}
          alt={testimonial.author}
          className="author-image"
        />
        <div className="author-info">
          <h4>{testimonial.author}</h4>
          <p>{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
