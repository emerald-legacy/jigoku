import { CardType, Players } from '../../../Constants.js';
import { RingAbilities } from '../../../RingAbilities.js';
import { cannotReceiveDishonorToken } from '../../../effects.js';
import { placeFateOnRing, resolveRingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class TogashiNaname extends DrawCard {
    static id = 'togashi-naname';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: cannotReceiveDishonorToken()
        });

        this.conflictAction('Remove fate or resolve a ring')
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && card.fate > 0
            })
            .ringTarget({
                name: 'ring',
                dependsOn: 'character',
                ringCondition: (ring) => ring.isUnclaimed()
            })
            .selectFrom({
                name: 'select',
                dependsOn: 'ring',
                player: Players.Opponent
            }, (context) => ({
                [`Move a fate from ${context.targets.character?.name ?? ''} to the ${RingAbilities.getRingName(
                    context.rings.ring.element
                )}`]: placeFateOnRing((context) => ({
                    target: context.rings.ring,
                    origin: context.targets.character
                })),
                [`Let Opponent Resolve the ${RingAbilities.getRingName(context.rings.ring.element)}`]:
                            resolveRingEffect((context) => ({
                                player: context.player,
                                target: context.rings.ring
                            }))
            }));
    }
}
