import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { msg } from '../../GameChat.js';

class EruditePrestige extends DrawCard {
    static id = 'erudite-prestige';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'courtier'
        });

        this.reaction('Give attached character +1 political')
            .when({
                onCardPlayed: (event, context) => context.source.parentCharacter && event.player === context.player && context.source.parentCharacter.isParticipating()
            })
            .cardLastingEffect(context => ({
                target: context.source.parentCharacter ?? [],
                effect: modifyPoliticalSkill(1)
            }))
            .effect((context) => msg`give +1${'political'} to ${context.source.parentCharacter}`)
            .limit(unlimitedPerConflict());
    }
}


export default EruditePrestige;
