import { CardType, Players } from '../../../Constants.js';
import { cannotReceiveDishonorToken } from '../../../effects.js';
import { placeFateOnRing, resolveRingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class TogashiNaname extends DrawCard {
    static id = 'togashi-naname';

    public override setupCardAbilities() {
        this.persistentEffect({
            effect: cannotReceiveDishonorToken()
        });

        this.conflictAction('Remove fate or resolve a ring')
            .target({
                name: 'character',
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    !!context.player.opponent && card.isParticipatingFor(context.player.opponent) && card.fate > 0
            })
            .ringTarget({
                name: 'ring',
                dependsOn: 'character',
                ringCondition: (ring) => ring.isUnclaimed()
            })
            .selectFrom({
                name: 'select',
                dependsOn: 'ring',
                player: (context) => context.targets.character?.controller === context.player ? Players.Self : Players.Opponent
            }, (context) => ({
                [`Move a fate from ${context.targets.character?.name ?? ''} to the ${context.rings.ring.name}`]: placeFateOnRing((context) => ({
                    target: context.rings.ring,
                    origin: context.targets.character
                })),
                [`Let Opponent Resolve the ${context.rings.ring.name}`]:
                            resolveRingEffect((context) => ({
                                player: context.player,
                                target: context.rings.ring
                            }))
            }));
    }
}
