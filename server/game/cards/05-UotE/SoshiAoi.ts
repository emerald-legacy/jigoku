import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Players, TargetMode, CardType } from '../../Constants.js';

class SoshiAoi extends DrawCard {
    static id = 'soshi-aoi';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Give a character +1/+0 and the Bushi trait or +0/+1 and the Courtier trait',
            cost: ability.costs.payHonor(1),
            targets: {
                character: {
                    cardType: CardType.Character,
                    controller: Players.Self
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    choices: {
                        'Give +1/+0 and the Bushi trait': ability.actions.cardLastingEffect((context: AbilityContext) => ({
                            target: context.targets.character,
                            duration: Duration.UntilEndOfPhase,
                            effect: [ability.effects.modifyMilitarySkill(1),
                                ability.effects.addTrait('bushi')]
                        })),
                        'Give +0/+1 and the Courtier trait': ability.actions.cardLastingEffect((context: AbilityContext) => ({
                            target: context.targets.character,
                            duration: Duration.UntilEndOfPhase,
                            effect: [ability.effects.modifyPoliticalSkill(1),
                                ability.effects.addTrait('courtier')]
                        }))
                    }
                }
            },
            effect: '{1}{2}',
            effectArgs: context => {
                if(context.selects.select.choice === 'Give +1/+0 and the Bushi trait') {
                    return ['give +1/+0 and the bushi trait to ', context.targets.character];
                }
                return ['give +0/+1 and the courtier trait to ', context.targets.character];
            }
        });
    }
}


export default SoshiAoi;
