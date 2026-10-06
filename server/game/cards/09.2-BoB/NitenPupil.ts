import DrawCard from '../../DrawCard.js';
import { modifyBaseMilitarySkillMultiplier, modifyBasePoliticalSkillMultiplier } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { Duration } from '../../Constants.js';

class NitenPupil extends DrawCard {
    static id = 'niten-pupil';

    setupCardAbilities() {
        this.reaction('Double base skills')
            .when({
                onHonorDialsRevealed: (event, context) => event.duel && event.duel.isInvolved(context.source)
            })
            .gameAction(cardLastingEffect({
                effect: [
                    modifyBaseMilitarySkillMultiplier(2),
                    modifyBasePoliticalSkillMultiplier(2)
                ],
                duration: Duration.UntilEndOfPhase
            }))
            .effect('double {0}\'s base {1} and {2} skills', () => (['military', 'political']));
    }
}


export default NitenPupil;
