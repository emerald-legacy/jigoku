import DrawCard from '../../DrawCard.js';
import { attach, selectCard } from '../../GameActions/GameActions.js';
import { CardSelector } from '../../CardSelector.js';
import { Location, Players, CardType, ConflictType } from '../../Constants.js';

class TimeForWar extends DrawCard {
    static id = 'time-for-war';

    setupCardAbilities() {
        const attachAction = attach();
        this.reaction('Put a weapon into play')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictType === ConflictType.Political
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('bushi')
            }, selectCard((context) => ({
                activePromptTitle: 'Choose a weapon attachment',
                selector: CardSelector.for({
                    cardType: CardType.Attachment,
                    location: [Location.ConflictDiscardPile, Location.Hand],
                    controller: Players.Self,
                    cardCondition: (card) => card.isDrawCard() && card.costLessThan(4) && card.hasTrait('weapon') && attachAction.canAffect(context.target, context, { attachment: card })
                }),
                message: '{0} chooses to attach {1} to {2}',
                messageArgs: (card, player) => [player, card, context.target],
                subActionProperties: (card) => ({ attachment: card }),
                gameAction: attachAction
            })))
            .chatText('attach a weapon to {0}');
    }
}


export default TimeForWar;
