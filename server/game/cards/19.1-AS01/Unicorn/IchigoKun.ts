import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyGlory, modifyMilitarySkill, setBaseMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, moveToConflict, multiple, sequential } from '../../../GameActions/GameActions.js';
import { CardType, Element, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const VULNERABLE_ELEMENT = 'ichigo-kun-fire';

const MORE_MIL_LESS_GLORY = 'Increase own military, reduce other glory';
const LESS_MIL_MORE_GLORY = 'Reduce own military, increase other glory';

export default class IchigoKun extends DrawCard {
    static id = 'ichigo-kun';

    public setupCardAbilities() {
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
            .selectFrom({
                name: 'select',
                dependsOn: 'otherCharacter'
            }, (context) => ({
                [MORE_MIL_LESS_GLORY]: this.actionSequence(context, { military: +2, glory: -2 }),
                [LESS_MIL_MORE_GLORY]: this.actionSequence(context, { military: -2, glory: +2 })
            }))
            .effect('give {0} {1} {2} and {3} {4} glory - {0} {5}', (context) =>
                context.selects.select.choice === MORE_MIL_LESS_GLORY
                    ? ['+2', 'military', context.targets.otherCharacter, '-2', 'is wild today']
                    : ['-2', 'military', context.targets.otherCharacter, '+2', 'is well-behaved. Impressive']);
    }

    public getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({ key: VULNERABLE_ELEMENT, prettyName: 'Restricted Ring', element: Element.Fire });
        return symbols;
    }

    private actionSequence(context: AbilityContext, modifiers: { military: number; glory: number }) {
        return sequential([
            moveToConflict({ target: context.source }),
            multiple([
                cardLastingEffect({
                    target: context.source,
                    effect: modifyMilitarySkill(modifiers.military)
                }),
                cardLastingEffect({
                    target: context.targets.otherCharacter,
                    effect: modifyGlory(modifiers.glory)
                })
            ])
        ]);
    }
}
