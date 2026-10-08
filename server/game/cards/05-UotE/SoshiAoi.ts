import * as costs from '../../costs/index.js';
import { addTrait, modifyMilitarySkill, modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Players, CardType } from '../../Constants.js';

class SoshiAoi extends DrawCard {
    static id = 'soshi-aoi';

    setupCardAbilities() {
        this.action('Give a character +1/+0 and the Bushi trait or +0/+1 and the Courtier trait')
            .cost(costs.payHonor(1))
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Self
            })
            .select({
                name: 'select',
                dependsOn: 'character'
            }, {
                'Give +1/+0 and the Bushi trait': cardLastingEffect((context) => ({
                    target: context.targets.character,
                    duration: Duration.UntilEndOfPhase,
                    effect: [modifyMilitarySkill(1),
                        addTrait('bushi')]
                })),
                'Give +0/+1 and the Courtier trait': cardLastingEffect((context) => ({
                    target: context.targets.character,
                    duration: Duration.UntilEndOfPhase,
                    effect: [modifyPoliticalSkill(1),
                        addTrait('courtier')]
                }))
            })
            .chatText('{1}{2}', (context) => {
                if(context.selects.select.choice === 'Give +1/+0 and the Bushi trait') {
                    return ['give +1/+0 and the bushi trait to ', context.targets.character];
                }
                return ['give +0/+1 and the courtier trait to ', context.targets.character];
            });
    }
}


export default SoshiAoi;
