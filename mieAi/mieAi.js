let responseCount = 0;

function sendMessage () {
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const userText = userInput.value.trim();

  if (userText === '') return;

  // Append user message to chat box
  const userMessage = document.createElement('div');
  userMessage.textContent = '你: ' + userText;
  userMessage.classList.add('user-message');
  chatBox.appendChild(userMessage);

  // Generate AI response based on the number of times the button has been pressed
  let aiResponseText;
  if (responseCount === 0) {
    aiResponseText = '再说一遍，没听清。';
  } else {
    aiResponseText = '滚，不知道。';
  }
  responseCount++;

  // Append AI response to chat box
  const aiResponse = document.createElement('div');
  aiResponse.textContent = 'AI: ' + aiResponseText;
  aiResponse.classList.add('ai-response');
  chatBox.appendChild(aiResponse);

  // Clear the input field and keep focus
  userInput.value = '';
  userInput.focus();

  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;
}
