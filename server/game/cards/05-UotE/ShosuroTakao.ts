import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class ShosuroTakao extends DrawCard {
    static id = 'shosuro-takao';

    setupCardAbilities() {
        this.action('Move this character into or out of the conflict')
            .condition(() => this.game.isDuringConflict() && (this.game.currentConflict?.getNumberOfParticipants((card) => card.isDishonored) ?? 0) > 0)
            .gameAction(AbilityDsl.actions.sendHome(), AbilityDsl.actions.moveToConflict());
    }
}


export default ShosuroTakao;
