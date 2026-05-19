import DrawCard from '../../drawcard.js';

class MenacingIronWarrior extends DrawCard {
    static id = 'menacing-iron-warrior';

    setupCardAbilities(ability) {
        this.action({
            title: 'Disable abilities of weaker military characters',
            condition: context => this.game.isDuringConflict('military') && context.source.isParticipating(),
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: this.game.currentConflict.getCharacters(context.player.opponent).filter(card => card.getMilitarySkill() <= context.source.getMilitarySkill() && card !== context.source),
                effect: ability.effects.cardCannot('triggerAbilities')
            })),
            effect: 'prevent {1}\'s participating characters from using any abilities if their military skill is equal to or lower than {2}. This affects: {3}',
            effectArgs: context => [context.player.opponent, context.source.getMilitarySkill(), context.game.currentConflict.getCharacters(context.player.opponent).filter(card => card.getMilitarySkill() <= context.source.getMilitarySkill() && card !== context.source)]
        });
    }
}


export default MenacingIronWarrior;
