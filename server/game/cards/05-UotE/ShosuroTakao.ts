import DrawCard from '../../drawcard.js';

class ShosuroTakao extends DrawCard {
    static id = 'shosuro-takao';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character into or out of the conflict',
            condition: () => this.game.isDuringConflict() && this.game.currentConflict.getNumberOfParticipants(card => card.isDishonored) > 0,
            gameAction: [ability.actions.sendHome(), ability.actions.moveToConflict()]
        });
    }
}


export default ShosuroTakao;
