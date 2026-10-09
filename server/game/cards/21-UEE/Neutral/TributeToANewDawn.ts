import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { removeFromGame } from '../../../GameActions/GameActions.js';
import { CardType, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const FIRST = 'first';
const SECOND = 'second';

export default class TributeToANewDawn extends DrawCard {
    static id = 'tribute-to-a-new-dawn';

    setupCardAbilities() {
        this.action('Remove multiple attachments from the game')
            .condition((context) =>
                context.player.anyCardsInPlay((card) => card.type === CardType.Attachment) &&
                (!context.player.opponent ||
                    context.player.opponent.anyCardsInPlay((card) => card.type === CardType.Attachment)))
            .targetCards({
                name: FIRST,
                activePromptTitle: 'Choose up to 2 attachments to keep',
                cardType: CardType.Attachment,
                mode: TargetMode.UpTo,
                numCards: 2,
                controller: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent),
                player: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent)
            })
            .targetCards({
                name: SECOND,
                activePromptTitle: 'Choose up to 2 attachments to keep',
                cardType: CardType.Attachment,
                mode: TargetMode.UpTo,
                numCards: 2,
                controller: (context) => (context.player.firstPlayer ? Players.Opponent : Players.Self),
                player: (context) => (context.player.firstPlayer ? Players.Opponent : Players.Self)
            })
            .gameAction(removeFromGame((context) => ({
                target: this.getAffectedAttachments(context, [...context.targets[FIRST], ...context.targets[SECOND]])
            })))
            .chatText((context) => msg`remove ${this.getAffectedAttachments(context, [...context.targets[FIRST], ...context.targets[SECOND]])} from the game`);
    }

    private getAffectedAttachments(context: AbilityContext<DrawCard>, keptAttachments: DrawCard[]) {
        const protectedAttachments = new WeakSet<DrawCard>(keptAttachments);

        return context.game.allCards.filter(
            (card): card is DrawCard => card.isDrawCard() && card.type === CardType.Attachment && card.isInPlay() && !protectedAttachments.has(card)
        );
    }
}
