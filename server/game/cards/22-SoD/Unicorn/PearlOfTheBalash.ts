import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';


export default class PearlOfTheBalash extends DrawCard {
    static id = 'pearl-of-the-balash';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'shugenja'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addKeyword('covert')
        });
    }
}
