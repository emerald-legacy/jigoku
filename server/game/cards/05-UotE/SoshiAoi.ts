import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Players, CardType } from '../../Constants.js';

class SoshiAoi extends DrawCard {
    static id = 'soshi-aoi';

    setupCardAbilities() {
        this.action('Give a character +1/+0 and the Bushi trait or +0/+1 and the Courtier trait')
            .cost(AbilityDsl.costs.payHonor(1))
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Self
            })
            .select('select', {
                dependsOn: 'character'
            }, {
                'Give +1/+0 and the Bushi trait': AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.targets.character,
                    duration: Duration.UntilEndOfPhase,
                    effect: [AbilityDsl.effects.modifyMilitarySkill(1),
                        AbilityDsl.effects.addTrait('bushi')]
                })),
                'Give +0/+1 and the Courtier trait': AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: context.targets.character,
                    duration: Duration.UntilEndOfPhase,
                    effect: [AbilityDsl.effects.modifyPoliticalSkill(1),
                        AbilityDsl.effects.addTrait('courtier')]
                }))
            })
            .effect('{1}{2}', context => {
                if(context.selects.select.choice === 'Give +1/+0 and the Bushi trait') {
                    return ['give +1/+0 and the bushi trait to ', context.targets.character];
                }
                return ['give +0/+1 and the courtier trait to ', context.targets.character];
            });
    }
}


export default SoshiAoi;
