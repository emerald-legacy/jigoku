import { msg } from '../../../GameChat.js';
import { reduceNextPlayedCardCost } from '../../../effects.js';
import {
    playCard,
    playerLastingEffect,
    sequential
} from '../../../GameActions/GameActions.js';
import { CardType, Location, PlayType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class Kuro extends DrawCard {
    static id = 'kuro';

    public override allowAttachment(attachment: DrawCard) {
        if(attachment.costLessThan(1)) {
            return false;
        }
        return super.allowAttachment(attachment);
    }

    public override setupCardAbilities() {
        this.conflictAction('Play opponent discarded attachment', { evenFromHome: true })
            .target({
                location: Location.ConflictDiscardPile,
                controller: Players.Opponent,
                cardType: CardType.Attachment,
                // only an attachment you can play on Kuro and pay for with the reduction (RRG Target)
                cardCondition: (card, context) =>
                    card.costAtLeast(1) && card.canAttach(this, { ignoreType: false, controller: this.controller }) &&
                    card.canPlay(context.copy({ source: card }), PlayType.Other) &&
                    context.player.getReducedCost(PlayType.Other, card, this) - 1 <= context.player.fate
            }, sequential([
                playerLastingEffect((context) => ({
                    target: Players.Self,
                    effect: reduceNextPlayedCardCost(1, (card) => card === context.target)
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
            .thenIf((context) => context.target.parent === context.source)
            .if((context) => context.source.isParticipating())
            .sendHome()
            .otherwise()
            .moveToConflict();
    }
}
