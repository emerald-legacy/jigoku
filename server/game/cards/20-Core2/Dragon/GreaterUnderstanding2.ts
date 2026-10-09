import { msg } from '../../../GameChat.js';
import { immunity } from '../../../effects.js';
import { attachToRing, resolveRingEffect, selectRing } from '../../../GameActions/GameActions.js';
import { Location, Players, RestrictionScope } from '../../../Constants.js';
import Ring from '../../../Ring.js';
import { RingAttachment } from '../../RingAttachment.js';

export default class GreaterUnderstanding2 extends RingAttachment {
    static id = 'greater-understanding-2';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Any,
            effect: immunity({
                appliesTo: RestrictionScope.OpponentsCardEffects
            })
        });

        this.reaction('Resolve the attached ring\'s effect')
            .when({
                onMoveFate: (event, context) => event.recipient === context.source.parent,
                onPlaceFateOnUnclaimedRings: (_event, context) => context.source.parent instanceof Ring && context.source.parent.isUnclaimed()
            })
            .gameAction(resolveRingEffect((context) => ({ target: context.source.parent ?? [] })))
            .then()
            .gameAction(selectRing((context) => ({
                activePromptTitle: 'Choose a ring to attach Greater Understanding',
                player: Players.Opponent,
                ringCondition: (ring) => ring !== context.source.parent && ring.getFate() === 0,
                subActionProperties: (ring) => ({ attachment: context.source, target: ring }),
                gameAction: attachToRing(),
                message: (context, ring, player) => msg`${player} moves ${context.source} to ${ring} - enlightenment is elusive`
            })));
    }
}
