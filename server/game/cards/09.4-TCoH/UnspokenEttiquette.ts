import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class UnspokenEtiquette extends DrawCard {
    static id = 'unspoken-etiquette';

    setupCardAbilities() {
        this.action('Dishonor each participating non-courtier')
            .condition(context => context.game.isDuringConflict('political'))
            .gameAction(AbilityDsl.actions.dishonor(context => ({
                target: context.game.currentConflict?.getParticipants((card: DrawCard) => !card.hasTrait('courtier')) ?? []
            })))
            .effect('dishonor each participating non-courtier.');
    }
}


export default UnspokenEtiquette;

