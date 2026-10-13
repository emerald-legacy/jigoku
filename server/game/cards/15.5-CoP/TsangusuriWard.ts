import DrawCard from '../../DrawCard.js';
import { controlsShugenja } from '../controlsShugenja.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class TsangusuriWard extends DrawCard {
    static id = 'tsangusuri-ward';

    setupCardAbilities() {
        this.playOnlyIf((context) => controlsShugenja(context.player));

        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: cardCannot({
                cannot: RestrictionType.Play,
                appliesTo: RestrictionScope.OpponentsAttachments,
                source: this
            })
        });
    }
}


export default TsangusuriWard;
