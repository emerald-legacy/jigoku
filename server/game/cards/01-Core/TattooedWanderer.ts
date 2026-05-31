import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class TattooedWanderer extends DrawCard {
    static id = 'tattooed-wanderer';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.whileAttached({
            effect: AbilityDsl.effects.addKeyword('covert')
        });
    }
}
