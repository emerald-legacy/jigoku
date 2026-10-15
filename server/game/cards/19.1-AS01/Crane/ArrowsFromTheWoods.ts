import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyMilitarySkill } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictType, Trait } from '../../../Constants.js';
import { controlsParticipating } from '../../controlsParticipating.js';

export default class ArrowsFromTheWoods extends DrawCard {
    static id = 'arrows-from-the-woods';

    public setupCardAbilities() {
        this.action('Reduce opponent\'s characters mil')
            .condition((context) =>
                context.game.isDuringConflict(ConflictType.Military) &&
                controlsParticipating(context.player, Trait.Bushi))
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getCharacters(context.player.opponent) ?? [],
                effect: modifyMilitarySkill(this.penaltyValue(context))
            }))
            .chatText((context) => msg`give ${context.player.opponent}'s participating characters ${this.penaltyValue(context)}${'military'}`)
            .max(perConflict(1));
    }

    private penaltyValue(context: AbilityContext): number {
        return controlsParticipating(context.player, Trait.Scout, Trait.Shinobi) ? -2 : -1;
    }
}
