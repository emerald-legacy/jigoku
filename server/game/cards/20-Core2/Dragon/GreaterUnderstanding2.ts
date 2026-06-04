import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import Ring from '../../../Ring.js';

export default class GreaterUnderstanding extends DrawCard {
    static id = 'greater-understanding-2';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Any,
            effect: AbilityDsl.effects.immunity({
                restricts: 'opponentsCardEffects'
            })
        });

        this.reaction({
            when: {
                onMoveFate: (event, context) => event.recipient === context.source.parent,
                onPlaceFateOnUnclaimedRings: (event, context) => context.source.parent instanceof Ring && context.source.parent.isUnclaimed()
            },
            title: 'Resolve the attached ring\'s effect',
            gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({ target: context.source.parent })),
            then: (context) => ({
                gameAction: AbilityDsl.actions.selectRing({
                    activePromptTitle: 'Choose a ring to attach Greater Understanding',
                    player: Players.Opponent,
                    ringCondition: (ring) => ring !== (context?.source.parent as unknown) && ring.getFate() === 0,
                    subActionProperties: (ring) => ({ attachment: context?.source, target: ring }),
                    gameAction: AbilityDsl.actions.attachToRing(),
                    message: '{0} moves {1} to {2} - enlightenment is elusive',
                    messageArgs: (ring, player) => [player, context?.source, ring]
                })
            })
        });
    }

    canAttach(ring: BaseCard | Ring) {
        return ring?.type === 'ring';
    }

    canPlayOn(source: BaseCard | Ring) {
        return source && source.getType() === 'ring' && this.getType() === CardType.Attachment;
    }

    mustAttachToRing() {
        return true;
    }
}
