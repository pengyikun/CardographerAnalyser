import axios from "axios";
import {AIImageGenerationResponse, AITextCompletionResponse} from "../types/ai";


const endpoints = {
    textCompletion: "https://api.openai.com/v1/completions",
    imageGeneration: "https://api.openai.com/v1/images/generations",
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

export const getImageGeneration = async (secret: string, prompt: string, number: number, size: string) => {
    console.log(`Image gen prompt: ` + prompt)
    // return null
    const res = await axios.post(endpoints.imageGeneration,
        {
            "prompt": prompt,
            "n": number,
            "size": size
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${secret}`
            }
        })
    const {status} = res
    if (status === 200) {
        const response: AIImageGenerationResponse = res.data
        console.log(response)
        return response
    } else {
        console.log(`${status} Failed getting ai image generation response`)
        return null
    }
}