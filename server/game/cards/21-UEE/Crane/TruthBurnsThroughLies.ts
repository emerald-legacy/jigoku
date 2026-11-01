import { gainAbility } from '../../../effects.js';
import { dishonor } from '../../../GameActions/GameActions.js';
import { CardType, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class TruthBurnsThroughLies extends DrawCard {
    static id = 'truth-burns-through-lies';

    override setupCardAbilities() {
        this.attachmentConditions({ trait: [Trait.Courtier, Trait.Magistrate] });

        this.whileAttached({
            effect: gainAbility.conflictAction('Dishonor a character', (ability) => ability
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        card.isParticipating() &&
                        (context.source.hasTrait(Trait.Magistrate)
                            ? card.costAtMost(context.source.getCost())
                            : card.costLessThan(context.source.getCost()))
                }, dishonor()))
        });
    }
}
