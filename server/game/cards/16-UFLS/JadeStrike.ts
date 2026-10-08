import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType } from '../../Constants.js';
import { setBaseMilitarySkill, setBasePoliticalSkill } from '../../effects.js';
import { cardLastingEffect, multiple, removeFate } from '../../GameActions/GameActions.js';
import { controlsShugenja } from '../controlsShugenja.js';

class JadeStrike extends DrawCard {
    static id = 'jade-strike';

    setupCardAbilities() {
        this.action('Set a characters base skills to 0/0')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.hasStatusTokens && card.isParticipating()
            }, multiple([
                cardLastingEffect({
                    effect: [
                        setBaseMilitarySkill(0),
                        setBasePoliticalSkill(0)
                    ]
                }),
                removeFate(context => ({
                    target: context.target?.isTainted ? context.target : []
                }))
            ]))
            .chatText('{3}set the base skills of {0} to 0{1}/0{2}', context => ['military', 'political', context.target.isTainted ? 'remove a fate from and ' : '']);
    }

    canPlay(context: AbilityContext, playType: string) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}


export default JadeStrike;
