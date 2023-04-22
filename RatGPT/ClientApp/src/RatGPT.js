import React, { useState, useEffect, useRef } from "react";
import "./RatGPT.css";

const RatGPT = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleClear = () => {
    setMessages([]);
    setIsTyping(false);
    document.querySelector(".ratgpt-title").style.display = "block";
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const isInputEmpty = input.trim() === "";

  const messageEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (isTyping) {
      return;
    }

    if (input.trim()) {
      const inputLength = input.length;
      const maxSqueeks = 30 + (Math.floor(inputLength / 50) * 10);
      const squeeks = Math.floor(Math.random() * maxSqueeks) + 1;
      let squeekText = "";
      let squeeksInSentence = 0;
      let sentences = 0;
  
      // Generate squeekText based on random squeeks
      for (let i = 0; i < squeeks; i++) {
        if (i === 0 || squeekText.slice(-2) === ". " || squeekText.slice(-2) === "! " || squeekText.slice(-2) === "? ") {
          squeekText += "Squeek";
          squeeksInSentence = 1;
        } else {
          squeekText += "squeek";
          squeeksInSentence++;
        }
  
        // Add commas or spaces between squeeks
        if (i < squeeks - 1) {
          const commaRand = Math.random();
          if (squeeksInSentence >= 4) {
            if (commaRand < 0.1) {
              squeekText += ", ";
              squeeksInSentence = 0;
            } else {
              squeekText += " ";
            }
          } else if (squeeksInSentence >= 2) {
            if (commaRand < 0.3) {
              squeekText += ", ";
              squeeksInSentence = 0;
            } else {
              squeekText += " ";
            }
          } else {
            squeekText += " ";
          }
        } else {
          // Add punctuation to end of sentence
          const punctuationRand = Math.random();
          if (punctuationRand < 0.14) {
            squeekText += "!";
          } else if (punctuationRand < 0.21) {
            squeekText += "?";
          } else {
            squeekText += ".";
          }
          sentences++;
          squeeksInSentence = 0;
        }
      }
  
      // Determine how many RatGPT responses are needed based on number of sentences
      const responses = Math.ceil(sentences / 3);
      let responseIndex = 0;
  
      // Generate multiple RatGPT responses if necessary
      while (responseIndex < responses) {
        const start = responseIndex * 3;
        const end = start + 3;
        const response = squeekText.split('. ').slice(start, end).join('. ');
  
        // Add typing animation for each response
        const typingDelay = 25;
        let typedResponse = "";
        let index = 0;
        const typeText = () => {
          typedResponse += response[index];
          setMessages([...messages, { text: input, sender: "user" }, { text: typedResponse + "|", sender: "ratgpt" }]);
          if (index < response.length - 1) {
            index++;
            setTimeout(typeText, typingDelay);
            if (index === response.length - 1) {
              messageEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
            }
          } else {
            setMessages([...messages, { text: input, sender: "user" }, { text: typedResponse, sender: "ratgpt" }]);
            setIsTyping(false);
            messageEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
          }
        };
  
        
        setTimeout(typeText, typingDelay * (responseIndex + 1));
        responseIndex++;
      }
  
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setIsTyping(true);  
    }
  };
  

  return (
    <div className="page-container">
      <div className="sidebar">
      <div className="sidebar-button">
  <button onClick={handleClear}>
    <span className="add-icon"/>
    New Chat
  </button>
</div>
      </div>
      <div className="ratgpt-container">
        {messages.length === 0 && (
          <div className="ratgpt-title">
            RatGPT
          </div>
        )}
        <div className="message-container">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              <div className="message-content">
                {message.sender === "user" && (
                  <img src="/img/user.jpg" alt="User" width="30" height="30" />
                )}
                {message.sender === "ratgpt" && (
                  <img src="/img/ratgpt.jpg" alt="RatGPT" width="30" height="30" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
        <form className="input-container" onSubmit={handleSubmit}>
        <div className="input-wrapper">
            <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            autoComplete="off"
            />
            <button 
              type="submit" 
              className={`send-button ${(isInputEmpty || isTyping) ? "disabled" : ""}`}
              disabled={isInputEmpty || isTyping} 
              style={{ cursor: (isInputEmpty || isTyping) ? 'not-allowed' : 'pointer' }}>
                <span className="svg-icon" alt="send"/>
            </button>
        </div>
        </form>
      </div>
    </div>
  );
  
};

export default RatGPT;
