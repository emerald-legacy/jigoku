import DrawCard from '../../drawcard.js';

class WarriorPoet extends DrawCard {
    static id = 'warrior-poet';

    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce skill of opponent\'s characters',
            condition: context => context.source.isParticipating(),
            effect: 'reduce the skill of all opposing characters',
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: this.game.currentConflict.getCharacters(context.player.opponent),
                effect: ability.effects.modifyBothSkills(-1)
            }))
        });
    }
}


export default WarriorPoet;
