import DrawCard from '../../drawcard.js';
import { Durations } from '../../Constants.js';

class YoungHarrier extends DrawCard {
    static id = 'young-harrier';

    setupCardAbilities(ability: any) {
        this.action({
            title: 'Prevent other characters from being dishonored',
            cost: ability.costs.dishonorSelf(),
            effect: 'prevent Crane characters from being dishonored this phase',
            gameAction: ability.actions.cardLastingEffect((context: any) => ({
                duration: Durations.UntilEndOfPhase,
                target: context.player.cardsInPlay.filter((card: DrawCard) => card.isFaction('crane')),
                effect: ability.effects.cardCannot('dishonor')
            }))
        });
    }
}


export default YoungHarrier;
