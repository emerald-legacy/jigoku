import { unlimitedPerConflict } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';

export default class Sato extends DrawCard {
    static id = 'sato';

    public setupCardAbilities() {
        this.attachmentConditions({ opponentControlOnly: true });

        this.reaction('Force opponent to lose 1 honor')
            .when({
                onCardPlayed: (event, context) =>
                    context.source.parentCharacter &&
                    event.player === context.player.opponent &&
                    context.source.parentCharacter.isParticipating()
            })
            .loseHonor((context) => ({ target: context.player.opponent }))
            .limit(unlimitedPerConflict());
    }
}
