import { Duration } from '../../../Constants.js';
import { addTrait, modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect, returnToDeck } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class BenevolentLesserKami extends DrawCard {
    static id = 'benevolent-lesser-kami';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating() &&
                (context.game.currentConflict?.getConflictProvinces() ?? []).some(
                    (province) => province.element.some((element) => context.source.hasTrait(element))
                ),
            effect: modifyBothSkills(1)
        });

        this.conflictAction('Gain an elemental trait')
            .select({ name: 'select' }, {
                'Air': cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: addTrait('air')
                }),
                'Earth': cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: addTrait('earth')
                }),
                'Fire': cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: addTrait('fire')
                }),
                'Water': cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: addTrait('water')
                }),
                'Void': cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: addTrait('void')
                })
            })
            .effect((context) => msg`gain the ${context.selects.select.choice} trait`);

        this.action('Shuffle into deck')
            .gameAction(returnToDeck({
                shuffle: true
            }));
    }
}
