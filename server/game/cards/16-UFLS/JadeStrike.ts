import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType, type PlayType } from '../../Constants.js';
import { setBaseMilitarySkill, setBasePoliticalSkill } from '../../effects.js';
import { cardLastingEffect, multiple, removeFate } from '../../GameActions/GameActions.js';
import { controlsShugenja } from '../controlsShugenja.js';

class JadeStrike extends DrawCard {
    static id = 'jade-strike';

    setupCardAbilities() {
        this.action('Set a characters base skills to 0/0')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasStatusTokens && card.isParticipating()
            }, multiple([
                cardLastingEffect({
                    effect: [
                        setBaseMilitarySkill(0),
                        setBasePoliticalSkill(0)
                    ]
                }),
                removeFate((context) => ({
                    target: context.target?.isTainted ? context.target : []
                }))
            ]))
            .chatText((context) => msg`${context.target.isTainted ? 'remove a fate from and ' : ''}set the base skills of ${context.chatTarget()} to 0${'military'}/0${'political'}`);
    }

    canPlay(context: AbilityContext, playType?: PlayType) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}


export default JadeStrike;
