import { gainAbility } from '../../../effects.js';
import { dishonor } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class TruthBurnsThroughLies extends DrawCard {
    static id = 'truth-burns-through-lies';

    setupCardAbilities() {
        this.attachmentConditions({ trait: ['courtier', 'magistrate'] });

        this.whileAttached({
            effect: gainAbility.action('Dishonor a character', (ability) => ability
                .condition((context) => context.source.isParticipating())
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        card.isParticipating() &&
                        (context.source.hasTrait('magistrate')
                            ? (card.printedCost ?? 0) <= (context.source.printedCost ?? 0)
                            : (card.printedCost ?? 0) < (context.source.printedCost ?? 0))
                }, dishonor()))
        });
    }
}
