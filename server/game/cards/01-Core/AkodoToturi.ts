import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class AkodoToturi extends DrawCard {
    static id = 'akodo-toturi';

    setupCardAbilities() {
        this.reaction({
            title: 'Resolve ring effect',
            when: {
                onClaimRing: (event, context) => this.game.isDuringConflict('military') && context.source.isParticipating() &&
                                                 event.player === context.player
            },
            gameAction: AbilityDsl.actions.resolveConflictRing()
        });
    }
}


export default AkodoToturi;
