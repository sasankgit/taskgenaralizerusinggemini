import React from "react";
import axios from "axios";




export async function generateanswer(question){
    console.log("called");
    
    
    
    const response = await axios ({
        url: "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=AIzaSyBBtmEoJWHyikDVYZ7H-ObTbvX6r3Z6ZZM",
        method: "POST",
        data: {
            contents:[
                {
                    parts:[
                        {
                            text: question
                        }
                    ]
                }
            ]
        }
    })
    console.log(response['data']['candidates'][0]['content']['parts'][0]['text']);
}



export function ChatPage(){
    const [question, setQuestion] = React.useState("");

    const handleclick = () => {
        generateanswer(question);
    }
    
    
    return(
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h1>Chat Page</h1>
            <p>welcome to the chat page</p>
            <p>click the button for answer</p>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              cols="40"
              rows="10"
              placeholder="Type your message here..."
            />
            <button onClick = {handleclick} className= "bg-blue-500 text-white px-4">button</button>
        </div>
    );
};
