import { CardType, type Element, Trait } from '../Constants.js';
import DrawCard from '../DrawCard.js';
import type { GameAction } from '../GameActions/GameAction.js';

/** After an opponent declares a conflict of `element`, choose a Monk character or a character with a Monk attachment – apply `effect` to it and draw 1 card. */
export function makeMantra(id: string, element: Element, title: string, effect: GameAction, chatText: string) {
    return class Mantra extends DrawCard {
        static id = id;

        setupCardAbilities() {
            this.reaction(title)
                .when({
                    onConflictDeclared: (event, context) =>
                        !!event.ring?.hasElement(element) && event.conflict.attackingPlayer === context.player.opponent
                })
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card) =>
                        card.hasTrait(Trait.Monk) || card.attachments.some((attachment) => attachment.hasTrait(Trait.Monk))
                }, effect)
                .draw()
                .chatText(chatText);
        }
    };
}
