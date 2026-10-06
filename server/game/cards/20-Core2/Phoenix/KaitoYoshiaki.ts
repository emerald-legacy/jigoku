import { CardType } from '../../../Constants.js';
import { setBaseMilitarySkill, setBasePoliticalSkill } from '../../../effects.js';
import { cardLastingEffect, conditional, multiple, noAction, removeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';

function isEvil(character: BaseCard): boolean {
    return character.isTainted || character.hasTrait('shadowlands');
}

export default class KaitoYoshiaki extends DrawCard {
    static id = 'kaito-yoshiaki';

    setupCardAbilities() {
        this.action('Punish the wicked')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card !== context.source &&
                    card.isParticipating() &&
                    context.game.requireConflict()
                        .getCharacters(context.player)
                        .some((myCard) => (myCard.printedCost ?? 0) >= (card.printedCost ?? 0))
            }, multiple([
                cardLastingEffect({
                    effect: [
                        setBaseMilitarySkill(0),
                        setBasePoliticalSkill(0)
                    ]
                }),
                conditional({
                    condition: (context) => !!context.target && isEvil(context.target),
                    trueGameAction: removeFate(),
                    falseGameAction: noAction()
                })
            ]))
            .effect('{3}set the base skills of {0} to 0{1}/0{2}', (context) => ['military', 'political', isEvil(context.target) ? 'remove a fate from and ' : '']);
    }
}
