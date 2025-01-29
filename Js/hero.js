let currentIndex = 0;
const visibleItemsCount = 3; //---kjo behet me const(konstant) se nuk ndryshon dmth ushqimi ne faqe
let currentFoodPrice = 0;
let currentQuantity = 1;

async function fetchFoodData() {
  try {
    const response = await fetch("Js/food.json");
    const foodData = await response.json();
    
    
    const initialCategory = "Lunch";
    renderFoodCarousel(foodData.categories[initialCategory]);

    updateHeroImage(foodData.categories[initialCategory][0]);
    setupArrowNavigation(foodData.categories[initialCategory]);
  } catch (error) {
    console.log("Error fetching food data", error);
  }
}

function renderFoodCarousel(foods) {
  const foodItemsContainer = document.querySelector(".food-items");
  foodItemsContainer.innerHTML = "";

  foods.forEach((food, index) => {
    const foodItem = document.createElement("div");
    foodItem.classList.add("food-item");
    if (index === 0) {
      foodItem.classList.add("selected");
    }

    foodItem.innerHTML = `
                <img src="${food.image}" alt="${food.name}">
                <p>
                    ${food.name} <br>
                    <span class="item-price"><span class="valute">$</span>${food.price.toFixed(
                      2
                    )} </span>
                </p>
            `;

    if (index >= visibleItemsCount) {
      foodItem.style.display = "none";
    }

    foodItem.addEventListener("click", () => {
      selectFoodItem(food, foodItem);
      currentIndex = index;
    });

    foodItemsContainer.appendChild(foodItem);
  });
}

function updateTotalPrice() {
  const totalPriceElement = document.querySelector(".order-info-total .price");
  const total = currentFoodPrice * currentQuantity;
  totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(newQuantity) {
  currentQuantity = newQuantity;
  document.querySelector(".quantity").textContent = currentQuantity;
  updateTotalPrice();
}

document.getElementById("increase").addEventListener("click", () => {
  updateQuantity(currentQuantity + 1);
});

document.getElementById("decrease").addEventListener("click", () => {
  if (currentQuantity > 1) {
    updateQuantity(currentQuantity - 1);
  }
});

function selectFoodItem(selectedFood, selectedElement) {
  updateHeroImage(selectedFood);

  currentFoodPrice = selectedFood.price;
  currentQuantity = 1;
  updateQuantity(currentQuantity);

  const allFoodItems = document.querySelectorAll("food-item");
  allFoodItems.forEach((item) => item.classList.remove("selected"));

  selectedElement.classList.add("selected");
}

function updateHeroImage(food) {
  const heroImage = document.querySelector(".hero-main-image");
  const foodTitle = document.querySelector(".food-title p:first-of-type");
  const foodRating = document.querySelector(".food-title p:last-of-type");
  const preparationTime = document.querySelector(".prepare-time");

  heroImage.src = food.image;
  heroImage.alt = food.name;
  foodTitle.textContent = food.name;
  foodRating.innerHTML = `<i class="fa-solid fa-star"></i>${food.rating}`;
  preparationTime.innerHTML = `<i class="fa-regular fa-clock"></i>${food.preparationTime}`;
}

function updateVisibleItems(foods) {
  
  const foodItems = document.querySelectorAll(".food-item");

  foodItems.forEach((item, index) => {
    if (index >= currentIndex && index < currentIndex + visibleItemsCount) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
    
  });
}

function setupArrowNavigation(foods) {
  
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  leftArrow.addEventListener("click", () => {
    console.log("kliko ketu");
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = foods.length - visibleItemsCount;
    }

    updateVisibleItems(foods);
  });

  rightArrow.addEventListener("click", () => {
    if (currentIndex < foods.length - visibleItemsCount) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateVisibleItems(foods);
  });
}

function addToCart(selectedFood) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItemIndex = cart.findIndex(
    (item) => item.name === selectedFood.name
  );

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += currentQuantity;
  } else {
    cart.push({
      name: selectedFood.name,
      price: selectedFood.price,
      image: selectedFood.image,
      quantity: currentQuantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartBadge();

  Toastify({
    text: `${selectedFood.name} added to the cart!`,
    duration: 3000,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    backgroundColor: "#ff7a00",
    stopOnFocus: true,
  }).showToast();
}

function updateCartBadge() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalUniqueItems = cart.length;

  console.log(totalUniqueItems);

  document.getElementById("cart-badge").textContent = totalUniqueItems;
}

document.querySelector(".add-to-Cart").addEventListener("click", () => {
  const selectedFood = {
    name: document.querySelector(".food-title p:first-of-type").textContent,
    price: currentFoodPrice,
    image: document.querySelector(".hero-main-image").src,
  };

  addToCart(selectedFood);
});

document.addEventListener("DOMContentLoaded", () => {
  fetchFoodData();
  updateCartBadge();
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".email-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Parandalon rifreskimin e faqes

    let name = document.getElementById("name")?.value.trim();
    let email = document.getElementById("email")?.value.trim();
    let subject = document.getElementById("subject")?.value.trim();
    let message = document.getElementById("message")?.value.trim();
    let errorBox = document.getElementById("formError");

    if (name === "" || email === "" || subject === "" || message === "") {
      errorBox.textContent = "Please fill in all fields!";
      return;
    }

    if (!validateEmail(email)) {
      errorBox.textContent = "Invalid email format!";
      return;
    }

    errorBox.textContent = ""; 

    

    Toastify({
      text: "Message sent successfully! ✅",
      duration: 3000,  // Sa gjatë të shfaqet (ms)
      gravity: "top", // Pozicioni (top/bottom)
      position: "center", // Djathtas
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // Ngjyra
    }).showToast();

    
  });

  

  function validateEmail(email) {
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  
});

