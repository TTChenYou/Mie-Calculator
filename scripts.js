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

// 安全计算数学表达式
function evalMath(expression) {
  if (!expression) return NaN;
  try {
    const sanitized = expression.replace(/[^-()\d/*+.]/g, '');
    return new Function('return ' + sanitized)();
  } catch (e) {
    return NaN;
  }
}

// ==== 自定义键盘逻辑开始 ====
let activeInput = null;

function bindKeyboardToInput(inputElement) {
  inputElement.addEventListener('click', (e) => {
    e.stopPropagation();
    // 移除其他输入框的高亮状态
    document.querySelectorAll('.price, .weight').forEach(el => el.classList.remove('active-input'));
    // 激活当前输入框
    activeInput = inputElement;
    activeInput.classList.add('active-input');
    // 弹出键盘
    document.getElementById('custom-keyboard').classList.add('show');
  });
}

function initKeyboard() {
  // 绑定初始的输入框
  document.querySelectorAll('.price, .weight').forEach(bindKeyboardToInput);

  // 绑定键盘按键事件
  document.querySelectorAll('.kb-key').forEach(key => {
    key.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!activeInput) return;
      
      const val = e.target.getAttribute('data-val');
      let currentVal = activeInput.value;

      if (val === 'DEL') {
        activeInput.value = currentVal.slice(0, -1);
      } else if (val === 'C') {
        activeInput.value = '';
      } else if (val === 'OK') {
        // 点击确认时，如果是个公式，直接帮用户算出来
        const result = evalMath(currentVal);
        if (!isNaN(result) && currentVal !== '') {
            activeInput.value = result;
        }
        hideKeyboard();
      } else {
        activeInput.value += val;
      }
    });
  });

  // 点击页面空白处隐藏键盘
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#custom-keyboard') && !e.target.classList.contains('price') && !e.target.classList.contains('weight')) {
      hideKeyboard();
    }
  });
}

function hideKeyboard() {
  document.getElementById('custom-keyboard').classList.remove('show');
  if (activeInput) {
    activeInput.classList.remove('active-input');
    activeInput = null;
  }
}

// 页面加载完成后初始化键盘
document.addEventListener('DOMContentLoaded', initKeyboard);
// ==== 自定义键盘逻辑结束 ====

function addProduct() {
  if (productCount >= productLabels.length) {
    alert("你是猪？选这么多吃蛇皮");
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
        <input type="text" class="price" readonly placeholder="点击输入 (例如 500或10*5)">
        <label>商品重量 (克/毫升/个)</label>
        <input type="text" class="weight" readonly placeholder="点击输入 (例如 250或50*5)">
      </div>
    `;
  document.getElementById("products").appendChild(productDiv);
  
  // 给新生成的输入框绑定键盘
  bindKeyboardToInput(productDiv.querySelector('.price'));
  bindKeyboardToInput(productDiv.querySelector('.weight'));

  productCount++;
  updateRemoveButtons();
}

function removeProduct(button) {
  var productDiv = button.closest(".product");
  productDiv.parentElement.removeChild(productDiv);
  productCount--;
  updateProductLabels();
  updateRemoveButtons();
  hideKeyboard(); // 删除商品时顺便收起键盘
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
  hideKeyboard(); // 计算时收起键盘
  var prices = document.querySelectorAll(".price");
  var weights = document.querySelectorAll(".weight");

  var results = [];
  for (var i = 0; i < prices.length; i++) {
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
  hideKeyboard();
}

updateRemoveButtons();
