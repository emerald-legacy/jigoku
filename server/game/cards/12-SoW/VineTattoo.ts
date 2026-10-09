import DrawCard from '../../DrawCard.js';
import { addTrait, cardCannot } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class VineTattoo extends DrawCard {
    static id = 'vine-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: [
                addTrait('tattooed'),
                cardCannot({
                    cannot: RestrictionType.Target,
                    appliesTo: RestrictionScope.EqualOrMoreExpensiveCharacterTriggeredAbilities,
                    source: this
                }),
                cardCannot({
                    cannot: RestrictionType.Target,
                    appliesTo: RestrictionScope.EqualOrMoreExpensiveCharacterKeywords,
                    source: this
                })
            ]
        });
    }
}


export default VineTattoo;
