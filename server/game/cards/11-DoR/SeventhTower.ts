import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class SeventhTower extends DrawCard {
    static id = 'seventh-tower';

    setupCardAbilities() {
        this.reaction({
            title: 'Resolve the ring effect',
            when: {
                afterConflict: (event, context) => {
                    if(context.player.isDefendingPlayer() && event.conflict.winner === context.player) {
                        let cards = event.conflict.getConflictProvinces().map(a => context.player.getDynastyCardsInProvince(a.location));
                        return cards.some(c => c.some(card => card.isFaceup() && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall')));
                    }
                    return false;
                }
            },
            gameAction: AbilityDsl.actions.resolveConflictRing()
        });
    }
}


export default SeventhTower;
