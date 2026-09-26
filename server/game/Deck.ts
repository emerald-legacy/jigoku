import { GameModes } from '../GameModes.js';
import { CardType, Location } from './Constants.js';
import { resolvePackId } from './CardPackUtil.js';
import { ProvinceCard } from './ProvinceCard.js';
import { RoleCard } from './RoleCard.js';
import { StrongholdCard } from './StrongholdCard.js';
import BaseCard from './BaseCard.js';
import DrawCard from './DrawCard.js';
import Player from './Player.js';
import type { CardData } from './types/CardData.js';
import type { DeckDTO } from '../gamenode/LobbyProtocol.js';
import type { CardClass } from './types/CardClass.js';

interface PreparedDeck {
    faction: DeckDTO['faction'];
    conflictCards: DrawCard[];
    dynastyCards: DrawCard[];
    provinceCards: ProvinceCard[];
    outOfPlayCards: DrawCard[];
    outsideTheGameCards: DrawCard[];
    stronghold: StrongholdCard | undefined;
    role: RoleCard | undefined;
    allCards: BaseCard[];
}

/** Builds the card's registered implementation; it must be a `base`, which is also the fallback. */
function createCard<T extends BaseCard>(player: Player, cardData: CardData, base: CardClass<T>): T {
    const Implementation = player.game.cardLibrary.get(cardData.id) ?? base;
    const card = new Implementation(player, cardData);
    if(!(card instanceof base)) {
        throw new Error(`Card '${cardData.id}' is implemented as ${card.constructor.name}, not ${base.name}`);
    }
    return card;
}

export class Deck {
    constructor(public data: DeckDTO) {}

    prepare(player: Player) {
        const result: PreparedDeck = {
            faction: this.data.faction,
            conflictCards: [],
            dynastyCards: [],
            provinceCards: [],
            outOfPlayCards: [],
            outsideTheGameCards: [],
            stronghold: undefined,
            role: undefined,
            allCards: []
        };

        //conflict
        for(const { count, card, pack_id: packId } of this.data.conflictCards ?? []) {
            for(let i = 0; i < count; i++) {
                if(card?.side === 'conflict') {
                    const conflictCard = createCard(player, card, DrawCard);
                    conflictCard.location = Location.ConflictDeck;
                    conflictCard.packId = resolvePackId(packId, card, player.game.gameMode);
                    result.conflictCards.push(conflictCard);
                }
            }
        }

        //dynasty
        for(const { count, card, pack_id: packId } of this.data.dynastyCards ?? []) {
            for(let i = 0; i < count; i++) {
                if(card?.side === 'dynasty') {
                    const dynastyCard = createCard(player, card, DrawCard);
                    dynastyCard.location = Location.DynastyDeck;
                    dynastyCard.packId = resolvePackId(packId, card, player.game.gameMode);
                    result.dynastyCards.push(dynastyCard);
                }
            }
        }

        //provinces
        if(player.game.gameMode !== GameModes.Skirmish) {
            for(const { count, card, pack_id: packId } of this.data.provinceCards ?? []) {
                for(let i = 0; i < count; i++) {
                    if(card?.type === CardType.Province) {
                        const provinceCard = createCard(player, card, ProvinceCard);
                        provinceCard.location = Location.ProvinceDeck;
                        provinceCard.packId = resolvePackId(packId, card, player.game.gameMode);
                        result.provinceCards.push(provinceCard);
                    }
                }
            }
        } else {
            for(let i = 0; i < 3; i++) {
                const provinceCard = new ProvinceCard(player, this.#makeSkirmishProvinceCardData(i));
                provinceCard.location = Location.ProvinceDeck;
                result.provinceCards.push(provinceCard);
            }
        }

        //stronghold & role
        if(player.game.gameMode !== GameModes.Skirmish) {
            for(const { count, card, pack_id: packId } of this.data.stronghold ?? []) {
                for(let i = 0; i < count; i++) {
                    if(card?.type === CardType.Stronghold) {
                        // Stays out of every pile until setup puts it into the stronghold province.
                        const strongholdCard = createCard(player, card, StrongholdCard);
                        strongholdCard.packId = resolvePackId(packId, card, player.game.gameMode);
                        result.stronghold = strongholdCard;
                    }
                }
            }
            for(const { count, card, pack_id: packId } of this.data.role ?? []) {
                for(let i = 0; i < count; i++) {
                    if(card?.type === CardType.Role) {
                        const roleCard = createCard(player, card, RoleCard);
                        roleCard.packId = resolvePackId(packId, card, player.game.gameMode);
                        result.role = roleCard;
                    }
                }
            }
        }

        for(const cardData of this.data.outsideTheGameCards ?? []) {
            const card = createCard(player, cardData, DrawCard);
            card.location = Location.OutsideTheGame;
            result.outsideTheGameCards.push(card);
        }

        result.allCards.push(...result.provinceCards, ...result.conflictCards, ...result.dynastyCards);

        if(result.stronghold) {
            result.allCards.push(result.stronghold);
        }
        if(result.role) {
            result.allCards.push(result.role);
        }

        return result;
    }

    #makeSkirmishProvinceCardData(provinceNumber: number): CardData {
        return {
            strength: 3,
            type: 'province',
            side: 'province',
            name: 'Skirmish Province',
            id: `skirmish-province-${provinceNumber}`
        };
    }
}
