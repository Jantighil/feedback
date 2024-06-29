document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedback-form');
  
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
  
      // Ensure DOMPurify is available
      if (typeof DOMPurify !== 'undefined') {
        const username = DOMPurify.sanitize(document.getElementById('username').value);
        const rating = DOMPurify.sanitize(document.querySelector('input[name="rating"]:checked').value);
        const feedback = DOMPurify.sanitize(document.getElementById('feedback').value);
  
        try {
          const response = await fetch('http://localhost:3000/api/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, rating, feedback })
          });
  
          if (response.ok) {
            fetchFeedback();
            form.reset();
          } else {
            alert('Error submitting feedback');
          }
        } catch (error) {
          console.error('Network error:', error);
        }
      } else {
        console.error('DOMPurify is not defined');
      }
    });
  
    async function fetchFeedback() {
      try {
        const response = await fetch('http://localhost:3000/api/feedback');
        if (!response.ok) {
          console.error('Failed to fetch feedback');
          return;
        }
  
        const feedbackList = await response.json();
        const feedbackContainer = document.getElementById('feedback-list');
        feedbackContainer.innerHTML = '';
  
        feedbackList.forEach(item => {
          const feedbackItem = document.createElement('div');
          feedbackItem.className = 'feedback-item';
          feedbackItem.innerHTML = `
            <strong>${DOMPurify.sanitize(item.username)}</strong> (${renderStars(item.rating)})
            <p>${DOMPurify.sanitize(item.feedback)}</p>
          `;
          feedbackContainer.appendChild(feedbackItem);
        });
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
      }
    }
  
    function renderStars(rating) {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '&#9733;' : '&#9734;';
      }
      return stars;
    }
  
    fetchFeedback();
  });
  