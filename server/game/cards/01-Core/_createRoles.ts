import { elementTrait } from '../../Constants.js';
import { RoleCard } from '../../RoleCard.js';

export function createKeeperRole(id: string) {
    return class KeeperRole extends RoleCard {
        static id = id;

        override setupCardAbilities() {
            this.reaction('Gain 1 fate')
                .when({
                    afterConflict: (event, context) =>
                        event.conflict.elements.some((el) => this.hasTrait(elementTrait(el))) &&
                        event.conflict.winner === context.player &&
                        event.conflict.defendingPlayer === context.player
                })
                .gainFate();
        }
    };
}

export function createSeekerRole(id: string) {
    return class SeekerRole extends RoleCard {
        static id = id;

        override setupCardAbilities() {
            this.reaction('Gain 1 fate')
                .when({
                    onCardRevealed: (event, context) =>
                        event.card.controller === context.player &&
                        event.card.isProvinceCard() &&
                        event.card.getElement().some((element) => context.source.hasTrait(elementTrait(element)))
                })
                .gainFate();
        }
    };
}
