import DrawCard from '../../drawcard.js';
import { TargetModes, CardTypes } from '../../Constants.js';
import CardAbility from '../../CardAbility.js';
import AbilityDsl from '../../abilitydsl.js';

class Banzai extends DrawCard {
    static id = 'banzai';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Increase a character\'s military skill',

            max: AbilityDsl.limit.perConflict(1),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(2)
                }))
            },
            effect: 'grant 2 military skill to {0}',
            then: context => {
                if(!context) {
                    return {};
                }
                const ctx = context;
                if(ctx.subResolution) {
                    return {
                        target: {
                            mode: TargetModes.Select,
                            choices: {
                                'Lose 1 honor for no effect': AbilityDsl.actions.loseHonor({target: ctx.player }),
                                'Done': () => true
                            }
                        },
                        message: '{0} chooses {3}to lose an honor for no effect',
                        messageArgs: (innerContext: any) => innerContext.select === 'Done' ? 'not ' : ''
                    };
                }
                const cardAbility = ctx.ability instanceof CardAbility ? ctx.ability : undefined;
                return {
                    target: {
                        mode: TargetModes.Select,
                        choices: {
                            'Lose 1 honor to resolve this ability again': AbilityDsl.actions.loseHonor({target: ctx.player }),
                            'Done': () => true
                        }
                    },
                    message: '{0} chooses {3}to lose an honor to resolve {1} again',
                    messageArgs: (innerContext: any) => innerContext.select === 'Done' ? 'not ' : '',
                    then: cardAbility ? {
                        gameAction: AbilityDsl.actions.resolveAbility({
                            ability: cardAbility,
                            subResolution: true,
                            choosingPlayerOverride: ctx.choosingPlayerOverride ?? undefined
                        })
                    } : undefined
                };
            }
        });
    }
}


export default Banzai;
