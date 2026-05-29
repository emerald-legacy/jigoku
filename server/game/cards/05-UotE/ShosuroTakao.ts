import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class ShosuroTakao extends DrawCard {
    static id = 'shosuro-takao';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move this character into or out of the conflict',
            condition: () => this.game.isDuringConflict() && (this.game.currentConflict?.getNumberOfParticipants((card: any) => card.isDishonored) ?? 0) > 0,
            gameAction: [ability.actions.sendHome(), ability.actions.moveToConflict()]
        });
    }
}


export default ShosuroTakao;
