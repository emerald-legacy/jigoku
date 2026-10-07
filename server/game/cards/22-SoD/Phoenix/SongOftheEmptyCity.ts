import { unlimitedPerConflict } from '../../../AbilityLimit.js';
import { discardCard, gainHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import { ConflictsDeclaredThisRound } from '../../ConflictsDeclaredThisRound.js';
import { moveHoldingAction, otherHoldingsInSameProvince } from '../../moveHolding.js';


export default class SongOfTheEmptyCity extends DrawCard {
    static id = 'song-of-the-empty-city';

    public setupCardAbilities() {
        const declaredConflicts = new ConflictsDeclaredThisRound(this.game);

        moveHoldingAction(this)
            .thenIf((context) => otherHoldingsInSameProvince(context).length > 0)
            .gameAction(discardCard((context) => ({ target: otherHoldingsInSameProvince(context) })))
            .message((context) => msg`${context.source} discards the other holdings in the province`);

        this.reaction('Gain honor')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.player.getProvinceCardInProvince(context.source.location)
            })
            .gameAction(gainHonor(context => ({
                amount: declaredConflicts.countAgainst(context.player.getProvinceCardInProvince(context.source.location))
            })))
            .limit(unlimitedPerConflict());
    }
}
