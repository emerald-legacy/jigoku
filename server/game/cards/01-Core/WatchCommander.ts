import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { loseHonor } from '../../GameActions/GameActions.js';

class WatchCommander extends DrawCard {
    static id = 'watch-commander';

    setupCardAbilities() {
        this.attachmentConditions({
            limit: 1,
            myControl: true
        });

        this.reaction('Force opponent to lose 1 honor')
            .when({
                onCardPlayed: (event, context) => context.source.parentCharacter && event.player === context.player.opponent && context.source.parentCharacter.isParticipating()
            })
            .gameAction(loseHonor())
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default WatchCommander;
