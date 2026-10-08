import { msg } from '../../GameChat.js';
import { cannotTriggerAbilities } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class MenacingIronWarrior extends DrawCard {
    static id = 'menacing-iron-warrior';

    setupCardAbilities() {
        this.action('Disable abilities of weaker military characters')
            .condition((context) => this.game.isDuringConflict(ConflictType.Military) && context.source.isParticipating())
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict ? context.game.currentConflict.getCharacters(context.player.opponent).filter((card) => card.militarySkill <= context.source.militarySkill && card !== context.source) : [],
                effect: cannotTriggerAbilities()
            }))
            .chatText((context) => {
                const conflict = context.game.currentConflict;
                const opp = context.player.opponent ?? context.player;
                const characters = conflict ? conflict.getCharacters(opp).filter((card) => card.militarySkill <= context.source.militarySkill && card !== context.source) : [];
                return msg`prevent ${opp}'s participating characters from using any abilities if their military skill is equal to or lower than ${context.source.militarySkill}. This affects: ${characters}`;
            });
    }
}


export default MenacingIronWarrior;
