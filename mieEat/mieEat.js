let displayInterval;
let currentFood = "";
const customFoodInput = document.getElementById("custom-food");

function getFoodList() {
    const inputText = customFoodInput.value.trim();
    return inputText.split(/\s+/);
}

document.getElementById("start-btn").addEventListener("click", function() {
    const foodList = getFoodList();
    if (foodList.length > 0) {
        displayInterval = setInterval(() => {
            currentFood = foodList[Math.floor(Math.random() * foodList.length)];
            document.getElementById("food-display").innerText = currentFood;
        }, 10);
    }
});

document.getElementById("stop-btn").addEventListener("click", function() {
    clearInterval(displayInterval);
    alert(`肥羊决定吃 ${currentFood}`);
});
