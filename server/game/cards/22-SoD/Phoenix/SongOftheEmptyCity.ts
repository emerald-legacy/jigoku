import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictsDeclaredThisRound } from '../../ConflictsDeclaredThisRound.js';
import { moveHoldingAction, otherHoldingsInSameProvince } from '../../moveHolding.js';


export default class SongOfTheEmptyCity extends DrawCard {
    static id = 'song-of-the-empty-city';

    public setupCardAbilities() {
        const declaredConflicts = new ConflictsDeclaredThisRound(this.game);

        moveHoldingAction(this)
            .then((context) => ({
                thenCondition: () => otherHoldingsInSameProvince(context).length > 0,
                gameAction: AbilityDsl.actions.discardCard(() => ({
                    target: otherHoldingsInSameProvince(context)
                })),
                message: '{1} discards the other holdings in the province'
            }));

        this.reaction('Gain honor')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.player.getProvinceCardInProvince(context.source.location)
            })
            .gameAction(AbilityDsl.actions.gainHonor(context => ({
                target: context.player,
                amount: declaredConflicts.countAgainst(context.player.getProvinceCardInProvince(context.source.location))
            })))
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}
