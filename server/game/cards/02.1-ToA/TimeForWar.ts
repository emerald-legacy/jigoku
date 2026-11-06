import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { attach, selectCard } from '../../GameActions/GameActions.js';
import { CardSelector } from '../../CardSelector.js';
import { Location, Players, CardType, ConflictType, Trait } from '../../Constants.js';

class TimeForWar extends DrawCard {
    static id = 'time-for-war';

    override setupCardAbilities() {
        const attachAction = attach();
        this.reaction('Put a weapon into play')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictType === ConflictType.Political
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Bushi)
            }, selectCard((context) => ({
                activePromptTitle: 'Choose a weapon attachment',
                selector: CardSelector.for({
                    cardType: CardType.Attachment,
                    location: [Location.ConflictDiscardPile, Location.Hand],
                    controller: Players.Self,
                    cardCondition: (card) => card.isDrawCard() && card.costLessThan(4) && card.hasTrait(Trait.Weapon) && attachAction.canAffect(context.target, context, { attachment: card })
                }),
                message: (context, card, player) => msg`${player} chooses to attach ${card} to ${context.target}`,
                subActionProperties: (card) => ({ attachment: card }),
                gameAction: attachAction
            })))
            .chatText('attach a weapon to {0}');
    }
}


export default TimeForWar;
