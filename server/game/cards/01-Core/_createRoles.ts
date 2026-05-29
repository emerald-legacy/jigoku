import type { Elements } from '../../Constants.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { RoleCard } from '../../RoleCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type { Conflict } from '../../Conflict.js';

export function createKeeperRole(id: string, element: Elements) {
    return class KeeperRole extends RoleCard {
        static id = id;

        setupCardAbilities() {
            this.reaction({
                title: 'Gain 1 fate',
                when: {
                    afterConflict: (event, context) =>
                        (event.conflict as Conflict).elements.some((el) => this.hasTrait(el)) &&
                        event.conflict.winner === context.player &&
                        event.conflict.defendingPlayer === context.player
                },
                gameAction: AbilityDsl.actions.gainFate()
            });
        }

        getElement(): Elements[] {
            return [element];
        }
    };
}

export function createSeekerRole(id: string, element: Elements) {
    return class SeekerRole extends RoleCard {
        static id = id;

        setupCardAbilities() {
            this.reaction({
                title: 'Gain 1 fate',
                when: {
                    onCardRevealed: (event, context) =>
                        event.card.controller === context.player &&
                        event.card.isProvince &&
                        (event.card as ProvinceCard).getElement().some((element: string) => context.source.hasTrait(element))
                },
                gameAction: AbilityDsl.actions.gainFate()
            });
        }

        getElement(): Elements[] {
            return [element];
        }
    };
}
