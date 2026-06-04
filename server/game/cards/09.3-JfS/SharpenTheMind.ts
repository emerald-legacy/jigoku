import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location } from '../../Constants.js';

class SharpenTheMind extends DrawCard {
    static id = 'sharpen-the-mind';

    setupCardAbilities() {
        this.action({
            title: 'Give +3/+3 to attached character',
            cost: AbilityDsl.costs.discardCard({ location: Location.Hand }),
            condition: context => context.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyBothSkills(3)
            })),
            effect: 'give +3{1}/+3{2} to {3}',
            effectArgs: context => ['military', 'political', (context.source as DrawCard).parent as DrawCard]
        });
    }
}


export default SharpenTheMind;
