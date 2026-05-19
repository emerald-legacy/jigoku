import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BondsOfBlood extends DrawCard {
    static id = 'bonds-of-blood';

    setupCardAbilities() {
        this.action({
            title: 'Send a character home',
            cost: AbilityDsl.costs.dishonor({ cardCondition: card => card.isParticipating() }),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.allowGameAction('sendHome', context)
            },
            cannotTargetFirst: true,
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.sendHome(context => ({target: context.target })),
                AbilityDsl.actions.sendHome(context => ({target: context.costs.dishonor }))
            ])
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default BondsOfBlood;
