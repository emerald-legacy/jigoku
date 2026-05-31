import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiHotaru extends DrawCard {
    static id = 'doji-hotaru';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: (event, context) => this.game.isDuringConflict('political') && context.source.isParticipating() &&
                                                 event.player === context.player
            },
            gameAction: ability.actions.resolveConflictRing()
        });
    }
}


export default DojiHotaru;
