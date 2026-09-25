import type { AbilityContext } from '../AbilityContext.js';
import type BaseAbility from '../BaseAbility.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EffectName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import type { CardFor, CardKind, CardKindInput } from './types.js';

/** Read-only queries for the ability callbacks. */
export interface Utils {
    /** RRG "Side": a participating character on your side, or an attachment on it. */
    onOwnSide(card: BaseCard): boolean;
    /** RRG "Side": a participating character on the enemy side, or an attachment on it. */
    onEnemySide(card: BaseCard): boolean;

    /** Current military skill of the player's participating characters, as the conflict counts it. */
    militarySkill(player: undefined | Player): number;
    /** Current political skill of the player's participating characters, as the conflict counts it. */
    politicalSkill(player: undefined | Player): number;

    participants(filter?: (card: DrawCard) => boolean): DrawCard[];
    /** True when the player controls fewer participating characters than the opponent. */
    outnumbered(player: undefined | Player): boolean;
    highestPrintedCost(cards: undefined | readonly DrawCard[]): number;
    hasAffinity(trait: string, player: undefined | Player): boolean;

    /** True when the card has the kind. Narrows the card type. */
    is<const K extends CardKindInput>(card: undefined | BaseCard, kind: K): card is CardFor<K>;
    cardsInConflictProvince(player: Player): DrawCard[];
    /** The title of an ability, as its card shows it. */
    titleOf(ability: BaseAbility): string;
}

function kindList(kind: CardKindInput): readonly CardKind[] {
    return typeof kind === 'string' ? [kind] : kind;
}

export function createUtils(context: AbilityContext): Utils {
    const conflict = () => context.game.currentConflict ?? undefined;

    function sideOf(card: BaseCard): undefined | Player {
        const character = card.type === CardType.Attachment ? (card as DrawCard).parentCharacter : card;
        if(!character || character.type !== CardType.Character) {
            return undefined;
        }

        return (character as DrawCard).isParticipating() ? character.controller : undefined;
    }

    function currentSkill(player: undefined | Player, skill: (card: DrawCard) => number): number {
        const current = conflict();
        if(!current || !player) {
            return 0;
        }

        return current
            .getCharacters(player)
            .filter((card: DrawCard) => !card.bowed || card.anyEffect(EffectName.CanContributeWhileBowed))
            .reduce((total: number, card: DrawCard) => total + skill(card), 0);
    }

    return {
        onOwnSide: (card) => sideOf(card) === context.player,
        onEnemySide: (card) => {
            const side = sideOf(card);
            return side !== undefined && side !== context.player;
        },

        militarySkill: (player) => currentSkill(player, (card) => card.getMilitarySkill()),
        politicalSkill: (player) => currentSkill(player, (card) => card.getPoliticalSkill()),

        participants: (filter) => conflict()?.getParticipants(filter) ?? [],
        outnumbered(player) {
            const current = conflict();
            if(!current || !player) {
                return false;
            }

            return current.getNumberOfParticipantsFor(player) < current.getNumberOfParticipantsFor(player.opponent);
        },
        highestPrintedCost: (cards = []) => cards.reduce((highest, card) => Math.max(highest, card.printedCost ?? 0), 0),
        hasAffinity: (trait, player) => player?.hasAffinity(trait, context) ?? false,

        is: <const K extends CardKindInput>(card: undefined | BaseCard, kind: K): card is CardFor<K> =>
            card !== undefined && kindList(kind).includes(card.type as CardKind),
        cardsInConflictProvince(player) {
            const current = conflict();
            if(!current) {
                return [];
            }

            return current
                .getConflictProvinces()
                .filter((province) => province.controller === player)
                .flatMap((province) => player.getDynastyCardsInProvince(province.location));
        },
        titleOf: (ability) => (ability as { title?: string }).title ?? ''
    };
}
