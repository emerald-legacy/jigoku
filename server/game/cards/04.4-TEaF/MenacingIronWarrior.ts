import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class MenacingIronWarrior extends DrawCard {
    static id = 'menacing-iron-warrior';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Disable abilities of weaker military characters',
            condition: context => this.game.isDuringConflict('military') && context.source.isParticipating(),
            gameAction: ability.actions.cardLastingEffect((context: any) => ({
                target: context.game.currentConflict ? context.game.currentConflict.getCharacters(context.player.opponent).filter((card: any) => card.getMilitarySkill() <= context.source.getMilitarySkill() && card !== context.source) : [],
                effect: ability.effects.cardCannot('triggerAbilities')
            })),
            effect: 'prevent {1}\'s participating characters from using any abilities if their military skill is equal to or lower than {2}. This affects: {3}',
            effectArgs: context => {
                const conflict = context.game.currentConflict;
                const opp = context.player.opponent ?? context.player;
                const characters = conflict ? conflict.getCharacters(opp).filter((card: any) => card.getMilitarySkill() <= context.source.getMilitarySkill() && card !== context.source) : [];
                return [opp, context.source.getMilitarySkill(), characters];
            }
        });
    }
}


export default MenacingIronWarrior;
