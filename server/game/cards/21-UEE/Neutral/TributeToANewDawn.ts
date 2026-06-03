import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const FIRST = 'first';
const SECOND = 'second';

export default class TributeToANewDawn extends DrawCard {
    static id = 'tribute-to-a-new-dawn';

    setupCardAbilities() {
        this.action({
            title: 'Remove multiple attachments from the game',
            condition: (context) =>
                context.player.anyCardsInPlay((card: DrawCard) => card.type === CardType.Attachment) &&
                (!context.player.opponent ||
                    context.player.opponent.anyCardsInPlay((card: DrawCard) => card.type === CardType.Attachment)),
            targets: {
                [FIRST]: {
                    activePromptTitle: 'Choose up to 2 attachments to keep',
                    cardType: CardType.Attachment,
                    mode: TargetMode.UpTo,
                    numCards: 2,
                    controller: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent),
                    player: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent),
                    gameAction: AbilityDsl.actions.bow()
                },
                [SECOND]: {
                    activePromptTitle: 'Choose up to 2 attachments to keep',
                    cardType: CardType.Attachment,
                    mode: TargetMode.UpTo,
                    numCards: 2,
                    controller: (context) => (context.player.firstPlayer ? Players.Opponent : Players.Self),
                    player: (context) => (context.player.firstPlayer ? Players.Opponent : Players.Self),
                    gameAction: AbilityDsl.actions.bow()
                }
            },
            gameAction: AbilityDsl.actions.removeFromGame((context) => ({
                target: this.#getAffectedAttachments(context)
            })),
            effect: 'remove {1} from the game',
            effectArgs: (context) => [this.#getAffectedAttachments(context)]
        });
    }

    #getAffectedAttachments(context: AbilityContext<any>) {
        const protectedAttachments = new WeakSet<DrawCard>();
        for(const card of context.targets[FIRST] as DrawCard[]) {
            protectedAttachments.add(card);
        }
        for(const card of context.targets[SECOND] as DrawCard[]) {
            protectedAttachments.add(card);
        }

        return (context.game.allCards as Array<DrawCard>).filter(
            (card) => card.type === CardType.Attachment && card.isInPlay() && !protectedAttachments.has(card)
        );
    }
}
