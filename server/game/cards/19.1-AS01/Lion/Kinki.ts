import { CardType, Players, ConflictType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { removeFate, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class Kinki extends DrawCard {
    static id = 'kinki';

    public setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.conflictAction('Remove a fate from or move home a character', { conflictType: ConflictType.Military })
            .cost(costs.sacrificeSelf())
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Remove a fate from this character': removeFate((context) => ({
                    target: context.targets.character
                })),
                'Move this character home': sendHome((context) => ({
                    target: context.targets.character
                }))
            })
            .max(perRound(1));
    }
}
