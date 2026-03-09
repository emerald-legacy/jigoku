import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class CaretakerOfTheDeadEyes extends DrawCard {
    static id = 'caretaker-of-the-dead-eyes';

    setupCardAbilities() {
        this.interrupt({
            title: 'Honor a character',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.hasTrait('bushi')
            },
            gameAction: AbilityDsl.actions.multipleContext(context => {
                const card = (context as any).event.card;
                const gameActions = [];
                if (card) {
                    if (card.isDishonored) {
                        gameActions.push(AbilityDsl.actions.honor({ target: card }));
                    }
                    if (card.hasTrait('berserker')) {
                        gameActions.push(AbilityDsl.actions.cardLastingEffect({
                            target: card,
                            effect: AbilityDsl.effects.addKeyword('courtesy'),
                            message: 'give Courtesy to {0}'
                        }));
                    }
                }

                return { gameActions };
            })
        });
    }
}
