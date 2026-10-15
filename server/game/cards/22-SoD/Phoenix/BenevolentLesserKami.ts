import { Duration, Trait, elementTrait } from '../../../Constants.js';
import { addTrait, modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class BenevolentLesserKami extends DrawCard {
    static id = 'benevolent-lesser-kami';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating() &&
                (context.game.currentConflict?.getConflictProvinces() ?? []).some(
                    (province) => province.element.some((element) => context.source.hasTrait(elementTrait(element)))
                ),
            effect: modifyBothSkills(1)
        });

        this.conflictAction('Gain an elemental trait')
            .select({ name: 'select' }, {
                'Air': cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: addTrait(Trait.Air)
                }),
                'Earth': cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: addTrait(Trait.Earth)
                }),
                'Fire': cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: addTrait(Trait.Fire)
                }),
                'Water': cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: addTrait(Trait.Water)
                }),
                'Void': cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: addTrait(Trait.Void)
                })
            })
            .chatText((context) => msg`gain the ${context.selects.select.choice} trait`);

        this.action('Shuffle into deck')
            .returnToDeck({
                shuffle: true
            });
    }
}
