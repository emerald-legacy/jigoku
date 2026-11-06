import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Element, Players, RestrictionType } from '../../Constants.js';
import { playerCannot, playerDelayedEffect } from '../../effects.js';
import { loseHonor } from '../../GameActions/GameActions.js';

const elementKeys = {
    air: 'hallowed-ground-air',
    earth: 'hallowed-ground-earth',
    fire: 'hallowed-ground-fire'
};

class HallowedGround extends DrawCard {
    static id = 'hallowed-ground';

    override setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) => context.game.rings[this.getCurrentElementSymbol(elementKeys.fire)].isConsideredClaimed(context.player.opponent),
            effect: playerCannot({
                cannot: RestrictionType.PlaceFateWhenPlayingCharacter
            })
        });

        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) => {
                const conflict = context.game.currentConflict;
                return context.game.rings[this.getCurrentElementSymbol(elementKeys.earth)].isConsideredClaimed(context.player.opponent) &&
                    !!conflict && conflict.attackingPlayer === context.player.opponent &&
                    conflict.getConflictProvinces().some((province) => province.isBroken);
            },
            effect: playerCannot({
                cannot: RestrictionType.ClaimRings
            })
        });

        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) => context.game.rings[this.getCurrentElementSymbol(elementKeys.air)].isConsideredClaimed(context.player.opponent),
            effect: playerDelayedEffect({
                when: {
                    afterConflict: (event, context) => event.conflict.loser === context.player.opponent && event.conflict.conflictUnopposed
                },
                message: (effectContext) => msg`${effectContext.player.opponent} loses 1 honor due to the constant effect of ${effectContext.source}`,
                multipleTrigger: true,
                gameAction: loseHonor()
            })
        });
    }

    protected override printedElementSymbols = [
        {
            key: elementKeys.air,
            prettyName: 'Honor Loss',
            element: Element.Air
        },
        {
            key: elementKeys.earth,
            prettyName: 'Cannot Claim Rings',
            element: Element.Earth
        },
        {
            key: elementKeys.fire,
            prettyName: 'Cannot Fate Characters',
            element: Element.Fire
        }
    ];
}


export default HallowedGround;
