import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { modifyBaseMilitarySkillMultiplier, modifyBasePoliticalSkillMultiplier } from '../../effects.js';
import { Duration } from '../../Constants.js';

class NitenPupil extends DrawCard {
    static id = 'niten-pupil';

    setupCardAbilities() {
        this.reaction('Double base skills')
            .when({
                onHonorDialsRevealed: (event, context) => event.duel && event.duel.isInvolved(context.source)
            })
            .cardLastingEffect({
                effect: [
                    modifyBaseMilitarySkillMultiplier(2),
                    modifyBasePoliticalSkillMultiplier(2)
                ],
                duration: Duration.UntilEndOfPhase
            })
            .chatText((context) => msg`double ${context.chatTarget()}'s base ${'military'} and ${'political'} skills`);
    }
}


export default NitenPupil;
