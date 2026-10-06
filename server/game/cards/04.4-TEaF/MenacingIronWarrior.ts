import { cannotTriggerAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { ConflictType } from '../../Constants.js';

class MenacingIronWarrior extends DrawCard {
    static id = 'menacing-iron-warrior';

    setupCardAbilities() {
        this.action('Disable abilities of weaker military characters')
            .condition(context => this.game.isDuringConflict(ConflictType.Military) && context.source.isParticipating())
            .gameAction(cardLastingEffect((context) => ({
                target: context.game.currentConflict ? context.game.currentConflict.getCharacters(context.player.opponent).filter((card) => card.getMilitarySkill() <= context.source.getMilitarySkill() && card !== context.source) : [],
                effect: cannotTriggerAbilities()
            })))
            .effect('prevent {1}\'s participating characters from using any abilities if their military skill is equal to or lower than {2}. This affects: {3}', context => {
                const conflict = context.game.currentConflict;
                const opp = context.player.opponent ?? context.player;
                const characters = conflict ? conflict.getCharacters(opp).filter((card) => card.getMilitarySkill() <= context.source.getMilitarySkill() && card !== context.source) : [];
                return [opp, context.source.getMilitarySkill(), characters];
            });
    }
}


export default MenacingIronWarrior;
