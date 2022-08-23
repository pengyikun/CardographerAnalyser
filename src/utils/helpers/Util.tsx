import {compareAsc, format, parse} from 'date-fns'
import {BoardCard, BoardFrame, BoardFrameRaw} from "../../types/MiroBoard";
import {BoardNode, Frame, Image, Item, StickyNote} from "@mirohq/websdk-types";
import {CACard} from "../../types/ProcessedDataTypes";
import {
    LiveBoardAction, LiveBoardActionMapping,
    LiveBoardData,
    LiveBoardNodeMapping,
    LiveBoardObject
} from "../../types/Snapshot";

export const extractCardNameFromURL = (url: string): string | undefined => {
    const cardName = url.match(/([\w-]+)\.(jpg|png)/)
    if (cardName) {
        return cardName[1]
    }
    return undefined
}

export const getLiveBoardData = (nodes: Item[]): LiveBoardData => {
    const savedNodes: { [id: string]: LiveBoardObject } = {}
    nodes.forEach(node => {
        savedNodes[node.id] = {
            type: node.type,
            id: node.id,
            parentId: node.parentId ? node.parentId : undefined,
            title: node.type === LiveBoardNodeMapping.frame ? (node as Frame).title : undefined,
            cardName: node.type === LiveBoardNodeMapping.image ? extractCardNameFromURL((node as Image).url) : undefined,
            content: node.type === LiveBoardNodeMapping.sticky_note ? parseStickyNoteContent((node as StickyNote).content) : undefined,
        }
    })
    return {
        time: getCurrentTime(),
        nodes: savedNodes,
    }
}

export const diffLiveBoardData = (previous: LiveBoardData, current: LiveBoardData) => {
    const currentTime = getCurrentTimeWithOptions('HH:mm:ss')
    const actions: LiveBoardAction[] = []
    // Deleted nodes
    const currentIDs = Object.keys(current.nodes)
    Object.keys(previous.nodes).filter(id => !currentIDs.includes(id)).forEach(id => {
        const node = previous.nodes[id]
        actions.push({
            time: currentTime,
            type: LiveBoardActionMapping.DELETED,
            message: `Deleted ${parseNodeName(previous.nodes[id])}`,
            frame: node.type === LiveBoardNodeMapping.frame ? id : undefined,
            node: node,
        })
    })
    // Other actions
    for (let [id, node] of Object.entries(current.nodes)) {
        const previousNode = previous.nodes[id]
        if (!previousNode) {
            actions.push({
                time: currentTime,
                type: LiveBoardActionMapping.CREATE,
                message: `${parseNodeName(node)} created`,
                frame: node.parentId ? current.nodes[node.parentId].title : undefined,
                node: node,
            })
            continue
        }
        if (node.parentId !== previousNode.parentId) {
            if (!node.parentId) {
                actions.push({
                    time: currentTime,
                    type: LiveBoardActionMapping.SELECTED,
                    message: `${parseNodeName(node)} is selected at ${parseNodeName(previous.nodes[previousNode.parentId!])}`,
                    frame: node.parentId ? current.nodes[node.parentId].title : undefined,
                    node: node,
                })

            } else if (!previousNode.parentId) (
                actions.push({
                    time: currentTime,
                    type: LiveBoardActionMapping.MOVED,
                    message: `${parseNodeName(node)} moved to ${parseNodeName(current.nodes[node.parentId])}`,
                    frame: node.parentId ? current.nodes[node.parentId].title : undefined,
                    node: node,
                })
            )

        }
        if (node.type === LiveBoardNodeMapping.sticky_note) {
            if (node.content !== previousNode.content) {
                actions.push({
                    time: currentTime,
                    type: LiveBoardActionMapping.UPDATED,
                    message: `${parseNodeName(node)} updated`,
                    frame: node.parentId ? current.nodes[node.parentId].title : undefined,
                    node: node,
                })
            }
        }
    }
    return actions
}


const parseNodeName = (node: LiveBoardObject) => {
    if (node.type === LiveBoardNodeMapping.frame) {
        return `${node.type} ${node.title}`
    }
    if (node.type === LiveBoardNodeMapping.image) {
        return `${node.type} ${node.cardName}`
    }
    if (node.type === LiveBoardNodeMapping.sticky_note) {
        return `${node.type} ${node.id}`
    }
    return `${node.type} ${node.id}`
}


export const parseBoardData = (nodes: BoardNode[]) => {
    const frames = nodes.filter(n => n.type === 'frame')
    const images = nodes.filter(n => n.type === 'image')
    const stickyNotes = nodes.filter(n => n.type === 'sticky_note')
    let board: { [frameId: string]: BoardFrame } = {
        "misc": {
            id: "misc",
            name: "misc",
            cards: [],
            stickyNotes: []
        }
    }
    for (const frame of frames) {
        board[frame.id] = {
            id: frame.id,
            name: (frame as Frame).title,
            cards: [],
            stickyNotes: []
        }
    }
    for (const image of images) {
        const card = image as Image
        const cardName = extractCardNameFromURL(card.url)
        if (!cardName) {
            continue
        }
        const parentId = card.parentId
        if (parentId) {
            board[parentId].cards.push(cardName)
        } else {
            board["misc"].cards.push(cardName)
        }
    }
    for (const note of stickyNotes) {
        const idea = note as StickyNote
        const parentId = idea.parentId
        const content = parseStickyNoteContent(idea.content)
        if (parentId) {
            board[parentId].stickyNotes.push(content)
        } else {
            board["misc"].stickyNotes.push(content)
        }
    }
    return board
}

export const getCardsFromSelection = (items: Item[]) => {
    const images: Image[] = items.filter((item) => item.type === 'image') as Image[];
    return images.reduce((cards: BoardCard[], image: Image) => {
        //console.log(image)
        const name = extractCardNameFromURL(image.url)
        const parentId = image.parentId
        if (name) {
            return [...cards,
                {
                    name,
                    imageUrl: image.url,
                    parentId: parentId ? parentId : "Misc"
                }
            ]
        }
        return cards;
    }, [])
}

export const getFrameFromSelection = (items: Item[]) => {
    const frameNodes: Frame[] = items.filter((item) => item.type === 'frame') as Frame[];
    return frameNodes.reduce((frames: BoardFrameRaw[], frameNode: Frame) => {
        const {id, parentId, title} = frameNode
        if (title) {
            return [...frames,
                {
                    name: title,
                    id: id,
                    parentId: parentId ? parentId : "Misc"
                }
            ]
        }
        return frames;
    }, [])
}

export const getBoardData = async (nodes: BoardNode[]) => {
    // const images = await miro.board.get({type: ['image']})
    // const stickyNotes = await miro.board.get({type: ['sticky_note']})
    // Organize images and frames base on each images' parent frame
    return parseBoardData(nodes)
}

export const isSameCard = (a?: BoardCard, b?: BoardCard) => {
    return a === b || (a && b && a.name === b.name)
}


export const getCurrentTime = (): string => {
    return format(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

export const getCurrentTimeWithOptions = (options: string): string => {
    return format(new Date(), options)
}

export const parseTime = (timeStr: string): Date => {
    return parse(timeStr, 'yyyy-MM-dd HH:mm:ss', new Date())
}

export const compareTime = (newDate: Date, oldDate: Date): number => {
    return compareAsc(newDate, oldDate)
}

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const isCardCombinationEqual = (array1: CACard[], array2: CACard[]) => {
    return (array1.length == array2.length) && array1.every(function (element, index) {
        return element.id === array2[index].id;
    })
};

export const parseStickyNoteContent = (text: string) => {
    return text.replace(/(&nbsp;|<([^>]+)>)/ig, '')
}



