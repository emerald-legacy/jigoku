import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { unlimited } from '../../AbilityLimit.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { msg } from '../../GameChat.js';

class EruditePrestige extends DrawCard {
    static id = 'erudite-prestige';

    override setupCardAbilities() {
        this.attachmentConditions({
            trait: Trait.Courtier
        });

        this.reaction('Give attached character +1 political')
            .when({
                onCardPlayed: (event, context) => context.source.parentCharacter && event.player === context.player && context.source.parentCharacter.isParticipating()
            })
            .cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: modifyPoliticalSkill(1)
            }))
            .chatText((context) => msg`give +1${'political'} to ${context.source.parentCharacter}`)
            .limit(unlimited());
    }
}


export default EruditePrestige;
