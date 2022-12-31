export interface AITextCompletionResponse {
    id: string,
    object: string,
    created: number,
    model: string,
    choices: AITextCompletionChoices[],
}

export interface AITextCompletionChoices {
    text: string,
    index: number,
    finish_reason: string,
}

export interface AIImageGenerationResponse {
    created: number,
    data: AIImageGenerationData[]
}

export interface AIImageGenerationData {
    url: string,
}