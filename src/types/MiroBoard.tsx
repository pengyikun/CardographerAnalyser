export type BoardCard = {
    name: string;
    imageUrl: string;
    parentId: string | undefined;
}

export type BoardFrameRaw = {
    id: string;
    parentId: string;
    name: string;
}

export type BoardFrame = {
    id: string,
    name: string,
    cards: string[],
    stickyNotes: string[]
}