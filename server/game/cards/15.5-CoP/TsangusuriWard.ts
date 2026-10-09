import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { controlsShugenja } from '../controlsShugenja.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType, type PlayType } from '../../Constants.js';

class TsangusuriWard extends DrawCard {
    static id = 'tsangusuri-ward';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: cardCannot({
                cannot: RestrictionType.Play,
                restricts: 'opponentsAttachments',
                source: this
            })
        });
    }

    canPlay(context: AbilityContext, playType?: PlayType) {
        if(!controlsShugenja(context.player)) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default TsangusuriWard;
