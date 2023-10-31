document.addEventListener('DOMContentLoaded', function () {

  //display all in specific category
  const categoryTitle = document.querySelectorAll('.category-title');
  const allCategoryPosts = document.querySelectorAll('.all');
  console.log(allCategoryPosts);
  for (let i = 0; i < categoryTitle.length; i++) {
    console.log(categoryTitle[i]);
    categoryTitle[i].addEventListener('click', filterPosts.bind(this, categoryTitle[i]));
  }

  function filterPosts(item) {
    console.log(item);
    changeActivePosition(item);
    for (let i = 0; i < allCategoryPosts.length; i++) {
      if (allCategoryPosts[i].classList.contains(item.attributes.id.value)) {
        allCategoryPosts[i].style.display = "block";
      } else {
        allCategoryPosts[i].style.display = "none";
      }
    }
  }

  function changeActivePosition(activeItem) {
    for (let i = 0; i < categoryTitle.length; i++) {
      categoryTitle[i].classList.remove('active');
    }
    activeItem.classList.add('active');
  };




  //Display new category input box
  const categorySelect = document.getElementById('category_id');
  const newCategoryInput = document.getElementById('new_category');
  const newCategoryImgInput = document.getElementById('new_category_img');

  categorySelect.addEventListener('change', function () {
    if (categorySelect.value === 'new') {
      newCategoryInput.style.display = 'block';
      newCategoryImgInput.style.display = 'block';
    } else {
      newCategoryInput.style.display = 'none';
      newCategoryImgInput.style.display = 'none';
    }
  });



}, false);

