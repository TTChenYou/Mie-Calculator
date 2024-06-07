let responseCount = 0;

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function sendMessage() {
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const userText = userInput.value.trim();

  if (userText === '') return;

  // Append user message to chat box
  const userMessageContainer = document.createElement('div');
  userMessageContainer.classList.add('message-container', 'user');

  const userAvatar = document.createElement('img');
  userAvatar.src = './user.jpg'; // 用户头像图片路径

  const userMessageBubble = document.createElement('div');
  userMessageBubble.textContent = userText;
  userMessageBubble.classList.add('message-bubble', 'user-message');

  userMessageContainer.appendChild(userMessageBubble);
  userMessageContainer.appendChild(userAvatar); // 用户头像放在右边
  chatBox.appendChild(userMessageContainer);

  // Create AI loading message
  const aiMessageContainer = document.createElement('div');
  aiMessageContainer.classList.add('message-container', 'ai');

  const aiAvatar = document.createElement('img');
  aiAvatar.src = './ai.jpg'; // AI头像图片路径

  const aiMessageBubble = document.createElement('div');
  aiMessageBubble.classList.add('message-bubble', 'ai-response');

  const loadingSpinner = document.createElement('div');
  loadingSpinner.classList.add('loading-spinner'); // 添加加载状态

  aiMessageBubble.appendChild(loadingSpinner);

  aiMessageContainer.appendChild(aiAvatar);
  aiMessageContainer.appendChild(aiMessageBubble); // AI头像放在左边
  chatBox.appendChild(aiMessageContainer);

  // Clear the input field and keep focus
  userInput.value = '';
  userInput.focus();

  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;

  // Simulate AI response after 1-2 seconds
  setTimeout(() => {
    let aiResponseText;
    if (responseCount === 0) {
      aiResponseText = '再说一遍，没听清。';
    } else if (responseCount === 1) {
      aiResponseText = '我不知道，我饿了。';
    } else if (responseCount === 2) {
      aiResponseText = '我要去吃饭了，你自己玩吧。';
    } else if (responseCount === 3) {
      aiResponseText = '滚，我都说了不知道。';
    } else if (responseCount === 4) {
      aiResponseText = '滚，不知道。';
    } else if (responseCount === 5) {
      aiResponseText = '滚！！！';
    } else {
      aiResponseText = '您好，我现在有事不在，一会再和您联系。';
    }
    responseCount++;

    // Update AI message bubble with the actual response
    aiMessageBubble.removeChild(loadingSpinner);
    aiMessageBubble.textContent = aiResponseText;

    // Scroll to the bottom of the chat box again
    chatBox.scrollTop = chatBox.scrollHeight;
  }, Math.random() * 1000 + 1000); // 1-2 seconds delay
}
