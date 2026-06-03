import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import CardSelector from '../../CardSelector.js';
import { Location, Players, CardType } from '../../Constants.js';

class TimeForWar extends DrawCard {
    static id = 'time-for-war';

    setupCardAbilities() {
        const attachAction = AbilityDsl.actions.attach();
        this.reaction({
            title: 'Put a weapon into play',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictType === 'political'
            },
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.selectCard(context => ({
                    selector: CardSelector.for({
                        activePromptTitle: 'Choose a weapon attachment',
                        cardType: CardType.Attachment,
                        location: [Location.ConflictDiscardPile, Location.Hand],
                        controller: Players.Self,
                        cardCondition: card => card.costLessThan(4) && card.hasTrait('weapon') && attachAction.canAffect(context.target, context, { attachment: card })
                    }),
                    message: '{0} chooses to attach {1} to {2}',
                    messageArgs: (card, player) => [player, card, context.target],
                    subActionProperties: card => ({ attachment: card }),
                    gameAction: attachAction
                }))
            },
            effect: 'attach a weapon to {0}'
        });
    }
}


export default TimeForWar;
