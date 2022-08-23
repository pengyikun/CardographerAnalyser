import {useEffect, useState} from "react";
import {Item, SelectionUpdateEvent} from "@mirohq/websdk-types";

export const useSelection = () => {
    const [selectedItems, setSelectedItems] = useState<Item[] | undefined>(undefined)

    useEffect(() => {
        // Enable board items onSelect listener
        console.log(`[useSelection] Listening to card selection`)
        miro.board.ui.on('selection:update', selectionUpdateHandler)
        return () => {
            console.log(`[useSelection] Unsubscribe card selection listener`)
        }
    }, [])


    // Event handler that identifies user's current selected items
    let selectionUpdateHandler = async (event: SelectionUpdateEvent) => {
        setSelectedItems(event.items)
    }

    return {selectedItems}
}