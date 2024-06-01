function updateClock() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  document.getElementById("clock").textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock(); // Initial call to display the clock immediately

var productCount = 2;
var productLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function addProduct() {
  if (productCount >= productLabels.length) {
    alert("已达到最大商品数量");
    return;
  }
  var productDiv = document.createElement("div");
  productDiv.className = "product";
  productDiv.innerHTML = `
      <div class="product-header">
        <h2>商品 ${productLabels[productCount]}</h2>
        <button class="remove-button" onclick="removeProduct(this)">删除</button>
      </div>
      <div class="product-details">
        <label>商品价格 (円)</label>
        <input type="number" class="price" min="0" step="0.01" placeholder="输入商品价格" inputmode="decimal">
        <label>商品重量 (克or毫升or个数)</label>
        <input type="number" class="weight" min="0" step="0.01" placeholder="输入商品重量" inputmode="decimal">
      </div>
    `;
  document.getElementById("products").appendChild(productDiv);
  productCount++;
  updateRemoveButtons();
}

function removeProduct(button) {
  var productDiv = button.closest(".product");
  productDiv.parentElement.removeChild(productDiv);
  productCount--;
  updateProductLabels();
  updateRemoveButtons();
}

function updateProductLabels() {
  var products = document.querySelectorAll(".product");
  products.forEach((product, index) => {
    product.querySelector("h2").textContent = `商品 ${productLabels[index]}`;
  });
}

function updateRemoveButtons() {
  var removeButtons = document.querySelectorAll(".remove-button");
  removeButtons.forEach((button) => {
    button.style.display = productCount > 2 ? "block" : "none";
  });
}

function calculate() {
  var prices = document.querySelectorAll(".price");
  var weights = document.querySelectorAll(".weight");

  var results = [];
  for (var i = 0; i < prices.length; i++) {
    var price = parseFloat(prices[i].value);
    var weight = parseFloat(weights[i].value);

    if (isNaN(price) || isNaN(weight) || weight <= 0) {
      alert("请输入有效的价格和重量");
      return;
    }

    var costPerGram = price / weight;
    var weightPerYuan = weight / price;

    results.push({
      index: i,
      label: productLabels[i],
      costPerGram: costPerGram,
      weightPerYuan: weightPerYuan,
    });
  }

  results.sort((a, b) => a.costPerGram - b.costPerGram);

  var resultHTML = results
    .map(
      (result) => `
          <p>商品${
            result.label
          }每买1克or1毫升or1个，肥肥🐏要支付：${result.costPerGram.toFixed(
        2
      )} 円</p>
          <p>商品${
            result.label
          }每支付1円，肥肥🐏可以买到：${result.weightPerYuan.toFixed(
        2
      )} 克/毫升的此商品</p>
        `
    )
    .join("");

  if (results.length > 1 && results[0].costPerGram === results[1].costPerGram) {
    resultHTML += `<p class="highlight">两个商品性价比一样，肥肥🐏买哪个都可以。</p>`;
  } else {
    resultHTML += `<p class="highlight">最划算的是商品${results[0].label}，肥肥🐏买就完事了。</p>`;
  }

  document.getElementById("result").innerHTML = resultHTML;
}

// Initial call to update remove buttons visibility
updateRemoveButtons();
