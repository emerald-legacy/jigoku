import DrawCard from '../../DrawCard.js';
import { addTrait, cardCannot } from '../../effects.js';
import { RestrictionType } from '../../Constants.js';

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
                    restricts: 'equalOrMoreExpensiveCharacterTriggeredAbilities',
                    source: this
                }),
                cardCannot({
                    cannot: RestrictionType.Target,
                    restricts: 'equalOrMoreExpensiveCharacterKeywords',
                    source: this
                })
            ]
        });
    }
}


export default VineTattoo;
