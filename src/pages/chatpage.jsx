import React from "react";
import axios from "axios";

export async function generateanswer(){
    console.log("called");
    const response = await axios ({
        url: "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=AIzaSyBBtmEoJWHyikDVYZ7H-ObTbvX6r3Z6ZZM",
        method: "POST",
        data: {
            contents:[
                {
                    parts:[
                        {
                            text: "hello how are your today"
                        }
                    ]
                }
            ]
        }
    })
    console.log(response);
}



export function ChatPage(){
    return(
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h1>Chat Page</h1>
            <p>welcome to the chat page</p>
            <p>click the button for answer</p>
            <button onClick = {generateanswer} className= "bg-blue-500 text-white px-4">button</button>
        </div>
    );
};
