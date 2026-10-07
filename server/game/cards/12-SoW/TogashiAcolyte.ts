import { CardType } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

export default class TogashiAcolyte extends DrawCard {
    static id = 'togashi-acolyte';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.reaction('Give attached character +1/+1')
            .when({
                onCardPlayed: (event, context) =>
                    context.source.parentCharacter &&
                    event.player === context.player &&
                    context.source.type === CardType.Attachment &&
                    context.source.parentCharacter.isParticipating()
            })
            .cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: modifyBothSkills(1)
            }))
            .effect((context) => msg`give +1${'political'} and +1${'military'} to ${context.source.parentCharacter}`)
            .limit(unlimitedPerConflict());
    }
}
