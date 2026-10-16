import DrawCard from '../../DrawCard.js';
import { ConflictType, Location } from '../../Constants.js';

class CallousAshigaru extends DrawCard {
    static id = 'callous-ashigaru';

    override setupCardAbilities() {
        this.attachmentConditions({
            unique: true
        });

        this.reaction('Discard cards from provinces')
            .when({
                onBreakProvince: (event, context) => event.conflict?.conflictType === ConflictType.Military && event.conflict.attackingPlayer === context.player &&
                    !!context.source.parentCharacter && context.source.parentCharacter.isAttacking()
            })
            .discardCard((context) => ({
                target: context.player.opponent ?
                    context.player.opponent.getDynastyCardsInProvince(Location.Provinces) :
                    []
            }));
    }
}


export default CallousAshigaru;

