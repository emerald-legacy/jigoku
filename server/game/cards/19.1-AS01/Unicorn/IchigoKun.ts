import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyGlory, modifyMilitarySkill, setBaseMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, chooseAction, multiple } from '../../../GameActions/GameActions.js';
import { CardType, Element, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const VULNERABLE_ELEMENT = 'ichigo-kun-fire';

const MORE_MIL_LESS_GLORY = 'Increase own military, reduce other glory';
const LESS_MIL_MORE_GLORY = 'Reduce own military, increase other glory';

export default class IchigoKun extends DrawCard {
    static id = 'ichigo-kun';

    public override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.game.currentConflict?.hasElement(this.getCurrentElementSymbol(VULNERABLE_ELEMENT)) ?? false,
            effect: setBaseMilitarySkill(0)
        });

        this.conflictAction('Modify military skill and glory', { evenFromHome: true })
            .target({
                name: 'otherCharacter',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            })
            .moveToConflict()
            .chatText((context) => msg`move ${context.source} to the conflict`)
            .afterwards()
            .gameAction(chooseAction((context) => ({
                choices: {
                    [MORE_MIL_LESS_GLORY]: {
                        action: this.getModifiers(context, { military: +2, glory: -2 }),
                        message: (_context, _target, player) =>
                            msg`${player} chooses to give ${context.source} +2 ${'military'} and ${context.targets.otherCharacter} -2 glory - ${context.source} is wild today`
                    },
                    [LESS_MIL_MORE_GLORY]: {
                        action: this.getModifiers(context, { military: -2, glory: +2 }),
                        message: (_context, _target, player) =>
                            msg`${player} chooses to give ${context.source} -2 ${'military'} and ${context.targets.otherCharacter} +2 glory - ${context.source} is well-behaved. Impressive`
                    }
                }
            })));
    }

    public override getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({ key: VULNERABLE_ELEMENT, prettyName: 'Restricted Ring', element: Element.Fire });
        return symbols;
    }

    private getModifiers(context: AbilityContext, modifiers: { military: number; glory: number }) {
        return multiple([
            cardLastingEffect({
                target: context.source,
                effect: modifyMilitarySkill(modifiers.military)
            }),
            cardLastingEffect({
                target: context.targets.otherCharacter,
                effect: modifyGlory(modifiers.glory)
            })
        ]);
    }
}
