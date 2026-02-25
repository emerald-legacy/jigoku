import type { AbilityContext } from '../../../AbilityContext';
import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Players, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';

const FIRST = 'first';
const SECOND = 'second';

export default class TributeToANewDawn extends DrawCard {
    static id = 'tribute-to-a-new-dawn';

    setupCardAbilities() {
        this.action({
            title: 'Remove multiple attachments from the game',
            condition: (context) =>
                context.player.anyCardsInPlay((card: DrawCard) => card.type === CardTypes.Attachment) &&
                (!context.player.opponent ||
                    context.player.opponent.anyCardsInPlay((card: DrawCard) => card.type === CardTypes.Attachment)),
            targets: {
                [FIRST]: {
                    activePromptTitle: 'Choose up to 2 attachments to keep',
                    cardType: CardTypes.Attachment,
                    mode: TargetModes.UpTo,
                    numCards: 2,
                    controller: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent),
                    player: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent),
                    gameAction: AbilityDsl.actions.bow()
                },
                [SECOND]: {
                    activePromptTitle: 'Choose up to 2 attachments to keep',
                    cardType: CardTypes.Attachment,
                    mode: TargetModes.UpTo,
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
        for(const card of context.targets[FIRST]) {
            protectedAttachments.add(card);
        }
        for(const card of context.targets[SECOND]) {
            protectedAttachments.add(card);
        }

        return (context.game.allCards as Array<DrawCard>).filter(
            (card) => card.type === CardTypes.Attachment && card.isInPlay() && !protectedAttachments.has(card)
        );
    }
}
