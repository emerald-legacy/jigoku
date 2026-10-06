import type { Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { placeFateOnRing } from '../../GameActions/GameActions.js';
import { isRingClaimed } from '../claimedRings.js';

export function makeTempleOfFortuneX(id: string, element: Element) {
    const elementKeys = [`${id}-${element}-0`, `${id}-${element}-1`];

    return class TempleOfFortuneX extends ProvinceCard {
        static id = id;

        setupCardAbilities() {
            this.persistentEffect({
                condition: () => isRingClaimed(this, elementKeys[0]),
                effect: modifyProvinceStrength(2)
            });

            this.forcedReaction('Place one fate on the unclaimed ring')
                .when({
                    onConflictDeclared: (event, context) =>
                        event.conflict.declaredProvince === context.source &&
                        context.game.rings[this.getCurrentElementSymbol(elementKeys[1])].isUnclaimed()
                })
                .gameAction(placeFateOnRing((context) => ({
                    target: context.game.rings[this.getCurrentElementSymbol(elementKeys[1])]
                })));
        }

        getPrintedElementSymbols() {
            const symbols = super.getPrintedElementSymbols();
            symbols.push({ element, key: elementKeys[0], prettyName: 'Strength Bonus' });
            symbols.push({ element, key: elementKeys[1], prettyName: 'Fate Ring' });
            return symbols;
        }
    };
}
