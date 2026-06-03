import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Duration, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class InLadyDojisService extends DrawCard {
    static id = 'in-lady-doji-s-service';

    setupCardAbilities() {
        this.action({
            title: 'Pacify a character',
            max: AbilityDsl.limit.perRound(1),
            cost: AbilityDsl.costs.bow({ cardType: CardType.Character }),
            targets: {
                character: {
                    cardType: CardType.Character,
                    controller: Players.Any
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    choices: {
                        'Prevent Attacking': AbilityDsl.actions.cardLastingEffect((context) => ({
                            target: context.targets.character,
                            duration: Duration.UntilEndOfPhase,
                            effect: [AbilityDsl.effects.cardCannot('declareAsAttacker')]
                        })),
                        'Prevent Defending': AbilityDsl.actions.cardLastingEffect((context) => ({
                            target: context.targets.character,
                            duration: Duration.UntilEndOfPhase,
                            effect: [AbilityDsl.effects.cardCannot('declareAsDefender')]
                        }))
                    }
                }
            },
            effect: 'prevent {1} from being declared as {2} this phase',
            effectArgs: (context) => [
                context.targets.character,
                context.selects.select.choice === 'Prevent Attacking' ? 'an attacker' : 'a defender'
            ]
        });
    }
}
