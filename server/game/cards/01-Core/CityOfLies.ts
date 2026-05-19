import DrawCard from '../../drawcard.js';
import { Durations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CityOfLies extends DrawCard {
    static id = 'city-of-lies';

    setupCardAbilities() {
        this.action({
            title: 'Reduce cost of next event by 1',
            effect: 'reduce the cost of their next event by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card.type === CardTypes.Event)
            }))
        });
    }
}


export default CityOfLies;
