import DrawCard from '../../DrawCard.js';
import { Element, EventName, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
const elementKeys = {
    air: 'hallowed-ground-air',
    earth: 'hallowed-ground-earth',
    fire: 'hallowed-ground-fire'
};

class HallowedGround extends DrawCard {
    static id = 'hallowed-ground';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: context => context.game.rings[this.getCurrentElementSymbol(elementKeys.fire)].isConsideredClaimed(context.player.opponent),
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'placeFateWhenPlayingCharacter'
            })
        });

        this.persistentEffect({
            targetController: Players.Opponent,
            condition: context => context.game.rings[this.getCurrentElementSymbol(elementKeys.air)].isConsideredClaimed(context.player.opponent),
            effect: AbilityDsl.effects.playerDelayedEffect({
                when: {
                    afterConflict: (event: EventPayload<EventName.AfterConflict>, context: any) => event.conflict.loser === context.player.opponent && event.conflict.conflictUnopposed
                },
                message: '{0} loses 1 honor due to the constant effect of {1}',
                messageArgs: (effectContext: any) => [effectContext.player.opponent, effectContext.source],
                multipleTrigger: true,
                gameAction: AbilityDsl.actions.loseHonor()
            })
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKeys.air,
            prettyName: 'Honor Loss',
            element: Element.Air
        });
        symbols.push({
            key: elementKeys.earth,
            prettyName: 'Cannot Claim Rings',
            element: Element.Earth
        });
        symbols.push({
            key: elementKeys.fire,
            prettyName: 'Cannot Fate Characters',
            element: Element.Fire
        });
        return symbols;
    }
}


export default HallowedGround;
