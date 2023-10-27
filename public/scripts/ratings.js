$(document).ready(function() {
  // Average rating
  const averageRating = parseFloat($('.average-rating').data('rating'));
  const starContainer = $('.star-container');

  // Clear existing stars
  starContainer.empty();

  //Generate star icons based on the average rating
  for (var i = 1; i <= 5; i++) {
    const starIcon = $('<i>').addClass('fas fa-star');
    if (i <= averageRating) {
      starIcon.addClass('active');
    }
    starContainer.append(starIcon);
  }
});
