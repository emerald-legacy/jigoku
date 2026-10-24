import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type { Ring } from '../../Ring.js';
import { controlsShugenja } from '../controlsShugenja.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class TsangusuriWard extends DrawCard {
    static id = 'tsangusuri-ward';

    override setupCardAbilities() {
        this.playOnlyIf((context) => controlsShugenja(context.player));

        this.whileAttached({
            effect: cardCannot({
                cannot: RestrictionType.Play,
                appliesTo: RestrictionScope.OpponentsAttachments,
                source: this
            })
        });
    }

    /** "Play only on a character you control": it stays attached if you lose control. */
    override canPlayOn(card: BaseCard | Ring): boolean {
        return 'controller' in card && card.controller === this.controller && super.canPlayOn(card);
    }
}


export default TsangusuriWard;
