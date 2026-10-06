import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class SharpenTheMind extends DrawCard {
    static id = 'sharpen-the-mind';

    setupCardAbilities() {
        this.action('Give +3/+3 to attached character')
            .cost(AbilityDsl.costs.discardCard({ location: Location.Hand }))
            .condition(context => context.game.isDuringConflict())
            .gameAction(cardLastingEffect(context => ({
                target: context.source.parentCharacter ?? [],
                effect: modifyBothSkills(3)
            })))
            .effect((context) => msg`give +3${'military'}/+3${'political'} to ${context.source.parentCharacter}`);
    }
}


export default SharpenTheMind;
