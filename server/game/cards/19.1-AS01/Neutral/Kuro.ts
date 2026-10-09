import { msg } from '../../../GameChat.js';
import { reduceNextPlayedCardCost } from '../../../effects.js';
import {
    moveToConflict,
    playCard,
    playerLastingEffect,
    sendHome,
    sequential
} from '../../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class Kuro extends DrawCard {
    static id = 'kuro';

    public allowAttachment(attachment: DrawCard) {
        if((attachment.printedCost ?? 0) < 1) {
            return false;
        }
        return super.allowAttachment(attachment);
    }

    public setupCardAbilities() {
        this.conflictAction('Play opponent discarded attachment', { evenFromHome: true })
            .target({
                location: Location.ConflictDiscardPile,
                controller: Players.Opponent,
                cardType: CardType.Attachment,
                cardCondition: (card) =>
                    (card.printedCost ?? 0) >= 1 && card.canAttach(this, { ignoreType: false, controller: this.controller })
            }, sequential([
                playerLastingEffect((context) => ({
                    targetController: context.player,
                    effect: reduceNextPlayedCardCost(1)
                })),
                playCard((context) => ({
                    source: this,
                    payCosts: true,
                    target: context.target,
                    playCardTarget: (attachContext) => {
                        attachContext.target = context.source;
                        attachContext.targets.target = context.source;
                    }
                }))
            ]))
            .chatText((context) => msg`seek the lost treasure '${context.target}'. ${context.source.isParticipating() ? 'Kuro returns home with their treasure' : 'Kuro swoops into the conflict'}`)
            .afterwards()
            .if((context) => context.source.isDrawCard() && context.source.isParticipating())
            .gameAction(sendHome((context) => ({ target: context.source })))
            .otherwise()
            .gameAction(moveToConflict((context) => ({ target: context.source })));
    }
}
