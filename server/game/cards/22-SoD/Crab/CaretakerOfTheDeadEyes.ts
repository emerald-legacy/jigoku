import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class CaretakerOfTheDeadEyes extends DrawCard {
    static id = 'caretaker-of-the-dead-eyes';

    setupCardAbilities() {
        this.interrupt({
            title: 'Honor a character',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.hasTrait('berserker') && event.card.isDishonored
            },
            gameAction: AbilityDsl.actions.honor((context) => ({ target: (context as any).event.card }))
        });
    }
}
