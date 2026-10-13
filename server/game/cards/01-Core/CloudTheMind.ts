import DrawCard from '../../DrawCard.js';
import { blank } from '../../effects.js';
import { controlsShugenja } from '../controlsShugenja.js';

class CloudTheMind extends DrawCard {
    static id = 'cloud-the-mind';

    setupCardAbilities() {
        this.playOnlyIf((context) => controlsShugenja(context.player));

        this.whileAttached({
            effect: blank()
        });
    }
}


export default CloudTheMind;


