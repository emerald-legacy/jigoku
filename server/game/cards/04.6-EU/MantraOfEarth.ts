import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

export default class MantraOfEarth extends DrawCard {
    static id = 'mantra-of-earth';

    setupCardAbilities() {
        this.reaction({
            title: 'Make a monk untargetable by opponents\' card effects and draw a card',
            when: {
                onConflictDeclared: (event: any, context: any) =>
                    event.ring?.hasElement('earth' as any) && event.conflict.attackingPlayer === context.player.opponent
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) =>
                    card.hasTrait('monk') || card.attachments.some((card: any) => card.hasTrait('monk')),
                gameAction: AbilityDsl.actions.cardLastingEffect((context: any) => ({
                    effect: AbilityDsl.effects.cardCannot({
                        cannot: 'target',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    })
                }))
            },
            effect: 'make {0} untargetable by opponents\' card effects and draw a card',
            gameAction: AbilityDsl.actions.draw()
        });
    }
}
