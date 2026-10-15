import type { Element } from '../../Constants.js';
import { RoleCard } from '../../RoleCard.js';

export function createKeeperRole(id: string, element: Element) {
    return class KeeperRole extends RoleCard {
        static id = id;

        setupCardAbilities() {
            this.reaction('Gain 1 fate')
                .when({
                    afterConflict: (event, context) =>
                        event.conflict.elements.some((el) => this.hasTrait(el)) &&
                        event.conflict.winner === context.player &&
                        event.conflict.defendingPlayer === context.player
                })
                .gainFate();
        }

        getElement(): Element[] {
            return [element];
        }
    };
}

export function createSeekerRole(id: string, element: Element) {
    return class SeekerRole extends RoleCard {
        static id = id;

        setupCardAbilities() {
            this.reaction('Gain 1 fate')
                .when({
                    onCardRevealed: (event, context) =>
                        event.card.controller === context.player &&
                        event.card.isProvinceCard() &&
                        event.card.getElement().some((element: string) => context.source.hasTrait(element))
                })
                .gainFate();
        }

        getElement(): Element[] {
            return [element];
        }
    };
}
