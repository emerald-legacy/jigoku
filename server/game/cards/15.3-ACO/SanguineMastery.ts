import DrawCard from '../../DrawCard.js';
import { CardType, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SanguineMastery extends DrawCard {
    static id = 'sanguine-mastery';

    setupCardAbilities() {
        this.action('Discard attachments')
            .cost(AbilityDsl.costs.dishonor({ cardType: CardType.Character, cardCondition: card => card.glory > 0 }))
            .targetCards('target', {
                mode: TargetMode.UpToVariable,
                numCardsFunc: (context) => context.costs.dishonor ? context.costs.dishonor.glory : 1,
                cardType: CardType.Attachment
            }, AbilityDsl.actions.discardFromPlay())
            .cannotTargetFirst();
    }

    isTemptationsMaho() {
        return true;
    }
}


export default SanguineMastery;
