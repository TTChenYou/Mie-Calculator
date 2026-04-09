function updateClock() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  document.getElementById("clock").textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

var productCount = 2;
var productLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// 【新增】安全计算数学表达式的函数
function evalMath(expression) {
  if (!expression) return NaN;
  try {
    // 过滤掉非法字符，只保留数字和数学符号，防止恶意代码注入
    const sanitized = expression.replace(/[^-()\d/*+.]/g, '');
    // 计算表达式结果
    return new Function('return ' + sanitized)();
  } catch (e) {
    return NaN;
  }
}

function addProduct() {
  if (productCount >= productLabels.length) {
    alert("你是猪？选这么多吃蛇皮");
    return;
  }
  var productDiv = document.createElement("div");
  productDiv.className = "product";
  // 注意：这里的 input type 也改成了 text
  productDiv.innerHTML = `
      <div class="product-header">
        <h2>商品 ${productLabels[productCount]}</h2>
        <button class="remove-button" onclick="removeProduct(this)">删除</button>
      </div>
      <div class="product-details">
        <label>商品价格 (円)</label>
        <input type="text" class="price" placeholder="例如: 500 或 100*5">
        <label>商品重量 (克/毫升/个)</label>
        <input type="text" class="weight" placeholder="例如: 250 或 50*5">
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
    // 【修改】用 evalMath 代替 parseFloat
    var price = evalMath(prices[i].value);
    var weight = evalMath(weights[i].value);

    if (isNaN(price) || isNaN(weight) || weight <= 0) {
      alert(`商品 ${productLabels[i]} 的输入有误，请输入正确的数字或公式！`);
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

  var resultHTML = "";

  if (results.length > 1) {
    resultHTML += `<p class="highlight">🏆 最划算的是商品 ${results[0].label}<br>🥈 排第2的是商品 ${results[1].label}`;
    if (results.length > 2) {
      for (var i = 2; i < results.length - 1; i++) {
        resultHTML += `，<br>排第${i + 1}的是商品 ${results[i].label}`;
      }
      resultHTML += `，<br>排倒数第2的是商品 ${results[results.length - 2].label}<br>🤡 最冤种的是商品 ${results[results.length - 1].label}</p>`;
    } else {
      resultHTML += `，<br>🤡 最冤种的是商品 ${results[1].label}</p>`;
    }
  } else {
    resultHTML += `<p class="highlight">🏆 只有它了，买商品 ${results[0].label} 吧</p>`;
  }

  resultHTML += results
    .map(
      (result) => `
        <div class="result-card">
          <strong>商品 ${result.label}</strong>
          <p>每 1 单位，肥肥🐏要支付 <span style="color:#e74c3c">${result.costPerGram.toFixed(4)}</span> 円</p>
          <p>每 1 円，肥肥🐏可以买到 <span style="color:#27ae60">${result.weightPerYuan.toFixed(2)}</span> 单位</p>
        </div>
      `
    )
    .join("");

  document.getElementById("result").innerHTML = resultHTML;
}

function clearForm() {
  var prices = document.querySelectorAll(".price");
  var weights = document.querySelectorAll(".weight");

  prices.forEach(price => price.value = '');
  weights.forEach(weight => weight.value = '');

  document.getElementById("result").innerHTML = '';
}

// Initial call
updateRemoveButtons();

function eatTest() {
  alert('肥羊吃啥功能正在开发中，敬请期待！(吃屁吧你)');
}
