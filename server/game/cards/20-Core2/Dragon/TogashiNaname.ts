import { CardType, Players, TargetMode } from '../../../Constants.js';
import { RingEffects } from '../../../RingEffects.js';
import type Ring from '../../../Ring.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class TogashiNaname extends DrawCard {
    static id = 'togashi-naname';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
        });

        this.action({
            title: 'Remove fate or resolve a ring',
            condition: (context) => context.source.isParticipating(),
            targets: {
                character: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card: DrawCard) => card.isParticipating() && card.fate > 0
                },
                ring: {
                    dependsOn: 'character',
                    mode: TargetMode.Ring,
                    ringCondition: (ring) => ring.isUnclaimed()
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'ring',
                    player: Players.Opponent,
                    choices: (context) => ({
                        [`Move a fate from ${(context.targets.character as DrawCard).name} to the ${RingEffects.getRingName(
                            (context.rings.ring as Ring).element
                        )}`]: AbilityDsl.actions.placeFateOnRing((context) => ({
                            target: context.rings.ring,
                            origin: context.targets.character
                        })),
                        [`Let Opponent Resolve the ${RingEffects.getRingName((context.rings.ring as Ring).element)}`]:
                            AbilityDsl.actions.resolveRingEffect((context) => ({
                                player: context.player,
                                target: context.rings.ring
                            }))
                    })
                }
            }
        });
    }
}
