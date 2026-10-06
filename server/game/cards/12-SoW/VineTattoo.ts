import DrawCard from '../../DrawCard.js';
import { addTrait, cardCannot } from '../../effects.js';

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
                    cannot: 'target',
                    restricts: 'equalOrMoreExpensiveCharacterTriggeredAbilities',
                    source: this
                }),
                cardCannot({
                    cannot: 'target',
                    restricts: 'equalOrMoreExpensiveCharacterKeywords',
                    source: this
                })
            ]
        });
    }
}


export default VineTattoo;
