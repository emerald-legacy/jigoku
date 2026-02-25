import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';


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
