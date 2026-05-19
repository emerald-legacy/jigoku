import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class UnspokenEtiquette extends DrawCard {
    static id = 'unspoken-etiquette';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor each participating non-courtier',
            effect: 'dishonor each participating non-courtier.',
            condition: context => context.game.isDuringConflict('political'),
            gameAction: AbilityDsl.actions.dishonor(context => ({
                target: context.game.currentConflict.getParticipants(card => !card.hasTrait('courtier'))
            }))
        });
    }
}


export default UnspokenEtiquette;

