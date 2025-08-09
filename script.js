

const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");

let userText = null;
 // Use environment variable or fallback to a hardcoded key

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; 
}

const getChatResponse = async(incomingChatDiv) => {
    const API_URL = "http://localhost:3000/api/chat";
    const pElement = document.createElement("p");


//define the properties for the request
const requestOptions = {
    method: "POST",
    headers: {
            "Content-Type": "application/json",
           // "Authorization": `Bearer ${API_KEY}` // Ensure you have your API key set in your environment variables
        },
    
    body: JSON.stringify({
        model: "gpt-4o",  // or "gpt-4" / "gpt-4o"
        messages: [
            {
                role: "user",
                content: userText
            }
        ],
        max_tokens: 248,
        temperature: 0.4, // creativity of the response
        top_p: 1.0, // nucleus sampling
        n: 1,
        stop: null
    })

    }
    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            pElement.textContent = data.error?.message || "Sorry, something went wrong.";
        } else {
            pElement.textContent = data.choices[0].message.content.trim();
        }
    } 
    catch (error) {
        console.log(error);
        pElement.textContent = "Sorry, something went wrong.";
    }

    incomingChatDiv.querySelector(".typing-animation").remove(); // remove the typing animation
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement); // append the response text to the chat details
}
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
    getChatResponse(incomingChatDiv); // call the function to get the chat response
    
}


const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // get chat input value and trim whitespace
    if(!userText) return; // return if the userText is empty
    const html = `<div class = "chat-content">
                    <div class = "chat-details">
                        <img src = "https://cdn-icons-png.flaticon.com/512/9131/9131529.png" alt = "user-img">
                        <p></p>
                    </div>
                </div>`;

    // create a new chat div for outgoing message and append it to the chat container            
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    //to clear the input field after sending the message
    chatInput.value = "";
    setTimeout(showTypingAnimation, 400); // simulate typing animation after .4 second
    
}

sendButton.addEventListener("click", handleOutgoingChat);
chatInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevents adding a new line
        handleOutgoingChat();
    }
});
