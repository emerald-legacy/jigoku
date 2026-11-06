import { msg } from '../../GameChat.js';
import { cannotTriggerAbilities } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

function weakerOpponents(context: AbilityContext<DrawCard>): DrawCard[] {
    return context.game.currentConflict?.getCharacters(context.player.opponent).filter((card) => card.militarySkill <= context.source.militarySkill) ?? [];
}

class MenacingIronWarrior extends DrawCard {
    static id = 'menacing-iron-warrior';

    override setupCardAbilities() {
        this.action('Disable abilities of weaker military characters')
            .condition((context) => this.game.isDuringConflict(ConflictType.Military) && context.source.isParticipating())
            .cardLastingEffect((context) => ({
                target: weakerOpponents(context),
                effect: cannotTriggerAbilities()
            }))
            .chatText((context) => {
                const opp = context.player.opponent ?? context.player;
                return msg`prevent ${opp}'s participating characters from using any abilities if their military skill is equal to or lower than ${context.source.militarySkill}. This affects: ${weakerOpponents(context)}`;
            });
    }
}


export default MenacingIronWarrior;
