import axios from "axios";
import {AITextCompletionResponse} from "../types/ai";


const endpoints = {
    textCompletion: "https://api.openai.com/v1/completions",
}

export const getTextCompletion = async (secret: string, prompt: string) => {
    console.log(prompt)
    console.log(secret)
    // return null
    const res = await axios.post(endpoints.textCompletion,
        {
            "model": "text-davinci-003",
            "prompt": prompt,
            "temperature": 0,
            "max_tokens": 1000
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${secret}`
            }
        })
    const {status} = res
    if (status === 200) {
        const response: AITextCompletionResponse = res.data
        console.log(response)
        return response
    } else {
        console.log(`${status} Failed getting ai text completion response`)
        return null
    }
}