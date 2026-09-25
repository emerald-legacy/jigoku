import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class Kinki extends DrawCard {
    static id = 'kinki';

    public setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Remove a fate from or move home a character')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition((context) =>
                !!(context.game.isDuringConflict('military') &&
                context.source.parentCharacter &&
                context.source.parentCharacter.isParticipating()))
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            })
            .select('select', {
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Remove a fate from this character': AbilityDsl.actions.removeFate((context) => ({
                    target: context.targets.character
                })),
                'Move this character home': AbilityDsl.actions.sendHome((context) => ({
                    target: context.targets.character
                }))
            })
            .max(AbilityDsl.limit.perRound(1));
    }
}
