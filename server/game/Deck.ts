import { GameModes } from '../GameModes.js';
import { CardTypes, Locations } from './Constants.js';
import { resolvePackId } from './CardPackUtil.js';
import { ProvinceCard } from './ProvinceCard.js';
import { RoleCard } from './RoleCard.js';
import { StrongholdCard } from './StrongholdCard.js';
import BaseCard from './BaseCard.js';
import DrawCard from './DrawCard.js';
import Player from './Player.js';

export class Deck {
    constructor(public data: any) {}

    prepare(player: Player) {
        const result = {
            faction: this.data.faction,
            conflictCards: [] as DrawCard[],
            dynastyCards: [] as DrawCard[],
            provinceCards: [] as ProvinceCard[],
            outOfPlayCards: [] as DrawCard[],
            outsideTheGameCards: [] as DrawCard[],
            stronghold: undefined as StrongholdCard | undefined,
            role: undefined as RoleCard | undefined,
            allCards: [] as BaseCard[]
        };

        //conflict
        for(const { count, card, pack_id: packId } of this.data.conflictCards ?? []) {
            for(let i = 0; i < count; i++) {
                if(card?.side === 'conflict') {
                    const CardConstructor = player.game.cardLibrary.get(card.id) ?? DrawCard;
                    // @ts-expect-error -- CardConstructor is dynamically resolved from card registry, constructor signature not statically known
                    const conflictCard: DrawCard = new CardConstructor(player, card);
                    conflictCard.location = Locations.ConflictDeck;
                    conflictCard.packId = resolvePackId(packId, card, player.game.gameMode);
                    result.conflictCards.push(conflictCard);
                }
            }
        }

        //dynasty
        for(const { count, card, pack_id: packId } of this.data.dynastyCards ?? []) {
            for(let i = 0; i < count; i++) {
                if(card?.side === 'dynasty') {
                    const CardConstructor = player.game.cardLibrary.get(card.id) ?? DrawCard;
                    // @ts-expect-error -- CardConstructor is dynamically resolved from card registry, constructor signature not statically known
                    const dynastyCard: DrawCard = new CardConstructor(player, card);
                    dynastyCard.location = Locations.DynastyDeck;
                    dynastyCard.packId = resolvePackId(packId, card, player.game.gameMode);
                    result.dynastyCards.push(dynastyCard);
                }
            }
        }

        //provinces
        if(player.game.gameMode !== GameModes.Skirmish) {
            for(const { count, card, pack_id: packId } of this.data.provinceCards ?? []) {
                for(let i = 0; i < count; i++) {
                    if(card?.type === CardTypes.Province) {
                        const CardConstructor = player.game.cardLibrary.get(card.id) ?? ProvinceCard;
                        // @ts-expect-error -- CardConstructor is dynamically resolved from card registry, constructor signature not statically known
                        const provinceCard: ProvinceCard = new CardConstructor(player, card);
                        provinceCard.location = Locations.ProvinceDeck;
                        provinceCard.packId = resolvePackId(packId, card, player.game.gameMode);
                        result.provinceCards.push(provinceCard);
                    }
                }
            }
        } else {
            for(let i = 0; i < 3; i++) {
                const provinceCard = new ProvinceCard(player, this.#makeSkirmishProvinceCardData(i));
                provinceCard.location = Locations.ProvinceDeck;
                result.provinceCards.push(provinceCard);
            }
        }

        //stronghold & role
        if(player.game.gameMode !== GameModes.Skirmish) {
            for(const { count, card, pack_id: packId } of this.data.stronghold ?? []) {
                for(let i = 0; i < count; i++) {
                    if(card?.type === CardTypes.Stronghold) {
                        const CardConstructor = player.game.cardLibrary.get(card.id) ?? StrongholdCard;
                        // @ts-expect-error -- CardConstructor is dynamically resolved from card registry, constructor signature not statically known
                        const strongholdCard: StrongholdCard = new CardConstructor(player, card);
                        strongholdCard.location = '' as any;
                        strongholdCard.packId = resolvePackId(packId, card, player.game.gameMode);
                        result.stronghold = strongholdCard;
                    }
                }
            }
            for(const { count, card, pack_id: packId } of this.data.role ?? []) {
                for(let i = 0; i < count; i++) {
                    if(card?.type === CardTypes.Role) {
                        const CardConstructor = player.game.cardLibrary.get(card.id) ?? RoleCard;
                        // @ts-expect-error -- CardConstructor is dynamically resolved from card registry, constructor signature not statically known
                        const roleCard: RoleCard = new CardConstructor(player, card);
                        roleCard.packId = resolvePackId(packId, card, player.game.gameMode);
                        result.role = roleCard;
                    }
                }
            }
        }

        for(const cardData of this.data.outsideTheGameCards ?? []) {
            const CardConstructor = player.game.cardLibrary.get(cardData.id) ?? DrawCard;
            // @ts-expect-error -- CardConstructor is dynamically resolved from card registry, constructor signature not statically known
            const card: DrawCard = new CardConstructor(player, cardData);
            card.location = Locations.OutsideTheGame;
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

    #makeSkirmishProvinceCardData(provinceNumber: number) {
        return {
            strength: 3,
            element: [] as string[],
            type: 'province',
            side: 'province',
            name: 'Skirmish Province',
            id: `skirmish-province-${provinceNumber}`
        } as const;
    }
}
