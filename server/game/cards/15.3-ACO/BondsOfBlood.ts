import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BondsOfBlood extends DrawCard {
    static id = 'bonds-of-blood';

    setupCardAbilities() {
        this.action('Send a character home')
            .cost(AbilityDsl.costs.dishonor({ cardType: CardType.Character, cardCondition: card => card.isParticipating() }))
            .target({
                cardType: CardType.Character
            }, AbilityDsl.actions.sendHome())
            .gameAction(AbilityDsl.actions.sendHome(context => ({ target: context.costs.dishonor })))
            .effect('send {1} home', context => [context.costs.dishonor === context.target ? [context.target] : [context.target, context.costs.dishonor]])
            .cannotTargetFirst();
    }

    isTemptationsMaho() {
        return true;
    }
}


export default BondsOfBlood;
