// cria a notificacao
const createSuccessNotification = () => {
    const notification = document.createElement("div");
    notification.className = "success-container";
  
    // checkmark icone
    const checkIcon = document.createElement("span");
    checkIcon.className = "check-icon";
    checkIcon.innerHTML = "✔"; 
    notification.appendChild(checkIcon);
  
    // Add the message
    const message = document.createElement("span");
    message.className = "success-message";
    message.textContent = "The data was saved successfully!";
    notification.appendChild(message);
  
    // adicionar a notificacao ao corpo
    document.body.appendChild(notification);
  
    // 
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };
  
  createSuccessNotification();
  