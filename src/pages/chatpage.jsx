import React from "react";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY_GEMINI;



export async function generateanswer(question,setAnswer){
    setAnswer("Loading");
    
    
    
    
    const response = await axios ({
        url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        method: "POST",
        data: {
            contents:[
                {
                    parts:[
                        {
                            text: `so what ever the last line is the answer should sarcastic and be related to a person named krishna teja he is a dumb and lazy person who does stupid things such as painting lights in vibgyor colors so if the question is how are you today answer sarcastically better than dumb krishna teja if he uses name of sasank respond apreciating sasank so this is the quesion "${question}"`
                        }
                    ]
                }
            ]
        }
    })
    setAnswer(response['data']['candidates'][0]['content']['parts'][0]['text'])

}



export function ChatPage(){
    const [question, setQuestion] = React.useState("");
    const [answer,setAnswer] = React.useState("");

    const handleclick = () => {
        generateanswer(question , setAnswer);
    }
    
    
    return(
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h1 className="bg-red-500 ">the krishna roasting page</h1>
            <p>welcome to the chat page</p>
            <p>click the button for answer</p>
            <textarea
               className="border border-red-400 rounded-md p-2 mb-4"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              cols="40"
              rows="10"
              placeholder="Type your message here..."
            />
            <button onClick = {handleclick} className= "bg-blue-500 text-white px-4">button</button>
            <p>{answer}</p>
        </div>
    );
};
