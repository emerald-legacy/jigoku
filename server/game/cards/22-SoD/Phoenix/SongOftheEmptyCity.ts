import { unlimited } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import { Players } from '../../../Constants.js';
import { moveHoldingAction, otherHoldingsInSameProvince } from '../../moveHolding.js';


export default class SongOfTheEmptyCity extends DrawCard {
    static id = 'song-of-the-empty-city';

    public override setupCardAbilities() {
        moveHoldingAction(this)
            .thenIf((context) => otherHoldingsInSameProvince(context).length > 0)
            .discardCard((context) => ({ target: otherHoldingsInSameProvince(context) }))
            .message((context) => msg`${context.source} discards the other holdings in the province`);

        this.reaction('Gain honor')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.player.getProvinceCardInProvince(context.source.location)
            })
            .gainHonor((context) => {
                const province = context.player.getProvinceCardInProvince(context.source.location);
                return { amount: context.game.getConflicts(Players.All).filter((conflict) => conflict.declaredProvince === province).length };
            })
            .limit(unlimited());
    }
}
