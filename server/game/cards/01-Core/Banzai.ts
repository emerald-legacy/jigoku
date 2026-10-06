import DrawCard from '../../DrawCard.js';
import { TargetMode, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect, loseHonor } from '../../GameActions/GameActions.js';
import { resolveAbilityAgain } from '../resolveAgain.js';

class Banzai extends DrawCard {
    static id = 'banzai';

    setupCardAbilities() {
        this.action('Increase a character\'s military skill')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyMilitarySkill(2)
            }))
            .effect('grant 2 military skill to {0}')
            .then((ctx) => {
                if(ctx.subResolution) {
                    return {
                        target: {
                            mode: TargetMode.Select,
                            choices: {
                                'Lose 1 honor for no effect': loseHonor({target: ctx.player }),
                                'Done': () => true
                            }
                        },
                        message: '{0} chooses {3}to lose an honor for no effect',
                        messageArgs: (innerContext) => [innerContext.select === 'Done' ? 'not ' : '']
                    };
                }
                return {
                    target: {
                        mode: TargetMode.Select,
                        choices: {
                            'Lose 1 honor to resolve this ability again': loseHonor({target: ctx.player }),
                            'Done': () => true
                        }
                    },
                    message: '{0} chooses {3}to lose an honor to resolve {1} again',
                    messageArgs: (innerContext) => [innerContext.select === 'Done' ? 'not ' : ''],
                    then: {
                        gameAction: resolveAbilityAgain(ctx)
                    }
                };
            })
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default Banzai;
