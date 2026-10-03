import { CardType, Players } from '../../../Constants.js';
import { RingEffects } from '../../../RingEffects.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class TogashiNaname extends DrawCard {
    static id = 'togashi-naname';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cannotReceiveDishonorToken()
        });

        this.action('Remove fate or resolve a ring')
            .condition((context) => context.source.isParticipating())
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && card.fate > 0
            })
            .ringTarget('ring', {
                dependsOn: 'character',
                ringCondition: (ring) => ring.isUnclaimed()
            })
            .selectFrom('select', {
                dependsOn: 'ring',
                player: Players.Opponent
            }, (context) => ({
                [`Move a fate from ${context.targets.character?.name ?? ''} to the ${RingEffects.getRingName(
                    context.rings.ring.element
                )}`]: AbilityDsl.actions.placeFateOnRing((context) => ({
                    target: context.rings.ring,
                    origin: context.targets.character
                })),
                [`Let Opponent Resolve the ${RingEffects.getRingName(context.rings.ring.element)}`]:
                            AbilityDsl.actions.resolveRingEffect((context) => ({
                                player: context.player,
                                target: context.rings.ring
                            }))
            }));
    }
}
