const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");


let userText = null;
 // Use environment variable or fallback to a hardcoded key
let conversationHistory = JSON.parse(localStorage.getItem("conversationHistory")) || [];

const defaultText = `<div class = "default-text">
                            <h1>ChatGPT Clone</h1>
                            <p>Start a conversation and explore the power of AI.<br> Your Chat History will be shown here</p>
                        </div>`;

 const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
    chatContainer.innerHTML = localStorage.getItem("Chat-History") || defaultText; // Load chat history from local storage or show default text
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
 }

loadDataFromLocalStorage(); // Load chat history from local storage on page load


const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; 
}
const getChatResponse = async (incomingChatDiv) => {
    const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api/chat' 
        : 'https://chatgpt-clone-trrq.onrender.com/api/chat';

    const pElement = document.createElement("p");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // or your preferred model
                messages: conversationHistory // ✅ send the whole history
            })
        });

        const data = await response.json();
        console.log("AI response data:", data);

        const aiMessage = data.choices?.[0]?.message?.content || "No response from AI";
        pElement.textContent = aiMessage;

        // Store AI message in history
        conversationHistory.push({ role: "assistant", content: aiMessage });
        localStorage.setItem("conversationHistory", JSON.stringify(conversationHistory));

    } catch (error) {
        console.error(error);
        pElement.textContent = `Error: ${error.message}`;
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("Chat-History", chatContainer.innerHTML);
};


const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");// get the previous sibling element which is the response text
    navigator.clipboard.writeText(responseTextElement.textContent); // copy the response text to clipboard
    copyBtn.textContent = "check"; // change the icon to check after copying
    setTimeout(() =>  copyBtn.textContent = "content_copy", 1000); // change it back to content_copy after 2 seconds
}

const showTypingAnimation = () => {
    const html =`<div class = "chat-content">
                    <div class = "chat-details">
                        <img src="images/artificial-intelligence.png" alt="chatbot-img">
                        <div class = "typing-animation">
                            <div class = "typing-dot" style="--delay: 0.2s"></div>
                            <div class = "typing-dot" style="--delay: 0.3s"></div>
                            <div class = "typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>    
                    <span onclick= "copyResponse(this)"  class="material-symbols-rounded">content_copy</span>
                </div>`; 
    // create an incoming chat div with the typing animation and append it to the chat container  
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // auto scroll to the bottom of the chat container
    getChatResponse(incomingChatDiv); // call the function to get the chat response
    
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    // Add to conversation history
    conversationHistory.push({ role: "user", content: userText });
    localStorage.setItem("conversationHistory", JSON.stringify(conversationHistory));

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png" alt="user-img">
                        <p></p>
                    </div>
                  </div>`;
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);

    chatInput.value = "";
    chatInput.style.height = "55px";
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 400);
};


themeButton.addEventListener("click", () => {
    // Toggle light mode class on body and change button text accordingly
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    // Update the button text based on the current theme
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});


deleteButton.addEventListener("click", () => {
    // Clear chat history from local storage and chat container
    if (confirm("Are you sure you want to delete the chats?")) {
        localStorage.removeItem("Chat-History");
        loadDataFromLocalStorage();
        chatContainer.innerHTML = "";
        chatContainer.innerHTML = defaultText; // Show default text after deleting
        chatInput.style.height = "55px"; // Reset height to initial value
    }
});

const initialHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
    chatInput.style.height = "55px"; // Reset height to initial value
    chatInput.style.height = `${chatInput.scrollHeight}px`; // Adjust height based on content
});

chatInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevents adding a new line
        handleOutgoingChat();
        chatInput.style.height = "55px"; // Reset height after sending
    }
});

sendButton.addEventListener("click", handleOutgoingChat);