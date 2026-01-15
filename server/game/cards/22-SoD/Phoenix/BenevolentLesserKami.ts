import { TargetModes, Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class BenevolentLesserKami extends DrawCard {
    static id = 'benevolent-lesser-kami';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating() && context.game.currentConflict.elements.some(element => context.source.hasTrait(element)),
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });

        this.action({
            title: 'Gain an elemental trait',
            condition: context => context.source.isParticipating(),
            targets: {
                select: {
                    mode: TargetModes.Select,
                    choices: {
                        'Air': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.source,
                            duration: Durations.UntilEndOfRound,
                            effect: AbilityDsl.effects.addTrait('air')
                        })),
                        'Earth': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.source,
                            duration: Durations.UntilEndOfRound,
                            effect: AbilityDsl.effects.addTrait('earth')
                        })),
                        'Fire': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.source,
                            duration: Durations.UntilEndOfRound,
                            effect: AbilityDsl.effects.addTrait('fire')
                        })),
                        'Water': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.source,
                            duration: Durations.UntilEndOfRound,
                            effect: AbilityDsl.effects.addTrait('water')
                        })),
                        'Void': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.source,
                            duration: Durations.UntilEndOfRound,
                            effect: AbilityDsl.effects.addTrait('void')
                        }))

                    }
                }
            },
            effect: 'gain the {1} trait',
            effectArgs: context => [context.selects.select.choice]
        });

        this.action({
            title: 'Shuffle into deck',
            gameAction: AbilityDsl.actions.returnToDeck(context => ({
                target: context.source,
                shuffle: true
            }))
        });
    }
}
