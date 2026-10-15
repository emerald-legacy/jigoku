import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import { addKeyword } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class TattooedWanderer extends DrawCard {
    static id = 'tattooed-wanderer';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.whileAttached({
            effect: addKeyword('covert')
        });
    }
}
