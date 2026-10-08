import { msg } from '../../../GameChat.js';
import { CardType } from '../../../Constants.js';
import { unlimitedPerConflict } from '../../../AbilityLimit.js';
import { modifyBothSkills } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { controlsShugenja } from '../../controlsShugenja.js';

function penaltyAmount(context: AbilityContext): number {
    return context.player.hasAffinity('earth', context) ? -2 : -1;
}

export default class EarthsStagnation extends DrawCard {
    static id = 'earth-s-stagnation';

    public setupCardAbilities() {
        this.forcedReaction('Give attached character a skill penalty')
            .when({
                onCardPlayed: (event, context) =>
                    context.source.parentCharacter &&
                    event.card.type === CardType.Event &&
                    context.source.parentCharacter.isParticipating()
            })
            .cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: modifyBothSkills(penaltyAmount(context))
            }))
            .chatText((context) => {
                const penalty = penaltyAmount(context);
                return msg`give ${penalty}${'military'} and ${penalty}${'political'} to ${context.source.parentCharacter}`;
            })
            .limit(unlimitedPerConflict());
    }

    public canPlay(context: AbilityContext, playType: string) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}
