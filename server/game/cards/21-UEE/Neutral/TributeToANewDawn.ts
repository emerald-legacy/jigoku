import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const FIRST = 'first';
const SECOND = 'second';

export default class TributeToANewDawn extends DrawCard {
    static id = 'tribute-to-a-new-dawn';

    setupCardAbilities() {
        this.action('Remove multiple attachments from the game')
            .condition((context) =>
                context.player.anyCardsInPlay((card: DrawCard) => card.type === CardType.Attachment) &&
                (!context.player.opponent ||
                    context.player.opponent.anyCardsInPlay((card: DrawCard) => card.type === CardType.Attachment)))
            .targetCards(FIRST, {
                activePromptTitle: 'Choose up to 2 attachments to keep',
                cardType: CardType.Attachment,
                mode: TargetMode.UpTo,
                numCards: 2,
                controller: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent),
                player: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent)
            }, AbilityDsl.actions.bow())
            .targetCards(SECOND, {
                activePromptTitle: 'Choose up to 2 attachments to keep',
                cardType: CardType.Attachment,
                mode: TargetMode.UpTo,
                numCards: 2,
                controller: (context) => (context.player.firstPlayer ? Players.Opponent : Players.Self),
                player: (context) => (context.player.firstPlayer ? Players.Opponent : Players.Self)
            }, AbilityDsl.actions.bow())
            .gameAction(AbilityDsl.actions.removeFromGame((context) => ({
                target: this.#getAffectedAttachments(context)
            })))
            .effect('remove {1} from the game', (context) => [this.#getAffectedAttachments(context)]);
    }

    #getAffectedAttachments(context: AbilityContext<DrawCard>) {
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
