interface MatchableCardData {
    name: string;
    id: string;
    pack_code?: string;
}

export function matchCardByNameAndPack(labelOrName: string): (cardData: MatchableCardData) => boolean {
    let name = labelOrName;
    let pack: string | undefined;
    const match = labelOrName.match(/^(.*)\s\((.*)\)$/);
    if(match) {
        name = match[1];
        pack = match[2];
    }

    return function(cardData: MatchableCardData): boolean {
        return (cardData.name === name && (!pack || cardData.pack_code === pack)) ||
            cardData.id === name;
    };
}
