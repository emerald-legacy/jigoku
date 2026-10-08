import { msg } from '../../../GameChat.js';
import { CardType } from '../../../Constants.js';
import { setBaseMilitarySkill, setBasePoliticalSkill } from '../../../effects.js';
import { cardLastingEffect, removeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';

function isEvil(character: BaseCard): boolean {
    return character.isTainted || character.hasTrait('shadowlands');
}

export default class KaitoYoshiaki extends DrawCard {
    static id = 'kaito-yoshiaki';

    setupCardAbilities() {
        this.conflictAction('Punish the wicked')
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card !== context.source &&
                    card.isParticipating() &&
                    context.game.requireConflict()
                        .getCharacters(context.player)
                        .some((myCard) => (myCard.printedCost ?? 0) >= (card.printedCost ?? 0))
            }, cardLastingEffect({
                effect: [
                    setBaseMilitarySkill(0),
                    setBasePoliticalSkill(0)
                ]
            }))
            .if((context) => !!context.target && isEvil(context.target))
            .gameAction(removeFate())
            .chatText((context) => msg`${isEvil(context.target) ? 'remove a fate from and ' : ''}set the base skills of ${context.chatTarget()} to 0${'military'}/0${'political'}`);
    }
}
